import type { CSSProperties, ReactNode } from "react";

/**
 * The house reveal, above the fold.
 *
 * Identical choreography to `<Reveal>` — content rises a short distance and
 * settles on the same expo-out curve — but expressed in CSS so it does not
 * wait on hydration.
 *
 * ── Why this exists rather than a prop on Reveal ───────────────────────────
 * Framer Motion server-renders its `initial` state. A `<Reveal>` therefore
 * ships as `opacity: 0` in the HTML and stays invisible until React hydrates
 * and an IntersectionObserver fires. Below the fold that is the correct
 * behaviour. At the top of the page it meant the hero copy did not paint until
 * 3.4s on a throttled connection, and LCP was measuring exactly that.
 *
 * So: `<Reveal>` for anything the reader scrolls to, `<CssRise>` for anything
 * in the first viewport. Both are server components' worth of markup; this one
 * ships no JavaScript at all.
 */
export default function CssRise({
  children,
  delay = 0,
  y = 20,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Seconds. Carried into CSS as `--d`. */
  delay?: number;
  /** Travel distance in pixels. */
  y?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section";
}) {
  return (
    <Tag
      className={`zaf-rise ${className}`}
      style={
        {
          "--d": `${delay}s`,
          "--rise-y": `${y}px`,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
