/**
 * Configuración central del sitio.
 *
 * Este es el ÚNICO archivo que hay que tocar para cambiar nombre, dominio,
 * contacto o redes. Todo lo demás lee de acá.
 */

export const siteConfig = {
  /** Nombre corto de la agencia, el que se ve en el header y la firma. */
  name: "VNT",
  /** Nombre completo para metadatos, structured data y footer legal. */
  legalName: "VNT Studio",

  /**
   * URL canónica en producción. Vercel expone VERCEL_PROJECT_PRODUCTION_URL
   * automáticamente, así que los previews también resuelven bien.
   * TODO: reemplazar el fallback cuando compren el dominio.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  email: "hola@vnt.studio",

  social: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/company/",
    github: "https://github.com/",
    behance: "https://behance.net/",
  },

  /**
   * El equipo. Son dos y eso es una ventaja comercial, no un límite:
   * el cliente habla directo con quien diseña y con quien programa.
   */
  team: [
    {
      name: "Valentina Masso",
      role: { es: "Diseño", en: "Design" },
      url: "",
    },
    {
      name: "TODO: nombre",
      role: { es: "Desarrollo", en: "Engineering" },
      url: "",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
