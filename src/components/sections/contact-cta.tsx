import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Glow } from "@/components/ui/glow";
import { Isotipo } from "@/components/ui/isotipo";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/site.config";

export function ContactCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-ink">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Glow className="left-[75%] top-[-28%] h-[113%] w-[50%] opacity-40" />
        <Isotipo className="absolute left-[79%] top-[37%] w-[15%] text-lima opacity-95" />
      </div>

      <Container className="py-24 md:py-[130px]">
        <h2 className="max-w-[720px] text-[2.75rem] leading-[1.04] tracking-[-0.02em] text-balance md:text-[3.5rem] lg:text-display">
          {dict.contact.title}
        </h2>

        <p className="mt-5 max-w-[451px] text-body-s text-muted md:text-body">
          {dict.contact.ctaIntro}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link href={`/${locale}/contacto`} className={buttonStyles("primary")}>
            {dict.contact.ctaButton}
          </Link>
          <p className="text-body-s text-muted">
            {dict.contact.orEmail}{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-blanco underline underline-offset-4 transition-colors hover:text-lima"
            >
              {siteConfig.email}
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
