/**
 * Regulator marks, for the registrations a partner states.
 *
 * These are NOT certifications, and they are kept out of `certifications.ts`
 * deliberately: a market registration says a product may be sold in a country,
 * not that a quality system was audited. The site has always shown the two
 * apart, and it still does — this only puts the authority's own mark beside
 * the registration a partner already claims.
 *
 * ── The rule, unchanged ────────────────────────────────────────────────────
 * A mark appears only because the partner's own documentation lists that
 * registration. `markForRegistration()` reads the registration strings in
 * `partners.ts` and nothing else, so there is no way to attach a mark except
 * by the partner claiming the registration.
 *
 * ── Where the artwork comes from ───────────────────────────────────────────
 * Ravenbhel's own certifications sheet, one transparent PNG holding eight
 * marks. `tools/aboutcrop.mjs`'s sibling, `tools/certcrop.mjs`, cuts each one
 * out by its own opaque pixels. Nothing is redrawn or recoloured: fabricating
 * a regulator's emblem to make a claim look official is exactly the thing this
 * project exists not to do.
 *
 * The UAE mark is the exception: Zafieon supplied the ministry's gold crest
 * separately at 1309x1202, against 344x300 on the sheet, so that file is used
 * instead of either sheet crop. The sheet carries the same authority twice —
 * the crest and a falcon wordmark lockup — and neither is written out.
 *
 * The WHO emblem is on the sheet and is extracted, but is not listed here: it
 * already renders from the certification registry and would otherwise appear
 * twice on the same page.
 */

export interface RegulatorMark {
  id: string;
  /** Supplied artwork, cut from the partner's own certifications sheet. */
  logo: string;
  /** Accessible name for the image. */
  alt: string;
  /** Ordered patterns that identify this authority in a registration string. */
  match: RegExp[];
}

export const regulatorMarks: RegulatorMark[] = [
  {
    id: "efda-ethiopia",
    logo: "/certifications/revenbhel/efda-ethiopia.webp",
    alt: "Ethiopian Food and Drug Authority emblem",
    match: [/\bEFDA\b/i, /ethiopian food/i],
  },
  {
    id: "fda-philippines",
    logo: "/certifications/revenbhel/fda-philippines.webp",
    alt: "Food and Drug Administration, Philippines emblem",
    match: [/philippines/i],
  },
  {
    id: "dpm",
    logo: "/certifications/revenbhel/dpm.webp",
    alt: "Direction de la Pharmacie et du Médicament emblem",
    match: [/\bDPM\b/, /direction de la pharmacie/i],
  },
  {
    id: "ppb-kenya",
    logo: "/certifications/revenbhel/ppb-kenya.webp",
    alt: "Pharmacy and Poisons Board, Ministry of Health, Republic of Kenya emblem",
    match: [/pharmacy and poisons board/i, /\bkenya\b/i],
  },
  {
    id: "nafdac-nigeria",
    logo: "/certifications/revenbhel/nafdac-nigeria.webp",
    alt: "National Agency for Food and Drug Administration and Control, Nigeria emblem",
    match: [/\bNAFDAC\b/i],
  },
  {
    id: "mohap-uae",
    logo: "/certifications/revenbhel/mohap-uae.webp",
    alt: "United Arab Emirates Ministry of Health & Prevention emblem",
    match: [/ministry of health\s*&?\s*prevention/i, /united arab emirates/i],
  },
];

/** The mark for a registration string, or undefined when none is supplied. */
export function markForRegistration(
  registration: string,
): RegulatorMark | undefined {
  return regulatorMarks.find((m) => m.match.some((re) => re.test(registration)));
}
