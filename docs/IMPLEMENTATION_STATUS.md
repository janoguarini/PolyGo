# Estado de implementación

Última actualización: 2026-10-29

## Fase actual

**Fase 2 — Sistema educativo A1: implementada y testeada en local. Bloqueada para dispositivo** hasta aplicar en Supabase las migraciones `20261029120000_curriculum.sql` y `20261029120100_content_a1_units_1_3.sql` (el aviso de permiso de `apply_migration` fue rechazado dos veces en esta sesión).

Mientras no se apliquen, en el teléfono las pantallas Aprender/Vocabulario muestran error de carga y el resumen de Inicio queda vacío. Fase 1 verificada en dispositivo (registro, onboarding, tabs).

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

- **Fase 2 (despliegue):** aplicar migraciones 0003 y contenido; reemplazar tipos provisionales por tipos generados; correr advisors; probar una lección completa en el teléfono.
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
| `20261029120000_curriculum.sql` | ✅ | ⏳ pendiente (permiso rechazado) |
| `20261029120100_content_a1_units_1_3.sql` | ✅ (idempotencia testeada) | ⏳ pendiente |

Al aplicar por MCP, Supabase registra la versión con la hora de aplicación: renombrar los archivos locales para que coincidan (como se hizo con 0001/0002).

## Tests locales (2026-10-29)

| Suite | Comando | Resultado |
| --- | --- | --- |
| TypeScript (app + scripts) | `npm run typecheck` | ✅ |
| ESLint | `npm run lint` | ✅ |
| Jest | `npm test` | ✅ 207/207 (10 suites: ranking, respuestas, contenido ×125, reproductor, entradas, componentes…) |
| SQL + RLS (PGlite) | `npm run test:db` | ✅ 29/29 |
| Bundle Metro Android + iOS | `npx expo export -p android -p ios` | ✅ |
| expo-doctor | `npx expo-doctor` | ✅ 20/20 |

No ejecutado: lecciones en dispositivo (requiere las migraciones pendientes).

## Problemas conocidos

1. `src/lib/database.generated.ts` contiene tipos **provisionales escritos a mano** para las tablas de 0003 (marcados `PROVISIONAL`). Regenerar al aplicar la migración.
2. Contenido A1 sin revisión editorial humana (`review_status = 'draft'`).
3. En lecciones, la corrección la calcula el cliente (feedback inmediato); el servidor valida estructura, desbloqueo e idempotencia, no re-corrige. No afecta al ELO.
4. Mock propio de Reanimated en Jest; bundle IDs provisionales; visibilidad de perfil aún sin efecto; SMTP por defecto de Supabase.

## Próximos pasos exactos

1. Aplicar `20261029120000_curriculum.sql` y luego `20261029120100_content_a1_units_1_3.sql` (MCP con permiso aceptado, o SQL Editor del dashboard).
2. Generar tipos reales y quitar el bloque `PROVISIONAL`; correr advisors.
3. En el teléfono: completar la lección 1, verificar desbloqueo de la 2, racha en Inicio y palabras en Vocabulario.
4. Fase 3 (perfil e historial) o Fase 4 (motor competitivo), según prioridad.
