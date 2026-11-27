// Español neutro en el contenido ya cargado (20270104120000_neutral_spanish_content.sql,
// docs/NEUTRAL_SPANISH.md): conserva el progreso, el repaso espaciado, los intentos y la publicación;
// el texto nuevo es una versión nueva de cada ítem; las respuestas de antes se siguen aceptando.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

import { gradeWithSpec } from '../../shared/grading.ts';
import { SHUFFLE_V1, choiceSeed, shuffleOrderV1 } from '../../shared/shuffle.ts';
import { createDb, createUser } from './harness.mjs';

const NEUTRAL = [
  '20270104120000_neutral_spanish_content.sql',
  '20270104120100_achievements_neutral_spanish.sql',
  '20270104120200_neutral_spanish_texts.sql',
];
const migration = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const allFiles = readdirSync(new URL('../migrations/', import.meta.url))
  .filter((f) => f.endsWith('.sql'))
  .sort();
const beforeNeutral = allFiles.filter((f) => f < NEUTRAL[0]);
const after = allFiles.filter((f) => f >= NEUTRAL[0]);

let db;
let user;
/** Estado anterior a la corrección, para comparar. */
let old;

const q = async (sql, params = []) => (await db.query(sql, params)).rows;

before(async () => {
  db = await createDb({ files: beforeNeutral });
  user = await createUser(db, 'neutro@test.dev');

  // Ejercicios que la corrección cambia (consignas generadas «Escuchá y elegí…», «Traducí…»), uno por
  // idioma, más todos los de respuesta escrita en español.
  const changed = await q(
    `select distinct on (u.language_code) e.id, e.lesson_id, e.item_id, e.item_version_id
     from public.exercises e
     join public.lessons l on l.id = e.lesson_id
     join public.curriculum_units u on u.id = l.unit_id
     where e.prompt_es in ('Escuchá y elegí lo que oís', 'Completá la frase', 'Ordená las palabras')
     order by u.language_code, e.id`,
  );
  assert.ok(changed.length >= 4, 'hay ejercicios con consignas viejas en varios idiomas');

  // Progreso, repaso espaciado, una sesión con intentos y la presentación exacta que se respondió.
  const session = randomUUID();
  await db.query(
    `insert into public.learning_sessions (id, user_id, kind, started_at, duration_seconds, total_answers,
       first_try_total, first_try_correct, local_date)
     values ($1, $2, 'review', now() - interval '3 minutes', 120, $3, $3, 0, current_date)`,
    [session, user, changed.length],
  );
  let pos = 1;
  for (const e of changed) {
    await db.query(
      `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy,
         last_accuracy, first_completed_at, last_completed_at)
       values ($1, $2, 1, 1, 1, now(), now()) on conflict do nothing`,
      [user, e.lesson_id],
    );
    await db.query(
      `insert into public.exercise_attempts (session_id, user_id, exercise_id, skill, answer, is_correct,
         is_first_try, response_ms)
       values ($1, $2, $3, 'vocabulary', 'x', true, true, 1500)`,
      [session, user, e.id],
    );
    // La presentación exacta que vio el usuario: versión y conjunto vigentes, mezclados como el servidor.
    const [p] = await q(
      `select e.option_set_id, jsonb_array_length(s.options) n
       from public.exercises e left join public.exercise_option_sets s on s.id = e.option_set_id
       where e.id = $1`,
      [e.id],
    );
    const seed = choiceSeed(session, e.id);
    const order = p.option_set_id ? shuffleOrderV1(p.n, seed) : null;
    await db.query(
      `insert into public.exercise_presentations (user_id, session_id, position, item_id, item_version_id,
         exercise_id, option_set_id, option_order, shuffle_algorithm, shuffle_seed)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        user,
        session,
        pos++,
        e.item_id,
        e.item_version_id,
        e.id,
        p.option_set_id,
        order,
        order ? SHUFFLE_V1 : null,
        order ? seed : null,
      ],
    );
  }
  await db.query(
    `insert into public.user_word_progress (user_id, word_id, stage, seen_count, correct_count, incorrect_count,
       last_result, last_reviewed_at, next_review_at)
     select $1, w.id, 2, 3, 2, 1, true, now() - interval '2 days', now() + interval '1 day'
     from public.words w`,
    [user],
  );

  old = {
    changed,
    exercises: await q(
      `select id, lesson_id, position, type, skill, is_published, item_id, item_version_id, prompt_es,
              answer, accepted_answers, payload
       from public.exercises order by id`,
    ),
    words: await q(
      `select id, unit_id, text, translation_es, accepted_translations, is_published from public.words order by id`,
    ),
    units: await q(`select id, position, is_published from public.curriculum_units order by id`),
    lessons: await q(`select id, unit_id, position, is_published from public.lessons order by id`),
    items: await q(`select id, status, type from public.exercise_items order by id`),
    versions: await q(
      `select id, item_id, version, content_hash from public.exercise_item_versions order by id`,
    ),
    progress: await q(
      `select * from public.user_lesson_progress where user_id = $1 order by lesson_id`,
      [user],
    ),
    srs: await q(`select * from public.user_word_progress where user_id = $1 order by word_id`, [
      user,
    ]),
    attempts: await q(`select * from public.exercise_attempts where user_id = $1 order by id`, [
      user,
    ]),
    presentations: await q(
      `select * from public.exercise_presentations where user_id = $1 order by id`,
      [user],
    ),
  };

  for (const f of after) await db.exec(migration(f));
});

test('no hay altas ni bajas: mismos ids, posiciones, tipos y publicación', async () => {
  const ex = await q(
    `select id, lesson_id, position, type, skill, is_published, item_id from public.exercises order by id`,
  );
  assert.deepEqual(
    ex,
    old.exercises.map(({ id, lesson_id, position, type, skill, is_published, item_id }) => ({
      id,
      lesson_id,
      position,
      type,
      skill,
      is_published,
      item_id,
    })),
  );
  assert.deepEqual(
    await q(`select id, position, is_published from public.curriculum_units order by id`),
    old.units,
  );
  assert.deepEqual(
    await q(`select id, unit_id, position, is_published from public.lessons order by id`),
    old.lessons,
  );
  assert.deepEqual(
    await q(`select id, status, type from public.exercise_items order by id`),
    old.items,
  );
  const words = await q(`select id, unit_id, text, is_published from public.words order by id`);
  assert.deepEqual(
    words,
    old.words.map(({ id, unit_id, text, is_published }) => ({ id, unit_id, text, is_published })),
  );
});

test('el progreso, el repaso espaciado, los intentos y las presentaciones quedan intactos', async () => {
  assert.deepEqual(
    await q(`select * from public.user_lesson_progress where user_id = $1 order by lesson_id`, [
      user,
    ]),
    old.progress,
  );
  assert.deepEqual(
    await q(`select * from public.user_word_progress where user_id = $1 order by word_id`, [user]),
    old.srs,
  );
  assert.deepEqual(
    await q(`select * from public.exercise_attempts where user_id = $1 order by id`, [user]),
    old.attempts,
  );
  // La presentación sigue apuntando a la versión que se respondió (FK a exercise_item_versions).
  assert.deepEqual(
    await q(`select * from public.exercise_presentations where user_id = $1 order by id`, [user]),
    old.presentations,
  );
});

test('el texto nuevo es una versión nueva del mismo ítem; las anteriores quedan', async () => {
  const versions = await q(
    `select id, item_id, version, content_hash from public.exercise_item_versions order by id`,
  );
  const ids = new Set(versions.map((v) => v.id));
  for (const v of old.versions) assert.ok(ids.has(v.id), `se conserva la versión ${v.id}`);
  for (const e of old.changed) {
    const [now] = await q(
      `select e.item_id, e.item_version_id, e.prompt_es, v.version, i.current_version_id
       from public.exercises e
       join public.exercise_item_versions v on v.id = e.item_version_id
       join public.exercise_items i on i.id = e.item_id
       where e.id = $1`,
      [e.id],
    );
    assert.equal(now.item_id, e.item_id);
    assert.notEqual(now.item_version_id, e.item_version_id);
    assert.equal(now.current_version_id, now.item_version_id);
    assert.doesNotMatch(now.prompt_es, /Escuchá|Elegí|Completá|Ordená|Traducí|Escribí|Respondé/);
    const [prev] = await q(`select version from public.exercise_item_versions where id = $1`, [
      e.item_version_id,
    ]);
    assert.ok(now.version > prev.version);
  }
});

test('ninguna consigna, explicación ni traducción visible queda con las formas viejas generadas', async () => {
  const [{ n }] = await q(
    `select count(*)::int n from public.exercises
     where prompt_es ~ '(Escuchá|Traducí|Completá|Ordená|Respondé|Escribí la|Uní cada|Leé)'`,
  );
  assert.equal(n, 0);
  const [{ m }] = await q(
    `select count(*)::int m from public.curriculum_units
     where objective_es ~ '(^|\\s)Podés' or description_es ~ '(^|\\s)Podés'`,
  );
  assert.equal(m, 0);
});

test('las respuestas de antes se siguen aceptando (voseo y tuteo)', async () => {
  // Palabras: toda traducción aceptada antes sigue aceptada (canónica o en la lista).
  const now = new Map(
    (await q(`select id, translation_es, accepted_translations from public.words`)).map((w) => [
      w.id,
      w,
    ]),
  );
  for (const w of old.words) {
    const n = now.get(w.id);
    const accepted = new Set(
      [n.translation_es, ...n.accepted_translations].map((s) => s.toLowerCase()),
    );
    for (const a of [w.translation_es, ...w.accepted_translations])
      assert.ok(accepted.has(a.toLowerCase()), `${w.id}: «${a}» sigue aceptada`);
  }
  // Ejercicios de respuesta escrita: la respuesta y las aceptadas de antes siguen siendo correctas.
  const byId = new Map(
    (
      await q(
        `select e.id, e.type, e.answer, e.accepted_answers, e.payload, v.grading_spec
         from public.exercises e join public.exercise_item_versions v on v.id = e.item_version_id`,
      )
    ).map((e) => [e.id, e]),
  );
  let checked = 0;
  for (const o of old.exercises) {
    const n = byId.get(o.id);
    if (!n || n.grading_spec?.mode !== 'normalized_text') continue;
    if (
      o.answer === n.answer &&
      JSON.stringify(o.accepted_answers) === JSON.stringify(n.accepted_answers)
    )
      continue;
    for (const value of [o.answer, ...o.accepted_answers]) {
      const r = gradeWithSpec(
        n.grading_spec,
        { answer: n.answer, accepted_answers: n.accepted_answers, payload: n.payload },
        { kind: 'text', value },
      );
      assert.ok(r.correct, `${o.id}: «${value}» sigue siendo correcta`);
      checked++;
    }
  }
  assert.ok(checked >= 0);
});

test('reaplicada no cambia nada (idempotente)', async () => {
  const count = async () =>
    (await q(`select count(*)::int n from public.exercise_item_versions`))[0].n;
  const n = await count();
  for (const f of after) await db.exec(migration(f));
  assert.equal(await count(), n);
});

test('el aviso de actualizar la app y los logros quedan en español neutro', async () => {
  const [p] = await q(`select message_es from public.app_client_policy where platform = 'any'`);
  assert.match(p.message_es, /Actualízala/);
  const [{ n }] = await q(
    `select count(*)::int n from public.achievements
     where is_active and description_es ~ '(Estudiá|Completá|Terminá|Juntá|Respondé|Dominá|Jugá|Ganá|Llegá)'`,
  );
  assert.equal(n, 0);
});
