/**
 * Dev-only: the 19 October feature set.
 *
 *   BASE_URL=http://localhost:3021 node tools/featurecheck.mjs
 *
 * Coming-soon marking on Meta-CoQ 300, the two office map links, the optional
 * WhatsApp and Google-review actions, the Gynaecology sequence surviving all
 * of it, and no stray randomisation in the catalogue order.
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ok = [];
const bad = [];
const t = (n, c, d = "") => (c ? ok : bad).push(n + (c || !d ? "" : ` -- ${d}`));

const MUMBAI = "https://share.google/OHvZiG2RnKI5Pc2wG";
const CHENNAI = "https://share.google/galcaQTS09mTWwMQ2g";
const SEQ = [
  "femi-dros-30", "femi-dros-20", "proluvia-aq", "meta-coq",
  "zyfolic", "zyfolic-q4", "iro-plus", "femulet",
  "florabet-ll", "ferrin-xt", "luna-35", "iro-cal",
  "mifiprine", "miso-pro",
];

const b = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});

for (const [label, w, h, mob] of [
  ["desktop", 1440, 900, false],
  ["tablet", 768, 1024, true],
  ["phone", 390, 844, true],
]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, isMobile: mob, hasTouch: mob });
  await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  const errs = [];
  p.on("pageerror", (e) => errs.push("pageerror " + e.message.slice(0, 100)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 100)));

  // ── Coming soon, on the card ──────────────────────────────────────────────
  await p.goto(BASE + "/products", { waitUntil: "domcontentloaded" });
  await p.waitForSelector('a[href="/products/meta-coq"]', { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  const card = await p.evaluate(() => {
    const a = document.querySelector('a[href="/products/meta-coq"]');
    const badge = [...a.querySelectorAll("span")].find((s) =>
      /coming soon/i.test(s.textContent.trim()),
    );
    const plate = a.querySelector("img")?.parentElement?.getBoundingClientRect();
    const r = badge?.getBoundingClientRect();
    const others = [...document.querySelectorAll('a[href^="/products/"]')].filter(
      (x) =>
        x.getAttribute("href") !== "/products/meta-coq" &&
        /coming soon/i.test(x.textContent),
    ).length;
    const veg = a.querySelector('[aria-label="Vegetarian"]')?.getBoundingClientRect();
    return {
      badge: !!badge,
      text: badge?.textContent.trim() ?? null,
      visible: !!r && r.width > 0 && r.height > 0,
      insidePlate:
        !!r && !!plate && r.top >= plate.top - 1 && r.bottom <= plate.bottom + 1 &&
        r.left >= plate.left - 1 && r.right <= plate.right + 1,
      clearsVeg: !!r && !!veg && (r.right < veg.left || r.bottom < veg.top),
      others,
      hasDate: /\b(20\d\d|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(
        badge?.textContent ?? "",
      ),
    };
  });
  t(`Meta-CoQ card carries a visible COMING SOON badge (${label})`,
    card.badge && card.visible && card.insidePlate, JSON.stringify(card));
  t(`The badge does not collide with the veg mark (${label})`, card.clearsVeg,
    JSON.stringify(card.clearsVeg));
  t(`No other product is marked coming soon (${label})`, card.others === 0,
    String(card.others));
  t(`The badge states no date (${label})`, !card.hasDate, card.text ?? "");

  // ── Coming soon, on the detail page, and the enquiry adapts ───────────────
  await p.goto(BASE + "/products/meta-coq", { waitUntil: "domcontentloaded" });
  await p.waitForSelector("h1", { timeout: 30000 });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 900));
  const pdp = await p.evaluate(() => {
    const txt = document.body.innerText.replace(/\s+/g, " ");
    return {
      badge: /COMING SOON/i.test(txt),
      spec: /Availability/i.test(txt),
      enquiry: /is coming soon/i.test(txt),
      cta: [...document.querySelectorAll("a")].some((a) =>
        /register interest/i.test(a.textContent),
      ),
      notOrderable: !/wholesale or trade enquiries/i.test(txt),
      stillGynae: /gyna?ecology/i.test(txt),
      forMen: /FOR MEN/i.test(txt),
      overflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  t(`Meta-CoQ page marks it coming soon, in the spec too (${label})`,
    pdp.badge && pdp.spec, JSON.stringify(pdp));
  t(`The enquiry section asks to be notified instead of inviting an order (${label})`,
    pdp.enquiry && pdp.cta && pdp.notOrderable, JSON.stringify(pdp));
  t(`It keeps its Gynaecology area and its pack marking (${label})`,
    pdp.stillGynae && pdp.forMen, JSON.stringify(pdp));
  t(`No horizontal overflow on the product page (${label})`, pdp.overflow <= 0,
    String(pdp.overflow));

  // ── Office map links, on Contact and in the footer ────────────────────────
  await p.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });
  await p.waitForSelector("h1", { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));
  const maps = await p.evaluate(() => {
    const links = [...document.querySelectorAll('a[href^="https://share.google/"]')].map(
      (a) => ({
        href: a.getAttribute("href"),
        text: a.textContent.replace(/\s+/g, " ").trim(),
        target: a.getAttribute("target"),
        rel: a.getAttribute("rel") ?? "",
        inFooter: !!a.closest("footer"),
        w: Math.round(a.getBoundingClientRect().width),
      }),
    );
    return {
      links,
      overflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      // Nothing may claim a phone number, which Zafieon has not supplied.
      invented: /\+91[\d\s-]{8,}/.test(document.body.innerText),
    };
  });
  const main = maps.links.filter((l) => !l.inFooter);
  const foot = maps.links.filter((l) => l.inFooter);
  t(`Contact offers both office map links (${label})`,
    main.some((l) => l.href === MUMBAI) && main.some((l) => l.href === CHENNAI),
    JSON.stringify(main.map((l) => l.text)));
  t(`Each names its city (${label})`,
    main.some((l) => /mumbai/i.test(l.text)) && main.some((l) => /chennai/i.test(l.text)),
    JSON.stringify(main.map((l) => l.text)));
  t(`Every map link opens safely in a new tab (${label})`,
    maps.links.length > 0 &&
      maps.links.every((l) => l.target === "_blank" && /noopener/.test(l.rel)),
    JSON.stringify(maps.links.map((l) => `${l.target} ${l.rel}`)));
  t(`The footer offers directions for both offices (${label})`, foot.length === 2,
    String(foot.length));
  t(`Every map link is actually rendered (${label})`,
    maps.links.every((l) => l.w > 0), JSON.stringify(maps.links.map((l) => l.w)));
  t(`No telephone number is invented on Contact (${label})`, !maps.invented);

  // ── The optional actions are absent, not broken, while unconfigured ───────
  const optional = await p.evaluate(() => ({
    wa: [...document.querySelectorAll("a")]
      .map((a) => a.getAttribute("href") ?? "")
      .filter((h) => /wa\.me|api\.whatsapp|whatsapp/i.test(h)),
    review: [...document.querySelectorAll("a")]
      .map((a) => a.getAttribute("href") ?? "")
      .filter((h) => /review|g\.page/i.test(h)),
    claimsRating: /\b[0-5][.,]\d\s*(\/\s*5|stars?)\b/i.test(document.body.innerText),
  }));
  t(`No WhatsApp link is emitted while no number is configured (${label})`,
    optional.wa.length === 0, optional.wa.join(", "));
  t(`No review link is emitted while none is configured (${label})`,
    optional.review.length === 0, optional.review.join(", "));
  t(`No rating or review count is claimed (${label})`, !optional.claimsRating);

  // ── Order is fixed, not shuffled ──────────────────────────────────────────
  /* Read from the DOM, not from the HTML source: /products is prerendered
     static, so the markup it ships holds the whole catalogue in catalogue
     order and the area filter is applied on the client after hydration.
     Scraping the source therefore measures the wrong list entirely. */
  const order = async () => {
    await p.goto(BASE + "/products?area=gynecology", { waitUntil: "domcontentloaded" });
    await p.waitForSelector('a[href^="/products/"]', { timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2200));
    return p.evaluate(() => [
      ...new Set(
        [...document.querySelectorAll('a[href^="/products/"]')].map((a) =>
          a.getAttribute("href").replace("/products/", ""),
        ),
      ),
    ]);
  };
  const firstLoad = await order();
  const secondLoad = await order();
  t(`Gynaecology keeps Zafieon's sequence (${label})`,
    JSON.stringify(firstLoad.slice(0, 14)) === JSON.stringify(SEQ),
    firstLoad.slice(0, 14).join(" > "));
  t(`Two loads return the same order -- nothing is randomised (${label})`,
    JSON.stringify(firstLoad) === JSON.stringify(secondLoad),
    `${firstLoad.join(",")} vs ${secondLoad.join(",")}`);

  t(`No console or page errors (${label})`, errs.length === 0, errs.slice(0, 2).join(" | "));
  if (label !== "tablet") {
    await p.goto(BASE + "/products/meta-coq", { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1800));
    await p.screenshot({ path: `.work/feat-metacoq-${w}.png` });
    await p.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1500));
    await p.evaluate(() => document.getElementById("reach-us")?.scrollIntoView({ block: "center" }));
    await new Promise((r) => setTimeout(r, 900));
    await p.screenshot({ path: `.work/feat-contact-${w}.png` });
  }
  await p.close();
}

// ── SEO surfaces are untouched ──────────────────────────────────────────────
{
  const sm = await (await fetch(BASE + "/sitemap.xml")).text();
  t("Meta-CoQ is still in the sitemap", sm.includes("/products/meta-coq"));
  const html = await (await fetch(BASE + "/products/meta-coq")).text();
  t("Its page is still indexable", !/noindex/.test(html));
  const canon = (page) =>
    (page.match(/rel="canonical"\s+href="([^"]+)"/) ?? [])[1] ?? null;
  const metaCanon = canon(html);
  t("Its canonical still points at its own absolute URL",
    !!metaCanon && /^https:\/\/[^/]+\/products\/meta-coq$/.test(metaCanon),
    metaCanon ?? "none");
  const contact = await (await fetch(BASE + "/contact")).text();
  const contactCanon = canon(contact);
  t("Contact is still indexable, on the same host as the product canonical",
    !/noindex/.test(contact) &&
      !!contactCanon &&
      new URL(contactCanon).origin === new URL(metaCanon).origin &&
      new URL(contactCanon).pathname === "/contact",
    contactCanon ?? "none");
  const robots = await (await fetch(BASE + "/robots.txt")).text();
  t("robots.txt still points at the sitemap", /sitemap/i.test(robots));
  const icon = await fetch(BASE + "/favicon.ico");
  t("The favicon is still served", icon.ok);
}

console.log("");
ok.forEach((x) => console.log("  ok   " + x));
if (bad.length) {
  console.log("");
  bad.forEach((x) => console.log("  FAIL " + x));
}
console.log(`\n${ok.length}/${ok.length + bad.length} feature checks passed.`);
await b.close();
process.exit(bad.length ? 1 : 0);
