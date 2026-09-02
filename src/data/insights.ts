import type { Insight } from "./types";

/**
 * ZAFIEON INSIGHTS
 *
 * ── Read this before editing ────────────────────────────────────────────────
 * These four pieces are Zafieon Pharma's own perspective, written from what the
 * company has already stated about itself: its focus on women's health, its
 * quality framework, its expectations of manufacturing partners, and its
 * position on responsible practice. Every sentence traces back to material in
 * `site.ts`, `partners.ts` or `quality`.
 *
 * What is deliberately NOT here, because none of it was supplied:
 *   · reported news, dated events or announcements
 *   · market statistics, growth figures or market-size claims
 *   · references to studies, guidelines or third-party publications
 *   · therapeutic, clinical or product claims of any kind
 *   · named individuals presented as authors
 *
 * The section is therefore a company viewpoint column, not a news wire. If
 * Zafieon later wants genuine industry news here, that copy has to come from
 * the company with its sources — it cannot be generated. See docs/CLAIMS.md.
 *
 * ── Images ──────────────────────────────────────────────────────────────────
 * `image` is the fallback that ships with the build, cut from the manufacturing
 * film Zafieon supplied. The four slots are replaceable at runtime through the
 * Admin Dashboard; see `src/lib/insight-store.ts`.
 *
 * **Re-cut these whenever the film is replaced.** They were first taken from an
 * earlier 1280x720 export which carried a visible AI-provenance sparkle burned
 * into one shot; the current 1920x1080 file does not. Because the stills were
 * not regenerated with the film, that mark survived on `insight-03` long after
 * it had left the video. `.work/reinsight.mjs` extracts replacements.
 */
export const insights: Insight[] = [
  {
    id: "ins-01",
    slug: "why-we-began-in-womens-health",
    slot: 1,
    title: "Why we began in women's health",
    standfirst:
      "A first therapeutic division is a statement of intent. Ours is women's health, and the reasons are practical as much as they are principled.",
    body: [
      "A new pharmaceutical company has to choose where to be useful first. Zafieon Pharma began with women's health — gynaecology, hormonal health, fertility and women's wellness — because it is an area where consistency of supply and consistency of formulation matter in a way that is felt directly by the person taking the product.",
      "Treatment in these areas is often cyclical and long-running. A course is not a single dose; it is a sequence held over weeks or months, sometimes years. A product that is unavailable in the third month is not a minor inconvenience to the pharmacy — it is an interruption to care. That reality shapes what we ask of a manufacturing partner before we ask anything about price.",
      "It also shapes the shape of the portfolio itself. Our range runs deliberately across both prescription and nutraceutical products, because the needs it serves do not divide neatly along that line. The standards we hold behind them do not divide either.",
    ],
    tags: ["Women's Health", "Gynaecology", "Healthcare"],
    image: "/images/insights/insight-01.webp",
    imageAlt:
      "A scientist examining a sample under a microscope in a laboratory",
    blurDataURL:
      "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAABQBACdASoUAAsAPu1iqU2ppaOiMAgBMB2JYwDE6f/gMXUr9Vo/iZEAy14AAOI0CrVf8Vy3oAAcDl5q68jc6lkh/b3y9XwENlq/yJ9XjQcvIeA6lpYOMJTyWzP4F4guxMcV2Lj7fiK1D+4tceM8kQPvWqdqC9lVfAA=",
  },
  {
    id: "ins-02",
    slug: "what-qualifying-a-partner-actually-means",
    slot: 2,
    title: "What qualifying a manufacturing partner actually means",
    standfirst:
      "Selecting a manufacturer is the single decision that determines most of a product's quality. Here is what we look at, and why the list is shorter than you might expect.",
    body: [
      "Zafieon Pharma does not own a manufacturing plant. Every product we supply is made by a partner, which means partner selection is not a procurement exercise — it is the quality decision, made once, upstream of everything else.",
      "We hold partners to a set of expectations that are stated openly rather than kept internal: manufacture under applicable Good Manufacturing Practice standards; compliance with the regulatory requirements that apply to each product and each market; consistency of the finished product batch to batch; complete and traceable documentation; packaging that protects the product and carries accurate, compliant information; and supply that is dependable enough that availability never becomes the failure point.",
      "None of those are unusual. What matters is that they are checked, recorded against the partner, and published with attribution — so that a certification a partner holds is presented as that partner's, and never quietly absorbed into ours.",
    ],
    tags: ["Manufacturing", "Pharmaceutical Industry", "Healthcare"],
    image: "/images/insights/insight-02.webp",
    imageAlt: "Empty capsule shells on a stainless steel tray in production",
    blurDataURL:
      "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAACQAwCdASoUAAsAPu1iqk4ppaQiMAgBMB2JZwDImBg0RHEuw4AAAP4nImSINMh8iJINSlULvAnZx/99+3WVf1pP/nwg1PjXqh+sFglP73WkGJsryMSGh4AA",
  },
  {
    id: "ins-03",
    slug: "hormonal-products-and-the-case-for-consistency",
    slot: 3,
    title: "Hormonal products and the case for consistency",
    standfirst:
      "In a hormone product, batch-to-batch consistency is not a manufacturing metric. It is the product.",
    body: [
      "A meaningful share of the Zafieon portfolio is hormonal — combination tablets, progesterone, and products that sit alongside them in gynecological and fertility care. These are formulations where the difference between a well-made batch and an adequate one is not a matter of finish.",
      "That is why a dedicated hormone manufacturing capability weighs so heavily in how we qualify a partner. Hormone handling carries its own containment, cleaning-validation and cross-contamination requirements, and a facility built for it is not the same as a general oral-solids line asked to accommodate it.",
      "It is also why we publish which partner makes what, and what that partner states about its own certifications and licences. A reader who wants to check the chain behind a product should be able to follow it without asking us.",
    ],
    tags: ["Hormonal Health", "Manufacturing", "Research & Development"],
    image: "/images/insights/insight-03.webp",
    imageAlt:
      "A gloved technician inspecting a glass vial under cleanroom conditions",
    blurDataURL:
      "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADQAwCdASoUAAsAPu1iqU2ppaQiMAgBMB2JZwDE2B8n61UQC4P/y/AA7x5dbmNRp3xsdQyUCn9CHNTFA4ybkurKeSyUGh+p8iDDdXUDITUFX7BkRKJzahDfpRO8UM+AAAA=",
  },
  {
    id: "ins-04",
    slug: "a-nutraceutical-is-not-a-lesser-product",
    slot: 4,
    title: "A nutraceutical is not a lesser product",
    standfirst:
      "The regulatory pathway is different. The manufacturing discipline behind it should not be.",
    body: [
      "Nutraceuticals sit under a different regulatory regime from prescription medicines, and it is a lighter one. That difference is real, and it is often treated as licence to apply a lighter standard behind the product as well.",
      "We hold the opposite position, for a simple reason: the people taking our wellness and supplementation range are frequently the same people taking our prescription range, often at the same time and for the same underlying reason. A patient in fertility care does not experience two categories of product. She experiences one course of treatment.",
      "So our nutraceutical range is qualified through the same partner selection, the same documentation expectations and the same supply discipline as everything else we put our name to. The regulatory floor is lower. Ours is not.",
    ],
    tags: ["Nutraceuticals", "Women's Health", "Pharma Innovation"],
    image: "/images/insights/insight-04.webp",
    imageAlt: "An automated pharmaceutical filling and inspection line",
    blurDataURL:
      "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAACQAwCdASoUAAsAPu1iqU2ppaOiMAgBMB2JZQCw7BSK+E6UX8gAAPx/83C+vTNlKoebjxbI8CB/kwitDgyp17I3KOVqzgClKhFfuMTu6HBGTU82cyEfgrJ2Xu2JULjyCmdYQAAA",
  },
];

export const getInsight = (slug: string) =>
  insights.find((i) => i.slug === slug);

/** Every tag actually used, in first-appearance order. */
export const insightTags = Array.from(
  new Set(insights.flatMap((i) => i.tags)),
);
