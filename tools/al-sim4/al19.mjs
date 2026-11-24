// Rev. 4: AL19 (I_max dinámico durante la deuda). Uso: node al19.mjs <escenario> <variante> <verdad>  → una línea JSON
// Presupuesto estricto (ninguna sesión supera B), 730 días con instantánea al día 365, semillas 1–3, FSRS-4.5 (pesos de weights3.json).
import fs from 'fs'; import { simulate4, slope } from './sim4.mjs';
const [sc, va, g] = process.argv.slice(2);
const W = JSON.parse(fs.readFileSync('weights3.json', 'utf8'));
const B = (v) => () => v;
export const SC = {
  F1: { label: 'Sigue la recomendación, B 75 (D1)', o: { budget: B(75) } },
  F2: { label: 'Sigue; miles de vencimientos: B 300 días 0–179, después 75 (D4)', o: { budget: (d) => (d < 180 ? 300 : 75) }, resume: 180 },
  F3: { label: 'Sigue; ausencia días 180–359 (D5b)', o: { budget: B(75), studies: (d) => d < 180 || d >= 360 }, resume: 360 },
  X1: { label: 'Fuerza 8 lecciones/día (D2)', o: { budget: B(75), forcedNew: 8 } },
  X2: { label: 'Fuerza 8/día hasta el día 180 (D2b)', o: { budget: B(75), forcedNew: 8, newUntil: 180 }, resume: 180 },
  X3: { label: 'Fuerza 4 lecciones/día (moderado)', o: { budget: B(75), forcedNew: 4 } },
};
const prop = { Imax: 90, enterThr: 1, enterDays: 7, exit: 'debt0', exitDays: 7, onExit: 'keep', sMode: 'follow' };
export const VA = {
  V0: { label: 'Sin AL19 (`I_max` 45)', o: {} },
  V1: { label: 'Rev. 3: entra con > 1·B 7 días, sale con 0 vencimientos en el día', o: { imaxBoost: { after: 7, Imax: 90 } } },
  V2: { label: '**Propuesta rev. 4:** entra > 1·B 7 días; sale con deuda 0 7 días; vencimientos conservados; `S_max` sigue al tope activo', o: { imaxBoost: prop } },
  V3: { label: 'Salida antes: ≤ 0,5·B 7 días', o: { imaxBoost: { ...prop, exit: 'items', exitThr: 0.5 } } },
  V4: { label: 'Sin histéresis: entra > 1·B 1 día, sale con deuda 0 1 día', o: { imaxBoost: { ...prop, enterDays: 1, exitDays: 1 } } },
  V5: { label: 'Al salir, se adelantan los vencimientos a `último + 45`', o: { imaxBoost: { ...prop, onExit: 'pull' } } },
  V6: { label: '`S` sin tope (sólo se topa el intervalo)', o: { imaxBoost: { ...prop, sMode: 'free' } } },
  V7: { label: '`I_max` 90 fijo', o: { P: { Imax: 90 } } },
  V8: { label: '**Propuesta rev. 4:** entra con > 1·B 14 días de estudio y sin bajar 25 %; sale con deuda 0 7 días; sin lecciones mientras rige 90; vencimientos conservados', o: { imaxBoost: { ...prop, enterDays: 14, enterRatio: 0.75, freezeNew: true } } },
  V9: { label: 'V8 con `S` sin tope (sólo se topa el intervalo)', o: { imaxBoost: { ...prop, enterDays: 14, enterRatio: 0.75, freezeNew: true, sMode: 'free' } } },
  V11: { label: '**Propuesta rev. 4:** V8 + salida sólo si además la carga proyectada con 45 días ≤ 0,8·B', o: { imaxBoost: { ...prop, enterDays: 14, enterRatio: 0.75, freezeNew: true, exitLoad: 0.8 } } },
  V12: { label: 'V11 con `S` sin tope', o: { imaxBoost: { ...prop, enterDays: 14, enterRatio: 0.75, freezeNew: true, exitLoad: 0.8, sMode: 'free' } } },
  V10: { label: 'V8 sin congelar lecciones', o: { imaxBoost: { ...prop, enterDays: 14, enterRatio: 0.75 } } },
};
if (sc) {
  const S0 = SC[sc], V0 = VA[va];
  const rs = [1, 2, 3].map((seed) => simulate4({ days: 730, snapDay: 365, gtName: g, seed, ver: '4.5', w: W['4.5|' + g], strict: true, ...S0.o, ...V0.o, P: { ...(V0.o.P || {}) } }));
  const avg = (f) => rs.reduce((a, x) => a + f(x), 0) / rs.length;
  const win = (a, f, t) => a.slice(f, t).reduce((x, y) => x + y, 0) / (t - f);
  const sd = (x, f, t) => x.S.study.slice(f, t).reduce((a, b) => a + b, 0);
  const res = S0.resume ?? null;
  const clear = (x) => { if (res === null) return null; for (let d = res; d < 730; d++) if (x.S.study[d] && x.S.debt[d] === 0) return d - res; return null; };
  const out = {
    sc, va, g,
    units365: avg((x) => x.snap.units), units730: avg((x) => x.units), ret365: avg((x) => x.snap.ret), ret730: avg((x) => x.ret),
    debtY1: avg((x) => win(x.S.debt, 0, 365)), debtY2: avg((x) => win(x.S.debt, 365, 730)), debt365: avg((x) => x.S.debt[364]), debt730: avg((x) => x.S.debt[729]),
    maxDebt: avg((x) => Math.max(...x.S.debt)), slope180: avg((x) => slope(x.S.debt, 550, 730)), slope365: avg((x) => slope(x.S.debt, 365, 730)),
    boostY1: avg((x) => x.S.boosted.slice(0, 365).filter((b, i) => b && x.S.study[i]).length / Math.max(1, sd(x, 0, 365))), boostY2: avg((x) => x.S.boosted.slice(365).filter((b, i) => b && x.S.study[365 + i]).length / Math.max(1, sd(x, 365, 730))),
    entries: avg((x) => x.entries), recN: avg((x) => x.S.recallReview[0][1] / Math.max(1, x.S.recallReview[0][0])), recB: avg((x) => (x.S.recallReview[1][0] ? x.S.recallReview[1][1] / x.S.recallReview[1][0] : NaN)),
    reviews: avg((x) => x.S.recallReview[0][0] + x.S.recallReview[1][0]),
    clear: rs.map(clear), noNew: avg((x) => x.S.newU.filter((n, i) => x.S.study[i] && n === 0).length / sd(x, 0, 730)), meanS: avg((x) => x.meanS), overB: rs.reduce((a, x) => a + x.A.overB, 0),
  };
  console.log(JSON.stringify(out));
}
