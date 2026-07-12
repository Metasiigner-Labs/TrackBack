/**
 * Original TrackBack sector icons — geometric silhouettes only.
 * No national flags, no corporate trademarks, no personal likenesses.
 */

import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function baseProps(props: IconProps) {
  const { title, className, ...rest } = props;
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: className ?? "h-5 w-5",
    role: title ? ("img" as const) : ("presentation" as const),
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
    ...rest,
  };
}

export function IconPeople(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19c0-2.8 2.7-5 6-5s6 2.2 6 5" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M17 14c2.2.3 4 1.9 4 4" />
    </svg>
  );
}

export function IconInstitution(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M4 20h16" />
      <path d="M6 20V10l6-4 6 4v10" />
      <path d="M10 20v-4h4v4" />
      <path d="M9 12h.01M12 12h.01M15 12h.01" />
    </svg>
  );
}

export function IconPharma(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <rect x="8" y="3" width="8" height="6" rx="1" />
      <path d="M9 9v9a3 3 0 0 0 6 0V9" />
      <path d="M10 14h4" />
    </svg>
  );
}

export function IconHealth(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M4 12h4l2-5 3 10 2-5h5" />
    </svg>
  );
}

export function IconFinance(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M4 19h16" />
      <path d="M7 19V11" />
      <path d="M12 19V7" />
      <path d="M17 19v-5" />
      <path d="M4 8l5 3 4-6 7 5" />
    </svg>
  );
}

export function IconAuto(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M4 14h16l-1.5-5.5A2 2 0 0 0 16.6 7H7.4a2 2 0 0 0-1.9 1.5L4 14z" />
      <path d="M6 14v2a1 1 0 0 0 1 1h1" />
      <path d="M16 17h1a1 1 0 0 0 1-1v-2" />
      <circle cx="8" cy="17" r="1.4" />
      <circle cx="16" cy="17" r="1.4" />
    </svg>
  );
}

export function IconGambling(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <rect x="4" y="4" width="10" height="10" rx="1.5" />
      <rect x="10" y="10" width="10" height="10" rx="1.5" />
      <circle cx="7.5" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="17.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconEnergy(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M5 7l2 2" />
      <path d="M17 15l2 2" />
      <path d="M5 17l2-2" />
      <path d="M17 9l2-2" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export function IconDefense(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9.5C7.5 20.5 4 17 4 12V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconSuperPac(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
    </svg>
  );
}

export function IconTech(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <rect x="5" y="5" width="14" height="10" rx="1.5" />
      <path d="M9 19h6" />
      <path d="M12 15v4" />
    </svg>
  );
}

export function IconAg(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M12 20V9" />
      <path d="M12 9c-3 0-6 2-6 6 4 0 6-2 6-6z" />
      <path d="M12 9c3 0 6 2 6 6-4 0-6-2-6-6z" />
      <path d="M8 20h8" />
    </svg>
  );
}

export function IconLabor(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M8 7h8v3a4 4 0 0 1-8 0V7z" />
      <path d="M10 14v6" />
      <path d="M14 14v6" />
      <path d="M7 20h10" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function IconTobacco(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M4 15h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H4z" />
      <path d="M18 12c1.5 0 2.5-1 2.5-2.5S19.5 7 18 7" />
    </svg>
  );
}

export function IconPrisons(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M5 20V6h14v14" />
      <path d="M5 10h14" />
      <path d="M9 10v10" />
      <path d="M15 10v10" />
    </svg>
  );
}

export function IconCivic(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8" />
      <path d="M8.5 12h7" />
    </svg>
  );
}

export function IconGeneric(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      {props.title ? <title>{props.title}</title> : null}
      <circle cx="12" cy="12" r="8" />
      <path d="M8 12h8" />
    </svg>
  );
}

export type SectorIconId =
  | "people"
  | "institution"
  | "pharma"
  | "health"
  | "finance"
  | "auto"
  | "gambling"
  | "energy"
  | "defense"
  | "super-pac"
  | "tech"
  | "agriculture"
  | "labor"
  | "tobacco"
  | "private-prisons"
  | "civic"
  | "generic";

const ICON_MAP: Record<
  SectorIconId,
  (props: IconProps) => ReactElement
> = {
  people: IconPeople,
  institution: IconInstitution,
  pharma: IconPharma,
  health: IconHealth,
  finance: IconFinance,
  auto: IconAuto,
  gambling: IconGambling,
  energy: IconEnergy,
  defense: IconDefense,
  "super-pac": IconSuperPac,
  tech: IconTech,
  agriculture: IconAg,
  labor: IconLabor,
  tobacco: IconTobacco,
  "private-prisons": IconPrisons,
  civic: IconCivic,
  generic: IconGeneric,
};

/** Map FEC/taxonomy sector ids and labels to original icons. */
export function resolveSectorIconId(
  sectorId?: string,
  label?: string
): SectorIconId {
  const id = (sectorId || "").toLowerCase();
  const text = `${id} ${label || ""}`.toLowerCase();

  if (
    id === "pharma" ||
    text.includes("pharma") ||
    text.includes("biotech") ||
    text.includes("drug")
  ) {
    return "pharma";
  }
  if (
    id === "health" ||
    id === "healthcare" ||
    text.includes("health") ||
    text.includes("insurance") ||
    text.includes("hospital")
  ) {
    return "health";
  }
  if (
    id === "fintech" ||
    id === "finance" ||
    text.includes("financ") ||
    text.includes("bank") ||
    text.includes("invest") ||
    text.includes("asset")
  ) {
    return "finance";
  }
  if (
    id === "auto" ||
    text.includes("auto") ||
    text.includes("motor") ||
    text.includes("vehicle")
  ) {
    return "auto";
  }
  if (
    id === "gambling" ||
    text.includes("gambling") ||
    text.includes("casino") ||
    text.includes("gaming")
  ) {
    return "gambling";
  }
  if (
    id === "fossil-fuels" ||
    id === "energy" ||
    text.includes("oil") ||
    text.includes("gas") ||
    text.includes("energy") ||
    text.includes("fossil")
  ) {
    return "energy";
  }
  if (
    id === "defense" ||
    text.includes("defense") ||
    text.includes("aerospace") ||
    text.includes("military")
  ) {
    return "defense";
  }
  if (
    id === "political-committee" ||
    id === "super-pac" ||
    text.includes("super pac") ||
    text.includes("political committee") ||
    text.includes("pac")
  ) {
    return "super-pac";
  }
  if (id === "tech" || text.includes("tech") || text.includes("software")) {
    return "tech";
  }
  if (
    id === "agriculture" ||
    text.includes("agri") ||
    text.includes("farm") ||
    text.includes("food")
  ) {
    return "agriculture";
  }
  if (id === "labor" || text.includes("union") || text.includes("labor")) {
    return "labor";
  }
  if (id === "tobacco" || text.includes("tobacco")) return "tobacco";
  if (
    id === "private-prisons" ||
    text.includes("prison") ||
    text.includes("detention")
  ) {
    return "private-prisons";
  }
  if (
    id === "civic-advocacy" ||
    id === "pro-israel" ||
    id === "conservative-youth" ||
    id === "fraternal" ||
    text.includes("advocacy") ||
    text.includes("civic")
  ) {
    return "civic";
  }

  return "generic";
}

export function SectorIcon({
  sectorId,
  label,
  className,
  title,
}: {
  sectorId?: string;
  label?: string;
  className?: string;
  title?: string;
}) {
  const resolved = resolveSectorIconId(sectorId, label);
  const Cmp = ICON_MAP[resolved] || IconGeneric;
  return <Cmp className={className} title={title || label} />;
}
