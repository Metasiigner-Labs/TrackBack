import { PURITY_SCORE_EXPLANATION } from "@/lib/purity-score";

export default function PurityScoreExplanation() {
  return (
    <section id="purity-score" className="scroll-mt-24">
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white">
          {PURITY_SCORE_EXPLANATION.title}
        </h2>
        <p className="mt-3 text-lg text-slate-300">
          {PURITY_SCORE_EXPLANATION.summary}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          All inputs are derived from publicly filed FEC campaign finance data
          and GovTrack congressional voting records — fully legal, fully
          transparent.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-5">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-400">
              Base Formula
            </div>
            <p className="text-sm text-slate-300">
              {PURITY_SCORE_EXPLANATION.formula}
            </p>
            <div className="mt-4 rounded bg-slate-950 p-3 font-mono text-xs text-slate-400">
              100 − (non-individual FEC contributions %)
            </div>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-5">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Bonuses
            </div>
            <p className="text-sm text-slate-300">
              {PURITY_SCORE_EXPLANATION.bonuses}
            </p>
            <div className="mt-4 rounded bg-slate-950 p-3 font-mono text-xs text-emerald-400">
              +10 to +20 pts
            </div>
          </div>

          <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-5">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-400">
              Penalties
            </div>
            <p className="text-sm text-slate-300">
              {PURITY_SCORE_EXPLANATION.penalties}
            </p>
            <div className="mt-4 rounded bg-slate-950 p-3 font-mono text-xs text-red-400">
              −5 to −30 pts
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-emerald-400">
            80–100: Clean
          </span>
          <span className="rounded-full border border-amber-500/30 bg-amber-950/30 px-3 py-1 text-amber-400">
            60–79: Moderate
          </span>
          <span className="rounded-full border border-orange-500/30 bg-orange-950/30 px-3 py-1 text-orange-400">
            40–59: Compromised
          </span>
          <span className="rounded-full border border-red-500/30 bg-red-950/30 px-3 py-1 text-red-400">
            0–39: Heavily Compromised
          </span>
        </div>
      </div>
    </section>
  );
}