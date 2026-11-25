// Banco de Word Rush (Fase 5): supabase/pending/20261227120000_word_rush_bank.sql (estructura) y
// 20261227120100_word_rush_bank_data.sql (datos generados de content/word-rush/), probados SÓLO en
// PGlite (en memoria) sobre una base como la de producción: todas las migraciones + las publicaciones
// de supabase/pending/. No se conecta a ninguna base real.
//
// Cubre: carga completa (FK y triggers), idempotencia, que no cambie ningún ejercicio de las lecciones,
// permisos (sólo service_role lee; nadie de la app ve las tablas), restricciones, la lectura de
// loadSentences reproducida en SQL + mergeSentenceSources igual al contenido local, y el rollback.
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { createDb, as } from './harness.mjs';
import { mergeSentenceSources } from '../../server/src/wordRushBank.ts';
import { wordLevel } from '../../shared/wordRush.ts';
import { WORD_RUSH_LANGUAGES, wordRushSentences } from '../../content/word-rush/index.ts';
import { wordRushSentenceRows, wordRushVariantRows } from '../../content/word-rush/sql.ts';

const pending = (name) => readFileSync(new URL(`../pending/${name}`, import.meta.url), 'utf8');
const SCHEMA = pending('20261227120000_word_rush_bank.sql');
const DATA = pending('20261227120100_word_rush_bank_data.sql');
const ROLLBACK = readFileSync(
  new URL('../rollback/20261227120000_word_rush_bank.down.sql', import.meta.url),
  'utf8',
);
const PUBLISHED = [
  '20261121120000_publish_en_a2_u13_u17.sql',
  '20261123120000_publish_en_b1.sql',
  '20261125120000_publish_en_b2.sql',
  '20261127120000_publish_pt_a1_a2.sql',
  '20261129120000_publish_it_a1_a2.sql',
  '20261201120000_publish_zh_a1_a2.sql',
  '20261203120000_publish_fr_a1_a2.sql',
  '20261203130000_enable_fr.sql',
  '20261205120000_publish_es_a1_a2.sql',
  '20261226120000_ranked_all_courses.sql',
];

async function productionLike() {
  const db = await createDb();
  for (const file of PUBLISHED) await db.exec(pending(file));
  return db;
}

const exercisesFingerprint = async (db) =>
  (
    await db.query(
      `select count(*)::int as n, md5(string_agg(id || answer || accepted_answers::text || payload::text, '|' order by id)) as h
       from public.exercises`,
    )
  ).rows[0];

/** Lo mismo que loadSentences (server/src/supabaseStore.ts) lee de las lecciones, en SQL. */
async function lessonSentences(db, language) {
  const { rows } = await db.query(
    `select e.id, e.payload, e.answer, e.accepted_answers, l.unit_id
       from public.exercises e
       join public.lessons l on l.id = e.lesson_id and l.is_published
       join public.curriculum_units u on u.id = l.unit_id and u.is_published
      where u.language_code = $1 and e.type = 'order_words' and e.is_published`,
    [language],
  );
  const units = (
    await db.query(
      `select id from public.curriculum_units where language_code = $1 and is_published`,
      [language],
    )
  ).rows.map((r) => r.id);
  const sentences = rows
    .filter(
      (e) =>
        Array.isArray(e.payload?.tokens) &&
        e.payload.tokens.every((t) => typeof t === 'string') &&
        typeof e.payload?.translation === 'string',
    )
    .map((e) => ({
      id: e.id,
      tokens: e.payload.tokens,
      answer: e.answer,
      acceptedAnswers: e.accepted_answers ?? [],
      translation: e.payload.translation,
      unitId: e.unit_id,
    }));
  return { sentences, units: new Set(units) };
}

describe('banco de Word Rush en PGlite', () => {
  let db;
  let before0;

  before(async () => {
    db = await productionLike();
    before0 = await exercisesFingerprint(db);
    await db.exec(SCHEMA);
    await db.exec(DATA);
  });

  test('carga todas las frases y variantes (las FK y triggers aceptan cada fila)', async () => {
    const s = await db.query(`select count(*)::int as n from public.word_rush_sentences`);
    const v = await db.query(`select count(*)::int as n from public.word_rush_exercise_variants`);
    assert.equal(s.rows[0].n, wordRushSentenceRows().length);
    assert.equal(v.rows[0].n, wordRushVariantRows().length);
    const byLang = await db.query(
      `select language_code, level, count(*)::int as n from public.word_rush_sentences
        group by 1, 2 order by 1, 2`,
    );
    assert.ok(byLang.rows.some((r) => r.language_code === 'en' && r.level === 'A1' && r.n > 100));
    assert.ok(byLang.rows.some((r) => r.language_code === 'es' && r.level === 'A1' && r.n > 100));
  });

  test('es idempotente: reaplicar estructura y datos no cambia nada', async () => {
    const snap = async () =>
      (
        await db.query(
          `select (select md5(string_agg(id || answer || tokens::text || accepted_answers::text || translation, '|' order by id)) from public.word_rush_sentences) as s,
                  (select md5(string_agg(exercise_id || accepted_answers::text, '|' order by exercise_id)) from public.word_rush_exercise_variants) as v`,
        )
      ).rows[0];
    const first = await snap();
    await db.exec(SCHEMA);
    await db.exec(DATA);
    assert.deepEqual(await snap(), first);
  });

  test('no cambia ningún ejercicio de las lecciones (ni sus respuestas aceptadas)', async () => {
    assert.deepEqual(await exercisesFingerprint(db), before0);
  });

  test('sólo el servidor (service_role) lee; la app no ve ni escribe las tablas', async () => {
    for (const role of ['anon', 'authenticated']) {
      for (const table of ['word_rush_sentences', 'word_rush_exercise_variants']) {
        await assert.rejects(
          as(db, role, null, () => db.query(`select * from public.${table} limit 1`)),
          /permission denied/,
          `${role} ${table}`,
        );
      }
    }
    const read = await as(db, 'service_role', null, () =>
      db.query(`select count(*)::int as n from public.word_rush_sentences where is_published`),
    );
    assert.ok(read.rows[0].n > 0);
    await assert.rejects(
      as(db, 'service_role', null, () =>
        db.query(`delete from public.word_rush_exercise_variants`),
      ),
      /permission denied/,
    );
    for (const fn of ['word_rush_sentences_check_unit', 'word_rush_exercise_variants_check']) {
      const { rows } = await db.query(
        `select has_function_privilege('authenticated', 'public.${fn}()', 'execute') as ok`,
      );
      assert.equal(rows[0].ok, false, fn);
    }
  });

  test('restricciones: unidad, idioma, nivel, id, duplicados, fichas y tipo de ejercicio', async () => {
    const insert = (id, lang, level, unit, answer, tokens = ['We', 'are', 'here']) =>
      db.query(
        `insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, translation)
         values ($1, $2, $3, $4, $5, $6, 'x')`,
        [id, lang, level, unit, tokens, answer],
      );
    await assert.rejects(insert('en.wr.x1', 'en', 'A2', 'a1-u01', 'We are here.'), /idioma\/nivel/);
    await assert.rejects(insert('en.wr.x2', 'it', 'A1', 'a1-u01', 'We are here.'), /idioma\/nivel/);
    await assert.rejects(insert('it.wr.x3', 'en', 'A1', 'a1-u01', 'We are here.'), /no empieza/);
    await assert.rejects(
      insert('EN.wr.x4', 'en', 'A1', 'a1-u01', 'We are here.'),
      /check|no empieza/,
    );
    await assert.rejects(
      insert('en.wr.x5', 'en', 'A1', 'zz-a1-u99', 'We are here.'),
      /foreign key|inexistente/,
    );
    await assert.rejects(
      insert('en.wr.x6', 'en', 'A1', 'a1-u01', 'We are here.', ['We', '', 'here']),
      /check/,
    );
    const existing = (
      await db.query(
        `select answer from public.word_rush_sentences where language_code = 'en' limit 1`,
      )
    ).rows[0].answer;
    await assert.rejects(insert('en.wr.x7', 'en', 'A1', 'a1-u01', existing), /unique|duplicate/);
    const notOrder = (
      await db.query(`select id from public.exercises where type <> 'order_words' limit 1`)
    ).rows[0].id;
    await assert.rejects(
      db.query(
        `insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason) values ($1, '{x y}', 'r')`,
        [notOrder],
      ),
      /no es un ejercicio order_words/,
    );
    await assert.rejects(
      db.query(
        `insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason) values ('no-existe', '{x}', 'r')`,
      ),
      /order_words|foreign key/,
    );
  });

  test('lo que leería loadSentences = el contenido local de Word Rush, en los seis cursos', async () => {
    const rows = await as(db, 'service_role', null, async () => ({
      sentences: (
        await db.query(
          `select id, language_code, unit_id, tokens, answer, accepted_answers, translation
             from public.word_rush_sentences where is_published`,
        )
      ).rows,
      variants: (
        await db.query(
          `select exercise_id, accepted_answers from public.word_rush_exercise_variants`,
        )
      ).rows,
    }));
    for (const language of WORD_RUSH_LANGUAGES) {
      const lessons = await lessonSentences(db, language);
      const { sentences, report } = mergeSentenceSources(
        language,
        lessons.sentences,
        {
          sentences: rows.sentences.filter((r) => r.language_code === language),
          variants: rows.variants,
        },
        lessons.units,
      );
      assert.equal(report.bankSkipped, 0, `${language}: filas del banco descartadas`);
      assert.equal(report.variantsSkipped, 0, `${language}: variantes descartadas`);
      assert.equal(report.duplicatesSkipped, 0, `${language}: duplicados`);
      // Word Rush sólo usa A1 y A2 (rushLevels); B1/B2 publicadas en la base quedan fuera igual.
      const ranked = (list) => list.filter((s) => ['A1', 'A2'].includes(wordLevel(s.unitId)));
      const expected = ranked(wordRushSentences(language));
      const norm = (list) =>
        list
          .map((s) => ({ ...s, acceptedAnswers: [...s.acceptedAnswers].sort() }))
          .sort((a, b) => a.id.localeCompare(b.id));
      // Las lecciones de la base y las locales (PUBLISHED_PATHS) tienen que ser las mismas frases.
      const localIds = new Set(expected.map((s) => s.id));
      const dbIds = new Set(ranked(sentences).map((s) => s.id));
      const onlyDb = [...dbIds].filter((id) => !localIds.has(id));
      const onlyLocal = [...localIds].filter((id) => !dbIds.has(id));
      assert.deepEqual({ onlyDb, onlyLocal }, { onlyDb: [], onlyLocal: [] }, language);
      assert.deepEqual(norm(ranked(sentences)), norm(expected), language);
    }
  });

  test('rollback: borra sólo las tablas del banco', async () => {
    const db2 = await productionLike();
    const fp = await exercisesFingerprint(db2);
    await db2.exec(SCHEMA);
    await db2.exec(DATA);
    await db2.exec(ROLLBACK);
    const { rows } = await db2.query(
      `select to_regclass('public.word_rush_sentences') as s, to_regclass('public.word_rush_exercise_variants') as v`,
    );
    assert.deepEqual(rows[0], { s: null, v: null });
    assert.deepEqual(await exercisesFingerprint(db2), fp);
  });

  test('los datos se niegan a cargarse sin la estructura', async () => {
    const db3 = await productionLike();
    await assert.rejects(db3.exec(DATA), /falta la migración/);
  });
});
