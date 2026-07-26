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
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight">
            {siteConfig.name}
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-2 inline-block text-sm text-ink-muted transition-colors hover:text-ink"
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
                className="text-sm capitalize text-ink-muted transition-colors hover:text-ink"
              >
                {name}
              </a>
            ))}
          </nav>

          <p className="text-xs text-ink-muted">
            © {year} {siteConfig.legalName}. {dict.footer.rights}{" "}
            <Link
              href={`/${locale}/firma`}
              className="underline underline-offset-2 transition-colors hover:text-ink"
            >
              {dict.signature.title}
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
