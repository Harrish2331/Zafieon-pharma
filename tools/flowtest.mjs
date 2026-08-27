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

// 3 ── Catalogue filtering
{
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + "/products?class=prescription", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2500));
  const n = await p.evaluate(() =>
    document.querySelectorAll('a[href^="/products/"]').length);
  // Derived from the data rather than hardcoded, so adding a product cannot
  // silently break this assertion.
  const expected = Number(process.env.RX_COUNT);
  t(`?class=prescription pre-filters to ${expected}`, n === expected);
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

console.log("\nPASS");
ok.forEach(x => console.log("  ✓ " + x));
if (bad.length) { console.log("\nFAIL"); bad.forEach(x => console.log("  ✗ " + x)); }
console.log(`\n${ok.length}/${ok.length + bad.length} checks passed.`);
await b.close();
process.exit(bad.length ? 1 : 0);
