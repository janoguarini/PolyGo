/**
 * Escribe las tareas de escritura de un curso de inglés localizado como archivo estático para la app
 * (content/en-src/generated/writing-<idioma>.ts): el bundle no puede leer los JSON de traducción.
 * Uso: npx tsx scripts/build-en-src-writing.ts pt
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { enSrcWritingTasks } from '../content/en-src/course';
import { EN_SOURCES, type EnSource } from '../content/en-src/localize';

const source = process.argv[2] as EnSource;
if (!EN_SOURCES.includes(source)) {
  console.error(`Uso: npx tsx scripts/build-en-src-writing.ts <${EN_SOURCES.join('|')}>`);
  process.exit(1);
}
const tasks = enSrcWritingTasks(source);
const name = `EN_FROM_${source.toUpperCase()}_WRITING_TASKS`;
const dir = join(__dirname, '..', 'content', 'en-src', 'generated');
mkdirSync(dir, { recursive: true });
const file = join(dir, `writing-${source}.ts`);
writeFileSync(
  file,
  `// GENERADO por scripts/build-en-src-writing.ts: no editar a mano (docs/EN_MULTI_SOURCE.md).
import type { WritingTaskDef } from '../../../shared/writing';

export const ${name}: readonly WritingTaskDef[] = ${JSON.stringify(tasks, null, 2)};
`,
);
console.log(`${file}: ${tasks.length} tareas`);
