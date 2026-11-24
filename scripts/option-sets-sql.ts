/**
 * Carga de los conjuntos de opciones (decisiones V5.1–V5.3, docs/EXERCISE_ITEM_VERSIONS_PENDING.md §5;
 * migración 20261108130000_learning_option_sets.sql) para incluir dentro del bloque DO de una
 * migración de contenido, donde `d` es el documento jsonb. Las filas (`d -> 'catalog' ->
 * 'option_sets'` y `placement_option_sets`) las arma content/option-sets.ts (`buildOptionSets`) y las
 * escriben content:sql, content:diff y content:catalog (scripts/catalog-sql.ts).
 *
 * Sin sentencias destructivas: un conjunto nunca se modifica ni se borra (lo impide además un trigger).
 *
 * OPTION_SETS_INSERT_SQL (antes de escribir exercises; necesita las versiones ya cargadas):
 *   1. Aborta si un conjunto ya cargado con la misma (versión, hash) tiene otras opciones u otra
 *      respuesta, o si la versión del conjunto no existe. `origin`, `generator` y `generator_version`
 *      no cuentan: son la procedencia del conjunto que se creó primero (como en las versiones, V6).
 *   2. Inserta los que faltan, en el orden del documento. Lo ya cargado se reutiliza.
 *
 * OPTION_SETS_PLACE_SQL (después de fijar la versión de cada ubicación):
 *   3. Aborta si la ubicación no existe, es de otro ítem o su versión no tiene ese conjunto.
 *   4. Fija exercises.option_set_id. Si cambia, el trigger exercises_record_option_set agrega una fila
 *      a exercise_option_set_assignments y la anterior queda.
 *   5. Checksum de la copia que lee la app: exercises.payload.options son los textos del conjunto, en
 *      su orden, y `answer` es la opción de `answer_index`.
 *   6. Toda ubicación de elección del documento con versión tiene conjunto.
 */
export const OPTION_SETS_INSERT_SQL = `
-- Conjuntos de opciones (content/option-sets.ts).
declare
  v_bad text;
begin

select string_agg(item_id || '@' || options_hash, ', ') into v_bad from (
  select x.item_id, x.options_hash
  from jsonb_to_recordset(d -> 'catalog' -> 'option_sets')
    as x(item_id text, version_hash text, options_hash text)
  left join public.exercise_item_versions v on v.item_id = x.item_id and v.content_hash = x.version_hash
  where v.id is null
  order by 1, 2 limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_option_sets: conjuntos de una versión que no existe: %', v_bad;
end if;

select string_agg(item_id || '@' || options_hash, ', ') into v_bad from (
  select x.item_id, x.options_hash
  from jsonb_to_recordset(d -> 'catalog' -> 'option_sets')
    as x(item_id text, version_hash text, options_hash text, format text, options jsonb, answer_index smallint)
  join public.exercise_item_versions v on v.item_id = x.item_id and v.content_hash = x.version_hash
  join public.exercise_option_sets s on s.item_version_id = v.id and s.options_hash = x.options_hash
  where (s.format, s.options, s.answer_index) is distinct from (x.format, x.options, x.answer_index)
  order by 1, 2 limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_option_sets: conjuntos ya cargados con el mismo hash y otras opciones: %', v_bad;
end if;

insert into public.exercise_option_sets (item_id, item_version_id, options_hash, format, options, answer_index,
  origin, generator, generator_version)
select x.item_id, v.id, x.options_hash, x.format, x.options, x.answer_index, x.origin, x.generator,
  x.generator_version
from jsonb_array_elements(d -> 'catalog' -> 'option_sets') with ordinality as t(j, ord),
  jsonb_to_record(t.j)
    as x(item_id text, version_hash text, options_hash text, format text, options jsonb, answer_index smallint,
         origin text, generator text, generator_version text)
join public.exercise_item_versions v on v.item_id = x.item_id and v.content_hash = x.version_hash
where not exists (select 1 from public.exercise_option_sets s
                  where s.item_version_id = v.id and s.options_hash = x.options_hash)
order by t.ord;

end;
`;

export const OPTION_SETS_PLACE_SQL = `
-- Conjunto vigente de cada ubicación de elección (content/option-sets.ts).
declare
  v_bad text;
begin

select string_agg(exercise_id, ', ') into v_bad from (
  select x.exercise_id
  from jsonb_to_recordset(d -> 'catalog' -> 'placement_option_sets')
    as x(exercise_id text, item_id text, options_hash text)
  left join public.exercises e on e.id = x.exercise_id
  left join public.exercise_option_sets s
    on s.item_version_id = e.item_version_id and s.options_hash = x.options_hash
  where e.id is null or e.item_id is distinct from x.item_id or s.id is null
  order by 1 limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_option_sets: ubicaciones sin fila, de otro ítem o sin ese conjunto en su versión: %', v_bad;
end if;

update public.exercises e set option_set_id = s.id
from jsonb_to_recordset(d -> 'catalog' -> 'placement_option_sets')
  as x(exercise_id text, item_id text, options_hash text)
join public.exercise_option_sets s on s.options_hash = x.options_hash
where e.id = x.exercise_id and s.item_version_id = e.item_version_id
  and e.option_set_id is distinct from s.id;

-- Checksum de la duplicación transitoria: exercises conserva la copia que lee la app.
select string_agg(id, ', ') into v_bad from (
  select e.id
  from public.exercises e
  join public.exercise_option_sets s on s.id = e.option_set_id
  where e.id in (select x ->> 'exercise_id' from jsonb_array_elements(d -> 'catalog' -> 'placement_option_sets') x)
    and ((select jsonb_agg(o -> 'text' order by n) from jsonb_array_elements(s.options) with ordinality as t(o, n))
           is distinct from e.payload -> 'options'
         or s.options -> s.answer_index::integer ->> 'text' is distinct from e.answer)
  order by e.id limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_option_sets: la copia de exercises no coincide con su conjunto: %', v_bad;
end if;

select string_agg(id, ', ') into v_bad from (
  select e.id
  from jsonb_to_recordset(d -> 'catalog' -> 'placement_versions') as x(exercise_id text)
  join public.exercises e on e.id = x.exercise_id
  where e.type in ('image_choice', 'translation_choice', 'fill_blank', 'listen_choice', 'context_choice')
    and e.option_set_id is null
  order by e.id limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_option_sets: ubicaciones de elección con versión y sin conjunto: %', v_bad;
end if;

end;
`;

export const OPTION_SETS_SQL = `${OPTION_SETS_INSERT_SQL}${OPTION_SETS_PLACE_SQL}`;
