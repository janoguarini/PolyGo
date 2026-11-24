// Test de nivel: start_course y la puntuación en user_courses (20261224120000_course_placement.sql,
// docs/PLACEMENT_TEST.md). Curso correcto, sin mezclar cursos, sin tocar XP ni progreso, sin pisar un
// curso ya empezado, validación contra lo publicado, errores atómicos, reintentos y rollback.
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';

const migrationSql = readFileSync(
  new URL('../migrations/20261224120000_course_placement.sql', import.meta.url),
  'utf8',
);
const rollbackSql = readFileSync(
  new URL('../rollback/20261224120000_course_placement.down.sql', import.meta.url),
  'utf8',
);
const courseModelRollback = readFileSync(
  new URL('../rollback/20261223120000_course_model.down.sql', import.meta.url),
  'utf8',
);
const pending = (name) => readFileSync(new URL(`../pending/${name}`, import.meta.url), 'utf8');

let n = 0;
async function onboard(db, { language = 'it', level = 'A1' } = {}) {
  n += 1;
  const u = await createUser(db, `placement${n}@test.dev`);
  await as(db, 'authenticated', u, () =>
    db.query(`select public.complete_onboarding($1, 'bolt', $2, $3, 10::smallint)`, [
      `placement_user_${n}`,
      language,
      level,
    ]),
  );
  return u;
}

const rpc = (db, u, sql, params = []) => as(db, 'authenticated', u, () => db.query(sql, params));
const start = async (db, u, course, level, placement = null) =>
  (
    await rpc(
      db,
      u,
      `select public.start_course($1, $2, $3, $4::smallint, $5::smallint, $6) as r`,
      [
        course,
        level,
        placement?.level ?? null,
        placement?.correct ?? null,
        placement?.total ?? null,
        placement?.version ?? null,
      ],
    )
  ).rows[0].r;
const A2_RESULT = { level: 'A2', correct: 7, total: 9, version: 'placement-v1' };

const profileOf = async (db, u) =>
  (
    await db.query(
      `select target_language, active_course_code, start_level from public.profiles where id = $1`,
      [u],
    )
  ).rows[0];
const coursesOf = async (db, u) =>
  (
    await db.query(
      `select course_code, start_level, placement_level, placement_correct, placement_total,
              placement_version, placement_completed_at is not null as placed
       from public.user_courses where user_id = $1 order by course_code`,
      [u],
    )
  ).rows;
const snapshot = async (db, u) => ({
  progress: (
    await db.query(
      `select lesson_id, times_completed, best_accuracy from public.user_lesson_progress
       where user_id = $1 order by lesson_id`,
      [u],
    )
  ).rows,
  xp: (await db.query(`select total_xp, level from public.player_xp where user_id = $1`, [u])).rows,
  xpEvents: (
    await db.query(`select count(*)::int as n from public.xp_events where user_id = $1`, [u])
  ).rows[0].n,
  ratings: (
    await db.query(
      `select language_code, rating from public.player_ratings where user_id = $1 order by 1`,
      [u],
    )
  ).rows,
});
const firstLesson = async (db, language, level = 'A1') =>
  (
    await db.query(
      `select l.id from public.lessons l join public.curriculum_units u on u.id = l.unit_id
       where u.language_code = $1 and u.level = $2 and l.is_published
       order by u.position, l.position limit 1`,
      [language, level],
    )
  ).rows[0].id;
const complete = (db, u, lesson) =>
  db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy,
       last_accuracy, first_completed_at, last_completed_at)
     values ($1, $2, 3, 0.9, 0.9, now(), now())`,
    [u, lesson],
  );
const rejects = async (promise, code) => {
  await assert.rejects(promise, (err) => {
    assert.match(String(err.message), new RegExp(code));
    return true;
  });
};

describe('start_course: guardar el resultado en el curso correcto', () => {
  let db;
  before(async () => {
    db = await createDb();
  });

  test('curso nuevo con el test: nivel, puntuación, versión y fecha en ESE curso; queda activo', async () => {
    const u = await onboard(db, { language: 'it' });
    const r = await start(db, u, 'en-from-es', 'A2', A2_RESULT);
    assert.equal(r.created, true);
    assert.equal(r.course_code, 'en-from-es');
    assert.equal(r.start_level, 'A2');
    assert.equal(r.placement_level, 'A2');
    assert.ok(r.placement_completed_at);
    assert.deepEqual(await coursesOf(db, u), [
      {
        course_code: 'en-from-es',
        start_level: 'A2',
        placement_level: 'A2',
        placement_correct: 7,
        placement_total: 9,
        placement_version: 'placement-v1',
        placed: true,
      },
      {
        course_code: 'it-from-es',
        start_level: 'A1',
        placement_level: null,
        placement_correct: null,
        placement_total: null,
        placement_version: null,
        placed: false,
      },
    ]);
    // El perfil sigue al curso activo (las builds de tienda leen target_language y start_level).
    assert.deepEqual(await profileOf(db, u), {
      target_language: 'en',
      active_course_code: 'en-from-es',
      start_level: 'A2',
    });
  });

  test('«Prefiero empezar desde A1»: sin test, A1, sin heredar el nivel de otro curso', async () => {
    const u = await onboard(db, { language: 'en', level: 'A2' });
    const r = await start(db, u, 'it-from-es', 'A1');
    assert.equal(r.created, true);
    assert.equal(r.start_level, 'A1');
    assert.equal(r.placement_level, null);
    assert.deepEqual(await profileOf(db, u), {
      target_language: 'it',
      active_course_code: 'it-from-es',
      start_level: 'A1',
    });
    // El inglés conserva su A2.
    const en = (await coursesOf(db, u)).find((c) => c.course_code === 'en-from-es');
    assert.equal(en.start_level, 'A2');
  });

  test('empezar desde A1 aunque el test diera A2 guarda las dos cosas', async () => {
    const u = await onboard(db, { language: 'it' });
    const r = await start(db, u, 'en-from-es', 'A1', A2_RESULT);
    assert.equal(r.start_level, 'A1');
    assert.equal(r.placement_level, 'A2');
    assert.equal((await profileOf(db, u)).start_level, 'A1');
  });

  test('no toca XP global, progreso ni el ELO de otros cursos; crea el ELO del curso nuevo', async () => {
    const u = await onboard(db, { language: 'it' });
    await complete(db, u, await firstLesson(db, 'it'));
    await db.query(
      `insert into public.player_xp (user_id, total_xp, level, initialized) values ($1, 1234, 7, true)`,
      [u],
    );
    const before = await snapshot(db, u);
    await start(db, u, 'en-from-es', 'A2', A2_RESULT);
    const after = await snapshot(db, u);
    assert.deepEqual(after.progress, before.progress);
    assert.deepEqual(after.xp, [{ total_xp: 1234, level: 7 }]);
    assert.equal(after.xpEvents, before.xpEvents);
    // Los ELO que ya tenía no cambian; el del curso nuevo existe (si el idioma tiene Ranked).
    for (const r of before.ratings)
      assert.ok(
        after.ratings.some((a) => a.language_code === r.language_code && a.rating === r.rating),
      );
    assert.ok(after.ratings.some((r) => r.language_code === 'en'));
  });

  test('no mezcla usuarios: el resultado de uno no aparece en otro', async () => {
    const a = await onboard(db, { language: 'it' });
    const b = await onboard(db, { language: 'it' });
    await start(db, a, 'en-from-es', 'A2', A2_RESULT);
    assert.deepEqual(
      (await coursesOf(db, b)).map((c) => c.course_code),
      ['it-from-es'],
    );
  });
});

describe('start_course: un curso ya empezado no se pisa', () => {
  let db;
  before(async () => {
    db = await createDb();
  });

  test('repetir el test en un curso inscripto no cambia nivel, resultado ni progreso', async () => {
    const u = await onboard(db, { language: 'it' });
    await start(db, u, 'en-from-es', 'A1', {
      level: 'A1',
      correct: 1,
      total: 4,
      version: 'placement-v1',
    });
    await complete(db, u, await firstLesson(db, 'en'));
    const before = { courses: await coursesOf(db, u), snap: await snapshot(db, u) };
    await rpc(db, u, `select public.set_active_course('it-from-es')`);

    const r = await start(db, u, 'en-from-es', 'A2', A2_RESULT);
    assert.equal(r.created, false);
    assert.equal(r.start_level, 'A1');
    assert.equal(r.placement_level, 'A1');
    assert.equal(r.placement_correct, 1);
    assert.deepEqual(await coursesOf(db, u), before.courses);
    assert.deepEqual((await snapshot(db, u)).progress, before.snap.progress);
    // Pero sí lo vuelve a activar, con su propio nivel.
    assert.deepEqual(await profileOf(db, u), {
      target_language: 'en',
      active_course_code: 'en-from-es',
      start_level: 'A1',
    });
  });

  test('el curso activo (inscripto en el onboarding) tampoco cambia', async () => {
    const u = await onboard(db, { language: 'en', level: 'A2' });
    const r = await start(db, u, 'en-from-es', 'A1');
    assert.equal(r.created, false);
    assert.equal(r.start_level, 'A2');
    assert.equal((await profileOf(db, u)).start_level, 'A2');
  });

  test('reintento con la misma llamada (respuesta perdida): mismo resultado, sin duplicar', async () => {
    const u = await onboard(db, { language: 'it' });
    const first = await start(db, u, 'en-from-es', 'A2', A2_RESULT);
    const again = await start(db, u, 'en-from-es', 'A2', A2_RESULT);
    assert.equal(first.created, true);
    assert.equal(again.created, false);
    assert.equal(again.start_level, 'A2');
    assert.equal(again.placement_level, 'A2');
    const rows = await coursesOf(db, u);
    assert.equal(rows.filter((c) => c.course_code === 'en-from-es').length, 1);
  });
});

describe('start_course: validación', () => {
  let db;
  let u;
  before(async () => {
    db = await createDb();
    u = await onboard(db, { language: 'it' });
  });

  test('nunca un nivel sin contenido publicado', async () => {
    // El italiano sólo tiene A1 publicado; el inglés, A1 y A2.
    await rejects(start(db, u, 'en-from-es', 'B1'), 'level_unavailable');
    await rejects(
      start(db, u, 'en-from-es', 'A2', { ...A2_RESULT, level: 'B1' }),
      'placement_level_unavailable',
    );
    await rejects(
      start(db, u, 'pt-from-es', 'A1', { ...A2_RESULT, level: 'A2' }),
      'placement_level_unavailable',
    );
    await rejects(start(db, u, 'en-from-es', 'Z9'), 'level_unavailable');
    await rejects(start(db, u, 'en-from-es', null), 'level_unavailable');
  });

  test('no se empieza por encima de lo que dio el test', async () => {
    await rejects(
      start(db, u, 'en-from-es', 'A2', { ...A2_RESULT, level: 'A1' }),
      'placement_invalid',
    );
  });

  test('el resultado va completo y con números coherentes', async () => {
    const call = (level, correct, total, version) =>
      rpc(
        db,
        u,
        `select public.start_course('en-from-es', 'A1', $1, $2::smallint, $3::smallint, $4)`,
        [level, correct, total, version],
      );
    await rejects(call('A1', null, null, null), 'placement_invalid');
    await rejects(call('A1', 3, null, 'placement-v1'), 'placement_invalid');
    await rejects(call(null, 3, 4, 'placement-v1'), 'placement_invalid');
    await rejects(call('A1', 5, 4, 'placement-v1'), 'placement_invalid');
    await rejects(call('A1', 0, 0, 'placement-v1'), 'placement_invalid');
    await rejects(call('A1', -1, 4, 'placement-v1'), 'placement_invalid');
    await rejects(call('A1', 1, 4, 'Placement V1!'), 'placement_invalid');
  });

  test('cursos inexistentes, ocultos o «Próximamente» no se empiezan', async () => {
    await rejects(start(db, u, 'xx-from-es', 'A1'), 'course_unavailable');
    await rejects(start(db, u, 'fr-from-es', 'A1'), 'course_unavailable'); // oculto en esta base
    await rejects(start(db, u, 'es-from-en', 'A1'), 'course_unavailable'); // «Próximamente»
  });

  test('un error no deja nada a medias (ni inscripción ni cambio de curso)', async () => {
    const before = { courses: await coursesOf(db, u), profile: await profileOf(db, u) };
    await rejects(
      start(db, u, 'en-from-es', 'A2', { ...A2_RESULT, level: 'A1' }),
      'placement_invalid',
    );
    await rejects(start(db, u, 'en-from-es', 'B1'), 'level_unavailable');
    assert.deepEqual(await coursesOf(db, u), before.courses);
    assert.deepEqual(await profileOf(db, u), before.profile);
    // Y después de un error, el reintento correcto funciona.
    assert.equal((await start(db, u, 'en-from-es', 'A2', A2_RESULT)).created, true);
  });

  test('exige sesión y onboarding completo', async () => {
    await rejects(
      as(db, 'anon', null, () => db.query(`select public.start_course('en-from-es', 'A1')`)),
      'permission denied',
    );
    await rejects(
      as(db, 'authenticated', null, () =>
        db.query(`select public.start_course('en-from-es', 'A1')`),
      ),
      'not_authenticated',
    );
    const fresh = await createUser(db, 'placement-fresh@test.dev');
    await rejects(start(db, fresh, 'en-from-es', 'A1'), 'profile_not_found');
    assert.deepEqual(await coursesOf(db, fresh), []);
  });

  test('la tabla rechaza puntuaciones incoherentes aunque se escriba sin el RPC', async () => {
    await rejects(
      db.query(
        `update public.user_courses set placement_correct = 3 where user_id = $1 and course_code = 'it-from-es'`,
        [u],
      ),
      'user_courses_placement_score_check',
    );
    await rejects(
      db.query(
        `update public.user_courses set placement_total = 4, placement_correct = 3
         where user_id = $1 and course_code = 'it-from-es'`,
        [u],
      ),
      'user_courses_placement_score_check',
    );
  });

  test('el usuario no escribe user_courses directamente', async () => {
    await rejects(
      rpc(db, u, `update public.user_courses set start_level = 'A2' where user_id = $1`, [u]),
      'permission denied',
    );
  });
});

describe('compatibilidad con la Fase 2', () => {
  let db;
  before(async () => {
    db = await createDb();
  });

  test('complete_onboarding_v2 con nivel de test (sin puntuación) sigue funcionando', async () => {
    const u = await createUser(db, 'placement-v2@test.dev');
    await rpc(
      db,
      u,
      `select public.complete_onboarding_v2('placement_v2', 'bolt', 'en-from-es', 'A2',
         10::smallint, 'en', 'A2')`,
    );
    const [row] = await coursesOf(db, u);
    assert.equal(row.placement_level, 'A2');
    assert.equal(row.placement_total, null);
  });

  test('set_course_start_level y set_active_course siguen igual', async () => {
    const u = await onboard(db, { language: 'en', level: 'A1' });
    await rpc(db, u, `select public.set_course_start_level('en-from-es', 'A2')`);
    await rpc(db, u, `select public.set_active_course('it-from-es')`);
    assert.deepEqual(
      (await coursesOf(db, u)).map((c) => [c.course_code, c.start_level]),
      [
        ['en-from-es', 'A2'],
        ['it-from-es', 'A1'],
      ],
    );
  });
});

describe('con el francés publicado y disponible (como en producción)', () => {
  let db;
  before(async () => {
    db = await createDb();
    await db.exec(pending('20261203120000_publish_fr_a1_a2.sql'));
    await db.exec(pending('20261203130000_enable_fr.sql'));
  });

  test('francés: el test puede ubicar en A2', async () => {
    const u = await onboard(db, { language: 'en', level: 'A2' });
    const r = await start(db, u, 'fr-from-es', 'A2', { ...A2_RESULT, correct: 9, total: 10 });
    assert.equal(r.created, true);
    assert.equal(r.start_level, 'A2');
    assert.deepEqual(await profileOf(db, u), {
      target_language: 'fr',
      active_course_code: 'fr-from-es',
      start_level: 'A2',
    });
    await rejects(start(db, u, 'fr-from-es', 'B1', { ...A2_RESULT, level: 'B1' }), 'unavailable');
  });
});

describe('rollback', () => {
  test('quita start_course y la puntuación sin tocar niveles, progreso ni curso activo; se reaplica', async () => {
    const db = await createDb();
    const u = await onboard(db, { language: 'it' });
    await start(db, u, 'en-from-es', 'A2', A2_RESULT);
    await complete(db, u, await firstLesson(db, 'en', 'A2'));
    const progress = (await snapshot(db, u)).progress;

    await db.exec(rollbackSql);
    await db.exec(rollbackSql); // idempotente
    const { rows: fn } = await db.query(`select 1 from pg_proc where proname = 'start_course'`);
    assert.deepEqual(fn, []);
    const { rows: cols } = await db.query(
      `select column_name from information_schema.columns
       where table_name = 'user_courses' and column_name like 'placement%' order by 1`,
    );
    assert.deepEqual(
      cols.map((c) => c.column_name),
      ['placement_completed_at', 'placement_level'],
    );
    const { rows } = await db.query(
      `select course_code, start_level, placement_level from public.user_courses
       where user_id = $1 order by 1`,
      [u],
    );
    assert.deepEqual(rows, [
      { course_code: 'en-from-es', start_level: 'A2', placement_level: 'A2' },
      { course_code: 'it-from-es', start_level: 'A1', placement_level: null },
    ]);
    assert.deepEqual((await snapshot(db, u)).progress, progress);
    assert.equal((await profileOf(db, u)).active_course_code, 'en-from-es');

    // Se vuelve a aplicar, y después el rollback de la Fase 2 sigue funcionando (orden inverso).
    await db.exec(migrationSql);
    await db.exec(migrationSql); // idempotente
    assert.equal((await start(db, u, 'pt-from-es', 'A1')).created, true);
    await db.exec(rollbackSql);
    await db.exec(courseModelRollback);
    // Y el rollback de esta migración no falla sin la tabla.
    await db.exec(rollbackSql);
    assert.deepEqual((await snapshot(db, u)).progress, progress);
  });
});
