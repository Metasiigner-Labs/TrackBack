import type { InfluenceHighlight } from "@/lib/score-summary";
import { formatInfluenceAmount } from "@/lib/score-summary";

interface LobbyingHighlightsProps {
  highlights: InfluenceHighlight[];
}

export default function LobbyingHighlights({ highlights }: LobbyingHighlightsProps) {
  if (highlights.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-6">
      <h3 className="text-lg font-semibold text-amber-200">Key Influence Groups</h3>
      <p className="mt-1 text-sm text-slate-400">
        Highlighted when linked via FEC donors, outside spending, or Senate LDA
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {highlights.map((hit) => (
          <div
            key={hit.id}
            className="rounded-lg border border-amber-500/20 bg-slate-950/50 p-4"
          >
            <p className="font-semibold text-white">{hit.label}</p>
            <p className="mt-1 text-xs text-slate-400">{hit.detail}</p>
            {hit.amount ? (
              <p className="mt-2 font-mono text-sm text-amber-300">
                {formatInfluenceAmount(hit.amount)}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}