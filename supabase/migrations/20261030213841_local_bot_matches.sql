-- Ranked contra bots SIN servidor de partidas: la partida corre en el teléfono y la base decide lo
-- que importa. start_bot_match elige el bot y genera todas sus jugadas (el teléfono sólo las
-- reproduce: no puede cambiar el resultado del bot); finish_bot_match valida el puntaje del jugador,
-- recalcula el del bot desde ese guion, decide el resultado y liquida el ELO.
-- Reglas y números: shared/bots.ts, shared/wordRush.ts y shared/ranking.ts (los tests comparan).

alter table public.battles add column bot_script jsonb;

-- ---------- habilidad del bot (shared/bots.ts: botSkill) ----------
create or replace function public.bot_skill(p_rating integer)
returns table (accuracy double precision, mean_ms double precision)
language sql
immutable
set search_path = ''
as $$
  select 0.55 + (0.97 - 0.55) * t, 5000 + (1300 - 5000) * t
  from (select least(1.0, greatest(0.0, (p_rating - 600)::double precision / (1900 - 600))) as t) x;
$$;

/** Jugadas del bot para 75 s: [{d: ms desde la anterior, c: acierta}] (shared/bots.ts: botMove). */
create or replace function public.bot_script(p_rating integer)
returns jsonb
language plpgsql
volatile
set search_path = ''
as $$
declare
  skill record;
  moves jsonb := '[]'::jsonb;
  elapsed integer := 0;
  delay integer;
  gauss double precision;
begin
  select * into skill from public.bot_skill(p_rating);
  loop
    -- Normal estándar (Box-Muller) → tiempo log-normal alrededor de la media, acotado.
    gauss := sqrt(-2 * ln(greatest(random(), 1e-9))) * cos(2 * pi() * random());
    delay := least(12000, greatest(600, floor(skill.mean_ms * exp(0.35 * gauss) + 0.5)::int));
    elapsed := elapsed + delay;
    exit when elapsed > 75000;
    moves := moves || jsonb_build_object('d', delay, 'c', random() < skill.accuracy);
  end loop;
  return moves;
end;
$$;

/** Puntos de una respuesta (shared/wordRush.ts: answerPoints; Math.round = floor(x + 0.5)). */
create or replace function public.rush_points(p_correct boolean, p_elapsed_ms integer)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case when p_correct
    then 100 + floor(50 * greatest(0.0, 1 - greatest(0, p_elapsed_ms)::double precision / 5000) + 0.5)::int
    else -50 end;
$$;

/** ELO tras una partida (shared/ranking.ts: computeRatingChange, sin rival repetido). */
create or replace function public.rating_after(p_rating integer, p_opponent integer, p_games integer, p_score double precision)
returns integer
language sql
immutable
set search_path = ''
as $$
  select greatest(100, p_rating + floor(
    (case when p_games < 5 then 48 else 32 end)
    * (p_score - 1 / (1 + power(10, (p_opponent - p_rating)::double precision / 400)))
    + 0.5)::int);
$$;

-- ---------- liquidación ----------
/**
 * Cierra una partida contra bot del usuario. p_forfeit = abandono (pierde). Idempotente: si ya
 * estaba cerrada devuelve el resultado guardado. Uso interno (start y finish).
 */
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
  outcome text;
  after integer;
  forfeit boolean := coalesce(p_forfeit, false);
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
    -- Un puntaje imposible no se acepta (máximo 150 por respuesta correcta).
    if p_answered is null or p_correct is null or p_score is null
       or p_answered not between 0 and 200 or p_correct not between 0 and p_answered
       or p_score not between 0 and p_correct * 150 then
      if not forfeit then
        raise exception 'invalid_result' using errcode = '22023';
      end if;
      p_score := 0; p_correct := 0; p_answered := 0;
    end if;

    -- El bot juega su guion completo (siempre termina la partida).
    for move in select * from jsonb_array_elements(b.bot_script) loop
      elapsed := elapsed + (move ->> 'd')::int;
      exit when elapsed > 75000;
      bot_score := greatest(0, bot_score + public.rush_points((move ->> 'c')::boolean, (move ->> 'd')::int));
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
    after := public.rating_after(r.rating, bot.rating_before, r.games_played,
                                 case outcome when 'win' then 1 when 'draw' then 0.5 else 0 end);

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
                             'rating_before', me.rating_before, 'rating_after', me.rating_after),
    'bot', jsonb_build_object('name', bot.bot_name, 'score', bot.score, 'correct', bot.correct_answers,
                              'answered', bot.total_answers, 'result', bot.result),
    'achievements', (select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title_es, 'icon', a.icon)
                                               order by a.position), '[]'::jsonb)
                     from public.achievements a where a.id = any(coalesce(unlocked, '{}'))));
end;
$$;

-- ---------- API para la app ----------
/**
 * Empieza una partida ranked contra un bot a la altura del jugador. Antes cierra como abandono
 * cualquier partida suya que haya quedado abierta (cerrar la app para no perder no sirve).
 */
create or replace function public.start_bot_match()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  prof public.profiles;
  r public.player_ratings;
  open_id uuid;
  today_count integer;
  names text[] := array['Kiko','Luna','Nico','Maia','Tomi','Sol','Bruno','Pía','Lolo','Vera','Fede','Cami','Rocco','Juli','Teo','Abril'];
  avatars text[] := array['bolt','crown','flame'];
  bot_name text;
  bot_avatar text;
  bot_rating integer;
  script jsonb;
  new_id uuid := gen_random_uuid();
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into prof from public.profiles where id = uid;
  if prof.username is null or prof.onboarding_completed_at is null then
    raise exception 'onboarding_required' using errcode = '22023';
  end if;

  for open_id in
    select b.id from public.battles b
    join public.battle_players bp on bp.battle_id = b.id and bp.slot = 1
    where bp.user_id = uid and b.has_bot and b.status = 'in_progress'
  loop
    perform public.settle_bot_match(open_id, uid, 0, 0, 0, true);
  end loop;

  select count(*) into today_count from public.battles b
  join public.battle_players bp on bp.battle_id = b.id and bp.slot = 1
  where bp.user_id = uid and b.has_bot and b.started_at > now() - interval '1 day';
  if today_count >= 100 then
    raise exception 'match_rate_limited' using errcode = '54000';
  end if;

  select * into r from public.player_ratings where user_id = uid and language_code = prof.target_language;
  if r.user_id is null then
    raise exception 'language_unavailable' using errcode = '22023';
  end if;

  bot_name := names[1 + floor(random() * array_length(names, 1))::int];
  bot_avatar := avatars[1 + floor(random() * array_length(avatars, 1))::int];
  bot_rating := greatest(100, r.rating + floor((random() * 2 - 1) * 40 + 0.5)::int);
  script := public.bot_script(bot_rating);

  insert into public.battles (id, language_code, season_id, mode, is_ranked, status, protocol_version, started_at, has_bot, bot_script)
  select new_id, prof.target_language, s.id, 'word_rush', true, 'in_progress', 1, now(), true, script
  from (select 1) as one
  left join public.seasons s on s.status = 'active';

  insert into public.battle_players (battle_id, slot, user_id, rating_before)
  values (new_id, 1, uid, r.rating);
  insert into public.battle_players (battle_id, slot, user_id, rating_before, bot_name, bot_avatar_id)
  values (new_id, 2, null, bot_rating, bot_name, bot_avatar);

  return jsonb_build_object(
    'battle_id', new_id,
    'me', jsonb_build_object('rating', r.rating, 'games_played', r.games_played),
    'bot', jsonb_build_object('name', bot_name, 'avatar_id', bot_avatar, 'rating', bot_rating),
    'script', script);
end;
$$;

/** Termina la partida: valida el puntaje, juega el guion del bot y liquida el ELO. */
create or replace function public.finish_bot_match(
  p_battle_id uuid, p_score integer, p_correct integer, p_answered integer, p_forfeit boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  return public.settle_bot_match(p_battle_id, auth.uid(), p_score, p_correct, p_answered, p_forfeit);
end;
$$;

revoke all on function public.bot_skill(integer) from public, anon, authenticated;
revoke all on function public.bot_script(integer) from public, anon, authenticated;
revoke all on function public.rush_points(boolean, integer) from public, anon, authenticated;
revoke all on function public.rating_after(integer, integer, integer, double precision) from public, anon, authenticated;
revoke all on function public.settle_bot_match(uuid, uuid, integer, integer, integer, boolean) from public, anon, authenticated;
revoke all on function public.start_bot_match() from public, anon;
grant execute on function public.start_bot_match() to authenticated;
revoke all on function public.finish_bot_match(uuid, integer, integer, integer, boolean) from public, anon;
grant execute on function public.finish_bot_match(uuid, integer, integer, integer, boolean) to authenticated;
