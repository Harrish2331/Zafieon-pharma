"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Masked line reveal for display typography.
 *
 * Each line sits in an overflow-hidden box; the inner span slides up from
 * beneath its own baseline so the type appears to be uncovered rather than to
 * move.
 *
 * Note on the observer: the inner span starts translated fully below its
 * clipping parent, which means it is never itself intersecting the viewport.
 * Observing it directly (via whileInView) therefore never fires. The trigger is
 * bound to the outer wrapper and pushed down through variants instead.
 *
 * Accessibility: the lines are real text in document order, so assistive tech
 * and crawlers read the complete headline regardless of animation state.
 */

const lineVariants: Variants = {
  hidden: { y: "115%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.05, delay: i, ease: EASE },
  }),
};

export default function AnimatedText({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  step = 0.09,
  as: Tag = "h2",
  once = true,
}: {
  lines: readonly (string | ReactNode)[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  step?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: "-60px 0px -60px 0px" });

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={`block overflow-hidden ${lineClassName}`}
          // A hair of vertical slack so descenders are not clipped by the mask.
          style={{ paddingBottom: "0.09em", marginBottom: "-0.09em" }}
        >
          <motion.span
            className="block will-change-transform"
            variants={lineVariants}
            custom={delay + i * step}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
