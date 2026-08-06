import Image from "next/image";
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
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-3 md:gap-7">
        <Link
          href={`/${locale}`}
          aria-label={siteConfig.name}
          className="flex min-h-11 shrink-0 items-center"
        >
          <Image
            src="/brand/isotipo-ink.svg"
            alt=""
            width={46}
            height={39}
            priority
            className="h-10 w-auto sm:hidden"
          />
          <Image
            src="/brand/logo-horizontal-ink.svg"
            alt=""
            width={176}
            height={44}
            priority
            className="hidden h-11 w-44 sm:block"
          />
        </Link>

        <div className="flex items-center gap-3 md:gap-7">
          <nav aria-label={dict.nav.menu} className="flex items-center gap-3 md:gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-11 items-center text-[0.8rem] text-ink-muted transition-colors hover:text-brand-violet md:text-sm"
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
