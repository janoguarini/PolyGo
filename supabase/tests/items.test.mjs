// Ítems de aprendizaje y sus conceptos (migraciones 20261107130000_learning_items.sql y
// 20261107130101–04_learning_items_<idioma>.sql, 20261107140000_learning_ref_input_modalities.sql y
// 20261107140100_learning_items_match_pairs.sql), probados en PGlite. Arquitectura de datos rev. 8,
// §4.1–§4.5 y §5. El contenido nuevo de prueba se carga sólo dentro de transacciones que se revierten.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { CURRICULUM_PATH, COURSES } from '../../content/index.ts';
import { buildCatalog } from '../../content/catalog.ts';
import { unitPath } from '../../content/path.ts';
import { gradingSpecFor } from '../../shared/grading.ts';
import { contentSql } from '../../scripts/content-sql.ts';
import { COMPREHENSION_PATH } from '../../content/comprehension.ts';
import { PLANNED_PATH } from '../../content/planned.ts';
import { SUPPLEMENT_PATH } from '../../content/supplement.ts';
import { A2_EXPANSION_PATH } from '../../content/a2-expansion.ts';
import { B1_PATH } from '../../content/b1.ts';
import { B2_PATH } from '../../content/b2.ts';
import { PT_PATH } from '../../content/pt-course.ts';
import { IT_PATH } from '../../content/it-course.ts';
import { ZH_PATH } from '../../content/zh-course.ts';
import { ES_PATH } from '../../content/es-course.ts';
import { FR_PATH } from '../../content/fr-course.ts';

let db;
let alice;
const catalog = buildCatalog(CURRICULUM_PATH);
// Fase C (docs/LEARNING_PHASE_C.md): 72 ítems context_choice en draft, de lecciones sin publicar.
const phaseC = buildCatalog(COMPREHENSION_PATH);
// Fase C.3 (docs/LEARNING_PHASE_C.md §C3): lecciones escritas de U13 y U14, sin publicar, ítems en draft.
// Cierre de inglés A1 (docs/A1_EN_CLOSURE.md): agregados a unidades cargadas, sin publicar, ítems en
// draft. Se cuentan junto con los de la C.3 (mismo estado: draft, sin publicar).
const c3 = buildCatalog(PLANNED_PATH);
const closure = buildCatalog(SUPPLEMENT_PATH);
// Inglés A2 completo (docs/A2_EN_COMPLETION.md): U13–U17 sin publicar, ítems en draft. Mismo estado.
const a2 = buildCatalog(A2_EXPANSION_PATH);
const b1 = buildCatalog(B1_PATH);
const b2 = buildCatalog(B2_PATH);
// Portugués A1 U13–U16 y A2 (docs/PT_A1_A2.md): sin publicar, ítems en draft. Mismo estado.
const pt = buildCatalog(PT_PATH);
// Italiano A1 U13–U16 y A2 (docs/IT_A1_A2.md): sin publicar, ítems en draft. Mismo estado.
const it_ = buildCatalog(IT_PATH);
// Chino A1 U13–U16 y A2 (docs/ZH_A1_A2.md): sin publicar, ítems en draft. Mismo estado.
const zh_ = buildCatalog(ZH_PATH);
// Francés A1 y A2 (docs/FR_A1_A2.md): sin publicar, ítems en draft. Mismo estado.
const fr_ = buildCatalog(FR_PATH);
const es_ = buildCatalog(ES_PATH);
const planned = {
  items: [
    ...c3.items,
    ...closure.items,
    ...a2.items,
    ...b1.items,
    ...b2.items,
    ...pt.items,
    ...it_.items,
    ...zh_.items,
    ...fr_.items,
    ...es_.items,
  ],
  item_concepts: [
    ...c3.item_concepts,
    ...closure.item_concepts,
    ...a2.item_concepts,
    ...b1.item_concepts,
    ...b2.item_concepts,
    ...pt.item_concepts,
    ...it_.item_concepts,
    ...zh_.item_concepts,
    ...fr_.item_concepts,
    ...es_.item_concepts,
  ],
};
const plannedOf = (origin) => planned.items.filter((i) => i.origin === origin).length;

before(async () => {
  db = await createDb();
  alice = await createUser(db, 'alice@test.dev');
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const all = async (sql, params = []) => (await db.query(sql, params)).rows;
const migration = (name) => readFileSync(new URL(`../migrations/${name}`, import.meta.url), 'utf8');
const BACKFILLS = readdirSync(new URL('../migrations/', import.meta.url))
  .filter((f) => /_learning_items_[a-z_]+\.sql$/.test(f))
  .sort();

/**
 * Ejecuta sql en una transacción que siempre se revierte; antes de revertir comprueba los triggers
 * diferidos (set constraints all immediate). Devuelve el error, si hubo.
 */
async function rejected(sql) {
  await db.exec('begin');
  try {
    await db.exec(sql);
    await db.exec('set constraints all immediate');
    return null;
  } catch (err) {
    return err;
  } finally {
    await db.exec('rollback');
  }
}

/**
 * Primera versión de un ítem de prueba y su puntero, en la misma transacción que el ítem (V8.1).
 * `id` y `type` son literales SQL ya entrecomillados, como en los fixtures de este archivo.
 */
const versionSql = (id, type) => `
  insert into public.exercise_item_versions (item_id, version, content_hash, prompt_es, payload, answer,
    accepted_answers, difficulty, recommended_seconds, grading_spec)
  values (${id}, 1, 'test:' || ${id}, 'p', jsonb_build_object('type', ${type}), 'a', '{}', 1, 20,
    '${JSON.stringify(gradingSpecFor(type.replaceAll("'", '')))}'::jsonb);
  update public.exercise_items set current_version_id =
    (select v.id from public.exercise_item_versions v where v.item_id = ${id} and v.version = 1)
  where id = ${id};`;

/** Ejecuta fn dentro de una transacción que se revierte al final. */
async function inRollback(fn) {
  await db.exec('begin');
  try {
    return await fn();
  } finally {
    await db.exec('rollback');
  }
}

const sortBy = (rows, ...keys) =>
  [...rows].sort((a, b) => {
    for (const k of keys) {
      const c = String(a[k]).localeCompare(String(b[k]));
      if (c) return c;
    }
    return 0;
  });

const dbItems = async () =>
  sortBy(
    await all(`select id, language_code, level, origin, type, assessment_mode, response_format,
                      input_modality, response_privacy from public.exercise_items`),
    'id',
  );
const dbItemConcepts = async () =>
  sortBy(
    await all(
      `select item_id, concept_id, dimension, role, language_code from public.item_concepts`,
    ),
    'item_id',
    'concept_id',
    'dimension',
  );
const counts = () =>
  one(`select
    (select count(*)::int from public.concepts) concepts,
    (select count(*)::int from public.exercise_items) items,
    (select count(*)::int from public.item_concepts) item_concepts,
    (select count(*)::int from public.exercises) exercises,
    (select count(*)::int from public.exercise_words) exercise_words,
    (select count(*)::int from public.words) words`);

test('input_modality: sólo la FK a ref_input_modalities la valida; origin y role siguen con CHECK (excepción documentada)', async () => {
  assert.deepEqual(
    (await all('select id from public.ref_input_modalities order by id')).map((r) => r.id),
    ['audio', 'audio_text', 'image', 'text'],
  );
  const cons = await all(`select conname, contype from pg_constraint
    where conrelid in ('public.exercise_items'::regclass, 'public.item_concepts'::regclass)
      and conname in ('exercise_items_input_modality_fkey', 'exercise_items_origin_check',
                      'item_concepts_role_check')
    order by conname`);
  assert.deepEqual(
    cons.map((c) => `${c.conname}:${c.contype}`),
    [
      'exercise_items_input_modality_fkey:f',
      'exercise_items_origin_check:c',
      'item_concepts_role_check:c',
    ],
  );
  // Ninguna otra restricción (salvo el NOT NULL) menciona input_modality: el CHECK redundante ya no existe.
  const others = await all(`select conname from pg_constraint
    where conrelid = 'public.exercise_items'::regclass and contype <> 'n'
      and pg_get_constraintdef(oid) like '%input_modality%'
      and conname <> 'exercise_items_input_modality_fkey'`);
  assert.deepEqual(others, []);
  // Las filas cumplen la FK.
  const orphan = await one(`select count(*)::int n from public.exercise_items i
    where not exists (select 1 from public.ref_input_modalities m where m.id = i.input_modality)`);
  assert.equal(orphan.n, 0);
  // Un canal fuera del catálogo se rechaza; uno nuevo se agrega con un INSERT, sin DROP CONSTRAINT.
  const item = `insert into public.exercise_items (id, language_code, level, origin, type,
      assessment_mode, response_format, input_modality, response_privacy, status)
    values ('zz-a1-u99-l01-e01', 'en', 'A1', 'authored', 'translation_choice', 'recognition',
      'select', 'video', 'closed', 'draft');${versionSql("'zz-a1-u99-l01-e01'", "'translation_choice'")}`;
  assert.match(String((await rejected(item))?.message), /exercise_items_input_modality_fkey/);
  assert.equal(
    await rejected(`insert into public.ref_input_modalities (id) values ('video'); ${item}`),
    null,
  );
});

test('tablas de referencia con los valores de §4.1, §4.2, §7.1 y §13.2', async () => {
  assert.deepEqual(await all('select id, direction from public.ref_cefr_activities order by id'), [
    { id: 'interaction', direction: 'interaction' },
    { id: 'listening', direction: 'reception' },
    { id: 'mediation', direction: 'mediation' },
    { id: 'reading', direction: 'reception' },
    { id: 'speaking', direction: 'production' },
    { id: 'writing', direction: 'production' },
  ]);
  assert.deepEqual(
    await all(`select id, retrieval_rank, feeds_comprehension fc, feeds_production fp
               from public.ref_assessment_modes order by retrieval_rank nulls last, id`),
    [
      { id: 'recognition', retrieval_rank: 1, fc: false, fp: false },
      { id: 'cued_recall', retrieval_rank: 2, fc: false, fp: false },
      { id: 'guided_construction', retrieval_rank: 3, fc: false, fp: false },
      { id: 'free_recall', retrieval_rank: 4, fc: false, fp: false },
      { id: 'controlled_production', retrieval_rank: 5, fc: false, fp: true },
      { id: 'free_production', retrieval_rank: 6, fc: false, fp: true },
      { id: 'listening_comprehension', retrieval_rank: null, fc: true, fp: false },
      { id: 'reading_comprehension', retrieval_rank: null, fc: true, fp: false },
    ],
  );
  const formats = await all(
    `select assessment_mode m, string_agg(response_format, ',' order by response_format) f
     from public.ref_mode_formats group by 1 order by 1`,
  );
  assert.deepEqual(Object.fromEntries(formats.map((r) => [r.m, r.f])), {
    controlled_production: 'speech,typed',
    cued_recall: 'typed',
    free_production: 'speech,typed',
    free_recall: 'speech,typed',
    guided_construction: 'tiles',
    listening_comprehension: 'select,typed',
    reading_comprehension: 'select,typed',
    recognition: 'pairs,select',
  });
  // Sólo los modos de producción con typed/speech alimentan production (§4.2).
  assert.deepEqual(
    (
      await all(`select distinct f.response_format from public.ref_mode_formats f
                 join public.ref_assessment_modes m on m.id = f.assessment_mode
                 where m.feeds_production order by 1`)
    ).map((r) => r.response_format),
    ['speech', 'typed'],
  );
  assert.deepEqual(await all('select id, optional from public.ref_assists order by id'), [
    { id: 'audio_replays', optional: true },
    { id: 'hints_revealed', optional: true },
    { id: 'prompt_audio_plays', optional: true },
    { id: 'reading_toggles', optional: true },
    { id: 'reading_visible', optional: true },
    { id: 'slow_audio_plays', optional: true },
  ]);
  assert.deepEqual(
    await all('select id, retention_months from public.ref_response_privacy order by id'),
    [
      { id: 'closed', retention_months: 24 },
      { id: 'fictional', retention_months: 24 },
      { id: 'open_text', retention_months: 24 },
    ],
  );
});

test('la base tiene exactamente los ítems y conceptos de ítems de content/', async () => {
  assert.equal(BACKFILLS.length, 5);
  assert.deepEqual(
    await dbItems(),
    sortBy([...catalog.items, ...phaseC.items, ...planned.items], 'id'),
  );
  assert.deepEqual(
    await dbItemConcepts(),
    sortBy(
      [...catalog.item_concepts, ...phaseC.item_concepts, ...planned.item_concepts],
      'item_id',
      'concept_id',
      'dimension',
    ),
  );
  const r = await one(`select
    count(*)::int n,
    count(*) filter (where status <> 'active')::int not_active,
    count(*) filter (where cefr_activity is not null or retired_at is not null)::int with_extra,
    count(*) filter (where origin = 'authored')::int authored,
    count(*) filter (where origin = 'generated')::int generated
    from public.exercise_items`);
  // Active los del backfill publicado; draft sólo los de la fase C (75 desde la C.1). Sin actividad del MCER deducida
  // y sin retirar.
  // Más los de U13 y U14 (fase C.3), también en draft.
  assert.deepEqual(r, {
    n: 4198 + phaseC.items.length + planned.items.length,
    not_active: phaseC.items.length + planned.items.length,
    with_extra: 0,
    authored: 2410 + phaseC.items.length + plannedOf('authored'),
    generated: 1788 + plannedOf('generated'),
  });
  const drafts = await all(
    `select id from public.exercise_items where status <> 'active' order by id`,
  );
  assert.deepEqual(
    drafts.map((d) => d.id),
    [...phaseC.items, ...planned.items].map((i) => i.id).sort(),
  );
});

test('cada ejercicio publicado tiene exactamente un ítem (también los 300 match_pairs generados)', async () => {
  const published = (
    await all(`select e.id, e.type, e.lesson_id from public.exercises e
               join public.lessons l on l.id = e.lesson_id
               join public.curriculum_units u on u.id = l.unit_id
               where e.is_published and u.id not like 'test-%'`)
  ).sort((a, b) => a.id.localeCompare(b.id));
  assert.equal(published.length, 5410);
  const placed = new Map(catalog.placements.map((p) => [p.exercise_id, p.item_id]));
  assert.equal(placed.size, published.length);
  const items = new Set((await all('select id from public.exercise_items')).map((r) => r.id));
  const authoredLesson = /-l\d\d$/;
  let copies = 0;
  let sets = 0;
  for (const e of published) {
    const item = placed.get(e.id);
    assert.ok(item && items.has(item), `${e.id} sin ítem`);
    // Ejercicios escritos: el ítem es su id actual, congelado.
    if (authoredLesson.test(e.lesson_id)) assert.equal(item, e.id);
    else if (item.includes('.gen.match_pairs.set.')) {
      assert.equal(e.type, 'match_pairs', e.id);
      sets += 1;
    } else if (!item.includes('.gen.')) copies += 1;
  }
  assert.equal(copies, 948, 'las 948 copias de §1 son ubicaciones de su original');
  assert.equal(sets, 300, 'los 300 match_pairs generados tienen ítem de conjunto');
});

test('match_pairs generados: un ítem por conjunto, una fila vocabulary por pareja, nivel más alto', async () => {
  const r = await one(`select
    count(*)::int items,
    count(*) filter (where i.level <> (select max(c.level) from public.item_concepts ic
       join public.concepts c on c.id = ic.concept_id where ic.item_id = i.id))::int bad_level,
    count(*) filter (where i.id <> i.language_code || '.gen.match_pairs.set.' || (
       select string_agg(ic.concept_id, '+' order by ic.concept_id collate "C")
       from public.item_concepts ic where ic.item_id = i.id))::int bad_id,
    count(*) filter (where (select count(*) from public.item_concepts ic where ic.item_id = i.id
       and ic.dimension = 'vocabulary' and ic.role = 'target') <> 4)::int not_four,
    count(*) filter (where exists (select 1 from public.item_concepts ic where ic.item_id = i.id
       and ic.dimension <> 'vocabulary'))::int other_dims,
    count(*) filter (where i.level = 'A2' and i.language_code = 'en')::int a2
    from public.exercise_items i where i.id like '%.gen.match_pairs.set.%'`);
  // 300 publicados más los de la consolidación de U13 y U14 (fase C.3, draft).
  assert.equal(
    r.items,
    300 + planned.items.filter((i) => i.id.includes('.gen.match_pairs.set.')).length,
  );
  assert.deepEqual(
    { ...r, items: undefined, a2: undefined },
    { items: undefined, a2: undefined, bad_level: 0, bad_id: 0, not_four: 0, other_dims: 0 },
  );
  assert.ok(r.a2 > 0);
});

test('los conceptos target de cada ubicación son sus palabras de exercise_words', async () => {
  const r = await one(
    `with p as (select * from jsonb_to_recordset($1::jsonb) as x(exercise_id text, item_id text)),
     ew as (select p.exercise_id, ew.word_id c from p join public.exercise_words ew on ew.exercise_id = p.exercise_id),
     ic as (select distinct p.exercise_id, ic.concept_id c from p
            join public.item_concepts ic on ic.item_id = p.item_id and ic.role = 'target')
     select (select count(*)::int from (select * from ew except select * from ic) a) only_words,
            (select count(*)::int from (select * from ic except select * from ew) b) only_items,
            (select count(*)::int from ew) links`,
    [JSON.stringify(catalog.placements)],
  );
  assert.ok(r.links > 0);
  assert.equal(r.only_words, 0);
  assert.equal(r.only_items, 0);
  // Cada fila tiene la dimensión de conocimiento del concepto: todo concepto target tiene vocabulary.
  const missing = await one(`select count(*)::int n from (
    select item_id, concept_id from public.item_concepts where role = 'target'
    except select item_id, concept_id from public.item_concepts where dimension = 'vocabulary') z`);
  assert.equal(missing.n, 0);
});

test('idiomas y niveles: ítem, concepto, palabra y unidad coinciden', async () => {
  const r = await one(`select
    (select count(*)::int from public.item_concepts ic
       join public.exercise_items i on i.id = ic.item_id
       join public.concepts c on c.id = ic.concept_id
       where ic.language_code <> i.language_code or ic.language_code <> c.language_code) lang_mismatch,
    (select count(*)::int from public.exercise_items i
       join public.exercises e on e.item_id = i.id and i.origin = 'authored'
       join public.lessons l on l.id = e.lesson_id
       join public.curriculum_units u on u.id = l.unit_id
       where i.language_code <> u.language_code or i.level <> u.level) authored_mismatch,
    (select count(*)::int from public.exercise_items i where i.origin = 'authored'
       and not exists (select 1 from public.exercises e where e.item_id = i.id)) authored_without_exercise,
    (select count(*)::int from public.exercise_items i
       join public.item_concepts ic on ic.item_id = i.id
       join public.concepts c on c.id = ic.concept_id
       where i.origin = 'generated' and i.id not like '%.gen.match_pairs.set.%'
         and (i.level <> c.level or i.id <> i.language_code || '.gen.' || i.type || '.' || c.id))
       generated_mismatch,
    (select count(*)::int from public.exercise_items i where i.origin = 'generated'
       and i.id not like '%.gen.match_pairs.set.%'
       and (select count(distinct concept_id) from public.item_concepts ic where ic.item_id = i.id) <> 1)
       generated_not_one_word`);
  assert.deepEqual(r, {
    lang_mismatch: 0,
    authored_mismatch: 0,
    authored_without_exercise: 0,
    generated_mismatch: 0,
    generated_not_one_word: 0,
  });
  const byLang = await all(
    `select language_code, count(*)::int n from public.exercise_items group by 1 order by 1`,
  );
  assert.deepEqual(byLang, [
    {
      language_code: 'en',
      n:
        1681 +
        phaseC.items.length +
        planned.items.length -
        pt.items.length -
        it_.items.length -
        zh_.items.length -
        fr_.items.length -
        es_.items.length,
    },
    // El español A1 y A2 (docs/ES_A1_A2.md), sin publicar: no tenía ítems.
    { language_code: 'es', n: es_.items.length },
    // El francés A1 y A2 (docs/FR_A1_A2.md), sin publicar: no tenía ítems.
    { language_code: 'fr', n: fr_.items.length },
    // Más el italiano A1 U13–U16 y A2 (docs/IT_A1_A2.md), sin publicar.
    { language_code: 'it', n: 844 + it_.items.length },
    // Más el portugués A1 U13–U16 y A2 (docs/PT_A1_A2.md), sin publicar.
    { language_code: 'pt', n: 842 + pt.items.length },
    // Más el chino A1 U13–U16 y A2 (docs/ZH_A1_A2.md), sin publicar.
    { language_code: 'zh', n: 831 + zh_.items.length },
  ]);
});

test('modos y dimensiones según §4.3 y §4.4', async () => {
  // La función del trigger no encuentra ninguna violación en ningún ítem.
  const bad = await one(`select count(*)::int n from public.exercise_items i
                         where public.item_concepts_rule_violation(i.id) is not null`);
  assert.equal(bad.n, 0);
  const modes = await all(`select type, assessment_mode m, response_format f, input_modality i,
                                  response_privacy p, count(*)::int n
                           from public.exercise_items group by 1, 2, 3, 4, 5 order by 1, 2`);
  const byType = {};
  for (const r of modes) (byType[r.type] ??= []).push(`${r.m}/${r.f}/${r.i}/${r.p}`);
  for (const k of Object.keys(byType)) byType[k].sort();
  assert.deepEqual(byType, {
    complete_word: ['cued_recall/typed/text/open_text'],
    context_choice: [
      'listening_comprehension/select/audio/closed',
      'reading_comprehension/select/text/closed',
    ],
    fill_blank: ['recognition/select/text/closed'],
    image_choice: ['recognition/select/image/closed'],
    listen_choice: ['recognition/select/audio/closed'],
    match_pairs: ['recognition/pairs/text/closed'],
    order_words: ['guided_construction/tiles/text/closed'],
    // fictional: las respuestas sobre la persona ficticia de U13 (fase C.3, §13.2).
    short_answer: [
      'controlled_production/typed/audio_text/fictional',
      'controlled_production/typed/audio_text/open_text',
    ],
    translate_write: [
      'controlled_production/typed/text/open_text',
      'free_recall/typed/text/open_text',
    ],
    translation_choice: ['recognition/select/text/closed'],
  });
  // Dimensiones: vocabulary siempre; production sólo en los modos de producción; comprehension sólo en
  // los de comprensión (fase C); nada más.
  const dims =
    await all(`select m.id mode, ic.dimension, count(*)::int n from public.item_concepts ic
                          join public.exercise_items i on i.id = ic.item_id
                          join public.ref_assessment_modes m on m.id = i.assessment_mode
                          group by 1, 2 order by 1, 2`);
  for (const d of dims) {
    if (d.dimension === 'production') assert.equal(d.mode, 'controlled_production');
    else if (d.dimension === 'comprehension')
      assert.ok(
        ['reading_comprehension', 'listening_comprehension'].includes(d.mode),
        JSON.stringify(d),
      );
    else assert.equal(d.dimension, 'vocabulary', JSON.stringify(d));
  }
  // translate_write: free_recall sólo si la respuesta es una palabra del currículo (§4.4).
  const tw = await one(`select
    count(*) filter (where i.assessment_mode = 'free_recall' and i.origin = 'generated')::int gen_recall,
    count(*) filter (where i.origin = 'generated' and i.assessment_mode <> 'free_recall')::int gen_other
    from public.exercise_items i where i.type = 'translate_write'`);
  assert.ok(tw.gen_recall > 0);
  assert.equal(tw.gen_other, 0, 'los translate_write generados escriben una palabra');
  const sentence = await one(`select i.assessment_mode from public.exercise_items i
    join public.exercises e on e.id = i.id where e.type = 'translate_write' and e.answer like '% % %' limit 1`);
  assert.equal(sentence.assessment_mode, 'controlled_production');
});

test('restricciones de integridad de exercise_items e item_concepts', async () => {
  const w = await one(
    `select c.id, c.language_code from public.concepts c where c.language_code = 'en' order by c.id limit 1`,
  );
  const it = await one(
    `select id from public.concepts where language_code = 'it' order by id limit 1`,
  );
  const rec = await one(
    `select id from public.exercise_items where assessment_mode = 'recognition' and language_code = 'en' order by id limit 1`,
  );
  const prod = await one(
    `select id from public.exercise_items where assessment_mode = 'controlled_production' and language_code = 'en' order by id limit 1`,
  );
  const prodConcept = await one(
    `select concept_id from public.item_concepts where item_id = $1 limit 1`,
    [prod.id],
  );
  const item = (over = {}) => {
    const v = {
      id: "'t.x'",
      language_code: "'en'",
      level: "'A1'",
      origin: "'authored'",
      type: "'short_answer'",
      assessment_mode: "'controlled_production'",
      response_format: "'typed'",
      input_modality: "'audio_text'",
      response_privacy: "'open_text'",
      status: "'active'",
      cefr_activity: 'null',
      ...over,
    };
    // Con su primera versión y su puntero (V8.1: un ítem sin vigente no confirma).
    return `insert into public.exercise_items (${Object.keys(v).join(', ')}) values (${Object.values(v).join(', ')});${versionSql(v.id, v.type)}`;
  };
  const ic = (concept, dimension, role = 'target', lang = 'en', itemId = 't.x') =>
    `insert into public.item_concepts (item_id, concept_id, dimension, role, language_code)
     values ('${itemId}', '${concept}', '${dimension}', '${role}', '${lang}');`;
  const ok = item() + ic(w.id, 'vocabulary') + ic(w.id, 'production');
  const cases = [
    [
      'modo incompatible con el formato',
      'exercise_items_mode_format_fkey',
      item({ assessment_mode: "'controlled_production'", response_format: "'select'" }),
    ],
    [
      'producción con opciones',
      'exercise_items_mode_format_fkey',
      item({ assessment_mode: "'free_production'", response_format: "'pairs'" }),
    ],
    [
      'modo inexistente',
      'exercise_items_mode_format_fkey',
      item({ assessment_mode: "'guessing'" }),
    ],
    [
      'privacidad de datos personales (P4)',
      'exercise_items_response_privacy_fkey',
      item({ response_privacy: "'personal'" }),
    ],
    ['entrada inválida', 'exercise_items_input_modality_fkey', item({ input_modality: "'video'" })],
    ['tipo inexistente', 'exercise_items_type_check', item({ type: "'essay'" })],
    ['origen inválido', 'exercise_items_origin_check', item({ origin: "'ai'" })],
    ['nivel inexistente', 'exercise_items_level_fkey', item({ level: "'A0'" })],
    ['estado inválido', 'exercise_items_status_check', item({ status: "'published'" })],
    [
      'actividad inexistente',
      'exercise_items_cefr_activity_fkey',
      item({ cefr_activity: "'singing'" }),
    ],
    ['idioma inexistente', 'exercise_items_language_code_fkey', item({ language_code: "'qq'" })],
    ['id repetido', 'exercise_items_pkey', item({ id: `'${rec.id}'` })],
    ['concepto de otro idioma', 'item_concepts_concept_fkey', item() + ic(it.id, 'vocabulary')],
    [
      'fila con el idioma del concepto y no del ítem',
      'item_concepts_item_fkey',
      item() + ic(it.id, 'vocabulary', 'target', 'it'),
    ],
    ['ítem inexistente', 'item_concepts_item_fkey', ic(w.id, 'vocabulary', 'target', 'en', 'nada')],
    ['concepto inexistente', 'item_concepts_concept_fkey', item() + ic('en-nada', 'vocabulary')],
    ['dimensión inexistente', 'item_concepts_dimension_fkey', item() + ic(w.id, 'pronunciation')],
    ['rol inválido', 'item_concepts_role_check', item() + ic(w.id, 'vocabulary', 'focus')],
    ['fila repetida', 'item_concepts_pkey', ok + ic(w.id, 'vocabulary')],
    [
      'production en un ítem de reconocimiento',
      'item_concepts_rule.*sobra',
      ic(w.id, 'vocabulary', 'target', 'en', rec.id) +
        ic(w.id, 'production', 'target', 'en', rec.id),
    ],
    [
      'producción sin la fila de vocabulario',
      'item_concepts_rule.*falta',
      item() + ic(w.id, 'production'),
    ],
    [
      'producción sin la fila de production',
      'item_concepts_rule.*falta',
      item() + ic(w.id, 'vocabulary'),
    ],
    ['léxico en grammar', 'item_concepts_rule.*sobra', ok + ic(w.id, 'grammar')],
    [
      'comprehension en un modo de producción',
      'item_concepts_rule.*sobra',
      ok + ic(w.id, 'comprehension'),
    ],
    [
      'concepto context (§4.3, paso 3: no da filas)',
      'item_concepts_rule.*rol context',
      ok + ic(w.id, 'comprehension', 'context'),
    ],
    [
      'concepto distractor',
      'item_concepts_rule.*rol distractor',
      ok + ic(w.id, 'grammar', 'distractor'),
    ],
    [
      'pragmático en reconocimiento (P3: sin dimensión de conocimiento)',
      'item_concepts_rule.*sobra',
      `insert into public.concepts (id, language_code, kind, level, status) values ('en.prag.t', 'en', 'pragmatic', 'A1', 'draft');` +
        ic('en.prag.t', 'vocabulary', 'target', 'en', rec.id),
    ],
    [
      'borrar la fila de vocabulario de un ítem de producción',
      'item_concepts_rule.*falta',
      `delete from public.item_concepts where item_id = '${prod.id}' and concept_id = '${prodConcept.concept_id}' and dimension = 'vocabulary';`,
    ],
    [
      'cambiar el modo de un ítem',
      'exercise_items_identity',
      `update public.exercise_items set assessment_mode = 'free_recall' where id = '${prod.id}';`,
    ],
    [
      'cambiar el nivel de un ítem',
      'exercise_items_identity',
      `update public.exercise_items set level = 'A2' where id = '${rec.id}';`,
    ],
    [
      'cambiar la privacidad de un ítem',
      'exercise_items_identity',
      `update public.exercise_items set response_privacy = 'fictional' where id = '${prod.id}';`,
    ],
    [
      'borrar un ítem con conceptos',
      'item_concepts_item_fkey',
      `delete from public.exercise_items where id = '${rec.id}';`,
    ],
    [
      'borrar un concepto usado por un ítem',
      'item_concepts_concept_fkey',
      `delete from public.concepts where id = '${prodConcept.concept_id}';`,
    ],
  ];
  for (const [name, constraint, sql] of cases) {
    const err = await rejected(sql);
    assert.ok(err, `debía rechazarse: ${name}`);
    assert.match(err.message, new RegExp(constraint), `${name}: ${err.message}`);
  }
  // Se aceptan: un ítem de producción con sus dos filas, un concepto gramatical (grammar +
  // production), un pragmático en producción (sólo production, P3) y cambiar el estado de un ítem.
  const accepted = [
    ok,
    `insert into public.concepts (id, language_code, kind, level, status) values ('en.gram.t', 'en', 'grammar', 'A1', 'draft');` +
      ok +
      ic('en.gram.t', 'grammar') +
      ic('en.gram.t', 'production'),
    `insert into public.concepts (id, language_code, kind, level, status) values ('en.prag.t', 'en', 'pragmatic', 'A1', 'draft');` +
      ok +
      ic('en.prag.t', 'production'),
    `update public.exercise_items set status = 'retired', retired_at = now() where id = '${rec.id}';`,
  ];
  for (const sql of accepted) assert.equal(await rejected(sql), null, sql);
});

test('las migraciones del catálogo son idempotentes y conservan los conceptos', async () => {
  const before = await counts();
  const items = await dbItems();
  const links = await dbItemConcepts();
  await db.exec(migration('20261107120000_learning_concepts.sql'));
  await db.exec(migration('20261107130000_learning_items.sql'));
  await db.exec(migration('20261107140000_learning_ref_input_modalities.sql'));
  for (const f of BACKFILLS) await db.exec(migration(f));
  // Dos veces, también la de match_pairs: ni ítems ni relaciones duplicadas.
  await db.exec(migration('20261107140100_learning_items_match_pairs.sql'));
  assert.deepEqual(await counts(), before);
  assert.deepEqual(await dbItems(), items);
  assert.deepEqual(await dbItemConcepts(), links);
  // El catálogo de conceptos anterior sigue igual: uno léxico por palabra, nada más.
  const c = await one(`select count(*)::int n, count(*) filter (where kind <> 'lexical')::int other,
    count(*) filter (where id <> word_id)::int bad from public.concepts`);
  assert.deepEqual(c, { n: before.words, other: 0, bad: 0 });
});

test('recargar migraciones de contenido existentes no duplica nada', async () => {
  const before = await counts();
  const items = await dbItems();
  const links = await dbItemConcepts();
  const units = [
    CURRICULUM_PATH.find((p) => p.language === 'en' && p.level === 'A1' && p.unit.position === 1),
    CURRICULUM_PATH.find((p) => p.language === 'zh' && p.unit.position === 12),
    CURRICULUM_PATH.find((p) => p.language === 'en' && p.level === 'A2' && p.unit.position === 12),
  ];
  for (const unit of units) {
    const { sql } = contentSql([unit]);
    await db.exec(sql);
    await db.exec(sql);
  }
  assert.deepEqual(await counts(), before);
  assert.deepEqual(await dbItems(), items);
  assert.deepEqual(await dbItemConcepts(), links);
});

/** Unidad nueva de prueba (inglés A2, posición 90) con palabras y ejercicios propios. */
/**
 * content:sql de una unidad de prueba, con las listas congeladas de content/ (sin excepciones): sus
 * ítems generados de elección son nuevos, así que llevan las opciones fuera de la versión (regla de
 * los generados futuros, content/versions.ts) aunque tengan varios contenidos publicados.
 */
function fixtureSql(unit) {
  return contentSql([unit]);
}

function fixtureUnit({ changeWords = false, changeType = false, dropLast = false } = {}) {
  const words = ['zebra', 'violin', 'tulip', 'saddle', 'quartz', 'pebble'].map((t, i) => ({
    id: `en-zzfix-${t}`,
    text: `zz${t}`,
    translation: `zzes${i}`,
    exampleEn: `I see a zz${t}.`,
    exampleEs: `Veo zzes${i}.`,
    tags: ['nouns'],
  }));
  const id = (i) => words[i].id;
  const choice = (i) => ({
    type: 'translation_choice',
    skill: 'vocabulary',
    prompt: `¿Qué significa «${words[i].text}»?`,
    payload: {
      type: 'translation_choice',
      word: words[i].text,
      options: [
        words[i].translation,
        ...words
          .filter((_, j) => j !== i)
          .slice(0, 3)
          .map((w) => w.translation),
      ],
    },
    answer: words[i].translation,
    words: [id(i)],
  });
  const sentence = {
    type: changeType ? 'short_answer' : 'translate_write',
    skill: 'translation',
    prompt: 'Escribí en inglés',
    payload: changeType
      ? { type: 'short_answer', question: 'What do you see?', translation: '¿Qué ves?' }
      : { type: 'translate_write', source: 'Veo zzes0 y zzes1.' },
    answer: 'I see a zzzebra and a zzviolin.',
    words: changeWords ? [id(0), id(2)] : [id(0), id(1)],
  };
  const pairs = {
    type: 'match_pairs',
    skill: 'vocabulary',
    prompt: 'Uní cada palabra con su significado',
    payload: {
      type: 'match_pairs',
      pairs: words.slice(0, 4).map((w) => ({ left: w.text, right: w.translation })),
    },
    answer: '',
    words: words.slice(0, 4).map((w) => w.id),
  };
  const unit = {
    position: 90,
    title: 'Prueba',
    titleEn: 'Test',
    description: 'Unidad de prueba',
    emoji: '🧪',
    words,
    lessons: [
      { title: 'L1', objective: 'Probar', exercises: [choice(0), choice(1), sentence, pairs] },
      { title: 'L2', objective: 'Probar', exercises: [choice(2), choice(3), choice(4), choice(5)] },
      {
        title: 'L3',
        objective: 'Probar',
        exercises: dropLast ? [choice(4)] : [choice(4), choice(5)],
      },
    ],
  };
  const known = COURSES[0].levels.flatMap((l) => l.units.flatMap((u) => u.words)).concat(words);
  return { language: 'en', level: 'A2', unit, lessons: unitPath(unit, known, 'a2-u90', 'en') };
}

test('contenido nuevo: conceptos, ítems y relaciones de las palabras y ejercicios nuevos', async () => {
  const before = await counts();
  const unit = fixtureUnit();
  const { sql, document } = fixtureSql(unit);
  const cat = document.catalog;
  assert.ok(
    cat.items.some((i) => i.origin === 'generated'),
    'la unidad genera ítems',
  );
  await inRollback(async () => {
    await db.exec(sql);
    await db.exec('set constraints all immediate');
    const words = unit.unit.words.map((w) => w.id);
    const concepts = await all(
      `select id, kind, word_id, level, status, language_code from public.concepts where id = any($1) order by id`,
      [words],
    );
    assert.deepEqual(
      concepts,
      [...words].sort().map((id) => ({
        id,
        kind: 'lexical',
        word_id: id,
        level: 'A2',
        status: 'active',
        language_code: 'en',
      })),
    );
    const ids = cat.items.map((i) => i.id);
    assert.deepEqual(
      sortBy(
        await all(
          `select id, language_code, level, origin, type, assessment_mode, response_format,
                          input_modality, response_privacy from public.exercise_items where id = any($1)`,
          [ids],
        ),
        'id',
      ),
      sortBy(cat.items, 'id'),
    );
    assert.deepEqual(
      sortBy(
        await all(
          `select item_id, concept_id, dimension, role, language_code from public.item_concepts
                   where item_id = any($1)`,
          [ids],
        ),
        'item_id',
        'concept_id',
        'dimension',
      ),
      sortBy(cat.item_concepts, 'item_id', 'concept_id', 'dimension'),
    );
    // La frase escrita es producción controlada: vocabulary + production por palabra.
    assert.deepEqual(
      (
        await all(
          `select concept_id, dimension from public.item_concepts where item_id = 'a2-u90-l01-e03' order by 1, 2`,
        )
      ).map((r) => `${r.concept_id}/${r.dimension}`),
      [
        'en-zzfix-violin/production',
        'en-zzfix-violin/vocabulary',
        'en-zzfix-zebra/production',
        'en-zzfix-zebra/vocabulary',
      ],
    );
    const after = await counts();
    assert.equal(after.concepts, before.concepts + 6);
    assert.equal(after.items, before.items + cat.items.length);
    assert.equal(after.item_concepts, before.item_concepts + cat.item_concepts.length);
    // Versiones (content:sql las carga): una por ítem, vigente y en cada ubicación; conjuntos en las de
    // elección, también en las de distractores variables.
    const { versions, optionSets } = document;
    assert.ok(versions.versions.length > 0 && versions.variable_options.length > 0);
    assert.equal(versions.versions.length, cat.items.length);
    const versionState = () =>
      one(
        `select (select count(*)::int from public.exercise_item_versions where item_id = any($1)) versions,
          (select count(*)::int from public.exercise_items where id = any($1) and current_version_id is not null) current,
          (select count(*)::int from public.exercises where id = any($2) and item_version_id is not null) placed,
          (select count(*)::int from public.exercise_item_versions where item_id = any($3)) variable,
          (select count(*)::int from public.exercises where id = any($2) and option_set_id is not null) with_set,
          (select count(*)::int from public.exercise_option_set_assignments where exercise_id = any($2)) assigned`,
        [
          ids,
          versions.placement_versions.map((p) => p.exercise_id),
          versions.variable_options.map((h) => h.item_id),
        ],
      );
    const loaded = {
      versions: versions.versions.length,
      current: versions.current_versions.length,
      placed: versions.placement_versions.length,
      variable: versions.variable_options.length,
      with_set: optionSets.placement_option_sets.length,
      assigned: optionSets.placement_option_sets.length,
    };
    assert.ok(optionSets.placement_option_sets.length > 0);
    assert.deepEqual(await versionState(), loaded);
    // Generados de elección nuevos: todos con las opciones fuera de la versión y un conjunto en cada
    // ubicación; los escritos de elección las conservan en la versión (comportamiento actual).
    const choice = await all(
      `select i.origin, i.type, v.payload ? 'options' has_options,
         bool_and(e.option_set_id is not null) all_sets
       from public.exercise_items i
       join public.exercise_item_versions v on v.id = i.current_version_id
       join public.exercises e on e.item_id = i.id
       where i.id = any($1) and i.type in ('image_choice','translation_choice','fill_blank','listen_choice')
       group by 1, 2, 3 order by 1, 2, 3`,
      [ids],
    );
    assert.ok(choice.some((c) => c.origin === 'generated'));
    for (const c of choice) {
      assert.equal(c.has_options, c.origin === 'authored', `${c.origin} ${c.type}`);
      assert.equal(c.all_sets, true, `${c.origin} ${c.type}`);
    }
    // Recargar la misma unidad no duplica nada.
    await db.exec(sql);
    await db.exec('set constraints all immediate');
    assert.deepEqual(await counts(), after);
    assert.deepEqual(await versionState(), loaded);
  });
  assert.deepEqual(await counts(), before);
});

test('con V8 y V8.1: recargar contenido existente y cargar una unidad nueva confirman; nada queda sin versión', async () => {
  // Contenido ya cargado (ítems, versiones y conjuntos existentes): se recarga igual con las
  // restricciones; las ubicaciones nuevas nacen completas (EXERCISE_CATALOG_*).
  const existing = CURRICULUM_PATH.find((p) => p.language === 'zh' && p.unit.position === 3);
  const { sql: reload, document } = contentSql([existing]);
  const ids = document.exercises.map((e) => e.id);
  // Una unidad nueva: cada ítem se inserta sin versión, recibe la primera y su puntero en la misma
  // transacción, y el trigger diferido de current_version_id lo comprueba al confirmar (V8.1).
  const { sql: fresh, document: freshDoc } = fixtureSql(fixtureUnit());
  const freshIds = freshDoc.exercises.map((e) => e.id);
  const freshItems = freshDoc.catalog.items.map((i) => i.id);
  await inRollback(async () => {
    // En la misma transacción y sin `set constraints … immediate` en el medio: ese modo dura hasta el
    // final de la transacción y haría comprobar cada ítem nuevo antes de que llegue su versión.
    await db.exec(reload);
    await db.exec(fresh);
    await db.exec('set constraints all immediate');
    for (const [list, n] of [
      [ids, document.optionSets.placement_option_sets.length],
      [freshIds, freshDoc.optionSets.placement_option_sets.length],
    ]) {
      const r = await one(
        `select count(*)::int n, count(item_id)::int item, count(item_version_id)::int version,
           count(*) filter (where type in ('image_choice','translation_choice','fill_blank','listen_choice'))::int choice,
           count(option_set_id)::int with_set
         from public.exercises where id = any($1)`,
        [list],
      );
      assert.deepEqual(r, {
        n: list.length,
        item: list.length,
        version: list.length,
        choice: r.with_set,
        with_set: n,
      });
    }
    const current = await one(
      `select count(*)::int n from public.exercise_items i
       join public.exercise_item_versions v on v.id = i.current_version_id and v.item_id = i.id
       where i.id = any($1)`,
      [freshItems],
    );
    assert.equal(current.n, freshItems.length);
  });
  // `set constraints all immediate` dispara los mismos chequeos diferidos que el COMMIT; el COMMIT
  // real (ítem, versión y puntero) se prueba en versions.test.mjs.
});

test('recargar sin un ejercicio no retira su ítem (sigue active)', async () => {
  const { sql } = fixtureSql(fixtureUnit());
  const { sql: smaller, document } = fixtureSql(fixtureUnit({ dropLast: true }));
  // El último ejercicio de L3 ya no está en el contenido.
  assert.ok(!document.catalog.placements.some((p) => p.exercise_id === 'a2-u90-l03-e02'));
  await inRollback(async () => {
    await db.exec(sql);
    await db.exec(smaller);
    await db.exec('set constraints all immediate');
    const r = await one(`select i.status, i.retired_at, e.is_published
      from public.exercise_items i join public.exercises e on e.id = i.id
      where i.id = 'a2-u90-l03-e02'`);
    // La ubicación se despublica (como siempre); el ítem no se retira solo.
    assert.deepEqual(r, { status: 'active', retired_at: null, is_published: false });
  });
});

test('recargar un ejercicio escrito con otras palabras u otro tipo aborta (sería un ítem nuevo)', async () => {
  const { sql } = fixtureSql(fixtureUnit());
  for (const [change, expected] of [
    [{ changeWords: true }, /catalog_item_concepts.*a2-u90-l01-e03/],
    [{ changeType: true }, /catalog_items.*a2-u90-l01-e03/],
  ]) {
    const err = await inRollback(async () => {
      await db.exec(sql);
      try {
        await db.exec(fixtureSql(fixtureUnit(change)).sql);
        return null;
      } catch (e) {
        return e;
      }
    });
    assert.ok(err, JSON.stringify(change));
    assert.match(err.message, expected);
  }
});

test('anon y authenticated no pueden leer ni escribir las tablas nuevas', async () => {
  const tables = [
    'ref_cefr_activities',
    'ref_assessment_modes',
    'ref_mode_formats',
    'ref_assists',
    'ref_response_privacy',
    'ref_input_modalities',
    'exercise_items',
    'item_concepts',
  ];
  for (const table of tables) {
    for (const [role, user] of [
      ['anon', null],
      ['authenticated', alice],
    ]) {
      await assert.rejects(
        as(db, role, user, () => db.query(`select 1 from public.${table} limit 1`)),
        /permission denied/,
        `${role} lee ${table}`,
      );
      await assert.rejects(
        as(db, role, user, () => db.query(`delete from public.${table}`)),
        /permission denied/,
        `${role} borra ${table}`,
      );
    }
  }
  const rls = await all(
    `select relname, relrowsecurity from pg_class
     where relnamespace = 'public'::regnamespace and relname = any($1)`,
    [tables],
  );
  assert.equal(rls.length, tables.length);
  for (const r of rls) assert.ok(r.relrowsecurity, r.relname);
  for (const fn of [
    'item_concepts_rule_violation(text)',
    'item_concepts_check_rule()',
    'exercise_items_identity_guard()',
  ]) {
    for (const role of ['anon', 'authenticated']) {
      const r = await one(`select has_function_privilege($1, $2, 'execute') ok`, [
        role,
        `public.${fn}`,
      ]);
      assert.equal(r.ok, false, `${role} ejecuta ${fn}`);
    }
  }
});

test('el SRS v1, los ejercicios y sus vínculos no cambian', async () => {
  // Los vínculos ejercicio→palabra son los de content/ (el catálogo no los escribe).
  // Más los de U13 y U14 (fase C.3), que se cargan con sus vínculos aunque estén sin publicar.
  const expectedLinks = [
    ...CURRICULUM_PATH,
    ...PLANNED_PATH,
    ...SUPPLEMENT_PATH,
    ...A2_EXPANSION_PATH,
    ...B1_PATH,
    ...B2_PATH,
    ...PT_PATH,
    ...IT_PATH,
    ...ZH_PATH,
    ...FR_PATH,
    ...ES_PATH,
  ]
    .flatMap((p) => p.lessons.flatMap((l) => l.exercises))
    .reduce((n, e) => n + new Set(e.words).size, 0);
  const real = await one(`select count(*)::int n from public.exercise_words ew
    join public.exercises e on e.id = ew.exercise_id join public.lessons l on l.id = e.lesson_id
    where l.unit_id not like 'test-%'`);
  assert.equal(real.n, expectedLinks);
  const defs = await all(`
    select p.proname, pg_get_functiondef(p.oid) def from pg_proc p
    where p.pronamespace = 'public'::regnamespace
      and p.proname in ('submit_learning_session', 'apply_word_result', 'srs_config')`);
  assert.equal(defs.length, 3);
  for (const d of defs) assert.ok(!/exercise_items|item_concepts|concepts/.test(d.def), d.proname);
  // De las tablas existentes, sólo exercises referencia a los ítems (su ubicación, §5:
  // 20261107150000_learning_item_versions.sql); las nuevas no se crean con prefijo srs_.
  const fks = await all(`select conrelid::regclass::text t, conname from pg_constraint
    where contype = 'f' and confrelid in ('public.exercise_items'::regclass, 'public.item_concepts'::regclass)
    order by 1, 2`);
  assert.deepEqual(
    fks.map((r) => `${r.t}.${r.conname}`),
    [
      'exercise_item_versions.exercise_item_versions_item_id_fkey',
      'exercises.exercises_item_fkey',
      'item_concepts.item_concepts_item_fkey',
      'item_objectives.item_objectives_item_fkey',
    ],
  );
  // Las únicas tablas srs_ son las del SRS v2 (fase 3, 20261109120000_srs_v2.sql, §11; fase 4: srs_unit_updates).
  const srs = await all(
    `select relname from pg_class where relnamespace = 'public'::regnamespace and relname like 'srs\\_%'
       and relkind in ('r', 'p') order by 1`,
  );
  assert.deepEqual(
    srs.map((r) => r.relname),
    [
      'srs_algorithm_versions',
      'srs_applied_sessions',
      'srs_hint_queue',
      'srs_migration_cutoff',
      'srs_migration_queue',
      'srs_session_plans',
      'srs_unit_updates',
      'srs_user_debt_days',
      'srs_user_debt_state',
      'srs_user_head',
      'srs_v2_settings',
      'srs_weights',
    ],
  );
  // La lectura de ejercicios para authenticated sigue como antes.
  const rows = await as(db, 'authenticated', alice, () =>
    db.query('select count(*)::int n from public.exercises where is_published'),
  );
  assert.ok(rows.rows[0].n >= 5410);
});
