// Envoltorios de aplicación de la tanda 1 (I-W1 a I-W5). NO EJECUTA NADA: sólo escribe archivos.
//
//   node ops/db-reconciliation/apply-t1.mjs <dir de PolyGo/supabase> <carpeta de salida>
//
// Cada envoltorio es una única transacción:
//   1. lock_timeout y statement_timeout locales;
//   2. guardias: la versión no está registrada, las versiones de las que depende sí, y el Learning
//      Machine está en S1 (si algo no se cumple, aborta antes de tocar nada);
//   3. el archivo de la migración, byte a byte;
//   4. la fila de historial con la versión LOCAL (convención de 209/213: created_by = 'claude-code via cli db query');
//   5. commit.
// Se aplicaría, con autorización, con:
//   npx supabase db query --remote=wtymosvsymzoosxscnxi -f <envoltorio>
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const T1 = [
  {
    id: 'I-W1',
    file: '20261113120300_planned_lessons_en_a1_u13_u14.sql',
    sha256: '5d240802266e72c63c3387005be9b0393223597032bf4c288e2fd443fba3e2cf',
    requires: ['20261113120200'],
  },
  {
    id: 'I-W2',
    file: '20261119120000_a1_en_closure.sql',
    sha256: '2d37a8dec8da25fcde498ca3382a7862d59eb9f956114167a621581e00931596',
    requires: ['20261113120300'],
  },
  {
    id: 'I-W3',
    file: '20261120120000_a2_en_completion.sql',
    sha256: '86dc9a9fa4d9b1ffb84474da57db504aa471aa6abca6809f68b62897f673b7a3',
    requires: ['20261113120000'],
  },
  {
    id: 'I-W4',
    file: '20261122120000_b1_en.sql',
    sha256: 'b566e927bf796d0838435290167412d5ffb35db2c22236e426395778df72645e',
    requires: ['20261120120000'],
  },
  {
    id: 'I-W5',
    file: '20261124120000_b2_en.sql',
    sha256: 'f06ef4b44820e1f4229f5dd623e66385594bb68b99ae0b431fec85b43985388f',
    requires: ['20261120120000', '20261122120000'],
  },
].map((s) => ({ ...s, version: s.file.slice(0, 14), name: s.file.slice(15, -4) }));

const S1_GUARD = `do $s1_guard$
begin
  if (select md5(p.prosrc) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = 'srs_apply_me_hint') is distinct from '8581ce6e7e0ba2939aa26a071d9e781b'
     or (select md5(p.prosrc) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = 'mastery_process_queue_safe') is distinct from 'a397e5236498af73cd92de0933542344'
     or (select count(*) from supabase_migrations.schema_migrations where version = '20261118120000') <> 1 then
    raise exception 'apply_guard: el Learning Machine no está en S1; no se aplica nada';
  end if;
end
$s1_guard$;`;

export function wrap(text, step) {
  const sha = createHash('sha256').update(text).digest('hex');
  if (sha !== step.sha256) throw new Error(`${step.file}: SHA-256 ${sha} ≠ ${step.sha256}`);
  const requires = step.requires.map((v) => `'${v}'`).join(', ');
  return `-- ${step.id}: aplicación de ${step.file} (SHA-256 ${step.sha256}).
-- Generado por ops/db-reconciliation/apply-t1.mjs. Una sola transacción: si algo falla, no queda nada.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '600s';

do $apply_guard$
begin
  if exists (select 1 from supabase_migrations.schema_migrations where version = '${step.version}') then
    raise exception 'apply_guard: ${step.version} ya está registrada; no se aplica nada';
  end if;
  if (select count(*) from supabase_migrations.schema_migrations where version in (${requires})) <> ${step.requires.length} then
    raise exception 'apply_guard: faltan dependencias de ${step.version} (${step.requires.join(', ')})';
  end if;
end
$apply_guard$;
${S1_GUARD}

-- ===== migración ${step.file}, sin cambios =====
${text}
-- ===== fin de la migración =====

insert into supabase_migrations.schema_migrations (version, name, created_by)
values ('${step.version}', '${step.name}', 'claude-code via cli db query');

commit;
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [root, outDir] = process.argv.slice(2);
  if (!root || !outDir) throw new Error('uso: apply-t1.mjs <PolyGo/supabase> <carpeta de salida>');
  mkdirSync(outDir, { recursive: true });
  for (const step of T1) {
    const sql = wrap(readFileSync(join(root, 'migrations', step.file), 'utf8'), step);
    const name = `${step.id}_${step.version}_${step.name}.apply.sql`;
    writeFileSync(join(outDir, name), sql);
    console.log(
      `${name}  sha256 ${createHash('sha256').update(sql).digest('hex')}  ${Buffer.byteLength(sql)} bytes`,
    );
  }
}
