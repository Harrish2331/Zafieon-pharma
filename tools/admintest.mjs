/**
 * Dev-only: exercise the Admin Dashboard end to end.
 *
 *   ADMIN_TEST_PASSWORD=... BASE_URL=... node tools/admintest.mjs
 *
 * Signs in, replaces an Insights image, confirms the change reaches the public
 * site, then restores the original and confirms that too. Leaves the store as
 * it found it.
 */
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const PASSWORD = process.env.ADMIN_TEST_PASSWORD;

if (!PASSWORD) {
  console.error("Set ADMIN_TEST_PASSWORD to the dashboard password.");
  process.exit(1);
}

const ok = [];
const bad = [];
const t = (name, cond) => (cond ? ok : bad).push(name);

// A visually distinct 1200x675 test image, so a change is unmistakable.
const testImage = await sharp({
  create: {
    width: 1200,
    height: 675,
    channels: 3,
    background: { r: 229, g: 24, b: 138 },
  },
})
  .webp({ quality: 80 })
  .toBuffer();

const b = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });

// The rejection cases below deliberately provoke 4xx responses; Chrome logs
// each as a console error. Only unexpected noise is collected.
const EXPECTED = /(413|415|400) \(/;
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));
p.on(
  "console",
  (m) => m.type() === "error" && !EXPECTED.test(m.text()) && errors.push(m.text()),
);

// 1 ── Sign in through the real form.
await p.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded" });
await new Promise((r) => setTimeout(r, 1200));
await p.type("#admin-password", PASSWORD);
await p.click('button[type="submit"]');
await new Promise((r) => setTimeout(r, 2500));
t(
  "Correct password reaches the dashboard",
  await p.evaluate(() => location.pathname === "/admin"),
);
t(
  "Dashboard shows four image slots",
  (await p.evaluate(() => document.querySelectorAll('input[type="file"]').length)) === 4,
);

// 2 ── Upload a replacement for slot 1.
const upload = await p.evaluate(async (bytes) => {
  const fd = new FormData();
  fd.set("slot", "1");
  fd.set(
    "image",
    new File([new Uint8Array(bytes)], "test.webp", { type: "image/webp" }),
  );
  const r = await fetch("/api/admin/insight-image", { method: "POST", body: fd });
  return { status: r.status, body: await r.json() };
}, [...testImage]);
t("Authenticated upload is accepted", upload.status === 200 && upload.body.ok);

// 3 ── The public site serves it.
await new Promise((r) => setTimeout(r, 1500));
const publicUrl = await (async () => {
  const q = await b.newPage();
  await q.goto(`${BASE}/insights`, { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2000));
  // The first image on the page is the navbar logo; the Insights artwork is
  // what sits inside the article links.
  const src = await q.evaluate(() => {
    const img = document.querySelector('a[href^="/insights/"] img');
    return img ? img.getAttribute("src") : null;
  });
  await q.close();
  return src;
})();
t(
  "Public Insights page points at the uploaded image",
  !!publicUrl && /insight-image|blob\.vercel-storage/.test(decodeURIComponent(publicUrl ?? "")),
);

// The stored URL carries a version segment, so it is read back from the
// upload response rather than reconstructed here.
const storedUrl = upload.body.record?.url;
t("Upload returns a versioned URL", /^\/api\/insight-image\/1\/\d+$/.test(storedUrl ?? ""));
const served = await fetch(BASE + storedUrl);
t("Uploaded image is served", served.status === 200);
t(
  "Uploaded image keeps its content type",
  served.headers.get("content-type") === "image/webp",
);
t(
  "Uploaded image is byte-identical to what was sent",
  Buffer.from(await served.arrayBuffer()).equals(testImage),
);

// 4 ── Rejections.
const tooBig = await p.evaluate(async () => {
  const fd = new FormData();
  fd.set("slot", "1");
  fd.set(
    "image",
    new File([new Uint8Array(9 * 1024 * 1024)], "big.webp", {
      type: "image/webp",
    }),
  );
  const r = await fetch("/api/admin/insight-image", { method: "POST", body: fd });
  return r.status;
});
t("Oversized upload is rejected", tooBig === 413);

const wrongType = await p.evaluate(async () => {
  const fd = new FormData();
  fd.set("slot", "1");
  fd.set("image", new File(["x"], "x.svg", { type: "image/svg+xml" }));
  const r = await fetch("/api/admin/insight-image", { method: "POST", body: fd });
  return r.status;
});
t("SVG upload is rejected", wrongType === 415);

const badSlot = await p.evaluate(async () => {
  const fd = new FormData();
  fd.set("slot", "9");
  fd.set("image", new File(["x"], "x.webp", { type: "image/webp" }));
  const r = await fetch("/api/admin/insight-image", { method: "POST", body: fd });
  return r.status;
});
t("Unknown slot is rejected", badSlot === 400);

// 5b ── Text edits, and their independence from the image.
{
  const marker = `Edited description ${Date.now()}`;
  const titleMarker = "An edited insight title";

  // Baseline: what the public page shows before any text override.
  const before = await (async () => {
    const q = await b.newPage();
    await q.goto(`${BASE}/insights`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1800));
    const txt = await q.evaluate(() => document.body.innerText);
    await q.close();
    return txt;
  })();

  const saved = await p.evaluate(
    async ([desc, title]) => {
      const r = await fetch("/api/admin/insight-text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slot: 1, standfirst: desc, title }),
      });
      return { status: r.status, body: await r.json() };
    },
    [marker, titleMarker],
  );
  t("Authenticated text save is accepted", saved.status === 200 && saved.body.ok);

  await new Promise((r) => setTimeout(r, 1500));
  const after = await (async () => {
    const q = await b.newPage();
    await q.goto(`${BASE}/insights`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));
    const txt = await q.evaluate(() => document.body.innerText);
    await q.close();
    return txt;
  })();
  t("Edited description reaches the public site", after.includes(marker));
  t("Edited title reaches the public site",
    after.toLowerCase().includes(titleMarker.toLowerCase()));
  t("The description actually changed", !before.includes(marker));

  // The image must be untouched by a text save.
  const imageStillThere = await fetch(BASE + storedUrl);
  t(
    "Saving text leaves the uploaded image alone",
    imageStillThere.status === 200 &&
      Buffer.from(await imageStillThere.arrayBuffer()).equals(testImage),
  );

  // A partial save must not clear the field it did not mention.
  const partial = await p.evaluate(async () => {
    const r = await fetch("/api/admin/insight-text", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slot: 1, body: "One.\n\nTwo." }),
    });
    return (await r.json()).record;
  });
  t(
    "Saving one field leaves the others intact",
    partial.title === titleMarker && partial.standfirst === marker,
  );
  t("Blank lines split the body into paragraphs",
    Array.isArray(partial.body) && partial.body.length === 2);

  // An empty string clears one field back to what shipped.
  const cleared = await p.evaluate(async () => {
    const r = await fetch("/api/admin/insight-text", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slot: 1, title: "" }),
    });
    return (await r.json()).record;
  });
  t("An empty field reverts to the shipped wording",
    !cleared.title && cleared.standfirst === marker);

  // Over-long input is refused rather than truncated.
  const tooLong = await p.evaluate(async () => {
    const r = await fetch("/api/admin/insight-text", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slot: 1, standfirst: "x".repeat(500) }),
    });
    return r.status;
  });
  t("An over-long description is rejected", tooLong === 400);

  // Reset text, and confirm the image survives that too.
  const resetText = await p.evaluate(async () => {
    const r = await fetch("/api/admin/insight-text?slot=1", { method: "DELETE" });
    return r.status;
  });
  t("Text reset is accepted", resetText === 200);

  await new Promise((r) => setTimeout(r, 1500));
  const restoredText = await (async () => {
    const q = await b.newPage();
    await q.goto(`${BASE}/insights`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));
    const txt = await q.evaluate(() => document.body.innerText);
    const src = await q.evaluate(() => {
      const img = document.querySelector('a[href^="/insights/"] img');
      return img ? img.getAttribute("src") : null;
    });
    await q.close();
    return { txt, src };
  })();
  t("Restoring text brings back the shipped wording",
    !restoredText.txt.includes(marker) &&
      !restoredText.txt.toLowerCase().includes(titleMarker.toLowerCase()));
  t("Restoring text leaves the uploaded image in place",
    !!restoredText.src && /insight-image|blob\.vercel-storage/.test(
      decodeURIComponent(restoredText.src)));

  const textUnauth = await (await fetch(`${BASE}/api/admin/insight-text`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ slot: 1, standfirst: "nope" }),
  })).status;
  t("Unauthenticated text save is rejected with 401", textUnauth === 401);
}

// 5 ── Restore, and confirm the shipped image comes back.
// A stale URL — a slot with nothing stored behind it — must degrade to the
// artwork that shipped with the build, not to a broken image. A cached page
// can still point at a version segment for a few seconds after a reset.
const stale = await fetch(`${BASE}/api/insight-image/2/1`, { redirect: "manual" });
t("A slot with no override redirects rather than failing",
  stale.status === 302 || stale.status === 307);
t("It redirects to the image shipped with the build",
  (stale.headers.get("location") ?? "").includes("/images/insights/"));

const followed = await fetch(`${BASE}/api/insight-image/2/1`);
t("Following that redirect returns a real image",
  followed.status === 200 && (followed.headers.get("content-type") ?? "").startsWith("image/"));

const badVersion = await fetch(`${BASE}/api/insight-image/1/not-a-number`);
t("A malformed version segment returns 404", badVersion.status === 404);

const reset = await p.evaluate(async () => {
  const r = await fetch("/api/admin/insight-image?slot=1", { method: "DELETE" });
  return r.status;
});
t("Reset is accepted", reset === 200);

await new Promise((r) => setTimeout(r, 1500));
const restored = await (async () => {
  const q = await b.newPage();
  await q.goto(`${BASE}/insights`, { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2000));
  const src = await q.evaluate(() => {
    const img = document.querySelector('a[href^="/insights/"] img');
    return img ? img.getAttribute("src") : null;
  });
  await q.close();
  return src;
})();
t(
  "Restore brings back the image shipped with the build",
  !!restored && decodeURIComponent(restored).includes("/images/insights/"),
);

// 6 ── Sign out closes the door again.
await p.evaluate(() => fetch("/api/admin/session", { method: "DELETE" }));
await p.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
await new Promise((r) => setTimeout(r, 1200));
t(
  "Sign out returns the dashboard to the login screen",
  await p.evaluate(() => location.pathname === "/admin/login"),
);

t("No console or page errors during the admin flow", errors.length === 0);
if (errors.length) errors.slice(0, 5).forEach((e) => console.log("   ! " + e));

console.log("\nPASS");
ok.forEach((x) => console.log("  ✓ " + x));
if (bad.length) {
  console.log("\nFAIL");
  bad.forEach((x) => console.log("  ✗ " + x));
}
console.log(`\n${ok.length}/${ok.length + bad.length} checks passed.`);
await b.close();
process.exit(bad.length ? 1 : 0);
