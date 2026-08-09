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

  email: "vntclub@gmail.com",

  /**
   * Redes. El footer sólo muestra las que tienen URL: dejar una en "" la
   * esconde, que es mejor que publicar un link a la home de la red.
   */
  social: {
    instagram: "https://instagram.com/vnt.agencia",
    github: "",
  },

  /**
   * El equipo. Son dos y eso es una ventaja comercial, no un límite:
   * el cliente habla directo con quien diseña y con quien programa.
   *
   * `links` son los perfiles públicos que se muestran abajo del nombre en la
   * landing. Los que están en "" no se muestran, igual que las redes del pie:
   * mejor un perfil menos que un link a la home de LinkedIn. El orden del
   * array es el orden en que salen.
   */
  team: [
    {
      name: "Valentina Masso",
      role: { es: "Diseño", en: "Design" },
      links: [
        { label: "LinkedIn", href: "" },
        { label: "Behance", href: "" },
        { label: "Portafolio", href: "" },
      ],
    },
    {
      name: "Mateo Ramos",
      role: { es: "Desarrollo", en: "Engineering" },
      links: [
        { label: "LinkedIn", href: "" },
        { label: "GitHub", href: "" },
      ],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
