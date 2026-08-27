import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/motion/Reveal";
import { legalDocs, getLegalDoc } from "@/data/legal";

export function generateStaticParams() {
  return legalDocs.map((d) => ({ doc: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const found = getLegalDoc(doc);
  if (!found) return { title: "Not found" };
  return {
    title: found.title,
    description: found.intro,
    alternates: { canonical: `/legal/${found.slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const found = getLegalDoc(doc);
  if (!found) notFound();

  return (
    <>
      <PageHero
        eyebrow={found.eyebrow}
        lines={[found.title]}
        accentIndex={-1}
        body={found.intro}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: found.title, href: `/legal/${found.slug}` },
        ]}
      />

      <section className="relative bg-paper py-20 lg:py-28">
        <div className="shell-tight">
          {found.awaitingReview && (
            <Reveal y={16}>
              <div className="mb-14 border-l-2 border-magenta bg-paper-50 py-5 pr-7 pl-6">
                <p className="max-w-[70ch] text-[0.88rem] leading-[1.75] text-muted">
                  <strong className="font-semibold text-navy">
                    Awaiting legal review.
                  </strong>{" "}
                  This document sets out Zafieon Pharma&apos;s intended position
                  in plain language. It has not yet been settled by counsel and
                  should not be relied on as a final legal instrument until it
                  has been.
                </p>
              </div>
            </Reveal>
          )}

          <div className="space-y-14">
            {found.sections.map((s, i) => (
              <Reveal key={s.heading} delay={i * 0.06} y={18}>
                <section>
                  <h2 className="text-[length:var(--text-display-3)] text-navy">
                    {s.heading}
                  </h2>
                  <div className="mt-6 space-y-5">
                    {s.body.map((p, j) => (
                      <p
                        key={j}
                        className="max-w-[66ch] text-[1rem] leading-[1.8] text-muted"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
