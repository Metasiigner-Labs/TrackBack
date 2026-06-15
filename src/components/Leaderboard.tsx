import Link from "next/link";
import type { Politician } from "@/lib/types";
import { getScoreColor } from "@/lib/purity-score";
import PartyBadge from "./PartyBadge";

interface LeaderboardProps {
  title: string;
  politicians: Politician[];
  variant: "clean" | "compromised";
}

export default function Leaderboard({
  title,
  politicians,
  variant,
}: LeaderboardProps) {
  const accentColor = variant === "clean" ? "text-emerald-400" : "text-red-400";
  const borderAccent =
    variant === "clean" ? "border-emerald-500/30" : "border-red-500/30";

  return (
    <div
      className={`rounded-xl border bg-slate-900/50 ${borderAccent} overflow-hidden`}
    >
      <div className="border-b border-slate-800 px-5 py-4">
        <h2 className={`text-lg font-bold ${accentColor}`}>{title}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {variant === "clean"
            ? "Highest Purity Scores in Congress"
            : "Lowest Purity Scores in Congress"}
        </p>
      </div>
      <ol className="divide-y divide-slate-800">
        {politicians.map((politician, index) => (
          <li key={politician.id}>
            <Link
              href={`/politician/${politician.id}`}
              className="flex items-center gap-4 px-5 py-3 transition hover:bg-slate-800/50"
            >
              <span className="w-6 text-center text-sm font-bold text-slate-500">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">
                  {politician.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <PartyBadge party={politician.party} />
                  <span className="text-xs text-slate-500">
                    {politician.chamber} · {politician.state}
                  </span>
                </div>
              </div>
              <span
                className={`font-bold tabular-nums ${getScoreColor(politician.purityScore)}`}
              >
                {politician.purityScore}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}