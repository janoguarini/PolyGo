// Modelo de cursos (20261223120000_course_model.sql, docs/MULTILINGUAL_ONBOARDING_PLAN.md §4.2):
// catálogo, migración de los datos existentes, sincronía con target_language, RPC nuevos, RLS,
// compatibilidad con los RPC de siempre y rollback.
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

import { COURSES, courseStatus } from '../../shared/courses.ts';
import { createDb, createUser, as } from './harness.mjs';

const MIGRATION = '20261223120000_course_model.sql';
const migrationSql = readFileSync(new URL(`../migrations/${MIGRATION}`, import.meta.url), 'utf8');
const rollbackSql = readFileSync(
  new URL('../rollback/20261223120000_course_model.down.sql', import.meta.url),
  'utf8',
);
const coursesPerLanguageRollback = readFileSync(
  new URL('../rollback/20270108120000_courses_per_language.down.sql', import.meta.url),
  'utf8',
);
const pending = (name) => readFileSync(new URL(`../pending/${name}`, import.meta.url), 'utf8');
const allMigrations = readdirSync(new URL('../migrations/', import.meta.url))
  .filter((f) => f.endsWith('.sql'))
  .sort();
const beforeCourseModel = allMigrations.filter((f) => f < MIGRATION);

let n = 0;
async function onboard(db, { language = 'en', level = 'A1' } = {}) {
  n += 1;
  const u = await createUser(db, `course${n}@test.dev`);
  await as(db, 'authenticated', u, () =>
    db.query(`select public.complete_onboarding($1, 'bolt', $2, $3, 10::smallint)`, [
      `course_user_${n}`,
      language,
      level,
    ]),
  );
  return u;
}

const rpc = (db, u, sql, params = []) => as(db, 'authenticated', u, () => db.query(sql, params));
const profileOf = async (db, u) =>
  (
    await db.query(
      `select target_language, active_course_code, start_level, interface_language
       from public.profiles where id = $1`,
      [u],
    )
  ).rows[0];
const coursesOf = async (db, u) =>
  (
    await db.query(
      `select course_code, start_level, placement_level
       from public.user_courses where user_id = $1 order by course_code`,
      [u],
    )
  ).rows;
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
     values ($1, $2, 1, 1, 1, now(), now())`,
    [u, lesson],
  );
const rejects = async (promise, code) => {
  await assert.rejects(promise, (err) => {
    assert.match(String(err.message), new RegExp(code));
    return true;
  });
};

/**
 * Publicación de en-from-pt/it/fr (A1–B1 aplicada en producción el 2026-11-27): en migrations/ se
 * crean ocultos (20270108120000_courses_per_language) y estos archivos los abren (status =
 * 'available'); los tres últimos publican su B2.
 */
const PUBLISH_EN_FROM = [
  '20270111120000_publish_en_from_pt.sql',
  '20270111120100_publish_en_from_it.sql',
  '20270111120200_publish_en_from_fr.sql',
  // B2 de esos tres cursos (cargado en migrations/ 20270112120*_en_from_*_b2).
  '20270112130000_publish_en_from_pt_b2.sql',
  '20270112130100_publish_en_from_it_b2.sql',
  '20270112130200_publish_en_from_fr_b2.sql',
];

describe('catálogo', () => {
  let db;
  before(async () => {
    db = await createDb();
    // Como producción: con los cursos de inglés para hablantes de pt/it/fr publicados.
    for (const file of PUBLISH_EN_FROM) await db.exec(pending(file));
  });

  test('public.courses es exactamente shared/courses.ts (como en producción)', async () => {
    const { rows } = await db.query(
      `select code, target_language as target, source_language as source,
              is_default as "isDefault", position, status from public.courses order by position`,
    );
    assert.deepEqual(
      rows,
      // Las columnas del espejo; status: el de la base (null = el del idioma) frente al del curso.
      COURSES.map(({ code, target, source, isDefault, position, status }) => ({
        code,
        target,
        source,
        isDefault,
        position,
        status: status ?? null,
      })),
    );
    // Ninguno oculto: el espejo es el catálogo entero.
    for (const c of COURSES) assert.notEqual(courseStatus(c), 'hidden', c.code);
  });

  test('un solo curso por defecto por idioma de destino, y cada idioma tiene el suyo', async () => {
    await rejects(
      db.query(
        `insert into public.courses (code, target_language, source_language, is_default, position)
         values ('en-from-zh', 'en', 'zh', true, 19)`,
      ),
      'courses_one_default_per_target',
    );
    const { rows } = await db.query(
      `select l.code from public.languages l
       where not exists (select 1 from public.courses c where c.target_language = l.code and c.is_default)`,
    );
    assert.deepEqual(rows, []);
  });

  test('el código del curso es destino-from-origen', async () => {
    await rejects(
      db.query(
        `insert into public.courses (code, target_language, source_language, position)
         values ('en-from-it', 'en', 'fr', 9)`,
      ),
      'check',
    );
  });
});

describe('migración de los datos existentes', () => {
  let db;
  let a2User; // inglés A2, con progreso también en italiano
  let a1User; // italiano A1, sin progreso
  let fresh; // registrado sin onboarding
  let progressBefore;

  before(async () => {
    db = await createDb({ files: beforeCourseModel });
    a2User = await onboard(db, { language: 'en', level: 'A2' });
    await complete(db, a2User, await firstLesson(db, 'en', 'A2'));
    await complete(db, a2User, await firstLesson(db, 'it'));
    a1User = await onboard(db, { language: 'it', level: 'A1' });
    fresh = await createUser(db, 'fresh@test.dev');
    progressBefore = (
      await db.query(
        'select user_id, lesson_id, times_completed from public.user_lesson_progress order by 1, 2',
      )
    ).rows;
    await db.exec(migrationSql);
  });

  test('el curso activo es el del idioma que estudiaba', async () => {
    assert.equal((await profileOf(db, a2User)).active_course_code, 'en-from-es');
    assert.equal((await profileOf(db, a1User)).active_course_code, 'it-from-es');
    assert.equal((await profileOf(db, fresh)).active_course_code, 'en-from-es');
  });

  test('inscripciones: el curso activo con su nivel y los idiomas con progreso desde A1', async () => {
    assert.deepEqual(await coursesOf(db, a2User), [
      { course_code: 'en-from-es', start_level: 'A2', placement_level: null },
      { course_code: 'it-from-es', start_level: 'A1', placement_level: null },
    ]);
    assert.deepEqual(await coursesOf(db, a1User), [
      { course_code: 'it-from-es', start_level: 'A1', placement_level: null },
    ]);
    assert.deepEqual(await coursesOf(db, fresh), []);
  });

  test('interfaz en español sólo para quien ya usaba la app; el resto la decide el dispositivo', async () => {
    assert.equal((await profileOf(db, a2User)).interface_language, 'es');
    assert.equal((await profileOf(db, fresh)).interface_language, null);
  });

  test('no cambia target_language, start_level ni el progreso', async () => {
    const p = await profileOf(db, a2User);
    assert.deepEqual([p.target_language, p.start_level], ['en', 'A2']);
    const after = (
      await db.query(
        'select user_id, lesson_id, times_completed from public.user_lesson_progress order by 1, 2',
      )
    ).rows;
    assert.deepEqual(after, progressBefore);
  });

  test('es idempotente', async () => {
    await db.exec(migrationSql);
    assert.equal((await coursesOf(db, a2User)).length, 2);
    assert.equal((await db.query('select count(*)::int as n from public.courses')).rows[0].n, 6);
  });
});

describe('compatibilidad con los RPC de siempre', () => {
  let db;
  before(async () => {
    db = await createDb();
  });

  test('complete_onboarding v1 inscribe en el curso con el nivel elegido', async () => {
    const u = await onboard(db, { language: 'en', level: 'A2' });
    assert.deepEqual(await coursesOf(db, u), [
      { course_code: 'en-from-es', start_level: 'A2', placement_level: null },
    ]);
    assert.equal((await profileOf(db, u)).active_course_code, 'en-from-es');
  });

  test('set_target_language cambia de curso; cada curso conserva su nivel', async () => {
    const u = await onboard(db, { language: 'en', level: 'A2' });
    await rpc(db, u, `select public.set_target_language('it')`);
    let p = await profileOf(db, u);
    assert.deepEqual(
      [p.target_language, p.active_course_code, p.start_level],
      ['it', 'it-from-es', 'A1'],
    );
    await rpc(db, u, `select public.set_target_language('en')`);
    p = await profileOf(db, u);
    assert.deepEqual([p.active_course_code, p.start_level], ['en-from-es', 'A2']);
    assert.deepEqual(
      (await coursesOf(db, u)).map((c) => [c.course_code, c.start_level]),
      [
        ['en-from-es', 'A2'],
        ['it-from-es', 'A1'],
      ],
    );
  });

  test('un cambio directo de target_language también mueve el curso activo', async () => {
    const u = await onboard(db);
    await db.query(`update public.profiles set target_language = 'pt' where id = $1`, [u]);
    assert.equal((await profileOf(db, u)).active_course_code, 'pt-from-es');
  });

  test('el alta de usuario sigue igual y arranca con el curso por defecto, sin inscripciones', async () => {
    const u = await createUser(db, 'signup@test.dev');
    const p = await profileOf(db, u);
    assert.deepEqual(
      [p.target_language, p.active_course_code, p.interface_language],
      ['en', 'en-from-es', null],
    );
    assert.deepEqual(await coursesOf(db, u), []);
  });
});

describe('RPC nuevos', () => {
  let db;
  before(async () => {
    db = await createDb();
  });

  test('set_active_course: cambia de curso y crea el ELO si el idioma tiene Ranked', async () => {
    const u = await onboard(db);
    const { rows } = await rpc(
      db,
      u,
      `select target_language, active_course_code from public.set_active_course('zh-from-es')`,
    );
    assert.deepEqual(rows[0], { target_language: 'zh', active_course_code: 'zh-from-es' });
    const rating = await db.query(
      `select count(*)::int as n from public.player_ratings where user_id = $1 and language_code = 'zh'`,
      [u],
    );
    assert.equal(rating.rows[0].n, 1);
  });

  test('set_active_course rechaza cursos inexistentes o no disponibles', async () => {
    const u = await onboard(db);
    await rejects(
      rpc(db, u, `select public.set_active_course('xx-from-es')`),
      'course_unavailable',
    );
    await rejects(
      rpc(db, u, `select public.set_active_course('es-from-en')`),
      'course_unavailable',
    );
  });

  test('set_active_course exige el onboarding completo', async () => {
    const u = await createUser(db, 'not-onboarded@test.dev');
    await rejects(rpc(db, u, `select public.set_active_course('it-from-es')`), 'profile_not_found');
  });

  test('set_course_start_level: valida lo publicado y no toca progreso ni XP', async () => {
    const u = await onboard(db);
    await complete(db, u, await firstLesson(db, 'en'));
    const progress = async () =>
      (
        await db.query(
          'select lesson_id, times_completed from public.user_lesson_progress where user_id = $1',
          [u],
        )
      ).rows;
    const before = await progress();
    const { rows } = await rpc(
      db,
      u,
      `select course_code, start_level from public.set_course_start_level('en-from-es', 'A2')`,
    );
    assert.deepEqual(rows[0], { course_code: 'en-from-es', start_level: 'A2' });
    assert.equal((await profileOf(db, u)).start_level, 'A2');
    assert.deepEqual(await progress(), before);
    await rejects(
      rpc(db, u, `select public.set_course_start_level('en-from-es', 'B1')`),
      'level_unavailable',
    );
    await rejects(
      rpc(db, u, `select public.set_course_start_level('it-from-es', 'A1')`),
      'course_not_enrolled',
    );
  });

  test('cambiar el nivel de un curso que no es el activo no toca start_level', async () => {
    const u = await onboard(db, { language: 'en', level: 'A1' });
    await rpc(db, u, `select public.set_active_course('it-from-es')`);
    await rpc(db, u, `select public.set_active_course('en-from-es')`);
    await rpc(db, u, `select public.set_course_start_level('it-from-es', 'A1')`);
    assert.equal((await profileOf(db, u)).start_level, 'A1');
  });

  test('set_interface_language', async () => {
    const u = await onboard(db);
    await rpc(db, u, `select public.set_interface_language('en')`);
    assert.equal((await profileOf(db, u)).interface_language, 'en');
    await rejects(
      rpc(db, u, `select public.set_interface_language('de')`),
      'interface_language_invalid',
    );
  });

  test('complete_onboarding_v2 con el curso de inglés: interfaz, nivel y prueba de nivel', async () => {
    const u = await createUser(db, 'v2-en@test.dev');
    await rpc(
      db,
      u,
      `select public.complete_onboarding_v2('v2_en', 'bolt', 'en-from-es', 'A2', 10::smallint, 'es', 'A2')`,
    );
    const p = await profileOf(db, u);
    assert.deepEqual(
      [p.target_language, p.active_course_code, p.start_level, p.interface_language],
      ['en', 'en-from-es', 'A2', 'es'],
    );
    const [enrollment] = (
      await db.query(
        `select start_level, placement_level, placement_completed_at is not null as placed
         from public.user_courses where user_id = $1`,
        [u],
      )
    ).rows;
    assert.deepEqual(enrollment, { start_level: 'A2', placement_level: 'A2', placed: true });
  });

  test('complete_onboarding_v2 valida curso, nivel, interfaz y nombre', async () => {
    const u = await createUser(db, 'v2-bad@test.dev');
    const call = (course, level, ui, placement = null) =>
      rpc(
        db,
        u,
        `select public.complete_onboarding_v2('v2_bad', 'bolt', $1, $2, 10::smallint, $3, $4)`,
        [course, level, ui, placement],
      );
    await rejects(call('es-from-en', 'A1', 'en'), 'course_unavailable');
    await rejects(call('it-from-es', 'A2', 'es'), 'level_unavailable');
    await rejects(call('en-from-es', 'A1', 'de'), 'interface_language_invalid');
    await rejects(call('en-from-es', 'A1', 'es', 'Z9'), 'placement_level_invalid');
    await onboard(db);
    await rejects(
      rpc(
        db,
        u,
        `select public.complete_onboarding_v2($1, 'bolt', 'en-from-es', 'A1', 10::smallint, 'es')`,
        [`course_user_${n}`],
      ),
      'username_taken',
    );
  });
});

describe('Spanish for English speakers (es-from-en) con el español publicado y activo', () => {
  let db;
  before(async () => {
    db = await createDb();
    await db.exec(pending('20261205120000_publish_es_a1_a2.sql'));
    // La activación del español todavía no existe como migración: se simula acá.
    await db.query(`update public.languages set content_status = 'available' where code = 'es'`);
  });

  test('un angloparlante completa el onboarding con interfaz en inglés y curso de español', async () => {
    const u = await createUser(db, 'english-speaker@test.dev');
    await rpc(
      db,
      u,
      `select public.complete_onboarding_v2('learner_en', 'bolt', 'es-from-en', 'A1', 10::smallint, 'en')`,
    );
    const p = await profileOf(db, u);
    assert.deepEqual(
      [p.target_language, p.active_course_code, p.interface_language],
      ['es', 'es-from-en', 'en'],
    );
    // El español no tiene Ranked: no se crea ELO de español.
    const rating = await db.query(
      `select count(*)::int as n from public.player_ratings where user_id = $1 and language_code = 'es'`,
      [u],
    );
    assert.equal(rating.rows[0].n, 0);
  });

  test('puede sumar otro curso y volver, cada uno con su nivel', async () => {
    const u = await createUser(db, 'english-speaker-2@test.dev');
    await rpc(
      db,
      u,
      `select public.complete_onboarding_v2('learner_en2', 'bolt', 'es-from-en', 'A2', 10::smallint, 'en')`,
    );
    await rpc(db, u, `select public.set_active_course('it-from-es')`);
    await rpc(db, u, `select public.set_active_course('es-from-en')`);
    assert.equal((await profileOf(db, u)).start_level, 'A2');
    assert.deepEqual(
      (await coursesOf(db, u)).map((c) => [c.course_code, c.start_level]),
      [
        ['es-from-en', 'A2'],
        ['it-from-es', 'A1'],
      ],
    );
  });
});

describe('RLS y permisos', () => {
  let db;
  let u;
  let other;
  before(async () => {
    db = await createDb();
    u = await onboard(db);
    other = await onboard(db);
  });

  test('cada usuario sólo lee sus cursos', async () => {
    const { rows } = await rpc(db, u, 'select user_id from public.user_courses');
    assert.ok(rows.length > 0);
    assert.ok(rows.every((r) => r.user_id === u));
  });

  test('no se escribe user_courses directamente', async () => {
    await rejects(
      rpc(
        db,
        u,
        `insert into public.user_courses (user_id, course_code, start_level) values ($1, 'it-from-es', 'A2')`,
        [u],
      ),
      'permission denied',
    );
    await rejects(
      rpc(db, u, `update public.user_courses set start_level = 'A2' where user_id = $1`, [u]),
      'permission denied',
    );
  });

  test('no se cambian curso ni interfaz con un update directo del perfil', async () => {
    await rejects(
      rpc(db, u, `update public.profiles set active_course_code = 'it-from-es' where id = $1`, [u]),
      'permission denied',
    );
    await rejects(
      rpc(db, u, `update public.profiles set interface_language = 'en' where id = $1`, [u]),
      'permission denied',
    );
  });

  test('el catálogo se lee sin sesión y no se escribe', async () => {
    const { rows } = await as(db, 'anon', null, () => db.query('select code from public.courses'));
    // 6 cursos por defecto + en-from-pt/it/fr (20270108120000_courses_per_language; en esta base,
    // sin las publicaciones de supabase/pending/, siguen ocultos pero se listan igual).
    assert.equal(rows.length, 9);
    await rejects(
      rpc(db, u, `update public.courses set is_default = false where code = 'en-from-es'`),
      'permission denied',
    );
  });

  test('sin sesión no se llaman los RPC nuevos', async () => {
    await rejects(
      as(db, 'anon', null, () => db.query(`select public.set_interface_language('en')`)),
      'permission denied',
    );
  });

  test('el otro usuario no cambia', async () => {
    assert.equal((await profileOf(db, other)).active_course_code, 'en-from-es');
  });
});

describe('rollback', () => {
  test('vuelve al modelo anterior sin tocar el progreso, y se puede volver a aplicar', async () => {
    // Hasta 20270108120000_courses_per_language: con contenido de otros cursos (en-from-pt…) su
    // rollback se niega a propósito.
    const db = await createDb({ files: allMigrations.filter((f) => f <= '20270108120000_courses_per_language.sql') });
    const u = await onboard(db, { language: 'en', level: 'A2' });
    await complete(db, u, await firstLesson(db, 'en', 'A2'));
    await rpc(db, u, `select public.set_active_course('it-from-es')`);
    const progress = async () =>
      (await db.query('select lesson_id from public.user_lesson_progress where user_id = $1', [u]))
        .rows;
    const before = await progress();

    // Orden inverso: primero el rollback de 20270108120000_courses_per_language.
    await db.exec(coursesPerLanguageRollback);
    await db.exec(rollbackSql);
    await db.exec(rollbackSql); // idempotente
    const leftovers = await db.query(
      `select table_name from information_schema.tables
       where table_schema = 'public' and table_name in ('courses', 'user_courses')
       union all
       select column_name from information_schema.columns
       where table_schema = 'public' and table_name = 'profiles'
         and column_name in ('active_course_code', 'interface_language')`,
    );
    assert.deepEqual(leftovers.rows, []);
    assert.deepEqual(await progress(), before);
    const p = (await db.query('select target_language from public.profiles where id = $1', [u]))
      .rows[0];
    assert.equal(p.target_language, 'it');
    // Los RPC de siempre siguen funcionando.
    await rpc(db, u, `select public.set_target_language('en')`);
    await onboard(db);

    await db.exec(migrationSql);
    assert.equal((await profileOf(db, u)).active_course_code, 'en-from-es');
  });
});
