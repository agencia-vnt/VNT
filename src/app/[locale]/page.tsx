import { notFound } from "next/navigation";
import { Intro } from "@/components/intro";
import { ContactCta } from "@/components/sections/contact-cta";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Team } from "@/components/sections/team";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <Intro />
      <Hero locale={locale} dict={dict} />
      {/* El trabajo antes que la lista de servicios: el estudio se vende por
          lo que hizo, y "¿qué me podés hacer?" es una pregunta que aparece
          después de "¿estos son buenos?". */}
      <FeaturedWork locale={locale} dict={dict} />
      <Services dict={dict} />
      <Process dict={dict} />
      <Team locale={locale} />
      <ContactCta locale={locale} dict={dict} />
    </>
  );
}
