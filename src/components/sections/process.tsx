import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Dictionary } from "@/i18n/dictionaries";

export function Process({ dict }: { dict: Dictionary }) {
  return (
    <Section id="proceso" className="bg-paper-muted">
      <SectionHeading title={dict.process.title} />

      <ol className="mt-14 grid gap-10 md:grid-cols-4">
        {dict.process.steps.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.06}>
            <li>
              <span className="font-mono text-xs text-ink-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {step.description}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
