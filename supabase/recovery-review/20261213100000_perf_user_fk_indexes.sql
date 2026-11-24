-- =====================================================================
-- Rendimiento: índices de claves foráneas en tablas por usuario y política
-- RLS de user_curriculum_routes evaluada una sola vez por consulta.
--
-- Origen: asesor de rendimiento de Supabase (2026-11-18). De las 134 claves
-- foráneas sin índice, sólo estas 6 están en tablas que crecen con los
-- usuarios o las partidas; el resto son catálogos de contenido (cambian sólo
-- al publicar contenido) y no se indexan para no encarecer las cargas.
--
-- Por qué importan:
--   * user_id con ON DELETE CASCADE: borrar una cuenta (delete-account)
--     recorre la tabla entera por cada fila de profiles borrada.
--   * guest_id / battle_id: comprobaciones de la clave foránea al borrar o
--     actualizar partidas y perfiles, y búsquedas de desafíos por invitado.
--
-- Las tablas son pequeñas hoy: CREATE INDEX (no CONCURRENTLY) dentro de la
-- transacción tarda milisegundos. Idempotente.
-- =====================================================================

create index if not exists learning_session_clients_user_idx
  on public.learning_session_clients (user_id);

create index if not exists review_presentation_answers_user_idx
  on public.review_presentation_answers (user_id);

create index if not exists review_presentation_retries_user_idx
  on public.review_presentation_retries (user_id);

create index if not exists friend_challenges_guest_idx
  on public.friend_challenges (guest_id)
  where guest_id is not null;

create index if not exists friend_challenges_battle_idx
  on public.friend_challenges (battle_id)
  where battle_id is not null;

create index if not exists ranked_queue_battle_idx
  on public.ranked_queue (battle_id)
  where battle_id is not null;

-- auth.uid() envuelto en un subselect: Postgres lo calcula una vez (InitPlan)
-- en vez de una vez por fila. Mismo significado; conserva roles y comando.
alter policy "own curriculum route" on public.user_curriculum_routes
  using (user_id = (select auth.uid()));
