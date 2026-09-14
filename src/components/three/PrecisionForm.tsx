"use client";
/* eslint-disable react-hooks/immutability */

/*
 * three.js is an imperative external system. `useFrame` runs on the render
 * loop, outside React's render phase, and mutating the scene graph and the
 * camera there is the documented way to drive it. Geometry and materials are
 * built once inside useMemo and disposed on unmount.
 */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/**
 * "Suspension" — the hero sculpture, built to Zafieon's reference render.
 *
 * What the reference shows, and what this reproduces:
 *  · a near-upright capsule, roughly twelve degrees off vertical;
 *  · a NAVY CORE at the centre, concentric with the shell and softened at its
 *    edge, so it follows the domes rather than stopping at a flat line;
 *  · oblong magenta beads packed round that core, lying across the capsule,
 *    dense enough that the navy shows between them;
 *  · thick frosted pink glass — an inner wall inset from the outer skin — with
 *    a bright rim, a soft highlight high on the left and a pink glow toward
 *    the base;
 *  · the identity printed down the front, and flat magenta registers that the
 *    glass frosts where they pass through the capsule.
 *
 * ── Why the glass is not a transmissive material any more ────────────────────
 * MeshPhysicalMaterial transmission renders the whole scene a second time,
 * every frame, into a buffer the glass then samples — a full extra pass that
 * scales with canvas pixels, which is exactly what a phone cannot afford. It
 * also blurred the interior into streaks, where the reference shows separate
 * beads in a navy body.
 *
 * The shell is now two layers drawn over the interior: an inner wall (the
 * back faces of a slightly smaller capsule) and the outer skin (front faces),
 * each shaded by a small fresnel shader. That reads as thick frosted glass —
 * edges bright, centre clear enough to see the core — for a fraction of the
 * cost, and shows the interior with the clarity the reference has.
 *
 * Budget:
 *  · Draw calls: field, core, beads (one InstancedMesh), inner wall, outer
 *    skin, print, three registers. No render-to-texture of any kind.
 *  · Bead matrices are written ONCE. The core and beads turn as one group —
 *    one transform per frame, not one matrix rebuild per bead.
 *  · Two directional lights and an ambient; no point lights.
 *  · Environment generated on a 2D canvas at runtime, no network.
 *  · Everything created here is disposed on unmount, so leaving and returning
 *    to the homepage does not accumulate GPU memory.
 */

/** The reference stands the capsule roughly twelve degrees off vertical. */
const TILT = 0.22;

/** Touch devices get fewer segments and beads — same composition. Read once at
    module scope: this file is only ever imported with `ssr: false`. */
const COARSE =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

const NAVY = "#14274b";
const MAGENTA = "#e5188a";

/** Shell: radius and cylinder length. Half-length of the whole capsule is
    SHELL_L / 2 + SHELL_R. */
const SHELL_R = 0.76;
const SHELL_L = 1.7;
/** Navy core, concentric with the shell and well inset: it is the dark
    centre the beads are seen against, and the band between it and the shell
    is where the beads sit. */
const CORE_R = 0.58;
const CORE_L = 1.42;
/** The glass has visible thickness: its inner wall sits this far inside the
    outer skin, and no bead may cross it. */
const WALL = 0.055;

/** Deterministic, so the bead layout is the same on every visit. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------------------------------------------------------------------
   Studio environment, generated rather than downloaded — a soft horizon, one
   bright key and a magenta bounce, for the core and beads to reflect.
   ------------------------------------------------------------------------- */
function useStudioEnv() {
  const { gl } = useThree();
  const env = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = COARSE ? 128 : 256;
    c.height = COARSE ? 64 : 128;
    const ctx = c.getContext("2d")!;
    const k = c.width / 256;

    const g = ctx.createLinearGradient(0, 0, 0, c.height);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.45, "#f1eef6");
    g.addColorStop(0.7, "#d9c3de");
    g.addColorStop(1, "#6f5b86");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);

    const key = ctx.createRadialGradient(70 * k, 24 * k, 2, 70 * k, 24 * k, 58 * k);
    key.addColorStop(0, "rgba(255,255,255,1)");
    key.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = key;
    ctx.fillRect(0, 0, c.width, c.height);

    const fill = ctx.createRadialGradient(200 * k, 98 * k, 2, 200 * k, 98 * k, 70 * k);
    fill.addColorStop(0, "rgba(229,24,138,0.6)");
    fill.addColorStop(1, "rgba(229,24,138,0)");
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, c.width, c.height);

    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(gl);
    const out = pmrem.fromEquirectangular(tex).texture;
    pmrem.dispose();
    tex.dispose();
    return out;
  }, [gl]);

  useEffect(() => () => env.dispose(), [env]);
  return env;
}

/* ---------------------------------------------------------------------------
   The interior: a navy core with the beads packed round it, turning together.

   The navy is the backdrop, not a surface the beads are painted on. In the
   reference the beads fill the body in front of a dark centre — larger
   oblong pills lying across the capsule, dense enough that the navy shows
   between them. Beads scattered thinly over an opaque core read as polka dots
   instead, which is what the first pass of this looked like.
   ------------------------------------------------------------------------- */
function Interior({ env, still }: { env: THREE.Texture; still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const beads = useRef<THREE.InstancedMesh>(null);
  const COUNT = COARSE ? 130 : 200;

  const coreGeo = useMemo(
    () => new THREE.CapsuleGeometry(CORE_R, CORE_L, COARSE ? 8 : 12, COARSE ? 24 : 36),
    [],
  );
  const coreMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: "#1c2446",
      roughness: 0.62,
      metalness: 0.05,
      envMap: env,
      envMapIntensity: 0.5,
      transparent: true,
    });
    /* Soften the silhouette. Seen through thick glass the navy has no hard
       edge in the reference; opaque, it read as a flat dark slab. Opacity
       falls away only where the surface turns from the camera — the face of
       the core stays solid — so the beads behind it stay hidden. */
    m.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        "diffuseColor.a *= smoothstep(0.04, 0.62, abs(normal.z));\n#include <opaque_fragment>",
      );
    };
    return m;
  }, [env]);

  /* A pill about three times as long as it is thick — the reference beads.
     Desktop carries enough segments that the outline stays smooth at a 2x
     display; phones keep the low count, where triangle count is the budget. */
  const beadGeo = useMemo(
    () => new THREE.CapsuleGeometry(1, 0.8, COARSE ? 2 : 4, COARSE ? 8 : 14),
    [],
  );
  const beadMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff", // tinted per instance
        emissive: new THREE.Color("#4a0931"),
        emissiveIntensity: 0.22,
        roughness: 0.3,
        metalness: 0.02,
        envMap: env,
        envMapIntensity: 1,
      }),
    [env],
  );

  // Placement, written once.
  useLayoutEffect(() => {
    const mesh = beads.current;
    if (!mesh) return;
    const rand = rng(20260914);
    const dummy = new THREE.Object3D();
    const deep = new THREE.Color("#6e1a58");
    const base = new THREE.Color("#ad2a86");
    const light = new THREE.Color("#d765b1");
    const col = new THREE.Color();
    const v = new THREE.Vector3();
    const halfCore = CORE_L / 2;
    const reach = SHELL_R - WALL - 0.01;

    for (let i = 0; i < COUNT; i++) {
      const s = 0.046 + rand() * 0.024;
      const halfLen = s * 1.4;

      /* Uniform in the band between the core and the shell, domes included:
         sample the shell's volume and reject what falls inside the core. */
      let cy = 0;
      for (let k = 0; k < 40; k++) {
        v.set(
          (rand() * 2 - 1) * reach,
          (rand() * 2 - 1) * (halfCore + reach),
          (rand() * 2 - 1) * reach,
        );
        cy = Math.max(-halfCore, Math.min(halfCore, v.y));
        const d = Math.hypot(v.x, v.y - cy, v.z);
        if (d <= reach && d >= CORE_R - 0.03) break;
      }
      // Keep the bead's tips inside the shell whatever way it lies.
      v.y -= cy;
      const lim = SHELL_R - WALL - 0.015 - halfLen;
      if (v.length() > lim) v.setLength(lim);
      const out = v.length();
      dummy.position.set(v.x, v.y + cy, v.z);

      // Lying across the capsule, at an easy angle, facing every way round.
      dummy.rotation.set(
        Math.PI / 2 + (rand() - 0.5) * 0.9,
        rand() * Math.PI * 2,
        (rand() - 0.5) * 0.6,
        "YXZ",
      );
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      /* Beads close to the navy read darker, beads out toward the glass catch
         the light — the cue that the fill has depth. */
      const t = THREE.MathUtils.clamp((out - (CORE_R - 0.03)) / Math.max(0.01, lim - CORE_R + 0.03), 0, 1);
      col.copy(deep).lerp(base, t);
      if (rand() > 0.74) col.lerp(light, 0.5);
      mesh.setColorAt(i, col);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [COUNT]);

  useEffect(
    () => () => {
      coreGeo.dispose();
      coreMat.dispose();
      beadGeo.dispose();
      beadMat.dispose();
    },
    [coreGeo, coreMat, beadGeo, beadMat],
  );

  useFrame((_, delta) => {
    if (still || !group.current) return;
    group.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={group}>
      <mesh geometry={coreGeo} material={coreMat} renderOrder={1} />
      <instancedMesh ref={beads} args={[beadGeo, beadMat, COUNT]} />
    </group>
  );
}

/* ---------------------------------------------------------------------------
   The shell — frosted glass as two fresnel layers over the opaque interior.
   ------------------------------------------------------------------------- */
const SHELL_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vP;
  void main() {
    vP = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const SHELL_FRAG = /* glsl */ `
  uniform vec3 uTint;
  uniform vec3 uRim;
  uniform vec3 uGlow;
  uniform vec3 uKey;
  uniform float uInner;
  uniform float uHalf;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vP;
  void main() {
    vec3 N = normalize(vN);
    if (uInner > 0.5) N = -N;
    vec3 V = normalize(vV);
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float fres = pow(1.0 - ndv, 2.3);

    vec3 H = normalize(uKey + V);
    float nh = clamp(dot(N, H), 0.0, 1.0);
    float spec = pow(nh, 38.0);
    float sheen = pow(nh, 6.0);

    // Milky toward both domes, and a pink glow gathering at the base.
    float ends = smoothstep(uHalf * 0.5, uHalf, abs(vP.y));
    float base = smoothstep(uHalf * 0.15, uHalf, -vP.y);

    vec3 col = mix(uTint, uRim, fres);
    col = mix(col, uGlow, base * 0.75);
    float rim = fres * clamp(dot(N, uKey) * 0.5 + 0.5, 0.0, 1.0);
    col += spec * 0.5 + sheen * 0.1 + rim * 0.35;

    float a = uInner > 0.5
      ? 0.12 + 0.46 * fres
      : 0.42 + 0.46 * fres + ends * 0.14 + base * 0.2;
    a = clamp(a + spec * 0.35 + rim * 0.12, 0.0, 0.94);

    gl_FragColor = vec4(col, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Shell() {
  const geo = useMemo(
    () => new THREE.CapsuleGeometry(SHELL_R, SHELL_L, COARSE ? 10 : 14, COARSE ? 36 : 56),
    [],
  );
  /* The inner wall is its own, slightly smaller capsule — concentric, so the
     wall has an even thickness that follows the domes. Drawing it on the same
     surface as the skin gave glass with no thickness at all. */
  const wallGeo = useMemo(
    () =>
      new THREE.CapsuleGeometry(SHELL_R - WALL, SHELL_L, COARSE ? 10 : 14, COARSE ? 36 : 56),
    [],
  );
  const [inner, outer] = useMemo(() => {
    const make = (isInner: boolean) =>
      new THREE.ShaderMaterial({
        vertexShader: SHELL_VERT,
        fragmentShader: SHELL_FRAG,
        transparent: true,
        depthWrite: false,
        side: isInner ? THREE.BackSide : THREE.FrontSide,
        uniforms: {
          uTint: { value: new THREE.Color(isInner ? "#e0b8d4" : "#e9cce0") },
          uRim: { value: new THREE.Color("#e59ac8") },
          uGlow: { value: new THREE.Color("#f07ab8") },
          // Key light high on the left, where the reference catches its highlight.
          uKey: { value: new THREE.Vector3(-0.55, 0.72, 0.42).normalize() },
          uInner: { value: isInner ? 1 : 0 },
          uHalf: { value: SHELL_L / 2 + SHELL_R },
        },
      });
    return [make(true), make(false)];
  }, []);

  useEffect(
    () => () => {
      geo.dispose();
      wallGeo.dispose();
      inner.dispose();
      outer.dispose();
    },
    [geo, wallGeo, inner, outer],
  );

  return (
    <>
      <mesh geometry={wallGeo} material={inner} renderOrder={2} />
      <mesh geometry={geo} material={outer} renderOrder={3} />
    </>
  );
}

/* ---------------------------------------------------------------------------
   The printed lockup — the supplied artwork, baked by tools/capsulelabel.mjs,
   on an open band a hair proud of the shell and centred on the face that meets
   the camera (three's cylinder puts theta = 0 at +Z).
   ------------------------------------------------------------------------- */
function Label() {
  const [map, setMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let live = true;
    let loaded: THREE.Texture | null = null;
    new THREE.TextureLoader().load("/brand/capsule-label.webp", (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      loaded = t;
      if (live) setMap(t);
      else t.dispose();
    });
    return () => {
      live = false;
      loaded?.dispose();
    };
  }, []);

  const SPAN = 1.15;
  const geo = useMemo(
    () =>
      new THREE.CylinderGeometry(
        SHELL_R + 0.012, SHELL_R + 0.012, 1.78, COARSE ? 18 : 28, 1, true, -SPAN / 2, SPAN,
      ),
    [],
  );
  useEffect(() => () => geo.dispose(), [geo]);

  if (!map) return null;
  return (
    <mesh geometry={geo} renderOrder={4}>
      <meshBasicMaterial
        map={map}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------------------------
   The surrounding depth field — one Points cloud, turned as a whole.
   ------------------------------------------------------------------------- */
function Field({ still }: { still: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const COUNT = COARSE ? 180 : 360;

  const geo = useMemo(() => {
    const rand = rng(7);
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.6 + Math.pow(rand(), 0.5) * 4.4;
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.85;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 1.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [COUNT]);

  /* Round dots. A PointsMaterial with no map draws squares, which read as
     pixels at this size; the reference field is soft round points. A 32px
     disc, generated once. */
  const dot = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.6, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(c);
  }, []);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(NAVY),
        size: 0.05,
        sizeAttenuation: true,
        map: dot,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    [dot],
  );

  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
      dot.dispose();
    },
    [geo, mat, dot],
  );

  useFrame((_, delta) => {
    if (still || !ref.current) return;
    ref.current.rotation.y += delta * 0.022;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ---------------------------------------------------------------------------
   Hairline registers. Flatter than before — the reference ellipses are a
   little under half as tall as they are wide — and drawn BEFORE the glass, so
   where they pass through the capsule the frost takes them, and they read
   crisply only outside its silhouette, as they do in the reference.
   ------------------------------------------------------------------------- */
function Registers({ still }: { still: boolean }) {
  const g = useRef<THREE.Group>(null);
  const rings = useMemo(
    () => [
      { r: 1.5, o: 0.7 },
      { r: 1.82, o: 0.38 },
      { r: 2.16, o: 0.17 },
    ],
    [],
  );
  const geos = useMemo(
    () => rings.map((x) => new THREE.TorusGeometry(x.r, 0.0055, 4, COARSE ? 96 : 144)),
    [rings],
  );
  const mats = useMemo(
    () =>
      rings.map(
        (x) =>
          new THREE.MeshBasicMaterial({
            color: MAGENTA,
            transparent: true,
            opacity: x.o,
            depthWrite: false,
          }),
      ),
    [rings],
  );

  useEffect(
    () => () => {
      geos.forEach((x) => x.dispose());
      mats.forEach((x) => x.dispose());
    },
    [geos, mats],
  );

  useFrame((_, delta) => {
    if (still || !g.current) return;
    g.current.rotation.z -= delta * 0.04;
  });

  return (
    <group rotation={[0, 0, 0.12]}>
      <group ref={g} rotation={[Math.PI / 2 - 0.49, 0, 0]}>
        {geos.map((geo, i) => (
          <mesh key={i} geometry={geo} material={mats[i]} renderOrder={0} />
        ))}
      </group>
    </group>
  );
}

/* ---------------------------------------------------------------------------
   Scene
   ------------------------------------------------------------------------- */
function Scene({
  pointer,
  still,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  still: boolean;
}) {
  const env = useStudioEnv();
  const lean = useRef<THREE.Group>(null);
  const entrance = useRef(0);
  const { camera, size } = useThree();

  /**
   * Frame the capsule to whatever box it is given. On touch the hero box is
   * short and wide, so the camera distance is solved to put the capsule at a
   * set fraction of the tighter axis. The desktop framing is the art direction
   * and is left alone. R is the capsule's projected half-extent at the new,
   * more upright tilt.
   */
  useEffect(() => {
    if (!COARSE) return;
    const halfV = Math.tan((32 * Math.PI) / 180 / 2);
    const aspect = size.width / Math.max(1, size.height);
    const R = 1.74;
    const FILL = 0.86;
    const d = aspect >= 1 ? R / (FILL * halfV) : R / (FILL * halfV * aspect);
    camera.position.z = Math.min(9.5, Math.max(4.8, d));
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((state, delta) => {
    if (entrance.current < 1)
      entrance.current = Math.min(1, entrance.current + delta * 0.85);
    const e = 1 - Math.pow(1 - entrance.current, 3);

    if (!lean.current) return;
    lean.current.scale.setScalar(0.93 + 0.07 * e);

    if (still) {
      lean.current.rotation.set(0.08, -0.18, TILT);
      return;
    }

    const p = pointer.current ?? { x: 0, y: 0 };
    lean.current.rotation.x = THREE.MathUtils.lerp(lean.current.rotation.x, 0.08 - p.y * 0.2, 0.05);
    lean.current.rotation.y = THREE.MathUtils.lerp(lean.current.rotation.y, p.x * 0.34, 0.05);
    lean.current.rotation.z = THREE.MathUtils.lerp(lean.current.rotation.z, TILT + p.x * 0.04, 0.05);
    lean.current.position.y = Math.sin(state.clock.elapsedTime * 0.42) * 0.07;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, p.x * 0.55, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.15 - p.y * 0.4, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.42} />
      {/* Key, high on the left — where the reference catches its highlight. */}
      <directionalLight position={[-4, 6, 5]} intensity={2} />
      {/* Warm magenta fill from low right, for the beads' lower edges. */}
      <directionalLight position={[5, -3, 3]} intensity={0.8} color="#ffb3dc" />

      <Field still={still} />

      <group ref={lean} rotation={[0.08, 0, TILT]}>
        <Interior env={env} still={still} />
        <Shell />
        <Label />
        <Registers still={still} />
      </group>
    </>
  );
}

export default function PrecisionForm() {
  const pointer = useRef({ x: 0, y: 0 });
  const still = useReducedMotion() ?? false;
  /* Read during the first render: this module is imported with `ssr: false`,
     so there is no server pass to disagree with, and reading it late would
     mean a frame at the desktop DPR on a phone. */
  const [coarse] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop drawing once the hero scrolls away, so the rest of the page scrolls
  // without a WebGL context rendering behind it.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={host}
      className="h-full w-full"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current = {
          x: ((e.clientX - r.left) / r.width) * 2 - 1,
          y: ((e.clientY - r.top) / r.height) * 2 - 1,
        };
      }}
      onPointerLeave={() => (pointer.current = { x: 0, y: 0 })}
    >
      <Canvas
        /* Phones report a DPR of 3; the canvas is capped well under that. With
           no transmission pass the scene costs far less per pixel, but on a
           weak GPU pixels are still the budget, so the cap stays at 1.25. */
        dpr={coarse ? [1, 1.25] : [1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          stencil: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0.15, 8.2], fov: 32 }}
        frameloop={visible && !still ? "always" : "demand"}
        style={{ background: "transparent" }}
      >
        <Scene pointer={pointer} still={still} />
      </Canvas>
    </div>
  );
}
