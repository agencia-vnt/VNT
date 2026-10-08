# Cierre de la landing VNT

## Decisiones

- Identidad y sitios web, y sistemas y herramientas tienen igual prioridad.
- ES y EN se completan en la misma etapa; las capturas conservan la interfaz
  original del cliente y llevan epígrafes y textos alternativos traducidos.
- Las consultas llegan a `vntclub@gmail.com`, desde `siteConfig.email`.
- Se mantienen diseño, estructura, CTA principal al portfolio, MDX y Resend.
- Los dos casos existentes se refuerzan antes de sumar nuevas páginas.
- No se publican testimonios sin aprobación ni métricas sin evidencia.
- No se agregan dependencias, planes pagos, CMS ni servicios de seguimiento.

## Entregas y aceptación

| Entrega | Criterio de cierre |
|---|---|
| Contacto | Errores visibles y asociados al campo, honeypot sin envío, fallos controlados, prueba con proveedor simulado y recepción real en Gmail después de publicar. |
| Oferta y casos | Ambas líneas claras, ambos casos completos en ES/EN, cuatro capturas actuales y afirmaciones comprobables. |
| Metadatos | Canonical y alternativas por ruta; títulos, descripciones e imágenes correctos en Open Graph y Twitter para cada página. |
| Medición | Clics a contacto/correo y aceptación de envío diferenciados, sin datos personales; eventos recibidos en Analytics si el plan del equipo los admite. |
| QA y publicación | Lint, tipos, pruebas focalizadas y build; revisión de rutas, imágenes, teclado, móvil, movimiento reducido y texto ampliado; comprobación del commit publicado. |

## Pendientes editoriales que no bloquean la publicación

- El Faraón: solicitar una cita concreta aprobada sobre el uso del panel.
- AKDemia: solicitar una cita aprobada sobre el cambio en su trabajo diario.
- Ambos casos: recoger resultados medidos con período y fuente antes de
  reemplazar la sección de resultados cualitativos.

## Estado local — 2026-10-07

- Implementados: oferta equilibrada, los dos casos en ES/EN, cuatro capturas
  actuales, contacto validado, eventos sin datos personales y metadatos por ruta.
- Las capturas se incorporaron como WebP sin pérdida; los PNG originales se
  conservaron. La imagen social de cada idioma se genera durante el build.
- Verificados: lint, tipos, 11 pruebas de contacto con proveedor simulado y
  build de producción. No se agregaron dependencias.
- Revisadas las diez páginas en 320, 390, 768 y 1440 px: imágenes cargadas,
  sin desborde horizontal y un título principal por página. También se revisaron
  enlaces de idioma, menú móvil, foco de teclado y rutas inválidas.
- El formulario conserva los valores ante errores, con y sin JavaScript.
  Sin JavaScript, el contenido sigue visible. Se corrigieron problemas
  detectados al revisar movimiento reducido y texto ampliado al 200 %.
- Canonical, alternativas de idioma, Open Graph, Twitter, sitemap e imágenes
  sociales comprobados contra el servidor local de producción.

Estos resultados validan la implementación local; la aceptación de correo,
medición y dominio público sigue pendiente.

## Comprobaciones externas

**Diferidas por decisión del usuario.** La conexión y la CLI actuales no tienen
acceso al equipo `vnt4`. El 2026-10-08 se autorizó la entrega de todos los cambios
pendientes a `main` remoto. Esa entrega puede disparar el despliegue automático;
su aceptación en producción sigue siendo una comprobación separada.
Cuando se habilite el acceso, retomar en este orden:

- Revisar que `RESEND_API_KEY` exista para producción sin imprimir su valor.
- Confirmar que `CONTACT_FROM_EMAIL` use un dominio verificado en Resend.
- Verificar plan del equipo y recepción de los eventos en Web Analytics.
- Confirmar el commit desplegado y comprobar las mismas rutas en el dominio
  público. Que el build pase no prueba entrega de correo ni medición.
- Confirmar aceptación del envío y recepción en `vntclub@gmail.com` por separado.

No se realizaron cambios de configuración en Vercel/Resend ni envíos de correo
reales. El seguimiento suave del resplandor de contacto está implementado en
`5334918`, con fondo estático en dispositivos táctiles y movimiento reducido.

## Qué evaluar después

Revisar consultas y recorridos después de reunir datos suficientes. Según su
calidad y volumen, decidir si conviene dar más peso al CTA de contacto o crear
páginas específicas para servicios. Añadir protección antispam adicional si
se observa abuso. La ausencia de datos no justifica inventar resultados ni
atribuir a la landing clics de firmas que terminan en Instagram.
