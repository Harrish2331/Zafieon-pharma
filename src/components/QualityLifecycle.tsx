"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { quality } from "@/data/site";

/**
 * One node on the rail. Extracted so the transform hooks are not called inside
 * a loop — each node owns its own subscription to the shared progress value.
 */
function Node({
  progress,
  at,
  base,
}: {
  progress: MotionValue<number>;
  at: number;
  base: string;
}) {
  const fill = useTransform(progress, (v) =>
    v >= at - 0.001 ? "#e5188a" : "rgba(0,0,0,0)",
  );
  const border = useTransform(progress, (v) =>
    v >= at - 0.001 ? "#e5188a" : "",
  );

  return (
    <motion.span
      aria-hidden="true"
      className={`block h-[19px] w-[19px] rounded-full border transition-colors ${base}`}
      style={{ backgroundColor: fill, borderColor: border }}
    />
  );
}

/**
 * The product lifecycle, drawn as a single measured line.
 *
 * The line is scroll-linked: it draws itself as the section passes through the
 * viewport, and each stage's node fills magenta as the line reaches it. The
 * line is the only animated element — the labels simply sit on it.
 *
 * Horizontal on desktop, vertical on mobile, both driven by the same data.
 */
export default function QualityLifecycle({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 55%"],
  });

  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const stages = quality.lifecycle;

  const railBase = tone === "light" ? "bg-line" : "bg-white/15";
  const label = tone === "light" ? "text-navy" : "text-white";
  const body = tone === "light" ? "text-muted" : "text-white/55";
  const idx = tone === "light" ? "text-muted-light" : "text-white/35";
  const dotBase =
    tone === "light" ? "border-line-strong bg-paper" : "border-white/25 bg-navy";

  return (
    <div ref={ref} className="relative">
      {/* ── Desktop: horizontal rail ─────────────────────────────── */}
      <div className="relative hidden lg:block">
        <div className={`absolute top-[9px] right-0 left-0 h-px ${railBase}`} />
        <motion.div
          style={{ scaleX: draw }}
          className="absolute top-[9px] right-0 left-0 h-px origin-left bg-magenta"
        />

        <ol className="relative grid grid-cols-6">
          {stages.map((s, i) => (
            <li key={s.id} className="pr-7">
              <Node progress={draw} at={i / (stages.length - 1)} base={dotBase} />
              <span className={`eyebrow mt-6 block ${idx}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className={`mt-3 text-[1.05rem] leading-[1.15] tracking-[0.005em] ${label}`}
              >
                {s.label}
              </h3>
              <p className={`mt-3 text-[0.85rem] leading-[1.6] ${body}`}>
                {s.description}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Mobile: vertical rail ────────────────────────────────── */}
      <div className="relative lg:hidden">
        <div className={`absolute top-2 bottom-2 left-[9px] w-px ${railBase}`} />
        <motion.div
          style={{ scaleY: draw }}
          className="absolute top-2 bottom-2 left-[9px] w-px origin-top bg-magenta"
        />

        <ol className="relative space-y-9">
          {stages.map((s, i) => (
            <li key={s.id} className="flex gap-5">
              <span
                aria-hidden="true"
                className={`mt-1.5 h-[19px] w-[19px] shrink-0 rounded-full border ${dotBase}`}
              />
              <div>
                <span className={`eyebrow block ${idx}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`mt-2 text-[1.05rem] leading-[1.15] ${label}`}>
                  {s.label}
                </h3>
                <p className={`mt-2 text-[0.875rem] leading-[1.6] ${body}`}>
                  {s.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
