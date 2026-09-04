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
 * ── The curve ──────────────────────────────────────────────────────────────
 * The supplied artwork carried a curved left edge painted into the pixels,
 * against paper-100. It is a CSS shape here instead, because the five files
 * did not agree: the centre of the painted arc sat at 21%, 21%, 37%, 55% and
 * 73% of the way down its own image, so keeping them would have made the edge
 * jump as the reader moved down the index. One shape, five photographs.
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
          <div className="lg:col-span-5 lg:col-start-8">
            <div
              ref={panel}
              className="relative aspect-4/5 overflow-hidden bg-paper-200 lg:sticky lg:top-32 lg:aspect-5/6 lg:mr-(--drives-bleed)"
              style={{
                /* The left edge is one ellipse: a horizontal radius across a
                   third of the panel, and a vertical radius of half its height
                   on both corners so they meet mid-height in a single bulge. */
                borderRadius: "34% 0 0 34% / 50% 0 0 50%",
                /* Out to the right edge of the page, as the artwork does. The
                   column's right edge is the shell's, so the distance left to
                   travel is half of whatever the shell is not using. The
                   section clips, so this can never scroll the page sideways. */
                ["--drives-bleed" as string]:
                  "calc((100vw - min(100vw - 2 * var(--spacing-gutter), 1560px)) / -2)",
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
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      aria-hidden={i !== active}
                      className={`object-cover transition-opacity duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))
                : null}
            </div>
            {/* The statement each value carries is no longer set on screen —
                the artwork occupies that column now. It is kept for assistive
                technology, which otherwise loses the only description of what
                the value means. */}
            <p className="sr-only" aria-live="polite">
              {value.title}. {value.body}
            </p>
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
