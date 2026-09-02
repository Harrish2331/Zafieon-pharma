/**
 * Dev-only: measure how long the app takes to respond to being used.
 *
 *   BASE_URL=http://localhost:3001 node tools/interactioncheck.mjs
 *
 * Load metrics say what a visitor waits for before the page appears.
 * This says what they wait for once they start clicking, which is a different
 * question and the one "laggy" usually means.
 *
 * For each interaction it records the longest single frame and the total
 * main-thread blocking that follows the input. A frame over ~50ms is felt; a
 * run of them is what reads as jank.
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3001";

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});

/** Install a frame-timing recorder that can be armed and read per interaction. */
const INSTRUMENT = () => {
  const w = window;
  w.__frames = [];
  w.__long = [];
  w.__recording = false;
  let last = performance.now();
  const tick = () => {
    const now = performance.now();
    if (w.__recording) w.__frames.push(now - last);
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        if (w.__recording) w.__long.push(Math.round(e.duration));
      }
    }).observe({ type: "longtask", buffered: false });
  } catch {
    /* longtask unsupported */
  }
  w.__arm = () => {
    w.__frames = [];
    w.__long = [];
    w.__recording = true;
  };
  w.__report = () => {
    w.__recording = false;
    const f = w.__frames.slice().sort((a, b) => a - b);
    return {
      frames: f.length,
      worst: Math.round(f[f.length - 1] ?? 0),
      p95: Math.round(f[Math.floor(f.length * 0.95)] ?? 0),
      janky: f.filter((x) => x > 50).length,
      blocking: w.__long.reduce((n, x) => n + Math.max(0, x - 50), 0),
    };
  };
};

const rows = [];

async function measure(page, label, action, settle = 1400) {
  await page.evaluate(() => window.__arm());
  await action();
  await new Promise((r) => setTimeout(r, settle));
  const m = await page.evaluate(() => window.__report());
  rows.push({ label, ...m });
}

async function openPage(route, viewport = { width: 1440, height: 900 }) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.evaluateOnNewDocument(INSTRUMENT);
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on(
    "console",
    (m) => m.type() === "error" && errors.push(m.text().slice(0, 140)),
  );
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2600));
  return { page, errors };
}

/* ── Products: the filter grid is the heaviest interaction on the site ───── */
{
  const { page, errors } = await openPage("/products");

  const clickChip = (text) => async () => {
    await page.evaluate((t) => {
      const b = [...document.querySelectorAll("button")].find((x) =>
        new RegExp("^" + t, "i").test(x.textContent.trim()),
      );
      b?.click();
    }, text);
  };

  await measure(page, "products · category → Hormones", clickChip("Hormones"));
  await measure(page, "products · category → All", clickChip("All"));
  await measure(page, "products · area → Fertility", clickChip("Fertility"));
  await measure(page, "products · area → Gyna", clickChip("Gyna"));

  await measure(page, "products · search keystrokes", async () => {
    await page.focus('input[type="search"]');
    await page.type('input[type="search"]', "progesterone", { delay: 45 });
  });

  if (errors.length) rows.push({ label: "products · CONSOLE", errors });
  await page.close();
}

/* ── Home: the focus index swaps a large panel on hover ──────────────────── */
{
  const { page, errors } = await openPage("/");
  await page.evaluate(() => {
    const el = [...document.querySelectorAll("button")].find((b) =>
      /FERTILITY/i.test(b.textContent),
    );
    el?.scrollIntoView({ block: "center" });
  });
  await new Promise((r) => setTimeout(r, 900));

  await measure(page, "home · focus index → Fertility", async () => {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) =>
        /FERTILITY/i.test(x.textContent),
      );
      b?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      b?.click();
    });
  });

  await measure(page, "home · full scroll", async () => {
    await page.evaluate(
      () =>
        new Promise((res) => {
          let y = 0;
          const max = document.body.scrollHeight - window.innerHeight;
          const step = () => {
            y += 260;
            window.scrollTo(0, y);
            if (y < max) setTimeout(step, 32);
            else res();
          };
          step();
        }),
    );
  });

  if (errors.length) rows.push({ label: "home · CONSOLE", errors });
  await page.close();
}

/* ── Mobile menu ─────────────────────────────────────────────────────────── */
{
  const { page, errors } = await openPage("/", {
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
  });
  await measure(page, "mobile · open menu", async () => {
    await page.click('button[aria-controls="mobile-menu"]');
  });
  if (errors.length) rows.push({ label: "mobile · CONSOLE", errors });
  await page.close();
}

/* ── Manufacturing: the film is the heaviest asset ───────────────────────── */
{
  const { page, errors } = await openPage("/manufacturing");
  await measure(page, "manufacturing · scroll past film", async () => {
    await page.evaluate(
      () =>
        new Promise((res) => {
          let y = 0;
          const max = document.body.scrollHeight - window.innerHeight;
          const step = () => {
            y += 260;
            window.scrollTo(0, y);
            if (y < max) setTimeout(step, 32);
            else res();
          };
          step();
        }),
    );
  });
  if (errors.length) rows.push({ label: "manufacturing · CONSOLE", errors });
  await page.close();
}

/* ── Report ──────────────────────────────────────────────────────────────── */
console.log(
  "\n  interaction                          worst   p95  janky  blocking",
);
console.log("  " + "─".repeat(66));
let bad = 0;
for (const r of rows) {
  if (r.errors) {
    bad++;
    console.log(`  ✗ ${r.label}`);
    r.errors.slice(0, 3).forEach((e) => console.log(`      ${e}`));
    continue;
  }
  const fail = r.worst > 120 || r.janky > 4;
  if (fail) bad++;
  console.log(
    `  ${fail ? "✗" : "✓"} ${r.label.padEnd(34)} ${String(r.worst).padStart(5)}ms ${String(
      r.p95,
    ).padStart(5)}ms ${String(r.janky).padStart(5)} ${String(r.blocking).padStart(8)}ms`,
  );
}
console.log(
  bad ? `\n  ${bad} interaction(s) worth looking at.` : "\n  All interactions smooth.",
);

await browser.close();
process.exit(bad ? 1 : 0);
