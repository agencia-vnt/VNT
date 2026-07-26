import Link from "next/link";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/site.config";

type HeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Header({ locale, dict }: HeaderProps) {
  // Los segmentos de URL quedan en español en los dos idiomas a propósito:
  // mantiene los links estables si algún día se agregan más idiomas.
  const links = [
    { href: `/${locale}/proyectos`, label: dict.nav.work },
    { href: `/${locale}/estudio`, label: dict.nav.studio },
    { href: `/${locale}/contacto`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-paper/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href={`/${locale}`}
          className="font-display text-lg font-semibold tracking-tight"
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-5 md:gap-7">
          <nav aria-label={dict.nav.menu} className="flex items-center gap-5 md:gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <LocaleSwitcher current={locale} label={dict.nav.language} />
        </div>
      </Container>
    </header>
  );
}
