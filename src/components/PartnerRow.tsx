import Link from "next/link";
import type { Partner } from "@/data/types";
import { Arrow } from "@/components/ui/Button";

/**
 * A partner as a directory row rather than a card.
 *
 * Note what is deliberately absent: `partner.associatedBrands`. The companies a
 * partner manufactures for belong on that partner's own detail page, under a
 * disclaimer — never on the homepage, and never adjacent to Zafieon's name.
 */
export default function PartnerRow({
  partner,
  index,
  tone = "dark",
}: {
  partner: Partner;
  index: number;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const pending = partner.profilePending;

  const shell = dark
    ? "border-white/12 hover:bg-white/[0.035]"
    : "border-line hover:bg-paper-50";

  return (
    <Link
      href={`/manufacturing/${partner.slug}`}
      className={`group/row relative block border-b first:border-t ${shell} transition-colors duration-500`}
    >
      {/* Magenta rule wipes across the row on hover */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-magenta transition-transform duration-[750ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-x-100"
      />

      <div className="grid items-baseline gap-x-8 gap-y-3 px-1 py-7 lg:grid-cols-12 lg:py-9">
        <span
          className={`eyebrow lg:col-span-1 ${dark ? "text-white/35" : "text-muted-light"}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3
          className={`text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.1] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:translate-x-1.5 lg:col-span-4 ${
            dark ? "text-white" : "text-navy"
          }`}
        >
          {partner.shortName}
        </h3>

        <span
          className={`text-[0.82rem] tracking-[0.06em] lg:col-span-2 ${
            dark ? "text-white/50" : "text-muted"
          }`}
        >
          {partner.region ?? partner.country}
        </span>

        <span
          className={`text-[0.85rem] leading-[1.6] lg:col-span-4 ${
            dark ? "text-white/50" : "text-muted"
          }`}
        >
          {pending
            ? "Profile in preparation"
            : (partner.capabilities?.slice(0, 3).join(" · ") ??
              partner.tagline ??
              "")}
        </span>

        <span className="hidden justify-self-end lg:col-span-1 lg:block">
          <Arrow className="text-magenta transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}
