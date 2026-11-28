// Varios cursos por idioma de destino (20270108120000_courses_per_language.sql, docs/EN_MULTI_SOURCE.md
// §4.1): para los usuarios y cursos de siempre no cambia nada; un curso nuevo del mismo idioma
// (en-from-pt, ids ept-*) queda aislado por la capa de visibilidad, se desbloquea por su cuenta, sus
// palabras no se cruzan en los repasos y las RPC de cursos respetan su estado y sus niveles.
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { exercisesFixtureSql } from './fixtures.mjs';

const MIGRATION = '20270108120000_courses_per_language.sql';
const migrationSql = readFileSync(new URL(`../migrations/${MIGRATION}`, import.meta.url), 'utf8');
const rollbackSql = readFileSync(
  new URL('../rollback/20270108120000_courses_per_language.down.sql', import.meta.url),
  'utf8',
);
const beforeFiles = readdirSync(new URL('../migrations/', import.meta.url))
  .filter((f) => f.endsWith('.sql') && f < MIGRATION)
  .sort();

const NOW = '2026-11-20T15:00:00Z';
const TZ = 'America/Argentina/Buenos_Aires';

// Contenido mínimo de en-from-pt, como lo cargaría el generador de siempre: sin course_code.
const EPT_FIXTURE = `
  insert into public.curriculum_units (id, language_code, level, position, title_es, title_en, description_es, emoji, is_published)
  values ('ept-a1-u01', 'en', 'A1', 1, 'Unidade', 'Unit', 'desc', '👋', true);
  insert into public.lessons (id, unit_id, position, title_es, objective_es, is_published) values
    ('ept-a1-u01-l01', 'ept-a1-u01', 1, 'Lição 1', 'obj', true),
    ('ept-a1-u01-l02', 'ept-a1-u01', 2, 'Lição 2', 'obj', true);
  insert into public.words (id, language_code, unit_id, text, translation_es, is_published) values
    ('ept-hello', 'en', 'ept-a1-u01', 'hello', 'olá', true);
  insert into public.concepts (id, language_code, kind, word_id, level, status)
  values ('ept-hello', 'en', 'lexical', 'ept-hello', 'A1', 'active');
  ${exercisesFixtureSql([
    {
      id: 'ept-a1-u01-l01-e01',
      lesson_id: 'ept-a1-u01-l01',
      position: 1,
      type: 'translate_write',
      skill: 'translation',
      payload: { type: 'translate_write', source: 'olá' },
      answer: 'hello',
      language: 'en',
      level: 'A1',
    },
    {
      id: 'ept-a1-u01-l02-e01',
      lesson_id: 'ept-a1-u01-l02',
      position: 1,
      type: 'translate_write',
      skill: 'translation',
      payload: { type: 'translate_write', source: 'olá' },
      answer: 'hello',
      language: 'en',
      level: 'A1',
    },
  ])}
  insert into public.exercise_words values ('ept-a1-u01-l01-e01', 'ept-hello');
`;

let n = 0;
async function onboard(db, language = 'en', level = 'A1') {
  n += 1;
  const u = await createUser(db, `cpl${n}@test.dev`);
  await as(db, 'authenticated', u, () =>
    db.query(`select public.complete_onboarding($1, 'bolt', $2, $3, 10::smallint)`, [
      `cpl_user_${n}`,
      language,
      level,
    ]),
  );
  return u;
}

const rows = async (db, sql, params = []) => (await db.query(sql, params)).rows;
const ids = async (db, sql, params = []) => (await rows(db, sql, params)).map((r) => r.id);
const asUser = (db, u, sql, params = []) => as(db, 'authenticated', u, () => rows(db, sql, params));
const service = (db, sql, params = []) => as(db, 'service_role', null, () => rows(db, sql, params));
const rejects = async (promise, code) => {
  await assert.rejects(promise, (err) => {
    assert.match(String(err.message), new RegExp(code));
    return true;
  });
};
const complete = (db, u, lesson) =>
  db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy,
       last_accuracy, first_completed_at, last_completed_at)
     values ($1, $2, 1, 1, 1, now(), now())`,
    [u, lesson],
  );
const unlocked = (db, u, lesson) =>
  rows(db, `select public.is_lesson_unlocked($1, $2) ok`, [u, lesson]).then((r) => r[0].ok);

/** Lo que ve y puede hacer un usuario: contenido por RLS, camino, desbloqueos y candidatos de repaso. */
async function snapshot(db, u) {
  const visible = async (table, col = 'id') =>
    (await asUser(db, u, `select ${col} as id from public.${table} order by 1`)).map((r) => r.id);
  return {
    units: await visible('curriculum_units'),
    lessons: await visible('lessons'),
    words: await visible('words'),
    exercises: await visible('exercises'),
    exerciseWords: await visible('exercise_words', `exercise_id || '/' || word_id`),
    route: await asUser(db, u, `select * from public.my_curriculum_route('en')`),
    routeIt: await asUser(db, u, `select * from public.my_curriculum_route('it')`),
    wordOfDay: await asUser(db, u, `select id from public.word_of_the_day('2026-11-20', 'en')`),
    unlockedLessons: await ids(
      db,
      `select l.id from public.lessons l where public.is_lesson_unlocked($1, l.id) order by 1`,
      [u],
    ),
    unlockedUnits: await ids(
      db,
      `select x as id from public.curriculum_unlocked_unit_ids($1, 'en') x order by 1`,
      [u],
    ),
    focus: await service(db, `select public.learning_focus_candidates($1, 'en', $2) r`, [u, NOW]),
    review: await service(db, `select public.learning_review_candidates($1, 'en', $2, $3) r`, [
      u,
      TZ,
      NOW,
    ]),
    mastery: await asUser(db, u, `select public.get_learning_mastery('en', $1) r`, [TZ]),
  };
}

describe('cursos por idioma', () => {
  let db;
  let esUser; // inglés desde español, con progreso
  let itUser; // italiano
  let before1;
  let beforeIt;
  let enWord; // una palabra de en-from-es con concepto léxico activo

  before(async () => {
    db = await createDb({ files: beforeFiles });
    esUser = await onboard(db, 'en', 'A1');
    itUser = await onboard(db, 'it', 'A1');
    const first = (
      await rows(
        db,
        `select l.id from public.lessons l join public.curriculum_units u on u.id = l.unit_id
         where u.language_code = 'en' and u.level = 'A1' and l.is_published and u.is_published
         order by u.position, l.position limit 1`,
      )
    )[0].id;
    await complete(db, esUser, first);
    enWord = (
      await rows(
        db,
        `select w.id from public.words w join public.concepts c on c.word_id = w.id
           and c.kind = 'lexical' and c.status = 'active'
         join public.curriculum_units u on u.id = w.unit_id and u.is_published
         where w.language_code = 'en' and w.is_published order by u.position, w.id limit 1`,
      )
    )[0].id;
    await db.query(
      `insert into public.user_word_progress (user_id, word_id, seen_count, next_review_at)
       values ($1, $2, 1, now() - interval '1 day')`,
      [esUser, enWord],
    );
    before1 = await snapshot(db, esUser);
    beforeIt = await snapshot(db, itUser);
    await db.exec(migrationSql);
  });

  test('un usuario de siempre ve y puede hacer exactamente lo mismo (y la migración es idempotente)', async () => {
    assert.ok(before1.units.length > 0 && before1.words.length > 0);
    assert.deepEqual(await snapshot(db, esUser), before1);
    assert.deepEqual(await snapshot(db, itUser), beforeIt);
    await db.exec(migrationSql);
    assert.deepEqual(await snapshot(db, esUser), before1);
  });

  test('el contenido existente queda en el curso por defecto de su idioma', async () => {
    assert.deepEqual(
      await rows(
        db,
        `select distinct u.course_code from public.curriculum_units u
         join public.courses c on c.code = u.course_code where not c.is_default`,
      ),
      [],
    );
    assert.deepEqual(
      await rows(
        db,
        `select w.id from public.words w join public.curriculum_units u on u.id = w.unit_id
         where w.course_code <> u.course_code`,
      ),
      [],
    );
    assert.deepEqual(
      await rows(
        db,
        `select code, target_language, source_language, is_default, status, content_prefix
         from public.courses where not is_default order by position`,
      ),
      [
        { code: 'en-from-pt', target_language: 'en', source_language: 'pt', is_default: false, status: 'hidden', content_prefix: 'ept' },
        { code: 'en-from-it', target_language: 'en', source_language: 'it', is_default: false, status: 'hidden', content_prefix: 'eit' },
        { code: 'en-from-fr', target_language: 'en', source_language: 'fr', is_default: false, status: 'hidden', content_prefix: 'efr' },
      ],
    );
  });

  test('interfaz en francés: se acepta fr; otros idiomas siguen rechazados', async () => {
    const u = await onboard(db, 'en', 'A1');
    await asUser(db, u, `select public.set_interface_language('fr')`);
    assert.equal(
      (await rows(db, `select interface_language from public.profiles where id = $1`, [u]))[0].interface_language,
      'fr',
    );
    for (const bad of ['de', 'FR', 'fr-FR']) {
      await rejects(asUser(db, u, `select public.set_interface_language($1)`, [bad]), 'interface_language_invalid');
    }
    await rejects(
      db.query(`update public.profiles set interface_language = 'de' where id = $1`, [u]),
      'profiles_interface_language_check',
    );
    const fresh = await createUser(db, 'cpl-fr@test.dev');
    await asUser(
      db,
      fresh,
      `select public.complete_onboarding_v2('cpl_fr_ui', 'bolt', 'en-from-es', 'A1', 10::smallint, 'fr')`,
    );
    await rejects(
      asUser(
        db,
        await createUser(db, 'cpl-de@test.dev'),
        `select public.complete_onboarding_v2('cpl_de_ui', 'bolt', 'en-from-es', 'A1', 10::smallint, 'de')`,
      ),
      'interface_language_invalid',
    );
  });

  describe('con contenido de en-from-pt', () => {
    let ptUser;

    before(async () => {
      await db.exec(EPT_FIXTURE);
    });

    test('los ids ept-* sin course_code caen en en-from-pt', async () => {
      assert.deepEqual(
        await rows(db, `select id, course_code from public.curriculum_units where id like 'ept-%'`),
        [{ id: 'ept-a1-u01', course_code: 'en-from-pt' }],
      );
      assert.deepEqual(
        await rows(db, `select id, course_code from public.words where id like 'ept-%'`),
        [{ id: 'ept-hello', course_code: 'en-from-pt' }],
      );
    });

    test('curso, idioma y espacio de ids tienen que coincidir', async () => {
      const unit = (id, lang, course, pos = 90) =>
        db.query(
          `insert into public.curriculum_units (id, language_code, level, position, title_es, title_en,
             description_es, emoji, course_code)
           values ($1, $2, 'A1', $4, 't', 't', 'd', 'x', $3)`,
          [id, lang, course, pos],
        );
      await rejects(unit('ept-a1-u90', 'pt', null), 'no es de pt');
      await rejects(unit('zz-a1-u90', 'en', 'en-from-pt'), 'espacio de ids');
      await rejects(unit('ept-a1-u90', 'en', 'en-from-es'), 'espacio de ids');
      // Misma posición que una unidad de en-from-es (A1 U2): la unicidad es por curso.
      await unit('ept-a1-u90', 'en', null, 2);
      await rejects(unit('ept-a1-u91', 'en', null, 2), 'course_code_level_position');
      await db.query(`delete from public.curriculum_units where id = 'ept-a1-u90'`);
      await rejects(
        db.query(
          `insert into public.words (id, language_code, unit_id, text, translation_es)
           values ('zz-hello', 'en', 'ept-a1-u01', 'hello', 'olá')`,
        ),
        'espacio de ids',
      );
      await rejects(
        db.query(
          `insert into public.words (id, language_code, unit_id, text, translation_es, course_code)
           values ('ept-bye', 'en', 'ept-a1-u01', 'bye', 'tchau', 'en-from-es')`,
        ),
        'no es el de su unidad',
      );
    });

    test('objetivos: aceptan el prefijo de un curso del idioma; group_key se repite entre cursos', async () => {
      const objective = (id, lang, groupKey) =>
        db.query(
          `insert into public.learning_objectives (id, language_code, level, cefr_activity, can_do_es,
             group_key, position, status)
           values ($1, $2, 'A1', 'reading', 'puede', $3, 1, 'draft')`,
          [id, lang, groupKey],
        );
      // El mismo group_key en en-from-es y en en-from-pt; nunca dos veces dentro de un mismo curso.
      await objective('en.a1.obj.cpl-test', 'en', 'cpl-group');
      await objective('ept.a1.obj.cpl-test', 'en', 'cpl-group');
      await rejects(objective('ept.a1.obj.cpl-test2', 'en', 'cpl-group'), 'group_key_language_key');
      await rejects(objective('en.a1.obj.cpl-test2', 'en', 'cpl-group'), 'group_key_language_key');
      await rejects(objective('ept.a1.obj.cpl-test3', 'pt', null), 'learning_objectives_id_check');
      await rejects(objective('ezz.a1.obj.cpl-test4', 'en', null), 'learning_objectives_id_check');
      await db.query(`delete from public.learning_objectives where id like '%.a1.obj.cpl-test'`);
    });

    test('un usuario de en-from-es no ve nada de en-from-pt y no cambia nada para él', async () => {
      assert.deepEqual(await snapshot(db, esUser), before1);
      for (const [table, col] of [
        ['curriculum_units', 'id'],
        ['lessons', 'id'],
        ['words', 'id'],
        ['exercises', 'id'],
        ['exercise_words', 'word_id'],
      ]) {
        assert.deepEqual(await asUser(db, esUser, `select 1 from public.${table} where ${col} like 'ept-%'`), [], table);
      }
    });

    test('un curso oculto no se puede elegir; disponible, sí', async () => {
      await rejects(
        asUser(db, esUser, `select public.set_active_course('en-from-it')`),
        'course_unavailable',
      );
      await rejects(
        asUser(db, esUser, `select public.start_course('en-from-pt', 'A1')`),
        'course_unavailable',
      );
      await db.query(`update public.courses set status = 'available' where code = 'en-from-pt'`);
      // Niveles: los publicados DEL CURSO (en-from-es tiene A2; en-from-pt, todavía no).
      ptUser = await onboard(db, 'en', 'A1');
      await rejects(
        asUser(db, ptUser, `select public.start_course('en-from-pt', 'A2')`),
        'level_unavailable',
      );
      const started = await asUser(db, ptUser, `select public.start_course('en-from-pt', 'A1') r`);
      assert.equal(started[0].r.course_code, 'en-from-pt');
      assert.deepEqual(
        await rows(db, `select target_language, active_course_code from public.profiles where id = $1`, [ptUser]),
        [{ target_language: 'en', active_course_code: 'en-from-pt' }],
      );
      await rejects(
        asUser(db, ptUser, `select public.set_course_start_level('en-from-pt', 'A2')`),
        'level_unavailable',
      );
      // Un curso con estado propio manda sobre el del idioma.
      await db.query(`update public.courses set status = 'beta' where code = 'en-from-pt'`);
      await rejects(
        asUser(db, ptUser, `select public.set_active_course('en-from-pt')`),
        'course_unavailable',
      );
      await db.query(`update public.courses set status = 'available' where code = 'en-from-pt'`);
      await asUser(db, ptUser, `select public.set_active_course('en-from-pt')`);
    });

    test('quien estudia en-from-pt ve sólo su curso en inglés (y los demás idiomas como siempre)', async () => {
      const s = await snapshot(db, ptUser);
      const en = await asUser(db, ptUser, `select id from public.curriculum_units where language_code = 'en' order by 1`);
      assert.deepEqual(en.map((r) => r.id), ['ept-a1-u01']);
      // Todo el contenido de inglés (sin RLS) y lo que de eso ve el usuario.
      const enLessons = await ids(
        db,
        `select l.id from public.lessons l join public.curriculum_units u on u.id = l.unit_id
         where u.language_code = 'en'`,
      );
      const enExercises = await ids(db, `select e.id from public.exercises e where e.lesson_id = any($1)`, [enLessons]);
      assert.deepEqual(
        s.lessons.filter((id) => enLessons.includes(id)),
        ['ept-a1-u01-l01', 'ept-a1-u01-l02'],
      );
      assert.deepEqual(
        (await asUser(db, ptUser, `select id from public.words where language_code = 'en'`)).map((r) => r.id),
        ['ept-hello'],
      );
      assert.deepEqual(
        s.exercises.filter((id) => enExercises.includes(id)),
        ['ept-a1-u01-l01-e01', 'ept-a1-u01-l02-e01'],
      );
      assert.deepEqual(
        s.exerciseWords.filter((id) => enExercises.includes(id.split('/')[0])),
        ['ept-a1-u01-l01-e01/ept-hello'],
      );
      assert.deepEqual(s.route, [{ level: 'A1', unit_id: 'ept-a1-u01', unit_order: 1, route_id: null }]);
      assert.deepEqual(s.routeIt, beforeIt.routeIt);
      assert.deepEqual(s.wordOfDay, [{ id: 'ept-hello' }]);
      // Otro idioma: igual que para cualquiera.
      const it = await asUser(db, ptUser, `select id from public.curriculum_units where language_code = 'it' order by 1`);
      const itBefore = await asUser(db, itUser, `select id from public.curriculum_units where language_code = 'it' order by 1`);
      assert.deepEqual(it, itBefore);
    });

    test('desbloqueo por curso: cada curso tiene su propia primera lección', async () => {
      assert.equal(await unlocked(db, ptUser, 'ept-a1-u01-l01'), true);
      assert.equal(await unlocked(db, ptUser, 'ept-a1-u01-l02'), false);
      // La primera de en-from-es sigue abierta para todos (otra cadena), y la de ept no la tapa.
      assert.ok(before1.unlockedLessons.every((id) => !id.startsWith('ept-')));
      assert.deepEqual(
        await ids(db, `select x as id from public.curriculum_unlocked_unit_ids($1, 'en') x`, [ptUser]),
        ['ept-a1-u01'],
      );
      await complete(db, ptUser, 'ept-a1-u01-l01');
      assert.equal(await unlocked(db, ptUser, 'ept-a1-u01-l02'), true);
      assert.deepEqual(
        await ids(db, `select x as id from public.curriculum_unlocked_unit_ids($1, 'en') x order by 1`, [esUser]),
        before1.unlockedUnits,
      );
    });

    test('los repasos no cruzan cursos', async () => {
      await db.query(
        `insert into public.user_word_progress (user_id, word_id, seen_count, next_review_at)
         values ($1, 'ept-hello', 1, now() - interval '1 day'), ($2, 'ept-hello', 1, now() - interval '1 day'),
                ($1, $3, 1, now() - interval '1 day')`,
        [ptUser, esUser, enWord],
      );
      const focusWords = async (u) =>
        (await service(db, `select public.learning_focus_candidates($1, 'en', $2) r`, [u, NOW]))[0].r.words.map(
          (w) => w.word.id,
        );
      assert.deepEqual(await focusWords(ptUser), ['ept-hello']);
      const es = await focusWords(esUser);
      assert.ok(es.includes(enWord) && !es.includes('ept-hello'));
      // La puerta de todos los flujos de repaso: el ítem tiene que venir de una unidad visible.
      const enItem = (
        await rows(
          db,
          `select e.item_id from public.exercises e join public.lessons l on l.id = e.lesson_id and l.is_published
           join public.curriculum_units u on u.id = l.unit_id and u.is_published and u.course_code = 'en-from-es'
           where l.id = any($1) and e.is_published order by e.id limit 1`,
          [before1.unlockedLessons],
        )
      )[0].item_id;
      const inRoute = async (u, item) =>
        (await service(db, `select public.review_item_in_route($1, $2) ok`, [u, item]))[0].ok;
      assert.equal(await inRoute(ptUser, 'ept-a1-u01-l01-e01'), true);
      assert.equal(await inRoute(esUser, 'ept-a1-u01-l01-e01'), false);
      assert.equal(await inRoute(ptUser, enItem), false);
      assert.equal(await inRoute(esUser, enItem), true);
      // Mastery: sólo unidades de su curso.
      const m = (await asUser(db, ptUser, `select public.get_learning_mastery('en', $1) r`, [TZ]))[0].r;
      assert.ok((m.units ?? []).every((u) => u.unit_id.startsWith('ept-')));
    });

    test('set_target_language (RPC vieja) elige el curso por defecto al cambiar de idioma', async () => {
      await asUser(db, ptUser, `select public.set_target_language('it')`);
      // Fuera de su curso activo, el inglés se ve con el último curso de inglés que eligió.
      assert.equal((await rows(db, `select public.user_course_for($1, 'en') c`, [ptUser]))[0].c, 'en-from-pt');
      await asUser(db, ptUser, `select public.set_target_language('en')`);
      assert.deepEqual(
        await rows(db, `select target_language, active_course_code from public.profiles where id = $1`, [ptUser]),
        [{ target_language: 'en', active_course_code: 'en-from-es' }],
      );
      assert.ok(
        (await asUser(db, ptUser, `select id from public.curriculum_units where language_code = 'en'`)).every(
          (r) => !r.id.startsWith('ept-'),
        ),
      );
      await asUser(db, esUser, `select public.set_target_language('en')`);
      assert.equal(
        (await rows(db, `select active_course_code from public.profiles where id = $1`, [esUser]))[0].active_course_code,
        'en-from-es',
      );
    });

    test('el rollback se niega mientras haya contenido de un curso nuevo', async () => {
      await rejects(db.exec(rollbackSql), 'rollback courses_per_language');
      assert.equal(
        (await rows(db, `select count(*)::int n from public.courses`))[0].n,
        9,
      );
    });
  });
});

describe('rollback', () => {
  test('vuelve a un curso por idioma y se puede volver a aplicar', async () => {
    const db = await createDb({ files: [...beforeFiles, MIGRATION] });
    const u = await onboard(db, 'en', 'A1');
    const fr = await onboard(db, 'en', 'A1');
    await asUser(db, fr, `select public.set_interface_language('fr')`);
    const before1 = await snapshot(db, u);
    await db.exec(rollbackSql);
    await db.exec(rollbackSql); // idempotente
    // Interfaz: quien tenía fr queda en null, y fr vuelve a rechazarse.
    assert.equal(
      (await rows(db, `select interface_language from public.profiles where id = $1`, [fr]))[0].interface_language,
      null,
    );
    await rejects(asUser(db, fr, `select public.set_interface_language('fr')`), 'interface_language_invalid');
    await asUser(db, fr, `select public.set_interface_language('it')`);
    assert.deepEqual(
      await rows(
        db,
        `select table_name, column_name from information_schema.columns
         where table_schema = 'public'
           and ((table_name in ('curriculum_units', 'words') and column_name = 'course_code')
             or (table_name = 'courses' and column_name in ('status', 'content_prefix')))`,
      ),
      [],
    );
    assert.equal((await rows(db, `select count(*)::int n from public.courses`))[0].n, 6);
    assert.equal(
      (
        await rows(
          db,
          `select count(*)::int n from pg_constraint
           where conname in ('curriculum_units_language_code_level_position_key',
                             'learning_objectives_group_key_language_key')`,
        )
      )[0].n,
      2,
    );
    assert.deepEqual(await snapshot(db, u), before1);
    await db.exec(migrationSql);
    assert.deepEqual(await snapshot(db, u), before1);
  });
});
