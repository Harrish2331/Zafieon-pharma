import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import BrandPattern from "@/components/BrandPattern";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import InsightTags from "@/components/InsightTags";
import { Arrow } from "@/components/ui/Button";
import { insightsCopy } from "@/data/site";
import { resolvedInsights } from "@/lib/insight-store";

export const metadata: Metadata = {
  title: "Zafieon Insights",
  description:
    "Zafieon Pharma's perspective on women's health, manufacturing quality and responsible pharmaceutical practice.",
  alternates: { canonical: "/insights" },
};

/**
 * Zafieon Insights.
 *
 * Revalidated rather than fully static: both the images and the copy are
 * replaceable at runtime from the Admin Dashboard, so the page has to be able
 * to pick up a change. Sixty seconds is the backstop — a save also revalidates
 * this path directly, so in practice it is live immediately.
 */
export const revalidate = 60;

export default async function InsightsPage() {
  const insights = await resolvedInsights();
  const [lead, ...rest] = insights;

  return (
    <>
      <PageHero
        eyebrow={insightsCopy.hero.eyebrow}
        lines={[insightsCopy.hero.line1, insightsCopy.hero.line2]}
        body={insightsCopy.hero.body}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Zafieon Insights", href: "/insights" },
        ]}
      />

      {/* ── Lead piece ────────────────────────────────────────────── */}
      <section className="relative bg-paper py-20 lg:py-28">
        <div className="shell">
          <Reveal y={24} duration={0.9}>
            <Link
              href={`/insights/${lead.slug}`}
              className="group/lead grid gap-10 lg:grid-cols-12 lg:gap-12"
            >
              <figure className="relative isolate lg:col-span-7">
                {/* On a wide screen the picture fills the row rather than
                    holding 16:10, because the decorative frame behind it is
                    sized to this figure — and the figure is a grid item, so it
                    stretches to whatever the headline column needs. At 16:10
                    the frame was left hanging 68-115px below the picture with
                    nothing inside it. Measured across every offset frame on
                    the site; this was the only one that did not hug its
                    image. */}
                <div className="relative aspect-16/10 overflow-hidden bg-paper-200 lg:aspect-auto lg:h-full">
                  <Image
                    src={lead.image}
                    alt={lead.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    placeholder={lead.blurDataURL ? "blur" : "empty"}
                    blurDataURL={lead.blurDataURL}
                    className="object-cover object-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/lead:scale-[1.03]"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -z-10 -right-4 -bottom-4 h-full w-full border border-magenta/30 lg:-right-6 lg:-bottom-6"
                />
              </figure>

              <div className="flex flex-col justify-center lg:col-span-5">
                <span className="eyebrow text-magenta-600">Latest</span>
                <h2 className="mt-6 text-[length:var(--text-display-2)] leading-[1.02] text-navy">
                  {lead.title}
                </h2>
                <p className="lede mt-6 max-w-[42ch]">{lead.standfirst}</p>
                <InsightTags tags={lead.tags} className="mt-8" />
                <span className="mt-9 inline-flex items-center gap-2.5 text-[0.68rem] font-semibold tracking-[0.16em] text-navy uppercase">
                  Read
                  <Arrow className="text-magenta transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/lead:translate-x-1.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── The rest ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden navy-field py-20 text-white lg:py-28">
        <BrandPattern tone="white" opacity={0.04} scale={250} fade="radial" />

        <div className="shell relative">
          <Reveal y={16}>
            <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4 border-b border-white/12 pb-6">
              <h2 className="text-[length:var(--text-display-3)] text-white">
                More from Zafieon
              </h2>
              <span className="text-[0.72rem] tracking-[0.14em] text-white/40 uppercase">
                {String(insights.length).padStart(2, "0")} pieces
              </span>
            </div>
          </Reveal>

          <Stagger step={0.08} className="grid gap-6 md:grid-cols-3">
            {rest.map((i) => (
              <StaggerItem key={i.id} className="h-full">
                <Link
                  href={`/insights/${i.slug}`}
                  className="group/card flex h-full flex-col border border-white/12 bg-white/[0.035] transition-[transform,border-color,background-color] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-white/30 hover:bg-white/[0.06]"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-navy-900">
                    <Image
                      src={i.image}
                      alt={i.imageAlt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 92vw, 30vw"
                      placeholder={i.blurDataURL ? "blur" : "empty"}
                      blurDataURL={i.blurDataURL}
                      className="object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.05]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 lg:p-7">
                    <InsightTags tags={i.tags} tone="dark" />
                    <h3 className="mt-5 text-[1.2rem] leading-[1.15] text-white">
                      {i.title}
                    </h3>
                    <p className="mt-4 text-[0.88rem] leading-[1.7] text-white/55">
                      {i.standfirst}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2.5 pt-7 text-[0.66rem] font-semibold tracking-[0.16em] text-white uppercase">
                      Read
                      <Arrow className="text-magenta transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} y={16}>
            <p className="mt-12 max-w-[92ch] text-[0.8rem] leading-relaxed text-white/35">
              {insightsCopy.disclosure}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
