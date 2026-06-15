import type { IndustryBreakdownItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const SECTOR_COLORS: Record<string, string> = {
  "pro-israel": "bg-amber-500",
  pharma: "bg-rose-500",
  "fossil-fuels": "bg-orange-600",
  agriculture: "bg-lime-600",
  tech: "bg-blue-500",
  fintech: "bg-yellow-500",
  defense: "bg-red-700",
  tobacco: "bg-stone-500",
  "private-prisons": "bg-purple-700",
  labor: "bg-sky-500",
  "civic-advocacy": "bg-indigo-500",
  "conservative-youth": "bg-red-500",
  fraternal: "bg-teal-600",
  "political-committee": "bg-slate-500",
};

interface IndustryBreakdownProps {
  items: IndustryBreakdownItem[];
  totalTracked?: number;
}

export default function IndustryBreakdown({
  items,
  totalTracked,
}: IndustryBreakdownProps) {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 text-center text-slate-500">
        No classified industry data for this cycle.
      </div>
    );
  }

  const maxAmount = items[0]?.amount || 1;
  const trackedTotal =
    totalTracked || items.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400">
        Every reported dollar classified into sectors — PACs, employers, outside
        spenders, and itemized individuals (FEC).
      </p>
      {totalTracked ? (
        <p className="text-xs text-slate-500">
          Classified total:{" "}
          <span className="font-mono text-slate-300">
            {formatCurrency(trackedTotal)}
          </span>
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="px-4 py-3 font-medium text-slate-400">Sector</th>
              <th className="px-4 py-3 font-medium text-slate-400">Share</th>
              <th className="px-4 py-3 text-right font-medium text-slate-400">
                Amount
              </th>
              <th className="hidden px-4 py-3 text-right font-medium text-slate-400 sm:table-cell">
                Sources
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const barWidth = Math.max(4, (item.amount / maxAmount) * 100);
              const barColor =
                SECTOR_COLORS[item.id] || "bg-slate-600";

              return (
                <tr
                  key={item.id}
                  className="border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-white">{item.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-slate-400">
                        {item.percent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-white">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-slate-500 sm:table-cell">
                    {item.sourceCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}