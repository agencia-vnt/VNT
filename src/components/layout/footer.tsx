import Image from "next/image";
import { Container } from "@/components/ui/container";
import type { Dictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/site.config";

type FooterProps = {
  dict: Dictionary;
};

export function Footer({ dict }: FooterProps) {
  const year = new Date().getFullYear();

  const social = Object.entries(siteConfig.social).filter(([, href]) => href);

  return (
    <footer className="border-t border-line bg-ink">
      <Container className="flex flex-col gap-8 py-13 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-start gap-4">
          <nav aria-label="Social" className="flex flex-wrap gap-6">
            {social.map(([name, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-body-s capitalize text-muted transition-colors hover:text-blanco"
              >
                {name}
              </a>
            ))}
          </nav>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-body-s text-muted transition-colors hover:text-blanco"
          >
            {siteConfig.email}
          </a>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <p className="text-label uppercase text-muted">
            © {year} {siteConfig.legalName}. {dict.footer.rights}
          </p>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={dict.footer.signatureLabel}
            className="group inline-flex min-h-11 w-fit items-center gap-3 text-muted transition-colors hover:text-blanco focus-visible:text-blanco"
          >
            <span lang="en" className="text-signature font-medium">
              {dict.footer.createdBy}
            </span>
            <Image
              src="/brand/logo-signature-white.svg"
              alt=""
              width={2150}
              height={589}
              className="h-7 w-auto opacity-80 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          </a>
        </div>
      </Container>
    </footer>
  );
}
