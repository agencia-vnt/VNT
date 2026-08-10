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
          <Image
            src="/brand/logo-lockup-blanco.svg"
            alt={siteConfig.legalName}
            width={214}
            height={27}
            className="h-[22px] w-auto"
          />
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-body-s text-muted transition-colors hover:text-blanco"
          >
            {siteConfig.email}
          </a>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
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

          <p className="text-label uppercase text-muted">
            © {year} {siteConfig.legalName}. {dict.footer.rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}
