import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { buttonStyles } from "@/components/ui/button";
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
      <SectionHeading title={dict.work.title} intro={dict.work.intro} />

      {projects.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-line p-8 text-sm text-ink-muted">
          {dict.work.empty}
        </p>
      ) : (
        <>
          <div className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.06}>
                <ProjectCard project={project} locale={locale} priority={index === 0} />
              </Reveal>
            ))}
          </div>

          <div className="mt-14">
            <Link href={`/${locale}/proyectos`} className={buttonStyles("secondary")}>
              {dict.work.viewAll}
            </Link>
          </div>
        </>
      )}
    </Section>
  );
}
