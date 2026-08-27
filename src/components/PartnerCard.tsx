import Image from "next/image";
import Link from "next/link";
import type { Partner } from "@/data/types";
import { Arrow } from "@/components/ui/Button";
import { resolve } from "@/data/certifications";
import { CertificationMarkRow } from "@/components/CertificationMark";

/**
 * A manufacturing partner, as a trust card.
 *
 * What appears here is deliberately limited: the partner's own logo, its name,
 * where it manufactures, and a count of the certifications it states. That is
 * enough to establish credibility at a glance.
 *
 * What does NOT appear here — on the homepage or anywhere else outside the
 * partner's own page — is the list of companies that partner manufactures for.
 * Those relationships belong to the partner, and putting them beside Zafieon's
 * name would imply a connection that does not exist. Clicking through is what
 * opens that detail, in its own context and under its own disclaimer.
 *
 * The logo sits on a fixed white plate so seven logos of differing origin,
 * colour and crop read as one consistent set.
 */
export default function PartnerCard({
  partner,
  index,
  tone = "light",
}: {
  partner: Partner;
  index: number;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const certCount = partner.certifications?.length ?? 0;
  const siteCount = partner.facilities?.length ?? 0;
  const capCount = partner.capabilities?.length ?? 0;
  // Only the marks this partner actually claims.
  const marks = resolve(partner.certifications);

  return (
    <Link
      href={`/manufacturing/${partner.slug}`}
      className={`group/pc relative flex h-full flex-col overflow-hidden border transition-[transform,border-color,box-shadow] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform hover:-translate-y-1.5 ${
        dark
          ? "border-white/12 bg-white/[0.035] hover:border-white/30 hover:bg-white/[0.06] hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]"
          : "border-line bg-paper hover:border-navy/25 hover:shadow-[0_24px_60px_-28px_rgba(20,39,75,0.35)]"
      }`}
    >
      {/* Magenta rule sweeps the top edge on hover */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 z-10 h-px w-full origin-left scale-x-0 bg-magenta transition-transform duration-[750ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pc:scale-x-100"
      />

      {/* Logo plate — always white, so every partner mark sits on the same ground */}
      <div className="relative flex h-[132px] items-center justify-center overflow-hidden bg-white px-8">
        {partner.logo ? (
          <Image
            src={partner.logo}
            alt={`${partner.name} logo`}
            width={260}
            height={90}
            sizes="260px"
            className="max-h-[62px] w-auto object-contain transition-transform duration-[750ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pc:scale-[1.06]"
          />
        ) : (
          <span className="font-[family-name:var(--font-display)] text-2xl tracking-[-0.02em] text-navy/70 uppercase">
            {partner.shortName}
          </span>
        )}
      </div>

      {/* Detail */}
      <div
        className={`flex flex-1 flex-col border-t p-6 ${
          dark ? "border-white/12" : "border-line"
        }`}
      >
        <span className="eyebrow text-magenta-600">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3
          className={`mt-3.5 text-[1.15rem] leading-[1.15] ${
            dark ? "text-white" : "text-navy"
          }`}
        >
          {partner.shortName}
        </h3>

        <p
          className={`mt-2.5 text-[0.82rem] leading-[1.5] ${
            dark ? "text-white/50" : "text-muted"
          }`}
        >
          {partner.region ?? partner.country}
        </p>

        {/* Trust register */}
        <div
          className={`mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-5 text-[0.68rem] tracking-[0.11em] uppercase ${
            dark ? "border-white/12 text-white/45" : "border-line text-muted-light"
          }`}
        >
          {marks.length > 0 ? (
            <CertificationMarkRow marks={marks} size="sm" tone={tone} max={4} />
          ) : certCount > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-magenta" />
              {certCount} {certCount === 1 ? "certification" : "certifications"}
            </span>
          ) : null}
          {siteCount > 0 && (
            <span>
              {siteCount} {siteCount === 1 ? "site" : "sites"}
            </span>
          )}
          {certCount === 0 && siteCount === 0 && capCount > 0 && (
            <span>
              {capCount} {capCount === 1 ? "capability" : "capabilities"}
            </span>
          )}
          {/* Only the partner that genuinely supplied no profile says so. */}
          {partner.profilePending && <span>Profile in preparation</span>}
        </div>

        <span
          className={`mt-6 inline-flex items-center gap-2.5 text-[0.68rem] font-semibold tracking-[0.16em] uppercase ${
            dark ? "text-white" : "text-navy"
          }`}
        >
          View partner
          <Arrow className="text-magenta transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pc:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}
