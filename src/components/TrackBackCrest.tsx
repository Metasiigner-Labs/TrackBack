/**
 * Original TrackBack civic crest — ledger + star geometry.
 * Not a government seal; independent accountability mark.
 */

interface TrackBackCrestProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-9 w-9",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

export default function TrackBackCrest({
  size = "md",
  className = "",
}: TrackBackCrestProps) {
  return (
    <div
      className={`relative ${SIZES[size]} ${className}`}
      role="img"
      aria-label="TrackBack civic crest"
    >
      <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="tb-crest-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="45%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="tb-crest-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* Outer ring */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="url(#tb-crest-fill)"
          stroke="url(#tb-crest-ring)"
          strokeWidth="3"
        />

        {/* Stripe field (lower half) */}
        <clipPath id="tb-lower">
          <path d="M8 40 a32 32 0 0 0 64 0" />
        </clipPath>
        <g clipPath="url(#tb-lower)">
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x="8"
              y={40 + i * 7}
              width="64"
              height="3.5"
              fill={i % 2 === 0 ? "#b91c1c" : "#f1f5f9"}
              opacity="0.85"
            />
          ))}
        </g>

        {/* Star field (upper) */}
        <path
          d="M8 40 a32 32 0 0 1 64 0"
          fill="#1d4ed8"
          opacity="0.9"
        />
        {[
          [28, 22],
          [40, 18],
          [52, 22],
          [34, 30],
          [46, 30],
        ].map(([x, y], i) => (
          <polygon
            key={i}
            points={starPoints(x, y, 3.2, 1.4)}
            fill="#f8fafc"
          />
        ))}

        {/* Ledger book (center) */}
        <rect
          x="28"
          y="34"
          width="24"
          height="18"
          rx="1.5"
          fill="#0f172a"
          stroke="#e2e8f0"
          strokeWidth="1.2"
        />
        <line x1="40" y1="34" x2="40" y2="52" stroke="#94a3b8" strokeWidth="1" />
        <line x1="31" y1="40" x2="37" y2="40" stroke="#64748b" strokeWidth="1" />
        <line x1="31" y1="44" x2="37" y2="44" stroke="#64748b" strokeWidth="1" />
        <line x1="43" y1="40" x2="49" y2="40" stroke="#64748b" strokeWidth="1" />
        <line x1="43" y1="44" x2="49" y2="44" stroke="#64748b" strokeWidth="1" />
      </svg>
    </div>
  );
}

function starPoints(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 2) * -1 + (i * Math.PI) / 5;
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(" ");
}
