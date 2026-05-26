import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "hsl(0 0% 4%)",
          color: "hsl(2 92% 50%)",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 900,
          fontSize: 130,
          letterSpacing: -4,
          borderRadius: 36,
        }}
      >
        W
      </div>
    ),
    { ...size },
  );
}
