import Image from "next/image";
import Link from "next/link";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import InsightTags from "@/components/InsightTags";
import { PrimaryButton, Arrow } from "@/components/ui/Button";
import { insightsCopy } from "@/data/site";
import { resolvedInsights } from "@/lib/insight-store";

/**
 * 07 — The perspective.
 *
 * Sits between the partnerships and the close: after the reader has seen what
 * Zafieon supplies and who makes it, and before being asked to do anything.
 *
 * The four entries come from the store rather than straight from the data
 * file, so an image or a description changed in the Admin Dashboard reaches the
 * homepage as well as /insights. That is what makes this an async server
 * component, and why the homepage carries a revalidate window.
 */
export default async function InsightsSection() {
  const insights = await resolvedInsights();

  return (
    <section className="relative bg-paper-50 py-24 lg:py-32">
      <div className="shell">
        <SectionHeader
          eyebrow={insightsCopy.index.eyebrow}
          lines={insightsCopy.index.headline}
          size="display-2"
        />

        <div className="mt-10 grid lg:grid-cols-12">
          <Reveal delay={0.16} className="lg:col-span-6 lg:col-start-7">
            <p className="text-[1.0625rem] leading-[1.75] text-muted">
              {insightsCopy.index.body}
            </p>
            <div className="mt-9">
              <PrimaryButton href={insightsCopy.index.cta.href}>
                {insightsCopy.index.cta.label}
              </PrimaryButton>
            </div>
          </Reveal>
        </div>

        <Stagger
          step={0.07}
          className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {insights.map((i) => (
            <StaggerItem key={i.id} className="h-full">
              <Link
                href={`/insights/${i.slug}`}
                className="group/ins flex h-full flex-col bg-paper transition-colors duration-500 hover:bg-paper-50"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-paper-200">
                  <Image
                    src={i.image}
                    alt={i.imageAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 24vw"
                    placeholder={i.blurDataURL ? "blur" : "empty"}
                    blurDataURL={i.blurDataURL}
                    className="object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/ins:scale-[1.05]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-magenta transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/ins:scale-x-100"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <InsightTags tags={i.tags.slice(0, 2)} />
                  <h3 className="mt-5 text-[1.08rem] leading-[1.2] text-navy">
                    {i.title}
                  </h3>
                  <p className="mt-3.5 line-clamp-3 text-[0.85rem] leading-[1.65] text-muted">
                    {i.standfirst}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2.5 pt-6 text-[0.66rem] font-semibold tracking-[0.16em] text-navy uppercase">
                    Read
                    <Arrow className="text-magenta transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/ins:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
