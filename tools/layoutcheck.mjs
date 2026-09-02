/**
 * Dev-only: sweep the Manufacturing hero's overlaid standfirst across every
 * breakpoint that matters and assert it is never clipped, never collides with
 * the play control, and never pushes the document sideways.
 *
 *   BASE_URL=http://localhost:3001 node tools/layoutcheck.mjs
 *
 * Overlaid type is the one layout that fails silently: `overflow-hidden` on the
 * plate hides the damage, so a screenshot at one width can look perfect while
 * another loses a third of the sentence.
 *
 * The film carries no controls, so there is nothing for the copy to collide
 * with any more — the checks are clipping on each edge, and document overflow.
 */
import puppeteer from "puppeteer-core";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await puppeteer.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true,args:["--no-sandbox","--enable-unsafe-swiftshader"]});
let bad = 0;
for (const w of [360, 390, 430, 540, 639, 640, 700, 767, 768, 820, 1024, 1280, 1440, 1920]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: 900 });
  await p.goto(BASE + "/manufacturing", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1800));
  const m = await p.evaluate(() => {
    const fig = document.querySelector("figure");
    const plate = fig.querySelector("div");
    const para = fig.querySelector("p");
    const pr = para.getBoundingClientRect(), plr = plate.getBoundingClientRect();
    const pad = 4;
    return {
      plate: `${Math.round(plr.width)}x${Math.round(plr.height)}`,
      para: `${Math.round(pr.width)}x${Math.round(pr.height)}`,
      clipR: Math.round(pr.right) > Math.round(plr.right) + pad,
      clipB: Math.round(pr.bottom) > Math.round(plr.bottom) + pad,
      clipT: Math.round(pr.top) < Math.round(plr.top) - pad,
      docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  const fail = m.clipR || m.clipB || m.clipT || m.docOverflow > 1;
  if (fail) bad++;
  console.log(`${fail ? "✗" : "✓"} ${String(w).padStart(5)}  plate ${m.plate.padEnd(9)} para ${m.para.padEnd(9)} ` +
    `clip[R:${+m.clipR} B:${+m.clipB} T:${+m.clipT}] docOverflow:${m.docOverflow}`);
  await p.close();
}
console.log(bad ? `\n${bad} breakpoint(s) with a problem.` : "\nClean at every breakpoint.");
await b.close();
process.exit(bad ? 1 : 0);
