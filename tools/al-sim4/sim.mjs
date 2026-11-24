// Simulador del SRS v2 de PolyGo (Fase 5-AL, etapa 2). Sólo para el documento de diseño.
// Dos "verdades" independientes de los planificadores:
//   GT-A: modelo de activación ACT-R con decaimiento dependiente de la activación (Pavlik & Anderson),
//         calibrado en tune.mjs a p(1 d)=0,70, p(7 d)=0,44, p(60 d | 4 repasos)=0,78.
//   GT-B: modelo potencia DSR (forma tipo FSRS-4 pero con parámetros propios, distintos de FSRS).
// Planificadores: v1 (PolyGo actual), SM-2 (variante con EF −0,2 por fallo), FSRS-4.5 (pesos por
// defecto y con S0 ajustado) y AL (propuesta srs-2.0.0).
const DAY = 86400;
const logistic = (x) => 1 / (1 + Math.exp(-x));
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const log2 = Math.log2;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function normal(r) {
  let u = 0;
  while (u === 0) u = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}
const RUNG_W = { R: 0.4, G: 0.7, L: 1 }; // fuerza de la huella según el escalón (verdad)

// ---------------- verdades ----------------
const GTA = {
  c: 0.125, a: 0.12, tau: -1.05, s: 0.275,
  make(b, pp, theta) { return { b, pp, theta, tr: [] }; },
  act(u, t) {
    if (!u.tr.length) return -Infinity;
    let s = 0;
    for (const x of u.tr) s += x.w * Math.pow(Math.max(t - x.t, 1), -x.d);
    return Math.log(s);
  },
  present(u, t, rung) {
    const m = this.act(u, t);
    u.tr.push({ t, w: RUNG_W[rung], d: m === -Infinity ? this.a : this.c * Math.exp(m) + this.a });
    if (rung === 'L') u.pp = Math.max(0, u.pp - 0.06);
    if (rung === 'G') u.pp = Math.max(0, u.pp - 0.02);
  },
  p(u, t, rung) {
    const m = this.act(u, t);
    const base = this.tau + u.b - u.theta;
    if (rung === 'L') return logistic((m - (base + u.pp)) / this.s);
    if (rung === 'G') return logistic((m - (base - 0.6 + 0.5 * u.pp)) / this.s);
    return 0.25 + 0.75 * logistic((m - (base - 1.2)) / this.s);
  },
};
const GTB = {
  make(b, pp, theta) { return { D: clamp(5 + 3 * b, 1, 10), pp, theta, S: null, last: null }; },
  R(u, t) { return u.S === null ? 0 : 1 / (1 + (t - u.last) / DAY / (9 * u.S)); },
  present(u, t, rung) {
    const w = RUNG_W[rung];
    if (u.S === null) { u.S = 0.26 * Math.exp(0.5 * u.theta - 0.3 * (u.D - 5) / 3); u.last = t; return; }
    const R = this.R(u, t);
    // la presentación siempre llega con la respuesta correcta a la vista: cuenta como repaso logrado
    const gain = w * 3.0 * ((11 - u.D) / 6) * Math.exp(0.5 * u.theta) * Math.pow(u.S, -0.2) * (Math.exp(1.5 * (1 - R)) - 1);
    u.S = u.S * (1 + gain);
    u.last = t;
    if (rung === 'L') u.pp = Math.max(0, u.pp - 0.06);
    if (rung === 'G') u.pp = Math.max(0, u.pp - 0.02);
  },
  fail(u, t) { // un fallo real (antes de la retroalimentación) baja la estabilidad verdadera
    const R = this.R(u, t);
    u.S = Math.min(u.S, 0.4 * (Math.pow(u.S + 1, 0.4) - 1) * Math.exp(1.2 * (1 - R)) * ((11 - u.D) / 6) + 0.1);
    u.last = t;
  },
  p(u, t, rung) {
    const R = this.R(u, t);
    if (rung === 'L') return Math.pow(R, 1 + u.pp);
    if (rung === 'G') return Math.pow(R, 0.6 * (1 + 0.5 * u.pp));
    return 0.25 + 0.75 * Math.pow(R, 0.35);
  },
};

// ---------------- planificadores (tiempo en días) ----------------
const V1 = {
  name: 'v1',
  init(t, g) { return g >= 0.5 ? { stage: 1, next: t + 1 } : { stage: 0, next: t }; },
  update(s, t, g) {
    if (g >= 0.5) {
      if (s.next <= t) { s.stage++; s.next = t + (s.stage <= 3 ? [1, 3, 7][s.stage - 1] : 21); }
    } else { s.stage = 0; s.next = t; s.lapses = (s.lapses || 0) + 1; }
  },
  isDue(s, t) { return s.next <= t; }, // v1 compara horas exactas
  pPred() { return null; },
};
const SM2 = {
  name: 'SM-2',
  init(t, g) { return g >= 0.5 ? { ef: 2.5, n: 1, I: 1, next: t + 1 } : { ef: 2.3, n: 0, I: 1, next: t + 1 }; },
  update(s, t, g) {
    if (g >= 0.5) {
      s.n++;
      s.I = s.n === 1 ? 1 : s.n === 2 ? 6 : Math.round(s.I * s.ef);
    } else { s.n = 0; s.I = 1; s.ef = Math.max(1.3, s.ef - 0.2); s.lapses = (s.lapses || 0) + 1; }
    s.next = t + s.I;
  },
  isDue(s, t, eod) { return s.next <= eod; },
  pPred() { return null; },
};
const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const FACTOR = 19 / 81, DECAY = -0.5;
function makeFSRS(name, s0ok, s0fail, retention = 0.9) {
  const D0 = (G) => clamp(W[4] - (G - 3) * W[5], 1, 10);
  const Rf = (s, t) => Math.pow(1 + (FACTOR * (t - s.last)) / s.S, DECAY);
  const interval = (S) => (S / FACTOR) * (Math.pow(retention, 1 / DECAY) - 1);
  return {
    name,
    init(t, g) {
      const G = g >= 0.5 ? 3 : 1;
      const s = { S: G === 3 ? s0ok : s0fail, D: D0(G), last: t };
      s.next = t + interval(s.S);
      return s;
    },
    update(s, t, g) {
      const G = g >= 0.5 ? 3 : 1;
      const R = Rf(s, t);
      let D = s.D - W[6] * (G - 3);
      s.D = clamp(W[7] * D0(3) + (1 - W[7]) * D, 1, 10);
      if (G === 3) s.S = s.S * (1 + Math.exp(W[8]) * (11 - s.D) * Math.pow(s.S, -W[9]) * (Math.exp(W[10] * (1 - R)) - 1));
      else { s.S = Math.min(s.S, W[11] * Math.pow(s.D, -W[12]) * (Math.pow(s.S + 1, W[13]) - 1) * Math.exp(W[14] * (1 - R))); s.lapses = (s.lapses || 0) + 1; }
      s.last = t;
      s.next = t + interval(s.S);
    },
    isDue(s, t, eod) { return s.next <= eod; },
    pPred(s, t) { return Rf(s, t); },
  };
}
const FSRS = makeFSRS('FSRS-4.5', W[2], W[0]);
const FSRS_ADJ = makeFSRS('FSRS-4.5 S0 aj.', 1.0, 0.3);

export const AL_DEFAULT = {
  h0s: 2.0, h0f: 0.7, d0: 0.5, m1a: 4.0, m1b: 2.4, b: 0.15, pref: 0.9, psiMax: 3,
  l0: 0.3, l1: 0.7, hmin: 0.5, etaF: 0.2, etaS: 0.05, mu: 0.05, pstar: 0.85, relearn: 1,
  kappa: { R: 0.25, G: 0.5, L: 1 }, fuzz: 0.05, floor: true, dInfo: true, lapseGamma: 0.8, Imax: 180,
};
function hash01(i, n) { let x = (i * 2654435761 + n * 40503) >>> 0; x ^= x >>> 13; x = Math.imul(x, 0x5bd1e995) >>> 0; x ^= x >>> 15; return (x >>> 0) / 4294967296; }
export function makeAL(P = AL_DEFAULT, name = 'AL') {
  const interval = (h) => h * log2(1 / P.pstar);
  const al = {
    name, P,
    init(t, g, id = 0) {
      const ok = g >= 0.5;
      const s = { h: ok ? P.h0s : P.h0f, d: clamp(P.d0 + (ok ? -P.etaS : P.etaF), 0, 1), last: t, n: 1, lapses: 0, id };
      s.next = t + (ok ? interval(s.h) : Math.min(interval(s.h), P.relearn));
      return s;
    },
    p(s, t) { return Math.pow(2, -(t - s.last) / s.h); },
    update(s, t, g, rung = 'L') {
      const delta = t - s.last;
      const p = Math.pow(2, -delta / s.h);
      let failed = false;
      let info = 1;
      if (g >= 0.5) {
        const z = (g - 0.5) / 0.5, k = P.kappa[rung];
        const m = 1 + (P.m1a - P.m1b * s.d - 1) * Math.pow(Math.max(s.h, 1), -P.b);
        const psi = Math.min(P.psiMax, (1 - p) / (1 - P.pref));
        if (P.dInfo) info = Math.min(1, psi);
        let h = s.h * (1 + k * z * (m - 1) * psi);
        if (P.floor && rung !== 'R' && z >= 0.8) h = Math.max(h, k * delta);
        s.h = Math.min(h, P.Imax / log2(1 / P.pstar));
        s.d = s.d - P.etaS * z * k * (P.dInfo ? Math.min(1, psi) : 1);
      } else {
        const zf = (0.5 - g) / 0.5;
        const l = P.l0 + (P.l1 - P.l0) * (1 - p);
        const base = P.lapseGamma === 1 ? s.h : Math.min(s.h, Math.pow(Math.max(s.h, 1), P.lapseGamma));
        s.h = Math.max(P.hmin, base * Math.pow(l, zf));
        s.d = s.d + P.etaF * zf * (P.dInfo ? 0.5 + 0.5 * p : 1);
        s.lapses++;
        failed = true;
      }
      s.d = clamp(s.d + P.mu * info * (P.d0 - s.d), 0, 1);
      s.last = t;
      s.n++;
      const fz = 1 + P.fuzz * (2 * hash01(s.id, s.n) - 1);
      const I = Math.min(P.Imax, interval(s.h) * fz);
      s.next = t + (failed ? Math.min(I, P.relearn) : I);
    },
    isDue(s, t, eod) { return s.next <= eod; },
    pPred(s, t) { return al.p(s, t); },
  };
  return al;
}
const AL = makeAL();

// ---------------- retención del Mastery Engine (5.11, me-1.0.0) ----------------
const GRID = [0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
function meHalfLife(probes) {
  // probes: [{delta (días), s (0/1)}] primeros intentos sin ayuda, escalón ≥ G, con g = 0 (escritos)
  if (probes.filter((x) => x.delta >= 1).length < 2) return null;
  const eps = 0.05;
  const logL = GRID.map((h) => probes.reduce((acc, x) => {
    const p = (1 - eps) * Math.pow(2, -x.delta / h);
    return acc + (x.s ? Math.log(p) : Math.log(1 - p));
  }, 0));
  const mx = Math.max(...logL);
  const w = logL.map((l) => Math.exp(l - mx));
  const tot = w.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let i = 0; i < GRID.length; i++) { acc += w[i] / tot; if (acc >= 0.5) return GRID[i]; }
  return GRID[GRID.length - 1];
}

// ---------------- simulación ----------------
export function simulate(o) {
  const {
    gt = GTA, alg = AL, days = 150, studies = () => true, newPerDay = 8, newUntil = 100,
    cap = 60, theta = 0, hardFrac = 0, hardShift = 1.2, prodPen = 0, seed = 1, early = 0,
    order = 'due', rungPolicy = 'L', me = null, meLag = 0, sampleEvery = 5, capAfterReturn = null,
    returnDay = null, budget = null, newPolicy = 'fixed', newCost = 3, nMax = 12,
  } = o;
  const r = rng(seed);
  const units = [];
  const stats = { reviews: [], backlog: [], ret: [], lapses: 0, rungs: { R: 0, G: 0, L: 0 }, preds: [] };
  const isHard = () => r() < hardFrac;
  const mkUnit = () => {
    const hard = isHard();
    const b = normal(r) * 0.35 + (hard ? hardShift : 0);
    return { gt: gt.make(b, prodPen, theta), s: null, probes: [], lastExp: null, hard, id: units.length };
  };
  const answer = (u, t, rung) => {
    const p = gt.p(u.gt, t, rung);
    const ok = r() < p;
    if (!ok && gt.fail) gt.fail(u.gt, t);
    gt.present(u.gt, t, rung);
    if (!ok) gt.present(u.gt, t + 60, rung); // reintento con la respuesta a la vista (peso 0 en el SRS)
    if (rung !== 'R' && u.lastExp !== null) u.probes.push({ delta: (t - u.lastExp) / DAY, s: ok ? 1 : 0, at: t });
    u.lastExp = t + (ok ? 0 : 60);
    stats.rungs[rung]++;
    return ok;
  };
  const chooseRung = (u, tday) => {
    if (rungPolicy === 'L') return 'L';
    if (rungPolicy === 'rotate') return ['R', 'R', 'L'][Math.floor(r() * 3)]; // v1: elegir, escuchar, escribir
    // escalera adaptativa (propuesta): sube un escalón tras un acierto, baja uno tras un fallo
    if (rungPolicy === 'ladder') return u.k || 'G';
    // escalera + piso por predicción: si p < 0,5 se presenta un escalón más abajo (sondeo amable)
    const k = u.k || 'G';
    const p = alg.pPred(u.s, tday);
    if (p !== null && p < 0.5) return k === 'L' ? 'G' : 'R';
    return k;
  };
  const moveRung = (u, rung, ok) => {
    const up = { R: 'G', G: 'L', L: 'L' }, down = { R: 'R', G: 'R', L: 'G' };
    u.k = ok ? up[rung] : down[rung];
  };
  for (let day = 0; day < days; day++) {
    if (studies(day)) {
      const t0 = day * DAY + 18 * 3600 + (r() - 0.5) * 4 * 3600;
      const tday = t0 / DAY, eod = day + 1;
      let due = units.filter((u) => {
        if (!alg.isDue(u.s, tday, eod)) return false;
        if (me && alg.name.startsWith('AL') && u.meDue !== undefined && u.meDue !== null) return true;
        return true;
      });
      // regla de autoridad con el Mastery Engine (sólo AL): adelantar, nunca atrasar
      if (me && alg.name.startsWith('AL')) {
        const extra = units.filter((u) => !alg.isDue(u.s, tday, eod) && meDueOf(u, tday, me, meLag, alg) <= eod);
        due = due.concat(extra);
      }
      if (order === 'due') due.sort((a, b) => a.s.next - b.s.next);
      else if (order === 'pAsc') due.sort((a, b) => alg.pPred(a.s, tday) - alg.pPred(b.s, tday));
      else if (order === 'pDesc') due.sort((a, b) => alg.pPred(b.s, tday) - alg.pPred(a.s, tday));
      else if (order === 'value') due.sort((a, b) => value(alg, b.s, tday) - value(alg, a.s, tday));
      let c = capAfterReturn !== null && returnDay !== null && day >= returnDay ? capAfterReturn : cap;
      let newToday = newPerDay;
      if (budget !== null) {
        if (newPolicy === 'reviewsFirst') { c = budget; newToday = Math.max(0, Math.min(nMax, Math.floor((budget - Math.min(due.length, budget)) / newCost))); }
        else if (newPolicy === 'split70') { const rv = Math.round(budget * 0.7); c = due.length < rv ? due.length : rv; newToday = Math.min(nMax, Math.floor((budget - c) / newCost)); }
        else if (newPolicy === 'adaptive') { const reserve = Math.round(budget * 0.2); c = budget - reserve; const free = budget - Math.min(due.length, c); newToday = Math.max(0, Math.min(nMax, Math.floor(free / newCost))); }
        else if (newPolicy === 'guard') { const pend = due.length - Math.round(budget * 0.8); const reserve = Math.round(budget * (pend > 2 * budget ? 0.1 : 0.2)); c = budget - reserve; const free = budget - Math.min(due.length, c); newToday = Math.max(0, Math.min(nMax, Math.floor(free / newCost))); }
        else if (newPolicy === 'fixed') { newToday = newPerDay; c = Math.max(0, budget - newCost * newPerDay); }
      }
      const todays = due.slice(0, c);
      let i = 0;
      for (const u of todays) {
        const t = t0 + i++ * 10;
        const rung = chooseRung(u, tday);
        const ok = answer(u, t, rung);
        moveRung(u, rung, ok);
        const pp = alg.pPred(u.s, t / DAY); if (pp !== null && rung === 'L') stats.preds.push([pp, ok ? 1 : 0]);
        alg.update(u.s, t / DAY, ok ? 1 : 0, rung);
        if (!ok) stats.lapses++;
      }
      // práctica anticipada (cuenta para el SRS): unidades NO vencidas al azar
      if (early > 0) {
        const pool = units.filter((u) => !todays.includes(u) && !alg.isDue(u.s, tday, eod));
        for (let k = 0; k < early && pool.length; k++) {
          const j = Math.floor(r() * pool.length);
          const u = pool.splice(j, 1)[0];
          const t = t0 + i++ * 10;
          const ok = answer(u, t, 'L');
          alg.update(u.s, t / DAY, ok ? 1 : 0, 'L');
        }
      }
      stats.reviews.push({ day, n: todays.length + (early > 0 ? Math.min(early, units.length) : 0), backlog: due.length - todays.length });
      // lección: presentación + dos pruebas a los 2 y 5 minutos
      if (day < newUntil) {
        for (let k = 0; k < newToday; k++) {
          const u = mkUnit();
          const t = t0 + i * 10 + k * 400;
          gt.present(u.gt, t, 'R');
          u.lastExp = t;
          const a1 = answer(u, t + 120, 'R');
          const a2 = answer(u, t + 300, 'L');
          u.s = alg.init((t + 300) / DAY, (Number(a1) + Number(a2)) / 2 >= 0.5 && a2 ? 1 : 0, u.id);
          units.push(u);
        }
      }
    } else stats.reviews.push({ day, n: 0, backlog: null, off: true });
    if (day % sampleEvery === 0 || day === days - 1) {
      const t = (day + 1) * DAY;
      const ps = units.map((u) => gt.p(u.gt, t, 'L'));
      stats.ret.push({ day, mean: ps.length ? ps.reduce((a, b) => a + b, 0) / ps.length : 0, n: ps.length });
    }
  }
  const tEnd = days * DAY;
  const pEnd = units.map((u) => gt.p(u.gt, tEnd, 'L'));
  const totalReviews = stats.reviews.reduce((a, x) => a + x.n, 0);
  return { units, stats, pEnd, totalReviews, retained: pEnd.reduce((a, b) => a + b, 0) };
}
function value(alg, s, t) {
  // pérdida evitada aproximada: unidades que todavía se pueden salvar primero (p intermedia), luego las más débiles
  const p = alg.pPred(s, t);
  return p * (1 - p) + 0.1 * (1 - p);
}
function meDueOf(u, tday, me, lag, alg) {
  const probes = u.probes.filter((x) => x.at / DAY <= tday - lag);
  const h = meHalfLife(probes);
  if (h === null) return Infinity;
  const pstar = alg.P.pstar;
  const tl = u.s.last;
  const dueSrs = u.s.next;
  const dueMe = tl + h * log2(1 / pstar);
  if (me === 'min') return Math.max(dueMe, tl + 0.5 * (dueSrs - tl)); // sólo puede adelantar, con piso
  if (me === 'authority') return dueMe; // alternativa descartada: el motor manda
  return Infinity;
}

export function summarize(res, o = {}) {
  const { from = 30, to = 99 } = o;
  const rv = res.stats.reviews.filter((x) => !x.off && x.day >= from && x.day <= to).map((x) => x.n);
  const all = res.stats.reviews.filter((x) => !x.off).map((x) => x.n);
  const mean = (a) => (a.length ? a.reduce((p, q) => p + q, 0) / a.length : 0);
  const sorted = [...rv].sort((a, b) => a - b);
  const p95 = sorted.length ? sorted[Math.floor(0.95 * (sorted.length - 1))] : 0;
  const retEnd = mean(res.pEnd);
  const retAvg = mean(res.stats.ret.filter((x) => x.day >= 30).map((x) => x.mean));
  return {
    load: +mean(rv).toFixed(1), p95, max: Math.max(...all),
    retEnd: +retEnd.toFixed(3), retAvg: +retAvg.toFixed(3),
    reviews: res.totalReviews, eff: +((retEnd * res.units.length) / Math.max(1, res.totalReviews) * 100).toFixed(2),
    lapses: res.stats.lapses, units: res.units.length,
    ...calib(res.stats.preds),
    backlogEnd: res.stats.reviews.filter((x) => !x.off).slice(-1)[0]?.backlog ?? 0,
  };
}

export const ALGS = { V1, SM2, FSRS, FSRS_ADJ, AL };
export { GTA, GTB, meHalfLife, makeFSRS };

function calib(preds) {
  if (!preds.length) return { predP: NaN, obsP: NaN, logloss: NaN };
  let lp = 0, sp = 0, so = 0;
  for (const [p, o] of preds) { const q = Math.min(0.999, Math.max(0.001, p)); lp += -(o * Math.log(q) + (1 - o) * Math.log(1 - q)); sp += p; so += o; }
  return { predP: +(sp / preds.length).toFixed(3), obsP: +(so / preds.length).toFixed(3), logloss: +(lp / preds.length).toFixed(3) };
}
