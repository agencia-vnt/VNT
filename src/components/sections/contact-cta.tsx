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
        <Glow className="left-[55%] top-[-20%] h-[90%] w-[75%] opacity-40 md:left-[75%] md:top-[-28%] md:h-[113%] md:w-[50%]" />
        {/* En pantalla angosta el pico sube al aire que queda arriba del
            título: al costado del texto chocaba, y abajo se cortaba contra
            el borde de la sección. */}
        <Isotipo className="absolute left-[70%] top-[6%] w-[26%] text-lima opacity-95 md:left-[79%] md:top-[37%] md:w-[15%]" />
      </div>

      <Container className="py-24 md:py-[130px]">
        <h2 className="max-w-[720px] text-display text-balance">{dict.contact.title}</h2>

        <p className="mt-5 max-w-[451px] text-body text-muted">{dict.contact.ctaIntro}</p>

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
