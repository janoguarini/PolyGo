# Despliegue

## Supabase

Proyecto `PolyGo` (`wtymosvsymzoosxscnxi`, `us-west-2`). Estado al 2026-10-29:

- [x] Migraciones aplicadas (ver DATABASE.md) y advisors revisados.
- [x] URL y anon key en `.env` (no versionado). **Nunca** la `service_role` key en la app.
- [x] Redirect URLs configuradas:

| URL | Uso | Antes de producción |
| --- | --- | --- |
| `polygo://auth-callback` | App compilada (development/production build) | Mantener |
| `exp://192.168.1.*:8081/--/auth-callback` | Expo Go en la red local `192.168.1.x` | **Eliminar** |

Si cambia la red (otra subred) o se usa `npx expo start --tunnel`, hay que agregar la URL correspondiente (túnel: `exp://*.exp.direct/--/auth-callback`) y también eliminarla antes de producción.

### Checklist antes del lanzamiento

La lista completa (tiendas, builds, calidad) está en [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md). De Supabase:

- [ ] Dejar sólo `polygo://auth-callback` en Redirect URLs.
- [ ] Configurar SMTP propio (el de Supabase tiene límites bajos de envío).
- [ ] Revisar la decisión de **no** confirmar emails (ver SECURITY.md) y activar CAPTCHA en Auth si aparecen registros abusivos.
- [ ] Volver a correr los advisors de seguridad y rendimiento (último: 2026-10-29, sin avisos nuevos).

### Edge Functions

| Función | `verify_jwt` | Uso |
| --- | --- | --- |
| `delete-account` | `false` (valida el token en el código) | Borra la cuenta del usuario que llama. Fuente: `supabase/functions/delete-account/index.ts`; redeploy por MCP o `npx supabase functions deploy delete-account --no-verify-jwt` |

## App

- Desarrollo con Expo Go: `npx expo start --go` (todo menos los widgets). Con `expo-dev-client` instalado, `npx expo start` a secas arranca en modo development build. En Windows, si el Wi-Fi está como red **Pública**, el firewall puede bloquear al teléfono: marcarla como Privada o usar `--tunnel`.
- Development build (necesaria para los widgets, Fase 5): perfiles en `eas.json` (`development`, `development-simulator`, `preview`, `production`). Primera vez: `npx eas-cli@latest login` y `npx eas-cli@latest init`. Luego `npx eas-cli@latest build --profile development --platform android|ios`. Pasos completos en [WIDGETS.md](WIDGETS.md#cómo-probarlos).
- Cambiar la config de `expo-widgets` en `app.json` exige una build nueva (no alcanza con recargar JS).
- Antes de publicar: `bundleIdentifier` / `package` ya son definitivos (`com.polygoidioma.app`); confirmar íconos y splash definitivos, `eas.json`.

## Servidor de partidas (Fase 4)

Proceso Node persistente con WebSockets (`server/`). **Una sola instancia**: la cola y las partidas viven en memoria.

### Variables (`server/.env`, nunca versionado)

| Variable | Valor |
| --- | --- |
| `SUPABASE_URL` | `https://wtymosvsymzoosxscnxi.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard → Project Settings → API Keys → *secret key* (o la legacy `service_role`). **Secreta**: sólo en el servidor |
| `PORT` | 3001 por defecto |

En la app: `EXPO_PUBLIC_BATTLE_SERVER_URL` en `.env`. Vacía = Ranked deshabilitado con aviso.

### Desarrollo local (teléfono con Expo Go en la misma red)

```bash
cd server && npm install
cp .env.example .env        # completar la secret key
npm run dev                 # escucha en :3001
```

En el `.env` de la app: `EXPO_PUBLIC_BATTLE_SERVER_URL=http://<IP-de-la-PC>:3001` (la misma IP que muestra `npx expo start`) y reiniciar Expo. Con una sola cuenta alcanza: a los 10 s sin rival humano toca un bot (BOT). Para probar contra una persona hacen falta dos cuentas en dos dispositivos. Windows puede pedir permiso de firewall para Node la primera vez.

### Producción

- Imagen: `docker build -f server/Dockerfile -t polygo-battle-server .` (desde la raíz: el servidor importa `shared/`).
- Hosting con WebSockets y proceso persistente: Fly.io, Railway o Render. Health check: `GET /health`.
- **Una sola instancia**: la cola y las partidas viven en memoria (no escalar a 2+ réplicas).

> **Necesario para un Ranked justo.** Sin servidor, el ranked funciona por Supabase (ver BATTLE_PROTOCOL.md → "Sin servidor de partidas"), pero el teléfono genera o recibe las respuestas e informa su puntaje: no sirve para el lanzamiento.

#### Railway (recomendado)

1. railway.app → New Project → Deploy from GitHub repo → `PolyGo`. Root directory: la raíz del repo (el build necesita `shared/`).
2. Service → **Variables**:
   - `RAILWAY_DOCKERFILE_PATH` = `server/Dockerfile`
   - `SUPABASE_URL` = `https://wtymosvsymzoosxscnxi.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = la secret / service_role key (la misma de `server/.env`)
   - `PORT` la pone Railway; no hace falta cargarla.
3. Service → **Settings → Networking → Generate Domain** (te da `https://<algo>.up.railway.app`). Settings → Deploy → Healthcheck Path: `/health`. Réplicas: 1.
4. Verificar: `https://<dominio>/health` responde `{"ok":true,...}`.
5. App: `EXPO_PUBLIC_BATTLE_SERVER_URL=https://<dominio>` en `.env` y en las variables de EAS para las builds.

Verificado el 2026-10-30: el servidor corriendo contra Supabase real jugó una partida ranked completa contra un bot (liquidación, historial y `has_bot` correctos) con un usuario temporal que después se borró; la imagen se simuló con sólo dependencias de producción.
- Servirlo detrás de HTTPS (`wss://`): las builds de producción de Android/iOS bloquean HTTP en claro.
- Al reiniciar, las partidas en curso se cancelan sin ELO; programar deploys fuera de horas pico.

### Ranked con el servidor como autoridad (Fase 1) — pasos pendientes de autorización

Código y migración listos en el repo; **nada de esto está aplicado ni desplegado**. Orden:

1. **Staging** (rama de Supabase o proyecto aparte): aplicar `supabase/migrations/20261104150000_ranked_server_authority.sql`, regenerar `src/lib/database.generated.ts` (las RPC nuevas se agregaron a mano), levantar el servidor apuntando a staging y jugar con una build de desarrollo: 3 calibraciones contra bots, la 4.ª sin bot, práctica contra bot, una partida entre dos personas, preguntas para escribir desde Oro (y que en chino no aparezcan) y abandono/reconexión.
2. **Producción**: aplicar la misma migración (no destructiva), desplegar el servidor (`PROTOCOL_VERSION` 2: los clientes viejos reciben `protocol_mismatch`) y publicar la app con `EXPO_PUBLIC_BATTLE_SERVER_URL` (build o `eas update` con la variable en el entorno de EAS).
3. **Recién con la app nueva publicada**, cerrar el flujo viejo en el que el teléfono informa el puntaje. SQL listo, sin aplicar (rompe Ranked en versiones viejas de la app):

```sql
-- Ranked sólo por el servidor de partidas. Los desafíos con amigos (no mueven ELO) siguen por
-- Supabase: create/accept/status/cancel_friend_challenge, get_human_match, finish_human_match y
-- human_match_result se mantienen mientras los desafíos no pasen al servidor.
revoke execute on function public.start_bot_match() from authenticated;
revoke execute on function public.finish_bot_match(uuid, integer, integer, integer, boolean) from authenticated;
revoke execute on function public.join_human_queue() from authenticated;
revoke execute on function public.leave_human_queue() from authenticated;
```

`finish_human_match` sigue abierto porque lo usan los desafíos: como `join_human_queue` queda cerrado, ya no se pueden crear partidas ranked entre personas por ese camino (las que crea `accept_friend_challenge` son `is_ranked = false`).

### Cambiar de hosting

El servidor sólo necesita Node 22, WebSockets, un proceso persistente de **una instancia** y tres variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT`). Para moverlo: desplegar la misma imagen (`server/Dockerfile`) en el hosting nuevo, verificar `GET /health`, cambiar `EXPO_PUBLIC_BATTLE_SERVER_URL` en EAS y publicar; apagar el anterior cuando no tenga partidas (`/health` → `battles: 0`). Supabase no cambia: ratings, partidas y cupos viven en la base, y al arrancar el servidor nuevo cancela sin ELO las partidas que hayan quedado abiertas.
