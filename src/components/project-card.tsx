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
  /**
   * Ancho que va a ocupar la card en cada breakpoint, para que next/image
   * sirva el archivo del tamaño justo.
   *
   * Va sin valor por defecto a propósito: la card no puede saber en qué
   * grilla la metieron, y un default se queda viejo en silencio la primera
   * vez que alguien cambia las columnas. La imagen se ve blanda y nadie se
   * entera.
   */
  sizes: string;
};

export function ProjectCard({
  project,
  locale,
  priority = false,
  sizes,
}: ProjectCardProps) {
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
              sizes={sizes}
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
