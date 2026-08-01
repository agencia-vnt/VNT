# Proyectos

Cada proyecto es **una carpeta** con un archivo `.mdx` por idioma:

```
content/projects/
  panaderia-lume/
    es.mdx        ← obligatorio
    en.mdx        ← opcional: si no está, se muestra el español
```

El nombre de la carpeta es el slug de la URL:
`panaderia-lume` → `/es/proyectos/panaderia-lume`.

Usá minúsculas, sin acentos y con guiones.

## Frontmatter

Va arriba de todo, entre `---`. Se valida en el build: si un campo está mal, el
build falla con un mensaje que dice exactamente qué arreglar (mejor que
descubrirlo en producción).

| Campo      | Obligatorio | Qué es |
|------------|-------------|--------|
| `title`    | sí | Título del caso |
| `client`   | sí | Nombre del cliente |
| `year`     | sí | Año de entrega, número sin comillas |
| `summary`  | sí | Una o dos líneas: qué era y qué resolvimos |
| `roles`    | no | `["Diseño", "Desarrollo"]` |
| `stack`    | no | `["Next.js", "Tailwind"]` |
| `url`      | no | Link al sitio publicado |
| `cover`    | no | Ruta dentro de `/public`, ej: `/projects/slug/cover.jpg` |
| `coverAlt` | si hay `cover` | Descripción de la portada (accesibilidad y SEO) |
| `featured` | no | `true` para que aparezca en la home |
| `order`    | no | Número: más chico = más arriba. Por defecto 999 |
| `draft`    | no | `true` = se ve en local, nunca en producción |

## Imágenes

Van en `public/projects/<slug>/`. En el MDX se referencian desde la raíz:

```mdx
<Figure src="/projects/panaderia-lume/home.jpg" width={1600} height={1000}
        alt="Home del sitio" caption="La home, en desktop" />
```

Componentes disponibles dentro del `.mdx`, sin importar nada:

- `<Figure src width height alt caption />` — imagen optimizada
- `<Grid>` — dos imágenes lado a lado
- `<Quote author="...">` — cita destacada del cliente

## Flujo para agregar un proyecto

1. Copiar la carpeta `ejemplo/` y renombrarla con el slug del cliente.
2. Completar el frontmatter y escribir el caso.
3. Poner las imágenes en `public/projects/<slug>/`.
4. Sacar `draft: true`.
5. Commit y push: Vercel lo publica solo.
