"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const PrecisionForm = dynamic(() => import("./PrecisionForm"), {
  ssr: false,
  loading: () => <StaticForm />,
});

/**
 * Gate for the hero sculpture.
 *
 * The 3D scene loads only when it can pay for itself: a pointer-capable
 * viewport of reasonable width, real WebGL, and a device reporting more than a
 * token amount of memory. Everything else gets StaticForm — the same
 * composition drawn flat, so the art direction never collapses.
 *
 * Loading is deferred until after the load event AND the opening has cleared,
 * then to the first idle period. Parsing three.js and building the scene costs
 * roughly 1.8s of main-thread time in two long tasks — measured, not guessed —
 * and idle alone was not enough: the main thread goes idle right after
 * hydration, which is while the opening is still on screen. Anything expensive
 * landing there is exactly what made the opening feel like it stuttered.
 *
 * The fallback is already on screen throughout, so nothing is missing while
 * this waits.
 */
export default function HeroVisual() {
  const [enable3D, setEnable3D] = useState(false);

  useEffect(() => {
    // Reduced motion is deliberately NOT a gate — a user asking for less motion
    // is asking for less movement, not less design. PrecisionForm freezes.
    const wideEnough = window.matchMedia("(min-width: 1024px)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!wideEnough || !finePointer) return;

    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (typeof mem === "number" && mem < 4) return;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return;

    try {
      const c = document.createElement("canvas");
      const gl =
        c.getContext("webgl2") ??
        c.getContext("webgl") ??
        c.getContext("experimental-webgl");
      if (!gl) return;
    } catch {
      return;
    }

    let idleId: number | undefined;
    let timerId: number | undefined;

    const schedule = () => {
      const ric =
        window.requestIdleCallback ??
        ((cb: () => void) => window.setTimeout(cb, 200));
      idleId = ric(() => setEnable3D(true)) as unknown as number;
    };

    // After the page has finished loading and the opening has cleared, then at
    // the first idle moment after that. The 1.3s floor is the overture's 1.15s
    // plus margin.
    const start = () => {
      timerId = window.setTimeout(schedule, 1300);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      if (timerId !== undefined) window.clearTimeout(timerId);
      if (idleId !== undefined) {
        (window.cancelIdleCallback ?? window.clearTimeout)(idleId);
      }
    };
  }, []);

  return (
    // Promoted to its own composited layer. The flat fallback is a large SVG
    // with gradients; without this it is re-rasterised on every scroll frame,
    // which made the low-power path jankier than the WebGL one.
    <div
      className="absolute inset-0 [backface-visibility:hidden] [transform:translateZ(0)]"
      aria-hidden="true"
    >
      {enable3D ? <PrecisionForm /> : <StaticForm />}
    </div>
  );
}

/**
 * The flat counterpart — the same object drawn as one SVG so it costs nothing
 * on devices that should not be running WebGL. Same capsule, same suspended
 * core, same registers: the composition holds, it simply stops moving.
 */
export function StaticForm() {
  // Deterministic core particles — no randomness, so SSR and client agree.
  const r2 = (n: number) => Number(n.toFixed(2));
  const core = Array.from({ length: 34 }, (_, i) => {
    const a = i * 2.399963; // golden angle
    const t = i / 33;
    return {
      cx: r2(260 + Math.cos(a) * (26 + 44 * Math.sin(t * Math.PI))),
      cy: r2(196 + t * 250),
      r: r2(2.2 + 3.4 * Math.abs(Math.cos(a * 1.7))),
      o: r2(0.35 + 0.55 * Math.abs(Math.sin(a))),
    };
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 520 640"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <defs>
          <linearGradient id="zf-glass" x1="0.1" y1="0" x2="0.95" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="38%" stopColor="#e6edf7" stopOpacity="0.62" />
            <stop offset="72%" stopColor="#c3d2e8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8fa6c6" stopOpacity="0.62" />
          </linearGradient>
          <linearGradient id="zf-rim" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#dbe4f1" />
            <stop offset="100%" stopColor="#9db1cd" />
          </linearGradient>
          <radialGradient id="zf-core" cx="0.5" cy="0.42" r="0.6">
            <stop offset="0%" stopColor="#ff8ac6" />
            <stop offset="55%" stopColor="#e5188a" />
            <stop offset="100%" stopColor="#a80f64" />
          </radialGradient>
          <radialGradient id="zf-bloom" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#e5188a" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#e5188a" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#e5188a" stopOpacity="0" />
          </radialGradient>
          <clipPath id="zf-clip">
            <rect x="160" y="140" width="200" height="360" rx="100" />
          </clipPath>
        </defs>

        {/* Registers */}
        <g fill="none" stroke="#e5188a">
          <ellipse cx="260" cy="320" rx="196" ry="58" strokeOpacity="0.55" />
          <ellipse cx="260" cy="320" rx="236" ry="70" strokeOpacity="0.26" />
          <ellipse cx="260" cy="320" rx="278" ry="83" strokeOpacity="0.11" />
        </g>

        {/* Depth field */}
        <g fill="#14274b" opacity="0.4">
          {Array.from({ length: 46 }, (_, i) => {
            const a = i * 2.399963;
            const r = 200 + ((i * 37) % 150);
            return (
              <circle
                key={i}
                cx={r2(260 + Math.cos(a) * r * 0.98)}
                cy={r2(320 + Math.sin(a) * r * 0.42)}
                r={r2(1.1 + ((i * 7) % 3) * 0.5)}
              />
            );
          })}
        </g>

        {/* Bloom behind the core — a gradient rather than a blur filter, so it
            composites for free on the devices that take this path. */}
        <ellipse cx="260" cy="320" rx="150" ry="230" fill="url(#zf-bloom)" />

        {/* Suspended core, clipped to the capsule volume */}
        <g clipPath="url(#zf-clip)">
          {core.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="url(#zf-core)" opacity={p.o} />
          ))}
        </g>

        {/* Glass shell */}
        <rect
          x="160"
          y="140"
          width="200"
          height="360"
          rx="100"
          fill="url(#zf-glass)"
          stroke="url(#zf-rim)"
          strokeWidth="2.5"
        />
        {/* Specular */}
        <path
          d="M196 232a64 64 0 0 1 26-52c10-7 18-4 14 6-9 22-16 48-18 74-1 14-12 16-16 4a92 92 0 0 1-6-32Z"
          fill="#ffffff"
          opacity="0.85"
        />
        <path
          d="M330 380c4 24 0 48-10 62-5 7-12 4-11-5 3-22 5-44 4-63 0-9 9-11 12-2 2 3 4 6 5 8Z"
          fill="#ffffff"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}
