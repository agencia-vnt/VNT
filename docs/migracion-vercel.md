# Mover el proyecto a la cuenta de la agencia

Runbook para pasar el sitio de la cuenta personal (`valma420`) a la cuenta de
Vercel de la agencia, usando **Claim Deployments**.

Es el método que la documentación recomienda para este caso puntual — tiene una
sección titulada *"Migrating personal projects to a company account"*. El flujo
de Project Transfer completo por API se recomienda para mover entre teams del
**mismo** dueño; acá el destino es otra cuenta.

Ventaja concreta con cuentas Hobby: hace falta **un solo token**, el de la
cuenta de origen. La cuenta destino no necesita token ni ser un Team — acepta
desde el navegador.

## Estado actual

- ✅ **GitHub ya está movido** a la organización `agencia-vnt/VNT`.
- ⚠️ **Vercel quedó desconectado de GitHub.** Su GitHub App está instalada en la
  cuenta personal, no en la organización nueva, así que los push a `main` ya no
  disparan deploys. El sitio publicado sigue arriba, pero congelado en el último
  deploy previo a la mudanza del repo.
- ⬜ El proyecto de Vercel sigue en la cuenta personal.

**Hacer el claim antes de reconectar GitHub.** Reconectar ahora desde la cuenta
personal obliga a autorizar la organización dos veces: una ahora y otra después
del claim, desde la cuenta de la agencia. Haciendo el claim primero, se autoriza
una sola vez y desde la cuenta que va a quedar como dueña.

## Antes de empezar

1. Crear la cuenta de Google de la agencia (ej. `hola@vnt.studio`).
2. Registrarse en Vercel con esa cuenta y dejar la sesión abierta.
3. Generar un token en la cuenta **actual**: Vercel → Account Settings → Tokens.

---

## Paso 1 — Generar el código desde la cuenta actual

Los IDs de este proyecto ya están puestos:

```bash
export VERCEL_TOKEN=...   # token de la cuenta valma420

curl -s -X POST \
  "https://api.vercel.com/projects/vnt/transfer-request?teamId=team_h2NISOL51a6Xq6HT3cIJKZGm" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Devuelve:

```json
{ "code": "c7a9f0b4-4d4a-45bf-b550-2bfa34de1c0d" }
```

**El código vence a las 24 horas.**

## Paso 2 — Armar la URL de claim

```
https://vercel.com/claim-deployment?code=<CODIGO>&returnUrl=https://vnt-liard.vercel.app
```

`returnUrl` es a dónde te manda Vercel después de reclamar; podés poner
cualquier URL propia.

## Paso 3 — Reclamar desde la cuenta de la agencia

Abrir esa URL en el navegador **con la sesión de la cuenta de la agencia**
(conviene ventana privada para no reclamar sin querer desde la cuenta vieja).

La página muestra el deployment y deja elegir a qué cuenta transferirlo. Al
tocar **Transfer**, Vercel completa la transferencia sola: no hay que llamar al
endpoint de accept.

---

## Paso 4 — Reconectar GitHub (imprescindible)

Sin esto el proyecto queda sin deploys automáticos. Desde la cuenta de la
agencia, en la configuración de Git del proyecto: conectar el repo
`agencia-vnt/VNT` y **autorizar la GitHub App de Vercel en la organización**
`agencia-vnt` (GitHub va a pedir aprobar el acceso del lado de la org).

Comprobar que quedó: un push a `main` tiene que disparar un deploy.

## Después de transferir

- [ ] La URL `*.vercel.app` cambia al pasar de cuenta. Actualizar cualquier link
      a la vieja — sobre todo las **firmas ya instaladas en sitios de clientes**,
      que apuntan a `vnt-liard.vercel.app`.
- [ ] Reactivar **Web Analytics** en el proyecto (no viaja activado).
- [ ] Cargar las variables de entorno (ver `.env.example`). Hoy no hay ninguna
      configurada, así que no se pierde nada.
- [ ] Verificar que un push a `main` deploye desde la cuenta nueva.

## Si algo sale mal

Este proyecto no tiene estado que perder: ni dominio propio, ni variables, ni
datos de analytics. Se reconstruye entero desde `main`.

Salida de emergencia: importar `valma420/VNT` como proyecto nuevo desde la
cuenta de la agencia y borrar el viejo. Mientras los dos existan, ambos van a
deployar en cada push — no rompe nada, pero no conviene dejarlo así.

---

## El repo de GitHub — ya hecho

El repo vive en <https://github.com/agencia-vnt/VNT> y el remote local ya apunta
ahí:

```bash
git remote set-url origin https://github.com/agencia-vnt/VNT.git
```

GitHub deja una redirección automática desde la ubicación vieja, así que un
clon desactualizado sigue funcionando — pero conviene que todos actualicen el
remote para no depender de eso.

Las Actions siguieron al repo con todo el historial de corridas. Lo único que
**no** siguió fue la conexión con Vercel (ver arriba).

Pendiente aprovechar la organización para sumar al socio con su propio usuario,
en vez de compartir una cuenta personal.

---

## Cuando haya dominio propio

El sitio deduce su URL de `VERCEL_PROJECT_PRODUCTION_URL`, así que funciona sin
configurar nada. Al conectar el dominio definitivo, setear
`NEXT_PUBLIC_SITE_URL` (sin barra final) para fijar los canónicos, el sitemap y
el link de las firmas. Ver `src/site.config.ts`.

Conviene hacerlo **antes** de instalar las firmas en los sitios de clientes: así
el link no hay que cambiarlo dos veces.
