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

Borrar el usuario en `auth.users` elimina en cascada perfil, ajustes, rating e historial (testeado). `battle_players` conserva la partida para el rival con el jugador anonimizado (`user_id` → NULL), también si la cuenta se borra durante la partida (testeado).

## Migración 0002 — correcciones de advisors

- Políticas RLS con `(select auth.uid())` para evaluar una vez por consulta, no por fila.
- Índices en FKs: `profiles(target_language)`, `rating_history(language_code)`, `rating_history(season_id)`.
- `is_username_available` pasa a `SECURITY INVOKER` (los usuarios autenticados ya leen `profiles`).

## Migración 0003 — currículo y progreso (`20261029021909_curriculum.sql`)

> Estado: aplicada en Supabase (2026-10-29) y verificada con una sesión real revertida.

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
| `submit_learning_session(...)` | definer, `authenticated` (aviso de advisor intencional) | Única vía de escritura del progreso. Valida sesión, tipo, ventana de tiempo (≤ 3 h), desbloqueo, pertenencia de ejercicios, un primer intento por ejercicio, palabras únicas en repasos; idempotente por id |
| `apply_word_result(...)` | interna (sin EXECUTE para clientes) | Actualiza el SRS de una palabra |
| `is_lesson_unlocked(...)` | interna | Regla de desbloqueo lineal |
| `get_learning_summary(tz)` | invoker | Racha, actividad de hoy, lecciones, palabras vistas/dominadas/vencidas, tiempo, precisión por habilidad, errores frecuentes |
| `word_of_the_day(date)` | invoker | Palabra determinista por fecha |
| `srs_config()` | inmutable | Parámetros SRS (deben coincidir con `shared/srs.ts`) |

Confianza: en lecciones (no competitivas) el cliente valida la respuesta para dar feedback inmediato y el servidor registra el resultado informado. El ELO nunca depende de estas tablas.

## Migraciones de contenido (`…_content_a1_unit_01|02|03.sql`)

Generadas por `scripts/build-content-sql.ts --unit N` desde `content/a1` (una por unidad, aplicadas en orden). Idempotentes y sin sentencias destructivas. Aplicadas en Supabase; checksum md5 del contenido idéntico al local.

## Migración 0004 — perfil, historial y logros (`20261029140504_profile_history_achievements.sql`)

> Estado: aplicada en Supabase (2026-10-29) y verificada con una sesión y una partida reales revertidas.

| Tabla | Propósito | Cliente |
| --- | --- | --- |
| `battles` | Resultado de cada partida: idioma, temporada, modo, ranked, estado (todos los de BATTLE_PROTOCOL), inicio y fin | lee sólo las propias |
| `battle_players` | Un jugador por slot: puntaje, aciertos, resultado, abandono, rating antes/después. `user_id` → NULL al borrar la cuenta (el rival conserva la partida anonimizada) | lee sólo su fila |
| `achievements` | Catálogo (16): categoría, métrica, umbral, título, icono, orden | lee los activos |
| `user_achievements` | Logros desbloqueados y fecha. Nunca se pierden aunque la métrica baje | lee los propios |

Además: FK `rating_history.battle_id → battles(id)`.

### Funciones

| Función | Seguridad | Uso |
| --- | --- | --- |
| `achievement_metrics(uuid)` | invoker, `authenticated` | Métricas de logros: lecciones, lecciones perfectas, palabras vistas/dominadas, racha récord (islas de días), partidas, victorias, mejor racha, pico de ELO |
| `evaluate_achievements(uuid)` | interna | Desbloquea lo alcanzado y devuelve los ids nuevos; idempotente. La llaman `submit_learning_session` y, en Fase 4, la liquidación |
| `get_my_achievements()` | invoker | Catálogo con progreso y fecha de desbloqueo |
| `get_match_history(limit, before)` | definer (aviso intencional) | Partidas terminadas propias, más recientes primero, con datos del rival; pagina por fecha |
| `get_public_profile(uuid)` | definer (aviso intencional) | Perfil de otro jugador según su visibilidad |
| `submit_learning_session(...)` | reemplazada | Igual que en 0003 + evalúa logros y devuelve `achievements_unlocked` |

## Migración 0005 — liquidación de partidas (`20261029144242_battle_settlement.sql`)

Sin tablas nuevas: la cola, las preguntas y las respuestas viven en la memoria del servidor de partidas (son efímeras); a la base sólo llega el resultado. Todas las funciones son `security definer` con `search_path = ''` y **sólo las ejecuta `service_role`** (sin avisos de advisors).

| Función | Uso |
| --- | --- |
| `start_battle(id, idioma, j1, j2, versión)` | Crea `battles` (`in_progress`, temporada activa) y ambas filas de `battle_players` con el rating de partida. Idempotente |
| `battle_settlement_context(id, horas)` | Rating y partidas jugadas actuales + partidas ranked liquidadas entre ambos en la ventana (contando la actual) |
| `settle_battle(id, estado, jugadores jsonb)` | Liquidación transaccional: bloquea `player_ratings`, exige que rating y partidas jugadas sigan siendo los leídos (`stale_rating` / 40001 si no), completa `battle_players`, actualiza `player_ratings` (rating, pico, W/L/D, rachas), inserta `rating_history`, cierra `battles` y evalúa logros; devuelve los logros nuevos por jugador. Si la partida ya estaba cerrada o cancelada: `duplicate: true` sin cambios |
| `cancel_battle(id)` | Cancela sin tocar ratings; `false` si ya estaba cerrada |
| `cancel_stale_battles(segundos)` | Cancela partidas abiertas más viejas que N segundos (reinicios del servidor) |

El ELO lo calcula el servidor con `shared/ranking.ts` (fuente única); la base garantiza atomicidad, idempotencia y que no se liquide con datos viejos.

## Borrado de cuenta

No hay función SQL: la Edge Function `delete-account` llama a `auth.admin.deleteUser`, y las FK hacen el resto (cascada en todo lo personal, `SET NULL` en `battle_players`). Verificado contra el proyecto real (2026-10-29).

## Próximas migraciones

- Fase 5: lo que necesiten los widgets (probablemente nada nuevo: leen palabra del día y repasos).
