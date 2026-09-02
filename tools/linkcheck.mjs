/**
 * Dev-only: crawl every internal link from every route and verify it resolves.
 *
 * Seeds come from the running site's own sitemap rather than a list kept here,
 * so a route added to the data cannot be missed by the crawl, and a route
 * removed from the data cannot leave a stale assertion behind.
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
const p = await b.newPage();
await p.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "reduce" },
]);

// Every URL the site publishes, plus the routes deliberately kept out of the
// sitemap (prescription detail pages, legal scaffolds) which still must work.
const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const fromSitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter(Boolean);

const links = new Set([
  ...fromSitemap,
  "/legal/privacy",
  "/legal/terms",
  "/legal/disclaimer",
  "/insights",
]);

for (const s of [...links]) {
  await p.goto(BASE + s, { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 700));
  const found = await p.evaluate(() =>
    [...document.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && h.startsWith("/")),
  );
  found.forEach((f) => links.add(f.split("#")[0].split("?")[0] || "/"));
}

const bad = [];
for (const l of [...links].sort()) {
  const res = await p.goto(BASE + l, { waitUntil: "domcontentloaded" });
  const st = res.status();
  // /admin redirects to /admin/login when signed out; that is the correct
  // behaviour, not a broken link.
  if (st >= 400) bad.push(`${st}  ${l}`);
  console.log(`${st < 400 ? "✓" : "✗"} ${String(st)}  ${l}`);
}

console.log(`\n${links.size} internal routes checked, ${bad.length} broken.`);
bad.forEach((x) => console.log("  ! " + x));
await b.close();
process.exit(bad.length ? 1 : 0);
