/**
 * Migración del cierre de inglés A1 (docs/A1_EN_CLOSURE.md): los agregados del mapa curricular a
 * unidades ya cargadas (content/en/a1/closure.ts, SUPPLEMENT_PATH).
 *
 * Uso: npm run content:a1-closure -- supabase/migrations/<timestamp>_a1_en_closure.sql
 *
 * Reutiliza la plantilla add-only de la fase C.3 (scripts/planned-units-sql.ts) sin cambiarla:
 * - Unidades y lecciones ya cargadas: se encuentran iguales y no se tocan (si difieren, aborta).
 * - Palabras, lecciones nuevas y ejercicios (también los agregados al final de una lección
 *   publicada) nacen con is_published = false: learning_lesson_plan y RLS sólo ven lo publicado, así
 *   que ningún recorrido cambia hasta publicarlos con una migración aparte.
 * - Ítems en `draft`: ninguna ruta de repasos los toma.
 * - Sin objetivos: los vínculos ítem → objetivo del mapa quedan documentados en el contenido
 *   (`curriculum` de cada agregado); cargarlos exige recargar los objetivos de comprensión completos
 *   (PLANNED_OBJECTIVES) y no hace falta para publicar (docs/A1_EN_CLOSURE.md §D).
 *
 * Antes de escribir exige el registro de ids y el contenido válido. Determinista.
 */
import { writeFileSync } from 'node:fs';

import { registryCatalog } from '../content/comprehension';
import { SUPPLEMENT_PATH } from '../content/supplement';
import { supplementProblems } from '../content/supplement-checks';
import { assertIdsLock } from './ids-lock-file';
import { plannedUnitsSql } from './planned-units-sql';

export function a1ClosureSql() {
  const { sql, document } = plannedUnitsSql(SUPPLEMENT_PATH, []);
  const body = sql.slice(sql.indexOf('do $polygo_content$'));
  if (body === sql) throw new Error('plantilla inesperada: falta el bloque do');
  const { units, words, lessons, exercises, catalog, versions, optionSets } = document;
  const appended = exercises.filter((e) =>
    SUPPLEMENT_PATH.some((p) =>
      p.lessons.some((l) => l.id === e.lesson_id && (l.exerciseOffset ?? 0) > 0),
    ),
  ).length;
  const header = `-- =====================================================================
-- Cierre de inglés A1 (docs/A1_EN_CLOSURE.md): agregados del mapa curricular a unidades cargadas,
-- generados por scripts/build-a1-closure-sql.ts. NO editar a mano: editar content/en/a1/closure.ts,
-- correr npm test y regenerar.
-- Requiere 20261113120300_planned_lessons_en_a1_u13_u14.sql (U14 L1 recibe dos ejercicios).
-- Sólo agrega: lo ya cargado no cambia; si difiere, aborta. No publica nada.
-- ${units.length} unidades (ya cargadas, sin cambios) · ${lessons.length} lecciones (${lessons.length - 3} cargadas, 3 nuevas sin publicar)
-- ${words.length} palabras (sin publicar) · ${exercises.length} ejercicios (sin publicar; ${appended} al final de lecciones cargadas)
-- Catálogo: ${catalog.concepts.length} conceptos (draft) · ${catalog.items.length} ítems (draft) · ${catalog.item_concepts.length} conceptos de ítems · ${catalog.placements.length} ubicaciones
-- Versiones: ${versions.versions.length} · Conjuntos de opciones: ${optionSets.option_sets.length}
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/a1Closure.test.mjs). NO aplicada en producción.
-- =====================================================================

`;
  return {
    sql: header + body.replaceAll("'planned_units: ", "'a1_closure: "),
    document,
  };
}

if (require.main === module) {
  const out = process.argv[2];
  if (!out) {
    console.error('Uso: npm run content:a1-closure -- <archivo.sql>');
    process.exit(1);
  }
  assertIdsLock(registryCatalog());
  const problems = supplementProblems();
  if (problems.length) {
    console.error(`El cierre de A1 no es válido:\n${problems.map((p) => `- ${p}`).join('\n')}`);
    process.exit(1);
  }
  const { sql, document } = a1ClosureSql();
  writeFileSync(out, sql, 'utf8');
  console.log(
    `${out}: ${document.lessons.length} lecciones · ${document.words.length} palabras · ${document.exercises.length} ejercicios · ${document.catalog.items.length} ítems (draft)`,
  );
}
