import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * No recibe params (Next no se los pasa a not-found), así que usa el idioma
 * por defecto. Es una limitación conocida y aceptable para una 404.
 */
export default async function NotFound() {
  const dict = await getDictionary(defaultLocale);

  return (
    <Section>
      <div className="max-w-xl py-16">
        <p className="font-mono text-sm text-ink-muted">404</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight">
          {dict.notFound.title}
        </h1>
        <p className="mt-4 leading-relaxed text-ink-muted">{dict.notFound.description}</p>
        <Link href={`/${defaultLocale}`} className={buttonStyles("primary", "mt-10")}>
          {dict.notFound.cta}
        </Link>
      </div>
    </Section>
  );
}
