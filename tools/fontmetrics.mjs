/**
 * Dev-only: read the metrics Next needs to size-adjust a fallback face.
 *
 *   node tools/fontmetrics.mjs src/fonts/FMBolyarSansPro-700.ttf
 *
 * Prints the `@font-face` overrides for a metric-matched Arial fallback, so
 * text laid out before the real font arrives occupies exactly the same space
 * as text laid out after it — no reflow on swap, no layout shift.
 *
 * ── Why this is not left to next/font ──────────────────────────────────────
 * `adjustFontFallback: "Arial"` on this face produced `size-adjust: 1.98%` and
 * `ascent-override: 4926%`. Those are not near-misses; the fallback rendered at
 * two per cent of the intended size, and the page grew by three heading lines
 * the moment the real font swapped in — a 0.20 layout shift at 390px, measured.
 * The generator appears to misread this file's units-per-em. Reading the tables
 * directly and writing the overrides by hand is the reliable route.
 *
 * Reads the raw TTF rather than the WOFF2: WOFF2 is Brotli-compressed with a
 * transformed glyf table, and the uncompressed original is in the repo anyway.
 */
import fs from "node:fs";

const file = process.argv[2] ?? "src/fonts/FMBolyarSansPro-700.ttf";
const b = fs.readFileSync(file);

// ── Table directory ─────────────────────────────────────────────────────────
const numTables = b.readUInt16BE(4);
const tables = {};
for (let i = 0; i < numTables; i++) {
  const o = 12 + i * 16;
  tables[b.toString("latin1", o, o + 4)] = {
    offset: b.readUInt32BE(o + 8),
    length: b.readUInt32BE(o + 12),
  };
}

const need = ["head", "hhea", "OS/2", "hmtx", "maxp"];
for (const t of need) {
  if (!tables[t]) {
    console.error(`Missing required table: ${t}`);
    process.exit(1);
  }
}

// ── head: units per em ──────────────────────────────────────────────────────
const unitsPerEm = b.readUInt16BE(tables.head.offset + 18);

// ── hhea: vertical metrics and the horizontal metric count ──────────────────
const hhea = tables.hhea.offset;
const hheaAscender = b.readInt16BE(hhea + 4);
const hheaDescender = b.readInt16BE(hhea + 6);
const hheaLineGap = b.readInt16BE(hhea + 8);
const numberOfHMetrics = b.readUInt16BE(hhea + 34);

// ── OS/2: the typographic metrics browsers actually prefer ──────────────────
const os2 = tables["OS/2"].offset;
const version = b.readUInt16BE(os2);
const sTypoAscender = b.readInt16BE(os2 + 68);
const sTypoDescender = b.readInt16BE(os2 + 70);
const sTypoLineGap = b.readInt16BE(os2 + 72);
const usWinAscent = b.readUInt16BE(os2 + 74);
const usWinDescent = b.readUInt16BE(os2 + 76);
const xAvgCharWidth = b.readInt16BE(os2 + 2);
// fsSelection bit 7 (USE_TYPO_METRICS) says the typo metrics are authoritative.
const useTypo = (b.readUInt16BE(os2 + 62) & 128) !== 0;

// ── hmtx: the real average advance width, measured rather than trusted ──────
// xAvgCharWidth is frequently wrong or zero in converted fonts, which is the
// sort of thing that produces a 1.98% size-adjust.
let total = 0;
for (let i = 0; i < numberOfHMetrics; i++) {
  total += b.readUInt16BE(tables.hmtx.offset + i * 4);
}
const measuredAvg = total / numberOfHMetrics;

// Arial, the reference Next size-adjusts against.
const ARIAL = { unitsPerEm: 2048, ascent: 1854, descent: 434, lineGap: 67, avg: 913 };

const ascent = useTypo && sTypoAscender ? sTypoAscender : hheaAscender || usWinAscent;
const descent = Math.abs(
  useTypo && sTypoDescender ? sTypoDescender : hheaDescender || -usWinDescent,
);
const lineGap = useTypo ? sTypoLineGap : hheaLineGap;

const avg = xAvgCharWidth > 0 ? xAvgCharWidth : measuredAvg;
const sizeAdjust = (avg / unitsPerEm) / (ARIAL.avg / ARIAL.unitsPerEm);

const pct = (n) => `${(n * 100).toFixed(2)}%`;

console.log(`
${file}
${"─".repeat(64)}
  unitsPerEm        ${unitsPerEm}
  OS/2 version      ${version}   USE_TYPO_METRICS ${useTypo}
  ascent            ${ascent}   (${pct(ascent / unitsPerEm)} of em)
  descent           ${descent}   (${pct(descent / unitsPerEm)} of em)
  lineGap           ${lineGap}
  xAvgCharWidth     ${xAvgCharWidth}
  measured avg      ${measuredAvg.toFixed(1)}  over ${numberOfHMetrics} glyphs
  hheaAsc/Desc      ${hheaAscender} / ${hheaDescender}
  winAsc/Desc       ${usWinAscent} / ${usWinDescent}

  Metric-matched Arial fallback:

@font-face {
  font-family: "Bolyar Fallback";
  src: local("Arial");
  size-adjust: ${pct(sizeAdjust)};
  ascent-override: ${pct(ascent / unitsPerEm / sizeAdjust)};
  descent-override: ${pct(descent / unitsPerEm / sizeAdjust)};
  line-gap-override: ${pct(lineGap / unitsPerEm / sizeAdjust)};
}
`);
