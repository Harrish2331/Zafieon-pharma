import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import BrandPattern from "@/components/BrandPattern";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import ProductCard from "@/components/ProductCard";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { focusAreas } from "@/data/focus";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Our Focus",
  description:
    "Zafieon Pharma is focused on women's health, with an emphasis on gynaecology, hormonal health, fertility and women's wellness.",
  alternates: { canonical: "/our-focus" },
};

export default function OurFocusPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Focus"
        lines={["Focused on", "women's health."]}
        body="Zafieon Pharma is beginning its journey with a focused presence in women's health, with an emphasis on gynaecology, hormonal health, fertility and women's wellness. The long-term vision is to expand into multiple therapeutic divisions."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Our Focus", href: "/our-focus" },
        ]}
      >
        <Reveal delay={0.34} y={18}>
          <ul className="mt-14 flex flex-wrap gap-3 lg:mt-20">
            {focusAreas.map((f) => (
              <li key={f.id}>
                <a
                  href={`#${f.slug}`}
                  className="inline-block border border-white/20 px-5 py-3 text-[0.68rem] font-semibold tracking-[0.14em] text-white/70 uppercase transition-colors duration-400 hover:border-magenta hover:text-white"
                >
                  {f.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </PageHero>

      {/* ── Women's health, the frame ─────────────────────────────── */}
      <section className="relative overflow-hidden py-24 lg:py-36">
        {/* The Women's health banner — the wide consultation image, distinct
            from the Women's Wellness focus artwork. Optimised copy of the
            supplied "Women health.png". */}
        <Image
          src="/images/womens-health-banner.webp"
          alt="A clinician and a patient reviewing information together, with women's health motifs"
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAAAQBACdASoUAAgAPt1ep00opSOiMAgBEBuJZgCdMoR3AB6SdqI1uaW2AAD+5ZBl3zI32kgAha7yxuv/9q6uIujNQBoCMZviFaVynM07LKETwXvbHBuDY40shTE5xlIiS4yZ6SyJgAA="
          className="object-cover object-center"
        />
        {/* Dark navy overlay so text stays readable */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-navy/70"
        />

        <div className="shell relative">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal y={18}>
                <h2 className="text-[length:var(--text-display-2)] text-white">
                  Women&apos;s health
                </h2>
              </Reveal>
              {/* Magenta rule — matches the brand accent */}
              <Reveal delay={0.08} y={12}>
                <span aria-hidden="true" className="mt-6 block h-px w-10 bg-magenta" />
              </Reveal>
            </div>
            <div className="space-y-7 lg:col-span-6 lg:col-start-7">
              <Reveal y={18}>
                <p className="text-[1.0625rem] leading-[1.78] text-white/75">
                  Women&apos;s health is not a category we drifted into. It is
                  where the company started, and every product currently in the
                  portfolio sits inside it &mdash; from prescription gynaecology
                  through to everyday nutritional support.
                </p>
              </Reveal>
              <Reveal delay={0.1} y={18}>
                <p className="text-[1.0625rem] leading-[1.78] text-white/75">
                  Focusing narrowly is deliberate. It lets us qualify partners
                  against the specific demands of these formulations, hold a
                  smaller catalogue to a higher standard, and be genuinely
                  useful to the distributors, pharmacists and clinicians who
                  work in this field.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── The four areas ────────────────────────────────────────── */}
      {focusAreas.map((area, i) => {
        const related = products.filter((p) =>
          p.therapeuticAreas.includes(area.id),
        );
        const dark = i % 2 === 1;

        return (
          <section
            key={area.id}
            id={area.slug}
            className={`relative scroll-mt-24 overflow-hidden py-24 lg:py-32 ${
              dark ? "bg-navy text-white" : "bg-paper-100"
            }`}
          >
            <BrandPattern
              tone={dark ? "white" : "navy"}
              opacity={dark ? 0.04 : 0.028}
              scale={250}
              fade={i % 4 < 2 ? "left" : "right"}
            />

            <div className="shell relative">
              <div className="grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <Reveal y={14} duration={0.7}>
                    <span
                      className={`eyebrow inline-flex items-center gap-3 ${
                        dark ? "text-white/50" : "text-navy/50"
                      }`}
                    >
                      <span aria-hidden="true" className="h-px w-7 bg-magenta" />
                      Focus {String(i + 1).padStart(2, "0")} &mdash; {area.label}
                    </span>
                  </Reveal>

                  <Reveal delay={0.08} y={20}>
                    <h2
                      className={`mt-7 max-w-[18ch] text-[length:var(--text-display-2)] leading-[0.96] ${
                        dark ? "text-white" : "text-navy"
                      }`}
                    >
                      {area.headline}
                    </h2>
                  </Reveal>
                </div>

                <div className="space-y-7 lg:col-span-5 lg:col-start-8 lg:pt-4">
                  <Reveal delay={0.14} y={18}>
                    <p
                      className={`text-[1.0625rem] leading-[1.78] ${
                        dark ? "text-white/65" : "text-muted"
                      }`}
                    >
                      {area.description}
                    </p>
                  </Reveal>
                  {area.detail && (
                    <Reveal delay={0.2} y={18}>
                      <p
                        className={`text-[1rem] leading-[1.78] ${
                          dark ? "text-white/50" : "text-muted"
                        }`}
                      >
                        {area.detail}
                      </p>
                    </Reveal>
                  )}
                </div>
              </div>

              {related.length > 0 && (
                <div className="mt-16 lg:mt-20">
                  <Reveal y={16}>
                    <div
                      className={`mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b pb-5 ${
                        dark ? "border-white/15" : "border-line"
                      }`}
                    >
                      <h3
                        className={`text-[length:var(--text-display-3)] ${
                          dark ? "text-white" : "text-navy"
                        }`}
                      >
                        In this area
                      </h3>
                      <span
                        className={`text-[0.72rem] tracking-[0.14em] uppercase ${
                          dark ? "text-white/40" : "text-muted-light"
                        }`}
                      >
                        {String(related.length).padStart(2, "0")}{" "}
                        {related.length === 1 ? "product" : "products"}
                      </span>
                    </div>
                  </Reveal>

                  <Stagger
                    step={0.07}
                    className={`grid gap-px sm:grid-cols-2 lg:grid-cols-3 ${
                      dark ? "bg-white/12" : "border border-line bg-line"
                    }`}
                  >
                    {related.map((p) => (
                      <StaggerItem key={p.id} className="bg-paper">
                        <ProductCard product={p} />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* ── Beyond women's health ─────────────────────────────────── */}
      <section className="relative bg-paper py-24 lg:py-32">
        <div className="shell-tight text-center">
          <Reveal y={18}>
            <h2 className="text-[length:var(--text-display-2)] text-navy">
              And beyond.
            </h2>
          </Reveal>
          <Reveal delay={0.12} y={18}>
            <p className="lede mx-auto mt-8 max-w-[52ch]">
              Women&apos;s health is where Zafieon Pharma begins, not where it
              ends. The long-term vision is to expand into multiple therapeutic
              divisions &mdash; built outward from the same foundation of quality,
              qualified manufacturing partnerships and responsible practice.
            </p>
          </Reveal>
          <Reveal delay={0.2} y={18}>
            <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
              <PrimaryButton href="/products">Explore Products</PrimaryButton>
              <SecondaryButton href="/about">Discover Zafieon</SecondaryButton>
            </div>
          </Reveal>
          <Reveal delay={0.26} y={16}>
            <p className="mt-12 text-[0.82rem] text-muted-light">
              Looking for a specific therapeutic area?{" "}
              <Link
                href="/contact"
                className="text-navy underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-magenta"
              >
                Talk to us
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
