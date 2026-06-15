import { getScoreColor, getScoreLabel } from "@/lib/purity-score";

interface PurityScoreDisplayProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeClasses = {
  sm: { score: "text-2xl", suffix: "text-sm", label: "text-xs" },
  md: { score: "text-4xl", suffix: "text-lg", label: "text-sm" },
  lg: { score: "text-6xl", suffix: "text-2xl", label: "text-base" },
};

export default function PurityScoreDisplay({
  score,
  size = "md",
  showLabel = true,
}: PurityScoreDisplayProps) {
  const classes = sizeClasses[size];
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div className="text-center">
      <div className="flex items-baseline justify-center gap-1">
        <span className={`font-bold tabular-nums ${color} ${classes.score}`}>
          {score}
        </span>
        <span className={`text-slate-500 ${classes.suffix}`}>/100</span>
      </div>
      {showLabel && (
        <p className={`mt-1 font-medium ${color} ${classes.label}`}>{label}</p>
      )}
    </div>
  );
}