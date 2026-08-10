# Crédito de VNT en sitios de clientes

Los sitios realizados por VNT pueden incluir un crédito mínimo en el footer:
`Sitio por VNT`. El crédito enlaza a la home de VNT y agrega un parámetro `ref`
para identificar el proyecto de origen.

## Convención

- Usar `https://vntagencia.com/` como destino.
- Agregar `ref` con el mismo slug del caso en `content/projects/`.
- Escribir el slug en minúsculas, sin espacios ni caracteres especiales.
- Mantener el crédito pequeño y adaptarlo al estilo del footer del cliente.
- Abrir el enlace en otra pestaña con `rel="noopener noreferrer"`.

Ejemplo de destino:

```text
https://vntagencia.com/?ref=nombre-cliente
```

## HTML y Astro

```html
<p class="credit">
  Sitio por
  <a
    href="https://vntagencia.com/?ref=nombre-cliente"
    target="_blank"
    rel="noopener noreferrer"
  >VNT</a>
</p>
```

## React y Next.js

```tsx
<p className="credit">
  Sitio por{" "}
  <a
    href="https://vntagencia.com/?ref=nombre-cliente"
    target="_blank"
    rel="noopener noreferrer"
  >
    VNT
  </a>
</p>
```

## Medición

El layout de VNT incluye Vercel Web Analytics. Para que la atribución funcione,
Web Analytics debe estar habilitado en el proyecto de Vercel y
`NEXT_PUBLIC_SITE_URL` debe apuntar a `https://vntagencia.com` durante el build.
Las visitas se consultan filtrando por el parámetro `ref`.

## Verificación antes de publicar

1. Reemplazar `nombre-cliente` por el slug correcto.
2. Confirmar que el crédito sea legible y discreto en móvil y escritorio.
3. Abrir el enlace y comprobar que llegue a la home de VNT con el `ref` intacto.
4. Verificar que el resto del footer conserve su orden y accesibilidad.
