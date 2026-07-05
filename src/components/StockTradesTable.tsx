import type { Politician, StockTrade } from "@/lib/types";
import { STOCK_ACT_NOTICE } from "@/lib/compliance";

function TradeRow({ trade }: { trade: StockTrade }) {
  return (
    <tr className="border-b border-slate-800/80 text-sm">
      <td className="py-3 pr-4 text-slate-300">{trade.transactionDate || "—"}</td>
      <td className="py-3 pr-4">
        {trade.ticker ? (
          <span className="font-mono font-semibold text-amber-300">{trade.ticker}</span>
        ) : (
          <span className="text-slate-500">—</span>
        )}
      </td>
      <td className="py-3 pr-4 text-slate-400">
        <span
          className={
            trade.type.toLowerCase().includes("purchase")
              ? "text-emerald-400"
              : trade.type.toLowerCase().includes("sale")
                ? "text-rose-400"
                : "text-slate-300"
          }
        >
          {trade.type}
        </span>
        {trade.owner ? (
          <span className="ml-1 text-xs text-slate-600">({trade.owner})</span>
        ) : null}
      </td>
      <td className="py-3 pr-4 font-mono text-xs text-slate-500">{trade.amount}</td>
      <td className="py-3">
        {trade.sourceUrl ? (
          <a
            href={trade.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline"
          >
            PTR filing
          </a>
        ) : null}
      </td>
    </tr>
  );
}

export default function StockTradesTable({ politician }: { politician: Politician }) {
  const trades = politician.stockTrades;
  const disclosureUrl = politician.stockDisclosureUrl;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">STOCK Act trades</h2>
          <p className="mt-1 text-sm text-slate-500">
            Periodic Transaction Reports — federal law requires disclosure within 45 days
          </p>
        </div>
        {disclosureUrl ? (
          <a
            href={disclosureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500"
          >
            Official search →
          </a>
        ) : null}
      </div>

      {trades && trades.recentTrades.length > 0 ? (
        <>
          <p className="mt-3 text-sm text-slate-400">
            <span className="font-medium text-slate-300">{trades.tradeCount}</span>{" "}
            reported trade{trades.tradeCount !== 1 ? "s" : ""} since 2023
            {trades.lastDisclosureDate ? (
              <> · latest disclosure {trades.lastDisclosureDate}</>
            ) : null}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Ticker</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Amount (range)</th>
                  <th className="pb-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {trades.recentTrades.map((trade, i) => (
                  <TradeRow key={`${trade.transactionDate}-${trade.ticker}-${i}`} trade={trade} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No recent House PTR trades matched for this member in our dataset.{" "}
          {politician.chamber === "Senate"
            ? "Senate PTR ingestion is coming — use the official search link above."
            : "They may not have traded, or filings are pending."}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-slate-600">{STOCK_ACT_NOTICE}</p>
    </section>
  );
}