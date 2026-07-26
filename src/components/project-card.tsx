import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  locale: Locale;
  /** La primera card de la grilla carga la imagen con prioridad (mejora LCP). */
  priority?: boolean;
};

export function ProjectCard({ project, locale, priority = false }: ProjectCardProps) {
  const { slug, frontmatter } = project;

  return (
    <article className="group">
      <Link href={`/${locale}/proyectos/${slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-paper-muted">
          {frontmatter.cover ? (
            <Image
              src={frontmatter.cover}
              alt={frontmatter.coverAlt ?? ""}
              fill
              priority={priority}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            // Sin imagen todavía: un bloque neutro en vez de un layout roto.
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.18em] text-ink-muted">
              {frontmatter.client}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-lg tracking-tight">{frontmatter.title}</h3>
          <span className="shrink-0 font-mono text-xs text-ink-muted">
            {frontmatter.year}
          </span>
        </div>

        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          {frontmatter.summary}
        </p>

        {frontmatter.roles.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {frontmatter.roles.map((role) => (
              <li
                key={role}
                className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-muted"
              >
                {role}
              </li>
            ))}
          </ul>
        ) : null}
      </Link>
    </article>
  );
}
