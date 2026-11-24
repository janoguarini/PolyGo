// XP y nivel global (20261222120200_player_xp): espejo de shared/xp.ts, ganancias derivadas de lo
// que registró el servidor, topes diarios, idempotencia, niveles y permisos.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb, createUser, as } from './harness.mjs';
import { XP, xpForNextLevel, xpProgress } from '../../shared/xp.ts';

let db;
let lessons;

before(async () => {
  db = await createDb();
  lessons = (await db.query(`select id from public.lessons order by id limit 12`)).rows.map(
    (r) => r.id,
  );
  assert.ok(lessons.length >= 12, 'hacen falta lecciones en la base de prueba');
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];

async function player(email) {
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now() where id = $1`,
    [id, email.split('@')[0].slice(0, 20)],
  );
  return id;
}

const rpc = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows[0]?.r);
const sync = (u) => rpc(u, 'select public.sync_xp() as r');
const totalOf = async (u) =>
  (
    await one(`select coalesce(sum(amount), 0)::int n from public.xp_events where user_id = $1`, [
      u,
    ])
  ).n;

/** Sesión registrada por el servidor (lección o repaso). `day` = fecha local (YYYY-MM-DD). */
async function session(u, { kind = 'lesson', lesson = null, at = new Date(), day } = {}) {
  const id = randomUUID();
  const localDay = day ?? at.toISOString().slice(0, 10);
  await db.query(
    `insert into public.learning_sessions (id, user_id, kind, lesson_id, started_at, completed_at,
       duration_seconds, total_answers, first_try_total, first_try_correct, local_date)
     values ($1, $2, $3, $4, $5::timestamptz - interval '2 minutes', $5, 120, 8, 8, 7, $6)`,
    [id, u, kind, kind === 'lesson' ? lesson : null, at.toISOString(), localDay],
  );
  return id;
}

/** Partida guardada por el servidor de partidas. */
async function battle(
  u,
  { result, forfeited = false, ranked = true, status = 'completed', at = new Date() },
) {
  const id = randomUUID();
  await db.query(
    `insert into public.battles (id, language_code, is_ranked, status, started_at, ended_at)
     values ($1, 'en', $2, $3, $4::timestamptz - interval '3 minutes', $4)`,
    [id, ranked, status, at.toISOString()],
  );
  await db.query(
    `insert into public.battle_players (battle_id, slot, user_id, result, forfeited)
     values ($1, 1, $2, $3, $4)`,
    [id, u, result, forfeited],
  );
  return id;
}

const sources = async (u) =>
  (
    await db.query(
      `select source, count(*)::int n, sum(amount)::int xp from public.xp_events
       where user_id = $1 group by source order by source`,
      [u],
    )
  ).rows.reduce((acc, r) => ({ ...acc, [r.source]: { n: r.n, xp: r.xp } }), {});

test('xp_config y la curva replican shared/xp.ts', async () => {
  const cfg = (await one('select public.xp_config() c')).c;
  assert.deepEqual(cfg, {
    amounts: XP.amounts,
    dailyCaps: XP.dailyCaps,
    lookbackDays: XP.lookbackDays,
    curve: XP.curve,
    maxLevel: XP.maxLevel,
    levelRewards: [...XP.levelRewards],
  });
  const { rows } = await db.query(
    `select g as level, public.xp_level_need(g) as need from generate_series(1, 499) g`,
  );
  for (const r of rows) assert.equal(r.need, xpForNextLevel(r.level), `nivel ${r.level}`);
  for (const total of [0, 49, 50, 109, 110, 905, 5455, 23380, 104380, 250000]) {
    const p = (await one('select public.xp_progress($1) p', [total])).p;
    const js = xpProgress(total);
    assert.deepEqual(p, {
      total: js.total,
      level: js.level,
      into: js.into,
      need: js.need,
      remaining: js.remaining,
    });
  }
});

test('lección: la primera vez da 20, repetirla da 5 y la misma lección no vuelve a dar 20', async () => {
  const u = await player('xp_lessons@test.dev');
  assert.equal((await sync(u)).initial, true);
  await session(u, { lesson: lessons[0] });
  await session(u, { lesson: lessons[0] });
  await session(u, { lesson: lessons[1] });
  const r = await sync(u);
  assert.equal(r.initial, false);
  assert.equal(r.granted_total, 20 + 5 + 20);
  assert.deepEqual(r.granted.map((g) => g.source).sort(), [
    'lesson_first',
    'lesson_first',
    'lesson_repeat',
  ]);
  assert.equal(r.total, 45);
  // Sincronizar de nuevo no da nada.
  const again = await sync(u);
  assert.equal(again.granted_total, 0);
  assert.equal(again.total, 45);
});

test('topes diarios: repetir lecciones y repasos no da XP infinita', async () => {
  const u = await player('xp_caps@test.dev');
  await sync(u);
  await session(u, { lesson: lessons[2] });
  for (let i = 0; i < 15; i++) await session(u, { lesson: lessons[2] });
  for (let i = 0; i < 8; i++) await session(u, { kind: 'review' });
  await sync(u);
  const s = await sources(u);
  assert.deepEqual(s.lesson_first, { n: 1, xp: 20 });
  assert.deepEqual(s.lesson_repeat, {
    n: XP.dailyCaps.lesson_repeat,
    xp: XP.dailyCaps.lesson_repeat * XP.amounts.lesson_repeat,
  });
  assert.deepEqual(s.review, {
    n: XP.dailyCaps.review,
    xp: XP.dailyCaps.review * XP.amounts.review,
  });
  // Otro día local vuelve a habilitar el tope.
  const tomorrow = new Date(Date.now() + 1000);
  await session(u, { kind: 'review', at: tomorrow, day: '2099-01-01' });
  assert.equal((await sync(u)).granted_total, XP.amounts.review);
});

test('ranked: ganar 30, perder 10, abandonar 0, amistosas 0 y tope diario compartido', async () => {
  const u = await player('xp_ranked@test.dev');
  await sync(u);
  await battle(u, { result: 'win' });
  await battle(u, { result: 'loss' });
  await battle(u, { result: 'draw' });
  await battle(u, { result: 'loss', forfeited: true, status: 'forfeited' });
  await battle(u, { result: 'win', status: 'forfeited' }); // el rival abandonó
  await battle(u, { result: 'win', ranked: false });
  await battle(u, { result: null, status: 'cancelled' });
  const r = await sync(u);
  assert.equal(r.granted_total, 30 + 10 + 10 + 30);
  for (let i = 0; i < 12; i++) await battle(u, { result: 'win' });
  await sync(u);
  const s = await sources(u);
  assert.equal((s.ranked_win?.n ?? 0) + (s.ranked_loss?.n ?? 0), XP.dailyCaps.ranked);
});

test('desafío diario: 40 una vez por día', async () => {
  const u = await player('xp_daily@test.dev');
  await sync(u);
  await db.query(
    `insert into public.user_mission_rewards (user_id, mission_date) values ($1, current_date), ($1, current_date - 1)`,
    [u],
  );
  assert.equal((await sync(u)).granted_total, 80);
  assert.equal((await sync(u)).granted_total, 0);
});

test('primera sincronización: acredita la historia sin detallarla y registra los niveles', async () => {
  const u = await player('xp_history@test.dev');
  const past = new Date(Date.now() - 40 * 86_400_000);
  for (let i = 0; i < 10; i++) await session(u, { lesson: lessons[i], at: past });
  for (let i = 0; i < 3; i++) await battle(u, { result: 'win', at: past });
  const r = await sync(u);
  assert.equal(r.initial, true);
  assert.deepEqual(r.granted, []);
  assert.equal(r.granted_total, 10 * 20 + 3 * 30);
  assert.equal(r.total, 290);
  assert.equal(r.level, xpProgress(290).level);
  assert.equal(r.level_before, 1);
  const ups = await db.query(
    `select level from public.player_level_ups where user_id = $1 order by level`,
    [u],
  );
  assert.deepEqual(
    ups.rows.map((x) => x.level),
    Array.from({ length: r.level - 1 }, (_, i) => i + 2),
  );
  const state = await one(
    `select total_xp, level, initialized from public.player_xp where user_id = $1`,
    [u],
  );
  assert.deepEqual(state, { total_xp: 290, level: r.level, initialized: true });
  assert.equal(await totalOf(u), 290);
});

test('subir de nivel: level_before y level reflejan el salto', async () => {
  const u = await player('xp_levelup@test.dev');
  await sync(u);
  await session(u, { lesson: lessons[3] });
  await session(u, { lesson: lessons[4] });
  await session(u, { lesson: lessons[5] });
  const r = await sync(u);
  assert.equal(r.level_before, 1);
  assert.equal(r.level, 2); // 60 XP: el nivel 1 pide 50
  assert.equal(r.into, 10);
  assert.equal(r.need, xpForNextLevel(2));
});

test('lo que llega tarde, más allá del margen, no suma (documentado)', async () => {
  const u = await player('xp_lookback@test.dev');
  await sync(u);
  const old = new Date(Date.now() - (XP.lookbackDays + 2) * 86_400_000);
  await session(u, { lesson: lessons[6], at: old });
  assert.equal((await sync(u)).granted_total, 0);
  const recent = new Date(Date.now() - 2 * 86_400_000);
  await session(u, { lesson: lessons[7], at: recent });
  assert.equal((await sync(u)).granted_total, 20);
});

test('permisos: nadie escribe XP a mano ni lee el de otro', async () => {
  const u = await player('xp_sec_a@test.dev');
  const other = await player('xp_sec_b@test.dev');
  await sync(u);
  await sync(other);
  await session(other, { lesson: lessons[8] });
  await sync(other);
  await as(db, 'authenticated', u, async () => {
    await assert.rejects(
      db.query(
        `insert into public.xp_events (user_id, source, ref, day, amount) values ($1, 'review', 'x', current_date, 999)`,
        [u],
      ),
      /permission denied/,
    );
    await assert.rejects(
      db.query(`update public.player_xp set total_xp = 99999 where user_id = $1`, [u]),
      /permission denied/,
    );
    await assert.rejects(
      db.query(`select public.xp_grant($1, 'review', 'x', current_date, 999, null, null)`, [u]),
      /permission denied/,
    );
    const { rows } = await db.query(`select user_id from public.xp_events`);
    assert.ok(rows.every((r) => r.user_id === u));
    const { rows: states } = await db.query(`select user_id from public.player_xp`);
    assert.deepEqual(
      states.map((r) => r.user_id),
      [u],
    );
  });
  await as(db, 'anon', null, async () => {
    await assert.rejects(db.query('select public.sync_xp()'), /permission denied/);
  });
});

test('borrar la cuenta borra su XP', async () => {
  const u = await player('xp_delete@test.dev');
  await session(u, { lesson: lessons[9] });
  await sync(u);
  await db.query(`delete from auth.users where id = $1`, [u]);
  const left = await one(
    `select (select count(*)::int from public.xp_events where user_id = $1) e,
            (select count(*)::int from public.player_xp where user_id = $1) s`,
    [u],
  );
  assert.deepEqual(left, { e: 0, s: 0 });
});
