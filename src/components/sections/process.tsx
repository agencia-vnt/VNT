import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Dictionary } from "@/i18n/dictionaries";

export function Process({ dict }: { dict: Dictionary }) {
  return (
    <Section id="proceso" className="bg-indigo">
      <SectionHeading title={dict.process.title} />

      {/* Sobre el indigo no hay texto secundario: todo va en blanco, y la
          línea de arriba de cada paso también. Por eso el numerito va en
          blanco y no en `muted` como los rótulos del resto del sitio: sobre
          este fondo el gris queda con muy poco contraste. */}
      <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-[27px]">
        {dict.process.steps.map((step, index) => (
          <Reveal
            as="li"
            key={step.title}
            delay={index * 0.06}
            className="flex flex-col gap-3 border-t border-blanco pt-6"
          >
            <span className="text-label uppercase text-blanco">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-h3">{step.title}</h3>
            <p className="text-body-s">{step.description}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
