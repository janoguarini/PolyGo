# Seguridad

## Implementado (Fase 1)

| Control | Dónde | Verificado |
| --- | --- | --- |
| Sólo claves públicas en la app (`EXPO_PUBLIC_*`) | `src/lib/env.ts`, `.env.example` | Revisión |
| `.env` fuera de git | `.gitignore` | Revisión |
| Sesión en Keychain/Keystore (SecureStore fragmentado) | `src/lib/secureStorage.ts` | Tests unitarios |
| Auth con PKCE para enlaces de email | `src/lib/supabase.ts` | Revisión |
| Mensaje de recuperación neutro (no revela si el email existe) | `forgot-password.tsx` | Revisión |
| Errores traducidos sin filtrar detalles internos | `src/lib/errors.ts` | Tests unitarios |
| RLS en todas las tablas | migración 0001 | Tests SQL |
| `anon` no lee perfiles ni ratings | migración 0001 | Tests SQL |
| Cliente no puede escribir rating ni historial | `REVOKE` + sin políticas de escritura | Tests SQL |
| Cliente no puede cambiar `username` / `public_code` directamente | privilegios por columna | Tests SQL |
| Un usuario no edita filas ajenas | políticas `USING (id = auth.uid())` | Tests SQL |
| Doble liquidación imposible | `UNIQUE (user_id, battle_id)` | Tests SQL |
| Funciones `security definer` con `search_path = ''` | migraciones 0001–0004 | Revisión |
| Partidas y logros sólo los escribe el backend | `REVOKE` + sin políticas de escritura | Tests SQL |
| Servidor de partidas: token de Supabase validado en el handshake; versión de protocolo obligatoria | `server/src/server.ts` | Test de integración |
| La `service_role` key sólo vive en `server/.env` | `.gitignore`, `server/.env.example` | Revisión |
| El cliente nunca recibe la respuesta correcta antes de responder; el servidor corrige, cronometra y puntúa | `server/src/battle.ts` | Tests unitarios + integración |
| Sólo se aceptan eventos de la partida propia y de la pregunta actual | `battle.ts` / `server.ts` | Tests |
| Rate limit: 20 eventos/s por socket | `server.ts` | Test de integración |
| Liquidación transaccional, idempotente y con control optimista de rating | `settle_battle` (0005), sólo `service_role` | Tests SQL + verificación en Supabase |
| Logs del servidor sin tokens ni emails (sólo ids) | `server/src` | Revisión |
| Widgets: sólo contenido de vocabulario en el almacenamiento compartido; sin tokens ni datos de cuenta; se vacían al cerrar sesión | `src/features/widgets/sync.ts` | Tests unitarios |
| Visibilidad de perfil aplicada (`private`/`friends` ocultan estadísticas y logros) | `get_public_profile` | Tests SQL |
| Métricas educativas ajenas invisibles | `achievement_metrics` es invoker: RLS devuelve 0 | Tests SQL |

## Pendiente

- Revisar `npm audit` (dependencias transitivas de tooling) sin `--force`.
- Volver a ejecutar los advisors de Supabase después de cada migración.

## Decisión: registro sin confirmación de email (2026-10-29)

Por decisión de producto, la cuenta se crea y entra directamente, sin verificar el email (Supabase → Authentication → Email → *Confirm email* desactivado). La app ya lo soporta: si `signUp` devuelve sesión, pasa directo al onboarding.

Riesgos aceptados: se puede registrar una cuenta con un email ajeno, y es más fácil crear cuentas en masa (multicuentas para farmear ELO). Mitigaciones: el anti-farming por rival repetido de `shared/ranking.ts`; si aparece abuso, activar CAPTCHA o rate limits en Auth. La recuperación de contraseña sigue enviando el enlace sólo al email registrado.

## Advisors de Supabase (2026-10-29)

Avisos abiertos **intencionales** (funciones `SECURITY DEFINER` ejecutables por `authenticated`):

- `complete_onboarding`: el cliente no tiene privilegio `UPDATE` sobre `username`; la función exige sesión (`auth.uid()`), sólo modifica la fila del propio usuario, valida idioma y unicidad, y los `CHECK` de la tabla validan formato, avatar, nivel y objetivo.
- `submit_learning_session`: única vía de escritura del progreso educativo (el cliente no tiene INSERT/UPDATE en esas tablas). Valida sesión, ventana de tiempo, desbloqueo, pertenencia de ejercicios y unicidad; es idempotente por id de sesión. Desde la 0004 también evalúa logros.
- `get_match_history`: sólo lectura; devuelve únicamente partidas terminadas en las que participa `auth.uid()`, con nombre y avatar del rival (que ya son públicos). El cliente no puede leer la fila del rival en `battle_players` directamente.
- `get_public_profile`: sólo lectura; exige sesión y respeta `profile_visibility` (fuera de `public` devuelve sólo identidad y rango).

Aviso abierto **pendiente de decisión**: *Leaked Password Protection* (HaveIBeenPwned) desactivada en Supabase Auth. Se activa desde el dashboard (Authentication → Sign In / Providers → Email → Password security); puede requerir plan Pro.

## Aprendizaje operativo: migraciones vía MCP

El conector de Supabase pide confirmación extra para SQL con sentencias destructivas (`DROP`, `DELETE`, `TRUNCATE`, incluso dentro del cuerpo de una función o `on commit drop`), y esa confirmación no puede mostrarse en esta sesión: la llamada se rechaza sola. Las migraciones se escriben sin sentencias destructivas; si alguna lo necesita de verdad, aplicarla desde el SQL Editor.
