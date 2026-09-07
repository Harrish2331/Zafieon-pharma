/**
 * Dev-only: build the hero capsule's printed label.
 *
 *   node tools/capsulelabel.mjs
 *
 * The reference Zafieon supplied shows the lockup printed down the length of
 * the capsule. This bakes the OFFICIAL artwork — public/brand/logo-stacked-
 * white.svg — into a texture rather than redrawing it in canvas paths, which
 * is the rule the rest of the project follows: the logo is a supplied asset
 * everywhere it appears.
 *
 * ── Laying it out ──────────────────────────────────────────────────────────
 * The artwork is turned a quarter turn so its long axis runs down the barrel,
 * and fills the texture. It is applied to an open cylinder band whose angular
 * start and sweep put it on the face of the capsule that meets the camera.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

/** u (around the band) x v (along the barrel). Tall, the way the print runs. */
const W = 512;
const H = 1024;

/* The print fills its band: WHERE the band sits on the capsule is decided by
   the geometry in PrecisionForm, not by padding inside this texture. That was
   the earlier mistake — placing the art at u = 0.5 of a full lathe wrap put it
   on the far side of the barrel, and which side u = 0.5 lands on depends on
   the lathe's sweep convention rather than on anything visible. */
const U_SPAN = 0.9;
const V_FROM = 0.06;
const V_TO = 0.94;

/* The HORIZONTAL lockup, not the stacked one: turned a quarter turn it puts
   the mark at the top of the capsule with the wordmark reading down beneath
   it, which is the arrangement in the reference. */
const src = "public/brand/logo-horizontal.svg";

// Rasterise the lockup, then turn it a quarter turn so it reads down the
// capsule when the texture is wrapped.
const box = {
  w: Math.round(H * (V_TO - V_FROM)),
  h: Math.round(W * U_SPAN),
};
const art = await sharp(src, { density: 72 }) // natural 4523x2599; downscaled from there
  .resize({ width: box.w, height: box.h, fit: "inside" })
  .rotate(90, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();

const meta = await sharp(art).metadata();

await mkdir("public/brand", { recursive: true });
const out = await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([
    {
      input: art,
      left: Math.round((W - meta.width) / 2),
      top: Math.round(V_FROM * H + ((V_TO - V_FROM) * H - meta.height) / 2),
    },
  ])
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile("public/brand/capsule-label.webp");

console.log(`  artwork   ${src}`);
console.log(`  rotated   ${meta.width}x${meta.height}`);
console.log(`  texture   public/brand/capsule-label.webp  ${out.width}x${out.height}  ${(out.size / 1024).toFixed(0)} KB`);
