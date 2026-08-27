import Image from "next/image";
import type { CertificationMarkDef } from "@/data/certifications";

/**
 * A single certification mark.
 *
 * All four supplied seals are circular artwork on a white ground, so every mark
 * sits inside a white circular plate of a fixed diameter. That gives a
 * consistent bounding area across marks of differing internal proportion,
 * without scaling any of them non-uniformly — the artwork is always contained,
 * never stretched, and never cropped.
 *
 * Where no artwork exists for a claim, the site's own drawn seal is used. It is
 * visibly a Zafieon element rather than an imitation of a regulator's mark.
 */

const SIZES = {
  sm: { plate: 36, pad: 4, ring: 1 },
  md: { plate: 52, pad: 6, ring: 1 },
  lg: { plate: 72, pad: 8, ring: 1 },
} as const;

export type MarkSize = keyof typeof SIZES;

export default function CertificationMark({
  mark,
  size = "md",
  tone = "light",
  className = "",
}: {
  mark: CertificationMarkDef;
  size?: MarkSize;
  tone?: "light" | "dark";
  className?: string;
}) {
  const s = SIZES[size];
  const dark = tone === "dark";

  if (!mark.logo) {
    // No supplied artwork: the drawn seal, not a recreated official emblem.
    return (
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full border ${
          dark ? "border-white/25" : "border-line-strong"
        } ${className}`}
        style={{ width: s.plate, height: s.plate }}
      >
        <svg viewBox="0 0 24 24" fill="none" style={{ width: s.plate * 0.46 }}>
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
    );
  }

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ${
        dark ? "ring-white/15" : "ring-line"
      } ${className}`}
      style={{
        width: s.plate,
        height: s.plate,
        padding: s.pad,
        boxShadow: `0 0 0 ${s.ring}px ${dark ? "rgba(255,255,255,0.14)" : "rgba(195,204,218,0.9)"}`,
      }}
    >
      <Image
        src={mark.logo}
        alt={mark.alt ?? `${mark.label} certification mark`}
        width={s.plate * 2}
        height={s.plate * 2}
        sizes={`${s.plate}px`}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

/**
 * A row of marks. Used wherever a set of certifications is summarised rather
 * than listed — partner cards, the network register, a partner hero.
 *
 * Only marks with real artwork appear here. A drawn seal is meaningful beside
 * the claim it belongs to, but in a compact row of recognisable logos an empty
 * ring reads as a broken image. Claims without artwork are still shown in full
 * on the partner's own certification list, so nothing is hidden.
 */
export function CertificationMarkRow({
  marks,
  size = "sm",
  tone = "light",
  max,
  className = "",
}: {
  marks: CertificationMarkDef[];
  size?: MarkSize;
  tone?: "light" | "dark";
  /** Cap the row and show a "+n" tally rather than overflowing. */
  max?: number;
  className?: string;
}) {
  const withArt = marks.filter((m) => m.logo);
  if (!withArt.length) return null;
  const shown = max ? withArt.slice(0, max) : withArt;
  const rest = withArt.length - shown.length;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {shown.map((m) => (
        <CertificationMark key={m.id} mark={m} size={size} tone={tone} />
      ))}
      {rest > 0 && (
        <span
          className={`text-[0.68rem] font-semibold tracking-[0.1em] uppercase ${
            tone === "dark" ? "text-white/45" : "text-muted-light"
          }`}
        >
          +{rest}
        </span>
      )}
      {/* The visual row is decorative once the names are in the DOM elsewhere;
          this keeps the set announced exactly once. */}
      <span className="sr-only">
        Certifications claimed: {withArt.map((m) => m.label).join(", ")}
      </span>
    </div>
  );
}
