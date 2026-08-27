"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * A figure that counts up once, when it first comes into view.
 *
 * Deliberately restrained: one pass, expo-out, no looping, no re-trigger on
 * scroll-back. Under reduced motion it simply renders the final value.
 *
 * The rendered text is always the padded final string for assistive tech —
 * the animation is presentational only, so a screen reader is never read a
 * stream of intermediate numbers.
 */
export default function Counter({
  value,
  pad = 2,
  duration = 1500,
  className = "",
}: {
  value: number;
  pad?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  const final = String(value).padStart(pad, "0");

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{String(n).padStart(pad, "0")}</span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
