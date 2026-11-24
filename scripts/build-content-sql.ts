/**
 * Genera una migración SQL idempotente con el contenido de content/ (todos los niveles).
 * Uso: npm run content:sql -- supabase/migrations/<timestamp>_content_it_a1_unit_01.sql
 *        [--language it] [--level A1] [--unit N]   (sin --language: inglés)
 *
 * El SQL lo arma scripts/content-sql.ts (incluye el catálogo de aprendizaje: conceptos léxicos de
 * las palabras nuevas, ítems de los ejercicios y sus conceptos por dimensión). Antes de escribir
 * exige que el currículo respete content/ids.lock.json (npm run content:ids).
 */
import { writeFileSync } from 'node:fs';

import { CURRICULUM_PATH } from '../content';
import { contentSql } from './content-sql';
import { assertContentCatalog } from './ids-lock-file';

const out = process.argv[2];
if (!out) {
  console.error('Uso: npm run content:sql -- <archivo.sql>');
  process.exit(1);
}

// --level A2 / --unit N generan sólo ese nivel o unidad (migraciones más chicas; aplicar en orden).
const arg = (name: string) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const language = arg('--language') ?? 'en';
const onlyLevel = arg('--level') ?? (arg('--unit') ? 'A1' : undefined);
const onlyUnit = arg('--unit') ? Number(arg('--unit')) : null;
const PATH = CURRICULUM_PATH.filter(
  (p) =>
    p.language === language &&
    (!onlyLevel || p.level === onlyLevel) &&
    (!onlyUnit || p.unit.position === onlyUnit),
);
if (PATH.length === 0)
  throw new Error(`Unidad ${language} ${onlyLevel ?? ''} ${onlyUnit ?? ''} inexistente`);

// Los ids de ítem del currículo completo tienen que respetar content/ids.lock.json.
assertContentCatalog();
const { sql, document } = contentSql(PATH);
const { catalog } = document;

writeFileSync(out, sql, 'utf8');
console.log(
  `OK ${out}: ${document.units.length} unidades, ${document.lessons.length} lecciones, ` +
    `${document.words.length} palabras, ${document.exercises.length} ejercicios, ` +
    `${catalog.items.length} ítems, ${Buffer.byteLength(sql)} bytes`,
);
