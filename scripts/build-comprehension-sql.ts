/**
 * Migración de las lecciones «En contexto» de la fase C (docs/LEARNING_PHASE_C.md).
 *
 * Uso: npm run content:comprehension -- supabase/migrations/<timestamp>_comprehension_en_a1.sql
 *
 * Antes de escribir exige: el registro de ids (content/ids.lock.json) con el currículo y la fase C,
 * el contenido de la fase C válido (content/comprehension-checks.ts) y sus objetivos con relaciones
 * existentes y del mismo idioma. Determinista: dos corridas dan el mismo archivo.
 */
import { writeFileSync } from 'node:fs';

import { CURRICULUM_PATH } from '../content';
import { buildCatalog, objectiveScopeOf } from '../content/catalog';
import {
  COMPREHENSION_OBJECTIVES,
  COMPREHENSION_PATH,
  registryCatalog,
} from '../content/comprehension';
import { comprehensionProblems, stimulusVisualProblems } from '../content/comprehension-checks';
import { objectiveProblems } from '../content/objectives';
import { comprehensionSql } from './comprehension-sql';
import { assertIdsLock } from './ids-lock-file';

const out = process.argv[2];
if (!out) {
  console.error('Uso: npm run content:comprehension -- <archivo.sql>');
  process.exit(1);
}

assertIdsLock(registryCatalog());
const scope = objectiveScopeOf(COMPREHENSION_PATH, buildCatalog(COMPREHENSION_PATH));
const problems = [
  ...comprehensionProblems(),
  ...stimulusVisualProblems(),
  // Los conceptos de los objetivos son palabras del currículo cargado, no de la fase C.
  ...objectiveProblems(COMPREHENSION_OBJECTIVES, {
    ...scope,
    concepts: objectiveScopeOf(CURRICULUM_PATH).concepts,
  }),
];
if (problems.length) {
  console.error(`El contenido de la fase C no es válido:\n${problems.map((p) => `- ${p}`).join('\n')}`);
  process.exit(1);
}

const { sql, document } = comprehensionSql();
writeFileSync(out, sql, 'utf8');
console.log(
  `${out}: ${document.lessons.length} lecciones sin publicar · ${document.exercises.length} preguntas · ${document.catalog.objectives.length} objetivos (draft)`,
);
