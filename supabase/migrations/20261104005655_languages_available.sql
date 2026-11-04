-- =====================================================================
-- Italiano, portugués y chino pasan a disponibles para todos (espejo de shared/languages.ts).
-- El contenido sigue en borrador (review_status = 'draft'): falta la revisión nativa.
--
-- complete_onboarding:
-- - acepta los idiomas disponibles (content_status), como set_target_language;
-- - sólo un nivel inicial con contenido publicado en ese idioma (italiano, portugués, chino: A1);
-- - crea el rating inicial del idioma elegido si tiene Ranked (el alta sólo crea el de inglés).
-- =====================================================================

update public.languages
set content_status = 'available', is_target_available = true
where code in ('it', 'pt', 'zh');

create or replace function public.complete_onboarding(
  p_username text,
  p_avatar_id text,
  p_target_language text,
  p_start_level text,
  p_daily_goal_minutes smallint
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  normalized text := lower(trim(p_username));
  result public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.languages
                 where code = p_target_language and content_status = 'available') then
    raise exception 'language_unavailable' using errcode = '22023';
  end if;
  if not exists (select 1 from public.curriculum_units
                 where language_code = p_target_language and level = p_start_level and is_published) then
    raise exception 'level_unavailable' using errcode = '22023';
  end if;
  if exists (select 1 from public.profiles where username = normalized and id <> uid) then
    raise exception 'username_taken' using errcode = '23505';
  end if;

  update public.profiles set
    username = normalized,
    display_name = coalesce(display_name, normalized),
    avatar_id = p_avatar_id,
    target_language = p_target_language,
    start_level = p_start_level,
    daily_goal_minutes = p_daily_goal_minutes,
    onboarding_completed_at = coalesce(onboarding_completed_at, now())
  where id = uid
  returning * into result;

  if result.id is null then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;

  if exists (select 1 from public.languages where code = p_target_language and ranked_available)
     and not exists (select 1 from public.player_ratings
                     where user_id = uid and language_code = p_target_language) then
    insert into public.player_ratings (user_id, language_code) values (uid, p_target_language);
    insert into public.rating_history (user_id, language_code, season_id, reason, rating_before, rating_after)
    select uid, p_target_language, s.id, 'initial', 100, 100
    from (select 1) as one
    left join public.seasons s on s.status = 'active';
  end if;
  return result;
end;
$$;

revoke all on function public.complete_onboarding(text, text, text, text, smallint) from public, anon;
grant execute on function public.complete_onboarding(text, text, text, text, smallint) to authenticated;
