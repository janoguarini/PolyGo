/**
 * Migración de PUBLICACIÓN del español A1 U1–U17 y A2 U1–U12 (docs/ES_A1_A2.md §6). La
 * carga sin publicar es 20261204120000_es_a1_a2.sql; esta sólo cambia el estado de esas filas.
 *
 * Uso: npm run content:es-publish -- supabase/pending/20261205120000_publish_es_a1_a2.sql
 *
 * Vive en supabase/pending/ (fuera de migrations/): así nadie la aplica al aplicar las migraciones
 * pendientes. El día de publicar se mueve a supabase/migrations/.
 *
 * Mismo mecanismo que las publicaciones del inglés (scripts/build-b2-publish-sql.ts):
 * - curriculum_units, words, lessons y exercises: is_published = true.
 * - concepts: activos si su palabra está publicada.
 * - exercise_items: `active`, SALVO los context_choice, que siguen en `draft` como toda la comprensión
 *   (decisión D4 de docs/LEARNING_PHASE_C.md). La lección los presenta igual.
 *
 * Seguridad: antes de cambiar nada comprueba que existan exactamente las filas de la carga y que sean de
 * español A1 U1–U17 / A2 U1–U12; si no, aborta. Idempotente. No toca otros
 * idiomas, rutas, RLS, funciones ni configuración. Determinista.
 */
import { writeFileSync } from 'node:fs';

import { esSql } from './build-es-sql';
import { assertNoDelimiters } from './content-sql';

export const ES_PUBLISH_MIGRATION = '20261205120000_publish_es_a1_a2.sql';

export function esPublishSql() {
  const { document } = esSql();
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
-- Publicación del español A1 U1–U17 y A2 U1–U12 (docs/ES_A1_A2.md §6), generada por
-- scripts/build-es-publish-sql.ts. NO editar a mano: regenerar.
-- Requiere 20261204120000_es_a1_a2.sql (la carga sin publicar de estas filas). No depende de las
-- publicaciones del inglés.
-- Publica: ${units.length} unidades · ${words.length} palabras (y sus conceptos) · ${lessons.length} lecciones · ${exercises.length} ejercicios.
-- Activa ${items.length} ítems para los repasos; ${draftItems.length} ítems context_choice siguen en draft (D4: la
-- comprensión no entra a los repasos), aunque sus ejercicios se publican y se juegan en las lecciones.
-- No toca otros idiomas, rutas, RLS, funciones ni configuración. Idempotente.
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/esContent.test.mjs). NO aplicada en producción.
-- Vive en supabase/pending/: moverla a supabase/migrations/ recién el día de publicar.
-- =====================================================================

do $polygo_publish$
declare
  d constant jsonb := $ids$${payload}$ids$::jsonb;
  v_bad text;
begin

-- 1. Las filas de la carga existen, son de español A1 U1–U17 / A2 U1–U12 y no hay otras en esas unidades.
select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'units') x
where not exists (select 1 from public.curriculum_units u
                  where u.id = x and u.language_code = 'es'
                    and ((u.level = 'A1' and u.position between 1 and 17) or (u.level = 'A2' and u.position between 1 and 12)));
if v_bad is not null then
  raise exception 'es_publish: unidades que no existen o no son de español A1 U1–U17 / A2 U1–U12: %', v_bad;
end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'words') x
where not exists (select 1 from public.words w
                  where w.id = x and w.language_code = 'es' and w.unit_id in (select jsonb_array_elements_text(d -> 'units')));
if v_bad is not null then raise exception 'es_publish: palabras que faltan o son de otra unidad: %', v_bad; end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'lessons') x
where not exists (select 1 from public.lessons l
                  where l.id = x and l.unit_id in (select jsonb_array_elements_text(d -> 'units')));
if v_bad is not null then raise exception 'es_publish: lecciones que faltan o son de otra unidad: %', v_bad; end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text(d -> 'exercises') x
where not exists (select 1 from public.exercises e
                  where e.id = x and e.lesson_id in (select jsonb_array_elements_text(d -> 'lessons')));
if v_bad is not null then raise exception 'es_publish: ejercicios que faltan o son de otra lección: %', v_bad; end if;

select string_agg(x, ', ') into v_bad
from jsonb_array_elements_text((d -> 'items') || (d -> 'draft_items')) x
where not exists (select 1 from public.exercise_items i where i.id = x and i.language_code = 'es' and i.level in ('A1', 'A2'));
if v_bad is not null then raise exception 'es_publish: ítems que faltan o no son de español A1 / A2: %', v_bad; end if;

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
  raise exception 'es_publish: filas en esas unidades que no son de la carga 20261204120000: %', v_bad;
end if;

-- Los ítems que siguen en draft son exactamente los context_choice.
select string_agg(i.id, ', ') into v_bad from public.exercise_items i
where (i.id in (select jsonb_array_elements_text(d -> 'draft_items'))) <> (i.type = 'context_choice')
  and i.id in (select jsonb_array_elements_text((d -> 'items') || (d -> 'draft_items')));
if v_bad is not null then raise exception 'es_publish: ítems con un estado de destino inesperado: %', v_bad; end if;

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
  raise exception 'es_publish: el estado final no es el esperado';
end if;

end
$polygo_publish$;
`;
  return { sql, ids };
}

if (require.main === module) {
  const out = process.argv[2];
  if (!out) {
    console.error('Uso: npm run content:es-publish -- <archivo.sql>');
    process.exit(1);
  }
  const { sql, ids } = esPublishSql();
  writeFileSync(out, sql, 'utf8');
  console.log(
    `${out}: ${ids.units.length} unidades · ${ids.words.length} palabras · ${ids.lessons.length} lecciones · ${ids.exercises.length} ejercicios · ${ids.items.length} ítems activos · ${ids.draft_items.length} en draft`,
  );
}
