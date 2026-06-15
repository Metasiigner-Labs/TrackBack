import type { ScoreHistoryPoint } from "@/lib/types";
import { getScoreColor } from "@/lib/purity-score";

interface ScoreHistoryChartProps {
  history: ScoreHistoryPoint[];
}

export default function ScoreHistoryChart({ history }: ScoreHistoryChartProps) {
  if (history.length === 0) return null;

  const scores = history.map((h) => h.score);
  const min = Math.min(...scores) - 5;
  const max = Math.max(...scores) + 5;
  const range = max - min || 1;
  const latestScore = history[history.length - 1].score;
  const color = getScoreColor(latestScore);

  const points = history
    .map((point, i) => {
      const x = (i / (history.length - 1)) * 100;
      const y = 100 - ((point.score - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <h3 className="text-lg font-semibold text-white">Score History</h3>
      <p className="mt-1 text-sm text-slate-400">6-month trend (placeholder)</p>

      <div className="relative mt-6 h-40 w-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points={`0,100 ${points} 100,100`}
            className={color}
            fill="url(#scoreGradient)"
          />
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className={color}
          />
        </svg>
      </div>

      <div className="mt-4 flex justify-between text-xs text-slate-500">
        {history.map((point) => (
          <span key={point.month}>{point.month}</span>
        ))}
      </div>
    </div>
  );
}