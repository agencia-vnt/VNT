import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllProjects, getProject, isPublished } from "@/lib/projects";

type PageParams = { params: Promise<{ locale: string; slug: string }> };

/** Cualquier slug que no se haya prerenderizado es 404, sin render on-demand. */
export const dynamicParams = false;

/**
 * Prerenderiza cada proyecto publicado en cada idioma: el sitio entero sale
 * estático. Usa getAllProjects (y no la lista cruda de slugs) para que los
 * borradores no generen una URL accesible en producción.
 */
export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const projects = await getAllProjects(locale);
      return projects.map((project) => ({ locale, slug: project.slug }));
    }),
  );

  return params.flat();
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = await getProject(slug, locale);
  if (!project) return {};

  const { title, summary, cover } = project.frontmatter;

  return {
    title,
    description: summary,
    alternates: { canonical: `/${locale}/proyectos/${slug}` },
    openGraph: {
      type: "article",
      title,
      description: summary,
      url: `/${locale}/proyectos/${slug}`,
      images: cover ? [{ url: cover }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageParams) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = await getProject(slug, locale);
  if (!project || !isPublished(project)) notFound();

  const dict = await getDictionary(locale);
  const { title, client, year, summary, roles, stack, url, cover, coverAlt } =
    project.frontmatter;

  const meta = [
    { label: dict.work.meta.client, value: client },
    { label: dict.work.meta.year, value: String(year) },
    roles.length > 0 ? { label: dict.work.meta.roles, value: roles.join(", ") } : null,
    stack.length > 0 ? { label: dict.work.meta.stack, value: stack.join(", ") } : null,
  ].filter((item): item is { label: string; value: string } => item !== null);

  return (
    <article className="py-16 md:py-24">
      <Container>
        <Link
          href={`/${locale}/proyectos`}
          className="text-sm text-ink-muted transition-colors hover:text-ink"
        >
          ← {dict.work.backToWork}
        </Link>

        <header className="mt-8 max-w-3xl">
          <h1 className="font-display text-4xl leading-tight tracking-tight text-balance md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">{summary}</p>
        </header>

        <dl className="mt-12 grid gap-6 border-y border-line py-8 sm:grid-cols-2 md:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="text-xs uppercase tracking-[0.18em] text-ink-muted">
                {item.label}
              </dt>
              <dd className="mt-1.5 text-sm">{item.value}</dd>
            </div>
          ))}
        </dl>

        {url ? (
          <div className="mt-8">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles("secondary")}
            >
              {dict.work.visitSite} ↗
            </a>
          </div>
        ) : null}
      </Container>

      {cover ? (
        <div className="mt-14 md:mt-20">
          <Container>
            <Image
              src={cover}
              alt={coverAlt ?? ""}
              width={1600}
              height={1000}
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="w-full rounded-lg bg-paper-muted"
            />
          </Container>
        </div>
      ) : null}

      <Container className="mt-14 md:mt-20">
        <div className="max-w-2xl">
          {/* blockJS: false es necesario, no una comodidad. Por defecto
              next-mdx-remote borra toda expresión JS del MDX, incluidas las de
              los atributos JSX: `<Figure width={1600} />` llega sin width y
              next/image revienta en runtime (el build no lo detecta, porque
              los borradores no se prerenderizan). Ese default protege contra
              MDX de terceros; el nuestro se escribe en este repo y pasa por
              pull request. `blockDangerousJS` sigue en true por defecto, así
              que eval, Function y compañía se siguen bloqueando. */}
          <MDXRemote
            source={project.content}
            components={mdxComponents}
            options={{ blockJS: false }}
          />
        </div>
      </Container>
    </article>
  );
}
