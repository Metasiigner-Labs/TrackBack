import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-red-600 via-white to-blue-600 text-xs font-black text-slate-950">
            TB
          </span>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-slate-200">
            Track<span className="text-red-400">Back</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/find"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Find My Rep
          </Link>
          <Link
            href="/#leaderboards"
            className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:block"
          >
            Leaderboards
          </Link>
          <Link
            href="/#purity-score"
            className="hidden text-sm font-medium text-slate-300 transition hover:text-white md:block"
          >
            Purity Score
          </Link>
        </nav>
      </div>
    </header>
  );
}