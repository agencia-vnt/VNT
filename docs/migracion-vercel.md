# Migración histórica: GitHub y Vercel

Registro de la transferencia del proyecto a las cuentas de la agencia y de las
decisiones tomadas durante ese proceso. Para el estado operativo vigente
(dominio, deploys y variables), consultar el [README](../README.md).

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

## El dominio

`vntagencia.com`, **sin www**. El apex es el canónico y `www` tiene que
redirigir a él (Primary Domain en Vercel), no al revés.

Se eligió el apex porque el link de las firmas se ve en sitios de clientes y
`vntagencia.com` queda más prolijo que `www.vntagencia.com`. Cambiarlo después
de instalar firmas significa editar el link en cada sitio ajeno.

**El dominio no alcanza con configurarlo en el panel.** `siteConfig.url` se
resuelve en build: hasta que no haya un deploy nuevo con
`NEXT_PUBLIC_SITE_URL=https://vntagencia.com`, el sitio sigue declarando la URL
vieja en los canonical, el `og:url`, el sitemap y los snippets de `/es/firma`.

Un canonical que apunta a otro dominio le dice a Google que la versión buena es
la otra, así que conviene no dejarlo así.

Para comprobar que quedó bien después del deploy:

```bash
curl -s https://vntagencia.com/es | grep -o '<link rel="canonical"[^>]*>'
curl -s https://vntagencia.com/sitemap.xml | grep -o "<loc>[^<]*</loc>" | head -2
```
