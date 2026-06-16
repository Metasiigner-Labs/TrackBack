import Link from "next/link";
import { dataMeta } from "@/data/politicians";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-white">
              Track<span className="text-red-400">Back</span>
            </p>
            <p className="mt-2 text-sm text-slate-400">
              They track us. We track them back.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Public accountability for congressional money — no accounts, no spin.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#leaderboards" className="hover:text-white">
                  Leaderboards
                </Link>
              </li>
              <li>
                <Link href="/find" className="hover:text-white">
                  Find My Representatives
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About & methodology
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Data sources</p>
            <ul className="mt-3 space-y-1 text-xs text-slate-500">
              <li>FEC — campaign contributions & independent expenditures</li>
              <li>Senate LDA — registered lobbying disclosures</li>
              <li>GovTrack — roll call voting records</li>
              <li>Congress.gov — official member photos</li>
              <li>U.S. Census — zip code to congressional district</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} TrackBack · {dataMeta?.count || "—"} members ·
          FEC {dataMeta?.cycle || "2024"} cycle · Not affiliated with any government
          agency.
        </div>
      </div>
    </footer>
  );
}