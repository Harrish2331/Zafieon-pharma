/** Dev-only: measure scroll smoothness and main-thread cost. */
import puppeteer from "puppeteer-core";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"],
});
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
// NO_3D=1 freezes the scene (frameloop -> "demand"), isolating whether the
// continuous WebGL pass is what is costing frames.
if (process.env.NO_3D) {
  await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
}
await p.goto(BASE, { waitUntil: "domcontentloaded" });
await new Promise(r => setTimeout(r, 6000));

// Warm-up pass: scroll the whole page once so lazy images decode, reveals fire
// and three.js is fully parsed. The measured pass below is then steady-state
// scrolling, which is what "feels laggy" actually refers to — first-load cost
// is a separate number and is dominated by asset decode.
await p.evaluate(() => new Promise(res => {
  let y = 0;
  const max = document.body.scrollHeight - window.innerHeight;
  const step = () => { y += 200; window.scrollTo(0, y);
    if (y < max) setTimeout(step, 30); else { window.scrollTo(0,0); setTimeout(res, 1200); } };
  step();
}));

// Count long tasks + measure frame pacing during a scripted scroll.
const stats = await p.evaluate(async () => {
  const long = [];
  new PerformanceObserver(l => l.getEntries().forEach(e => long.push(Math.round(e.duration))))
    .observe({ entryTypes: ["longtask"] });

  const frames = [];
  let last = performance.now();
  let running = true;
  const tick = () => {
    const now = performance.now();
    frames.push(now - last); last = now;
    if (running) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  await new Promise(res => {
    let y = 0;
    const max = document.body.scrollHeight - window.innerHeight;
    const step = () => {
      y += 28; window.scrollTo(0, y);
      if (y < max) requestAnimationFrame(step);
      else setTimeout(res, 300);
    };
    requestAnimationFrame(step);
  });
  running = false;
  await new Promise(r => setTimeout(r, 200));

  const sorted = [...frames].sort((a,b)=>a-b);
  const pct = q => sorted[Math.floor(sorted.length*q)] ?? 0;
  return {
    frames: frames.length,
    medianMs: +pct(0.5).toFixed(1),
    p95Ms: +pct(0.95).toFixed(1),
    worstMs: +Math.max(...frames).toFixed(1),
    janky: frames.filter(f => f > 50).length,
    longTasks: long.length,
    longTaskTotalMs: long.reduce((a,b)=>a+b,0),
    canvases: document.querySelectorAll("canvas").length,
  };
});
console.log(JSON.stringify(stats, null, 2));
await b.close();
