-- Fase 2 del aprendizaje: presentación, corrección en el servidor y registro de intentos
-- (docs/LEARNING_ATTEMPTS_PHASE2.md). Va después de 20261108140000_learning_versions_required.sql.
--
-- Flujo (sólo lecciones; los repasos siguen por la ruta vieja, ver el documento §5):
--   1. learning_lesson_plan(user, lección): qué ubicaciones se van a mostrar, con su versión y su
--      conjunto vigentes y cuántas opciones tiene cada uno. La Edge Function learning-session calcula
--      el orden con polygo.shuffle.v1 (shared/shuffle.ts).
--   2. learning_start_lesson(user, sesión, lección, órdenes): registra una presentación por ubicación
--      (exercise_presentations) en una transacción. Idempotente por sesión: si ya existen, las
--      devuelve sin tocarlas.
--   3. learning_session_presentations(user, sesión): la fotografía inmutable de cada presentación
--      (exercise_presentation_snapshot). La Edge Function corrige con shared/grading.ts contra esa
--      versión, nunca contra exercises.
--   4. learning_submit_graded(user, sesión, …, intentos, correcciones): en UNA transacción, llama a
--      submit_learning_session sin cambiarla (SRS v1, progreso, energía, racha y logros siguen
--      saliendo de ahí, la única vía) con el veredicto del servidor, y después vincula cada intento
--      con su presentación (exercise_attempt_presentations) y su corrección
--      (exercise_attempt_gradings). Si cualquier paso falla (sin energía, lección incompleta,
--      corrección incoherente), no queda nada.
--
-- Las cuatro funciones son sólo para service_role: el usuario lo autentica la Edge Function
-- (auth.getUser) y lo pasa como p_user. submit_learning_session lee auth.uid(); para llamarla sin
-- modificarla, learning_submit_graded fija los claims del JWT al usuario autenticado sólo dentro de su
-- transacción (set_config local) y los restaura. Nadie más puede ejecutarla, así que no es un
-- contexto falsificable por el cliente.
--
-- Aditiva e idempotente: una tabla nueva y funciones nuevas; ninguna restricción nueva sobre tablas
-- existentes. No toca exercise_attempts, submit_learning_session,
-- apply_word_result, user_word_progress, Ranked ni ninguna versión publicada.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/attempts.test.mjs). NO aplicada en producción.

-- 1. Sin restricciones nuevas sobre exercise_presentations: su contrato (fase 1) admite varias
--    presentaciones de una ubicación por sesión. La idempotencia del inicio y la pertenencia de la
--    sesión a una sola cuenta las garantiza learning_start_lesson (bloqueo consultivo por sesión +
--    comprobación de lo ya registrado), que es la única vía de escritura de la ruta nueva.

-- 2. Correcciones del servidor. Una fila por intento de la ruta nueva; los intentos viejos no tienen
--    (siguen siendo client_reported, sin inventarles nada). Inmutable.
create table if not exists public.exercise_attempt_gradings (
  attempt_id bigint primary key references public.exercise_attempts (id) on delete cascade,
  presentation_id bigint not null references public.exercise_presentations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  session_id uuid not null,
  item_id text not null,
  item_version_id bigint not null,
  grading_mode_id text not null references public.ref_grading_modes (id),
  input_modality text not null references public.ref_input_modalities (id),
  -- Número de intento sobre esa presentación (1 = primer intento; la app permite 2 reintentos).
  attempt_no smallint not null check (attempt_no between 1 and 10),
  -- La respuesta tal como llegó (UserAnswer de shared/exercises.ts), acotada.
  response_kind text not null check (response_kind in ('option', 'tokens', 'pairs', 'text')),
  response jsonb not null
    check (jsonb_typeof(response) = 'object' and octet_length(response::text) <= 4096),
  -- exact_option: índice de la opción elegida dentro del conjunto (no de la posición en pantalla).
  selected_option smallint check (selected_option between 0 and 7),
  status text not null check (status in ('valid', 'invalid_response')),
  verdict text check (verdict in ('correct', 'typo', 'incorrect')),
  -- Lo que mostró la app al usuario; sólo para comparar, nunca decide nada.
  client_verdict text check (client_verdict in ('correct', 'typo', 'incorrect')),
  assists jsonb not null default '{}'::jsonb check (jsonb_typeof(assists) = 'object'),
  grader text not null check (grader ~ '^[A-Za-z0-9_./#-]{1,100}$'),
  grader_version text not null check (grader_version ~ '^[A-Za-z0-9_.+-]{1,40}$'),
  graded_at timestamptz not null default now(),
  constraint exercise_attempt_gradings_version_fkey
    foreign key (item_version_id, item_id) references public.exercise_item_versions (id, item_id),
  constraint exercise_attempt_gradings_presentation_no_key unique (presentation_id, attempt_no),
  constraint exercise_attempt_gradings_status_verdict_check check ((status = 'valid') = (verdict is not null))
);

create index if not exists exercise_attempt_gradings_user_idx
  on public.exercise_attempt_gradings (user_id, graded_at desc);
create index if not exists exercise_attempt_gradings_session_idx
  on public.exercise_attempt_gradings (session_id);
create index if not exists exercise_attempt_gradings_version_idx
  on public.exercise_attempt_gradings (item_version_id);

-- Lo registrado tiene que coincidir con el intento, la presentación y la versión: misma cuenta,
-- sesión y ubicación; la versión de la presentación; el modo y la entrada de esa versión; el
-- veredicto que quedó en exercise_attempts (lo que usó el SRS v1); el primer intento; la opción
-- elegida dentro del conjunto mostrado; ayudas sólo de ref_assists.
create or replace function public.exercise_attempt_gradings_check()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  a public.exercise_attempts;
  p public.exercise_presentations;
  v_mode text;
  v_modality text;
  v_kind_ok boolean;
  v_bad integer;
begin
  new.graded_at := now();
  select * into a from public.exercise_attempts where id = new.attempt_id;
  select * into p from public.exercise_presentations where id = new.presentation_id;
  if a.id is null or p.id is null
     or a.user_id is distinct from new.user_id or p.user_id is distinct from new.user_id
     or a.session_id is distinct from new.session_id or p.session_id is distinct from new.session_id
     or a.exercise_id is distinct from p.exercise_id
     or p.item_id is distinct from new.item_id or p.item_version_id is distinct from new.item_version_id then
    raise exception 'exercise_attempt_gradings: el intento % no corresponde a la presentación %', new.attempt_id, new.presentation_id
      using errcode = 'check_violation';
  end if;
  if not exists (select 1 from public.exercise_attempt_presentations l
                 where l.attempt_id = new.attempt_id and l.presentation_id = new.presentation_id) then
    raise exception 'exercise_attempt_gradings: el intento % no está vinculado a la presentación %', new.attempt_id, new.presentation_id
      using errcode = 'check_violation';
  end if;
  select grading_mode_id into v_mode from public.exercise_item_versions where id = new.item_version_id;
  select input_modality into v_modality from public.exercise_items where id = new.item_id;
  if new.grading_mode_id is distinct from v_mode or new.input_modality is distinct from v_modality then
    raise exception 'exercise_attempt_gradings: modo % o entrada % no son los de la versión %', new.grading_mode_id, new.input_modality, new.item_version_id
      using errcode = 'check_violation';
  end if;
  if new.response ->> 'kind' is distinct from new.response_kind then
    raise exception 'exercise_attempt_gradings: response_kind no coincide con la respuesta' using errcode = 'check_violation';
  end if;
  v_kind_ok := case v_mode
    when 'exact_option.v1' then new.response_kind = 'option'
    when 'normalized_text.v1' then new.response_kind in ('text', 'tokens')
    when 'pair_set.v1' then new.response_kind = 'pairs'
    else false end;
  if new.status = 'valid' and not v_kind_ok then
    raise exception 'exercise_attempt_gradings: una respuesta % no puede ser válida en %', new.response_kind, v_mode
      using errcode = 'check_violation';
  end if;
  if a.is_correct is distinct from (new.status = 'valid' and new.verdict in ('correct', 'typo'))
     or a.is_first_try is distinct from (new.attempt_no = 1) then
    raise exception 'exercise_attempt_gradings: el intento % guardó otro veredicto u otro primer intento', new.attempt_id
      using errcode = 'check_violation';
  end if;
  if (new.selected_option is not null) <> (v_mode = 'exact_option.v1' and new.status = 'valid')
     or (new.selected_option is not null and (
           p.option_order is null
           or not (new.selected_option = any (p.option_order))
           or (select s.options -> new.selected_option::integer ->> 'text'
               from public.exercise_option_sets s where s.id = p.option_set_id)
              is distinct from new.response ->> 'value')) then
    raise exception 'exercise_attempt_gradings: la opción elegida no es una de las mostradas en la presentación %', new.presentation_id
      using errcode = 'check_violation';
  end if;
  select count(*) into v_bad
  from jsonb_each(new.assists) x
  where not exists (select 1 from public.ref_assists r where r.id = x.key)
     or not (jsonb_typeof(x.value) = 'boolean'
             or (jsonb_typeof(x.value) = 'number' and (x.value)::text ~ '^[0-9]{1,4}$'));
  if v_bad > 0 then
    raise exception 'exercise_attempt_gradings: ayudas fuera de ref_assists o con valores inválidos' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

do $$
declare
  t record;
begin
  for t in select * from (values
    ('exercise_attempt_gradings_check', 'before insert', 'row', 'exercise_attempt_gradings_check'),
    ('exercise_attempt_gradings_immutable', 'before update or delete', 'row', 'learning_delete_only_cascade'),
    ('exercise_attempt_gradings_no_truncate', 'before truncate', 'statement', 'learning_delete_only_cascade')
  ) as x(name, timing, level, fn)
  loop
    if not exists (select 1 from pg_trigger
                   where tgrelid = 'public.exercise_attempt_gradings'::regclass and tgname = t.name) then
      execute format('create trigger %I %s on public.exercise_attempt_gradings for each %s execute function public.%I()',
                     t.name, t.timing, t.level, t.fn);
    end if;
  end loop;
end;
$$;

-- 3. Plan de una lección: las ubicaciones publicadas, en orden, con lo que se va a presentar.
--    Mismas comprobaciones que submit_learning_session (publicada y desbloqueada).
create or replace function public.learning_lesson_plan(p_user uuid, p_lesson_id text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (
    select 1 from public.lessons l join public.curriculum_units u on u.id = l.unit_id
    where l.id = p_lesson_id and l.is_published and u.is_published
  ) then
    raise exception 'lesson_not_found' using errcode = 'P0002';
  end if;
  if not public.is_lesson_unlocked(p_user, p_lesson_id) then
    raise exception 'lesson_locked' using errcode = '42501';
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
             'exercise_id', e.id, 'position', e.position, 'item_id', e.item_id,
             'item_version_id', e.item_version_id, 'option_set_id', e.option_set_id,
             'option_count', jsonb_array_length(s.options))
           order by e.position, e.id)
    from public.exercises e
    left join public.exercise_option_sets s on s.id = e.option_set_id
    where e.lesson_id = p_lesson_id and e.is_published), '[]'::jsonb);
end;
$$;

-- Lo que la app necesita para mostrar cada presentación (sin respuesta ni corrección).
create or replace function public.learning_presentations_public(p_user uuid, p_session_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'presentation_id', p.id, 'exercise_id', p.exercise_id, 'position', p.position,
           'item_id', p.item_id, 'item_version_id', p.item_version_id,
           'option_set_id', p.option_set_id, 'option_order', to_jsonb(p.option_order),
           'options_shown', (
             select jsonb_agg(s.options -> o.idx::integer ->> 'text' order by o.pos)
             from public.exercise_option_sets s,
                  unnest(p.option_order) with ordinality as o(idx, pos)
             where s.id = p.option_set_id),
           'presented_at', p.presented_at)
         order by p.position, p.id), '[]'::jsonb)
  from public.exercise_presentations p
  where p.user_id = p_user and p.session_id = p_session_id
$$;

-- 4. Inicio: registra las presentaciones de la lección en una transacción. p_orders:
--    {"<exercise_id>": [2,0,3,1], …} para las ubicaciones con conjunto de opciones, y sólo esas.
create or replace function public.learning_start_lesson(
  p_user uuid, p_session_id uuid, p_lesson_id text, p_orders jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner uuid;
  v_plan jsonb;
  v_expected text[];
  v_given text[];
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_session_id is null or jsonb_typeof(p_orders) is distinct from 'object' then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  -- Dos inicios concurrentes de la misma sesión se ordenan; el segundo ve las filas del primero.
  perform pg_advisory_xact_lock(hashtextextended('learning_session:' || p_session_id::text, 0));

  select user_id into v_owner from public.learning_sessions where id = p_session_id;
  if found then
    if v_owner <> p_user then
      raise exception 'session_conflict' using errcode = '23505';
    end if;
    raise exception 'session_closed' using errcode = '22023';
  end if;
  if exists (select 1 from public.exercise_presentations where session_id = p_session_id and user_id <> p_user) then
    raise exception 'session_conflict' using errcode = '23505';
  end if;

  v_plan := public.learning_lesson_plan(p_user, p_lesson_id);
  if jsonb_array_length(v_plan) = 0 then
    raise exception 'lesson_not_found' using errcode = 'P0002';
  end if;

  -- Reintento: devuelve lo ya registrado, sin recalcularlo con el contenido de hoy.
  if exists (select 1 from public.exercise_presentations where session_id = p_session_id) then
    if exists (select 1 from public.exercise_presentations p
               left join public.exercises e on e.id = p.exercise_id
               where p.session_id = p_session_id and e.lesson_id is distinct from p_lesson_id) then
      raise exception 'session_conflict' using errcode = '23505';
    end if;
    return jsonb_build_object('session_id', p_session_id, 'duplicate', true,
      'presentations', public.learning_presentations_public(p_user, p_session_id));
  end if;

  select coalesce(array_agg(x ->> 'exercise_id' order by x ->> 'exercise_id'), '{}')
    into v_expected
  from jsonb_array_elements(v_plan) x where x ->> 'option_set_id' is not null;
  select coalesce(array_agg(k order by k), '{}') into v_given from jsonb_object_keys(p_orders) k;
  if v_expected <> v_given
     or exists (select 1 from jsonb_each(p_orders) o where jsonb_typeof(o.value) <> 'array') then
    raise exception 'invalid_orders' using errcode = '22023';
  end if;

  insert into public.exercise_presentations (user_id, session_id, position, item_id, item_version_id,
    exercise_id, option_set_id, option_order, shuffle_algorithm, shuffle_seed)
  select p_user, p_session_id, (x ->> 'position')::smallint, x ->> 'item_id',
         (x ->> 'item_version_id')::bigint, x ->> 'exercise_id', (x ->> 'option_set_id')::bigint,
         case when x ->> 'option_set_id' is not null then
           (select array_agg(v::smallint order by n)
            from jsonb_array_elements_text(p_orders -> (x ->> 'exercise_id')) with ordinality as t(v, n)) end,
         case when x ->> 'option_set_id' is not null then 'polygo.shuffle.v1' end,
         case when x ->> 'option_set_id' is not null then p_session_id::text || ':' || (x ->> 'exercise_id') end
  from jsonb_array_elements(v_plan) with ordinality as t(x, ord)
  order by ord;

  return jsonb_build_object('session_id', p_session_id, 'duplicate', false,
    'presentations', public.learning_presentations_public(p_user, p_session_id));
end;
$$;

-- 5. Fotografías completas de las presentaciones de una sesión, para corregir.
create or replace function public.learning_session_presentations(p_user uuid, p_session_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(public.exercise_presentation_snapshot(p.id) || jsonb_build_object(
           'input_modality', i.input_modality, 'grading_mode_id', v.grading_mode_id,
           'option_texts', (select jsonb_agg(o -> 'text' order by n)
                            from public.exercise_option_sets s,
                                 jsonb_array_elements(s.options) with ordinality as t(o, n)
                            where s.id = p.option_set_id))
         order by p.position, p.id), '[]'::jsonb)
  from public.exercise_presentations p
  join public.exercise_items i on i.id = p.item_id
  join public.exercise_item_versions v on v.id = p.item_version_id
  where p.user_id = p_user and p.session_id = p_session_id
$$;

-- Resultado de una sesión ya corregida (reenvíos): los veredictos guardados, en orden.
create or replace function public.learning_session_verdicts(p_session_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'presentation_id', g.presentation_id, 'exercise_id', a.exercise_id,
           'attempt_no', g.attempt_no, 'status', g.status, 'verdict', g.verdict)
         order by a.id), '[]'::jsonb)
  from public.exercise_attempts a
  join public.exercise_attempt_gradings g on g.attempt_id = a.id
  where a.session_id = p_session_id
$$;

-- 6. Envío corregido. p_attempts tiene el formato de submit_learning_session ({exercise_id, answer,
--    correct, first_try, response_ms}); p_gradings, uno por intento y en el mismo orden:
--    {presentation_id, attempt_no, response, status, verdict, client_verdict, selected_option, assists}.
--    p_grader: {grader, grader_version}.
create or replace function public.learning_submit_graded(
  p_user uuid, p_session_id uuid, p_lesson_id text, p_started_at timestamptz, p_time_zone text,
  p_attempts jsonb, p_gradings jsonb, p_grader jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner uuid;
  v_first public.learning_sessions;
  v_result jsonb;
  v_prev_sub text := current_setting('request.jwt.claim.sub', true);
  v_prev_claims text := current_setting('request.jwt.claims', true);
  v_n integer;
  v_ids bigint[];
  v_bad integer;
begin
  if p_user is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if jsonb_typeof(p_attempts) is distinct from 'array' or jsonb_typeof(p_gradings) is distinct from 'array'
     or jsonb_array_length(p_attempts) <> jsonb_array_length(p_gradings)
     or jsonb_typeof(p_grader) is distinct from 'object' then
    raise exception 'invalid_request' using errcode = '22023';
  end if;
  v_n := jsonb_array_length(p_attempts);
  perform pg_advisory_xact_lock(hashtextextended('learning_session:' || p_session_id::text, 0));

  -- Idempotencia: el mismo id devuelve lo ya registrado, con los veredictos del servidor.
  select * into v_first from public.learning_sessions where id = p_session_id;
  if found then
    if v_first.user_id <> p_user then
      raise exception 'session_conflict' using errcode = '23505';
    end if;
    return jsonb_build_object(
      'session_id', v_first.id, 'duplicate', true,
      'first_try_correct', v_first.first_try_correct, 'first_try_total', v_first.first_try_total,
      'accuracy', round(v_first.first_try_correct::numeric / nullif(v_first.first_try_total, 0), 3),
      'achievements_unlocked', '[]'::jsonb,
      'verdicts', public.learning_session_verdicts(p_session_id));
  end if;

  select user_id into v_owner from public.exercise_presentations where session_id = p_session_id limit 1;
  if v_owner is null then
    raise exception 'presentations_not_found' using errcode = 'P0002';
  end if;
  if v_owner <> p_user then
    raise exception 'session_conflict' using errcode = '23505';
  end if;

  -- Cada corrección apunta a una presentación de esta sesión y de esta cuenta, de la misma ubicación
  -- que su intento, y el intento lleva el veredicto y el primer intento que dice la corrección.
  select count(*) into v_bad
  from jsonb_array_elements(p_attempts) with ordinality as a(x, n)
  join jsonb_array_elements(p_gradings) with ordinality as g(y, m) on m = n
  left join public.exercise_presentations p
    on p.id = (g.y ->> 'presentation_id')::bigint and p.user_id = p_user and p.session_id = p_session_id
  where p.id is null
     or p.exercise_id is distinct from a.x ->> 'exercise_id'
     or (a.x ->> 'correct')::boolean is distinct from
        (g.y ->> 'status' = 'valid' and g.y ->> 'verdict' in ('correct', 'typo'))
     or (a.x ->> 'first_try')::boolean is distinct from ((g.y ->> 'attempt_no')::integer = 1);
  if v_bad > 0 then
    raise exception 'invalid_gradings' using errcode = '22023';
  end if;

  -- submit_learning_session tal cual (SRS v1 y recompensas), como el usuario autenticado.
  perform set_config('request.jwt.claim.sub', p_user::text, true);
  perform set_config('request.jwt.claims',
                     jsonb_build_object('sub', p_user, 'role', 'authenticated')::text, true);
  v_result := public.submit_learning_session(p_session_id, 'lesson', p_lesson_id, p_started_at,
                                             p_attempts, p_time_zone);
  perform set_config('request.jwt.claim.sub', coalesce(v_prev_sub, ''), true);
  perform set_config('request.jwt.claims', coalesce(v_prev_claims, ''), true);

  if coalesce((v_result ->> 'duplicate')::boolean, false) then
    -- No puede pasar con el bloqueo de arriba; si pasara, no se duplica nada.
    return v_result || jsonb_build_object('verdicts', public.learning_session_verdicts(p_session_id));
  end if;

  -- Los intentos que acaba de insertar, en orden, y su coincidencia exacta con lo enviado.
  select array_agg(id order by id) into v_ids from public.exercise_attempts where session_id = p_session_id;
  if coalesce(array_length(v_ids, 1), 0) <> v_n then
    raise exception 'attempts_mismatch' using errcode = '22023';
  end if;
  select count(*) into v_bad
  from public.parse_learning_attempts(p_attempts) i
  join public.exercise_attempts ea on ea.id = v_ids[i.ord]
  where ea.exercise_id is distinct from i.exercise_id or ea.answer is distinct from i.answer
     or ea.is_correct is distinct from i.is_correct or ea.is_first_try is distinct from i.is_first_try
     or ea.response_ms is distinct from i.response_ms;
  if v_bad > 0 then
    raise exception 'attempts_mismatch' using errcode = '22023';
  end if;

  insert into public.exercise_attempt_presentations (attempt_id, presentation_id)
  select v_ids[g.m], (g.y ->> 'presentation_id')::bigint
  from jsonb_array_elements(p_gradings) with ordinality as g(y, m)
  order by g.m;

  insert into public.exercise_attempt_gradings (attempt_id, presentation_id, user_id, session_id,
    item_id, item_version_id, grading_mode_id, input_modality, attempt_no, response_kind, response,
    selected_option, status, verdict, client_verdict, assists, grader, grader_version)
  select v_ids[g.m], p.id, p_user, p_session_id, p.item_id, p.item_version_id, v.grading_mode_id,
         i.input_modality, (g.y ->> 'attempt_no')::smallint, g.y -> 'response' ->> 'kind', g.y -> 'response',
         (g.y ->> 'selected_option')::smallint, g.y ->> 'status', g.y ->> 'verdict',
         g.y ->> 'client_verdict', coalesce(g.y -> 'assists', '{}'::jsonb),
         p_grader ->> 'grader', p_grader ->> 'grader_version'
  from jsonb_array_elements(p_gradings) with ordinality as g(y, m)
  join public.exercise_presentations p on p.id = (g.y ->> 'presentation_id')::bigint
  join public.exercise_item_versions v on v.id = p.item_version_id
  join public.exercise_items i on i.id = p.item_id
  order by g.m;

  return v_result || jsonb_build_object('verdicts', public.learning_session_verdicts(p_session_id));
end;
$$;

-- 7. Seguridad: RLS sin políticas; tabla y funciones sólo para service_role.
alter table public.exercise_attempt_gradings enable row level security;
revoke all on public.exercise_attempt_gradings from anon, authenticated;

revoke execute on function public.exercise_attempt_gradings_check(),
  public.learning_lesson_plan(uuid, text),
  public.learning_presentations_public(uuid, uuid),
  public.learning_start_lesson(uuid, uuid, text, jsonb),
  public.learning_session_presentations(uuid, uuid),
  public.learning_session_verdicts(uuid),
  public.learning_submit_graded(uuid, uuid, text, timestamptz, text, jsonb, jsonb, jsonb)
  from public, anon, authenticated;

grant execute on function public.learning_start_lesson(uuid, uuid, text, jsonb),
  public.learning_lesson_plan(uuid, text),
  public.learning_session_presentations(uuid, uuid),
  public.learning_submit_graded(uuid, uuid, text, timestamptz, text, jsonb, jsonb, jsonb)
  to service_role;
