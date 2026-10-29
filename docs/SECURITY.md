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
| Funciones `security definer` con `search_path = ''` | migración 0001 | Revisión |

## Pendiente

- Fase 4: verificación de JWT en el servidor de partidas, rate limiting por socket, validación de pertenencia a partida, liquidación transaccional idempotente, logs sin datos sensibles.
- Fase 5: el widget nunca guarda la `service_role` key; sólo contenido de vocabulario y un token de sesión si hace falta.
- Revisar `npm audit` (dependencias transitivas de tooling) sin `--force`.
- Volver a ejecutar los advisors de Supabase después de cada migración.

## Decisión: registro sin confirmación de email (2026-10-29)

Por decisión de producto, la cuenta se crea y entra directamente, sin verificar el email (Supabase → Authentication → Email → *Confirm email* desactivado). La app ya lo soporta: si `signUp` devuelve sesión, pasa directo al onboarding.

Riesgos aceptados: se puede registrar una cuenta con un email ajeno, y es más fácil crear cuentas en masa (multicuentas para farmear ELO). Mitigaciones: el anti-farming por rival repetido de `shared/ranking.ts`; si aparece abuso, activar CAPTCHA o rate limits en Auth. La recuperación de contraseña sigue enviando el enlace sólo al email registrado.

## Advisors de Supabase (2026-10-29)

Un único aviso abierto, **intencional**: `complete_onboarding` es `SECURITY DEFINER` y ejecutable por `authenticated`. Es necesario porque el cliente no tiene privilegio `UPDATE` sobre `username`; la función exige sesión (`auth.uid()`), sólo modifica la fila del propio usuario, valida idioma y unicidad, y los `CHECK` de la tabla validan formato, avatar, nivel y objetivo.
