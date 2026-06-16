export const PURITY_SCORE_EXPLANATION = {
  title: "Purity Score",
  summary:
    "A 0–100 measure of how independent a politician is from special interest money. Higher is cleaner.",
  formula:
    "Base score = 100 minus the percentage of total receipts from non-individual sources (PACs, party committees, and transfers) per FEC filings.",
  bonuses:
    "Nay votes on legislation aligned with top donor industries can add 10–20 points, based on GovTrack roll call records.",
  penalties:
    "Deductions for high PAC dependence, controversial industries (tobacco, fossil fuels, private prisons, pharma, defense, finance, pro-Israel advocacy), and registered lobbying exposure (Senate LDA + tracked influence groups like AIPAC, UDP, DMFI, NorPAC, PhRMA, API).",
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