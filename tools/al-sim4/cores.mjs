// Revisión 3: núcleos de memoria FSRS-4.5, FSRS-6 y FSRS-7, escritos a partir de las fórmulas
// publicadas (srs-benchmark, commit 4ddb9fd, models/fsrs_v4dot5.py, fsrs_v5.py, fsrs_v6.py,
// fsrs_v7.py; wiki awesome-fsrs «The Algorithm»). Sólo dos grados: 1 (Again) y 3 (Good).
// Todo en días fraccionarios. Ningún código copiado: reimplementación de las ecuaciones.
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

export const W45 = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
export const W6 = [0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542];
export const W7 = [0.1104, 2.2395, 3.9221, 11.7841, 6.1686, 0.6457, 3.6807, 1.9795, 0.0, 1.3826, 0.7024, 0.5999, 0.8146, 0.6398, 1.0, 1.3207, 0.6707, 3.8668, 0.4416, 0.0934, 1.8631, 0.6162, 1.0869, 0.1567, 0.0801, 0.2421, 0.9464, 0.1433, 0.7145, 0.0, 0.5667, 0.3734, 0.5333, 0.3048];

// ---- límites (los de los optimizadores públicos) y pesos libres con dos grados ----
export const BOUNDS = {
  '4.5': { 0: [0.01, 100], 2: [0.01, 100], 4: [1, 10], 5: [0.001, 4], 6: [0.001, 4], 7: [0.001, 0.75], 8: [0, 4.5], 9: [0, 0.8], 10: [0.001, 3.5], 11: [0.001, 5], 12: [0.001, 0.25], 13: [0.001, 0.9], 14: [0, 4] },
  '6': { 0: [0.001, 100], 2: [0.001, 100], 4: [1, 10], 5: [0.001, 4], 6: [0.001, 4], 7: [0.001, 0.75], 8: [0, 4.5], 9: [0, 0.8], 10: [0.001, 3.5], 11: [0.001, 5], 12: [0.001, 0.25], 13: [0.001, 0.9], 14: [0, 4], 17: [0, 2], 18: [0, 2], 19: [0, 0.8], 20: [0.1, 0.8] },
  '7': (() => { const lo = [0.0001, 0.0001, 0.0001, 0.0001, 1.0, 0.001, 0.1, 0.0, 0.0, 0.3, 0.01, 0.1, 0.0, 0.0, 1.0, 0.0, 0.0, 0.5, 0.001, 0.001, 0.0, 0.0, 1.0, 0.01, 0.01, 0.2, 0.5, 0.01, 0.1, 0.0, 0.1, 0.0, 0.0, 0.0]; const hi = [50.0, 100.0, 100.0, 100.0, 10.0, 4.0, 4.0, 4.0, 1.2, 3.0, 1.5, 1.0, 3.5, 1.0, 7.0, 4.0, 2.0, 6.0, 1.5, 1.0, 5.0, 1.0, 7.0, 0.25, 0.95, 0.85, 0.99, 1.0, 1.0, 0.9, 1.1, 1.0, 0.6, 0.6]; const o = {}; for (let i = 0; i < 34; i++) o[i] = [lo[i], hi[i]]; return o; })(),
};
// Con grados 1/3 no intervienen: inicial Hard/Easy, penalización Hard y bonificación Easy.
export const FREE = {
  '4.5': [0, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  '6': [0, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20],
  '7': [0, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
};
export const DEFAULTS = { '4.5': W45, '6': W6, '7': W7 };
export function clampW(ver, w) {
  const B = BOUNDS[ver]; const v = w.map((x, k) => (B[k] ? clamp(x, B[k][0], B[k][1]) : x));
  if (ver === '7') { v[1] = Math.max(v[1], v[0]); v[2] = Math.max(v[2], v[1]); v[3] = Math.max(v[3], v[2]); v[26] = Math.max(v[26], v[25]); }
  return v;
}

// Interfaz de un núcleo (estado {S, Ss?, D}):
//   init(G) · R(st, Δ) · good(st, R, Δ) → {S, Ss} · again(st, R, Δ) → {S, Ss} · dNext(D, G, R) · interval(st, r) · sHalf(Δ, D)
export function core45(w) {
  const F = 19 / 81, DEC = -0.5;
  const D0 = (G) => clamp(w[4] - (G - 3) * w[5], 1, 10);
  const Rf = (S, d) => Math.pow(1 + (F * d) / S, DEC);
  return {
    ver: '4.5', w, nS: 1, D0,
    init: (G) => ({ S: G >= 3 ? w[2] : w[0], D: D0(G) }),
    R: (st, d) => Rf(st.S, Math.max(0, d)),
    good: (st, R) => ({ S: st.S * (1 + Math.exp(w[8]) * (11 - st.D) * Math.pow(st.S, -w[9]) * (Math.exp(w[10] * (1 - R)) - 1)) }),
    again: (st, R) => ({ S: Math.min(st.S, w[11] * Math.pow(st.D, -w[12]) * (Math.pow(st.S + 1, w[13]) - 1) * Math.exp(w[14] * (1 - R))) }),
    dNext: (D, G) => clamp(w[7] * D0(3) + (1 - w[7]) * (D - w[6] * (G - 3)), 1, 10),
    interval: (st, r) => (st.S / F) * (Math.pow(r, 1 / DEC) - 1),
    sHalf: (d) => (F * d) / (Math.pow(0.5, 1 / DEC) - 1),
  };
}
export function core6(w) {
  const dec = -w[20], fac = Math.pow(0.9, 1 / dec) - 1;
  const D0 = (G) => w[4] - Math.exp(w[5] * (G - 1)) + 1;
  const Rf = (S, d) => Math.pow(1 + (fac * d) / S, dec);
  const lin = (dd, D) => (dd * (10 - D)) / 9;
  return {
    ver: '6', w, nS: 1, D0: (G) => clamp(D0(G), 1, 10),
    init: (G) => ({ S: G >= 3 ? w[2] : w[0], D: clamp(D0(G), 1, 10) }),
    R: (st, d) => Rf(st.S, Math.max(0, d)),
    good: (st, R, d) => {
      if (d < 1) { const sinc = Math.exp(w[17] * (0 + w[18])) * Math.pow(st.S, -w[19]); return { S: st.S * Math.max(1, sinc) }; }
      return { S: st.S * (1 + Math.exp(w[8]) * (11 - st.D) * Math.pow(st.S, -w[9]) * (Math.exp(w[10] * (1 - R)) - 1)) };
    },
    again: (st, R, d) => {
      if (d < 1) { const sinc = Math.exp(w[17] * (-2 + w[18])) * Math.pow(st.S, -w[19]); return { S: st.S * sinc }; }
      const sf = w[11] * Math.pow(st.D, -w[12]) * (Math.pow(st.S + 1, w[13]) - 1) * Math.exp(w[14] * (1 - R));
      return { S: Math.min(sf, st.S / Math.exp(w[17] * w[18])) };
    },
    dNext: (D, G) => { const Dp = D + lin(-w[6] * (G - 3), D); return clamp(w[7] * D0(4) + (1 - w[7]) * Dp, 1, 10); },
    interval: (st, r) => (st.S / fac) * (Math.pow(r, 1 / dec) - 1),
    sHalf: (d) => (fac * d) / (Math.pow(0.5, 1 / dec) - 1),
  };
}
export function core7(w) {
  const D0 = (G) => w[4] - Math.exp(w[5] * (G - 1)) + 1;
  const r1f = (t, ss) => { const dm = clamp(w[23] * Math.pow(ss, w[33] - 0.3), 0.01, 0.95); const d1 = -dm; const f1 = Math.exp(Math.min(60, Math.log(w[25]) / d1)) - 1; return Math.pow((t / ss) * f1 + 1, d1); };
  const Rmix = (t, S, Ss, D) => {
    t = Math.max(0, t);
    const r1 = r1f(t, Ss);
    const d2 = -clamp(w[24], 0.01, 0.95); const f2 = Math.pow(w[26], 1 / d2) - 1; const dts = Math.exp((D - 5) * (w[32] - 0.3));
    const r2 = Math.pow((t / S) * f2 * dts + 1, d2);
    const w1 = w[27] * Math.pow(Ss, -w[29]); const w2 = w[28] * Math.pow(S, w[30]) * Math.exp((D - 5) * (w[31] - 0.5));
    return ((w1 * r1 + w2 * r2) / (w1 + w2)) * (1 - 2e-5) + 1e-5;
  };
  const nextS = (S, D, r, success, st0) => {
    const fail = w[st0 + 3] * (Math.pow(S + 1, w[st0 + 4]) - 1) * Math.exp((1 - r) * w[st0 + 5]);
    const pls = Math.min(S, fail);
    if (!success) return pls;
    const sinc = Math.exp(w[st0] - 1.5) * (11 - D) * Math.pow(S, -w[st0 + 1]) * (Math.exp((1 - r) * w[st0 + 2]) - 1) + 1;
    return Math.max(pls, S * sinc);
  };
  const lin = (dd, D) => (dd * (10 - D)) / 9;
  return {
    ver: '7', w, nS: 2, D0: (G) => clamp(D0(G), 1, 10),
    init: (G) => { const S = G >= 3 ? w[2] : w[0]; return { S, Ss: 0.8 * S, D: clamp(D0(G), 1, 10) }; },
    R: (st, d) => Rmix(d, st.S, st.Ss, st.D),
    good: (st, R, d) => ({ S: nextS(st.S, st.D, R, true, 7), Ss: nextS(st.Ss, st.D, r1f(Math.max(0, d), st.Ss), true, 15) }),
    again: (st, R, d) => { const S = nextS(st.S, st.D, R, false, 7); const ss = nextS(st.Ss, st.D, r1f(Math.max(0, d), st.Ss), false, 15); return { S, Ss: Math.min(ss, 0.8 * S) }; },
    dNext: (D, G, R) => { let dd = -w[6] * (G - 3); if (G === 1) dd *= R + 0.1; const Dp = D + lin(dd, D); return clamp(0.01 * D0(4) + 0.99 * Dp, 1, 10); },
    interval: (st, r) => { // sin forma cerrada: bisección sobre la curva mixta (monótona decreciente)
      let lo = 0, hi = 1; while (Rmix(hi, st.S, st.Ss, st.D) > r && hi < 1e6) hi *= 2;
      for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (Rmix(m, st.S, st.Ss, st.D) > r) lo = m; else hi = m; }
      return (lo + hi) / 2;
    },
    sHalf: null, // la curva mixta no tiene un S equivalente cerrado: el piso no se aplica
  };
}
export const makeCore = (ver, w) => (ver === '4.5' ? core45(w) : ver === '6' ? core6(w) : core7(w));

// Predictor puro del núcleo (sin capa), grados 1/3, para el ajuste comparable.
export function predictor(ver, w) {
  const c = makeCore(ver, w);
  return {
    name: 'FSRS-' + ver,
    init(t, g) { const s = { ...c.init(g >= 0.5 ? 3 : 1), last: t }; return s; },
    update(s, t, g) {
      const d = t - s.last, R = c.R(s, d), G = g >= 0.5 ? 3 : 1;
      const n = G === 3 ? c.good(s, R, d) : c.again(s, R, d);
      s.D = c.dNext(s.D, G, R); s.S = clamp(n.S, 0.001, 36500); if (c.nS === 2) s.Ss = clamp(n.Ss, 0.001, 36500); s.last = t;
    },
    pPred: (s, t) => c.R(s, t - s.last),
    core: c,
  };
}
