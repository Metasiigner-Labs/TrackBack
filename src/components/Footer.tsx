import { dataMeta } from "@/data/politicians";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold text-white">
              Track<span className="text-red-400">Back</span>
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Public accountability for congressional money.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <p>Data sources: FEC, GovTrack, Congress.gov, U.S. Census</p>
            <p className="mt-1">
              Not affiliated with any government agency. For educational and
              accountability purposes.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} TrackBack · {dataMeta?.count || "—"}{" "}
          members · {dataMeta?.cycle || "2024"} cycle · No accounts. Just facts.
        </div>
      </div>
    </footer>
  );
}