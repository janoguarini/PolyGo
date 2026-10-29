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

- [ ] Dejar sólo `polygo://auth-callback` en Redirect URLs.
- [ ] Configurar SMTP propio (el de Supabase tiene límites bajos de envío).
- [ ] Revisar la decisión de **no** confirmar emails (ver SECURITY.md) y activar CAPTCHA en Auth si aparecen registros abusivos.
- [ ] Volver a correr los advisors de seguridad y rendimiento.

## App

- Desarrollo: `npx expo start` + Expo Go (sirve hasta la Fase 4 inclusive; Socket.IO es JS puro). En Windows, si el Wi-Fi está como red **Pública**, el firewall puede bloquear al teléfono: marcarla como Privada o usar `--tunnel`.
- Widgets (Fase 5) requieren development build: `npx eas-cli@latest build --profile development`.
- Antes de publicar: confirmar `bundleIdentifier` / `package` (`com.polygo.app` es provisional), íconos y splash definitivos, `eas.json`.

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

En el `.env` de la app: `EXPO_PUBLIC_BATTLE_SERVER_URL=http://<IP-de-la-PC>:3001` (la misma IP que muestra `npx expo start`) y reiniciar Expo. Para probar una partida ranked hacen falta **dos cuentas en dos dispositivos** (o un teléfono y el simulador). Windows puede pedir permiso de firewall para Node la primera vez.

### Producción

- Imagen: `docker build -f server/Dockerfile -t polygo-battle-server .` (desde la raíz: el servidor importa `shared/`).
- Hosting con WebSockets y proceso persistente: Fly.io, Railway o Render. Health check: `GET /health`.
- Servirlo detrás de HTTPS (`wss://`): las builds de producción de Android/iOS bloquean HTTP en claro.
- Al reiniciar, las partidas en curso se cancelan sin ELO; programar deploys fuera de horas pico.
