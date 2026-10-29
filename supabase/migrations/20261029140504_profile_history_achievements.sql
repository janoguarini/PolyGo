-- =====================================================================
-- Polygo · Migración 0004 · Perfil: historial de partidas, evolución de ELO, logros y perfil público
-- battles / battle_players guardan el RESULTADO de las partidas; los escribe sólo el servidor de
-- partidas (Fase 4), que agregará cola, preguntas y respuestas en su propia migración.
-- Estados de partida: docs/BATTLE_PROTOCOL.md (definidos completos para no tener que alterar el CHECK).
-- =====================================================================

-- ---------- partidas ----------
create table public.battles (
  id uuid primary key default gen_random_uuid(),
  language_code text not null references public.languages (code),
  season_id integer references public.seasons (id),
  mode text not null default 'word_rush' check (mode in ('word_rush')),
  is_ranked boolean not null default true,
  status text not null default 'matched'
    check (status in ('matched','ready','in_progress','reconnecting','completed','forfeited','cancelled')),
  protocol_version smallint not null default 1,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  check (ended_at is null or started_at is null or ended_at >= started_at)
);

create index battles_language_idx on public.battles (language_code);
create index battles_season_idx on public.battles (season_id);

-- user_id queda en NULL si la cuenta se borra: la partida se conserva para el rival, anonimizada.
create table public.battle_players (
  battle_id uuid not null references public.battles (id) on delete cascade,
  slot smallint not null check (slot in (1, 2)),
  user_id uuid references public.profiles (id) on delete set null,
  score integer not null default 0 check (score >= 0),
  correct_answers integer not null default 0 check (correct_answers >= 0),
  total_answers integer not null default 0 check (total_answers >= 0),
  result text check (result in ('win','loss','draw')),
  forfeited boolean not null default false,
  rating_before integer,
  rating_after integer check (rating_after >= 100),
  primary key (battle_id, slot),
  unique (battle_id, user_id),
  check (correct_answers <= total_answers)
);

create index battle_players_user_idx on public.battle_players (user_id);

-- rating_history.battle_id existía sin FK desde la migración 0001.
alter table public.rating_history
  add constraint rating_history_battle_id_fkey foreign key (battle_id) references public.battles (id);
create index rating_history_battle_idx on public.rating_history (battle_id);

-- ---------- logros ----------
create table public.achievements (
  id text primary key check (id ~ '^[a-z0-9_]+$'),
  category text not null check (category in ('learning','vocabulary','streak','competitive')),
  metric text not null check (metric in (
    'lessons_completed','perfect_lessons','words_seen','words_mastered','best_streak_days',
    'games_played','wins','best_win_streak','peak_rating')),
  threshold integer not null check (threshold > 0),
  title_es text not null,
  description_es text not null,
  icon text not null,
  position smallint not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Una vez desbloqueado, un logro no se pierde aunque la métrica baje (p. ej. palabras dominadas).
create table public.user_achievements (
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id text not null references public.achievements (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create index user_achievements_achievement_idx on public.user_achievements (achievement_id);

insert into public.achievements (id, category, metric, threshold, title_es, description_es, icon, position) values
  ('first_lesson',     'learning',    'lessons_completed', 1,    'Primer paso',        'Completá tu primera lección.',                       'footprints', 1),
  ('lessons_5',        'learning',    'lessons_completed', 5,    'Constante',          'Completá 5 lecciones distintas.',                    'book-open',  2),
  ('lessons_15',       'learning',    'lessons_completed', 15,   'Base sólida',        'Completá 15 lecciones distintas.',                   'graduation-cap', 3),
  ('perfect_lesson',   'learning',    'perfect_lessons',   1,    'Impecable',          'Terminá una lección sin errores en el primer intento.', 'sparkles', 4),
  ('perfect_5',        'learning',    'perfect_lessons',   5,    'Precisión quirúrgica', 'Terminá 5 lecciones distintas sin errores.',       'target',     5),
  ('words_25',         'vocabulary',  'words_seen',        25,   'Curioso',            'Estudiá 25 palabras.',                               'eye',        6),
  ('mastered_10',      'vocabulary',  'words_mastered',    10,   'Memoria firme',      'Dominá 10 palabras con repasos espaciados.',         'brain',      7),
  ('mastered_50',      'vocabulary',  'words_mastered',    50,   'Diccionario andante', 'Dominá 50 palabras con repasos espaciados.',        'library',    8),
  ('streak_3',         'streak',      'best_streak_days',  3,    'En marcha',          'Estudiá 3 días seguidos.',                           'flame',      9),
  ('streak_7',         'streak',      'best_streak_days',  7,    'Semana completa',    'Estudiá 7 días seguidos.',                           'calendar-check', 10),
  ('streak_30',        'streak',      'best_streak_days',  30,   'Imparable',          'Estudiá 30 días seguidos.',                          'zap',        11),
  ('placement_done',   'competitive', 'games_played',      5,    'Clasificado',        'Terminá tus 5 partidas de colocación.',              'shield',     12),
  ('first_win',        'competitive', 'wins',              1,    'Primera victoria',   'Ganá una partida ranked.',                           'swords',     13),
  ('wins_10',          'competitive', 'wins',              10,   'Competidor',         'Ganá 10 partidas ranked.',                           'trophy',     14),
  ('win_streak_5',     'competitive', 'best_win_streak',   5,    'En racha',           'Ganá 5 partidas ranked seguidas.',                   'trending-up', 15),
  ('peak_platinum',    'competitive', 'peak_rating',       1200, 'Platino',            'Alcanzá 1200 de ELO.',                               'gem',        16)
on conflict (id) do update set
  category = excluded.category, metric = excluded.metric, threshold = excluded.threshold,
  title_es = excluded.title_es, description_es = excluded.description_es, icon = excluded.icon,
  position = excluded.position;

-- ---------- métricas y evaluación de logros ----------
-- Invoker: con RLS un cliente sólo ve sus propios datos educativos (los de otros cuentan 0).
-- Las funciones definer (envío de sesiones, liquidación de partidas) la llaman con el id real.
create or replace function public.achievement_metrics(p_user_id uuid)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'lessons_completed', (select count(*) from public.user_lesson_progress
                           where user_id = p_user_id and times_completed > 0),
    'perfect_lessons', (select count(*) from public.user_lesson_progress
                         where user_id = p_user_id and best_accuracy >= 1),
    'words_seen', (select count(*) from public.user_word_progress
                    where user_id = p_user_id and seen_count > 0),
    'words_mastered', (select count(*) from public.user_word_progress
                        where user_id = p_user_id and stage >= (public.srs_config() ->> 'masteredStage')::int),
    -- Racha más larga histórica: islas de días consecutivos (activity_date ya es fecha local).
    'best_streak_days', (select coalesce(max(len), 0) from (
                           select count(*) as len from (
                             select activity_date - (row_number() over (order by activity_date))::int as grp
                             from public.user_daily_activity where user_id = p_user_id
                           ) d group by grp
                         ) s),
    'games_played', (select coalesce(sum(games_played), 0) from public.player_ratings where user_id = p_user_id),
    'wins', (select coalesce(sum(wins), 0) from public.player_ratings where user_id = p_user_id),
    'best_win_streak', (select coalesce(max(best_win_streak), 0) from public.player_ratings where user_id = p_user_id),
    'peak_rating', (select coalesce(max(peak_rating), 0) from public.player_ratings where user_id = p_user_id)
  );
$$;

/** Desbloquea los logros alcanzados y devuelve los ids nuevos (en orden de catálogo). Idempotente. */
create or replace function public.evaluate_achievements(p_user_id uuid)
returns text[]
language plpgsql
set search_path = ''
as $$
declare
  m jsonb := public.achievement_metrics(p_user_id);
  unlocked text[];
begin
  with inserted as (
    insert into public.user_achievements (user_id, achievement_id)
    select p_user_id, a.id from public.achievements a
    where a.is_active and coalesce((m ->> a.metric)::int, 0) >= a.threshold
    on conflict do nothing
    returning achievement_id
  )
  select coalesce(array_agg(i.achievement_id order by a.position), '{}')
    into unlocked
  from inserted i join public.achievements a on a.id = i.achievement_id;
  return unlocked;
end;
$$;

/** Catálogo con progreso y fecha de desbloqueo del usuario actual. */
create or replace function public.get_my_achievements()
returns table (
  id text, category text, title_es text, description_es text, icon text,
  threshold integer, progress integer, unlocked_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  with m as (select public.achievement_metrics((select auth.uid())) as v)
  select a.id, a.category, a.title_es, a.description_es, a.icon, a.threshold,
         least(coalesce((m.v ->> a.metric)::int, 0), a.threshold)::int,
         ua.unlocked_at
  from public.achievements a
  cross join m
  left join public.user_achievements ua
    on ua.achievement_id = a.id and ua.user_id = (select auth.uid())
  where a.is_active
  order by a.position;
$$;

-- ---------- historial de partidas ----------
-- Definer: el jugador no puede leer la fila del rival en battle_players; sólo la expone acá,
-- limitada a sus propias partidas terminadas.
create or replace function public.get_match_history(p_limit integer, p_before timestamptz)
returns table (
  battle_id uuid, mode text, is_ranked boolean, status text, ended_at timestamptz,
  result text, forfeited boolean, score integer, correct_answers integer, total_answers integer,
  rating_before integer, rating_after integer,
  opponent_id uuid, opponent_username text, opponent_avatar_id text, opponent_score integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select b.id, b.mode, b.is_ranked, b.status, coalesce(b.ended_at, b.created_at),
         me.result, me.forfeited, me.score, me.correct_answers, me.total_answers,
         me.rating_before, me.rating_after,
         opp.user_id, p.username, p.avatar_id, opp.score
  from public.battle_players me
  join public.battles b on b.id = me.battle_id
  left join public.battle_players opp on opp.battle_id = me.battle_id and opp.slot <> me.slot
  left join public.profiles p on p.id = opp.user_id
  where me.user_id = (select auth.uid())
    and b.status in ('completed','forfeited')
    and (p_before is null or coalesce(b.ended_at, b.created_at) < p_before)
  order by coalesce(b.ended_at, b.created_at) desc, b.id
  limit least(greatest(coalesce(p_limit, 20), 1), 50);
$$;

-- ---------- perfil público ----------
-- Respeta user_settings.profile_visibility: 'public' muestra estadísticas y logros;
-- 'private' y 'friends' (hasta que existan amigos) sólo nombre, avatar y rango.
create or replace function public.get_public_profile(p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  prof public.profiles;
  visibility text;
  is_open boolean;
  result jsonb;
  m jsonb;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into prof from public.profiles where id = p_user_id and username is not null;
  if not found then
    return null;
  end if;

  select s.profile_visibility into visibility from public.user_settings s where s.user_id = p_user_id;
  is_open := p_user_id = uid or coalesce(visibility, 'private') = 'public';

  result := jsonb_build_object(
    'id', prof.id,
    'username', prof.username,
    'display_name', prof.display_name,
    'avatar_id', prof.avatar_id,
    'public_code', prof.public_code,
    'created_at', prof.created_at,
    'is_public', is_open,
    'rating', (select jsonb_build_object('rating', r.rating, 'games_played', r.games_played)
               from public.player_ratings r
               where r.user_id = p_user_id and r.language_code = prof.target_language)
  );

  if is_open then
    m := public.achievement_metrics(p_user_id);
    result := result || jsonb_build_object(
      'stats', (select jsonb_build_object(
                  'wins', r.wins, 'losses', r.losses, 'draws', r.draws,
                  'peak_rating', r.peak_rating, 'best_win_streak', r.best_win_streak)
                from public.player_ratings r
                where r.user_id = p_user_id and r.language_code = prof.target_language),
      'learning', jsonb_build_object(
                  'lessons_completed', m -> 'lessons_completed',
                  'words_mastered', m -> 'words_mastered',
                  'best_streak_days', m -> 'best_streak_days'),
      'achievements', (select coalesce(jsonb_agg(jsonb_build_object(
                          'id', a.id, 'title', a.title_es, 'icon', a.icon, 'category', a.category,
                          'unlocked_at', ua.unlocked_at) order by a.position), '[]'::jsonb)
                       from public.user_achievements ua
                       join public.achievements a on a.id = ua.achievement_id
                       where ua.user_id = p_user_id and a.is_active)
    );
  end if;

  return result;
end;
$$;

-- ---------- envío de sesiones: ahora también evalúa logros ----------
-- Igual que en la migración 0003, más la evaluación de logros al final y
-- 'achievements_unlocked' en la respuesta.
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
  new_achievements text[];
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
      'accuracy', round(existing.first_try_correct::numeric / existing.first_try_total, 3),
      'achievements_unlocked', '[]'::jsonb);
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
    return jsonb_build_object('session_id', p_session_id, 'duplicate', true,
                              'achievements_unlocked', '[]'::jsonb);
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

  new_achievements := public.evaluate_achievements(uid);

  return jsonb_build_object(
    'session_id', p_session_id, 'duplicate', false,
    'first_try_correct', first_correct, 'first_try_total', first_total, 'accuracy', accuracy,
    'duration_seconds', duration, 'time_zone', tz,
    'achievements_unlocked', (
      select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title_es, 'icon', a.icon)
                                order by a.position), '[]'::jsonb)
      from public.achievements a where a.id = any(new_achievements)));
end;
$$;

-- ---------- RLS y permisos ----------
alter table public.battles enable row level security;
alter table public.battle_players enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

revoke all on public.battles, public.battle_players, public.achievements, public.user_achievements
  from anon, authenticated;
grant select on public.battles, public.battle_players, public.achievements, public.user_achievements
  to authenticated;

create policy "battle players readable by owner" on public.battle_players
  for select to authenticated using (user_id = (select auth.uid()));
create policy "battles readable by participants" on public.battles
  for select to authenticated using (exists (
    select 1 from public.battle_players bp
    where bp.battle_id = battles.id and bp.user_id = (select auth.uid())));
create policy "achievements readable" on public.achievements
  for select to authenticated using (is_active);
create policy "user achievements readable by owner" on public.user_achievements
  for select to authenticated using (user_id = (select auth.uid()));

revoke all on function public.achievement_metrics(uuid) from public, anon;
grant execute on function public.achievement_metrics(uuid) to authenticated;
revoke all on function public.evaluate_achievements(uuid) from public, anon, authenticated;
revoke all on function public.get_my_achievements() from public, anon;
grant execute on function public.get_my_achievements() to authenticated;
revoke all on function public.get_match_history(integer, timestamptz) from public, anon;
grant execute on function public.get_match_history(integer, timestamptz) to authenticated;
revoke all on function public.get_public_profile(uuid) from public, anon;
grant execute on function public.get_public_profile(uuid) to authenticated;

-- ---------- logros ya alcanzados por usuarios existentes ----------
select public.evaluate_achievements(id) from public.profiles;
