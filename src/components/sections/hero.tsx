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
        <Glow className="left-[-20%] top-[-30%] h-[60%] w-[80%] opacity-55 md:left-[-8%] md:top-[-50%] md:h-[71%] md:w-[48%]" />
        <Glow className="left-[50%] top-[10%] h-[70%] w-[80%] opacity-55 md:left-[73%] md:top-[-42%] md:h-[96%] md:w-[53%]" />
        <Glow className="left-[25%] top-[88%] h-[54%] w-[60%] opacity-55 md:w-[33%]" />
        {/* En el diseño el pico entra por arriba a la derecha y queda casi
            todo fuera del cuadro.

            En pantalla angosta eso lo dejaba invisible, así que se va abajo a
            la derecha. El SVG trae aire alrededor del pico, por eso hace falta
            correrlo bastante más allá del borde para que la diagonal salga del
            cuadro en vez de cortarse en plano.

            De `md` para arriba se mide por ALTO y no por ancho: el hero tiene
            alto fijo, así que un pico proporcional al ancho quedaba achatado
            sobre el título en tablet. */}
        <Isotipo className="absolute bottom-[-32%] left-[22%] w-[160%] text-violeta opacity-30 md:bottom-auto md:left-[19%] md:top-[-57%] md:h-[200%] md:w-auto md:max-w-none" />
      </div>

      <Container className="flex min-h-[70svh] flex-col justify-center py-20 md:min-h-[624px] md:pb-[140px] md:pt-[130px]">
        <div data-intro-target="">
          <h1 className="max-w-[900px] text-display text-balance">{dict.hero.title}</h1>

          <p className="mt-6 max-w-[560px] text-body text-muted md:mt-[34px]">
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
