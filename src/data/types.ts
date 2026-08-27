/**
 * ZAFIEON PHARMA — content model
 *
 * Every field below is OPTIONAL unless it is verifiable from the material
 * Zafieon supplied. The UI is built to render nothing at all when a field is
 * absent, so the correct way to handle unknown information is to omit the key —
 * never to invent a placeholder value.
 *
 * `source` on each record names the supplied document the facts came from, so
 * the claims register in /docs/CLAIMS.md can be audited against the code.
 */

export type ProductClass = "prescription" | "nutraceutical";

export type FocusAreaId =
  | "womens-health"
  | "gynecology"
  | "reproductive-health"
  | "fertility"
  | "womens-wellness";

export interface Product {
  id: string;
  slug: string;
  /** Brand name exactly as printed on the pack. */
  name: string;
  /** Regulatory class. Drives the prescription gate. */
  productClass: ProductClass;
  /** Short human label, e.g. "Tablets", "Softgel Capsules". */
  dosageForm: string;
  therapeuticAreas: FocusAreaId[];
  /** Neutral, non-promotional restatement of what is printed on the pack. */
  description: string;
  /** Verbatim composition line from the pack artwork. */
  composition?: string;
  /** Pack presentation, verbatim. */
  packaging?: string;
  /** e.g. "FSSAI Lic. No. …" — only where printed on the pack. */
  licence?: string;
  /** Factual pack markings, e.g. "Rx", "Vegetarian". */
  packMarkings?: string[];
  image: string;
  imageAlt: string;
  /** Inline LQIP so pack shots resolve blur-to-sharp instead of popping in. */
  blurDataURL?: string;
  /** True where the Zafieon mark is printed on the supplied pack artwork. */
  zafieonBranded: boolean;
  source: string;
}

export interface AssociatedBrand {
  id: string;
  name: string;
  /** Present only where the supplied document states one. */
  note?: string;
}

export interface PartnerFacility {
  name: string;
  location?: string;
  role?: string;
}

export interface Partner {
  id: string;
  slug: string;
  name: string;
  /**
   * Partner logo, recovered from that partner's own supplied brochure cover
   * (background removed, paper tint neutralised, auto-trimmed). Replace with
   * vector artwork if the partner provides it.
   */
  logo?: string;
  /** Short display name for tight UI. */
  shortName: string;
  country: string;
  region?: string;
  /** Verbatim or closely paraphrased positioning line from the brochure. */
  tagline?: string;
  about?: string[];
  capabilities?: string[];
  certifications?: string[];
  /** Named individuals, only where the supplied document names them. */
  people?: { name: string; role: string }[];
  facilities?: PartnerFacility[];
  /** Export markets. Attributed to the partner, never to Zafieon. */
  exportMarkets?: string[];
  /** Companies the PARTNER manufactures for. Not Zafieon relationships. */
  associatedBrands?: AssociatedBrand[];
  /** Partner-to-partner associations stated in the brochure. */
  associations?: string[];
  website?: string;
  /** Facts that carry a caveat we must surface rather than bury. */
  qualifiers?: string[];
  /** Set when the supplied document contains no usable profile. */
  profilePending?: boolean;
  source: string;
}

export interface FocusArea {
  id: FocusAreaId;
  slug: string;
  label: string;
  headline: string;
  description: string;
  /** Supporting editorial paragraph. */
  detail?: string;
  /**
   * Area artwork. The supplied set shares one art direction — deep navy, the
   * subject to the right, negative space to the left — which is what allows it
   * to sit behind left-aligned type without a heavy scrim.
   */
  image?: string;
  imageAlt?: string;
  blurDataURL?: string;
}

export interface QualityPillar {
  id: string;
  title: string;
  description: string;
}

export interface LifecycleStage {
  id: string;
  label: string;
  description: string;
}
