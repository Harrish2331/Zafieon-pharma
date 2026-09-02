"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import BrandPattern from "@/components/BrandPattern";
import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/Button";
import { focusAreas } from "@/data/focus";
import { products } from "@/data/products";
import { home } from "@/data/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * 03 — The purpose.
 *
 * Not four cards. A single index on the left that the reader moves through,
 * with one large editorial panel on the right that changes as they do. The
 * magenta rule travels to the active row, which is the only moving part.
 *
 * Keyboard and pointer drive the same state, and the panel is a live region so
 * the change is announced rather than silent.
 */
export default function FocusSection() {
  const [active, setActive] = useState(0);

  /**
   * All four artworks are warmed as the section approaches, and not before.
   *
   * They used to be rendered from the start with `loading="lazy"`, on the
   * assumption that having them in the DOM was enough to get them fetched. It
   * was not: the inactive ones sit at `opacity: 0`, and measured cold, all four
   * reported `complete: false` even with the panel on screen. The first switch
   * then paid for the fetch and the decode in one frame — 2.7 seconds of it.
   * Warm, the same switch costs 30-90ms.
   *
   * So the images mount only once the section is within 1600px, and mount
   * eagerly when they do. A visitor who never scrolls this far still pays
   * nothing; a visitor who does has all four decoded before they can click.
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
      // Generous on purpose: the four artworks have to be fetched AND decoded
      // before the reader reaches the index, and a reader who scrolls fast can
      // arrive within a second. Starting a viewport-and-a-half early means the
      // work is finished by the time the section is on screen; starting at
      // 800px left a click landing mid-decode at ~870ms.
      { rootMargin: "1600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [warm]);
  const area = focusAreas[active];
  const count = products.filter((p) =>
    p.therapeuticAreas.includes(area.id),
  ).length;

  return (
    <section className="relative overflow-hidden navy-field py-24 text-white lg:py-36">
      <BrandPattern tone="white" opacity={0.04} scale={240} fade="radial" />

      <div className="shell relative">
        <SectionHeader
          eyebrow={home.focus.eyebrow}
          lines={home.focus.headline}
          tone="dark"
          size="display-2"
        />

        <div className="mt-10 grid lg:grid-cols-12">
          <Reveal delay={0.16} className="lg:col-span-5 lg:col-start-8">
            <p className="lede text-white/60">{home.focus.body}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* ── Index ─────────────────────────────────────────────── */}
          <ul className="lg:col-span-5">
            {focusAreas.map((f, i) => {
              const on = i === active;
              return (
                <li
                  key={f.id}
                  className="border-b border-white/12 first:border-t"
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="group relative flex w-full items-baseline gap-6 py-6 text-left lg:py-7"
                  >
                    {/* Travelling rule */}
                    <span
                      aria-hidden="true"
                      className={`absolute top-0 left-0 h-px bg-magenta transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        on ? "w-full opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                    <span
                      className={`eyebrow shrink-0 transition-colors duration-500 ${
                        on ? "text-magenta-400" : "text-white/35"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1] tracking-[-0.01em] uppercase transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        on
                          ? "translate-x-1.5 text-white"
                          : "text-white/45 group-hover:text-white/70"
                      }`}
                    >
                      {f.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* ── Panel ─────────────────────────────────────────────── */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div
              ref={panel}
              className="relative isolate min-h-[24rem] overflow-hidden border border-white/12 bg-navy-900 p-8 sm:p-11"
              aria-live="polite"
            >
              {/* Area artwork.
                  All four are in the DOM from the start and cross-faded with
                  opacity, rather than mounted and unmounted as the reader
                  moves through the index.

                  They mount once the section is within 1600px and mount
                  eagerly, so every one is fetched and decoded before the reader
                  can reach the index. After that, switching is a
                  compositor-only opacity change with no network at all.

                  `loading="lazy"` was not enough on its own: an image held at
                  `opacity: 0` is not treated as worth fetching, and all four
                  measured `complete: false` with the panel on screen. The first
                  switch then paid 2.7s for a fetch and a decode in one frame.

                  The supplied set is composed with its subject to the right and
                  negative space to the left, so the scrim below only has to
                  deepen what is already dark — the artwork stays legible and
                  the type keeps full contrast without a heavy overlay. */}
              {warm &&
                focusAreas.map((f, i) =>
                  f.image ? (
                    <div
                      key={`${f.id}-art`}
                      aria-hidden={i !== active}
                      className={`absolute inset-0 -z-10 transition-opacity duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Image
                        src={f.image}
                        alt={i === active ? (f.imageAlt ?? "") : ""}
                        fill
                        loading="eager"
                        sizes="(max-width: 1024px) 100vw, 46vw"
                        placeholder={f.blurDataURL ? "blur" : "empty"}
                        blurDataURL={f.blurDataURL}
                        className="object-cover object-right"
                      />
                    </div>
                  ) : null,
                )}

              {/* Legibility scrim: strongest where the type sits, clearing to
                  almost nothing over the subject. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/35"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent"
              />

              {/* Corner registration marks */}
              <span
                aria-hidden="true"
                className="absolute -top-px -left-px h-5 w-5 border-t border-l border-magenta"
              />
              <span
                aria-hidden="true"
                className="absolute -right-px -bottom-px h-5 w-5 border-r border-b border-magenta"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <span className="eyebrow text-magenta-400">
                    Focus 0{active + 1}
                  </span>

                  <h3 className="mt-6 text-[length:var(--text-display-3)] leading-[1.02] text-white">
                    {area.headline}
                  </h3>

                  <p className="mt-6 max-w-[42ch] text-[1rem] leading-[1.75] text-white/75">
                    {area.detail ?? area.description}
                  </p>

                  <div className="mt-9 flex flex-wrap items-center justify-between gap-6 border-t border-white/12 pt-7">
                    <span className="text-[0.8rem] tracking-[0.1em] text-white/60 uppercase">
                      <span className="font-[family-name:var(--font-display)] text-lg text-white">
                        {String(count).padStart(2, "0")}
                      </span>{" "}
                      {count === 1 ? "product" : "products"} in this area
                    </span>
                    <TextLink href={`/our-focus#${area.slug}`} tone="dark">
                      Explore
                    </TextLink>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <Reveal delay={0.1} y={16}>
              <p className="mt-7 text-[0.82rem] leading-relaxed text-white/35">
                Zafieon Pharma&apos;s current portfolio sits entirely within
                women&apos;s health.{" "}
                <Link
                  href="/our-focus"
                  className="text-white/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-magenta"
                >
                  See the full focus
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
