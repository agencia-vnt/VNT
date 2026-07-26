import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Dictionary } from "@/i18n/dictionaries";

export function Services({ dict }: { dict: Dictionary }) {
  return (
    <Section id="servicios">
      <SectionHeading title={dict.services.title} intro={dict.services.intro} />

      <ul className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2">
        {dict.services.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06}>
            <li className="border-t border-line pt-6">
              <span className="font-mono text-xs text-ink-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-xl tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.description}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
