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
              className="relative aspect-[1.22] lg:mr-(--drives-bleed)"
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
