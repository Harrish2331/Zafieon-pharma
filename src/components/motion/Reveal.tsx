"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The house reveal. Quiet confidence: content rises a short distance and
 * settles on an expo-out curve. No bouncing, no scaling, no flying in.
 *
 * Reduced motion is not handled here — MotionProvider sets
 * `reducedMotion="user"` globally, which drops the transform and keeps the
 * fade. Branching the JSX on a media query would break hydration.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Reveal({
  children,
  delay = 0,
  y = 26,
  duration = 0.9,
  once = true,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "figure";
}) {
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px 0px -80px 0px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/** Parent that staggers its StaggerItem children. */
export function Stagger({
  children,
  className = "",
  delay = 0,
  step = 0.08,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  step?: number;
  once?: boolean;
}) {
  const parent: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: step, delayChildren: delay } },
  };

  return (
    <motion.div
      className={className}
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-70px 0px -70px 0px" }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

/** Child of <Stagger>. */
export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
