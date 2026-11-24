#!/usr/bin/env node
/**
 * Verificación local del orden de las migraciones (docs/RANKED_STAGE3_MIGRATIONS_REVIEW.md §4).
 *
 * No se conecta a ninguna base ni a la red. Sólo lee el árbol y, si se pide, `git ls-tree HEAD`.
 *
 * Falla (exit 1) si:
 *   E1  un archivo de supabase/migrations no sigue ^\d{14}_[a-z0-9_]+\.sql$;
 *   E2  hay versiones (14 dígitos) duplicadas;
 *   E3  una migración NUEVA (no versionada en git HEAD) tiene versión ≤ la máxima de las versionadas;
 *   E4  falta supabase/rollback/<archivo sin .sql>.down.sql para una migración de Ranked ≥ 20261209120000;
 *   E5  (con --applied) una versión local ≤ la máxima aplicada no figura como aplicada: `db push` la
 *       aplicaría FUERA DE ORDEN (hueco).
 * Avisa (no falla) si:
 *   W1  una versión es posterior a la fecha de hoy (UTC);
 *   W2  (con --applied) una versión aplicada no existe en el árbol local;
 *   W3  un archivo de supabase/pending tiene versión ≤ la máxima de supabase/migrations (al moverlo
 *       quedaría intercalado).
 *
 * Uso:
 *   node scripts/check-migration-order.mjs [--root <dir>] [--applied <archivo>] [--tracked <archivo>]
 *                                          [--today AAAA-MM-DD] [--next] [--json]
 *
 *   --applied <archivo>  Lista de versiones aplicadas que exporta el DUEÑO (p. ej. la columna «Remote»
 *                        de `supabase migration list`, o `select version from
 *                        supabase_migrations.schema_migrations`). Una versión de 14 dígitos al principio
 *                        de cada línea; el resto se ignora. El script nunca la consulta por su cuenta.
 *   --tracked <archivo>  Lista de archivos versionados (uno por línea) en lugar de `git ls-tree HEAD`
 *                        (tests, o fuera de un repositorio git).
 *   --next               Imprime la próxima versión válida: max(ahora UTC, máxima local + 1 s).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const NAME_RE = /^(\d{14})_[a-z0-9_]+\.sql$/;
export const RANKED_ROLLBACK_FROM = '20261209120000';
const RANKED_RE = /ranked/;

/** 14 dígitos AAAAMMDDHHMMSS → Date UTC (null si no es una fecha válida). */
export function versionToDate(v) {
  const m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(v);
  if (!m) return null;
  const [y, mo, d, h, mi, s] = m.slice(1).map(Number);
  const t = Date.UTC(y, mo - 1, d, h, mi, s);
  const dt = new Date(t);
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d || h > 23 || mi > 59 || s > 59) return null;
  return dt;
}

export function dateToVersion(dt) {
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(dt.getUTCFullYear(), 4)}${p(dt.getUTCMonth() + 1)}${p(dt.getUTCDate())}${p(dt.getUTCHours())}${p(dt.getUTCMinutes())}${p(dt.getUTCSeconds())}`;
}

/** Versiones de un archivo exportado por el dueño (una por línea, 14 dígitos al principio). */
export function parseApplied(text) {
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*\|?\s*(\d{14})\b/.exec(line);
    if (m) out.push(m[1]);
  }
  return [...new Set(out)].sort();
}

function gitTracked(root) {
  try {
    const out = execFileSync('git', ['ls-tree', '-r', '--name-only', 'HEAD', '--', 'supabase/migrations'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return new Set(out.split(/\r?\n/).filter(Boolean).map((p) => p.split('/').pop()));
  } catch {
    return null;
  }
}

/**
 * Corre las verificaciones. Devuelve { errors, warnings, stats, next } (no imprime ni sale).
 * opts: { root, appliedText?, tracked?: Set<string> | null, today?: Date, now?: Date }
 */
export function checkMigrationOrder(opts) {
  const root = opts.root;
  const migDir = join(root, 'supabase', 'migrations');
  const rbDir = join(root, 'supabase', 'rollback');
  const pendDir = join(root, 'supabase', 'pending');
  const errors = [];
  const warnings = [];
  const files = readdirSync(migDir).filter((f) => f.endsWith('.sql')).sort();
  const versions = new Map();
  for (const f of files) {
    const m = NAME_RE.exec(f);
    if (!m) {
      errors.push({ code: 'E1', file: f, message: `nombre inválido (se espera ^\\d{14}_[a-z0-9_]+\\.sql$)` });
      continue;
    }
    if (!versionToDate(m[1])) {
      errors.push({ code: 'E1', file: f, message: `versión ${m[1]} no es una fecha válida` });
      continue;
    }
    versions.set(m[1], [...(versions.get(m[1]) ?? []), f]);
  }
  for (const [v, fs] of versions) if (fs.length > 1) errors.push({ code: 'E2', file: fs.join(', '), message: `versión duplicada ${v}` });

  const sorted = [...versions.keys()].sort();
  const tracked = opts.tracked === undefined ? gitTracked(root) : opts.tracked;
  let maxTracked = null;
  if (tracked) {
    for (const v of sorted) if (versions.get(v).some((f) => tracked.has(f))) maxTracked = v;
    for (const v of sorted) {
      for (const f of versions.get(v)) {
        if (!tracked.has(f) && maxTracked !== null && v <= maxTracked) {
          errors.push({ code: 'E3', file: f, message: `migración nueva (sin versionar) con versión ${v} ≤ máxima versionada ${maxTracked}` });
        }
      }
    }
  } else {
    warnings.push({ code: 'W0', file: '', message: 'sin git ni --tracked: E3 no se evaluó' });
  }

  for (const v of sorted) {
    if (v < RANKED_ROLLBACK_FROM) continue;
    for (const f of versions.get(v)) {
      if (!RANKED_RE.test(f)) continue;
      const down = f.replace(/\.sql$/, '.down.sql');
      if (!existsSync(join(rbDir, down))) errors.push({ code: 'E4', file: f, message: `falta supabase/rollback/${down}` });
    }
  }

  const today = opts.today ?? new Date();
  const endOfToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59);
  const future = sorted.filter((v) => versionToDate(v) && versionToDate(v).getTime() > endOfToday);
  if (future.length) warnings.push({ code: 'W1', file: `${future[0]} … ${future[future.length - 1]}`, message: `${future.length} versiones posteriores a hoy (${dateToVersion(today).slice(0, 8)})` });

  let applied = null;
  if (opts.appliedText !== undefined) {
    applied = parseApplied(opts.appliedText);
    const appliedSet = new Set(applied);
    const maxApplied = applied.length ? applied[applied.length - 1] : null;
    for (const v of sorted) {
      if (maxApplied !== null && v <= maxApplied && !appliedSet.has(v)) {
        errors.push({ code: 'E5', file: versions.get(v).join(', '), message: `versión ${v} ≤ máxima aplicada ${maxApplied} y no aplicada: db push la aplicaría fuera de orden` });
      }
    }
    const local = new Set(sorted);
    const unknown = applied.filter((v) => !local.has(v));
    if (unknown.length) warnings.push({ code: 'W2', file: unknown.slice(0, 10).join(', ') + (unknown.length > 10 ? ' …' : ''), message: `${unknown.length} versiones aplicadas que no existen en el árbol local` });
  }

  const maxLocal = sorted.length ? sorted[sorted.length - 1] : null;
  if (existsSync(pendDir) && maxLocal) {
    for (const f of readdirSync(pendDir).filter((x) => NAME_RE.test(x)).sort()) {
      const v = NAME_RE.exec(f)[1];
      if (v <= maxLocal) warnings.push({ code: 'W3', file: `pending/${f}`, message: `versión ${v} ≤ máxima de migrations ${maxLocal}: renumerar al moverla` });
    }
  }

  const now = opts.now ?? new Date();
  let next = dateToVersion(now);
  if (maxLocal && next <= maxLocal) next = dateToVersion(new Date(versionToDate(maxLocal).getTime() + 1000));

  return {
    errors,
    warnings,
    stats: { files: files.length, versions: sorted.length, tracked: tracked ? tracked.size : null, maxTracked, maxLocal, future: future.length, applied: applied ? applied.length : null },
    next,
  };
}

function argv(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function main() {
  const root = argv('root') ?? join(fileURLToPath(new URL('.', import.meta.url)), '..');
  const appliedPath = argv('applied');
  const trackedPath = argv('tracked');
  const todayText = argv('today');
  const r = checkMigrationOrder({
    root,
    appliedText: appliedPath ? readFileSync(appliedPath, 'utf8') : undefined,
    tracked: trackedPath ? new Set(readFileSync(trackedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((p) => p.split('/').pop())) : undefined,
    today: todayText ? new Date(`${todayText}T00:00:00Z`) : undefined,
  });
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    console.log(`migraciones: ${r.stats.files} archivos, ${r.stats.versions} versiones; máxima versionada ${r.stats.maxTracked ?? '—'}; máxima local ${r.stats.maxLocal}`);
    for (const e of r.errors) console.log(`ERROR ${e.code} ${e.file}: ${e.message}`);
    for (const w of r.warnings) console.log(`aviso ${w.code} ${w.file}: ${w.message}`);
    if (process.argv.includes('--next')) console.log(`próxima versión válida: ${r.next}`);
    console.log(r.errors.length ? `FALLA: ${r.errors.length} errores` : 'OK');
  }
  process.exit(r.errors.length ? 1 : 0);
}

const same = (a, b) => resolve(a).toLowerCase() === resolve(b).toLowerCase();
if (process.argv[1] && same(fileURLToPath(import.meta.url), process.argv[1])) main();
