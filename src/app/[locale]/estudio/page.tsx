import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactCta } from "@/components/sections/contact-cta";
import { Section, SectionHeading } from "@/components/ui/section";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/site.config";

type PageParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  return {
    title: dict.studio.title,
    description: dict.studio.intro,
    alternates: { canonical: `/${locale}/estudio` },
  };
}

export default async function StudioPage({ params }: PageParams) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <Section>
        <SectionHeading title={dict.studio.title} intro={dict.studio.intro} />

        {/* El texto largo todavía no está escrito. Hasta que lo esté, la
            página se sostiene con el título, la bajada y el equipo: mejor
            eso que un párrafo de relleno o un bloque vacío. */}
        {dict.studio.body && (
          <div className="mt-12 max-w-2xl">
            <p className="leading-relaxed text-ink-muted">{dict.studio.body}</p>
          </div>
        )}

        <ul className="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-2">
          {siteConfig.team.map((member) => (
            <li key={member.name}>
              <h2 className="font-display text-xl tracking-tight">{member.name}</h2>
              <p className="mt-1 text-sm text-ink-muted">{member.role[locale]}</p>
            </li>
          ))}
        </ul>
      </Section>

      <ContactCta locale={locale} dict={dict} />
    </>
  );
}
