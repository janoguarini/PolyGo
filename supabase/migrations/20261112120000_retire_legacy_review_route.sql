-- Retirada de la ruta antigua de REPASOS para la app (docs/LEARNING_PHASE5.md §5; preparada 2026-11-09,
-- sin aplicar en producción).
--
-- Qué cambia: `submit_learning_session(..., p_kind = 'review', ...)` llamada DIRECTAMENTE por la app
-- (rol de sesión `authenticated`, o `anon`) se rechaza con `legacy_review_retired` (SQLSTATE 42501;
-- PostgREST lo devuelve como 403). Es la ruta en la que el cliente decidía si cada respuesta era
-- correcta. Las builds nuevas no la usan desde el cierre de la fase 5: sus repasos van por la Edge
-- Function (start_review / answer_review / submit_review → record_learning_session).
--
-- Qué NO cambia:
--   · Lecciones (`p_kind = 'lesson'`): mismo contrato, mismos permisos, mismo resultado. Siguen siendo la
--     ruta de las builds viejas y el respaldo de lecciones de las builds nuevas (api.ts submitLegacy).
--   · El cuerpo `submit_learning_session_v1` (SRS v1, energía, racha, logros, progreso): intacto.
--   · Permisos: no se revoca EXECUTE; la ACL queda igual (postgres, authenticated, service_role).
--   · Flujos internos del servidor: corren con el rol de sesión `service_role` (la Edge Function usa la
--     clave secreta), así que no se ven afectados. Incluye `learning_submit_graded` (lecciones) y
--     `learning_submit_review_graded` (repasos, fase 4).
--   · Ranked, SRS v2, interruptores del motor: nada.
--
-- Cómo se distingue la app de un flujo interno. NO sirve:
--   · `current_user`: esta función es SECURITY DEFINER, así que dentro siempre es el dueño (postgres).
--   · `auth.role()` / `request.jwt.claims`: learning_submit_graded y learning_submit_review_graded fijan
--     a propósito `{"role": "authenticated"}` en los claims para que el cuerpo v1 vea al usuario.
-- Sí sirve el GUC `role` (`current_setting('role')`): PostgREST lo fija a `authenticated` o
-- `service_role` según el JWT (SET ROLE) y SECURITY DEFINER no lo cambia. Una conexión directa como
-- postgres (migraciones, SQL editor) tiene `none` y tampoco se rechaza. Las pruebas usan el mismo
-- mecanismo (`set role`, supabase/tests/harness.mjs).
--
-- Orden del rechazo: antes que todo, también antes del reenvío idempotente. Una build vieja que reenvía
-- un repaso ya guardado recibe `legacy_review_retired`, no `duplicate` (no cambia ningún dato).
--
-- Volver atrás: volver a crear la función sin el bloque «Retirada» (definición de
-- 20261109120000_srs_v2.sql §14). No hay datos que restaurar: el rechazo no escribe nada.
--
-- Aditiva: sin DROP, sin DELETE, sin cambios de firma ni de permisos.

create or replace function public.submit_learning_session(
  p_session_id uuid, p_kind text, p_lesson_id text, p_started_at timestamptz, p_attempts jsonb,
  p_time_zone text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_tz text := public.safe_time_zone(p_time_zone);
begin
  -- Retirada de la ruta antigua de repasos: la app ya no puede guardar un repaso con su propio
  -- veredicto. Los flujos internos (rol service_role) siguen.
  if p_kind = 'review' and coalesce(current_setting('role', true), '') in ('authenticated', 'anon') then
    raise exception 'legacy_review_retired' using errcode = '42501',
      hint = 'Los repasos se envían por la Edge Function learning-session (submit_review).';
  end if;
  if auth.uid() is not null and public.srs_v2_enabled() then
    perform public.srs_user_lock(auth.uid(), v_tz);
    perform set_config('polygo.srs_time_zone', v_tz, true);
  end if;
  return public.submit_learning_session_v1(p_session_id, p_kind, p_lesson_id, p_started_at, p_attempts,
                                           p_time_zone);
end;
$$;

-- Los mismos permisos que antes (create or replace los conserva; se dejan explícitos).
revoke all on function public.submit_learning_session(uuid, text, text, timestamptz, jsonb, text) from public, anon;
grant execute on function public.submit_learning_session(uuid, text, text, timestamptz, jsonb, text)
  to authenticated, service_role;

-- learning_submit_review_graded (fase 4): sin uso desde la fase 5 (submit_review usa
-- record_learning_session). No se borra: es la vuelta atrás documentada y sigue funcionando con
-- service_role. Se deja constancia en el catálogo.
comment on function public.learning_submit_review_graded(uuid, uuid, timestamptz, text, jsonb, jsonb, jsonb) is
  'OBSOLETA desde la fase 5 (sin uso: submit_review escribe por record_learning_session). Se conserva '
  'como vuelta atrás; sólo service_role. No retirar sin decisión explícita.';
