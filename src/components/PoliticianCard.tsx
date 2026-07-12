import Image from "next/image";
import Link from "next/link";
import CitizenVsInstitutionMeter from "@/components/CitizenVsInstitutionMeter";
import type { Politician } from "@/lib/types";
import {
  getIndividualVsPacPercent,
  getScoreSummaryLine,
} from "@/lib/score-summary";
import { formatCurrency } from "@/lib/utils";
import PartyBadge from "./PartyBadge";
import PurityScoreDisplay from "./PurityScoreDisplay";
import ScoreChangeIndicator from "./ScoreChangeIndicator";

interface PoliticianCardProps {
  politician: Politician;
}

export default function PoliticianCard({ politician }: PoliticianCardProps) {
  const location =
    politician.chamber === "House"
      ? `${politician.state}-${politician.district === "At-Large" ? "AL" : politician.district}`
      : politician.state;

  const topDonors = politician.topDonors.slice(0, 2);
  const summary = getScoreSummaryLine(politician);
  const moneySplit = getIndividualVsPacPercent(politician);

  return (
    <Link
      href={`/politician/${politician.id}`}
      className="group block rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-600 hover:bg-slate-900"
    >
      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
          <Image
            src={politician.photoUrl}
            alt={politician.name}
            fill
            className="object-cover"
            sizes="96px"
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

          <p className="mt-2 line-clamp-2 text-xs text-slate-400">{summary}</p>

          {(moneySplit.individualAmount > 0 || moneySplit.pacAmount > 0) && (
            <div className="mt-3">
              <CitizenVsInstitutionMeter
                size="compact"
                individualPercent={moneySplit.individualPercent}
                pacPercent={moneySplit.pacPercent}
                individualAmount={moneySplit.individualAmount}
                pacAmount={moneySplit.pacAmount}
                cycle={politician.dataCycle}
              />
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="text-slate-400">
              Rank{" "}
              <span className="font-semibold text-white">
                #{politician.nationalRank}
              </span>
            </span>
            <ScoreChangeIndicator change={politician.scoreChange} />
          </div>

          {topDonors.length > 0 && (
            <div className="mt-4 border-t border-slate-800 pt-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                Top donors
              </p>
              <ul className="space-y-1.5">
                {topDonors.map((donor, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="min-w-0 truncate text-slate-300">
                      {donor.name}
                      <span className="ml-1 text-xs text-slate-500">
                        ({donor.industry})
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-slate-400">
                      {formatCurrency(donor.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-3 text-xs font-medium text-blue-400 group-hover:text-blue-300">
            View full profile →
          </p>
        </div>
      </div>
    </Link>
  );
}