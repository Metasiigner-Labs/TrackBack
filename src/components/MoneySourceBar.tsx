import { formatCurrency } from "@/lib/utils";

interface MoneySourceBarProps {
  individualPercent: number;
  pacPercent: number;
  individualAmount: number;
  pacAmount: number;
  cycle?: number;
}

export default function MoneySourceBar({
  individualPercent,
  pacPercent,
  individualAmount,
  pacAmount,
  cycle = 2024,
}: MoneySourceBarProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <h3 className="text-lg font-semibold text-white">Where the Money Comes From</h3>
      <p className="mt-1 text-sm text-slate-400">
        Individual vs PAC / committee receipts — FEC {cycle} cycle
      </p>

      <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-slate-800">
        <div
          className="bg-emerald-500 transition-all"
          style={{ width: `${individualPercent}%` }}
          title={`Individuals ${individualPercent}%`}
        />
        <div
          className="bg-red-500 transition-all"
          style={{ width: `${pacPercent}%` }}
          title={`PACs & committees ${pacPercent}%`}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-emerald-300">Individuals</span>
          </div>
          <p className="mt-2 font-mono text-xl font-bold text-white">
            {individualPercent}%
          </p>
          <p className="text-xs text-slate-400">{formatCurrency(individualAmount)}</p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-red-300">PACs & committees</span>
          </div>
          <p className="mt-2 font-mono text-xl font-bold text-white">{pacPercent}%</p>
          <p className="text-xs text-slate-400">{formatCurrency(pacAmount)}</p>
        </div>
      </div>
    </div>
  );
}