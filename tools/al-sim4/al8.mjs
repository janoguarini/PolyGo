// Rev. 4: AL8 (plazas para puntos débiles y sondeos). Uso: node al8.mjs <escenario> <política> <verdad> → una línea JSON
// Presupuesto estricto; candidatos = débiles del SRS (D ≥ 6,85 o 2 reaprendizajes en 30 d) intercalados con sondeos
// (unidades sin observación informativa en L desde hace > 60 días: «sin evidencia» para el motor). 730 días, semillas 1–3.
import fs from 'fs'; import { simulate4 } from './sim4.mjs';
const [sc, po, g] = process.argv.slice(2);
const W = JSON.parse(fs.readFileSync('weights3.json', 'utf8'));
const B = (v) => () => v;
export const SC = {
  W1: { label: 'Sigue la recomendación (D1)', o: { budget: B(75) } },
  W2: { label: 'Presupuesto saturado: fuerza 8 lecciones/día (D2)', o: { budget: B(75), forcedNew: 8 } },
  W3: { label: 'Miles de vencidos (D4)', o: { budget: (d) => (d < 180 ? 300 : 75) } },
  W4: { label: '60 % muy difíciles, θ −0,5 (D3b)', o: { budget: B(75), hardFrac: 0.6, hardShift: 2.0, theta: -0.5 } },
  W5: { label: 'Sin evidencia en L: 1 ejercicio por unidad, 30 % difíciles, θ −0,3', o: { budget: B(75), kDist: [1, 0, 0], hardFrac: 0.3, theta: -0.3 } },
};
export const PO = { none: { label: 'Ninguna plaza (sólo lugares libres)', slotPolicy: 'none' }, weekly: { label: 'Una plaza mínima semanal', slotPolicy: 'weekly' }, daily: { label: 'Una plaza mínima diaria', slotPolicy: 'daily' }, weeklyAlt: { label: 'Semanal, alterna débil/sondeo', slotPolicy: 'weekly', slotAlt: true }, dailyAlt: { label: 'Diaria, alterna débil/sondeo', slotPolicy: 'daily', slotAlt: true } };
if (sc) {
  const rs = [1, 2, 3].map((seed) => simulate4({ days: 730, gtName: g, seed, ver: '4.5', w: W['4.5|' + g], strict: true, probes: true, slotPolicy: PO[po].slotPolicy, slotAlt: !!PO[po].slotAlt, ...SC[sc].o }));
  const avg = (f) => rs.reduce((a, x) => a + f(x), 0) / rs.length;
  const sd = (x) => x.S.study.reduce((a, b) => a + b, 0);
  const longest = (x) => { let best = 0, cur = 0; for (let i = 0; i < x.S.study.length; i++) { if (!x.S.study[i]) continue; if (x.S.weakCand[i] > 0 && x.S.weakUsed[i] + x.S.probeUsed[i] === 0) { cur++; best = Math.max(best, cur); } else cur = 0; } return best; };
  console.log(JSON.stringify({ sc, po, g,
    units: avg((x) => x.units), ret: avg((x) => x.ret), retHard: avg((x) => x.retHard), debt: avg((x) => x.S.debt.reduce((a, b) => a + b, 0) / 730), debtY2: avg((x) => x.S.debt.slice(365).reduce((a, b) => a + b, 0) / 365),
    weakDay: avg((x) => x.S.weakUsed.reduce((a, b) => a + b, 0) / sd(x)), probeDay: avg((x) => x.S.probeUsed.reduce((a, b) => a + b, 0) / sd(x)),
    newEv30: avg((x) => (x.S.newEvidence / 730) * 30), covL: avg((x) => x.covL), starve: avg(longest), daysServed: avg((x) => x.S.study.filter((s, i) => s && x.S.weakUsed[i] + x.S.probeUsed[i] > 0).length / sd(x)),
    overB: rs.reduce((a, x) => a + x.A.overB, 0), reviewOverB: rs.reduce((a, x) => a + (x.A.reviewOverB || 0), 0), maxItemsMinusB: avg((x) => Math.max(...x.S.items.map((v, i) => (x.S.study[i] ? v : 0)).map((v, i) => v - (i < 180 && sc === 'W3' ? 300 : 75)))),
  }));
}
