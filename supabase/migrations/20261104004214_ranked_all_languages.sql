-- =====================================================================
-- Ranked en todos los idiomas con contenido (italiano, portugués, chino) y clasificación global
-- como suma de los ratings por idioma.
--
-- - languages.ranked_available = true en it / pt / zh (espejo de shared/languages.ts). Quien ya
--   tiene uno de esos idiomas como idioma actual recibe su rating inicial (100, sin posicionar).
-- - Preguntas para escribir (desde Oro): en chino no hay, porque no se piden caracteres
--   (rush_writing_for = espejo de writingEnabled en shared/wordRush.ts).
-- - Global = suma de los ratings de los idiomas en los que el jugador está posicionado (ganó al
--   menos una ranked); partidas y victorias también se suman. Por idioma, igual que antes.
-- - get_my_leaderboard_entry: puesto, total y el rating que se muestra en ese alcance.
-- =====================================================================

update public.languages set ranked_available = true where code in ('it', 'pt', 'zh');

with created as (
  insert into public.player_ratings (user_id, language_code)
  select p.id, p.target_language from public.profiles p
  where p.target_language in ('it', 'pt', 'zh') and p.onboarding_completed_at is not null
  on conflict do nothing
  returning user_id, language_code
)
insert into public.rating_history (user_id, language_code, season_id, reason, rating_before, rating_after)
select c.user_id, c.language_code, s.id, 'initial', 100, 100
from created c
left join public.seasons s on s.status = 'active';

create or replace function public.rush_writing_for(p_rating integer, p_language text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select public.rush_writing(p_rating) and coalesce(p_language, '') <> 'zh';
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
  writing boolean := public.rush_writing_for(p_rating, p_language);
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

    -- Desde Oro, una de cada tres se escribe en el idioma (en chino nunca: no se escriben caracteres): sin distractores (la única opción es la respuesta).
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
  if public.rush_writing_for(r.rating, prof.target_language) then
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
    'writing', public.rush_writing_for(r.rating, prof.target_language));
end;
$$;

create or replace function public.leaderboard_ranked(p_language_code text)
returns table (
  user_id uuid,
  language_code text,
  rating integer,
  games_played integer,
  wins integer,
  "position" bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  with placed as (
    select r.user_id, r.language_code, r.rating, r.games_played, r.wins
    from public.player_ratings r
    join public.profiles p on p.id = r.user_id
    where r.wins > 0
      and p.username is not null
      and (p_language_code is null or r.language_code = p_language_code)
  ),
  total as (
    -- Por idioma hay una sola fila por jugador; en la global se suman sus idiomas.
    select pl.user_id,
      case when p_language_code is null then null else min(pl.language_code) end as language_code,
      sum(pl.rating)::integer as rating,
      sum(pl.games_played)::integer as games_played,
      sum(pl.wins)::integer as wins
    from placed pl
    group by pl.user_id
  )
  select t.user_id, t.language_code, t.rating, t.games_played, t.wins,
    row_number() over (order by t.rating desc, t.games_played desc, t.user_id)
  from total t;
$$;

-- Puesto propio, total de posicionados y el rating de ese alcance (null = sin posicionar).
create or replace function public.get_my_leaderboard_entry(p_language_code text default null)
returns table ("position" bigint, total bigint, rating integer, games_played integer, wins integer)
language sql
stable
security definer
set search_path = ''
as $$
  select me."position", (select count(*) from public.leaderboard_ranked(p_language_code)),
    me.rating, me.games_played, me.wins
  from (select (select auth.uid()) as uid) u
  left join public.leaderboard_ranked(p_language_code) me on me.user_id = u.uid
  where u.uid is not null;
$$;

revoke all on function public.rush_writing_for(integer, text) from public, anon;
grant execute on function public.rush_writing_for(integer, text) to authenticated;
revoke all on function public.rush_questions(text, integer, integer) from public, anon, authenticated;
revoke all on function public.start_bot_match() from public, anon;
grant execute on function public.start_bot_match() to authenticated;
revoke all on function public.leaderboard_ranked(text) from public, anon, authenticated;
revoke all on function public.get_my_leaderboard_entry(text) from public, anon;
grant execute on function public.get_my_leaderboard_entry(text) to authenticated;
