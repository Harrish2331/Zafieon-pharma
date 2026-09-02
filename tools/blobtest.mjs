/**
 * Dev-only: prove the blob driver never touches the filesystem.
 *
 *   Start a production build with a deliberately invalid token, then:
 *   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_FAKE npx next start -p 3002
 *   ADMIN_TEST_PASSWORD=... node tools/blobtest.mjs
 *
 * ── What this catches ──────────────────────────────────────────────────────
 * The manifest used to be written to disk regardless of driver, on the
 * reasoning that a few kilobytes of JSON did not need a backend of its own. On
 * Vercel that is a read-only filesystem, so every text save died on
 * `ENOENT: mkdir /var/task/.data` while image uploads appeared to work.
 *
 * The token here is invalid on purpose. A Blob API error is the PASS condition:
 * it means the write reached Blob. An ENOENT is the FAIL condition: it means
 * the write went to disk, and this deployment would break on any serverless
 * host.
 */
import puppeteer from "puppeteer-core";
const BASE = process.env.BASE_URL ?? "http://localhost:3002";
const PASSWORD = process.env.ADMIN_TEST_PASSWORD ?? "zafieon-local-dev-2026";
const b = await puppeteer.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true,args:["--no-sandbox","--enable-unsafe-swiftshader"]});
const p = await b.newPage();
await p.goto(BASE + "/admin/login", { waitUntil: "domcontentloaded" });
await new Promise(r=>setTimeout(r,1200));
await p.type("#admin-password", PASSWORD);
await p.click('button[type="submit"]');
await new Promise(r=>setTimeout(r,2500));
console.log("signed in:", await p.evaluate(()=>location.pathname));

const text = await p.evaluate(async () => {
  const r = await fetch("/api/admin/insight-text", {
    method: "POST", headers: {"content-type":"application/json"},
    body: JSON.stringify({ slot: 1, standfirst: "blob driver probe" }),
  });
  return { status: r.status, body: await r.json() };
});
console.log("text save →", text.status, JSON.stringify(text.body));

const img = await p.evaluate(async () => {
  const fd = new FormData();
  fd.set("slot","1");
  fd.set("image", new File([new Uint8Array([82,73,70,70])], "x.webp", { type: "image/webp" }));
  const r = await fetch("/api/admin/insight-image", { method:"POST", body: fd });
  return { status: r.status, body: await r.json() };
});
console.log("image save →", img.status, JSON.stringify(img.body));

const msg = JSON.stringify(text.body) + JSON.stringify(img.body);
const enoent = /ENOENT|mkdir|no such file/i.test(msg);
console.log("\n" + (enoent ? "✗ FAIL — still writing to the filesystem" : "✓ PASS — filesystem is not touched under the blob driver"));
await b.close();
process.exit(enoent ? 1 : 0);
