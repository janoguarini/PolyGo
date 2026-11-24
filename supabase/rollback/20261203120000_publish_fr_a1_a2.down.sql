-- =====================================================================
-- Rollback de 20261203120000_publish_fr_a1_a2.sql: el francés vuelve a quedar cargado sin publicar.
--
-- SOLO antes de que alguien lo use. Aborta si el idioma no está 'hidden' (primero hay que correr
-- 20261203130000_enable_fr.down.sql) o si algún perfil tiene target_language = 'fr'. Con usuarios
-- estudiando francés, el rollback es solo el de la activación: despublicar les cortaría el curso.
--
-- Despublica únicamente filas de francés (unidades, palabras, lecciones, ejercicios) y devuelve sus
-- conceptos e ítems a 'draft'. No borra filas. Idempotente. No toca otros idiomas.
-- =====================================================================

do $polygo_unpublish_fr$
begin
  if (select content_status from public.languages where code = 'fr') is distinct from 'hidden' then
    raise exception 'fr_unpublish: el francés no está hidden; correr antes 20261203130000_enable_fr.down.sql';
  end if;
  if exists (select 1 from public.profiles where target_language = 'fr') then
    raise exception 'fr_unpublish: hay perfiles estudiando francés; no se despublica';
  end if;

  update public.exercises set is_published = false
  where is_published and lesson_id in (
    select l.id from public.lessons l join public.curriculum_units u on u.id = l.unit_id
    where u.language_code = 'fr');

  update public.lessons set is_published = false
  where is_published and unit_id in (select id from public.curriculum_units where language_code = 'fr');

  update public.words set is_published = false
  where is_published and language_code = 'fr';

  update public.curriculum_units set is_published = false
  where is_published and language_code = 'fr';

  update public.concepts c set status = 'draft'
  from public.words w
  where w.id = c.id and w.language_code = 'fr' and c.status = 'active';

  update public.exercise_items set status = 'draft'
  where language_code = 'fr' and status = 'active';
end
$polygo_unpublish_fr$;
