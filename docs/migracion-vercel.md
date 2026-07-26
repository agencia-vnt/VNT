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

## Después de transferir

- [ ] La URL `*.vercel.app` cambia al pasar de cuenta. Actualizar cualquier link
      a la vieja — sobre todo las **firmas ya instaladas en sitios de clientes**,
      que apuntan a `vnt-liard.vercel.app`.
- [ ] Revisar que la conexión con GitHub siga activa. La cuenta nueva tiene que
      tener acceso al repo `valma420/VNT`; puede pedir autorizar la app de
      GitHub.
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

## El repo de GitHub

Mover sólo Vercel deja el proyecto a medio camino: el código seguiría en una
cuenta personal. Para que la agencia sea dueña de todo:

1. Crear una organización de GitHub para VNT (gratis).
2. En el repo: Settings → General → **Transfer ownership** → la organización.
3. GitHub deja una redirección automática, así que el remote local sigue
   andando. Igual conviene actualizarlo:

   ```bash
   git remote set-url origin https://github.com/<org>/VNT.git
   ```

4. Reconectar el proyecto de Vercel al repo en su nueva ubicación.

Una organización además permite sumar al socio con permisos propios, en vez de
compartir una cuenta personal.

---

## Cuando haya dominio propio

El sitio deduce su URL de `VERCEL_PROJECT_PRODUCTION_URL`, así que funciona sin
configurar nada. Al conectar el dominio definitivo, setear
`NEXT_PUBLIC_SITE_URL` (sin barra final) para fijar los canónicos, el sitemap y
el link de las firmas. Ver `src/site.config.ts`.

Conviene hacerlo **antes** de instalar las firmas en los sitios de clientes: así
el link no hay que cambiarlo dos veces.
