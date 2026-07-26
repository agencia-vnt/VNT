import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Junta clases de Tailwind resolviendo conflictos (la última gana). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(year: number, locale: string) {
  return new Intl.NumberFormat(locale, { useGrouping: false }).format(year);
}
