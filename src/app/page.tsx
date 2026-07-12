import Link from "next/link";
import CitizenVsInstitutionMeter from "@/components/CitizenVsInstitutionMeter";
import InfluenceClassGrid from "@/components/InfluenceClassGrid";
import Leaderboard from "@/components/Leaderboard";
import PurityScoreExplanation from "@/components/PurityScoreExplanation";
import TrackBackCrest from "@/components/TrackBackCrest";
import ZipSearchBar from "@/components/ZipSearchBar";
import { politicians } from "@/data/politicians";
import {
  getCleanestPoliticians,
  getMostCompromisedPoliticians,
} from "@/lib/utils";

function nationalMoneySplit() {
  let people = 0;
  let institutions = 0;
  for (const p of politicians) {
    if (p.hasFinancialData === false) continue;
    const total = p.totalDonations || 0;
    const outside = p.totalOutsideMoney || 0;
    if (total <= 0) continue;
    people += Math.max(0, total - outside);
    institutions += Math.max(0, outside);
  }
  const sum = people + institutions;
  if (sum <= 0) {
    return {
      individualPercent: 50,
      pacPercent: 50,
      individualAmount: 0,
      pacAmount: 0,
    };
  }
  return {
    individualPercent: Math.round((people / sum) * 100),
    pacPercent: Math.round((institutions / sum) * 100),
    individualAmount: people,
    pacAmount: institutions,
  };
}

export default function HomePage() {
  const cleanest = getCleanestPoliticians(politicians, 10);
  const compromised = getMostCompromisedPoliticians(politicians, 10);
  const national = nationalMoneySplit();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-800">
        {/* Civic geometry: soft stripes + radial — original, not a flag product */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-slate-950 to-blue-950/35" />
        <div className="absolute inset-0 opacity-[0.07] tb-stripe-field" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-transparent to-transparent" />
        <div
          className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-red-600/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-blue-600/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <TrackBackCrest size="lg" className="mb-6" />
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-400">
              Public accountability · America 250
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              They track us.{" "}
              <span className="bg-gradient-to-r from-red-400 via-white to-blue-400 bg-clip-text text-transparent">
                We track them back.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 sm:text-xl">
              Citizen money vs institutional money. Every disclosed industry.
              Every vote we can tie to the dollars — from legal public FEC
              filings and GovTrack records.
            </p>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              TrackBack&apos;s view: Congress should be funded by the people it
              serves — not by concentrated PACs and outside spenders. Scores are
              opinionated analytics of public records, not criminal findings.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-xl">
            <ZipSearchBar size="large" />
            <p className="mt-3 text-center text-sm text-slate-500">
              Works with any valid U.S. zip code — start with your own.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        <section>
          <CitizenVsInstitutionMeter
            individualPercent={national.individualPercent}
            pacPercent={national.pacPercent}
            individualAmount={national.individualAmount}
            pacAmount={national.pacAmount}
            cycle={2024}
          />
          <p className="mt-3 text-center text-xs text-slate-500">
            National aggregate across members with FEC receipt data this cycle —
            not a single candidate.
          </p>
        </section>

        <InfluenceClassGrid />

        <section id="leaderboards" className="scroll-mt-24">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              National Leaderboards
            </h2>
            <p className="mt-2 text-slate-400">
              Who&apos;s cleanest — and who&apos;s most institution-funded — in
              Congress right now
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Leaderboard
              title="Cleanest in Congress"
              politicians={cleanest}
              variant="clean"
            />
            <Leaderboard
              title="Most Compromised"
              politicians={compromised}
              variant="compromised"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-white">
            What we expose — and how
          </h2>
          <p className="mt-3 max-w-3xl text-slate-400">
            TrackBack maps every FEC-reported contribution we can classify into
            25+ sectors: advocacy spenders, pharma, fossil fuels, agriculture,
            fintech, defense, labor, civic groups, and more. No accounts. No
            spin. Just public records, linked to voting behavior.
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <li className="flex gap-2">
              <span className="text-red-400">→</span>
              Committee &amp; PAC contributions (FEC pas2)
            </li>
            <li className="flex gap-2">
              <span className="text-red-400">→</span>
              Itemized individual donors + employers (FEC indiv)
            </li>
            <li className="flex gap-2">
              <span className="text-red-400">→</span>
              Outside super PAC spending for/against (FEC IE)
            </li>
            <li className="flex gap-2">
              <span className="text-red-400">→</span>
              Nay votes on donor-industry legislation (GovTrack)
            </li>
          </ul>
        </section>

        <PurityScoreExplanation />

        <section className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-red-950/20 p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-4">
            <TrackBackCrest size="md" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                America 250
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                Know your government — official sources
              </h2>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-slate-400">
            FEC filings, STOCK Act disclosures, federal spending, fraud reporting,
            tax policy, and foreign influence — every link goes to a real .gov
            source or TrackBack&apos;s public data.
          </p>
          <Link
            href="/transparency"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Open transparency hub →
          </Link>
        </section>
      </div>
    </div>
  );
}
