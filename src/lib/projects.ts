import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";
import { defaultLocale, type Locale, locales } from "@/i18n/config";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

/**
 * Frontmatter de cada caso. Se valida en build: si un .mdx tiene un campo mal
 * escrito, el build falla con un mensaje claro en vez de romper en runtime.
 */
const frontmatterSchema = z
  .object({
    /** Título del caso, tal como se muestra en la card y en el detalle. */
    title: z.string().min(1),
    /** Nombre del cliente. */
    client: z.string().min(1),
    /** Año de entrega. */
    year: z.number().int().min(2000).max(2100),
    /** Una o dos líneas: qué era el proyecto y qué resolvimos. */
    summary: z.string().min(1),
    /** Qué hicimos: ["Diseño", "Desarrollo"]. */
    roles: z.array(z.string()).default([]),
    /** Tecnologías: ["Next.js", "Tailwind"]. */
    stack: z.array(z.string()).default([]),
    /** URL del sitio publicado, si es público. */
    url: z.url().optional(),
    /** Imagen principal, relativa a /public. Ej: /projects/slug/cover.jpg */
    cover: z.string().optional(),
    /** Texto alternativo de la portada. Obligatorio si hay cover, por accesibilidad. */
    coverAlt: z.string().optional(),
    /** Si aparece en la home. */
    featured: z.boolean().default(false),
    /** Orden manual: más chico = más arriba. */
    order: z.number().int().default(999),
    /** Los borradores se ven en desarrollo pero nunca en producción. */
    draft: z.boolean().default(false),
  })
  .refine(({ cover, coverAlt }) => !cover || Boolean(coverAlt?.trim()), {
    message: "es obligatorio cuando se define cover",
    path: ["coverAlt"],
  });

export type ProjectFrontmatter = z.infer<typeof frontmatterSchema>;

export type Project = {
  slug: string;
  /** Idioma efectivo del contenido (puede ser el fallback, no el pedido). */
  locale: Locale;
  frontmatter: ProjectFrontmatter;
  /** Cuerpo del MDX, sin el frontmatter. */
  content: string;
};

/**
 * Un proyecto se ve en producción sólo si no es borrador.
 * Hay que chequearlo tanto al listar como al entrar por URL directa: si no,
 * un borrador queda accesible para cualquiera que adivine el slug.
 */
export function isPublished(project: Project) {
  return process.env.NODE_ENV !== "production" || !project.frontmatter.draft;
}

/** `true` si el path no existe; cualquier otro error de I/O se propaga. */
function isNotFound(error: unknown) {
  return (error as NodeJS.ErrnoException | null)?.code === "ENOENT";
}

async function readContentDir() {
  try {
    return await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  } catch (error) {
    // Todavía no hay carpeta de contenido: el sitio funciona igual, vacío.
    if (isNotFound(error)) return [];
    throw error;
  }
}

/**
 * Lista los slugs disponibles. Cada proyecto es una carpeta con un .mdx por
 * idioma: content/projects/<slug>/es.mdx
 */
export const getProjectSlugs = cache(async (): Promise<string[]> => {
  const entries = await readContentDir();

  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();
});

async function readProjectFile(slug: string, locale: Locale) {
  const filePath = path.join(CONTENT_DIR, slug, `${locale}.mdx`);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    // Ese idioma todavía no está traducido; lo maneja el fallback.
    if (isNotFound(error)) return null;
    throw error;
  }
}

/**
 * Devuelve un proyecto en el idioma pedido. Si todavía no está traducido,
 * cae al idioma por defecto en vez de romper: así se puede publicar en
 * español y traducir después, sin tocar código.
 */
export const getProject = cache(
  async (slug: string, locale: Locale): Promise<Project | null> => {
    const candidates: Locale[] = [
      locale,
      defaultLocale,
      ...locales.filter((l) => l !== locale && l !== defaultLocale),
    ];

    for (const candidate of candidates) {
      const raw = await readProjectFile(slug, candidate);
      if (raw === null) continue;

      const { data, content } = matter(raw);
      const parsed = frontmatterSchema.safeParse(data);

      if (!parsed.success) {
        const issues = parsed.error.issues
          .map((issue) => `  · ${issue.path.join(".") || "(raíz)"}: ${issue.message}`)
          .join("\n");
        throw new Error(
          `Frontmatter inválido en content/projects/${slug}/${candidate}.mdx:\n${issues}`,
        );
      }

      return { slug, locale: candidate, frontmatter: parsed.data, content };
    }

    return null;
  },
);

/** Todos los proyectos visibles, ordenados por `order` y después por año. */
export const getAllProjects = cache(async (locale: Locale): Promise<Project[]> => {
  const slugs = await getProjectSlugs();
  const projects = await Promise.all(slugs.map((slug) => getProject(slug, locale)));

  return projects
    .filter((project): project is Project => project !== null)
    .filter(isPublished)
    .sort(
      (a, b) =>
        a.frontmatter.order - b.frontmatter.order ||
        b.frontmatter.year - a.frontmatter.year,
    );
});

/** Los destacados para la home. Si ninguno está marcado, muestra los primeros. */
export const getFeaturedProjects = cache(
  async (locale: Locale, limit = 3): Promise<Project[]> => {
    const all = await getAllProjects(locale);
    const featured = all.filter((project) => project.frontmatter.featured);
    return (featured.length > 0 ? featured : all).slice(0, limit);
  },
);
