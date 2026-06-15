interface DataCompletenessProps {
  percent: number;
  tier: "high" | "medium" | "low" | "insufficient";
  compact?: boolean;
}

const TIER_STYLES = {
  high: "border-emerald-500/30 bg-emerald-950/30 text-emerald-200",
  medium: "border-blue-500/30 bg-blue-950/30 text-blue-200",
  low: "border-amber-500/30 bg-amber-950/30 text-amber-200",
  insufficient: "border-slate-600/40 bg-slate-900/50 text-slate-400",
};

const TIER_LABELS = {
  high: "High confidence",
  medium: "Good coverage",
  low: "Partial data",
  insufficient: "Limited FEC data",
};

export default function DataCompleteness({
  percent,
  tier,
  compact = false,
}: DataCompletenessProps) {
  if (compact) {
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TIER_STYLES[tier]}`}
        title={`Data completeness: ${percent}% — ${TIER_LABELS[tier]}`}
      >
        {percent}% coverage
      </span>
    );
  }

  return (
    <div className={`rounded-lg border p-4 ${TIER_STYLES[tier]}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{TIER_LABELS[tier]}</p>
          <p className="mt-1 text-xs opacity-80">
            How much FEC-reported finance data we have for this member this cycle.
          </p>
        </div>
        <span className="font-mono text-lg font-bold">{percent}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/20">
        <div
          className="h-full rounded-full bg-current opacity-60"
          style={{ width: `${percent}%` }}
        />
      </div>
      {tier === "low" || tier === "insufficient" ? (
        <p className="mt-2 text-xs opacity-80">
          Purity Score may be less reliable when FEC filings are sparse or the member is
          new to Congress.
        </p>
      ) : null}
    </div>
  );
}