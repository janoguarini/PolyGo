// srs-2.0.0, revisión 2 del diseño: agregación con evidencia negativa no diluible y estado inicial
// como actualización desde un estado virtual. Función pura (salvo el objeto de estado que muta).
export const AL2_DEFAULT = {
  h0: 2.0, d0: 0.5, m1a: 4.0, m1b: 2.4, b: 0.15, pref: 0.9, psiMax: 3,
  l0: 0.3, l1: 0.7, gamma: 0.8, hmin: 0.5, relearn: 1,
  etaF: 0.2, etaS: 0.05, mu: 0.05, pstar: 0.85, Imax: 180, fuzz: 0.05,
  kappa: { '-2': 0.25, '-1': 0.5, '0': 1, '1': 1 }, psiUp: 0.5, contr: 0.5,
  floorLo: 0.6, floorHi: 1.0, agg: 'rev2', curve: 'exp', c: 0.5,
};
const log2 = Math.log2;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export function hash01(i, n) { let x = (i * 2654435761 + n * 40503) >>> 0; x ^= x >>> 13; x = Math.imul(x, 0x5bd1e995) >>> 0; x ^= x >>> 15; return (x >>> 0) / 4294967296; }

// obs: [{ q (0..1), rel (−2,−1,0,1), chi (0..1, parte de la culpa) }]
export function aggregate(obs, P) {
  const kap = (r) => P.kappa[String(Math.max(-2, Math.min(1, r)))];
  const psiE = (r) => (r > 0 ? P.psiUp : 1);
  const ramp = (z) => clamp((z - P.floorLo) / (P.floorHi - P.floorLo), 0, 1);
  if (!obs.length) return { A: 0, zm: 0, F: 0, floorK: 0 };
  if (P.agg === 'first') return aggregate([obs[0]], { ...P, agg: 'rev2' });
  if (P.agg === 'rev1') { // media ponderada de la revisión 1 (diluye errores)
    let sw = 0, swq = 0, wmF = 0, kq = 0, q5 = 0, fk = 0;
    for (const o of obs) {
      const w = o.q >= 0.5 ? kap(o.rel) : psiE(o.rel) * o.chi;
      sw += w; swq += w * o.q;
      if (o.q >= 0.5) { kq += kap(o.rel) * o.q; q5 += o.q; if (o.rel >= -1) fk = Math.max(fk, kap(o.rel) * ramp((o.q - 0.5) / 0.5)); } else wmF = Math.max(wmF, w);
    }
    const g = swq / sw;
    if (g >= 0.5) { const z = (g - 0.5) / 0.5; return { A: (kq / q5) * z, zm: 0, F: 0, floorK: z >= 0.8 ? fk : 0 }; }
    const zz = ((0.5 - g) / 0.5) * wmF; return { A: 0, zm: zz, F: zz, floorK: 0 };
  }
  let A = 0, floorK = 0, prodFail = 1;
  const succ = [], fail = [];
  for (const o of obs) {
    if (o.q >= 0.5) {
      const z = (o.q - 0.5) / 0.5;
      A = Math.max(A, kap(o.rel) * z);
      if (o.rel >= -1) floorK = Math.max(floorK, kap(o.rel) * ramp(z));
      if (z > 0) succ.push(o);
    } else {
      const zf = (0.5 - o.q) / 0.5;
      const phi = psiE(o.rel) * o.chi * zf;
      prodFail *= 1 - phi;
      fail.push(o);
    }
  }
  let F = 1 - prodFail;
  if (P.agg === 'and' && fail.length) F = 1; // variante extrema: cualquier error es error pleno
  const contradicted = fail.length > 0 && fail.every((f) => succ.some((s) => s.rel >= f.rel));
  const zm = F * (contradicted && P.agg !== 'and' ? P.contr : 1);
  return { A, zm, F, floorK };
}

export function makeAL2(P = AL2_DEFAULT, name = 'AL2') {
  const K = Math.pow(2, 1 / P.c) - 1;
  const pc = (d, h) => (P.curve === 'pow' ? Math.pow(1 + (K * d) / h, -P.c) : Math.pow(2, -d / h));
  const ivf = P.curve === 'pow' ? (Math.pow(P.pstar, -1 / P.c) - 1) / K : log2(1 / P.pstar);
  const hmax = P.Imax / ivf;
  const interval = (h) => h * ivf;
  const al = {
    name, P, hmax,
    p(s, t) { return pc(t - s.last, s.h); },
    pPred(s, t) { return al.p(s, t); },
    init(t, obs, id = 0) {
      const s = { h: P.h0, d: P.d0, last: t, next: t, n: 0, lapses: 0, id, relearning: false };
      al.update(s, t, obs);
      return s;
    },
    update(s, t, obs) {
      const delta = Math.max(0, t - s.last);
      const p = pc(delta, s.h);
      const psiP = Math.min(P.psiMax, (1 - p) / (1 - P.pref));
      const info = Math.min(1, psiP);
      const { A, zm, F, floorK } = aggregate(obs, P);
      const m = 1 + (P.m1a - P.m1b * s.d - 1) * Math.pow(Math.max(s.h, 1), -P.b);
      const G = 1 + A * (m - 1) * psiP;
      const supp = Math.max(0, 1 - 2 * (P.suppRaw === false ? zm : F));
      const Geff = 1 + (G - 1) * supp;
      const l = P.l0 + (P.l1 - P.l0) * (1 - p);
      const C = zm > 0 ? Math.pow(l * Math.min(1, Math.pow(s.h, P.gamma - 1)), zm) : 1;
      let h = s.h * Geff * C;
      h = Math.max(h, delta * floorK * supp);
      h = clamp(h, P.hmin, hmax);
      let d = s.d - P.etaS * A * info * supp + P.etaF * zm * (0.5 + 0.5 * p);
      if (zm > 0) d = d + P.mu * Math.max(0, P.d0 - d);
      else d = d - P.mu * info * Math.max(0, d - P.d0);
      s.d = clamp(d, 0, 1);
      const before = { h: s.h, next: s.next };
      s.h = h;
      s.last = t;
      s.n++;
      s.relearning = zm >= 0.5;
      if (s.relearning) s.lapses++;
      const fz = 1 + P.fuzz * (2 * hash01(s.id, s.n) - 1);
      const I = Math.min(P.Imax, interval(s.h) * fz);
      if (zm === 0) s.next = Math.max(before.next, t + I);
      else if (s.relearning) s.next = t + Math.min(I, P.relearn);
      else s.next = t + I;
      s.lastAgg = { A, zm, F, p, hBefore: before.h };
      return s;
    },
    isDue(s, t, eod) { return s.next <= eod; },
  };
  return al;
}
