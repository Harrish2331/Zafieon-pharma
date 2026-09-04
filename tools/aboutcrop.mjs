/**
 * Dev-only: derive the five "What Drives Us" photographs from the supplied
 * artwork.
 *
 *   node tools/aboutcrop.mjs
 *
 * Three of the five supplied files are comps of the whole section: the value
 * list, the brand pattern and the magenta rule are painted into the pixels.
 * All five carry a curved left edge painted against paper-100 (#f4f6f9 — they
 * were rendered from the real design system).
 *
 * ── The geometry, measured from the comps ──────────────────────────────────
 * The three section comps agree closely. The photograph panel:
 *
 *   · is 1.216-1.232 wide for 1 tall — landscape, not portrait
 *   · begins at 51.6-52.2% across the frame
 *   · has its arc at its leftmost 46-49% of the way down, i.e. mid-height
 *
 * So the curve is one symmetric shape, and it is baked here as an alpha
 * channel taken from the comps themselves rather than approximated in CSS.
 * The section's own background and pattern then show through it exactly as
 * the comps show, and the shape is identical across all five.
 *
 * The two remaining files are plain banners — the arc sits near their left
 * edge and the subject is centre-right — so they are cropped to the same 1.22
 * window anchored to keep the subject, and given the same mask.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/images/About us";
const OUT = "public/images/about";

/** The panel's shape, from the comps. */
const ASPECT = 1.22;

/** Trace the painted arc: for each row, the first column that is photograph.
 *  Detected on blueness — the paper ground is neutral (R≈G≈B) and every
 *  photograph is blue-graded. `from` skips the value list baked into a comp. */
async function traceArc(file, from) {
  const { data, info } = await sharp(`${SRC}/${file}`)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const edge = new Array(H).fill(W);
  for (let y = 0; y < H; y++) {
    for (let x = from; x < W; x++) {
      if (data[(y * W + x) * C + 2] - data[(y * W + x) * C] > 18) {
        edge[y] = x;
        break;
      }
    }
  }
  return { W, H, edge, min: Math.min(...edge) };
}

/**
 * The canonical mask, lifted from one comp and reused for all five so the
 * curve cannot drift between values. Rows are the comp's own arc, shifted so
 * the arc's leftmost point sits on the panel's left edge, and normalised to a
 * unit square that can be scaled to any output size.
 */
async function canonicalMask() {
  const { H, edge, min } = await traceArc("integrity.png", 900);
  // Fraction of the panel width cut away, per unit of height.
  const width = 1999 - min;
  return { rows: edge.map((x) => (x - min) / width), h: H };
}

/** An 8-bit alpha plane of `w`x`h` from the normalised arc, with a 1px ramp so
 *  the edge is not stepped. */
function alphaPlane(mask, w, h) {
  const a = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++) {
    const cut = mask.rows[Math.min(mask.rows.length - 1, Math.round((y / h) * mask.rows.length))] * w;
    for (let x = 0; x < w; x++) {
      const d = x - cut;
      a[y * w + x] = d <= -1 ? 0 : d >= 1 ? 255 : Math.round(((d + 1) / 2) * 255);
    }
  }
  return a;
}

/* Each source, and where the 1.22 window sits.
   "arc"   — a section comp: anchor the window on its own arc, which is where
             the panel starts, and the subject follows.
   "right" — a plain banner: the arc is decorative and near the left edge while
             the subject is centre-right, so anchor right and let the mask
             supply the curve. */
const sources = [
  ["science", "science_microscope_right_placeholder.png", 0, "right"],
  ["quality", "Quality image.png", 900, "arc"],
  ["integrity", "integrity.png", 900, "arc"],
  ["innovation", "innovation.png", 900, "arc"],
  ["people", "people.png", 0, "right"],
];

await mkdir(OUT, { recursive: true });
const mask = await canonicalMask();

for (const [id, file, from, anchor] of sources) {
  const { W, H, min } = await traceArc(file, from);

  // The tallest 1.22 window the source allows.
  let height = H;
  let width = Math.round(height * ASPECT);
  if (width > W) {
    width = W;
    height = Math.round(width / ASPECT);
  }
  const left =
    anchor === "arc" ? Math.min(min, W - width) : Math.max(0, W - width);
  const top = Math.round((H - height) / 2);

  const photo = await sharp(`${SRC}/${file}`)
    .extract({ left, top, width, height })
    .toBuffer();

  const info = await sharp(photo)
    .ensureAlpha()
    .joinChannel(alphaPlane(mask, width, height), {
      raw: { width, height, channels: 1 },
    })
    .webp({ quality: 84, alphaQuality: 100 })
    .toFile(`${OUT}/${id}.webp`);

  console.log(
    `${id.padEnd(11)} ${String(W).padStart(4)}x${H} -> window ${width}x${height} ` +
      `(${anchor} @${left})  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
  );
}
