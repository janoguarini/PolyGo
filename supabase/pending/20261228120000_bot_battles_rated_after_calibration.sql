-- =====================================================================
-- Partidas contra bots con ELO también después de la calibración. 2026-11-25. NO APLICADA: archivo
-- local, sin autorización para ejecutarse. Vive en supabase/pending/ (no en migrations/) para que la
-- integración GitHub–Supabase no la aplique sola.
--
-- Hasta ahora start_bot_battle_v2 guardaba una partida contra un bot como ranked sólo dentro del cupo
-- de calibración (bot_calibration_used < bot_calibration_limit() = 3), aunque el servidor la pidiera
-- con ELO. Desde esta migración respeta lo que pide el servidor (p_rated): el servidor de partidas
-- decide (BOT_CALIBRATION.ratedAfterCalibration en shared/bots.ts) y, mientras haya pocos jugadores,
-- pide ELO también después del cupo con un bot que juega a la altura del jugador
-- (shared/botPacing.ts).
--
-- Única diferencia con la versión en producción (definición leída de prod el 2026-11-25):
--     rated := coalesce(p_rated, false) and used < cap;   →   rated := coalesce(p_rated, false);
-- Firma, validaciones, idempotencia, inserts y respuesta: idénticos. bot_calibration_used sigue contando
-- las partidas ranked contra bots (el servidor sigue llamando "calibración" a las primeras 3).
--
-- Seguridad: sólo service_role puede ejecutar start_bot_battle_v2 (verificado en prod: anon y
-- authenticated no tienen EXECUTE); CREATE OR REPLACE conserva dueño y privilegios. La app no puede
-- crear partidas con ELO contra bots por su cuenta.
--
-- No toca tablas ni datos. Rollback: supabase/rollback/20261228120000_bot_battles_rated_after_calibration.down.sql
-- (vuelve al tope del cupo).
-- =====================================================================

create or replace function public.start_bot_battle_v2(p_battle_id uuid, p_language_code text, p_player uuid, p_bot_name text, p_bot_avatar_id text, p_bot_rating integer, p_protocol_version smallint, p_rated boolean)
 returns jsonb
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  existing public.battles;
  r public.player_ratings;
  used integer;
  cap integer := public.bot_calibration_limit();
  rated boolean;
begin
  if p_battle_id is null or p_player is null or p_bot_name is null
     or char_length(p_bot_name) not between 1 and 20
     or p_bot_avatar_id not in ('bolt', 'crown', 'flame')
     or p_bot_rating is null or p_bot_rating not between 100 and 3000 then
    raise exception 'invalid_players' using errcode = '22023';
  end if;

  select * into r from public.player_ratings
  where user_id = p_player and language_code = p_language_code
  for update;
  if r.user_id is null then
    raise exception 'language_unavailable' using errcode = '22023';
  end if;

  select * into existing from public.battles where id = p_battle_id;
  if existing.id is not null then
    if not existing.has_bot or existing.language_code <> p_language_code or not exists (
      select 1 from public.battle_players
      where battle_id = p_battle_id and slot = 1 and user_id = p_player) then
      raise exception 'invalid_players' using errcode = '22023';
    end if;
    return jsonb_build_object('rated', existing.is_ranked,
      'calibration_used', public.bot_calibration_used(p_player, p_language_code),
      'calibration_limit', cap);
  end if;

  used := public.bot_calibration_used(p_player, p_language_code);
  -- El servidor de partidas decide si la partida mueve el ELO (calibración o, después del cupo,
  -- clasificatoria): ver la cabecera.
  rated := coalesce(p_rated, false);

  insert into public.battles (id, language_code, season_id, mode, is_ranked, status, protocol_version, started_at, has_bot)
  select p_battle_id, p_language_code, s.id, 'word_rush', rated, 'in_progress', p_protocol_version, now(), true
  from (select 1) as one
  left join public.seasons s on s.status = 'active';

  insert into public.battle_players (battle_id, slot, user_id, rating_before)
  values (p_battle_id, 1, p_player, r.rating);
  insert into public.battle_players (battle_id, slot, user_id, rating_before, bot_name, bot_avatar_id)
  values (p_battle_id, 2, null, p_bot_rating, p_bot_name, p_bot_avatar_id);

  return jsonb_build_object('rated', rated,
    'calibration_used', used + rated::int,
    'calibration_limit', cap);
end;
$function$;
