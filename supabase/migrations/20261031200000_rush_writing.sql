-- =====================================================================
-- Ranked desde Oro: una de cada tres preguntas pide escribir la palabra en inglés (sin opciones).
-- Espejo de shared/wordRush.ts (WRITING, withWriting, pointsElapsed). En esas preguntas el bonus
-- de velocidad tiene el doble de margen y el bot tarda el doble. En partidas entre personas manda
-- el rating más bajo (igual que las palabras por nivel).
-- =====================================================================

create or replace function public.rush_writing(p_rating integer)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(p_rating, 0) >= 700;
$$;

create or replace function public.rush_questions(p_language text, p_count integer, p_rating integer)
returns jsonb
language plpgsql
volatile
set search_path = ''
as $$
declare
  deck text[];
  word record;
  previous text;
  direction text;
  correct text;
  options text[];
  result jsonb := '[]'::jsonb;
  i integer := 0;
  levels text[] := public.rush_levels(p_rating);
  writing boolean := public.rush_writing(p_rating);
begin
  -- Sin palabras suficientes de esos niveles (no debería pasar): todas las publicadas.
  if (select count(distinct lower(trim(w.text))) from public.words w
      join public.curriculum_units u on u.id = w.unit_id
      where w.language_code = p_language and w.is_published and u.level = any (levels)) < 4 then
    levels := array['A1', 'A2'];
  end if;
  while i < p_count loop
    if deck is null or cardinality(deck) = 0 then
      select array_agg(id order by random()) into deck from (
        select distinct on (lower(trim(w.text))) w.id from public.words w
        join public.curriculum_units u on u.id = w.unit_id
        where w.language_code = p_language and w.is_published and u.level = any (levels)
        order by lower(trim(w.text)), w.id) w;
      if deck is null or cardinality(deck) < 4 then
        raise exception 'not_enough_words' using errcode = '22023';
      end if;
      -- No repetir la misma palabra dos veces seguidas al rearmar el mazo.
      if deck[1] = previous then deck := deck[2:] || deck[1]; end if;
    end if;
    select id, text, public.rush_label(translation_es) as translation_es into word
    from public.words where id = deck[1];
    deck := deck[2:];
    previous := word.id;

    -- Desde Oro, una de cada tres se escribe en inglés: sin distractores (la única opción es la respuesta).
    if writing and i % 3 = 2 then
      result := result || jsonb_build_object(
        'index', i,
        'wordId', word.id,
        'direction', 'es_en',
        'prompt', word.translation_es,
        'options', jsonb_build_array(word.text),
        'correctOption', 0,
        'write', true);
      i := i + 1;
      continue;
    end if;

    direction := case when random() < 0.5 then 'en_es' else 'es_en' end;
    correct := case when direction = 'en_es' then word.translation_es else word.text end;
    -- Distractores: ni el mismo texto ni la misma traducción (dos opciones válidas), sin repetir.
    select array_agg(v order by random()) into options from (
      select v from (
        select distinct on (lower(trim(v))) v from (
          select case when direction = 'en_es' then public.rush_label(w.translation_es) else w.text end as v
          from public.words w
          join public.curriculum_units u on u.id = w.unit_id
          where w.language_code = p_language and w.is_published and w.id <> word.id
            and u.level = any (levels)
            and lower(trim(w.text)) <> lower(trim(word.text))
            and lower(public.rush_label(w.translation_es)) <> lower(word.translation_es)
        ) c
        where lower(trim(v)) <> lower(trim(correct))
        order by lower(trim(v)), random()
      ) d
      order by random()
      limit 3
    ) e;
    options := options || correct;
    select array_agg(o order by random()) into options from unnest(options) o;

    result := result || jsonb_build_object(
      'index', i,
      'wordId', word.id,
      'direction', direction,
      'prompt', case when direction = 'en_es' then word.text else word.translation_es end,
      'options', to_jsonb(options),
      'correctOption', array_position(options, correct) - 1);
    i := i + 1;
  end loop;
  return result;
end;
$$;

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
  -- Desde Oro el bot también tarda más en las preguntas para escribir (una de cada tres).
  if public.rush_writing(r.rating) then
    select jsonb_agg(case when (t.n - 1) % 3 = 2
                          then jsonb_set(t.m, '{d}', to_jsonb((t.m ->> 'd')::int * 2))
                          else t.m end order by t.n)
    into script
    from jsonb_array_elements(script) with ordinality as t(m, n);
  end if;

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
    'script', script,
    'writing', public.rush_writing(r.rating));
end;
$$;

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
    -- (desde Oro, rating con el que empezó la partida) el bonus de velocidad tiene el doble de margen.
    writing := public.rush_writing(me.rating_before);
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

revoke all on function public.rush_writing(integer) from public, anon;
grant execute on function public.rush_writing(integer) to authenticated;
revoke all on function public.rush_questions(text, integer, integer) from public, anon, authenticated;
revoke all on function public.settle_bot_match(uuid, uuid, integer, integer, integer, boolean) from public, anon, authenticated;
revoke all on function public.start_bot_match() from public, anon;
grant execute on function public.start_bot_match() to authenticated;
