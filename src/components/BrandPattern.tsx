/**
 * The official Zafieon brand pattern, rebuilt from "Brand Pattern.png" as a
 * seamless SVG tile so it can be scaled, tinted and masked without artefacts.
 *
 * The pattern is a texture, never a subject: it lives at low opacity behind
 * content, usually masked so it fades rather than stopping at a hard edge.
 */

type Tone = "magenta" | "navy" | "white";

const SRC: Record<Tone, string> = {
  magenta: "/brand/pattern-magenta.svg",
  navy: "/brand/pattern-navy.svg",
  white: "/brand/pattern-white.svg",
};

export default function BrandPattern({
  tone = "magenta",
  opacity = 0.05,
  scale = 168,
  className = "",
  fade = "none",
  rotate = 0,
}: {
  tone?: Tone;
  opacity?: number;
  /** Tile size in px. Larger reads calmer. */
  scale?: number;
  className?: string;
  /** Direction the pattern dissolves toward. */
  fade?: "none" | "top" | "bottom" | "left" | "right" | "radial";
  rotate?: number;
}) {
  const masks: Record<string, string | undefined> = {
    none: undefined,
    top: "linear-gradient(to top, transparent, black 65%)",
    bottom: "linear-gradient(to bottom, transparent, black 65%)",
    left: "linear-gradient(to left, transparent, black 70%)",
    right: "linear-gradient(to right, transparent, black 70%)",
    radial: "radial-gradient(ellipse at center, black 10%, transparent 72%)",
  };
  const mask = masks[fade];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-[-25%]"
        style={{
          // The pattern never moves relative to its section, but a masked,
          // repeating background is re-rasterised on every scroll frame.
          // Promoting it to its own composited layer means it is rasterised
          // once and thereafter only composited.
          transform: rotate ? `rotate(${rotate}deg) translateZ(0)` : "translateZ(0)",
          backfaceVisibility: "hidden",
          backgroundImage: `url(${SRC[tone]})`,
          backgroundRepeat: "repeat",
          backgroundSize: `${scale}px auto`,
          opacity,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </div>
  );
}
