/**
 * Dev-only: take the product photography Zafieon supplies and put it where the
 * catalogue expects it.
 *
 *   node tools/productimages.mjs
 *
 * The supplied files arrive as JPEGs named after the carton rather than the
 * slug — "florabet LL.jpeg", "zyfolic Q4.jpeg". This maps each one to the
 * product it actually shows, reading the carton rather than trusting the
 * filename, converts to WebP and prints the blur placeholder for products.ts.
 *
 * Mapping is stated here, not inferred at runtime, so a new carton photograph
 * cannot silently land on the wrong product.
 */
import sharp from "sharp";
import { existsSync } from "node:fs";

/** supplied file -> catalogue slug, with what the carton reads. */
const MAP = [
  ["femulet.jpeg", "femulet", "FEMULET Tablets — 1 x 10 x 1"],
  ["florabet LL.jpeg", "florabet-ll", "Florabet LL Capsules — 10 x 1"],
  ["meta coq.jpeg", "meta-coq", "Meta-CoQ 300 Tablets — 1 x 5 x 1"],
  ["proluvia.jpeg", "proluvia-aq", "Proluvia-AQ 50 mg Injection — 1 x 5, 5 x 2 ml"],
  ["zyfolic.jpeg", "zyfolic", "ZYFOLIC Softgel Capsules — 1 x 10 x 1"],
  // "zyfolic Q4.jpeg" is a DIFFERENT product — Zyfolic Q4 Tablets, same
  // actives in a tablet rather than a softgel. It has no catalogue entry, so
  // it is deliberately not mapped here rather than being dropped onto Zyfolic.
];

const DIR = "public/products";

for (const [file, slug, reads] of MAP) {
  const src = `${DIR}/${file}`;
  if (!existsSync(src)) {
    console.log(`  ${slug.padEnd(13)} SKIPPED — ${file} not present`);
    continue;
  }
  const out = `${DIR}/${slug}.webp`;
  const info = await sharp(src)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(out);

  const blur = await sharp(src)
    .resize(20, 20, { fit: "inside" })
    .webp({ quality: 40 })
    .toBuffer();

  console.log(
    `  ${slug.padEnd(13)} <- ${file.padEnd(20)} ${info.width}x${info.height}  ` +
      `${(info.size / 1024).toFixed(0)} KB   (${reads})`,
  );
  console.log(`      blurDataURL: "data:image/webp;base64,${blur.toString("base64")}"`);
}
