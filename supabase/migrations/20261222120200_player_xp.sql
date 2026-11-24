-- =====================================================================
-- XP y nivel global del jugador (Perfil 2.0).
--
-- ESTADO: PREPARADA, NO APLICADA. No ejecutar en producción sin revisión (ver
-- docs/PROFILE_XP_LEVELS.md, "Plan de aplicación"). Rollback:
-- supabase/rollback/20261222120200_player_xp.down.sql.
--
-- Valores: shared/xp.ts (xp_config() y xp_level_need() los replican; supabase/tests/xp.test.mjs
-- compara ambos lados).
--
-- Diseño (mismo patrón que sync_polys en 20261031193836_polys_economy):
--   * El XP se DERIVA de lo que el servidor ya registró: learning_sessions (lecciones y repasos,
--     corregidos por el servidor), battles/battle_players (resultado escrito por el servidor de
--     partidas) y user_mission_rewards (cofre del día = desafío diario). La app no informa XP.
--   * No se agrega ningún trigger ni columna a learning_sessions, battles, battle_players ni a las
--     funciones de Learning Machine o Ranked: esta migración sólo LEE esas tablas.
--   * xp_events es el registro: clave única (user_id, source, ref) => nunca dos veces lo mismo.
--   * Los topes diarios se cuentan en xp_events (columna day), no con la zona horaria que manda la
--     app: cambiar de zona no habilita XP extra.
--   * sync_xp() acredita lo que falte; la app la llama al abrir y después de cada lección, repaso,
--     partida o cofre. Si nunca se llama, nada se pierde: se deriva la próxima vez (dentro del
--     margen de xp_config().lookbackDays días; la primera vez, toda la historia).
--   * No toca Polys, ELO, emparejamiento, temporadas ni recompensas existentes.
-- =====================================================================

-- ---------- tablas ----------
create table public.player_xp (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  total_xp integer not null default 0 check (total_xp >= 0),
  level integer not null default 1 check (level >= 1),
  -- false hasta la primera sincronización (que acredita la historia sin celebración).
  initialized boolean not null default false,
  -- Hasta dónde se miró la última vez (se vuelve a mirar desde synced_at - lookbackDays).
  synced_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.xp_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  source text not null check (source in
    ('lesson_first', 'lesson_repeat', 'review', 'ranked_win', 'ranked_loss', 'daily_challenge')),
  -- lesson_first: lesson_id · lesson_repeat/review: learning_sessions.id · ranked: battles.id ·
  -- daily_challenge: fecha de la misión.
  ref text not null check (char_length(ref) between 1 and 80),
  -- Día al que cuenta para los topes diarios.
  day date not null,
  amount integer not null check (amount > 0),
  created_at timestamptz not null default now(),
  unique (user_id, source, ref)
);

create index xp_events_user_day_idx on public.xp_events (user_id, day, source);

-- Cada nivel alcanzado, una vez: historial y clave idempotente para futuras recompensas por nivel.
create table public.player_level_ups (
  user_id uuid not null references public.profiles (id) on delete cascade,
  level integer not null check (level >= 2),
  reached_at timestamptz not null default now(),
  primary key (user_id, level)
);

alter table public.player_xp enable row level security;
alter table public.xp_events enable row level security;
alter table public.player_level_ups enable row level security;
revoke all on public.player_xp, public.xp_events, public.player_level_ups from anon, authenticated;
grant select on public.player_xp, public.xp_events, public.player_level_ups to authenticated;
create policy "player xp readable by owner" on public.player_xp
  for select to authenticated using (user_id = (select auth.uid()));
create policy "xp events readable by owner" on public.xp_events
  for select to authenticated using (user_id = (select auth.uid()));
create policy "level ups readable by owner" on public.player_level_ups
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------- configuración (espejo de shared/xp.ts) ----------
create or replace function public.xp_config()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object(
    'amounts', jsonb_build_object(
      'lesson_first', 20, 'lesson_repeat', 5, 'review', 10,
      'ranked_win', 30, 'ranked_loss', 10, 'daily_challenge', 40),
    'dailyCaps', jsonb_build_object('lesson_repeat', 10, 'review', 5, 'ranked', 10),
    'lookbackDays', 7,
    'curve', jsonb_build_object('base', 50, 'factor', 9, 'exponent', 1.2),
    'maxLevel', 500,
    'levelRewards', jsonb_build_array());
$$;

/** XP para pasar del nivel p_level al siguiente: redondeo a 5 de 50 + 9·(L−1)^1,2. */
create or replace function public.xp_level_need(p_level integer)
returns integer
language sql
immutable
set search_path = ''
as $$
  select (round((50 + 9 * power((greatest(p_level, 1) - 1)::double precision, 1.2)) / 5) * 5)::integer;
$$;

/** Nivel y progreso dentro del nivel: {total, level, into, need, remaining}. */
create or replace function public.xp_progress(p_total integer)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  total integer := greatest(coalesce(p_total, 0), 0);
  lvl integer := 1;
  floor_xp integer := 0;
  need integer;
begin
  loop
    exit when lvl >= 500;
    need := public.xp_level_need(lvl);
    exit when total < floor_xp + need;
    floor_xp := floor_xp + need;
    lvl := lvl + 1;
  end loop;
  need := case when lvl >= 500 then 0 else public.xp_level_need(lvl) end;
  return jsonb_build_object(
    'total', total,
    'level', lvl,
    'into', total - floor_xp,
    'need', need,
    'remaining', greatest(need - (total - floor_xp), 0));
end;
$$;

-- ---------- acreditar ----------
/**
 * Acredita una vez por (source, ref) respetando el tope diario del grupo (p_cap ganancias de
 * p_group en p_day; p_cap null = sin tope). Devuelve lo acreditado (0 si ya estaba o no entra).
 */
create or replace function public.xp_grant(
  p_user uuid, p_source text, p_ref text, p_day date, p_amount integer,
  p_cap integer, p_group text[]
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_cap is not null and (
    select count(*) from public.xp_events e
    where e.user_id = p_user and e.day = p_day and e.source = any (p_group)
  ) >= p_cap then
    return 0;
  end if;
  insert into public.xp_events (user_id, source, ref, day, amount)
  values (p_user, p_source, p_ref, p_day, p_amount)
  on conflict (user_id, source, ref) do nothing;
  if not found then
    return 0;
  end if;
  return p_amount;
end;
$$;

/**
 * Acredita el XP que falte y devuelve
 * {total, level, into, need, remaining, level_before, initial, granted: [{source, ref, amount}],
 *  granted_total}. La primera vez (initial = true) acredita la historia: la app no celebra.
 */
create or replace function public.sync_xp()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  cfg jsonb := public.xp_config();
  amounts jsonb := cfg -> 'amounts';
  caps jsonb := cfg -> 'dailyCaps';
  state public.player_xp;
  since timestamptz;
  started timestamptz := now();
  e record;
  got integer;
  granted jsonb := '[]'::jsonb;
  granted_total integer := 0;
  new_total integer;
  progress jsonb;
  ranked_group text[] := array['ranked_win', 'ranked_loss'];
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  insert into public.player_xp (user_id) values (uid) on conflict do nothing;
  -- El bloqueo serializa sincronizaciones simultáneas del mismo usuario (topes diarios exactos).
  select * into state from public.player_xp where user_id = uid for update;
  since := case when state.initialized and state.synced_at is not null
    then state.synced_at - make_interval(days => (cfg ->> 'lookbackDays')::int)
    else '-infinity'::timestamptz end;

  for e in
    with candidates as (
      -- lecciones: la primera sesión de cada lección da lesson_first; las demás, lesson_repeat
      select s.completed_at as at,
        case when exists (
          select 1 from public.learning_sessions o
          where o.user_id = uid and o.kind = 'lesson' and o.lesson_id = s.lesson_id
            and (o.completed_at, o.id) < (s.completed_at, s.id))
        then 'lesson_repeat' else 'lesson_first' end as source,
        s.id::text as session_ref, s.lesson_id as lesson_ref, s.local_date as day
      from public.learning_sessions s
      where s.user_id = uid and s.kind = 'lesson' and s.completed_at >= since
      union all
      select s.completed_at, 'review', s.id::text, null, s.local_date
      from public.learning_sessions s
      where s.user_id = uid and s.kind = 'review' and s.completed_at >= since
      union all
      -- ranked terminadas: ganar (también por abandono del rival) o perder/empatar jugando hasta el
      -- final; quien abandona no gana XP
      select b.ended_at,
        case when bp.result = 'win' then 'ranked_win' else 'ranked_loss' end,
        b.id::text, null, (b.ended_at at time zone 'UTC')::date
      from public.battle_players bp
      join public.battles b on b.id = bp.battle_id
      where bp.user_id = uid and b.is_ranked and b.status in ('completed', 'forfeited')
        and b.ended_at is not null and b.ended_at >= since
        and bp.result is not null
        and (bp.result = 'win' or not bp.forfeited)
      union all
      -- desafío diario: las 3 misiones del día completas (cofre abierto)
      select r.claimed_at, 'daily_challenge', r.mission_date::text, null, r.mission_date
      from public.user_mission_rewards r
      where r.user_id = uid and r.claimed_at >= since
    )
    select * from candidates order by at, session_ref
  loop
    got := case e.source
      when 'lesson_first' then public.xp_grant(uid, e.source, e.lesson_ref, e.day,
        (amounts ->> e.source)::int, null, null)
      when 'lesson_repeat' then public.xp_grant(uid, e.source, e.session_ref, e.day,
        (amounts ->> e.source)::int, (caps ->> 'lesson_repeat')::int, array['lesson_repeat'])
      when 'review' then public.xp_grant(uid, e.source, e.session_ref, e.day,
        (amounts ->> e.source)::int, (caps ->> 'review')::int, array['review'])
      when 'daily_challenge' then public.xp_grant(uid, e.source, e.session_ref, e.day,
        (amounts ->> e.source)::int, null, null)
      else public.xp_grant(uid, e.source, e.session_ref, e.day,
        (amounts ->> e.source)::int, (caps ->> 'ranked')::int, ranked_group)
    end;
    if got > 0 then
      granted_total := granted_total + got;
      -- La respuesta lleva el detalle sólo de lo reciente (la primera vez puede ser mucho).
      if state.initialized and jsonb_array_length(granted) < 20 then
        granted := granted || jsonb_build_object(
          'source', e.source,
          'ref', case when e.source = 'lesson_first' then e.lesson_ref else e.session_ref end,
          'amount', got);
      end if;
    end if;
  end loop;

  -- El total sale del registro (no se acumula a mano: no puede desviarse).
  select coalesce(sum(amount), 0)::int into new_total from public.xp_events where user_id = uid;
  progress := public.xp_progress(new_total);

  if (progress ->> 'level')::int > state.level then
    insert into public.player_level_ups (user_id, level)
    select uid, g from generate_series(state.level + 1, (progress ->> 'level')::int) g
    on conflict do nothing;
  end if;

  update public.player_xp set
    total_xp = new_total,
    level = (progress ->> 'level')::int,
    initialized = true,
    synced_at = started,
    updated_at = now()
  where user_id = uid;

  return progress || jsonb_build_object(
    'level_before', state.level,
    'initial', not state.initialized,
    'granted', granted,
    'granted_total', granted_total);
end;
$$;

revoke all on function public.xp_config() from public, anon;
grant execute on function public.xp_config() to authenticated;
revoke all on function public.xp_level_need(integer) from public, anon;
grant execute on function public.xp_level_need(integer) to authenticated;
revoke all on function public.xp_progress(integer) from public, anon;
grant execute on function public.xp_progress(integer) to authenticated;
revoke all on function public.xp_grant(uuid, text, text, date, integer, integer, text[])
  from public, anon, authenticated;
revoke all on function public.sync_xp() from public, anon;
grant execute on function public.sync_xp() to authenticated;
