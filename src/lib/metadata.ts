import type { Metadata } from "next";
import { type Locale, localeMap, locales } from "@/i18n/config";
import { siteConfig } from "@/site.config";

export const socialImageSize = { width: 1200, height: 630 };

const openGraphLocales: Record<Locale, string> = {
  es: "es_AR",
  en: "en_US",
};

/** La misma ruta en cada idioma, tanto para metadata como para el sitemap. */
export function languageAlternates(path = "") {
  return Object.fromEntries(
    locales.map((locale) => [
      localeMap[locale],
      new URL(`/${locale}${path}`, siteConfig.url).href,
    ]),
  );
}

type PageMetadataOptions = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: { url: string; alt: string };
  imageAlt: string;
  type?: "website" | "article";
};

export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  image,
  imageAlt,
  type = "website",
}: PageMetadataOptions): Metadata {
  const url = new URL(`/${locale}${path}`, siteConfig.url).href;
  const socialTitle = path ? `${title} — ${siteConfig.name}` : title;
  const images = [
    image ?? {
      url: `/${locale}/social-image`,
      alt: imageAlt,
      ...socialImageSize,
      type: "image/png",
    },
  ];

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      title: socialTitle,
      description,
      url,
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => openGraphLocales[item]),
      siteName: siteConfig.legalName,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images,
    },
  };
}
