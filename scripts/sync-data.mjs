/**
 * TrackBack Data Sync — uses legal public bulk downloads (no scraping)
 * Sources: FEC bulk CSV/ZIP, unitedstates/congress-legislators, GovTrack API
 */

import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  createReadStream,
  statSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { createInterface } from "readline";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { createWriteStream } from "fs";
import { classifySource, isControversialIndustry, INDUSTRY_TAXONOMY } from "./industry-taxonomy.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CACHE = join(ROOT, "scripts", "cache");
const OUT_DIR = join(ROOT, "src", "data");
const OUT_FILE = join(OUT_DIR, "politicians.json");

const CYCLE = 2024;
const PREV_CYCLE = 2022;

const PRO_ISRAEL_SPENDER_PATTERNS =
  INDUSTRY_TAXONOMY.find((t) => t.id === "pro-israel")?.patterns || [];

const TOP_DONOR_LIMIT = 25;
const TOP_IE_LIMIT = 12;

function loadEnv() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}
loadEnv();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function downloadFile(url, dest, minBytes = 100) {
  if (existsSync(dest) && statSync(dest).size >= minBytes) {
    console.log(`  Cache hit: ${dest.split(/[/\\]/).pop()}`);
    return dest;
  }
  console.log(`  Downloading ${url.split("/").pop()}...`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Download failed ${url}: ${res.status}`);
  if (!res.body) throw new Error(`Download failed ${url}: empty body`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return dest;
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

async function loadCandidateSummary(cycle) {
  const url = `https://www.fec.gov/files/bulk-downloads/${cycle}/candidate_summary_${cycle}.csv`;
  const dest = join(CACHE, `candidate_summary_${cycle}.csv`);
  try {
    await downloadFile(url, dest);
  } catch {
    return new Map();
  }
  const text = readFileSync(dest, "utf8");
  const lines = text.split("\n").filter(Boolean);
  const headers = parseCsvLine(lines[0]);
  const map = new Map();

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const row = Object.fromEntries(headers.map((h, idx) => [h, cols[idx] || ""]));
    const candId = row.Cand_Id;
    if (!candId) continue;
    row._cycle = cycle;
    map.set(candId, row);
  }
  return map;
}

function mergeCandidateSummaries(...maps) {
  const merged = new Map();
  for (const map of maps) {
    for (const [candId, row] of map) {
      const receipts = parseFloat(row.Total_Receipt) || 0;
      const existing = merged.get(candId);
      if (!existing || receipts > (parseFloat(existing.Total_Receipt) || 0)) {
        merged.set(candId, row);
      }
    }
  }
  return merged;
}

function unzipFile(zipPath, outDir) {
  mkdirSync(outDir, { recursive: true });
  if (process.platform === "win32") {
    execSync(
      `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${outDir}' -Force"`,
      { stdio: "pipe" }
    );
  } else {
    execSync(`unzip -o "${zipPath}" -d "${outDir}"`, { stdio: "pipe" });
  }
}

function findTxtInDir(dir, preferredName) {
  const preferred = join(dir, preferredName);
  if (existsSync(preferred)) return preferred;
  const files = execSync(`dir /b "${dir}"`, { encoding: "utf8" })
    .trim()
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);
  const txt = files.find((f) => f.endsWith(".txt"));
  if (!txt) throw new Error(`No .txt file in ${dir}`);
  return join(dir, txt);
}

async function loadPas2Contributions() {
  const url =
    "https://www.fec.gov/files/bulk-downloads/2024/pas224.zip";
  const zipDest = join(CACHE, "pas224.zip");
  const extractDir = join(CACHE, "pas224");
  await downloadFile(url, zipDest);
  unzipFile(zipDest, extractDir);

  const txtFile = join(extractDir, "pas224.txt");
  if (!existsSync(txtFile)) {
    const files = execSync(`dir /b "${extractDir}"`, { encoding: "utf8" }).trim().split("\n");
    const txt = files.find((f) => f.endsWith(".txt"));
    if (!txt) throw new Error("pas224.txt not found in archive");
    return loadPas2FromFile(join(extractDir, txt.trim()));
  }
  return loadPas2FromFile(txtFile);
}

async function loadPas2FromFile(filePath) {
  const byCandidate = new Map();
  const rl = createInterface({ input: createReadStream(filePath), crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    const cols = line.split("|");
    if (cols.length < 17) continue;
    const name = cols[7]?.trim();
    const amount = parseFloat(cols[14]) || 0;
    const candId = cols[16]?.trim();
    const entityType = cols[6]?.trim();
    const memoCd = cols[19]?.trim();
    if (!candId || !name || amount <= 0 || memoCd === "X") continue;

    if (!byCandidate.has(candId)) byCandidate.set(candId, new Map());
    const donors = byCandidate.get(candId);
    const key = name.toUpperCase();
    const existing = donors.get(key);
    if (existing) {
      existing.amount += amount;
    } else {
      donors.set(key, {
        name: titleCase(name),
        industry: detectIndustry("", name),
        amount,
        type: entityType === "PAC" || entityType === "PTY" ? "PAC" : entityType === "COM" ? "Corporate" : "PAC",
      });
    }
  }

  const result = new Map();
  for (const [candId, donors] of byCandidate) {
    const list = [...donors.values()].sort((a, b) => b.amount - a.amount).slice(0, TOP_DONOR_LIMIT);
    const pacTotal = [...donors.values()].reduce((s, d) => s + d.amount, 0);
    result.set(candId, { donors: list, pacTotal, allDonors: [...donors.values()] });
  }
  return result;
}

async function loadCclLinkages(targetCandIds) {
  const suffix = String(CYCLE).slice(2);
  const url = `https://www.fec.gov/files/bulk-downloads/${CYCLE}/ccl${suffix}.zip`;
  const zipDest = join(CACHE, `ccl${suffix}.zip`);
  const extractDir = join(CACHE, `ccl${suffix}`);
  await downloadFile(url, zipDest);
  unzipFile(zipDest, extractDir);

  const txtFile = findTxtInDir(extractDir, `ccl${suffix}.txt`);
  const cmteToCands = new Map();
  const rl = createInterface({ input: createReadStream(txtFile), crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    const cols = line.split("|");
    if (cols.length < 4) continue;
    const candId = cols[0]?.trim();
    const fecElectionYr = cols[2]?.trim();
    const cmteId = cols[3]?.trim();
    if (!candId || !cmteId || fecElectionYr !== String(CYCLE)) continue;
    if (!targetCandIds.has(candId)) continue;

    if (!cmteToCands.has(cmteId)) cmteToCands.set(cmteId, new Set());
    cmteToCands.get(cmteId).add(candId);
  }

  console.log(`  ccl: ${cmteToCands.size} committees linked to current members`);
  return cmteToCands;
}

async function loadIndividualContributions(cmteToCands) {
  if (process.env.SKIP_INDIV_SYNC === "1") {
    console.log("  Skipping indiv bulk (SKIP_INDIV_SYNC=1)");
    return new Map();
  }

  const suffix = String(CYCLE).slice(2);
  const url = `https://www.fec.gov/files/bulk-downloads/${CYCLE}/indiv${suffix}.zip`;
  const zipDest = join(CACHE, `indiv${suffix}.zip`);
  const extractDir = join(CACHE, `indiv${suffix}`);

  await downloadFile(url, zipDest, 1_000_000_000);
  console.log("  Extracting indiv archive (large — may take several minutes)...");
  unzipFile(zipDest, extractDir);

  const txtFile = findTxtInDir(extractDir, `itcont${suffix}.txt`);
  const byCandidate = new Map();
  let lineCount = 0;
  const rl = createInterface({ input: createReadStream(txtFile), crlfDelay: Infinity });

  for await (const line of rl) {
    lineCount++;
    if (lineCount % 5_000_000 === 0) {
      console.log(`  indiv: ${(lineCount / 1_000_000).toFixed(1)}M rows processed...`);
    }
    if (!line.trim()) continue;
    const cols = line.split("|");
    if (cols.length < 15) continue;

    const cmteId = cols[0]?.trim();
    const name = cols[7]?.trim();
    const employer = cols[11]?.trim();
    const amount = parseFloat(cols[14]) || 0;
    const memoCd = cols[18]?.trim();
    if (!cmteId || !name || amount <= 0 || memoCd === "X") continue;

    const cands = cmteToCands.get(cmteId);
    if (!cands) continue;

    const sector = classifySource(name, employer);
    const donorKey = `${name}|${employer || ""}`.toUpperCase();

    for (const candId of cands) {
      if (!byCandidate.has(candId)) {
        byCandidate.set(candId, { industries: new Map(), donors: new Map(), total: 0 });
      }
      const entry = byCandidate.get(candId);
      entry.total += amount;

      const existingSector = entry.industries.get(sector.id);
      if (existingSector) {
        existingSector.amount += amount;
        existingSector.sources.add(name);
      } else {
        entry.industries.set(sector.id, {
          id: sector.id,
          label: sector.label,
          amount,
          sources: new Set([name]),
        });
      }

      const existingDonor = entry.donors.get(donorKey);
      if (existingDonor) {
        existingDonor.amount += amount;
      } else {
        entry.donors.set(donorKey, {
          name: titleCase(name),
          industry: sector.label,
          amount,
          type: "Individual",
          employer: employer ? titleCase(employer) : undefined,
        });
      }
    }
  }

  console.log(`  indiv: ${lineCount.toLocaleString()} rows → ${byCandidate.size} candidates with itemized individuals`);
  return byCandidate;
}

function mergeTopDonors(pas2Donors, indivEntry, limit = TOP_DONOR_LIMIT) {
  const all = new Map();

  for (const d of pas2Donors) {
    const key = `PAC|${d.name}`.toUpperCase();
    const existing = all.get(key);
    if (existing) existing.amount += d.amount;
    else all.set(key, { ...d });
  }

  if (indivEntry?.donors) {
    for (const d of indivEntry.donors.values()) {
      const key = `IND|${d.name}|${d.employer || ""}`.toUpperCase();
      const existing = all.get(key);
      if (existing) existing.amount += d.amount;
      else all.set(key, { ...d });
    }
  }

  return [...all.values()].sort((a, b) => b.amount - a.amount).slice(0, limit);
}

function buildIndustryBreakdown({ pas2Donors, outsideSpending, indivEntry, totalDonations }) {
  const sectors = new Map();

  const add = (id, label, amount, sourceName) => {
    if (!sectors.has(id)) sectors.set(id, { id, label, amount: 0, sources: new Set() });
    const s = sectors.get(id);
    s.amount += amount;
    if (sourceName) s.sources.add(sourceName);
  };

  for (const donor of pas2Donors) {
    const sector =
      donor.type === "Individual"
        ? classifySource(donor.name, donor.employer || "")
        : classifySource(donor.name, "");
    add(sector.id, sector.label, donor.amount, donor.name);
  }

  for (const ie of outsideSpending) {
    const sector = classifySource(ie.spender, "");
    add(sector.id, sector.label, ie.amount, ie.spender);
  }

  if (indivEntry?.industries) {
    for (const [, data] of indivEntry.industries) {
      add(data.id, data.label, data.amount, [...data.sources].slice(0, 3).join(", "));
    }
  }

  const sectorTotal = [...sectors.values()].reduce((s, x) => s + x.amount, 0);
  const denom = sectorTotal > 0 ? sectorTotal : totalDonations || 1;

  return [...sectors.values()]
    .map((s) => ({
      id: s.id,
      label: s.label,
      amount: Math.round(s.amount),
      percent: Math.round((s.amount / denom) * 1000) / 10,
      sourceCount: s.sources.size,
    }))
    .filter((s) => s.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

function titleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bPac\b/g, "PAC");
}

function detectIndustry(employer, name) {
  return classifySource(name, employer).label;
}

function detectControversialIndustries(donors, outsideSpending = [], industryBreakdown = []) {
  const found = new Set();
  for (const d of donors) {
    if (isControversialIndustry(d.industry)) found.add(d.industry);
  }
  for (const s of outsideSpending) {
    const label = classifySource(s.spender, "").label;
    if (isControversialIndustry(label)) found.add(label);
  }
  for (const item of industryBreakdown) {
    if (isControversialIndustry(item.label)) found.add(item.label);
  }
  return [...found];
}

async function loadIndependentExpenditures() {
  const url = "https://www.fec.gov/files/bulk-downloads/2024/independent_expenditure_2024.csv";
  const dest = join(CACHE, "independent_expenditure_2024.csv");
  await downloadFile(url, dest);

  const text = readFileSync(dest, "utf8");
  const lines = text.split("\n").filter(Boolean);
  const headers = parseCsvLine(lines[0]);
  const byCandidate = new Map();

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const row = Object.fromEntries(headers.map((h, idx) => [h, (cols[idx] || "").replace(/^"|"$/g, "")]));
    const candId = row.cand_id;
    const spender = row.spe_nam?.trim();
    const amount = parseFloat(row.exp_amo) || 0;
    const position = row.sup_opp === "O" ? "oppose" : "support";
    if (!candId || !spender || amount <= 0) continue;

    if (!byCandidate.has(candId)) byCandidate.set(candId, new Map());
    const spenders = byCandidate.get(candId);
    const key = `${spender.toUpperCase()}|${position}`;
    const existing = spenders.get(key);
    if (existing) {
      existing.amount += amount;
    } else {
      spenders.set(key, {
        spender: titleCase(spender),
        amount,
        position,
        isProIsraelAdvocacy: PRO_ISRAEL_SPENDER_PATTERNS.some((p) =>
          spender.toLowerCase().includes(p)
        ),
      });
    }
  }

  const result = new Map();
  for (const [candId, spenders] of byCandidate) {
    const list = [...spenders.values()].sort((a, b) => b.amount - a.amount).slice(0, TOP_IE_LIMIT);
    const total = [...spenders.values()].reduce((s, x) => s + x.amount, 0);
    const proIsraelTotal = [...spenders.values()]
      .filter((x) => x.isProIsraelAdvocacy)
      .reduce((s, x) => s + x.amount, 0);
    result.set(candId, { spending: list, total, proIsraelTotal });
  }
  return result;
}

function normalizeParty(party) {
  const p = (party || "").toUpperCase();
  if (p.startsWith("DEM")) return "Democrat";
  if (p.startsWith("REP")) return "Republican";
  if (p === "IND" || p.includes("IND")) return "Independent";
  return "Independent";
}

function getCurrentTerm(legislator) {
  const terms = legislator.terms || [];
  return terms.filter((t) => !t.end || t.end >= "2025-01-01").at(-1) || terms.at(-1);
}

function getFecId(legislator, term) {
  const fecIds = legislator.id?.fec || [];
  if (!fecIds.length) return null;
  const prefix = term.type === "sen" ? "S" : "H";
  const matching = fecIds.filter((id) => id.startsWith(prefix));
  return matching.at(-1) || fecIds.at(-1);
}

function calculateScores(params) {
  const { totalOutsideMoney, totalDonations, pacDependenceScore, controversialIndustries, independenceVotes } = params;
  const outsideMoneyPercent = totalDonations > 0 ? Math.round((totalOutsideMoney / totalDonations) * 100) : 0;
  const baseScore = Math.max(0, 100 - outsideMoneyPercent);
  let votingBonus = 0;
  if (independenceVotes >= 5) votingBonus = 20;
  else if (independenceVotes >= 3) votingBonus = 15;
  else if (independenceVotes >= 1) votingBonus = 10;
  let pacPenalty = 0;
  if (pacDependenceScore >= 50) pacPenalty = 20;
  else if (pacDependenceScore >= 35) pacPenalty = 15;
  else if (pacDependenceScore >= 20) pacPenalty = 10;
  else if (pacDependenceScore >= 10) pacPenalty = 5;
  const industryPenalty = Math.min(controversialIndustries.length * 8, 30);
  const finalScore = Math.max(0, Math.min(100, Math.round(baseScore + votingBonus - pacPenalty - industryPenalty)));
  return { baseScore, outsideMoneyPercent, votingBonus, lobbyistMeetingPenalty: pacPenalty, controversialIndustryPenalty: industryPenalty, finalScore };
}

function buildScoreHistory(s22, s24) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month, i) => ({ month, score: Math.round(s22 + ((s24 - s22) * (i + 1)) / 6) }));
}

function scoresFromFecRow(row, pas2PacTotal = 0) {
  const totalDonations = parseFloat(row?.Total_Receipt) || 0;
  const individual = parseFloat(row?.Individual_Contribution) || 0;
  const pac = parseFloat(row?.Other_Committee_Contribution) || 0;
  const party = parseFloat(row?.Party_Committee_Contribution) || 0;
  const transfers = parseFloat(row?.Transfer_From_Other_Auth_Committee) || 0;

  let totalOutsideMoney = pac + party + transfers;
  if (totalDonations > 0) {
    totalOutsideMoney = Math.max(totalOutsideMoney, totalDonations - individual);
  }

  let effectiveTotal = totalDonations;
  if (effectiveTotal === 0 && pas2PacTotal > 0) {
    effectiveTotal = pas2PacTotal * 4;
    totalOutsideMoney = pas2PacTotal;
  }

  const pacDependenceScore =
    effectiveTotal > 0 ? Math.round((Math.max(pac, pas2PacTotal) / effectiveTotal) * 100) : 0;

  return {
    totalDonations: effectiveTotal,
    totalOutsideMoney,
    pacDependenceScore,
    hasFinancialData: effectiveTotal > 1000,
    dataCycleUsed: row?._cycle || CYCLE,
  };
}

async function fetchAllGovTrackRoles() {
  const roles = [];
  let offset = 0;
  while (true) {
    const data = await fetch(`https://www.govtrack.us/api/v2/role?current=true&limit=100&offset=${offset}`).then((r) => r.json());
    roles.push(...data.objects);
    if (roles.length >= data.meta.total_count) break;
    offset += 100;
    await sleep(150);
  }
  return roles;
}

function govtrackPersonId(person) {
  const m = (person?.link || "").match(/\/(\d+)$/);
  return m ? parseInt(m[1], 10) : null;
}

async function fetchRecentVotes(personId, topDonors) {
  if (!personId) return [];
  const res = await fetch(
    `https://www.govtrack.us/api/v2/vote_voter?person=${personId}&limit=40&created__gt=2024-01-01&sort=-created`
  );
  const data = await res.json();
  const votes = [];

  for (const vv of data.objects || []) {
    if (vv.option?.value !== "Nay") continue;
    const vote = vv.vote;
    if (!vote || vote.category === "procedural") continue;
    const question = vote.question || vote.display_title || "Roll call vote";
    const billMatch = question.match(/([HS]\.?\s*(?:J\.?\s*Res\.?|Res\.?|Con\.?\s*Res\.?|R\.?)?\s*\d+)/i);
    const billNumber = billMatch ? billMatch[1].replace(/\s+/g, " ").trim() : `Vote ${vote.id}`;

    let donorAffected = null;
    const qLower = question.toLowerCase();
    for (const donor of topDonors) {
      const dLower = `${donor.name} ${donor.industry}`.toLowerCase();
      for (const sector of INDUSTRY_TAXONOMY) {
        if (!isControversialIndustry(sector.label)) continue;
        if (sector.patterns.some((p) => dLower.includes(p) && qLower.includes(p.split(" ")[0]))) {
          donorAffected = donor.name;
          break;
        }
      }
      if (donorAffected) break;
    }

    votes.push({
      billName: question.slice(0, 140),
      billNumber,
      date: (vv.created || "").slice(0, 10),
      donorAffected: donorAffected || "Industry-aligned legislation",
      vote: "Nay",
      description: donorAffected
        ? `Nay vote on legislation related to ${donorAffected}'s sector (GovTrack)`
        : `Recorded Nay on ${vote.category || "floor"} measure (GovTrack)`,
      isIndependenceVote: !!donorAffected,
    });
    if (votes.length >= 5) break;
  }
  return votes;
}

async function main() {
  console.log("TrackBack bulk data sync...");
  mkdirSync(CACHE, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const legislatorsRaw = await fetch(
    "https://raw.githubusercontent.com/unitedstates/congress-legislators/gh-pages/legislators-current.json"
  ).then((r) => r.json());

  const targetCandIds = new Set();
  for (const leg of legislatorsRaw) {
    const term = getCurrentTerm(leg);
    if (!term || (term.type !== "sen" && term.type !== "rep")) continue;
    const fecId = getFecId(leg, term);
    if (fecId) targetCandIds.add(fecId);
  }

  const [govtrackRoles, fec2024, fec2022, fec2020, pas2Data, ieData, cmteToCands] = await Promise.all([
    fetchAllGovTrackRoles(),
    loadCandidateSummary(CYCLE),
    loadCandidateSummary(PREV_CYCLE),
    loadCandidateSummary(2020),
    loadPas2Contributions(),
    loadIndependentExpenditures(),
    loadCclLinkages(targetCandIds),
  ]);

  const indivData = await loadIndividualContributions(cmteToCands);

  const fecMerged = mergeCandidateSummaries(fec2024, fec2022, fec2020);

  const govtrackByBioguide = new Map(govtrackRoles.map((r) => [r.person?.bioguideid, r]));

  const politicians = [];
  let idx = 0;

  for (const leg of legislatorsRaw) {
    const term = getCurrentTerm(leg);
    if (!term || (term.type !== "sen" && term.type !== "rep")) continue;
    const bio = leg.id?.bioguide;
    if (!bio) continue;

    const name = leg.name?.official_full || [leg.name?.first, leg.name?.last].filter(Boolean).join(" ");
    const fecId = getFecId(leg, term);
    const fecRow = fecId ? fecMerged.get(fecId) : null;
    const fecPrev = fecId ? fec2022.get(fecId) || fec2020.get(fecId) : null;
    const gtRole = govtrackByBioguide.get(bio);
    const personId = gtRole ? govtrackPersonId(gtRole.person) : null;
    const osid = leg.id?.opensecrets || gtRole?.person?.osid;

    const pas2Entry = fecId ? pas2Data.get(fecId) : null;
    const pas2PacTotal = pas2Entry?.pacTotal || 0;
    const pas2Donors = pas2Entry?.allDonors || pas2Entry?.donors || [];
    const indivEntry = fecId ? indivData.get(fecId) : null;
    const topDonors = mergeTopDonors(pas2Entry?.donors || [], indivEntry);
    const ieEntry = fecId ? ieData.get(fecId) : null;
    const outsideSpending = ieEntry?.spending || [];
    const proIsraelOutsideSpending = ieEntry?.proIsraelTotal || 0;

    const fin = scoresFromFecRow(fecRow, pas2PacTotal);
    const finPrev = fecPrev ? scoresFromFecRow(fecPrev, pas2PacTotal) : fin;
    const industryBreakdown = buildIndustryBreakdown({
      pas2Donors,
      outsideSpending,
      indivEntry,
      totalDonations: fin.totalDonations,
    });
    const controversialIndustries = detectControversialIndustries(
      topDonors,
      outsideSpending,
      industryBreakdown
    );

    let recentVotes = [];
    try {
      recentVotes = await fetchRecentVotes(personId, topDonors);
      await sleep(120);
    } catch {
      /* skip */
    }

    const independenceVotes = recentVotes.filter((v) => v.isIndependenceVote).length;

    let scoreBreakdown = calculateScores({ ...fin, controversialIndustries, independenceVotes });
    let scorePrev = calculateScores({ ...finPrev, controversialIndustries: [], independenceVotes: 0 }).finalScore;

    if (!fin.hasFinancialData) {
      scoreBreakdown = { baseScore: 0, outsideMoneyPercent: 0, votingBonus: 0, lobbyistMeetingPenalty: 0, controversialIndustryPenalty: 0, finalScore: 0 };
      scorePrev = 0;
    }

    politicians.push({
      id: bio.toLowerCase(),
      bioguideId: bio,
      name,
      party: normalizeParty(term.party),
      chamber: term.type === "sen" ? "Senate" : "House",
      state: term.state,
      district: term.type === "rep" ? (term.district === 0 ? "At-Large" : String(term.district)) : undefined,
      photoUrl: `https://bioguide.congress.gov/photo/${bio}.jpg`,
      openSecretsUrl: osid ? `https://www.opensecrets.org/members-of-congress/summary?cid=${osid}` : null,
      fecUrl: fecId ? `https://www.fec.gov/data/candidate/${fecId}/` : null,
      purityScore: scoreBreakdown.finalScore,
      nationalRank: 0,
      scoreChange: scoreBreakdown.finalScore - scorePrev,
      totalOutsideMoney: fin.totalOutsideMoney,
      totalDonations: fin.totalDonations,
      lobbyistMeetings: fin.pacDependenceScore,
      topDonors,
      industryBreakdown,
      individualContributionTotal: indivEntry?.total || 0,
      outsideSpending,
      totalOutsideSpending: ieEntry?.total || 0,
      proIsraelOutsideSpending,
      recentVotesAgainstDonors: recentVotes.map(({ isIndependenceVote, ...v }) => v),
      scoreBreakdown,
      scoreHistory: buildScoreHistory(scorePrev, scoreBreakdown.finalScore),
      controversialIndustries,
      dataCycle: fin.dataCycleUsed || CYCLE,
      hasFinancialData: fin.hasFinancialData,
      lastSynced: new Date().toISOString(),
    });

    idx++;
    if (idx % 50 === 0) console.log(`  Processed ${idx} legislators...`);
  }

  const ranked = politicians.filter((p) => p.hasFinancialData);
  ranked.sort((a, b) => b.purityScore - a.purityScore);
  ranked.forEach((p, i) => { p.nationalRank = i + 1; });
  politicians.filter((p) => !p.hasFinancialData).forEach((p) => { p.nationalRank = ranked.length + 1; });

  const output = {
    meta: {
      syncedAt: new Date().toISOString(),
      cycle: CYCLE,
      count: politicians.length,
      sources: [
        "FEC candidate_summary bulk CSV (fec.gov)",
        "FEC pas2 bulk file — committee-to-candidate contributions (fec.gov)",
        "FEC indiv bulk file — itemized individual contributions by employer (fec.gov)",
        "FEC ccl bulk file — committee-to-candidate linkage (fec.gov)",
        "FEC independent_expenditure bulk CSV — outside PAC spending (fec.gov)",
        "TrackBack industry taxonomy — 25+ sectors from public FEC names/employers",
        "unitedstates/congress-legislators (public domain)",
        "GovTrack.us — roll call voting records",
        "Congress.gov Bioguide — official photos",
      ],
    },
    politicians,
  };

  writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\nDone! ${politicians.length} members synced.`);
  console.log(`Scores: ${politicians.at(-1)?.purityScore} – ${politicians[0]?.purityScore}`);
  console.log(`Written to ${OUT_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});