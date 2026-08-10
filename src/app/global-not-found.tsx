import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "@/app/globals.css";
import { hostGrotesk } from "@/app/fonts";
import { NotFoundScreen } from "@/components/not-found-screen";
import { defaultLocale, localeMap } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/site.config";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary(defaultLocale);

  return {
    title: `${dict.notFound.title} — ${siteConfig.name}`,
    description: dict.notFound.description,
    robots: { index: false, follow: false },
  };
}

export default function GlobalNotFound() {
  return (
    <html lang={localeMap[defaultLocale]} className={hostGrotesk.variable}>
      <body className="flex min-h-dvh flex-col">
        <NotFoundScreen withChrome />
        <Analytics />
      </body>
    </html>
  );
}
