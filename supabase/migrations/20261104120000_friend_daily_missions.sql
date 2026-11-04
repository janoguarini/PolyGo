-- Los retos semanales de Amigos pasan a ser misiones diarias: mismo progreso (partidas, repasos,
-- amistosos con amigos), pero contado desde la medianoche del jugador y cobrable una vez por día.
-- Las funciones semanales quedan sin uso (no se borran: la app vieja todavía las llama).

/** Misiones diarias de Amigos (= FRIEND_DAILY_MISSIONS de shared/friendChallenges.ts). */
create or replace function public.friend_daily_config()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_array(
    jsonb_build_object('id', 'play_3', 'target', 3, 'reward', 10),
    jsonb_build_object('id', 'review_20', 'target', 20, 'reward', 10),
    jsonb_build_object('id', 'friendly_1', 'target', 1, 'reward', 15));
$$;

/** Inicio del día de hoy en la zona horaria del jugador. */
create or replace function public.local_day_start(p_time_zone text)
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select date_trunc('day', now() at time zone public.safe_time_zone(p_time_zone))
    at time zone public.safe_time_zone(p_time_zone);
$$;

/**
 * {date, ends_at, challenges: [{id, target, reward, progress, claimed, friends_done, friends}]}.
 * friends = hasta 5 amigos (con estadísticas visibles) que ya la completaron hoy.
 */
create or replace function public.get_friend_daily_missions(p_time_zone text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  day_start timestamptz := public.local_day_start(p_time_zone);
  day_ref text := to_char(now() at time zone public.safe_time_zone(p_time_zone), 'YYYY-MM-DD');
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  return jsonb_build_object(
    'date', day_ref,
    'ends_at', floor(extract(epoch from day_start + interval '1 day') * 1000)::bigint,
    'challenges', (
      select jsonb_agg(jsonb_build_object(
          'id', cfg ->> 'id',
          'target', (cfg ->> 'target')::int,
          'reward', (cfg ->> 'reward')::int,
          'progress', least(public.friend_challenge_progress(uid, cfg ->> 'id', day_start),
                            (cfg ->> 'target')::int),
          'claimed', exists (select 1 from public.poly_transactions t
                             where t.user_id = uid and t.reason = 'friend_challenge'
                               and t.ref = (cfg ->> 'id') || ':' || day_ref),
          'friends_done', done.total,
          'friends', done.sample) order by ord)
      from jsonb_array_elements(public.friend_daily_config()) with ordinality as x (cfg, ord)
      cross join lateral (
        select count(*)::int as total,
          coalesce(jsonb_path_query_array(
            jsonb_agg(jsonb_build_object('user_id', p.id, 'username', p.username,
              'avatar_id', p.avatar_id, 'avatar_path', p.avatar_path) order by p.username),
            '$[0 to 4]'), '[]'::jsonb) as sample
        from public.friend_ids(uid) fr
        join public.profiles p on p.id = fr.friend_id
        where fr.open_stats
          and public.friend_challenge_progress(fr.friend_id, cfg ->> 'id', day_start)
              >= (cfg ->> 'target')::int
      ) done));
end;
$$;

/** Cobra una misión diaria completada hoy. Devuelve {polys, balance}. */
create or replace function public.claim_friend_daily_mission(p_id text, p_time_zone text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  cfg jsonb;
  credited integer;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select c into cfg from jsonb_array_elements(public.friend_daily_config()) c where c ->> 'id' = p_id;
  if cfg is null then
    raise exception 'challenge_not_found' using errcode = 'P0002';
  end if;
  if public.friend_challenge_progress(uid, p_id, public.local_day_start(p_time_zone))
     < (cfg ->> 'target')::int then
    raise exception 'challenge_incomplete' using errcode = '22023';
  end if;
  credited := public.poly_credit(uid, (cfg ->> 'reward')::int, 'friend_challenge',
    p_id || ':' || to_char(now() at time zone public.safe_time_zone(p_time_zone), 'YYYY-MM-DD'));
  if credited = 0 then
    raise exception 'already_claimed' using errcode = '22023';
  end if;
  return jsonb_build_object('polys', credited,
    'balance', (select balance from public.poly_wallets where user_id = uid));
end;
$$;

revoke all on function public.friend_daily_config() from public, anon;
grant execute on function public.friend_daily_config() to authenticated;
revoke all on function public.local_day_start(text) from public, anon, authenticated;
revoke all on function public.get_friend_daily_missions(text) from public, anon;
grant execute on function public.get_friend_daily_missions(text) to authenticated;
revoke all on function public.claim_friend_daily_mission(text, text) from public, anon;
grant execute on function public.claim_friend_daily_mission(text, text) to authenticated;
