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
 *
 * Where a years-of-experience figure used to sit, the standards behind the
 * portfolio sit instead. Zafieon holds no corporate certifications of its own
 * yet — so what is shown here is what its manufacturing partners hold, derived
 * from their own claims and labelled as theirs. That distinction is the whole
 * point of the block, which is why it is stated in the heading rather than
 * buried in a footnote.
 */
export default function AboutSection() {
  const { about } = home;
  // Derived from what partners claim — never a fixed list of logos.
  // Only marks with real artwork: a drawn seal carries no meaning in a logo
  // row detached from the claim it belongs to.
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

          {/* ── Standards ──────────────────────────────────────────────
              Held at the weight of a supporting register rather than a
              badge wall: one hairline plate, marks at a modest size, the
              attribution set as the heading so it cannot be skimmed past. */}
          {networkMarks.length > 0 && (
            <Reveal delay={0.3} y={22}>
              <div className="mt-14 border-t border-line pt-9">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <span className="eyebrow text-magenta-600">
                    Certifications
                  </span>
                  <span className="text-[0.7rem] tracking-[0.12em] text-muted-light uppercase">
                    Held across our manufacturing network
                  </span>
                </div>

                <ul className="mt-7 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
                  {networkMarks.map((m) => (
                    <li
                      key={m.id}
                      className="flex flex-col items-center gap-3 bg-paper-50 px-3 py-6 text-center"
                    >
                      <CertificationMark mark={m} size="md" />
                      <span className="text-[0.68rem] leading-[1.3] font-semibold tracking-[0.09em] text-navy uppercase">
                        {m.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 max-w-[54ch] text-[0.8rem] leading-[1.65] text-muted-light">
                  These certifications are held by the manufacturing partners
                  named against them on our Quality page, as stated in each
                  partner&apos;s own documentation. They are not certifications
                  held by Zafieon Pharma.
                </p>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.42} y={18}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <TextLink href="/about">Learn more about us</TextLink>
              <TextLink href="/quality#certifications">
                See the certification register
              </TextLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
