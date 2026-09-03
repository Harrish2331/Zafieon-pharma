"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const PrecisionForm = dynamic(() => import("./PrecisionForm"), {
  ssr: false,
  loading: () => <StaticForm />,
});

/**
 * Can this device afford the 3D scene?
 *
 * A pointer-capable viewport of reasonable width, real WebGL, and a device
 * reporting more than a token amount of memory. Everything else gets
 * StaticForm — the same composition drawn flat, so the art direction never
 * collapses.
 *
 * Reduced motion is deliberately NOT a gate: a user asking for less motion is
 * asking for less movement, not less design. PrecisionForm freezes instead.
 *
 * Returns false during server rendering, which is what we want — the server
 * always emits the flat form.
 */
function canAfford3D(): boolean {
  if (typeof window === "undefined") return false;

  if (!window.matchMedia("(min-width: 1024px)").matches) return false;
  if (!window.matchMedia("(pointer: fine)").matches) return false;

  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === "number" && mem < 4) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    return false;
  }

  try {
    const c = document.createElement("canvas");
    const gl =
      c.getContext("webgl2") ??
      c.getContext("webgl") ??
      c.getContext("experimental-webgl");
    if (!gl) return false;
  } catch {
    return false;
  }
  return true;
}

/**
 * The scene chunk is requested the moment this module is evaluated, which is
 * as early as the browser can possibly ask for it — during the main bundle's
 * evaluation, ahead of hydration.
 *
 * This is the whole fix for the flat capsule being visible on arrival. The
 * chunk is 237 KB of three.js and the scene takes a further ~800ms to build,
 * so the work has to start well before the opening lifts at 1.85s if the
 * visitor is never to see the flat form. Previously nothing was requested
 * until an effect had run after the 'load' event plus a 1.3s timer plus an
 * idle callback: the request went out at ~1.9s, landed at 2.3s and the canvas
 * appeared at 3.1s — 1.2s of watching the flat capsule, then a pop.
 *
 * Starting here instead overlaps the download and the parse with hydration and
 * with the opening, both of which are happening anyway, and puts the canvas up
 * behind the curtain.
 *
 * The old timer was justified in a comment claiming main-thread work during
 * the opening made it stutter. That was true of the Framer Motion overture it
 * was written for; the opening is now pure CSS on the compositor, with
 * 'contain: strict', and cannot be stuttered by anything happening here.
 */
const sceneChunk = canAfford3D() ? import("./PrecisionForm") : null;

export default function HeroVisual() {
  const host = useRef<HTMLDivElement>(null);
  const [enable3D, setEnable3D] = useState(false);
  /**
   * The flat form is kept mounted underneath for the length of the cross-fade,
   * then dropped so it stops costing a composited layer for the rest of the
   * visit.
   */
  const [retireFlat, setRetireFlat] = useState(false);

  useEffect(() => {
    if (!sceneChunk) return;
    let live = true;
    // Already in flight, and usually already resolved by the time this runs.
    sceneChunk.then(() => {
      if (live) setEnable3D(true);
    });
    return () => {
      live = false;
    };
  }, []);

  /**
   * The flat form holds at full opacity until the canvas is actually in the
   * DOM, not merely until React has been told to render it. Fading on
   * `enable3D` alone left roughly 300ms where the flat had gone and the scene
   * had not arrived, and the hero was very nearly empty — measured, and worse
   * than the pop it was meant to replace.
   */
  const [sceneUp, setSceneUp] = useState(false);

  useEffect(() => {
    if (!enable3D) return;
    let raf = 0;
    const look = () => {
      if (host.current?.querySelector("canvas")) setSceneUp(true);
      else raf = requestAnimationFrame(look);
    };
    raf = requestAnimationFrame(look);
    return () => cancelAnimationFrame(raf);
  }, [enable3D]);

  useEffect(() => {
    if (!sceneUp) return;
    const t = window.setTimeout(() => setRetireFlat(true), 900);
    return () => window.clearTimeout(t);
  }, [sceneUp]);

  return (
    // Promoted to its own composited layer. The flat fallback is a large SVG
    // with gradients; without this it is re-rasterised on every scroll frame,
    // which made the low-power path jankier than the WebGL one.
    <div
      ref={host}
      className="absolute inset-0 [backface-visibility:hidden] [transform:translateZ(0)]"
      aria-hidden="true"
    >
      {/* The two forms are the same composition — one drawn flat, one drawn in
          WebGL — so the handover reads as the object resolving rather than as
          one image being swapped for another.

          On a fast desktop this happens behind the opening and nobody sees it.
          It matters on slower machines, where three.js can still be building
          after the curtain has lifted: without the fade the flat capsule sat
          there and then popped, which is the artefact this was reported as. */}
      {!retireFlat ? (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            sceneUp ? "opacity-0" : "opacity-100"
          }`}
        >
          <StaticForm />
        </div>
      ) : null}

      {enable3D ? (
        <div className="absolute inset-0 zaf-hero-3d">
          <PrecisionForm />
        </div>
      ) : null}
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
