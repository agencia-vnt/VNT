import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Dictionary } from "@/i18n/dictionaries";

export function Services({ dict }: { dict: Dictionary }) {
  return (
    <Section id="servicios">
      <SectionHeading title={dict.services.title} intro={dict.services.intro} />

      {/* La grilla no arranca en el margen: en el diseño está corrida a la
          derecha, alineada con la columna del texto de apoyo. */}
      <ul className="mt-16 grid gap-x-[51px] gap-y-13 md:grid-cols-2 lg:ml-auto lg:w-[795px]">
        {dict.services.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06}>
            <li className="flex flex-col gap-3.5 border-t border-line pt-6.5">
              <span className="text-label uppercase text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h3">{item.title}</h3>
              <p className="text-body-s text-muted">{item.description}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
