// Revisión 3: capa de sesión de PolyGo sobre cualquier núcleo de cores.mjs.
// Cambios frente a la rev. 2 (fsrspg.mjs):
//  N1  q = 0,5 es neutro: no es acierto ni error. Una sesión sin ninguna observación con q ≠ 0,5 es
//      una EXPOSICIÓN: no cambia S, D, t_last, due_at, escalón, n ni relearning.
//  N2  Una unidad nueva con sólo exposiciones queda «expuesta»: sin S ni D, vence al día siguiente.
//  N3  Contradicción continua: c = 1 − (1 − c0)·C, C = mín_errores máx_aciertos(escalón ≥) z.
//      Un neutro (z = 0) no puede atenuar un error.
//  N4  Reloj proporcional a la evidencia: t_last' = t_last + g·(t − t_last), g = máx(ρ, F_err),
//      ρ = máx z de los aciertos (sin κ). Con ρ o F_err = 1 es la regla de la rev. 2.
//  N5  Dificultad continua y monótona: D' = D + z⁻·(D_E − D)⁺ − info·A·supp·(D − D_G)⁺.
//  N6  Un error nunca aplaza un vencimiento futuro, y un error débil no aplaza más que la misma
//      sesión sin sus errores.
//  N7  Dispersión constante por unidad (no depende de n): continuidad exacta en el límite neutro.
//  N8  Estado inicial: S = S0(Again)·(S0(Good)/S0(Again))^(A·(1 − z⁻)).
import { hash01 } from './al2.mjs';
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const PG3 = {
  kappa: { '-2': 0.25, '-1': 0.5, '0': 1, '1': 1 }, psiUp: 0.5, contr: 0.5, floorLo: 0.6, floorHi: 1.0,
  retention: 0.85, Imax: 45, relearn: 1, fuzz: 0.05, agg: 'rev3',
};
const NEUTRAL_EPS = 1e-12;
export function aggregate3(obs, P) {
  if (P.agg === 'first' && obs.length) obs = [obs[0]];
  const kap = (r) => P.kappa[String(Math.max(-2, Math.min(1, r)))];
  const psiE = (r) => (r > 0 ? P.psiUp : 1);
  const ramp = (z) => clamp((z - P.floorLo) / (P.floorHi - P.floorLo), 0, 1);
  let A = 0, floorK = 0, rho = 0, prodFail = 1; const succ = [], fail = [];
  for (const o of obs) {
    if (o.q > 0.5 + NEUTRAL_EPS) {
      const z = (o.q - 0.5) / 0.5;
      A = Math.max(A, kap(o.rel) * z); rho = Math.max(rho, z);
      if (o.rel >= -1) floorK = Math.max(floorK, kap(o.rel) * ramp(z));
      succ.push({ rel: o.rel, z });
    } else if (o.q < 0.5 - NEUTRAL_EPS) {
      const phi = psiE(o.rel) * o.chi * ((0.5 - o.q) / 0.5);
      prodFail *= 1 - phi; fail.push(o);
    } // q = 0,5: neutro, no entra en ningún agregado
  }
  let F = 1 - prodFail;
  if (P.agg === 'and' && fail.length) F = 1;
  let c = 1;
  if (fail.length && P.agg !== 'and') {
    let C = Infinity;
    for (const f of fail) { let best = 0; for (const s of succ) if (s.rel >= f.rel) best = Math.max(best, s.z); C = Math.min(C, best); }
    c = P.contrMode === 'binary' ? (C > 0 ? P.contr : 1) : 1 - (1 - P.contr) * C;
  }
  const zm = F * c;
  const informative = A > 0 || F > 0;
  return { A, zm, F, floorK, rho, c, informative };
}

export function makePG3(core, P0 = {}, name = 'PG3-' + core.ver) {
  const P = { ...PG3, ...P0 };
  const cap = (st) => { const I = core.interval(st, P.retention); return Math.min(P.Imax, I); };
  const fz = (id) => (P.fuzzMode === 'perN' ? null : 1 + P.fuzz * (2 * hash01(id, 0) - 1));
  const ivl = (st, s) => Math.min(P.Imax, core.interval(st, P.retention) * (P.fuzzMode === 'perN' ? 1 + P.fuzz * (2 * hash01(s.id, s.n) - 1) : fz(s.id)));
  const SMAX = core.ver === '7' || P.capMode === 'interval' ? Infinity : P.Imax / core.interval({ S: 1, D: 5 }, P.retention);
  const DAYSTART = (t) => Math.floor(t) + 1; // inicio del día siguiente (día = unidad entera)
  const apply = (s, t, obs) => {
    const ag = aggregate3(obs, P);
    s.exposures = (s.exposures || 0) + 1; s.lastExposure = t;
    if (!ag.informative && P.neutral !== 'rev2') { s.lastAgg = { ...ag, exposure: true }; return s; } // N1/N2
    const { A, zm, F, floorK, rho } = ag;
    const supp = Math.max(0, 1 - 2 * F);
    if (s.S === null) { // primera actualización informativa (N8)
      const a = core.init(1), g = core.init(3);
      const x = P.neutral === 'rev2' ? 1 - zm : A * (1 - zm);
      s.S = Math.min(SMAX, a.S * Math.pow(g.S / a.S, x)); if (core.nS === 2) s.Ss = 0.8 * s.S;
      s.D = clamp(g.D + zm * (a.D - g.D), 1, 10);
      s.last = t; s.n = 1; s.relearning = zm >= 0.5; if (s.relearning) s.lapses++;
      const I = ivl(s, s);
      s.next = s.relearning ? t + Math.min(I, P.relearn) : t + I;
      s.lastAgg = { ...ag, p: 1 }; s.k = s.relearning ? 'R' : 'G';
      return s;
    }
    const d = Math.max(0, t - s.last);
    const R = core.R(s, d);
    const info = Math.min(1, (1 - R) / 0.1);
    const gd = core.good(s, R, d), ba = core.again(s, R, d);
    const interp = (cur, good, bad) => { const Ssg = cur * (1 + supp * A * (Math.max(good, cur) / cur - 1)); const Sf = Math.min(cur, bad); return [Ssg, zm > 0 ? Ssg * Math.pow(Sf / cur, zm) : Ssg]; };
    let [Sok, Snew] = interp(s.S, gd.S, ba.S);
    if (core.sHalf) { const fl = floorK * supp * core.sHalf(d); Snew = Math.max(Snew, fl); Sok = Math.max(Sok, floorK * core.sHalf(d)); }
    let Ssn = null, Ssok = null; if (core.nS === 2) [Ssok, Ssn] = interp(s.Ss, gd.Ss, ba.Ss);
    const DE = core.dNext(s.D, 1, R), DG = core.dNext(s.D, 3, R);
    let D;
    if (P.neutral === 'rev2') { // regla de la rev. 2 (sólo 4.5): para comparar
      const w = core.w; D = s.D + 2 * w[6] * zm; const T = core.D0(3);
      if (zm > 0) { if (D < T) D = w[7] * T + (1 - w[7]) * D; } else if (D > T) D = D - w[7] * info * (D - T);
    } else D = s.D + zm * Math.max(0, DE - s.D) - info * A * supp * Math.max(0, s.D - DG); // N5
    const g = P.neutral === 'rev2' ? 1 : Math.max(rho, F);
    const prevNext = s.next;
    void Sok; void Ssok;
    s.S = clamp(Snew, 0.01, Math.min(36500, SMAX)); if (core.nS === 2) s.Ss = clamp(Ssn, 0.01, 36500);
    s.D = clamp(D, 1, 10); s.n++; s.relearning = zm >= 0.5; if (s.relearning) s.lapses++;
    s.last = s.last + g * (t - s.last); // N4: reloj de R proporcional a la evidencia
    const I = ivl(s, s);
    if (P.neutral === 'rev2') s.next = zm === 0 ? Math.max(prevNext, t + I) : s.relearning ? t + Math.min(I, P.relearn) : t + I;
    else { // N6: fechas por interpolación, continuas y monótonas
      const rr = P.rhoClock === false ? (A > 0 ? 1 : 0) : rho;
      const base = prevNext + rr * Math.max(0, t + I - prevNext);
      let nx = base + F * Math.min(0, t + I - base);
      if (s.relearning) nx = t + Math.min(I, P.relearn); // reaprendizaje: mañana (con la regla de abajo, nunca después de un vencimiento futuro)
      if (zm > 0 && prevNext > t) nx = Math.min(nx, prevNext);
      s.next = nx;
    }
    s.lastAgg = { ...ag, p: R };
    return s;
  };
  return {
    name, P, core,
    fresh: (id = 0) => ({ S: null, D: null, Ss: null, last: null, next: null, n: 0, lapses: 0, id, k: 'G', relearning: false }),
    init(t, obs, id = 0) { const s = this.fresh(id); apply(s, t, obs); if (s.S === null) s.next = DAYSTART(t); return s; },
    update: (s, t, obs) => { if (s.S === null) { apply(s, t, obs); if (s.S === null) s.next = Math.min(s.next ?? Infinity, DAYSTART(t)); return s; } return apply(s, t, obs); },
    p: (s, t) => (s.S === null ? null : core.R(s, Math.max(0, t - s.last))),
    pPred(s, t) { return this.p(s, t); },
    isDue: (s, t, eod) => s.next <= eod,
  };
}
