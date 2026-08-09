import Image from "next/image";
import Link from "next/link";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
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
    { href: `/${locale}/contacto`, label: dict.nav.contact },
  ];

  // `relative` para que el panel del menú chico se cuelgue del header.
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <Container className="relative flex h-16 items-center justify-between gap-4 md:h-20 md:gap-9">
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
            className="h-[22px] w-auto md:h-[27px]"
          />
        </Link>

        {/* En pantallas grandes los links van a la vista; abajo de `md` se
            pliegan en <MobileNav />, porque no entran junto al logo. */}
        <div className="hidden items-center gap-9 md:flex">
          <nav aria-label={dict.nav.menu} className="flex items-center gap-9">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-11 items-center text-body-s text-muted transition-colors hover:text-blanco"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <LocaleSwitcher current={locale} label={dict.nav.language} />
        </div>

        <MobileNav links={links} menuLabel={dict.nav.menu}>
          <LocaleSwitcher current={locale} label={dict.nav.language} />
        </MobileNav>
      </Container>
    </header>
  );
}
