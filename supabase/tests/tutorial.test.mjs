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
