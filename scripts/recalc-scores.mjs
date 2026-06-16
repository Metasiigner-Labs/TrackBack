/** Recalculate purity scores — lobbying penalty counts direct ties only */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const HIGHLIGHT_ORG_IDS = new Set(["aipac", "udp", "dmfi", "norpac", "phrma", "api"]);
const STRONG_LOBBYING_CONNECTIONS = new Set([
  "fec_donor",
  "fec_and_lobbying",
  "lda_activity",
  "lda_and_sector",
]);

export function calcLobbyingExposurePenalty(politician) {
  const orgs = (politician.lobbyingOrganizations || []).filter((o) =>
    STRONG_LOBBYING_CONNECTIONS.has(o.connection)
  );

  let penalty = 0;

  if (orgs.length >= 6) penalty += 6;
  else if (orgs.length >= 3) penalty += 4;
  else if (orgs.length >= 1) penalty += 2;

  const directFec = orgs.filter(
    (o) => o.connection === "fec_donor" || o.connection === "fec_and_lobbying"
  ).length;
  if (directFec >= 2) penalty += 4;
  else if (directFec >= 1) penalty += 2;

  const ldaTies = orgs.filter(
    (o) => o.connection === "lda_activity" || o.connection === "lda_and_sector"
  ).length;
  if (ldaTies >= 2) penalty += 3;

  if (orgs.some((o) => HIGHLIGHT_ORG_IDS.has(o.id))) penalty += 4;

  const proIsrael = politician.proIsraelOutsideSpending || 0;
  if (proIsrael >= 500_000) penalty += 8;
  else if (proIsrael >= 100_000) penalty += 5;
  else if (proIsrael > 0) penalty += 3;

  return Math.min(penalty, 15);
}

function recalcFinal(bd, hasFinancialData) {
  const lobbyingExposurePenalty = bd.lobbyingExposurePenalty || 0;
  const raw =
    bd.baseScore +
    bd.votingBonus -
    bd.lobbyistMeetingPenalty -
    bd.controversialIndustryPenalty -
    lobbyingExposurePenalty;

  if (!hasFinancialData) return 0;
  return Math.max(8, Math.min(100, Math.round(raw)));
}

export function applyLobbyingScoreRecalc(politicians) {
  for (const p of politicians) {
    if (!p.scoreBreakdown) continue;
    if (!p.hasFinancialData) {
      p.scoreBreakdown.lobbyingExposurePenalty = 0;
      continue;
    }

    const lobbyingExposurePenalty = calcLobbyingExposurePenalty(p);
    p.scoreBreakdown.lobbyingExposurePenalty = lobbyingExposurePenalty;
    p.scoreBreakdown.finalScore = recalcFinal(p.scoreBreakdown, p.hasFinancialData);
    p.purityScore = p.scoreBreakdown.finalScore;
  }

  const ranked = politicians.filter((p) => p.hasFinancialData && p.purityScore > 0);
  ranked.sort((a, b) => b.purityScore - a.purityScore);
  ranked.forEach((p, i) => {
    p.nationalRank = i + 1;
  });
  politicians
    .filter((p) => !p.hasFinancialData || p.purityScore === 0)
    .forEach((p) => {
      p.nationalRank = ranked.length + 1;
    });

  return politicians;
}

const isMain = process.argv[1]?.endsWith("recalc-scores.mjs");
if (isMain) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const OUT_FILE = join(__dirname, "..", "src", "data", "politicians.json");
  const data = JSON.parse(readFileSync(OUT_FILE, "utf8"));
  data.politicians = applyLobbyingScoreRecalc(data.politicians);
  data.meta.syncedAt = new Date().toISOString();
  writeFileSync(OUT_FILE, JSON.stringify(data, null, 2));
  const ranked = data.politicians.filter((p) => p.hasFinancialData);
  const scores = ranked.map((p) => p.purityScore).sort((a, b) => a - b);
  console.log(`Recalculated ${ranked.length} scores.`);
  console.log(`Range: ${scores[0]} – ${scores[scores.length - 1]}`);
  console.log(`Zero scores: ${ranked.filter((p) => p.purityScore === 0).length}`);
}