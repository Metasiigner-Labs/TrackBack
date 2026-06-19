import { writeFileSync, readFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { buildMemberMatchers, matchHonoreeToMember } from "./member-match.mjs";

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

const LD203_BASE = "https://lda.gov/api/v1/contributions/";
const LD203_YEAR = 2024;
const MAX_EVENTS_PER_MEMBER = 25;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function ldaHeaders() {
  const headers = { Accept: "application/json" };
  const apiKey = process.env.LDA_API_KEY?.trim();
  if (apiKey) headers.Authorization = `Token ${apiKey}`;
  return headers;
}

async function fetchLd203Page(page, attempt = 0) {
  const url = new URL(LD203_BASE);
  url.searchParams.set("filing_year", String(LD203_YEAR));
  url.searchParams.set("page_size", "25");
  url.searchParams.set("page", String(page));

  const res = await fetch(url, { headers: ldaHeaders() });
  if (res.status === 429 && attempt < 6) {
    await sleep(2000 * 2 ** attempt);
    return fetchLd203Page(page, attempt + 1);
  }
  if (!res.ok) throw new Error(`LD-203 ${res.status}: ${url}`);
  return res.json();
}

async function fetchAllLd203Filings(cacheDir) {
  mkdirSync(cacheDir, { recursive: true });
  const cacheKey = join(cacheDir, `ld203-${LD203_YEAR}-all.json`);
  const progressKey = join(cacheDir, `ld203-${LD203_YEAR}-progress.json`);

  if (existsSync(cacheKey)) {
    console.log(`  LD-203: cache hit (${cacheKey.split(/[/\\]/).pop()})`);
    return JSON.parse(readFileSync(cacheKey, "utf8"));
  }

  let all = [];
  let page = 1;
  let total = Infinity;

  if (existsSync(progressKey)) {
    const progress = JSON.parse(readFileSync(progressKey, "utf8"));
    all = progress.filings || [];
    page = progress.nextPage || 1;
    total = progress.total || Infinity;
    console.log(`  LD-203: resuming from page ${page} (${all.length} filings so far)...`);
  } else {
    console.log("  LD-203: downloading all 2024 contribution filings from LDA.gov...");
  }

  while (page <= Math.ceil(total / 25) + 1) {
    const data = await fetchLd203Page(page);
    total = data.count ?? total;
    for (const filing of data.results || []) {
      if (!filing.no_contributions && (filing.contribution_items?.length || 0) > 0) {
        all.push(filing);
      }
    }
    if (!data.next) {
      writeFileSync(cacheKey, JSON.stringify(all));
      try {
        unlinkSync(progressKey);
      } catch {
        /* ignore */
      }
      console.log(`  LD-203: cached ${all.length} filings with contribution items`);
      return all;
    }
    page++;
    if (page % 25 === 0) {
      if (page % 50 === 0) {
        console.log(`  LD-203: page ${page}, ${all.length} filings with contributions...`);
      }
      writeFileSync(
        progressKey,
        JSON.stringify({ filings: all, nextPage: page, total, savedAt: new Date().toISOString() })
      );
    }
    await sleep(process.env.LDA_API_KEY ? 300 : 1200);
  }

  writeFileSync(cacheKey, JSON.stringify(all));
  console.log(`  LD-203: cached ${all.length} filings with contribution items`);
  return all;
}

function titleCase(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bPac\b/g, "PAC");
}

export function aggregateLd203ForPoliticians(politicians, filings) {
  const matchers = buildMemberMatchers(politicians);
  const byMember = new Map();

  for (const filing of filings) {
    const lobbyistName = filing.lobbyist
      ? [filing.lobbyist.first_name, filing.lobbyist.middle_name, filing.lobbyist.last_name]
          .filter(Boolean)
          .join(" ")
      : filing.registrant?.name || "Unknown lobbyist";
    const registrant = filing.registrant?.name || "";

    for (const item of filing.contribution_items || []) {
      const honoree = item.honoree_name?.trim();
      if (!honoree) continue;
      const matcher = matchHonoreeToMember(honoree, matchers);
      if (!matcher) continue;

      const amount = parseFloat(item.amount) || 0;
      if (amount <= 0) continue;

      if (!byMember.has(matcher.id)) {
        byMember.set(matcher.id, { events: [], total: 0 });
      }
      const entry = byMember.get(matcher.id);
      entry.total += amount;
      entry.events.push({
        honoreeName: honoree,
        payeeName: titleCase(item.payee_name || lobbyistName),
        lobbyistName: titleCase(lobbyistName),
        registrantName: titleCase(registrant),
        amount,
        date: item.date || filing.dt_posted?.slice(0, 10) || "",
        contributionType: item.contribution_type_display || item.contribution_type || "FECA",
        filingPeriod: filing.filing_period_display || String(LD203_YEAR),
      });
    }
  }

  return byMember;
}

export async function buildLd203DataForPoliticians(politicians, cacheDir) {
  if (process.env.SKIP_LD203_SYNC === "1") {
    console.log("  Skipping LD-203 sync (SKIP_LD203_SYNC=1)");
    return politicians.map((p) => ({
      ...p,
      lobbyistContributions: p.lobbyistContributions || null,
    }));
  }

  const filings = await fetchAllLd203Filings(cacheDir);
  const byMember = aggregateLd203ForPoliticians(politicians, filings);
  let withData = 0;

  const enriched = politicians.map((p) => {
    const entry = byMember.get(p.id);
    if (!entry || entry.events.length === 0) {
      return { ...p, lobbyistContributions: null };
    }

    entry.events.sort((a, b) => b.amount - a.amount || b.date.localeCompare(a.date));
    withData++;
    return {
      ...p,
      lobbyistContributions: {
        total2024: Math.round(entry.total),
        eventCount: entry.events.length,
        events: entry.events.slice(0, MAX_EVENTS_PER_MEMBER),
      },
    };
  });

  console.log(`  LD-203: ${withData} members with lobbyist-linked contributions`);
  return enriched;
}

const isMain = process.argv[1]?.endsWith("ld203-sync.mjs");
if (isMain) {
  const OUT_FILE = join(ROOT, "src", "data", "politicians.json");
  const CACHE = join(ROOT, "scripts", "cache");
  const data = JSON.parse(readFileSync(OUT_FILE, "utf8"));
  const ld203Source = "LDA.gov LD-203 — lobbyist contributions to officials (lda.gov)";
  if (!data.meta.sources.includes(ld203Source)) data.meta.sources.push(ld203Source);

  data.politicians = await buildLd203DataForPoliticians(data.politicians, CACHE);
  data.meta.syncedAt = new Date().toISOString();
  writeFileSync(OUT_FILE, JSON.stringify(data, null, 2));
  console.log("LD-203 enrichment written to politicians.json");
}