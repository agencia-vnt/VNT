import "server-only";
import type { Locale } from "./config";
import type esDictionary from "./dictionaries/es.json";

/**
 * El español es la fuente de verdad de la forma del diccionario. Si se agrega
 * una clave a es.json y no a en.json, el typecheck falla: no se puede publicar
 * una traducción incompleta sin enterarse.
 */
export type Dictionary = typeof esDictionary;

/**
 * Se importan de forma dinámica para que el bundle de cada idioma no arrastre
 * al otro. Sólo se ejecuta en el server.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
