"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Connection = {
  saveData?: boolean;
  effectiveType?: string;
};

/**
 * The manufacturing film, as the Manufacturing hero's primary visual.
 *
 * It is continuous background motion, not a video player: no controls, no
 * control bar, no progress bar, no play overlay. It loads, plays, loops, and
 * keeps going. `muted + loop + playsInline` is what makes that permissible
 * under every browser's autoplay policy.
 *
 * ── Why playback starts in an effect rather than on the element ─────────────
 * There is no `autoPlay` attribute and no `prefers-reduced-motion` branch in
 * the JSX. The server and the client render byte-identical markup — the poster
 * frame, paused — and only an effect decides whether to start. Branching markup
 * on a media query is what caused a hydration mismatch on this project before;
 * the rule is in the README and it is kept here.
 *
 * ── The only cases that do not autoplay ────────────────────────────────────
 * A visitor who has asked their operating system for reduced motion sees the
 * poster and nothing moving. WCAG 2.2.2 wants a way to stop motion that starts
 * on its own and runs past five seconds; with no visible control by design, the
 * OS-level preference is that mechanism, so it is honoured rather than ignored.
 * Save-Data and 2G/3G connections hold at the poster for a plainer reason: 30 MB
 * is not a reasonable thing to push at a metered phone. Nobody else sees any
 * difference — everyone gets the loop.
 *
 * ── Why the media state is read, not just listened for ─────────────────────
 * `src` is in the server-rendered HTML, so the browser starts loading the file
 * long before React hydrates. `loadeddata` has already fired by the time React
 * attaches its synthetic handlers, so that event is simply missed. Relying on
 * it left the film playing at `opacity: 0` behind its own poster — running,
 * invisible. The effect reads `readyState` on mount and attaches native
 * listeners in the same pass.
 *
 * ── The overlaid standfirst ────────────────────────────────────────────────
 * From `md` up the hero paragraph sits in the right 48% of the frame, held
 * legible by a right-to-left scrim that clears to nothing by the middle. The
 * film keeps its left two-thirds, which is where the movement is, so the type
 * reads as part of the shot rather than a panel laid over it.
 *
 * Below `md` there is no usable right-hand column: inside a 16:9 plate the copy
 * overflowed vertically at exactly the `sm` breakpoint, silently clipped by
 * `overflow-hidden`. So the plate becomes a full-width `min-h-[24rem]` frame
 * and the scrim runs bottom-up instead — the same idea, re-pointed to the axis
 * that has room.
 *
 * `tools/layoutcheck.mjs` sweeps 360px to 1920px and fails on any clipped edge
 * or any document overflow. Overlaid type is the one layout that breaks
 * invisibly, so it is worth a test.
 *
 * The poster is a real frame from the film, at the same aspect ratio, so the
 * plate reserves its height before either asset arrives and nothing shifts.
 */
export default function ManufacturingFilm({
  src,
  poster,
  description,
  overlay,
  blurDataURL,
}: {
  src: string;
  poster: string;
  description: string;
  /**
   * The hero's standfirst, set over the film rather than beside it. Real
   * content, not decoration — it stays in the reading order and is never
   * hidden from assistive technology.
   */
  overlay?: string;
  blurDataURL?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  const cheapEnough = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    const c = (
      navigator as Navigator & { connection?: Connection }
    ).connection;
    if (c?.saveData) return false;
    if (c?.effectiveType && /(^|-)([23]g)$/.test(c.effectiveType)) return false;
    return true;
  }, []);

  // Plays while it is on screen and pauses once it is not. The visitor never
  // sees that pause — the only time it happens is when the film is out of
  // view — but it stops a page left open from decoding video indefinitely.
  useEffect(() => {
    const el = wrap.current;
    const v = video.current;
    if (!el || !v) return;

    let allowed = cheapEnough();

    // Recover whatever the element did before hydration, then keep in step.
    // HAVE_CURRENT_DATA (2) is the point at which there is a frame to show.
    const sync = () => setReady(v.readyState >= 2);
    sync();

    const MEDIA_EVENTS = [
      "loadeddata",
      "canplay",
      "playing",
      "emptied",
    ] as const;
    MEDIA_EVENTS.forEach((e) => v.addEventListener(e, sync));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (allowed) void v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { rootMargin: "128px 0px", threshold: 0.15 },
    );
    io.observe(el);

    // Honour a change of preference mid-session rather than only at load.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPref = () => {
      allowed = cheapEnough();
      if (!allowed && !v.paused) v.pause();
      else if (allowed && v.paused) void v.play().catch(() => {});
    };
    mq.addEventListener("change", onPref);

    return () => {
      io.disconnect();
      mq.removeEventListener("change", onPref);
      MEDIA_EVENTS.forEach((e) => v.removeEventListener(e, sync));
    };
  }, [cheapEnough]);

  return (
    <div ref={wrap} className="relative isolate mt-14 lg:mt-20">
      <figure className="relative">
        {/* `w-full` is load-bearing, not decoration. With `aspect-ratio` set
            and `width: auto`, a `min-height` that wins over the ratio-derived
            height makes Chrome re-derive the WIDTH from that height — the plate
            came out 512px wide inside a 390px viewport, clipped silently by the
            hero's `overflow-hidden`, taking the right-hand third of the
            overlaid copy with it. Pinning the width means the ratio can only
            ever drive the height. */}
        <div className="relative min-h-[24rem] w-full overflow-hidden bg-navy-950 md:aspect-16/9 md:min-h-0">
          {/* Poster as a real image beneath the film: it decodes early, blurs
              up from its own LQIP, and covers the gap before the first frame
              paints. The video sits above it and simply reveals when ready. */}
          <Image
            src={poster}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            className="object-cover object-center"
          />

          {/* No `controls`, and deliberately inert: it is motion behind the
              copy, not something to operate. `pointer-events-none` also stops
              the native context menu offering a download or a picture-in-
              picture window on a file the visitor has no reason to detach. */}
          <video
            ref={video}
            src={src}
            poster={poster}
            muted
            loop
            // `metadata`, deliberately. A visitor who never reaches this
            // section pays for a file header, not 30 MB.
            //
            // `none` was tried and is worse: Chrome attributes LCP to this
            // element either way, so deferring the fetch only pushed LCP from
            // 3.9s to 6.5s on a throttled connection. The element is the hero;
            // the honest fix is a smaller encode, not a loading flag.
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Legibility scrims. Two spans rather than one responsive gradient:
              Tailwind sets the direction and each colour stop as separate
              custom properties, so overriding a gradient at a breakpoint means
              restating all of them. Two explicit spans, each shown at one
              breakpoint, are easier to read and to change.

              Phone — bottom-up, because the copy sits along the bottom edge. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/88 from-5% via-navy-950/40 via-48% to-transparent to-82% md:hidden"
          />
          {/* Tablet and up — right-to-left. It is deliberately not opaque
              where the type sits: the text carries its own shadow, so the
              scrim only has to take the footage down far enough to hold
              contrast, and the machinery reads through it. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-gradient-to-l from-navy-950/82 from-8% via-navy-950/42 via-42% to-transparent to-78% md:block"
          />

          {/* Corner registration marks — the same language as Our Focus. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-4 left-4 h-6 w-6 border-t border-l border-white/40"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 bottom-4 hidden h-6 w-6 border-r border-b border-white/40 md:block"
          />

          {overlay && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 md:inset-y-0 md:right-0 md:left-auto md:flex md:w-[48%] md:flex-col md:justify-center md:p-9 lg:w-[44%] lg:p-12">
              {/* The magenta rule ties the block to the section headers rather
                  than letting it float free of the design language. */}
              <span
                aria-hidden="true"
                className="mb-5 hidden h-px w-10 bg-magenta md:block"
              />
              <p className="max-w-[44ch] text-[0.84rem] leading-[1.62] text-white/92 [text-shadow:0_1px_16px_rgba(10,20,40,0.9)] md:text-[0.97rem] md:leading-[1.72] lg:text-[1.0625rem] lg:leading-[1.78]">
                {overlay}
              </p>
            </div>
          )}
        </div>

        {/* Offset register, behind the plate — the treatment the office and
            quality photographs already carry. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -z-10 -right-4 -bottom-4 h-full w-full border border-magenta/35 lg:-right-6 lg:-bottom-6"
        />
      </figure>

      <figcaption className="mt-6 text-[0.8rem] leading-relaxed text-white/40 lg:mt-7">
        {description} The film is illustrative of pharmaceutical manufacturing
        practice; it is not footage of a named Zafieon Pharma partner facility.
      </figcaption>
    </div>
  );
}
