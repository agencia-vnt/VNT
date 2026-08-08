import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Glow } from "@/components/ui/glow";
import { Isotipo } from "@/components/ui/isotipo";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Las posiciones del pico y de los glows salen del frame de 1440×624 del
 * Figma, pasadas a porcentajes para que acompañen al viewport en vez de
 * quedar clavadas en píxeles de escritorio.
 *
 * Los `data-intro-*` los lee la animación de entrada (ver `<Intro />`): con
 * la intro en curso el contenido arranca oculto y los glows achicados, y
 * entran cuando el overlay se va.
 */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div aria-hidden="true" className="absolute inset-0 -z-10" data-intro-glow="">
        <Glow className="left-[-8%] top-[-50%] h-[71%] w-[48%] opacity-55" />
        <Glow className="left-[73%] top-[-42%] h-[96%] w-[53%] opacity-55" />
        <Glow className="left-[25%] top-[88%] h-[54%] w-[33%] opacity-55" />
        <Isotipo className="absolute left-[19%] top-[-57%] w-[110%] text-violeta opacity-30" />
      </div>

      <Container className="flex min-h-[70svh] flex-col justify-center py-20 md:min-h-[624px] md:pb-[140px] md:pt-[130px]">
        <div data-intro-target="">
          <h1 className="max-w-[900px] text-[2.75rem] leading-[1.04] tracking-[-0.02em] text-balance md:text-[3.5rem] lg:text-display">
            {dict.hero.title}
          </h1>

          <p className="mt-6 max-w-[560px] text-body-s text-muted md:mt-[34px] md:text-body">
            {dict.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-3.5">
            <Link href={`/${locale}/proyectos`} className={buttonStyles("primary")}>
              {dict.hero.ctaPrimary}
            </Link>
            <Link href={`/${locale}/contacto`} className={buttonStyles("secondary")}>
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
