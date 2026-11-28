// Idiomas de interfaz pt-BR e it (20270103120000_interface_languages_pt_it.sql): CHECK, RPC,
// compatibilidad con los valores existentes, aviso de desafío y rollback.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { createDb, createUser, as } from './harness.mjs';

const rollbackSql = readFileSync(
  new URL('../rollback/20270103120000_interface_languages_pt_it.down.sql', import.meta.url),
  'utf8',
);

let db;
before(async () => {
  db = await createDb();
});

let n = 0;
async function player(prefix = 'ui') {
  n += 1;
  const email = `${prefix}${n}@test.dev`;
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set username = $2, onboarding_completed_at = now() where id = $1`,
    [id, `${prefix}_${n}`],
  );
  return id;
}
const rpc = (u, sql, params = []) =>
  as(db, 'authenticated', u, async () => (await db.query(sql, params)).rows);
const service = async (sql, params = []) =>
  as(db, 'service_role', null, async () => (await db.query(sql, params)).rows);
const uiOf = async (u) =>
  (await db.query('select interface_language from public.profiles where id = $1', [u])).rows[0]
    .interface_language;

test('set_interface_language acepta los cuatro idiomas y rechaza el resto', async () => {
  const u = await player();
  for (const lang of ['pt-BR', 'it', 'en', 'es']) {
    await rpc(u, 'select public.set_interface_language($1)', [lang]);
    assert.equal(await uiOf(u), lang);
  }
  for (const bad of ['pt', 'de', 'FR', 'PT-BR', '']) {
    await assert.rejects(
      rpc(u, 'select public.set_interface_language($1)', [bad]),
      /interface_language_invalid/,
    );
  }
});

test('el CHECK de la columna acepta pt-BR / it y sigue rechazando otros valores', async () => {
  const u = await player();
  await db.query(`update public.profiles set interface_language = 'it' where id = $1`, [u]);
  assert.equal(await uiOf(u), 'it');
  await assert.rejects(
    db.query(`update public.profiles set interface_language = 'de' where id = $1`, [u]),
    /check/i,
  );
});

test('los perfiles existentes con es / en / null no cambian', async () => {
  const a = await player();
  const b = await player();
  await rpc(a, `select public.set_interface_language('en')`);
  assert.equal(await uiOf(a), 'en');
  assert.equal(await uiOf(b), null);
});

test('complete_onboarding_v2 acepta pt-BR e it', async () => {
  for (const [ui, name] of [
    ['pt-BR', 'v2_ptbr'],
    ['it', 'v2_it'],
  ]) {
    const u = await createUser(db, `${name}@test.dev`);
    await rpc(
      u,
      `select public.complete_onboarding_v2($1, 'bolt', 'en-from-es', 'A1', 10::smallint, $2)`,
      [name, ui],
    );
    assert.equal(await uiOf(u), ui);
  }
  const bad = await createUser(db, 'v2_bad_ui@test.dev');
  await assert.rejects(
    rpc(
      bad,
      `select public.complete_onboarding_v2('v2_bad_ui', 'bolt', 'en-from-es', 'A1', 10::smallint, 'de')`,
    ),
    /interface_language_invalid/,
  );
});

test('el aviso de desafío trae el idioma de interfaz del invitado', async () => {
  const host = await player('host');
  const guest = await player('guest');
  await rpc(host, 'select public.send_friend_request($1)', [guest]);
  await rpc(guest, 'select public.respond_friend_request($1, true)', [host]);
  await rpc(guest, 'select public.register_push_token($1, $2)', [
    'ExponentPushToken[uitest1]',
    'ios',
  ]);
  await rpc(guest, `select public.set_interface_language('it')`);
  const { code } = (await rpc(host, 'select public.invite_friend_to_battle($1) as r', [guest]))[0]
    .r;
  const claim = (
    await service('select public.claim_battle_invite_push($1, $2) as r', [host, code])
  )[0].r;
  assert.equal(claim.interface_language, 'it');
  assert.deepEqual(claim.tokens, ['ExponentPushToken[uitest1]']);
  assert.ok('language_code' in claim);
});

test('rollback: vuelve a es / en, quien tenía pt-BR o it queda en null; es idempotente', async () => {
  const pt = await player();
  const en = await player();
  await rpc(pt, `select public.set_interface_language('pt-BR')`);
  await rpc(en, `select public.set_interface_language('en')`);

  await db.exec(rollbackSql);
  await db.exec(rollbackSql);

  assert.equal(await uiOf(pt), null);
  assert.equal(await uiOf(en), 'en');
  await assert.rejects(
    rpc(pt, `select public.set_interface_language('it')`),
    /interface_language_invalid/,
  );
  await rpc(pt, `select public.set_interface_language('es')`);
  assert.equal(await uiOf(pt), 'es');
});
