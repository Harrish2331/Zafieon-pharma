/**
 * Dev-only: measure what the first load actually costs.
 *
 *   BASE_URL=http://localhost:3001 node tools/loadcheck.mjs [route]
 *
 * Reports First Contentful Paint, Largest Contentful Paint and the element LCP
 * resolved to, cumulative layout shift, main-thread long tasks, transferred
 * bytes by type, and the ten slowest requests. Run it against a production
 * build — `next dev` compiles on demand and its numbers mean nothing.
 *
 * Chrome here has no GPU (SwiftShader), so absolute timings are pessimistic.
 * The value is in the deltas between runs and in which resource is slowest,
 * not in the raw milliseconds.
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROUTE = process.argv[2] ?? "/";
const THROTTLE = process.env.FAST ? null : {
  // Roughly "good 3G": enough to show what a real visitor waits for.
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.setCacheEnabled(false);

const client = await page.createCDPSession();
await client.send("Network.enable");
if (THROTTLE) {
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    ...THROTTLE,
  });
}

const requests = [];
page.on("response", async (r) => {
  const req = r.request();
  requests.push({
    url: r.url(),
    type: req.resourceType(),
    status: r.status(),
    start: req.timing?.()?.requestTime ?? 0,
  });
});

const t0 = Date.now();
await page.goto(BASE + ROUTE, { waitUntil: "load", timeout: 90000 });
const loadMs = Date.now() - t0;

// Give paint + LCP observers time to settle.
await new Promise((r) => setTimeout(r, 3500));

const vitals = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const out = { fcp: null, lcp: null, lcpEl: null, cls: 0, longTasks: 0, longTaskMs: 0 };
      for (const e of performance.getEntriesByType("paint")) {
        if (e.name === "first-contentful-paint") out.fcp = Math.round(e.startTime);
      }
      try {
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) {
            out.lcp = Math.round(e.startTime);
            const el = e.element;
            out.lcpEl = el
              ? `${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).split(" ")[0] : ""}` +
                (el.currentSrc ? ` src=${el.currentSrc.split("/").pop().slice(0, 60)}` : "")
              : e.url
                ? `url=${String(e.url).split("/").pop().slice(0, 60)}`
                : null;
          }
        }).observe({ type: "largest-contentful-paint", buffered: true });

        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });

        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) {
            out.longTasks++;
            out.longTaskMs += e.duration;
          }
        }).observe({ type: "longtask", buffered: true });
      } catch {
        /* observer unsupported */
      }
      setTimeout(() => {
        out.cls = Math.round(out.cls * 1000) / 1000;
        out.longTaskMs = Math.round(out.longTaskMs);
        resolve(out);
      }, 900);
    }),
);

const timing = await page.evaluate(() =>
  performance.getEntriesByType("resource").map((r) => ({
    name: r.name,
    type: r.initiatorType,
    dur: Math.round(r.duration),
    size: r.transferSize,
    start: Math.round(r.startTime),
  })),
);

const byType = {};
for (const r of timing) {
  const k = r.type || "other";
  byType[k] = byType[k] ?? { n: 0, kb: 0 };
  byType[k].n++;
  byType[k].kb += (r.size || 0) / 1024;
}

console.log(`\n${ROUTE}  ${THROTTLE ? "(throttled ~1.6 Mbps / 150ms)" : "(unthrottled)"}`);
console.log("─".repeat(74));
console.log(`  load event      ${loadMs} ms`);
console.log(`  FCP             ${vitals.fcp ?? "—"} ms`);
console.log(`  LCP             ${vitals.lcp ?? "—"} ms   ${vitals.lcpEl ?? ""}`);
console.log(`  CLS             ${vitals.cls}`);
console.log(`  long tasks      ${vitals.longTasks}  (${vitals.longTaskMs} ms total)`);
console.log("\n  transferred by type");
for (const [k, v] of Object.entries(byType).sort((a, b) => b[1].kb - a[1].kb)) {
  console.log(`    ${k.padEnd(12)} ${String(v.n).padStart(3)} req  ${v.kb.toFixed(0).padStart(6)} KB`);
}
console.log("\n  slowest requests");
for (const r of timing.sort((a, b) => b.dur - a.dur).slice(0, 10)) {
  console.log(
    `    ${String(r.dur).padStart(6)} ms  ${String((r.size / 1024).toFixed(0)).padStart(6)} KB  ` +
      `@${String(r.start).padStart(5)}ms  ${r.name.replace(BASE, "").slice(0, 72)}`,
  );
}
console.log();

await browser.close();
