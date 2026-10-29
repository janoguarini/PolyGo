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

- Desarrollo: `npx expo start` + Expo Go (sirve hasta la Fase 4). En Windows, si el Wi-Fi está como red **Pública**, el firewall puede bloquear al teléfono: marcarla como Privada o usar `--tunnel`.
- Widgets (Fase 5) requieren development build: `npx eas-cli@latest build --profile development`.
- Antes de publicar: confirmar `bundleIdentifier` / `package` (`com.polygo.app` es provisional), íconos y splash definitivos, `eas.json`.

## Servidor de partidas (Fase 4)

Proceso Node persistente con WebSockets (Fly.io, Railway o Render). Variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET` o JWKS. Se documentará al implementarlo.
