import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/**
 * Ancho máximo y padding lateral, iguales en todo el sitio.
 *
 * El diseño está armado sobre una pantalla de 1440 con 80px de margen a cada
 * lado: de ahí salen el `max-w-[90rem]` y el `xl:px-20`, que dan los 1280px
 * de contenido del Figma. Abajo de eso el margen se achica, porque 80px
 * fijos en un portátil de 1024 se comen demasiado ancho.
 */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[90rem] px-6 md:px-10 lg:px-16 xl:px-20",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
