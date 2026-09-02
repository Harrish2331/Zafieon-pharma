# Zafieon Pharma — Website

The digital flagship for ZAFIEON PHARMA. Next.js 16 (App Router) · TypeScript ·
Tailwind v4 · Framer Motion · React Three Fiber.

Almost entirely prerendered. The four Zafieon Insights images can be replaced at
runtime from the Admin Dashboard, so `/` and `/insights` carry a revalidate
window and the dashboard needs a Node runtime — everything else is static.

```bash
npm install
cp .env.example .env.local   # only needed for the Admin Dashboard
npm run dev                  # http://localhost:3000
npm run build
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
| `insights.ts` | The four Zafieon Insights pieces and their tags |
| `certifications.ts` | The certification registry — claim strings to marks |
| `legal.ts` | Privacy, Terms, Disclaimer |
| `types.ts` | The content model, with rules on what may and may not be filled in |

### Adding a product

Append one object to `products` in `src/data/products.ts`. It automatically
appears in the homepage grid, the catalogue, its therapeutic-area sections on
`/our-focus`, related-product rails, `generateStaticParams`, and the sitemap. A
new therapeutic area also extends the catalogue filter chips. **No UI changes.**

Set `productClass: "prescription"` and the page is automatically gated,
`noindex`, and excluded from the sitemap.

`categories` drives the catalogue filter — `nutraceutical`, `prescription`,
`hormone` — and a product may sit in more than one. It is a display grouping
and nothing else; `productClass` is the regulatory field and the only one that
changes behaviour. The rule for assigning `hormone` is written at the top of
`products.ts` so every assignment can be checked against the pack artwork.

**Never invent a field.** Omit what the pack does not state — every field is
optional and the UI renders nothing when a value is absent. That is deliberate.

### Adding a manufacturing partner

Append one object to `partners` in `src/data/partners.ts`. It appears in the
homepage network list, the directory, the footprint diagram (grouped by the
states named in `region`), the certifications table on `/quality`, its own
detail page, and the sitemap.

Then add its slug to `DIRECTORY_ORDER` in the same file. That array is the
public order Zafieon fixed, and a partner missing from it does not appear on the
site — a typo throws at module load rather than silently dropping a partner.

`associatedBrands` — companies **the partner** manufactures for — renders only
on that partner's detail page, never on the homepage. See `docs/CLAIMS.md`.

**Retiring a partner.** Set `retired: true` on the record and remove its slug
from `DIRECTORY_ORDER`. The record stays in the file, so the supplied
documentation is never lost, but it leaves every listing, route and sitemap
entry. Systole Remedies and Unilite India are retired this way.

**A partner with no brochure.** Set `profileInterim: true`. The card and the
detail page both say so, and the page states plainly that the copy describes
Zafieon's expectations rather than facts documented by that partner.

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

**It is CSS, and it is server-rendered.** The markup ships in the HTML and the
whole sequence runs on the compositor — transform and opacity only, no
JavaScript in the animation at all. An inline script in `layout.tsx` decides
before the first frame whether to play it, and releases the scroll lock on a
timer.

That rewrite was the fix for "the site feels stuck when it opens". As a Framer
Motion client component mounted from an effect, the curtain could not appear
until React had hydrated — around 2.5s on a throttled connection, with 456 KB
of JavaScript to fetch and parse first. So the site painted at ~1s, a navy
curtain dropped over it at ~2.5s, and it lifted past 4s. Now it paints with the
document and is finished at 1.15s regardless of hydration.

`data-overture` on `<html>` is the whole state machine: `on` while it plays,
`done` once it clears, `off` for a repeat visit or reduced motion. `off` sets
`display: none`, so it costs a few hundred bytes of HTML and nothing else.

**It runs for 1.85s**, which is the pace the original Framer Motion version had.
A first CSS pass compressed it to 1.15s and it read as hurried — the sequence is
built around the hold on the mark, not the speed of the wipe. The phases overlap
rather than running in steps, and every curve is an ease-out; the full timing
table is in `globals.css`. **Change the animation and the release timer in
`layout.tsx` together** — the script that starts it is also what unlocks scroll.



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

### The manufacturing film

`ManufacturingFilm` puts the supplied 1280×720 film at the top of
`/manufacturing`, inside the hero rather than in a band of its own.

### Replacing the film

Drop the new file in `public/video/`, then **run the remuxer before anything
else**:

```bash
node tools/faststart.mjs "public/video/<new file>.mp4" public/video/manufacturing.mp4
```

That moves the `moov` atom — the index — ahead of `mdat`, the payload. Written
the other way round, which most editing-suite export presets do by default, a
browser cannot begin playback until it has fetched essentially the whole file.
On a 30 MB hero video that is the difference between playing at once and
looking broken for several seconds on a fast connection, or indefinitely on a
slow one. The transform re-orders the container and rebases the chunk offsets;
the media is copied byte for byte, so nothing is re-encoded and no quality is
lost. It is idempotent — a file that is already faststart is passed through.

Then regenerate the poster from a frame of the new footage, keep the original
in `source-assets/video/` for provenance, and update the `blurDataURL` in
`site.ts`. `flowtest.mjs` asserts the shipped film is faststart and that the
host answers byte-range requests, so a future replacement that skips this step
fails the suite rather than reaching production.

**On size:** the current film is 30 MB at 1920×1080. It is served `immutable`
and never blocks render, but it is still by far the largest thing on the site.
A 1280×720 encode at a sane bitrate would cut it to single-digit megabytes with
no visible loss at the size it is displayed. That needs an encoder this project
does not carry — worth doing in the editing suite before final handover.

It is the single largest asset on the site, so nothing about it is left to the
browser's judgement:

- `preload="metadata"` — a visitor who never scrolls to it pays for a header,
  not the file.
- Playback starts from an `IntersectionObserver` and pauses again off screen.
  A page left open does not decode twelve seconds of video on a loop forever.
- It never autoplays under `prefers-reduced-motion`, under `Save-Data`, or on a
  connection reporting 2G/3G. The poster stands and the control offers playback.
- A visible play/pause button, because a video that starts on its own needs one.
- The poster is a real frame at the same aspect ratio, so the plate reserves its
  height before either asset arrives and nothing shifts.
- `next.config.ts` sets `immutable` caching on `/video/*`. The file is replaced
  by a rebuild, never in place.
- The file is faststart, so playback begins on the first chunk rather than the
  last.

**There is no `autoPlay` attribute and no `prefers-reduced-motion` branch in the
JSX.** Server and client render byte-identical markup — poster, paused — and an
effect decides whether to start. Branching markup on a media query is what
caused a hydration mismatch on this project once already.

**Media state is read from the element, not only listened for.** `src` is in the
server-rendered HTML, so the browser starts loading well before React hydrates:
`loadeddata` and `play` have already fired by the time React attaches its
synthetic handlers, and those events are simply lost. Gating the reveal on
`onLoadedData` left the film playing at `opacity: 0` behind its own poster —
running, invisible, with the button still offering to start it. The effect now
reads `readyState` and `paused` on mount and attaches native listeners in the
same pass, so anything that happened pre-hydration is recovered. `flowtest.mjs`
asserts the film is *visible* while playing, not merely playing.

The caption states that the film is illustrative of pharmaceutical manufacturing
practice and is not footage of a named partner facility, because it isn't.

### The overlaid standfirst

The hero paragraph is set over the film rather than beside it. The heading stays
in the shell with every other page's; only the standfirst moves, and it is
passed to `ManufacturingFilm` as `overlay` rather than to `PageHero` as `body`.

From `md` up it sits in the right 48% of the frame over a right-to-left scrim
that clears to nothing by the middle, so the machinery reads through it and the
block never becomes a panel. Below `md` the right-hand column is too narrow to
hold the copy inside a 16:9 plate — it overflowed vertically at exactly the
`sm` breakpoint — so the plate opens to a `min-h-[24rem]` full-width frame and
the scrim runs bottom-up instead. The play control swaps corners at the same
breakpoint so it never lands on the type.

**`w-full` on the plate is load-bearing.** With `aspect-ratio` set and
`width: auto`, a `min-height` that beats the ratio-derived height makes Chrome
re-derive the *width* from that height: the plate came out 512px wide inside a
390px viewport, clipped silently by the hero's `overflow-hidden`, taking the
right third of the copy with it. `tools/layoutcheck.mjs` guards it: the sweep asserts no clip on any edge, no
collision with the control, and no document overflow from 360px to 1920px.

---

## Zafieon Insights

Four pieces in `src/data/insights.ts`, surfaced on `/insights`, on
`/insights/[slug]`, and in a four-up band on the homepage. Each carries category
tags drawn from a closed `InsightTag` union, so a tag cannot be invented at the
call site.

**Read the header of `insights.ts` before editing the copy.** These are company
viewpoint pieces written from Zafieon's own stated positioning. They deliberately
carry no reported news, no dated events, no market statistics, no references to
studies, and no product claims — because none of that was supplied and none of it
can be generated. If Zafieon wants genuine industry news here, that copy has to
come from the company with its sources.

### The four images

`image` on each piece is the fallback that ships with the build, taken from the
manufacturing film. Each piece also has a `slot` — 1 to 4 — which is what the
Admin Dashboard replaces.

`src/lib/insight-store.ts` answers "what is the current URL for slot *n*". The
rendering side never knows which storage driver is in use.

---

## Admin Dashboard

`/admin` — one operator, one password, one job: **replace the four Zafieon
Insights images.** Nothing else on the site can be changed from it, on purpose.
Everything else is content in `src/data` under version control, where a change
is reviewable and a mistake is revertable.

```bash
node tools/admin-hash.mjs "a long password"
```

That prints `ADMIN_SESSION_SECRET` and `ADMIN_PASSWORD_HASH`. Put both in the
deployment's environment. **Until both are set, the dashboard refuses every
login and says so** — it never ships as an open door.

- `src/lib/admin-auth.ts` — scrypt password verification, an HMAC-signed
  httpOnly cookie with an eight-hour expiry, constant-time comparison, and
  in-process login throttling. No dependency beyond `node:crypto`.
- Authorisation is checked **in each route handler and in the page**, not in a
  proxy matcher. Next's own guidance is that proxy/middleware is for optimistic
  checks, not authorization.
- Uploads accept WebP, JPEG, PNG and AVIF up to 8 MB. SVG is rejected — an SVG
  is a script vector, and nothing here needs one.
- Saving calls `revalidatePath` on `/` and `/insights`, so a replacement is live
  immediately rather than after the revalidate window.
- **Restore original** drops the override and the image shipped with the build
  comes back.

### Where uploads are stored

| Driver | When | Persistence |
|---|---|---|
| Filesystem | Default | `INSIGHT_STORAGE_DIR`, default `.data/insights`. Survives redeploys **only if that path is a persistent volume.** |
| Vercel Blob | `BLOB_READ_WRITE_TOKEN` is set | Always. Images *and the manifest* both go to Blob. |

**Under the blob driver nothing touches the filesystem — including the
manifest.** That is not a detail. The manifest was originally written to disk
regardless of driver, on the reasoning that a few kilobytes of JSON did not
need a backend of its own; on Vercel the filesystem is read-only, so every text
save died on `ENOENT: mkdir /var/task/.data` while image uploads appeared to
work. `tools/blobtest.mjs` guards it: it runs the app with a deliberately
invalid token and fails if any save produces an ENOENT instead of a Blob error.

**The store's access level is detected, not configured.** `access` is required
on every Blob write and passing the wrong one is a hard error in both
directions — a store created private rejects a public write with *"Cannot use
public access on a private store"*, which is what broke image uploads on the
first deploy. Rather than add another environment variable to get wrong, the
first write tries `private`, and flips to `public` and retries once if the store
says otherwise. A public store's CDN URL is used directly; a private store's
objects are streamed back through `/api/insight-image/[slot]/[version]`, since
they need an Authorization header. The dashboard's Storage panel shows which
applies.

Uploads are written **outside `public/`** on purpose: Next does not serve files
added to `public/` after the build. The filesystem driver serves them back
through `/api/insight-image/[slot]/[version]`.

**On a serverless host, set `BLOB_READ_WRITE_TOKEN`.** The filesystem there is
ephemeral and uploads would vanish on the next deploy. The dashboard shows which
driver is active and warns accordingly.

The version is a **path segment, not a query string**. `next/image` only
optimises a local src whose `search` is declared verbatim in
`images.localPatterns`, and a timestamp cannot be declared verbatim — a src it
cannot match throws and 500s the page. Moving the version into the path keeps
the URL unique per upload with an empty `search`. This was found by
`tools/admintest.mjs` and would otherwise have broken the site the first time
the client uploaded an image.

---

## Performance

### What the first load actually costs

`tools/loadcheck.mjs` measures it against a production build over a simulated
1.6 Mbps / 150ms link. Numbers here are from that harness; Chrome runs without
GPU acceleration in it, so treat the deltas as the signal.

| Page | FCP | LCP | CLS |
|---|---|---|---|
| `/` | ~1.2s | ~1.3s | 0 |
| `/products` | ~0.9s | ~1.1s | 0 |
| `/quality` | ~1.0s | ~1.2s | 0.049 |
| `/contact` | ~1.1s | ~1.2s | 0 |
| `/about` | ~1.2s | ~1.3s | 0 |
| `/our-focus` | ~1.0s | ~1.0s | 0 |
| `/insights` | ~1.1s | ~2.3s warm | 0 |
| `/manufacturing` | ~1.1s | ~3.9s | 0 |

Three of those deserve an explanation.

**LCP was 3.4s on every page** until the entrances moved to CSS. Framer Motion
server-renders its `initial` state, so a `<Reveal>` ships as `opacity: 0` and
an `<AnimatedText>` ships translated out of its own mask — and both stay that
way until React hydrates. Above the fold that meant the page had painted but
the only thing on it was invisible. `<CssRise>` and `<CssLines>` are the same
choreography in CSS, used by `Hero` and `PageHero`; everything below the fold
still uses Framer Motion, which is correct.

**`/manufacturing` is 3.9s because the film is 30 MB.** Chrome makes the video
element the LCP candidate whichever way it is loaded — `preload="none"` was
tried and pushed it to 6.5s. The fix is a smaller encode, not a loading flag:
720p at a sane bitrate would put this in line with every other page.

**`/insights` is ~3.9s cold and ~2.3s warm.** The first request for an image
size makes the optimiser do the work; every request after that is cached. Any
CDN, or the first visitor, absorbs it.

### Layout shift

Every page measures 0 at 390px, 1024px and 1440px, except `/quality` at desktop
widths (0.049 — inside "good", and its hero copy is the longest on the site,
sitting right on a wrap boundary).

Getting there took two fixes, neither of which was the obvious one:

**The scroll lock.** The overture locks scroll, then releases it. Without a
reserved gutter that release makes the scrollbar appear, narrows the viewport
and re-wraps the page — 0.20 at 390px, which is "poor". `scrollbar-gutter:
stable` on `html` reserves it from the first frame. The mobile menu, which
locks scroll the same way, gets the fix for free.

**The display font's fallback.** Bolyar is a wide, heavy unicase face — 1.35×
Arial's advance width for uppercase text, which is all this site sets it in.
Poppins was standing in for it and was nothing like it, so headings laid out at
the wrong width and re-wrapped on swap. `adjustFontFallback: "Arial"` is
supposed to solve exactly this and made it worse: next/font emitted
`size-adjust: 1.98%` for this file, rendering fallback headings at two per cent
of size and growing the page by three lines the moment the real font landed.

The fallback is now hand-written in `globals.css` from a ratio measured in the
browser across five real headings (1.3411–1.3556, so 135%). Deriving it from
OS/2 `xAvgCharWidth` gave 180% and over-corrected at wide viewports, because
that average includes lowercase glyphs this site never renders in Bolyar.
`node tools/fontmetrics.mjs` prints the table-derived numbers; `.work/fontratio.mjs`
measures the real one. **Re-measure if the font file is ever replaced.**

### Interaction cost

`tools/interactioncheck.mjs` measures what the app costs once someone starts
using it, which is a different question from load and the one "laggy" usually
means. It records the longest frame and the blocking time after each input.

Three things were fixed against it:

**The product grid dropped Framer Motion's `layout` animation.** Layout
animation measures every participating element on every frame; across twelve
cards each holding an optimised image, one filter click cost **798ms and five
dropped frames**. It now fades and rises instead — opacity and transform only,
no measurement. Same click: **~25ms**. What was lost is cards sliding to new
grid positions, which in a three-column grid that reflows by whole rows barely
reads as motion.

**Search is deferred.** Re-filtering and re-animating twelve cards on every
keystroke put six janky frames into one word typed at normal speed.
`useDeferredValue` keeps the input as responsive as the keyboard and lets the
grid lag a frame — nobody reads results while still typing.

**Our Focus warms its four artworks on approach.** They were rendered from the
start with `loading="lazy"`, on the assumption that being in the DOM was enough
to get them fetched. It was not: held at `opacity: 0` they measured
`complete: false` with the panel on screen, and the first switch paid for the
fetch and the decode in one frame — **2707ms**. They now mount eagerly once the
section is within 1600px, which puts the first switch at **~200ms** and later
ones at 30-90ms.

`visibility: hidden` on the inactive layers was tried as a further saving and
made it worse — it defers rasterisation, so the decode cost simply returns on
first reveal (198ms went back to 941ms) with no gain when warm. It is not in
the code; this note is here so it is not tried again.

A note on reading these numbers: the harness runs Chrome on SwiftShader with no
GPU, and anything compositing-bound swings wildly run to run — the same
unchanged page measured 40ms, 207ms, 109ms and 728ms on four consecutive runs.
Trust a consistent before/after gap with a known mechanism; do not tune against
a single number.

How much the renderer distorts things is worth knowing before anyone chases a
red row. Run against the deployed site, same URL and same minute, the only
variable being the renderer:

| home · focus index → Fertility | GPU | SwiftShader |
| --- | --- | --- |
| after a reader-paced scroll | 223ms | 715ms |
| jumped to, 900ms settle | **34ms** | 175ms |

The harness reports the right-hand column and flags it. The left-hand column is
what a visitor gets. Both were measured with the artwork confirmed decoded
(4/4 `complete`), which the warming above achieves 268-291ms after a
reader-paced scroll finishes.

The homepage scroll is the other row the harness flags, and it needs the same
reading. On a GPU, against production: desktop p95 **36ms** with one long frame
in 61; mobile **42ms worst, zero janky frames**. That one desktop frame is not
triggered by scrolling to any particular section — it lands at `scrollY 0`,
which places it in the hero's three.js canvas still initialising a couple of
seconds after load. It is pre-existing, unchanged by anything here (verified by
stashing and re-measuring), and deferred past the opening by design.

The canvas does stop when it leaves the viewport, which is the failure worth
checking for in a three.js scene on a bare rAF loop — measured at 847 draw
calls per 2s with the hero on screen and **0** with it scrolled away.

### Long tasks

Parsing three.js and building the hero scene costs ~1.8s of main thread in two
tasks. `HeroVisual` now waits for the `load` event, then 1.3s — past the
overture — then the first idle period. Idle alone was not enough: the main
thread goes idle right after hydration, which is while the opening is still on
screen, and that is what made it stutter. The flat fallback is on screen the
whole time, so nothing is missing while it waits.



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

Every public page is prerendered. `/` and `/insights` carry a 60-second
revalidate window because they read the replaceable Insights images, and the
dashboard and its API routes are dynamic. **That means a Node runtime, not a
static host** — `npm start`, a container, or a platform that runs Next.

There is still no database and no third-party service. The only mutable state is
the Insights image manifest.

```bash
npm ci
npm run build
npm start
```

**Before the first deploy**

1. Set the real domain in `src/data/site.ts` → `site.url`. It drives
   `metadataBase`, canonical URLs, Open Graph and `sitemap.xml`.
2. `node tools/admin-hash.mjs "a long password"` and set both printed values in
   the environment. Until then the dashboard refuses every login.
3. Decide where uploads live — see **Admin Dashboard → Where uploads are
   stored**. On a serverless host this means setting `BLOB_READ_WRITE_TOKEN`;
   anywhere else, point `INSIGHT_STORAGE_DIR` at a persistent volume.
4. Work through the open items in `docs/CLAIMS.md` — several are legal rather
   than technical, and two of them (the WHO emblem and the ISO seal) are
   one-line changes.
5. Confirm the FM Bolyar webfont licence.

**What ships:** `public/` is 33 MB, of which 30.4 MB is the manufacturing film;
everything else totals under 2 MB. `source-assets/` holds the client's original
artwork and the Ravenbhel catalogue, tracked in git for provenance but outside
`public/` so none of it is served — with one exception. `source-assets/video/`
is git-ignored: the master film is the same media as
`public/video/manufacturing.mp4` (faststart is a container re-order, not a
re-encode), so a second 30 MB copy in the repository bought nothing. Its
SHA-256 is recorded in `docs/CLAIMS.md` §8, which is what keeps the provenance
verifiable.

`next.config.ts` excludes `public/**` from the server bundle's file trace. The
Insights store resolves its directory at runtime, which makes Turbopack trace
the whole project by default — and that would drag the film into every server
function. The build still prints a warning about the dynamic filesystem access;
the exclusion is what actually resolves it, and `node tools/trace-check.mjs`
asserts no route references `public/`.

---

## Dev-only files

`tools/` holds the review harness — headless Chrome captures at real
breakpoints, an internal link crawl, interaction tests and a scroll-performance
probe. None of it is imported by the app, so nothing reaches the bundle; the
only dependency is `puppeteer-core`, which is a devDependency.

```bash
node tools/shot.mjs         # segmented screenshots into .shots/
node tools/linkcheck.mjs    # crawl every internal route
node tools/flowtest.mjs     # Rx gate, filters, nav, contact, partner order, film
node tools/admintest.mjs    # login, upload, public update, restore, sign out
node tools/blobtest.mjs     # assert the blob driver never writes to disk
node tools/perf.mjs         # frame pacing + long tasks during a full scroll
node tools/trace-check.mjs  # assert public/ is out of the server bundle
node tools/layoutcheck.mjs  # overlaid hero copy across every breakpoint
node tools/faststart.mjs    # remux a replacement film for streaming
node tools/loadcheck.mjs    # FCP, LCP, CLS, long tasks, bytes by type
node tools/interactioncheck.mjs # frame cost of filters, search, menus, scroll
node tools/fontmetrics.mjs  # metrics for a size-adjusted font fallback
node tools/admin-hash.mjs   # generate the dashboard credentials (not a test)
```

All of them honour `BASE_URL`, so the same suite runs against the dev server, a
local production build, or a deployed URL.

`linkcheck.mjs` seeds itself from the running site's `sitemap.xml` rather than
from a list kept in the file, so a route added to the data cannot be missed.

`flowtest.mjs` reads its expected counts from the environment so they cannot go
stale as the catalogue grows:

```bash
BASE_URL=http://localhost:3001 \
RX_COUNT=7 NUTRA_COUNT=5 HORMONE_COUNT=5 \
node tools/flowtest.mjs
```

`admintest.mjs` needs the dashboard password, and leaves the image store exactly
as it found it:

```bash
BASE_URL=http://localhost:3001 ADMIN_TEST_PASSWORD="…" node tools/admintest.mjs
```

---

## Zafieon Insights — editing

The dashboard maintains two things per slot, **saved separately**: the image,
and the text beside it.

| | Endpoint | Storage |
|---|---|---|
| Image | `POST /api/admin/insight-image` | Manifest `images` branch + a file (or blob) |
| Text | `POST /api/admin/insight-text` | Manifest `text` branch |

Neither request carries the other's data, so replacing artwork cannot disturb
copy and editing copy cannot disturb artwork. `tools/admintest.mjs` asserts both
directions: it uploads an image, edits the text, and checks the image is still
byte-identical afterwards — then resets the text and checks the image survived
that too.

Text fields are independent of each other as well. A save touches only the
fields it sends, and an empty string clears one field back to what shipped with
the build rather than publishing nothing. That is why **Restore original text**
and clearing every field do the same thing.

`resolvedInsights()` is what the public pages read: the build's content with any
stored overrides applied on top. It reads the manifest once for all four
entries, so a page never fans out into eight round trips.

---

## Assets cut from the film

The four Zafieon Insights stills and the manufacturing poster are frames of the
supplied film. **They do not update themselves when the film is replaced.**

That bit once: an earlier 1280×720 export carried a visible AI-provenance
sparkle burned into one shot, the stills were cut from it, and the mark survived
on `insight-03` long after the film had been swapped for a clean 1920×1080 file.

After replacing the film, re-cut them:

```bash
node .work/reinsight.mjs      # frames at chosen timestamps
```

…then regenerate the WebPs and their `blurDataURL`s, and update
`src/data/insights.ts` and `manufacturing.hero.film.blurDataURL` in `site.ts`.
`docs/CLAIMS.md` §8 records why this matters.
