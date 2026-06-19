export const PURITY_SCORE_EXPLANATION = {
  title: "Purity Score",
  summary:
    "A 0–100 measure of how independent a politician is from special interest money. Higher is cleaner.",
  formula:
    "Base score = 100 minus the percentage of total receipts from non-individual sources (PACs, party committees, transfers) per FEC filings. This is the primary signal — we do not double-penalize the same PAC money twice.",
  bonuses:
    "Small-donor bonus (+3 to +8) when itemized individual FEC money is a large share of receipts. Voting bonus (+3 to +8) only for Nay votes clearly tied to a top donor industry (GovTrack).",
  penalties:
    "LD-203 lobbyist contributions (−3 to −15), outside super PAC spending ratio (−4 to −12), excess PAC dependence, controversial industries, and tracked lobbying org ties (FEC + LDA.gov). Scores cap at 95 unless outside money, LD-203, and lobbying exposure are all minimal.",
};

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Clean";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Compromised";
  return "Heavily Compromised";
}