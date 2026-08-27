import type { Product } from "./types";

/**
 * The products currently supplied by Zafieon Pharma.
 *
 * Every value here is read off the supplied pack artwork in /Product Images.
 * Descriptions restate what the pack states. No indication, benefit, dosage,
 * efficacy or safety claim appears anywhere in this file, because none was
 * supplied. Adding a seventh product means appending one object — no UI change.
 */
export const products: Product[] = [
  {
    id: "prd-01",
    slug: "femi-dros-30",
    name: "Femi-Dros 30",
    productClass: "prescription",
    dosageForm: "Tablets",
    therapeuticAreas: ["reproductive-health", "gynecology"],
    description:
      "A prescription combination tablet containing Drospirenone and Ethinyl Estradiol, presented in a twenty-one tablet pack.",
    composition: "Drospirenone 3 mg + Ethinyl Estradiol 0.03 mg Tablets IP",
    packaging: "1 x 21 Tablets",
    packMarkings: ["Rx — Prescription only"],
    image: "/products/femi-dros-30.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAACwAwCdASoUAA0APt1apkyopSOiMAgBEBuJQAALfXwQAz/p3su4AAD+6E/SytvnopCFcH5+1TYSL4q7awjPyUfA3kKfuPKjyhk61W+cOQZPtn90XPYmzKY+L0bJ7YAMSAWt6g8P6tXb3b6k41y69r5lHf8AyhwCfjjnbHfJ4AA=",
    imageAlt:
      "Femi-Dros 30 carton — Drospirenone 3 mg and Ethinyl Estradiol 0.03 mg Tablets IP, 1 x 21 tablets, bearing the Zafieon Pharma mark",
    zafieonBranded: true,
    source: "Product Images/Femi dros.jpeg",
  },
  {
    id: "prd-02",
    slug: "femi-dros-20",
    name: "Femi-Dros 20",
    productClass: "prescription",
    dosageForm: "Tablets",
    therapeuticAreas: ["reproductive-health", "gynecology"],
    description:
      "A prescription combination tablet containing Drospirenone and Ethinyl Estradiol at a lower estradiol strength, presented in a twenty-one tablet pack.",
    composition: "Drospirenone 3 mg + Ethinyl Estradiol 0.02 mg Tablets IP",
    packaging: "1 x 21 Tablets",
    packMarkings: ["Rx — Prescription only"],
    image: "/products/femi-dros-20.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAABwAwCdASoUAA0APt1apkyopSOiMAgBEBuJQAALfV6u//76xAAA/ut4NhNBQz6R73L7j477E+VufulUO5NIPUoVknFcvDqHXvy+C9vDOt6fXtN4r0eUIxR/uqsycAVCr6XV32JrfIKy9KLrf43xjyu0AZybJg5RpqbwAA==",
    imageAlt:
      "Femi-Dros 20 carton — Drospirenone 3 mg and Ethinyl Estradiol 0.02 mg Tablets IP, 1 x 21 tablets, bearing the Zafieon Pharma mark",
    zafieonBranded: true,
    source: "Product Images/Femi dros 0.2.jpeg",
  },
  {
    id: "prd-03",
    slug: "miso-pro",
    name: "MISO-PRO",
    productClass: "prescription",
    dosageForm: "Tablets",
    therapeuticAreas: ["gynecology"],
    description:
      "A prescription tablet containing Misoprostol 200 mcg, presented in a twenty tablet pack.",
    composition: "Misoprostol Tablets IP 200 mcg",
    packaging: "5 x 4 Tablets",
    packMarkings: ["Rx — Prescription only"],
    image: "/products/miso-pro.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAAAQBACdASoUAA8APt1apkyopSOiMAgBEBuJZAC/OCKUZtJ1V9T+qg+WOAD+6yWw6gTtVnsn1ixnkXcDevdCjOorS8L+8ODYwXDliRdYIkxb0SPctGk7sZxpr4H36ztg9PHabB5CHPiPNybQZAhoPQ1YeYCSrsWyG//Lzj72ZIgqAAAA",
    imageAlt:
      "MISO-PRO carton — Misoprostol Tablets IP 200 mcg, 5 x 4 tablets",
    zafieonBranded: false,
    source: "Product Images/MISO-pro tablets.png",
  },
  {
    id: "prd-04",
    slug: "zyfolic",
    name: "Zyfolic",
    productClass: "nutraceutical",
    dosageForm: "Softgel Capsules",
    therapeuticAreas: ["fertility", "reproductive-health"],
    description:
      "A softgel capsule combining L-Methyl folate, Methylcobalamin, Pyridoxal-5 Phosphate, DHA and Vitamin D3.",
    composition:
      "L-Methyl folate, Methylcobalamin, Pyridoxal-5 Phosphate, DHA & Vitamin D3 Softgel Capsules",
    packaging: "10 x 1 x 10 Softgel Capsules",
    image: "/products/zyfolic.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAADwAwCdASoUAA8APt1apkyopSOiMAgBEBuJYgDImCHfJZLYkJFW8YQAAP7yNNO0Fcjy6bsWo/Soh+bEHp/pmPLN0AoEW7SUZ6YQLOqLMXBp/81368QWNaJeA8ht9yJilnF/gKVGqD4DD8/snGTM0/bg5vg8FwMAqWPagAAA",
    imageAlt:
      "Zyfolic carton — L-Methyl folate, Methylcobalamin, Pyridoxal-5 Phosphate, DHA and Vitamin D3 softgel capsules, 10 x 1 x 10",
    zafieonBranded: false,
    source: "Product Images/Zyfolic softgel capsules.png",
  },
  {
    id: "prd-05",
    slug: "femulet",
    name: "Femulet",
    productClass: "nutraceutical",
    dosageForm: "Tablets",
    therapeuticAreas: ["womens-wellness"],
    description:
      "A nutraceutical tablet for women combining N-Acetyl L-Cysteine, Coenzyme Q10, Melatonin, Astaxanthin, Folic Acid and vitamins B6, B12 and D2.",
    composition:
      "N-Acetyl L-Cysteine, Coenzyme Q10, Melatonin, Astaxanthin, Folic Acid, Vitamin B6, Vitamin B12 & Vitamin D2 Tablets",
    packaging: "10 x 1 x 10 Tablets",
    licence: "FSSAI Lic. No. 22426535000422",
    packMarkings: ["Nutraceutical — For Women", "Vegetarian"],
    image: "/products/femulet.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAACQBACdASoUABMAPt1iqU+opSOiKAqpEBuJZQBTAAPQ/9BQgDTDdrGT8sXX5cAA/u/6TxB5IPfFEp5tTrJ3x3yA/HRum4PFJ2HOAAgScdpNF1VudovtLSW4YpPUP0iGUt4QzqTdla74LnY20WqjXoE9KjkAAA==",
    imageAlt:
      "Femulet carton — N-Acetyl L-Cysteine, Coenzyme Q10, Melatonin, Astaxanthin, Folic Acid and vitamin tablets, 10 x 1 x 10",
    zafieonBranded: false,
    source: "Product Images/Femulet tablets.png",
  },
  {
    id: "prd-06",
    slug: "florabet-ll",
    name: "Florabet LL",
    productClass: "nutraceutical",
    dosageForm: "Capsules",
    therapeuticAreas: ["womens-wellness"],
    description:
      "A nutraceutical capsule combining prebiotic, probiotic Lactobacilli and Lactoferrin.",
    composition:
      "Prebiotic, Probiotic (Lactobacilli) and Lactoferrin Capsules",
    packaging: "10 x 10 Capsules",
    packMarkings: ["Nutraceutical", "Vegetarian"],
    image: "/products/florabet-ll.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAADwAwCdASoUAAwAPt1cpkyopSOiMAgBEBuJZgDE2B6Nra59mTGXxOAAAP7I2hccrdZ/Qz1EeHe3XPrvzjRBj1KXm+06wuXBjk3O2ktbnD42Wd2YDHTFiM4Jh4cdGxqnviXnEumoGJ5PsY1Sr/HWNA3zcQAAAA==",
    imageAlt:
      "Florabet LL carton — prebiotic, probiotic Lactobacilli and Lactoferrin capsules, 10 x 10",
    zafieonBranded: false,
    source: "Product Images/Florabet LL.png",
  },
  {
    id: "prd-07",
    slug: "let-bloom",
    name: "Let Bloom",
    productClass: "prescription",
    dosageForm: "Tablets",
    therapeuticAreas: ["fertility", "gynecology"],
    description:
      "A prescription tablet containing Letrozole 5 mg, presented in a fifty tablet pack.",
    composition: "Letrozole Tablets 5 mg",
    packaging: "10 x 1 x 5 Tablets",
    packMarkings: ["Rx — Prescription only"],
    image: "/products/let-bloom.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAADwAwCdASoUAA8APt1apkyopSOiMAgBEBuJQBibBDv3KEokr+7gbDmgAP7zjoxTSHMH8d33mVO0ThEY1xkwS5b5KCxTKYvsQjEHB7D7j54erNZjAzBqjZrV1k6RsPP8qq7Yg0bCVPKgAA==",
    imageAlt:
      "Let Bloom carton — Letrozole Tablets 5 mg, 10 x 1 x 5 tablets",
    zafieonBranded: false,
    source: "source-assets/images/Letrozole.png",
  },
  {
    id: "prd-08",
    slug: "mifiprine",
    name: "Mifiprine",
    productClass: "prescription",
    dosageForm: "Tablets",
    therapeuticAreas: ["gynecology"],
    description:
      "A prescription tablet containing Mifepristone 200 mg, presented in a ten tablet pack.",
    composition: "Mifepristone Tablets IP 200 mg",
    packaging: "10 x 1 x 1 Tablets",
    packMarkings: ["Rx — Prescription only"],
    image: "/products/mifiprine.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAADQAwCdASoUAA8APt1apkyopSOiMAgBEBuJZQBCALf/AtL26+3j34AA/vC9ef+GtO/eVHXnOHyOKuRv2ippOORDQJZtj9pLsz6f32uMIjCi5dxf43iTLVYWh9AxfIBg3425Oqsf0r5LI/gA",
    imageAlt:
      "Mifiprine carton — Mifepristone Tablets IP 200 mg, 10 x 1 x 1 tablets",
    zafieonBranded: false,
    source: "source-assets/images/Mifiprine.png",
  },
  {
    id: "prd-09",
    slug: "ferrin-xt",
    name: "Ferrin-XT",
    productClass: "nutraceutical",
    dosageForm: "Tablets",
    therapeuticAreas: ["reproductive-health", "womens-wellness"],
    description:
      "A tablet combining Lactoferrin, elemental iron, folic acid, DHA, Vitamin D3 and disodium guanosine 5-monophosphate, presented in a hundred tablet pack.",
    composition:
      "Lactoferrin 50 mg, Disodium Guanosine 5-Monophosphate 5 mg, Elemental Iron (FBG) 27 mg, Vitamin D3 600 IU, Folic Acid 200 mcg and DHA 200 mg Tablets",
    packaging: "10 x 1 x 10 Tablets",
    packMarkings: [
      "Food for special dietary use",
      "Food for managing iron and folate reserves in pregnancy",
      "For pregnant women",
      "Vegetarian",
    ],
    image: "/products/ferrin-xt.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAAAQBACdASoUAA8APt1cpkyopSOiMAgBEBuJYwC7ACHNBSeNxTfMVuycIAD+85WTc1li2VU8C1gXA228FDcVl3Zu5FMLj7CiUuNdqNdqJaHwuAXJB77aP5aL3zcWbAPrK59gXDZVrBRjQwUTiCIU99ffHM8gAAAA",
    imageAlt:
      "Ferrin-XT carton — Lactoferrin, elemental iron, folic acid, DHA and vitamin tablets, 10 x 1 x 10",
    zafieonBranded: false,
    source: "source-assets/images/Ferrin XT.png",
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const productsByClass = (c: Product["productClass"]) =>
  products.filter((p) => p.productClass === c);

export const productsByArea = (area: string) =>
  products.filter((p) => p.therapeuticAreas.includes(area as never));

export const productClassLabel: Record<Product["productClass"], string> = {
  prescription: "Prescription",
  nutraceutical: "Nutraceutical",
};
