/**
 * Genera los emblemas de rango del sitio web (website/src/assets/emblems/<tier>.svg) con la misma
 * geometría y colores que la app. Correr cuando cambie el diseño del emblema:
 *   npx tsx scripts/generate-website-emblems.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { TIERS } from '../shared/ranking';
import {
  CROWN,
  DIVISION_PIPS,
  EMBLEM_VIEWBOX,
  INNER,
  SHIELD,
  gemPoints,
  pipPath,
} from '../src/design-system/rankEmblemGeometry';
import { TIER_COLORS } from '../src/design-system/rankTheme';

const out = join(__dirname, '..', 'website', 'src', 'assets', 'emblems');
mkdirSync(out, { recursive: true });

TIERS.forEach((tier, index) => {
  const c = TIER_COLORS[tier.id];
  const id = `g-${tier.id}`;
  const pips = tier.hasDivisions ? DIVISION_PIPS.I : 0;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${EMBLEM_VIEWBOX}" role="img" aria-label="Rango ${tier.name}">`,
    '<defs>',
    `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.light}"/><stop offset="1" stop-color="${c.dark}"/></linearGradient>`,
    `<linearGradient id="${id}-in" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1A1636"/><stop offset="1" stop-color="#0B0A1A"/></linearGradient>`,
    '</defs>',
    `<path d="${SHIELD}" fill="url(#${id})"/>`,
    `<path d="${INNER}" fill="url(#${id}-in)" stroke="${c.light}" stroke-width="1.5"/>`,
    `<polygon points="${gemPoints(index)}" fill="url(#${id})" stroke="${c.accent}" stroke-width="1.5"/>`,
    tier.id === 'grandmaster' ? `<path d="${CROWN}" fill="${c.accent}" transform="translate(0 -3)"/>` : '',
    ...Array.from(
      { length: pips },
      (_, i) =>
        `<path d="${pipPath(i)}" stroke="${c.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    ),
    '</svg>',
  ].join('');
  writeFileSync(join(out, `${tier.id}.svg`), svg + '\n');
});

console.log(`${TIERS.length} emblemas en ${out}`);
