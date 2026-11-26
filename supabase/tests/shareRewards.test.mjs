import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';
import { SHARE_REWARD_POLYS } from '../../shared/share.ts';
import { TIERS } from '../../shared/ranking.ts';
import { PLANNED_UNITS_PER_LEVEL } from '../../shared/languages.ts';

let db;

before(async () => {
  db = await createDb();
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const claim = (u, kind, ref) =>
  as(db, 'authenticated', u, async () =>
    (await db.query('select public.claim_share_reward($1, $2) as r', [kind, ref])).rows[0].r,
  );
const rejects = (promise, code) =>
  assert.rejects(promise, (err) => {
    assert.match(String(err.message), new RegExp(code));
    return true;
  });

async function ranked(u, ratingAfter) {
  const { id } = await one(
    `insert into public.battles (language_code, mode, is_ranked, status, protocol_version, started_at, ended_at)
     values ('en', 'word_rush', true, 'completed', 1, now(), now()) returning id`,
  );
  await db.query(
    `insert into public.battle_players (battle_id, slot, user_id, rating_before, rating_after, result)
     values ($1, 1, $2, 100, $3, 'win')`,
    [id, u, ratingAfter],
  );
  await db.query(
    `insert into public.rating_history (user_id, language_code, season_id, battle_id, reason, rating_before, rating_after)
     values ($1, 'en', (select id from public.seasons where status = 'active'), $2, 'battle', 100, $3)`,
    [u, id, ratingAfter],
  );
}

test('el monto y los umbrales replican shared/', async () => {
  assert.equal((await one('select public.share_reward_polys() as n')).n, SHARE_REWARD_POLYS);
  assert.equal(PLANNED_UNITS_PER_LEVEL, 12);
  // Los umbrales de la función son los de TIERS (sin Bronce).
  const def = (
    await one(`select pg_get_functiondef('public.claim_share_reward(text,text)'::regprocedure) as d`)
  ).d;
  for (const t of TIERS.filter((t) => t.id !== 'bronze')) {
    assert.ok(def.includes(`('${t.id}', ${t.minRating})`), t.id);
  }
});

test('rango: paga 20 una sola vez si llegaste; no si no llegaste', async () => {
  const u = await createUser(db, 'share_rank@test.dev');
  await rejects(claim(u, 'rank', 'rank:gold'), 'not_achieved');
  await ranked(u, 720);
  const first = await claim(u, 'rank', 'rank:gold');
  assert.deepEqual(first.granted, [{ reason: 'share', ref: 'rank:gold', amount: 20 }]);
  assert.equal(first.balance, 20);
  const again = await claim(u, 'rank', 'rank:gold');
  assert.deepEqual(again.granted, []);
  assert.equal(again.balance, 20);
  // Plata también quedó alcanzada; Platino no; Bronce no se comparte.
  assert.equal((await claim(u, 'rank', 'rank:silver')).balance, 40);
  await rejects(claim(u, 'rank', 'rank:platinum'), 'not_achieved');
  await rejects(claim(u, 'rank', 'rank:bronze'), 'not_achieved');
});

test('racha: sólo hitos y sólo si la mejor racha llega', async () => {
  const u = await createUser(db, 'share_streak@test.dev');
  await db.query(
    `insert into public.user_daily_activity (user_id, activity_date, sessions_completed, answers, correct_answers, seconds_spent)
     select $1, (now() at time zone 'UTC')::date - g, 1, 1, 1, 60 from generate_series(0, 7) g`,
    [u],
  );
  const r = await claim(u, 'streak', 'streak:7');
  assert.deepEqual(r.granted, [{ reason: 'share', ref: 'streak:7', amount: 20 }]);
  await rejects(claim(u, 'streak', 'streak:8'), 'not_achieved'); // no es hito
  await rejects(claim(u, 'streak', 'streak:14'), 'not_achieved'); // no llegó
});

test('nivel: 12 unidades terminadas del idioma y nivel', async () => {
  const u = await createUser(db, 'share_level@test.dev');
  await rejects(claim(u, 'level', 'level:en:A1'), 'not_achieved');
  await db.query(
    `insert into public.user_lesson_progress (user_id, lesson_id, times_completed, best_accuracy,
       last_accuracy, first_completed_at, last_completed_at)
     select $1, l.id, 1, 1, 1, now(), now()
     from public.lessons l join public.curriculum_units cu on cu.id = l.unit_id
     where cu.language_code = 'en' and cu.level = 'A1' and l.is_published and cu.is_published`,
    [u],
  );
  const r = await claim(u, 'level', 'level:en:A1');
  assert.deepEqual(r.granted, [{ reason: 'share', ref: 'level:en:A1', amount: 20 }]);
  await rejects(claim(u, 'level', 'level:fr:A1'), 'not_achieved');
});

test('refs mal formados, tipo desconocido y sin sesión', async () => {
  const u = await createUser(db, 'share_bad@test.dev');
  await rejects(claim(u, 'rank', 'streak:7'), 'invalid_share');
  await rejects(claim(u, 'streak', 'streak:7; drop'), 'invalid_share');
  await rejects(claim(u, 'level', 'level:en'), 'invalid_share');
  await rejects(claim(u, 'gift', 'gift:1'), 'invalid_share');
  await assert.rejects(
    as(db, 'anon', null, () => db.query(`select public.claim_share_reward('rank', 'rank:gold')`)),
  );
});

test('el check de motivos conserva los anteriores y suma share', async () => {
  const { d } = await one(
    `select pg_get_constraintdef(oid) as d from pg_constraint where conname = 'poly_transactions_reason_check'`,
  );
  const allowed = d.match(/\{([a-z_,]+)\}/)[1].split(',');
  for (const r of ['welcome', 'welcome_week', 'referral', 'iap', 'season', 'share']) {
    assert.ok(allowed.includes(r), r);
  }
  assert.equal(allowed.length, 19);
});

test('correr la migración otra vez no rompe nada', async () => {
  const { readFileSync } = await import('node:fs');
  const sql = readFileSync(
    new URL('../migrations/20261231160000_share_rewards.sql', import.meta.url),
    'utf8',
  );
  await db.exec(sql);
  const { d } = await one(
    `select pg_get_constraintdef(oid) as d from pg_constraint where conname = 'poly_transactions_reason_check'`,
  );
  assert.equal(d.match(/\{([a-z_,]+)\}/)[1].split(',').length, 19);
});
