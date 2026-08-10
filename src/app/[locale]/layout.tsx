import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { hostGrotesk } from "@/app/fonts";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { isLocale, localeMap, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/site.config";

type LayoutParams = { params: Promise<{ locale: string }> };

/**
 * Marca `<html data-intro="playing">` para que el CSS esconda el hero desde
 * el primer pintado. `<Intro />` lo lee al montar y lo saca al terminar.
 * Va en un string aparte para que se lea como lo que es: código que corre en
 * el navegador, no JSX.
 */
const introScript = `try{if(/^\\/(${locales.join("|")})\\/?$/.test(location.pathname)&&!sessionStorage.getItem("vnt:intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="playing"}}catch(e){}`;

/** Sólo existen los idiomas declarados; cualquier otro prefijo es 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dict.meta.title,
      // Las páginas internas sólo declaran su título; el sufijo lo pone esto.
      template: `%s — ${siteConfig.name}`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((item) => [localeMap[item], `/${item}`])),
    },
    openGraph: {
      type: "website",
      locale: localeMap[locale],
      url: `/${locale}`,
      siteName: siteConfig.legalName,
      title: dict.meta.title,
      description: dict.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutParams & { children: React.ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    // `suppressHydrationWarning`: el script de acá abajo le agrega
    // `data-intro` al <html> antes de que hidrate React, así que el atributo
    // no coincide con el HTML del server. Es a propósito.
    <html
      lang={localeMap[locale]}
      className={hostGrotesk.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Decide si toca la animación de entrada ANTES del primer pintado:
            si esperáramos a que monte React, se vería un fotograma del hero
            antes de que aparezca el overlay negro. Sólo en la home, una vez
            por pestaña, y nunca si el sistema pide menos movimiento. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: script inline, sin datos del usuario, tiene que correr antes del primer pintado */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />

        {/* Sin JavaScript no hay IntersectionObserver, así que las
            animaciones de entrada nunca dispararían y el contenido quedaría
            invisible. Esto lo fuerza a verse. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-lima focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
        >
          {dict.nav.skipToContent}
        </a>

        <Header locale={locale} dict={dict} />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />

        {/* Mide las visitas y, sobre todo, el ?ref= de las firmas que dejamos
            en los sitios de clientes: sin esto no hay forma de saber qué
            proyecto trae trabajo. Hay que activarlo además en el panel de
            Vercel (Analytics → Enable). */}
        <Analytics />
      </body>
    </html>
  );
}
