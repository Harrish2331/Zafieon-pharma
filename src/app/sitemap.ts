import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { products } from "@/data/products";
import { partners } from "@/data/partners";
import { focusAreas } from "@/data/focus";
import { insights } from "@/data/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string) => `${site.url}${p}`;

  const core = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/our-focus", priority: 0.8 },
    { path: "/products", priority: 0.9 },
    { path: "/quality", priority: 0.8 },
    { path: "/manufacturing", priority: 0.9 },
    { path: "/insights", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
  ].map((p) => ({
    url: url(p.path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p.priority,
  }));

  // Prescription product pages are excluded: promoting Schedule H medicines to
  // the general public is restricted, and those routes are noindex.
  const productPages = products
    .filter((p) => p.productClass !== "prescription")
    .map((p) => ({
      url: url(`/products/${p.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const partnerPages = partners.map((p) => ({
    url: url(`/manufacturing/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const insightPages = insights.map((i) => ({
    url: url(`/insights/${i.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const focusAnchors = focusAreas.map((f) => ({
    url: url(`/our-focus#${f.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...core,
    ...productPages,
    ...partnerPages,
    ...insightPages,
    ...focusAnchors,
  ];
}
