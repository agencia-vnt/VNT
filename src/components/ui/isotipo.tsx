import { cn } from "@/lib/utils";

/**
 * El pico de la marca. Se pinta con `currentColor`, así que el color sale de
 * la clase de texto de quien lo usa (`text-violeta`, `text-lima`…). Es la
 * misma geometría que `public/brand/isotipo-*.svg`, en línea para poder
 * teñirlo y animarlo sin duplicar el archivo una vez por color.
 */
export function Isotipo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1394.2 1169.64"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("block", className)}
    >
      <path d="M814.69,292.54c95.74,195.54,191.49,391.08,287.23,586.62h-220.34v-338.88l-289.34,338.88c-98.5-1.06-197-2.12-295.51-3.18,172.65-194.48,345.3-388.95,517.96-583.43Z" />
    </svg>
  );
}
