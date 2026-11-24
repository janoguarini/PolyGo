/**
 * Tests de scripts/check-migration-order.mjs (node:test, fixtures temporales).
 *   node --test scripts/check-migration-order.node-test.mjs
 * El nombre no termina en .test.mjs a propósito: Jest (raíz) no lo toma y no está en ningún script de
 * package.json ni en CI (no autorizado todavía).
 */
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { checkMigrationOrder, dateToVersion, parseApplied, versionToDate } from './check-migration-order.mjs';

const dirs = [];
after(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));

function fixture({ migrations, rollback = [], pending = [] }) {
  const root = mkdtempSync(join(tmpdir(), 'mig-order-'));
  dirs.push(root);
  for (const sub of ['migrations', 'rollback', 'pending']) mkdirSync(join(root, 'supabase', sub), { recursive: true });
  for (const f of migrations) writeFileSync(join(root, 'supabase', 'migrations', f), '-- x\n');
  for (const f of rollback) writeFileSync(join(root, 'supabase', 'rollback', f), '-- x\n');
  for (const f of pending) writeFileSync(join(root, 'supabase', 'pending', f), '-- x\n');
  return root;
}
const codes = (r) => r.errors.map((e) => e.code).sort();
const today = new Date('2026-11-17T00:00:00Z');

test('árbol correcto: sin errores', () => {
  const root = fixture({ migrations: ['20261101120000_a.sql', '20261102120000_b.sql', '20261103120000_c.sql'] });
  const r = checkMigrationOrder({ root, tracked: new Set(['20261101120000_a.sql', '20261102120000_b.sql']), today });
  assert.deepEqual(r.errors, []);
  assert.equal(r.stats.maxTracked, '20261102120000');
});

test('E1 nombre inválido y fecha imposible', () => {
  const root = fixture({ migrations: ['20261101120000_Bad-Name.sql', '2026110112000_short.sql', '20261399120000_mes.sql'] });
  const r = checkMigrationOrder({ root, tracked: new Set(), today });
  assert.deepEqual(codes(r), ['E1', 'E1', 'E1']);
});

test('E2 versión duplicada', () => {
  const root = fixture({ migrations: ['20261101120000_a.sql', '20261101120000_b.sql'] });
  const r = checkMigrationOrder({ root, tracked: new Set(), today });
  assert.deepEqual(codes(r), ['E2']);
});

test('E3 migración nueva intercalada antes de la máxima versionada', () => {
  const root = fixture({ migrations: ['20261101120000_a.sql', '20261105120000_nueva.sql', '20261110120000_b.sql'] });
  const r = checkMigrationOrder({ root, tracked: new Set(['20261101120000_a.sql', '20261110120000_b.sql']), today });
  assert.deepEqual(codes(r), ['E3']);
  assert.match(r.errors[0].file, /nueva/);
});

test('E4 falta el .down.sql de una migración de Ranked ≥ 20261209120000 (las anteriores o no-ranked no lo exigen)', () => {
  const root = fixture({
    migrations: ['20261101120000_ranked_old.sql', '20261209120000_ranked_legacy_guard.sql', '20261210120000_ranked_glicko.sql', '20261211120000_avatar.sql'],
    rollback: ['20261209120000_ranked_legacy_guard.down.sql'],
  });
  const r = checkMigrationOrder({ root, tracked: new Set(), today });
  assert.deepEqual(codes(r), ['E4']);
  assert.match(r.errors[0].message, /20261210120000_ranked_glicko\.down\.sql/);
});

test('E5 hueco contra lo aplicado; W2 aplicada desconocida; W1 futuras; W3 pending intercalada', () => {
  const root = fixture({
    migrations: ['20261101120000_a.sql', '20261102120000_b.sql', '20261103120000_c.sql', '20261212120000_futura.sql'],
    pending: ['20261102130000_publish.sql', '20261213120000_ok.sql'],
  });
  const applied = ' 20261101120000 | 20261101120000 | 2026-11-01\n 20261103120000 | 20261103120000\n 20261104999999 | remota\nbasura\n';
  const r = checkMigrationOrder({ root, tracked: new Set(), today, appliedText: applied });
  assert.deepEqual(codes(r), ['E5']);
  assert.match(r.errors[0].file, /20261102120000_b/);
  const w = r.warnings.map((x) => x.code).sort();
  assert.deepEqual(w, ['W1', 'W2', 'W3']);
  assert.match(r.warnings.find((x) => x.code === 'W3').file, /20261102130000_publish/);
});

test('--next: nunca menor que la máxima local (aunque el reloj esté antes)', () => {
  const root = fixture({ migrations: ['20261212190000_x.sql'] });
  const r = checkMigrationOrder({ root, tracked: new Set(), today, now: new Date('2026-11-17T10:00:00Z') });
  assert.equal(r.next, '20261212190001');
  const r2 = checkMigrationOrder({ root, tracked: new Set(), today, now: new Date('2027-01-01T00:00:00Z') });
  assert.equal(r2.next, '20270101000000');
});

test('utilidades: fechas y parseo', () => {
  assert.equal(dateToVersion(versionToDate('20261231235959')), '20261231235959');
  assert.equal(versionToDate('20260230120000'), null);
  assert.deepEqual(parseApplied('20261101120000\n| 20261102120000 |\n20261101120000\nx'), ['20261101120000', '20261102120000']);
});
