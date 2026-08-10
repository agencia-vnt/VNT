import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No anunciar la tecnología en los headers de respuesta.
  poweredByHeader: false,

  // El layout raíz vive bajo [locale]. Esta convención permite que las URLs
  // que no coinciden con ninguna ruta usen nuestra 404 en vez de la genérica.
  experimental: {
    globalNotFound: true,
  },

  async redirects() {
    return [
      {
        // La raíz manda al idioma por defecto (ver src/i18n/config.ts).
        // 307, no 308: el día que se detecte el idioma del navegador con
        // src/proxy.ts, los buscadores no tienen un permanente cacheado.
        source: "/",
        destination: "/es",
        permanent: false,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Los .mdx se leen del disco en build: hay que incluirlos en el bundle
  // de despliegue para que el tracing de Vercel no los descarte.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
};

export default nextConfig;
