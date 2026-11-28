-- Rollback de supabase/migrations/20270110120000_ranked_shared_pool.sql: vuelve a los cuerpos de
-- 20261117120000_curriculum_isolation.sql (intersección por id de unidad, sin curso) y quita
-- rush_canonical_unit_id. No toca datos. LOCAL: no aplicado.

/**
 * Unidades cuyo vocabulario puede usar un jugador en Ranked con ese nivel de cliente:
 *   · idioma y nivel sin rutas: todas, como antes (decide words.is_published);
 *   · con rutas: publicada, de su ruta visible y desbloqueada para él.
 */
create or replace function public.rush_player_unit_ids(p_user uuid, p_language text, p_api smallint)
returns setof text
language sql
stable
set search_path = ''
as $$
  select u.id
  from public.curriculum_units u
  cross join lateral (
    select public.curriculum_route_for(p_user, u.language_code, u.level, coalesce(p_api, 0::smallint)) as route_id
  ) f
  where u.language_code = p_language
    and (f.route_id is null
         or (u.is_published
             and exists (select 1 from public.curriculum_route_units ru
                         where ru.route_id = f.route_id and ru.unit_id = u.id)
             and u.id in (select public.curriculum_unlocked_unit_ids(p_user, p_language))));
$$;

/**
 * Lo común a todos los jugadores humanos de una partida (p_players; los null son bots y no cuentan;
 * p_apis alineado, null = 0). Ordenado. null si no hay ningún jugador humano.
 */
create or replace function public.rush_common_unit_ids(p_language text, p_players uuid[],
                                                        p_apis smallint[] default null)
returns text[]
language sql
stable
set search_path = ''
as $$
  with players as (
    select p.user_id, min(coalesce(p.api, 0::smallint))::smallint as api
    from unnest(p_players, coalesce(p_apis, '{}'::smallint[])) as p(user_id, api)
    where p.user_id is not null
    group by p.user_id
  )
  select case when (select count(*) from players) = 0 then null else coalesce((
    select array_agg(x.unit_id order by x.unit_id)
    from (
      select r.unit_id
      from players pl
      cross join lateral public.rush_player_unit_ids(pl.user_id, p_language, pl.api) as r(unit_id)
      group by r.unit_id
      having count(*) = (select count(*) from players)
    ) x), '{}'::text[]) end;
$$;

/**
 * Lo que cualquier cliente puede representar sin saber quién juega: unidades sin rutas o de la ruta de
 * respaldo. Sólo para las firmas viejas de rush_questions, que ya no llama nadie.
 */
create or replace function public.rush_fallback_unit_ids(p_language text)
returns text[]
language sql
stable
set search_path = ''
as $$
  select coalesce(array_agg(u.id order by u.id), '{}'::text[])
  from public.curriculum_units u
  where u.language_code = p_language
    and (not exists (select 1 from public.curriculum_routes r
                     where r.language_code = u.language_code and r.level = u.level)
         or exists (select 1 from public.curriculum_routes r
                    join public.curriculum_route_units ru on ru.route_id = r.id and ru.unit_id = u.id
                    where r.language_code = u.language_code and r.level = u.level and r.fallback));
$$;

drop function if exists public.rush_canonical_unit_id(text);

revoke all on function public.rush_player_unit_ids(uuid, text, smallint) from public, anon, authenticated;
revoke all on function public.rush_fallback_unit_ids(text) from public, anon, authenticated;
revoke all on function public.rush_common_unit_ids(text, uuid[], smallint[]) from public, anon, authenticated;
grant execute on function public.rush_common_unit_ids(text, uuid[], smallint[]) to service_role;
