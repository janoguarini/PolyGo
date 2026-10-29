# Despliegue

## Supabase (pendiente de autorización)

1. Crear proyecto (región sugerida: la más cercana a los usuarios; p. ej. `sa-east-1` para Latinoamérica).
2. Aplicar `supabase/migrations/*` en orden.
3. Auth → URL Configuration → Redirect URLs: `polygo://auth-callback` y la URL de Expo Go.
4. Auth → Email: mantener confirmación de email activada.
5. Copiar URL y anon key a `.env`. **Nunca** la `service_role` key en la app.
6. Correr los advisors de seguridad/rendimiento de Supabase.

## App

- Desarrollo: `npx expo start` + Expo Go (sirve hasta la Fase 4).
- Widgets (Fase 5) requieren development build: `npx eas-cli@latest build --profile development`.
- Antes de publicar: confirmar `bundleIdentifier` / `package` (`com.polygo.app` es provisional), íconos y splash definitivos, `eas.json`.

## Servidor de partidas (Fase 4)

Proceso Node persistente con WebSockets (Fly.io, Railway o Render). Variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET` o JWKS. Se documentará al implementarlo.
