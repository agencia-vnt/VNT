# Proyectos

Cada proyecto es **una carpeta** con un archivo `.mdx` por idioma:

```
content/projects/
  panaderia-lume/
    es.mdx        ← obligatorio
    en.mdx        ← traducción para la experiencia en inglés
```

El nombre de la carpeta es el slug de la URL:
`panaderia-lume` → `/es/proyectos/panaderia-lume`.

Usá minúsculas, sin acentos y con guiones.

Los casos publicados deben mantenerse completos en español e inglés. El build
exige ambos archivos para un caso con `draft: false`; el fallback se conserva
en desarrollo y para borradores. Traducí también título, resumen, roles, textos
alternativos y epígrafes; el nombre del cliente y el stack se conservan.

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
| `status`   | no | `live`, `delivered` o `in-progress`. Por defecto `live` |
| `kind`     | no | `website`, `internal-tool`, `catalog` o `mixed`. Por defecto `website` |
| `scope`    | no | Lista breve de entregables, traducida por idioma. Por defecto `[]` |
| `url`      | no | Link al sitio publicado |
| `cover`    | no | Ruta dentro de `/public`, ej: `/projects/slug/cover.jpg` |
| `coverAlt` | si hay `cover` | Descripción de la portada (accesibilidad y SEO) |
| `featured` | no | `true` para que aparezca en la home |
| `order`    | no | Número: más chico = más arriba. Por defecto 999 |
| `draft`    | no | `true` = se ve en local, nunca en producción |

`draft` controla únicamente la publicación del caso. `status` describe el
trabajo: `live` significa que está publicado o en uso, `delivered` que se
entregó el alcance y `in-progress` que sigue en desarrollo. Un trabajo en
progreso puede tener un caso público; uno entregado puede ser un borrador.
`delivered` no implica que exista una URL pública, ni `live` que se haya
cerrado la evolución del producto.

`kind` distingue sitio web, herramienta interna, catálogo y alcance mixto.
`scope` precisa lo realizado sin depender de la lista de tecnologías. Por
ejemplo: `["Sitio institucional", "Panel de contenidos"]`. `status`, `kind` y
`draft` deben coincidir en ambos idiomas; `scope` se traduce. Los casos
anteriores que no definan estos campos conservan los valores por defecto.

## Imágenes

Van en `public/projects/<slug>/`. En el MDX se referencian desde la raíz:

```mdx
<Figure src="/projects/panaderia-lume/home.jpg" width={1600} height={1000}
        alt="Home del sitio" caption="La home, en desktop" />
```

Componentes disponibles dentro del `.mdx`, sin importar nada:

- `<Figure src width height alt caption narrow />` — imagen optimizada; `narrow`
  es opcional y limita el ancho de una captura vertical
- `<Grid>` — dos imágenes lado a lado
- `<Quote author="...">` — cita destacada del cliente

Usá las dimensiones reales del archivo para `width` y `height`. Las capturas
pueden compartirse entre idiomas: si la interfaz del cliente está en español,
aclaralo en el epígrafe de la versión inglesa. Revisá que no tengan datos
personales, credenciales ni contenido privado antes de incorporarlas.

El cargador de producción comprueba que las portadas y referencias estáticas
locales de `<Figure>`, `<img>` y Markdown existan como archivos dentro de
`public`, sin escapes hacia otras carpetas. Las rutas locales parten de `/`,
como en el ejemplo; los ejemplos comentados no cuentan como imágenes activas.
Una referencia faltante detiene el build con el caso y el archivo afectados.

Los resultados numéricos, tiempos de carga y afirmaciones de accesibilidad
requieren evidencia con fecha y alcance de la medición. Si aún no hay datos,
describí lo implementado y los próximos indicadores a medir sin presentar
objetivos como resultados. Publicá testimonios sólo con aprobación del cliente;
los pendientes editoriales pueden anotarse en un comentario MDX, sin citas de
ejemplo visibles.

## Flujo para agregar un proyecto

1. Copiar la carpeta `ejemplo/` y renombrarla con el slug del cliente.
2. Completar el frontmatter y escribir el caso en español e inglés.
3. Poner las imágenes en `public/projects/<slug>/` y verificar sus dimensiones.
4. Revisar ambas versiones, enlaces, capturas, estado y alcance; sacar
   `draft: true` en los dos archivos cuando el caso esté listo para publicar.
5. Ejecutar lint, typecheck, test y build, y revisar las páginas en ambos idiomas.
   Los tests incluyen el cargador real, borradores, estados, idiomas e imágenes.
6. Con publicación autorizada, commit y push: Vercel lo publica solo.
