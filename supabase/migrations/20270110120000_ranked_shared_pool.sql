-- =====================================================================
-- Ranked compartido entre cursos del mismo idioma (docs/RANKED_SHARED_POOL.md). 2026-11-27.
-- LOCAL: NO APLICADA EN PRODUCCIÓN.
--
-- Quien estudia inglés desde español (en-from-es) y quien lo estudia desde portugués (en-from-pt) juegan
-- en la misma liga, con el mismo ELO de inglés y EXACTAMENTE el mismo inglés. Hasta acá las unidades
-- comunes de una partida eran la intersección de ids de unidad (rush_common_unit_ids): entre cursos no
-- se cruzan nunca ('a1-u03' ≠ 'ept-a1-u03').
--
-- Cambios (sólo funciones; misma firma y mismos permisos):
--   1. rush_canonical_unit_id(unidad): la unidad del curso POR DEFECTO del idioma con el mismo nivel y la
--      misma posición («posición curricular»). Los cursos localizados (content/en-src/flat.ts) se arman
--      unidad por unidad del curso por defecto: ept-a1-u03 ↔ a1-u03. Para una unidad del curso por
--      defecto devuelve la misma unidad.
--   2. rush_player_unit_ids: sólo las unidades del curso del jugador en ese idioma (user_course_for).
--      Las rutas, como en toda la capa de visibilidad (20270108120000), se aplican sólo al curso por
--      defecto; un curso sin rutas se comporta como un nivel sin rutas (decide words.is_published).
--      Para quien estudia el curso por defecto (todos los cursos de siempre) devuelve lo mismo que
--      antes en todo lo publicado.
--   3. rush_common_unit_ids: cada unidad de cada jugador se lleva a su unidad canónica y se intersecta
--      ahí. Devuelve ids del curso por defecto: el servidor arma la partida con ese contenido y cada
--      asiento ve las traducciones de su propio curso. Dos jugadores del curso por defecto: igual que
--      antes (la unidad canónica es la misma unidad).
--   4. rush_fallback_unit_ids: sólo unidades del curso por defecto (las firmas viejas de rush_questions,
--      que ya no llama nadie, nunca mezclan cursos).
--   rush_my_unit_ids (partida contra bots en el teléfono) no cambia de cuerpo: devuelve las unidades del
--   curso propio, que son las que la app puede leer (RLS por curso), así juega con sus traducciones.
--
-- No toca tablas ni datos. Idempotente. Rollback: supabase/rollback/20270110120000_ranked_shared_pool.down.sql
-- (los cuerpos de 20261117120000_curriculum_isolation). Pruebas: supabase/tests/rankedSharedPool.test.mjs.
-- =====================================================================

/**
 * Unidad canónica de una unidad: la del curso por defecto de su idioma con el mismo nivel y posición.
 * null si la unidad no existe o su curso no tiene equivalente en el curso por defecto.
 */
create or replace function public.rush_canonical_unit_id(p_unit text)
returns text
language sql
stable
set search_path = ''
as $$
  select d.id
  from public.curriculum_units u
  join public.courses dc on dc.target_language = u.language_code and dc.is_default
  join public.curriculum_units d
    on d.course_code = dc.code and d.level = u.level and d.position = u.position
  where u.id = p_unit;
$$;

/**
 * Como en 20261117120000_curriculum_isolation, sólo con las unidades del curso del jugador en ese
 * idioma; las rutas, sólo en el curso por defecto (como curriculum_unit_visible_for):
 *   · curso por defecto, idioma y nivel sin rutas: todas (decide words.is_published);
 *   · curso por defecto con rutas: publicada, de su ruta visible y desbloqueada para él;
 *   · otro curso (sin rutas): todas las de ese curso.
 */
create or replace function public.rush_player_unit_ids(p_user uuid, p_language text, p_api smallint)
returns setof text
language sql
stable
set search_path = ''
as $$
  with course as materialized (select public.user_course_for(p_user, p_language) as code)
  select u.id
  from public.curriculum_units u
  join public.courses c on c.code = u.course_code
  cross join lateral (
    select case when c.is_default
                then public.curriculum_route_for(p_user, u.language_code, u.level, coalesce(p_api, 0::smallint))
           end as route_id
  ) f
  where u.language_code = p_language
    and u.course_code = (select code from course)
    and (f.route_id is null
         or (u.is_published
             and exists (select 1 from public.curriculum_route_units ru
                         where ru.route_id = f.route_id and ru.unit_id = u.id)
             and u.id in (select public.curriculum_unlocked_unit_ids(p_user, p_language))));
$$;

/**
 * Lo común a todos los jugadores humanos de una partida (p_players; los null son bots y no cuentan;
 * p_apis alineado, null = 0), en unidades CANÓNICAS (del curso por defecto del idioma). Ordenado. null
 * si no hay ningún jugador humano.
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
      select m.unit_id
      from players pl
      cross join lateral public.rush_player_unit_ids(pl.user_id, p_language, pl.api) as r(unit_id)
      cross join lateral (select public.rush_canonical_unit_id(r.unit_id) as unit_id) m
      where m.unit_id is not null
      group by m.unit_id
      having count(distinct pl.user_id) = (select count(*) from players)
    ) x), '{}'::text[]) end;
$$;

/** Como en 20261117120000_curriculum_isolation, sólo con unidades del curso por defecto del idioma. */
create or replace function public.rush_fallback_unit_ids(p_language text)
returns text[]
language sql
stable
set search_path = ''
as $$
  select coalesce(array_agg(u.id order by u.id), '{}'::text[])
  from public.curriculum_units u
  join public.courses c on c.code = u.course_code and c.is_default
  where u.language_code = p_language
    and (not exists (select 1 from public.curriculum_routes r
                     where r.language_code = u.language_code and r.level = u.level)
         or exists (select 1 from public.curriculum_routes r
                    join public.curriculum_route_units ru on ru.route_id = r.id and ru.unit_id = u.id
                    where r.language_code = u.language_code and r.level = u.level and r.fallback));
$$;

-- Permisos: los de siempre (create or replace los conserva; se repiten por si la función es nueva).
revoke all on function public.rush_canonical_unit_id(text) from public, anon, authenticated;
grant execute on function public.rush_canonical_unit_id(text) to service_role;
revoke all on function public.rush_player_unit_ids(uuid, text, smallint) from public, anon, authenticated;
revoke all on function public.rush_fallback_unit_ids(text) from public, anon, authenticated;
revoke all on function public.rush_common_unit_ids(text, uuid[], smallint[]) from public, anon, authenticated;
grant execute on function public.rush_common_unit_ids(text, uuid[], smallint[]) to service_role;
