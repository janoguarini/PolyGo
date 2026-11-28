// Cargas del inglés localizado (docs/EN_MULTI_SOURCE.md): en-from-pt, en-from-it y en-from-fr sobre
// 20270108120000_courses_per_language.sql. Cada curso queda completo, sin publicar y en su curso (por
// el prefijo del id), el inglés desde español no cambia y nada se ve para un usuario de siempre.
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';

const COURSES = [
  { code: 'en-from-pt', prefix: 'ept' },
  { code: 'en-from-it', prefix: 'eit' },
  { code: 'en-from-fr', prefix: 'efr' },
];

describe('cargas del inglés localizado', () => {
  let db;
  before(async () => {
    db = await createDb();
  });

  for (const { code, prefix } of COURSES) {
    test(`${code}: 43 unidades A1–B1, sin publicar, en su curso`, async () => {
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
      assert.equal(lessons.n, 450);
      assert.equal(lessons.pub, false);
      assert.equal(words.n, 846);
      assert.equal(words.pub, false);
      assert.equal(words.c, 1);
      assert.ok(exercises.n > 4100, `${exercises.n} ejercicios`);
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
