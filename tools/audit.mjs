/**
 * Dev-only: application-wide audit.
 *
 *   BASE_URL=http://localhost:3021 node tools/audit.mjs
 *
 * Sweeps every route the sitemap and the data expose, at desktop, tablet and
 * phone, and reports anything a reader would meet as a fault: a runtime error,
 * a failed request, an image that did not decode, a page that scrolls
 * sideways, a heading structure that does not parse, an interactive control
 * with no accessible name, a link that goes nowhere.
 *
 * Then it exercises the API surface the way a hostile client would — wrong
 * method, no session, malformed body, unknown slot, oversized upload — and
 * asserts the status code each case must answer with.
 *
 * It fixes nothing and changes nothing: every write it attempts is one that
 * must be refused.
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ok = [];
const bad = [];
const t = (name, cond, detail = "") =>
  (cond ? ok : bad).push(name + (cond || !detail ? "" : ` -- ${detail}`));

const b = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});

// ── Routes, taken from the running site rather than listed here ─────────────
const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
const routes = [
  ...new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => new URL(m[1]).pathname)
      .concat([
        // Not in the sitemap by design: the Rx range is noindex, and the
        // dashboard is private. Both still have to render without faults.
        "/products/femi-dros-30",
        "/products/miso-pro",
        "/products/mifiprine",
        "/admin/login",
        "/this-route-does-not-exist",
      ]),
  ),
].sort();

const VIEWPORTS = [
  ["desktop", 1440, 900, false],
  ["tablet", 768, 1024, true],
  ["phone", 390, 844, true],
];

/* The Rx gate is a modal by design, so it is acknowledged before the page
   underneath is audited — otherwise every prescription route reports its
   content as missing. */
const passGate = async (p) => {
  const gated = await p.$('[role="dialog"]');
  if (!gated) return false;
  await p.evaluate(() => {
    [...document.querySelectorAll('[role="dialog"] button')]
      .find((x) => /healthcare professional/i.test(x.textContent))
      ?.click();
  });
  await new Promise((r) => setTimeout(r, 900));
  return true;
};

for (const [label, w, h, mobile] of VIEWPORTS) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, isMobile: mobile, hasTouch: mobile });
  await p.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);

  const faults = [];
  p.on("pageerror", (e) => faults.push(`${p.url()} pageerror: ${e.message.slice(0, 120)}`));
  p.on("console", (m) => {
    if (m.type() !== "error") return;
    // The 404 probe below logs its own 404; that is the thing being tested.
    if (p.url().includes("this-route-does-not-exist")) return;
    faults.push(`${p.url()} console: ${m.text().slice(0, 120)}`);
  });
  p.on("requestfailed", (r) => {
    const why = r.failure()?.errorText ?? "";
    if (/ABORTED/.test(why)) return; // a navigation cancelling its own fetches
    faults.push(`${p.url()} requestfailed: ${r.url().slice(-60)} ${why}`);
  });
  p.on("response", (r) => {
    if (r.status() >= 400 && !r.url().includes("this-route-does-not-exist")) {
      faults.push(`${p.url()} ${r.status()} on ${r.url().slice(-70)}`);
    }
  });

  const broken = [];
  const overflow = [];
  const headingFaults = [];
  const namelessControls = [];
  const emptyPages = [];

  for (const route of routes) {
    const expect404 = route === "/this-route-does-not-exist";
    const res = await p.goto(BASE + route, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    if (expect404) {
      t(`404 route answers 404 (${label})`, res.status() === 404, String(res.status()));
    }
    await p.waitForSelector("h1", { timeout: 30000 }).catch(() => {});
    await passGate(p);

    // Scroll the page so lazy images and reveal animations actually run.
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 55));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 800));

    const r = await p.evaluate(() => {
      const imgs = [...document.images].filter((i) => i.currentSrc);
      const h = [...document.querySelectorAll("h1,h2,h3,h4")].map((x) =>
        Number(x.tagName[1]),
      );
      let jump = null;
      for (let i = 1; i < h.length; i++) {
        if (h[i] - h[i - 1] > 1) jump = `h${h[i - 1]} -> h${h[i]}`;
      }
      const name = (el) =>
        (
          el.getAttribute("aria-label") ||
          el.getAttribute("title") ||
          el.textContent ||
          el.querySelector("img")?.alt ||
          ""
        ).trim();
      return {
        broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) =>
          i.currentSrc.slice(-60),
        ),
        imgCount: imgs.length,
        noAlt: imgs.filter((i) => i.alt === null || i.alt === undefined).length,
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        h1s: document.querySelectorAll("h1").length,
        jump,
        nameless: [...document.querySelectorAll("a,button")]
          .filter((el) => el.offsetParent !== null && !name(el))
          .map((el) => el.tagName + (el.className || "").toString().slice(0, 40)),
        textLen: document.body.innerText.replace(/\s+/g, " ").trim().length,
        emptyLinks: [...document.querySelectorAll("a")]
          .map((a) => a.getAttribute("href"))
          .filter((href) => href === "" || href === "#" || href === null).length,
      };
    });

    if (r.broken.length) broken.push(`${route}: ${r.broken.join(", ")}`);
    if (r.overflow > 0) overflow.push(`${route}: +${r.overflow}px`);
    if (r.h1s !== 1) headingFaults.push(`${route}: ${r.h1s} h1`);
    if (r.jump) headingFaults.push(`${route}: ${r.jump}`);
    if (r.nameless.length) namelessControls.push(`${route}: ${r.nameless.join(" | ")}`);
    /* /admin/login is a password field and one sentence by design, so it is
       held to having its form rather than to a word count. */
    if (route === "/admin/login") {
      const form = await p.evaluate(() => ({
        pw: !!document.querySelector('input[type="password"]'),
        submit: !!document.querySelector('button[type="submit"], button'),
      }));
      t(`Login page offers a password field and a submit (${label})`,
        form.pw && form.submit, JSON.stringify(form));
    } else if (!expect404 && r.textLen < 400) {
      emptyPages.push(`${route}: ${r.textLen} chars`);
    }
    if (r.emptyLinks) namelessControls.push(`${route}: ${r.emptyLinks} href-less links`);
  }

  t(`No runtime, console or request faults on any route (${label})`,
    faults.length === 0, [...new Set(faults)].slice(0, 4).join(" || "));
  t(`Every image decodes on every route (${label})`, broken.length === 0,
    broken.slice(0, 3).join(" | "));
  t(`No route scrolls sideways (${label})`, overflow.length === 0,
    overflow.slice(0, 4).join(" | "));
  t(`Exactly one h1 and no skipped heading level (${label})`,
    headingFaults.length === 0, headingFaults.slice(0, 4).join(" | "));
  t(`Every visible link and button has an accessible name (${label})`,
    namelessControls.length === 0, namelessControls.slice(0, 3).join(" | "));
  t(`No route renders empty (${label})`, emptyPages.length === 0,
    emptyPages.slice(0, 3).join(" | "));

  await p.close();
}

// ── Navigation actually navigates, at phone width too ───────────────────────
{
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await p.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1200));

  const opened = await p.evaluate(async () => {
    const btn = [...document.querySelectorAll("button")].find((x) =>
      /menu/i.test(x.getAttribute("aria-label") ?? x.textContent ?? ""),
    );
    btn?.click();
    await new Promise((r) => setTimeout(r, 700));
    const items = [...document.querySelectorAll("nav a, header a")]
      .filter((a) => a.offsetParent !== null)
      .map((a) => ({
        href: a.getAttribute("href"),
        label: a.textContent.trim(),
        right: Math.round(a.getBoundingClientRect().right),
      }));
    return { items, vw: window.innerWidth, scrollW: document.documentElement.scrollWidth };
  });
  t("Mobile menu opens and exposes its links", opened.items.length >= 7,
    String(opened.items.length));
  t("No mobile menu item spills past the viewport",
    opened.items.every((i) => i.right <= opened.vw),
    opened.items.filter((i) => i.right > opened.vw).map((i) => `${i.label}@${i.right}`).join(", "));
  t("Mobile menu does not widen the document", opened.scrollW <= opened.vw,
    `${opened.scrollW} vs ${opened.vw}`);

  // Follow each menu link and confirm it lands.
  const targets = [...new Set(opened.items.map((i) => i.href))].filter((h) =>
    h?.startsWith("/"),
  );
  const landed = [];
  for (const href of targets) {
    // `goto` answers null for a same-document navigation, so the status is
    // taken from a plain request and the render is confirmed separately.
    const res = await p.goto(BASE + href, { waitUntil: "domcontentloaded" });
    const status = res ? res.status() : (await fetch(BASE + href)).status;
    const rendered = await p
      .waitForSelector("h1", { timeout: 15000 })
      .then(() => true)
      .catch(() => false);
    if (![200, 304].includes(status) || !rendered) {
      landed.push(`${href}: ${status}${rendered ? "" : " no h1"}`);
    }
  }
  t("Every navigation target resolves", landed.length === 0, landed.join(", "));
  await p.close();
}

// ── API surface ─────────────────────────────────────────────────────────────
const api = async (path, init) => {
  const r = await fetch(BASE + path, init);
  let body = null;
  try {
    body = await r.json();
  } catch {
    /* not JSON, which some of these deliberately are not */
  }
  return { status: r.status, body, headers: r.headers };
};

{
  // Session endpoint
  const noBody = await api("/api/admin/session", { method: "POST" });
  t("Login with no body is 400 or 503", [400, 503].includes(noBody.status),
    String(noBody.status));

  const junk = await api("/api/admin/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{not json",
  });
  t("Login with malformed JSON is 400 or 503", [400, 503].includes(junk.status),
    String(junk.status));

  const wrongType = await api("/api/admin/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password: { $ne: null } }),
  });
  t("Login rejects a non-string password without throwing",
    [400, 401, 429, 503].includes(wrongType.status), String(wrongType.status));

  const wrong = await api("/api/admin/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password: "definitely-not-the-password" }),
  });
  t("A wrong password is refused", [401, 429, 503].includes(wrong.status),
    String(wrong.status));
  t("A refusal never echoes the submitted value",
    !JSON.stringify(wrong.body ?? "").includes("definitely-not"),
    JSON.stringify(wrong.body));

  const getSession = await api("/api/admin/session", { method: "GET" });
  t("GET on the session endpoint is 405", getSession.status === 405,
    String(getSession.status));

  // Writes without a session
  const img = await api("/api/admin/insight-image", {
    method: "POST",
    body: new URLSearchParams({ slot: "1" }),
  });
  t("Image upload without a session is 401", img.status === 401, String(img.status));

  const text = await api("/api/admin/insight-text", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ slot: 1, title: "AUDIT SHOULD NOT PERSIST" }),
  });
  t("Text save without a session is 401", text.status === 401, String(text.status));

  const delImg = await api("/api/admin/insight-image?slot=1", { method: "DELETE" });
  t("Image reset without a session is 401", delImg.status === 401,
    String(delImg.status));

  const delText = await api("/api/admin/insight-text?slot=1", { method: "DELETE" });
  t("Text reset without a session is 401", delText.status === 401,
    String(delText.status));

  const getText = await api("/api/admin/insight-text", { method: "GET" });
  t("GET on a write-only endpoint is 405", getText.status === 405,
    String(getText.status));

  // Public image route: validation, and the documented redirect
  const badSlot = await api("/api/insight-image/9/1", { redirect: "manual" });
  t("Unknown image slot is 404", badSlot.status === 404, String(badSlot.status));

  const badVersion = await api("/api/insight-image/1/not-a-number", {
    redirect: "manual",
  });
  t("Non-numeric image version is 404", badVersion.status === 404,
    String(badVersion.status));

  const traversal = await api("/api/insight-image/1/..%2F..%2Fpackage.json", {
    redirect: "manual",
  });
  t("A traversal attempt in the version segment is refused",
    traversal.status === 404 || traversal.status === 400, String(traversal.status));

  const good = await fetch(BASE + "/api/insight-image/1/1", { redirect: "manual" });
  t("A valid slot either serves bytes or redirects to the shipped artwork",
    [200, 302].includes(good.status), String(good.status));
}

// ── Public surface: the pieces the client depends on ────────────────────────
{
  const robots = await fetch(BASE + "/robots.txt");
  const robotsText = await robots.text();
  t("robots.txt is served", robots.ok && /sitemap/i.test(robotsText));
  t("robots.txt keeps the dashboard out of the index", /\/admin/.test(robotsText),
    robotsText.slice(0, 120));

  const sm = await fetch(BASE + "/sitemap.xml");
  const smText = await sm.text();
  t("sitemap.xml is well-formed XML", sm.ok && smText.trim().startsWith("<?xml"));

  // Prescription products are noindex, so they must not be advertised.
  const rx = ["femi-dros-30", "femi-dros-20", "miso-pro", "mifiprine", "let-bloom",
    "luna-35", "proluvia-aq"];
  const leaked = rx.filter((s) => smText.includes(`/products/${s}`));
  t("No prescription product appears in the sitemap", leaked.length === 0,
    leaked.join(", "));
  t("The dashboard does not appear in the sitemap", !smText.includes("/admin"));

  const og = await fetch(BASE + "/opengraph-image");
  // Streamed, so there is no content-length to read: measure the bytes.
  const ogBytes = og.ok ? (await og.arrayBuffer()).byteLength : 0;
  t("Social preview image renders",
    og.ok && /image\//.test(og.headers.get("content-type") ?? "") && ogBytes > 1000,
    `${og.status} ${og.headers.get("content-type")} ${ogBytes}B`);

  const film = await fetch(BASE + "/video/manufacturing.mp4", {
    method: "HEAD",
  });
  t("The manufacturing film is served",
    film.ok && Number(film.headers.get("content-length")) > 1_000_000,
    `${film.status} ${film.headers.get("content-length")}`);
  t("The film is not cached as immutable",
    !/immutable/.test(film.headers.get("cache-control") ?? ""),
    film.headers.get("cache-control") ?? "");

  const admin = await fetch(BASE + "/admin", { redirect: "manual" });
  t("The dashboard redirects anyone without a session",
    [302, 303, 307, 308].includes(admin.status) ||
      (admin.status === 200 && !(await admin.text()).includes("Replace")),
    String(admin.status));
}

// -- States: empty, reset, not-found, and the prescription gate -------------
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

  await p.goto(BASE + "/products", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2500));

  // A search that cannot match anything must say so, not render a bare grid.
  await p.click('input[type="search"]');
  await p.type('input[type="search"]', "zzzzqqqq", { delay: 25 });
  await new Promise((r) => setTimeout(r, 1600));
  const empty = await p.evaluate(() => {
    return {
      cards: document.querySelectorAll('a[href^="/products/"]').length,
      message: /no products match/i.test(document.body.innerText),
      reset: !![...document.querySelectorAll("button")].find((x) =>
        /reset filters/i.test(x.textContent),
      ),
      /* innerText breaks the counter across lines AND returns it as the CSS
         uppercases it, so it is normalised and matched case-insensitively. */
      counter:
        (document.body.innerText
          .replace(/\s+/g, " ")
          .match(/\b00 of \d\d\b/i) ?? [])[0] ?? null,
    };
  });
  t("An unmatchable search shows the empty state, not an empty grid",
    empty.cards === 0 && empty.message && empty.reset,
    JSON.stringify(empty));
  t("The counter reports zero rather than going stale", empty.counter !== null,
    String(empty.counter));

  // And the way out of it has to work.
  const recovered = await p.evaluate(async () => {
    [...document.querySelectorAll("button")]
      .find((x) => /reset filters/i.test(x.textContent))
      ?.click();
    await new Promise((r) => setTimeout(r, 1500));
    return {
      cards: new Set([...document.querySelectorAll('a[href^="/products/"]')]
        .map((a) => a.getAttribute("href"))).size,
      search: document.querySelector('input[type="search"]').value,
    };
  });
  t("Reset filters restores the whole catalogue and clears the search",
    recovered.cards === 15 && recovered.search === "",
    JSON.stringify(recovered));

  // The 404 has to offer a way back rather than being a dead end.
  await p.goto(BASE + "/no-such-page", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 900));
  const nf = await p.evaluate(() => ({
    text: document.body.innerText.replace(/\s+/g, " ").slice(0, 160),
    home: [...document.querySelectorAll("a")].some(
      (a) => a.getAttribute("href") === "/",
    ),
  }));
  t("The not-found page explains itself and links home", nf.home && nf.text.length > 20,
    nf.text);

  // The prescription gate: refusing it must not reveal the page behind it.
  await p.goto(BASE + "/products/mifiprine", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2000));
  const gate = await p.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return {
      dialog: !!d,
      modal: d?.getAttribute("aria-modal") === "true",
      labelled: !!d?.getAttribute("aria-labelledby"),
      leaked: /composition/i.test(document.body.innerText),
      accept: [...(d?.querySelectorAll("button") ?? [])].some((x) =>
        /healthcare professional/i.test(x.textContent),
      ),
      // Declining is a link back to the catalogue, not a second button.
      decline: [...(d?.querySelectorAll("a") ?? [])].some(
        (a) => a.getAttribute("href") === "/products",
      ),
      focused: document.activeElement?.tagName,
    };
  });
  t("The prescription gate blocks, is a labelled modal, and offers both choices",
    gate.dialog && gate.modal && gate.labelled && !gate.leaked &&
      gate.accept && gate.decline,
    JSON.stringify(gate));
  t("The gate moves focus into itself", gate.focused === "BUTTON", String(gate.focused));
  await p.close();
}

console.log("\nPASS");
ok.forEach((x) => console.log("  ok   " + x));
if (bad.length) {
  console.log("\nFAIL");
  bad.forEach((x) => console.log("  FAIL " + x));
}
console.log(`\n${ok.length}/${ok.length + bad.length} audit checks passed.`);
await b.close();
process.exit(bad.length ? 1 : 0);
