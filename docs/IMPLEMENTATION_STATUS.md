# Estado de implementación

Última actualización: 2026-10-29

## Fase actual

**Fase 2 — Sistema educativo A1: completa y desplegada en Supabase.** Migraciones aplicadas, contenido verificado por checksum y flujo lección → desbloqueo → repaso probado contra la base real (transacciones revertidas). Falta recorrerla en el teléfono.

Fase 1 verificada en dispositivo (registro, onboarding, tabs).

## Backend

| Dato | Valor |
| --- | --- |
| Proyecto Supabase | `PolyGo` · ref `wtymosvsymzoosxscnxi` · `us-west-2` |
| URL | `https://wtymosvsymzoosxscnxi.supabase.co` |
| Repositorio | https://github.com/janoguarini/PolyGo |

## Terminado

### Fase 1
- [x] Expo SDK 58 + TypeScript estricto, Expo Router con rutas protegidas, sistema de diseño, emblemas de rango.
- [x] Auth Supabase (registro sin confirmación de email por decisión de producto), onboarding, tabs, clasificación global, privacidad.
- [x] `shared/ranking.ts` (ELO, rangos, anti-farming). Migraciones 0001 y 0002 aplicadas.
- [x] Verificado en teléfono (Expo Go): registro → onboarding → tabs.

### Fase 2
- [x] `shared/exercises.ts`: 9 tipos de ejercicio y 5 habilidades.
- [x] `shared/answers.ts`: validador determinista (normalización, contracciones, tolerancia controlada a typos).
- [x] `shared/srs.ts` + SQL: repetición espaciada 1/3/7 días, dominio tras 3 repasos espaciados.
- [x] Contenido A1 unidades 1–3: 15 lecciones, 64 palabras con IPA y ejemplos, 119 ejercicios (`content/a1`, borrador sin revisión humana).
- [x] Generador de migración de contenido idempotente (`npm run content:sql`).
- [x] Migración 0003: currículo, sesiones idempotentes, intentos, progreso por lección y palabra, actividad diaria, racha, resumen, palabra del día, RLS.
- [x] Motor de lecciones: reproductor con repaso de errores, feedback con traducción/IPA/ejemplo/pronunciación (voz sintetizada), resultados con reintento de guardado.
- [x] Repaso espaciado de palabras vencidas con ejercicios generados de forma determinista.
- [x] Pantallas: Aprender (mapa de unidades), Lección, Repaso, Vocabulario (estado de cada palabra), Inicio (racha, objetivo diario, lección y palabra del día), Perfil (estadísticas educativas reales).

## Pendiente (por fase)

- **Fase 2 (verificación manual):** recorrer una lección y un repaso en el teléfono.
- **Fase 2 (contenido):** revisión editorial humana; unidades 4–12.
- **Fase 3:** historial de partidas, evolución de ELO, logros.
- **Fase 4:** servidor de partidas WebSocket, matchmaking, Word Rush, liquidación ELO. *"Buscar partida" sigue deshabilitado.*
- **Fase 5:** widgets nativos iOS y Android.
- **Fase 6:** QA, accesibilidad, builds EAS, checklist de lanzamiento.

## Migraciones

| Migración | Local (PGlite) | Supabase |
| --- | --- | --- |
| `20261029010416_core_profiles_ratings.sql` | ✅ | ✅ aplicada |
| `20261029010511_advisor_fixes.sql` | ✅ | ✅ aplicada |
| `20261029021909_curriculum.sql` | ✅ | ✅ aplicada |
| `20261029022122_content_a1_unit_01.sql` | ✅ | ✅ aplicada |
| `20261029022239_content_a1_unit_02.sql` | ✅ | ✅ aplicada |
| `20261029134056_content_a1_unit_03.sql` | ✅ (reaplicación idempotente testeada) | ✅ aplicada |

Al aplicar por MCP, Supabase registra la versión con la hora de aplicación: los archivos locales se renombran para coincidir.
Las migraciones no deben contener sentencias destructivas: el conector las rechaza sin poder pedir confirmación (ver SECURITY.md).

## Verificación en Supabase de la Fase 2 (2026-10-29)

| Prueba | Resultado |
| --- | --- |
| Conteos: 3 unidades, 15 lecciones, 64 palabras, 119 ejercicios, 194 vínculos | ✅ |
| Checksum md5 de palabras, lecciones, ejercicios y vínculos igual al local | ✅ los 4 coinciden |
| Lección 2 bloqueada antes de completar la 1 | ✅ `lesson_locked` |
| Completar lección 1 real con todas correctas | ✅ precisión 1.000 |
| Reenviar la misma sesión | ✅ `duplicate: true`, sin doble conteo |
| Lección 2 desbloqueada; 6 palabras en etapa 1; racha 1 | ✅ |
| Repaso guardado con `p_lesson_id` vacío (bug corregido en el cliente) | ✅ |
| Datos de prueba residuales | ✅ ninguno |
| Advisors | 2 `SECURITY DEFINER` intencionales; protección de contraseñas filtradas desactivada (decisión pendiente); índices sin uso (sin tráfico) |

## Tests locales (2026-10-29)

| Suite | Comando | Resultado |
| --- | --- | --- |
| TypeScript (app + scripts) | `npm run typecheck` | ✅ |
| ESLint | `npm run lint` | ✅ |
| Jest | `npm test` | ✅ 207/207 (10 suites: ranking, respuestas, contenido ×125, reproductor, entradas, componentes…) |
| SQL + RLS (PGlite) | `npm run test:db` | ✅ 29/29 |
| Bundle Metro Android + iOS | `npx expo export -p android -p ios` | ✅ |
| expo-doctor | `npx expo-doctor` | ✅ 20/20 |

No ejecutado todavía: lecciones y repasos en el teléfono.

## Problemas conocidos

1. Tipos de base de datos generados desde Supabase; regenerarlos tras cada migración.
2. Contenido A1 sin revisión editorial humana (`review_status = 'draft'`).
3. En lecciones, la corrección la calcula el cliente (feedback inmediato); el servidor valida estructura, desbloqueo e idempotencia, no re-corrige. No afecta al ELO.
4. Mock propio de Reanimated en Jest; bundle IDs provisionales; visibilidad de perfil aún sin efecto; SMTP por defecto de Supabase.

## Próximos pasos exactos

1. En el teléfono: completar la lección 1, verificar desbloqueo de la 2, racha en Inicio y palabras en Vocabulario.
2. Decidir si activar la protección de contraseñas filtradas en Supabase Auth.
3. Fase 3 (perfil e historial) o Fase 4 (motor competitivo), según prioridad.
