import type { LobbyingConnection, LobbyingOrganization } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface LobbyingOrganizationsTableProps {
  organizations: LobbyingOrganization[];
}

const CONNECTION_LABELS: Record<LobbyingConnection, string> = {
  fec_donor: "FEC donor",
  lda_activity: "LDA filing",
  fec_and_lobbying: "FEC + LDA",
};

const CONNECTION_STYLES: Record<LobbyingConnection, string> = {
  fec_donor: "bg-emerald-900/30 text-emerald-300",
  lda_activity: "bg-blue-900/30 text-blue-300",
  fec_and_lobbying: "bg-amber-900/30 text-amber-300",
};

export default function LobbyingOrganizationsTable({
  organizations,
}: LobbyingOrganizationsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/50">
            <th className="px-4 py-3 font-medium text-slate-400">
              Organization
            </th>
            <th className="px-4 py-3 font-medium text-slate-400">Sector</th>
            <th className="px-4 py-3 font-medium text-slate-400">Connection</th>
            <th className="px-4 py-3 text-right font-medium text-slate-400">
              Org lobbying (2024)
            </th>
            <th className="px-4 py-3 text-right font-medium text-slate-400">
              FEC to candidate
            </th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr
              key={org.id}
              className="border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30"
            >
              <td className="px-4 py-3">
                <span className="font-medium text-white">{org.name}</span>
                {org.detail && (
                  <span className="mt-1 block text-xs text-slate-500">
                    {org.detail}
                  </span>
                )}
                {org.issues.length > 0 && (
                  <span className="mt-1 block text-xs text-slate-600">
                    Issues: {org.issues.join(", ")}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-400">{org.sector}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${CONNECTION_STYLES[org.connection]}`}
                >
                  {CONNECTION_LABELS[org.connection]}
                </span>
                {org.filingCount > 0 && (
                  <span className="mt-1 block text-xs text-slate-500">
                    {org.filingCount} LDA filing{org.filingCount !== 1 ? "s" : ""}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right font-mono text-white">
                {org.lobbyingSpend2024 > 0
                  ? formatCurrency(org.lobbyingSpend2024)
                  : "—"}
              </td>
              <td className="px-4 py-3 text-right font-mono text-white">
                {org.fecAmount > 0 ? formatCurrency(org.fecAmount) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}