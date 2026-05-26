import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 360,
          letterSpacing: -12,
          lineHeight: 1,
        }}
      >
        W
      </div>
    ),
    { ...size },
  );
}
