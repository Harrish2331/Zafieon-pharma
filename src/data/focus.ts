import type { FocusArea } from "./types";

/**
 * Therapeutic focus. Zafieon's current portfolio sits entirely within women's
 * health, so these are descriptions of where the company is focused — not
 * claims about what any individual product does.
 */
export const focusAreas: FocusArea[] = [
  {
    id: "gynecology",
    slug: "gynecology",
    image: "/images/focus/gynecology.webp",
    imageAlt:
      "A scientist examining a sample under a microscope, with gynecological and molecular motifs",
    blurDataURL:
      "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAACwAwCdASoUABAAPt1ep00opSOiMAgBEBuJQBOmUABwf9ugsUN48AD+5PUWTaC62wO8QEyvAjQE1KkKaCDSDX5uyYE9kPN4ofNojDL4bZyWJsNaQ4/kL4qVFAz5qmg8fGWhgAAA",
    label: "Gynaecology",
    headline: "Supporting women's health at every stage.",
    description:
      "Pharmaceutical products for gynecological care, supplied through qualified manufacturing partners and prescribed by healthcare professionals.",
    detail:
      "Gynaecology is where Zafieon's prescription portfolio begins. These are products dispensed under medical supervision, and our role is to make sure that what reaches the pharmacy shelf has been made correctly, documented properly and supplied reliably.",
  },
  {
    id: "hormonal-health",
    slug: "hormonal-health",
    image: "/images/focus/hormonal-health.webp",
    imageAlt:
      "An illustrated figure in profile with molecular and endocrine motifs",
    blurDataURL:
      "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAwAwCdASoUAA0APt1apkyopSOiMAgBEBuJQBOmUACM4XJAAP7woaHb6iTBXj0ha2PwQGESlGCfKN52C10eBFmqwtMPX66ZoAA=",
    label: "Hormonal Health",
    headline: "Hormonal therapy, made consistently.",
    description:
      "Products whose active ingredient is a hormone or a hormone analogue, manufactured to consistent strength under partners qualified for hormone handling.",
    detail:
      "A hormone product is defined by its consistency. Milligram-for-milligram accuracy batch to batch is not a manufacturing statistic here — it is the product, and a course held over weeks depends on it. Hormone manufacture also carries its own containment and cleaning-validation demands, which is why a dedicated hormone capability weighs so heavily in how we qualify a partner.",
  },
  {
    id: "fertility",
    slug: "fertility",
    image: "/images/focus/fertility.webp",
    imageAlt:
      "An illustrated ovum at the moment of fertilisation, with molecular motifs",
    blurDataURL:
      "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADwAwCdASoUAAsAPt1cpkyopSOiMAgBEBuJZgCdMoAC8KBhyoM0sYA2AP7w36zrl6xrGsLQeDCLmWhpvAy1DeCiZ2vwUx8YDj6vY8XTr899ao+1GOqFiZR79gxF4AAA",
    label: "Fertility",
    headline: "Committed to supporting fertility care.",
    description:
      "Nutritional and pharmaceutical support for fertility care, produced to pharmacopoeial and statutory standards.",
    detail:
      "Fertility care is long, personal and often difficult. The contribution we can make is narrow but real: products that are consistent, available when they are needed, and made by partners whose processes we have qualified.",
  },
  {
    id: "womens-wellness",
    slug: "womens-wellness",
    image: "/images/focus/womens-wellness.webp",
    imageAlt:
      "An illustrated figure in a calm, open pose surrounded by botanical and wellness motifs",
    blurDataURL:
      "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAQAwCdASoUABAAPt1cpkyopSOiMAgBEBuJYgCdMoAEagAA/vB1xZmTCktTM4I1NMYaN0Xi4RzByghX4vrJFkSZ5Fwxc0CeeynUAAAA",
    label: "Women's Wellness",
    headline: "Everyday well-being, held to the same standard.",
    description:
      "Nutraceutical products for women's everyday health, manufactured under the same partner qualification and quality expectations as our pharmaceutical range.",
    detail:
      "A nutraceutical is not a lesser product. Our wellness range is held to the same partner qualification, the same documentation expectations and the same supply discipline as everything else we put our name to.",
  },
];

export const getFocusArea = (slug: string) =>
  focusAreas.find((f) => f.slug === slug);
