/**
 * Validador del francés para la redacción (content/fr-checks.ts), sin correr Jest.
 *
 *   npx tsx scripts/fr-check.ts                 todas las unidades
 *   npx tsx scripts/fr-check.ts "fr A1 U5"      sólo esa unidad
 *   npx tsx scripts/fr-check.ts writing         las tareas de escritura
 */
import { frProblems, frWritingProblems } from '../content/fr-checks';

const only = process.argv[2];
const problems = only === 'writing' ? frWritingProblems() : frProblems(only || undefined);
console.log(problems.length ? problems.join('\n') : 'OK');
console.log(`${problems.length} problemas`);
process.exit(problems.length ? 1 : 0);
