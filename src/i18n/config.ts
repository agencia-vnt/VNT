export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/** Se usa en <html lang> y en los alternates de metadata. */
export const localeMap: Record<Locale, string> = {
  es: "es-AR",
  en: "en",
};

export const localeLabels: Record<Locale, string> = {
  es: "ES",
  en: "EN",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Reemplaza el prefijo de idioma de un pathname: /es/proyectos -> /en/proyectos */
export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  // segments[0] siempre es "" porque el pathname arranca con "/"
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = target;
    return segments.join("/");
  }
  return `/${target}${pathname}`;
}
