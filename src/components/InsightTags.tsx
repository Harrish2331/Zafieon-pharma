import type { InsightTag } from "@/data/types";

/**
 * Article category tags.
 *
 * Rendered as a list rather than a row of divs so the set is announced as a
 * set, and kept visually quiet — they are a wayfinding aid on an index of four
 * pieces, not a taxonomy the reader has to work through.
 */
export default function InsightTags({
  tags,
  tone = "light",
  className = "",
}: {
  tags: readonly InsightTag[];
  tone?: "light" | "dark";
  className?: string;
}) {
  if (!tags.length) return null;
  const dark = tone === "dark";

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((t) => (
        <li
          key={t}
          className={`border px-3 py-1.5 text-[0.6rem] font-semibold tracking-[0.14em] uppercase ${
            dark
              ? "border-white/20 text-white/65"
              : "border-line-strong text-muted"
          }`}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
