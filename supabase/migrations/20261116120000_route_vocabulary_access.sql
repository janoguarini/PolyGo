-- =====================================================================
-- Fase C.6 (docs/LEARNING_PHASE_C.md §C6): el vocabulario se lee según la ruta curricular visible.
--
-- Problema (C.5 §C5.4, punto 4): las políticas restrictivas de la C.5 cubren curriculum_units y lessons,
-- pero el vocabulario de una unidad también se lee por otras tres tablas que sólo miran is_published:
--   words           el vocabulario en sí (la app lo lee entero para los distractores: fetchWordPool).
--   exercises       enunciados, respuestas y payloads de los ejercicios de esas unidades.
--   exercise_words  enlaces ejercicio → palabra; leíbles SIEMPRE (`using (true)`, incluso sin publicar),
--                   y los ids de palabra son el propio texto (`en-surname`, `en-a-cup-of`).
--
-- Pertenencia curricular: la canónica, sin una segunda fuente de verdad.
--   palabra   → words.unit_id (NOT NULL, FK): la unidad que la introduce.
--   ejercicio → exercises.lesson_id → lessons.unit_id.
--   Una palabra que U13/U14 reutilizan (coffee, how much, price…) conserva su unit_id original (U1–U12 o
--   A2): sigue visible para quien veía esa unidad. Sólo se ocultan las que U13/U14 introducen.
--
-- Visibilidad: exactamente la de la C.5 (curriculum_route_for con la cabecera del request): la unidad
-- está en la ruta visible, o su idioma y nivel no tienen rutas (it, pt, zh, inglés A2: sin cambios).
--
-- Mecanismo (sólo agrega): tres políticas RESTRICTIVAS nuevas (AND con las permisivas de siempre, que no
-- se tocan). Las funciones auxiliares devuelven un booleano por clave, nunca listas de ids: se pueden
-- llamar por RPC (las políticas se evalúan con el rol del que consulta) y una lista revelaría ids de
-- palabras ocultas o sin publicar. Para una clave inexistente devuelven false, igual que para una oculta.
--
-- No cambia: palabras, ids, progreso, rutas, asignaciones, desbloqueos, publicación, SRS, Ranked.
-- service_role (Edge Functions, servidor de Ranked) ignora RLS como siempre.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/routeVocabulary.test.mjs). NO aplicada en
-- producción. Requiere 20261115120000_client_compatibility.sql. Idempotente; sin DROP.
-- =====================================================================

/** ¿La unidad está en la ruta visible del request (o su idioma y nivel no tienen rutas)? */
create or replace function public.curriculum_unit_visible(p_unit text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select f.route_id is null
        or exists (select 1 from public.curriculum_route_units ru
                   where ru.route_id = f.route_id and ru.unit_id = u.id)
    from public.curriculum_units u
    cross join lateral (
      select public.curriculum_route_for(auth.uid(), u.language_code, u.level,
                                         public.request_curriculum_api()) as route_id
    ) f
    where u.id = p_unit), false);
$$;

/** ¿La unidad de esta lección es visible? (false si la lección no existe) */
create or replace function public.curriculum_lesson_visible(p_lesson text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select public.curriculum_unit_visible(l.unit_id)
                   from public.lessons l where l.id = p_lesson), false);
$$;

/** ¿La unidad del ejercicio es visible? (false si no existe) */
create or replace function public.curriculum_exercise_visible(p_exercise text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select public.curriculum_unit_visible(l.unit_id)
                   from public.exercises e join public.lessons l on l.id = e.lesson_id
                   where e.id = p_exercise), false);
$$;

/** ¿La unidad que introduce la palabra es visible? (false si no existe) */
create or replace function public.curriculum_word_visible(p_word text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select public.curriculum_unit_visible(w.unit_id)
                   from public.words w where w.id = p_word), false);
$$;

revoke all on function public.curriculum_unit_visible(text) from public, anon;
revoke all on function public.curriculum_lesson_visible(text) from public, anon;
revoke all on function public.curriculum_exercise_visible(text) from public, anon;
revoke all on function public.curriculum_word_visible(text) from public, anon;
-- Las políticas se evalúan con el rol del que consulta: necesita ejecutarlas (sólo devuelven booleanos).
grant execute on function public.curriculum_unit_visible(text) to authenticated;
grant execute on function public.curriculum_lesson_visible(text) to authenticated;
grant execute on function public.curriculum_exercise_visible(text) to authenticated;
grant execute on function public.curriculum_word_visible(text) to authenticated;

-- ---------- Políticas restrictivas (se crean si faltan; nunca se borran ni se reemplazan) ----------

do $$
begin
  -- words: el conjunto de unidades visibles se calcula una vez por consulta (62 unidades), no por fila.
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'words'
                 and policyname = 'words in the client''s curriculum route') then
    create policy "words in the client's curriculum route" on public.words
      as restrictive for select to authenticated
      using (unit_id in (select public.curriculum_visible_unit_ids()));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'exercises'
                 and policyname = 'exercises in the client''s curriculum route') then
    create policy "exercises in the client's curriculum route" on public.exercises
      as restrictive for select to authenticated
      using (public.curriculum_lesson_visible(lesson_id));
  end if;

  -- Ambos extremos: el ejercicio (contenido de la unidad) y la palabra (su id es el texto).
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'exercise_words'
                 and policyname = 'exercise words in the client''s curriculum route') then
    create policy "exercise words in the client's curriculum route" on public.exercise_words
      as restrictive for select to authenticated
      using (public.curriculum_exercise_visible(exercise_id) and public.curriculum_word_visible(word_id));
  end if;
end;
$$;

do $$
begin
  if (select count(*) from pg_policies
      where schemaname = 'public' and permissive = 'RESTRICTIVE' and cmd = 'SELECT'
        and roles = '{authenticated}'
        and (tablename, policyname) in (
          ('words', 'words in the client''s curriculum route'),
          ('exercises', 'exercises in the client''s curriculum route'),
          ('exercise_words', 'exercise words in the client''s curriculum route'))) <> 3 then
    raise exception 'route_vocabulary_access: faltan las políticas restrictivas de vocabulario';
  end if;
end;
$$;
