import Link from "next/link";
import TrackBackCrest from "@/components/TrackBackCrest";
import { dataMeta } from "@/data/politicians";
import { GITHUB_URL, NON_MONETIZATION_PLEDGE } from "@/lib/compliance";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <TrackBackCrest size="sm" />
              <p className="text-lg font-bold text-white">
                Track<span className="text-red-400">Back</span>
              </p>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              They track us. We track them back.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Citizen money vs institutional money — no accounts, no spin.
              Original icons only; no corporate logos or foreign flags.
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
                <Link href="/transparency" className="hover:text-white">
                  Transparency hub
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About & methodology
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-white">
                  Legal & commitments
                </Link>
              </li>
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Open source (GitHub)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Data sources</p>
            <ul className="mt-3 space-y-1 text-xs text-slate-500">
              <li>FEC — campaign contributions & independent expenditures</li>
              <li>LDA.gov — registered lobbying disclosures</li>
              <li>GovTrack — roll call voting records</li>
              <li>Congress.gov — official member photos</li>
              <li>U.S. Census — zip code to congressional district</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
          <p>{NON_MONETIZATION_PLEDGE}</p>
          <p className="mt-2">
            © {new Date().getFullYear()} TrackBack · {dataMeta?.count || "—"} members ·
            FEC {dataMeta?.cycle || "2024"} cycle · Not affiliated with any government
            agency.
          </p>
        </div>
      </div>
    </footer>
  );
}