// Cargas del inglés localizado (docs/EN_MULTI_SOURCE.md): en-from-pt, en-from-it y en-from-fr sobre
// 20270108120000_courses_per_language.sql. Cada curso queda completo, sin publicar y en su curso (por
// el prefijo del id), el inglés desde español no cambia y nada se ve para un usuario de siempre.
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';

const pending = (name) => readFileSync(new URL(`../pending/${name}`, import.meta.url), 'utf8');

/** A1–B1 (20270111120*) y B2 (20270112130*): cada curso, primero lo uno y después lo otro. */
const COURSES = [
  {
    code: 'en-from-pt',
    prefix: 'ept',
    publish: '20270111120000_publish_en_from_pt.sql',
    publishB2: '20270112130000_publish_en_from_pt_b2.sql',
  },
  {
    code: 'en-from-it',
    prefix: 'eit',
    publish: '20270111120100_publish_en_from_it.sql',
    publishB2: '20270112130100_publish_en_from_it_b2.sql',
  },
  {
    code: 'en-from-fr',
    prefix: 'efr',
    publish: '20270111120200_publish_en_from_fr.sql',
    publishB2: '20270112130200_publish_en_from_fr_b2.sql',
  },
];

/** Por nivel: unidades y si alguna / todas están publicadas (unidades, lecciones y palabras). */
async function levelsOf(db, prefix) {
  const { rows } = await db.query(
    `select u.level, count(*)::int as n, bool_or(u.is_published) as any_pub,
            bool_and(u.is_published) as all_pub,
            bool_and(not exists (select 1 from public.lessons l
                                 where l.unit_id = u.id and not l.is_published)) as lessons_pub
     from public.curriculum_units u where u.id like $1 group by u.level order by u.level`,
    [`${prefix}-%`],
  );
  return Object.fromEntries(rows.map((r) => [r.level, r]));
}

describe('cargas del inglés localizado', () => {
  let db;
  before(async () => {
    db = await createDb();
  });

  for (const { code, prefix } of COURSES) {
    test(`${code}: 55 unidades A1–B2, sin publicar, en su curso`, async () => {
      const { rows } = await db.query(
        `select u.level, count(*)::int as n, bool_or(u.is_published) as pub,
                bool_and(u.course_code = $1) as own, bool_and(u.language_code = 'en') as en
         from public.curriculum_units u where u.id like $2 group by u.level order by u.level`,
        [code, `${prefix}-%`],
      );
      assert.deepEqual(
        rows.map((r) => [r.level, r.n]),
        [
          ['A1', 14],
          ['A2', 17],
          ['B1', 12],
          ['B2', 12],
        ],
      );
      for (const r of rows) {
        assert.equal(r.pub, false);
        assert.equal(r.own, true);
        assert.equal(r.en, true);
      }
    });

    test(`${code}: lecciones, palabras y ejercicios sin publicar`, async () => {
      const q = async (sql) => (await db.query(sql, [`${prefix}-%`])).rows[0];
      const lessons = await q(
        `select count(*)::int n, bool_or(is_published) pub from public.lessons where id like $1`,
      );
      const words = await q(
        `select count(*)::int n, bool_or(is_published) pub, count(distinct course_code)::int c
         from public.words where id like $1`,
      );
      const exercises = await q(
        `select count(*)::int n, bool_or(is_published) pub from public.exercises where id like $1`,
      );
      assert.equal(lessons.n, 570);
      assert.equal(lessons.pub, false);
      assert.equal(words.n, 1061);
      assert.equal(words.pub, false);
      assert.equal(words.c, 1);
      assert.ok(exercises.n > 5300, `${exercises.n} ejercicios`);
      assert.equal(exercises.pub, false);
    });
  }

  test('el inglés desde español no cambia: ninguna unidad ajena en su curso', async () => {
    const { rows } = await db.query(
      `select count(*)::int n from public.curriculum_units
       where course_code = 'en-from-es' and id ~ '^(ept|eit|efr)-'`,
    );
    assert.equal(rows[0].n, 0);
  });

  test('un usuario de siempre (inglés desde español) no ve nada de los cursos nuevos', async () => {
    const user = await createUser(db, 'es-learner@example.com');
    await db.query(
      `update public.profiles set target_language = 'en', onboarding_completed_at = now() where id = $1`,
      [user],
    );
    const seen = await as(db, 'authenticated', user, () =>
      db.query(
        `select (select count(*) from public.curriculum_units where id ~ '^(ept|eit|efr)-')::int u,
                (select count(*) from public.words where id ~ '^(ept|eit|efr)-')::int w`,
      ),
    );
    assert.deepEqual(seen.rows[0], { u: 0, w: 0 });
  });
});

describe('publicación del inglés localizado: A1–B1 y después B2', () => {
  let db;
  before(async () => {
    db = await createDb();
  });

  for (const { code, prefix, publish, publishB2 } of COURSES) {
    test(`${code}: B2 sigue sin publicar tras A1–B1 y queda publicado con su archivo`, async () => {
      await db.exec(pending(publish));
      const mid = await levelsOf(db, prefix);
      for (const level of ['A1', 'A2', 'B1']) {
        assert.equal(mid[level].all_pub, true, `${code} ${level}`);
        assert.equal(mid[level].lessons_pub, true, `${code} ${level} lecciones`);
      }
      assert.equal(mid.B2.n, 12);
      assert.equal(mid.B2.any_pub, false, `${code} B2 antes de su publicación`);
      const status = async () =>
        (await db.query('select status from public.courses where code = $1', [code])).rows[0]
          .status;
      assert.equal(await status(), 'available');

      await db.exec(pending(publishB2));
      // El B2 de los cursos que todavía no se publicaron sigue cerrado.
      for (const other of COURSES.slice(COURSES.findIndex((c) => c.code === code) + 1)) {
        assert.equal((await levelsOf(db, other.prefix)).B2.any_pub, false, other.code);
      }
      const after = await levelsOf(db, prefix);
      for (const level of ['A1', 'A2', 'B1', 'B2']) {
        assert.equal(after[level].all_pub, true, `${code} ${level}`);
        assert.equal(after[level].lessons_pub, true, `${code} ${level} lecciones`);
      }
      assert.equal(await status(), 'available');
      // Idempotente: aplicarlo otra vez no falla ni cambia nada.
      await db.exec(pending(publishB2));
      assert.deepEqual(await levelsOf(db, prefix), after);
    });
  }

  test('el inglés desde español sigue sin unidades ajenas', async () => {
    const units = await db.query(
      `select count(*)::int n from public.curriculum_units
       where course_code = 'en-from-es' and id ~ '^(ept|eit|efr)-'`,
    );
    assert.equal(units.rows[0].n, 0);
  });
});
