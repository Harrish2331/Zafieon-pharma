import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandPattern from "@/components/BrandPattern";
import Reveal from "@/components/motion/Reveal";
import AnimatedText from "@/components/motion/AnimatedText";
import InsightTags from "@/components/InsightTags";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { Arrow, SecondaryButton } from "@/components/ui/Button";
import { insights } from "@/data/insights";
import { insightsCopy } from "@/data/site";
import { resolvedInsight, resolvedInsights } from "@/lib/insight-store";

export const revalidate = 60;

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = await resolvedInsight(slug);
  if (!insight) return { title: "Not found" };
  return {
    title: insight.title,
    description: insight.standfirst,
    alternates: { canonical: `/insights/${insight.slug}` },
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = await resolvedInsights();
  const insight = all.find((i) => i.slug === slug);
  if (!insight) notFound();

  const image = insight.image;
  const others = all.filter((i) => i.id !== insight.id).slice(0, 3);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        data-hero-tone="dark"
        className="relative overflow-hidden navy-field pt-[132px] pb-20 text-white lg:pt-[176px] lg:pb-28"
      >
        <BrandPattern tone="white" opacity={0.04} scale={250} fade="left" />

        <div className="shell relative">
          <Reveal y={10} duration={0.6}>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-[0.72rem] tracking-[0.12em] uppercase">
                {[
                  { label: "Home", href: "/" },
                  { label: "Zafieon Insights", href: "/insights" },
                ].map((b, i) => (
                  <li key={b.href} className="flex items-center gap-2">
                    {i > 0 && (
                      <span aria-hidden="true" className="text-white/25">
                        /
                      </span>
                    )}
                    <Link
                      href={b.href}
                      className="text-white/45 transition-colors hover:text-white"
                    >
                      {b.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>

          <Reveal y={12} duration={0.7}>
            <Eyebrow tone="dark">Zafieon Insights</Eyebrow>
          </Reveal>

          <AnimatedText
            as="h1"
            delay={0.08}
            lines={[insight.title]}
            className="mt-7 max-w-[20ch] text-[length:var(--text-display-1)] leading-[0.98] text-white"
          />

          <div className="mt-10 grid lg:grid-cols-12">
            <Reveal delay={0.24} y={20} className="lg:col-span-7">
              <p className="text-[1.0625rem] leading-[1.78] text-white/65">
                {insight.standfirst}
              </p>
              <InsightTags tags={insight.tags} tone="dark" className="mt-8" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Artwork ───────────────────────────────────────────────── */}
      <section className="relative bg-paper pt-16 lg:pt-20">
        <div className="shell">
          <Reveal y={26} duration={1}>
            <figure className="relative isolate">
              <div className="relative aspect-16/9 overflow-hidden bg-paper-200">
                <Image
                  src={image}
                  alt={insight.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  placeholder={insight.blurDataURL ? "blur" : "empty"}
                  blurDataURL={insight.blurDataURL}
                  className="object-cover object-center"
                />
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -z-10 -right-4 -bottom-4 h-full w-full border border-magenta/30 lg:-right-6 lg:-bottom-6"
              />
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <section className="relative bg-paper py-16 lg:py-24">
        <div className="shell grid lg:grid-cols-12">
          <div className="lg:col-span-7 lg:col-start-4">
            {insight.body.map((p, i) => (
              <Reveal key={i} delay={i * 0.06} y={18}>
                <p
                  className={`max-w-[62ch] text-[1.0625rem] leading-[1.8] text-muted ${
                    i > 0 ? "mt-7" : ""
                  }`}
                >
                  {p}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.2} y={16}>
              <div className="mt-12 border-t border-line pt-8">
                <p className="max-w-[62ch] text-[0.82rem] leading-[1.75] text-muted-light">
                  {insightsCopy.disclosure}
                </p>
                <div className="mt-8">
                  <SecondaryButton href="/insights">
                    All Zafieon Insights
                  </SecondaryButton>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Continue ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-paper-100 py-20 lg:py-24">
        <div className="shell">
          <Reveal y={16}>
            <h2 className="mb-10 text-[length:var(--text-display-3)] text-navy">
              Continue reading
            </h2>
          </Reveal>

          <div className="grid gap-px border border-line bg-line md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/insights/${o.slug}`}
                className="group/next flex flex-col bg-paper p-7 transition-colors duration-500 hover:bg-paper-50"
              >
                <InsightTags tags={o.tags.slice(0, 2)} />
                <h3 className="mt-5 text-[1.1rem] leading-[1.2] text-navy">
                  {o.title}
                </h3>
                <p className="mt-3.5 line-clamp-3 text-[0.86rem] leading-[1.65] text-muted">
                  {o.standfirst}
                </p>
                <span className="mt-auto inline-flex items-center gap-2.5 pt-7 text-[0.66rem] font-semibold tracking-[0.16em] text-navy uppercase">
                  Read
                  <Arrow className="text-magenta transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/next:translate-x-1.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
