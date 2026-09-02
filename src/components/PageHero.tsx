import type { ReactNode } from "react";
import Link from "next/link";
import BrandPattern from "@/components/BrandPattern";
import CssRise from "@/components/motion/CssRise";
import CssLines from "@/components/motion/CssLines";
import { Eyebrow } from "@/components/ui/SectionHeader";

/**
 * The shared page opener.
 *
 * Navy by default, which is what lets the fixed navigation invert cleanly via
 * `data-hero-tone`. The magenta accent falls on the second line, so every page
 * opens with the same two-beat cadence as the homepage.
 *
 * ── Entrances are CSS, not Framer Motion ───────────────────────────────────
 * Framer Motion server-renders its `initial` state, so `<Reveal>` ships as
 * `opacity: 0` and `<AnimatedText>` ships translated out of its own mask. Both
 * stay that way until React hydrates. This component is the first viewport on
 * every inner page, and on a throttled connection that put LCP at 3.4s — the
 * page had painted, but the only thing on it was invisible.
 *
 * `<CssRise>` and `<CssLines>` are the same choreography on the compositor.
 * They paint on the first frame and finish whether or not the JavaScript
 * arrives. Everything below the fold keeps Framer Motion, which is correct:
 * those sections are meant to animate when the reader reaches them.
 */
export default function PageHero({
  eyebrow,
  lines,
  accentIndex = 1,
  body,
  breadcrumb,
  children,
  tone = "dark",
}: {
  eyebrow: string;
  lines: readonly string[];
  /** Which line takes the magenta. Pass -1 for none. */
  accentIndex?: number;
  body?: string;
  breadcrumb?: { label: string; href: string }[];
  children?: ReactNode;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";

  const rendered = lines.map((l, i) =>
    i === accentIndex ? (
      <span key={i} className="accent">
        {l}
      </span>
    ) : (
      l
    ),
  );

  return (
    <section
      data-hero-tone={tone}
      className={`relative overflow-hidden pt-[132px] pb-20 lg:pt-[184px] lg:pb-28 ${
        dark ? "navy-field text-white" : "bg-paper-50"
      }`}
    >
      <BrandPattern
        tone={dark ? "white" : "navy"}
        opacity={dark ? 0.045 : 0.03}
        scale={250}
        fade="left"
      />

      <div className="shell relative">
        {breadcrumb && (
          <CssRise y={10}>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-[0.72rem] tracking-[0.12em] uppercase">
                {breadcrumb.map((b, i) => (
                  <li key={b.href} className="flex items-center gap-2">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className={dark ? "text-white/25" : "text-line-strong"}
                      >
                        /
                      </span>
                    )}
                    <Link
                      href={b.href}
                      className={`transition-colors ${
                        dark
                          ? "text-white/45 hover:text-white"
                          : "text-muted-light hover:text-navy"
                      }`}
                    >
                      {b.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </CssRise>
        )}

        <CssRise delay={0.06} y={12}>
          <Eyebrow tone={dark ? "dark" : "light"}>{eyebrow}</Eyebrow>
        </CssRise>

        <CssLines
          as="h1"
          delay={0.12}
          lines={rendered}
          className={`mt-7 text-[length:var(--text-display-1)] leading-[0.92] ${
            dark ? "text-white" : "text-navy"
          }`}
        />

        {body && (
          <div className="mt-10 grid lg:grid-cols-12">
            <CssRise delay={0.26} y={20} className="lg:col-span-6 lg:col-start-7">
              <p
                className={`text-[1.0625rem] leading-[1.75] ${
                  dark ? "text-white/60" : "text-muted"
                }`}
              >
                {body}
              </p>
            </CssRise>
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
