"use client";
/* eslint-disable react-hooks/purity, react-hooks/immutability */

/*
 * three.js is an imperative external system. `useFrame` runs on the render
 * loop, outside React's render phase, and mutating the scene graph and the
 * camera there is the documented way to drive it. The one-time Math.random()
 * seeds sit inside useMemo and are intentionally stable for the component's
 * lifetime. Rewriting this to satisfy the compiler's purity model would mean
 * allocating every frame — the opposite of what these rules exist to protect.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/**
 * "Suspension" — the hero sculpture.
 *
 * A glass capsule holding a luminous core of suspended particles, inside a
 * sparse depth field, framed by hairline measurement rings.
 *
 * This is NOT the Zafieon logo in 3D — the official logo stays a flat, supplied
 * 2D asset everywhere on the site. What the object borrows is the brand's own
 * geometric grammar: the capsule form the guidelines describe as the "tube pill",
 * and the magenta accent used exactly once, at the centre, as the active
 * substance.
 *
 * Interaction: the assembly leans toward the cursor and the camera parallaxes
 * against it, so the object has real depth rather than a flat tilt.
 *
 * Budget:
 *  · One transmissive surface only, rendered at half resolution.
 *  · Core is a single InstancedMesh; the field is one Points cloud.
 *  · Environment is generated on a 2D canvas at runtime — no HDR fetch, no
 *    network, no external asset.
 *  · No postprocessing. DPR capped. Reduced motion freezes rather than removes.
 */

const NAVY = "#14274b";
const MAGENTA = "#e5188a";

/* ---------------------------------------------------------------------------
   A studio environment, generated rather than downloaded. Glass needs
   something to refract; this gives it a soft horizon and one bright key.
   ------------------------------------------------------------------------- */
function useStudioEnv() {
  const { gl } = useThree();
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext("2d")!;

    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.42, "#eef3fa");
    g.addColorStop(0.66, "#c8d5e8");
    g.addColorStop(1, "#5f72a0");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 128);

    // Key light — the highlight that runs along the capsule's shoulder.
    const key = ctx.createRadialGradient(186, 26, 2, 186, 26, 62);
    key.addColorStop(0, "rgba(255,255,255,1)");
    key.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = key;
    ctx.fillRect(0, 0, 256, 128);

    // Magenta bounce, low and left, so the glass picks up the brand accent.
    const fill = ctx.createRadialGradient(52, 96, 2, 52, 96, 76);
    fill.addColorStop(0, "rgba(229,24,138,0.5)");
    fill.addColorStop(1, "rgba(229,24,138,0)");
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, 256, 128);

    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;

    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromEquirectangular(tex).texture;
    pmrem.dispose();
    tex.dispose();
    return env;
  }, [gl]);
}

/* ---------------------------------------------------------------------------
   The suspended core — the active substance.
   ------------------------------------------------------------------------- */
function Core({ still }: { still: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const COUNT = 56;

  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, () => {
        // Distribute inside a capsule-shaped volume, denser toward the axis.
        const t = Math.random();
        const r = Math.pow(Math.random(), 0.6) * 0.42;
        const a = Math.random() * Math.PI * 2;
        return {
          y: (t - 0.5) * 2.1,
          r,
          a,
          speed: 0.12 + Math.random() * 0.3,
          scale: 0.024 + Math.random() * 0.04,
          hot: Math.random() > 0.72,
        };
      }),
    [],
  );

  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ff9fd2",
        emissive: new THREE.Color(MAGENTA),
        emissiveIntensity: 3.4,
        roughness: 0.25,
        metalness: 0.1,
      }),
    [],
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = still ? 4.2 : state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const a = s.a + t * s.speed * 0.34;
      dummy.position.set(
        Math.cos(a) * s.r,
        s.y + Math.sin(t * 0.35 + s.a) * 0.055,
        Math.sin(a) * s.r,
      );
      dummy.scale.setScalar(s.scale * (s.hot ? 1.35 : 1));
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[geo, mat, COUNT]} frustumCulled={false} />
  );
}

/* ---------------------------------------------------------------------------
   The surrounding depth field.
   ------------------------------------------------------------------------- */
function Field({ still }: { still: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 420;

  const geo = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // A shell around the object, hollow in the middle so it reads as depth
      // rather than fog.
      const r = 2.6 + Math.pow(Math.random(), 0.5) * 4.4;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.85;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 1.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(NAVY),
        size: 0.05,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (still || !ref.current) return;
    ref.current.rotation.y += delta * 0.022;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ---------------------------------------------------------------------------
   Hairline registers.
   ------------------------------------------------------------------------- */
function Registers({ still }: { still: boolean }) {
  const g = useRef<THREE.Group>(null);
  const rings = useMemo(
    () => [
      { r: 1.42, o: 0.6 },
      { r: 1.72, o: 0.3 },
      { r: 2.04, o: 0.13 },
    ],
    [],
  );
  const geos = useMemo(
    () => rings.map((x) => new THREE.TorusGeometry(x.r, 0.006, 6, 170)),
    [rings],
  );

  useFrame((_, delta) => {
    if (still || !g.current) return;
    g.current.rotation.z -= delta * 0.04;
  });

  return (
    <group ref={g} rotation={[Math.PI / 2 - 0.62, 0, 0]}>
      {geos.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshBasicMaterial
            color={MAGENTA}
            transparent
            opacity={rings[i].o}
            depthWrite={false}
          />
        </mesh>
      ))}
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
  const { camera, gl } = useThree();

  // Transmission is the only costly thing in the scene. Configure the renderer
  // once, in an effect, rather than during render.
  useEffect(() => {
    const r = gl as THREE.WebGLRenderer & {
      transmissionResolutionScale?: number;
    };
    if (r.transmissionResolutionScale !== undefined)
      r.transmissionResolutionScale = 0.5;
  }, [gl]);


  const shell = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        transmission: 1,
        specularIntensity: 1,
        reflectivity: 0.6,
        thickness: 1.05,
        ior: 1.42,
        roughness: 0.025,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        envMap: env,
        envMapIntensity: 1.9,
        attenuationColor: new THREE.Color("#1b3a63"),
        attenuationDistance: 2.6,
        transparent: true,
      }),
    [env],
  );

  const capsule = useMemo(
    () => new THREE.CapsuleGeometry(0.76, 1.7, 24, 64),
    [],
  );

  useFrame((state, delta) => {
    // Entrance: settle in over the first ~1.2s, easing out.
    if (entrance.current < 1)
      entrance.current = Math.min(1, entrance.current + delta * 0.85);
    const e = 1 - Math.pow(1 - entrance.current, 3);

    if (!lean.current) return;
    lean.current.scale.setScalar(0.93 + 0.07 * e);

    if (still) {
      lean.current.rotation.set(0.1, -0.34, 0.16);
      return;
    }

    const p = pointer.current ?? { x: 0, y: 0 };
    lean.current.rotation.x = THREE.MathUtils.lerp(
      lean.current.rotation.x,
      0.08 - p.y * 0.24,
      0.05,
    );
    lean.current.rotation.y = THREE.MathUtils.lerp(
      lean.current.rotation.y,
      p.x * 0.4,
      0.05,
    );
    lean.current.rotation.z = THREE.MathUtils.lerp(
      lean.current.rotation.z,
      0.16 + p.x * 0.05,
      0.05,
    );
    lean.current.position.y = Math.sin(state.clock.elapsedTime * 0.42) * 0.075;

    // Camera parallax — the half of the effect that sells the depth.
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, p.x * 0.62, 0.04);
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      0.15 - p.y * 0.45,
      0.04,
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4.5, 7, 5]} intensity={2.1} />
      <directionalLight position={[-6, 2.5, -4]} intensity={0.85} color="#a9c5ff" />
      <directionalLight position={[-3.5, -4.5, 4]} intensity={1.1} color={MAGENTA} />

      <Field still={still} />

      <group ref={lean} rotation={[0.08, 0, 0.16]}>
        <pointLight position={[0, 0, 0]} intensity={7} distance={4.2} color={MAGENTA} />
        <pointLight position={[0, 0.9, 0]} intensity={3} distance={3} color="#ff8fcf" />
        <Core still={still} />
        <mesh geometry={capsule} material={shell} />
        <Registers still={still} />
      </group>
    </>
  );
}

export default function PrecisionForm() {
  const pointer = useRef({ x: 0, y: 0 });
  const still = useReducedMotion() ?? false;
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause the render loop once the hero scrolls away. Without this the scene
  // keeps drawing for the entire length of the page, which is what made
  // scrolling feel heavy further down.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: "120px" },
    );
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
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0.15, 8.2], fov: 32 }}
        // Draw continuously only while the hero is actually on screen. Left
        // running, the scene kept rendering for the whole length of the page,
        // which is what made scrolling further down feel heavy. Frozen states
        // render on demand — one frame, then idle.
        frameloop={visible && !still ? "always" : "demand"}
        style={{ background: "transparent" }}
      >
        <Scene pointer={pointer} still={still} />
      </Canvas>
    </div>
  );
}
