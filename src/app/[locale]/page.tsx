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
      <Intro label={dict.intro.scroll} />
      <Hero locale={locale} dict={dict} />
      <Services dict={dict} />
      <FeaturedWork locale={locale} dict={dict} />
      <Process dict={dict} />
      <Team locale={locale} dict={dict} />
      <ContactCta locale={locale} dict={dict} />
    </>
  );
}
