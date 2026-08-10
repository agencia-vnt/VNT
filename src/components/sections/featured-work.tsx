import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getFeaturedProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";

export async function FeaturedWork({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const projects = await getFeaturedProjects(locale);

  /**
   * La grilla se adapta a cuántos casos hay publicados. Con `draft` de por
   * medio, en producción puede haber menos que en local: tres columnas con
   * dos casos dejan un hueco a la derecha que se lee como un error de carga.
   *
   * El `sizes` viaja con las columnas. Si se queda en 33vw mientras la grilla
   * muestra dos columnas, next/image sirve un archivo chico para un lugar
   * grande y la portada se ve blanda.
   */
  const layout =
    projects.length === 1
      ? { columns: "max-w-[560px]", sizes: "(min-width: 592px) 560px, 100vw" }
      : projects.length === 2
        ? { columns: "md:grid-cols-2", sizes: "(min-width: 768px) 50vw, 100vw" }
        : {
            columns: "md:grid-cols-2 lg:grid-cols-3",
            sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
          };

  return (
    <Section id="proyectos">
      <div className="flex justify-end">
        <Link
          href={`/${locale}/proyectos`}
          className="group inline-flex shrink-0 items-center gap-2 text-body-s text-blanco transition-colors hover:text-lima"
        >
          {dict.work.viewAll}
          <span
            aria-hidden="true"
            className="text-lima transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-13 rounded-2xl border border-dashed border-line p-8 text-body-s text-muted">
          {dict.work.empty}
        </p>
      ) : (
        <div className={cn("mt-13 grid gap-8", layout.columns)}>
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.06} className="h-full">
              <ProjectCard
                project={project}
                locale={locale}
                priority={index === 0}
                sizes={layout.sizes}
              />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
