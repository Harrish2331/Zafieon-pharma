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

/** The diagonal the reference stands the capsule on, in radians. */
const TILT = 0.52;

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
          scale: 0.05 + Math.random() * 0.055,
          hot: Math.random() > 0.72,
          // Each pill sits at its own angle and tumbles slowly, so the fill
          // reads as loose granules rather than a pattern.
          rx: Math.random() * Math.PI,
          ry: Math.random() * Math.PI,
          rz: Math.random() * Math.PI,
          tumble: 0.1 + Math.random() * 0.22,
        };
      }),
    [],
  );

  /* Pills rather than pellets. The reference fills the capsule with small
     rounded granules, which is also what an actual filled capsule looks like;
     a sphere reads as a bubble. Kept to four radial segments — there are 56 of
     them and none is ever more than a few pixels across. */
  const geo = useMemo(() => new THREE.CapsuleGeometry(0.4, 0.85, 3, 8), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ff6fbe",
        emissive: new THREE.Color(MAGENTA),
        emissiveIntensity: 2.4,
        roughness: 0.3,
        metalness: 0.05,
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
      dummy.rotation.set(s.rx + t * s.tumble, s.ry, s.rz + t * s.tumble * 0.6);
      dummy.scale.setScalar(s.scale * (s.hot ? 1.3 : 1));
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
   The printed lockup.

   Zafieon's reference shows the identity printed down the barrel of the
   capsule. The artwork is the supplied file — public/brand/logo-horizontal-
   white.svg, turned a quarter turn and baked to a texture by
   tools/capsulelabel.mjs — not a redrawn approximation. The rule the rest of
   the project follows holds here: the logo is a supplied asset wherever it
   appears.

   It is printed on the OUTSIDE of the shell, a hair proud of it, which is
   where a real capsule carries its print — and it has to be: three renders the
   transmission pass without transparent objects, so a label inside the glass
   is simply not composited and never appears.
   ------------------------------------------------------------------------- */
function Label() {
  const [map, setMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let live = true;
    const loader = new THREE.TextureLoader();
    loader.load("/brand/capsule-label.webp", (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      // One face, not wrapped: the print occupies the middle of the texture
      // and the rest is transparent.
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      if (live) setMap(t);
      else t.dispose();
    });
    return () => {
      live = false;
    };
  }, []);

  /* An open band around the barrel rather than a whole capsule.
     three's cylinder puts theta = 0 at +Z, so starting the sweep at -SPAN/2
     centres the print on the face that meets the camera — no guessing at a
     lathe's winding order, which is what left the print on the far side. */
  const SPAN = 1.15;
  const geo = useMemo(
    () =>
      new THREE.CylinderGeometry(0.772, 0.772, 1.78, 28, 1, true, -SPAN / 2, SPAN),
    [],
  );

  if (!map) return null;
  return (
    <mesh geometry={geo} renderOrder={3}>
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
  /* Wider than the capsule and further apart than they were, which is how
     they sit in the reference — the object is ringed rather than collared. */
  const rings = useMemo(
    () => [
      { r: 1.56, o: 0.62 },
      { r: 1.94, o: 0.34 },
      { r: 2.32, o: 0.15 },
    ],
    [],
  );
  const geos = useMemo(
    () => rings.map((x) => new THREE.TorusGeometry(x.r, 0.005, 6, 190)),
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
        thickness: 0.82,
        ior: 1.4,
        roughness: 0.035,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        envMap: env,
        envMapIntensity: 1.9,
        /* The reference capsule is near-clear with the fill glowing through
           it. The old navy attenuation tinted the whole body and read as a
           blue object rather than as glass. */
        attenuationColor: new THREE.Color("#dce8f7"),
        attenuationDistance: 3.6,
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
      lean.current.rotation.set(0.1, -0.28, TILT);
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
      TILT + p.x * 0.05,
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

      <group ref={lean} rotation={[0.08, 0, TILT]}>
        <pointLight position={[0, 0, 0]} intensity={7} distance={4.2} color={MAGENTA} />
        <pointLight position={[0, 0.9, 0]} intensity={3} distance={3} color="#ff8fcf" />
        <Core still={still} />
        <Label />
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
