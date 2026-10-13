import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/r/", "/api/signature-arrival"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
