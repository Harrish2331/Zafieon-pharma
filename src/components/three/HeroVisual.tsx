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

  /* Width and pointer type are NOT gates any more.
     They were, and the effect was that a phone got the flat fallback — a
     capsule with none of the sculpture's tilt, granules or print. That reads
     as a broken visual rather than as a considered fallback, which is exactly
     how it was reported. Capability is still gated, on the three things that
     actually predict whether the scene will run: real WebGL, enough cores and
     enough memory. A phone that clears those runs it; one that does not gets
     StaticForm, which now carries the same composition. */

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
const eligible = canAfford3D();

/** Touch devices, which pay far more for the same work. */
const coarse =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

/**
 * On a pointer device the chunk is requested at module evaluation — the
 * earliest the browser can be asked — because the opening is covering the
 * hero and the scene has to be up before the curtain lifts.
 *
 * A phone is a different trade. Parsing three.js and building the scene costs
 * 1.3-2.9s of blocking on a throttled handset, measured, and doing it during
 * first paint delays the copy the visitor actually came to read. So on touch
 * it waits for the load event and then for an idle moment. StaticForm holds
 * the frame meanwhile and carries the same composition, so the wait shows a
 * considered image rather than a placeholder.
 */
function requestScene(): Promise<unknown> | null {
  if (!eligible) return null;
  if (!coarse) return import("./PrecisionForm");

  return new Promise((resolve) => {
    const go = () => {
      const ric =
        window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      ric(() => resolve(import("./PrecisionForm")));
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  });
}

const sceneChunk = requestScene();

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
 * on devices that should not be running WebGL, and so a phone has something
 * considered to look at while three.js is still arriving.
 *
 * It carries the sculpture's composition, drawn to the same reference: about
 * ten degrees off vertical, a navy core inset inside a frosted pink shell so
 * the glass band follows the domes, magenta beads set into the navy, flatter
 * registers, and the same baked print — literally the same texture, so the
 * mark cannot drift between the two states.
 */
export function StaticForm() {
  const r2 = (n: number) => Number(n.toFixed(2));

  /* Beads laid out deterministically so the server and the client agree, over
     the core's face: denser toward the silhouette, the way a filled capsule
     reads when its edges are seen side-on. */
  const beads = Array.from({ length: 70 }, (_, i) => {
    const a = i * 2.399963; // golden angle
    const t = i / 69;
    const across = Math.sin(a) * (0.35 + 0.65 * Math.abs(Math.cos(a * 0.7)));
    return {
      x: r2(260 + across * 70),
      y: r2(160 + t * 320),
      rot: r2((a * 180) / Math.PI),
      w: r2(13 + 6 * Math.abs(Math.cos(a * 1.7))),
      h: r2(9 + 3 * Math.abs(Math.sin(a * 2.3))),
      o: r2(0.55 + 0.4 * Math.abs(Math.sin(a))),
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
          {/* Frosted pink shell: clear enough in the middle to show the navy
              core, milkier toward the domes and the edges. */}
          <linearGradient id="zf-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f0b9d8" stopOpacity="0.9" />
            <stop offset="18%" stopColor="#f6dcea" stopOpacity="0.42" />
            <stop offset="50%" stopColor="#f7e4ee" stopOpacity="0.22" />
            <stop offset="82%" stopColor="#f6dcea" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#ec9fcb" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="zf-ends" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7e4ee" stopOpacity="0.55" />
            <stop offset="20%" stopColor="#f7e4ee" stopOpacity="0" />
            <stop offset="78%" stopColor="#f07ab8" stopOpacity="0" />
            <stop offset="100%" stopColor="#f07ab8" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="zf-core" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2c3558" />
            <stop offset="45%" stopColor="#1b2446" />
            <stop offset="100%" stopColor="#141b36" />
          </linearGradient>
          <clipPath id="zf-core-clip">
            <rect x="190" y="160" width="140" height="320" rx="70" />
          </clipPath>
        </defs>

        {/* Registers — flat ellipses, right side a little raised. */}
        <g fill="none" stroke="#e5188a" transform="rotate(-12 260 320)">
          <ellipse cx="260" cy="320" rx="181" ry="85" strokeOpacity="0.7" />
          <ellipse cx="260" cy="320" rx="218" ry="102" strokeOpacity="0.38" />
          <ellipse cx="260" cy="320" rx="260" ry="122" strokeOpacity="0.17" />
        </g>

        {/* The capsule, about ten degrees off vertical, top to the left. */}
        <g transform="rotate(-12 260 320)">
          {/* Navy core, concentric with the shell. */}
          <rect x="190" y="160" width="140" height="320" rx="70" fill="url(#zf-core)" />
          <g clipPath="url(#zf-core-clip)">
            {beads.map((p, i) => (
              <rect
                key={i}
                x={p.x - p.w / 2}
                y={p.y - p.h / 2}
                width={p.w}
                height={p.h}
                rx={p.h / 2}
                fill="#c53a95"
                opacity={p.o}
                transform={`rotate(${p.rot} ${p.x} ${p.y})`}
              />
            ))}
          </g>

          {/* Shell. */}
          <rect
            x="168"
            y="125"
            width="184"
            height="390"
            rx="92"
            fill="url(#zf-glass)"
            stroke="#ec9fcb"
            strokeOpacity="0.85"
            strokeWidth="2.5"
          />
          <rect x="168" y="125" width="184" height="390" rx="92" fill="url(#zf-ends)" />

          {/* The printed lockup — the same baked artwork the sculpture uses. */}
          <image
            href="/brand/capsule-label.webp"
            x="206"
            y="155"
            width="108"
            height="330"
            preserveAspectRatio="xMidYMid meet"
            opacity="0.97"
          />

          {/* Highlight high on the left shoulder. */}
          <path
            d="M196 214a70 70 0 0 1 28-58c11-8 20-4 15 7-10 24-16 52-18 81-1 15-13 17-18 4a100 100 0 0 1-7-34Z"
            fill="#ffffff"
            opacity="0.75"
          />
        </g>
      </svg>
    </div>
  );
}
