import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getAllProjects } from "@/lib/projects";
import { siteConfig } from "@/site.config";

/** Rutas fijas del sitio, sin el prefijo de idioma. */
const staticPaths = ["", "/proyectos", "/contacto"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
  );

  const projectPages = (
    await Promise.all(
      locales.map(async (locale) => {
        const projects = await getAllProjects(locale);
        return projects.map((project) => ({
          url: `${siteConfig.url}/${locale}/proyectos/${project.slug}`,
          lastModified: now,
          changeFrequency: "yearly" as const,
          priority: 0.8,
        }));
      }),
    )
  ).flat();

  return [...pages, ...projectPages];
}
