-- =====================================================================
-- Ranked con el servidor de partidas como autoridad (Fase 1). Sin sentencias destructivas: sólo
-- funciones nuevas y create or replace con la misma firma.
--
-- * Cupo de calibración contra bots (shared/bots.ts: BOT_CALIBRATION): las primeras 3 partidas
--   contra bots de cada usuario en cada idioma mueven el ELO; después, las partidas contra bots son
--   práctica. Cuenta toda partida ranked contra bot no cancelada (también las del flujo viejo sin
--   servidor y las abandonadas). Lo decide la base con el rating del jugador bloqueado.
-- * battle_settlement_context_v2: además, las victorias de cada jugador (sin posicionar = 0
--   victorias: perder o empatar no mueve el rating; shared/ranking.ts).
-- * settle_battle: una partida no ranked (bot fuera del cupo) se cierra con su resultado pero sin
--   tocar player_ratings, rating_history ni logros.
-- * settle_bot_match (flujo viejo sin servidor): en chino no hay preguntas para escribir, así que
--   el guion del bot no tiene el doble de margen (antes la base le daba más puntos que la app).
--
-- NO revoca los RPC del flujo viejo (start_bot_match, finish_bot_match, join_human_queue,
-- finish_human_match...): queda pendiente de autorización (docs/DEPLOYMENT.md).
-- =====================================================================

/** Partidas contra bots con ELO por usuario e idioma (shared/bots.ts: BOT_CALIBRATION.ratedGames). */
create or replace function public.bot_calibration_limit()
returns integer
language sql
immutable
set search_path = ''
as $$
  select 3;
$$;

/** Partidas ranked contra bots ya usadas (no canceladas) por el usuario en ese idioma. */
create or replace function public.bot_calibration_used(p_user_id uuid, p_language_code text)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::int
  from public.battles b
  join public.battle_players bp on bp.battle_id = b.id and bp.slot = 1
  where bp.user_id = p_user_id and b.language_code = p_language_code
    and b.has_bot and b.is_ranked and b.status <> 'cancelled';
$$;

/**
 * Crea una partida contra un bot al empezar (como start_bot_battle). Con p_rated, es de
 * calibración (ranked, mueve el ELO) sólo si al jugador le queda cupo en ese idioma; si no, se crea
 * no ranked. Bloquea el rating del jugador para que dos partidas simultáneas no usen el mismo cupo.
 * Idempotente: con el mismo id devuelve lo que ya se decidió.
 * Devuelve {rated, calibration_used, calibration_limit}.
 */
create or replace function public.start_bot_battle_v2(
  p_battle_id uuid,
  p_language_code text,
  p_player uuid,
  p_bot_name text,
  p_bot_avatar_id text,
  p_bot_rating integer,
  p_protocol_version smallint,
  p_rated boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
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
  rated := coalesce(p_rated, false) and used < cap;

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
$$;

/** Como battle_settlement_context, con las victorias (posicionado) y si la partida es ranked. */
create or replace function public.battle_settlement_context_v2(p_battle_id uuid, p_window_hours integer)
returns table (slot smallint, user_id uuid, rating integer, games_played integer, wins integer,
               matches_in_window integer, is_ranked boolean)
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
  select p.slot, p.user_id, r.rating, r.games_played, r.wins, (select n from pair) + 1, b.is_ranked
  from players p
  join public.battles b on b.id = p_battle_id
  left join public.player_ratings r on r.user_id = p.user_id and r.language_code = b.language_code
  order by p.slot;
$$;

/**
 * Cierra la partida (antes: 20261029144242_battle_settlement). Igual que antes para las ranked; una
 * no ranked (bot fuera del cupo de calibración) guarda puntajes y resultado sin rating, historial
 * ni logros. Idempotente.
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

    -- No ranked: sólo el resultado; el rating queda como estaba.
    if not b.is_ranked then
      update public.battle_players set
        score = (p ->> 'score')::int,
        correct_answers = (p ->> 'correct')::int,
        total_answers = (p ->> 'answered')::int,
        result = v_result,
        forfeited = coalesce((p ->> 'forfeited')::boolean, false),
        rating_after = null
      where battle_id = p_battle_id and slot = bp.slot;
      continue;
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

  if b.is_ranked then
    for bp in select * from public.battle_players where battle_id = p_battle_id and user_id is not null loop
      unlocked := public.evaluate_achievements(bp.user_id);
      achievements := achievements || jsonb_build_object(bp.user_id::text, (
        select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title_es, 'icon', a.icon)
                                  order by a.position), '[]'::jsonb)
        from public.achievements a where a.id = any(unlocked)));
    end loop;
  end if;

  return jsonb_build_object('duplicate', false, 'status', p_status, 'achievements', achievements);
end;
$$;

-- ---------- flujo viejo sin servidor (antes: 20261031200000_rush_writing) ----------
create or replace function public.settle_bot_match(
  p_battle_id uuid, p_user_id uuid, p_score integer, p_correct integer, p_answered integer, p_forfeit boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  b public.battles;
  me public.battle_players;
  bot public.battle_players;
  r public.player_ratings;
  move jsonb;
  elapsed integer := 0;
  bot_score integer := 0;
  bot_correct integer := 0;
  bot_answered integer := 0;
  bot_streak integer := 0;
  outcome text;
  after integer;
  forfeit boolean := coalesce(p_forfeit, false);
  writing boolean;
  n integer := 0;
  d integer;
  unlocked text[];
begin
  select * into b from public.battles where id = p_battle_id for update;
  select * into me from public.battle_players where battle_id = p_battle_id and slot = 1;
  select * into bot from public.battle_players where battle_id = p_battle_id and slot = 2;
  if b.id is null or not b.has_bot or b.bot_script is null or me.user_id is distinct from p_user_id then
    raise exception 'battle_not_found' using errcode = 'P0002';
  end if;

  if b.status = 'in_progress' then
    -- Demasiado tarde (la app se cerró): cuenta como abandono.
    if now() - b.started_at > interval '15 minutes' then
      forfeit := true;
    end if;
    if not forfeit and now() - b.started_at < interval '70 seconds' then
      raise exception 'too_early' using errcode = '22023';
    end if;
    -- Un puntaje imposible no se acepta (máximo 180 por respuesta correcta, con racha).
    if p_answered is null or p_correct is null or p_score is null
       or p_answered not between 0 and 200 or p_correct not between 0 and p_answered
       or p_score not between 0 and p_correct * 180 then
      if not forfeit then
        raise exception 'invalid_result' using errcode = '22023';
      end if;
      p_score := 0; p_correct := 0; p_answered := 0;
    end if;

    -- El bot juega su guion completo (siempre termina la partida). En las preguntas para escribir
    -- (desde Oro, rating con el que empezó la partida; nunca en chino) el bonus de velocidad tiene el doble de margen.
    writing := public.rush_writing_for(me.rating_before, b.language_code);
    for move in select * from jsonb_array_elements(b.bot_script) loop
      d := (move ->> 'd')::int;
      elapsed := elapsed + d;
      exit when elapsed > 75000;
      if writing and n % 3 = 2 then d := d / 2; end if;
      n := n + 1;
      bot_streak := case when (move ->> 'c')::boolean then bot_streak + 1 else 0 end;
      bot_score := greatest(0, bot_score + public.rush_points((move ->> 'c')::boolean, d)
        + case when (move ->> 'c')::boolean then public.rush_streak_bonus(bot_streak) else 0 end);
      bot_answered := bot_answered + 1;
      bot_correct := bot_correct + ((move ->> 'c')::boolean)::int;
    end loop;

    -- Abandono pierde; si no, mayor puntaje, después mayor precisión (shared/wordRush.ts).
    outcome := case
      when forfeit then 'loss'
      when p_score <> bot_score then case when p_score > bot_score then 'win' else 'loss' end
      when abs(case when p_answered = 0 then 0 else p_correct::double precision / p_answered end
             - case when bot_answered = 0 then 0 else bot_correct::double precision / bot_answered end) > 1e-9
        then case when (case when p_answered = 0 then 0 else p_correct::double precision / p_answered end)
                     > (case when bot_answered = 0 then 0 else bot_correct::double precision / bot_answered end)
                  then 'win' else 'loss' end
      else 'draw' end;

    select * into r from public.player_ratings
    where user_id = p_user_id and language_code = b.language_code for update;
    after := public.ranked_rating_after(r.rating, bot.rating_before, r.wins > 0,
                                        case outcome when 'win' then 1 when 'draw' then 0.5 else 0 end, 1);

    update public.player_ratings set
      rating = after,
      peak_rating = greatest(peak_rating, after),
      games_played = games_played + 1,
      wins = wins + (outcome = 'win')::int,
      losses = losses + (outcome = 'loss')::int,
      draws = draws + (outcome = 'draw')::int,
      win_streak = case when outcome = 'win' then win_streak + 1 else 0 end,
      best_win_streak = greatest(best_win_streak, case when outcome = 'win' then win_streak + 1 else 0 end)
    where user_id = p_user_id and language_code = b.language_code;

    insert into public.rating_history (user_id, language_code, season_id, battle_id, reason, rating_before, rating_after)
    values (p_user_id, b.language_code, b.season_id, p_battle_id, 'battle', r.rating, after);

    update public.battle_players set score = p_score, correct_answers = p_correct, total_answers = p_answered,
      result = outcome, forfeited = forfeit, rating_before = r.rating, rating_after = after
    where battle_id = p_battle_id and slot = 1;
    update public.battle_players set score = bot_score, correct_answers = bot_correct,
      total_answers = bot_answered,
      result = case outcome when 'win' then 'loss' when 'loss' then 'win' else 'draw' end
    where battle_id = p_battle_id and slot = 2;
    update public.battles set status = case when forfeit then 'forfeited' else 'completed' end, ended_at = now()
    where id = p_battle_id;

    unlocked := public.evaluate_achievements(p_user_id);
  end if;

  select * into me from public.battle_players where battle_id = p_battle_id and slot = 1;
  select * into bot from public.battle_players where battle_id = p_battle_id and slot = 2;
  select status into b.status from public.battles where id = p_battle_id;
  return jsonb_build_object(
    'battle_id', p_battle_id,
    'status', b.status,
    'me', jsonb_build_object('score', me.score, 'correct', me.correct_answers, 'answered', me.total_answers,
                             'result', me.result, 'forfeited', me.forfeited,
                             'rating_before', me.rating_before, 'rating_after', me.rating_after,
                             'placed_before', (select pr.wins - (me.result = 'win')::int > 0
                                               from public.player_ratings pr
                                               where pr.user_id = p_user_id and pr.language_code = b.language_code)),
    'bot', jsonb_build_object('name', bot.bot_name, 'score', bot.score, 'correct', bot.correct_answers,
                              'answered', bot.total_answers, 'result', bot.result),
    'achievements', (select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title_es, 'icon', a.icon)
                                               order by a.position), '[]'::jsonb)
                     from public.achievements a where a.id = any(coalesce(unlocked, '{}'))));
end;
$$;

-- ---------- permisos: lo nuevo sólo lo llama el servidor de partidas ----------
revoke all on function public.bot_calibration_limit() from public, anon, authenticated;
revoke all on function public.bot_calibration_used(uuid, text) from public, anon, authenticated;
revoke all on function public.start_bot_battle_v2(uuid, text, uuid, text, text, integer, smallint, boolean) from public, anon, authenticated;
revoke all on function public.battle_settlement_context_v2(uuid, integer) from public, anon, authenticated;
revoke all on function public.settle_battle(uuid, text, jsonb) from public, anon, authenticated;
revoke all on function public.settle_bot_match(uuid, uuid, integer, integer, integer, boolean) from public, anon, authenticated;
grant execute on function public.bot_calibration_limit() to service_role;
grant execute on function public.bot_calibration_used(uuid, text) to service_role;
grant execute on function public.start_bot_battle_v2(uuid, text, uuid, text, text, integer, smallint, boolean) to service_role;
grant execute on function public.battle_settlement_context_v2(uuid, integer) to service_role;
grant execute on function public.settle_battle(uuid, text, jsonb) to service_role;
