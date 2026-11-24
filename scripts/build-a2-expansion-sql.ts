/**
 * Migración de las unidades nuevas de inglés A2 (U13–U17, docs/A2_EN_COMPLETION.md,
 * content/a2-expansion.ts).
 *
 * Uso: npm run content:a2 -- supabase/migrations/<timestamp>_a2_en_completion.sql
 *
 * Reutiliza la plantilla add-only de la fase C.3 (scripts/planned-units-sql.ts) sin cambiarla:
 * - Unidades, palabras, lecciones y ejercicios nacen con is_published = false: RLS, el camino de la
 *   app, learning_lesson_plan e is_lesson_unlocked sólo ven lo publicado, así que nada cambia para
 *   nadie hasta publicarlas con una migración aparte.
 * - Ítems en `draft`: ninguna ruta de repasos los toma.
 * - Sin objetivos: como en el cierre de A1, no se crean objetivos en la base.
 * - Lo ya cargado no cambia; si una fila existe con otros datos, aborta.
 *
 * Antes de escribir exige el registro de ids y el contenido válido (content/a2-expansion-checks.ts).
 * Determinista: dos corridas dan el mismo archivo.
 */
import { writeFileSync } from 'node:fs';

import { A2_EXPANSION_PATH } from '../content/a2-expansion';
import { a2ExpansionProblems, a2WritingProblems } from '../content/a2-expansion-checks';
import { registryCatalog } from '../content/comprehension';
import { assertIdsLock } from './ids-lock-file';
import { plannedUnitsSql } from './planned-units-sql';

export function a2ExpansionSql() {
  const { sql, document } = plannedUnitsSql(A2_EXPANSION_PATH, []);
  const body = sql.slice(sql.indexOf('do $polygo_content$'));
  if (body === sql) throw new Error('plantilla inesperada: falta el bloque do');
  const { units, words, lessons, exercises, catalog, versions, optionSets } = document;
  const header = `-- =====================================================================
-- Inglés A2 completo (docs/A2_EN_COMPLETION.md): unidades nuevas ${units.map((u) => u.id).join(', ')},
-- generadas por scripts/build-a2-expansion-sql.ts. NO editar a mano: editar
-- content/en/a2/unit13-*.ts … unit17-*.ts, correr npm test y regenerar.
-- Requiere 20261113120000_context_comprehension.sql (tipo context_choice). Sólo enlaza palabras ya
-- publicadas o propias: no depende del cierre de A1 ni de A1 U13/U14 (comprobado en PGlite).
-- Sólo agrega: lo ya cargado no cambia; si difiere, aborta. No publica nada.
-- ${units.length} unidades (sin publicar) · ${lessons.length} lecciones (sin publicar) · ${words.length} palabras (sin publicar) · ${exercises.length} ejercicios (sin publicar)
-- Catálogo: ${catalog.concepts.length} conceptos (draft) · ${catalog.items.length} ítems (draft) · ${catalog.item_concepts.length} conceptos de ítems · ${catalog.placements.length} ubicaciones
-- Versiones: ${versions.versions.length} · Conjuntos de opciones: ${optionSets.option_sets.length}
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/a2Completion.test.mjs). NO aplicada en producción.
-- =====================================================================

`;
  return {
    sql: header + body.replaceAll("'planned_units: ", "'a2_completion: "),
    document,
  };
}

if (require.main === module) {
  const out = process.argv[2];
  if (!out) {
    console.error('Uso: npm run content:a2 -- <archivo.sql>');
    process.exit(1);
  }
  assertIdsLock(registryCatalog());
  const problems = [...a2ExpansionProblems(), ...a2WritingProblems()];
  if (problems.length) {
    console.error(`El A2 nuevo no es válido:\n${problems.map((p) => `- ${p}`).join('\n')}`);
    process.exit(1);
  }
  const { sql, document } = a2ExpansionSql();
  writeFileSync(out, sql, 'utf8');
  console.log(
    `${out}: ${document.lessons.length} lecciones · ${document.words.length} palabras · ${document.exercises.length} ejercicios · ${document.catalog.items.length} ítems (draft)`,
  );
}
