# Portfolio: estructura y primera versión

## Alcance editorial

El portfolio presenta trabajos, no una ficha general por marca. Cada caso tiene
su propio alcance, evidencia y recorrido. Luquisound tiene dos casos: el sitio
del taller y el cotizador interno. Instagram y pauta no forman parte de ellos.

| Trabajo | Slug | Estado registrado |
|---|---|---|
| El Faraón Catering | `el-faraon-catering` | Publicado |
| AKDemia autoescuela | `akdemia-autoescuela` | Publicado |
| ARGEN PEL | `argenpel` | Entregado |
| MAT Pilates | `mat-pilates` | Entregado |
| Luquisound: sitio | `luquisound` | Entregado |
| Luquisound: cotizador | `luquisound-cotizador` | Entregado |
| Aleatur | `aleatur` | Publicado, en uso y en evolución |
| Rodrigo Stampone | `rodrigo-stampone` | Entregado y en uso |

Los estados de los casos nuevos y su autoría web fueron confirmados por el
responsable de VNT el 17 de octubre de 2026. Para ARGEN PEL y Luquisound se
solicitó presentar el trabajo como terminado. Esto no acredita una fecha de
entrega ni un despliegue público del sitio de Luquisound o del cotizador.

MAT se limita a la landing de la etapa 1, creada junto con la apertura del
negocio y actualmente en uso. La identidad parte del brandbook de CONTRAST3,
aportado por el estudio; no se presenta como identidad creada por VNT ni como
colaboración directa. La gestión estudiada no llegó a implementarse.

## Contrato común

- `status` describe el estado del trabajo y no se muestra en las tarjetas ni
  en la cabecera del caso; `draft` controla la visibilidad del caso. Un proyecto
  en desarrollo puede tener un caso público.
- `kind` identifica el tipo de trabajo y `scope` enumera entregables concretos.
- ES y EN se completan juntos. Se traducen textos, roles, epígrafes y alt.
- Cada caso cierra con contacto y el siguiente trabajo del listado.
- La home conserva tres destacados; el listado contiene todos los trabajos.
- Las tecnologías se muestran después del relato para priorizar el alcance.

## Evidencia visual

Las capturas se prepararon el 17 de octubre de 2026. ARGEN PEL, MAT, Aleatur y
Rodrigo usan sus sitios públicos comprobados; Luquisound usa la implementación
local del sitio y el cotizador. Una captura local demuestra la interfaz, no
que exista un despliegue público.

El cotizador se muestra con una propuesta sintética identificada como
demostración, sin clientes ni catálogo privado. Los importes y la referencia
manual de cambio son ilustrativos y no tienen validez comercial. Su PNG se
genera con la función real de exportación.

Los originales documentales permanecen fuera del repositorio. En `public`
entran solamente derivados de las capturas seleccionadas para el portfolio.

## Refinamiento posterior

- Mejorar portadas y selección de imágenes con cada revisión individual.
- Precisar responsabilidades personales y fechas cuando se quieran publicar.
- Incorporar testimonios únicamente aprobados y resultados con fuente/período.
- Profundizar Aleatur conforme evolucione la experiencia publicada.
- Volver a comprobar enlaces y capturas cuando cambie cada proyecto.

Lint, tipos, pruebas de contenido y build son las comprobaciones técnicas del
sitio. La publicación se acepta comprobando el commit desplegado y las rutas
ES/EN en el dominio canónico.
