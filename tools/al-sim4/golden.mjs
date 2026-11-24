// Vectores dorados de srs-2.0.0 desde el simulador de la rev. 4.2 (pglayer.mjs + cores.mjs).
// Es el generador con el que se escribió shared/__tests__/fixtures/srs2-golden.json en la fase 3
// (mismo código, misma semilla); sólo cambian las rutas de importación y de salida.
//
//   node tools/al-sim4/golden.mjs            → compara con el fixture (falla si difiere)
//   node tools/al-sim4/golden.mjs --write    → reescribe el fixture
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { core45 } from './cores.mjs';
import { makePG3 } from './pglayer.mjs';

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'shared', '__tests__', 'fixtures', 'srs2-golden.json');
const W = [0.2, 1.4003, 0.6, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
let seed = 12345; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const out = [];
for (const Imax of [45, 180]) {
  const M = makePG3(core45(W), { Imax, fuzz: 0 });
  for (let k = 0; k < 100; k++) {
    const qs = [0, 0.25, 0.4, 0.5, 0.54, 0.6, 0.9, 1, 0.33, 0.67];
    const mkObs = () => { const n = 1 + Math.floor(rnd() * 4); const o = []; for (let i = 0; i < n; i++) o.push({ q: qs[Math.floor(rnd() * qs.length)], rel: [-2, -1, 0, 1][Math.floor(rnd() * 4)], chi: [1, 0.5, 0.2][Math.floor(rnd() * 3)] }); return o; };
    const t0 = Math.round(rnd() * 100) / 100;
    const init = mkObs();
    const s = M.init(t0, init, 1);
    const steps = [];
    let t = t0;
    const nSteps = 1 + Math.floor(rnd() * 5);
    const snap = () => ({ S: s.S, D: s.D, tLast: s.last, due: s.next, n: s.n, lapses: s.lapses, relearning: !!s.relearning, exposures: s.exposures });
    const first = snap();
    for (let i = 0; i < nSteps; i++) {
      t = t + Math.round(rnd() * 4000) / 100;
      const obs = mkObs();
      M.update(s, t, obs);
      steps.push({ t, obs, after: snap() });
    }
    out.push({ Imax, t0, init, first, steps });
  }
}
const text = JSON.stringify(out, (k, v) => (typeof v === 'number' && !Number.isInteger(v) ? Number(v.toPrecision(13)) : v));
if (process.argv.includes('--write')) {
  writeFileSync(FIXTURE, text);
  console.log('escrito', FIXTURE);
} else {
  const current = readFileSync(FIXTURE, 'utf8');
  if (current !== text) {
    console.error('srs2-golden.json NO coincide con el simulador');
    process.exit(1);
  }
  console.log(`srs2-golden.json = simulador (${out.length} historiales, ${text.length} bytes)`);
}
