/**
 * Escribe el catálogo de textos a localizar del inglés A1–B1 (content/en-src/strings.ts), un JSON por
 * unidad en content/en-src/catalog/. Determinista. Uso: npx tsx scripts/en-src-catalog.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { buildCatalog } from '../content/en-src/strings';

const dir = join(__dirname, '..', 'content', 'en-src', 'catalog');
mkdirSync(dir, { recursive: true });
for (const c of buildCatalog()) {
  writeFileSync(join(dir, `${c.unit}.json`), `${JSON.stringify(c, null, 1)}\n`);
}
console.log('catálogo escrito en', dir);
