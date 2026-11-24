/**
 * Migración de inglés B1 (docs/B1_EN.md, content/b1.ts): las 12 unidades nuevas, sin publicar.
 *
 * Uso: npm run content:b1 -- supabase/migrations/20261122120000_b1_en.sql
 *
 * Reutiliza la plantilla add-only de la fase C.3 (scripts/planned-units-sql.ts) sin cambiarla, como
 * la del A2 nuevo (scripts/build-a2-expansion-sql.ts). Única diferencia: antes del contenido amplía el
 * CHECK de `curriculum_units.level` (20261029021909_curriculum.sql sólo admitía A1 y A2) para admitir
 * B1. Es el único cambio de esquema: no toca filas, funciones, RLS, rutas ni el desbloqueo, y
 * `ref_levels` ya tiene B1 desde 20261107120000_learning_concepts.sql.
 *
 * - Unidades, palabras, lecciones y ejercicios nacen con is_published = false: nada cambia para nadie
 *   hasta publicarlas con la migración aparte (scripts/build-b1-publish-sql.ts).
 * - Ítems en `draft`: ninguna ruta de repasos los toma.
 * - Lo ya cargado no cambia; si una fila existe con otros datos, aborta.
 *
 * Antes de escribir exige el registro de ids y el contenido válido (content/b1-checks.ts).
 * Determinista: dos corridas dan el mismo archivo.
 */
import { writeFileSync } from 'node:fs';

import { B1_PATH } from '../content/b1';
import { b1Problems, b1WritingProblems } from '../content/b1-checks';
import { registryCatalog } from '../content/comprehension';
import { assertIdsLock } from './ids-lock-file';
import { plannedUnitsSql } from './planned-units-sql';

export const B1_MIGRATION = '20261122120000_b1_en.sql';

/** Ampliación del CHECK de nivel: idempotente (reaplicarla deja el mismo CHECK). */
export const B1_LEVEL_SQL = `-- Nivel B1 en curriculum_units (el CHECK original sólo admitía A1 y A2).
alter table public.curriculum_units drop constraint if exists curriculum_units_level_check;
alter table public.curriculum_units
  add constraint curriculum_units_level_check check (level in ('A1', 'A2', 'B1'));

`;

export function b1Sql() {
  const { sql, document } = plannedUnitsSql(B1_PATH, []);
  const body = sql.slice(sql.indexOf('do $polygo_content$'));
  if (body === sql) throw new Error('plantilla inesperada: falta el bloque do');
  const { units, words, lessons, exercises, catalog, versions, optionSets } = document;
  const header = `-- =====================================================================
-- Inglés B1 (docs/B1_EN.md): unidades nuevas ${units.map((u) => u.id).join(', ')},
-- generadas por scripts/build-b1-sql.ts. NO editar a mano: editar content/en/b1/*.ts,
-- correr npm test y regenerar.
-- Requiere 20261113120000_context_comprehension.sql (tipo context_choice). Enlaza palabras publicadas,
-- del A2 nuevo (20261120120000_a2_en_completion.sql) y propias: va después de la carga del A2.
-- Amplía el CHECK de curriculum_units.level para admitir B1 (único cambio de esquema).
-- Contenido: sólo agrega; lo ya cargado no cambia; si difiere, aborta. No publica nada.
-- ${units.length} unidades (sin publicar) · ${lessons.length} lecciones (sin publicar) · ${words.length} palabras (sin publicar) · ${exercises.length} ejercicios (sin publicar)
-- Catálogo: ${catalog.concepts.length} conceptos (draft) · ${catalog.items.length} ítems (draft) · ${catalog.item_concepts.length} conceptos de ítems · ${catalog.placements.length} ubicaciones
-- Versiones: ${versions.versions.length} · Conjuntos de opciones: ${optionSets.option_sets.length}
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/b1Content.test.mjs). NO aplicada en producción.
-- =====================================================================

`;
  return {
    sql: header + B1_LEVEL_SQL + body.replaceAll("'planned_units: ", "'b1_load: "),
    document,
  };
}

if (require.main === module) {
  const out = process.argv[2];
  if (!out) {
    console.error(`Uso: npm run content:b1 -- supabase/migrations/${B1_MIGRATION}`);
    process.exit(1);
  }
  assertIdsLock(registryCatalog());
  const problems = [...b1Problems(), ...b1WritingProblems()];
  if (problems.length) {
    console.error(`El B1 no es válido:\n${problems.map((p) => `- ${p}`).join('\n')}`);
    process.exit(1);
  }
  const { sql, document } = b1Sql();
  writeFileSync(out, sql, 'utf8');
  console.log(
    `${out}: ${document.units.length} unidades · ${document.lessons.length} lecciones · ${document.words.length} palabras · ${document.exercises.length} ejercicios · ${document.catalog.items.length} ítems (draft)`,
  );
}
