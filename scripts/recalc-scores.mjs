/** Recalculate all purity scores using unified score-algorithm.mjs */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { applyScoreRecalcToAll } from "./score-algorithm.mjs";

export { calcLobbyingExposurePenalty, applyScoreRecalcToAll as applyLobbyingScoreRecalc } from "./score-algorithm.mjs";

const isMain = process.argv[1]?.endsWith("recalc-scores.mjs");
if (isMain) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const OUT_FILE = join(__dirname, "..", "src", "data", "politicians.json");
  const data = JSON.parse(readFileSync(OUT_FILE, "utf8"));
  data.politicians = applyScoreRecalcToAll(data.politicians);
  data.meta.syncedAt = new Date().toISOString();
  writeFileSync(OUT_FILE, JSON.stringify(data, null, 2));

  const ranked = data.politicians.filter((p) => p.hasFinancialData);
  const scores = ranked.map((p) => p.purityScore).sort((a, b) => a - b);
  const hist = {};
  for (const s of scores) hist[s] = (hist[s] || 0) + 1;
  const floor = Object.entries(hist).filter(([s]) => Number(s) <= 12);

  console.log(`Recalculated ${ranked.length} scores.`);
  console.log(`Range: ${scores[0]} – ${scores[scores.length - 1]}`);
  console.log(`Scores ≤12: ${floor.reduce((n, [, c]) => n + c, 0)}`);
  console.log(`Literal zeros: ${ranked.filter((p) => p.purityScore === 0).length}`);
}