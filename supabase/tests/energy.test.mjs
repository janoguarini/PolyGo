import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb, createUser, as } from './harness.mjs';
import { ENERGY } from '../../shared/energy.ts';

let db;

// Contenido propio (en portugués, como learning.test) para no depender del orden de desbloqueo real.
const FIXTURE = `
  insert into public.curriculum_units (id, language_code, level, position, title_es, title_en, description_es, emoji, is_published)
  values ('zz-energy-u1', 'pt', 'A2', 1, 'Unidad', 'Unit', 'desc', '⚡', true);
  insert into public.lessons (id, unit_id, position, title_es, objective_es, is_published) values
    ('zz-energy-l1', 'zz-energy-u1', 1, 'Lección 1', 'obj', true);
  insert into public.words (id, language_code, unit_id, text, translation_es, is_published) values
    ('zz-energy-hello', 'en', 'zz-energy-u1', 'hello', 'hola', true);
  insert into public.exercises (id, lesson_id, position, type, skill, prompt_es, payload, answer, is_published) values
    ('zz-energy-e1', 'zz-energy-l1', 1, 'translate_write', 'translation', 'p', '{"type":"translate_write","source":"hola"}', 'hello', true);
  insert into public.exercise_words values ('zz-energy-e1', 'zz-energy-hello');
`;

before(async () => {
  db = await createDb();
  await db.exec(FIXTURE);
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const rpc = (u, sql, params = []) =>
  as(db, 'authenticated', u, async () => (await db.query(sql, params)).rows[0]?.r);
const energy = (u) => rpc(u, 'select public.get_energy() as r');

/** Lección terminada; con un error en el primer intento y el reintento bien (no gasta de más). */
const finishLesson = (u, id = randomUUID()) =>
  rpc(
    u,
    `select public.submit_learning_session($1, 'lesson', 'zz-energy-l1', now() - interval '2 minutes', $2::jsonb, 'UTC') as r`,
    [
      id,
      JSON.stringify([
        {
          exercise_id: 'zz-energy-e1',
          answer: 'x',
          correct: false,
          first_try: true,
          response_ms: 900,
        },
        {
          exercise_id: 'zz-energy-e1',
          answer: 'hello',
          correct: true,
          first_try: false,
          response_ms: 900,
        },
      ]),
    ],
  );

/** Atrasa el ancla de la energía `hours` horas (simula el paso del tiempo en el servidor). */
const travel = (u, hours) =>
  db.query(
    `update public.user_energy set anchor_at = anchor_at - make_interval(hours => $2) where user_id = $1`,
    [u, hours],
  );

const lessonSessions = async (u) =>
  Number(
    (
      await one(
        `select count(*) n from public.learning_sessions where user_id = $1 and kind = 'lesson'`,
        [u],
      )
    ).n,
  );

test('energy_config replica shared/energy.ts', async () => {
  const { c } = await one('select public.energy_config() as c');
  assert.deepEqual(c, { ...ENERGY });
});

test('una cuenta nueva arranca llena y sin reloj de recarga', async () => {
  const u = await createUser(db, 'energy_new@test.dev');
  const e = await energy(u);
  assert.equal(e.plus, false);
  assert.equal(e.energy, ENERGY.max);
  assert.equal(e.max, ENERGY.max);
  assert.equal(e.next_unit_at, null);
  assert.equal(e.full_at, null);
});

test('completar una lección gasta 1 aunque haya errores; reenviarla no gasta otra vez', async () => {
  const u = await createUser(db, 'energy_spend@test.dev');
  const id = randomUUID();
  const r = await finishLesson(u, id);
  assert.equal(r.energy_left, ENERGY.max - ENERGY.lessonCost);
  const dup = await finishLesson(u, id);
  assert.equal(dup.duplicate, true);
  const e = await energy(u);
  assert.equal(e.energy, ENERGY.max - 1);
  // El reloj arranca al gastar desde lleno: próxima unidad en 3 h.
  const wait = (new Date(e.next_unit_at) - new Date(e.server_now)) / 1000;
  assert.ok(Math.abs(wait - ENERGY.regenSeconds) < 5, `espera ${wait}`);
});

test('sin energía: la lección no se guarda; se recupera 1 cada 3 h hasta el máximo', async () => {
  const u = await createUser(db, 'energy_empty@test.dev');
  for (let i = 0; i < ENERGY.max; i++) await finishLesson(u);
  assert.equal((await energy(u)).energy, 0);

  await assert.rejects(finishLesson(u), /no_energy/);
  assert.equal(await lessonSessions(u), ENERGY.max, 'la sesión rechazada no queda guardada');

  // Repasar no usa energía.
  const review = await rpc(
    u,
    `select public.submit_learning_session($1, 'review', '', now() - interval '1 minute', $2::jsonb, 'UTC') as r`,
    [
      randomUUID(),
      JSON.stringify([
        {
          word_id: 'zz-energy-hello',
          answer: 'hello',
          correct: true,
          first_try: true,
          response_ms: 900,
        },
      ]),
    ],
  );
  assert.equal(review.duplicate, false);
  assert.equal(review.energy_left, null);

  await travel(u, 3);
  let e = await energy(u);
  assert.equal(e.energy, 1);
  const r = await finishLesson(u);
  assert.equal(r.energy_left, 0);

  // Ocho horas después: 2 unidades y la recarga parcial (2 h) se conserva para la tercera.
  await travel(u, 8);
  e = await energy(u);
  assert.equal(e.energy, 2);
  const wait = (new Date(e.next_unit_at) - new Date(e.server_now)) / 1000;
  assert.ok(Math.abs(wait - 3600) < 5, `espera ${wait}`);

  // Mucho tiempo después: tope en el máximo.
  await travel(u, 100);
  e = await energy(u);
  assert.equal(e.energy, ENERGY.max);
  assert.equal(e.next_unit_at, null);
});

test('Plus: energía ilimitada mientras esté vigente', async () => {
  const u = await createUser(db, 'energy_plus@test.dev');
  await db.query(
    `insert into public.user_entitlements (user_id, entitlement, source, expires_at)
     values ($1, 'plus', 'manual', now() + interval '30 days')`,
    [u],
  );
  for (let i = 0; i < ENERGY.max + 2; i++) {
    const r = await finishLesson(u);
    assert.equal(r.energy_left, null);
  }
  const e = await energy(u);
  assert.equal(e.plus, true);
  assert.ok(e.plus_expires_at);
  assert.equal(e.energy, ENERGY.max);

  // Vencido: vuelve a ser gratuito.
  await db.query(
    `update public.user_entitlements set expires_at = now() - interval '1 minute' where user_id = $1`,
    [u],
  );
  const after = await energy(u);
  assert.equal(after.plus, false);
  assert.equal(after.plus_expires_at, null);
  assert.equal((await finishLesson(u)).energy_left, ENERGY.max - 1);
});

test('el cliente no puede darse Plus ni energía, ni ver la de otros', async () => {
  const u = await createUser(db, 'energy_cheat@test.dev');
  const other = await createUser(db, 'energy_other@test.dev');
  await finishLesson(other);

  await assert.rejects(
    as(db, 'authenticated', u, () =>
      db.query(
        `insert into public.user_entitlements (user_id, entitlement, source) values ($1, 'plus', 'manual')`,
        [u],
      ),
    ),
    /permission denied/,
  );
  await finishLesson(u);
  await assert.rejects(
    as(db, 'authenticated', u, () =>
      db.query(`update public.user_energy set units = 99 where user_id = $1`, [u]),
    ),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'authenticated', u, () => db.query(`select public.consume_lesson_energy($1)`, [u])),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'authenticated', u, () => db.query(`select public.has_plus($1)`, [u])),
    /permission denied/,
  );
  const visible = await as(db, 'authenticated', u, async () =>
    (await db.query(`select user_id from public.user_energy`)).rows.map((r) => r.user_id),
  );
  assert.deepEqual(visible, [u]);
  await assert.rejects(
    as(db, 'anon', null, () => db.query('select public.get_energy()')),
    /permission denied/,
  );
});
