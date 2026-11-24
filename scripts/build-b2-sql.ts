/**
 * Migración de inglés B2 (docs/B2_EN.md, content/b2.ts): las 12 unidades nuevas, sin publicar.
 *
 * Uso: npm run content:b2 -- supabase/migrations/20261124120000_b2_en.sql
 *
 * Reutiliza la plantilla add-only de la fase C.3 (scripts/planned-units-sql.ts) sin cambiarla, como
 * la del B1 (scripts/build-b1-sql.ts). Única diferencia: antes del contenido amplía el CHECK de
 * `curriculum_units.level` (la carga del B1 lo dejó en A1, A2 y B1) para admitir B2. Es el único
 * cambio de esquema: no toca filas, funciones, RLS, rutas ni el desbloqueo, y `ref_levels` ya tiene
 * B2 desde 20261107120000_learning_concepts.sql.
 *
 * - Unidades, palabras, lecciones y ejercicios nacen con is_published = false: nada cambia para nadie
 *   hasta publicarlas con la migración aparte (scripts/build-b2-publish-sql.ts).
 * - Ítems en `draft`: ninguna ruta de repasos los toma.
 * - Lo ya cargado no cambia; si una fila existe con otros datos, aborta.
 *
 * Antes de escribir exige el registro de ids y el contenido válido (content/b2-checks.ts).
 * Determinista: dos corridas dan el mismo archivo.
 */
import { writeFileSync } from 'node:fs';

import { B2_PATH } from '../content/b2';
import { b2Problems, b2WritingProblems } from '../content/b2-checks';
import { registryCatalog } from '../content/comprehension';
import { assertIdsLock } from './ids-lock-file';
import { plannedUnitsSql } from './planned-units-sql';

export const B2_MIGRATION = '20261124120000_b2_en.sql';

/** Ampliación del CHECK de nivel: idempotente (reaplicarla deja el mismo CHECK). */
export const B2_LEVEL_SQL = `-- Nivel B2 en curriculum_units (la carga del B1 dejó el CHECK en A1, A2 y B1).
alter table public.curriculum_units drop constraint if exists curriculum_units_level_check;
alter table public.curriculum_units
  add constraint curriculum_units_level_check check (level in ('A1', 'A2', 'B1', 'B2'));

`;

export function b2Sql() {
  const { sql, document } = plannedUnitsSql(B2_PATH, []);
  const body = sql.slice(sql.indexOf('do $polygo_content$'));
  if (body === sql) throw new Error('plantilla inesperada: falta el bloque do');
  const { units, words, lessons, exercises, catalog, versions, optionSets } = document;
  const header = `-- =====================================================================
-- Inglés B2 (docs/B2_EN.md): unidades nuevas ${units.map((u) => u.id).join(', ')},
-- generadas por scripts/build-b2-sql.ts. NO editar a mano: editar content/en/b2/*.ts,
-- correr npm test y regenerar.
-- Requiere 20261113120000_context_comprehension.sql (tipo context_choice). Enlaza palabras publicadas,
-- del A2 nuevo (20261120120000_a2_en_completion.sql), del B1 (20261122120000_b1_en.sql) y propias:
-- va después de la carga del B1.
-- Amplía el CHECK de curriculum_units.level para admitir B2 (único cambio de esquema).
-- Contenido: sólo agrega; lo ya cargado no cambia; si difiere, aborta. No publica nada.
-- ${units.length} unidades (sin publicar) · ${lessons.length} lecciones (sin publicar) · ${words.length} palabras (sin publicar) · ${exercises.length} ejercicios (sin publicar)
-- Catálogo: ${catalog.concepts.length} conceptos (draft) · ${catalog.items.length} ítems (draft) · ${catalog.item_concepts.length} conceptos de ítems · ${catalog.placements.length} ubicaciones
-- Versiones: ${versions.versions.length} · Conjuntos de opciones: ${optionSets.option_sets.length}
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/b2Content.test.mjs). NO aplicada en producción.
-- =====================================================================

`;
  return {
    sql: header + B2_LEVEL_SQL + body.replaceAll("'planned_units: ", "'b2_load: "),
    document,
  };
}

if (require.main === module) {
  const out = process.argv[2];
  if (!out) {
    console.error(`Uso: npm run content:b2 -- supabase/migrations/${B2_MIGRATION}`);
    process.exit(1);
  }
  assertIdsLock(registryCatalog());
  const problems = [...b2Problems(), ...b2WritingProblems()];
  if (problems.length) {
    console.error(`El B2 no es válido:\n${problems.map((p) => `- ${p}`).join('\n')}`);
    process.exit(1);
  }
  const { sql, document } = b2Sql();
  writeFileSync(out, sql, 'utf8');
  console.log(
    `${out}: ${document.units.length} unidades · ${document.lessons.length} lecciones · ${document.words.length} palabras · ${document.exercises.length} ejercicios · ${document.catalog.items.length} ítems (draft)`,
  );
}
