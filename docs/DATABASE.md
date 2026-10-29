# Base de datos

Migraciones versionadas en `supabase/migrations/`. Tests en `supabase/tests/` (`npm run test:db`).

Aplicadas en Supabase (`PolyGo`, 2026-10-29): `20261029010416_core_profiles_ratings`, `20261029010511_advisor_fixes`.

## Migración 0001 — núcleo

| Tabla | Propósito | Escritura desde el cliente |
| --- | --- | --- |
| `languages` | Idiomas y si están disponibles como objetivo | No |
| `profiles` | Datos públicos: username, código público, avatar, idioma, objetivo diario, región opcional | Sólo columnas `display_name`, `avatar_id`, `daily_goal_minutes`, `region` de la propia fila |
| `user_settings` | Ajustes privados (visibilidad, región visible, tipo de widget) | Sólo la propia fila y columnas permitidas |
| `seasons` | Temporadas (máx. una activa por índice único parcial) | No |
| `player_ratings` | Rating actual por usuario e idioma, pico, V/D/E, rachas | **No** (sólo backend) |
| `rating_history` | Historial auditable de cada cambio de rating | **No** (sólo backend) |

### Restricciones clave

- `username` `^[a-z0-9_]{3,20}$`, único; sólo se fija vía RPC `complete_onboarding`.
- `public_code` `PG-XXXXXX` generado en el alta.
- `player_ratings`: `rating >= 100`, `peak_rating >= rating`, `wins + losses + draws = games_played`.
- `rating_history`: `UNIQUE (user_id, battle_id)`; `delta` columna generada; `reason='battle' ⇔ battle_id IS NOT NULL`.

### Funciones

| Función | Seguridad | Uso |
| --- | --- | --- |
| `handle_new_user()` | trigger, definer | Crea perfil, ajustes, rating 1000 e historial `initial` al registrarse |
| `is_username_available(text)` | invoker (desde 0002), `authenticated` | Chequeo en onboarding |
| `complete_onboarding(...)` | definer, `authenticated` | Valida y guarda onboarding |

## RLS

| Tabla | SELECT | UPDATE |
| --- | --- | --- |
| languages, seasons | anon + authenticated | — |
| profiles, player_ratings | authenticated (todas las filas) | profiles: sólo dueño |
| user_settings, rating_history | sólo dueño | settings: sólo dueño |

Se hace `REVOKE ALL` explícito porque Supabase concede privilegios amplios por defecto.

## Borrado y conservación

Borrar el usuario en `auth.users` elimina en cascada perfil, ajustes, rating e historial (testeado). En Fase 4, `battle_players` conservará la partida para el rival con el jugador anonimizado.

## Migración 0002 — correcciones de advisors

- Políticas RLS con `(select auth.uid())` para evaluar una vez por consulta, no por fila.
- Índices en FKs: `profiles(target_language)`, `rating_history(language_code)`, `rating_history(season_id)`.
- `is_username_available` pasa a `SECURITY INVOKER` (los usuarios autenticados ya leen `profiles`).

## Migración 0003 — currículo y progreso (`20261029120000_curriculum.sql`)

> Estado: probada en PGlite (29 tests). **Pendiente de aplicar en Supabase.**

| Tabla | Propósito | Cliente |
| --- | --- | --- |
| `curriculum_units`, `lessons` | Estructura del currículo por idioma y nivel | lee lo publicado |
| `words` | Vocabulario: texto, traducción y variantes, IPA, emoji, ejemplos, dificultad, etiquetas, revisión editorial | lee lo publicado |
| `exercises` | Ejercicio con `type`, `skill`, `payload` jsonb (validado por CHECK contra `type`), respuesta y variantes | lee lo publicado |
| `exercise_words` | Palabras que practica cada ejercicio (alimenta el SRS) | lee |
| `learning_sessions` | Sesión de lección o repaso; `id` generado por el cliente = clave de idempotencia | sólo propias |
| `exercise_attempts` | Cada respuesta: correcta, primer intento, tiempo | sólo propias |
| `user_lesson_progress` | Veces completada y mejor precisión por lección | sólo propias |
| `user_word_progress` | Estado SRS por palabra: etapa, aciertos/errores, próximo repaso, dominada | sólo propias |
| `user_daily_activity` | Actividad por día local (racha y objetivo diario) | sólo propias |

Desviación respecto de la propuesta inicial: no hay `lesson_exercises` (cada ejercicio pertenece a una lección) ni `daily_word_assignments` (la palabra del día es determinista por fecha con `word_of_the_day`; se revisará para los widgets en Fase 5).

### Funciones

| Función | Seguridad | Uso |
| --- | --- | --- |
| `submit_learning_session(...)` | definer, `authenticated` | Única vía de escritura del progreso. Valida sesión, tipo, ventana de tiempo (≤ 3 h), desbloqueo, pertenencia de ejercicios, un primer intento por ejercicio, palabras únicas en repasos; idempotente por id |
| `apply_word_result(...)` | interna (sin EXECUTE para clientes) | Actualiza el SRS de una palabra |
| `is_lesson_unlocked(...)` | interna | Regla de desbloqueo lineal |
| `get_learning_summary(tz)` | invoker | Racha, actividad de hoy, lecciones, palabras vistas/dominadas/vencidas, tiempo, precisión por habilidad, errores frecuentes |
| `word_of_the_day(date)` | invoker | Palabra determinista por fecha |
| `srs_config()` | inmutable | Parámetros SRS (deben coincidir con `shared/srs.ts`) |

Confianza: en lecciones (no competitivas) el cliente valida la respuesta para dar feedback inmediato y el servidor registra el resultado informado. El ELO nunca depende de estas tablas.

## Migración de contenido (`20261029120100_content_a1_units_1_3.sql`)

Generada por `scripts/build-content-sql.ts` desde `content/a1`. Idempotente (upserts). **Pendiente de aplicar en Supabase.**

## Próximas migraciones

- 0004 batallas: `matchmaking_queue`, `battles`, `battle_players`, `battle_answers`, FK `rating_history.battle_id`, función de liquidación transaccional.
