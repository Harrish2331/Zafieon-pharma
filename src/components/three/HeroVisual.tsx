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
 * It carries the sculpture's composition, not an older one: the same diagonal,
 * the same violet body deepening toward the shoulders, granules rather than
 * dots, and the same printed lockup — literally the same baked texture, so the
 * mark cannot drift between the two states. Getting this wrong is what made
 * the phone look broken: it was still drawing an upright, blue-tinted capsule
 * with none of that.
 */
export function StaticForm() {
  const r2 = (n: number) => Number(n.toFixed(2));

  /* Granules, laid out deterministically so the server and the client agree.
     Pills rather than dots, at mixed angles, the way the sculpture fills. */
  const core = Array.from({ length: 54 }, (_, i) => {
    const a = i * 2.399963; // golden angle
    const t = i / 53;
    return {
      x: r2(260 + Math.cos(a) * (18 + 52 * Math.sin(t * Math.PI))),
      y: r2(178 + t * 288),
      rot: r2((a * 180) / Math.PI),
      w: r2(11 + 8 * Math.abs(Math.cos(a * 1.7))),
      h: r2(5.4 + 2.6 * Math.abs(Math.sin(a * 2.3))),
      o: r2(0.5 + 0.45 * Math.abs(Math.sin(a))),
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
          {/* The body: a warm violet that deepens toward the shoulders, which
              is the gradient the WebGL shell resolves to. */}
          <linearGradient id="zf-glass" x1="0.12" y1="0.02" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#fdf7fb" stopOpacity="0.96" />
            <stop offset="30%" stopColor="#efd7e8" stopOpacity="0.93" />
            <stop offset="66%" stopColor="#d9a9cb" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#a87ba6" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="zf-rim" x1="0" y1="0" x2="1" y2="0.7">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="48%" stopColor="#f0dcea" />
            <stop offset="100%" stopColor="#bf9bba" />
          </linearGradient>
          <radialGradient id="zf-bloom" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#e5188a" stopOpacity="0.4" />
            <stop offset="58%" stopColor="#e5188a" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#e5188a" stopOpacity="0" />
          </radialGradient>
          <clipPath id="zf-clip">
            <rect x="168" y="150" width="184" height="344" rx="92" />
          </clipPath>
        </defs>

        {/* Registers. Tilted, so they read as ellipses around the object. */}
        <g
          fill="none"
          stroke="#e5188a"
          transform="rotate(-24 260 320)"
        >
          <ellipse cx="260" cy="320" rx="196" ry="62" strokeOpacity="0.6" />
          <ellipse cx="260" cy="320" rx="238" ry="76" strokeOpacity="0.32" />
          <ellipse cx="260" cy="320" rx="280" ry="90" strokeOpacity="0.14" />
        </g>

        {/* The capsule itself, on the same diagonal the sculpture stands on. */}
        <g transform="rotate(-30 260 320)">
          <ellipse cx="260" cy="320" rx="146" ry="228" fill="url(#zf-bloom)" />

          <g clipPath="url(#zf-clip)">
            {core.map((p, i) => (
              <rect
                key={i}
                x={p.x - p.w / 2}
                y={p.y - p.h / 2}
                width={p.w}
                height={p.h}
                rx={p.h / 2}
                fill="#c2166f"
                opacity={p.o}
                transform={`rotate(${p.rot} ${p.x} ${p.y})`}
              />
            ))}
          </g>

          <rect
            x="168"
            y="150"
            width="184"
            height="344"
            rx="92"
            fill="url(#zf-glass)"
            stroke="url(#zf-rim)"
            strokeWidth="2.5"
          />

          {/* The printed lockup — the same baked artwork the sculpture uses,
              so the two states carry an identical mark. */}
          <image
            href="/brand/capsule-label.webp"
            x="212"
            y="176"
            width="96"
            height="292"
            preserveAspectRatio="xMidYMid meet"
            opacity="0.95"
          />

          {/* Specular along the shoulder. */}
          <path
            d="M204 244a62 62 0 0 1 25-52c10-7 18-4 14 6-9 22-15 47-17 73-1 14-12 16-16 4a90 90 0 0 1-6-31Z"
            fill="#ffffff"
            opacity="0.8"
          />
          <path
            d="M330 392c4 23 0 46-10 60-5 7-12 4-11-5 3-21 5-43 4-61 0-9 9-11 12-2 2 3 4 6 5 8Z"
            fill="#ffffff"
            opacity="0.32"
          />
        </g>
      </svg>
    </div>
  );
}
