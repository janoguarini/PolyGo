import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';

let db;

before(async () => {
  db = await createDb();
});

/** Jugador con onboarding completo; wins > 0 = posicionado. */
async function player(email, rating, wins = 1) {
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now() where id = $1`,
    [id, email.split('@')[0]],
  );
  await db.query(
    `update public.player_ratings
       set rating = $2, peak_rating = greatest(peak_rating, $2),
           wins = $3, games_played = $3 + losses + draws
     where user_id = $1`,
    [id, rating, wins],
  );
  return id;
}

const rpc = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows);

test('clasificación: ordena por rating, excluye sin posicionar y da el puesto propio', async () => {
  const a = await player('lb_a@test.dev', 900);
  const b = await player('lb_b@test.dev', 1200);
  const c = await player('lb_c@test.dev', 1500, 0);

  const all = await rpc(a, 'select * from public.get_leaderboard(null, 100)');
  const ids = all.map((r) => r.user_id);
  assert.ok(ids.indexOf(b) < ids.indexOf(a));
  assert.ok(!ids.includes(c), 'sin posicionar no aparece');
  assert.deepEqual(
    all.map((r) => Number(r.position)),
    all.map((_, i) => i + 1),
  );

  const [mine] = await rpc(a, 'select * from public.get_my_leaderboard_position(null)');
  assert.equal(Number(mine.position), ids.indexOf(a) + 1);
  assert.equal(Number(mine.total), all.length);

  const [none] = await rpc(c, `select * from public.get_my_leaderboard_position('en')`);
  assert.equal(none.position, null);

  const byLang = await rpc(a, `select * from public.get_leaderboard('en', 100)`);
  assert.ok(byLang.every((r) => r.language_code === 'en'));
});

test('clasificación global: suma los ratings de los idiomas posicionados', async () => {
  const d = await player('lb_d@test.dev', 800);
  const setRating = (lang, rating, wins) =>
    db.query(
      `insert into public.player_ratings (user_id, language_code, rating, peak_rating, games_played, wins)
       values ($1, $2, $3, $3, $4, $4)
       on conflict (user_id, language_code) do update
         set rating = $3, peak_rating = $3, games_played = $4, wins = $4, losses = 0, draws = 0`,
      [d, lang, rating, wins],
    );
  await setRating('pt', 1700, 2);
  // Sin posicionar en chino: no suma.
  await setRating('zh', 300, 0);

  const all = await rpc(d, 'select * from public.get_leaderboard(null, 100)');
  const mine = all.filter((r) => r.user_id === d);
  assert.equal(mine.length, 1);
  assert.equal(mine[0].rating, 2500);
  assert.equal(mine[0].wins, 3);
  assert.equal(mine[0].language_code, null);

  const [entry] = await rpc(d, 'select * from public.get_my_leaderboard_entry(null)');
  assert.equal(entry.rating, 2500);
  assert.equal(Number(entry.position), all.findIndex((r) => r.user_id === d) + 1);
  assert.equal(Number(entry.total), all.length);

  const [pt] = await rpc(d, `select * from public.get_my_leaderboard_entry('pt')`);
  assert.equal(pt.rating, 1700);
  const [zh] = await rpc(d, `select * from public.get_my_leaderboard_entry('zh')`);
  assert.equal(zh.position, null);
  assert.equal(zh.rating, null);

  const byLang = await rpc(d, `select * from public.get_leaderboard('pt', 100)`);
  assert.ok(byLang.every((r) => r.language_code === 'pt'));
  assert.equal(byLang.find((r) => r.user_id === d).rating, 1700);
});

test('clasificación: sólo usuarios con sesión', async () => {
  await assert.rejects(
    as(db, 'anon', null, () => db.query('select * from public.get_leaderboard(null, 10)')),
  );
});
