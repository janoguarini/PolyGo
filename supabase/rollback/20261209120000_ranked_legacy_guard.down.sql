-- =====================================================================
-- Reversión de supabase/migrations/20261209120000_ranked_legacy_guard.sql. NO es una migración: se
-- aplica a mano (SQL editor, como dueño) sólo si hiciera falta deshacer la Etapa 1 en la base.
--
-- Deja todo como antes de la migración: las cinco RPC del Ranked viejo vuelven a public con su cuerpo
-- original (sin guard) y sus permisos, sin interruptor, sin bitácora y sin los triggers de
-- inmutabilidad. Las partidas que close_legacy_ranked() haya cancelado siguen canceladas (no se
-- reabren: no se puede reconstruir su estado). Probada en supabase/tests/rankedlegacy.test.mjs.
--
-- Para sólo reabrir el flujo viejo NO hace falta esto: `select public.reopen_legacy_ranked('motivo');`
-- =====================================================================

drop trigger if exists battles_result_immutable on public.battles;
drop trigger if exists battle_players_result_immutable on public.battle_players;
drop trigger if exists rating_history_immutable on public.rating_history;
drop function if exists public.battles_result_immutable();
drop function if exists public.battle_players_result_immutable();
drop function if exists public.rating_history_immutable();

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
    if to_regprocedure('ranked_legacy.' || sig) is not null then
      execute format('drop function if exists public.%s', sig);
      execute format('alter function ranked_legacy.%s set schema public', sig);
    end if;
    -- Permisos previos exactos (producción, verificados antes de aplicar 209):
    --   {postgres=X/postgres, authenticated=X/postgres, service_role=X/postgres}; ni PUBLIC ni anon.
    -- La migración revocó también service_role de los cuerpos movidos: hay que devolvérselo.
    execute format('revoke all on function public.%s from public, anon', sig);
    execute format('grant execute on function public.%s to authenticated, service_role', sig);
  end loop;
end;
$$;

drop function if exists public.close_legacy_ranked(text);
drop function if exists public.reopen_legacy_ranked(text);
drop function if exists public.ranked_legacy_guard();
drop function if exists public.ranked_legacy_open();
drop table if exists public.ranked_legacy_switch_log;
drop table if exists public.ranked_legacy_switch;
drop schema if exists ranked_legacy;
