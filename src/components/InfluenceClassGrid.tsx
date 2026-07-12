import Link from "next/link";
import {
  IconAuto,
  IconDefense,
  IconEnergy,
  IconFinance,
  IconGambling,
  IconHealth,
  IconPharma,
  IconSuperPac,
} from "@/components/icons/SectorIcons";

/**
 * Homepage “no industry is invisible” wall.
 * Original icons + plain-language sectors only — no flags, logos, or personal marks.
 */
const CLASSES = [
  {
    id: "pharma",
    label: "Pharma & biotech",
    blurb: "Drugmakers, biotech PACs, trade groups",
    Icon: IconPharma,
    tone: "text-rose-300 border-rose-500/25 bg-rose-950/20",
  },
  {
    id: "health",
    label: "Healthcare",
    blurb: "Insurers, hospital systems, health PACs",
    Icon: IconHealth,
    tone: "text-pink-300 border-pink-500/25 bg-pink-950/20",
  },
  {
    id: "finance",
    label: "Finance",
    blurb: "Banks, asset managers, fintech PACs",
    Icon: IconFinance,
    tone: "text-yellow-300 border-yellow-500/25 bg-yellow-950/20",
  },
  {
    id: "auto",
    label: "Auto & manufacturing",
    blurb: "Automakers and industrial committees",
    Icon: IconAuto,
    tone: "text-sky-300 border-sky-500/25 bg-sky-950/20",
  },
  {
    id: "gambling",
    label: "Gambling industry",
    blurb: "Casino and gaming-linked contributions",
    Icon: IconGambling,
    tone: "text-violet-300 border-violet-500/25 bg-violet-950/20",
  },
  {
    id: "energy",
    label: "Energy",
    blurb: "Oil, gas, and energy-sector money",
    Icon: IconEnergy,
    tone: "text-orange-300 border-orange-500/25 bg-orange-950/20",
  },
  {
    id: "defense",
    label: "Defense",
    blurb: "Defense and aerospace committees",
    Icon: IconDefense,
    tone: "text-red-300 border-red-500/25 bg-red-950/20",
  },
  {
    id: "super-pac",
    label: "Super PACs",
    blurb: "Outside spend for or against candidates",
    Icon: IconSuperPac,
    tone: "text-amber-300 border-amber-500/25 bg-amber-950/20",
  },
] as const;

export default function InfluenceClassGrid() {
  return (
    <section className="scroll-mt-24" id="influence-classes">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
          No industry is invisible
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          Influence classes we track
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Original icons. Public FEC classifications. Every concentrated interest
          treated the same way — we show the dollars, not a hit list of countries
          or logos.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CLASSES.map(({ id, label, blurb, Icon, tone }) => (
          <div
            key={id}
            className={`rounded-xl border p-4 transition hover:border-slate-500 ${tone}`}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-current/20 bg-slate-950/40">
                <Icon className="h-5 w-5" title={label} />
              </span>
              <div>
                <p className="font-semibold text-white">{label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {blurb}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        TrackBack&apos;s view: members should be funded by the people they
        represent — not by concentrated institutional money.{" "}
        <Link href="/about" className="text-blue-400 hover:text-blue-300">
          How scoring works →
        </Link>
      </p>
    </section>
  );
}
