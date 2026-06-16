/**
 * Purity Score — single source of truth
 *
 * Design: base score already reflects outside/PAC money share.
 * Additional penalties only fire for independent corruption signals
 * (controversial industries, direct lobbying ties, independence votes).
 */

export function calcLobbyingExposurePenalty(politician) {
  const HIGHLIGHT_ORG_IDS = new Set(["aipac", "udp", "dmfi", "norpac", "phrma", "api"]);
  const STRONG = new Set(["fec_donor", "fec_and_lobbying", "lda_activity", "lda_and_sector"]);

  const orgs = (politician.lobbyingOrganizations || []).filter((o) =>
    STRONG.has(o.connection)
  );

  let penalty = 0;
  if (orgs.length >= 5) penalty += 5;
  else if (orgs.length >= 2) penalty += 3;
  else if (orgs.length >= 1) penalty += 1;

  const directFec = orgs.filter(
    (o) => o.connection === "fec_donor" || o.connection === "fec_and_lobbying"
  ).length;
  if (directFec >= 2) penalty += 3;
  else if (directFec >= 1) penalty += 2;

  if (orgs.some((o) => HIGHLIGHT_ORG_IDS.has(o.id))) penalty += 3;

  const proIsrael = politician.proIsraelOutsideSpending || 0;
  if (proIsrael >= 500_000) penalty += 5;
  else if (proIsrael >= 100_000) penalty += 3;
  else if (proIsrael > 0) penalty += 2;

  return Math.min(penalty, 10);
}

export function calculatePurityScore(input) {
  const {
    totalOutsideMoney = 0,
    totalDonations = 0,
    pacDependenceScore = 0,
    controversialIndustries = [],
    independenceVotes = 0,
    lobbyingExposurePenalty = 0,
    hasFinancialData = true,
  } = input;

  if (!hasFinancialData) {
    return {
      baseScore: 0,
      outsideMoneyPercent: 0,
      votingBonus: 0,
      lobbyistMeetingPenalty: 0,
      controversialIndustryPenalty: 0,
      lobbyingExposurePenalty: 0,
      finalScore: 0,
    };
  }

  const outsideMoneyPercent =
    totalDonations > 0 ? Math.round((totalOutsideMoney / totalDonations) * 100) : 0;
  const baseScore = Math.max(0, 100 - outsideMoneyPercent);

  let votingBonus = 0;
  if (independenceVotes >= 5) votingBonus = 15;
  else if (independenceVotes >= 3) votingBonus = 12;
  else if (independenceVotes >= 1) votingBonus = 8;

  // Only penalize PAC dependence ABOVE what outside-money % already captures
  const excessPac = Math.max(0, pacDependenceScore - Math.round(outsideMoneyPercent * 0.35));
  let lobbyistMeetingPenalty = 0;
  if (excessPac >= 25) lobbyistMeetingPenalty = 8;
  else if (excessPac >= 15) lobbyistMeetingPenalty = 5;
  else if (excessPac >= 8) lobbyistMeetingPenalty = 3;

  const controversialIndustryPenalty = Math.min(controversialIndustries.length * 4, 12);
  const lobbyingPenalty = Math.min(lobbyingExposurePenalty, 10);

  const raw =
    baseScore +
    votingBonus -
    lobbyistMeetingPenalty -
    controversialIndustryPenalty -
    lobbyingPenalty;

  // No artificial floor — compress only extreme negatives so order is preserved
  let finalScore;
  if (raw >= 15) {
    finalScore = Math.min(100, Math.round(raw));
  } else if (raw >= 0) {
    finalScore = Math.round(raw);
  } else {
    // e.g. raw -10 → 10, raw -25 → 5 — still differentiated, rarely literal 0
    finalScore = Math.max(5, Math.round(10 + raw * 0.35));
  }

  return {
    baseScore,
    outsideMoneyPercent,
    votingBonus,
    lobbyistMeetingPenalty,
    controversialIndustryPenalty,
    lobbyingExposurePenalty: lobbyingPenalty,
    finalScore,
  };
}

export function recalculatePoliticianScore(politician) {
  const independenceVotes = Math.min(
    5,
    (politician.recentVotesAgainstDonors || []).length
  );

  const lobbyingExposurePenalty = calcLobbyingExposurePenalty(politician);

  const breakdown = calculatePurityScore({
    totalOutsideMoney: politician.totalOutsideMoney,
    totalDonations: politician.totalDonations,
    pacDependenceScore: politician.lobbyistMeetings,
    controversialIndustries: politician.controversialIndustries || [],
    independenceVotes,
    lobbyingExposurePenalty,
    hasFinancialData: politician.hasFinancialData,
  });

  return breakdown;
}

export function applyScoreRecalcToAll(politicians) {
  for (const p of politicians) {
    const breakdown = recalculatePoliticianScore(p);
    p.scoreBreakdown = breakdown;
    p.purityScore = breakdown.finalScore;
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