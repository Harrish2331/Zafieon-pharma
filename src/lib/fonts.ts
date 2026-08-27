import localFont from "next/font/local";
import { Poppins } from "next/font/google";

/**
 * FM Bolyar Sans Pro — the official Zafieon display face.
 * Only the 700 weight was supplied in the branding package, so display type is
 * always set at 700. Converted TTF → WOFF2 (124 KB → 37 KB) at build setup.
 */
export const bolyar = localFont({
  src: [
    {
      path: "../fonts/FMBolyarSansPro-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bolyar",
  display: "swap",
  // Metric-matched fallback so the hero does not reflow on font load.
  fallback: ["Poppins", "system-ui", "sans-serif"],
  adjustFontFallback: false,
});

/**
 * Poppins — the official secondary face, used for body copy, navigation,
 * buttons, product information, metadata and forms.
 */
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});
