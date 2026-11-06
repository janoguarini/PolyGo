-- =====================================================================
-- El barrido de partidas huérfanas del servidor de partidas sólo toca SUS partidas. Sin sentencias
-- destructivas: create or replace con la misma firma (antes: 20261029144242_battle_settlement).
--
-- Antes cancelaba cualquier partida abierta de más de N segundos, también las del flujo viejo sin
-- servidor que abre el teléfono. Así un abandono en la app vieja terminaba cancelado: sin derrota y
-- sin consumir el cupo de calibración contra bots (bot_calibration_used no cuenta las canceladas).
--
-- Cómo se distinguen (todas las inserciones en public.battles):
-- * Flujo viejo: start_bot_match guarda bot_script; join_human_queue y los desafíos con amigos
--   (create/accept/invite) guardan questions. Esas partidas se cierran con sus propias reglas
--   (settle_bot_match: abandono pasados 15 min o al empezar otra; human_match_result: 75 + 30 s).
-- * Servidor de partidas: start_battle, start_bot_battle y start_bot_battle_v2 no guardan ninguna
--   de las dos (las preguntas y el bot viven en el servidor).
-- =====================================================================

create or replace function public.cancel_stale_battles(p_older_than_seconds integer)
returns integer
language sql
security definer
set search_path = ''
as $$
  with updated as (
    update public.battles set status = 'cancelled', ended_at = now()
    where status not in ('completed', 'forfeited', 'cancelled')
      and created_at < now() - make_interval(secs => p_older_than_seconds)
      -- Sólo partidas del servidor de partidas: ni guion de bot ni preguntas guardadas.
      and bot_script is null
      and questions is null
    returning 1
  )
  select count(*)::int from updated;
$$;

revoke all on function public.cancel_stale_battles(integer) from public, anon, authenticated;
grant execute on function public.cancel_stale_battles(integer) to service_role;
