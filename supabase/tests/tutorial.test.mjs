import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';

let db;

before(async () => {
  db = await createDb();
});

const completedAt = async (u) =>
  (await db.query('select tutorial_completed_at from public.profiles where id = $1', [u])).rows[0]
    .tutorial_completed_at;

test('una cuenta nueva tiene el tutorial pendiente y complete_tutorial lo marca una sola vez', async () => {
  const u = await createUser(db);
  assert.equal(await completedAt(u), null);

  await as(db, 'authenticated', u, () => db.query('select public.complete_tutorial()'));
  const first = await completedAt(u);
  assert.ok(first);

  await as(db, 'authenticated', u, () => db.query('select public.complete_tutorial()'));
  assert.deepEqual(await completedAt(u), first);
});

test('el usuario no puede escribir la columna directamente', async () => {
  const u = await createUser(db);
  await assert.rejects(
    as(db, 'authenticated', u, () =>
      db.query('update public.profiles set tutorial_completed_at = now() where id = $1', [u]),
    ),
  );
});

const tutorial = (u) =>
  as(
    db,
    'authenticated',
    u,
    async () => (await db.query('select public.finish_tutorial() as r')).rows[0].r,
  );
const syncPolys = (u) =>
  as(
    db,
    'authenticated',
    u,
    async () => (await db.query(`select public.sync_polys('UTC') as r`)).rows[0].r,
  );

test('las 100 Polys de bienvenida llegan al cerrar el tutorial, no al entrar', async () => {
  const u = await createUser(db);
  const first = await syncPolys(u);
  assert.deepEqual(first.granted, []);
  assert.equal(first.balance, 0);

  const done = await tutorial(u);
  assert.deepEqual(done.granted, [{ reason: 'welcome', ref: 'welcome', amount: 100 }]);
  assert.equal(done.balance, 100);
  assert.ok(await completedAt(u));

  // Cerrarlo otra vez (o sincronizar) no paga de nuevo.
  const again = await tutorial(u);
  assert.deepEqual(again.granted, []);
  assert.equal(again.balance, 100);
  assert.deepEqual((await syncPolys(u)).granted, []);
});

test('apps publicadas: complete_tutorial() también da el regalo al cerrar el tutorial', async () => {
  const u = await createUser(db);
  await syncPolys(u);
  await as(db, 'authenticated', u, () => db.query('select public.complete_tutorial()'));
  assert.equal((await syncPolys(u)).balance, 100);
  assert.ok(await completedAt(u));
});
