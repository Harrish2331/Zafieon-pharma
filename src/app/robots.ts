import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Prescription product detail and legal scaffolds stay out of the index.
      disallow: ["/legal/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
