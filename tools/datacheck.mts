/**
 * Content-model integrity. The site has no database: `src/data/*.ts` IS the
 * store, so this is the equivalent of a schema-and-constraints audit, and it
 * runs without a server.
 *
 *   node tools/datacheck.mts
 *
 * Every check is a referential-integrity or uniqueness rule that the compiler
 * cannot express: a duplicate slug, an image file that is not on disk, an area
 * that no focus record defines, a prescription product leaking into the
 * sitemap. Each one has been a real failure mode in a content-driven site.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AREA_ORDER,
  productCategories,
  products,
  productsByArea,
} from "../src/data/products.ts";
import { focusAreas } from "../src/data/focus.ts";
import { partners } from "../src/data/partners.ts";
import { insights } from "../src/data/insights.ts";
import { legalDocs } from "../src/data/legal.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");

const ok: string[] = [];
const bad: string[] = [];
const t = (name: string, cond: boolean, detail = "") =>
  (cond ? ok : bad).push(name + (cond || !detail ? "" : ` -- ${detail}`));

const dupes = (xs: string[]) => {
  const seen = new Set<string>();
  return [...new Set(xs.filter((x) => (seen.has(x) ? true : (seen.add(x), false))))];
};
const onDisk = (p: string) => fs.existsSync(path.join(PUBLIC, p.replace(/^\//, "")));

// ── Products ────────────────────────────────────────────────────────────────
t("Product ids are unique", dupes(products.map((p) => p.id)).length === 0,
  dupes(products.map((p) => p.id)).join(", "));
t("Product slugs are unique", dupes(products.map((p) => p.slug)).length === 0,
  dupes(products.map((p) => p.slug)).join(", "));
t("Product names are unique", dupes(products.map((p) => p.name)).length === 0,
  dupes(products.map((p) => p.name)).join(", "));
t("Every slug is URL-safe", products.every((p) => /^[a-z0-9-]+$/.test(p.slug)),
  products.filter((p) => !/^[a-z0-9-]+$/.test(p.slug)).map((p) => p.slug).join(", "));

const missingArt = products.filter((p) => !onDisk(p.image));
t("Every product image is on disk", missingArt.length === 0,
  missingArt.map((p) => `${p.slug} -> ${p.image}`).join(", "));

const emptyAlt = products.filter((p) => !p.imageAlt?.trim());
t("Every product image has alt text", emptyAlt.length === 0,
  emptyAlt.map((p) => p.slug).join(", "));

const badBlur = products.filter(
  (p) => p.blurDataURL !== undefined && !p.blurDataURL.startsWith("data:image/"),
);
t("Every LQIP is a data URL", badBlur.length === 0, badBlur.map((p) => p.slug).join(", "));

const noCat = products.filter((p) => p.categories.length === 0);
t("Every product carries at least one category", noCat.length === 0,
  noCat.map((p) => p.slug).join(", "));

const catIds = productCategories.map((c) => c.id) as string[];
const strayCat = products.flatMap((p) =>
  p.categories.filter((c) => !catIds.includes(c)).map((c) => `${p.slug}:${c}`),
);
t("No product names an undefined category", strayCat.length === 0, strayCat.join(", "));

const dupeCat = products.filter((p) => dupes(p.categories as string[]).length > 0);
t("No product lists the same category twice", dupeCat.length === 0,
  dupeCat.map((p) => p.slug).join(", "));

// `productClass` is the regulatory field and drives the Rx gate; `categories`
// is display only. They must not disagree about prescription status.
const classMismatch = products.filter(
  (p) =>
    p.categories.includes("prescription") !== (p.productClass === "prescription"),
);
t("productClass agrees with the prescription category", classMismatch.length === 0,
  classMismatch.map((p) => p.slug).join(", "));

const areaIds = focusAreas.map((f) => f.id) as string[];
const strayArea = products.flatMap((p) =>
  p.therapeuticAreas.filter((a) => !areaIds.includes(a)).map((a) => `${p.slug}:${a}`),
);
t("Every therapeutic area resolves to a focus record", strayArea.length === 0,
  strayArea.join(", "));

const dupeArea = products.filter((p) => dupes(p.therapeuticAreas as string[]).length > 0);
t("No product lists the same area twice", dupeArea.length === 0,
  dupeArea.map((p) => p.slug).join(", "));

const noArea = products.filter((p) => p.therapeuticAreas.length === 0);
t("Every product sits in at least one area", noArea.length === 0,
  noArea.map((p) => p.slug).join(", "));

const noSource = products.filter((p) => !p.source?.trim());
t("Every product records its source", noSource.length === 0,
  noSource.map((p) => p.slug).join(", "));

const thinDesc = products.filter((p) => (p.description ?? "").trim().length < 20);
t("Every product has a description", thinDesc.length === 0,
  thinDesc.map((p) => p.slug).join(", "));

// ── Area ordering ───────────────────────────────────────────────────────────
for (const [area, order] of Object.entries(AREA_ORDER)) {
  const named = order as readonly string[];
  const got = productsByArea(area).map((p) => p.slug);
  t(`${area}: ordered list starts with the fixed sequence`,
    JSON.stringify(got.slice(0, named.length)) === JSON.stringify(named),
    got.slice(0, named.length).join(" > "));
  const members = products
    .filter((p) => (p.therapeuticAreas as string[]).includes(area))
    .map((p) => p.slug);
  t(`${area}: ordering loses nothing and invents nothing`,
    got.length === members.length && members.every((s) => got.includes(s)),
    `${got.length} vs ${members.length}`);
  t(`${area}: ordered list has no duplicates`, dupes(got).length === 0, dupes(got).join(", "));
}

// Ordering must be a pure function of the data, not of call order.
const twice = [productsByArea("gynecology"), productsByArea("gynecology")].map((l) =>
  l.map((p) => p.slug).join(","),
);
t("Area ordering is stable across calls", twice[0] === twice[1]);

// ── Focus areas ─────────────────────────────────────────────────────────────
t("Focus ids are unique", dupes(focusAreas.map((f) => f.id)).length === 0);
t("Focus slugs are unique", dupes(focusAreas.map((f) => f.slug)).length === 0);
const focusArt = focusAreas.filter((f) => f.image && !onDisk(f.image));
t("Every focus image present in the data is on disk", focusArt.length === 0,
  focusArt.map((f) => f.id).join(", "));
const artNoAlt = focusAreas.filter((f) => f.image && !f.imageAlt?.trim());
t("Every focus image has alt text", artNoAlt.length === 0, artNoAlt.map((f) => f.id).join(", "));
const emptyArea = focusAreas.filter(
  (f) => !products.some((p) => (p.therapeuticAreas as string[]).includes(f.id)),
);
t("No focus area is empty", emptyArea.length === 0, emptyArea.map((f) => f.id).join(", "));

// ── Partners ────────────────────────────────────────────────────────────────
t("Partner slugs are unique", dupes(partners.map((p) => p.slug)).length === 0,
  dupes(partners.map((p) => p.slug)).join(", "));
t("Partner ids are unique", dupes(partners.map((p) => p.id)).length === 0);
const partnerArt = partners.filter((p) => p.logo && !onDisk(p.logo));
t("Every partner logo is on disk", partnerArt.length === 0,
  partnerArt.map((p) => p.slug).join(", "));
/* `website` is display text read off the brochure, not an href — the partner
   page prints it rather than linking out — so the rule is that it reads as a
   hostname, which is what catches a typo or a stray space. */
const badSite = partners.filter(
  (p) => p.website && !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(p.website),
);
t("Every partner website reads as a bare hostname", badSite.length === 0,
  badSite.map((p) => `${p.slug}: ${p.website}`).join(", "));

// ── Insights ────────────────────────────────────────────────────────────────
t("Insight slugs are unique", dupes(insights.map((i) => i.slug)).length === 0);
t("Insight slots are 1-4 and unique",
  insights.every((i) => [1, 2, 3, 4].includes(i.slot)) &&
    dupes(insights.map((i) => String(i.slot))).length === 0,
  insights.map((i) => i.slot).join(","));
const insightArt = insights.filter((i) => !onDisk(i.image));
t("Every insight image is on disk", insightArt.length === 0,
  insightArt.map((i) => i.slug).join(", "));
const emptyBody = insights.filter((i) => !i.body?.length || i.body.some((b) => !b.trim()));
t("No insight has an empty paragraph", emptyBody.length === 0,
  emptyBody.map((i) => i.slug).join(", "));

// ── Legal ───────────────────────────────────────────────────────────────────
t("Legal doc slugs are unique", dupes(legalDocs.map((d) => d.slug)).length === 0);

console.log("\nPASS");
ok.forEach((x) => console.log("  ok   " + x));
if (bad.length) {
  console.log("\nFAIL");
  bad.forEach((x) => console.log("  FAIL " + x));
}
console.log(`\n${ok.length}/${ok.length + bad.length} data checks passed.`);
process.exit(bad.length ? 1 : 0);
