import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/site.config";

/**
 * Los nombres del estudio, justo antes del cierre: quien llegó hasta acá ya
 * vio el trabajo y el proceso, y lo último que lee antes de escribirnos es
 * con quién va a hablar.
 *
 * Deliberadamente escueto: nombre, rol y los perfiles que estén cargados. Sin
 * fotos ni bios, que a dos personas les queda grande.
 */
export function Team({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section id="equipo">
      <SectionHeading title={dict.team.title} />

      <ul className="mt-14 grid gap-10 md:grid-cols-2 lg:gap-[27px]">
        {siteConfig.team.map((member, index) => {
          // Un perfil sin URL no se muestra: un link muerto resta más de lo
          // que suma la fila completa.
          const links = member.links.filter(({ href }) => href);

          return (
            <Reveal key={member.name} delay={index * 0.06}>
              <li className="flex flex-col gap-3 border-t border-line pt-6">
                <h3 className="text-h3">{member.name}</h3>
                <p className="text-body-s text-muted">{member.role[locale]}</p>

                {links.length > 0 ? (
                  <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-2">
                    {links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-body-s text-muted underline underline-offset-4 transition-colors hover:text-blanco"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
