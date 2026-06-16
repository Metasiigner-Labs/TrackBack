import type { Politician } from "./types";
import { formatCurrency } from "./utils";

const INFLUENCE_WATCHLIST = [
  { id: "aipac", label: "AIPAC" },
  { id: "udp", label: "United Democracy Project" },
  { id: "dmfi", label: "Democratic Majority for Israel" },
  { id: "norpac", label: "NorPAC" },
  { id: "phrma", label: "PhRMA" },
  { id: "api", label: "American Petroleum Institute" },
] as const;

export function getScoreTooltipLines(politician: Politician): string[] {
  const bd = politician.scoreBreakdown;
  const lines = [
    `Base: ${bd.baseScore} (100 − ${bd.outsideMoneyPercent}% non-individual FEC)`,
  ];
  if (bd.votingBonus > 0) lines.push(`Voting bonus: +${bd.votingBonus}`);
  if (bd.lobbyistMeetingPenalty > 0) {
    lines.push(`PAC penalty: −${bd.lobbyistMeetingPenalty} (${politician.lobbyistMeetings}% PAC)`);
  }
  if (bd.controversialIndustryPenalty > 0) {
    lines.push(`Industry penalty: −${bd.controversialIndustryPenalty}`);
  }
  if (bd.lobbyingExposurePenalty && bd.lobbyingExposurePenalty > 0) {
    lines.push(`Lobbying exposure: −${bd.lobbyingExposurePenalty}`);
  }
  lines.push(`Final: ${bd.finalScore}/100`);
  return lines;
}

export function getLeaderboardDonorTags(
  politician: Politician,
  variant: "clean" | "compromised"
): string[] {
  if (variant === "compromised") {
    return getTopScoreHurters(politician);
  }

  const tags: string[] = [];
  for (const donor of politician.topDonors.slice(0, 2)) {
    const label =
      donor.industry && donor.industry !== "Uncategorized"
        ? `${donor.name} · ${donor.industry}`
        : donor.name;
    tags.push(`${label} (${formatCurrency(donor.amount)})`);
  }
  if (tags.length === 0 && politician.industryBreakdown?.length) {
    for (const item of politician.industryBreakdown.slice(0, 2)) {
      if (item.label === "Employer Not Disclosed") continue;
      tags.push(`${item.label} (${item.percent}%)`);
    }
  }
  return tags.slice(0, 2);
}

export function getTopScoreHurters(politician: Politician): string[] {
  const hurters: string[] = [];
  const { scoreBreakdown: bd } = politician;

  if (bd.outsideMoneyPercent >= 25) {
    hurters.push(`${bd.outsideMoneyPercent}% non-individual FEC money`);
  }
  if (politician.lobbyistMeetings >= 15) {
    hurters.push(`${politician.lobbyistMeetings}% PAC dependence`);
  }
  for (const industry of politician.controversialIndustries.slice(0, 2)) {
    hurters.push(industry);
  }
  const pacDonor = politician.topDonors.find(
    (d) => d.type === "PAC" || d.type === "Corporate" || d.type === "Lobbyist"
  );
  if (pacDonor && !hurters.some((h) => h.includes(pacDonor.industry))) {
    hurters.push(pacDonor.industry !== "Uncategorized" ? pacDonor.industry : pacDonor.name);
  }
  if ((bd.lobbyingExposurePenalty || 0) > 0) {
    hurters.push("registered lobbying exposure");
  }

  return Array.from(new Set(hurters)).slice(0, 2);
}

export function getScoreSummaryLine(politician: Politician): string {
  const bd = politician.scoreBreakdown;
  const parts: string[] = [];

  if (bd.lobbyistMeetingPenalty >= 15) {
    parts.push("Heavy PAC dependence");
  } else if (bd.outsideMoneyPercent >= 35) {
    parts.push(`${bd.outsideMoneyPercent}% from PACs & committees`);
  }

  if (politician.controversialIndustries.length > 0) {
    parts.push(politician.controversialIndustries.slice(0, 2).join(" + "));
  }

  const influenceHits = getInfluenceHighlights(politician);
  if (influenceHits.length > 0) {
    parts.push(influenceHits.slice(0, 2).map((h) => h.label).join(", "));
  } else if ((politician.lobbyingOrganizations?.length || 0) >= 8) {
    parts.push(`${politician.lobbyingOrganizations!.length} lobbying org ties`);
  }

  if (bd.votingBonus >= 10) {
    parts.push("recent independence votes (bonus)");
  }

  if (parts.length === 0) {
    if (bd.finalScore >= 80) return "Mostly individual donors · low outside money";
    if (bd.finalScore >= 60) return "Moderate PAC share · mixed donor base";
    return `Base ${bd.baseScore} from FEC receipts profile`;
  }

  return parts.slice(0, 3).join(" · ");
}

export interface InfluenceHighlight {
  id: string;
  label: string;
  detail: string;
  amount?: number;
}

export function getInfluenceHighlights(politician: Politician): InfluenceHighlight[] {
  const highlights: InfluenceHighlight[] = [];

  for (const watch of INFLUENCE_WATCHLIST) {
    const org = politician.lobbyingOrganizations?.find((o) => o.id === watch.id);
    const outside = politician.outsideSpending?.find((s) =>
      s.spender.toLowerCase().includes(watch.label.toLowerCase().split(" ")[0])
    );

    if (org) {
      highlights.push({
        id: watch.id,
        label: watch.label,
        detail: org.detail || org.connection.replace(/_/g, " "),
        amount: org.fecAmount || org.lobbyingSpend2024,
      });
    } else if (outside) {
      highlights.push({
        id: watch.id,
        label: watch.label,
        detail: `Outside ${outside.position}: ${outside.spender}`,
        amount: outside.amount,
      });
    } else if (watch.id === "udp" || watch.id === "dmfi" || watch.id === "norpac") {
      const ie = politician.outsideSpending?.find((s) => {
        const n = s.spender.toLowerCase();
        return (
          (watch.id === "udp" && n.includes("united democracy")) ||
          (watch.id === "dmfi" && n.includes("democratic majority")) ||
          (watch.id === "norpac" && n.includes("norpac"))
        );
      });
      if (ie) {
        highlights.push({
          id: watch.id,
          label: watch.label,
          detail: `Independent expenditure · ${ie.position}`,
          amount: ie.amount,
        });
      }
    }
  }

  if (politician.proIsraelOutsideSpending && politician.proIsraelOutsideSpending > 0) {
    const hasProIsrael = highlights.some((h) =>
      ["aipac", "udp", "dmfi", "norpac"].includes(h.id)
    );
    if (!hasProIsrael) {
      highlights.push({
        id: "pro-israel-ie",
        label: "Pro-Israel outside spending",
        detail: "FEC independent expenditure against/for candidate",
        amount: politician.proIsraelOutsideSpending,
      });
    }
  }

  return highlights;
}

export function getIndividualVsPacPercent(politician: Politician): {
  individualPercent: number;
  pacPercent: number;
  individualAmount: number;
  pacAmount: number;
} {
  const total = politician.totalDonations || 0;
  const outside = politician.totalOutsideMoney || 0;
  const individual = Math.max(0, total - outside);
  if (total <= 0) {
    return { individualPercent: 0, pacPercent: 0, individualAmount: 0, pacAmount: 0 };
  }
  const individualPercent = Math.round((individual / total) * 100);
  const pacPercent = Math.round((outside / total) * 100);
  return { individualPercent, pacPercent, individualAmount: individual, pacAmount: outside };
}

export function formatInfluenceAmount(amount?: number): string {
  if (!amount || amount <= 0) return "";
  return formatCurrency(amount);
}