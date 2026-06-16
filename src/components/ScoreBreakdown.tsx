import type { ScoreBreakdown as ScoreBreakdownType } from "@/lib/types";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType;
  pacDependencePercent?: number;
}

export default function ScoreBreakdown({
  breakdown,
  pacDependencePercent,
}: ScoreBreakdownProps) {
  const items = [
    {
      label: "Base Score",
      value: breakdown.baseScore,
      description: `100 − ${breakdown.outsideMoneyPercent}% non-individual contributions (FEC)`,
      positive: true,
    },
    {
      label: "Voting Bonus",
      value: breakdown.votingBonus,
      description: "Nay votes against top-donor industry interests (GovTrack)",
      positive: true,
    },
    {
      label: "PAC Dependence Penalty",
      value: -breakdown.lobbyistMeetingPenalty,
      description: pacDependencePercent
        ? `${pacDependencePercent}% of funds from PACs (FEC)`
        : "High PAC contribution share (FEC)",
      positive: false,
    },
    {
      label: "Industry Penalty",
      value: -breakdown.controversialIndustryPenalty,
      description: "Money from controversial industries (FEC donor data)",
      positive: false,
    },
    ...(breakdown.lobbyingExposurePenalty
      ? [
          {
            label: "Lobbying Exposure Penalty",
            value: -breakdown.lobbyingExposurePenalty,
            description:
              "Tracked lobbying org ties, influence groups, pro-Israel outside spending (FEC + LDA)",
            positive: false as const,
          },
        ]
      : []),
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <h3 className="text-lg font-semibold text-white">Score Breakdown</h3>
      <p className="mt-1 text-sm text-slate-400">
        Calculated from official FEC filings and GovTrack voting records
      </p>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0"
          >
            <div>
              <p className="font-medium text-white">{item.label}</p>
              <p className="text-xs text-slate-500">{item.description}</p>
            </div>
            <span
              className={`font-mono font-semibold ${
                item.value === 0
                  ? "text-slate-500"
                  : item.value > 0
                    ? "text-emerald-400"
                    : "text-red-400"
              }`}
            >
              {item.value > 0 ? "+" : ""}
              {item.value}
            </span>
          </div>
        ))}

        <div className="flex items-center justify-between rounded-lg bg-slate-950 px-4 py-3">
          <span className="font-semibold text-white">Final Purity Score</span>
          <span className="text-2xl font-bold text-white">
            {breakdown.finalScore}
            <span className="text-base text-slate-500">/100</span>
          </span>
        </div>
      </div>
    </div>
  );
}