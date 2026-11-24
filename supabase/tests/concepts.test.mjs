// Catálogo de conceptos (migración 20261107120000_learning_concepts.sql), probado en PGlite.
// Arquitectura de datos rev. 8, §4.1 y §4.5. Este archivo crea sus propias palabras de prueba sólo
// dentro de transacciones que revierte.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';

let db;
let alice;

before(async () => {
  db = await createDb();
  alice = await createUser(db, 'alice@test.dev');
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const all = async (sql, params = []) => (await db.query(sql, params)).rows;

/** Ejecuta sql dentro de una transacción que siempre se revierte y devuelve el error, si hubo. */
async function rejected(sql) {
  await db.exec('begin');
  try {
    await db.exec(sql);
    return null;
  } catch (err) {
    return err;
  } finally {
    await db.exec('rollback');
  }
}

test('tablas de referencia con los valores de §4.1', async () => {
  assert.deepEqual(
    (await all('select id, position from public.ref_levels order by position')).map((r) => r.id),
    ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  );
  assert.deepEqual(await all('select id, axis from public.ref_polygo_dimensions order by id'), [
    { id: 'comprehension', axis: 'skill' },
    { id: 'grammar', axis: 'knowledge' },
    { id: 'production', axis: 'skill' },
    { id: 'vocabulary', axis: 'knowledge' },
  ]);
  assert.deepEqual(
    await all('select id, knowledge_dimension from public.ref_concept_kinds order by id'),
    [
      { id: 'grammar', knowledge_dimension: 'grammar' },
      { id: 'lexical', knowledge_dimension: 'vocabulary' },
      { id: 'orthography', knowledge_dimension: 'vocabulary' },
      { id: 'phonology', knowledge_dimension: 'vocabulary' },
      { id: 'pragmatic', knowledge_dimension: null },
    ],
  );
});

test('cada palabra tiene exactamente un concepto léxico, con su id, idioma y nivel', async () => {
  const r = await one(`
    select
      (select count(*)::int from public.words) words,
      (select count(*)::int from public.concepts) concepts,
      (select count(*)::int from public.concepts where kind = 'lexical') lexical,
      (select count(*)::int from public.words w
         where not exists (select 1 from public.concepts c where c.word_id = w.id)) words_without_concept,
      (select count(*)::int from public.concepts c join public.words w on w.id = c.word_id
         where c.id <> w.id or c.language_code <> w.language_code) id_or_language_mismatch,
      (select count(*)::int from public.concepts c join public.words w on w.id = c.word_id
         join public.curriculum_units u on u.id = w.unit_id where c.level <> u.level) level_mismatch,
      (select count(*)::int from public.concepts where group_key is not null) with_group_key,
      (select count(*)::int from public.concepts
         where title_es is not null or description_es is not null or parent_id is not null) with_extra,
      (select count(*)::int from public.concepts c join public.words w on w.id = c.word_id
         where c.status <> case when w.is_published then 'active' else 'draft' end) status_mismatch`);
  assert.ok(r.words > 0);
  assert.equal(r.concepts, r.words);
  assert.equal(r.lexical, r.words);
  assert.equal(r.words_without_concept, 0);
  assert.equal(r.id_or_language_mismatch, 0);
  assert.equal(r.level_mismatch, 0);
  assert.equal(r.with_group_key, 0, 'no se inventan equivalencias entre idiomas');
  assert.equal(r.with_extra, 0, 'en los léxicos, título, descripción y padre quedan nulos');
  assert.equal(r.status_mismatch, 0);
});

test('conceptos por idioma = palabras por idioma', async () => {
  const rows = await all(`
    select w.language_code, count(*)::int words, count(c.id)::int concepts
    from public.words w left join public.concepts c on c.word_id = w.id
    group by 1 order by 1`);
  assert.ok(rows.length >= 4);
  for (const r of rows) assert.equal(r.concepts, r.words, r.language_code);
});

test('restricciones de integridad de concepts', async () => {
  const word = await one(
    `select w.id, w.language_code, u.level from public.words w
     join public.curriculum_units u on u.id = w.unit_id order by w.id limit 1`,
  );
  const other = await one(
    `select code from public.languages where code <> $1 order by code limit 1`,
    [word.language_code],
  );
  // Para aislar cada restricción, los casos que necesitan liberar la palabra borran antes su concepto
  // y, como los ítems lo referencian (item_concepts), sus vínculos con ítems (dentro de la transacción
  // que se revierte).
  const free = `delete from public.item_concepts where concept_id = '${word.id}';
    delete from public.concepts where id = '${word.id}';`;
  const L = word.language_code;
  const cases = [
    ['léxico sin palabra', 'concepts_lexical_word_check',
      `insert into public.concepts (id, language_code, kind, level, status)
       values ('xx-nada', '${L}', 'lexical', 'A1', 'active')`],
    ['no léxico con palabra', 'concepts_lexical_word_check',
      `${free} insert into public.concepts (id, language_code, kind, word_id, level, status)
       values ('${L}.gram.x', '${L}', 'grammar', '${word.id}', 'A1', 'draft')`],
    ['palabra de otro idioma', 'concepts_word_fkey',
      `${free} insert into public.concepts (id, language_code, kind, word_id, level, status)
       values ('${word.id}', '${other.code}', 'lexical', '${word.id}', 'A1', 'active')`],
    // Tres barreras independientes: PK (id = palabra), unique de word_id e id = word_id.
    ['segundo concepto para la misma palabra', 'concepts_pkey',
      `insert into public.concepts (id, language_code, kind, word_id, level, status)
       values ('${word.id}', '${L}', 'lexical', '${word.id}', 'A1', 'active')`],
    ['segundo concepto con otro id', 'concepts_lexical_id_check|concepts_word_id_key',
      `insert into public.concepts (id, language_code, kind, word_id, level, status)
       values ('dup', '${L}', 'lexical', '${word.id}', 'A1', 'active')`],
    ['id léxico distinto del de la palabra', 'concepts_lexical_id_check',
      `${free} insert into public.concepts (id, language_code, kind, word_id, level, status)
       values ('${word.id}-otro', '${L}', 'lexical', '${word.id}', 'A1', 'active')`],
    ['tipo inexistente', 'concepts_kind_fkey',
      `insert into public.concepts (id, language_code, kind, level, status)
       values ('${L}.x.y', '${L}', 'semantic', 'A1', 'draft')`],
    ['nivel inexistente', 'concepts_level_fkey',
      `insert into public.concepts (id, language_code, kind, level, status)
       values ('${L}.gram.y', '${L}', 'grammar', 'A0', 'draft')`],
    ['estado inválido', 'concepts_status_check',
      `insert into public.concepts (id, language_code, kind, level, status)
       values ('${L}.gram.z', '${L}', 'grammar', 'A1', 'published')`],
    ['padre de otro idioma', 'concepts_parent_fkey',
      `insert into public.concepts (id, language_code, kind, parent_id, level, status)
       values ('${other.code}.gram.hijo', '${other.code}', 'grammar', '${word.id}', 'A1', 'draft')`],
    ['idioma inexistente', 'concepts_language_code_fkey',
      `insert into public.concepts (id, language_code, kind, level, status)
       values ('qq.gram.x', 'qq', 'grammar', 'A1', 'draft')`],
  ];
  for (const [name, constraint, sql] of cases) {
    const err = await rejected(sql);
    assert.ok(err, `debía rechazarse: ${name}`);
    assert.match(err.message, new RegExp(constraint), `${name}: ${err.message}`);
  }
  // Un concepto gramatical válido, con padre del mismo idioma, se acepta.
  assert.equal(
    await rejected(`insert into public.concepts (id, language_code, kind, parent_id, level, status)
      values ('${word.language_code}.gram.ok', '${word.language_code}', 'grammar', '${word.id}', 'A1', 'draft')`),
    null,
  );
});

test('una palabra con concepto no se puede borrar ni pasar a otro idioma', async () => {
  const word = await one('select id, language_code from public.concepts order by id limit 1');
  const other = await one(`select code from public.languages where code <> $1 order by code limit 1`, [
    word.language_code,
  ]);
  assert.ok(await rejected(`delete from public.words where id = '${word.id}'`));
  assert.ok(
    await rejected(`update public.words set language_code = '${other.code}' where id = '${word.id}'`),
  );
});

test('la migración es idempotente', async () => {
  const { readFileSync } = await import('node:fs');
  const sql = readFileSync(
    new URL('../migrations/20261107120000_learning_concepts.sql', import.meta.url),
    'utf8',
  );
  const before = await one('select count(*)::int n from public.concepts');
  await db.exec(sql);
  const after = await one('select count(*)::int n from public.concepts');
  assert.equal(after.n, before.n);
});

test('anon y authenticated no pueden leer ni escribir el catálogo nuevo', async () => {
  for (const table of ['concepts', 'ref_levels', 'ref_polygo_dimensions', 'ref_concept_kinds']) {
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
  const rls = await all(`
    select relname, relrowsecurity from pg_class
    where relnamespace = 'public'::regnamespace
      and relname in ('concepts', 'ref_levels', 'ref_polygo_dimensions', 'ref_concept_kinds')`);
  assert.equal(rls.length, 4);
  for (const r of rls) assert.ok(r.relrowsecurity, r.relname);
});

test('el SRS v1 y la lectura de palabras no cambian', async () => {
  // La palabra sigue legible para authenticated como antes (política «words readable when published»).
  const rows = await as(db, 'authenticated', alice, () =>
    db.query('select count(*)::int n from public.words where is_published'),
  );
  assert.ok(rows.rows[0].n > 0);
  // Las funciones v1 no dependen de concepts.
  const defs = await all(`
    select p.proname, pg_get_functiondef(p.oid) def from pg_proc p
    where p.pronamespace = 'public'::regnamespace
      and p.proname in ('submit_learning_session', 'apply_word_result', 'srs_config')`);
  assert.equal(defs.length, 3);
  for (const d of defs) assert.ok(!/concepts/.test(d.def), d.proname);
});
