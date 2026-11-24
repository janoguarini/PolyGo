/**
 * Migración de PUBLICACIÓN de inglés A2 U13–U17 (docs/A2_EN_COMPLETION.md §5). La carga sin publicar
 * es 20261120120000_a2_en_completion.sql; esta sólo cambia el estado de esas filas.
 *
 * Uso: npm run content:a2-publish -- supabase/pending/20261121120000_publish_en_a2_u13_u17.sql
 *
 * Vive en supabase/pending/ (fuera de migrations/, como learning_jobs_cron.sql): así nadie la aplica al
 * aplicar las migraciones pendientes. El día de publicar se mueve a supabase/migrations/.
 *
 * Mecanismo de publicación del currículo (el mismo con el que se publicaron U1–U12):
 * - curriculum_units, words, lessons y exercises: is_published = true.
 * - concepts: activos si su palabra está publicada (la misma regla y el mismo UPDATE que la plantilla
 *   del catálogo, scripts/catalog-sql.ts).
 * - exercise_items: `active`, como todo ítem del currículo publicado, SALVO los context_choice, que
 *   siguen en `draft` como toda la comprensión (decisión D4 de docs/LEARNING_PHASE_C.md: con estado
 *   activo entrarían a los repasos). La lección los presenta igual: learning_lesson_plan mira el
 *   ejercicio publicado, no el estado del ítem.
 *
 * Seguridad: antes de cambiar nada comprueba que existan exactamente las filas de la carga (ni una de
 * menos ni una de más en esas unidades) y que sean de inglés A2 U13–U17; si no, aborta. Idempotente:
 * reaplicarla no cambia nada. No toca otras unidades, rutas, RLS, funciones ni configuración.
 * Determinista: dos corridas dan el mismo archivo.
 */
import { writeFileSync } from 'node:fs';

import { a2ExpansionSql } from './build-a2-expansion-sql';
import { assertNoDelimiters } from './content-sql';

export const A2_PUBLISH_MIGRATION = '20261121120000_publish_en_a2_u13_u17.sql';

export function a2PublishSql() {
  const { document } = a2ExpansionSql();
  const units = document.units.map((u) => u.id);
  const words = document.words.map((w) => w.id);
  const lessons = document.lessons.map((l) => l.id);
  const exercises = document.exercises.map((e) => e.id);
  const items = document.catalog.items.filter((i) => i.type !== 'context_choice').map((i) => i.id);
  const draftItems = document.catalog.items
    .filter((i) => i.type === 'context_choice')
    .map((i) => i.id);
  const ids = { units, words, lessons, exercises, items, draft_items: draftItems };
  const payload = JSON.stringify(ids);
  assertNoDelimiters(payload);

  const sql = `-- =====================================================================
-- Publicación de inglés A2 U13–U17 (docs/A2_EN_COMPLETION.md §5), generada por
-- scripts/build-a2-publish-sql.ts. NO editar a mano: regenerar.
-- Requiere 20261120120000_a2_en_completion.sql (la carga sin publicar de estas filas).
-- Publica: ${units.length} unidades · ${words.length} palabras (y sus conceptos) · ${lessons.length} lecciones · ${exercises.length} ejercicios.
-- Activa ${items.length} ítems para los repasos; ${draftItems.length} ítems context_choice siguen en draft (D4: la
-- comprensión no entra a los repasos), aunque sus ejercicios se publican y se juegan en las lecciones.
-- No toca A2 U1–U12, A1, otros idiomas, rutas, RLS, funciones ni configuración. Idempotente.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/a2Publish.test.mjs). NO aplicada en producción.
-- Vive en supabase/pending/: moverla a supabase/migrations/ recién el día de publicar.
-- =====================================================================

do $polygo_publish$
declare
  d constant jsonb := $ids$${payload}$ids$::jsonb;
  v_bad text;
begin

-- 1. Las filas de la carga existen, son de inglés A2 U13–U17 y no hay otras en esas unidades.
select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'units') x
where not exists (select 1 from public.curriculum_units u
                  where u.id = x and u.language_code = 'en' and u.level = 'A2' and u.position between 13 and 17);
if v_bad is not null then
  raise exception 'a2_publish: unidades que no existen o no son de inglés A2 U13–U17: %', v_bad;
end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'words') x
where not exists (select 1 from public.words w
                  where w.id = x and w.language_code = 'en' and w.unit_id in (select jsonb_array_elements_text(d -> 'units')));
if v_bad is not null then raise exception 'a2_publish: palabras que faltan o son de otra unidad: %', v_bad; end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'lessons') x
where not exists (select 1 from public.lessons l
                  where l.id = x and l.unit_id in (select jsonb_array_elements_text(d -> 'units')));
if v_bad is not null then raise exception 'a2_publish: lecciones que faltan o son de otra unidad: %', v_bad; end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'exercises') x
where not exists (select 1 from public.exercises e
                  where e.id = x and e.lesson_id in (select jsonb_array_elements_text(d -> 'lessons')));
if v_bad is not null then raise exception 'a2_publish: ejercicios que faltan o son de otra lección: %', v_bad; end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text((d -> 'items') || (d -> 'draft_items')) x
where not exists (select 1 from public.exercise_items i where i.id = x and i.language_code = 'en' and i.level = 'A2');
if v_bad is not null then raise exception 'a2_publish: ítems que faltan o no son de inglés A2: %', v_bad; end if;

select string_agg(x.id, ', ') into v_bad from (
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
if v_bad is not null then
  raise exception 'a2_publish: filas en U13–U17 que no son de la carga 20261120120000: %', v_bad;
end if;

-- Los ítems que siguen en draft son exactamente los context_choice.
select string_agg(i.id, ', ') into v_bad from public.exercise_items i
where (i.id in (select jsonb_array_elements_text(d -> 'draft_items'))) <> (i.type = 'context_choice')
  and i.id in (select jsonb_array_elements_text((d -> 'items') || (d -> 'draft_items')));
if v_bad is not null then raise exception 'a2_publish: ítems con un estado de destino inesperado: %', v_bad; end if;

-- 2. Publicación (sólo lo que todavía no está publicado: reaplicar no cambia nada).
update public.curriculum_units set is_published = true
where id in (select jsonb_array_elements_text(d -> 'units')) and not is_published;

update public.words set is_published = true
where id in (select jsonb_array_elements_text(d -> 'words')) and not is_published;

update public.lessons set is_published = true
where id in (select jsonb_array_elements_text(d -> 'lessons')) and not is_published;

update public.exercises set is_published = true
where id in (select jsonb_array_elements_text(d -> 'exercises')) and not is_published;

-- Conceptos: activos si su palabra está publicada (misma regla que scripts/catalog-sql.ts).
update public.concepts c set status = 'active'
from public.words w
where c.id in (select jsonb_array_elements_text(d -> 'words'))
  and w.id = c.id and w.is_published and c.status = 'draft';

-- Ítems: activos para los repasos, salvo la comprensión (D4).
update public.exercise_items set status = 'active'
where id in (select jsonb_array_elements_text(d -> 'items')) and status = 'draft';

-- 3. Comprobación final.
if exists (select 1 from public.curriculum_units where id in (select jsonb_array_elements_text(d -> 'units')) and not is_published)
   or exists (select 1 from public.words where id in (select jsonb_array_elements_text(d -> 'words')) and not is_published)
   or exists (select 1 from public.lessons where id in (select jsonb_array_elements_text(d -> 'lessons')) and not is_published)
   or exists (select 1 from public.exercises where id in (select jsonb_array_elements_text(d -> 'exercises')) and not is_published)
   or exists (select 1 from public.concepts where id in (select jsonb_array_elements_text(d -> 'words')) and status <> 'active')
   or exists (select 1 from public.exercise_items where id in (select jsonb_array_elements_text(d -> 'items')) and status <> 'active')
   or exists (select 1 from public.exercise_items where id in (select jsonb_array_elements_text(d -> 'draft_items')) and status <> 'draft')
then
  raise exception 'a2_publish: el estado final no es el esperado';
end if;

end
$polygo_publish$;
`;
  return { sql, ids };
}

if (require.main === module) {
  const out = process.argv[2];
  if (!out) {
    console.error('Uso: npm run content:a2-publish -- <archivo.sql>');
    process.exit(1);
  }
  const { sql, ids } = a2PublishSql();
  writeFileSync(out, sql, 'utf8');
  console.log(
    `${out}: ${ids.units.length} unidades · ${ids.words.length} palabras · ${ids.lessons.length} lecciones · ${ids.exercises.length} ejercicios · ${ids.items.length} ítems activos · ${ids.draft_items.length} en draft`,
  );
}
