# Estado de implementación

Última actualización: 2026-10-29

## Fase actual

**Fase 3 — Perfil, historial, evolución de ELO y logros: completa y desplegada en Supabase.** Migración 0004 aplicada y verificada contra la base real (sesión y partida revertidas). Falta recorrerla en el teléfono. Los datos competitivos (partidas, gráfico de ELO, logros de ranked) se llenan cuando exista la Fase 4; hasta entonces se muestran estados vacíos honestos.

**Fase 2** — completa y desplegada; falta recorrerla en el teléfono.

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

### Fase 3
- [x] Migración 0004: `battles` y `battle_players` (resultados, sólo backend; rival anonimizado al borrar cuenta), FK `rating_history.battle_id`, catálogo de 16 logros, `user_achievements`, RPCs `get_match_history`, `get_my_achievements`, `get_public_profile`; `submit_learning_session` evalúa logros y los devuelve.
- [x] Backfill de logros para usuarios existentes al aplicar la migración.
- [x] Perfil: botón Editar, gráfico de evolución de ELO (SVG, una serie, tocar para inspeccionar), últimas partidas, resumen de logros.
- [x] Pantallas nuevas: Historial de partidas (paginado), Logros (por categoría, con progreso), Perfil de jugador (desde la clasificación o el historial; respeta privacidad), Editar perfil (nombre visible, avatar, objetivo diario).
- [x] Resultados de lección/repaso muestran los logros recién desbloqueados.
- [x] La visibilidad de perfil ya tiene efecto (`private`/`friends` sólo muestran nombre, avatar y rango).

## Pendiente (por fase)

- **Fase 2 (verificación manual):** recorrer una lección y un repaso en el teléfono.
- **Fase 2 (contenido):** revisión editorial humana; unidades 4–12.
- **Fase 3 (verificación manual):** recorrer perfil, editar perfil, logros y perfil de otro jugador en el teléfono.
- **Fase 4:** servidor de partidas WebSocket, matchmaking, Word Rush, liquidación ELO (escribiendo en `battles`/`battle_players` y llamando a `evaluate_achievements`). *"Buscar partida" sigue deshabilitado; los logros competitivos dicen "Disponible cuando abra Ranked" (`RANKED_AVAILABLE` en `src/app/achievements.tsx`).*
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
| `20261029140504_profile_history_achievements.sql` | ✅ | ✅ aplicada |

Al aplicar por MCP, Supabase registra la versión con la hora de aplicación: los archivos locales se renombran para coincidir.
Las migraciones no deben contener sentencias destructivas: el conector las rechaza sin poder pedir confirmación (ver SECURITY.md).

## Verificación en Supabase de la Fase 3 (2026-10-29)

Todo dentro de un bloque que termina en excepción (rollback); conteos finales en 0.

| Prueba | Resultado |
| --- | --- |
| 16 logros cargados; backfill sin logros (el único usuario no tenía progreso) | ✅ |
| Completar la lección `a1-u01-l01` perfecta como usuario autenticado | ✅ devuelve `first_lesson` y `perfect_lesson` |
| Reenviar la misma sesión | ✅ `duplicate: true`, `achievements_unlocked: []` |
| Partida terminada con rival anonimizado → `get_match_history` | ✅ resultado, puntajes, rating 1000 → 1024, rival `null` |
| `get_public_profile` del propio usuario | ✅ 2 logros, 1 lección, racha récord 1 |
| Datos residuales | ✅ ninguno |
| Advisors | 2 `SECURITY DEFINER` nuevos intencionales (`get_match_history`, `get_public_profile`); índices sin uso (sin tráfico) |

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
| Jest | `npm test` | ✅ 222/222 (12 suites: + geometría del gráfico, formatos, historial, logros) |
| SQL + RLS (PGlite) | `npm run test:db` | ✅ 39/39 (+ partidas, historial, anonimización, logros, racha récord, visibilidad) |
| Bundle Metro Android + iOS | `npx expo export -p android -p ios` | ✅ |
| expo-doctor | `npx expo-doctor` | ✅ 20/20 |

No ejecutado todavía: lecciones, repasos y pantallas de la Fase 3 en el teléfono.

## Problemas conocidos

1. Tipos de base de datos generados desde Supabase; regenerarlos tras cada migración.
2. Contenido A1 sin revisión editorial humana (`review_status = 'draft'`).
3. En lecciones, la corrección la calcula el cliente (feedback inmediato); el servidor valida estructura, desbloqueo e idempotencia, no re-corrige. No afecta al ELO.
4. Mock propio de Reanimated en Jest; bundle IDs provisionales; SMTP por defecto de Supabase.
5. `friends` se trata como privado hasta que existan amigos.
6. El historial pagina por fecha de fin: dos partidas terminadas en el mismo microsegundo podrían saltearse entre páginas (despreciable).

## Próximos pasos exactos

1. En el teléfono: completar la lección 1 (debe mostrar "Primer paso" y, si es perfecta, "Impecable"), verificar desbloqueo de la 2, racha en Inicio, Perfil → Logros, Editar perfil y abrir un jugador desde la clasificación.
2. Decidir si activar la protección de contraseñas filtradas en Supabase Auth.
3. Fase 4: servidor de partidas, matchmaking, Word Rush y liquidación (ver BATTLE_PROTOCOL → Persistencia).
