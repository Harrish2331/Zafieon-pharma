"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandPattern from "@/components/BrandPattern";
import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { about } from "@/data/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The five values, as an index rather than five cards.
 *
 * The active value's number is set at display scale on the left and its
 * statement reads across the right. Moving through the list is the whole
 * interaction; nothing else on screen moves.
 */
export default function ValuesIndex() {
  const [active, setActive] = useState(0);
  const value = about.values[active];

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

          {/* ── Statement ─────────────────────────────────────────── */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="relative min-h-[16rem] lg:sticky lg:top-32" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <span
                    aria-hidden="true"
                    className="block font-[family-name:var(--font-display)] text-[clamp(4rem,9vw,8rem)] leading-[0.78] tracking-[-0.04em] text-magenta/15"
                  >
                    {value.index}
                  </span>
                  <p className="mt-8 max-w-[34ch] border-t border-line pt-8 text-[1.15rem] leading-[1.7] text-navy">
                    {value.body}
                  </p>
                </motion.div>
              </AnimatePresence>
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
