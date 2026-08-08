# Notas para agentes

Contexto del proyecto: ver [README.md](README.md). Esto son sólo las
convenciones que no se deducen leyendo el código.

## Reglas

- **pnpm**, no npm ni yarn. El lockfile es `pnpm-lock.yaml`.
- **Biome**, no ESLint ni Prettier. Antes de terminar: `pnpm lint` y
  `pnpm typecheck` tienen que pasar limpios.
- **Nada de hardcodear colores, tipografías ni espaciados.** Todo sale de los
  tokens del bloque `@theme` en `src/app/globals.css`.
- **Nada de texto suelto en los componentes.** Todo string visible sale de
  `src/i18n/dictionaries/*.json`. Si se agrega una clave a `es.json`, hay que
  agregarla también a `en.json` o el typecheck falla.
- **Nada de datos del estudio hardcodeados** (mail, redes, nombres): salen de
  `src/site.config.ts`.
- Los comentarios van en español, como el resto del repo.

## Server / client

Casi todo son React Server Components. Sólo llevan `"use client"`:
`locale-switcher`, `contact-form`, `copy-button` y `reveal`. Antes de agregar
uno nuevo, verificar que realmente haga falta estado o eventos del navegador.

`src/lib/projects.ts` y `src/i18n/dictionaries.ts` importan `server-only`: no
se pueden usar desde un componente cliente.

## Animación

Dos cosas, y nada más:

- `<Reveal />` para las apariciones al hacer scroll. No agregar variantes
  nuevas — la consistencia es parte del argumento de venta del estudio.
- `<Intro />`, la entrada animada de la home, que replica el prototipo del
  Figma. Es un caso aparte y no se reutiliza en otras páginas.

La coreografía de la intro está repartida en tres lugares y hay que tocarlos
juntos: el script inline de `layout.tsx` (marca `<html data-intro>` antes del
primer pintado, para que no se vea un fotograma del hero), los bloques
`[data-intro]` de `globals.css` (el hero espera oculto y los glows arrancan
achicados) y `components/intro.tsx` (el overlay y cuándo se va).

## Contenido

Los proyectos son MDX validados con zod en build. El esquema está en
`src/lib/projects.ts` y la documentación para quien escribe en
`content/projects/README.md`. Si se cambia el esquema, actualizar los dos.

`draft: true` esconde un proyecto en producción, tanto de los listados como de
su URL directa. Al tocar el filtrado, mantener las dos cosas.
