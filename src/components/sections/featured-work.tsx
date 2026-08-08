import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getFeaturedProjects } from "@/lib/projects";

export async function FeaturedWork({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const projects = await getFeaturedProjects(locale);

  return (
    <Section id="proyectos">
      <SectionHeading
        title={dict.work.featuredTitle}
        action={
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
        }
      />

      {projects.length === 0 ? (
        <p className="mt-13 rounded-2xl border border-dashed border-line p-8 text-body-s text-muted">
          {dict.work.empty}
        </p>
      ) : (
        <div className="mt-13 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.06} className="h-full">
              <ProjectCard project={project} locale={locale} priority={index === 0} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
