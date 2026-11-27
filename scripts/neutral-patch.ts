/**
 * Las migraciones de contenido ya aplicadas no se reescriben: 20270104120000_neutral_spanish_content
 * (scripts/build-neutral-spanish-sql.ts) corrige sus textos en español. Las pruebas que exigen que
 * una carga histórica sea «la salida exacta del generador» comparan ahora el generador con la carga
 * histórica + esa corrección: `withNeutralSpanish(sql)` aplica el parche al documento jsonb de la
 * carga y lo vuelve a escribir igual que el generador. Así la prueba sigue siendo exacta (byte a
 * byte) y además verifica que la corrección deja la base igual al contenido actual.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const NEUTRAL_MIGRATION = '20270104120000_neutral_spanish_content.sql';

type Row = { id: string } & Record<string, unknown>;
type Version = { item_id: string; content_hash: string } & Record<string, unknown>;
type PlacementRef = { exercise_id: string; item_id: string } & Record<string, unknown>;
type OptionSet = { item_id: string; options_hash: string } & Record<string, unknown>;

interface Patch {
  units: Row[];
  lessons: Row[];
  words: Row[];
  exercises: Row[];
  objectives: Row[];
  catalog: {
    versions: Version[];
    current_versions: Version[];
    placement_versions: PlacementRef[];
    option_sets?: OptionSet[];
    placement_option_sets?: PlacementRef[];
  };
}

const PAYLOAD = /\$content\$([\s\S]*?)\$content\$/;

let cached: Patch | undefined;
export function neutralPatch(): Patch {
  if (!cached) {
    const file = join(__dirname, '..', 'supabase', 'migrations', NEUTRAL_MIGRATION);
    cached = JSON.parse(PAYLOAD.exec(readFileSync(file, 'utf8'))![1]!) as Patch;
  }
  return cached;
}

const byId = <T extends { id: string }>(rows: readonly T[]) => new Map(rows.map((r) => [r.id, r]));

/** Reemplaza filas por id (sólo las que ya están en la lista). */
function replaceRows(rows: unknown, patch: readonly Row[]): unknown {
  if (!Array.isArray(rows)) return rows;
  const p = byId(patch);
  // Mismas claves y en el mismo orden que la fila de la carga (algunas cargas omiten columnas, p. ej.
  // la comprensión no lleva `words`): sólo se actualizan sus valores.
  return rows.map((r: Row) => {
    const n = p.get(r.id);
    if (!n) return r;
    return Object.fromEntries(Object.keys(r).map((k) => [k, k in n ? n[k] : r[k]]));
  });
}

/**
 * Para los ítems del documento que corrige el parche, sus filas (versiones, conjuntos) pasan a ser las
 * del parche, en el lugar de la primera que tenía el ítem.
 */
function replaceByItem<T extends { item_id: string }>(rows: unknown, patch: readonly T[]): unknown {
  if (!Array.isArray(rows)) return rows;
  const patched = new Map<string, T[]>();
  for (const r of patch) patched.set(r.item_id, [...(patched.get(r.item_id) ?? []), r]);
  const out: T[] = [];
  const done = new Set<string>();
  for (const r of rows as T[]) {
    const repl = patched.get(r.item_id);
    if (!repl) out.push(r);
    else if (!done.has(r.item_id)) {
      done.add(r.item_id);
      out.push(...repl);
    }
  }
  return out;
}

function replaceBy<T>(rows: unknown, patch: readonly T[], key: (r: T) => string): unknown {
  if (!Array.isArray(rows)) return rows;
  const p = new Map(patch.map((r) => [key(r), r]));
  return (rows as T[]).map((r) => p.get(key(r)) ?? r);
}

/** El documento de una carga de contenido después de la corrección de español neutro. */
export function applyNeutralPatch<T extends Record<string, unknown>>(
  doc: T,
  patch = neutralPatch(),
): T {
  const out: Record<string, unknown> = { ...doc };
  for (const t of ['units', 'lessons', 'words', 'exercises'] as const)
    if (t in out) out[t] = replaceRows(out[t], patch[t]);
  const catalog = out.catalog as Record<string, unknown> | undefined;
  if (catalog) {
    const c: Record<string, unknown> = { ...catalog };
    // Ítems del documento (por sus ubicaciones, versiones o conjuntos): sólo esos se corrigen.
    const ids = (k: string) =>
      ((c[k] as { item_id: string }[] | undefined) ?? []).map((r) => r.item_id);
    const present = new Set([
      ...ids('placements'),
      ...ids('versions'),
      ...ids('current_versions'),
      ...ids('placement_versions'),
      ...ids('option_sets'),
      ...ids('placement_option_sets'),
    ]);
    const mine = <R extends { item_id: string }>(rows: readonly R[] = []) =>
      rows.filter((r) => present.has(r.item_id));
    if ('versions' in c) c.versions = replaceByItem(c.versions, mine(patch.catalog.versions));
    if ('current_versions' in c)
      c.current_versions = replaceBy(
        c.current_versions,
        mine(patch.catalog.current_versions),
        (r) => r.item_id,
      );
    if ('placement_versions' in c)
      c.placement_versions = replaceBy(
        c.placement_versions,
        patch.catalog.placement_versions,
        (r) => r.exercise_id,
      );
    if ('option_sets' in c)
      c.option_sets = replaceByItem(c.option_sets, mine(patch.catalog.option_sets));
    if ('placement_option_sets' in c)
      c.placement_option_sets = replaceBy(
        c.placement_option_sets,
        patch.catalog.placement_option_sets ?? [],
        (r) => r.exercise_id,
      );
    // Mismo orden que buildOptionSets (content/option-sets.ts): cada conjunto en la primera ubicación
    // que lo usa (clave ítem@versión@opciones), recorriendo las ubicaciones en orden.
    if (Array.isArray(c.option_sets) && Array.isArray(c.placement_option_sets)) {
      const sets = c.option_sets as (OptionSet & { version_hash?: string })[];
      const pool = new Map(
        sets.map((s) => [`${s.item_id}@${s.version_hash}@${s.options_hash}`, s]),
      );
      const versionOf = new Map(
        (
          (c.placement_versions as (PlacementRef & { content_hash: string })[] | undefined) ?? []
        ).map((p) => [p.exercise_id, p.content_hash]),
      );
      const ordered: OptionSet[] = [];
      const seen = new Set<string>();
      for (const p of c.placement_option_sets as (PlacementRef & { options_hash: string })[]) {
        const v = versionOf.get(p.exercise_id);
        const s =
          (v && pool.get(`${p.item_id}@${v}@${p.options_hash}`)) ??
          sets.find((x) => x.item_id === p.item_id && x.options_hash === p.options_hash);
        if (!s) continue;
        const key = `${s.item_id}@${s.version_hash}@${s.options_hash}`;
        if (!seen.has(key)) {
          seen.add(key);
          ordered.push(s);
        }
      }
      // Conjuntos sin ubicación en este documento (no debería haber): al final, en su orden.
      for (const s of sets)
        if (!seen.has(`${s.item_id}@${s.version_hash}@${s.options_hash}`)) ordered.push(s);
      c.option_sets = ordered;
    }
    if ('objectives' in c) c.objectives = replaceRows(c.objectives, patch.objectives);
    out.catalog = c;
  }
  return out as T;
}

/** La migración de una carga histórica con su documento corregido (misma serialización). */
export function withNeutralSpanish(sql: string): string {
  const m = PAYLOAD.exec(sql);
  if (!m) return sql;
  const patched = JSON.stringify(applyNeutralPatch(JSON.parse(m[1]!) as Record<string, unknown>));
  return sql.slice(0, m.index) + `$content$${patched}$content$` + sql.slice(m.index + m[0].length);
}
