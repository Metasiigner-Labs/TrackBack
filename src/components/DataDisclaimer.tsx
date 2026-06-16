import { dataMeta } from "@/data/politicians";

export default function DataDisclaimer() {
  const syncedDate = dataMeta?.syncedAt
    ? new Date(dataMeta.syncedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="border-b border-blue-500/20 bg-blue-950/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-blue-200">
          <span className="font-semibold text-white">Live public data.</span>{" "}
          FEC {dataMeta?.cycle || "2024"} cycle · Senate LDA lobbying ·{" "}
          <a
            href="https://www.govtrack.us/"
            className="underline hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            GovTrack
          </a>{" "}
          votes ·{" "}
          <a
            href="https://www.congress.gov/"
            className="underline hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Congress.gov
          </a>{" "}
          photos.
          {syncedDate ? (
            <span className="text-blue-300/80">
              {" "}
              Synced from public filings {syncedDate}.
            </span>
          ) : null}
        </p>
        <p className="shrink-0 text-xs text-blue-300/60">
          {dataMeta?.count || "—"} members · 137 tracked lobbying orgs
        </p>
      </div>
    </div>
  );
}