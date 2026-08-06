import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/site.config";

type FooterProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();

  const social = Object.entries(siteConfig.social).filter(([, href]) => href);

  return (
    <footer className="border-t border-brand-violet bg-ink text-brand-white">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Image
            src="/brand/logo-horizontal-white.svg"
            alt="VNT agencia"
            width={176}
            height={44}
            className="h-11 w-44"
          />
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-3 inline-block text-sm text-brand-white/70 transition-colors hover:text-brand-lime"
          >
            {siteConfig.email}
          </a>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <nav aria-label="Social" className="flex flex-wrap gap-4">
            {social.map(([name, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-sm capitalize text-brand-white/70 transition-colors hover:text-brand-lime"
              >
                {name}
              </a>
            ))}
          </nav>

          <p className="text-xs text-brand-white/60">
            © {year} {siteConfig.legalName}. {dict.footer.rights}{" "}
            <Link
              href={`/${locale}/firma`}
              className="underline underline-offset-2 transition-colors hover:text-brand-lime"
            >
              {dict.signature.title}
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
