import type { Politician } from "@/lib/types";
import { getPartyColor } from "@/lib/utils";

interface PartyBadgeProps {
  party: Politician["party"];
}

export default function PartyBadge({ party }: PartyBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getPartyColor(party)}`}
    >
      {party}
    </span>
  );
}