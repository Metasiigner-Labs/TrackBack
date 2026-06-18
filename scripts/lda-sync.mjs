import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  KNOWN_LOBBYING_ORGS,
  fecTextMatchesOrg,
  normalizeForMatch,
} from "./lobbying-orgs.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadEnv() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}
loadEnv();

const LDA_BASE = "https://lda.gov/api/v1/filings/";
const LDA_YEAR = 2024;
const SECTOR_EXPOSURE_MIN = 500;
const MAX_ORGS_PER_POLITICIAN = 25;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildMemberMatchers(legislators) {
  return legislators.map((leg) => {
    const parts = (leg.name || "").split(/\s+/).filter(Boolean);
    const lastName = parts.at(-1) || "";
    const firstName = parts[0] || "";
    const lastLower = lastName.toLowerCase();
    const patterns = [
      `sen. ${lastLower}`,
      `senator ${lastLower}`,
      `rep. ${lastLower}`,
      `representative ${lastLower}`,
      `congressman ${lastLower}`,
      `congresswoman ${lastLower}`,
      `${firstName.toLowerCase()} ${lastLower}`,
    ].filter((p) => p.length > 4);
    return {
      id: leg.id,
      name: leg.name,
      lastName,
      patterns,
    };
  });
}

function textMentionsMember(text, matcher) {
  const norm = normalizeForMatch(text);
  if (!norm) return false;
  if (matcher.lastName.length < 5) {
    return matcher.patterns.some((p) => norm.includes(p));
  }
  return matcher.patterns.some((p) => norm.includes(p)) || norm.includes(matcher.lastName.toLowerCase());
}

function ldaHeaders() {
  const headers = { Accept: "application/json" };
  const apiKey = process.env.LDA_API_KEY?.trim();
  if (apiKey) headers.Authorization = `Token ${apiKey}`;
  return headers;
}

async function fetchLdaPage(params, attempt = 0) {
  const url = new URL(LDA_BASE);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, { headers: ldaHeaders() });
  if (res.status === 429 && attempt < 6) {
    const wait = 2000 * 2 ** attempt;
    await sleep(wait);
    return fetchLdaPage(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`LDA ${res.status}: ${url}`);
  return res.json();
}

async function fetchAllFilingsForOrg(org, cacheDir) {
  mkdirSync(cacheDir, { recursive: true });
  const cacheKey = join(cacheDir, `lda-${org.id}-2024.json`);
  if (existsSync(cacheKey)) {
    return JSON.parse(readFileSync(cacheKey, "utf8"));
  }

  const queries = [];
  if (org.ldaRegistrantName) {
    queries.push({ filing_year: LDA_YEAR, registrant_name: org.ldaRegistrantName });
  }
  if (org.ldaClientName) {
    queries.push({ filing_year: LDA_YEAR, client_name: org.ldaClientName });
  }
  if (!queries.length) return [];

  const seen = new Set();
  const all = [];

  for (const baseParams of queries) {
    let page = 1;
    while (true) {
      const data = await fetchLdaPage({ ...baseParams, page_size: 100, page });
      for (const filing of data.results || []) {
        if (!seen.has(filing.filing_uuid)) {
          seen.add(filing.filing_uuid);
          all.push(filing);
        }
      }
      if (!data.next) break;
      page++;
      await sleep(350);
    }
  }

  writeFileSync(cacheKey, JSON.stringify(all));
  return all;
}

function sumLobbyingSpend(filings) {
  return filings.reduce((sum, f) => {
    const income = parseFloat(f.income) || 0;
    const expenses = parseFloat(f.expenses) || 0;
    return sum + Math.max(income, expenses);
  }, 0);
}

function extractIssues(filings) {
  const issues = new Set();
  for (const f of filings) {
    for (const act of f.lobbying_activities || []) {
      if (act.general_issue_code_display) issues.add(act.general_issue_code_display);
    }
  }
  return [...issues].slice(0, 6);
}

function scanFilingsForMembers(filings, matchers) {
  const hits = new Map();
  for (const filing of filings) {
    const chunks = [];
    for (const act of filing.lobbying_activities || []) {
      chunks.push(act.description || "");
      for (const l of act.lobbyists || []) {
        chunks.push(l.covered_position || "");
      }
      for (const ge of act.government_entities || []) {
        chunks.push(typeof ge === "string" ? ge : ge.name || "");
      }
    }
    const blob = chunks.join(" ");
    if (!blob.trim()) continue;

    for (const matcher of matchers) {
      if (!textMentionsMember(blob, matcher)) continue;
      if (!hits.has(matcher.id)) hits.set(matcher.id, []);
      hits.get(matcher.id).push({
        filingPeriod: filing.filing_period_display || filing.filing_year,
        filingType: filing.filing_type_display,
      });
    }
  }
  return hits;
}

function fecDonorMatch(politician, org) {
  for (const d of politician.topDonors || []) {
    if (fecTextMatchesOrg(`${d.name} ${d.industry} ${d.employer || ""}`, org)) {
      return { matched: true, detail: `FEC donor: ${d.name}`, amount: d.amount };
    }
  }
  for (const item of politician.industryBreakdown || []) {
    if (fecTextMatchesOrg(item.label, org)) {
      return { matched: true, detail: `FEC name match: ${item.label}`, amount: item.amount };
    }
  }
  return { matched: false };
}

function sectorExposureMatch(politician, org) {
  const item = (politician.industryBreakdown || []).find(
    (i) => i.label === org.sector && i.amount >= SECTOR_EXPOSURE_MIN
  );
  if (!item) return { matched: false };
  return {
    matched: true,
    detail: `FEC ${org.sector} money: $${Math.round(item.amount).toLocaleString()} (${item.percent}% of classified)`,
    amount: item.amount,
  };
}

function resolveConnection({ fec, lda, sector }) {
  if (fec.matched && lda) return "fec_and_lobbying";
  if (lda && sector.matched) return "lda_and_sector";
  if (fec.matched) return "fec_donor";
  if (lda) return "lda_activity";
  if (sector.matched) return "sector_exposure";
  return "fec_donor";
}

export async function buildLobbyingDataForPoliticians(politicians, cacheDir) {
  if (process.env.SKIP_LDA_SYNC === "1") {
    console.log("  Skipping LDA lobbying sync (SKIP_LDA_SYNC=1)");
    return politicians.map((p) => ({ ...p, lobbyingOrganizations: p.lobbyingOrganizations || [] }));
  }

  console.log(`  LDA: fetching filings for ${KNOWN_LOBBYING_ORGS.length} tracked organizations...`);
  const matchers = buildMemberMatchers(politicians);
  const orgMeta = new Map();
  const memberLdaHits = new Map();
  let ldaFetched = 0;

  for (const org of KNOWN_LOBBYING_ORGS) {
    const hasLda = org.ldaClientName || org.ldaRegistrantName;
    if (!hasLda) {
      orgMeta.set(org.id, { spend: 0, issues: [], filingCount: 0 });
      continue;
    }

    try {
      const filings = await fetchAllFilingsForOrg(org, cacheDir);
      const spend = sumLobbyingSpend(filings);
      const issues = extractIssues(filings);
      orgMeta.set(org.id, { spend, issues, filingCount: filings.length });

      const hits = scanFilingsForMembers(filings, matchers);
      for (const [memberId, refs] of hits) {
        if (!memberLdaHits.has(memberId)) memberLdaHits.set(memberId, new Map());
        memberLdaHits.get(memberId).set(org.id, refs);
      }

      ldaFetched++;
      if (ldaFetched % 10 === 0 || filings.length > 0) {
        console.log(`  LDA [${ldaFetched}]: ${org.label} — ${filings.length} filings, $${Math.round(spend).toLocaleString()}`);
      }
      await sleep(500);
    } catch (err) {
      console.warn(`  LDA: ${org.label} skipped — ${err.message}`);
      orgMeta.set(org.id, { spend: 0, issues: [], filingCount: 0 });
    }
  }

  return politicians.map((p) => {
    const orgs = [];
    const ldaHits = memberLdaHits.get(p.id);

    for (const org of KNOWN_LOBBYING_ORGS) {
      const meta = orgMeta.get(org.id);
      const fec = fecDonorMatch(p, org);
      const sector = fec.matched ? { matched: false } : sectorExposureMatch(p, org);
      const lda = ldaHits?.get(org.id);

      if (!fec.matched && !lda && !sector.matched) continue;

      const connection = resolveConnection({ fec, lda, sector });

      const details = [];
      if (fec.matched) details.push(fec.detail);
      else if (sector.matched) details.push(sector.detail);
      if (lda?.length) {
        details.push(
          `Name referenced in ${lda.length} LDA filing(s) — verify in source filing at LDA.gov`
        );
      }

      // Sector exposure is contextual — don't repeat full sector FEC total per org row
      const fecAmount = fec.matched ? fec.amount || 0 : 0;

      orgs.push({
        id: org.id,
        name: org.label,
        sector: org.sector,
        connection,
        lobbyingSpend2024: meta?.spend || 0,
        filingCount: meta?.filingCount || 0,
        issues: meta?.issues || [],
        detail: details.join(". "),
        fecAmount,
      });
    }

    orgs.sort((a, b) => (b.lobbyingSpend2024 + b.fecAmount) - (a.lobbyingSpend2024 + a.fecAmount));

    return {
      ...p,
      lobbyingOrganizations: orgs.slice(0, MAX_ORGS_PER_POLITICIAN),
      totalLobbyingExposure: orgs.reduce((s, o) => s + (o.lobbyingSpend2024 || 0), 0),
    };
  });
}