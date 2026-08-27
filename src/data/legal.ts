/**
 * Legal pages.
 *
 * These are honest scaffolds, not boilerplate passed off as reviewed policy.
 * Zafieon supplied no legal copy, so each document states plainly what it
 * covers and carries a visible note that it is awaiting legal review. Replace
 * the `sections` content when counsel returns it; the routing and layout do
 * not need to change.
 */
export interface LegalDoc {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
  awaitingReview: boolean;
}

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    eyebrow: "Legal",
    intro:
      "This policy explains what Zafieon Pharma does with information you give us through this website.",
    awaitingReview: true,
    sections: [
      {
        heading: "What we collect",
        body: [
          "This website does not require you to create an account, and it does not ask for health information.",
          "If you send an enquiry through the contact form, we receive the name, company, email address, telephone number and message you choose to provide.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use what you send solely to respond to your enquiry and, where relevant, to continue that business conversation.",
          "We do not sell your information, and we do not use it for advertising.",
        ],
      },
      {
        heading: "Prescription product acknowledgement",
        body: [
          "Where you confirm that you are a healthcare professional or trade visitor in order to view prescription product information, that confirmation is stored in your browser for the current session only. It is not transmitted to us and it is cleared when you close the browser.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Write to us using the contact details on this site.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    eyebrow: "Legal",
    intro:
      "These terms govern your use of the Zafieon Pharma website.",
    awaitingReview: true,
    sections: [
      {
        heading: "Purpose of this website",
        body: [
          "This website provides general information about Zafieon Pharma, its portfolio and its manufacturing network. It is intended for distributors, wholesalers, medical retailers, hospitals, healthcare businesses and healthcare professionals.",
          "It is not a shop, and no product can be ordered through it.",
        ],
      },
      {
        heading: "Product information",
        body: [
          "Product information on this site is taken from product packaging and is provided for identification and reference. It is not the approved product information, and it is not medical advice.",
          "Prescription medicines are identified as such and are dispensed only against a valid prescription.",
        ],
      },
      {
        heading: "Third-party names",
        body: [
          "Names of manufacturing partners, their facilities, their certifications and the companies they manufacture for are reproduced from documentation those partners supplied. They remain the property of their respective owners and their appearance here does not imply any relationship with Zafieon Pharma beyond what is stated.",
        ],
      },
      {
        heading: "Changes",
        body: [
          "We may update this website and these terms. The version published here is the one that applies.",
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    eyebrow: "Legal",
    intro:
      "Important information about how the content on this website should and should not be used.",
    awaitingReview: true,
    sections: [
      {
        heading: "Not medical advice",
        body: [
          "Nothing on this website is medical advice, diagnosis or treatment. Always consult a qualified healthcare professional about any medical condition or medicine.",
        ],
      },
      {
        heading: "Prescription medicines",
        body: [
          "Information about prescription medicines on this site is intended for registered healthcare professionals and members of the pharmaceutical trade. It is provided for reference and is not an advertisement to the general public.",
        ],
      },
      {
        heading: "Nutraceutical products",
        body: [
          "Nutraceutical products are food products regulated under the applicable food safety framework. They are not intended to diagnose, treat, cure or prevent any disease.",
        ],
      },
      {
        heading: "Partner information",
        body: [
          "Capabilities, certifications, facilities and export markets attributed to a manufacturing partner are as stated in that partner's own corporate documentation. Zafieon Pharma reproduces them for transparency and does not present them as its own. Current certification status should be confirmed with the partner concerned.",
        ],
      },
    ],
  },
];

export const getLegalDoc = (slug: string) =>
  legalDocs.find((d) => d.slug === slug);
