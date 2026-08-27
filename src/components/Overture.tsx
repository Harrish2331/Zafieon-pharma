"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import InlineLockup from "@/components/InlineLockup";

const KEY = "zaf-overture";
const EASE = [0.76, 0, 0.24, 1] as const; // in-out expo: weighted, deliberate
const OUT = [0.16, 1, 0.3, 1] as const;

/**
 * The opening.
 *
 * A capsule closes over the viewport, the mark registers inside it, then the
 * capsule parts along the logo's own 45° diagonal and the two halves sweep away
 * to reveal the site.
 *
 * The diagonal is not decorative — it is the axis of the Zafieon mark, the
 * "tube/capsule pill" the brand guidelines describe. Splitting along it means
 * the reveal is the logo's geometry performed at full-screen scale.
 *
 * Rules it obeys:
 *  · ~1.6s total, then it is gone.
 *  · Once per session, not once per navigation.
 *  · Purely an overlay — the page underneath renders and is interactive
 *    immediately, so nothing about this blocks loading or LCP.
 *  · Reduced motion or a repeat visit: never mounted at all.
 */
export default function Overture() {
  const reduced = useReducedMotion();
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (sessionStorage.getItem(KEY) === "1") return;
    sessionStorage.setItem(KEY, "1");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlay(true);
  }, [reduced]);

  // Lock scroll only while the curtain is actually up.
  useEffect(() => {
    if (!play) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => setPlay(false), 1750);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [play]);

  return (
    <AnimatePresence>
      {play && (
        <motion.div
          key="overture"
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[300]"
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          {/* Upper-left half — parts along the diagonal and leaves up-left. */}
          <motion.div
            className="navy-field absolute inset-0"
            style={{ clipPath: "polygon(-20% -20%, 140% -20%, -20% 140%)" }}
            initial={{ x: 0, y: 0 }}
            animate={{ x: "-58%", y: "-58%" }}
            transition={{ duration: 0.95, delay: 0.78, ease: EASE }}
          />
          {/* Lower-right half — the mirror. */}
          <motion.div
            className="navy-field absolute inset-0"
            style={{ clipPath: "polygon(140% -20%, 140% 140%, -20% 140%)" }}
            initial={{ x: 0, y: 0 }}
            animate={{ x: "58%", y: "58%" }}
            transition={{ duration: 0.95, delay: 0.78, ease: EASE }}
          />

          {/* The hairline the halves part along. */}
          <motion.div
            className="absolute top-1/2 left-1/2 h-px w-[220vmax] origin-center bg-magenta"
            style={{ transform: "translate(-50%,-50%) rotate(-45deg)" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1, 1],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.4,
              times: [0, 0.5, 1],
              delay: 0.42,
              ease: OUT,
            }}
          />

          {/* Registration: the full lockup resolves, holds, then clears just
              ahead of the split — so the identity is what the viewer is left
              with, not a shape they had to decode. */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -6] }}
            transition={{
              duration: 1.2,
              times: [0, 0.22, 0.72, 1],
              ease: OUT,
            }}
          >
            <InlineLockup className="h-auto w-[min(300px,62vw)]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
