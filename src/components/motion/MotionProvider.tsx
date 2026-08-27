"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reduced-motion is handled here, once, for the whole tree.
 *
 * `reducedMotion="user"` makes Framer drop transform and layout animations for
 * anyone who has asked for less motion, while leaving opacity alone. That is
 * the behaviour we want — content still fades in gently, nothing slides or
 * travels — and, critically, it does not require components to branch their
 * JSX on a media query. Branching was producing a server/client hydration
 * mismatch, because the server has no media query to read.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
