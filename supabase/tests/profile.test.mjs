import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb, createUser, as } from './harness.mjs';
import { lessonStars } from '../../src/features/learning/path.ts';

let db;
let alice;
let bob;
let carol;

// Lección mínima de un ejercicio (nivel A2 para no depender del orden del contenido real A1).
const FIXTURE = `
  insert into public.curriculum_units (id, language_code, level, position, title_es, title_en, description_es, emoji, is_published)
  values ('p-u1', 'en', 'A2', 1, 'Unidad', 'Unit', 'desc', '👋', true);
  insert into public.lessons (id, unit_id, position, title_es, objective_es, is_published)
  values ('p-l1', 'p-u1', 1, 'Lección', 'obj', true);
  insert into public.words (id, language_code, unit_id, text, translation_es, is_published)
  values ('p-hello', 'en', 'p-u1', 'hello', 'hola', true);
  insert into public.exercises (id, lesson_id, position, type, skill, prompt_es, payload, answer, is_published)
  values ('p-e1', 'p-l1', 1, 'translate_write', 'translation', 'p', '{"type":"translate_write","source":"hola"}', 'hello', true);
  insert into public.exercise_words values ('p-e1', 'p-hello');
`;

before(async () => {
  db = await createDb();
  await db.exec(FIXTURE);
  alice = await createUser(db, 'alice@test.dev');
  bob = await createUser(db, 'bob@test.dev');
  carol = await createUser(db, 'carol@test.dev');
  for (const [id, name] of [
    [alice, 'alice'],
    [bob, 'bob'],
    [carol, 'carol'],
  ]) {
    await db.query('update public.profiles set username = $2 where id = $1', [id, name]);
  }
});

const rpc = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows);

/** Crea una partida terminada como lo haría el servidor (rol propietario). */
async function battle({ a, b, winner, status = 'completed', endedAgo = '1 hour' }) {
  const id = randomUUID();
  await db.query(
    `insert into public.battles (id, language_code, status, started_at, ended_at)
     values ($1, 'en', $2, now() - $3::interval - interval '75 seconds', now() - $3::interval)`,
    [id, status, endedAgo],
  );
  const result = (u) => (winner === null ? 'draw' : winner === u ? 'win' : 'loss');
  await db.query(
    `insert into public.battle_players (battle_id, slot, user_id, score, correct_answers, total_answers, result, rating_before, rating_after)
     values ($1, 1, $2, 900, 8, 10, $4, 1000, $5), ($1, 2, $3, 600, 6, 10, $6, 1000, $7)`,
    [
      id,
      a,
      b,
      result(a),
      result(a) === 'win' ? 1024 : 976,
      result(b),
      result(b) === 'win' ? 1024 : 976,
    ],
  );
  return id;
}

test('el cliente no puede escribir partidas ni logros', async () => {
  await as(db, 'authenticated', alice, async () => {
    await assert.rejects(
      db.query(`insert into public.battles (language_code, status) values ('en', 'completed')`),
      /permission denied/,
    );
    await assert.rejects(
      db.query(
        `insert into public.user_achievements (user_id, achievement_id) values ($1, 'first_win')`,
        [alice],
      ),
      /permission denied/,
    );
    await assert.rejects(
      db.query('select public.evaluate_achievements($1)', [alice]),
      /permission denied/,
    );
  });
});

test('rating_history.battle_id debe apuntar a una partida existente', async () => {
  await assert.rejects(
    db.query(
      `insert into public.rating_history (user_id, language_code, battle_id, reason, rating_before, rating_after)
       values ($1, 'en', $2, 'battle', 1000, 1016)`,
      [alice, randomUUID()],
    ),
    /foreign key/,
  );
});

test('historial de partidas: propias, terminadas, más recientes primero y con datos del rival', async () => {
  const older = await battle({ a: alice, b: bob, winner: bob, endedAgo: '2 hours' });
  const newer = await battle({ a: alice, b: bob, winner: alice, endedAgo: '1 hour' });
  await battle({ a: alice, b: bob, winner: null, status: 'cancelled' });
  await battle({ a: bob, b: carol, winner: carol });

  const history = await rpc(alice, 'select * from public.get_match_history(20, null)');
  assert.deepEqual(
    history.map((h) => h.battle_id),
    [newer, older],
  );
  assert.equal(history[0].result, 'win');
  assert.equal(history[0].rating_after - history[0].rating_before, 24);
  assert.equal(history[0].opponent_username, 'bob');
  assert.equal(history[0].opponent_score, 600);

  const page2 = await rpc(alice, 'select battle_id from public.get_match_history(1, $1)', [
    history[0].ended_at,
  ]);
  assert.deepEqual(
    page2.map((h) => h.battle_id),
    [older],
  );

  const forCarol = await rpc(carol, 'select * from public.get_match_history(20, null)');
  assert.equal(forCarol.length, 1, 'carol sólo ve su partida contra bob');
});

test('las tablas de partidas sólo muestran filas propias', async () => {
  const rows = await rpc(alice, 'select distinct user_id from public.battle_players');
  assert.deepEqual(
    rows.map((r) => r.user_id),
    [alice],
  );
  const battles = await rpc(carol, 'select id from public.battles');
  assert.equal(battles.length, 1);
});

test('si el rival borra su cuenta, la partida se conserva anonimizada', async () => {
  const dave = await createUser(db, 'dave@test.dev');
  await db.query(`update public.profiles set username = 'dave' where id = $1`, [dave]);
  const id = await battle({ a: carol, b: dave, winner: carol, endedAgo: '1 minute' });
  await db.query('delete from auth.users where id = $1', [dave]);

  const [last] = await rpc(carol, 'select * from public.get_match_history(1, null)');
  assert.equal(last.battle_id, id);
  assert.equal(last.opponent_id, null);
  assert.equal(last.opponent_username, null);
  assert.equal(last.result, 'win');
});

test('completar una lección perfecta desbloquea logros una sola vez', async () => {
  const sessionId = randomUUID();
  const submit = () =>
    rpc(
      alice,
      `select public.submit_learning_session($1, 'lesson', 'p-l1', now() - interval '1 minute', $2::jsonb, 'UTC') as r`,
      [
        sessionId,
        JSON.stringify([
          {
            exercise_id: 'p-e1',
            answer: 'hello',
            correct: true,
            first_try: true,
            response_ms: 900,
          },
        ]),
      ],
    ).then((rows) => rows[0].r);

  const first = await submit();
  assert.deepEqual(
    first.achievements_unlocked.map((a) => a.id),
    ['first_lesson', 'perfect_lesson'],
  );
  assert.equal(first.achievements_unlocked[0].title, 'Primer paso');

  const again = await submit();
  assert.equal(again.duplicate, true);
  assert.deepEqual(again.achievements_unlocked, []);

  const mine = await rpc(alice, 'select * from public.get_my_achievements()');
  const byId = Object.fromEntries(mine.map((a) => [a.id, a]));
  assert.ok(byId.first_lesson.unlocked_at);
  assert.equal(byId.lessons_5.progress, 1);
  assert.equal(byId.lessons_5.unlocked_at, null);
  assert.equal(byId.words_25.progress, 1);
});

test('la racha más larga cuenta días consecutivos aunque haya huecos', async () => {
  await db.query(
    `insert into public.user_daily_activity (user_id, activity_date, sessions_completed)
     select $1::uuid, d::date, 1 from generate_series(current_date - 20, current_date - 18, interval '1 day') d
     union all select $1::uuid, current_date - 10, 1`,
    [bob],
  );
  const [{ m }] = await rpc(bob, 'select public.achievement_metrics($1) as m', [bob]);
  assert.equal(m.best_streak_days, 3);
  // Con RLS, un cliente no ve las métricas educativas de otro usuario.
  const [{ m: spy }] = await rpc(alice, 'select public.achievement_metrics($1) as m', [bob]);
  assert.equal(spy.best_streak_days, 0);
});

test('los logros competitivos se calculan desde el rating', async () => {
  await db.query(
    `update public.player_ratings set games_played = 5, wins = 5, win_streak = 5, best_win_streak = 5,
       rating = 1210, peak_rating = 1210 where user_id = $1`,
    [carol],
  );
  await db.query('select public.evaluate_achievements($1)', [carol]);
  const mine = await rpc(
    carol,
    'select id from public.get_my_achievements() where unlocked_at is not null',
  );
  assert.deepEqual(
    mine.map((a) => a.id),
    ['placement_done', 'first_win', 'win_streak_5', 'peak_platinum'],
  );
});

test('perfil público respeta la visibilidad', async () => {
  const [{ p: open }] = await rpc(bob, 'select public.get_public_profile($1) as p', [carol]);
  assert.equal(open.username, 'carol');
  assert.equal(open.is_public, true);
  assert.equal(open.stats.wins, 5);
  assert.equal(open.rating.rating, 1210);
  assert.equal(open.achievements.length, 4);

  await db.query(
    `update public.user_settings set profile_visibility = 'private' where user_id = $1`,
    [carol],
  );
  const [{ p: closed }] = await rpc(bob, 'select public.get_public_profile($1) as p', [carol]);
  assert.equal(closed.is_public, false);
  assert.equal(closed.rating.rating, 1210, 'el rango siempre es visible');
  assert.equal(closed.stats, undefined);
  assert.equal(closed.achievements, undefined);

  const [{ p: self }] = await rpc(carol, 'select public.get_public_profile($1) as p', [carol]);
  assert.equal(self.is_public, true, 'uno siempre ve su propio perfil completo');

  const [{ p: missing }] = await rpc(bob, 'select public.get_public_profile($1) as p', [
    randomUUID(),
  ]);
  assert.equal(missing, null);

  await as(db, 'anon', null, async () => {
    await assert.rejects(
      db.query('select public.get_public_profile($1)', [carol]),
      /permission denied/,
    );
  });
});

test('el catálogo de logros es legible y estable', async () => {
  const rows = await rpc(
    alice,
    'select id, metric, threshold from public.achievements order by position',
  );
  assert.equal(rows.length, 20);
  assert.equal(new Set(rows.map((r) => r.id)).size, rows.length);
});

// ---------- estrellas ----------
const STAR_ACCURACIES = [1, 1, 0.95, 0.8, 0.79, 0.5, 0];

/** Usuario con progreso en lecciones de prueba (una por precisión, más una despublicada). */
async function starUser(email, accuracies = STAR_ACCURACIES) {
  const id = await createUser(db, email);
  await db.query('update public.profiles set username = $2 where id = $1', [
    id,
    email.split('@')[0],
  ]);
  const prefix = email.split('@')[0];
  for (const [i, acc] of accuracies.entries()) {
    await db.query(
      `insert into public.lessons (id, unit_id, position, title_es, objective_es, is_published)
       values ($1, 'p-u1', $2, 'L', 'o', true)`,
      [`${prefix}-l${i}`, 100 + i + 100 * accuracies.length * prefix.length],
    );
    await db.query(
      `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy, last_accuracy)
       values ($1, $2, 1, $3, $3)`,
      [id, `${prefix}-l${i}`, acc],
    );
  }
  return id;
}

test('las estrellas del SQL siguen la misma regla que la app (lessonStars)', async () => {
  const dave = await starUser('dave@test.dev');
  // Una lección despublicada y una sin completar no suman.
  await db.query(
    `insert into public.lessons (id, unit_id, position, title_es, objective_es, is_published)
     values ('dave-hidden', 'p-u1', 999, 'L', 'o', false)`,
  );
  await db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy)
     values ($1, 'dave-hidden', 1, 1), ($1, 'p-l1', 0, 0)`,
    [dave],
  );
  const [{ s }] = await rpc(dave, 'select public.lesson_star_totals($1) as s', [dave]);
  assert.deepEqual(s, {
    stars_earned: STAR_ACCURACIES.reduce((n, a) => n + lessonStars(a), 0),
    golden_lessons: STAR_ACCURACIES.filter((a) => lessonStars(a) === 3).length,
  });
  const [{ m }] = await rpc(dave, 'select public.achievement_metrics($1) as m', [dave]);
  assert.equal(m.stars_earned, s.stars_earned);
});

test('juntar estrellas desbloquea los logros de estrellas', async () => {
  // 10 lecciones doradas = 30 estrellas.
  const erin = await starUser('erin@test.dev', Array(10).fill(1));
  // Como en submit_learning_session (definer): el cliente no puede llamarla directo.
  const {
    rows: [{ ids }],
  } = await db.query('select public.evaluate_achievements($1) as ids', [erin]);
  assert.ok(ids.includes('stars_30'));
  assert.ok(!ids.includes('stars_120'));
  const mine = await rpc(erin, `select * from public.get_my_achievements() where id = 'stars_120'`);
  assert.equal(mine[0].progress, 30);
});

test('el perfil público y la clasificación muestran estrellas sólo de perfiles públicos', async () => {
  const frank = await starUser('frank@test.dev', [1, 0.8]);
  const [{ p }] = await rpc(bob, 'select public.get_public_profile($1) as p', [frank]);
  assert.equal(p.learning.stars_earned, 5);
  assert.equal(p.learning.golden_lessons, 1);

  // carol quedó privada en un test anterior; bob se ve a sí mismo aunque fuera privado.
  await db.query(
    `update public.user_settings set profile_visibility = 'private' where user_id = $1`,
    [bob],
  );
  const rows = await rpc(
    bob,
    'select * from public.get_public_stars($1::uuid[]) order by stars_earned desc',
    [[frank, carol, bob]],
  );
  assert.deepEqual(
    rows.map((r) => [r.user_id, r.stars_earned]),
    [
      [frank, 5],
      [bob, 0],
    ],
  );

  await as(db, 'anon', null, async () => {
    await assert.rejects(
      db.query('select * from public.get_public_stars($1::uuid[])', [[frank]]),
      /permission denied/,
    );
  });
});
