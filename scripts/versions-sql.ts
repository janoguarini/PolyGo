/**
 * Carga de versiones de ítems (arquitectura de datos rev. 8, §5) para incluir dentro del bloque DO de
 * una migración de contenido, donde `d` es el documento jsonb. Las filas (`d -> 'catalog' ->
 * 'versions'`, `current_versions`, `placement_versions`) las arma content/versions.ts
 * (`buildVersions`) y las escriben content:sql, content:diff y content:catalog
 * (scripts/catalog-sql.ts). La prueba supabase/tests/versions.test.mjs.
 *
 * Toma el hash tal como viene (V4: se calcula sólo en Node; la base lo guarda y garantiza la unique).
 *   1. Bloquea los ítems del documento (for update), así la numeración no choca con otra carga.
 *   2. Aborta si una versión ya cargada con el mismo (ítem, hash) tiene otro contenido o grading_spec.
 *      `generator` y `generator_version` no cuentan (V6): son la procedencia de la versión que se
 *      creó primero y no se sobrescriben.
 *   3. Inserta las versiones nuevas con version = máximo + 1 por ítem, en el orden del documento.
 *      Lo ya cargado se reutiliza (A → B → A vuelve a la versión A, con su procedencia original).
 *   4. Fija current_version_id (`d -> 'catalog' -> 'current_versions'`).
 *   5. Fija exercises.item_version_id (`d -> 'catalog' -> 'placement_versions'`); la ubicación tiene
 *      que ser del mismo ítem.
 *   6. Checksum de la duplicación transitoria (§5): la copia de cada ubicación en exercises tiene que
 *      ser igual a su versión. En los ítems de distractores variables (V5 (a)) la versión no tiene
 *      payload.options: se compara el resto, y las opciones las compara el conjunto de la ubicación
 *      (scripts/option-sets-sql.ts).
 *
 * VERSIONS_INSERT_SQL (pasos 1–4) va antes de escribir exercises, así una ubicación nueva nace con su
 * ítem, su versión y su conjunto (lo exige V8); VERSIONS_PLACE_SQL (5–6), después.
 */
export const VERSIONS_INSERT_SQL = `
-- Versiones de los ítems (content/versions.ts).
declare
  v_bad text;
begin

perform 1 from public.exercise_items i
where i.id in (select x ->> 'item_id' from jsonb_array_elements(d -> 'catalog' -> 'versions') x)
order by i.id
for update;

select string_agg(item_id || '@' || content_hash, ', ') into v_bad from (
  select x.item_id, x.content_hash
  from jsonb_to_recordset(d -> 'catalog' -> 'versions')
    as x(item_id text, content_hash text, prompt_es text, payload jsonb, answer text,
         accepted_answers text[], explanation_es text, difficulty smallint, recommended_seconds smallint,
         grading_spec jsonb, generator text, generator_version text)
  join public.exercise_item_versions v on v.item_id = x.item_id and v.content_hash = x.content_hash
  where (v.prompt_es, v.payload, v.answer, v.accepted_answers, v.explanation_es, v.difficulty,
         v.recommended_seconds, v.grading_spec)
     is distinct from (x.prompt_es, x.payload, x.answer, x.accepted_answers, x.explanation_es, x.difficulty,
         x.recommended_seconds, x.grading_spec)
  order by 1, 2 limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_versions: versiones ya cargadas con el mismo hash y otro contenido: %', v_bad;
end if;

insert into public.exercise_item_versions (item_id, version, content_hash, prompt_es, payload, answer,
  accepted_answers, explanation_es, difficulty, recommended_seconds, grading_spec, generator, generator_version)
select n.item_id,
  coalesce((select max(v.version) from public.exercise_item_versions v where v.item_id = n.item_id), 0)
    + row_number() over (partition by n.item_id order by n.ord),
  n.content_hash, n.prompt_es, n.payload, n.answer, n.accepted_answers, n.explanation_es, n.difficulty,
  n.recommended_seconds, n.grading_spec, n.generator, n.generator_version
from (
  select distinct on (x.item_id, x.content_hash) x.*, t.ord
  from jsonb_array_elements(d -> 'catalog' -> 'versions') with ordinality as t(j, ord),
    jsonb_to_record(t.j)
      as x(item_id text, content_hash text, prompt_es text, payload jsonb, answer text,
           accepted_answers text[], explanation_es text, difficulty smallint, recommended_seconds smallint,
           grading_spec jsonb, generator text, generator_version text)
  where not exists (select 1 from public.exercise_item_versions v
                    where v.item_id = x.item_id and v.content_hash = x.content_hash)
  order by x.item_id, x.content_hash, t.ord
) n
order by n.item_id, n.ord;

update public.exercise_items i set current_version_id = v.id
from jsonb_to_recordset(d -> 'catalog' -> 'current_versions') as x(item_id text, content_hash text)
join public.exercise_item_versions v on v.item_id = x.item_id and v.content_hash = x.content_hash
where i.id = x.item_id and i.current_version_id is distinct from v.id;

end;
`;

export const VERSIONS_PLACE_SQL = `
-- Versión de cada ubicación (content/versions.ts).
declare
  v_bad text;
begin

select string_agg(exercise_id, ', ') into v_bad from (
  select x.exercise_id
  from jsonb_to_recordset(d -> 'catalog' -> 'placement_versions')
    as x(exercise_id text, item_id text, content_hash text)
  left join public.exercises e on e.id = x.exercise_id
  left join public.exercise_item_versions v on v.item_id = x.item_id and v.content_hash = x.content_hash
  where e.id is null or v.id is null or e.item_id is distinct from x.item_id
  order by 1 limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_versions: ubicaciones sin fila, sin versión o de otro ítem: %', v_bad;
end if;

update public.exercises e set item_version_id = v.id
from jsonb_to_recordset(d -> 'catalog' -> 'placement_versions')
  as x(exercise_id text, item_id text, content_hash text)
join public.exercise_item_versions v on v.item_id = x.item_id and v.content_hash = x.content_hash
where e.id = x.exercise_id and e.item_version_id is distinct from v.id;

-- Checksum de la duplicación transitoria (§5): exercises conserva la copia que lee la app.
select string_agg(id, ', ') into v_bad from (
  select e.id
  from public.exercises e
  join public.exercise_item_versions v on v.id = e.item_version_id
  where e.id in (select x ->> 'exercise_id' from jsonb_array_elements(d -> 'catalog' -> 'placement_versions') x)
    and (e.prompt_es, case when v.payload ? 'options' then e.payload else e.payload - 'options' end, e.answer,
         e.accepted_answers, e.explanation_es, e.difficulty, e.recommended_seconds)
     is distinct from (v.prompt_es, v.payload, v.answer, v.accepted_answers, v.explanation_es, v.difficulty,
         v.recommended_seconds)
  order by e.id limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_versions: la copia de exercises no coincide con su versión: %', v_bad;
end if;

end;
`;

export const VERSIONS_SQL = `${VERSIONS_INSERT_SQL}${VERSIONS_PLACE_SQL}`;

/**
 * V8 y V8.1 (referencias obligatorias): migración escrita a mano, ya en supabase/migrations/ y NO
 * aplicada en producción. NOT NULL en exercises.item_id e item_version_id; current_version_id con un
 * constraint trigger diferido (se comprueba al confirmar), así estos fragmentos pueden insertar un
 * ítem nuevo, su versión y su puntero en la misma transacción. supabase/tests/versions.test.mjs y
 * items.test.mjs la prueban en PGlite.
 */
export const VERSIONS_REQUIRED_FILE =
  'supabase/migrations/20261108140000_learning_versions_required.sql';
