/** Dev-only: crawl every internal link from every route and verify it resolves. */
import puppeteer from "puppeteer-core";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true, args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
const p = await b.newPage();
await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

const seeds = ["/", "/about", "/our-focus", "/products", "/quality",
  "/manufacturing", "/contact", "/legal/privacy", "/legal/terms", "/legal/disclaimer"];

const links = new Set();
for (const s of seeds) {
  await p.goto(BASE + s, { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 900));
  const found = await p.evaluate(() =>
    [...document.querySelectorAll("a[href]")]
      .map(a => a.getAttribute("href"))
      .filter(h => h && h.startsWith("/")));
  found.forEach(f => links.add(f.split("#")[0] || "/"));
}
// Product + partner detail routes are reached through client-filtered grids too.
["/products/femi-dros-30","/products/femi-dros-20","/products/miso-pro",
 "/products/zyfolic","/products/femulet","/products/florabet-ll",
 "/manufacturing/symbiosis-group","/manufacturing/systole-remedies",
 "/manufacturing/eurocrit-labs","/manufacturing/philanto-wellness",
 "/manufacturing/bionexy-pharma","/manufacturing/unilite-india",
 "/manufacturing/janus-biotech-india"].forEach(l => links.add(l));

const bad = [];
for (const l of [...links].sort()) {
  const res = await p.goto(BASE + l, { waitUntil: "domcontentloaded" });
  const st = res.status();
  if (st >= 400) bad.push(`${st}  ${l}`);
  console.log(`${st === 200 ? "✓" : "✗"} ${String(st)}  ${l}`);
}
console.log(`\n${links.size} internal routes checked, ${bad.length} broken.`);
bad.forEach(x => console.log("  ! " + x));
await b.close();
