/**
 * Dev-only: derive the five "What Drives Us" photographs from the supplied
 * artwork.
 *
 *   node tools/aboutcrop.mjs
 *
 * Three of the five files are comps of the whole section: the value list, the
 * brand pattern and the magenta rule are baked into the pixels. All five also
 * carry a curved left edge painted against paper-100. Neither belongs in a
 * production asset — the list is live text, and the curve has to be one shape
 * across all five or it jumps as the reader moves down the index.
 *
 * So each source is cropped to the photograph alone, starting to the right of
 * the painted arc's furthest extent, and written to public/images/about/ as
 * WebP. The originals in "public/images/About us/" are read only.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/images/About us";
const OUT = "public/images/about";

/** Where the photograph begins: the painted arc bulges left, so its rightmost
 *  point is the first column that is photograph at every height. Detected on
 *  blueness, since the paper ground is neutral (R≈G≈B) and every photograph is
 *  blue-graded. `from` skips the baked value list on the comps. */
async function arcExtent(file, from) {
  const { data, info } = await sharp(`${SRC}/${file}`)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const blue = (x, y) => {
    const i = (y * W + x) * C;
    return data[i + 2] - data[i];
  };
  let max = 0;
  for (let y = 0; y < H; y++) {
    for (let x = from; x < W; x++) {
      if (blue(x, y) > 18) {
        if (x > max) max = x;
        break;
      }
    }
  }
  return { W, H, max };
}

const sources = [
  ["science", "science_microscope_right_placeholder.png", 0],
  ["quality", "Quality image.png", 900],
  ["integrity", "integrity.png", 900],
  ["innovation", "innovation.png", 900],
  ["people", "people.png", 0],
];

await mkdir(OUT, { recursive: true });

for (const [id, file, from] of sources) {
  const { W, H, max } = await arcExtent(file, from);
  // A couple of pixels of margin past the arc, so no anti-aliased edge survives.
  const left = Math.min(max + 3, W - 40);
  const width = W - left;

  const out = `${OUT}/${id}.webp`;
  const info = await sharp(`${SRC}/${file}`)
    .extract({ left, top: 0, width, height: H })
    .resize({ width: Math.min(width, 1200), withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out);

  console.log(
    `${id.padEnd(11)} ${String(W).padStart(4)}x${H}  arc ends x=${String(max).padStart(4)}  ` +
      `crop ${width}x${H}  ->  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
  );
}
