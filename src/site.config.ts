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
   * URL canónica en producción: sin www y sin barra final.
   *
   * Se resuelve en BUILD, no en runtime. Cambiar el dominio en el panel de
   * Vercel no alcanza: hace falta un deploy nuevo para que se actualicen los
   * canonical, el sitemap y el link de las firmas.
   *
   * El fallback a VERCEL_PROJECT_PRODUCTION_URL hace que los previews
   * resuelvan a su propia URL en vez de a producción.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  email: "hola@vntagencia.com",

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
