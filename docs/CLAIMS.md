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
| ~~"More than 12 years of pharmaceutical industry experience" / "12+"~~ | — | — | ✅ **Removed at Zafieon's instruction.** The "12+" figure was never evidenced in any supplied document and was flagged in the original audit. It has been taken out of the homepage statistic, the homepage prose and the About page prose, and replaced with "substantial pharmaceutical industry experience", which asserts no number. No other years-of-experience claim was substituted. |
| "Certifications held across our manufacturing network" (About section) | Home About | Derived from `partners[].certifications` via `marksAcross()` | ✅ Derived — the heading and the note beneath both state that these are the partners' certifications, not Zafieon's |
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
| Any Zafieon-held GMP / ISO / WHO / PIC-S certification | Zafieon holds no corporate certification in the supplied material. The certification block that now occupies the old "12+" space on the About section shows **partner** certifications and says so twice — in the heading and in the note beneath. |
| Any Ravenbhel USFDA / UK MHRA / PIC/S approval | The catalogue states Unit III is *compliant with* those requirements. That is a statement about how the unit was built, not an approval held, and no regulator's emblem is drawn against it. |
| Reported industry news, market statistics or study references in Zafieon Insights | None supplied. The four pieces carry Zafieon's own perspective on its focus and its quality framework, and nothing else. |
| Any product efficacy, benefit, indication, dosage or safety claim | None supplied, and none may be inferred. |
| Registered address, telephone number | Not supplied. Rendered as "To be confirmed". |

---

## 2. Product claims

All twelve products are described **only** from the supplied pack artwork. No
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
| Luna 35 | Name · composition · pack · Rx marking | `source-assets/products/cyproterone acetate.png` |
| Proluvia-AQ 50 mg | Name · composition · pack · Rx marking · route of administration | `source-assets/products/proluvia-AQ.png` |
| meta-CoQ | Name only | `source-assets/products/meta coq.png` |

**meta-CoQ carries no printed detail.** The supplied artwork is a brand mock-up:
it shows the brand mark and nothing else — no composition, no strength, no pack
count, no Rx symbol, no FSSAI licence. It is therefore recorded with
`detailsPending: true`, and both the card and the product page say in plain
words that composition and pack details will be published once the finished
artwork is confirmed. It is grouped under **Nutraceuticals** on the strength of
two things and nothing more: the absence of an Rx marking, and the brand name.
⚠️ **Flagged for Zafieon to confirm the category and supply the pack artwork.**

**Category assignment.** `categories` is a display grouping for the catalogue
filter. Products carrying the Rx symbol are `prescription`; products presented
as foods or nutraceuticals are `nutraceutical`; products whose stated active is
a steroid hormone or steroid hormone analogue are also `hormone`. By that rule
Femi-Dros 20/30, Luna 35, Proluvia-AQ and Mifiprine are hormones; MISO-PRO
(a prostaglandin analogue) and Let Bloom (a non-steroidal aromatase inhibitor)
are not. The rule is restated at the top of `src/data/products.ts` so every
assignment can be audited against the pack. It carries no clinical meaning and
changes no behaviour — `productClass` remains the only regulatory field.

**"Reproductive" is no longer a visible product category**, at Zafieon's
instruction. "Reproductive Health" remains a *therapeutic focus area* on Our
Focus, which is a different thing and was not asked to change.

**Therapeutic-area assignment** (gynecology / reproductive health / fertility /
women's wellness) is editorial categorisation by composition and pack copy, not
a clinical claim. It drives navigation only.

### Regulatory handling

- **Femi-Dros 20, Femi-Dros 30, MISO-PRO, Let Bloom (Letrozole), Mifiprine
  (Mifepristone), Luna 35 (Cyproterone Acetate + Ethinylestradiol) and
  Proluvia-AQ (Progesterone injection)** are Schedule H prescription medicines. Under the Drugs and Magic Remedies (Objectionable Advertisements)
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
| "08 manufacturing partners" | `partners.length` — the directory order Zafieon fixed |
| Documented facilities | Sum of `facilities[]` across listed partners |
| Partners with stated certifications | Count where `certifications[]` is non-empty |
| Export markets reached by partners | Distinct union of `exportMarkets[]` — attributed per partner in the caption |
| Per-state site counts on the footprint | Facilities whose `location` names that state |
| Product counts and category counts | Derived from `products[]` — never written down |

Retired partners (Systole Remedies, Unilite India) are excluded from every one
of these figures. Their records remain in `partners.ts` with `retired: true` so
the supplied documentation is not lost.

---

## 5. Open items before launch

1. Legal entity name, CIN, GST, registered address, telephone.
2. Confirm `The office.jpeg` shows real Zafieon premises.
3. Substantiation for "12+ years of pharmaceutical industry experience".
4. Decision on "Kurdistan" in the Symbiosis export list.
5. Current certification status for Systole Remedies (supplied certificates appear expired).
6. Confirm the four packs that carry no Zafieon mark.
7. **Confirm the regulatory position on Mifiprine and Let Bloom** — see §2.
8. Confirm the licence and origin of the manufacturing film — see §6.
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

---

## 6. The manufacturing film

| What is shown | Where | Source | Status |
|---|---|---|---|
| Manufacturing film, 1920×1080, 12s | `/manufacturing` hero | `source-assets/video/`, supplied by Zafieon | ✅ Client-supplied |
| Poster frame | Same | Frame extracted from that film | ✅ Derived from the supplied file |
| Four Zafieon Insights images | `/insights`, homepage | Frames extracted from the same film | ✅ Derived from the supplied file |

The film is **not presented as footage of a Zafieon Pharma facility or of any
named manufacturing partner.** The caption beneath it states in plain words that
it is illustrative of pharmaceutical manufacturing practice. The footage shows
generic cleanroom, laboratory and filling-line work with no identifying signage,
and nothing on the page invites the reader to read it as a partner site.

⚠️ **Open item.** If Zafieon intends this to be understood as one of its
partners' facilities, that has to be established with the partner and the
caption rewritten to name it. As supplied it is unattributed footage, and the
caption reflects that.

---

## 7. Therapeutic areas — the Hormonal Health rename

"Reproductive Health" is renamed **Hormonal Health** throughout, at Zafieon's
instruction. The area now has a definition, and it is the same one the Hormones
product category uses:

> The stated active ingredient is a steroid hormone or a steroid hormone
> analogue.

Applying it, the area holds Femi-Dros 20, Femi-Dros 30, Luna 35, Proluvia-AQ and
Mifiprine. It does **not** hold MISO-PRO (misoprostol is a prostaglandin
analogue) or Let Bloom (letrozole is a non-steroidal aromatase inhibitor).

Two products were carrying the old label and have lost it, because they do not
meet that definition: **Zyfolic** (folate, B12, DHA, vitamin D3) and
**Ferrin-XT** (lactoferrin and iron). Neither is hormonal in any sense; both
inherited the label from the broader "reproductive health" grouping.
**Mifiprine** has gained it, since the category rule already counted
mifepristone as a hormone.

One rule, applied in two places, means the Our Focus panel and the catalogue
filter cannot disagree about what a hormone product is.

### Every product appears under Gynaecology

At Zafieon's instruction, all twelve products carry `gynecology` as their first
therapeutic area. This is editorial placement for navigation, not a clinical
claim — as §2 already records for therapeutic areas generally. The rationale is
that the entire portfolio sits inside gynaecology and women's health, so a
reader filtering to that area should see the full range rather than a subset;
the narrower areas beside it are what actually reduce the list, and the chip
counts make that visible before the reader clicks.

⚠️ Nothing about this asserts that a given product is indicated for a given
condition. No page states an indication for any product.

---

## 8. AI-generated imagery — provenance

The manufacturing film Zafieon supplied is AI-generated. The site already says
so obliquely: the caption beneath it states the footage is illustrative of
pharmaceutical manufacturing practice and is not a named partner facility.

**An earlier 1280×720 export of that film carried a visible AI-provenance mark**
— the four-point Gemini/Veo sparkle — burned into one shot. The four Zafieon
Insights stills were cut from that export and kept the mark on `insight-03`
after the film itself was replaced with a clean 1920×1080 version. All four
stills have been re-cut from the current file, which carries no visible mark at
any timestamp (verified frame by frame).

Two things follow from that, and both are worth Zafieon knowing:

1. **Re-cut the Insights stills whenever the film is replaced.** They are frames
   of it, and they do not update themselves. `src/data/insights.ts` says so at
   the top.
2. **A visible mark being absent is not the same as the footage being real.**
   Invisible provenance watermarking (SynthID and equivalents) survives
   re-encoding, and the imagery is synthetic either way. Nothing on the site
   presents it as a photograph of a Zafieon or partner facility, and that is
   the disclosure that matters — it should stay.

⚠️ The office photograph on About is flagged separately in §1 as appearing
generated. That confirmation is still outstanding.
