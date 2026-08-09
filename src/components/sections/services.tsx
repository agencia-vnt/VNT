import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * De `xl` para arriba la sección es de dos columnas: el encabezado vive en la
 * izquierda y se queda fijo mientras la grilla pasa al lado.
 *
 * Antes el encabezado iba arriba en una banda y la grilla arrancaba corrida
 * al 33%, así que quedaba un vacío de 450px al costado durante los 768px de
 * alto de la sección. Poniendo el encabezado adentro de ese hueco el
 * corrimiento deja de ser un sobrante y pasa a ser la columna que lo sostiene.
 *
 * Los porcentajes son los del Figma sobre el ancho de contenido de 1280: 348
 * de columna (27%) y 75 de calle (6%).
 *
 * El corte va en `xl` y no en `lg` porque son porcentajes: arrancando en
 * 1024 las fichas quedaban en 275px, más angostas que antes del cambio.
 * Desde 1280 miden 350 y a 1440 llegan a 403. Abajo de `xl` la sección se
 * apila y la grilla usa el ancho completo.
 *
 * No usa `<SectionHeading />` porque ese componente arma la banda horizontal
 * de arriba, que es justo lo que acá no va. La tipografía es la misma.
 */
export function Services({ dict }: { dict: Dictionary }) {
  return (
    <Section id="servicios" className="bg-ink-elev">
      <div className="xl:grid xl:grid-cols-[27%_1fr] xl:gap-x-[6%]">
        <header className="flex flex-col gap-6 xl:sticky xl:top-28 xl:self-start">
          <h2 className="text-h2 text-balance">{dict.services.title}</h2>
          <p className="max-w-[473px] text-body text-muted">{dict.services.intro}</p>
        </header>

        <ul className="mt-16 grid gap-x-[51px] gap-y-13 md:grid-cols-2 xl:mt-0">
          {dict.services.items.map((item, index) => (
            <Reveal
              as="li"
              key={item.title}
              delay={index * 0.06}
              className="flex flex-col gap-3.5 border-t border-line pt-6.5"
            >
              <h3 className="text-h3">{item.title}</h3>
              <p className="text-body-s text-muted">{item.description}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
