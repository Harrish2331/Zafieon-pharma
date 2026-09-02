import InlineLockup from "@/components/InlineLockup";

/**
 * The opening.
 *
 * A capsule closes over the viewport, the mark registers inside it, then the
 * capsule parts along the logo's own 45° diagonal and the two halves sweep away
 * to reveal the site.
 *
 * The diagonal is not decorative — it is the axis of the Zafieon mark, the
 * "tube/capsule pill" the brand guidelines describe. Splitting along it means
 * the reveal is the logo's geometry performed at full-screen scale.
 *
 * ── Why this is a server component with CSS animations ─────────────────────
 * It used to be a client component driven by Framer Motion, mounted from an
 * effect. That meant the curtain could not appear until React had hydrated —
 * and on a throttled connection, with 456 KB of JavaScript to fetch and parse
 * first, hydration lands around 2.5s. The splash therefore *started* at 2.5s
 * and finished past 4s, which is precisely the "stuck before the site appears"
 * complaint: the site had already painted at ~1s, then a navy curtain dropped
 * over it, then lifted.
 *
 * Now the markup is server-rendered and the whole sequence is CSS. It paints in
 * the first frame alongside the rest of the document, runs on the compositor
 * (transform and opacity only — no layout, no paint, no main-thread work), and
 * is finished at 1.85s whether or not React has hydrated. No JavaScript
 * participates in the animation at all.
 *
 * The 1.85s is deliberate. A first CSS pass ran it in 1.15s and it read as
 * hurried — the sequence is built around the hold on the mark, not the speed
 * of the wipe. Timings and easing are documented in globals.css.
 *
 * ── Once per session, decided before first paint ───────────────────────────
 * Whether to play is decided by the inline script in `layout.tsx`, which sets
 * `data-overture` on <html> before the first frame. Reading sessionStorage in
 * an effect would have been a frame too late: a returning visitor would see a
 * flash of navy before the effect could suppress it. The same script releases
 * the scroll lock on a timer, so nothing here depends on hydration either.
 *
 * When the attribute says `off` — a repeat visit, or reduced motion — the CSS
 * sets `display: none` and this costs nothing but a few hundred bytes of HTML.
 */
export default function Overture() {
  return (
    <div className="zaf-overture" aria-hidden="true">
      {/* Upper-left half — parts along the diagonal and leaves up-left. */}
      <div className="zaf-overture__half zaf-overture__half--tl navy-field" />
      {/* Lower-right half — the mirror. */}
      <div className="zaf-overture__half zaf-overture__half--br navy-field" />

      {/* The hairline the halves part along. */}
      <div className="zaf-overture__seam" />

      {/* Registration: the full lockup resolves, holds, then clears just ahead
          of the split — so the identity is what the viewer is left with, not a
          shape they had to decode. */}
      <div className="zaf-overture__mark">
        <InlineLockup className="h-auto w-[min(300px,62vw)]" />
      </div>
    </div>
  );
}
