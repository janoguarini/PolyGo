/**
 * Migración de las lecciones escritas de las unidades planificadas (fase C.3, docs/LEARNING_PHASE_C.md
 * §C3).
 *
 * Uso: npm run content:planned -- supabase/migrations/<timestamp>_planned_lessons_en_a1_u13_u14.sql
 *
 * Antes de escribir exige: el registro de ids (content/ids.lock.json) con el currículo, la fase C y
 * estas lecciones; el contenido válido (content/planned-checks.ts) y los objetivos con relaciones
 * existentes y del mismo idioma. Determinista: dos corridas dan el mismo archivo.
 */
import { writeFileSync } from 'node:fs';

import { CURRICULUM_PATH } from '../content';
import { buildCatalog, objectiveScopeOf } from '../content/catalog';
import { registryCatalog } from '../content/comprehension';
import { objectiveProblems } from '../content/objectives';
import { PLANNED_PATH } from '../content/planned';
import { plannedProblems } from '../content/planned-checks';
import { PLANNED_OBJECTIVES } from '../content/planned-objectives';
import { COMPREHENSION_PATH } from '../content/comprehension';
import { assertIdsLock } from './ids-lock-file';
import { plannedUnitsSql } from './planned-units-sql';

const out = process.argv[2];
if (!out) {
  console.error('Uso: npm run content:planned -- <archivo.sql>');
  process.exit(1);
}

assertIdsLock(registryCatalog());
// Las relaciones de los objetivos apuntan a lecciones e ítems de la fase C y de estas unidades, y a
// conceptos del currículo cargado o de las palabras nuevas.
const tranches = [...COMPREHENSION_PATH, ...PLANNED_PATH];
const scope = objectiveScopeOf(tranches, buildCatalog(tranches));
const problems = [
  ...plannedProblems(),
  ...objectiveProblems(PLANNED_OBJECTIVES, {
    ...scope,
    concepts: objectiveScopeOf([...CURRICULUM_PATH, ...PLANNED_PATH]).concepts,
  }),
];
if (problems.length) {
  console.error(
    `Las unidades planificadas no son válidas:\n${problems.map((p) => `- ${p}`).join('\n')}`,
  );
  process.exit(1);
}

const { sql, document } = plannedUnitsSql();
writeFileSync(out, sql, 'utf8');
console.log(
  `${out}: ${document.lessons.length} lecciones sin publicar · ${document.words.length} palabras · ${document.exercises.length} ejercicios · ${document.catalog.items.length} ítems (draft)`,
);
