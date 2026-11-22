import { ImageResponse } from "next/og";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/components/brand/logo-paths";
import { site } from "@/content/site";

export const alt = `${site.studio} — ${site.roles.join(" · ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Gold-on-green Open Graph card, generated at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at 50% 45%, #174a33 0%, #0B2419 55%, #071A12 100%)",
          color: "#C9A24B",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: "1px solid rgba(201,162,75,0.35)", display: "flex" }} />
        <svg width="520" height="168" viewBox={LOGO_VIEWBOX} fill="none">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="310" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#E8CF8A" />
              <stop offset="0.5" stopColor="#C9A24B" />
              <stop offset="1" stopColor="#9C7A32" />
            </linearGradient>
          </defs>
          {LOGO_PATHS.map((d) => (
            <path key={d} d={d} stroke="url(#g)" strokeWidth={3.2} strokeLinecap="square" />
          ))}
        </svg>
        <div style={{ marginTop: 56, fontSize: 22, letterSpacing: 10, textTransform: "uppercase", color: "#E8CF8A", display: "flex" }}>
          {site.studio}
        </div>
        <div style={{ marginTop: 18, fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: "rgba(233,223,199,0.75)", display: "flex" }}>
          {site.roles.join("  ·  ")}
        </div>
      </div>
    ),
    size,
  );
}
