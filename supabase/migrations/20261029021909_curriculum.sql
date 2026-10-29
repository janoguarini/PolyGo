-- =====================================================================
-- Polygo · Migración 0003 · Currículo, progreso educativo y repetición espaciada
-- Tipos de ejercicio y habilidades: shared/exercises.ts · SRS: shared/srs.ts
-- =====================================================================

-- ---------- contenido ----------
create table public.curriculum_units (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  language_code text not null references public.languages (code),
  level text not null check (level in ('A1','A2')),
  position smallint not null check (position > 0),
  title_es text not null,
  title_en text not null,
  description_es text not null,
  emoji text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (language_code, level, position)
);

create table public.lessons (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  unit_id text not null references public.curriculum_units (id) on delete cascade,
  position smallint not null check (position > 0),
  title_es text not null,
  objective_es text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, position)
);

create table public.words (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  language_code text not null references public.languages (code),
  unit_id text not null references public.curriculum_units (id),
  text text not null,
  translation_es text not null,
  accepted_translations text[] not null default '{}',
  ipa text,
  emoji text,
  example_en text,
  example_es text,
  difficulty smallint not null default 1 check (difficulty between 1 and 5),
  tags text[] not null default '{}',
  is_published boolean not null default false,
  -- Revisión editorial: 'draft' = redactado, pendiente de revisión humana.
  review_status text not null default 'draft' check (review_status in ('draft','reviewed')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index words_unit_idx on public.words (unit_id);
create index words_language_idx on public.words (language_code);

create table public.exercises (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  lesson_id text not null references public.lessons (id) on delete cascade,
  position smallint not null check (position > 0),
  type text not null check (type in (
    'image_choice','translation_choice','translate_write','complete_word','fill_blank',
    'order_words','listen_choice','match_pairs','short_answer')),
  skill text not null check (skill in ('vocabulary','translation','listening','grammar','sentence_building')),
  prompt_es text not null,
  payload jsonb not null check (payload ->> 'type' = type),
  answer text not null default '',
  accepted_answers text[] not null default '{}',
  explanation_es text,
  difficulty smallint not null default 1 check (difficulty between 1 and 5),
  recommended_seconds smallint not null default 20 check (recommended_seconds between 5 and 120),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, position)
);

create table public.exercise_words (
  exercise_id text not null references public.exercises (id) on delete cascade,
  word_id text not null references public.words (id) on delete cascade,
  primary key (exercise_id, word_id)
);

create index exercise_words_word_idx on public.exercise_words (word_id);

create trigger curriculum_units_updated_at before update on public.curriculum_units
  for each row execute function public.set_updated_at();
create trigger lessons_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();
create trigger words_updated_at before update on public.words
  for each row execute function public.set_updated_at();
create trigger exercises_updated_at before update on public.exercises
  for each row execute function public.set_updated_at();

-- ---------- progreso ----------
-- id lo genera el cliente: es la clave de idempotencia del envío.
create table public.learning_sessions (
  id uuid primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('lesson','review')),
  lesson_id text references public.lessons (id),
  started_at timestamptz not null,
  completed_at timestamptz not null default now(),
  duration_seconds integer not null check (duration_seconds >= 0),
  total_answers integer not null check (total_answers > 0),
  first_try_total integer not null check (first_try_total > 0),
  first_try_correct integer not null check (first_try_correct >= 0),
  local_date date not null,
  check ((kind = 'lesson') = (lesson_id is not null)),
  check (first_try_correct <= first_try_total)
);

create index learning_sessions_user_idx on public.learning_sessions (user_id, completed_at desc);
create index learning_sessions_lesson_idx on public.learning_sessions (lesson_id);

create table public.exercise_attempts (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.learning_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  exercise_id text references public.exercises (id) on delete set null,
  word_id text references public.words (id) on delete set null,
  skill text not null,
  answer text not null check (char_length(answer) <= 500),
  is_correct boolean not null,
  is_first_try boolean not null,
  response_ms integer not null check (response_ms between 0 and 600000),
  created_at timestamptz not null default now()
);

create index exercise_attempts_session_idx on public.exercise_attempts (session_id);
create index exercise_attempts_user_idx on public.exercise_attempts (user_id, created_at desc);
create index exercise_attempts_exercise_idx on public.exercise_attempts (exercise_id);
create index exercise_attempts_word_idx on public.exercise_attempts (word_id);

create table public.user_lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null references public.lessons (id) on delete cascade,
  times_completed integer not null default 0 check (times_completed >= 0),
  best_accuracy numeric(4,3) not null default 0 check (best_accuracy between 0 and 1),
  last_accuracy numeric(4,3) not null default 0 check (last_accuracy between 0 and 1),
  first_completed_at timestamptz,
  last_completed_at timestamptz,
  primary key (user_id, lesson_id)
);

create index user_lesson_progress_lesson_idx on public.user_lesson_progress (lesson_id);

create table public.user_word_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  word_id text not null references public.words (id) on delete cascade,
  stage smallint not null default 0 check (stage >= 0),
  seen_count integer not null default 0,
  correct_count integer not null default 0,
  incorrect_count integer not null default 0,
  last_result boolean,
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  mastered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, word_id)
);

create index user_word_progress_due_idx on public.user_word_progress (user_id, next_review_at);
create index user_word_progress_word_idx on public.user_word_progress (word_id);

create trigger user_word_progress_updated_at before update on public.user_word_progress
  for each row execute function public.set_updated_at();

create table public.user_daily_activity (
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_date date not null,
  sessions_completed integer not null default 0,
  answers integer not null default 0,
  correct_answers integer not null default 0,
  seconds_spent integer not null default 0,
  primary key (user_id, activity_date)
);

-- ---------- reglas ----------
-- Replica shared/srs.ts (verificado por supabase/tests/learning.test.mjs).
create or replace function public.srs_config()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select '{"intervalsDays":[1,3,7],"masteredStage":3,"maintenanceDays":21}'::jsonb;
$$;

create or replace function public.safe_time_zone(p_time_zone text)
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (select name from pg_catalog.pg_timezone_names where name = p_time_zone limit 1),
    'UTC'
  );
$$;

/** Una lección está desbloqueada si es la primera publicada de su nivel o la anterior está completada. */
create or replace function public.is_lesson_unlocked(p_user_id uuid, p_lesson_id text)
returns boolean
language sql
stable
set search_path = ''
as $$
  with ordered as (
    select l.id,
           lag(l.id) over (partition by u.language_code, u.level order by u.position, l.position) as previous_id
    from public.lessons l
    join public.curriculum_units u on u.id = l.unit_id
    where l.is_published and u.is_published
  )
  select exists (
    select 1 from ordered o
    where o.id = p_lesson_id
      and (o.previous_id is null or exists (
        select 1 from public.user_lesson_progress p
        where p.user_id = p_user_id and p.lesson_id = o.previous_id and p.times_completed > 0
      ))
  );
$$;

create or replace function public.apply_word_result(
  p_user_id uuid, p_word_id text, p_correct boolean, p_at timestamptz
)
returns void
language plpgsql
set search_path = ''
as $$
declare
  cfg constant jsonb := public.srs_config();
  intervals int[] := array(select jsonb_array_elements_text(cfg -> 'intervalsDays')::int);
  mastered_stage int := (cfg ->> 'masteredStage')::int;
  maintenance int := (cfg ->> 'maintenanceDays')::int;
  prog public.user_word_progress;
  is_due boolean;
  new_stage int;
begin
  insert into public.user_word_progress (user_id, word_id)
  values (p_user_id, p_word_id)
  on conflict do nothing;

  select * into prog from public.user_word_progress
  where user_id = p_user_id and word_id = p_word_id
  for update;

  if p_correct then
    is_due := prog.seen_count = 0 or prog.next_review_at is null or prog.next_review_at <= p_at;
    new_stage := case when is_due then prog.stage + 1 else prog.stage end;
    update public.user_word_progress set
      stage = new_stage,
      seen_count = seen_count + 1,
      correct_count = correct_count + 1,
      last_result = true,
      last_reviewed_at = p_at,
      next_review_at = case
        when not is_due then next_review_at
        when new_stage <= array_length(intervals, 1) then p_at + make_interval(days => intervals[new_stage])
        else p_at + make_interval(days => maintenance)
      end,
      mastered_at = case when new_stage >= mastered_stage then coalesce(mastered_at, p_at) else mastered_at end
    where user_id = p_user_id and word_id = p_word_id;
  else
    update public.user_word_progress set
      stage = 0,
      seen_count = seen_count + 1,
      incorrect_count = incorrect_count + 1,
      last_result = false,
      last_reviewed_at = p_at,
      next_review_at = p_at,
      mastered_at = null
    where user_id = p_user_id and word_id = p_word_id;
  end if;
end;
$$;

-- ---------- envío de sesiones (lección o repaso) ----------
-- p_attempts: [{ "exercise_id"?: text, "word_id"?: text, "answer": text, "correct": bool,
--               "first_try": bool, "response_ms": int }]
-- Normaliza y acota cada intento recibido del cliente.
create or replace function public.parse_learning_attempts(p_attempts jsonb)
returns table (
  ord int, exercise_id text, word_id text, answer text,
  is_correct boolean, is_first_try boolean, response_ms int
)
language sql
immutable
set search_path = ''
as $$
  select
    a.ordinality::int,
    a.value ->> 'exercise_id',
    a.value ->> 'word_id',
    left(coalesce(a.value ->> 'answer', ''), 500),
    coalesce((a.value ->> 'correct')::boolean, false),
    coalesce((a.value ->> 'first_try')::boolean, false),
    least(greatest(coalesce((a.value ->> 'response_ms')::int, 0), 0), 600000)
  from jsonb_array_elements(p_attempts) with ordinality as a(value, ordinality);
$$;

create or replace function public.submit_learning_session(
  p_session_id uuid,
  p_kind text,
  p_lesson_id text,
  p_started_at timestamptz,
  p_attempts jsonb,
  p_time_zone text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  now_at timestamptz := now();
  tz text := public.safe_time_zone(p_time_zone);
  local_day date := (now() at time zone public.safe_time_zone(p_time_zone))::date;
  n int;
  inserted_id uuid;
  first_total int;
  first_correct int;
  total int;
  correct_total int;
  duration int;
  accuracy numeric;
  word_row record;
  existing public.learning_sessions;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  -- Idempotencia: el mismo id devuelve el resultado ya procesado.
  select * into existing from public.learning_sessions where id = p_session_id;
  if found then
    if existing.user_id <> uid then
      raise exception 'session_conflict' using errcode = '23505';
    end if;
    return jsonb_build_object(
      'session_id', existing.id, 'duplicate', true,
      'first_try_correct', existing.first_try_correct, 'first_try_total', existing.first_try_total,
      'accuracy', round(existing.first_try_correct::numeric / existing.first_try_total, 3));
  end if;

  if p_kind not in ('lesson','review') then
    raise exception 'invalid_kind' using errcode = '22023';
  end if;
  if jsonb_typeof(p_attempts) <> 'array' then
    raise exception 'invalid_attempts' using errcode = '22023';
  end if;
  n := jsonb_array_length(p_attempts);
  if n = 0 or n > 200 then
    raise exception 'invalid_attempts' using errcode = '22023';
  end if;
  if p_started_at > now_at + interval '1 minute' or p_started_at < now_at - interval '3 hours' then
    raise exception 'invalid_started_at' using errcode = '22023';
  end if;

  if p_kind = 'lesson' then
    if not exists (
      select 1 from public.lessons l join public.curriculum_units u on u.id = l.unit_id
      where l.id = p_lesson_id and l.is_published and u.is_published
    ) then
      raise exception 'lesson_not_found' using errcode = 'P0002';
    end if;
    if not public.is_lesson_unlocked(uid, p_lesson_id) then
      raise exception 'lesson_locked' using errcode = '42501';
    end if;
    -- Cada intento debe pertenecer a un ejercicio publicado de esta lección.
    if exists (
      select 1 from public.parse_learning_attempts(p_attempts) i
      left join public.exercises e on e.id = i.exercise_id and e.lesson_id = p_lesson_id and e.is_published
      where e.id is null
    ) then
      raise exception 'invalid_exercise' using errcode = '22023';
    end if;
    -- Debe haber exactamente un primer intento por ejercicio de la lección.
    if (select count(*) from public.parse_learning_attempts(p_attempts) where is_first_try)
         <> (select count(*) from public.exercises where lesson_id = p_lesson_id and is_published)
       or (select count(distinct exercise_id) from public.parse_learning_attempts(p_attempts) where is_first_try)
         <> (select count(*) from public.parse_learning_attempts(p_attempts) where is_first_try) then
      raise exception 'incomplete_lesson' using errcode = '22023';
    end if;
  else
    if exists (
      select 1 from public.parse_learning_attempts(p_attempts) i
      left join public.words w on w.id = i.word_id and w.is_published
      where w.id is null or not i.is_first_try
    ) or (select count(distinct word_id) from public.parse_learning_attempts(p_attempts)) <> n then
      raise exception 'invalid_review' using errcode = '22023';
    end if;
  end if;

  select count(*) filter (where is_first_try),
         count(*) filter (where is_first_try and is_correct),
         count(*),
         count(*) filter (where is_correct)
    into first_total, first_correct, total, correct_total
  from public.parse_learning_attempts(p_attempts);

  duration := least(greatest(extract(epoch from (now_at - p_started_at))::int, 0), 3 * 3600);

  insert into public.learning_sessions (
    id, user_id, kind, lesson_id, started_at, completed_at, duration_seconds,
    total_answers, first_try_total, first_try_correct, local_date)
  values (
    p_session_id, uid, p_kind, case when p_kind = 'lesson' then p_lesson_id end, p_started_at, now_at,
    duration, total, first_total, first_correct, local_day)
  on conflict (id) do nothing
  returning id into inserted_id;

  if inserted_id is null then
    -- Envío concurrente con el mismo id: ya lo procesó la otra transacción.
    return jsonb_build_object('session_id', p_session_id, 'duplicate', true);
  end if;

  insert into public.exercise_attempts (
    session_id, user_id, exercise_id, word_id, skill, answer, is_correct, is_first_try, response_ms)
  select p_session_id, uid, i.exercise_id, i.word_id,
         coalesce(e.skill, 'vocabulary'), i.answer, i.is_correct, i.is_first_try, i.response_ms
  from public.parse_learning_attempts(p_attempts) i
  left join public.exercises e on e.id = i.exercise_id
  order by i.ord;

  -- Un único resultado SRS por palabra y sesión: correcta sólo si todos sus primeros intentos lo fueron.
  for word_row in
    select w.word_id, bool_and(i.is_correct) as ok
    from public.parse_learning_attempts(p_attempts) i
    join lateral (
      select ew.word_id from public.exercise_words ew where ew.exercise_id = i.exercise_id
      union all
      select i.word_id where i.word_id is not null
    ) w on true
    where i.is_first_try
    group by w.word_id
  loop
    perform public.apply_word_result(uid, word_row.word_id, word_row.ok, now_at);
  end loop;

  accuracy := round(first_correct::numeric / first_total, 3);

  if p_kind = 'lesson' then
    insert into public.user_lesson_progress as p (
      user_id, lesson_id, times_completed, best_accuracy, last_accuracy, first_completed_at, last_completed_at)
    values (uid, p_lesson_id, 1, accuracy, accuracy, now_at, now_at)
    on conflict (user_id, lesson_id) do update set
      times_completed = p.times_completed + 1,
      best_accuracy = greatest(p.best_accuracy, excluded.best_accuracy),
      last_accuracy = excluded.last_accuracy,
      last_completed_at = excluded.last_completed_at;
  end if;

  insert into public.user_daily_activity as d (
    user_id, activity_date, sessions_completed, answers, correct_answers, seconds_spent)
  values (uid, local_day, 1, total, correct_total, duration)
  on conflict (user_id, activity_date) do update set
    sessions_completed = d.sessions_completed + 1,
    answers = d.answers + excluded.answers,
    correct_answers = d.correct_answers + excluded.correct_answers,
    seconds_spent = d.seconds_spent + excluded.seconds_spent;

  return jsonb_build_object(
    'session_id', p_session_id, 'duplicate', false,
    'first_try_correct', first_correct, 'first_try_total', first_total, 'accuracy', accuracy,
    'duration_seconds', duration, 'time_zone', tz);
end;
$$;

-- ---------- resumen para Inicio / Perfil ----------
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
  mastered_stage int := (public.srs_config() ->> 'masteredStage')::int;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  -- Racha: días consecutivos con actividad, terminando hoy (o ayer si hoy todavía no hubo).
  cursor_day := case
    when exists (select 1 from public.user_daily_activity where user_id = uid and activity_date = today) then today
    else today - 1
  end;
  while exists (select 1 from public.user_daily_activity where user_id = uid and activity_date = cursor_day) loop
    streak := streak + 1;
    cursor_day := cursor_day - 1;
  end loop;

  return jsonb_build_object(
    'streak_days', streak,
    'active_today', exists (select 1 from public.user_daily_activity where user_id = uid and activity_date = today),
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

-- Palabra del día determinista: igual para todos los usuarios en una fecha dada.
create or replace function public.word_of_the_day(p_date date, p_language text default 'en')
returns setof public.words
language sql
stable
security invoker
set search_path = ''
as $$
  select w.* from public.words w
  join public.curriculum_units u on u.id = w.unit_id
  where w.is_published and u.is_published and w.language_code = p_language
  order by md5(p_date::text || w.id)
  limit 1;
$$;

-- ---------- RLS y permisos ----------
alter table public.curriculum_units enable row level security;
alter table public.lessons enable row level security;
alter table public.words enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_words enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.exercise_attempts enable row level security;
alter table public.user_lesson_progress enable row level security;
alter table public.user_word_progress enable row level security;
alter table public.user_daily_activity enable row level security;

revoke all on public.curriculum_units, public.lessons, public.words, public.exercises, public.exercise_words,
  public.learning_sessions, public.exercise_attempts, public.user_lesson_progress,
  public.user_word_progress, public.user_daily_activity from anon, authenticated;

grant select on public.curriculum_units, public.lessons, public.words, public.exercises, public.exercise_words,
  public.learning_sessions, public.exercise_attempts, public.user_lesson_progress,
  public.user_word_progress, public.user_daily_activity to authenticated;

create policy "units readable when published" on public.curriculum_units
  for select to authenticated using (is_published);
create policy "lessons readable when published" on public.lessons
  for select to authenticated using (is_published);
create policy "words readable when published" on public.words
  for select to authenticated using (is_published);
create policy "exercises readable when published" on public.exercises
  for select to authenticated using (is_published);
create policy "exercise words readable" on public.exercise_words
  for select to authenticated using (true);

create policy "sessions readable by owner" on public.learning_sessions
  for select to authenticated using (user_id = (select auth.uid()));
create policy "attempts readable by owner" on public.exercise_attempts
  for select to authenticated using (user_id = (select auth.uid()));
create policy "lesson progress readable by owner" on public.user_lesson_progress
  for select to authenticated using (user_id = (select auth.uid()));
create policy "word progress readable by owner" on public.user_word_progress
  for select to authenticated using (user_id = (select auth.uid()));
create policy "daily activity readable by owner" on public.user_daily_activity
  for select to authenticated using (user_id = (select auth.uid()));

revoke all on function public.submit_learning_session(uuid, text, text, timestamptz, jsonb, text) from public, anon;
grant execute on function public.submit_learning_session(uuid, text, text, timestamptz, jsonb, text) to authenticated;
revoke all on function public.get_learning_summary(text) from public, anon;
grant execute on function public.get_learning_summary(text) to authenticated;
revoke all on function public.word_of_the_day(date, text) from public, anon;
grant execute on function public.word_of_the_day(date, text) to authenticated;
revoke all on function public.apply_word_result(uuid, text, boolean, timestamptz) from public, anon, authenticated;
revoke all on function public.is_lesson_unlocked(uuid, text) from public, anon, authenticated;
revoke all on function public.parse_learning_attempts(jsonb) from public, anon, authenticated;
