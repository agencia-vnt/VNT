import "server-only";

import path from "node:path";
import { cache } from "react";
import { defaultLocale, locales } from "@/i18n/config";
import { createProjectContent } from "./project-content";

export type { Project, ProjectFrontmatter } from "./project-content";
export { isPublished } from "./project-content";

const content = createProjectContent({
  contentDir: path.join(process.cwd(), "content", "projects"),
  publicDir: path.join(process.cwd(), "public"),
  locales,
  defaultLocale,
  production: process.env.NODE_ENV === "production",
});

/** Los borradores conservan el fallback; publicar exige cada idioma e imagen. */
export const getProjectSlugs = cache(content.getProjectSlugs);
export const getProject = cache(content.getProject);
export const getAllProjects = cache(content.getAllProjects);
export const getFeaturedProjects = cache(content.getFeaturedProjects);
