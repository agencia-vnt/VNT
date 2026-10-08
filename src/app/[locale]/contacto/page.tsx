import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/sections/contact-form";
import { Section, SectionHeading } from "@/components/ui/section";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/site.config";

type PageParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/contacto",
    title: dict.contact.title,
    description: dict.contact.intro,
    imageAlt: dict.meta.ogAlt,
  });
}

export default async function ContactPage({ params }: PageParams) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <Section>
      <SectionHeading as="h1" title={dict.contact.title} intro={dict.contact.intro} />

      <div className="mt-14 grid gap-14 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 max-w-xl">
          <ContactForm dict={dict} locale={locale} />
        </div>

        <aside className="min-w-0 text-sm text-muted">
          <p>{dict.contact.orEmail}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            data-contact-source="contact-page"
            className="mt-1 inline-block max-w-full text-blanco underline underline-offset-4 [overflow-wrap:anywhere]"
          >
            {siteConfig.email}
          </a>
        </aside>
      </div>
    </Section>
  );
}
