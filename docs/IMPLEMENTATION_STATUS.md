# Estado de implementación

Última actualización: 2026-10-28

## Fase actual

**Fase 1 — Fundamentos y diseño: completada a nivel de código y tests.**
Pendiente para darla por verificada end-to-end: crear el proyecto Supabase, aplicar la migración y probar registro/login en un dispositivo real.

## Terminado

- [x] Fase 0: auditoría (`PROJECT_AUDIT.md`).
- [x] Proyecto Expo SDK 58 + TypeScript estricto (`strict`, `noUncheckedIndexedAccess`).
- [x] Expo Router con rutas protegidas (`Stack.Protected`): auth → onboarding → tabs.
- [x] Sistema de diseño: tokens (colores, tipografía, espaciado, radios, elevación, duraciones) y componentes: `Text`, `Button`, `Card`, `TextField`, `ProgressBar`, `Screen`, `SelectCard`, `StatTile`, `Avatar`, `RankEmblem`, estados de carga/vacío/error/offline.
- [x] Emblemas de rango propios en SVG para los 8 tiers con divisiones.
- [x] Auth Supabase: registro, login, recuperación de contraseña, confirmación de email (PKCE + deep link `auth-callback`), cierre de sesión. Sesión en SecureStore fragmentado.
- [x] Pantalla explícita si faltan variables de entorno (no se finge backend).
- [x] Onboarding: idioma, nivel, objetivo diario, username (validado en servidor), avatar, tutorial competitivo. Guardado vía RPC `complete_onboarding`.
- [x] Tabs: Inicio, Aprender, Ranked, Vocabulario, Perfil, con datos reales del backend donde existen.
- [x] Clasificación global real (lectura de `player_ratings` + `profiles`).
- [x] Ajuste de privacidad del perfil (persistido en `user_settings`).
- [x] `shared/ranking.ts`: ELO clásico, K configurable, colocación, piso de rating, anti-farming por rival repetido, rangos y divisiones centralizados.
- [x] Migración 0001: idiomas, perfiles, ajustes, temporadas, rating actual, historial auditable, trigger de alta, RPCs, RLS y privilegios por columna.

## Pendiente (por fase)

- **Fase 1 (verificación):** proyecto Supabase, Redirect URLs, prueba en dispositivo.
- **Fase 2:** currículo A1 (tablas, seed), motor de ejercicios, lecciones, progreso, repetición espaciada, racha.
- **Fase 3:** historial de partidas, evolución de ELO, estadísticas educativas, logros.
- **Fase 4:** servidor de partidas WebSocket, matchmaking, Word Rush, liquidación ELO transaccional e idempotente. *El botón "Buscar partida" está deshabilitado a propósito.*
- **Fase 5:** widgets nativos iOS (WidgetKit) y Android (Glance) vía config plugins. *La pestaña Vocabulario sólo muestra una vista previa marcada como ejemplo.*
- **Fase 6:** QA, accesibilidad, builds EAS, checklist de lanzamiento.

## Archivos principales creados

`src/app/**` (rutas), `src/design-system/**`, `src/features/{auth,profile,onboarding,ranked}/**`, `src/lib/**`, `shared/{ranking,profile}.ts`, `supabase/migrations/20261028000001_core_profiles_ratings.sql`, `supabase/tests/**`, `jest.setup.ts`, `app.json`, `tsconfig.json`, `eslint.config.js`, `.env.example`.

## Migraciones

| Migración | Estado |
| --- | --- |
| `20261028000001_core_profiles_ratings.sql` | Probada en PGlite (Postgres 17). **No aplicada** a ningún proyecto Supabase todavía. |

## Tests ejecutados (2026-10-28)

| Suite | Comando | Resultado |
| --- | --- | --- |
| TypeScript | `npm run typecheck` | ✅ sin errores |
| ESLint | `npm run lint` | ✅ sin errores |
| Jest (lógica + componentes) | `npm test` | ✅ 51/51 |
| SQL + RLS (PGlite) | `npm run test:db` | ✅ 13/13 |
| Bundle Metro Android + iOS | `npx expo export -p android -p ios` | ✅ compila |
| expo-doctor | `npx expo-doctor` | ✅ 20/20 |

Tests fallidos: ninguno.
No ejecutado: app en simulador/dispositivo (sin backend configurado ni SDK nativos locales).

## Problemas conocidos

1. Sin proyecto Supabase: en dispositivo la app muestra "Falta configurar el backend".
2. Tipos de DB escritos a mano (`src/lib/database.types.ts`); hay un cast acotado en `features/ranked/api.ts` hasta generar tipos reales.
3. El mock oficial de Reanimated 4.7 falla en Jest; se usa un mock mínimo propio.
4. Bundle IDs `com.polygo.app` son provisionales: confirmar antes de publicar en tiendas.
5. La visibilidad "Sólo amigos"/"Privado" se guarda, pero todavía no filtra nada (no hay estadísticas públicas detalladas ni amigos).

## Próximos pasos exactos

1. Autorizar la creación del proyecto Supabase (o pasar URL + anon key de uno existente).
2. Aplicar la migración 0001, generar tipos, completar `.env`, añadir `polygo://auth-callback` y la URL de Expo Go a Redirect URLs.
3. Probar registro → confirmación → onboarding → tabs en Expo Go.
4. Empezar Fase 2: migración `curriculum` (units, lessons, words, exercises, progreso) + seed A1 de las primeras 3 unidades + motor de ejercicios con validación testeada.
