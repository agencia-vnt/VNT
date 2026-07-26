# VNT — sitio del estudio

Landing y portfolio de VNT. Es también la página a la que apuntan las firmas
que dejamos al pie de los proyectos de clientes.

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
`.env.local` y poner una `RESEND_API_KEY`. Sin ella el formulario no envía y
deja el mensaje en la consola del servidor.

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción (valida el frontmatter de todos los `.mdx`) |
| `pnpm start` | Sirve el build de producción |
| `pnpm lint` | Formato + lint (Biome) |
| `pnpm lint:fix` | Igual, pero arreglando lo que se puede |
| `pnpm typecheck` | `tsc --noEmit` |

## Cómo está organizado

```
content/projects/          Los casos del portfolio, en MDX. Ver el README de ahí.
public/projects/<slug>/    Las imágenes de cada caso.
src/
  site.config.ts           Nombre, dominio, mail, redes, equipo. Empezá por acá.
  app/
    globals.css            Tokens de marca: colores, tipografías, espaciados.
    [locale]/              Todas las páginas, bajo /es y /en.
    robots.ts sitemap.ts   Se generan solos a partir del contenido.
  components/
    ui/                    Piezas base (Container, Button, Section, Reveal).
    layout/                Header, Footer, cambio de idioma.
    sections/              Bloques de la home.
    signature.tsx          La firma que dejamos en los sitios de clientes.
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
- **El snippet de la firma** → se ve renderizado en `/es/firma`

## Idiomas

El sitio sirve `/es` y `/en`; `/` redirige a `/es`. Los segmentos de URL quedan
en español en ambos idiomas (`/en/proyectos`) para que los links no se rompan.

`es.json` es la fuente de verdad: si se agrega una clave ahí y falta en
`en.json`, el `typecheck` falla. Un proyecto sin `en.mdx` muestra el español en
vez de romper.

Para agregar un idioma: sumarlo a `locales` en `src/i18n/config.ts`, crear el
JSON del diccionario y listo.

Hoy `/` redirige a `/es` de forma fija (`next.config.ts`). Si algún día se
quiere detectar el idioma del navegador, va en un `src/proxy.ts` — el
reemplazo de `middleware.ts` en Next 16.

## La firma

Cada sitio que entregamos lleva un crédito al pie apuntando acá, con el cliente
en el parámetro `ref`:

```
https://vnt.studio/?ref=nombre-cliente
```

Los snippets listos para copiar están en `/es/firma`. Conviene usar siempre el
mismo slug que la carpeta del caso en `content/projects/`.

Para leer los `ref`: panel de Vercel → el proyecto → **Analytics**, filtrando por
el parámetro `ref` en la lista de páginas. Requiere tener Web Analytics activado
en el panel una sola vez; el `<Analytics />` del layout ya envía los eventos.

## Deploy

Vercel detecta Next.js solo: no hace falta configurar el build.

1. Importar el repo en Vercel.
2. Cargar las variables de `.env.example` en Settings → Environment Variables.
3. Apuntar el dominio y poner `NEXT_PUBLIC_SITE_URL`.

Cada push a `main` publica; cada pull request genera un preview con su propia
URL, que es la mejor forma de mostrarle avances a un cliente.
