-- =====================================================================
-- Corrección de rendimiento de 20261116120000_route_vocabulary_access.sql (fase C.6).
--
-- Problema (medido en producción el 2026-11-18, como authenticated real): la política restrictiva de
-- exercises llamaba a curriculum_lesson_visible(lesson_id) UNA VEZ POR FILA. El mapa de unidades de la
-- app (curriculum_units → lessons → exercises(count)) pasó de 19,7 ms a ~1.690 ms en inglés (2.137
-- ejercicios) y ~617 ms en italiano (1.090).
--
-- Corrección: la misma visibilidad, calculada como CONJUNTO una vez por consulta, igual que la política
-- de words de la 116: el ejercicio es visible si su lección está en una unidad visible
-- (curriculum_visible_unit_ids(), 20261115120000_client_compatibility.sql). Emulación medida en
-- producción (solo lectura): ~96 ms en inglés y ~80–87 ms en italiano.
--
-- Publicación: la subconsulta sobre lessons se evalúa con el rol del que consulta, así que también le
-- aplican las políticas de lessons (is_published y la ruta visible). Diferencia con la 116: un
-- ejercicio publicado de una lección sin publicar deja de verse. Hoy hay 0 en producción; la política
-- permisiva de exercises (is_published) no cambia.
--
-- Alcance: SÓLO reemplaza la política "exercises in the client's curriculum route". No toca las otras
-- dos políticas de la 116 (words, exercise_words), sus cuatro funciones, tablas, datos, triggers ni
-- permisos. drop + create van en la misma transacción: no hay un instante sin política.
--
-- Reversión (a mano, en una transacción): vuelve exactamente a la política de la 116.
--   drop policy if exists "exercises in the client's curriculum route" on public.exercises;
--   create policy "exercises in the client's curriculum route" on public.exercises
--     as restrictive for select to authenticated
--     using (public.curriculum_lesson_visible(lesson_id));
--
-- Requiere 20261116120000_route_vocabulary_access.sql. Idempotente.
-- =====================================================================

drop policy if exists "exercises in the client's curriculum route" on public.exercises;

create policy "exercises in the client's curriculum route" on public.exercises
  as restrictive for select to authenticated
  using (lesson_id in (
    select l.id from public.lessons l
    where l.unit_id in (select public.curriculum_visible_unit_ids())
  ));

do $$
begin
  if (select count(*) from pg_policies
      where schemaname = 'public' and tablename = 'exercises'
        and policyname = 'exercises in the client''s curriculum route'
        and permissive = 'RESTRICTIVE' and cmd = 'SELECT' and roles = '{authenticated}'
        and qual not like '%curriculum_lesson_visible%') <> 1 then
    raise exception 'route_vocabulary_exercises_policy: la política de exercises no quedó como se esperaba';
  end if;
  if (select count(*) from pg_policies
      where schemaname = 'public' and permissive = 'RESTRICTIVE' and cmd = 'SELECT'
        and roles = '{authenticated}'
        and (tablename, policyname) in (
          ('words', 'words in the client''s curriculum route'),
          ('exercise_words', 'exercise words in the client''s curriculum route'))) <> 2 then
    raise exception 'route_vocabulary_exercises_policy: faltan las otras políticas de la 116';
  end if;
end;
$$;
