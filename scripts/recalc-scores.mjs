/** Recalculate purity scores with lobbying / influence exposure penalty */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const HIGHLIGHT_ORG_IDS = new Set(["aipac", "udp", "dmfi", "norpac", "phrma", "api"]);

export function calcLobbyingExposurePenalty(politician) {
  let penalty = 0;
  const orgs = politician.lobbyingOrganizations || [];

  if (orgs.length >= 20) penalty += 10;
  else if (orgs.length >= 12) penalty += 7;
  else if (orgs.length >= 6) penalty += 4;
  else if (orgs.length >= 3) penalty += 2;

  const directLobbying = orgs.filter(
    (o) => o.connection === "fec_donor" || o.connection === "fec_and_lobbying"
  ).length;
  if (directLobbying >= 3) penalty += 5;
  else if (directLobbying >= 1) penalty += 2;

  if (orgs.some((o) => HIGHLIGHT_ORG_IDS.has(o.id))) penalty += 5;

  const proIsrael = politician.proIsraelOutsideSpending || 0;
  if (proIsrael >= 500_000) penalty += 10;
  else if (proIsrael >= 100_000) penalty += 7;
  else if (proIsrael > 0) penalty += 4;

  return Math.min(penalty, 25);
}

function recalcFinal(bd) {
  const lobbyingExposurePenalty = bd.lobbyingExposurePenalty || 0;
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        bd.baseScore +
          bd.votingBonus -
          bd.lobbyistMeetingPenalty -
          bd.controversialIndustryPenalty -
          lobbyingExposurePenalty
      )
    )
  );
}

export function applyLobbyingScoreRecalc(politicians) {
  for (const p of politicians) {
    if (!p.scoreBreakdown || !p.hasFinancialData) continue;
    const lobbyingExposurePenalty = calcLobbyingExposurePenalty(p);
    p.scoreBreakdown.lobbyingExposurePenalty = lobbyingExposurePenalty;
    p.scoreBreakdown.finalScore = recalcFinal(p.scoreBreakdown);
    p.purityScore = p.scoreBreakdown.finalScore;
  }

  const ranked = politicians.filter((p) => p.hasFinancialData);
  ranked.sort((a, b) => b.purityScore - a.purityScore);
  ranked.forEach((p, i) => {
    p.nationalRank = i + 1;
  });
  politicians.filter((p) => !p.hasFinancialData).forEach((p) => {
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
  console.log(`Recalculated ${ranked.length} scores with lobbying exposure penalty.`);
  console.log(`Range: ${ranked.at(-1)?.purityScore} – ${ranked[0]?.purityScore}`);
}