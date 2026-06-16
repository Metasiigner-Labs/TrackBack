export const PURITY_SCORE_EXPLANATION = {
  title: "Purity Score",
  summary:
    "A 0–100 measure of how independent a politician is from special interest money. Higher is cleaner.",
  formula:
    "Base score = 100 minus the percentage of total receipts from non-individual sources (PACs, party committees, transfers) per FEC filings. This is the primary signal — we do not double-penalize the same PAC money twice.",
  bonuses:
    "Nay votes on legislation aligned with top donor industries add 8–15 points (GovTrack roll calls).",
  penalties:
    "Additional deductions only for independent signals: excess PAC dependence beyond the base share, controversial industries (tobacco, oil, prisons, pharma, defense, pro-Israel advocacy), and direct lobbying ties (FEC + Senate LDA matches to groups like AIPAC, UDP, DMFI, NorPAC). Scores spread naturally — no mass floor at zero.",
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