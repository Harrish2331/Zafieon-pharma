import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import BrandPattern from "@/components/BrandPattern";
import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import ValuesIndex from "@/components/ValuesIndex";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { about, site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Zafieon Pharma is a new-generation pharmaceutical company founded to contribute to better healthcare through quality, science, innovation and responsible practices.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={about.hero.eyebrow}
        lines={[about.hero.line1, about.hero.line2]}
        body={about.hero.body}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />

      {/* ── Our Story ─────────────────────────────────────────────── */}
      <section className="relative bg-paper py-24 lg:py-36">
        <div className="shell">
          <SectionHeader
            eyebrow={about.story.eyebrow}
            lines={about.story.headline}
            size="display-2"
          />

          <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5" y={28} duration={1}>
              <figure className="relative isolate">
                <div className="relative aspect-3/2 overflow-hidden bg-paper-100">
                  <Image
                    src="/images/office.webp"
                    alt="Reception at the Zafieon Pharma office, with the Zafieon Pharma logo mounted behind the desk"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAACQBACdASoUAA0APt1apkyopSOiMAgBEBuJYgCdMoMljEu+sB8nMKpdJQwnbgAA/W7Ayct4DPrm6N6/5sArv5Wsz5C/N4Qo38F7hlem9hlX/uDeo6RXGkUqCfAZPpNiVI7P4xfnkflVW9gxPdLKX9bBynYISdlfHvcsKlOlLpSjngAA"
                className="object-cover object-center"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -z-10 -right-5 -bottom-5 h-full w-full border border-magenta/25"
                />
              </figure>
            </Reveal>

            <div className="space-y-7 lg:col-span-6 lg:col-start-7">
              {about.story.body.map((p, i) => (
                <Reveal key={i} delay={i * 0.08} y={18}>
                  <p className="max-w-[54ch] text-[1.0625rem] leading-[1.78] text-muted">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission / Vision ──────────────────────────────────────── */}
      <section className="relative overflow-hidden navy-field py-24 text-white lg:py-32">
        <BrandPattern tone="white" opacity={0.04} scale={250} fade="radial" />

        <div className="shell relative grid gap-14 lg:grid-cols-2 lg:gap-20">
          {[about.mission, about.vision].map((b, i) => (
            <Reveal key={b.label} delay={i * 0.12} y={24}>
              <div className="border-t border-white/15 pt-9">
                <span className="eyebrow text-magenta-400">{b.label}</span>
                <p className="mt-7 max-w-[30ch] font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.1vw,1.85rem)] leading-[1.25] tracking-[-0.012em] text-white uppercase">
                  {b.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Our Journey ───────────────────────────────────────────── */}
      <section className="relative bg-paper py-24 lg:py-36">
        <div className="shell">
          <SectionHeader
            eyebrow={about.journey.eyebrow}
            lines={about.journey.headline}
            size="display-2"
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4" y={16}>
              <div className="border-t border-line pt-7">
                <span className="eyebrow text-magenta-600">Starting point</span>
                <p className="mt-5 max-w-[22ch] font-[family-name:var(--font-display)] text-[1.35rem] leading-[1.25] tracking-[-0.015em] text-navy uppercase">
                  Women&apos;s health, held to a single standard.
                </p>
              </div>
            </Reveal>
            <div className="space-y-7 lg:col-span-7 lg:col-start-6">
              {about.journey.body.map((p, i) => (
                <Reveal key={i} delay={i * 0.08} y={18}>
                  <p className="text-[1.0625rem] leading-[1.78] text-muted">{p}</p>
                </Reveal>
              ))}
              <Reveal delay={0.2} y={18}>
                <div className="pt-4">
                  <SecondaryButton href="/our-focus">
                    Explore Our Focus
                  </SecondaryButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Drives Us ────────────────────────────────────────── */}
      <ValuesIndex />

      {/* ── Our Commitment ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-paper py-24 lg:py-36">
        <div className="shell relative">
          <SectionHeader
            eyebrow={about.commitment.eyebrow}
            lines={about.commitment.headline}
            size="display-2"
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4" y={16}>
              <div className="border-t border-line pt-7">
                <span className="eyebrow text-magenta-600">The commitment</span>
                <p className="mt-5 max-w-[22ch] font-[family-name:var(--font-display)] text-[1.35rem] leading-[1.25] tracking-[-0.015em] text-navy uppercase">
                  Trust, responsibility and meaningful partnerships.
                </p>
              </div>
            </Reveal>
            <div className="space-y-7 lg:col-span-7 lg:col-start-6">
              {about.commitment.body.map((p, i) => (
                <Reveal key={i} delay={i * 0.08} y={18}>
                  <p className="text-[1.0625rem] leading-[1.78] text-muted">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2} y={26}>
            <div className="mt-20 border-t border-line pt-16 text-center lg:mt-28">
              <p className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,5rem)] leading-[0.9] tracking-[-0.025em] text-navy uppercase">
                Every Dose <span className="accent">Matters.</span>
              </p>
              <p className="mx-auto mt-7 max-w-[42ch] text-[0.95rem] text-muted">
                {site.concept}
              </p>
              <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
                <PrimaryButton href="/products">Explore Products</PrimaryButton>
                <SecondaryButton href="/contact">Get in Touch</SecondaryButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
