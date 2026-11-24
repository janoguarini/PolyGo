// Rev. 3: comparación justa FSRS-4.5 / FSRS-6 / FSRS-7 con el protocolo de 4.3 (mismos registros
// neutros, mismo optimizador Nelder–Mead con presupuesto proporcional a la dimensión, misma pérdida,
// usuarios retenidos, tres verdades, transferencia). Sin regularización L2 hacia los pesos públicos
// (sería un criterio distinto por versión).
import fs from 'fs';
import { GTA, GTB } from './sim.mjs';
import { rng, normal } from './util.mjs';
import { predictor, DEFAULTS, FREE, clampW } from './cores.mjs';
const DAY = 86400;
export const GTC = {
  make(b, pp, theta) { return { b, pp, theta, as: 0, last: null }; },
  m(u, t) { if (u.last === null) return -1; const d = Math.max(0, (t - u.last) / DAY); const tau = 10 * (1 + 4 * u.as); return 0.6 * Math.exp(-d / 0.5) + u.as * Math.exp(-d / tau); },
  pRaw(u, t, shift) { return 1 / (1 + Math.exp(-(this.m(u, t) - 0.45 - u.b * 0.15 + u.theta * 0.1 - shift) / 0.12)); },
  p(u, t, rung) { if (u.last === null) return rung === 'R' ? 0.25 : 0; if (rung === 'L') return this.pRaw(u, t, 0.15 * u.pp); if (rung === 'G') return this.pRaw(u, t, -0.08); return 0.25 + 0.75 * this.pRaw(u, t, -0.2); },
  present(u, t, rung) { const w = { R: 0.4, G: 0.7, L: 1 }[rung]; const p = u.last === null ? 0 : this.pRaw(u, t, 0); u.as = Math.min(3, u.as + 0.5 * w * (1 - p)); u.last = t; if (rung === 'L') u.pp = Math.max(0, u.pp - 0.06); },
};
export function makeLogs(gt, users, seed, unitsPer = 120, reviews = 8, lo = 0.5, hi = 60) {
  const r = rng(seed); const logs = [];
  for (let k = 0; k < users; k++) {
    const theta = normal(r) * 0.3;
    for (let j = 0; j < unitsPer; j++) {
      const u = gt.make(normal(r) * 0.35, 0, theta);
      let t = Math.floor(r() * 60) * DAY + 18 * 3600;
      gt.present(u, t, 'R');
      const okL = r() < gt.p(u, t + 300, 'L'); if (!okL && gt.fail) gt.fail(u, t + 300); gt.present(u, t + 300, 'L');
      const ev = [{ t: (t + 300) / DAY, y: okL ? 1 : 0 }]; t += 300;
      for (let i = 0; i < reviews; i++) {
        const gap = Math.exp(Math.log(lo) + r() * (Math.log(hi) - Math.log(lo))); t += gap * DAY;
        const ok = r() < gt.p(u, t, 'L'); if (!ok && gt.fail) gt.fail(u, t); gt.present(u, t, 'L'); if (!ok) gt.present(u, t + 60, 'L');
        ev.push({ t: t / DAY, y: ok ? 1 : 0 });
      }
      logs.push({ user: k, ev });
    }
  }
  return logs;
}
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export function predLoss(model, logs) {
  let ll = 0, n = 0; const bins = Array.from({ length: 10 }, () => [0, 0, 0]);
  for (const { ev } of logs) {
    const s = model.init(ev[0].t, ev[0].y);
    for (let i = 1; i < ev.length; i++) {
      let p = model.pPred(s, ev[i].t); if (!Number.isFinite(p)) p = 0.5;
      const q = clamp(p, 1e-4, 1 - 1e-4);
      ll -= ev[i].y * Math.log(q) + (1 - ev[i].y) * Math.log(1 - q); n++;
      const bi = Math.min(9, Math.floor(q * 10)); bins[bi][0] += q; bins[bi][1] += ev[i].y; bins[bi][2]++;
      model.update(s, ev[i].t, ev[i].y);
    }
  }
  const ece = bins.reduce((a, [sp, sy, c]) => a + (c ? Math.abs(sp - sy) : 0), 0) / n;
  return { ll: ll / n, ece, n };
}
function nm(f, x0, step, iters) {
  const n = x0.length; let S = [x0.slice()];
  for (let i = 0; i < n; i++) { const x = x0.slice(); x[i] += step[i]; S.push(x); }
  let F = S.map(f);
  for (let it = 0; it < iters; it++) {
    const idx = [...F.keys()].sort((a, b) => F[a] - F[b]); S = idx.map((i) => S[i]); F = idx.map((i) => F[i]);
    const c = Array(n).fill(0); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c[j] += S[i][j] / n;
    const xr = c.map((v, j) => v + (v - S[n][j])); const fr = f(xr);
    if (fr < F[0]) { const xe = c.map((v, j) => v + 2 * (v - S[n][j])); const fe = f(xe); if (fe < fr) { S[n] = xe; F[n] = fe; } else { S[n] = xr; F[n] = fr; } }
    else if (fr < F[n - 1]) { S[n] = xr; F[n] = fr; }
    else { const xc = c.map((v, j) => v + 0.5 * (S[n][j] - v)); const fc = f(xc); if (fc < F[n]) { S[n] = xc; F[n] = fc; } else { for (let i = 1; i <= n; i++) { S[i] = S[i].map((v, j) => S[0][j] + 0.5 * (v - S[0][j])); F[i] = f(S[i]); } } }
  }
  const b = F.indexOf(Math.min(...F)); return { x: S[b], f: F[b] };
}
export function fit(ver, logs, perDim = 70, restarts = 2) {
  const W0 = DEFAULTS[ver], free = FREE[ver];
  const toW = (v) => { const w = W0.slice(); free.forEach((k, i) => { w[k] = v[i]; }); return w; };
  const obj = (v) => { const w = toW(v); const wc = clampW(ver, w); const pen = w.reduce((a, x, k) => a + (x - wc[k]) ** 2, 0); const r = predLoss(predictor(ver, wc), logs).ll; return (Number.isFinite(r) ? r : 10) + pen; };
  let x = free.map((k) => W0[k]); let best = Infinity;
  for (let rs = 0; rs < restarts; rs++) { const r = nm(obj, x, x.map((v) => Math.max(0.05, Math.abs(v) * 0.3)), perDim * free.length); if (r.f < best) { best = r.f; x = r.x; } }
  return { w: clampW(ver, toW(x)), train: best, nfree: free.length };
}
const GTS = { 'GT-A': GTA, 'GT-B': GTB, 'GT-C': GTC };
const which = process.argv[2];
const VERS = ['4.5', '6', '7'];
if (which === 'pred') {
  const data = {}; for (const [n, gt] of Object.entries(GTS)) data[n] = { train: makeLogs(gt, 40, 11), test: makeLogs(gt, 20, 99) };
  const W = {}; const t0 = Date.now();
  for (const ver of VERS) for (const g of Object.keys(GTS)) { const r = fit(ver, data[g].train); W[`${ver}|${g}`] = r.w; console.error(`ajuste ${ver} ${g}: train ${r.train.toFixed(4)} libres ${r.nfree} (${((Date.now() - t0) / 1000).toFixed(0)} s)`); }
  fs.writeFileSync('weights3.json', JSON.stringify(W));
  const base = {}; for (const g of Object.keys(GTS)) { const ys = data[g].test.flatMap((l) => l.ev.slice(1).map((e) => e.y)); const m = ys.reduce((a, b) => a + b, 0) / ys.length; base[g] = -(m * Math.log(m) + (1 - m) * Math.log(1 - m)); }
  console.log('| modelo | ' + Object.keys(GTS).join(' | ') + ' |'); console.log('| constante | ' + Object.keys(GTS).map((g) => base[g].toFixed(4)).join(' | ') + ' |');
  for (const ver of VERS) console.log(`| FSRS-${ver} pesos públicos | ` + Object.keys(GTS).map((g) => { const r = predLoss(predictor(ver, DEFAULTS[ver]), data[g].test); return `${r.ll.toFixed(4)} / ${r.ece.toFixed(3)}`; }).join(' | ') + ' |');
  for (const ver of VERS) console.log(`| FSRS-${ver} ajustado en la misma verdad | ` + Object.keys(GTS).map((g) => { const r = predLoss(predictor(ver, W[`${ver}|${g}`]), data[g].test); return `${r.ll.toFixed(4)} / ${r.ece.toFixed(3)}`; }).join(' | ') + ' |');
  console.log('\ntransferencia | A→B | A→C | B→A | B→C | C→A | C→B');
  for (const ver of VERS) { const cells = []; for (const [a, b] of [['GT-A', 'GT-B'], ['GT-A', 'GT-C'], ['GT-B', 'GT-A'], ['GT-B', 'GT-C'], ['GT-C', 'GT-A'], ['GT-C', 'GT-B']]) cells.push(predLoss(predictor(ver, W[`${ver}|${a}`]), data[b].test).ll.toFixed(4)); console.log(`| FSRS-${ver} | ${cells.join(' | ')} |`); }
  console.log('eventos de prueba por verdad', predLoss(predictor('4.5', DEFAULTS['4.5']), data['GT-A'].test).n);
}
if (which === 'size') {
  const test = makeLogs(GTC, 20, 99);
  console.log('| usuarios | eventos | ' + VERS.map((v) => 'FSRS-' + v).join(' | ') + ' |');
  for (const nu of [2, 5, 10]) { const tr = makeLogs(GTC, nu, 11); console.log(`| ${nu} | ${tr.length * 8} | ` + VERS.map((v) => { const r = predLoss(predictor(v, fit(v, tr).w), test); return `${r.ll.toFixed(4)} / ${r.ece.toFixed(3)}`; }).join(' | ') + ' |'); }
}
if (which === 'short') {
  // sensibilidad: registros con intervalos cortos (0,02–2 d), donde FSRS-7 debería tener ventaja
  const tr = makeLogs(GTC, 40, 11, 120, 8, 0.02, 2), te = makeLogs(GTC, 20, 99, 120, 8, 0.02, 2);
  for (const v of VERS) { const f = fit(v, tr); const r = predLoss(predictor(v, f.w), te); console.log(`| FSRS-${v} intervalos 0,02–2 d (GT-C) | ${r.ll.toFixed(4)} / ${r.ece.toFixed(3)} |`); }
}
