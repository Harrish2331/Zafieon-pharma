import HeroVisual from "@/components/three/HeroVisual";
import BrandPattern from "@/components/BrandPattern";
import CssRise from "@/components/motion/CssRise";
import CssLines from "@/components/motion/CssLines";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { MagneticButton, SecondaryButton } from "@/components/ui/Button";
import { home, about } from "@/data/site";

/**
 * 01 — The promise.
 *
 * Composition: the headline is the dominant object and runs wide, with the
 * sculpture set behind and to the right, bleeding off the edge so it reads as
 * a photographed object rather than a widget parked in a column. Supporting
 * copy sits in a deliberately narrow measure beneath, which is what keeps the
 * layout from looking like a two-column template.
 *
 * ── Everything here animates in CSS, not Framer Motion ─────────────────────
 * Framer Motion server-renders its `initial` state, so `<Reveal>` and
 * `<AnimatedText>` ship as `opacity: 0` / translated-out-of-mask and stay that
 * way until React hydrates. This is the first viewport: on a throttled
 * connection that held the hero copy invisible until 3.4s, and LCP was
 * measuring exactly that. `<CssRise>` and `<CssLines>` are the same
 * choreography on the compositor, painting from the first frame.
 *
 * The rest of the page keeps Framer Motion, which is right — those sections
 * are meant to animate when the reader scrolls to them.
 */
export default function Hero() {
  const { hero } = home;

  return (
    <section
      data-hero-tone="light"
      className="relative isolate overflow-hidden bg-paper pt-[96px] lg:pt-[92px]"
    >
      <BrandPattern tone="magenta" opacity={0.028} scale={230} fade="right" />

      <div className="shell relative z-10 flex min-h-[calc(100svh-96px)] flex-col justify-center pt-8 pb-14 lg:min-h-[calc(100svh-92px)] lg:pt-0 lg:pb-0">
        <CssRise y={14}>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </CssRise>

        <CssLines
          as="h1"
          delay={0.08}
          lines={[
            hero.line1,
            <span key="m" className="accent">
              {hero.line2}
            </span>,
          ]}
          className="mt-7 text-[length:var(--text-hero)] leading-[0.9] tracking-[-0.022em] text-navy lg:mt-9 lg:max-w-[62%]"
        />

        {/* Sculpture — ONE instance. Inline in the flow on small screens;
            on large screens the same node is lifted out and pinned to the
            right so the type can run across it. Rendering it twice meant two
            WebGL contexts and two render loops competing for the main thread. */}
        <div className="relative my-1 h-[36vh] min-h-[230px] w-full lg:absolute lg:top-1/2 lg:right-[1%] lg:z-0 lg:my-0 lg:h-[76vh] lg:max-h-[720px] lg:w-[36%] lg:-translate-y-1/2 xl:right-[2%] xl:w-[34%]">
          <HeroVisual />
        </div>

        <div className="mt-10 max-w-[60ch] lg:mt-14">
          <CssRise delay={0.3} y={20}>
            <div className="flex items-start gap-5">
              <span
                aria-hidden="true"
                className="mt-3 hidden h-px w-10 shrink-0 bg-magenta sm:block"
              />
              <p className="lede-hero max-w-[40ch]">{hero.body}</p>
            </div>
          </CssRise>

          <CssRise delay={0.42} y={20}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {/* The one magnetic control on the site — reserved for the
                  single most important action on the page. */}
              <MagneticButton href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </MagneticButton>
              <SecondaryButton href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
              </SecondaryButton>
            </div>
          </CssRise>
        </div>
      </div>

      {/* ── Value register — the five commitments, as a measured rule ─── */}
      <div className="relative z-10 border-t border-line bg-paper/95">
        <div className="shell">
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {about.values.map((v, i) => (
              <li
                key={v.id}
                className="border-line py-6 lg:py-8 [&:not(:nth-child(2n+1))]:border-l sm:[&:nth-child(2n+1)]:border-l sm:[&:nth-child(3n+1)]:border-l-0 lg:[&]:border-l lg:[&:first-child]:border-l-0"
              >
                <CssRise delay={0.5 + i * 0.06} y={14}>
                  <div className="pr-4 sm:px-5 lg:px-7">
                    <span className="eyebrow block text-magenta-600">{v.index}</span>
                    <span className="mt-3 block font-[family-name:var(--font-display)] text-[0.98rem] tracking-[0.01em] text-navy uppercase">
                      {v.title}
                    </span>
                  </div>
                </CssRise>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
