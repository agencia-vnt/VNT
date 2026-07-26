import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Las páginas de firma son internas: no aportan nada en buscadores.
      disallow: ["/*/firma"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
