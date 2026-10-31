-- Clasificación global (todos los idiomas) y por idioma, con el puesto propio en el mundo.
-- Global = el mejor rating de cada jugador entre sus idiomas. Sólo entran los posicionados
-- (ganaron alguna ranked) con onboarding completo. El orden es estable: rating, partidas, id.

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
  with best as (
    select distinct on (r.user_id)
      r.user_id, r.language_code, r.rating, r.games_played, r.wins
    from public.player_ratings r
    join public.profiles p on p.id = r.user_id
    where r.wins > 0
      and p.username is not null
      and (p_language_code is null or r.language_code = p_language_code)
    order by r.user_id, r.rating desc, r.games_played desc
  )
  select b.user_id, b.language_code, b.rating, b.games_played, b.wins,
    row_number() over (order by b.rating desc, b.games_played desc, b.user_id)
  from best b;
$$;

create or replace function public.get_leaderboard(
  p_language_code text default null,
  p_limit integer default 100
)
returns table (
  user_id uuid,
  username text,
  avatar_id text,
  avatar_path text,
  region text,
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
  select l.user_id, p.username, p.avatar_id, p.avatar_path, p.region,
    l.language_code, l.rating, l.games_played, l.wins, l."position"
  from public.leaderboard_ranked(p_language_code) l
  join public.profiles p on p.id = l.user_id
  where (select auth.uid()) is not null
  order by l."position"
  limit least(greatest(coalesce(p_limit, 100), 1), 200);
$$;

-- Puesto propio y total de posicionados; position es null si todavía no estás posicionado.
create or replace function public.get_my_leaderboard_position(p_language_code text default null)
returns table ("position" bigint, total bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select l."position" from public.leaderboard_ranked(p_language_code) l
      where l.user_id = (select auth.uid())),
    (select count(*) from public.leaderboard_ranked(p_language_code))
  where (select auth.uid()) is not null;
$$;

revoke all on function public.leaderboard_ranked(text) from public, anon, authenticated;
revoke all on function public.get_leaderboard(text, integer) from public, anon;
grant execute on function public.get_leaderboard(text, integer) to authenticated;
revoke all on function public.get_my_leaderboard_position(text) from public, anon;
grant execute on function public.get_my_leaderboard_position(text) to authenticated;
