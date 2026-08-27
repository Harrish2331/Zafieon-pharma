import type { Partner } from "./types";

/**
 * Zafieon Pharma's qualified manufacturing partners.
 *
 * Sourced entirely from the six brochures in /Manufacturing network. Where a
 * brochure supplied nothing, the field is omitted rather than filled.
 *
 * IMPORTANT — `associatedBrands` lists companies that THE PARTNER manufactures
 * for, as printed in that partner's own brochure. They are not Zafieon
 * relationships and are never surfaced on the homepage; they appear only on the
 * partner's own detail page, under an explicit disclaimer.
 */
export const partners: Partner[] = [
  {
    id: "ptr-01",
    slug: "symbiosis-group",
    name: "Symbiosis Group of Pharma Companies",
    shortName: "Symbiosis Group",
    logo: "/partners/symbiosis-group.webp",
    country: "India",
    region: "Himachal Pradesh · Gujarat · Haryana",
    tagline: "Seven manufacturing units in the foothills of the Shivalik Range.",
    about: [
      "Symbiosis Group manufactures across pharmaceuticals, nutraceuticals, dermaceuticals, hormones, soft gels, pellets and medicated suppositories.",
      "The group operates seven manufacturing units, each with self-contained quality control laboratories and R&D facilities, managed by pharma professionals supported by manufacturing, quality assurance, quality control and research personnel.",
    ],
    capabilities: [
      "Pharmaceuticals",
      "Nutraceuticals",
      "Dermaceuticals",
      "Hormones",
      "Soft gels",
      "Pellets",
      "Medicated suppositories",
    ],
    certifications: [
      "ISO 9001:2015",
      "GMP",
      "WHO",
      "PIC/S Approved",
    ],
    facilities: [
      {
        name: "Symbiosis Pharmaceuticals Pvt. Ltd.",
        location: "Suketi Road, Kala Amb – 173030, Himachal Pradesh",
        role: "Plant I",
      },
      {
        name: "Saitech Medicare Pvt. Ltd.",
        location: "Trilokpur Road, Kala Amb – 173030, Himachal Pradesh",
        role: "Plant II",
      },
      {
        name: "Ovation Remedies",
        location: "Trilokpur Road, Kala Amb – 173030, Himachal Pradesh",
        role: "Plant III",
      },
      {
        name: "Prism Medico & Pharmacy Ltd.",
        location: "Suketi Road, Kala Amb – 173030, Himachal Pradesh",
        role: "Plant IV",
      },
      {
        name: "Infuze Well Private Limited",
        location: "Shahzadpur, Ambala, Haryana",
        role: "Plant V",
      },
      {
        name: "Hightech Healthcare",
        location: "Kala Amb – 173030, Himachal Pradesh",
      },
      {
        name: "Symbiosis Bioscience Pvt. Ltd.",
        location: "Makarba, Ahmedabad – 380051, Gujarat",
      },
      {
        name: "Balaji Prelams Pvt. Ltd.",
        location: "Trilokpur Road, Kala Amb – 173030, Himachal Pradesh",
        role: "Bottling",
      },
      {
        name: "Tejas Medipack",
        location: "Suketi Road, Kala Amb – 173030, Himachal Pradesh",
        role: "Printing",
      },
      {
        name: "NK Industries",
        location: "Suketi Road, Kala Amb – 173030, Himachal Pradesh",
        role: "Printing",
      },
    ],
    exportMarkets: [
      "Afghanistan", "Angola", "Azerbaijan", "Bolivia", "Cambodia", "Cameroon",
      "Chile", "DRC (Congo)", "Ethiopia", "Guatemala", "Ghana", "Georgia",
      "Iraq", "Iran", "Jordan", "Kenya", "Kurdistan", "Liberia", "Libya",
      "Mali", "Madagascar", "Malawi", "Mauritius", "Mozambique", "Myanmar",
      "Nigeria", "Peru", "Philippines", "Rwanda", "Somalia", "Sri Lanka",
      "South Sudan", "Tanzania", "Tajikistan", "Uganda", "Uzbekistan",
      "Venezuela", "Yemen", "Zambia",
    ],
    associatedBrands: [
      { id: "sb-01", name: "Acme Pharmaceuticals" },
      { id: "sb-02", name: "Bestochem" },
      { id: "sb-03", name: "Corona Remedies Pvt. Ltd." },
      { id: "sb-04", name: "Galpha Laboratories Limited" },
      { id: "sb-05", name: "Hegde & Hegde Pharmaceutica LLP" },
      { id: "sb-06", name: "Lifekyor Pharmaceuticals" },
      { id: "sb-07", name: "Sarabhai Chemicals" },
      { id: "sb-08", name: "Wallace Pharmaceuticals Pvt. Ltd." },
      { id: "sb-09", name: "AN Pharmaceuticals Pvt. Ltd." },
      { id: "sb-10", name: "Cadila Pharmaceuticals Limited" },
      { id: "sb-11", name: "D.R. Johns Lab Pharmaceuticals Pvt. Ltd." },
      { id: "sb-12", name: "Gufic Biosciences Limited" },
      { id: "sb-13", name: "Intas Pharmaceuticals Ltd." },
      { id: "sb-14", name: "Medley" },
      { id: "sb-15", name: "Troikaa" },
      { id: "sb-16", name: "Zydus Healthcare Limited" },
      { id: "sb-17", name: "Anglo-French" },
      { id: "sb-18", name: "Comed" },
      { id: "sb-19", name: "DWD" },
      { id: "sb-20", name: "Gopal", note: "A WHO GMP certified company" },
      { id: "sb-21", name: "Knoll" },
      { id: "sb-22", name: "Dr. Morepen" },
      { id: "sb-23", name: "Universal Medicare Ltd." },
      { id: "sb-24", name: "Zota Pharmaceuticals" },
    ],
    website: "www.symbiosispharmaceuticals.com",
    qualifiers: [
      "Certification marks and export markets listed here are Symbiosis Group's own, as stated in its corporate brochure.",
    ],
    source: "Manufacturing network/symbiosis.pdf",
  },

  {
    id: "ptr-02",
    slug: "systole-remedies",
    name: "Systole Remedies Private Limited",
    shortName: "Systole Remedies",
    logo: "/partners/systole-remedies.webp",
    country: "India",
    region: "Himachal Pradesh",
    tagline: "Contract research and manufacturing services across all dosage forms.",
    about: [
      "Systole Remedies operates in CRAMS — Contract Research & Manufacturing Services — with a technology-driven and research-oriented approach to formulation development.",
      "Beyond contract manufacturing, the company undertakes bioequivalence studies and clinical trials, and files applications with the Drug Controller General of India for the approval of new fixed dose combinations and molecules.",
      "Nine facilities and laboratories support product, service and methodology development.",
    ],
    capabilities: [
      "Tablets",
      "Capsules",
      "Hard gelatin",
      "Dry syrup",
      "Liquid orals",
      "Injections (dry and liquid)",
      "Pre-filled syringes",
      "Eye and ear drops",
      "Hormones",
      "Cosmetics",
      "Ointments",
      "Ayurvedic and herbal",
      "Nutraceuticals",
      "Veterinary",
    ],
    certifications: [
      "GMP Certificate No. HFW-II (Drugs) 288.06 — Health & Family Welfare Department, Himachal Pradesh",
      "GLP Certificate No. HFW-II (Drugs) 188.06 — Health & Family Welfare Department, Himachal Pradesh",
      "Drug Manufacturing Licence Form 25 & 28, Nos. MNB/06/434 and MB/06/435 — valid to 12.11.2026",
    ],
    people: [
      { name: "Jitender Mohan Kalra", role: "Director" },
      { name: "Mandeep Singh Kalra", role: "Director" },
    ],
    facilities: [
      {
        name: "Systole Remedies Pvt. Ltd.",
        location: "Village Ogli, Tehsil Nahan, District Sirmaur, Himachal Pradesh",
      },
    ],
    website: "www.systoleremedies.com",
    qualifiers: [
      "The supplied GMP and GLP certificates state on their face that they are valid for two years from date of issue, and that they were issued for the limited purpose of submission in connection with government hospital, corporation, defence and non-regulated market tenders. Current certification status should be confirmed with the partner.",
    ],
    source: "Manufacturing network/systol remedies.pdf",
  },

  {
    id: "ptr-03",
    slug: "eurocrit-labs",
    name: "Eurocrit Labs International Pvt. Ltd.",
    shortName: "Eurocrit Labs",
    logo: "/partners/eurocrit-labs.webp",
    country: "India",
    tagline: "Human Values… Innovating Without Hassle.",
    about: [
      "Eurocrit Labs International is a manufacturer of parenteral and liquid formulations, working across large volume parenterals, respules, sachets and form-fill-seal oral solutions.",
    ],
    capabilities: [
      "Parenteral drugs (LVP)",
      "Respules (SVP)",
      "Sachets (drug)",
      "Oral solutions — FFS",
      "Probiotic oral solution",
    ],
    associatedBrands: [
      { id: "eb-01", name: "Aurobindo" },
      { id: "eb-02", name: "Aequitas Healthcare" },
      { id: "eb-03", name: "Amneal" },
      { id: "eb-04", name: "Biological E. Limited" },
      { id: "eb-05", name: "Concord Biotech Limited" },
      { id: "eb-06", name: "GlenSmith" },
      { id: "eb-07", name: "Gland" },
      { id: "eb-08", name: "Jagsonpal" },
      { id: "eb-09", name: "JB" },
      { id: "eb-10", name: "Koyé" },
      { id: "eb-11", name: "Laborate Pharmaceuticals India Ltd." },
      { id: "eb-12", name: "Linux" },
      { id: "eb-13", name: "Medopharm" },
      { id: "eb-14", name: "Micro Labs" },
      { id: "eb-15", name: "Neon" },
      { id: "eb-16", name: "Questus" },
      { id: "eb-17", name: "Stedman" },
      { id: "eb-18", name: "Zymes Nutritions" },
    ],
    website: "www.eurocrit.com",
    source: "Manufacturing network/eurocrit labs.pdf",
  },

  {
    id: "ptr-04",
    slug: "philanto-wellness",
    name: "Philanto Wellness",
    shortName: "Philanto Wellness",
    logo: "/partners/philanto-wellness.webp",
    country: "India",
    region: "Punjab",
    tagline: "Third-party manufacturing across tablets, capsules, syrups and ointments.",
    about: [
      "Philanto Wellness is a third-party pharmaceutical manufacturer located at Dera Bassi, S.A.S. Nagar, Mohali, manufacturing tablets, capsules, syrups and ointments.",
      "The company states that its products meet relevant pharmacopoeial standards and statutory requirements, and that design, development and manufacture are managed to deliver consistent quality performance.",
      "Manufacturing volumes cited in the company profile peak at 1,000 million tablets, 200 million capsules, 50 million oral liquid and 10 million beta-lactam and syrup units.",
    ],
    capabilities: ["Tablets", "Capsules", "Syrups", "Ointments"],
    certifications: ["More than 500 product approvals (as stated by the partner)"],
    people: [
      { name: "Dinesh Raghav", role: "Managing Director" },
      { name: "Aisha Parveen", role: "General Manager" },
    ],
    facilities: [
      {
        name: "Manufacturing unit",
        location:
          "Village Behra Road, Dera Bassi, District S.A.S. Nagar, Mohali, Punjab",
      },
      {
        name: "Corporate office",
        location: "Plot No. 14, Arjun Nagar, Nanhera, Ambala Cantt",
      },
    ],
    website: "www.philantowellness.com",
    qualifiers: [
      "The supplied company profile refers both to a fifteen-year distribution and manufacturing history and to five years of manufacturing experience. The two figures are reproduced as printed; the partner should be asked to reconcile them before publication.",
    ],
    source: "Manufacturing network/philant wellness.pdf",
  },

  {
    id: "ptr-05",
    slug: "bionexy-pharma",
    name: "Bionexy Pharma",
    shortName: "Bionexy Pharma",
    logo: "/partners/bionexy-pharma.webp",
    country: "India",
    tagline: "A facility dedicated to soft gelatin capsules and hormonal tablets.",
    about: [
      "Bionexy Pharma began as a distribution business in 2021 and moved into manufacturing in 2022, after building a marketing network across India.",
      "The facility is dedicated to the production of soft gelatin capsules and hormonal tablets, and is divided into departments covering infrastructure, equipment and delivery of finished pharmaceuticals.",
      "The company states that its manufacturing is carried out under World Health Organization Good Manufacturing Practice principles.",
    ],
    capabilities: ["Soft gelatin capsules", "Hormonal tablets"],
    certifications: ["GMP", "GLP", "ISO 9001:2015", "WHO"],
    people: [
      { name: "Mohit Goel", role: "Managing Director" },
      { name: "Kamal Goel", role: "Managing Director" },
      { name: "Arun Tirpathi", role: "Managing Director" },
    ],
    associations: ["Unilite India"],
    website: "www.bionexy.in",
    qualifiers: [
      "Certification marks are reproduced from the partner's brochure. Certificate documents were not supplied.",
    ],
    source: "Manufacturing network/bionexy pharma and unilite india injection.pdf",
  },

  {
    id: "ptr-06",
    slug: "unilite-india",
    name: "Unilite India",
    shortName: "Unilite India",
    logo: "/partners/unilite-india.webp",
    country: "India",
    region: "Himachal Pradesh",
    tagline: "Commitment to quality and care — sterile ophthalmic and injectable formulations.",
    about: [
      "Unilite India is a pharmaceutical manufacturing company specialising in sterile ophthalmic and injectable formulations, with over twenty years of pharmaceutical industry experience.",
      "The facility is equipped with water-for-injection generation systems, EDI technology and online monitoring systems, alongside precision filling technology.",
      "The company's stated focus covers ophthalmic formulations, injectable formulations, customised third-party manufacturing and private labelling.",
    ],
    capabilities: [
      "Ophthalmic formulations — eye, nasal and ear drops",
      "Injectable formulations — ampoules and dispo packs",
      "Customised third-party manufacturing",
      "Private labelling",
    ],
    certifications: ["Certified for GMP standards", "Certified for GLP standards"],
    facilities: [
      {
        name: "Manufacturing unit",
        location:
          "Plot No. 23A, Industrial Area, Lodhi Majra, Baddi, District Solan, Himachal Pradesh 174101",
        role: "89 km from Chandigarh International Airport",
      },
    ],
    associations: ["Bionexy Pharma", "Indizen Pharmaceutical"],
    source: "Manufacturing network/bionexy pharma and unilite india injection.pdf",
  },

  {
    id: "ptr-07",
    slug: "janus-biotech-india",
    name: "Janus Biotech India Pvt. Ltd.",
    shortName: "Janus Biotech India",
    logo: "/partners/janus-biotech-india.webp",
    country: "India",
    profilePending: true,
    source: "Manufacturing network/janus biotech india.pdf",
  },
];

export const getPartner = (slug: string) =>
  partners.find((p) => p.slug === slug);

/** Partners with a usable profile, ordered for display. */
export const activePartners = partners.filter((p) => !p.profilePending);

/** Every distinct country a supplied partner manufactures in. */
export const partnerCountries = Array.from(
  new Set(partners.map((p) => p.country)),
);

/** Export markets, attributed. Never presented as Zafieon's own reach. */
export const exportReach = partners
  .filter((p) => p.exportMarkets?.length)
  .map((p) => ({
    partner: p.shortName,
    slug: p.slug,
    markets: p.exportMarkets ?? [],
  }));

export const totalExportMarkets = Array.from(
  new Set(exportReach.flatMap((e) => e.markets)),
).length;
