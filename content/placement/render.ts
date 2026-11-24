import { buildPlacementBanks } from './select';

/** Texto de content/placement/banks.generated.ts (lo escribe el script y lo compara la prueba). */
export function renderPlacementBanks(): string {
  const banks = buildPlacementBanks();
  return [
    '// GENERADO por scripts/build-placement-bank.ts (npm run content:placement). No editar a mano.',
    '// Cada pregunta es un ejercicio de una lección publicada del curso (content/placement/select.ts).',
    "import type { PlacementBank } from '../../shared/placement';",
    '',
    `export const PLACEMENT_BANKS: Readonly<Record<string, PlacementBank>> = ${JSON.stringify(banks, null, 2)};`,
    '',
  ].join('\n');
}
