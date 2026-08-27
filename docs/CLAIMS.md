# Claims Register — zafieonpharma.com

Every factual statement published on this site, and the supplied document it
comes from. If a claim is not in this table, it does not belong on the site.

This register exists because the mockup supplied at the start of the project
(`ZAFIEON PHARMA branding/Sample.png`) carried a **"USFDA COMPLIANT"** badge, a
world map of "global manufacturing partners", and four products that do not
exist. None of that was supported by anything in the source material. The rule
from here on: **no claim ships without a row in this table.**

---

## 1. Company claims

| Claim as published | Where it appears | Source | Status |
|---|---|---|---|
| "Every Dose Matters" (tagline) | Site-wide | Brand Guidelines p.2 — "Tagline: Every Dose Matters" | ✅ Verified |
| "Precision in science. Care in every dose." | Homepage closing, Contact | Creative concept supplied in the build brief (§6) | ✅ Client-supplied |
| "New-generation pharmaceutical company founded with a clear purpose…" | Hero, About | Client-supplied About copy (build brief §14, §29) | ✅ Client-supplied |
| **"More than 12 years of pharmaceutical industry experience" / "12+"** | Home About, About page | Client-supplied About copy (build brief §15, §29) | ⚠️ **Client-asserted — not evidenced in any supplied document.** Flagged in audit; client reaffirmed in the build brief. Zafieon should be able to substantiate this on request. |
| Mission: "…reliable wholesale distribution, with a vision to grow into manufacturing and R&D." | About | Brand Guidelines p.3 — Brand Mission | ✅ Verified |
| Vision: "…product integrity, innovation, and healthcare impact." | About | Brand Guidelines p.3 — Brand Vision | ✅ Verified |
| Values: Science · Quality · Integrity · Innovation · People | Hero register, About | Build brief §31 (client-supplied) | ✅ Client-supplied |
| "Beginning its journey with a focused presence in Women's Health…" | About, Our Focus | Build brief §30 (client-supplied) | ✅ Client-supplied |
| Office photograph presented as Zafieon's reception | Home About, About | `The office.jpeg` | ⚠️ **Unconfirmed.** Image appears generated/composited. Confirm it depicts a real Zafieon premises before launch, or replace it. |

### Claims deliberately NOT made

| Not published | Why |
|---|---|
| USFDA compliance / registration | No supporting document exists. Present in the supplied mockup; removed. |
| "Global manufacturing partners" | Every supplied partner manufactures in India. |
| Any Zafieon-held GMP / ISO / WHO / PIC-S certification | Zafieon holds no corporate certification in the supplied material. |
| Any product efficacy, benefit, indication, dosage or safety claim | None supplied, and none may be inferred. |
| Registered address, telephone number | Not supplied. Rendered as "To be confirmed". |

---

## 2. Product claims

All nine products are described **only** from the supplied pack artwork. No
indication, dosage, benefit or efficacy statement appears anywhere. Where a
purpose statement is printed on the pack itself (Ferrin-XT: "food for managing
iron and folate reserves in pregnancy"), it is reproduced verbatim as a pack
marking and attributed to the pack — never restated as a Zafieon claim.

| Product | Fields published | Source file |
|---|---|---|
| Femi-Dros 30 | Name · composition · pack · Rx marking | `Product Images/Femi dros.jpeg` |
| Femi-Dros 20 | Name · composition · pack · Rx marking | `Product Images/Femi dros 0.2.jpeg` |
| MISO-PRO | Name · composition · pack · Rx marking | `Product Images/MISO-pro tablets.png` |
| Zyfolic | Name · composition · pack | `Product Images/Zyfolic softgel capsules.png` |
| Femulet | Name · composition · pack · FSSAI Lic. 22426535000422 · vegetarian mark | `Product Images/Femulet tablets.png` |
| Florabet LL | Name · composition · pack · vegetarian mark | `Product Images/Florabet LL.png` |
| Let Bloom | Name · composition · pack · Rx marking | `source-assets/images/Letrozole.png` |
| Mifiprine | Name · composition · pack · Rx marking | `source-assets/images/Mifiprine.png` |
| Ferrin-XT | Name · composition · pack · pack statements · vegetarian mark | `source-assets/images/Ferrin XT.png` |

**Therapeutic-area assignment** (gynecology / reproductive health / fertility /
women's wellness) is editorial categorisation by composition and pack copy, not
a clinical claim. It drives navigation only.

### Regulatory handling

- **Femi-Dros 20, Femi-Dros 30, MISO-PRO, Let Bloom (Letrozole) and Mifiprine
  (Mifepristone)** are Schedule H prescription medicines. Under the Drugs and Magic Remedies (Objectionable Advertisements)
  Act 1954 and the Drugs & Cosmetics Rules, promoting them to the general public
  is restricted. Their pages therefore:
  - sit behind a healthcare-professional / trade acknowledgement
    (`PrescriptionGate`), with content not rendered until acknowledged;
  - are set `robots: noindex`;
  - are excluded from `sitemap.xml`;
  - carry factual, non-promotional copy only.
- **Mifepristone and Misoprostol** are, together, the medical abortion regimen.
  In India their supply is restricted well beyond ordinary Schedule H: sale is
  permitted only to a registered medical practitioner or a hospital approved
  under the Medical Termination of Pregnancy Act, and the Drugs and Magic
  Remedies (Objectionable Advertisements) Act 1954 specifically prohibits
  advertising anything for procuring miscarriage. **Both product pages are
  gated, noindex and excluded from the sitemap, and carry composition and pack
  facts only.** Zafieon should confirm its own supply-chain compliance for these
  two products before launch, and may wish to take a view on whether they belong
  on a public website at all.
- **Femulet, Florabet LL, Ferrin-XT** are FSSAI nutraceuticals / foods for
  special dietary use and carry the standard "not
  intended to diagnose, treat, cure or prevent any disease" statement.
- Two packs (**MISO-PRO**, **Florabet LL**) and two others (**Zyfolic**,
  **Femulet**) carry no Zafieon mark in the supplied artwork. Flagged for client
  confirmation; `zafieonBranded` is recorded per product in `src/data/products.ts`.

---

## 3. Manufacturing partner claims

Everything on partner pages is attributed to the partner and sourced from that
partner's own brochure. Nothing is presented as Zafieon's.

| Partner | Published | Source |
|---|---|---|
| Symbiosis Group | 7 units + 3 support sites, capabilities, ISO 9001:2015 / GMP / WHO / PIC-S, 39 export markets, 24 client companies | `Manufacturing network/symbiosis.pdf` |
| Systole Remedies | CRAMS, 14 dosage capabilities, 2 directors, GMP + GLP certificate numbers, licence to 12.11.2026 | `Manufacturing network/systol remedies.pdf` |
| Eurocrit Labs | 5 capabilities, 18 client companies | `Manufacturing network/eurocrit labs.pdf` |
| Philanto Wellness | 4 capabilities, 2 named people, 2 sites, "500+ approvals" | `Manufacturing network/philant wellness.pdf` |
| Bionexy Pharma | 2 capabilities, 3 MDs, GMP/GLP/ISO/WHO badges | `Manufacturing network/bionexy pharma and unilite india injection.pdf` |
| Unilite India | 4 capabilities, Baddi site, GMP/GLP, associations | same file |
| Janus Biotech India | Name and country only | `Manufacturing network/janus biotech india.pdf` — cover page only |

### Qualifiers surfaced on the site (not buried)

- **Systole Remedies** — the supplied GMP and GLP certificates state on their
  face that they are valid two years from issue and were issued for the limited
  purpose of government/institutional tender submission. Published as a visible
  qualifier on the partner page.
- **Philanto Wellness** — its own profile states both a 15-year history and 5
  years of manufacturing experience. Both reproduced; qualifier published.
- **Bionexy Pharma** — certification marks are brochure badges; no certificate
  documents were supplied. Qualifier published.
- **Symbiosis Group** — its export list includes "Kurdistan", which is not a
  sovereign state. Reproduced as printed; **client decision needed** before
  launch.

### Partner logos

Each partner card shows that partner's own logo. All seven are **client-supplied
cropped artwork**, replacing the earlier brochure extractions. They are clean,
complete and correctly proportioned.

**Permission still outstanding.** These are third-party trademarks. Zafieon
holds each partner's brochure, which implies a working relationship, but written
consent to reproduce their marks on zafieonpharma.com should be obtained before
launch.

### Certification marks

Marks are resolved from each partner's own claim strings by
`src/data/certifications.ts`. There is deliberately no way to attach a mark to a
partner except by that partner claiming the certification in `partners.ts`, so a
mark can never assert something the source documents do not.

| Mark | Supplied? | Shown for |
|---|---|---|
| GMP | ✅ generic "GMP certified" seal | Symbiosis, Systole, Bionexy, Unilite |
| GLP | ✅ generic "GLP certified" seal | Systole, Bionexy, Unilite |
| ISO 9001 | ✅ generic "ISO 9001:2015 certified" seal | Symbiosis, Bionexy |
| WHO | ✅ the WHO emblem | Symbiosis, Bionexy |
| PIC/S | ❌ none — drawn seal used | Symbiosis |
| Manufacturing licence | ❌ none — drawn seal used | Systole |

Where no artwork was supplied, the site's own drawn seal is used. **No official
regulator or standards-body emblem has been recreated.** Fabricating a
regulator's mark to make a claim look more official is the exact failure mode
this register exists to prevent.

> ### ⚠️ Two marks need a decision before launch
>
> **The WHO emblem.** The emblem shown is the genuine World Health Organization
> emblem. Two problems:
> 1. It is protected under Article 6ter of the Paris Convention, and in India
>    specifically by the **Emblems and Names (Prevention of Improper Use) Act,
>    1950**, whose Schedule lists the WHO name and emblem. Commercial use
>    without Central Government authorisation is an offence.
> 2. **The WHO does not certify manufacturers.** WHO-GMP certificates are issued
>    by national or state drug regulators applying WHO guidelines. The emblem is
>    not the correct visual for that claim. The site surfaces this in a note
>    beside the mark, but the note does not cure the first problem.
>
> **The ISO seal.** ISO's own policy is that it does not perform certification
> and that **certified organisations may not use the ISO logo**. The supplied
> seal is a generic third-party "ISO 9001 certified" badge that embeds the ISO
> wordmark.
>
> Both are one-line changes: delete the `logo` property from the `who` or `iso`
> entry in `src/data/certifications.ts` and that mark falls back to the site's
> drawn seal automatically, everywhere, with no other edits. The certification
> text itself is unaffected either way.
>
> Note also that Bionexy's GMP/GLP/ISO/WHO claims are **brochure badges with no
> certificate documents supplied** — already flagged above. Rendering them as
> large official-looking emblems increases the weight of an unverified claim.

### Associated brands

The ~42 companies listed under Eurocrit Labs and Symbiosis Group are companies
**those partners** manufacture for. They appear only on that partner's own
detail page, under a disclaimer that leads the section, and:

- are **never** shown on the homepage;
- are set as text, not reproduced logos — the only artwork available is
  photographs of printed brochures, and reproducing third-party trademarks from
  those scans carries both quality and legal exposure;
- carry an explicit statement that Zafieon neither owns them nor claims any
  relationship with them.

---

## 4. Derived figures

Computed from the data, not asserted:

| Figure | How derived |
|---|---|
| "07 manufacturing partners" | `partners.length` |
| "14 documented facilities" | Sum of `facilities[]` across partners |
| "05 partners with stated certifications" | Count where `certifications[]` is non-empty |
| "39 export markets reached by partners" | Distinct union of `exportMarkets[]` — attributed to Symbiosis in the caption |
| Per-state site counts on the footprint | Facilities whose `location` names that state |

---

## 5. Open items before launch

1. Legal entity name, CIN, GST, registered address, telephone.
2. Confirm `The office.jpeg` shows real Zafieon premises.
3. Substantiation for "12+ years of pharmaceutical industry experience".
4. Decision on "Kurdistan" in the Symbiosis export list.
5. Current certification status for Systole Remedies (supplied certificates appear expired).
6. Confirm the four packs that carry no Zafieon mark.
7. **Confirm the regulatory position on Mifiprine and Let Bloom** — see §2.
8. FM Bolyar Sans Pro **webfont licence** — the font is self-hosted at
   `src/fonts/FMBolyarSansPro-700.woff2` and is not a Google Font.
8. Legal review of `/legal/privacy`, `/legal/terms`, `/legal/disclaimer` — all
   three currently render an "Awaiting legal review" banner.
9. A real endpoint for the contact form (currently hands off to the visitor's
   mail client — see `src/components/ContactForm.tsx`).
10. Written consent from each manufacturing partner to reproduce its logo.
11. **A decision on the WHO emblem and the ISO seal** — see the boxed note in
    §3. Both carry a legal-use problem independent of whether the underlying
    claim is true.
