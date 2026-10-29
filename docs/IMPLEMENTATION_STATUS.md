# Estado de implementación

Última actualización: 2026-10-29

## Fase actual

**Fase 1 — Fundamentos y diseño: completada.** Backend Supabase en producción con el esquema aplicado y verificado.
Única verificación pendiente: recorrer registro → confirmación de email → onboarding en un teléfono (Expo Go).

## Backend

| Dato | Valor |
| --- | --- |
| Proyecto Supabase | `PolyGo` · ref `wtymosvsymzoosxscnxi` · `us-west-2` |
| URL | `https://wtymosvsymzoosxscnxi.supabase.co` |
| Repositorio | https://github.com/janoguarini/PolyGo |

## Terminado

- [x] Fase 0: auditoría (`PROJECT_AUDIT.md`).
- [x] Proyecto Expo SDK 58 + TypeScript estricto (`strict`, `noUncheckedIndexedAccess`).
- [x] Expo Router con rutas protegidas (`Stack.Protected`): auth → onboarding → tabs.
- [x] Sistema de diseño: tokens y componentes (`Text`, `Button`, `Card`, `TextField`, `ProgressBar`, `Screen`, `SelectCard`, `StatTile`, `Avatar`, `RankEmblem`, estados de carga/vacío/error/offline).
- [x] Emblemas de rango propios en SVG para los 8 tiers con divisiones.
- [x] Auth Supabase: registro, login, recuperación, confirmación de email (PKCE + `auth-callback`), cierre de sesión. Sesión en SecureStore fragmentado.
- [x] Onboarding completo con username validado en servidor.
- [x] Tabs con datos reales; clasificación global real; ajuste de privacidad persistido.
- [x] `shared/ranking.ts`: ELO, colocación, piso, anti-farming, rangos centralizados.
- [x] Migraciones 0001 (núcleo) y 0002 (correcciones de advisors) **aplicadas en Supabase**.
- [x] Tipos de base de datos **generados** desde el proyecto real (`src/lib/database.generated.ts`).

## Pendiente (por fase)

- **Fase 1 (verificación manual):** prueba en dispositivo; Redirect URL `polygo://auth-callback` en el dashboard.
- **Fase 2:** currículo A1 (tablas, seed), motor de ejercicios, lecciones, progreso, repetición espaciada, racha.
- **Fase 3:** historial de partidas, evolución de ELO, estadísticas educativas, logros.
- **Fase 4:** servidor de partidas WebSocket, matchmaking, Word Rush, liquidación ELO transaccional e idempotente. *"Buscar partida" está deshabilitado a propósito.*
- **Fase 5:** widgets nativos iOS (WidgetKit) y Android (Glance). *Vocabulario sólo muestra una vista previa marcada como ejemplo.*
- **Fase 6:** QA, accesibilidad, builds EAS, checklist de lanzamiento.

## Migraciones

| Migración | Local (PGlite) | Supabase |
| --- | --- | --- |
| `20261029010416_core_profiles_ratings.sql` | ✅ 13/13 tests | ✅ aplicada 2026-10-29 |
| `20261029010511_advisor_fixes.sql` | ✅ 13/13 tests | ✅ aplicada 2026-10-29 |

Los nombres de archivo coinciden con las versiones registradas en Supabase, para que `supabase db push` no intente reaplicarlas.

## Verificación en Supabase (2026-10-29)

| Prueba | Resultado |
| --- | --- |
| `anon` lee `languages` y `seasons` | ✅ |
| `anon` lee `profiles` / `player_ratings` | ✅ denegado (42501) |
| `anon` ejecuta `complete_onboarding` | ✅ denegado |
| Alta simulada en `auth.users` crea perfil `PG-XXXXXX`, ajustes, rating 1000 e historial | ✅ (en transacción revertida) |
| Onboarding como usuario autenticado normaliza username y guarda avatar/objetivo | ✅ |
| Usuario autenticado intenta `UPDATE player_ratings` | ✅ bloqueado |
| Datos de prueba residuales | ✅ ninguno (0 usuarios, 0 perfiles) |
| Advisors de seguridad | 1 aviso intencional (ver SECURITY.md) |
| Advisors de rendimiento | sólo "índice sin uso" (esperable sin datos) |

## Tests locales

| Suite | Comando | Resultado |
| --- | --- | --- |
| TypeScript | `npm run typecheck` | ✅ |
| ESLint | `npm run lint` | ✅ |
| Jest | `npm test` | ✅ 51/51 |
| SQL + RLS (PGlite) | `npm run test:db` | ✅ 13/13 |
| Bundle Metro Android + iOS | `npx expo export -p android -p ios` | ✅ |
| expo-doctor | `npx expo-doctor` | ✅ 20/20 |

No ejecutado todavía: la app en un dispositivo real.

## Problemas conocidos

1. El mock oficial de Reanimated 4.7 falla en Jest; se usa un mock mínimo propio.
2. Bundle IDs `com.polygo.app` provisionales.
3. La visibilidad "Sólo amigos"/"Privado" se guarda pero aún no filtra nada.
4. El SMTP por defecto de Supabase tiene límites bajos de envío; para la beta conviene configurar un SMTP propio (Resend, Postmark…).

## Próximos pasos exactos

1. Agregar `polygo://auth-callback` (y la URL `exp://…/--/auth-callback` de Expo Go) en Auth → URL Configuration.
2. `npx expo start`, abrir en Expo Go, registrarse y completar el onboarding.
3. Fase 2: migración del currículo + seed de las unidades 1–3 + motor de ejercicios con validación testeada.
