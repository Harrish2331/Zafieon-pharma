import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { partners } from "@/data/partners";

/**
 * Where the network actually is.
 *
 * No world map. Every supplied partner manufactures in India, and no
 * coordinates were provided, so a pinned map would be invented geography.
 * Instead this is a schematic of the real cluster: states down the left,
 * partners and their documented sites across from them.
 *
 * Regions are derived from the partner data, so a partner added in a new state
 * creates a new row here without any change to this component.
 */
export default function ManufacturingFootprint() {
  // A partner may span several states ("Himachal Pradesh · Gujarat · Haryana").
  const byState = new Map<string, typeof partners>();
  for (const p of partners) {
    const states = (p.region ?? p.country).split("·").map((s) => s.trim());
    for (const s of states) {
      byState.set(s, [...(byState.get(s) ?? []), p]);
    }
  }

  // Largest clusters first; "India" (state unknown) always last.
  const rows = [...byState.entries()].sort((a, b) => {
    if (a[0] === "India") return 1;
    if (b[0] === "India") return -1;
    return b[1].length - a[1].length;
  });

  return (
    <div className="relative">
      <ol className="border-t border-line">
        {rows.map(([state, list], i) => (
          <Reveal key={state} delay={i * 0.06} y={16} duration={0.75}>
            <li className="grid gap-5 border-b border-line py-8 lg:grid-cols-12 lg:gap-10">
              {/* State */}
              <div className="flex items-start gap-4 lg:col-span-4">
                <span
                  aria-hidden="true"
                  className="mt-2 h-2.5 w-2.5 shrink-0 bg-magenta"
                />
                <div>
                  <h3 className="text-[1.15rem] leading-[1.15] text-navy">
                    {state === "India" ? "State not specified" : state}
                  </h3>
                  <p className="mt-2 text-[0.75rem] tracking-[0.12em] text-muted-light uppercase">
                    {list.length}{" "}
                    {list.length === 1 ? "partner" : "partners"}
                  </p>
                </div>
              </div>

              {/* Partners in that state */}
              <ul className="space-y-4 lg:col-span-8">
                {list.map((p) => {
                  // Count only the sites actually in THIS state. A group that
                  // spans several states must not report its full site count
                  // against each one.
                  const here =
                    state === "India"
                      ? (p.facilities?.length ?? 0)
                      : (p.facilities?.filter((f) =>
                          f.location?.includes(state),
                        ).length ?? 0);

                  return (
                    <li key={p.id}>
                      <Link
                        href={`/manufacturing/${p.slug}`}
                        className="group flex flex-wrap items-baseline gap-x-4 gap-y-1"
                      >
                        <span className="text-[1rem] text-navy underline decoration-line-strong underline-offset-4 transition-colors group-hover:decoration-magenta">
                          {p.shortName}
                        </span>
                        {here > 0 && (
                          <span className="text-[0.8rem] text-muted-light">
                            {here} {here === 1 ? "site" : "sites"} documented
                            {state !== "India" ? " here" : ""}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
