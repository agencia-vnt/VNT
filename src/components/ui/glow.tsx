import { cn } from "@/lib/utils";

/**
 * Las manchas de luz violeta del fondo. En Figma son elipses con un
 * desenfoque gaussiano de 100px; acá son un div redondo con `filter: blur`,
 * que pesa cero y escala con el viewport en vez de venir de un PNG.
 *
 * La posición y el tamaño los pone quien lo usa, en porcentajes, para que
 * acompañen al contenedor en pantallas chicas.
 */
export function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-[50%] bg-violeta blur-[100px]",
        className,
      )}
    />
  );
}
