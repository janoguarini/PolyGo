-- =====================================================================
-- Polygo · Migración 0005 · Liquidación de partidas Word Rush
-- Sólo las llama el servidor de partidas con la service_role key (server/).
-- El ELO lo calcula el servidor con shared/ranking.ts; settle_battle verifica que el rating que usó
-- siga vigente (control optimista) y escribe todo en una sola transacción. Idempotente por battle_id.
-- Reglas: docs/BATTLE_PROTOCOL.md y docs/RANKING_SYSTEM.md.
-- =====================================================================

/** Crea la partida al empezar (ambos jugadores confirmaron). Reintentar con el mismo id no duplica. */
create or replace function public.start_battle(
  p_battle_id uuid,
  p_language_code text,
  p_player1 uuid,
  p_player2 uuid,
  p_protocol_version smallint
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_player1 is null or p_player2 is null or p_player1 = p_player2 then
    raise exception 'invalid_players' using errcode = '22023';
  end if;

  insert into public.battles (id, language_code, season_id, mode, is_ranked, status, protocol_version, started_at)
  select p_battle_id, p_language_code, s.id, 'word_rush', true, 'in_progress', p_protocol_version, now()
  from (select 1) as one
  left join public.seasons s on s.status = 'active'
  on conflict (id) do nothing;

  insert into public.battle_players (battle_id, slot, user_id, rating_before)
  select p_battle_id, v.slot, v.user_id, r.rating
  from (values (1::smallint, p_player1), (2::smallint, p_player2)) as v (slot, user_id)
  left join public.player_ratings r on r.user_id = v.user_id and r.language_code = p_language_code
  on conflict do nothing;
end;
$$;

/**
 * Lo que el servidor necesita para calcular el ELO: rating y partidas jugadas actuales de cada
 * jugador y cuántas partidas ranked liquidadas tienen entre sí en la ventana anti-farming,
 * contando la actual.
 */
create or replace function public.battle_settlement_context(p_battle_id uuid, p_window_hours integer)
returns table (slot smallint, user_id uuid, rating integer, games_played integer, matches_in_window integer)
language sql
stable
security definer
set search_path = ''
as $$
  with players as (
    select bp.slot, bp.user_id from public.battle_players bp where bp.battle_id = p_battle_id
  ),
  pair as (
    select count(*)::int as n
    from public.battles b
    where b.id <> p_battle_id
      and b.is_ranked
      and b.status in ('completed', 'forfeited')
      and b.ended_at > now() - make_interval(hours => p_window_hours)
      and (select count(*) from public.battle_players x
           where x.battle_id = b.id and x.user_id in (select p.user_id from players p)) = 2
  )
  select p.slot, p.user_id, r.rating, r.games_played, (select n from pair) + 1
  from players p
  join public.battles b on b.id = p_battle_id
  left join public.player_ratings r on r.user_id = p.user_id and r.language_code = b.language_code
  order by p.slot;
$$;

/**
 * Cierra la partida: battle_players, player_ratings, rating_history y logros, todo junto.
 * p_players: [{slot, score, correct, answered, result, forfeited, rating_before, games_played_before, rating_after}]
 * Si el rating cambió desde que el servidor leyó el contexto, falla con 'stale_rating' (40001) y el
 * servidor reintenta. Si la partida ya estaba cerrada devuelve duplicate = true sin tocar nada.
 */
create or replace function public.settle_battle(p_battle_id uuid, p_status text, p_players jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  b public.battles;
  p jsonb;
  bp public.battle_players;
  r public.player_ratings;
  v_result text;
  v_after integer;
  unlocked text[];
  achievements jsonb := '{}'::jsonb;
begin
  if p_status not in ('completed', 'forfeited') then
    raise exception 'invalid_status' using errcode = '22023';
  end if;

  select * into b from public.battles where id = p_battle_id for update;
  if b.id is null then
    raise exception 'battle_not_found' using errcode = 'P0002';
  end if;
  if b.status in ('completed', 'forfeited', 'cancelled') then
    return jsonb_build_object('duplicate', true, 'status', b.status, 'achievements', '{}'::jsonb);
  end if;

  if jsonb_typeof(p_players) <> 'array' or jsonb_array_length(p_players) <>
     (select count(*) from public.battle_players x where x.battle_id = p_battle_id) then
    raise exception 'invalid_players' using errcode = '22023';
  end if;

  for p in select * from jsonb_array_elements(p_players) loop
    select * into bp from public.battle_players
    where battle_id = p_battle_id and slot = (p ->> 'slot')::smallint;
    if bp.battle_id is null then
      raise exception 'invalid_players' using errcode = '22023';
    end if;

    v_result := p ->> 'result';
    if v_result not in ('win', 'loss', 'draw') then
      raise exception 'invalid_result' using errcode = '22023';
    end if;
    v_after := (p ->> 'rating_after')::int;

    -- La cuenta pudo borrarse durante la partida: se guarda el resultado anonimizado, sin rating.
    if bp.user_id is not null then
      select * into r from public.player_ratings
      where user_id = bp.user_id and language_code = b.language_code
      for update;
      if r.user_id is null
         or r.rating <> (p ->> 'rating_before')::int
         or r.games_played <> (p ->> 'games_played_before')::int then
        raise exception 'stale_rating' using errcode = '40001';
      end if;

      update public.player_ratings set
        rating = v_after,
        peak_rating = greatest(peak_rating, v_after),
        games_played = games_played + 1,
        wins = wins + (v_result = 'win')::int,
        losses = losses + (v_result = 'loss')::int,
        draws = draws + (v_result = 'draw')::int,
        win_streak = case when v_result = 'win' then win_streak + 1 else 0 end,
        best_win_streak = greatest(best_win_streak,
                                   case when v_result = 'win' then win_streak + 1 else 0 end)
      where user_id = bp.user_id and language_code = b.language_code;

      insert into public.rating_history (user_id, language_code, season_id, battle_id, reason, rating_before, rating_after)
      values (bp.user_id, b.language_code, b.season_id, p_battle_id, 'battle', r.rating, v_after);
    end if;

    update public.battle_players set
      score = (p ->> 'score')::int,
      correct_answers = (p ->> 'correct')::int,
      total_answers = (p ->> 'answered')::int,
      result = v_result,
      forfeited = coalesce((p ->> 'forfeited')::boolean, false),
      rating_before = case when bp.user_id is null then null else r.rating end,
      rating_after = case when bp.user_id is null then null else v_after end
    where battle_id = p_battle_id and slot = bp.slot;
  end loop;

  update public.battles set status = p_status, ended_at = now() where id = p_battle_id;

  for bp in select * from public.battle_players where battle_id = p_battle_id and user_id is not null loop
    unlocked := public.evaluate_achievements(bp.user_id);
    achievements := achievements || jsonb_build_object(bp.user_id::text, (
      select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title_es, 'icon', a.icon)
                                order by a.position), '[]'::jsonb)
      from public.achievements a where a.id = any(unlocked)));
  end loop;

  return jsonb_build_object('duplicate', false, 'status', p_status, 'achievements', achievements);
end;
$$;

/** Cancela una partida sin liquidar (no toca ratings). Devuelve false si ya estaba cerrada. */
create or replace function public.cancel_battle(p_battle_id uuid)
returns boolean
language sql
security definer
set search_path = ''
as $$
  with updated as (
    update public.battles set status = 'cancelled', ended_at = now()
    where id = p_battle_id and status not in ('completed', 'forfeited', 'cancelled')
    returning 1
  )
  select exists (select 1 from updated);
$$;

/**
 * Al arrancar, el servidor cancela las partidas que quedaron abiertas por un reinicio.
 * Una partida dura como máximo ~2 min (listo + cuenta atrás + 75 s + gracia de reconexión).
 */
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
    returning 1
  )
  select count(*)::int from updated;
$$;

-- ---------- permisos: sólo el servidor de partidas ----------
revoke all on function public.start_battle(uuid, text, uuid, uuid, smallint) from public, anon, authenticated;
revoke all on function public.battle_settlement_context(uuid, integer) from public, anon, authenticated;
revoke all on function public.settle_battle(uuid, text, jsonb) from public, anon, authenticated;
revoke all on function public.cancel_battle(uuid) from public, anon, authenticated;
revoke all on function public.cancel_stale_battles(integer) from public, anon, authenticated;
grant execute on function public.start_battle(uuid, text, uuid, uuid, smallint) to service_role;
grant execute on function public.battle_settlement_context(uuid, integer) to service_role;
grant execute on function public.settle_battle(uuid, text, jsonb) to service_role;
grant execute on function public.cancel_battle(uuid) to service_role;
grant execute on function public.cancel_stale_battles(integer) to service_role;
