import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllProjects } from "@/lib/projects";

type PageParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  return {
    title: dict.work.title,
    description: dict.work.intro,
    alternates: { canonical: `/${locale}/proyectos` },
  };
}

export default async function ProjectsPage({ params }: PageParams) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const projects = await getAllProjects(locale);

  return (
    <Section>
      <SectionHeading title={dict.work.title} intro={dict.work.intro} />

      {projects.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-line p-8 text-sm text-muted">
          {dict.work.empty}
        </p>
      ) : (
        <div className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.06}>
              <ProjectCard project={project} locale={locale} priority={index === 0} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
