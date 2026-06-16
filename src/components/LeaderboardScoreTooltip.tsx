"use client";

import type { Politician } from "@/lib/types";
import { getScoreColor } from "@/lib/purity-score";
import { getScoreTooltipLines } from "@/lib/score-summary";

interface LeaderboardScoreTooltipProps {
  politician: Politician;
}

export default function LeaderboardScoreTooltip({
  politician,
}: LeaderboardScoreTooltipProps) {
  const lines = getScoreTooltipLines(politician);
  const color = getScoreColor(politician.purityScore);

  return (
    <span
      className="group/score relative shrink-0 cursor-help"
      tabIndex={0}
      aria-label={`Purity score ${politician.purityScore}. ${lines.join(". ")}`}
    >
      <span className={`font-bold tabular-nums underline decoration-dotted ${color}`}>
        {politician.purityScore}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-20 mt-2 hidden w-64 rounded-lg border border-slate-700 bg-slate-950 p-3 text-left text-xs text-slate-300 shadow-xl group-hover/score:block group-focus/score:block"
      >
        <span className="mb-2 block font-semibold text-white">Purity Score breakdown</span>
        {lines.map((line) => (
          <span key={line} className="block py-0.5">
            {line}
          </span>
        ))}
      </span>
    </span>
  );
}