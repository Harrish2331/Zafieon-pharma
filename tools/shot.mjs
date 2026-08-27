/**
 * Design-review screenshot harness.
 *
 * Drives the locally installed Chrome headlessly against the dev server so
 * every page can be reviewed at real breakpoints. Dev-only; not shipped.
 *
 *   node shot.mjs shots.json
 *
 * Captures are segmented viewport shots rather than one fullPage image:
 * Chrome stitches fullPage captures by scrolling, which duplicates
 * `position: fixed` elements down the page and makes tall pages unreadable.
 *
 * Reduced motion is emulated, and the page is walked slowly first, so every
 * in-view reveal has fired and each shot shows the true composed state.
 */
import puppeteer from "puppeteer-core";
import { readFileSync, mkdirSync } from "node:fs";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:3000";
const targets = JSON.parse(readFileSync(process.argv[2] ?? "tools/shots.json", "utf8"));

mkdirSync(".shots", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    "--no-sandbox",
    "--force-color-profile=srgb",
    "--hide-scrollbars",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});

const problems = [];

for (const t of targets) {
  const { route, label, w = 1440, h = 900, wait = 5200, segments = 0 } = t;
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);

  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, wait));

  // Walk the page slowly so every in-view reveal has fired. IntersectionObserver
  // callbacks are async; a fast walk skips sections.
  await page.evaluate(
    () =>
      new Promise((res) => {
        let y = 0;
        const step = () => {
          y += window.innerHeight * 0.5;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(step, 240);
          else {
            window.scrollTo(0, 0);
            setTimeout(res, 700);
          }
        };
        step();
      }),
  );
  await new Promise((r) => setTimeout(r, 1100));

  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const count = segments || Math.max(1, Math.ceil(pageHeight / h));

  for (let i = 0; i < count; i++) {
    const y = Math.min(i * h, Math.max(0, pageHeight - h));
    await page.evaluate((py) => window.scrollTo(0, py), y);
    await new Promise((r) => setTimeout(r, 550));
    const name = count === 1 ? label : `${label}-${String(i + 1).padStart(2, "0")}`;
    await page.screenshot({ path: `.shots/${name}.png` });
  }

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  if (errors.length)
    problems.push(`${label}: console → ${errors.slice(0, 3).join(" | ")}`);
  if (overflow > 1) problems.push(`${label}: horizontal overflow ${overflow}px`);

  console.log(
    `✓ ${label.padEnd(26)} ${route.padEnd(30)} ${w}×${h}  ${count} segment(s)`,
  );
  await page.close();
}

await browser.close();

if (problems.length) {
  console.log("\n── ISSUES ───────────────────────────────");
  problems.forEach((p) => console.log("  ! " + p));
} else {
  console.log("\nNo console errors, no horizontal overflow.");
}
