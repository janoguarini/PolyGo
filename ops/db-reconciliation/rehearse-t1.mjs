// Ensayo LOCAL (PGlite desechable, nunca producción) de la tanda 1 (I-W1 a I-W5).
//
//   node --import tsx ops/db-reconciliation/rehearse-t1.mjs <dir de PolyGo/supabase> <salida.json>
//
// 1. Base con las 164 migraciones del cliente y un historial simulado con sus versiones.
// 2. Instantánea previa (lib.mjs).
// 3. Aplica cada archivo con el MISMO envoltorio que se usaría en producción (apply-t1.mjs).
// 4. Instantánea posterior: mide los deltas por tabla y comprueba que la huella del esquema sólo
//    cambie en la restricción de nivel, que S1 siga y que no se publique nada.
// 5. Genera el POSTCHECK con (previa + deltas) y lo ejecuta: GO después, NO-GO antes (prueba negativa).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { createDb } from '../../supabase/tests/harness.mjs';
import { TABLES_SQL, snapshotSql, postcheckSql } from './lib.mjs';
import { T1, wrap } from './apply-t1.mjs';

const [root, out] = process.argv.slice(2);
if (!root || !out) throw new Error('uso: rehearse-t1.mjs <PolyGo/supabase> <salida.json>');

const one = async (db, sql) => (await db.query(sql)).rows[0];

const db = await createDb();
// Historial simulado: el arnés no crea supabase_migrations.
const clientVersions = readdirSync(new URL('../../supabase/migrations/', import.meta.url))
  .filter((f) => f.endsWith('.sql'))
  .map((f) => [f.slice(0, 14), f.slice(15, -4)]);
await db.exec(`create schema if not exists supabase_migrations;
create table if not exists supabase_migrations.schema_migrations (version text primary key, statements text[], name text, created_by text, idempotency_key text, rollback text[]);`);
for (const [v, n] of clientVersions)
  await db.query(
    'insert into supabase_migrations.schema_migrations (version, name) values ($1, $2)',
    [v, n],
  );

const tables = (await one(db, TABLES_SQL)).tables;
const snap = async () => (await one(db, snapshotSql(tables))).snap;

const pre = await snap();
const postcheckBefore = null;
for (const step of T1) {
  const sql = wrap(readFileSync(join(root, 'migrations', step.file), 'utf8'), step);
  await db.exec(sql);
}
const post = await snap();

const tableDeltas = {};
for (const t of Object.keys(post.tables)) {
  const d = post.tables[t] - (pre.tables[t] ?? 0);
  if (d !== 0) tableDeltas[t] = d;
}
const fpChanged = Object.keys(pre.fp).filter((k) => pre.fp[k] !== post.fp[k]);
const expected = {
  tableDeltas,
  newVersions: T1.map((s) => [s.version, s.name]),
  levelCheck: post.level_check,
};

// El POSTCHECK generado desde la previa tiene que dar GO sobre el estado posterior…
const pc = postcheckSql(pre, expected);
const verdict = (await db.query(pc)).rows.find((r) => r.id === 'VEREDICTO');
const failed = (await db.query(pc)).rows
  .filter((r) => !r.ok && r.id !== 'VEREDICTO')
  .map((r) => r.id);

// …y NO-GO sobre una base sin aplicar (prueba negativa con una segunda base limpia).
const db2 = await createDb();
await db2.exec(`create schema if not exists supabase_migrations;
create table if not exists supabase_migrations.schema_migrations (version text primary key, statements text[], name text, created_by text, idempotency_key text, rollback text[]);`);
for (const [v, n] of clientVersions)
  await db2.query(
    'insert into supabase_migrations.schema_migrations (version, name) values ($1, $2)',
    [v, n],
  );
const negative = (await db2.query(pc)).rows.find((r) => r.id === 'VEREDICTO');

// Reaplicar un archivo ya registrado tiene que fallar sin cambiar nada (guardia del envoltorio).
let reapply = 'sin error (MAL)';
try {
  await db.exec(wrap(readFileSync(join(root, 'migrations', T1[0].file), 'utf8'), T1[0]));
} catch (e) {
  reapply = `aborta: ${String(e.message).slice(0, 120)}`;
  // En producción la sesión de la CLI termina y la transacción se revierte sola; acá, a mano.
  await db.exec('rollback');
}
const afterReapply = await snap();
const reapplyNoChange = JSON.stringify(afterReapply.tables) === JSON.stringify(post.tables);

const result = {
  pre: {
    tables: Object.keys(pre.tables).length,
    s1: pre.s1,
    level_check: pre.level_check,
    published: pre.published,
  },
  post: { s1: post.s1, level_check: post.level_check, published: post.published },
  tableDeltas,
  fpChanged,
  publishedUnchanged: JSON.stringify(pre.published) === JSON.stringify(post.published),
  postcheckOnPost: verdict?.obtenido,
  postcheckFailed: failed,
  postcheckOnUnapplied: negative?.obtenido?.slice(0, 160),
  reapply,
  reapplyNoChange,
  expected,
};
writeFileSync(out, JSON.stringify(result, null, 2));
console.log(JSON.stringify({ ...result, expected: undefined }, null, 2));
void postcheckBefore;
