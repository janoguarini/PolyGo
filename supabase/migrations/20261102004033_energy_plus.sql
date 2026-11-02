-- Energía de las lecciones guiadas y PolyGo Plus.
-- Valores: shared/energy.ts (energy_config() los replica; un test compara ambos).
--
-- Sólo completar una lección guiada gasta energía: entrar, abandonar o equivocarse no, y ranked,
-- repasos y lo social nunca. Todo se calcula con el reloj del servidor (now()), así que cambiar la
-- hora del teléfono no recarga nada, y es igual en todos los dispositivos.
--
-- Plus se lee de user_entitlements, que el cliente no puede escribir: sólo service_role (el futuro
-- webhook de la tienda) o un otorgamiento manual desde el dashboard. Las compras todavía no están
-- integradas (ver docs/PLUS.md).

create table public.user_energy (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  -- Energía que había en anchor_at; desde ahí se suma una unidad por cada intervalo de recarga
  -- hasta el máximo. Sin fila = energía llena.
  units integer not null check (units >= 0),
  anchor_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create table public.user_entitlements (
  user_id uuid not null references public.profiles (id) on delete cascade,
  entitlement text not null check (entitlement in ('plus')),
  -- Quién lo otorgó: la tienda (vía webhook con service_role) o a mano desde el dashboard.
  source text not null check (source in ('app_store', 'play_store', 'manual')),
  starts_at timestamptz not null default now(),
  -- null = sin vencimiento (sólo para otorgamientos manuales).
  expires_at timestamptz,
  -- Id de la suscripción original en la tienda, para conciliar renovaciones y reembolsos.
  external_id text,
  updated_at timestamptz not null default now(),
  primary key (user_id, entitlement)
);

alter table public.user_energy enable row level security;
alter table public.user_entitlements enable row level security;
revoke all on public.user_energy, public.user_entitlements from anon, authenticated;
grant select on public.user_energy, public.user_entitlements to authenticated;
create policy "energy readable by owner" on public.user_energy
  for select to authenticated using (user_id = (select auth.uid()));
create policy "entitlements readable by owner" on public.user_entitlements
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------- configuración (espejo de shared/energy.ts) ----------
create or replace function public.energy_config()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object('max', 5, 'regenSeconds', 10800, 'lessonCost', 1)
$$;

-- ---------- Plus ----------
create or replace function public.has_plus(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_entitlements e
    where e.user_id = p_user and e.entitlement = 'plus'
      and e.starts_at <= now() and (e.expires_at is null or e.expires_at > now()))
$$;

-- ---------- energía ----------
/** Energía de p_user en p_at y el ancla desde la que corre la próxima recarga (sin escribir). */
create or replace function public.energy_now(p_user uuid, p_at timestamptz,
  out out_units integer, out out_anchor timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  cfg jsonb := public.energy_config();
  max_units int := (cfg ->> 'max')::int;
  regen int := (cfg ->> 'regenSeconds')::int;
  saved public.user_energy;
  gained int;
begin
  select * into saved from public.user_energy e where e.user_id = p_user;
  if not found then
    out_units := max_units;
    out_anchor := p_at;
    return;
  end if;
  -- Un ancla en el futuro no da energía (sólo la escribe el servidor, no debería pasar).
  gained := greatest(floor(extract(epoch from (p_at - saved.anchor_at)) / regen)::int, 0);
  if saved.units + gained >= max_units then
    -- Llena: el reloj de recarga no corre hasta que se vuelva a gastar.
    out_units := max_units;
    out_anchor := p_at;
  else
    out_units := saved.units + gained;
    out_anchor := saved.anchor_at + make_interval(secs => gained * regen);
  end if;
end;
$$;

/**
 * Gasta la energía de una lección terminada. Devuelve la que queda (null con Plus).
 * Lanza no_energy si no alcanza. Sólo la llama submit_learning_session.
 */
create or replace function public.consume_lesson_energy(p_user uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  cost int := (public.energy_config() ->> 'lessonCost')::int;
  cur record;
begin
  if public.has_plus(p_user) then
    return null;
  end if;
  insert into public.user_energy (user_id, units, anchor_at)
  values (p_user, (public.energy_config() ->> 'max')::int, now())
  on conflict (user_id) do nothing;
  -- Bloquea la fila: dos lecciones terminadas a la vez en dos dispositivos no gastan la misma unidad.
  perform 1 from public.user_energy where user_id = p_user for update;
  select * into cur from public.energy_now(p_user, now());
  if cur.out_units < cost then
    raise exception 'no_energy' using errcode = 'P0001';
  end if;
  update public.user_energy
     set units = cur.out_units - cost, anchor_at = cur.out_anchor, updated_at = now()
   where user_id = p_user;
  return cur.out_units - cost;
end;
$$;

/** Estado para la app: energía, cuándo se recupera y si hay Plus. Todo con la hora del servidor. */
create or replace function public.get_energy()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  cfg jsonb := public.energy_config();
  max_units int := (cfg ->> 'max')::int;
  regen int := (cfg ->> 'regenSeconds')::int;
  plus boolean;
  cur record;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  plus := public.has_plus(uid);
  select * into cur from public.energy_now(uid, now());
  return jsonb_build_object(
    'plus', plus,
    'plus_expires_at', (select e.expires_at from public.user_entitlements e
                        where e.user_id = uid and e.entitlement = 'plus' and plus),
    'energy', cur.out_units,
    'max', max_units,
    'regen_seconds', regen,
    'lesson_cost', (cfg ->> 'lessonCost')::int,
    'next_unit_at', case when plus or cur.out_units >= max_units then null
                         else cur.out_anchor + make_interval(secs => regen) end,
    'full_at', case when plus or cur.out_units >= max_units then null
                    else cur.out_anchor + make_interval(secs => regen * (max_units - cur.out_units)) end,
    'server_now', now());
end;
$$;

-- ---------- lecciones: submit_learning_session gasta energía al guardar ----------
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
  energy_left integer;
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

  -- Completar una lección guiada gasta energía (con Plus es ilimitada). Si no alcanza, la excepción
  -- revierte toda la sesión: nada queda guardado a medias. Repasos y reintentos no gastan.
  if p_kind = 'lesson' then
    energy_left := public.consume_lesson_energy(uid);
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
    'energy_left', energy_left,
    'achievements_unlocked', (
      select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title_es, 'icon', a.icon)
                                order by a.position), '[]'::jsonb)
      from public.achievements a where a.id = any(new_achievements)));
end;
$$;

revoke all on function public.energy_config() from public, anon;
grant execute on function public.energy_config() to authenticated;
revoke all on function public.has_plus(uuid) from public, anon, authenticated;
revoke all on function public.energy_now(uuid, timestamptz) from public, anon, authenticated;
revoke all on function public.consume_lesson_energy(uuid) from public, anon, authenticated;
revoke all on function public.get_energy() from public, anon;
grant execute on function public.get_energy() to authenticated;
