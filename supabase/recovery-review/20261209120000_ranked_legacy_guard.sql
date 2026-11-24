-- =====================================================================
-- Ranked 2.0 · Etapa 1: integridad de partidas (docs/RANKED_INTEGRITY.md).
--
-- Problema: el Ranked viejo sin servidor de partidas (start_bot_match → finish_bot_match;
-- join_human_queue → finish_human_match) liquida ELO con el puntaje que INFORMA EL TELÉFONO. La base
-- sólo valida rangos (≤ 180 por acierto, ≥ 70 s). Un cliente modificado puede fabricar victorias.
-- El servidor de partidas (server/) ya es la autoridad: corrige, mide el tiempo, puntúa y liquida con
-- settle_battle (sólo service_role). Esta migración prepara el cierre del flujo viejo SIN romper las
-- builds que todavía lo usan.
--
-- 1. Interruptor `ranked_legacy_switch` (una fila). ABIERTO al aplicar esta migración: aplicarla no
--    cambia nada para ningún cliente. Se cierra con `select public.close_legacy_ranked('motivo')`
--    (supabase/pending/ranked_legacy_close.sql) cuando la app publicada use el servidor de partidas,
--    y se reabre al instante con `public.reopen_legacy_ranked('motivo')`. Sin fila = cerrado.
--
-- 2. Las cinco RPC del Ranked viejo pasan a ser envoltorios con la MISMA firma, el mismo retorno y los
--    mismos permisos. El cuerpo original se mueve intacto al esquema privado `ranked_legacy` (sin
--    permisos para anon/authenticated/service_role; PostgREST no lo expone):
--      start_bot_match, finish_bot_match, join_human_queue, leave_human_queue → cerradas del todo.
--      finish_human_match → cerrada sólo para partidas ranked: los desafíos con amigos (is_ranked =
--      false: no mueven ELO, ni logros, ni Polys por resultado) siguen por Supabase.
--    Cerrado, responden `protocol_mismatch` con errcode 42501: la app (botMatchApi.legacyRankedError)
--    ya lo traduce al aviso de actualizar.
--
-- 3. Al cerrar: las partidas ranked del flujo viejo que estén abiertas se CANCELAN (sin ELO, sin
--    derrota y sin consumir cupo de calibración: no es un castigo) y la cola vieja se vacía. Cada
--    apertura/cierre queda en `ranked_legacy_switch_log`.
--
-- 4. Resultados inmutables (para todos los caminos, también el servidor y la service_role):
--    * battles terminada (completed/forfeited/cancelled): no cambian estado, cierre, idioma, temporada,
--      modo, si es ranked o con bot, ni sus preguntas/guion.
--    * battle_players de una partida terminada: no cambia nada, salvo user_id → NULL (borrado de
--      cuenta, on delete set null).
--    * rating_history: nunca se modifica (se inserta o se borra con la cuenta).
--    Reparaciones de datos excepcionales: `alter table ... disable trigger ...` por el dueño, a mano y
--    documentado.
--
-- Reversión: supabase/rollback/20261209120000_ranked_legacy_guard.down.sql.
-- ESTADO: escrita y probada en PGlite (supabase/tests/rankedlegacy.test.mjs). NO aplicada.
-- Idempotente.
-- =====================================================================

-- ---------- 1. Interruptor ----------

create table if not exists public.ranked_legacy_switch (
  id boolean primary key default true check (id),
  -- true = el flujo viejo (puntaje informado por el teléfono) sigue abierto.
  client_scoring_open boolean not null default true,
  changed_at timestamptz not null default now(),
  note text
);

insert into public.ranked_legacy_switch (id, client_scoring_open, note)
values (true, true, 'Etapa 1: instalado abierto (sin cambios para las builds existentes)')
on conflict (id) do nothing;

create table if not exists public.ranked_legacy_switch_log (
  id bigint generated always as identity primary key,
  client_scoring_open boolean not null,
  note text,
  cancelled_battles integer not null default 0,
  cleared_queue integer not null default 0,
  changed_by text not null default current_user,
  changed_at timestamptz not null default now()
);

alter table public.ranked_legacy_switch enable row level security;
alter table public.ranked_legacy_switch_log enable row level security;
revoke all on public.ranked_legacy_switch, public.ranked_legacy_switch_log from public, anon, authenticated;
-- El servidor de partidas puede leer el estado (p. ej. para /health); sólo el dueño lo cambia.
revoke all on public.ranked_legacy_switch, public.ranked_legacy_switch_log from service_role;
grant select on public.ranked_legacy_switch, public.ranked_legacy_switch_log to service_role;

/** true mientras el flujo viejo siga abierto. Sin fila = cerrado (lo seguro). */
create or replace function public.ranked_legacy_open()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select s.client_scoring_open from public.ranked_legacy_switch s where s.id), false);
$$;

/** Corta la llamada si el flujo viejo está cerrado. La app lo muestra como «actualizá la app». */
create or replace function public.ranked_legacy_guard()
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.ranked_legacy_open() then
    raise exception 'protocol_mismatch'
      using errcode = '42501',
            detail = 'legacy_ranked_closed',
            hint = 'Ranked se juega con el servidor de partidas: actualizá la app.';
  end if;
end;
$$;

-- ---------- 2. Cuerpos originales al esquema privado ----------

create schema if not exists ranked_legacy;
revoke all on schema ranked_legacy from public, anon, authenticated, service_role;

do $$
declare
  sig text;
begin
  foreach sig in array array[
    'start_bot_match()',
    'finish_bot_match(uuid, integer, integer, integer, boolean)',
    'join_human_queue()',
    'leave_human_queue()',
    'finish_human_match(uuid, integer, integer, integer, boolean)'
  ] loop
    -- Idempotente: sólo se mueve si todavía no se movió (después, public.<f> es el envoltorio).
    if to_regprocedure('ranked_legacy.' || sig) is null then
      execute format('alter function public.%s set schema ranked_legacy', sig);
    end if;
    execute format('revoke all on function ranked_legacy.%s from public, anon, authenticated, service_role', sig);
  end loop;
end;
$$;

-- ---------- Envoltorios (misma firma, retorno y permisos que antes) ----------

create or replace function public.start_bot_match()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.ranked_legacy_guard();
  return ranked_legacy.start_bot_match();
end;
$$;

create or replace function public.finish_bot_match(
  p_battle_id uuid, p_score integer, p_correct integer, p_answered integer, p_forfeit boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.ranked_legacy_guard();
  return ranked_legacy.finish_bot_match(p_battle_id, p_score, p_correct, p_answered, p_forfeit);
end;
$$;

create or replace function public.join_human_queue()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.ranked_legacy_guard();
  return ranked_legacy.join_human_queue();
end;
$$;

create or replace function public.leave_human_queue()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.ranked_legacy_guard();
  return ranked_legacy.leave_human_queue();
end;
$$;

-- Los desafíos con amigos (no ranked) siguen: sólo se corta una partida ranked del flujo viejo.
create or replace function public.finish_human_match(
  p_battle_id uuid, p_score integer, p_correct integer, p_answered integer, p_forfeit boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (select 1 from public.battles b where b.id = p_battle_id and b.is_ranked) then
    perform public.ranked_legacy_guard();
  end if;
  return ranked_legacy.finish_human_match(p_battle_id, p_score, p_correct, p_answered, p_forfeit);
end;
$$;

revoke all on function public.start_bot_match() from public, anon;
grant execute on function public.start_bot_match() to authenticated;
revoke all on function public.finish_bot_match(uuid, integer, integer, integer, boolean) from public, anon;
grant execute on function public.finish_bot_match(uuid, integer, integer, integer, boolean) to authenticated;
revoke all on function public.join_human_queue() from public, anon;
grant execute on function public.join_human_queue() to authenticated;
revoke all on function public.leave_human_queue() from public, anon;
grant execute on function public.leave_human_queue() to authenticated;
revoke all on function public.finish_human_match(uuid, integer, integer, integer, boolean) from public, anon;
grant execute on function public.finish_human_match(uuid, integer, integer, integer, boolean) to authenticated;

revoke all on function public.ranked_legacy_open() from public, anon, authenticated;
grant execute on function public.ranked_legacy_open() to service_role;
revoke all on function public.ranked_legacy_guard() from public, anon, authenticated, service_role;

-- ---------- 3. Cerrar / reabrir (sólo el dueño de la base: SQL editor o migración) ----------

/**
 * Cierra el flujo viejo: interruptor en false, partidas ranked viejas abiertas canceladas (sin ELO ni
 * derrota) y cola vieja vaciada. Idempotente. Devuelve {open, cancelled_battles, cleared_queue}.
 */
create or replace function public.close_legacy_ranked(p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  n_battles integer;
  n_queue integer;
begin
  insert into public.ranked_legacy_switch (id, client_scoring_open, changed_at, note)
  values (true, false, now(), p_note)
  on conflict (id) do update set client_scoring_open = false, changed_at = now(), note = excluded.note;

  -- Flujo viejo = guion de bot (start_bot_match) o preguntas guardadas (join_human_queue). Las del
  -- servidor de partidas no tienen ninguna de las dos (ver 20261106150000_stale_sweep_server_only).
  with c as (
    update public.battles set status = 'cancelled', ended_at = greatest(now(), coalesce(started_at, now()))
    where is_ranked
      and status not in ('completed', 'forfeited', 'cancelled')
      and (bot_script is not null or questions is not null)
    returning 1
  )
  select count(*)::int into n_battles from c;

  with q as (
    update public.ranked_queue set active = false where active returning 1
  )
  select count(*)::int into n_queue from q;

  insert into public.ranked_legacy_switch_log (client_scoring_open, note, cancelled_battles, cleared_queue)
  values (false, p_note, n_battles, n_queue);

  return jsonb_build_object('open', false, 'cancelled_battles', n_battles, 'cleared_queue', n_queue);
end;
$$;

/** Reabre el flujo viejo (vuelta atrás inmediata, sin migración). */
create or replace function public.reopen_legacy_ranked(p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.ranked_legacy_switch (id, client_scoring_open, changed_at, note)
  values (true, true, now(), p_note)
  on conflict (id) do update set client_scoring_open = true, changed_at = now(), note = excluded.note;
  insert into public.ranked_legacy_switch_log (client_scoring_open, note) values (true, p_note);
  return jsonb_build_object('open', true);
end;
$$;

revoke all on function public.close_legacy_ranked(text) from public, anon, authenticated, service_role;
revoke all on function public.reopen_legacy_ranked(text) from public, anon, authenticated, service_role;

-- ---------- 4. Resultados inmutables ----------

/** Una partida terminada no cambia lo que define su resultado. */
create or replace function public.battles_result_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status in ('completed', 'forfeited', 'cancelled')
     and (new.status, new.ended_at, new.is_ranked, new.has_bot, new.mode, new.language_code,
          new.season_id, new.bot_script, new.questions)
         is distinct from
         (old.status, old.ended_at, old.is_ranked, old.has_bot, old.mode, old.language_code,
          old.season_id, old.bot_script, old.questions) then
    raise exception 'battle_result_immutable' using errcode = '55000',
      detail = format('battle %s ya terminó (%s)', old.id, old.status);
  end if;
  return new;
end;
$$;

/** Los jugadores de una partida terminada no cambian; sólo se anonimizan al borrar la cuenta. */
create or replace function public.battle_players_result_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  same public.battle_players;
begin
  if exists (select 1 from public.battles b
             where b.id = old.battle_id and b.status in ('completed', 'forfeited', 'cancelled')) then
    same := new;
    if new.user_id is null then
      same.user_id := old.user_id;
    end if;
    if same is distinct from old then
      raise exception 'battle_result_immutable' using errcode = '55000',
        detail = format('battle %s ya terminó', old.battle_id);
    end if;
  end if;
  return new;
end;
$$;

/** El historial de rating sólo se inserta (o se borra con la cuenta). */
create or replace function public.rating_history_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'rating_history_immutable' using errcode = '55000';
end;
$$;

drop trigger if exists battles_result_immutable on public.battles;
create trigger battles_result_immutable
  before update on public.battles
  for each row execute function public.battles_result_immutable();

drop trigger if exists battle_players_result_immutable on public.battle_players;
create trigger battle_players_result_immutable
  before update on public.battle_players
  for each row execute function public.battle_players_result_immutable();

drop trigger if exists rating_history_immutable on public.rating_history;
create trigger rating_history_immutable
  before update on public.rating_history
  for each row execute function public.rating_history_immutable();

revoke all on function public.battles_result_immutable() from public, anon, authenticated, service_role;
revoke all on function public.battle_players_result_immutable() from public, anon, authenticated, service_role;
revoke all on function public.rating_history_immutable() from public, anon, authenticated, service_role;

-- ---------- Comprobación ----------

do $$
begin
  if not public.ranked_legacy_open() then
    raise exception 'ranked_legacy_guard: el interruptor tiene que quedar ABIERTO al instalarse';
  end if;
  if to_regprocedure('ranked_legacy.finish_bot_match(uuid, integer, integer, integer, boolean)') is null
     or to_regprocedure('ranked_legacy.start_bot_match()') is null
     or to_regprocedure('ranked_legacy.join_human_queue()') is null
     or to_regprocedure('ranked_legacy.leave_human_queue()') is null
     or to_regprocedure('ranked_legacy.finish_human_match(uuid, integer, integer, integer, boolean)') is null then
    raise exception 'ranked_legacy_guard: falta un cuerpo original en ranked_legacy';
  end if;
  if exists (select 1 from pg_proc p
             where p.pronamespace = 'public'::regnamespace
               and p.proname in ('start_bot_match', 'finish_bot_match', 'join_human_queue',
                                 'leave_human_queue', 'finish_human_match')
               and p.prosrc not like '%ranked_legacy_guard()%') then
    raise exception 'ranked_legacy_guard: una RPC vieja quedó sin guard';
  end if;
end;
$$;
