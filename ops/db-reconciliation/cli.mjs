// Generador de las consultas de solo lectura (lib.mjs) para usarlas con la CLI de Supabase.
//
//   node ops/db-reconciliation/cli.mjs tables-sql                       > tables.sql
//   node ops/db-reconciliation/cli.mjs snapshot-sql <tables.json>       > snapshot.sql
//   node ops/db-reconciliation/cli.mjs postcheck-sql <snap.json> <rehearsal.json> > postcheck.sql
//
// Los .json son la salida de `supabase db query --read-only --output-format json`: se usa rows[0].
// rehearsal.json es la salida de rehearse-t1.mjs (sus `expected`: deltas por tabla, versiones nuevas
// y la restricción de nivel resultante).
import { readFileSync } from 'node:fs';

import { TABLES_SQL, postcheckSql, snapshotSql } from './lib.mjs';

const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const row0 = (f) => {
  const r = read(f);
  return (r.rows ?? r)[0];
};
const asJson = (v) => (typeof v === 'string' ? JSON.parse(v) : v);

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'tables-sql') process.stdout.write(`${TABLES_SQL};\n`);
else if (cmd === 'snapshot-sql') process.stdout.write(snapshotSql(asJson(row0(a).tables)));
else if (cmd === 'postcheck-sql')
  process.stdout.write(postcheckSql(asJson(row0(a).snap), read(b).expected));
else
  throw new Error(
    'uso: cli.mjs tables-sql | snapshot-sql <tables.json> | postcheck-sql <snap.json> <rehearsal.json>',
  );
