/**
 * Migración de carga de un curso de inglés localizado (docs/EN_MULTI_SOURCE.md): en-from-pt, -it o -fr,
 * A1–B1, sin publicar.
 *
 * Uso: npx tsx scripts/build-en-src-sql.ts pt supabase/migrations/20270109120000_en_from_pt.sql
 *
 * Reutiliza la plantilla add-only (scripts/planned-units-sql.ts), como el español y el francés. El
 * contenido se arma con el espacio de ids del curso (ept, eit, efr) y se carga con
 * language_code = 'en': la base asigna el curso por el prefijo del id (trigger de
 * 20270108120000_courses_per_language.sql, que esta carga requiere).
 *
 * - Todo nace con is_published = false y los ítems en `draft`: nada cambia para nadie hasta publicar.
 * - Si una fila existe con otros datos, aborta. Determinista: dos corridas dan el mismo archivo.
 * - Se niega a escribir si falta una unidad o el validador encuentra problemas.
 */
import { writeFileSync } from 'node:fs';

import { enSrcCourse } from '../content/en-src/course';
import { EN_SOURCES, type EnSource } from '../content/en-src/localize';
import { plannedUnitsSql } from './planned-units-sql';

export function enSrcSql(source: EnSource) {
  const course = enSrcCourse(source);
  const { sql, document } = plannedUnitsSql(course.path, []);
  const start = sql.indexOf('do $polygo_content$');
  if (start < 0) throw new Error('plantilla inesperada: falta el bloque do');
  const ns = course.namespace;
  const body = sql
    .slice(start)
    .replaceAll(`"language_code":"${ns}"`, '"language_code":"en"')
    .replaceAll("'planned_units: ", `'${ns}_load: `);
  if (body.includes(`"language_code":"${ns}"`)) throw new Error('quedó un language_code del espacio de ids');
  const { units, words, lessons, exercises, catalog } = document;
  const header = `-- =====================================================================
-- Inglés desde ${source} (${course.code}, docs/EN_MULTI_SOURCE.md): ${units.length} unidades A1–B1 (${units[0]?.id} … ${units.at(-1)?.id}),
-- generadas por scripts/build-en-src-sql.ts. NO editar a mano: editar content/en-src/${source}/*.json,
-- correr el validador (scripts/en-src-check.ts) y regenerar.
-- Requiere 20270108120000_courses_per_language.sql (cursos por idioma; curso por prefijo ${ns}-).
-- Sin cambios de esquema. Sólo agrega; si algo ya cargado difiere, aborta. No publica nada.
-- ${units.length} unidades · ${lessons.length} lecciones · ${words.length} palabras · ${exercises.length} ejercicios (sin publicar)
-- Catálogo: ${catalog.concepts.length} conceptos · ${catalog.items.length} ítems (draft)
--
-- ESTADO: local. NO aplicada en producción.
-- =====================================================================

`;
  return { sql: header + body, course, document };
}

if (require.main === module) {
  const [source, out] = process.argv.slice(2);
  if (!EN_SOURCES.includes(source as EnSource) || !out) {
    console.error('Uso: npx tsx scripts/build-en-src-sql.ts <pt|it|fr> <archivo.sql>');
    process.exit(1);
  }
  const { sql, course } = enSrcSql(source as EnSource);
  if (course.missing.length || course.problems.length) {
    for (const p of course.problems) console.error(`- ${p}`);
    console.error(`Faltan ${course.missing.length} unidades: ${course.missing.join(', ')}`);
    process.exit(1);
  }
  writeFileSync(out, sql);
  console.log(`${out}: ${sql.length} bytes`);
}
