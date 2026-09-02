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

/**
 * The portfolio categories shown on /products.
 *
 * These are display groupings, not a pharmacological taxonomy, and a product
 * may sit in more than one — an oral contraceptive is both a prescription
 * medicine and a hormone. The rule applied in `products.ts` is deliberately
 * narrow and written down there, so a reader can audit every assignment
 * against the pack artwork rather than trusting a judgement call.
 */
export type ProductCategory = "nutraceutical" | "prescription" | "hormone";

export type FocusAreaId =
  | "womens-health"
  | "gynecology"
  | "hormonal-health"
  | "fertility"
  | "womens-wellness";

export interface Product {
  id: string;
  slug: string;
  /** Brand name exactly as printed on the pack. */
  name: string;
  /**
   * Regulatory class. Drives the prescription gate, the sitemap exclusion and
   * the `noindex` on the detail route — it is a legal mechanism, never a
   * display grouping, which is why `categories` is separate.
   */
  productClass: ProductClass;
  /** Display groupings for the catalogue filter. At least one. */
  categories: ProductCategory[];
  /**
   * Short human label, e.g. "Tablets", "Softgel Capsules". Omitted where the
   * supplied artwork does not state a dosage form.
   */
  dosageForm?: string;
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
  /**
   * Set where the supplied artwork is a brand mock-up carrying no composition,
   * pack count or regulatory marking. The UI shows an explicit "details to
   * follow" note instead of guessing at what the pack would say.
   */
  detailsPending?: boolean;
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
  /**
   * Set where the profile is written by Zafieon as interim copy because the
   * partner has not yet supplied a brochure. Surfaced to the reader, so an
   * interim profile is never mistaken for a documented one.
   */
  profileInterim?: boolean;
  /**
   * National regulatory registrations and approvals the partner states it
   * holds. Kept apart from `certifications` because these are market
   * registrations, not quality-system certifications, and because no emblem is
   * ever drawn for them — they appear as attributed text only.
   */
  regulatoryRegistrations?: string[];
  /** Capability the partner announces as planned or under construction. */
  planned?: { title: string; operator?: string; items: string[] };
  /**
   * Excluded from every listing, route and sitemap entry, while the record
   * itself is kept. Used where the client has taken a partner off the public
   * directory but the supplied documentation should not be thrown away.
   */
  retired?: boolean;
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

/**
 * Zafieon Insights.
 *
 * Editorial written from Zafieon's own stated positioning — its focus, its
 * quality framework and its partner expectations. Nothing here reports an
 * external event, cites a study or carries a statistic, because none was
 * supplied. See docs/CLAIMS.md.
 */
export type InsightTag =
  | "Women's Health"
  | "Gynaecology"
  | "Pharmaceutical Industry"
  | "Healthcare"
  | "Pharma Innovation"
  | "Manufacturing"
  | "Research & Development"
  | "Hormonal Health"
  | "Nutraceuticals";

export interface Insight {
  id: string;
  slug: string;
  /** 1-4. The slot the Admin Dashboard replaces the image for. */
  slot: 1 | 2 | 3 | 4;
  title: string;
  standfirst: string;
  body: string[];
  tags: InsightTag[];
  /** Fallback artwork, shipped with the build. */
  image: string;
  imageAlt: string;
  blurDataURL?: string;
}
