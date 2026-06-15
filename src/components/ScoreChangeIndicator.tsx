interface ScoreChangeIndicatorProps {
  change: number;
}

export default function ScoreChangeIndicator({
  change,
}: ScoreChangeIndicatorProps) {
  if (change === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
        <span className="text-slate-600">—</span> No change
      </span>
    );
  }

  const isPositive = change > 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isPositive ? "text-emerald-400" : "text-red-400"
      }`}
    >
      <span aria-hidden="true">{isPositive ? "▲" : "▼"}</span>
      {isPositive ? "+" : ""}
      {change} pts (30 days)
    </span>
  );
}