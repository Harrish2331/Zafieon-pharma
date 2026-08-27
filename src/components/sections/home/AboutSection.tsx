import Image from "next/image";
import BrandPattern from "@/components/BrandPattern";
import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/Button";
import { home } from "@/data/site";
import { partners } from "@/data/partners";
import { marksAcross } from "@/data/certifications";
import CertificationMark from "@/components/CertificationMark";

/**
 * 02 — The organization.
 *
 * The only genuine photograph in the supplied material is the office. It is
 * given the weight it deserves: large, cropped tall, and set against the
 * headline rather than beside it.
 */
export default function AboutSection() {
  const { about } = home;
  // Derived from what partners claim — never a fixed list of logos.
  // Only marks with real artwork — a drawn seal carries no meaning in a
  // logo row detached from the claim it belongs to.
  const networkMarks = marksAcross(partners).filter((m) => m.logo);

  return (
    <section className="relative overflow-hidden bg-paper-50 py-24 lg:py-36">
      <BrandPattern tone="navy" opacity={0.03} scale={230} fade="left" />

      <div className="shell relative">
        <SectionHeader
          eyebrow={about.eyebrow}
          lines={about.headline}
          size="display-2"
        />
      </div>

      <div className="shell relative mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
        {/* Image column */}
        <Reveal className="lg:col-span-5" y={30} duration={1}>
          <figure className="relative isolate">
            <div className="relative aspect-3/2 overflow-hidden bg-paper-200">
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
            {/* Hairline offset frame — precision, not decoration. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -z-10 -right-4 -bottom-4 h-full w-full border border-magenta/25 lg:-right-6 lg:-bottom-6"
            />
          </figure>
        </Reveal>

        {/* Type column */}
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="space-y-6">
            {about.body.map((p, i) => (
              <Reveal key={i} delay={0.14 + i * 0.08} y={18}>
                <p className="max-w-[52ch] text-[1.0625rem] leading-[1.75] text-muted">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          {/* The statistic, set as display type rather than a badge. */}
          <Reveal delay={0.3} y={22}>
            <div className="mt-14 flex items-start gap-7 border-t border-line pt-9">
              <span className="font-[family-name:var(--font-display)] text-[clamp(3rem,5vw,4.5rem)] leading-[0.8] tracking-[-0.03em] text-magenta">
                {about.stat.value}
              </span>
              <span className="max-w-[19ch] pt-1 text-[0.78rem] leading-[1.6] font-medium tracking-[0.13em] text-navy uppercase">
                {about.stat.label}
              </span>
            </div>
          </Reveal>

          {/* Certification coverage across the network.
              These marks belong to the manufacturing partners, not to Zafieon,
              and the label says so — the section is about Zafieon's own
              experience, so the distinction has to be unmissable here of all
              places. Only marks a partner actually claims are shown. */}
          {networkMarks.length > 0 && (
            <Reveal delay={0.38} y={20}>
              <div className="mt-10 border-t border-line pt-8">
                <span className="eyebrow block text-muted-light">
                  Certifications held across our manufacturing network
                </span>
                <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-5">
                  {networkMarks.map((m) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <CertificationMark mark={m} size="md" />
                      <span className="text-[0.72rem] leading-[1.35] font-semibold tracking-[0.1em] text-navy uppercase">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.46} y={18}>
            <div className="mt-10">
              <TextLink href="/about">Learn more about us</TextLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
