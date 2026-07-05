/**
 * STOCK Act PTR trades — House from official Clerk PDFs via public aggregate JSON.
 * Source: TattooedHead/house-stock-watcher-data (parsed from disclosures-clerk.house.gov)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CACHE = join(ROOT, "scripts", "cache");
const HOUSE_URL =
  "https://raw.githubusercontent.com/TattooedHead/house-stock-watcher-data/main/data/all_transactions.json";
const HOUSE_CACHE = join(CACHE, "house-stock-trades.json");
const MAX_TRADES_PER_MEMBER = 20;
const MIN_YEAR = 2023;

const HOUSE_DISCLOSURE = "https://disclosures-clerk.house.gov/FinancialDisclosure";
const SENATE_DISCLOSURE = "https://efdsearch.senate.gov/search/home/";

function normalizeName(name) {
  return (name || "")
    .toLowerCase()
    .replace(/[.,']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseHouseDistrict(district) {
  if (!district) return null;
  const m = String(district).match(/^([A-Z]{2})(\d+)$/);
  if (!m) return null;
  const num = parseInt(m[2], 10);
  return {
    state: m[1],
    district: num === 0 ? "At-Large" : String(num),
  };
}

function parseDateMDY(str) {
  if (!str) return null;
  const m = String(str).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  return new Date(`${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`);
}

function yearFromDate(str) {
  const d = parseDateMDY(str);
  return d ? d.getFullYear() : 0;
}

function matchHouseRep(repName, district, politicians) {
  const parsed = parseHouseDistrict(district);
  const repNorm = normalizeName(repName);
  const repLast = repNorm.split(" ").pop() || "";

  for (const p of politicians) {
    if (p.chamber !== "House") continue;
    if (parsed) {
      if (p.state !== parsed.state) continue;
      const pDist = p.district === "At-Large" ? "0" : p.district;
      const targetDist = parsed.district === "At-Large" ? "0" : parsed.district;
      if (pDist !== targetDist) continue;
    }

    const pNorm = normalizeName(p.name);
    const pLast = pNorm.split(" ").pop() || "";
    if (pLast !== repLast) continue;

    const pFirst = pNorm.split(" ")[0] || "";
    const rFirst = repNorm.split(" ")[0] || "";
    if (pFirst && rFirst && pFirst[0] === rFirst[0]) return p.id;
    if (pNorm.includes(repNorm) || repNorm.includes(pNorm)) return p.id;
  }
  return null;
}

async function fetchHouseTrades() {
  mkdirSync(CACHE, { recursive: true });
  if (existsSync(HOUSE_CACHE)) {
    const stat = statSync(HOUSE_CACHE);
    if (stat.size > 1_000_000 && Date.now() - stat.mtimeMs < 7 * 86400000) {
      console.log("  STOCK Act: cache hit for House trades");
      return JSON.parse(readFileSync(HOUSE_CACHE, "utf8"));
    }
  }

  console.log("  STOCK Act: downloading House PTR data...");
  const res = await fetch(HOUSE_URL, { redirect: "follow" });
  if (!res.ok) throw new Error(`House stock data ${res.status}`);
  const data = await res.json();
  writeFileSync(HOUSE_CACHE, JSON.stringify(data));
  console.log(`  STOCK Act: cached ${data.length} House transactions`);
  return data;
}

function toTradeRecord(row) {
  return {
    transactionDate: row.transaction_date || "",
    disclosureDate: row.disclosure_date || "",
    ticker: row.ticker && row.ticker !== "--" ? row.ticker : null,
    assetDescription: (row.asset_description || "").replace(/<[^>]+>/g, " ").trim(),
    assetType: row.asset_type || "Unknown",
    type: row.type || "Unknown",
    amount: row.amount || "",
    owner: row.owner || "",
    sourceUrl:
      row.source_url ||
      (row.ptr_link ? row.ptr_link : null) ||
      HOUSE_DISCLOSURE,
  };
}

export function buildStockTradesForPoliticians(politicians) {
  return async function enrich(rawPoliticians) {
    let houseRows = [];
    try {
      houseRows = await fetchHouseTrades();
    } catch (err) {
      console.warn(`  STOCK Act: House fetch failed — ${err.message}`);
    }

    const byMember = new Map();

    for (const row of houseRows) {
      const year = Math.max(
        yearFromDate(row.transaction_date),
        yearFromDate(row.disclosure_date)
      );
      if (year < MIN_YEAR) continue;

      const memberId = matchHouseRep(row.representative, row.district, rawPoliticians);
      if (!memberId) continue;

      if (!byMember.has(memberId)) byMember.set(memberId, []);
      byMember.get(memberId).push(toTradeRecord(row));
    }

    let withTrades = 0;
    const enriched = rawPoliticians.map((p) => {
      const trades = byMember.get(p.id) || [];
      trades.sort((a, b) => {
        const da = parseDateMDY(b.transactionDate) || parseDateMDY(b.disclosureDate);
        const db = parseDateMDY(a.transactionDate) || parseDateMDY(a.disclosureDate);
        return (da?.getTime() || 0) - (db?.getTime() || 0);
      });

      const disclosureUrl =
        p.chamber === "Senate" ? SENATE_DISCLOSURE : HOUSE_DISCLOSURE;

      if (trades.length === 0) {
        return {
          ...p,
          stockTrades: null,
          stockDisclosureUrl: disclosureUrl,
        };
      }

      withTrades++;
      const latest = trades[0]?.disclosureDate || trades[0]?.transactionDate;
      return {
        ...p,
        stockTrades: {
          tradeCount: trades.length,
          lastDisclosureDate: latest,
          recentTrades: trades.slice(0, MAX_TRADES_PER_MEMBER),
        },
        stockDisclosureUrl: disclosureUrl,
      };
    });

    console.log(`  STOCK Act: ${withTrades} members with recent House PTR trades`);
    return enriched;
  };
}

export async function enrichPoliticiansWithStockTrades(politicians) {
  const builder = buildStockTradesForPoliticians(politicians);
  return builder(politicians);
}

const isMain = process.argv[1]?.endsWith("stock-act-sync.mjs");
if (isMain) {
  const OUT = join(ROOT, "src", "data", "politicians.json");
  const data = JSON.parse(readFileSync(OUT, "utf8"));
  const now = new Date().toISOString();
  data.politicians = await enrichPoliticiansWithStockTrades(data.politicians);
  data.meta.syncedAt = now;
  data.meta.sourcesUpdated = { ...(data.meta.sourcesUpdated || {}), stockAct: now };
  const src = "House Clerk PTR — periodic transaction reports (disclosures-clerk.house.gov)";
  if (!data.meta.sources.includes(src)) data.meta.sources.push(src);
  writeFileSync(OUT, JSON.stringify(data, null, 2));
  console.log("STOCK Act enrichment written to politicians.json");
}