import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import type { Locale } from "@/i18n/config";
import { siteConfig } from "@/site.config";

/**
 * Los nombres del estudio, justo antes del cierre: quien llegó hasta acá ya
 * vio el trabajo y el proceso, y lo último que lee antes de escribirnos es
 * con quién va a hablar.
 *
 * Deliberadamente escueto: nombre, rol y los perfiles que estén cargados. Sin
 * título de sección, sin fotos y sin bios.
 */
export function Team({ locale }: { locale: Locale }) {
  return (
    <Section id="equipo">
      {/* Sin encabezado arriba, los nombres son el título de la sección: van
          en h2, como los del resto de la landing. El peso lo pone la clase
          porque los h2 del sitio son Regular y estas fichas van en Bold, como
          las de servicios y proceso. */}
      <ul className="grid gap-10 md:grid-cols-2 lg:gap-[27px]">
        {siteConfig.team.map((member, index) => {
          // Un perfil sin URL no se muestra: un link muerto resta más de lo
          // que suma la fila completa.
          const links = member.links.filter(({ href }) => href);

          return (
            <Reveal key={member.name} delay={index * 0.06}>
              <li className="flex flex-col gap-3 border-t border-line pt-6">
                <h2 className="text-h3 font-bold">{member.name}</h2>
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
