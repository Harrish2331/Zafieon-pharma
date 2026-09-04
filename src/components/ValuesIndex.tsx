"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BrandPattern from "@/components/BrandPattern";
import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { about } from "@/data/site";

/**
 * The five values, as an index rather than five cards.
 *
 * The index reads down the left; the value's photograph fills the right and
 * bleeds off the edge of the page. Moving through the list is the whole
 * interaction — the artwork cross-fades and nothing else on screen moves.
 *
 * ── The panel's geometry, measured from the supplied comps ────────────────
 * The three section comps agree closely, and the panel follows them: 1.22
 * wide for 1 tall, beginning at 52% across the page and bleeding off the
 * right edge. Getting this wrong is what made an earlier pass look wrong —
 * a portrait panel meant `object-fit: cover` had to magnify a landscape
 * photograph to fill it, which read as both oversized and soft.
 *
 * The curve is not drawn here. It is the alpha channel of each photograph,
 * lifted from the comps by tools/aboutcrop.mjs, so the shape is exactly the
 * supplied one and the section's own pattern shows through it.
 */
export default function ValuesIndex() {
  const [active, setActive] = useState(0);
  const value = about.values[active];

  /**
   * The five photographs are warmed as the section approaches.
   *
   * Rendering them from the start with `loading="lazy"` does not work: held at
   * `opacity: 0` they are not treated as worth fetching, and the first switch
   * then pays for a fetch and a decode in one frame. This is the same trap the
   * home page's focus index fell into. They mount eagerly once the section is
   * within 1600px; a reader who never scrolls this far still pays nothing.
   */
  const panel = useRef<HTMLDivElement>(null);
  const [warm, setWarm] = useState(false);

  useEffect(() => {
    const el = panel.current;
    if (!el || warm) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWarm(true);
          io.disconnect();
        }
      },
      { rootMargin: "1600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [warm]);

  return (
    <section className="relative overflow-hidden bg-paper-100 py-24 lg:py-36">
      <BrandPattern tone="navy" opacity={0.03} scale={250} fade="bottom" />

      <div className="shell relative">
        <SectionHeader
          eyebrow="What Drives Us"
          lines={["Five commitments,", "held in every decision."]}
          size="display-2"
        />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* ── Index ─────────────────────────────────────────────── */}
          <ul className="lg:col-span-6">
            {about.values.map((v, i) => {
              const on = i === active;
              return (
                <li key={v.id} className="border-b border-line first:border-t">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="group relative flex w-full items-center gap-7 py-6 text-left lg:py-8"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute top-0 left-0 h-px bg-magenta transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        on ? "w-full opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                    <span
                      className={`eyebrow shrink-0 transition-colors duration-500 ${
                        on ? "text-magenta-600" : "text-muted-light"
                      }`}
                    >
                      {v.index}
                    </span>
                    <span
                      className={`font-[family-name:var(--font-display)] text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1] tracking-[-0.02em] uppercase transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        on
                          ? "translate-x-2 text-navy"
                          : "text-navy/35 group-hover:text-navy/60"
                      }`}
                    >
                      {v.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* ── Artwork ───────────────────────────────────────────── */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div
              ref={panel}
              className="@container relative aspect-[1.05] sm:aspect-[1.22] lg:mr-(--drives-bleed)"
              style={{
                /* Out to the right edge of the page, as the artwork does.
                   The column ends at the shell's content edge, so the distance
                   left to travel is the shell's centring margin plus its own
                   padding — both, which is what an earlier pass got wrong: it
                   counted only the margin and so fell short by a gutter on any
                   viewport wide enough for the shell to reach its max-width.
                   The overshoot from 100vw including the scrollbar is a few
                   pixels, and the section clips, so this can never scroll the
                   page sideways. */
                ["--drives-bleed" as string]:
                  "calc(((100vw - min(100vw, 1560px)) / 2 + var(--spacing-gutter)) * -1)",
              }}
            >
              {warm
                ? about.values.map((v, i) => (
                    <Image
                      key={v.id}
                      src={v.image}
                      alt={i === active ? v.imageAlt : ""}
                      fill
                      loading="eager"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      aria-hidden={i !== active}
                      className={`object-cover transition-opacity duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))
                : null}

              {/* ── The statement, over the artwork ──────────────────────
                  A light pool behind it. The photographs are bright on
                  average — 133 to 201 mean luminance where this sits — but
                  their darkest pixels run to 0, and navy type over those is
                  unreadable. The scrim is paper-100, the section's own
                  ground, so it reads as the artwork resolving into the page
                  rather than as a panel laid on top. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 54% at 28% 76%, rgba(244,246,249,0.97), rgba(244,246,249,0.82) 48%, rgba(244,246,249,0) 78%)",
                }}
              />

              {/* Sized in container units so the block holds the same
                  proportions against the panel at every width, which is how
                  it is drawn in the supplied artwork: the numeral about 14.5%
                  of the panel's width, the rule about 9%. */}
              <div
                className="pointer-events-none absolute bottom-[8%] left-[5%] flex w-[72%] flex-col items-center text-center lg:w-[50%]"
                style={{ gap: "max(0.55rem, 2.4cqw)" }}
                aria-live="polite"
              >
                {/* The gaps are container units, not percentages of this
                    block: on a phone the block is narrow, a percentage of it
                    collapses to a few pixels, and the figure's ink runs into
                    the statement. line-height is 1.06 rather than the display
                    face's usual 0.78 for the same reason — at 0.78 the figure
                    overflows its own line box. */}
                <span
                  aria-hidden="true"
                  className="block font-[family-name:var(--font-display)] tracking-[-0.04em] text-magenta/45"
                  style={{
                    fontSize: "clamp(2.1rem, 16cqw, 9.5rem)",
                    lineHeight: 1.06,
                  }}
                >
                  {value.index}
                </span>
                <p
                  className="text-navy"
                  style={{
                    fontSize: "clamp(0.78rem, 2.7cqw, 1.1rem)",
                    lineHeight: 1.5,
                  }}
                >
                  {value.body}
                </p>
                <span
                  aria-hidden="true"
                  className="block bg-magenta"
                  style={{ width: "max(48px, 9cqw)", height: "max(2px, 0.5cqw)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <Reveal delay={0.1} y={16}>
          <p className="mt-16 max-w-[62ch] text-[0.85rem] leading-relaxed text-muted-light">
            These are the commitments the organization is built on. They shape
            which partners we qualify, which products we put our name to, and how
            we behave when something is difficult.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
