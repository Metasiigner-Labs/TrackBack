import type { Donor } from "@/lib/types";
import { FEC_CONTRIBUTOR_NOTICE } from "@/lib/compliance";
import { formatCurrency } from "@/lib/utils";

interface DonorTableProps {
  donors: Donor[];
  showIndustry?: boolean;
  limit?: number;
}

export default function DonorTable({
  donors,
  showIndustry = true,
  limit,
}: DonorTableProps) {
  const displayed = limit ? donors.slice(0, limit) : donors;

  return (
    <div>
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/50">
            <th className="px-4 py-3 font-medium text-slate-400">Donor</th>
            {showIndustry && (
              <th className="px-4 py-3 font-medium text-slate-400">
                Industry
              </th>
            )}
            <th className="px-4 py-3 font-medium text-slate-400">Type</th>
            <th className="px-4 py-3 text-right font-medium text-slate-400">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((donor, i) => (
            <tr
              key={`${donor.name}-${i}`}
              className="border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30"
            >
              <td className="px-4 py-3 font-medium text-white">
                {donor.name}
                {donor.employer && (
                  <span className="mt-0.5 block text-xs font-normal text-slate-500">
                    {donor.employer}
                  </span>
                )}
              </td>
              {showIndustry && (
                <td className="px-4 py-3 text-slate-400">{donor.industry}</td>
              )}
              <td className="px-4 py-3">
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    donor.type === "Corporate" || donor.type === "Lobbyist"
                      ? "bg-red-900/30 text-red-300"
                      : donor.type === "PAC"
                        ? "bg-amber-900/30 text-amber-300"
                        : "bg-emerald-900/30 text-emerald-300"
                  }`}
                >
                  {donor.type}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-white">
                {formatCurrency(donor.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="mt-2 text-xs leading-relaxed text-slate-600">
      {FEC_CONTRIBUTOR_NOTICE}
    </p>
    </div>
  );
}