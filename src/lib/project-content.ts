import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { Locale } from "../i18n/config";

const frontmatterSchema = z
  .object({
    title: z.string().min(1),
    client: z.string().min(1),
    year: z.number().int().min(2000).max(2100),
    summary: z.string().min(1),
    roles: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    url: z.url().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().int().default(999),
    draft: z.boolean().default(false),
    status: z.enum(["live", "delivered", "in-progress"]).default("live"),
    kind: z.enum(["website", "internal-tool", "catalog", "mixed"]).default("website"),
    scope: z.array(z.string().trim().min(1)).default([]),
  })
  .refine(({ cover, coverAlt }) => !cover || Boolean(coverAlt?.trim()), {
    message: "es obligatorio cuando se define cover",
    path: ["coverAlt"],
  });

export type ProjectFrontmatter = z.infer<typeof frontmatterSchema>;

export type Project = {
  slug: string;
  /** Idioma efectivo del contenido; los borradores pueden usar fallback. */
  locale: Locale;
  frontmatter: ProjectFrontmatter;
  content: string;
};

export function isPublished(
  project: Project,
  production = process.env.NODE_ENV === "production",
) {
  return !production || !project.frontmatter.draft;
}

type ProjectContentOptions = {
  contentDir: string;
  publicDir: string;
  locales: readonly Locale[];
  defaultLocale: Locale;
  production: boolean;
};

function isNotFound(error: unknown) {
  return (error as NodeJS.ErrnoException | null)?.code === "ENOENT";
}

/** Referencias estáticas de imágenes; los ejemplos comentados no se renderizan. */
function imageReferences(project: Project): string[] {
  const content = project.content
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const references = project.frontmatter.cover ? [project.frontmatter.cover] : [];
  const jsxImages = content.matchAll(
    /<(?:Figure|img)\b[^>]*?\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|\{\s*"([^"]+)"\s*\}|\{\s*'([^']+)'\s*\})/g,
  );
  for (const match of jsxImages) {
    references.push(match[1] ?? match[2] ?? match[3] ?? match[4]);
  }
  for (const match of content.matchAll(/!\[[^\]]*\]\(\s*<?([^\s)>]+)>?/g)) {
    references.push(match[1]);
  }
  return [...new Set(references)];
}

/** El núcleo se comparte entre el sitio y las pruebas con archivos temporales. */
export function createProjectContent(options: ProjectContentOptions) {
  const { contentDir, publicDir, locales, defaultLocale, production } = options;

  // Las raíces configurables no deben hacer que Turbopack incluya todo el repo.
  // next.config.ts incluye el MDX; public se valida durante el prerenderizado.
  async function getProjectSlugs(): Promise<string[]> {
    try {
      const entries = await fs.readdir(/* turbopackIgnore: true */ contentDir, {
        withFileTypes: true,
      });
      return entries
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
        .map((entry) => entry.name)
        .sort();
    } catch (error) {
      if (isNotFound(error)) return [];
      throw error;
    }
  }

  async function readProject(slug: string, locale: Locale): Promise<Project | null> {
    const filePath = path.join(
      /* turbopackIgnore: true */ contentDir,
      slug,
      `${locale}.mdx`,
    );
    let raw: string;
    try {
      raw = await fs.readFile(/* turbopackIgnore: true */ filePath, "utf8");
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }

    const { data, content } = matter(raw);
    const parsed = frontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((issue) => `  · ${issue.path.join(".") || "(raíz)"}: ${issue.message}`)
        .join("\n");
      throw new Error(`Frontmatter inválido en ${filePath}:\n${issues}`);
    }
    return { slug, locale, frontmatter: parsed.data, content };
  }

  async function validateImages(project: Project) {
    for (const reference of imageReferences(project)) {
      // Las URLs remotas no son archivos de public; Next valida sus dominios.
      if (/^https?:\/\//i.test(reference)) continue;
      const label = `${project.slug}/${project.locale}.mdx: ${reference}`;
      if (!reference.startsWith("/") || reference.startsWith("//")) {
        throw new Error(`La imagen local debe partir de /public (${label})`);
      }
      const imagePath = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
      const absolutePath = path.resolve(
        /* turbopackIgnore: true */ publicDir,
        `.${imagePath}`,
      );
      const relativePath = path.relative(
        path.resolve(/* turbopackIgnore: true */ publicDir),
        absolutePath,
      );
      if (
        imagePath.includes("\\") ||
        relativePath.startsWith("..") ||
        path.isAbsolute(relativePath)
      ) {
        throw new Error(`La imagen debe permanecer dentro de public (${label})`);
      }
      try {
        if (!(await fs.stat(/* turbopackIgnore: true */ absolutePath)).isFile()) {
          throw new Error(`La imagen no es un archivo (${label})`);
        }
        const realPath = await fs.realpath(/* turbopackIgnore: true */ absolutePath);
        const realPublicDir = await fs.realpath(/* turbopackIgnore: true */ publicDir);
        const realRelativePath = path.relative(realPublicDir, realPath);
        if (realRelativePath.startsWith("..") || path.isAbsolute(realRelativePath)) {
          throw new Error(`La imagen debe permanecer dentro de public (${label})`);
        }
      } catch (error) {
        if (isNotFound(error)) throw new Error(`Falta la imagen publicada (${label})`);
        throw error;
      }
    }
  }

  async function validatePublishedProject(slug: string) {
    const versions = await Promise.all(
      locales.map((locale) => readProject(slug, locale)),
    );
    const reference = versions.find((project) => project !== null);
    for (const [index, project] of versions.entries()) {
      if (!project) {
        throw new Error(`El proyecto publicado ${slug} requiere ${locales[index]}.mdx`);
      }
      if (project.frontmatter.draft) {
        throw new Error(`El proyecto ${slug} debe publicarse en todos los idiomas`);
      }
      if (
        project.frontmatter.status !== reference?.frontmatter.status ||
        project.frontmatter.kind !== reference?.frontmatter.kind
      ) {
        throw new Error(`status y kind deben coincidir entre idiomas en ${slug}`);
      }
      await validateImages(project);
    }
  }

  async function getProject(slug: string, locale: Locale): Promise<Project | null> {
    const candidates = [...new Set([locale, defaultLocale, ...locales])];
    for (const candidate of candidates) {
      const project = await readProject(slug, candidate);
      if (!project) continue;
      if (production && !project.frontmatter.draft) await validatePublishedProject(slug);
      return project;
    }
    return null;
  }

  async function getAllProjects(locale: Locale): Promise<Project[]> {
    const slugs = await getProjectSlugs();
    const projects = await Promise.all(slugs.map((slug) => getProject(slug, locale)));
    return projects
      .filter((project): project is Project => project !== null)
      .filter((project) => isPublished(project, production))
      .sort(
        (a, b) =>
          a.frontmatter.order - b.frontmatter.order ||
          b.frontmatter.year - a.frontmatter.year,
      );
  }

  async function getFeaturedProjects(locale: Locale, limit = 3): Promise<Project[]> {
    const all = await getAllProjects(locale);
    const featured = all.filter((project) => project.frontmatter.featured);
    return (featured.length > 0 ? featured : all).slice(0, limit);
  }

  return { getProjectSlugs, getProject, getAllProjects, getFeaturedProjects };
}
