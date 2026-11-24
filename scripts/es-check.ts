/**
 * Validador del español para la redacción (content/es-checks.ts), sin correr Jest.
 *
 *   npx tsx scripts/es-check.ts                 todas las unidades
 *   npx tsx scripts/es-check.ts "es A1 U5"      sólo esa unidad
 *   npx tsx scripts/es-check.ts writing         las tareas de escritura
 */
import { esProblems, esWritingProblems } from '../content/es-checks';

const only = process.argv[2];
const problems = only === 'writing' ? esWritingProblems() : esProblems(only || undefined);
console.log(problems.length ? problems.join('\n') : 'OK');
console.log(`${problems.length} problemas`);
process.exit(problems.length ? 1 : 0);
