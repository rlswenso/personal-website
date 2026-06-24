import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 22 }).map((_, i) => {
            const t = i / 21;
            const x = 8 + t * 84;
            const y = 50 + Math.sin(t * Math.PI * 2 * 1.1) * 18;
            const r = 0.8 + t * 2.4;
            const opacity = 0.15 + t * 0.85;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={r}
                fill="#fafafa"
                opacity={opacity}
              />
            );
          })}
        </svg>
      </div>
    ),
    { ...size },
  );
}
