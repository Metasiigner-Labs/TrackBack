/**
 * Purity Score — single source of truth
 *
 * Base score reflects outside/PAC money share. Additional signals:
 * independence votes, LD-203 lobbyist $, outside super PAC ratio,
 * small-donor share, controversial industries, lobbying org ties.
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

export function countTrueIndependenceVotes(politician) {
  return (politician.recentVotesAgainstDonors || []).filter(
    (v) =>
      v.donorAffected &&
      v.donorAffected !== "Industry-aligned legislation" &&
      v.vote === "Nay"
  ).length;
}

export function computeDerivedMoneyMetrics(politician) {
  const totalDonations = politician.totalDonations || 0;
  const individualTotal = politician.individualContributionTotal || 0;
  const outsideSpend = politician.totalOutsideSpending || 0;

  const smallDonorPercent =
    totalDonations > 0 ? Math.round((individualTotal / totalDonations) * 1000) / 10 : 0;
  const outsideSpendingPercent =
    totalDonations > 0 ? Math.round((outsideSpend / totalDonations) * 1000) / 10 : 0;

  return { smallDonorPercent, outsideSpendingPercent };
}

export function calculatePurityScore(input) {
  const {
    totalOutsideMoney = 0,
    totalDonations = 0,
    pacDependenceScore = 0,
    controversialIndustries = [],
    independenceVotes = 0,
    lobbyingExposurePenalty = 0,
    ld203Total = 0,
    outsideSpendingPercent = 0,
    smallDonorPercent = 0,
    chamber = "House",
    strongLobbyingOrgCount = 0,
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
      ld203Penalty: 0,
      outsideSpendingPenalty: 0,
      smallDonorBonus: 0,
      finalScore: 0,
    };
  }

  const outsideMoneyPercent =
    totalDonations > 0 ? Math.round((totalOutsideMoney / totalDonations) * 100) : 0;
  const baseScore = Math.max(0, 100 - outsideMoneyPercent);

  let votingBonus = 0;
  if (independenceVotes >= 3) votingBonus = 8;
  else if (independenceVotes >= 2) votingBonus = 5;
  else if (independenceVotes >= 1) votingBonus = 3;

  const pacTolerance = chamber === "Senate" ? 3 : 0;
  const excessPac = Math.max(
    0,
    pacDependenceScore - Math.round(outsideMoneyPercent * 0.35) - pacTolerance
  );
  let lobbyistMeetingPenalty = 0;
  if (excessPac >= 25) lobbyistMeetingPenalty = 8;
  else if (excessPac >= 15) lobbyistMeetingPenalty = 5;
  else if (excessPac >= 8) lobbyistMeetingPenalty = 3;

  const controversialIndustryPenalty = Math.min(controversialIndustries.length * 4, 12);
  const lobbyingPenalty = Math.min(lobbyingExposurePenalty, 10);

  let ld203Penalty = 0;
  if (ld203Total >= 50_000) ld203Penalty = 15;
  else if (ld203Total >= 20_000) ld203Penalty = 10;
  else if (ld203Total >= 5_000) ld203Penalty = 6;
  else if (ld203Total >= 1_000) ld203Penalty = 3;

  let outsideSpendingPenalty = 0;
  if (outsideSpendingPercent >= 50) outsideSpendingPenalty = 12;
  else if (outsideSpendingPercent >= 30) outsideSpendingPenalty = 8;
  else if (outsideSpendingPercent >= 20) outsideSpendingPenalty = 4;

  let smallDonorBonus = 0;
  if (smallDonorPercent >= 70) smallDonorBonus = 8;
  else if (smallDonorPercent >= 50) smallDonorBonus = 5;
  else if (smallDonorPercent >= 35) smallDonorBonus = 3;

  const raw =
    baseScore +
    votingBonus +
    smallDonorBonus -
    lobbyistMeetingPenalty -
    controversialIndustryPenalty -
    lobbyingPenalty -
    ld203Penalty -
    outsideSpendingPenalty;

  let finalScore;
  if (raw >= 15) {
    finalScore = Math.min(100, Math.round(raw));
  } else if (raw >= 0) {
    finalScore = Math.round(raw);
  } else {
    finalScore = Math.max(5, Math.round(10 + raw * 0.35));
  }

  const exceptional =
    outsideMoneyPercent < 5 &&
    ld203Total === 0 &&
    strongLobbyingOrgCount === 0 &&
    outsideSpendingPercent < 10;

  if (finalScore > 95 && !exceptional) {
    finalScore = 95;
  }

  return {
    baseScore,
    outsideMoneyPercent,
    votingBonus,
    lobbyistMeetingPenalty,
    controversialIndustryPenalty,
    lobbyingExposurePenalty: lobbyingPenalty,
    ld203Penalty,
    outsideSpendingPenalty,
    smallDonorBonus,
    finalScore,
  };
}

export function recalculatePoliticianScore(politician) {
  const independenceVotes = countTrueIndependenceVotes(politician);
  const lobbyingExposurePenalty = calcLobbyingExposurePenalty(politician);
  const { smallDonorPercent, outsideSpendingPercent } = computeDerivedMoneyMetrics(politician);

  politician.smallDonorPercent = smallDonorPercent;
  politician.outsideSpendingPercent = outsideSpendingPercent;

  const STRONG = new Set(["fec_donor", "fec_and_lobbying", "lda_activity", "lda_and_sector"]);
  const strongLobbyingOrgCount = (politician.lobbyingOrganizations || []).filter((o) =>
    STRONG.has(o.connection)
  ).length;

  const breakdown = calculatePurityScore({
    totalOutsideMoney: politician.totalOutsideMoney,
    totalDonations: politician.totalDonations,
    pacDependenceScore: politician.lobbyistMeetings,
    controversialIndustries: politician.controversialIndustries || [],
    independenceVotes,
    lobbyingExposurePenalty,
    ld203Total: politician.lobbyistContributions?.total2024 || 0,
    outsideSpendingPercent,
    smallDonorPercent,
    chamber: politician.chamber,
    strongLobbyingOrgCount,
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