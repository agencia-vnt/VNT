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
      <Container className="grid items-center gap-x-8 gap-y-2 py-10 md:grid-cols-2">
        <nav
          aria-label="Social"
          className="flex flex-wrap gap-6 md:col-start-1 md:row-start-1"
        >
          {social.map(([name, href]) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-body-s capitalize text-muted transition-colors hover:text-blanco"
            >
              {name}
            </a>
          ))}
        </nav>
        <a
          href={`mailto:${siteConfig.email}`}
          data-contact-source="footer"
          className="inline-flex min-h-11 w-fit max-w-full items-center text-body-s text-muted transition-colors [overflow-wrap:anywhere] hover:text-blanco md:col-start-1 md:row-start-2"
        >
          {siteConfig.email}
        </a>
        <p className="mt-4 text-label uppercase text-muted md:col-start-2 md:row-start-1 md:mt-0 md:justify-self-end md:text-right">
          © {year} {siteConfig.legalName}. {dict.footer.rights}
        </p>
        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dict.footer.signatureLabel}
          className="group inline-flex min-h-11 w-fit items-center gap-3 text-muted transition-colors hover:text-blanco focus-visible:text-blanco md:col-start-2 md:row-start-2 md:justify-self-end"
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
      </Container>
    </footer>
  );
}
