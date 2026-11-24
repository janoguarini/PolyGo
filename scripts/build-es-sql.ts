/**
 * Migración del español A1 U1–U17 y A2 U1–U12 (docs/ES_A1_A2.md, content/es-course.ts),
 * sin publicar.
 *
 * Uso: npm run content:es -- supabase/migrations/20261204120000_es_a1_a2.sql
 *
 * Reutiliza la plantilla add-only de la fase C.3 (scripts/planned-units-sql.ts) sin cambiarla, como
 * las del inglés A2 nuevo, B1, B2, el portugués, el italiano y el chino. No cambia el esquema: el CHECK de curriculum_units.level ya admite
 * A1 y A2, y `ref_levels` ya los tiene.
 *
 * - Unidades, palabras, lecciones y ejercicios nacen con is_published = false: nada cambia para nadie
 *   hasta publicarlas con la migración aparte (scripts/build-es-publish-sql.ts).
 * - Ítems en `draft`: ninguna ruta de repasos los toma.
 * - Lo ya cargado no cambia; si una fila existe con otros datos,
 *   aborta.
 *
 * Antes de escribir exige el registro de ids y el contenido válido (content/es-checks.ts).
 * Determinista: dos corridas dan el mismo archivo.
 */
import { writeFileSync } from 'node:fs';

import { registryCatalog } from '../content/comprehension';
import { ES_PATH } from '../content/es-course';
import { esProblems, esWritingProblems } from '../content/es-checks';
import { assertIdsLock } from './ids-lock-file';
import { plannedUnitsSql } from './planned-units-sql';

export const ES_MIGRATION = '20261204120000_es_a1_a2.sql';

export function esSql() {
  const { sql, document } = plannedUnitsSql(ES_PATH, []);
  const body = sql.slice(sql.indexOf('do $polygo_content$'));
  if (body === sql) throw new Error('plantilla inesperada: falta el bloque do');
  const { units, words, lessons, exercises, catalog, versions, optionSets } = document;
  const header = `-- =====================================================================
-- Español (docs/ES_A1_A2.md): unidades nuevas ${units.map((u) => u.id).join(', ')},
-- generadas por scripts/build-es-sql.ts. NO editar a mano: editar content/es/a1/*.ts y
-- content/es/a2/*.ts, correr npm test y regenerar.
-- Requiere 20261113120000_context_comprehension.sql (tipo context_choice). Sólo enlaza palabras propias (el español no tiene piloto).
-- No depende de las cargas de otros idiomas.
-- Sin cambios de esquema. Contenido: sólo agrega; lo ya cargado no cambia; si difiere, aborta. No publica nada.
-- ${units.length} unidades (sin publicar) · ${lessons.length} lecciones (sin publicar) · ${words.length} palabras (sin publicar) · ${exercises.length} ejercicios (sin publicar)
-- Catálogo: ${catalog.concepts.length} conceptos (draft) · ${catalog.items.length} ítems (draft) · ${catalog.item_concepts.length} conceptos de ítems · ${catalog.placements.length} ubicaciones
-- Versiones: ${versions.versions.length} · Conjuntos de opciones: ${optionSets.option_sets.length}
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/esContent.test.mjs). NO aplicada en producción.
-- =====================================================================

`;
  return { sql: header + body.replaceAll("'planned_units: ", "'es_load: "), document };
}

if (require.main === module) {
  const out = process.argv[2];
  if (!out) {
    console.error(`Uso: npm run content:es -- supabase/migrations/${ES_MIGRATION}`);
    process.exit(1);
  }
  assertIdsLock(registryCatalog());
  const problems = [...esProblems(), ...esWritingProblems()];
  if (problems.length) {
    console.error(`El español no es válido:\n${problems.map((p) => `- ${p}`).join('\n')}`);
    process.exit(1);
  }
  const { sql, document } = esSql();
  writeFileSync(out, sql, 'utf8');
  console.log(
    `${out}: ${document.units.length} unidades · ${document.lessons.length} lecciones · ${document.words.length} palabras · ${document.exercises.length} ejercicios · ${document.catalog.items.length} ítems (draft)`,
  );
}
