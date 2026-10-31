-- Misiones diarias y protector de racha.
-- Misiones: 3 por día (aprender, precisión, ranked), elegidas de forma determinista por usuario y fecha
-- local; el progreso sale de lo que la base ya guarda, así que no se puede inventar desde la app.
-- Completar las 3 y reclamar da 1 protector de racha (máximo 2 guardados).
-- Protector: si faltaste días y tenés protectores suficientes para cubrirlos, al volver a estudiar se
-- gastan solos (trigger en user_daily_activity) y la racha sigue. Los días cubiertos no suman a la
-- racha pero no la cortan. Textos de las misiones: shared/missions.ts.

create table public.user_streak_freezes (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  available smallint not null default 0 check (available between 0 and 2),
  updated_at timestamptz not null default now()
);

create table public.user_frozen_days (
  user_id uuid not null references public.profiles (id) on delete cascade,
  frozen_date date not null,
  created_at timestamptz not null default now(),
  primary key (user_id, frozen_date)
);

create table public.user_mission_rewards (
  user_id uuid not null references public.profiles (id) on delete cascade,
  mission_date date not null,
  claimed_at timestamptz not null default now(),
  primary key (user_id, mission_date)
);

alter table public.user_streak_freezes enable row level security;
alter table public.user_frozen_days enable row level security;
alter table public.user_mission_rewards enable row level security;
revoke all on public.user_streak_freezes, public.user_frozen_days, public.user_mission_rewards
  from anon, authenticated;
-- get_learning_summary es security invoker: lee lo propio.
grant select on public.user_streak_freezes, public.user_frozen_days to authenticated;
create policy "streak freezes readable by owner" on public.user_streak_freezes
  for select to authenticated using (user_id = (select auth.uid()));
create policy "frozen days readable by owner" on public.user_frozen_days
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------- protector ----------
/** Al registrar un día nuevo de estudio: si los días faltantes desde el último caben en los protectores, los cubre. */
create or replace function public.apply_streak_freezes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  last_day date;
  have smallint;
  gap integer;
begin
  select greatest(
    (select max(activity_date) from public.user_daily_activity
     where user_id = new.user_id and activity_date < new.activity_date),
    (select max(frozen_date) from public.user_frozen_days
     where user_id = new.user_id and frozen_date < new.activity_date))
  into last_day;
  if last_day is null then
    return new;
  end if;
  gap := new.activity_date - last_day - 1;
  if gap < 1 then
    return new;
  end if;
  select available into have from public.user_streak_freezes where user_id = new.user_id for update;
  if coalesce(have, 0) < gap then
    return new;
  end if;
  insert into public.user_frozen_days (user_id, frozen_date)
  select new.user_id, d::date
  from generate_series(last_day + 1, new.activity_date - 1, interval '1 day') as d
  on conflict do nothing;
  update public.user_streak_freezes set available = available - gap, updated_at = now()
  where user_id = new.user_id;
  return new;
end;
$$;

create trigger user_daily_activity_streak_freeze
  after insert on public.user_daily_activity
  for each row execute function public.apply_streak_freezes();

-- ---------- misiones ----------
/** Las 3 misiones de un usuario en una fecha: [{id, target}]. Determinista. */
create or replace function public.daily_missions_for(p_user uuid, p_day date)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  with h as (select decode(md5(p_user::text || ':' || p_day::text), 'hex') as b)
  select jsonb_build_array(
    case when get_byte(b, 0) % 2 = 0
      then jsonb_build_object('id', 'lessons', 'target', (array[1, 2, 3])[1 + get_byte(b, 1) % 3])
      else jsonb_build_object('id', 'minutes', 'target', (array[5, 10, 15])[1 + get_byte(b, 1) % 3]) end,
    case when get_byte(b, 2) % 2 = 0
      then jsonb_build_object('id', 'correct', 'target', (array[15, 25, 40])[1 + get_byte(b, 3) % 3])
      else jsonb_build_object('id', 'perfect', 'target', 1) end,
    case when get_byte(b, 4) % 2 = 0
      then jsonb_build_object('id', 'ranked_play', 'target', (array[1, 2, 3])[1 + get_byte(b, 5) % 3])
      else jsonb_build_object('id', 'ranked_win', 'target', 1) end)
  from h;
$$;

/** Progreso de una misión en el día local del usuario. */
create or replace function public.mission_progress(p_user uuid, p_mission text, p_day date, p_tz text)
returns integer
language sql
stable
set search_path = ''
as $$
  select case p_mission
    when 'lessons' then (select count(*)::int from public.learning_sessions
                         where user_id = p_user and kind = 'lesson' and local_date = p_day)
    when 'perfect' then (select count(*)::int from public.learning_sessions
                         where user_id = p_user and kind = 'lesson' and local_date = p_day
                           and first_try_correct = first_try_total)
    when 'minutes' then (select coalesce(sum(seconds_spent), 0)::int / 60 from public.user_daily_activity
                         where user_id = p_user and activity_date = p_day)
    when 'correct' then (select coalesce(sum(correct_answers), 0)::int from public.user_daily_activity
                         where user_id = p_user and activity_date = p_day)
    when 'ranked_play' then (select count(*)::int from public.battle_players bp
                             join public.battles b on b.id = bp.battle_id
                             where bp.user_id = p_user and b.is_ranked
                               and b.status in ('completed', 'forfeited')
                               and (b.ended_at at time zone p_tz)::date = p_day)
    when 'ranked_win' then (select count(*)::int from public.battle_players bp
                            join public.battles b on b.id = bp.battle_id
                            where bp.user_id = p_user and b.is_ranked and bp.result = 'win'
                              and b.status in ('completed', 'forfeited')
                              and (b.ended_at at time zone p_tz)::date = p_day)
    else 0 end;
$$;

/** Misiones de hoy con su progreso, si ya se reclamó la recompensa y cuántos protectores hay. */
create or replace function public.get_daily_missions(p_time_zone text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  tz text := public.safe_time_zone(p_time_zone);
  today date := (now() at time zone public.safe_time_zone(p_time_zone))::date;
  missions jsonb;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select jsonb_agg(m || jsonb_build_object(
           'progress', least(p.v, (m ->> 'target')::int),
           'done', p.v >= (m ->> 'target')::int) order by ord)
  into missions
  from jsonb_array_elements(public.daily_missions_for(uid, today)) with ordinality as e (m, ord)
  cross join lateral (select public.mission_progress(uid, m ->> 'id', today, tz) as v) p;

  return jsonb_build_object(
    'date', today,
    'missions', missions,
    'all_done', not exists (select 1 from jsonb_array_elements(missions) x where not (x ->> 'done')::boolean),
    'claimed', exists (select 1 from public.user_mission_rewards where user_id = uid and mission_date = today),
    'freezes', coalesce((select available from public.user_streak_freezes where user_id = uid), 0),
    'max_freezes', 2);
end;
$$;

/**
 * Reclama la recompensa del día (1 protector, sin pasar de 2). Sólo con las 3 misiones completas
 * y una vez por día. Devuelve {granted, freezes}; granted = false si ya tenía el máximo.
 */
create or replace function public.claim_mission_reward(p_time_zone text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  state jsonb;
  had smallint;
  now_has smallint;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  state := public.get_daily_missions(p_time_zone);
  if not (state ->> 'all_done')::boolean then
    raise exception 'missions_incomplete' using errcode = '22023';
  end if;
  insert into public.user_mission_rewards (user_id, mission_date)
  values (uid, (state ->> 'date')::date)
  on conflict do nothing;
  if not found then
    raise exception 'already_claimed' using errcode = '22023';
  end if;

  insert into public.user_streak_freezes as f (user_id, available) values (uid, 0)
  on conflict (user_id) do nothing;
  select available into had from public.user_streak_freezes where user_id = uid for update;
  now_has := least(2, had + 1);
  update public.user_streak_freezes set available = now_has, updated_at = now() where user_id = uid;
  return jsonb_build_object('granted', now_has > had, 'freezes', now_has);
end;
$$;

-- ---------- resumen: la racha respeta los protectores ----------
create or replace function public.get_learning_summary(p_time_zone text)
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  today date := (now() at time zone public.safe_time_zone(p_time_zone))::date;
  streak int := 0;
  cursor_day date;
  last_day date;
  freezes int;
  pending int := 0;
  active_today boolean;
  mastered_stage int := (public.srs_config() ->> 'masteredStage')::int;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  freezes := coalesce((select available from public.user_streak_freezes where user_id = uid), 0);
  active_today := exists (select 1 from public.user_daily_activity where user_id = uid and activity_date = today);

  -- Racha: días con estudio, terminando hoy (o ayer si hoy todavía no hubo). Un día cubierto por
  -- un protector no suma pero no corta.
  cursor_day := case when active_today then today else today - 1 end;
  -- Días que faltan desde la última actividad hasta ayer: si los protectores alcanzan, se van a
  -- gastar cuando vuelvas a estudiar (trigger apply_streak_freezes), así que la racha sigue viva.
  if not exists (select 1 from public.user_daily_activity where user_id = uid and activity_date = cursor_day)
     and not exists (select 1 from public.user_frozen_days where user_id = uid and frozen_date = cursor_day) then
    select greatest(
      (select max(activity_date) from public.user_daily_activity where user_id = uid and activity_date < today),
      (select max(frozen_date) from public.user_frozen_days where user_id = uid and frozen_date < today))
    into last_day;
    if last_day is not null and cursor_day - last_day <= freezes then
      pending := cursor_day - last_day;
      cursor_day := last_day;
    end if;
  end if;
  loop
    if exists (select 1 from public.user_daily_activity where user_id = uid and activity_date = cursor_day) then
      streak := streak + 1;
    elsif not exists (select 1 from public.user_frozen_days where user_id = uid and frozen_date = cursor_day) then
      exit;
    end if;
    cursor_day := cursor_day - 1;
  end loop;

  return jsonb_build_object(
    'streak_days', streak,
    'active_today', active_today,
    'streak_freezes', freezes,
    'freeze_pending', pending,
    'frozen_dates', (select coalesce(jsonb_agg(frozen_date order by frozen_date), '[]'::jsonb)
                     from public.user_frozen_days where user_id = uid and frozen_date > today - 7),
    'lessons_completed', (select count(*) from public.user_lesson_progress where user_id = uid and times_completed > 0),
    'words_seen', (select count(*) from public.user_word_progress where user_id = uid and seen_count > 0),
    'words_mastered', (select count(*) from public.user_word_progress where user_id = uid and stage >= mastered_stage),
    'words_due', (select count(*) from public.user_word_progress where user_id = uid and next_review_at <= now()),
    'seconds_learning', (select coalesce(sum(seconds_spent), 0) from public.user_daily_activity where user_id = uid),
    'today_seconds', (select coalesce(sum(seconds_spent), 0) from public.user_daily_activity where user_id = uid and activity_date = today),
    'skills', (
      select coalesce(jsonb_agg(jsonb_build_object('skill', skill, 'answers', answers, 'correct', correct) order by skill), '[]'::jsonb)
      from (
        select skill, count(*) as answers, count(*) filter (where is_correct) as correct
        from public.exercise_attempts
        where user_id = uid and is_first_try
        group by skill
      ) s
    ),
    'frequent_mistakes', (
      select coalesce(jsonb_agg(jsonb_build_object('word_id', id, 'text', text, 'translation', translation_es, 'incorrect', incorrect_count) order by incorrect_count desc), '[]'::jsonb)
      from (
        select w.id, w.text, w.translation_es, p.incorrect_count
        from public.user_word_progress p join public.words w on w.id = p.word_id
        where p.user_id = uid and p.incorrect_count > 0
        order by p.incorrect_count desc, p.last_reviewed_at desc
        limit 5
      ) m
    )
  );
end;
$$;

revoke all on function public.apply_streak_freezes() from public, anon, authenticated;
revoke all on function public.daily_missions_for(uuid, date) from public, anon, authenticated;
revoke all on function public.mission_progress(uuid, text, date, text) from public, anon, authenticated;
revoke all on function public.get_daily_missions(text) from public, anon;
grant execute on function public.get_daily_missions(text) to authenticated;
revoke all on function public.claim_mission_reward(text) from public, anon;
grant execute on function public.claim_mission_reward(text) to authenticated;
