import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Prescription product detail and legal scaffolds stay out of the
      // index, and so does the operator dashboard and its API surface.
      disallow: ["/legal/", "/admin", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
