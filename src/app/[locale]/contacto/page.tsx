import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/sections/contact-form";
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
    title: dict.contact.title,
    description: dict.contact.intro,
    alternates: { canonical: `/${locale}/contacto` },
  };
}

export default async function ContactPage({ params }: PageParams) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <Section>
      <SectionHeading title={dict.contact.title} intro={dict.contact.intro} />

      <div className="mt-14 grid gap-14 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="max-w-xl">
          <ContactForm dict={dict} />
        </div>

        <aside className="text-sm text-muted">
          <p>{dict.contact.orEmail}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-1 inline-block text-blanco underline underline-offset-4"
          >
            {siteConfig.email}
          </a>
        </aside>
      </div>
    </Section>
  );
}
