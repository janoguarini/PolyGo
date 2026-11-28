/**
 * Migración de PUBLICACIÓN de un curso de inglés localizado (docs/EN_MULTI_SOURCE.md): en-from-pt, -it
 * o -fr. La carga sin publicar es 20270109120000/120100/120200_en_from_<idioma>.sql; esta sólo cambia el
 * estado de esas filas y abre el curso (courses.status = 'available').
 *
 * Uso: npx tsx scripts/build-en-src-publish-sql.ts pt supabase/pending/20270111120000_publish_en_from_pt.sql
 *
 * Mismo mecanismo que la publicación del español B1 (scripts/build-es-b1-publish-sql.ts):
 * - curriculum_units, words, lessons y exercises: is_published = true.
 * - concepts: activos si su palabra está publicada.
 * - exercise_items: `active`, SALVO los context_choice, que siguen en `draft` (D4).
 * - courses.status = 'available' (la app lo ofrece recién con la build que lo abre en shared/courses.ts).
 *
 * Seguridad: antes de cambiar nada comprueba que existan exactamente las filas de la carga y que sean del
 * curso; si no, aborta. Idempotente. No toca otros cursos, rutas, RLS ni funciones. Determinista.
 */
import { writeFileSync } from 'node:fs';

import { EN_SOURCES, type EnSource } from '../content/en-src/localize';
import { enSrcSql } from './build-en-src-sql';
import { assertNoDelimiters } from './content-sql';

export function enSrcPublishSql(source: EnSource) {
  const { document, course } = enSrcSql(source);
  const code = course.code;
  const tag = `${course.namespace}_publish`;
  const ids = {
    units: document.units.map((u) => u.id),
    words: document.words.map((w) => w.id),
    lessons: document.lessons.map((l) => l.id),
    exercises: document.exercises.map((e) => e.id),
    items: document.catalog.items.filter((i) => i.type !== 'context_choice').map((i) => i.id),
    draft_items: document.catalog.items.filter((i) => i.type === 'context_choice').map((i) => i.id),
  };
  const payload = JSON.stringify(ids);
  assertNoDelimiters(payload);

  const sql = `-- =====================================================================
-- Publicación de ${code} (inglés para hablantes de ${source}, A1–B1; docs/EN_MULTI_SOURCE.md), generada por
-- scripts/build-en-src-publish-sql.ts. NO editar a mano: regenerar.
-- Requiere la carga sin publicar de estas filas y 20270108120000_courses_per_language.sql.
-- Publica: ${ids.units.length} unidades · ${ids.words.length} palabras (y sus conceptos) · ${ids.lessons.length} lecciones · ${ids.exercises.length} ejercicios.
-- Activa ${ids.items.length} ítems para los repasos; ${ids.draft_items.length} context_choice siguen en draft (D4).
-- Abre el curso: courses.status = 'available'. No toca otros cursos, rutas, RLS ni funciones. Idempotente.
-- =====================================================================

do $polygo_publish$
declare
  d constant jsonb := $ids$${payload}$ids$::jsonb;
  v_bad text;
begin

-- 1. Las filas de la carga existen, son del curso y no hay otras en esas unidades.
if not exists (select 1 from public.courses where code = '${code}' and target_language = 'en') then
  raise exception '${tag}: falta el curso ${code}';
end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'units') x
where not exists (select 1 from public.curriculum_units u
                  where u.id = x and u.language_code = 'en' and u.course_code = '${code}');
if v_bad is not null then raise exception '${tag}: unidades que no existen o no son de ${code}: %', v_bad; end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'words') x
where not exists (select 1 from public.words w
                  where w.id = x and w.course_code = '${code}' and w.unit_id in (select jsonb_array_elements_text(d -> 'units')));
if v_bad is not null then raise exception '${tag}: palabras que faltan o son de otra unidad: %', v_bad; end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'lessons') x
where not exists (select 1 from public.lessons l
                  where l.id = x and l.unit_id in (select jsonb_array_elements_text(d -> 'units')));
if v_bad is not null then raise exception '${tag}: lecciones que faltan o son de otra unidad: %', v_bad; end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'exercises') x
where not exists (select 1 from public.exercises e
                  where e.id = x and e.lesson_id in (select jsonb_array_elements_text(d -> 'lessons')));
if v_bad is not null then raise exception '${tag}: ejercicios que faltan o son de otra lección: %', v_bad; end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text((d -> 'items') || (d -> 'draft_items')) x
where not exists (select 1 from public.exercise_items i where i.id = x and i.language_code = 'en');
if v_bad is not null then raise exception '${tag}: ítems que faltan o no son de inglés: %', v_bad; end if;

select string_agg(x.id, ', ') into v_bad from (
  select u.id from public.curriculum_units u
  where u.course_code = '${code}' and u.id not in (select jsonb_array_elements_text(d -> 'units'))
  union all
  select w.id from public.words w
  where w.unit_id in (select jsonb_array_elements_text(d -> 'units'))
    and w.id not in (select jsonb_array_elements_text(d -> 'words'))
  union all
  select l.id from public.lessons l
  where l.unit_id in (select jsonb_array_elements_text(d -> 'units'))
    and l.id not in (select jsonb_array_elements_text(d -> 'lessons'))
  union all
  select e.id from public.exercises e
  where e.lesson_id in (select jsonb_array_elements_text(d -> 'lessons'))
    and e.id not in (select jsonb_array_elements_text(d -> 'exercises'))
  union all
  select e.item_id from public.exercises e
  where e.id in (select jsonb_array_elements_text(d -> 'exercises'))
    and e.item_id not in (select jsonb_array_elements_text((d -> 'items') || (d -> 'draft_items')))
) x;
if v_bad is not null then raise exception '${tag}: filas del curso que no son de la carga: %', v_bad; end if;

select string_agg(i.id, ', ') into v_bad from public.exercise_items i
where (i.id in (select jsonb_array_elements_text(d -> 'draft_items'))) <> (i.type = 'context_choice')
  and i.id in (select jsonb_array_elements_text((d -> 'items') || (d -> 'draft_items')));
if v_bad is not null then raise exception '${tag}: ítems con un estado de destino inesperado: %', v_bad; end if;

-- 2. Publicación (sólo lo que todavía no está publicado: reaplicar no cambia nada).
update public.curriculum_units set is_published = true
where id in (select jsonb_array_elements_text(d -> 'units')) and not is_published;

update public.words set is_published = true
where id in (select jsonb_array_elements_text(d -> 'words')) and not is_published;

update public.lessons set is_published = true
where id in (select jsonb_array_elements_text(d -> 'lessons')) and not is_published;

update public.exercises set is_published = true
where id in (select jsonb_array_elements_text(d -> 'exercises')) and not is_published;

update public.concepts c set status = 'active'
from public.words w
where c.id in (select jsonb_array_elements_text(d -> 'words'))
  and w.id = c.id and w.is_published and c.status = 'draft';

update public.exercise_items set status = 'active'
where id in (select jsonb_array_elements_text(d -> 'items')) and status = 'draft';

update public.courses set status = 'available'
where code = '${code}' and status is distinct from 'available';

-- 3. Comprobación final.
if exists (select 1 from public.curriculum_units where id in (select jsonb_array_elements_text(d -> 'units')) and not is_published)
   or exists (select 1 from public.words where id in (select jsonb_array_elements_text(d -> 'words')) and not is_published)
   or exists (select 1 from public.lessons where id in (select jsonb_array_elements_text(d -> 'lessons')) and not is_published)
   or exists (select 1 from public.exercises where id in (select jsonb_array_elements_text(d -> 'exercises')) and not is_published)
   or exists (select 1 from public.concepts where id in (select jsonb_array_elements_text(d -> 'words')) and status <> 'active')
   or exists (select 1 from public.exercise_items where id in (select jsonb_array_elements_text(d -> 'items')) and status <> 'active')
   or exists (select 1 from public.exercise_items where id in (select jsonb_array_elements_text(d -> 'draft_items')) and status <> 'draft')
   or not exists (select 1 from public.courses where code = '${code}' and status = 'available')
then
  raise exception '${tag}: el estado final no es el esperado';
end if;

end
$polygo_publish$;
`;
  return { sql, ids, code };
}

if (require.main === module) {
  const [source, out] = process.argv.slice(2);
  if (!EN_SOURCES.includes(source as EnSource) || !out) {
    console.error('Uso: npx tsx scripts/build-en-src-publish-sql.ts <pt|it|fr> <archivo.sql>');
    process.exit(1);
  }
  const { sql, ids, code } = enSrcPublishSql(source as EnSource);
  writeFileSync(out, sql, 'utf8');
  console.log(
    `${out} (${code}): ${ids.units.length} unidades · ${ids.words.length} palabras · ${ids.lessons.length} lecciones · ${ids.exercises.length} ejercicios · ${ids.items.length} ítems activos · ${ids.draft_items.length} en draft`,
  );
}
