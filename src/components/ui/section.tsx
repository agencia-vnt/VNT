import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-section", className)}>
      <Container>{children}</Container>
    </section>
  );
}

type SectionHeadingProps = {
  title: string;
  /** Texto de apoyo. En el diseño va al lado del título, no debajo. */
  intro?: string;
  /** Bloque alineado al margen derecho ("Ver todos los proyectos →"). */
  action?: ReactNode;
  className?: string;
};

/**
 * Encabezado de sección. El título ocupa una columna angosta y el texto de
 * apoyo otra a su derecha; la acción, si la hay, se va al margen opuesto.
 * Los anchos (348 y 473) son los del Figma.
 */
export function SectionHeading({ title, intro, action, className }: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10",
        className,
      )}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-[75px]">
        <h2
          className={cn(
            "text-3xl leading-[1.08] tracking-[-0.015em] text-balance md:text-h2",
            // Con texto de apoyo al lado, el título se achica a su columna;
            // solo, ocupa lo que necesite.
            intro && "md:w-[348px] md:shrink-0",
          )}
        >
          {title}
        </h2>

        {intro ? (
          <p className="max-w-[473px] text-body-s text-muted md:text-body">{intro}</p>
        ) : null}
      </div>

      {action ?? null}
    </header>
  );
}
