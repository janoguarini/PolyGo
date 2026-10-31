-- Ranked v2 (shared/ranking.ts, shared/bots.ts, shared/wordRush.ts):
-- * Todos arrancan sin posicionar en 100 (Bronce III). Sin posicionar (0 victorias), perder o
--   empatar no mueve el rating; la primera victoria posiciona. K fijo 32 (sin colocación).
-- * Bots: curva de habilidad por tramos, empinada en los rangos bajos.
-- * Racha: correctas seguidas suman +10/+20/+30 desde 3/5/8; también el bot. Tope por respuesta
--   correcta: 180.
-- Sin sentencias destructivas: sólo create or replace y cambios de default.

alter table public.player_ratings alter column rating set default 100;
alter table public.player_ratings alter column peak_rating set default 100;

/** Alta: perfil, ajustes y rating inicial (antes: 20261029010416_core_profiles_ratings, con 1000). */
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, public_code) values (new.id, public.generate_public_code());
  insert into public.user_settings (user_id) values (new.id);
  insert into public.player_ratings (user_id, language_code) values (new.id, 'en');
  insert into public.rating_history (user_id, language_code, season_id, reason, rating_before, rating_after)
  select new.id, 'en', s.id, 'initial', 100, 100
  from (select 1) as one
  left join public.seasons s on s.status = 'active';
  return new;
end;
$$;

-- ---------- habilidad del bot (shared/bots.ts: BOT_CONFIG.skillCurve) ----------
create or replace function public.bot_skill(p_rating integer)
returns table (accuracy double precision, mean_ms double precision)
language sql
immutable
set search_path = ''
as $$
  select
    case when p_rating <= 100 then 0.5
         when p_rating >= 2200 then 0.97
         else s.acc0 + (s.acc1 - s.acc0) * (p_rating - s.r0)::double precision / (s.r1 - s.r0) end,
    case when p_rating <= 100 then 6500
         when p_rating >= 2200 then 1200
         else s.ms0 + (s.ms1 - s.ms0) * (p_rating - s.r0)::double precision / (s.r1 - s.r0) end
  from (values
    (100, 0.5::double precision, 6500::double precision, 400, 0.68::double precision, 4200::double precision),
    (400, 0.68, 4200, 1000, 0.82, 2700),
    (1000, 0.82, 2700, 1600, 0.91, 1800),
    (1600, 0.91, 1800, 2200, 0.97, 1200)
  ) as s (r0, acc0, ms0, r1, acc1, ms1)
  where (p_rating < 100 and s.r0 = 100)
     or (p_rating >= 2200 and s.r1 = 2200)
     or (p_rating >= s.r0 and p_rating < s.r1);
$$;

/** Bonus de racha (shared/wordRush.ts: streakBonus). p_streak cuenta la respuesta actual. */
create or replace function public.rush_streak_bonus(p_streak integer)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case when p_streak >= 8 then 30 when p_streak >= 5 then 20 when p_streak >= 3 then 10 else 0 end;
$$;

/**
 * ELO tras una partida (shared/ranking.ts: computeRatingChange). Sin posicionar sólo una victoria
 * lo mueve. p_mult = anti-farming contra el mismo rival.
 */
create or replace function public.ranked_rating_after(
  p_rating integer, p_opponent integer, p_placed boolean, p_score double precision, p_mult double precision)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case when not p_placed and p_score < 1 then p_rating
    else greatest(100, p_rating + floor(
      32 * p_mult * (p_score - 1 / (1 + power(10, (p_opponent - p_rating)::double precision / 400)))
      + 0.5)::int) end;
$$;

-- ---------- contra bots (antes: 20261030213841_local_bot_matches) ----------
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

    -- El bot juega su guion completo (siempre termina la partida).
    for move in select * from jsonb_array_elements(b.bot_script) loop
      elapsed := elapsed + (move ->> 'd')::int;
      exit when elapsed > 75000;
      bot_streak := case when (move ->> 'c')::boolean then bot_streak + 1 else 0 end;
      bot_score := greatest(0, bot_score + public.rush_points((move ->> 'c')::boolean, (move ->> 'd')::int)
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

-- ---------- entre personas (antes: 20261031002005_friend_challenges y 20261030221420_human_matches) ----------
create or replace function public.settle_human_match(p_battle_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  b public.battles;
  a public.battle_players;
  c public.battle_players;
  ra public.player_ratings;
  rc public.player_ratings;
  a_forfeit boolean;
  c_forfeit boolean;
  a_acc double precision;
  c_acc double precision;
  a_result text;
  c_result text;
  pair_count integer;
  mult double precision;
  a_before integer;
  c_before integer;
  a_after integer;
  c_after integer;
  achievements jsonb := '{}'::jsonb;
  unlocked text[];
  uid uuid;
begin
  select * into b from public.battles where id = p_battle_id for update;
  if b.id is null or b.has_bot then
    raise exception 'battle_not_found' using errcode = 'P0002';
  end if;
  select * into a from public.battle_players where battle_id = p_battle_id and slot = 1;
  select * into c from public.battle_players where battle_id = p_battle_id and slot = 2;

  if b.status = 'in_progress' then
    if (a.submitted_at is null or c.submitted_at is null)
       and now() < b.started_at + interval '105 seconds' then
      return jsonb_build_object('pending', true);
    end if;

    -- Quien no informó a tiempo abandonó (puntaje 0).
    a_forfeit := a.submitted_at is null or a.forfeited;
    c_forfeit := c.submitted_at is null or c.forfeited;
    if a.submitted_at is null then a.score := 0; a.correct_answers := 0; a.total_answers := 0; end if;
    if c.submitted_at is null then c.score := 0; c.correct_answers := 0; c.total_answers := 0; end if;

    -- shared/wordRush.ts: decideOutcomes.
    a_acc := case when a.total_answers = 0 then 0 else a.correct_answers::double precision / a.total_answers end;
    c_acc := case when c.total_answers = 0 then 0 else c.correct_answers::double precision / c.total_answers end;
    a_result := case
      when a_forfeit and c_forfeit then 'loss'
      when a_forfeit then 'loss'
      when c_forfeit then 'win'
      when a.score <> c.score then case when a.score > c.score then 'win' else 'loss' end
      when abs(a_acc - c_acc) > 1e-9 then case when a_acc > c_acc then 'win' else 'loss' end
      else 'draw' end;
    c_result := case
      when a_forfeit and c_forfeit then 'loss'
      when a_result = 'win' then 'loss'
      when a_result = 'loss' then 'win'
      else 'draw' end;

    a_before := a.rating_before;
    c_before := c.rating_before;
    a_after := a.rating_before;
    c_after := c.rating_before;

    if b.is_ranked then
      -- Anti-farming: partidas ranked liquidadas entre ambos en 24 h, contando ésta.
      select count(*) + 1 into pair_count from public.battles x
      where x.id <> p_battle_id and x.is_ranked and not x.has_bot
        and x.status in ('completed', 'forfeited') and x.ended_at > now() - interval '24 hours'
        and (select count(*) from public.battle_players y
             where y.battle_id = x.id and y.user_id in (a.user_id, c.user_id)) = 2;
      mult := case when pair_count >= 5 then 0 when pair_count >= 3 then 0.5 else 1 end;

      -- Bloqueo en orden fijo para no trabarse con otra liquidación.
      perform 1 from public.player_ratings
      where user_id in (a.user_id, c.user_id) and language_code = b.language_code
      order by user_id for update;
      select * into ra from public.player_ratings where user_id = a.user_id and language_code = b.language_code;
      select * into rc from public.player_ratings where user_id = c.user_id and language_code = b.language_code;
      a_before := ra.rating;
      c_before := rc.rating;

      a_after := public.ranked_rating_after(ra.rating, rc.rating, ra.wins > 0,
        case a_result when 'win' then 1 when 'draw' then 0.5 else 0 end, mult);
      c_after := public.ranked_rating_after(rc.rating, ra.rating, rc.wins > 0,
        case c_result when 'win' then 1 when 'draw' then 0.5 else 0 end, mult);

      update public.player_ratings p set
        rating = v.new_rating,
        peak_rating = greatest(p.peak_rating, v.new_rating),
        games_played = p.games_played + 1,
        wins = p.wins + (v.res = 'win')::int,
        losses = p.losses + (v.res = 'loss')::int,
        draws = p.draws + (v.res = 'draw')::int,
        win_streak = case when v.res = 'win' then p.win_streak + 1 else 0 end,
        best_win_streak = greatest(p.best_win_streak, case when v.res = 'win' then p.win_streak + 1 else 0 end)
      from (values (a.user_id, a_after, a_result), (c.user_id, c_after, c_result)) as v (user_id, new_rating, res)
      where p.user_id = v.user_id and p.language_code = b.language_code;

      insert into public.rating_history (user_id, language_code, season_id, battle_id, reason, rating_before, rating_after)
      values (a.user_id, b.language_code, b.season_id, p_battle_id, 'battle', ra.rating, a_after),
             (c.user_id, b.language_code, b.season_id, p_battle_id, 'battle', rc.rating, c_after);
    end if;

    update public.battle_players set score = a.score, correct_answers = a.correct_answers,
      total_answers = a.total_answers, result = a_result, forfeited = a_forfeit,
      rating_before = a_before, rating_after = a_after
    where battle_id = p_battle_id and slot = 1;
    update public.battle_players set score = c.score, correct_answers = c.correct_answers,
      total_answers = c.total_answers, result = c_result, forfeited = c_forfeit,
      rating_before = c_before, rating_after = c_after
    where battle_id = p_battle_id and slot = 2;
    update public.battles set status = case when a_forfeit or c_forfeit then 'forfeited' else 'completed' end,
      ended_at = now()
    where id = p_battle_id;

    if b.is_ranked then
      foreach uid in array array[a.user_id, c.user_id] loop
        unlocked := public.evaluate_achievements(uid);
        achievements := achievements || jsonb_build_object(uid::text, (
          select coalesce(jsonb_agg(jsonb_build_object('id', x.id, 'title', x.title_es, 'icon', x.icon)
                                    order by x.position), '[]'::jsonb)
          from public.achievements x where x.id = any(unlocked)));
      end loop;
    end if;
  end if;

  select status into b.status from public.battles where id = p_battle_id;
  return jsonb_build_object(
    'pending', false,
    'battle_id', p_battle_id,
    'status', b.status,
    'ranked', b.is_ranked,
    'achievements', achievements,
    'players', (select jsonb_agg(jsonb_build_object(
                  'slot', bp.slot, 'username', coalesce(p.username, 'Jugador eliminado'),
                  'score', bp.score, 'correct', bp.correct_answers, 'answered', bp.total_answers,
                  'result', bp.result, 'forfeited', bp.forfeited,
                  'rating_before', case when b.is_ranked then bp.rating_before end,
                  'rating_after', case when b.is_ranked then bp.rating_after end,
                  'placed_before', case when b.is_ranked then (
                    select pr.wins - (bp.result = 'win')::int > 0 from public.player_ratings pr
                    where pr.user_id = bp.user_id and pr.language_code = b.language_code) end) order by bp.slot)
                from public.battle_players bp left join public.profiles p on p.id = bp.user_id
                where bp.battle_id = p_battle_id));
end;
$$;

create or replace function public.finish_human_match(
  p_battle_id uuid, p_score integer, p_correct integer, p_answered integer, p_forfeit boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  b public.battles;
  me public.battle_players;
  forfeit boolean := coalesce(p_forfeit, false);
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into b from public.battles where id = p_battle_id;
  select * into me from public.battle_players where battle_id = p_battle_id and user_id = uid;
  if b.id is null or b.has_bot or me.battle_id is null then
    raise exception 'battle_not_found' using errcode = 'P0002';
  end if;

  if b.status = 'in_progress' and me.submitted_at is null then
    if not forfeit and now() < b.started_at + interval '70 seconds' then
      raise exception 'too_early' using errcode = '22023';
    end if;
    if p_answered is null or p_correct is null or p_score is null
       or p_answered not between 0 and coalesce(jsonb_array_length(b.questions), 40)
       or p_correct not between 0 and p_answered
       or p_score not between 0 and p_correct * 180 then
      if not forfeit then
        raise exception 'invalid_result' using errcode = '22023';
      end if;
      p_score := 0; p_correct := 0; p_answered := 0;
    end if;
    update public.battle_players set score = p_score, correct_answers = p_correct,
      total_answers = p_answered, forfeited = forfeit, submitted_at = now()
    where battle_id = p_battle_id and user_id = uid;
  end if;
  return public.settle_human_match(p_battle_id);
end;
$$;

-- ---------- logros (antes: 20261030173210_achievements_families) ----------
create or replace function public.achievement_metrics(p_user_id uuid)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'lessons_completed', (select count(*) from public.user_lesson_progress
                           where user_id = p_user_id and times_completed > 0),
    'perfect_lessons', (select count(*) from public.user_lesson_progress
                         where user_id = p_user_id and best_accuracy >= 1),
    'stars_earned', (public.lesson_star_totals(p_user_id) -> 'stars_earned'),
    'fast_answers', (select count(*) from public.exercise_attempts
                      where user_id = p_user_id and is_correct and is_first_try and response_ms < 2000),
    'words_seen', (select count(*) from public.user_word_progress
                    where user_id = p_user_id and seen_count > 0),
    'words_mastered', (select count(*) from public.user_word_progress
                        where user_id = p_user_id and stage >= (public.srs_config() ->> 'masteredStage')::int),
    'reviews_completed', (select count(*) from public.learning_sessions
                           where user_id = p_user_id and kind = 'review'),
    -- Racha más larga histórica: islas de días consecutivos (activity_date ya es fecha local).
    'best_streak_days', (select coalesce(max(len), 0) from (
                           select count(*) as len from (
                             select activity_date - (row_number() over (order by activity_date))::int as grp
                             from public.user_daily_activity where user_id = p_user_id
                           ) d group by grp
                         ) s),
    'goal_days', (select count(*) from public.user_daily_activity d
                   join public.profiles p on p.id = d.user_id
                   where d.user_id = p_user_id and d.seconds_spent >= p.daily_goal_minutes * 60),
    'games_played', (select coalesce(sum(games_played), 0) from public.player_ratings where user_id = p_user_id),
    'wins', (select coalesce(sum(wins), 0) from public.player_ratings where user_id = p_user_id),
    'best_win_streak', (select coalesce(max(best_win_streak), 0) from public.player_ratings where user_id = p_user_id),
    -- El rango cuenta recién al posicionarse (primera victoria): antes la app muestra "Sin posicionar".
    'peak_rating', (select coalesce(max(peak_rating), 0) from public.player_ratings
                    where user_id = p_user_id and wins > 0)
  );
$$;

revoke all on function public.rush_streak_bonus(integer) from public, anon, authenticated;
revoke all on function public.ranked_rating_after(integer, integer, boolean, double precision, double precision) from public, anon, authenticated;
revoke all on function public.settle_bot_match(uuid, uuid, integer, integer, integer, boolean) from public, anon, authenticated;
revoke all on function public.settle_human_match(uuid) from public, anon, authenticated;
revoke all on function public.finish_human_match(uuid, integer, integer, integer, boolean) from public, anon;
grant execute on function public.finish_human_match(uuid, integer, integer, integer, boolean) to authenticated;
