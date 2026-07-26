"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale, localeLabels, locales, switchLocalePath } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Mantiene la ruta y sólo cambia el prefijo de idioma:
 * /es/proyectos/foo -> /en/proyectos/foo
 */
export function LocaleSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();

  // Es un <nav> propio, no un <div>: cambiar de idioma es navegación, y así
  // un lector de pantalla lo anuncia como tal y lo puede saltear.
  return (
    <nav aria-label={label} className="flex items-center gap-1 text-xs">
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 ? <span className="text-line">/</span> : null}
          <Link
            href={switchLocalePath(pathname, locale)}
            hrefLang={locale}
            aria-current={locale === current ? "true" : undefined}
            className={cn(
              "rounded px-1 py-0.5 transition-colors",
              locale === current ? "text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            {localeLabels[locale]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
