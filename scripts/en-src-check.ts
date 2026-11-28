/**
 * Valida las traducciones de un curso de inglés localizado (content/en-src/localize.ts).
 * Uso: npx tsx scripts/en-src-check.ts pt [a1-u01 a1-u02 …]
 */
import { EN_SOURCES, localize, type EnSource } from '../content/en-src/localize';

const [source, ...only] = process.argv.slice(2);
if (!EN_SOURCES.includes(source as EnSource)) {
  console.error(`Uso: npx tsx scripts/en-src-check.ts <${EN_SOURCES.join('|')}> [unidades…]`);
  process.exit(1);
}
const { units, problems, missing } = localize(source as EnSource, only.length ? only : undefined);
const shown = only.length ? problems.filter((p) => only.some((u) => p.startsWith(u))) : problems;
for (const p of shown) console.log(`- ${p}`);
console.log(`${units.length} unidades localizadas · ${missing.length} sin traducir · ${shown.length} problemas`);
process.exit(shown.length ? 1 : 0);
