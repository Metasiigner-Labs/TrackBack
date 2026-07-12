import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TrackBack — They track us. We track them back.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #450a0a 0%, #020617 45%, #1e3a8a 100%)",
          padding: 64,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              border: "3px solid #e2e8f0",
              background: "linear-gradient(180deg, #1d4ed8 0%, #1d4ed8 50%, #b91c1c 50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            TB
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#f8fafc", fontSize: 36, fontWeight: 800 }}>
              TrackBack
            </div>
            <div style={{ color: "#94a3b8", fontSize: 20 }}>
              Public accountability · America 250
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              color: "#f8fafc",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 980,
            }}
          >
            They track us. We track them back.
          </div>
          <div style={{ color: "#cbd5e1", fontSize: 28, maxWidth: 900 }}>
            Citizen money vs institutional money — every disclosed industry,
            from public FEC filings.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ width: 120, height: 8, background: "#dc2626", borderRadius: 4 }} />
          <div style={{ width: 120, height: 8, background: "#f1f5f9", borderRadius: 4 }} />
          <div style={{ width: 120, height: 8, background: "#2563eb", borderRadius: 4 }} />
          <div style={{ color: "#64748b", fontSize: 18, marginLeft: 12 }}>
            No accounts. No spin. Just public records.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
