-- =====================================================================
-- Idiomas de interfaz pt-BR e it (además de es y en). NO APLICADA EN PRODUCCIÓN.
--
-- La app ya puede mostrarse en portugués de Brasil e italiano (src/i18n/index.ts). Hasta esta
-- migración la base sólo aceptaba 'es' / 'en' en profiles.interface_language, set_interface_language
-- y complete_onboarding_v2. Esta migración:
--   1. amplía el CHECK de profiles.interface_language a ('es', 'en', 'pt-BR', 'it');
--   2. vuelve a crear set_interface_language y complete_onboarding_v2 con la lista nueva (cuerpos
--      idénticos a 20261223120000_course_model salvo esa lista);
--   3. claim_battle_invite_push devuelve además el idioma de interfaz del invitado, para que
--      notify-battle-invite escriba el aviso en ese idioma (la Edge Function anterior lo ignora).
--
-- Compatibilidad: los valores existentes ('es', 'en', null) siguen siendo válidos y no se tocan. Las
-- builds viejas sólo mandan 'es' / 'en'. Rollback: supabase/rollback/20270103120000_interface_languages_pt_it.down.sql
-- =====================================================================


-- 1. CHECK de la columna (el nombre lo puso Postgres al crearla: se busca por definición).
do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    where con.conrelid = 'public.profiles'::regclass
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%interface_language%'
  loop
    execute format('alter table public.profiles drop constraint %I', c.conname);
  end loop;
end;
$$;
alter table public.profiles
  add constraint profiles_interface_language_check
  check (interface_language in ('es', 'en', 'pt-BR', 'it'));

-- 2. RPC que validan el idioma.
create or replace function public.set_interface_language(p_language text)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  result public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_language is null or p_language not in ('es', 'en', 'pt-BR', 'it') then
    raise exception 'interface_language_invalid' using errcode = '22023';
  end if;
  update public.profiles set interface_language = p_language
  where id = uid
  returning * into result;
  if result.id is null then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;
  return result;
end;
$$;

create or replace function public.complete_onboarding_v2(
  p_username text,
  p_avatar_id text,
  p_course_code text,
  p_start_level text,
  p_daily_goal_minutes smallint,
  p_interface_language text,
  p_placement_level text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  normalized text := lower(trim(p_username));
  course public.courses;
  result public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into course from public.courses where code = p_course_code;
  if not found or not exists (
    select 1 from public.languages
    where code = course.target_language and content_status = 'available'
  ) then
    raise exception 'course_unavailable' using errcode = '22023';
  end if;
  if not exists (select 1 from public.curriculum_units
                 where language_code = course.target_language and level = p_start_level
                   and is_published) then
    raise exception 'level_unavailable' using errcode = '22023';
  end if;
  if p_interface_language is null or p_interface_language not in ('es', 'en', 'pt-BR', 'it') then
    raise exception 'interface_language_invalid' using errcode = '22023';
  end if;
  if p_placement_level is not null
     and p_placement_level not in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2') then
    raise exception 'placement_level_invalid' using errcode = '22023';
  end if;
  if exists (select 1 from public.profiles where username = normalized and id <> uid) then
    raise exception 'username_taken' using errcode = '23505';
  end if;

  update public.profiles set
    username = normalized,
    display_name = coalesce(display_name, normalized),
    avatar_id = p_avatar_id,
    active_course_code = course.code,
    interface_language = p_interface_language,
    start_level = case when p_start_level in ('A1', 'A2') then p_start_level else start_level end,
    daily_goal_minutes = p_daily_goal_minutes,
    onboarding_completed_at = coalesce(onboarding_completed_at, now())
  where id = uid
  returning * into result;
  if result.id is null then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;

  insert into public.user_courses (
    user_id, course_code, start_level, placement_level, placement_completed_at, last_selected_at
  ) values (
    uid, course.code, p_start_level, p_placement_level,
    case when p_placement_level is null then null else now() end, now()
  )
  on conflict (user_id, course_code) do update set
    start_level = excluded.start_level,
    placement_level = coalesce(excluded.placement_level, public.user_courses.placement_level),
    placement_completed_at = coalesce(excluded.placement_completed_at,
                                      public.user_courses.placement_completed_at),
    last_selected_at = now();

  if exists (select 1 from public.languages
             where code = course.target_language and ranked_available)
     and not exists (select 1 from public.player_ratings
                     where user_id = uid and language_code = course.target_language) then
    insert into public.player_ratings (user_id, language_code) values (uid, course.target_language);
    insert into public.rating_history (user_id, language_code, season_id, reason, rating_before, rating_after)
    select uid, course.target_language, s.id, 'initial', 100, 100
    from (select 1) as one
    left join public.seasons s on s.status = 'active';
  end if;
  return result;
end;
$$;

-- 3. Aviso de desafío: además, el idioma de interfaz del invitado (null = no lo eligió).
create or replace function public.claim_battle_invite_push(p_host uuid, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  c public.friend_challenges;
begin
  update public.friend_challenges set notified_at = now()
  where code = upper(trim(p_code)) and host_id = p_host and notified_at is null
    and invitee_id is not null and battle_id is null and not cancelled and expires_at > now()
  returning * into c;
  if c.code is null or public.is_blocked_between(c.host_id, c.invitee_id)
     or not coalesce((select s.notify_challenges from public.user_settings s
                      where s.user_id = c.invitee_id), true) then
    return jsonb_build_object('tokens', '[]'::jsonb);
  end if;
  return jsonb_build_object(
    'host_username', (select username from public.profiles where id = c.host_id),
    'code', c.code,
    'expires_at', floor(extract(epoch from c.expires_at) * 1000)::bigint,
    'language_code', c.language_code,
    'interface_language', (select p.interface_language from public.profiles p where p.id = c.invitee_id),
    -- Partidas terminadas entre los dos: cuántas ganó cada uno (los empates no cuentan).
    'h2h', (
      select jsonb_build_object(
        'host_wins', count(*) filter (where h.result = 'win'),
        'invitee_wins', count(*) filter (where i.result = 'win'))
      from public.battle_players h
      join public.battle_players i on i.battle_id = h.battle_id and i.user_id = c.invitee_id
      join public.battles b on b.id = h.battle_id and b.status = 'completed'
      where h.user_id = c.host_id),
    'tokens', coalesce((select jsonb_agg(t.token order by t.updated_at desc)
                        from public.push_tokens t where t.user_id = c.invitee_id and t.active),
                       '[]'::jsonb));
end;
$$;


-- 3. Aviso de desafío: además, el idioma de interfaz del invitado (null = no lo eligió).

revoke all on function public.set_interface_language(text) from public, anon;
grant execute on function public.set_interface_language(text) to authenticated;
revoke all on function public.complete_onboarding_v2(text, text, text, text, smallint, text, text)
  from public, anon;
grant execute on function public.complete_onboarding_v2(text, text, text, text, smallint, text, text)
  to authenticated;
revoke all on function public.claim_battle_invite_push(uuid, text) from public, anon, authenticated;
grant execute on function public.claim_battle_invite_push(uuid, text) to service_role;

