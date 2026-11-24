import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { renderPlacementBanks } from '../content/placement/render';

/**
 * Regenera content/placement/banks.generated.ts (el banco del test de nivel que viaja con la app) a
 * partir de las lecciones publicadas de cada curso (content/placement/select.ts). Determinista: correrlo
 * dos veces da el mismo archivo. content/__tests__/placement.test.ts falla si quedó desactualizado.
 *
 *   npm run content:placement
 */
const target = fileURLToPath(new URL('../content/placement/banks.generated.ts', import.meta.url));
writeFileSync(target, renderPlacementBanks());
console.log(`placement banks → ${target}`);
