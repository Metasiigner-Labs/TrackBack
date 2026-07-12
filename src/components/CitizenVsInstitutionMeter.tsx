import { IconInstitution, IconPeople } from "@/components/icons/SectorIcons";
import { formatCurrency } from "@/lib/utils";

interface CitizenVsInstitutionMeterProps {
  individualPercent: number;
  pacPercent: number;
  individualAmount: number;
  pacAmount: number;
  cycle?: number;
  /** compact for cards / tight layouts */
  size?: "default" | "compact";
  className?: string;
}

export default function CitizenVsInstitutionMeter({
  individualPercent,
  pacPercent,
  individualAmount,
  pacAmount,
  cycle = 2024,
  size = "default",
  className = "",
}: CitizenVsInstitutionMeterProps) {
  const peoplePct = Math.min(100, Math.max(0, individualPercent));
  const instPct = Math.min(100, Math.max(0, pacPercent));
  const total = individualAmount + pacAmount;
  const hasData = total > 0;

  const citizenLabel =
    peoplePct >= 65
      ? "Mostly people-funded this cycle"
      : peoplePct >= 45
        ? "Mixed people and institutional money"
        : "Mostly institution-funded this cycle";

  if (size === "compact") {
    return (
      <div className={`w-full ${className}`}>
        <div className="mb-1 flex justify-between text-[10px] font-medium uppercase tracking-wide">
          <span className="text-emerald-400">People {peoplePct}%</span>
          <span className="text-red-400">Institutions {instPct}%</span>
        </div>
        <div
          className="flex h-2 overflow-hidden rounded-full bg-slate-800"
          role="img"
          aria-label={`Citizen money ${peoplePct} percent, institutional money ${instPct} percent`}
        >
          <div
            className="bg-gradient-to-r from-emerald-600 to-emerald-400"
            style={{ width: `${hasData ? peoplePct : 50}%` }}
          />
          <div
            className="bg-gradient-to-r from-red-500 to-red-700"
            style={{ width: `${hasData ? instPct : 50}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            Citizen money vs institutional money
          </p>
          <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Who funds this office?
          </h3>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            People = itemized individual receipts. Institutions = PACs, party
            committees, and transfers — FEC {cycle} cycle. Not a legal finding;
            a transparent split of public filings.
          </p>
        </div>
        {hasData && (
          <span className="rounded-full border border-slate-600 bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-200">
            {citizenLabel}
          </span>
        )}
      </div>

      {!hasData ? (
        <p className="mt-6 text-sm text-slate-500">
          Not enough FEC receipt data to compare people vs institutions.
        </p>
      ) : (
        <>
          {/* Dual ring-style meter */}
          <div className="mt-8">
            <div
              className="relative flex h-5 overflow-hidden rounded-full border border-slate-700 bg-slate-950 shadow-inner"
              role="img"
              aria-label={`Citizen money ${peoplePct} percent, institutional money ${instPct} percent`}
            >
              <div
                className="relative bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-400 transition-all"
                style={{ width: `${peoplePct}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.12)_50%,transparent_100%)]" />
              </div>
              <div
                className="relative bg-gradient-to-r from-red-500 via-red-600 to-red-800 transition-all"
                style={{ width: `${instPct}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)]" />
              </div>
            </div>

            {/* Stripe accent under bar — civic geometry, not a flag product mark */}
            <div className="mt-2 flex h-1 overflow-hidden rounded-full opacity-70">
              <div className="w-1/3 bg-red-600" />
              <div className="w-1/3 bg-slate-100" />
              <div className="w-1/3 bg-blue-600" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/25 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-950/50 text-emerald-300">
                  <IconPeople className="h-5 w-5" title="People" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    American people
                  </p>
                  <p className="text-xs text-slate-500">
                    Individual itemized donors
                  </p>
                </div>
              </div>
              <p className="mt-4 font-mono text-3xl font-bold text-white">
                {peoplePct}%
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {formatCurrency(individualAmount)}
              </p>
            </div>

            <div className="rounded-xl border border-red-500/25 bg-red-950/25 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/30 bg-red-950/50 text-red-300">
                  <IconInstitution className="h-5 w-5" title="Institutions" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-red-300">
                    Institutions
                  </p>
                  <p className="text-xs text-slate-500">
                    PACs, parties &amp; transfers
                  </p>
                </div>
              </div>
              <p className="mt-4 font-mono text-3xl font-bold text-white">
                {instPct}%
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {formatCurrency(pacAmount)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
