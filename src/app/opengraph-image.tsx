import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Zafieon Pharma — Every Dose Matters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card.
 *
 * Built from the same ingredients as the site: navy field, the official mark,
 * the tagline with MATTERS. in magenta, and a hairline register. Set in FM
 * Bolyar so the card matches the brand rather than defaulting to a system face.
 */
export default async function OpengraphImage() {
  const bolyar = await readFile(
    path.join(process.cwd(), "src/fonts/FMBolyarSansPro-700.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#14274B",
          padding: "72px 80px",
          fontFamily: "Bolyar",
        }}
      >
        {/* Mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="62" height="45" viewBox="1882 1342 3236 2315">
            <g fill="#E5188A">
              <path d="M4532,2058.4l-695.9,695.9l-590.4-590.4l695.9-695.9c163-163,427.4-163,590.4,0S4695,1895.4,4532,2058.4z" />
              <path d="M3751.7,2838.7l-695.9,695.9c-163,163-427.4,163-590.5,0c-81.5-81.5-122.3-188.4-122.3-295.2s40.8-213.7,122.3-295.2l695.9-695.9L3751.7,2838.7z" />
              <path d="M5117.9,3657.6H3383c44.8-439.6,416.1-782.6,867.5-782.6S5073.2,3218,5117.9,3657.6z" />
              <path d="M1882.1,1342.4h1735C3572.3,1782,3201,2125,2749.6,2125S1926.8,1782,1882.1,1342.4z" />
            </g>
          </svg>
          <span
            style={{
              fontSize: 30,
              letterSpacing: 9,
              color: "#FFFFFF",
            }}
          >
            ZAFIEON
          </span>
          <span style={{ fontSize: 30, letterSpacing: 9, color: "#E5188A" }}>
            PHARMA
          </span>
        </div>

        {/* Statement */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 118,
              lineHeight: 1,
              letterSpacing: -3,
              color: "#FFFFFF",
            }}
          >
            EVERY DOSE
          </span>
          <span
            style={{
              fontSize: 118,
              lineHeight: 1.05,
              letterSpacing: -3,
              color: "#E5188A",
            }}
          >
            MATTERS.
          </span>
        </div>

        {/* Register */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 26,
          }}
        >
          <span style={{ fontSize: 21, letterSpacing: 4, color: "rgba(255,255,255,0.6)" }}>
            PRECISION IN SCIENCE. CARE IN EVERY DOSE.
          </span>
          <span style={{ fontSize: 21, letterSpacing: 4, color: "rgba(255,255,255,0.35)" }}>
            ZAFIEONPHARMA.COM
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bolyar", data: bolyar, style: "normal", weight: 700 }],
    },
  );
}
