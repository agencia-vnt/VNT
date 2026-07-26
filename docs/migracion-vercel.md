# Infraestructura: GitHub y Vercel

Dónde vive el proyecto, cómo llegó ahí y qué decisiones se tomaron en el camino.

## Estado

| | |
|---|---|
| Repo | <https://github.com/agencia-vnt/VNT> — organización de la agencia |
| Vercel | proyecto `vnt`, en la cuenta de Vercel de la agencia |
| Producción | <https://vnt-liard.vercel.app> |
| Deploys automáticos | ⚠️ **Cortados.** Ver abajo |

## Lo único pendiente: reconectar GitHub

Al mover el repo a la organización, Vercel perdió el acceso: su GitHub App está
instalada en la cuenta personal, no en `agencia-vnt`. Los push a `main` no
disparan nada y producción quedó congelada en el commit `0735d09`.

Para cerrarlo: desde la cuenta de Vercel de la agencia, en la configuración de
Git del proyecto, conectar `agencia-vnt/VNT` y **autorizar la GitHub App de
Vercel del lado de la organización** (GitHub lo pide aparte del permiso del
proyecto).

Para verificar si volvieron los deploys, sin entrar al panel:

```bash
gh api repos/agencia-vnt/VNT/deployments --jq '.[] | "\(.created_at)  \(.sha[0:7])"' | head -3
```

Si el último SHA no coincide con el último commit de `main`, sigue desconectado.

## Otros pendientes de configuración

- [ ] Activar **Web Analytics** en el panel. No viaja activado con la
      transferencia, y sin eso el `?ref=` de las firmas no se mide.
- [ ] Cargar las variables de `.env.example`. No había ninguna configurada, así
      que no se perdió nada al mover.
- [ ] Revocar el token de API que se usó para la transferencia.

---

## Decisiones tomadas

**Cuenta compartida, no Team.** El Vercel de la agencia es una cuenta personal
con un Gmail propio, y las dos personas del estudio comparten el acceso. Un Team
de Vercel daría un usuario por persona y trazabilidad de quién deploya, pero
cuesta plata por miembro. Con dos socios que conviven, el costo no se justifica
hoy. Revisar si el equipo crece o entra alguien externo.

**Los otros proyectos se quedan en la cuenta personal.** `autoescuela` y
`palaisgalliera` siguen en `valma420s-projects`. Mover proyectos con repos
conectados corta sus deploys automáticos y obliga a reconectar cada uno; no vale
el riesgo mientras funcionen. El procedimiento de abajo sirve si algún día se
decide moverlos.

**GitHub sí es una organización.** Ahí no había costo: `agencia-vnt` es gratis y
permite sumar gente con su propio usuario más adelante.

---

## Cómo se hizo la transferencia (referencia)

Se usó **Claim Deployments**, que es lo que la documentación de Vercel
recomienda para pasar un proyecto de una cuenta personal a una de empresa. El
flujo de Project Transfer por API se recomienda sólo entre teams del **mismo**
dueño.

Con cuentas Hobby tiene una ventaja concreta: hace falta **un solo token**, el
de la cuenta de origen. La cuenta destino no necesita token ni ser un Team —
acepta desde el navegador.

### 1. Generar el código desde la cuenta de origen

```bash
export VERCEL_TOKEN='...'

curl -s -X POST \
  "https://api.vercel.com/projects/<PROJECT_ID>/transfer-request?teamId=<TEAM_ID_ORIGEN>" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Devuelve `{"code": "..."}`, válido **24 horas**.

### 2. Reclamar desde la cuenta destino

```
https://vercel.com/claim-deployment?code=<CODIGO>&returnUrl=<URL_PROPIA>
```

Abrir en una **ventana privada** logueada con la cuenta destino — si se abre en
la sesión normal, el proyecto se reclama a la cuenta de origen otra vez. La
página deja elegir el destino; al tocar **Transfer** se completa sola, sin
llamar a ningún otro endpoint.

### 3. Reconectar GitHub

Obligatorio si el proyecto viene de un repo: la transferencia no lleva el
permiso de la GitHub App.

### Cuidado con los tokens

Correr esto en una terminal aparte, no en una enganchada a una sesión de
asistente: el replay del buffer puede mandar el token al chat. Al terminar:

```bash
unset VERCEL_TOKEN
```

Y revocar el token en Vercel → Account Settings → Tokens.

---

## Lo que aprendimos por las malas

- **La URL `*.vercel.app` no cambia** al transferir: el dominio autogenerado es
  del proyecto, no de la cuenta. Las firmas ya instaladas no se rompen.
- **Lo que sí se rompe es la conexión con GitHub**, tanto al mover el repo a una
  organización como al transferir el proyecto de Vercel.
- **Web Analytics no viaja activado.**

---

## Cuando haya dominio propio

El sitio deduce su URL de `VERCEL_PROJECT_PRODUCTION_URL`, así que funciona sin
configurar nada. Al conectar el dominio definitivo, setear `NEXT_PUBLIC_SITE_URL`
(sin barra final) para fijar los canónicos, el sitemap y el link de las firmas.
Ver `src/site.config.ts`.

Conviene hacerlo **antes** de instalar las firmas en los sitios de clientes: así
el link no hay que cambiarlo dos veces.
