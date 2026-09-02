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
  /**
   * ── The fallback, and why it is hand-written ─────────────────────────────
   * Bolyar is a wide, heavy display face: 1647 units of average advance width
   * on a 2048 em. Poppins is nothing like it, so before the real font arrived
   * every heading laid out at the wrong width, re-wrapped on swap, and shoved
   * the page down — a measured 0.20 layout shift at 390px.
   *
   * `adjustFontFallback: "Arial"` is supposed to fix exactly that, and it made
   * it worse: Next emitted `size-adjust: 1.98%` and `ascent-override: 4926%`
   * for this file. At two per cent of size the fallback text is effectively
   * invisible, and the page grows by three heading lines the instant the real
   * font lands.
   *
   * So the fallback is declared by hand in globals.css as "Bolyar Fallback",
   * from metrics read straight out of the TTF by tools/fontmetrics.mjs. Re-run
   * that script if the font file is ever replaced.
   */
  fallback: ["Bolyar Fallback", "Poppins", "system-ui", "sans-serif"],
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
