/**
 * Dev-only: cut the manufacturing film's poster from a real frame of the film.
 *
 *   node tools/poster.mjs [seconds]
 *
 * The poster sits beneath the film as a real image and is what a visitor holds
 * on when motion is declined, when Save-Data is set, or before the film has
 * buffered. It has to be a frame of THIS film at THIS aspect ratio, or the
 * handover from poster to film is visible.
 *
 * Decoded by headless Chrome rather than ffmpeg, which is not a dependency of
 * this project. Also prints the base64 blur placeholder for site.ts.
 */
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const AT = Number(process.argv[2] ?? 1.6);
const SRC = "public/video/manufacturing.mp4";
const OUT = "public/video/manufacturing-poster.webp";

// Chrome will not decode a file:// video into a canvas, so serve it.
const mp4 = await readFile(SRC);
// Page and film must share an origin, or the canvas is tainted and cannot
// be read back.
const server = createServer((req, res) => {
  if (req.url === "/film.mp4") {
    res.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": mp4.length });
    return res.end(mp4);
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<!doctype html><meta charset=utf-8><title>poster</title>");
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "domcontentloaded" });

const frame = await page.evaluate(async ({ at }) => {
  /* Played and sampled, not seeked. Setting currentTime on a video that is
     not in the document does not reliably move it — it silently stayed at 0,
     and the poster that produced was a frame from nowhere in this film. */
  const v = document.createElement("video");
  v.src = "/film.mp4";
  v.muted = true;
  v.playsInline = true;
  v.preload = "auto";
  document.body.appendChild(v);
  await new Promise((res, rej) => {
    v.oncanplaythrough = res;
    v.onerror = () => rej(new Error("video failed to load"));
    setTimeout(res, 8000);
  });
  await v.play();
  const target = Math.min(at, Math.max(0, v.duration - 0.1));
  while (v.currentTime < target && !v.ended) {
    await new Promise((r) => setTimeout(r, 60));
  }
  v.pause();
  const c = document.createElement("canvas");
  c.width = v.videoWidth;
  c.height = v.videoHeight;
  c.getContext("2d").drawImage(v, 0, 0);
  return {
    data: c.toDataURL("image/png"),
    w: v.videoWidth,
    h: v.videoHeight,
    dur: v.duration,
    at: +v.currentTime.toFixed(2),
  };
}, { at: AT });
void port;

await browser.close();
server.close();

const png = Buffer.from(frame.data.split(",")[1], "base64");

const poster = await sharp(png).webp({ quality: 82 }).toFile(OUT);
console.log(`  frame at ${frame.at}s of ${frame.dur.toFixed(2)}s — ${frame.w}x${frame.h}`);
console.log(`  poster  ${OUT}  ${poster.width}x${poster.height}  ${(poster.size / 1024).toFixed(0)} KB`);

// The tiny blurred placeholder that site.ts carries inline.
const blur = await sharp(png).resize(20, 11, { fit: "fill" }).webp({ quality: 42 }).toBuffer();
console.log(`\n  blurDataURL for site.ts (${blur.length} bytes):\n`);
console.log(`      "data:image/webp;base64,${blur.toString("base64")}",`);

await writeFile(".work/poster-blur.txt", `data:image/webp;base64,${blur.toString("base64")}`);
