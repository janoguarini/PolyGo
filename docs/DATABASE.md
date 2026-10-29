# Base de datos

Migraciones versionadas en `supabase/migrations/`. Tests en `supabase/tests/` (`npm run test:db`).

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
| `is_username_available(text)` | definer, `authenticated` | Chequeo en onboarding |
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

## Próximas migraciones

- 0002 currículo: `curriculum_units`, `lessons`, `words`, `exercises`, `lesson_exercises`, `user_lesson_progress`, `user_word_progress`, `daily_word_assignments`.
- 0003 batallas: `matchmaking_queue`, `battles`, `battle_players`, `battle_answers`, FK `rating_history.battle_id`, función de liquidación transaccional.
