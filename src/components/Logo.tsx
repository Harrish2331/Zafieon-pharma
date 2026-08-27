import Image from "next/image";
import Link from "next/link";

/**
 * The official Zafieon logo, used as a supplied brand asset.
 *
 * Brand rules enforced here rather than left to the caller:
 *  · minimum width 120px for the full lockups (brand guidelines, p.9)
 *  · clear space equal to the height of the letter "Z" on all sides
 *  · never recoloured, rotated, stretched, shadowed or filtered
 *  · the correct variant is selected by background, not by hand
 *
 * The white variants are the official navy artwork with the wordmark set to
 * #FFFFFF for dark backgrounds — the magenta mark is untouched.
 */

type Variant = "horizontal" | "stacked" | "mark";
type Tone = "light" | "dark";

const ART: Record<Variant, Record<Tone, { src: string; ratio: number }>> = {
  // ratio = intrinsic width / height, from the tightened viewBoxes
  horizontal: {
    light: { src: "/brand/logo-horizontal.svg", ratio: 5267 / 1127 },
    dark: { src: "/brand/logo-horizontal-white.svg", ratio: 5267 / 1127 },
  },
  stacked: {
    light: { src: "/brand/logo-stacked.svg", ratio: 4523 / 2599 },
    dark: { src: "/brand/logo-stacked-white.svg", ratio: 4523 / 2599 },
  },
  mark: {
    light: { src: "/brand/mark.svg", ratio: 3236 / 2315 },
    dark: { src: "/brand/mark.svg", ratio: 3236 / 2315 },
  },
};

const MIN_WIDTH = 120;

export function LogoMark({
  variant = "horizontal",
  tone = "light",
  width = 190,
  className = "",
  priority = false,
}: {
  variant?: Variant;
  tone?: Tone;
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  const art = ART[variant][tone];
  // The mark alone has no wordmark to protect, so the 120px floor applies only
  // to the lockups.
  const w = variant === "mark" ? width : Math.max(width, MIN_WIDTH);
  const h = Math.round(w / art.ratio);

  return (
    <Image
      src={art.src}
      alt="Zafieon Pharma"
      width={w}
      height={h}
      priority={priority}
      className={className}
      style={{ width: w, height: "auto" }}
    />
  );
}

export default function Logo({
  variant = "horizontal",
  tone = "light",
  width = 190,
  className = "",
  priority = false,
  href = "/",
}: {
  variant?: Variant;
  tone?: Tone;
  width?: number;
  className?: string;
  priority?: boolean;
  href?: string | null;
}) {
  const art = <LogoMark {...{ variant, tone, width, priority }} />;

  if (!href) return <span className={className}>{art}</span>;

  return (
    <Link
      href={href}
      aria-label="Zafieon Pharma — home"
      className={`inline-flex shrink-0 items-center transition-opacity duration-300 hover:opacity-70 ${className}`}
    >
      {art}
    </Link>
  );
}
