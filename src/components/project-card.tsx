import Image from "next/image";
import Link from "next/link";
import { Isotipo } from "@/components/ui/isotipo";
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
    <article className="group h-full">
      <Link
        href={`/${locale}/proyectos/${slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-elev transition-colors hover:border-violeta"
      >
        <div className="relative aspect-[405/250] overflow-hidden">
          {frontmatter.cover ? (
            <Image
              src={frontmatter.cover}
              alt={frontmatter.coverAlt ?? ""}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            // Sin portada todavía: el degradado con el pico del diseño, que es
            // mejor que un hueco vacío y sigue siendo de la marca.
            <div
              aria-hidden="true"
              className="h-full w-full bg-[linear-gradient(140deg,var(--color-violeta)_0%,var(--color-ink)_71%)]"
            >
              <Isotipo className="absolute bottom-0 right-[4%] w-[37%] text-lima opacity-90" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 px-6 pb-6 pt-5.5">
          <h3 className="text-h3">{frontmatter.title}</h3>
          <p className="text-body-s text-muted">{frontmatter.summary}</p>
          <p className="text-label uppercase text-muted">
            {frontmatter.client} · {frontmatter.year}
          </p>
        </div>
      </Link>
    </article>
  );
}
