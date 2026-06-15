import type { Politician } from "./types";

export function avatarUrl(name: string): string {
  const encoded = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encoded}&background=1e293b&color=e2e8f0&size=256&bold=true`;
}

export function getPoliticianById(id: string, politicians: Politician[]): Politician | undefined {
  return politicians.find((p) => p.id === id);
}

export function getRankedPoliticians(politicians: Politician[]): Politician[] {
  return politicians.filter((p) => p.hasFinancialData !== false);
}

export function getCleanestPoliticians(politicians: Politician[], limit = 10): Politician[] {
  return getRankedPoliticians(politicians)
    .sort((a, b) => b.purityScore - a.purityScore)
    .slice(0, limit);
}

export function getMostCompromisedPoliticians(politicians: Politician[], limit = 10): Politician[] {
  return getRankedPoliticians(politicians)
    .sort((a, b) => a.purityScore - b.purityScore)
    .slice(0, limit);
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

export function getPartyColor(party: Politician["party"]): string {
  switch (party) {
    case "Democrat":
      return "bg-blue-600/20 text-blue-300 border-blue-500/30";
    case "Republican":
      return "bg-red-600/20 text-red-300 border-red-500/30";
    case "Independent":
      return "bg-purple-600/20 text-purple-300 border-purple-500/30";
  }
}