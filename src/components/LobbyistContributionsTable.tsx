import type { LobbyistContributionEvent } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface LobbyistContributionsTableProps {
  total2024: number;
  eventCount: number;
  events: LobbyistContributionEvent[];
}

export default function LobbyistContributionsTable({
  total2024,
  eventCount,
  events,
}: LobbyistContributionsTableProps) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <p className="text-slate-300">
          <span className="font-semibold text-white">2024 total:</span>{" "}
          <span className="font-mono text-amber-300">{formatCurrency(total2024)}</span>
        </p>
        <p className="text-slate-400">
          {eventCount} reported event{eventCount !== 1 ? "s" : ""} (LD-203)
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="px-4 py-3 font-medium text-slate-400">Lobbyist / payee</th>
              <th className="px-4 py-3 font-medium text-slate-400">Registrant</th>
              <th className="px-4 py-3 font-medium text-slate-400">Type</th>
              <th className="px-4 py-3 font-medium text-slate-400">Date</th>
              <th className="px-4 py-3 text-right font-medium text-slate-400">Amount</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => (
              <tr
                key={`${event.payeeName}-${event.date}-${i}`}
                className="border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30"
              >
                <td className="px-4 py-3 font-medium text-white">{event.payeeName}</td>
                <td className="px-4 py-3 text-slate-400">{event.registrantName || "—"}</td>
                <td className="px-4 py-3 text-slate-400">{event.contributionType}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{event.date || "—"}</td>
                <td className="px-4 py-3 text-right font-mono text-white">
                  {formatCurrency(event.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        Lobbyist-hosted contributions to this official from LDA.gov LD-203 filings (2024).
        Verify each event in the source filing at lda.gov.
      </p>
    </div>
  );
}