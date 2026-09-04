/**
 * Dev-only: split the supplied Ravenbhel certifications sheet into individual
 * regulator marks.
 *
 *   node tools/certcrop.mjs
 *
 * The sheet is one transparent PNG holding eight authority marks laid out in
 * two rows. Nothing is redrawn here: each mark is found by its own opaque
 * pixels, cropped from the original artwork, and written out with its
 * transparency intact.
 *
 * Marks are located by connected components of the alpha channel, dilated
 * first so that a mark's separate parts — an emblem and the wordmark beneath
 * it — join into one region while staying clear of its neighbours.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/certifications/Revenbhel certifications.png";
const OUT = "public/certifications/revenbhel";

/** Alpha above this counts as ink. */
const INK = 24;
/** Mask is worked at 1/SCALE for speed; dilation is in mask pixels. */
const SCALE = 4;
const DILATE = 6;
/** Regions smaller than this fraction of the sheet are specks, not marks. */
const MIN_AREA = 0.0015;

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

const mw = Math.ceil(W / SCALE);
const mh = Math.ceil(H / SCALE);

// Downsample to a binary mask: a mask cell is ink if any pixel under it is.
const mask = new Uint8Array(mw * mh);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * C + 3] > INK) {
      mask[Math.floor(y / SCALE) * mw + Math.floor(x / SCALE)] = 1;
    }
  }
}

// Dilate, so an emblem and the wordmark under it become one region.
const grown = new Uint8Array(mw * mh);
for (let y = 0; y < mh; y++) {
  for (let x = 0; x < mw; x++) {
    if (!mask[y * mw + x]) continue;
    for (let dy = -DILATE; dy <= DILATE; dy++) {
      const yy = y + dy;
      if (yy < 0 || yy >= mh) continue;
      for (let dx = -DILATE; dx <= DILATE; dx++) {
        const xx = x + dx;
        if (xx < 0 || xx >= mw) continue;
        grown[yy * mw + xx] = 1;
      }
    }
  }
}

// Label connected regions, and take each one's bounds from the UNDILATED mask
// so the crop is tight to real ink rather than to the dilation.
const seen = new Uint8Array(mw * mh);
const regions = [];
for (let i = 0; i < grown.length; i++) {
  if (!grown[i] || seen[i]) continue;
  const stack = [i];
  seen[i] = 1;
  let x0 = mw, y0 = mh, x1 = -1, y1 = -1, ink = 0;
  while (stack.length) {
    const p = stack.pop();
    const px = p % mw;
    const py = (p - px) / mw;
    if (mask[p]) {
      ink++;
      if (px < x0) x0 = px;
      if (px > x1) x1 = px;
      if (py < y0) y0 = py;
      if (py > y1) y1 = py;
    }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = px + dx, ny = py + dy;
      if (nx < 0 || ny < 0 || nx >= mw || ny >= mh) continue;
      const n = ny * mw + nx;
      if (grown[n] && !seen[n]) { seen[n] = 1; stack.push(n); }
    }
  }
  if (x1 < 0) continue;
  if (ink / (mw * mh) < MIN_AREA) continue;
  const left = Math.max(0, Math.min(W - 1, x0 * SCALE));
  const top = Math.max(0, Math.min(H - 1, y0 * SCALE));
  const right = Math.min(W, (x1 + 1) * SCALE);
  const bottom = Math.min(H, (y1 + 1) * SCALE);
  if (right - left < 8 || bottom - top < 8) continue;
  regions.push({ left, top, width: right - left, height: bottom - top });
}

/* The sheet's marks, in reading order — top row left to right, then the next.
   The sort below is deterministic, so position is a stable identity.

   Two are deliberately not wired into the page:
     · sheet-04 carries no name this project can verify, and the partner does
       not list a matching registration. Naming a regulator by guesswork to
       caption an emblem is the one thing this codebase exists not to do.
     · who is already rendered from the certification registry, and would
       otherwise appear twice on the same page. */
const NAMES = [
  "efda-ethiopia",
  "fda-philippines",
  "dpm",
  "sheet-04-unidentified",
  "ppb-kenya",
  "nafdac-nigeria",
  "mohap-uae",
  "who",
];

// Reading order: top row left-to-right, then the next.
regions.sort((a, b) => {
  const rowA = Math.round(a.top / (H / 2));
  const rowB = Math.round(b.top / (H / 2));
  return rowA !== rowB ? rowA - rowB : a.left - b.left;
});

await mkdir(OUT, { recursive: true });

console.log(`sheet ${W}x${H} — ${regions.length} mark(s)\n`);
for (const [i, r] of regions.entries()) {
  const name = NAMES[i] ?? `mark-${String(i + 1).padStart(2, "0")}`;
  let out;
  try {
    out = await sharp(SRC)
      .extract(r)
      // No .trim() here: the region is already tight to real ink, taken from
      // the undilated mask, and sharp's trim miscomputes its own extract on
      // several of these marks.
      .resize({ height: 320, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 92, alphaQuality: 100, effort: 6 })
      .toFile(`${OUT}/${name}.webp`);
  } catch (e) {
    console.log(`${name}  FAILED on ${JSON.stringify(r)}  (sheet ${W}x${H}) :: ${e.message}`);
    continue;
  }
  console.log(
    `${name.padEnd(22)} from ${String(r.left).padStart(4)},${String(r.top).padStart(3)} ` +
      `${String(r.width).padStart(4)}x${String(r.height).padStart(3)}  ->  ` +
      `${out.width}x${out.height}  ${(out.size / 1024).toFixed(0)} KB`,
  );
}
