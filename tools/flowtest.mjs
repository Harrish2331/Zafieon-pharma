/** Dev-only: exercise the interactive flows end to end. */
import puppeteer from "puppeteer-core";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true, args: ["--no-sandbox","--enable-unsafe-swiftshader"],
});
const ok = [], bad = [];
const t = (name, cond) => (cond ? ok : bad).push(name);

// 1 ── Prescription gate blocks, then admits
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/products/femi-dros-30", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2500));
  const gated = await p.evaluate(() => !!document.querySelector('[role="dialog"]'));
  const leaked = await p.evaluate(() =>
    document.body.innerText.includes("Pack shown for identification"));
  t("Rx gate shown", gated);
  t("Rx content not leaked before acknowledgement", !leaked);

  await p.evaluate(() => {
    const btns = [...document.querySelectorAll('[role="dialog"] button')];
    btns.find(x => /healthcare professional/i.test(x.textContent))?.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  const opened = await p.evaluate(() =>
    document.body.innerText.includes("Product") &&
    !document.querySelector('[role="dialog"]'));
  t("Rx gate admits on acknowledgement", opened);

  // Session persistence across the second Rx product
  await p.goto(BASE + "/products/miso-pro", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1800));
  t("Rx acknowledgement persists in session",
    await p.evaluate(() => !document.querySelector('[role="dialog"]')));
  await p.close();
}

// 2 ── Nutraceutical is NOT gated
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/products/zyfolic", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2000));
  t("Nutraceutical page ungated",
    await p.evaluate(() => !document.querySelector('[role="dialog"]')));
  await p.close();
}

// 3 ── Catalogue filtering, by the three published categories
{
  // Counts come from the environment rather than being hardcoded, so adding a
  // product cannot silently break these assertions.
  const cases = [
    ["prescription", Number(process.env.RX_COUNT)],
    ["nutraceutical", Number(process.env.NUTRA_COUNT)],
    ["hormone", Number(process.env.HORMONE_COUNT)],
  ];
  for (const [cat, expected] of cases) {
    const p = await b.newPage();
    await p.setViewport({ width: 1440, height: 900 });
    await p.goto(BASE + "/products?category=" + cat, { waitUntil: "domcontentloaded" });
    await new Promise(r => setTimeout(r, 2500));
    const n = await p.evaluate(() =>
      document.querySelectorAll('a[href^="/products/"]').length);
    t(`?category=${cat} pre-filters to ${expected}`, n === expected);
    await p.close();
  }
}

// 3b ── "Reproductive" is gone as a visible product category
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/products", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2500));
  const chips = await p.evaluate(() =>
    [...document.querySelectorAll("button")].map(x => x.textContent.trim()));
  t("Products filter offers Nutraceuticals, Prescription, Hormones",
    ["Nutraceuticals","Prescription","Hormones"].every(c => chips.includes(c)));
  t("Products filter no longer offers Reproductive",
    !chips.some(c => /reproductive/i.test(c)));
  await p.close();
}

// 4 ── Homepage does NOT expose partner client brands
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2500));
  const txt = await p.evaluate(() => document.body.innerText);
  const leaks = ["Aurobindo","Cadila","Zydus","Intas","Micro Labs","Amneal","Wallace"]
    .filter(x => txt.includes(x));
  t("Homepage hides partner-associated brands", leaks.length === 0);
  if (leaks.length) console.log("   leaked:", leaks.join(", "));
  // innerText applies text-transform, and partner names render uppercase.
  const flat = txt.toLowerCase();
  t("Homepage shows partner identities",
    flat.includes("symbiosis group") && flat.includes("eurocrit labs"));
  await p.close();
}

// 5 ── Partner detail DOES expose them, with the disclaimer
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/manufacturing/symbiosis-group", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2500));
  const txt = await p.evaluate(() => document.body.innerText);
  t("Partner page lists associated brands", txt.includes("Cadila") && txt.includes("Zydus"));
  t("Partner page carries the ownership disclaimer",
    /neither owns these brands nor claims/i.test(txt));
  await p.close();
}

// 6 ── Mobile menu opens and navigates
{
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2200));
  await p.click('button[aria-controls="mobile-menu"]');
  await new Promise(r => setTimeout(r, 1000));
  t("Mobile menu opens",
    await p.evaluate(() => !!document.querySelector("#mobile-menu")));
  await p.evaluate(() => {
    document.querySelector('#mobile-menu a[href="/quality"]')?.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  t("Mobile menu navigates and closes",
    await p.evaluate(() => location.pathname === "/quality" && !document.querySelector("#mobile-menu")));
  await p.close();
}

// 7 ── Focus index switches the panel
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2500));
  const before = await p.evaluate(() => {
    const el = [...document.querySelectorAll("h3")].find(h => /supporting|solutions|committed|everyday/i.test(h.textContent));
    return el?.textContent ?? "";
  });
  await p.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find(x => /FERTILITY/i.test(x.textContent));
    b?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    b?.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  const after = await p.evaluate(() => {
    const el = [...document.querySelectorAll("h3")].find(h => /supporting|solutions|committed|everyday/i.test(h.textContent));
    return el?.textContent ?? "";
  });
  t("Focus panel responds to selection", before !== after && after.length > 0);
  await p.close();
}

// 8 ── Navigation is exactly the seven items Zafieon specified
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2200));
  const nav = await p.evaluate(() =>
    [...document.querySelectorAll('header a[href^="/"]')]
      .map(a => a.getAttribute("href")));
  const want = ["/about","/our-focus","/products","/quality","/manufacturing","/insights","/contact"];
  t("Primary nav carries all seven items", want.every(h => nav.includes(h)));
  t("Primary nav has no Our Capabilities", !nav.includes("/our-capabilities"));
  await p.close();
}

// 9 ── Contact carries no enquiry form
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2200));
  const state = await p.evaluate(() => ({
    forms: document.querySelectorAll("form").length,
    inputs: document.querySelectorAll("input, textarea, select").length,
    txt: document.body.innerText,
  }));
  t("Contact has no form element", state.forms === 0);
  t("Contact has no input fields", state.inputs === 0);
  t("Contact shows the three connect strands",
    /Partnerships/i.test(state.txt) && /General Information/i.test(state.txt));
  t("Contact offers Get in Touch",
    await p.evaluate(() => !!document.querySelector('a[href^="mailto:"]')));
  await p.close();
}

// 10 ── Quality lists the eight partners in Zafieon's order
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/quality", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2600));
  const order = await p.evaluate(() =>
    [...document.querySelectorAll('#partners a[href^="/manufacturing/"]')]
      .map(a => a.getAttribute("href").replace("/manufacturing/","")));
  const want = ["symbiosis-group","bionexy-pharma","ravenbhel-healthcare",
    "philanto-wellness","eurocrit-labs","janus-biotech-india",
    "heliyac-healthcare","amagen-pharma"];
  t("Quality lists the eight partners in the specified order",
    JSON.stringify(order) === JSON.stringify(want));
  const retired = await p.evaluate(() => document.body.innerText);
  t("Retired partners are absent from the directory",
    !/Systole Remedies/i.test(retired) && !/Unilite India/i.test(retired));
  await p.close();
}

// 11 ── Manufacturing hero: continuous, controlless background film
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/manufacturing", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 3200));
  const v = await p.evaluate(() => {
    const el = document.querySelector("video");
    if (!el) return null;
    return {
      src: el.getAttribute("src"),
      poster: el.getAttribute("poster"),
      muted: el.muted, loop: el.loop, playsInline: el.playsInline,
      preload: el.getAttribute("preload"),
      autoplayAttr: el.hasAttribute("autoplay"),
      controlsAttr: el.hasAttribute("controls"),
      inFirstSection: el.closest("section") === document.querySelector("main section"),
      paused: el.paused,
      advancing: el.currentTime > 0,
      opacity: Number(getComputedStyle(el).opacity),
    };
  });
  t("Manufacturing hero has a video", !!v);
  t("Video is the supplied file", v && v.src === "/video/manufacturing.mp4");
  t("Video has a poster", !!(v && v.poster));
  t("Video is muted, looping and inline", !!(v && v.muted && v.loop && v.playsInline));
  t("Video preloads metadata only", v && v.preload === "metadata");
  t("Video carries no autoplay attribute (no hydration branch)", v && v.autoplayAttr === false);
  t("Video sits in the hero section", v && v.inFirstSection === true);

  // The client asked for continuous background motion, not a player.
  t("Video exposes no native controls", v && v.controlsAttr === false);
  const chrome = await p.evaluate(() => ({
    pressed: document.querySelectorAll("button[aria-pressed]").length,
    playLabels: [...document.querySelectorAll("button")]
      .filter(x => /play film|pause film/i.test(x.textContent || "")).length,
    progress: document.querySelectorAll("progress, input[type=range]").length,
  }));
  t("No play/pause button is rendered", chrome.pressed === 0 && chrome.playLabels === 0);
  t("No progress bar is rendered", chrome.progress === 0);

  // Regression: the element once played at opacity 0 behind its own poster,
  // because `loadeddata` fires before React hydrates and the reveal handler
  // never ran. "Playing" is not enough — it has to be VISIBLE while playing.
  t("Video autoplays without interaction", v && v.paused === false && v.advancing);
  t("Video is visible while playing (not hidden behind its poster)",
    v && v.opacity === 1);

  // It loops rather than stopping at the end.
  const looped = await p.evaluate(async () => {
    const el = document.querySelector("video");
    el.currentTime = Math.max(0, el.duration - 0.35);
    await new Promise(r => setTimeout(r, 2200));
    return { t: el.currentTime, paused: el.paused, ended: el.ended };
  });
  t("Video loops instead of ending", looped.paused === false && looped.ended === false);

  // The film must be faststart: `moov` (the index) ahead of `mdat` (the
  // payload). Written the other way round — which many export presets do by
  // default — the browser cannot start playback until it has pulled the whole
  // file, and a 30 MB hero video simply looks broken until it does. Run
  // `node tools/faststart.mjs` on any replacement.
  {
    const head = await fetch(BASE + "/video/manufacturing.mp4", {
      headers: { range: "bytes=0-65535" },
    });
    const bytes = Buffer.from(await head.arrayBuffer());
    const text = bytes.toString("latin1");
    const moov = text.indexOf("moov");
    const mdat = text.indexOf("mdat");
    t("Film is served with byte-range support", head.status === 206);
    t("Film is faststart (moov ahead of mdat)", moov > 0 && (mdat < 0 || moov < mdat));
  }
  await p.close();
}

// 11b ── Reduced motion holds the poster rather than autoplaying
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await p.goto(BASE + "/manufacturing", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 3000));
  const held = await p.evaluate(() => {
    const v = document.querySelector("video");
    return { paused: v.paused, t: v.currentTime };
  });
  t("Reduced motion does not autoplay the film", held.paused === true && held.t === 0);
  await p.close();
}

// 12 ── Insights renders four pieces with tags
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/insights", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2600));
  const st = await p.evaluate(() => ({
    links: new Set([...document.querySelectorAll('a[href^="/insights/"]')]
      .map(a => a.getAttribute("href"))).size,
    imgs: document.querySelectorAll("img").length,
    tagged: /Manufacturing|Nutraceuticals|Hormonal Health/.test(document.body.innerText),
  }));
  t("Insights lists four pieces", st.links === 4);
  t("Insights shows images", st.imgs >= 4);
  t("Insights articles carry category tags", st.tagged);
  await p.close();
}

// 13 ── The dashboard is closed to anyone without a session
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/admin", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1500));
  t("Signed-out /admin redirects to the login screen",
    await p.evaluate(() => location.pathname === "/admin/login"));

  const post = await p.evaluate(async (base) => {
    const fd = new FormData();
    fd.set("slot", "1");
    fd.set("image", new File([new Uint8Array([1,2,3])], "x.webp", { type: "image/webp" }));
    const r = await fetch(base + "/api/admin/insight-image", { method: "POST", body: fd });
    return r.status;
  }, BASE);
  t("Unauthenticated upload is rejected with 401", post === 401);

  const del = await p.evaluate(async (base) => {
    const r = await fetch(base + "/api/admin/insight-image?slot=1", { method: "DELETE" });
    return r.status;
  }, BASE);
  t("Unauthenticated reset is rejected with 401", del === 401);

  const wrong = await p.evaluate(async (base) => {
    const r = await fetch(base + "/api/admin/session", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: "not-the-password" }),
    });
    return r.status;
  }, BASE);
  t("Wrong password is rejected", wrong === 401 || wrong === 429);
  await p.close();
}

// 14 ── Therapeutic areas are back, renamed, and complete
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/products", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2600));

  const chips = await p.evaluate(() =>
    [...document.querySelectorAll("button")].map(x => x.textContent.replace(/\s+/g, " ").trim()));
  t("Therapeutic area filter is present",
    chips.some(c => /^Gyna?ecology/i.test(c)) && chips.some(c => /^Fertility/i.test(c)));
  t("Hormonal Health has replaced Reproductive Health",
    chips.some(c => /^Hormonal Health/i.test(c)) &&
    !chips.some(c => /reproductive/i.test(c)));

  const total = Number(process.env.TOTAL_PRODUCTS);

  // Every product must be reachable under Gynaecology.
  const gyn = await p.evaluate(async () => {
    const btn = [...document.querySelectorAll("button")]
      .find(x => /^Gyna?ecology/i.test(x.textContent.trim()));
    btn.click();
    await new Promise(r => setTimeout(r, 1400));
    return new Set([...document.querySelectorAll('a[href^="/products/"]')]
      .map(a => a.getAttribute("href"))).size;
  });
  t(`Gynaecology lists every product (${total})`, gyn === total);

  // …and no duplicates anywhere.
  const dupes = await p.evaluate(async () => {
    const btn = [...document.querySelectorAll("button")]
      .find(x => x.textContent.trim() === "All");
    btn.click();
    await new Promise(r => setTimeout(r, 1200));
    const hrefs = [...document.querySelectorAll('a[href^="/products/"]')]
      .map(a => a.getAttribute("href"));
    return { n: hrefs.length, unique: new Set(hrefs).size };
  });
  t("No duplicate product cards", dupes.n === dupes.unique && dupes.n === total);
  await p.close();
}

// 15 ── Our Focus carries Hormonal Health, not Reproductive Health
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/our-focus", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2600));
  const txt = await p.evaluate(() => document.body.innerText);
  t("Our Focus names Hormonal Health", /hormonal health/i.test(txt));
  t("Our Focus no longer names Reproductive Health", !/reproductive health/i.test(txt));
  await p.close();
}

// 16 ── Contact carries both offices and a clickable email in both places
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2400));
  const c = await p.evaluate(() => ({
    txt: document.body.innerText.replace(/\s+/g, " "),
    mailtos: [...document.querySelectorAll('a[href^="mailto:"]')]
      .map(a => a.getAttribute("href")),
  }));
  t("Corporate office address is shown",
    /3rd Floor, Unit No. 4, Inspire/i.test(c.txt) &&
    /Bandra Kurla Complex/i.test(c.txt) &&
    /Mumbai, Maharashtra . 400051/i.test(c.txt));
  t("Registered office address is shown",
    /No: 1\/1, 3rd Main Road, Mint Modern City/i.test(c.txt) &&
    /Chennai . 600021/i.test(c.txt));
  t("Email appears in at least two places",
    c.mailtos.filter(h => h === "mailto:info@zafieonpharma.com").length >= 2);
  t("Email address has no typos or stray spaces",
    c.mailtos.every(h => h === "mailto:info@zafieonpharma.com"));
  t("Email is shown as text too", /info@zafieonpharma\.com/.test(c.txt));
  await p.close();
}

// 17 ── The opening paints from the server, not from hydration
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  // No JavaScript at all: the curtain must still be in the document and the
  // hero copy must still be visible. Both used to depend on hydration.
  await p.setJavaScriptEnabled(false);
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1200));
  const noJs = await p.evaluate(() => {
    const o = document.querySelector(".zaf-overture");
    const lede = document.querySelector(".lede-hero");
    return {
      overtureInDom: !!o,
      ledeOpacity: lede ? Number(getComputedStyle(lede.closest("[style]") || lede).opacity) : -1,
      ledeText: lede ? lede.textContent.trim().length : 0,
    };
  });
  t("Opening markup is server-rendered", noJs.overtureInDom);
  t("Hero copy is present without JavaScript", noJs.ledeText > 40);
  await p.close();
}

// 18 ── The opening plays once per session, then never again
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 300));
  const first = await p.evaluate(() => document.documentElement.dataset.overture);
  t("First visit in a session plays the opening", first === "on");

  await new Promise(r => setTimeout(r, 1600));
  t("Opening clears itself on a timer",
    await p.evaluate(() => document.documentElement.dataset.overture === "done"));
  t("Scroll is released once it clears",
    await p.evaluate(() => getComputedStyle(document.documentElement).overflow !== "hidden"));

  await p.goto(BASE + "/about", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 400));
  t("A second page in the same session does not replay it",
    await p.evaluate(() => document.documentElement.dataset.overture === "off"));
  await p.close();
}

// 19 ── Reduced motion never sees the opening at all
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 500));
  const r = await p.evaluate(() => ({
    flag: document.documentElement.dataset.overture,
    shown: getComputedStyle(document.querySelector(".zaf-overture")).display,
  }));
  t("Reduced motion suppresses the opening", r.flag === "off" && r.shown === "none");
  await p.close();
}

console.log("\nPASS");
ok.forEach(x => console.log("  ✓ " + x));
if (bad.length) { console.log("\nFAIL"); bad.forEach(x => console.log("  ✗ " + x)); }
console.log(`\n${ok.length}/${ok.length + bad.length} checks passed.`);
await b.close();
process.exit(bad.length ? 1 : 0);
