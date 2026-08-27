/**
 * The certification registry.
 *
 * One place that answers: "given a certification string a partner claims, which
 * mark represents it?" Every surface on the site reads from here, so a mark can
 * never drift out of sync between the homepage, a partner card and a partner
 * page.
 *
 * ── The rule that matters ──────────────────────────────────────────────────
 * A mark is only ever rendered because a partner's OWN documentation claims
 * that certification. `resolve()` reads the partner's `certifications` strings
 * and nothing else. There is deliberately no way to attach a mark to a partner
 * except by that partner claiming it in `partners.ts`.
 *
 * ── Where a mark does not exist ────────────────────────────────────────────
 * Some claims have no supplied artwork — PIC/S, and the Himachal Pradesh drug
 * manufacturing licence. Those render the site's own drawn seal rather than a
 * recreated official mark. Fabricating a regulator's emblem to make a claim
 * look more official is exactly the thing this project exists not to do.
 */

export interface CertificationMarkDef {
  id: string;
  /** Short label, used where the mark stands alone. */
  label: string;
  /** What the certification actually is — shown as supporting text. */
  description: string;
  /**
   * Supplied artwork. Absent means "render the drawn seal instead" — never
   * means "invent one".
   */
  logo?: string;
  /** Accessible name for the image. */
  alt?: string;
  /**
   * Surfaced next to the mark wherever it is shown at size. Used for marks
   * whose real-world meaning is commonly misread.
   */
  note?: string;
  /** Ordered patterns that identify this certification in a claim string. */
  match: RegExp[];
}

export const certificationMarks: CertificationMarkDef[] = [
  {
    id: "who",
    label: "WHO",
    description: "World Health Organization GMP standards",
    logo: "/certifications/who.webp",
    alt: "World Health Organization emblem",
    note: "WHO-GMP certificates are issued by national or state drug regulators applying WHO Good Manufacturing Practice guidelines. The WHO does not itself certify manufacturers.",
    match: [/\bWHO\b/i, /world health organization/i],
  },
  {
    id: "glp",
    label: "GLP",
    description: "Good Laboratory Practice",
    logo: "/certifications/glp.webp",
    alt: "Good Laboratory Practice certified seal",
    match: [/\bGLP\b/i, /good laboratory practice/i],
  },
  {
    id: "gmp",
    label: "GMP",
    description: "Good Manufacturing Practice",
    logo: "/certifications/gmp.webp",
    alt: "Good Manufacturing Practice certified seal",
    match: [/\bGMP\b/i, /good manufacturing practice/i],
  },
  {
    id: "iso",
    label: "ISO 9001",
    description: "ISO 9001 quality management system",
    logo: "/certifications/iso.webp",
    alt: "ISO 9001:2015 certified seal",
    match: [/\bISO\s*9001\b/i, /\bISO\b/i],
  },
  {
    id: "pics",
    label: "PIC/S",
    description: "Pharmaceutical Inspection Co-operation Scheme",
    // No artwork supplied. PIC/S is an inspectorate co-operation scheme, not a
    // certifier with a public seal — the drawn mark is used instead.
    match: [/\bPIC\s*\/?\s*S\b/i],
  },
  {
    id: "licence",
    label: "Manufacturing Licence",
    description: "State drug manufacturing licence",
    // A state licence, not a certification scheme — no seal exists.
    match: [/manufacturing licence/i, /\bform\s*25\b/i, /\bform\s*28\b/i],
  },
];

/**
 * Which mark, if any, a single claim string represents.
 * Order matters: WHO and GLP are tested before GMP so that "WHO GMP" and
 * "GLP Certificate" are not swallowed by the broader GMP pattern.
 */
export function markFor(claim: string): CertificationMarkDef | undefined {
  return certificationMarks.find((m) => m.match.some((re) => re.test(claim)));
}

/**
 * The distinct marks a partner's own claims resolve to, in registry order.
 * This is the ONLY way a mark reaches a partner.
 */
export function resolve(claims: readonly string[] | undefined) {
  if (!claims?.length) return [];
  const seen = new Set<string>();
  const out: CertificationMarkDef[] = [];
  for (const m of certificationMarks) {
    if (seen.has(m.id)) continue;
    if (claims.some((c) => m.match.some((re) => re.test(c)))) {
      seen.add(m.id);
      out.push(m);
    }
  }
  return out;
}

/** Marks that at least one partner in the network actually claims. */
export function marksAcross(
  partners: readonly { certifications?: string[] }[],
) {
  const ids = new Set<string>();
  for (const p of partners) resolve(p.certifications).forEach((m) => ids.add(m.id));
  return certificationMarks.filter((m) => ids.has(m.id));
}
