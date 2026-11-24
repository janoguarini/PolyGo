/**
 * Migración del chino A1 U13–U16 y A2 U1–U12 (docs/ZH_A1_A2.md, content/zh-course.ts),
 * sin publicar.
 *
 * Uso: npm run content:zh -- supabase/migrations/20261130120000_zh_a1_a2.sql
 *
 * Reutiliza la plantilla add-only de la fase C.3 (scripts/planned-units-sql.ts) sin cambiarla, como
 * las del inglés A2 nuevo, B1, B2 y el portugués. No cambia el esquema: el CHECK de curriculum_units.level ya admite
 * A1 y A2, y `ref_levels` ya los tiene.
 *
 * - Unidades, palabras, lecciones y ejercicios nacen con is_published = false: nada cambia para nadie
 *   hasta publicarlas con la migración aparte (scripts/build-zh-publish-sql.ts).
 * - Ítems en `draft`: ninguna ruta de repasos los toma.
 * - Lo ya cargado (el piloto zh A1 U1–U12 incluido) no cambia; si una fila existe con otros datos,
 *   aborta.
 *
 * Antes de escribir exige el registro de ids y el contenido válido (content/zh-checks.ts).
 * Determinista: dos corridas dan el mismo archivo.
 */
import { writeFileSync } from 'node:fs';

import { registryCatalog } from '../content/comprehension';
import { ZH_PATH } from '../content/zh-course';
import { zhProblems, zhWritingProblems } from '../content/zh-checks';
import { assertIdsLock } from './ids-lock-file';
import { plannedUnitsSql } from './planned-units-sql';

export const ZH_MIGRATION = '20261130120000_zh_a1_a2.sql';

export function zhSql() {
  const { sql, document } = plannedUnitsSql(ZH_PATH, []);
  const body = sql.slice(sql.indexOf('do $polygo_content$'));
  if (body === sql) throw new Error('plantilla inesperada: falta el bloque do');
  const { units, words, lessons, exercises, catalog, versions, optionSets } = document;
  const header = `-- =====================================================================
-- Chino (docs/ZH_A1_A2.md): unidades nuevas ${units.map((u) => u.id).join(', ')},
-- generadas por scripts/build-zh-sql.ts. NO editar a mano: editar content/zh/a1/unit13…16-*.ts y
-- content/zh/a2/*.ts, correr npm test y regenerar.
-- Requiere 20261113120000_context_comprehension.sql (tipo context_choice). Enlaza palabras del piloto
-- zh A1 U1–U12 (publicado) y propias. No depende de las cargas del inglés, el portugués ni el italiano.
-- Sin cambios de esquema. Contenido: sólo agrega; lo ya cargado no cambia; si difiere, aborta. No publica nada.
-- ${units.length} unidades (sin publicar) · ${lessons.length} lecciones (sin publicar) · ${words.length} palabras (sin publicar) · ${exercises.length} ejercicios (sin publicar)
-- Catálogo: ${catalog.concepts.length} conceptos (draft) · ${catalog.items.length} ítems (draft) · ${catalog.item_concepts.length} conceptos de ítems · ${catalog.placements.length} ubicaciones
-- Versiones: ${versions.versions.length} · Conjuntos de opciones: ${optionSets.option_sets.length}
--
-- ESTADO: escrita y probada en PGlite (supabase/tests/zhContent.test.mjs). NO aplicada en producción.
-- =====================================================================

`;
  return { sql: header + body.replaceAll("'planned_units: ", "'zh_load: "), document };
}

if (require.main === module) {
  const out = process.argv[2];
  if (!out) {
    console.error(`Uso: npm run content:zh -- supabase/migrations/${ZH_MIGRATION}`);
    process.exit(1);
  }
  assertIdsLock(registryCatalog());
  const problems = [...zhProblems(), ...zhWritingProblems()];
  if (problems.length) {
    console.error(`El chino no es válido:\n${problems.map((p) => `- ${p}`).join('\n')}`);
    process.exit(1);
  }
  const { sql, document } = zhSql();
  writeFileSync(out, sql, 'utf8');
  console.log(
    `${out}: ${document.units.length} unidades · ${document.lessons.length} lecciones · ${document.words.length} palabras · ${document.exercises.length} ejercicios · ${document.catalog.items.length} ítems (draft)`,
  );
}
