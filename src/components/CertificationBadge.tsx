import Link from "next/link";
import type { Partner } from "@/data/types";
import { markFor } from "@/data/certifications";
import CertificationMark from "@/components/CertificationMark";

/**
 * A certification, presented as a record rather than a logo.
 *
 * Every one of these belongs to a manufacturing partner, not to Zafieon, and
 * the card is built so that fact is unmissable: the holder is named on the
 * badge itself, not in a footnote.
 *
 * The supplied documents give certification strings of very different shapes —
 * some are a bare standard ("ISO 9001:2015"), some carry a number, an issuing
 * body and an expiry ("GMP Certificate No. … — Health & Family Welfare
 * Department, Himachal Pradesh"). This parses what is present and shows only
 * that; it never fills a gap.
 */

function parse(raw: string) {
  // "<name> No. <ref> — <issuer>"  /  "<name> — <issuer>"  /  "<name>"
  const [head, ...rest] = raw.split("—").map((s) => s.trim());
  const tail = rest.join(" — ") || undefined;

  // Some claims end in a validity clause rather than an issuing body. Treating
  // "valid to 12.11.2026" as the issuer read as nonsense on the licence card.
  const validityOnly = tail ? /^valid\s+(?:up\s+)?to\b/i.test(tail) : false;
  const issuer = validityOnly ? undefined : tail;

  const refMatch = head.match(/\bNos?\.\s*([^,]+(?:,\s*[^,]+)*)$/i);
  const name = (refMatch ? head.slice(0, refMatch.index) : head)
    .trim()
    .replace(/[,;:]+$/, "");
  const reference = refMatch?.[1]?.trim();

  const validity = tail?.match(/valid (?:up )?to ([\d.\/-]+)/i)?.[1];

  return { name, reference, issuer, validity };
}

export default function CertificationBadge({
  raw,
  partner,
  tone = "light",
}: {
  raw: string;
  partner: Partner;
  tone?: "light" | "dark";
}) {
  const { name, reference, issuer, validity } = parse(raw);
  const dark = tone === "dark";
  // The mark is resolved from this partner's own claim string. A partner can
  // never show a mark it has not claimed.
  const mark = markFor(raw);

  return (
    <div
      className={`group/cert relative flex h-full flex-col overflow-hidden border p-6 transition-[border-color,background-color] duration-500 ${
        dark
          ? "border-white/12 bg-white/[0.03] hover:border-white/25"
          : "border-line bg-paper hover:border-navy/25"
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-magenta transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cert:scale-x-100"
      />

      {/* The mark for this claim — supplied artwork where it exists, the
          drawn seal where it does not. Never a recreated official emblem. */}
      {mark ? (
        <CertificationMark mark={mark} size="md" tone={tone} />
      ) : (
        <span
          aria-hidden="true"
          className={`flex h-13 w-13 items-center justify-center rounded-full border ${
            dark ? "border-white/25" : "border-line-strong"
          }`}
          style={{ width: 52, height: 52 }}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1"
              className={dark ? "text-white/20" : "text-line-strong"}
            />
            <path
              d="M8 12.4l2.6 2.6L16 9.6"
              stroke="#e5188a"
              strokeWidth="1.7"
              strokeLinecap="square"
            />
          </svg>
        </span>
      )}

      <h3
        className={`mt-6 text-[1.02rem] leading-[1.2] ${
          dark ? "text-white" : "text-navy"
        }`}
      >
        {name}
      </h3>

      <dl className="mt-4 mb-7 space-y-2.5">
        {reference && (
          <div>
            <dt className="sr-only">Reference</dt>
            <dd
              className={`font-mono text-[0.75rem] tracking-tight ${
                dark ? "text-white/55" : "text-muted"
              }`}
            >
              {reference}
            </dd>
          </div>
        )}
        {issuer && (
          <div>
            <dt
              className={`text-[0.62rem] font-semibold tracking-[0.14em] uppercase ${
                dark ? "text-white/35" : "text-muted-light"
              }`}
            >
              Issued by
            </dt>
            <dd
              className={`mt-1 text-[0.82rem] leading-[1.5] ${
                dark ? "text-white/60" : "text-muted"
              }`}
            >
              {issuer}
            </dd>
          </div>
        )}
        {validity && (
          <div>
            <dt
              className={`text-[0.62rem] font-semibold tracking-[0.14em] uppercase ${
                dark ? "text-white/35" : "text-muted-light"
              }`}
            >
              Valid to
            </dt>
            <dd className={`mt-1 text-[0.82rem] ${dark ? "text-white/60" : "text-muted"}`}>
              {validity}
            </dd>
          </div>
        )}
      </dl>

      {mark?.note && (
        <p
          className={`-mt-3 mb-7 border-l-2 border-magenta/50 pl-4 text-[0.72rem] leading-[1.6] ${
            dark ? "text-white/40" : "text-muted-light"
          }`}
        >
          {mark.note}
        </p>
      )}

      {/* The holder — the whole point of the card. */}
      <div
        className={`mt-auto flex items-baseline justify-between gap-3 border-t pt-5 ${
          dark ? "border-white/12" : "border-line"
        }`}
      >
        <span
          className={`text-[0.62rem] font-semibold tracking-[0.14em] uppercase ${
            dark ? "text-white/35" : "text-muted-light"
          }`}
        >
          Held by
        </span>
        <Link
          href={`/manufacturing/${partner.slug}`}
          className={`text-[0.82rem] underline underline-offset-4 transition-colors ${
            dark
              ? "text-white/80 decoration-white/25 hover:decoration-magenta"
              : "text-navy decoration-line-strong hover:decoration-magenta"
          }`}
        >
          {partner.shortName}
        </Link>
      </div>
    </div>
  );
}
