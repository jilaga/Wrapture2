import { ImageResponse } from "next/og";

export const alt = "Wrapture — Asaba's hottest shawarma & wraps, delivered in 45 minutes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 100px",
          background:
            "radial-gradient(circle at 20% 80%, hsl(14 60% 22%) 0%, hsl(0 0% 4%) 55%, hsl(0 0% 2%) 100%)",
          color: "hsl(36 30% 94%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textTransform: "uppercase",
            letterSpacing: 6,
            fontSize: 22,
            color: "hsl(2 92% 60%)",
            fontWeight: 600,
          }}
        >
          <span style={{ width: 36, height: 2, background: "hsl(2 92% 60%)" }} />
          Asaba · Delta State
        </div>

        {/* Middle: wordmark */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 220,
              fontWeight: 900,
              letterSpacing: -8,
              lineHeight: 1,
              display: "flex",
            }}
          >
            <span>WRAP</span>
            <span style={{ color: "hsl(2 92% 50%)" }}>TURE</span>
          </div>
          <div
            style={{
              fontSize: 38,
              color: "hsl(36 8% 72%)",
              maxWidth: 920,
              lineHeight: 1.2,
            }}
          >
            Hot shawarma & loaded fries — delivered in 45 minutes.
          </div>
        </div>

        {/* Bottom: meta strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "hsl(36 8% 62%)",
            textTransform: "uppercase",
            letterSpacing: 4,
            borderTop: "1px solid hsl(0 0% 18%)",
            paddingTop: 24,
          }}
        >
          <span>Open daily 11:00 — 23:00</span>
          <span style={{ color: "hsl(2 92% 60%)" }}>wrapture.ng</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
