// Migración pendiente 20261228120000_bot_battles_rated_after_calibration: start_bot_battle_v2 respeta
// p_rated también después del cupo de calibración. Ensayo local (PGlite): no toca Supabase.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';
import { BOT_CALIBRATION } from '../../shared/bots.ts';

const ROOT = new URL('..', import.meta.url);
const MIGRATION = readFileSync(
  new URL('pending/20261228120000_bot_battles_rated_after_calibration.sql', ROOT),
  'utf8',
);
const ROLLBACK = readFileSync(
  new URL('rollback/20261228120000_bot_battles_rated_after_calibration.down.sql', ROOT),
  'utf8',
);
/** md5(pg_get_functiondef) de start_bot_battle_v2 en producción, leído el 2026-11-25. */
const PROD_MD5 = '035746742e854e69d72ddf9fd29b4abf';
const FN = `'public.start_bot_battle_v2(uuid,text,uuid,text,text,integer,smallint,boolean)'::regprocedure`;

let db;
before(async () => {
  db = await createDb();
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const server = (sql, params = []) =>
  as(db, 'service_role', null, async () => (await db.query(sql, params)).rows);
const client = (userId, sql) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql)).rows[0]);
const fnMd5 = async () => (await one(`select md5(pg_get_functiondef(${FN})) h`)).h;
const fnDef = async () => (await one(`select pg_get_functiondef(${FN}) d`)).d;

async function player(email) {
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now(), target_language = 'en'
     where id = $1`,
    [id, email.split('@')[0]],
  );
  await db.query(
    `insert into public.player_ratings (user_id, language_code) values ($1, 'en') on conflict do nothing`,
    [id],
  );
  return id;
}

async function startBot(userId, rated, id = randomUUID()) {
  const [{ r }] = await server(
    `select public.start_bot_battle_v2($1, 'en', $2, 'Fede Martínez', 'crown', 320, 3::smallint, $3) as r`,
    [id, userId, rated],
  );
  const { is_ranked } = await one('select is_ranked from public.battles where id = $1', [id]);
  return { id, ...r, is_ranked };
}

test('la versión local de la función es la de producción, y la migración cambia sólo el tope', async () => {
  const before = await fnDef();
  // Byte a byte la de producción (mismo md5 de pg_get_functiondef).
  assert.equal(await fnMd5(), PROD_MD5);
  // La migración cambia una sola línea (más su comentario).
  await db.exec(`begin; ${MIGRATION}`);
  const after = await fnDef();
  await db.exec('rollback');
  const removed = before.split('\n').filter((l) => !after.split('\n').includes(l));
  const added = after.split('\n').filter((l) => !before.split('\n').includes(l));
  assert.deepEqual(removed, ['  rated := coalesce(p_rated, false) and used < cap;']);
  assert.equal(added.filter((l) => !l.trimStart().startsWith('--')).length, 1);
  assert.ok(added.includes('  rated := coalesce(p_rated, false);'));
  assert.equal(await fnDef(), before, 'dentro de una transacción revertida no cambia nada');
});

test('antes de la migración: después del cupo, la base no da ELO aunque se pida', async () => {
  const u = await player('antes@bot.dev');
  for (let i = 0; i < BOT_CALIBRATION.ratedGames; i++) {
    assert.equal((await startBot(u, true)).is_ranked, true);
  }
  const fourth = await startBot(u, true);
  assert.equal(fourth.rated, false);
  assert.equal(fourth.is_ranked, false);
});

test('después de la migración: respeta p_rated (con ELO después del cupo, sin ELO si no se pide)', async () => {
  await db.exec(MIGRATION);
  assert.match(await fnDef(), /rated := coalesce\(p_rated, false\);/);
  assert.doesNotMatch(await fnDef(), /used < cap/);

  const u = await player('despues@bot.dev');
  for (let i = 1; i <= BOT_CALIBRATION.ratedGames + 3; i++) {
    const b = await startBot(u, true);
    assert.equal(b.rated, true, `partida ${i}`);
    assert.equal(b.is_ranked, true, `partida ${i}`);
    assert.equal(b.calibration_used, i);
    assert.equal(b.calibration_limit, BOT_CALIBRATION.ratedGames);
  }
  const unrated = await startBot(u, false);
  assert.equal(unrated.rated, false);
  assert.equal(unrated.is_ranked, false);

  // Idempotente por id: repetir el inicio devuelve lo guardado.
  const again = await startBot(u, true, unrated.id);
  assert.equal(again.rated, false);

  // Las validaciones siguen iguales.
  await assert.rejects(
    server(
      `select public.start_bot_battle_v2(gen_random_uuid(), 'en', $1, 'X', 'panda-red', 320, 3::smallint, true)`,
      [u],
    ),
    /invalid_players/,
  );
});

test('después de la migración: sólo el servidor puede llamarla (la app no crea partidas con ELO)', async () => {
  const u = await player('permisos@bot.dev');
  await assert.rejects(
    client(
      u,
      `select public.start_bot_battle_v2(gen_random_uuid(), 'en', '${u}', 'X', 'crown', 300, 3::smallint, true)`,
    ),
    /permission denied/,
  );
  const grants = await one(
    `select has_function_privilege('anon', ${FN}, 'EXECUTE') anon,
            has_function_privilege('authenticated', ${FN}, 'EXECUTE') auth,
            has_function_privilege('service_role', ${FN}, 'EXECUTE') svc`,
  );
  assert.deepEqual(grants, { anon: false, auth: false, svc: true });
});

test('el rollback vuelve exactamente a la versión anterior (tope del cupo)', async () => {
  await db.exec(ROLLBACK);
  assert.equal(await fnMd5(), PROD_MD5, 'idéntica a la de producción');
  const u = await player('rollback@bot.dev');
  for (let i = 0; i < BOT_CALIBRATION.ratedGames; i++) await startBot(u, true);
  assert.equal((await startBot(u, true)).is_ranked, false);
});
