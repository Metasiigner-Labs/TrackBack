import type { OutsideSpending } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface OutsideSpendingTableProps {
  spending: OutsideSpending[];
}

export default function OutsideSpendingTable({
  spending,
}: OutsideSpendingTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/50">
            <th className="px-4 py-3 font-medium text-slate-400">Spender</th>
            <th className="px-4 py-3 font-medium text-slate-400">Position</th>
            <th className="px-4 py-3 text-right font-medium text-slate-400">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {spending.map((row, i) => (
            <tr
              key={`${row.spender}-${row.position}-${i}`}
              className={`border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 ${
                row.isProIsraelAdvocacy ? "bg-amber-950/10" : ""
              }`}
            >
              <td className="px-4 py-3 font-medium text-white">
                {row.spender}
                {row.isProIsraelAdvocacy && (
                  <span className="ml-2 rounded bg-amber-900/40 px-1.5 py-0.5 text-xs text-amber-300">
                    Pro-Israel PAC
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    row.position === "support"
                      ? "bg-emerald-900/30 text-emerald-300"
                      : "bg-red-900/30 text-red-300"
                  }`}
                >
                  {row.position === "support" ? "Supporting" : "Opposing"}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-white">
                {formatCurrency(row.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}