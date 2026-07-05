import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#leaderboards", label: "Leaderboards" },
  { href: "/transparency", label: "Transparency" },
  { href: "/find", label: "Find My Reps" },
  { href: "/about", label: "About" },
  { href: "/legal", label: "Legal" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-red-600 via-white to-blue-600 text-xs font-black text-slate-950">
            TB
          </span>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-slate-200">
            Track<span className="text-red-400">Back</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}