import type { ReactNode } from "react";
import AnimatedText from "@/components/motion/AnimatedText";
import Reveal from "@/components/motion/Reveal";

/**
 * The eyebrow: a short uppercase label preceded by a short magenta rule.
 * This pairing is the single most repeated brand signal in the layout, so it
 * lives in one place.
 */
export function Eyebrow({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-3 ${
        tone === "light" ? "text-navy/55" : "text-white/55"
      } ${className}`}
    >
      <span aria-hidden="true" className="h-px w-7 bg-magenta" />
      {children}
    </span>
  );
}

/**
 * Section headers are set as discrete lines so the mask reveal has something
 * to work with, and so line breaks are an art-direction decision rather than
 * an accident of viewport width.
 */
export default function SectionHeader({
  eyebrow,
  lines,
  body,
  tone = "light",
  align = "left",
  size = "display-2",
  className = "",
  children,
  accentLast = false,
}: {
  eyebrow?: string;
  lines: readonly string[];
  body?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  size?: "display-1" | "display-2" | "display-3";
  className?: string;
  children?: ReactNode;
  /** Sets the final line in magenta — used sparingly, for section closers. */
  accentLast?: boolean;
}) {
  const sizes = {
    "display-1": "text-[length:var(--text-display-1)]",
    "display-2": "text-[length:var(--text-display-2)]",
    "display-3": "text-[length:var(--text-display-3)]",
  };

  const rendered = lines.map((l, i) =>
    accentLast && i === lines.length - 1 ? (
      <span key={i} className="accent">
        {l}
      </span>
    ) : (
      l
    ),
  );

  return (
    <div
      className={`${align === "center" ? "text-center" : ""} ${className}`}
    >
      {eyebrow && (
        <Reveal y={14} duration={0.7}>
          <div
            className={`mb-7 ${align === "center" ? "flex justify-center" : ""}`}
          >
            <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
          </div>
        </Reveal>
      )}

      <AnimatedText
        as="h2"
        lines={rendered}
        className={`${sizes[size]} ${
          tone === "light" ? "text-navy" : "text-white"
        }`}
      />

      {body && (
        <Reveal delay={0.18} y={18}>
          <p
            className={`lede mt-8 max-w-[54ch] ${
              align === "center" ? "mx-auto" : ""
            } ${tone === "dark" ? "text-white/65" : ""}`}
          >
            {body}
          </p>
        </Reveal>
      )}

      {children}
    </div>
  );
}
