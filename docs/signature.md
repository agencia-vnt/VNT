# Firma de VNT

Esta es la guía canónica para la firma del estudio y de los sitios de clientes.
La composición es `created by` en Host Grotesk junto al SVG blanco oficial de
VNT. Toda la pieza es un único enlace a
`https://www.instagram.com/vnt.agencia/`.

## Identidad e interacción

- Texto `created by` en minúsculas, con `lang="en"`.
- Host Grotesk local, peso 500 y altura de línea 1.4.
- Logo completo: isotipo y logotipo, sin alterar su proporción.
- Copia para web con el encuadre ajustado; conservar el original documental.
- Usar el SVG blanco sobre fondos oscuros. La variante para fondos claros
  requiere definir y verificar otro recurso de marca.
- Texto con el color secundario del footer, verificando contraste mínimo de
  4.5:1 contra el fondo efectivo.
- Logo con opacidad inicial 0.8 y opacidad 1 al pasar el cursor o enfocar.
- Firma horizontal, con texto y logo centrados verticalmente.
- Área interactiva de al menos 44 px de alto y foco de teclado visible.
- `target="_blank"` y `rel="noopener noreferrer"`.
- Etiqueta accesible que identifique VNT, Instagram y la apertura en otra pestaña.
  El logo es decorativo (`alt=""`), porque la etiqueta del enlace ya nombra VNT.

## Proporciones comunes

Las medidas son valores nominales con el tamaño de texto predeterminado del
navegador. No deben impedir que el usuario amplíe el contenido.

| Variante | Texto | Alto del logo | Separación | Espaciado entre letras |
| --- | --- | --- | --- | --- |
| Escritorio, desde 768 px | 11 px | 28 px | 12 px | 0.06em |
| Compacta, por debajo de 768 px | 10 px | 20 px | 8 px | 0.06em |

La ubicación se adapta al footer de cada sitio. Mantener un espacio propio para
la firma y evitar que comprima los datos o enlaces del cliente. Si al ampliar
el texto deja de caber junto a la marca o al copyright, permitir que pase a otra
fila, conservando su alineación.

## Variantes deliberadas

| Proyecto | Variante y ubicación |
| --- | --- |
| VNT | Mantiene 11/28/12 px también en móvil. En escritorio comparte fila con el mail, a la derecha; en móvil cierra el footer, a la izquierda. Es la firma del propio estudio. |
| Rodrigo Stampone | Conserva Rodrigo y 4SIDE a la izquierda y la firma a la derecha, también en móvil. Hasta 42rem usa texto fluido entre 10 y 12 px, logo entre 22 y 28 px, separación de 8 px y espaciado entre letras de 0. La variante responde a la referencia visual elegida. |
| Aleatur | Variante compacta por debajo de 768 px. En móvil comparte fila con la marca; los contactos quedan debajo. |
| AKDemia | Variante compacta por debajo de 768 px. En móvil queda debajo del copyright, alineada a la derecha. |
| Argenpel | Variante compacta por debajo de 768 px. Comparte fila con el copyright, centrada verticalmente. |

En Rodrigo los valores fluidos son `clamp(0.625rem, 2.8vw, 0.75rem)` para el
texto y `clamp(1.375rem, 6.2vw, 1.75rem)` para el alto del logo. Las excepciones
de VNT y Rodrigo no modifican el estándar compacto para nuevos sitios.

Cada repositorio conserva su copia del logo, la fuente y la implementación.
Esta guía define el contrato común; no requiere un paquete compartido.

## HTML y Astro

Adaptar la ruta del SVG a los recursos del proyecto y cargar Host Grotesk local.
En Astro se puede importar el recurso como URL en lugar de usar una ruta pública.

```html
<a
  class="vnt-signature"
  href="https://www.instagram.com/vnt.agencia/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="created by VNT — Instagram (se abre en otra pestaña)"
>
  <span lang="en">created by</span>
  <img src="/brand/logo-signature-white.svg" alt="" width="2150" height="589"
    loading="lazy" decoding="async" />
</a>
```

## React y Next.js

Reutilizar la carga local de Host Grotesk del proyecto. Con `next/font/local`,
aplicar su clase a la firma y usar el nombre de fuente generado por Next.js en
lugar del nombre literal de la hoja de estilos de referencia.

```tsx
<a
  className={`vnt-signature ${hostGrotesk.className}`}
  href="https://www.instagram.com/vnt.agencia/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="created by VNT — Instagram (se abre en otra pestaña)"
>
  <span lang="en">created by</span>
  <img src="/brand/logo-signature-white.svg" alt="" width={2150} height={589} />
</a>
```

## Estilos de referencia

Integrar estas medidas con los tokens y la herramienta de estilos del proyecto.
El ejemplo hereda el color del footer: debe cumplir el contraste indicado arriba.

```css
.vnt-signature {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.75rem;
  color: inherit;
  font-family: "Host Grotesk", Arial, sans-serif;
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.06em;
  text-decoration: none;
}

.vnt-signature img {
  width: auto;
  height: 1.75rem;
  opacity: 0.8;
  transition: opacity 180ms ease;
}

.vnt-signature:hover img,
.vnt-signature:focus-visible img {
  opacity: 1;
}

.vnt-signature:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}

@media (max-width: 767.98px) {
  .vnt-signature {
    gap: 0.5rem;
    font-size: 0.625rem;
  }

  .vnt-signature img {
    height: 1.25rem;
  }
}
```

## Destino y medición

La firma actual abre Instagram directamente y no agrega `?ref=cliente`.
El antiguo crédito `Sitio por VNT` que apuntaba a la home con `ref` ya no es el
estándar. Web Analytics de VNT mide visitas al sitio del estudio; no mide los
clics de estas firmas ni atribuye a VNT visitas que terminan en Instagram.
La medición de clics requeriría instrumentación específica, fuera de este contrato.

## Verificación antes de publicar

1. Comprobar texto, fuente, logo y destino del enlace.
2. Revisar 320, 390, 767, 768 y 1440 px, incluyendo los cambios de layout propios
   del proyecto. El logo debe cargar al acercar el footer a la pantalla.
3. Confirmar que la firma cabe y no se solapa con copyright o contactos.
4. Medir contraste del texto normal y enfocado contra el fondo efectivo.
5. Navegar por teclado: foco visible, sin recortes, y enlace operable.
6. Ampliar el texto al 200% y comprobar que siga completo y operable, aunque la
   distribución necesite cambiar. Distinguir esta prueba del simple cambio de
   tamaño del viewport.
7. Ejecutar los checks del repositorio, revisar el diff y verificar el sitio
   publicado después de llevar el cambio a `main`.

Referencias: [ampliación de texto, WCAG 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
y [contraste de texto, WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
