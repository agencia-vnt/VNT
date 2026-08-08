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
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-4 md:gap-9">
        <Link
          href={`/${locale}`}
          aria-label={siteConfig.name}
          className="flex min-h-11 shrink-0 items-center"
        >
          <Image
            src="/brand/logo-lockup-blanco.svg"
            alt=""
            width={214}
            height={27}
            priority
            className="h-5 w-auto sm:h-[27px]"
          />
        </Link>

        <div className="flex items-center gap-4 md:gap-9">
          <nav aria-label={dict.nav.menu} className="flex items-center gap-4 md:gap-9">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-11 items-center text-sm text-muted transition-colors hover:text-blanco md:text-body-s"
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
