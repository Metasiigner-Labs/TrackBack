"use client";

import Link from "next/link";
import { useState } from "react";
import TrackBackCrest from "@/components/TrackBackCrest";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#leaderboards", label: "Leaderboards" },
  { href: "/#influence-classes", label: "Influence" },
  { href: "/transparency", label: "Transparency" },
  { href: "/find", label: "Find My Reps" },
  { href: "/about", label: "About" },
  { href: "/legal", label: "Legal" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={close}
        >
          <TrackBackCrest size="sm" />
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-slate-200">
            Track<span className="text-red-400">Back</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/find"
            className="ml-2 rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            Find my reps
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/find"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
            onClick={close}
          >
            Find my reps
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-slate-800 bg-slate-950 px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
