"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { defaultLocale, isLocale, type Locale, localeMap } from "@/i18n/config";
import enDictionary from "@/i18n/dictionaries/en.json";
import esDictionary from "@/i18n/dictionaries/es.json";
import { siteConfig } from "@/site.config";

const dictionaries = {
  es: esDictionary,
  en: enDictionary,
} as const;

function getPathLocale(pathname: string): Locale {
  const locale = pathname.split("/")[1];
  return isLocale(locale) ? locale : defaultLocale;
}

function NotFoundContent({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];

  return (
    <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-ink md:min-h-[calc(100svh-5rem)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-52 overflow-hidden border-t border-line lg:inset-y-0 lg:left-auto lg:h-auto lg:w-[42%] lg:border-l lg:border-t-0"
      >
        <Image
          src="/brand/fondo-isotipo-violeta.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-cover object-[center_82%] lg:object-center"
        />
        <Image
          src="/brand/isotipo-lime.svg"
          alt=""
          width={48}
          height={40}
          className="absolute right-6 top-6 h-8 w-auto lg:right-10 lg:top-10 lg:h-10"
        />
      </div>

      <Container className="flex min-h-[calc(100svh-4rem)] items-center pb-64 pt-14 md:min-h-[calc(100svh-5rem)] md:pt-20 lg:pb-20 lg:pr-[48%]">
        <div className="w-full max-w-[720px]">
          <div className="flex items-center gap-3 text-label uppercase text-lima">
            <Image
              src="/brand/isotipo-lime.svg"
              alt=""
              width={24}
              height={20}
              className="h-5 w-auto"
            />
            <p>{dict.notFound.eyebrow}</p>
          </div>

          <p aria-hidden="true" className="mt-5 text-error text-blanco">
            404
          </p>

          <h1 className="mt-6 max-w-[620px] text-h2 text-balance">
            {dict.notFound.title}
          </h1>
          <p className="mt-5 max-w-[560px] text-body text-muted">
            {dict.notFound.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-3.5">
            <Link href={`/${locale}`} className={buttonStyles("primary")}>
              {dict.notFound.cta}
            </Link>
            <Link href={`/${locale}/proyectos`} className={buttonStyles("secondary")}>
              {dict.notFound.workCta}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function NotFoundScreen({ withChrome = false }: { withChrome?: boolean }) {
  const locale = getPathLocale(usePathname());
  const dict = dictionaries[locale];

  // La 404 global no pasa por el layout localizado; sincronizamos el idioma
  // del documento una vez que conocemos el prefijo real de la URL.
  useEffect(() => {
    document.title = `${dict.notFound.title} — ${siteConfig.name}`;
    if (withChrome) document.documentElement.lang = localeMap[locale];
  }, [dict.notFound.title, locale, withChrome]);

  const content = <NotFoundContent locale={locale} />;

  if (!withChrome) return content;

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-lima focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        {dict.nav.skipToContent}
      </a>
      <Header locale={locale} dict={dict} />
      <main id="contenido" className="flex-1">
        {content}
      </main>
      <Footer dict={dict} />
    </>
  );
}
