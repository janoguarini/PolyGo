import type { Catalog } from '../content/catalog';
import type { OptionSetPlan } from '../content/option-sets';
import type { VersionSet } from '../content/versions';
import { OPTION_SETS_INSERT_SQL, OPTION_SETS_PLACE_SQL } from './option-sets-sql';
import { VERSIONS_INSERT_SQL, VERSIONS_PLACE_SQL } from './versions-sql';

/**
 * SQL del catálogo de aprendizaje (conceptos léxicos, ítems y sus conceptos) para incluir dentro del
 * bloque DO de una migración de contenido, donde `d` es el documento jsonb y `d -> 'catalog'` sale de
 * `catalogPayload`. Arquitectura de datos rev. 8, §4.3–§4.5 y §5.
 *
 * Idempotente y sin sentencias destructivas: sólo inserta lo que falta. Como un ítem no cambia nunca
 * (§5: si cambia el modo, los conceptos target o la privacidad, es un ítem nuevo) y un concepto sólo
 * cambia de estado, al final compara la base con el documento y aborta la migración si algo ya
 * cargado difiere, en vez de dejarlo distinto en silencio. La regla de dimensiones de §4.3 la valida
 * además el trigger diferido de item_concepts al confirmar.
 */
export function catalogPayload(
  catalog: Catalog,
  versions?: VersionSet,
  optionSets?: OptionSetPlan,
) {
  return {
    concepts: catalog.concepts,
    items: catalog.items,
    item_concepts: catalog.item_concepts,
    // Ubicaciones (PLACEMENTS_SQL), personas (PERSONAS_SQL) y objetivos (OBJECTIVES_SQL).
    placements: catalog.placements.map((p) => ({ exercise_id: p.exercise_id, item_id: p.item_id })),
    personas: catalog.personas,
    objectives: catalog.objectives,
    objective_concepts: catalog.objective_concepts,
    lesson_objectives: catalog.lesson_objectives,
    item_objectives: catalog.item_objectives,
    scope_lessons: catalog.lessons,
    // Versiones (VERSIONS_SQL). Sin ellas, VERSIONS_SQL no hace nada.
    ...(versions ? versionsPayload(versions) : {}),
    // Conjuntos de opciones (OPTION_SETS_SQL). Sin ellos, OPTION_SETS_SQL no hace nada.
    ...(optionSets ? optionSetsPayload(optionSets) : {}),
  };
}

/** Las filas de versiones del documento (scripts/versions-sql.ts). */
export function versionsPayload(versions: VersionSet) {
  return {
    versions: versions.versions,
    current_versions: versions.current_versions,
    placement_versions: versions.placement_versions,
  };
}

/** Las filas de conjuntos de opciones del documento (scripts/option-sets-sql.ts). */
export function optionSetsPayload(optionSets: OptionSetPlan) {
  return {
    option_sets: optionSets.option_sets,
    placement_option_sets: optionSets.placement_option_sets,
  };
}

/**
 * Los conjuntos de un subconjunto de ubicaciones: las de esos ítems (y, si se indica, de esos
 * ejercicios) y los conjuntos que usan.
 */
export function optionSetsOf(
  optionSets: OptionSetPlan,
  itemIds: ReadonlySet<string>,
  exerciseIds?: ReadonlySet<string>,
): OptionSetPlan {
  const placement_option_sets = optionSets.placement_option_sets.filter(
    (p) => itemIds.has(p.item_id) && (!exerciseIds || exerciseIds.has(p.exercise_id)),
  );
  const used = new Set(placement_option_sets.map((p) => `${p.item_id}@${p.options_hash}`));
  return {
    option_sets: optionSets.option_sets.filter((s) => used.has(`${s.item_id}@${s.options_hash}`)),
    placement_option_sets,
  };
}

/**
 * Las versiones de un subconjunto de ítems: las suyas, la vigente de cada uno y las ubicaciones del
 * documento que apuntan a ellos.
 */
export function versionsOf(
  versions: VersionSet,
  itemIds: ReadonlySet<string>,
  exerciseIds?: ReadonlySet<string>,
): VersionSet {
  return {
    versions: versions.versions.filter((v) => itemIds.has(v.item_id)),
    current_versions: versions.current_versions.filter((v) => itemIds.has(v.item_id)),
    placement_versions: versions.placement_versions.filter(
      (p) => itemIds.has(p.item_id) && (!exerciseIds || exerciseIds.has(p.exercise_id)),
    ),
    variable_options: versions.variable_options.filter((h) => itemIds.has(h.item_id)),
  };
}

/**
 * Todo el catálogo de un documento en el orden que piden las FK, en dos mitades:
 * - antes de escribir exercises: conceptos e ítems, personas, objetivos (necesitan conceptos,
 *   lecciones e ítems), versiones y su vigente (necesitan los ítems) y conjuntos de opciones
 *   (necesitan las versiones). Así un ejercicio nuevo se inserta ya con su ítem, su versión y su
 *   conjunto (EXERCISE_CATALOG_*), como exige V8.
 * - después: ubicaciones (exercises.item_id), versión de cada ubicación y su checksum, y conjunto de
 *   cada ubicación de elección y su checksum (necesitan el contenido ya escrito en exercises).
 * Las migraciones que sólo traen el catálogo (content:catalog) usan las dos seguidas.
 */
export const CATALOG_BEFORE_EXERCISES_SQL = () =>
  `${CATALOG_SQL}${PERSONAS_SQL}${OBJECTIVES_SQL}${VERSIONS_INSERT_SQL}${OPTION_SETS_INSERT_SQL}`;
export const CATALOG_AFTER_EXERCISES_SQL = () =>
  `${PLACEMENTS_SQL}${VERSIONS_PLACE_SQL}${OPTION_SETS_PLACE_SQL}`;
export const FULL_CATALOG_SQL = () =>
  `${CATALOG_BEFORE_EXERCISES_SQL()}${CATALOG_AFTER_EXERCISES_SQL()}`;

/**
 * Columnas del catálogo de un ejercicio nuevo, para el INSERT de exercises de content:sql y
 * content:diff (`x` es la fila del documento): el ítem, la versión y el conjunto que el documento le
 * asigna, ya cargados por CATALOG_BEFORE_EXERCISES_SQL. Las filas existentes no los cambian en el
 * upsert: los fijan PLACEMENTS_SQL, VERSIONS_PLACE_SQL y OPTION_SETS_PLACE_SQL, que además verifican.
 */
export const EXERCISE_CATALOG_COLUMNS = 'item_id, item_version_id, option_set_id';
export const EXERCISE_CATALOG_VALUES = 'cp.item_id, cv.version_id, cs.id';
export const EXERCISE_CATALOG_JOINS = `
left join (select y.exercise_id, y.item_id
           from jsonb_to_recordset(d -> 'catalog' -> 'placements') as y(exercise_id text, item_id text)) cp
  on cp.exercise_id = x.id
left join (select y.exercise_id, v.id as version_id
           from jsonb_to_recordset(d -> 'catalog' -> 'placement_versions')
             as y(exercise_id text, item_id text, content_hash text)
           join public.exercise_item_versions v on v.item_id = y.item_id and v.content_hash = y.content_hash) cv
  on cv.exercise_id = x.id and cp.item_id is not null
left join (select y.exercise_id, y.options_hash
           from jsonb_to_recordset(d -> 'catalog' -> 'placement_option_sets')
             as y(exercise_id text, item_id text, options_hash text)) co
  on co.exercise_id = x.id
left join public.exercise_option_sets cs on cs.item_version_id = cv.version_id and cs.options_hash = co.options_hash`;

export const CATALOG_SQL = `
-- Catálogo de aprendizaje (content/catalog.ts): conceptos léxicos, ítems y conceptos de cada ítem.
declare
  v_bad text;
begin

-- Un concepto léxico por palabra: id = palabra, nivel = el de su unidad. Activo si la palabra está
-- publicada (como en el backfill de 20261107120000_learning_concepts.sql).
insert into public.concepts (id, language_code, kind, word_id, level, status)
select x.id, x.language_code, 'lexical', x.id, x.level,
       case when w.is_published then 'active' else 'draft' end
from jsonb_to_recordset(d -> 'catalog' -> 'concepts') as x(id text, language_code text, level text)
join public.words w on w.id = x.id
on conflict (id) do nothing;

update public.concepts c set status = 'active'
from jsonb_to_recordset(d -> 'catalog' -> 'concepts') as x(id text), public.words w
where c.id = x.id and w.id = x.id and w.is_published and c.status = 'draft';

select string_agg(id, ', ') into v_bad from (
  select x.id
  from jsonb_to_recordset(d -> 'catalog' -> 'concepts') as x(id text, language_code text, level text)
  left join public.concepts c on c.id = x.id
  where c.id is null
     or (c.language_code, c.kind, c.word_id, c.level) is distinct from (x.language_code, 'lexical', x.id, x.level)
  order by x.id limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_concepts: conceptos ya cargados con otro idioma, tipo, palabra o nivel: %', v_bad;
end if;

insert into public.exercise_items (id, language_code, level, origin, type, assessment_mode, response_format,
  input_modality, response_privacy, status)
select x.id, x.language_code, x.level, x.origin, x.type, x.assessment_mode, x.response_format,
  x.input_modality, x.response_privacy, coalesce(x.status, 'active')
from jsonb_to_recordset(d -> 'catalog' -> 'items')
  as x(id text, language_code text, level text, origin text, type text, assessment_mode text,
       response_format text, input_modality text, response_privacy text, status text)
-- status: 'active' salvo que el documento diga otro (la fase C carga sus ítems en 'draft' para que
-- ningún repaso los tome antes de la revisión pedagógica; ver scripts/comprehension-sql.ts).
-- Sólo los que faltan: con V8, ON CONFLICT no alcanza (NOT NULL se valida antes que el conflicto).
where not exists (select 1 from public.exercise_items i where i.id = x.id)
on conflict (id) do nothing;

select string_agg(id, ', ') into v_bad from (
  select x.id
  from jsonb_to_recordset(d -> 'catalog' -> 'items')
    as x(id text, language_code text, level text, origin text, type text, assessment_mode text,
         response_format text, input_modality text, response_privacy text)
  join public.exercise_items i on i.id = x.id
  where (i.language_code, i.level, i.origin, i.type, i.assessment_mode, i.response_format,
         i.input_modality, i.response_privacy)
     is distinct from (x.language_code, x.level, x.origin, x.type, x.assessment_mode, x.response_format,
         x.input_modality, x.response_privacy)
  order by x.id limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_items: ítems ya cargados con otra definición (un ítem no cambia: es un ítem nuevo): %', v_bad;
end if;

insert into public.item_concepts (item_id, concept_id, dimension, role, language_code)
select x.item_id, x.concept_id, x.dimension, x.role, x.language_code
from jsonb_to_recordset(d -> 'catalog' -> 'item_concepts')
  as x(item_id text, concept_id text, dimension text, role text, language_code text)
on conflict do nothing;

-- Los conceptos de un ítem ya cargado no cambian (§5): la base tiene que tener exactamente los del documento.
with doc as (
  select x.item_id, x.concept_id, x.dimension, x.role
  from jsonb_to_recordset(d -> 'catalog' -> 'item_concepts')
    as x(item_id text, concept_id text, dimension text, role text)
),
db as (
  select ic.item_id, ic.concept_id, ic.dimension, ic.role
  from public.item_concepts ic
  where ic.item_id in (select x ->> 'id' from jsonb_array_elements(d -> 'catalog' -> 'items') x)
),
diff as (
  (select * from db except select * from doc)
  union all
  (select * from doc except select * from db)
)
select string_agg(item_id, ', ') into v_bad from (
  select distinct item_id from diff order by item_id limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_item_concepts: ítems ya cargados con otros conceptos (es un ítem nuevo): %', v_bad;
end if;

end;
`;

/**
 * Ubicaciones (`exercises.item_id`, §5): cada ejercicio del documento apunta a su ítem. Las copias de
 * la consolidación apuntan al ítem escrito original. Va después de CATALOG_SQL (el ítem ya existe).
 * Aborta si la ubicación no existe, o si el ítem es de otro idioma o de otro tipo que el ejercicio.
 * Si una ubicación cambia de ítem (un reemplazo, docs/LEARNING_CATALOG_PHASE1.md §2), su versión pasa
 * a la del ítem nuevo que asigna el documento (ya cargada por VERSIONS_INSERT_SQL), o a nula si el
 * documento no trae versiones (--only placements): la anterior era una versión del ítem anterior.
 */
export const PLACEMENTS_SQL = `
-- Ubicaciones (content/catalog.ts, Catalog.placements): exercises.item_id.
declare
  v_bad text;
begin

select string_agg(exercise_id, ', ') into v_bad from (
  select x.exercise_id
  from jsonb_to_recordset(d -> 'catalog' -> 'placements') as x(exercise_id text, item_id text)
  left join public.exercises e on e.id = x.exercise_id
  left join public.lessons l on l.id = e.lesson_id
  left join public.curriculum_units u on u.id = l.unit_id
  left join public.exercise_items i on i.id = x.item_id
  where e.id is null or i.id is null
     or u.language_code is distinct from i.language_code
     or e.type is distinct from i.type
  order by x.exercise_id limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_placements: ejercicios sin fila, sin ítem o con un ítem de otro idioma o tipo: %', v_bad;
end if;

-- Si cambia de ítem, la versión pasa a la que el documento le asigna en el ítem nuevo (ya cargada), o
-- a nula si el documento no trae versiones. El conjunto lo corrige OPTION_SETS_PLACE_SQL (FK diferida).
update public.exercises e
set item_id = x.item_id,
    item_version_id = case when e.item_id = x.item_id then e.item_version_id else (
      select v.id
      from jsonb_to_recordset(d -> 'catalog' -> 'placement_versions')
        as pv(exercise_id text, item_id text, content_hash text)
      join public.exercise_item_versions v on v.item_id = pv.item_id and v.content_hash = pv.content_hash
      where pv.exercise_id = e.id and pv.item_id = x.item_id) end
from jsonb_to_recordset(d -> 'catalog' -> 'placements') as x(exercise_id text, item_id text)
where e.id = x.exercise_id and e.item_id is distinct from x.item_id;

end;
`;

/**
 * Objetivos y sus relaciones (§4.5; content/objectives.ts). Inserta lo nuevo y actualiza textos,
 * posición, estado, group_key y roles. Un objetivo no cambia de idioma, nivel ni actividad del MCER:
 * si cambia, aborta (es un objetivo nuevo). Sin sentencias destructivas: si la base tiene una relación
 * que el contenido ya no tiene (en las lecciones e ítems de este documento), aborta y pide una
 * migración escrita a mano.
 */
export const OBJECTIVES_SQL = `
-- Objetivos de aprendizaje (content/objectives.ts) y sus relaciones.
declare
  v_bad text;
begin

select string_agg(id, ', ') into v_bad from (
  select x.id
  from jsonb_to_recordset(d -> 'catalog' -> 'objectives')
    as x(id text, language_code text, level text, cefr_activity text)
  join public.learning_objectives o on o.id = x.id
  where (o.language_code, o.level, o.cefr_activity) is distinct from (x.language_code, x.level, x.cefr_activity)
  order by x.id limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_objectives: objetivos ya cargados con otro idioma, nivel o actividad (es un objetivo nuevo): %', v_bad;
end if;

insert into public.learning_objectives (id, language_code, level, cefr_activity, can_do_es, description_es,
  cefr_ref, group_key, position, status)
select x.id, x.language_code, x.level, x.cefr_activity, x.can_do_es, x.description_es, x.cefr_ref,
  x.group_key, x.position, x.status
from jsonb_to_recordset(d -> 'catalog' -> 'objectives')
  as x(id text, language_code text, level text, cefr_activity text, can_do_es text, description_es text,
       cefr_ref text, group_key text, position smallint, status text)
on conflict (id) do update set can_do_es = excluded.can_do_es, description_es = excluded.description_es,
  cefr_ref = excluded.cefr_ref, group_key = excluded.group_key, position = excluded.position,
  status = excluded.status
where (learning_objectives.can_do_es, learning_objectives.description_es, learning_objectives.cefr_ref,
       learning_objectives.group_key, learning_objectives.position, learning_objectives.status)
   is distinct from (excluded.can_do_es, excluded.description_es, excluded.cefr_ref, excluded.group_key,
       excluded.position, excluded.status);

insert into public.objective_concepts (objective_id, concept_id, role, language_code)
select x.objective_id, x.concept_id, x.role, x.language_code
from jsonb_to_recordset(d -> 'catalog' -> 'objective_concepts')
  as x(objective_id text, concept_id text, role text, language_code text)
on conflict (objective_id, concept_id) do update set role = excluded.role
where objective_concepts.role is distinct from excluded.role;

insert into public.lesson_objectives (lesson_id, objective_id, role)
select x.lesson_id, x.objective_id, x.role
from jsonb_to_recordset(d -> 'catalog' -> 'lesson_objectives') as x(lesson_id text, objective_id text, role text)
on conflict (lesson_id, objective_id) do update set role = excluded.role
where lesson_objectives.role is distinct from excluded.role;

insert into public.item_objectives (item_id, objective_id, language_code)
select x.item_id, x.objective_id, x.language_code
from jsonb_to_recordset(d -> 'catalog' -> 'item_objectives')
  as x(item_id text, objective_id text, language_code text)
on conflict do nothing;

-- Relaciones que la base tiene y el contenido ya no: no se borran acá.
with objectives as (
  select x ->> 'id' id from jsonb_array_elements(d -> 'catalog' -> 'objectives') x
),
gone as (
  select 'concepto ' || oc.objective_id || '/' || oc.concept_id what
  from public.objective_concepts oc
  where oc.objective_id in (select id from objectives)
    and not exists (select 1 from jsonb_to_recordset(d -> 'catalog' -> 'objective_concepts')
                      as x(objective_id text, concept_id text)
                    where x.objective_id = oc.objective_id and x.concept_id = oc.concept_id)
  union all
  select 'lección ' || lo.lesson_id || '/' || lo.objective_id
  from public.lesson_objectives lo
  where lo.lesson_id in (select jsonb_array_elements_text(d -> 'catalog' -> 'scope_lessons'))
    and not exists (select 1 from jsonb_to_recordset(d -> 'catalog' -> 'lesson_objectives')
                      as x(lesson_id text, objective_id text)
                    where x.lesson_id = lo.lesson_id and x.objective_id = lo.objective_id)
  union all
  select 'ítem ' || io.item_id || '/' || io.objective_id
  from public.item_objectives io
  where io.item_id in (select x ->> 'id' from jsonb_array_elements(d -> 'catalog' -> 'items') x)
    and not exists (select 1 from jsonb_to_recordset(d -> 'catalog' -> 'item_objectives')
                      as x(item_id text, objective_id text)
                    where x.item_id = io.item_id and x.objective_id = io.objective_id)
)
select string_agg(what, ', ') into v_bad from (select what from gone order by what limit 5) z;
if v_bad is not null then
  raise exception 'catalog_objectives: relaciones que el contenido ya no tiene (quitarlas requiere una migración escrita a mano): %', v_bad;
end if;

end;
`;

/**
 * Personas ficticias (§13.2; content/personas.ts). Una persona cargada no cambia: si el contenido la
 * cambia, aborta (las versiones copian sus datos en el texto).
 */
export const PERSONAS_SQL = `
-- Personas ficticias (content/personas.ts).
declare
  v_bad text;
begin

insert into public.content_personas (id, language_code, display_name, age, city, country, phone, email)
select x.id, x.language_code, x.display_name, x.age, x.city, x.country, x.phone, x.email
from jsonb_to_recordset(d -> 'catalog' -> 'personas')
  as x(id text, language_code text, display_name text, age smallint, city text, country text, phone text,
       email text)
on conflict (id) do nothing;

select string_agg(id, ', ') into v_bad from (
  select x.id
  from jsonb_to_recordset(d -> 'catalog' -> 'personas')
    as x(id text, language_code text, display_name text, age smallint, city text, country text, phone text,
         email text)
  join public.content_personas p on p.id = x.id
  where (p.language_code, p.display_name, p.age, p.city, p.country, p.phone, p.email)
     is distinct from (x.language_code, x.display_name, x.age, x.city, x.country, x.phone, x.email)
  order by x.id limit 5
) z;
if v_bad is not null then
  raise exception 'catalog_personas: personas ya cargadas con otros datos (una persona no cambia): %', v_bad;
end if;

end;
`;
