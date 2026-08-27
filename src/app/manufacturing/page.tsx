import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BrandPattern from "@/components/BrandPattern";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import PartnerCard from "@/components/PartnerCard";
import ManufacturingFootprint from "@/components/ManufacturingFootprint";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { manufacturing } from "@/data/site";
import { partners, exportReach } from "@/data/partners";

export const metadata: Metadata = {
  title: "Manufacturing",
  description:
    "Zafieon Pharma works with carefully selected and qualified pharmaceutical manufacturing partners across India, sharing a commitment to quality, consistency and regulatory compliance.",
  alternates: { canonical: "/manufacturing" },
};

export default function ManufacturingPage() {
  return (
    <>
      <PageHero
        eyebrow={manufacturing.hero.eyebrow}
        lines={[manufacturing.hero.line1, manufacturing.hero.line2]}
        body={manufacturing.hero.body}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Manufacturing", href: "/manufacturing" },
        ]}
      />

      {/* ── What we expect of a partner ───────────────────────────── */}
      <section className="relative bg-paper py-24 lg:py-32">
        <div className="shell">
          <SectionHeader
            eyebrow="Partner Expectations"
            lines={["What we hold", "our partners to."]}
            size="display-2"
          />

          <Stagger
            step={0.06}
            className="mt-16 grid border-t border-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
          >
            {manufacturing.principles.map((p, i) => (
              <StaggerItem
                key={p.id}
                className="border-b border-line lg:border-l lg:[&:nth-child(4n+1)]:border-l-0"
              >
                <div className="h-full py-8 lg:px-8 lg:[&:nth-child(4n+1)]:pl-0">
                  <span className="eyebrow text-magenta-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-[1.05rem] leading-[1.2] text-navy">
                    {p.title}
                  </h3>
                  <p className="mt-3.5 max-w-[34ch] text-[0.88rem] leading-[1.7] text-muted">
                    {p.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Partner directory ─────────────────────────────────────── */}
      <section
        id="partners"
        className="relative scroll-mt-24 overflow-hidden navy-field py-24 text-white lg:py-32"
      >
        <BrandPattern tone="white" opacity={0.04} scale={250} fade="radial" />

        <div className="shell relative">
          <SectionHeader
            eyebrow={manufacturing.directory.eyebrow}
            lines={manufacturing.directory.headline}
            tone="dark"
            size="display-2"
          />

          <div className="mt-10 grid lg:grid-cols-12">
            <Reveal delay={0.14} className="lg:col-span-6 lg:col-start-7">
              <p className="text-[1.0625rem] leading-[1.78] text-white/60">
                {manufacturing.directory.body}
              </p>
            </Reveal>
          </div>

          <Stagger
            step={0.07}
            className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
          >
            {partners.map((p, i) => (
              <StaggerItem key={p.id} className="h-full">
                <PartnerCard partner={p} index={i} tone="dark" />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} y={16}>
            <p className="mt-9 max-w-[92ch] text-[0.82rem] leading-relaxed text-white/35">
              Select a partner to view its capabilities, documented sites,
              stated certifications and the companies it manufactures for. Those
              relationships belong to the partner and are not Zafieon Pharma
              relationships.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Footprint ─────────────────────────────────────────────── */}
      <section className="relative bg-paper py-24 lg:py-32">
        <div className="shell">
          <SectionHeader
            eyebrow="Manufacturing Footprint"
            lines={["The cluster", "behind the portfolio."]}
            size="display-2"
          />

          <div className="mt-10 grid lg:grid-cols-12">
            <Reveal delay={0.14} className="lg:col-span-6 lg:col-start-7">
              <p className="text-[1.0625rem] leading-[1.78] text-muted">
                Every manufacturing partner in our network operates in India,
                concentrated across the pharmaceutical belt of Himachal Pradesh,
                Punjab and Haryana, with additional capability in Gujarat.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 lg:mt-20">
            <ManufacturingFootprint />
          </div>
        </div>
      </section>

      {/* ── Global presence, attributed ───────────────────────────── */}
      {exportReach.length > 0 && (
        <section className="relative overflow-hidden bg-paper-100 py-24 lg:py-32">
          <div className="shell relative">
            <SectionHeader
              eyebrow={manufacturing.presence.eyebrow}
              lines={manufacturing.presence.headline}
              size="display-2"
            />

            <div className="mt-10 grid lg:grid-cols-12">
              <Reveal delay={0.14} className="lg:col-span-6 lg:col-start-7">
                <p className="text-[1.0625rem] leading-[1.78] text-muted">
                  {manufacturing.presence.body}
                </p>
              </Reveal>
            </div>

            {exportReach.map((e) => (
              <div key={e.slug} className="mt-16 lg:mt-20">
                <Reveal y={16}>
                  <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
                    <h3 className="text-[length:var(--text-display-3)] text-navy">
                      {e.partner}
                    </h3>
                    <span className="text-[0.72rem] tracking-[0.14em] text-muted-light uppercase">
                      {e.markets.length} markets stated by the partner
                    </span>
                  </div>
                </Reveal>

                <Stagger
                  step={0.012}
                  className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5"
                >
                  {e.markets.map((m) => (
                    <StaggerItem key={m}>
                      <span className="flex items-baseline gap-2.5 text-[0.88rem] text-navy">
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 shrink-0 translate-y-[-0.15em] bg-magenta"
                        />
                        {m}
                      </span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            ))}

            <Reveal delay={0.1} y={16}>
              <p className="mt-12 max-w-[88ch] text-[0.82rem] leading-relaxed text-muted-light">
                These are the export markets stated by the named manufacturing
                partner in its own corporate documentation. They describe that
                partner&apos;s reach, not Zafieon Pharma&apos;s, and they do not
                indicate that any Zafieon Pharma product is registered or
                supplied in those markets.
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden navy-field py-20 text-white lg:py-28">
        <BrandPattern tone="white" opacity={0.04} scale={250} fade="top" />
        <div className="shell relative flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-[length:var(--text-display-3)] text-white">
              Manufacture with Zafieon
            </h2>
            <p className="mt-4 max-w-[50ch] text-[0.95rem] text-white/55">
              We are always interested in qualified partners who hold themselves
              to the same standards.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <PrimaryButton href="/contact" tone="magenta">
              Get in Touch
            </PrimaryButton>
            <SecondaryButton href="/quality" tone="dark">
              Our Quality Framework
            </SecondaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
