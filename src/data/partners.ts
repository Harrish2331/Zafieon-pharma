import type { Partner } from "./types";

/**
 * Zafieon Pharma's qualified manufacturing partners.
 *
 * Sourced from the brochures in /Manufacturing network and from the Ravenbhel
 * Healthcare product catalogue. Where a document supplied nothing, the field is
 * omitted rather than filled; where Zafieon has supplied only a name and a
 * location, the record is marked `profileInterim` and says so on the page.
 *
 * IMPORTANT — `associatedBrands` lists companies that THE PARTNER manufactures
 * for, as printed in that partner's own brochure. They are not Zafieon
 * relationships and are never surfaced on the homepage; they appear only on the
 * partner's own detail page, under an explicit disclaimer.
 */
const partnerRecords: Partner[] = [
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
    retired: true,
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
    retired: true,
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

  {
    id: "ptr-08",
    slug: "ravenbhel-healthcare",
    name: "Ravenbhel Healthcare Pvt. Ltd.",
    shortName: "Ravenbhel Healthcare",
    logo: "/partners/ravenbhel-healthcare.webp",
    country: "India",
    region: "Punjab",
    tagline: "Your dependable formulation partner.",
    about: [
      "Ravenbhel Healthcare Pvt. Ltd. is an Indian formulation company working across contract development, scale-up and commercial manufacture, with its head office in Amritsar, Punjab.",
      "The business traces its origins to 1981 and to Macmillon Pharmaceutical Ltd. The group has since added Ravenbhel Pharmaceutical Pvt. Ltd. in 2001, Ravenbhel Healthcare Pvt. Ltd. in 2004, Ravenmac Pharmaceuticals Pvt. Ltd. in 2010, Oswin Pharmaceutical in 2013 and Ravenbhel Biotech in 2014.",
      "Manufacturing is organised across three units. Unit I serves domestic contract manufacturing and rest-of-world markets, Unit II — Ravenbhel Biotech — serves regulated markets, and Unit III — Macmillon Pharma — is dedicated to hormones.",
      "The catalogue runs across gynaecology, anti-diabetic, pain management, ortho, gastro, neuro, general and supplement ranges. The gynaecology range is hormone-led — dydrogesterone, progesterone, norethisterone, medroxyprogesterone acetate, allylestrenol, levonorgestrel and hydroxyprogesterone caproate — which is the capability most directly relevant to Zafieon Pharma's portfolio.",
      "The company states that it has sponsored and conducted six Phase IV clinical trials and twenty-six bioequivalence studies, and that it maintains in-house research and development alongside its manufacturing.",
    ],
    capabilities: [
      "Contract formulation development",
      "Scale-up and commercial manufacture",
      "Hormones — dedicated unit",
      "Tablets",
      "Capsules",
      "Oral liquids",
      "Sachets",
      "Sustained-release formulations",
      "In-house research and development",
      "Bioequivalence studies",
    ],
    regulatoryRegistrations: [
      "Ethiopian Food & Drug Authority (EFDA)",
      "Food and Drug Administration, Philippines",
      "Direction de la Pharmacie et du Medicament (DPM)",
      "Pharmacy and Poisons Board, Ministry of Health, Republic of Kenya",
      "National Agency for Food and Drug Administration and Control (NAFDAC), Nigeria",
      "Ministry of Health & Prevention, United Arab Emirates",
    ],
    certifications: ["WHO"],
    people: [
      { name: "Naresh Mahajan", role: "Founder" },
      { name: "Sahil Mahajan", role: "Successor" },
    ],
    facilities: [
      {
        name: "Ravenbhel Healthcare Pvt. Ltd.",
        location: "Amritsar, Punjab",
        role: "Unit I — domestic contract manufacturing and ROW markets",
      },
      {
        name: "Ravenbhel Biotech",
        location: "Amritsar, Punjab",
        role: "Unit II — regulated markets",
      },
      {
        name: "Macmillon Pharma",
        location: "Amritsar, Punjab",
        role: "Unit III — dedicated to hormones",
      },
      {
        name: "Head office",
        location: "17/2 Kennedy Avenue, Amritsar – 143 001, Punjab",
      },
    ],
    exportMarkets: [
      "Afghanistan", "Bolivia", "Cambodia", "Cameroon", "Costa Rica",
      "Dominican Republic", "Ecuador", "El Salvador", "Ethiopia", "Fiji",
      "Guatemala", "Honduras", "Ivory Coast", "Kenya", "Mali", "Mauritius",
      "Myanmar", "Nicaragua", "Nigeria", "Panama", "Philippines", "Thailand",
      "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zimbabwe",
    ],
    associatedBrands: [
      { id: "rb-01", name: "Abbott" },
      { id: "rb-02", name: "Ajanta Pharma" },
      { id: "rb-03", name: "Alembic" },
      { id: "rb-04", name: "Alkem Laboratories" },
      { id: "rb-05", name: "Aristo Pharmaceuticals" },
      { id: "rb-06", name: "BDR Pharmaceuticals" },
      { id: "rb-07", name: "Cadila" },
      { id: "rb-08", name: "Cipla" },
      { id: "rb-09", name: "Corona Remedies" },
      { id: "rb-10", name: "Dr. Reddy’s Laboratories" },
      { id: "rb-11", name: "Emcure Pharmaceuticals" },
      { id: "rb-12", name: "Eris Lifesciences" },
      { id: "rb-13", name: "Glenmark Pharmaceuticals" },
      { id: "rb-14", name: "Hetero" },
      { id: "rb-15", name: "Intas Pharmaceuticals" },
      { id: "rb-16", name: "Ipca Laboratories" },
      { id: "rb-17", name: "Lupin" },
      { id: "rb-18", name: "Macleods Pharmaceuticals" },
      { id: "rb-19", name: "Mankind Pharma" },
      { id: "rb-20", name: "MSN Laboratories" },
      { id: "rb-21", name: "Novartis" },
      { id: "rb-22", name: "Sun Pharma" },
      { id: "rb-23", name: "Systopic Laboratories" },
      { id: "rb-24", name: "Torrent Pharmaceuticals" },
      { id: "rb-25", name: "Walter Bushnell" },
      { id: "rb-26", name: "Zydus" },
    ],
    planned: {
      title: "Sterile injectables and R&D facility",
      operator: "Biovonic Healthcare Pvt. Ltd.",
      items: [
        "Liquid vials — 3 million per annum",
        "Liquid ampoules — 200 million per annum",
        "Dry powder injections — 2 million per annum",
        "Lyophilized injectables — 18 million per annum",
        "Pre-filled syringes and cartridges — 5 million per annum",
      ],
    },
    website: "www.ravenbhel.com",
    qualifiers: [
      "The company is named Ravenbhel Healthcare Pvt. Ltd. throughout its own product catalogue. It appears as “Revenbhel” in Zafieon’s brief; the brochure spelling is used here.",
      "The catalogue states that Unit III is compliant with USFDA, UK MHRA and PIC/S requirements. That is the partner’s own statement of the standard the unit is built to — not evidence of an inspection outcome or an approval held — and no regulator’s emblem is shown against it.",
      "The regulatory registrations listed are those printed on the partner’s certifications page. They are market registrations held by Ravenbhel, and they say nothing about the registration status of any Zafieon Pharma product.",
      "The sterile injectables and R&D facility is announced in the catalogue as upcoming, under Biovonic Healthcare Pvt. Ltd. The capacities stated are planned, not installed.",
      "The catalogue states forty-three years of experience and dates the group’s origins to 1981. The figure is reproduced as printed.",
    ],
    source:
      "source-assets/partners/ravenbhel-healthcare-product-catalogue.pdf",
  },

  {
    id: "ptr-09",
    slug: "heliyac-healthcare",
    name: "Heliyac Healthcare Pvt. Ltd.",
    shortName: "Heliyac Healthcare",
    logo: "/partners/heliyac-healthcare.webp",
    country: "India",
    region: "Pondicherry",
    profileInterim: true,
    tagline:
      "A qualified manufacturing partner in the Pondicherry formulation cluster.",
    about: [
      "Heliyac Healthcare Pvt. Ltd. is a manufacturing partner in Zafieon Pharma’s network, located in Pondicherry.",
      "Pondicherry is one of India’s established formulation manufacturing centres. Partners there are qualified against the same expectations Zafieon applies across its whole network: manufacture under applicable Good Manufacturing Practice standards, compliance with the regulatory requirements that apply to each product and market, complete and traceable batch documentation, packaging that protects the product and carries accurate information, and dependable supply.",
      "A full company profile — facilities, dosage-form capability, quality systems and certification records — will be published here once Heliyac Healthcare’s corporate documentation has been received and verified.",
    ],
    facilities: [{ name: "Manufacturing unit", location: "Pondicherry" }],
    qualifiers: [
      "Zafieon Pharma has supplied this partner’s name and location. No corporate brochure has been received yet, so the profile above sets out the expectations Zafieon applies to every partner rather than facts documented by Heliyac Healthcare. No capability, certification, facility or export market is claimed on the partner’s behalf.",
    ],
    source:
      "Client-supplied name and location (source-assets/partners/heliyac.png). Corporate documentation pending.",
  },

  {
    id: "ptr-10",
    slug: "amagen-pharma",
    name: "Amagen Pharma Private Limited",
    shortName: "Amagen Pharma",
    logo: "/partners/amagen-pharma.webp",
    country: "India",
    region: "Himachal Pradesh",
    profileInterim: true,
    tagline:
      "A qualified manufacturing partner in the Himachal Pradesh pharmaceutical belt.",
    about: [
      "Amagen Pharma Private Limited is a manufacturing partner in Zafieon Pharma’s network, located in Himachal Pradesh.",
      "Himachal Pradesh holds the largest concentration of formulation manufacturing in India, and it is where most of Zafieon’s network already sits. Partners there are qualified against the same expectations Zafieon applies everywhere: manufacture under applicable Good Manufacturing Practice standards, compliance with the regulatory requirements that apply to each product and market, complete and traceable batch documentation, packaging that protects the product and carries accurate information, and dependable supply.",
      "A full company profile — facilities, dosage-form capability, quality systems and certification records — will be published here once Amagen Pharma’s corporate documentation has been received and verified.",
    ],
    facilities: [{ name: "Manufacturing unit", location: "Himachal Pradesh" }],
    qualifiers: [
      "Zafieon Pharma has supplied this partner’s name and location. No corporate brochure has been received yet, so the profile above sets out the expectations Zafieon applies to every partner rather than facts documented by Amagen Pharma. No capability, certification, facility or export market is claimed on the partner’s behalf.",
      "The supplied logo is a photograph of dimensional signage rather than flat artwork. Vector or transparent artwork would sit more consistently beside the other partner marks.",
    ],
    source: "Client-supplied name and location. Corporate documentation pending.",
  },
];

/**
 * The public directory order, fixed by Zafieon Pharma.
 *
 * Listed by slug rather than by array position so the order survives edits to
 * the records above, and so a typo fails the build instead of silently
 * dropping a partner from the site.
 */
const DIRECTORY_ORDER = [
  "symbiosis-group",
  "bionexy-pharma",
  "ravenbhel-healthcare",
  "philanto-wellness",
  "eurocrit-labs",
  "janus-biotech-india",
  "heliyac-healthcare",
  "amagen-pharma",
] as const;

/** Every record, retired partners included. Used by the claims audit only. */
export const allPartners = partnerRecords;

/**
 * The partners the site shows, in Zafieon's order.
 *
 * Systole Remedies and Unilite India are retained in `partnerRecords` with
 * `retired: true` — their supplied documentation is not discarded — but they
 * are absent from every listing, route and sitemap entry.
 */
export const partners: Partner[] = DIRECTORY_ORDER.map((slug) => {
  const p = partnerRecords.find((x) => x.slug === slug);
  if (!p) throw new Error(`DIRECTORY_ORDER names an unknown partner: ${slug}`);
  if (p.retired) throw new Error(`DIRECTORY_ORDER names a retired partner: ${slug}`);
  return p;
});

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
