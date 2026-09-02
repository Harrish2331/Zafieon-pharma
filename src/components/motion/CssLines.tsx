import type { CSSProperties, ReactNode } from "react";

/**
 * Masked line reveal for display typography, above the fold.
 *
 * The CSS counterpart to `<AnimatedText>`: each line sits in an
 * overflow-hidden box and the inner span slides up from beneath its own
 * baseline, so the type appears to be uncovered rather than to move.
 *
 * ── Why it is not just AnimatedText ────────────────────────────────────────
 * `AnimatedText` starts each line translated 115% down — outside its mask, so
 * invisible — and only releases it once React has hydrated and an
 * IntersectionObserver has fired. For a headline the reader is already looking
 * at, that is a guaranteed delay on the most important element on the page.
 * Here the animation is CSS, runs on the compositor from the first frame, and
 * completes whether or not the JavaScript ever arrives.
 *
 * Accessibility is unchanged: the lines are real text in document order, so
 * assistive technology and crawlers read the complete headline regardless of
 * animation state.
 */
export default function CssLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  step = 0.09,
  as: Tag = "h2",
}: {
  lines: readonly (string | ReactNode)[];
  className?: string;
  lineClassName?: string;
  /** Seconds before the first line moves. */
  delay?: number;
  /** Seconds between lines. */
  step?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className={`zaf-line ${lineClassName}`}>
          <span style={{ "--d": `${delay + i * step}s` } as CSSProperties}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
