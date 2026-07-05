import Link from "next/link";
import Leaderboard from "@/components/Leaderboard";
import PurityScoreExplanation from "@/components/PurityScoreExplanation";
import ZipSearchBar from "@/components/ZipSearchBar";
import { politicians } from "@/data/politicians";
import {
  getCleanestPoliticians,
  getMostCompromisedPoliticians,
} from "@/lib/utils";

export default function HomePage() {
  const cleanest = getCleanestPoliticians(politicians, 10);
  const compromised = getMostCompromisedPoliticians(politicians, 10);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-slate-950 to-blue-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-red-400">
              Public Accountability
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              They track us.{" "}
              <span className="bg-gradient-to-r from-red-400 via-white to-blue-400 bg-clip-text text-transparent">
                We track them back.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 sm:text-xl">
              Every reported dollar. Every industry. Every vote tied to the
              money. PACs, pharma, oil, ag, tech, AIPAC-affiliated super PACs,
              labor, civic groups — all from legal public FEC filings.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <ZipSearchBar size="large" />
            <p className="mt-3 text-center text-sm text-slate-500">
              Works with any valid U.S. zip code
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        <section id="leaderboards" className="scroll-mt-24">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              National Leaderboards
            </h2>
            <p className="mt-2 text-slate-400">
              Who&apos;s cleanest — and who&apos;s most compromised — in
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
            25+ sectors: pro-Israel advocacy spenders (UDP, DMFI, NorPAC),
            big pharma, fossil fuels, agriculture, fintech, defense, labor
            unions, NAACP-style civic orgs, Turning Point and similar groups,
            fraternal alumni networks, and more. No accounts. No spin. Just
            public records, linked to voting behavior.
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

        <section className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-slate-900/40 p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            America 250
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Know your government — official sources
          </h2>
          <p className="mt-3 max-w-2xl text-slate-400">
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