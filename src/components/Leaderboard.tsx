import Image from "next/image";
import Link from "next/link";
import type { Politician } from "@/lib/types";
import {
  getLeaderboardDonorTags,
  getScoreSummaryLine,
} from "@/lib/score-summary";
import LeaderboardScoreTooltip from "./LeaderboardScoreTooltip";
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
  const tagClass =
    variant === "clean"
      ? "bg-emerald-950/40 text-emerald-300"
      : "bg-red-950/40 text-red-300";

  return (
    <div
      className={`rounded-xl border bg-slate-900/50 ${borderAccent} overflow-hidden`}
    >
      <div className="border-b border-slate-800 px-5 py-4">
        <h2 className={`text-lg font-bold ${accentColor}`}>{title}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {variant === "clean"
            ? "Highest Purity Scores — hover score for FEC formula"
            : "Lowest Purity Scores — top industries & donors dragging score"}
        </p>
      </div>
      <ol className="divide-y divide-slate-800">
        {politicians.map((politician, index) => {
          const donorTags = getLeaderboardDonorTags(politician, variant);
          const summary = getScoreSummaryLine(politician);

          return (
            <li key={politician.id}>
              <Link
                href={`/politician/${politician.id}`}
                className="flex gap-4 px-5 py-4 transition hover:bg-slate-800/50"
              >
                <span className="w-6 shrink-0 pt-2 text-center text-sm font-bold text-slate-500">
                  {index + 1}
                </span>

                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                  <Image
                    src={politician.photoUrl}
                    alt={politician.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">
                        {politician.name}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <PartyBadge party={politician.party} />
                        <span className="text-xs text-slate-500">
                          {politician.chamber} · {politician.state}
                        </span>
                      </div>
                    </div>
                    <LeaderboardScoreTooltip politician={politician} />
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                    {summary}
                  </p>

                  {donorTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {donorTags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded px-2 py-0.5 text-xs ${tagClass}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}