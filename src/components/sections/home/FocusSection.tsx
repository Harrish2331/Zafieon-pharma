"use client";

import { useState } from "react";
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
                <li key={f.id} className="border-b border-white/12 first:border-t">
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
              className="relative isolate min-h-[24rem] overflow-hidden border border-white/12 bg-navy-900 p-8 sm:p-11"
              aria-live="polite"
            >
              {/* Area artwork, cross-faded with the copy.
                  The supplied set is composed with its subject to the right and
                  negative space to the left, so the scrim below only has to
                  deepen what is already dark — the artwork stays legible and
                  the type keeps full contrast without a heavy overlay. */}
              <AnimatePresence mode="wait">
                {area.image && (
                  <motion.div
                    key={`${area.id}-art`}
                    className="absolute inset-0 -z-10"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    <Image
                      src={area.image}
                      alt={area.imageAlt ?? ""}
                      fill
                      sizes="(max-width: 1024px) 100vw, 46vw"
                      placeholder={area.blurDataURL ? "blur" : "empty"}
                      blurDataURL={area.blurDataURL}
                      className="object-cover object-right"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

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
