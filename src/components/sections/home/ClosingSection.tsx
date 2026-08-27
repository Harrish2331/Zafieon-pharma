import BrandPattern from "@/components/BrandPattern";
import AnimatedText from "@/components/motion/AnimatedText";
import Reveal from "@/components/motion/Reveal";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { home, site } from "@/data/site";

/**
 * 07 — The closing.
 *
 * A light plate before the navy footer, so the tagline lands twice without the
 * two dark blocks running together. This one is the statement; the footer's is
 * a sign-off.
 */
export default function ClosingSection() {
  const { closing } = home;

  return (
    <section className="relative overflow-hidden bg-paper py-28 lg:py-40">
      <BrandPattern tone="magenta" opacity={0.05} scale={260} fade="radial" />

      <div className="shell relative text-center">
        <Reveal y={14} duration={0.7}>
          <span className="eyebrow inline-flex items-center gap-3 text-navy/45">
            <span aria-hidden="true" className="h-px w-7 bg-magenta" />
            {site.concept}
            <span aria-hidden="true" className="h-px w-7 bg-magenta" />
          </span>
        </Reveal>

        <AnimatedText
          as="h2"
          delay={0.08}
          lines={[
            closing.line1,
            <span key="m" className="accent">
              {closing.line2}
            </span>,
          ]}
          className="mt-9 text-[length:var(--text-display-1)] leading-[0.9] tracking-[-0.022em] text-navy"
        />

        <Reveal delay={0.3} y={20}>
          <p className="lede mx-auto mt-9 max-w-[46ch]">{closing.body}</p>
        </Reveal>

        <Reveal delay={0.4} y={20}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <PrimaryButton href={closing.cta.href}>
              {closing.cta.label}
            </PrimaryButton>
            <SecondaryButton href="/contact">Get in Touch</SecondaryButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
