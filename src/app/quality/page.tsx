import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import BrandPattern from "@/components/BrandPattern";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import QualityLifecycle from "@/components/QualityLifecycle";
import CertificationBadge from "@/components/CertificationBadge";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { quality, disclosures } from "@/data/site";
import { partners } from "@/data/partners";

export const metadata: Metadata = {
  title: "Quality",
  description:
    "Zafieon Pharma is committed to products that meet stringent standards of quality, safety, efficacy and regulatory compliance, through carefully selected manufacturing partners.",
  alternates: { canonical: "/quality" },
};

export default function QualityPage() {
  const certified = partners.filter((p) => p.certifications?.length);

  return (
    <>
      <PageHero
        eyebrow={quality.hero.eyebrow}
        lines={[quality.hero.line1, quality.hero.line2]}
        body={quality.hero.body}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Quality", href: "/quality" },
        ]}
      />

      {/* ── Philosophy ────────────────────────────────────────────── */}
      <section className="relative bg-paper py-24 lg:py-32">
        <div className="shell">
          <SectionHeader
            eyebrow={quality.philosophy.eyebrow}
            lines={quality.philosophy.headline}
            size="display-2"
          />
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5" y={28} duration={1}>
              <figure className="relative isolate">
                <div className="relative aspect-4/3 overflow-hidden bg-paper-100">
                  <Image
                    src="/images/quality-check.webp"
                    alt="A scientist in a laboratory examining a sample under a microscope, with pipettes, culture plates and test tubes on the bench"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    placeholder="blur"
                    blurDataURL="data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAADwAwCdASoUAAsAPt1apkyopSOiMAgBEBuJaACw7CPdXbVI4CfM91tSAOFd9dnbetdjpzvBH7TPlEc9d8jcYixalU858sNec/87tbym0jt14ZadIUQuu5W6fg3F77G2LF3trpRnAb3VZOm/Nym68IyiQPNgvgXlHwCJg4Icd8kv5tvmpvgiFTBMZnGSFSKBkpaRBdbtP38/ZGb0ikAAAA=="
                    className="object-cover object-center"
                  />
                </div>
                {/* Offset register, behind the plate — the same treatment the
                    office photograph carries on About. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -z-10 -right-5 -bottom-5 h-full w-full border border-magenta/25"
                />
              </figure>
            </Reveal>

            <div className="space-y-7 lg:col-span-6 lg:col-start-7">
              {quality.philosophy.body.map((p, i) => (
                <Reveal key={i} delay={i * 0.08} y={18}>
                  <p className="text-[1.0625rem] leading-[1.78] text-muted">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden navy-field py-24 text-white lg:py-32">
        <BrandPattern tone="white" opacity={0.04} scale={250} fade="radial" />

        <div className="shell relative">
          <Reveal y={16}>
            <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-[length:var(--text-display-2)] text-white">
                Four pillars
              </h2>
              <span className="text-[0.72rem] tracking-[0.14em] text-white/40 uppercase">
                How quality is held
              </span>
            </div>
          </Reveal>

          <Stagger step={0.09} className="grid border-t border-white/12 md:grid-cols-2">
            {quality.pillars.map((p, i) => (
              <StaggerItem
                key={p.id}
                className="border-b border-white/12 md:[&:nth-child(2n)]:border-l"
              >
                <div className="group relative h-full py-9 transition-colors duration-500 hover:bg-white/[0.03] md:px-9 md:[&:nth-child(2n+1)]:pl-0 lg:py-12">
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-magenta transition-transform duration-[750ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />
                  <span className="eyebrow text-magenta-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 text-[length:var(--text-display-3)] leading-[1.05] text-white">
                    {p.title}
                  </h3>
                  <p className="mt-5 max-w-[40ch] text-[0.98rem] leading-[1.72] text-white/55">
                    {p.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Lifecycle ─────────────────────────────────────────────── */}
      <section className="relative bg-paper-100 py-24 lg:py-32">
        <div className="shell">
          <SectionHeader
            eyebrow="Product Lifecycle"
            lines={["Quality is held", "at every stage."]}
            size="display-2"
          />
          <div className="mt-16 lg:mt-24">
            <QualityLifecycle />
          </div>
        </div>
      </section>

      {/* ── Certifications ────────────────────────────────────────── */}
      <section id="certifications" className="relative scroll-mt-28 bg-paper py-24 lg:py-32">
        <div className="shell">
          <SectionHeader
            eyebrow={quality.certifications.eyebrow}
            lines={quality.certifications.headline}
            size="display-2"
          />

          <div className="mt-10 grid lg:grid-cols-12">
            <Reveal delay={0.14} className="lg:col-span-6 lg:col-start-7">
              <p className="text-[1.0625rem] leading-[1.78] text-muted">
                {quality.certifications.body}
              </p>
            </Reveal>
          </div>

          {/* Attributed, per partner. Never presented as Zafieon's own. */}
          <div className="mt-16 lg:mt-20">
            {certified.map((p, pi) => (
              <div key={p.id} className={pi > 0 ? "mt-16" : ""}>
                <Reveal y={16}>
                  <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
                    <h3 className="text-[length:var(--text-display-3)] text-navy">
                      {p.shortName}
                    </h3>
                    <span className="text-[0.72rem] tracking-[0.14em] text-muted-light uppercase">
                      {p.region ?? p.country} · {p.certifications!.length}{" "}
                      {p.certifications!.length === 1 ? "record" : "records"}
                    </span>
                  </div>
                </Reveal>

                <Stagger step={0.07} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {p.certifications!.map((c) => (
                    <StaggerItem key={c} className="h-full">
                      <CertificationBadge raw={c} partner={p} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            ))}

            <Reveal delay={0.12} y={16}>
              <div className="mt-10 border border-line bg-paper-50 p-7 lg:p-9">
                <span className="eyebrow text-magenta-600">Important</span>
                <p className="mt-4 max-w-[80ch] text-[0.9rem] leading-[1.75] text-muted">
                  {disclosures.certifications}
                </p>
                <p className="mt-4 max-w-[80ch] text-[0.9rem] leading-[1.75] text-muted">
                  {quality.certifications.note}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden navy-field py-20 text-white lg:py-28">
        <BrandPattern tone="white" opacity={0.04} scale={250} fade="top" />
        <div className="shell relative flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-[length:var(--text-display-3)] text-white">
              See the network behind the standard
            </h2>
            <p className="mt-4 max-w-[50ch] text-[0.95rem] text-white/55">
              Every product we supply is made by a partner we have qualified
              against these expectations.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <PrimaryButton href="/manufacturing" tone="magenta">
              Explore Manufacturing
            </PrimaryButton>
            <SecondaryButton href="/contact" tone="dark">
              Get in Touch
            </SecondaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
