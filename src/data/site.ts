import type { LifecycleStage, QualityPillar } from "./types";

/* ============================================================================
   IDENTITY
   ========================================================================== */

export const site = {
  name: "Zafieon Pharma",
  legalName: "ZAFIEON PHARMA",
  tagline: "Every Dose Matters",
  concept: "Precision in science. Care in every dose.",
  url: "https://www.zafieonpharma.com",
  description:
    "Zafieon Pharma is a new-generation pharmaceutical company focused on women's health, working with qualified manufacturing partners to deliver products built on quality, science and responsible practice.",
} as const;

/* ============================================================================
   NAVIGATION
   ========================================================================== */

export const primaryNav = [
  { label: "About", href: "/about" },
  { label: "Our Focus", href: "/our-focus" },
  { label: "Products", href: "/products" },
  { label: "Quality", href: "/quality" },
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = {
  company: [
    { label: "About", href: "/about" },
    { label: "Our Focus", href: "/our-focus" },
    { label: "Contact", href: "/contact" },
  ],
  portfolio: [
    { label: "All Products", href: "/products" },
    { label: "Prescription", href: "/products?class=prescription" },
    { label: "Nutraceutical", href: "/products?class=nutraceutical" },
  ],
  standards: [
    { label: "Quality", href: "/quality" },
    { label: "Certifications", href: "/quality#certifications" },
    { label: "Manufacturing", href: "/manufacturing" },
    { label: "Manufacturing Partners", href: "/manufacturing#partners" },
  ],
} as const;

/* ============================================================================
   CONTACT
   Only what Zafieon has verified. Nothing here is invented — where a detail
   has not been supplied, `pending: true` renders an honest placeholder instead
   of a fabricated address or number.
   ========================================================================== */

export const contact = {
  email: { value: "info@zafieonpharma.com", pending: true },
  phone: { value: "", pending: true },
  address: { value: "", pending: true },
  enquiryTypes: [
    "Product enquiry",
    "Distribution & wholesale",
    "Manufacturing partnership",
    "Healthcare professional enquiry",
    "Careers",
    "Other",
  ],
} as const;

/* ============================================================================
   HOME — the seven-beat story
   ========================================================================== */

export const home = {
  hero: {
    eyebrow: "Zafieon Pharma",
    line1: "Every Dose",
    line2: "Matters.",
    body: "ZAFIEON PHARMA is a new-generation pharmaceutical company founded with a clear purpose—to contribute to better healthcare through quality, science, innovation, and responsible practices.",
    primaryCta: { label: "Explore Products", href: "/products" },
    secondaryCta: { label: "Discover Zafieon", href: "/about" },
  },
  about: {
    eyebrow: "About Zafieon",
    headline: ["Building a Healthcare", "Organization for the Future."],
    body: [
      "ZAFIEON PHARMA is a new-generation pharmaceutical company founded with a clear purpose—to contribute to better healthcare through quality, science, innovation and responsible practices.",
      "With more than twelve years of pharmaceutical industry experience behind it, the company combines a deep understanding of healthcare needs and professional relationships with a fresh vision and an entrepreneurial spirit.",
    ],
    stat: { value: "12+", label: "Years of pharmaceutical industry experience" },
  },
  focus: {
    eyebrow: "Our Focus",
    headline: ["Focused on", "Women's Health."],
    body: "Zafieon Pharma is beginning its journey with a focused presence in women's health, with an emphasis on gynecology, reproductive health, fertility and women's wellness.",
  },
  products: {
    eyebrow: "Featured Products",
    headline: ["Solutions Designed", "for Healthcare Needs."],
    body: "A focused portfolio spanning prescription and nutraceutical products, each manufactured by a qualified partner.",
  },
  quality: {
    eyebrow: "Quality & Trust",
    headline: ["Quality Built", "Into Every Dose."],
    body: "Our quality framework ensures that every product meets stringent standards across development, manufacturing and distribution.",
  },
  partners: {
    eyebrow: "Manufacturing Network",
    headline: ["Qualified", "Manufacturing Partners."],
    body: "At ZAFIEON PHARMA, we believe that quality begins long before a product reaches the patient. We work with carefully selected and qualified pharmaceutical manufacturing partners who share our commitment to quality, consistency, regulatory compliance, and responsible manufacturing practices.",
    cta: { label: "Explore Manufacturing", href: "/manufacturing" },
  },
  closing: {
    line1: "Every Dose",
    line2: "Matters.",
    body: "Building a trusted healthcare organization for today and a healthier tomorrow.",
    cta: { label: "Discover Zafieon", href: "/about" },
  },
} as const;

/* ============================================================================
   ABOUT
   ========================================================================== */

export const about = {
  hero: {
    eyebrow: "About Zafieon Pharma",
    line1: "Every Dose",
    line2: "Matters.",
    body: "A new-generation pharmaceutical company founded with a clear purpose—to contribute to better healthcare through quality, science, innovation, and responsible practices.",
  },
  story: {
    eyebrow: "Our Story",
    headline: ["A clear purpose,", "from the first dose."],
    body: [
      "ZAFIEON PHARMA was founded with a clear purpose: to contribute to better healthcare through quality, science, innovation and responsible practices.",
      "Behind the company sits more than twelve years of pharmaceutical industry experience—a deep understanding of how the industry works, what healthcare professionals need, and how products move from a manufacturing line to the person who ultimately takes them.",
      "That experience is paired with something newer: a fresh vision, an entrepreneurial spirit, and no legacy assumptions about how a pharmaceutical organization has to operate.",
    ],
  },
  journey: {
    eyebrow: "Our Journey",
    headline: ["Beginning in", "women's health."],
    body: [
      "ZAFIEON PHARMA is beginning its journey with a focused presence in Women's Health, with an emphasis on areas such as gynecology, reproductive health, fertility, and women's wellness.",
      "The long-term vision is to expand into multiple therapeutic divisions—building outward from a foundation of quality, qualified manufacturing partnerships and responsible practice rather than from scale alone.",
    ],
  },
  mission: {
    label: "Mission",
    body: "To deliver high-quality pharmaceutical products through reliable wholesale distribution, with a vision to grow into manufacturing and R&D.",
  },
  vision: {
    label: "Vision",
    body: "To become a leading pharma brand known for product integrity, innovation, and healthcare impact.",
  },
  values: [
    {
      id: "science",
      index: "01",
      title: "Science",
      body: "Sound science is the foundation of responsible pharmaceutical innovation.",
    },
    {
      id: "quality",
      index: "02",
      title: "Quality",
      body: "Maintaining quality and consistency throughout products and processes.",
    },
    {
      id: "integrity",
      index: "03",
      title: "Integrity",
      body: "Trust through transparency, ethical practices and responsible relationships.",
    },
    {
      id: "innovation",
      index: "04",
      title: "Innovation",
      body: "Seeking better ways to address changing healthcare needs.",
    },
    {
      id: "people",
      index: "05",
      title: "People",
      body: "Behind every product is a healthcare professional, a partner and ultimately a person whose health matters.",
    },
  ],
  commitment: {
    eyebrow: "Our Commitment",
    headline: ["Not simply a business.", "An organization."],
    body: [
      "At ZAFIEON PHARMA, we are not simply building a pharmaceutical business—we are building a long-term healthcare organization based on trust, responsibility, and meaningful partnerships.",
      "That commitment runs to quality and reliability in everything we supply; to the healthcare professionals who prescribe and dispense it; to the business partners who manufacture and distribute alongside us; and to the communities those products ultimately reach.",
    ],
  },
} as const;

/* ============================================================================
   QUALITY
   ========================================================================== */

export const quality = {
  hero: {
    eyebrow: "Quality",
    line1: "Quality is at the heart",
    line2: "of everything we do.",
    body: "At ZAFIEON PHARMA, we are committed to delivering products that meet stringent standards of quality, safety, efficacy and regulatory compliance. We work with carefully selected manufacturing partners and maintain a strong focus on quality throughout the product lifecycle.",
  },
  philosophy: {
    eyebrow: "Quality Philosophy",
    headline: ["Quality begins long before", "a product reaches the patient."],
    body: [
      "Quality is not a checkpoint at the end of a manufacturing line. It is a set of decisions made much earlier—about which partners to qualify, which standards to hold them to, how a product is documented, how it is packaged, and how reliably it can be supplied.",
      "Our role sits across that whole chain. We select and qualify manufacturing partners, maintain a focus on quality throughout the product lifecycle, and hold the same expectations across our prescription and nutraceutical ranges alike.",
    ],
  },
  pillars: [
    {
      id: "qualified-partners",
      title: "Qualified Partners",
      description:
        "Carefully selected manufacturing partners with appropriate capabilities and regulatory compliance.",
    },
    {
      id: "quality-assurance",
      title: "Quality Assurance",
      description:
        "A structured approach to maintaining consistency and product quality.",
    },
    {
      id: "quality-control",
      title: "Quality Control",
      description:
        "Appropriate testing and quality checks throughout the manufacturing process.",
    },
    {
      id: "regulatory-compliance",
      title: "Regulatory Compliance",
      description:
        "Commitment to applicable pharmaceutical regulations and manufacturing standards.",
    },
  ] satisfies QualityPillar[],
  lifecycle: [
    {
      id: "development",
      label: "Product Development",
      description:
        "Defining the product, its formulation and the standards it must meet.",
    },
    {
      id: "sourcing",
      label: "Sourcing",
      description:
        "Selecting and qualifying the manufacturing partner and material supply.",
    },
    {
      id: "manufacturing",
      label: "Manufacturing",
      description:
        "Production at a qualified facility under applicable manufacturing standards.",
    },
    {
      id: "testing",
      label: "Testing",
      description:
        "Appropriate quality checks and testing through the manufacturing process.",
    },
    {
      id: "documentation",
      label: "Documentation",
      description:
        "Batch records and product documentation maintained through the lifecycle.",
    },
    {
      id: "distribution",
      label: "Distribution",
      description:
        "Reliable supply to distributors, retailers and healthcare businesses.",
    },
  ] satisfies LifecycleStage[],
  certifications: {
    eyebrow: "Certifications",
    headline: ["Held by our", "manufacturing partners."],
    body: "The certifications below are held by the manufacturing partners named against them, as stated in the documentation each partner supplied. They are recorded here for transparency and are not presented as certifications held by Zafieon Pharma.",
    note: "Zafieon Pharma's own corporate certification records will be published here once finalised.",
  },
} as const;

/* ============================================================================
   MANUFACTURING
   ========================================================================== */

export const manufacturing = {
  hero: {
    eyebrow: "Manufacturing",
    line1: "Quality built",
    line2: "into every dose.",
    body: "At ZAFIEON PHARMA, we believe that quality begins long before a product reaches the patient. We work with carefully selected and qualified pharmaceutical manufacturing partners who share our commitment to quality, consistency, regulatory compliance, and responsible manufacturing practices.",
  },
  principles: [
    {
      id: "gmp",
      title: "Good Manufacturing Practice",
      body: "Partners are expected to manufacture under applicable Good Manufacturing Practice standards.",
    },
    {
      id: "regulatory",
      title: "Regulatory Requirements",
      body: "Compliance with the regulatory requirements applicable to each product and market.",
    },
    {
      id: "product-quality",
      title: "Product Quality",
      body: "Consistency of the finished product, batch to batch, across the portfolio.",
    },
    {
      id: "documentation",
      title: "Documentation",
      body: "Complete and traceable documentation maintained through manufacture.",
    },
    {
      id: "packaging",
      title: "Packaging",
      body: "Packaging that protects the product and carries accurate, compliant information.",
    },
    {
      id: "supply",
      title: "Supply Reliability",
      body: "Dependable supply, so that availability does not become the failure point.",
    },
    {
      id: "improvement",
      title: "Continuous Improvement",
      body: "An expectation of ongoing improvement in process and product quality.",
    },
    {
      id: "collaboration",
      title: "Collaboration",
      body: "Working relationships built for the long term rather than the transaction.",
    },
  ],
  directory: {
    eyebrow: "Partner Directory",
    headline: ["The network", "behind the portfolio."],
    body: "Each partner below manufactures under its own licences, certifications and quality systems. Select a partner to view its capabilities and the companies it manufactures for.",
  },
  presence: {
    eyebrow: "Global Presence",
    headline: ["Indian manufacturing,", "international reach."],
    body: "Zafieon Pharma's manufacturing partners are located across Himachal Pradesh, Punjab, Haryana and Gujarat. Export reach shown below is that of the individual partner named, as stated in its own corporate documentation.",
  },
} as const;

/* ============================================================================
   LEGAL / DISCLOSURE
   ========================================================================== */

export const disclosures = {
  prescriptionGate: {
    title: "Prescription product information",
    body: "The following product is available on prescription only. Information about prescription medicines is intended for registered healthcare professionals and members of the pharmaceutical trade, and is provided for reference. It is not an advertisement, and it is not a substitute for professional medical advice, diagnosis or treatment.",
    confirm: "I am a healthcare professional or trade visitor",
    decline: "Take me back",
  },
  partnerBrands:
    "The companies listed below are stated, in this partner's own corporate documentation, to be companies it manufactures for. They are the manufacturing partner's relationships. Zafieon Pharma neither owns these brands nor claims any commercial relationship with them.",
  certifications:
    "Certifications shown are held by the manufacturing partner named, as stated in that partner's documentation. They are not certifications held by Zafieon Pharma.",
} as const;
