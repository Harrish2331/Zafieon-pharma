import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import BrandPattern from "@/components/BrandPattern";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import AssociatedBrands from "@/components/AssociatedBrands";
import CertificationMark, {
  CertificationMarkRow,
} from "@/components/CertificationMark";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { getPartner, partners } from "@/data/partners";
import { markFor, resolve } from "@/data/certifications";
import { disclosures } from "@/data/site";

export function generateStaticParams() {
  return partners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) return { title: "Partner not found" };

  return {
    title: `${partner.name} — Manufacturing Partner`,
    description:
      partner.tagline ??
      `${partner.name} is a qualified manufacturing partner of Zafieon Pharma, operating in ${partner.country}.`,
    alternates: { canonical: `/manufacturing/${partner.slug}` },
  };
}

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) notFound();

  const others = partners.filter((p) => p.slug !== partner.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Manufacturing Partner"
        lines={[partner.shortName]}
        accentIndex={-1}
        body={partner.tagline}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Manufacturing", href: "/manufacturing" },
          { label: partner.shortName, href: `/manufacturing/${partner.slug}` },
        ]}
      >
        {resolve(partner.certifications).length > 0 && (
          <Reveal delay={0.28} y={18}>
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 lg:mt-16">
              <span className="eyebrow text-white/40">Claimed certifications</span>
              <CertificationMarkRow
                marks={resolve(partner.certifications)}
                size="md"
                tone="dark"
              />
            </div>
          </Reveal>
        )}

        <Reveal delay={0.34} y={18}>
          <dl className="mt-12 grid gap-8 border-t border-white/15 pt-9 sm:grid-cols-3">
            <div>
              <dt className="eyebrow text-white/40">Country</dt>
              <dd className="mt-3 text-[1.05rem] text-white">
                {partner.country}
              </dd>
            </div>
            {partner.region && (
              <div>
                <dt className="eyebrow text-white/40">Region</dt>
                <dd className="mt-3 text-[1.05rem] text-white">
                  {partner.region}
                </dd>
              </div>
            )}
            {partner.website && (
              <div>
                <dt className="eyebrow text-white/40">Website</dt>
                <dd className="mt-3 text-[1.05rem] text-white/80">
                  {partner.website}
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
      </PageHero>

      {/* ── Interim profile ───────────────────────────────────────
          Zafieon has supplied this partner's name and location but no
          brochure. The copy on the page describes the standard Zafieon holds
          every partner to; it does not claim anything on the partner's behalf,
          and the notice says so before the reader gets to any of it. */}
      {partner.profileInterim && (
        <section className="relative bg-paper pt-16 lg:pt-20">
          <div className="shell">
            <Reveal y={18}>
              <div className="border-l-2 border-magenta bg-paper-50 py-6 pr-7 pl-7">
                <span className="eyebrow text-magenta-600">
                  Interim profile
                </span>
                <p className="mt-4 max-w-[74ch] text-[0.92rem] leading-[1.75] text-muted">
                  {partner.shortName} has been confirmed by Zafieon Pharma as a
                  manufacturing partner, and its name and location are as
                  supplied. Its corporate documentation has not yet reached us,
                  so the profile below sets out the standard Zafieon holds every
                  partner to rather than facts documented by{" "}
                  {partner.shortName}. No capability, certification, facility or
                  export market is claimed on the partner&apos;s behalf, and this
                  page will be replaced in full once the brochure arrives.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Profile pending ───────────────────────────────────────── */}
      {partner.profilePending && (
        <section className="relative bg-paper py-24 lg:py-32">
          <div className="shell-tight">
            <Reveal y={20}>
              <div className="border border-line bg-paper-50 p-9 lg:p-12">
                <span className="eyebrow text-magenta-600">Profile in preparation</span>
                <h2 className="mt-6 text-[length:var(--text-display-3)] text-navy">
                  Details to follow
                </h2>
                <p className="mt-5 max-w-[58ch] text-[1rem] leading-[1.75] text-muted">
                  {partner.name} is part of Zafieon Pharma&apos;s manufacturing
                  network. The corporate documentation supplied for this partner
                  did not include capability, certification or facility detail,
                  and we would rather leave this profile incomplete than publish
                  information we cannot verify. It will be filled in as soon as
                  the partner provides it.
                </p>
                <div className="mt-9">
                  <SecondaryButton href="/manufacturing">
                    Back to the network
                  </SecondaryButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── About the partner ─────────────────────────────────────── */}
      {partner.about?.length ? (
        <section className="relative bg-paper py-24 lg:py-32">
          <div className="shell">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <Reveal y={16}>
                  <h2 className="text-[length:var(--text-display-3)] text-navy">
                    About the
                    <br />
                    partner
                  </h2>
                </Reveal>
              </div>
              <div className="space-y-7 lg:col-span-8 lg:col-start-5">
                {partner.about.map((p, i) => (
                  <Reveal key={i} delay={i * 0.08} y={18}>
                    <p className="max-w-[62ch] text-[1.0625rem] leading-[1.78] text-muted">
                      {p}
                    </p>
                  </Reveal>
                ))}

                {partner.people?.length ? (
                  <Reveal delay={0.24} y={18}>
                    <div className="mt-12 border-t border-line pt-8">
                      <span className="eyebrow text-muted-light">Leadership</span>
                      <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                        {partner.people.map((pp) => (
                          <li key={pp.name}>
                            <span className="block text-[1rem] text-navy">
                              {pp.name}
                            </span>
                            <span className="mt-1 block text-[0.82rem] text-muted-light">
                              {pp.role}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Capabilities & certifications ─────────────────────────── */}
      {(partner.capabilities?.length || partner.certifications?.length) && (
        <section className="relative overflow-hidden navy-field py-24 text-white lg:py-32">
          <BrandPattern tone="white" opacity={0.04} scale={250} fade="radial" />

          <div className="shell relative grid gap-16 lg:grid-cols-12 lg:gap-12">
            {partner.capabilities?.length ? (
              <div className="lg:col-span-6">
                <Reveal y={16}>
                  <h2 className="text-[length:var(--text-display-2)] text-white">
                    Manufacturing
                    <br />
                    capabilities
                  </h2>
                </Reveal>
                <Stagger step={0.04} className="mt-10 border-t border-white/15">
                  {partner.capabilities.map((c) => (
                    <StaggerItem key={c}>
                      <div className="flex items-baseline gap-4 border-b border-white/12 py-4">
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 bg-magenta"
                        />
                        <span className="text-[1rem] leading-[1.6] text-white/80">
                          {c}
                        </span>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            ) : null}

            {partner.certifications?.length ? (
              <div className="lg:col-span-5 lg:col-start-8">
                <Reveal y={16}>
                  <h2 className="text-[length:var(--text-display-2)] text-white">
                    Quality &amp;
                    <br />
                    regulatory
                  </h2>
                </Reveal>
                <Stagger step={0.05} className="mt-10 space-y-5">
                  {partner.certifications.map((c) => {
                    // Resolved from this partner's own claim string — a mark
                    // can only appear because the partner claims it.
                    const mark = markFor(c);
                    return (
                      <StaggerItem key={c}>
                        <div className="flex items-start gap-5 border border-white/15 p-5">
                          {mark && (
                            <CertificationMark mark={mark} size="md" tone="dark" />
                          )}
                          <div className="min-w-0">
                            {mark && (
                              <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-magenta-400 uppercase">
                                {mark.label}
                              </p>
                            )}
                            <p
                              className={`text-[0.92rem] leading-[1.65] text-white/75 ${
                                mark ? "mt-2" : ""
                              }`}
                            >
                              {c}
                            </p>
                            {mark?.note && (
                              <p className="mt-3 text-[0.72rem] leading-[1.6] text-white/35">
                                {mark.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
                <Reveal delay={0.14} y={16}>
                  <p className="mt-7 text-[0.8rem] leading-relaxed text-white/35">
                    {disclosures.certifications}
                  </p>
                </Reveal>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* ── Regulatory registrations ──────────────────────────────
          Market registrations, not quality-system certifications, and kept
          visibly apart from them. No regulator's emblem is drawn for any of
          these: they appear as attributed text and nothing more. */}
      {partner.regulatoryRegistrations?.length ? (
        <section className="relative bg-paper py-20 lg:py-24">
          <div className="shell">
            <Reveal y={16}>
              <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
                <h2 className="text-[length:var(--text-display-3)] text-navy">
                  Regulatory registrations
                </h2>
                <span className="text-[0.72rem] tracking-[0.14em] text-muted-light uppercase">
                  {partner.regulatoryRegistrations.length} stated by the partner
                </span>
              </div>
            </Reveal>

            <Stagger step={0.05} className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {partner.regulatoryRegistrations.map((r) => (
                <StaggerItem key={r}>
                  <span className="flex items-baseline gap-3 text-[0.95rem] leading-[1.6] text-navy">
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 shrink-0 translate-y-[-0.3em] bg-magenta"
                    />
                    {r}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.12} y={16}>
              <p className="mt-8 max-w-[80ch] text-[0.8rem] leading-relaxed text-muted-light">
                These are national regulatory registrations and approvals held
                by {partner.shortName}, as printed in its own documentation.
                They are not certifications, they are not held by Zafieon
                Pharma, and they say nothing about the registration status of
                any Zafieon Pharma product in those markets.
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ── Announced capability ──────────────────────────────────
          Labelled as planned throughout. Capacities a partner announces for a
          facility it is still building are not capacity it has. */}
      {partner.planned ? (
        <section className="relative bg-paper-100 py-20 lg:py-24">
          <div className="shell">
            <Reveal y={16}>
              <span className="eyebrow text-magenta-600">
                Announced — not yet operational
              </span>
              <h2 className="mt-6 text-[length:var(--text-display-3)] text-navy">
                {partner.planned.title}
              </h2>
              {partner.planned.operator && (
                <p className="mt-4 text-[0.95rem] text-muted">
                  To be operated by{" "}
                  <strong className="font-medium text-navy">
                    {partner.planned.operator}
                  </strong>
                  .
                </p>
              )}
            </Reveal>

            <Stagger
              step={0.05}
              className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2"
            >
              {partner.planned.items.map((it) => (
                <StaggerItem key={it}>
                  <span className="flex items-baseline gap-3 text-[0.95rem] leading-[1.6] text-navy">
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 shrink-0 translate-y-[-0.3em] bg-magenta"
                    />
                    {it}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.12} y={16}>
              <p className="mt-8 max-w-[80ch] text-[0.8rem] leading-relaxed text-muted-light">
                {partner.shortName} announces this facility and these capacities
                as upcoming in its own documentation. They are planned, not
                installed, and no Zafieon Pharma product is manufactured there.
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ── Facilities ────────────────────────────────────────────── */}
      {partner.facilities?.length ? (
        <section className="relative bg-paper py-24 lg:py-32">
          <div className="shell">
            <Reveal y={16}>
              <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-[length:var(--text-display-2)] text-navy">
                  Documented sites
                </h2>
                <span className="text-[0.72rem] tracking-[0.14em] text-muted-light uppercase">
                  {partner.facilities.length}{" "}
                  {partner.facilities.length === 1 ? "site" : "sites"}
                </span>
              </div>
            </Reveal>

            <Stagger step={0.05} className="border-t border-line">
              {partner.facilities.map((f, i) => (
                <StaggerItem key={f.name + i}>
                  <div className="grid gap-3 border-b border-line py-7 lg:grid-cols-12 lg:gap-10">
                    <span className="eyebrow text-muted-light lg:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[1.05rem] leading-[1.3] text-navy lg:col-span-4">
                      {f.name}
                    </h3>
                    <p className="text-[0.92rem] leading-[1.6] text-muted lg:col-span-5">
                      {f.location}
                    </p>
                    {f.role && (
                      <span className="text-[0.75rem] tracking-[0.1em] text-magenta-600 uppercase lg:col-span-2">
                        {f.role}
                      </span>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* ── Export markets ────────────────────────────────────────── */}
      {partner.exportMarkets?.length ? (
        <section className="relative bg-paper-100 py-24 lg:py-32">
          <div className="shell">
            <Reveal y={16}>
              <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-[length:var(--text-display-2)] text-navy">
                  Export markets
                </h2>
                <span className="text-[0.72rem] tracking-[0.14em] text-muted-light uppercase">
                  {partner.exportMarkets.length} stated by the partner
                </span>
              </div>
            </Reveal>

            <Stagger
              step={0.012}
              className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5"
            >
              {partner.exportMarkets.map((m) => (
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
        </section>
      ) : null}

      {/* ── Associations stated by the partner ────────────────────── */}
      {partner.associations?.length ? (
        <section className="relative bg-paper py-16 lg:py-20">
          <div className="shell">
            <Reveal y={16}>
              <div className="border border-line bg-paper-50 p-7 lg:p-9">
                <span className="eyebrow text-magenta-600">Stated associations</span>
                <p className="mt-4 max-w-[70ch] text-[0.95rem] leading-[1.75] text-muted">
                  {partner.shortName}&apos;s own documentation describes a
                  strategic association with{" "}
                  <strong className="font-medium text-navy">
                    {partner.associations.join(" and ")}
                  </strong>
                  .
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ── Qualifiers we surface rather than bury ────────────────── */}
      {partner.qualifiers?.length ? (
        <section className="relative bg-paper pb-16 lg:pb-20">
          <div className="shell">
            {partner.qualifiers.map((q, i) => (
              <Reveal key={i} delay={i * 0.06} y={14}>
                <div className="mt-4 border-l-2 border-magenta bg-paper-50 py-5 pr-6 pl-6">
                  <p className="max-w-[80ch] text-[0.88rem] leading-[1.75] text-muted">
                    {q}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Brands the PARTNER manufactures for ───────────────────── */}
      <AssociatedBrands partner={partner} />

      {/* ── Other partners ────────────────────────────────────────── */}
      <section className="relative bg-paper-100 py-20 lg:py-28">
        <div className="shell">
          <Reveal y={16}>
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-[length:var(--text-display-3)] text-navy">
                Other partners
              </h2>
              <Link
                href="/manufacturing"
                className="text-[0.7rem] font-semibold tracking-[0.16em] text-navy uppercase underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-magenta"
              >
                Full network
              </Link>
            </div>
          </Reveal>

          <Stagger step={0.07} className="grid gap-px border border-line bg-line md:grid-cols-3">
            {others.map((p) => (
              <StaggerItem key={p.id} className="bg-paper">
                <Link
                  href={`/manufacturing/${p.slug}`}
                  className="group block h-full p-7 transition-colors duration-500 hover:bg-paper-50"
                >
                  <span className="eyebrow text-magenta-600">{p.country}</span>
                  <h3 className="mt-4 text-[1.25rem] leading-[1.15] text-navy">
                    {p.shortName}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-[0.88rem] leading-[1.65] text-muted">
                    {p.tagline ??
                      p.capabilities?.slice(0, 3).join(" · ") ??
                      "Profile in preparation"}
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden navy-field py-20 text-white lg:py-28">
        <BrandPattern tone="white" opacity={0.04} scale={250} fade="top" />
        <div className="shell relative flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
          <h2 className="max-w-[24ch] text-[length:var(--text-display-3)] text-white">
            Questions about our manufacturing network?
          </h2>
          <div className="flex flex-wrap gap-4">
            <PrimaryButton href="/contact" tone="magenta">
              Get in Touch
            </PrimaryButton>
            <SecondaryButton href="/quality" tone="dark">
              Quality Framework
            </SecondaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
