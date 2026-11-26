-- «Mostrado» = respondido: una presentación registrada que nunca se respondió no cuenta.
--
-- La app precarga el repaso y la próxima lección en segundo plano (reviewWarmup.ts, lessonWarmup.ts):
-- start_review / start registran las presentaciones antes de que el usuario entre. Si nunca entra
-- (o la sesión vence a la medianoche sin jugarse), esas presentaciones quedaban como «mostradas» y el
-- armador las tomaba como recientes al rotar los ejercicios de cada palabra (last_presented_at:
-- adaptivePlanner pickItem, 7 días; focusReview pickFocusItem).
--
-- Desde acá last_presented_at sólo mira presentaciones con respuesta: corregida en un envío
-- (exercise_attempt_gradings) o registrada en un repaso abierto (review_presentation_answers). Ambas
-- tablas tienen índice por presentation_id.
--
-- Nada más cambia: los repasos pendientes (user_srs_state) nunca dependieron de las presentaciones, y
-- el presupuesto / AL8 / first_review_today ya miraban sólo sesiones enviadas (learning_sessions).
--
-- Se reescribe sobre la definición vigente (pg_get_functiondef) reemplazando sólo la condición, y
-- falla si el texto esperado no está (definición distinta a la auditada): no se aplica a ciegas.
--
-- Rollback: la misma operación con los reemplazos invertidos (quitar «and public.presentation_answered(…)»).

create or replace function public.presentation_answered(p_presentation_id bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.exercise_attempt_gradings g where g.presentation_id = p_presentation_id)
      or exists (select 1 from public.review_presentation_answers a where a.presentation_id = p_presentation_id);
$$;
revoke all on function public.presentation_answered(bigint) from public, anon, authenticated;

do $migration$
declare
  v_def text;
  v_old text;
  v_new text;
begin
  -- Repaso adaptativo (SRS v2).
  v_def := pg_get_functiondef('public.learning_review_candidates(uuid,text,text,timestamptz)'::regprocedure);
  v_old := 'where p.user_id = s.user_id and p.item_id = r.item_id))';
  v_new := 'where p.user_id = s.user_id and p.item_id = r.item_id and public.presentation_answered(p.id)))';
  if position(v_old in v_def) = 0 then
    raise exception 'learning_review_candidates: no se encontró la condición de last_presented_at';
  end if;
  execute replace(v_def, v_old, v_new);

  -- Repasos con foco (inteligente, por tema, Coach) y repaso básico (SRS v1).
  v_def := pg_get_functiondef('public.learning_focus_candidates(uuid,text,timestamptz)'::regprocedure);
  v_old := 'where x.user_id = p_user and x.item_id = r.item_id))';
  v_new := 'where x.user_id = p_user and x.item_id = r.item_id and public.presentation_answered(x.id)))';
  if position(v_old in v_def) = 0 then
    raise exception 'learning_focus_candidates: no se encontró la condición de last_presented_at';
  end if;
  execute replace(v_def, v_old, v_new);
end;
$migration$;
