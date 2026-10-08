# VNT — sitio del estudio

Landing y portfolio de VNT: identidad y sitios web, y sistemas y herramientas
a medida. Las firmas actuales de los sitios de clientes abren Instagram;
el contrato de esas firmas vive en `docs/signature.md`.

## Stack

| Pieza | Qué usamos | Por qué |
|---|---|---|
| Framework | Next.js 16 (App Router) | Todo el sitio sale estático; deploy y previews en Vercel |
| Lenguaje | TypeScript en modo estricto | |
| Estilos | Tailwind CSS v4 | Los tokens de marca viven en `src/app/globals.css` |
| Contenido | MDX en `content/projects/` | Sin CMS: los casos se versionan en git como el código |
| Animación | `motion` | Una sola primitiva (`<Reveal />`), respeta `prefers-reduced-motion` |
| Formulario | Server Action + Resend | Funciona incluso con JavaScript deshabilitado |
| Lint y formato | Biome | Una herramienta en vez de ESLint + Prettier |
| Paquetes | pnpm | |

## Arrancar

```bash
pnpm install
```

```bash
pnpm dev
```

El sitio queda en <http://localhost:3000>, que redirige a `/es`.

Para probar el formulario de contacto hay que copiar `.env.example` a
`.env.local` y poner una `RESEND_API_KEY`. Sin ella el formulario devuelve un
error y no envía. Los mensajes no se escriben en los logs del servidor.
El destinatario es el mismo correo público de `src/site.config.ts`:
`vntclub@gmail.com`. `CONTACT_FROM_EMAIL` debe pertenecer a un dominio verificado
en Resend; el correo del visitante se usa como `replyTo`.

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción (valida el frontmatter de todos los `.mdx`) |
| `pnpm start` | Sirve el build de producción |
| `pnpm lint` | Formato + lint (Biome) |
| `pnpm lint:fix` | Igual, pero arreglando lo que se puede |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Validación y envío de contacto con proveedor simulado; Node 24 |

## Cómo está organizado

```
content/projects/          Los casos del portfolio, en MDX. Ver el README de ahí.
public/brand/               Logos y recursos gráficos oficiales para runtime.
public/projects/<slug>/    Las imágenes de cada caso.
src/
  site.config.ts           Nombre, dominio, mail, redes, equipo. Empezá por acá.
  app/
    fonts/                  Host Grotesk, autohospedada con next/font/local.
    globals.css            Tokens de marca: colores, tipografías, espaciados.
    [locale]/              Todas las páginas, bajo /es y /en.
    robots.ts sitemap.ts   Se generan solos a partir del contenido.
  components/
    ui/                    Piezas base (Container, Button, Section, Reveal).
    layout/                Header, Footer, cambio de idioma.
    sections/              Bloques de la home.
    mdx.tsx                Estilos y componentes disponibles dentro de un .mdx.
  i18n/                    Idiomas y textos de interfaz.
  lib/projects.ts          Lectura y validación de los .mdx.
```

## Dónde tocar cada cosa

- **Nombre, mail, redes, integrantes** → `src/site.config.ts`
- **Colores y tipografías** → el bloque `@theme` de `src/app/globals.css`
- **Textos de la interfaz** → `src/i18n/dictionaries/es.json` (y `en.json`)
- **Proyectos del portfolio** → `content/projects/`, ver el
  [README de contenido](content/projects/README.md)
- **Crédito para sitios de clientes** → `docs/signature.md`

## Idiomas

El sitio sirve `/es` y `/en`; `/` redirige a `/es`. Los segmentos de URL quedan
en español en ambos idiomas (`/en/proyectos`) para que los links no se rompan.

`es.json` es la fuente de verdad: si se agrega una clave ahí y falta en
`en.json`, el `typecheck` falla. Los dos casos publicados tienen `es.mdx` y
`en.mdx`. El fallback a español sigue disponible para borradores y futuras
incorporaciones, pero un caso nuevo se considera completo cuando tiene ambos.
Las capturas de las interfaces de clientes se comparten entre idiomas;
los textos alternativos y epígrafes se traducen.

Para agregar un idioma: sumarlo a `locales` en `src/i18n/config.ts`, crear el
JSON del diccionario y listo.

Hoy `/` redirige a `/es` de forma fija (`next.config.ts`). Si algún día se
quiere detectar el idioma del navegador, va en un `src/proxy.ts` — el
reemplazo de `middleware.ts` en Next 16.

## Créditos en sitios de clientes

El procedimiento interno y los snippets viven en
[`docs/signature.md`](docs/signature.md). No existe una pantalla pública para
esta herramienta.

## Deploy

- Repo: <https://github.com/agencia-vnt/VNT>
- Producción: <https://vntagencia.com> — proyecto `vnt` en la cuenta de Vercel
  de la agencia. El dominio canónico es **sin www**.

Vercel detecta Next.js solo, así que no hay build configurado a mano. Cada push
a `main` publica, y cada pull request genera un preview con su propia URL — la
mejor forma de mostrarle avances a un cliente.

Configuración y aceptación de producción:

- La URL pública, los canonical y el sitemap usan `https://vntagencia.com`.
  Mantener `NEXT_PUBLIC_SITE_URL` explícita en Vercel; se lee durante el build.
- `www` redirige al dominio sin `www`. La raíz redirige a `/es`.
- Web Analytics está integrado. La carga del script no prueba que los eventos
  aparezcan en el panel; comprobar recepción en el proyecto y período correctos.
- El formulario necesita `RESEND_API_KEY` y un `CONTACT_FROM_EMAIL` verificado.
  No usar una dirección Gmail como remitente de Resend.
- Después de publicar, enviar una sola consulta identificada como prueba y
  confirmar recepción en Gmail y funcionamiento de la respuesta al remitente.
  Un estado de éxito significa que Resend aceptó el envío; no confirma entrega.

## Medición de consultas

Se reutiliza `@vercel/analytics`, sin un servicio de seguimiento adicional:

| Evento | Qué demuestra | Propiedades |
|---|---|---|
| `contact_clicked` | Clic a la página de contacto | `locale`, `source` |
| `email_clicked` | Clic a un enlace de correo, no un mensaje enviado | `locale`, `source` |
| `contact_submitted` | Envío aceptado por Resend, no recepción en la casilla | `locale` |

Las propiedades tienen valores controlados: no se envían nombres, direcciones,
mensajes, texto de enlaces ni URLs aportadas por visitantes. Los errores de
medición no interrumpen la navegación ni cambian el resultado de un envío.

Los [eventos personalizados de Vercel](https://vercel.com/docs/analytics/custom-events)
requieren Pro o Enterprise. Verificar el plan del equipo antes de dar por
aceptada la medición; este cambio no contrata ni modifica planes.
Las firmas de sitios de clientes siguen apuntando a Instagram y no aportan
atribución a esta landing.

El alcance, los criterios de cierre y los pendientes editoriales están en
[`docs/action-plan.md`](docs/action-plan.md).
