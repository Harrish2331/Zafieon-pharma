# Zafieon Pharma — Website

The digital flagship for ZAFIEON PHARMA. Next.js 16 (App Router) · TypeScript ·
Tailwind v4 · Framer Motion · React Three Fiber. Fully statically generated.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 30 static routes
```

---

## Where the content lives

**Everything editable is in `src/data/`. No page file contains content.**

| File | Holds |
|---|---|
| `site.ts` | Navigation, contact details, and all page copy |
| `products.ts` | The product catalogue |
| `partners.ts` | Manufacturing partners, facilities, certifications, associated brands |
| `focus.ts` | Therapeutic focus areas |
| `legal.ts` | Privacy, Terms, Disclaimer |
| `types.ts` | The content model, with rules on what may and may not be filled in |

### Adding a product

Append one object to `products` in `src/data/products.ts`. It automatically
appears in the homepage grid, the catalogue, its therapeutic-area sections on
`/our-focus`, related-product rails, `generateStaticParams`, and the sitemap. A
new therapeutic area also extends the catalogue filter chips. **No UI changes.**

Set `productClass: "prescription"` and the page is automatically gated,
`noindex`, and excluded from the sitemap.

**Never invent a field.** Omit what the pack does not state — every field is
optional and the UI renders nothing when a value is absent. That is deliberate.

### Adding a manufacturing partner

Append one object to `partners` in `src/data/partners.ts`. It appears in the
homepage network list, the directory, the footprint diagram (grouped by the
states named in `region`), the certifications table on `/quality`, its own
detail page, and the sitemap.

`associatedBrands` — companies **the partner** manufactures for — renders only
on that partner's detail page, never on the homepage. See `docs/CLAIMS.md`.

---

## Brand implementation

Source of truth: `Brand Guidelines - Zafieon Pharma.pdf` (Gokul Branding).

**Colour** — Deep Navy `#14274B`, Magenta `#E5188A`, White. The neutral ramp and
the navy/magenta tints in `globals.css` are derived from those two hues only, to
make an accessible interface possible; no new brand hue is introduced.

> Magenta is 4.37:1 on white and 3.41:1 on navy — enough for large text and
> graphics, **not** for small text. Small magenta text therefore uses
> `magenta-600` on light grounds and `magenta-400` on navy. Keep that rule.

**Type** — FM Bolyar Sans Pro (display) and Poppins (everything else). Bolyar is
a unicase design: its lowercase forms are drawn as reduced capitals, so
mixed-case display type reads as "Every DOSE". All display type is therefore set
uppercase, matching the logo and the brand deck. Sentence case belongs in
Poppins.

> Bolyar is supplied in one weight (700) and is **not** a Google Font. It is
> self-hosted from `src/fonts/`. Confirm the webfont licence before launch.

**Logo** — `src/components/Logo.tsx` enforces the guidelines mechanically:
120px minimum width on the lockups, correct variant per background, never
recoloured or transformed. White variants are the official artwork with the
wordmark set to `#FFFFFF`; the magenta mark is untouched. Tightened viewBoxes;
the source SVGs had ~40% empty margin.

**Pattern** — `Brand Pattern.png` was rebuilt as a seamless SVG tile
(`public/brand/pattern-*.svg`) so it can be scaled, tinted and masked. It is a
texture, never a subject: low opacity, always masked.

---

## The opening

`src/components/Overture.tsx` — a navy curtain closes the viewport, the Zafieon
lockup registers, then the curtain parts along a 45° diagonal and sweeps away.

The diagonal is the axis of the Zafieon mark — the "tube/capsule pill" the brand
guidelines describe — so the reveal is the logo's own geometry performed at
full-screen scale.

Rules it obeys: ~1.75s, once per **session** (not per navigation), never under
reduced motion, and purely an overlay — the page beneath renders and is
interactive immediately, so it cannot affect LCP.

The lockup is inlined as SVG (`InlineLockup.tsx`, generated from the official
`logo-horizontal.svg`) rather than loaded as a file. On a cold start the image
request had not returned before the curtain lifted, leaving the one moment the
brand is meant to land completely blank.

---

## The 3D hero

`src/components/three/PrecisionForm.tsx` — "Suspension": a navy-tinted glass
capsule holding a luminous core of magenta granules, inside a sparse depth
field, framed by hairline measurement rings. It is **not** the logo in 3D; the
official logo stays a flat 2D asset everywhere.

The assembly leans toward the cursor *and* the camera parallaxes against it, so
the object has real depth rather than a flat tilt. The glass is tinted rather
than clear on purpose — a near-clear shell on a white page has no silhouette and
reads as grey plastic.

The environment map is generated on a 2D canvas at runtime, so the glass has
something to refract without any HDR download.

It loads only on a wide, pointer-capable viewport with real WebGL and adequate
device memory. Everything else gets `StaticForm` — the same composition drawn
as one SVG, same disc count, same accent position, so the art direction never
collapses.

Reduced motion freezes the scene rather than removing it: less movement, not
less design.

No postprocessing, no HDR fetch, no shadow maps, DPR capped at 1.5.

---

## Manufacturing

`PartnerCard` shows a partner's logo, name, region and a count of stated
certifications — enough for trust at a glance. Clicking opens the partner's own
page, which is the only place the companies that partner manufactures for
appear. That separation is deliberate; see `docs/CLAIMS.md`.

`CertificationBadge` parses the supplied certification strings, which arrive in
very different shapes — a bare standard, or a name plus reference number, issuing
body and expiry — and renders only the parts actually present. The holder is
named on the badge itself, never in a footnote.

### Certification marks

`src/data/certifications.ts` is the single registry: certification → mark. Every
surface reads from it, so a mark cannot drift between the homepage, a partner
card and a partner page.

**A mark reaches a partner only by that partner claiming the certification in
`partners.ts`.** `resolve()` reads the claim strings and nothing else; there is
no field for attaching a mark directly. That is the mechanism which stops a logo
from ever implying a certification a partner does not hold.

Marks are matched by ordered patterns — WHO and GLP are tested before GMP so
that "WHO GMP" and "GLP Certificate" are not swallowed by the broader GMP rule.

Where a claim has no supplied artwork (PIC/S, the state manufacturing licence)
the site's own drawn seal is used. **No regulator or standards-body emblem is
ever recreated.** In compact logo rows, claims without artwork are omitted
entirely — an empty ring beside real logos reads as a broken image — but they
still appear in full on the partner's own certification list.

To retire a mark, delete its `logo` property. It falls back to the drawn seal
everywhere, automatically. See the boxed note in `docs/CLAIMS.md` for why the
WHO and ISO entries need a decision before launch.

Partner logos are client-supplied artwork; see `docs/CLAIMS.md` for the consent
still outstanding.

---

## Performance

Pack shots arrived as 1.4–1.8 MB PNGs — 6.5 MB across six products. Converted to
WebP at 1400px, they total 511 KB (**93% smaller**), and each carries an inline
20px LQIP so images resolve blur-to-sharp instead of popping in.

The 3D scene is deferred to `requestIdleCallback` so three.js is never parsed
while the hero headline is still painting, and its render loop pauses via
IntersectionObserver once the hero scrolls away.

### Scroll smoothness

Four things were costing frames. All are fixed; each is worth knowing about
before adding anything similar:

1. **Two WebGL canvases.** The hero rendered `HeroVisual` twice — once for the
   desktop layout, once for mobile — and on desktop *both* passed the
   component's own width gate, so the page ran two scenes and two render loops.
   There is now exactly one instance, moved between slots by CSS position.
2. **`feGaussianBlur` in the static fallback.** An SVG blur filter is
   re-rasterised on every composite, and this is the path low-power devices
   take — exactly backwards. Replaced with a radial-gradient bloom: **122 janky
   frames → 3** in isolation.
3. **`backdrop-filter` on the fixed navbar.** A full-width backdrop blur that
   re-rasterises on every scroll frame, sitting behind a 95%-opaque background
   where it was almost invisible anyway.
4. **Masked, repeating pattern layers.** `BrandPattern` and the hero visual are
   now promoted to their own composited layers, so they rasterise once instead
   of per frame.

Measured on the production build with a scripted full-page scroll
(`node tools/perf.mjs`): 60fps median on both the WebGL and fallback paths, and
essentially no long tasks.

> Those runs use Chrome's **SwiftShader software renderer**, which has no GPU
> acceleration — absolute frame times are far worse than real hardware and the
> numbers are noisy run to run. Treat the A/B deltas as the signal, not the
> absolutes.

---

## Motion

`MotionProvider` sets `reducedMotion="user"` globally, so Framer drops transform
animations for anyone who asks for less motion while keeping the fade.
**Do not branch component JSX on a media query** — the server has none to read,
and doing so causes hydration mismatches. That bug was fixed once already.

`AnimatedText` binds its observer to the outer wrapper, not the translated inner
span. The inner span starts fully below its clipping parent and is therefore
never itself intersecting; `whileInView` on it silently never fires.

---

## Regulatory

- Prescription products are gated, `noindex`, and out of the sitemap.
- Partner certifications are attributed to the partner everywhere they appear.
- Partner client lists appear only on that partner's page, under a disclaimer.
- Contact details that were never supplied render as "To be confirmed" rather
  than as invented values.

**`docs/CLAIMS.md` maps every factual statement on the site to its source
document.** Anything added without a row there should not ship.

---

## Deploying

The site is fully static — every route is prerendered at build time and there is
no server runtime, no database and no API. It will run on any static host.

```bash
npm ci
npm run build     # 33 prerendered routes
npm start         # or serve the build output
```

**Before the first deploy**

1. Set the real domain in `src/data/site.ts` → `site.url`. It drives
   `metadataBase`, canonical URLs, Open Graph and `sitemap.xml`.
2. Work through the open items in `docs/CLAIMS.md` — several are legal rather
   than technical, and two of them (the WHO emblem and the ISO seal) are
   one-line changes.
3. Confirm the FM Bolyar webfont licence.

**What ships:** `public/` is 1.8 MB in total. `source-assets/` holds the
client's original artwork and is tracked in git for provenance, but sits outside
`public/` so it is never served or bundled.

---

## Dev-only files

`tools/` holds the review harness — headless Chrome captures at real
breakpoints, an internal link crawl, interaction tests and a scroll-performance
probe. None of it is imported by the app, so nothing reaches the bundle; the
only dependency is `puppeteer-core`, which is a devDependency.

```bash
node tools/shot.mjs        # segmented screenshots into .shots/
node tools/linkcheck.mjs   # crawl every internal route
node tools/flowtest.mjs    # Rx gate, filters, menu, partner/brand separation
node tools/perf.mjs        # frame pacing + long tasks during a full scroll
```

`flowtest.mjs` reads the expected prescription-product count from the
environment so it cannot go stale:

```bash
RX_COUNT=$(grep -c 'productClass: "prescription"' src/data/products.ts) node tools/flowtest.mjs
```
