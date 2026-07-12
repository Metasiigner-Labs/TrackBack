import { ImageResponse } from "next/og";
import { politicians } from "@/data/politicians";
import { getIndividualVsPacPercent } from "@/lib/score-summary";

// Node runtime — politicians.json is large; edge bundle limits are too tight.
export const alt = "TrackBack politician money profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function PoliticianOpenGraphImage({
  params,
}: {
  params: { id: string };
}) {
  const politician = politicians.find((p) => p.id === params.id);
  const name = politician?.name || "Member of Congress";
  const score = politician?.purityScore ?? 0;
  const party = politician?.party || "";
  const chamber = politician?.chamber || "";
  const state = politician?.state || "";
  const split = politician
    ? getIndividualVsPacPercent(politician)
    : { individualPercent: 0, pacPercent: 0 };

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #0f172a 0%, #020617 55%, #1e3a8a 100%)",
          padding: 56,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ color: "#f87171", fontSize: 22, fontWeight: 700 }}>
              TrackBack
            </div>
            <div style={{ color: "#f8fafc", fontSize: 52, fontWeight: 800, maxWidth: 780 }}>
              {name}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 26 }}>
              {[party, chamber, state].filter(Boolean).join(" · ")}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 160,
              height: 160,
              borderRadius: 999,
              border: "6px solid #334155",
              background: "#0f172a",
              color: score >= 70 ? "#34d399" : score >= 45 ? "#fbbf24" : "#f87171",
              fontSize: 56,
              fontWeight: 800,
            }}
          >
            {score}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
          <div style={{ color: "#e2e8f0", fontSize: 26, fontWeight: 600 }}>
            Citizen money {split.individualPercent}% · Institutions {split.pacPercent}%
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 28,
              borderRadius: 999,
              overflow: "hidden",
              background: "#1e293b",
            }}
          >
            <div
              style={{
                width: `${split.individualPercent}%`,
                background: "linear-gradient(90deg, #059669, #34d399)",
                height: "100%",
              }}
            />
            <div
              style={{
                width: `${split.pacPercent}%`,
                background: "linear-gradient(90deg, #ef4444, #991b1b)",
                height: "100%",
              }}
            />
          </div>
          <div style={{ color: "#64748b", fontSize: 22 }}>
            They track us. We track them back. · Public FEC data
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
