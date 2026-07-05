import Link from "next/link";
import { TRANSPARENCY_CATEGORIES } from "@/data/transparency-links";
import { NON_MONETIZATION_PLEDGE } from "@/lib/compliance";

export default function TransparencyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-white"
      >
        <span aria-hidden="true">{"\u2190"}</span> Back to TrackBack
      </Link>

      <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
        America 250 · Know your government
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Transparency hub
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-400">
        Every link goes to an official .gov source or TrackBack&apos;s own public
        data. We organize what exists — we don&apos;t invent accusations. If you
        see fraud, report it through the proper channel below.
      </p>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-200/90">
        <strong className="text-amber-100">Not a tipline.</strong> TrackBack routes
        you to official agencies. Posting unverified fraud claims online can harm
        innocent people and may be defamatory.
      </div>

      <div className="mt-10 space-y-10">
        {TRANSPARENCY_CATEGORIES.map((category) => (
          <section
            key={category.id}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-6"
          >
            <h2 className="text-xl font-semibold text-white">{category.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{category.summary}</p>
            <ul className="mt-5 space-y-4">
              {category.links.map((link) => (
                <li key={link.href + link.title}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                    className="group block rounded-lg border border-slate-800 bg-slate-950/50 p-4 transition hover:border-blue-500/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium text-blue-300 group-hover:text-blue-200">
                        {link.title} →
                      </span>
                      {link.official && (
                        <span className="shrink-0 rounded bg-emerald-950/60 px-2 py-0.5 text-xs text-emerald-400">
                          .gov
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{link.description}</p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-slate-600">{NON_MONETIZATION_PLEDGE}</p>
    </div>
  );
}