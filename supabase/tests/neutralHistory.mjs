// Lo que la corrección de español neutro (20270104120000_neutral_spanish_content.sql) agrega a una base
// con todas las migraciones: para las pruebas del backfill de versiones y conjuntos, que describen el
// estado «una versión por ítem» de antes de cualquier corrección de texto.
import { neutralPatch, withNeutralSpanish } from '../../scripts/neutral-patch.ts';

export { withNeutralSpanish };

const patch = neutralPatch();

/** Ítems cuya versión vigente fija la corrección (pueden tener una versión 2). */
export const NEUTRAL_ITEMS = new Set(patch.catalog.current_versions.map((v) => v.item_id));

/**
 * Versiones nuevas que la corrección creó en `db`: las (ítem, hash) del parche que no son la versión 1
 * del ítem. Se calcula contra la base, así la cuenta no depende de un número fijo.
 */
export async function neutralAddedVersions(db, itemIds = null) {
  const { rows } = await db.query(
    `select item_id, content_hash from public.exercise_item_versions where version = 1`,
  );
  const v1 = new Map(rows.map((r) => [r.item_id, r.content_hash]));
  const added = new Set();
  for (const v of patch.catalog.versions) {
    if (itemIds && !itemIds.has(v.item_id)) continue;
    if (!v1.has(v.item_id) || v1.get(v.item_id) === v.content_hash) continue;
    added.add(`${v.item_id}@${v.content_hash}`);
  }
  return added.size;
}

/** Conjuntos de opciones nuevos que trajo la corrección (los que la base no tenía antes). */
export function neutralOptionSets(itemIds = null) {
  return (patch.catalog.option_sets ?? []).filter((s) => !itemIds || itemIds.has(s.item_id));
}
