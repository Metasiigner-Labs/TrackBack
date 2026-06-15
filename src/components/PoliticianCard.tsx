import Image from "next/image";
import Link from "next/link";
import type { Politician } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import PartyBadge from "./PartyBadge";
import PurityScoreDisplay from "./PurityScoreDisplay";
import ScoreChangeIndicator from "./ScoreChangeIndicator";

interface PoliticianCardProps {
  politician: Politician;
  compact?: boolean;
}

export default function PoliticianCard({
  politician,
  compact = false,
}: PoliticianCardProps) {
  const location =
    politician.chamber === "House"
      ? `${politician.state}-${politician.district === "At-Large" ? "AL" : politician.district}`
      : politician.state;

  return (
    <Link
      href={`/politician/${politician.id}`}
      className="group block rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-600 hover:bg-slate-900"
    >
      <div className={`flex gap-4 ${compact ? "flex-col sm:flex-row" : ""}`}>
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
          <Image
            src={politician.photoUrl}
            alt={politician.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300">
                {politician.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <PartyBadge party={politician.party} />
                <span className="text-sm text-slate-400">
                  {politician.chamber} · {location}
                </span>
              </div>
            </div>
            <div className="shrink-0">
              <PurityScoreDisplay score={politician.purityScore} size="sm" />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="text-slate-400">
              National rank{" "}
              <span className="font-semibold text-white">
                #{politician.nationalRank}
              </span>
            </span>
            <ScoreChangeIndicator change={politician.scoreChange} />
          </div>

          {!compact && (
            <div className="mt-4 border-t border-slate-800 pt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                Top Donors
              </p>
              <ul className="space-y-1.5">
                {politician.topDonors.slice(0, 3).map((donor, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="truncate text-slate-300">
                      {donor.name}
                    </span>
                    <span className="ml-2 shrink-0 font-mono text-slate-400">
                      {formatCurrency(donor.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}