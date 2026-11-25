/**
 * SRS v2 (docs/ADAPTIVE_LEARNING_DESIGN.md rev. 4.2): vectores T1–T9 (5.11), Q1–Q12 (13.2),
 * V1–V10 (7.2), propiedades de 5.10, AL19 (9.7), presupuesto (8.1) e ipu (9.7).
 *
 * `fixtures/srs2-golden.json` sale del simulador con el que se calcularon las tablas aprobadas
 * (al-sim4/pglayer.mjs + cores.mjs, fuera del repositorio, AL18): 200 historiales aleatorios con
 * q reales, escalones −2…+1, culpa 1, 1/2 y 1/5, I_max 45 y 180, sin dispersión.
 */
import golden from './fixtures/srs2-golden.json';
import {
  AL19,
  al19Eval,
  al19Rebuild,
  aggregate,
  assistFactor4,
  classifyQ4,
  dailyBudget,
  DebtMeasures,
  DebtState,
  dispersionFactor,
  effectiveDueMs,
  initialDebtState,
  ipuFor,
  isEligible,
  lessonReserve,
  localDate,
  masteryHint,
  MasteryHintInput,
  Observation,
  quantizeP,
  quantizeQ,
  RelRung,
  retrievability,
  s4FromVerdict,
  startOfNextLocalDay,
  TAU,
  unitHash,
  UnitState,
  updateUnit,
  UpdateContext,
  userRhythm100,
} from '../srs2';

const ctx = (t: number, over: Partial<UpdateContext> = {}): UpdateContext => ({
  t,
  f: 1,
  imax: 180,
  nextLocalDayStart: Math.floor(t) + 1,
  dim: 'vocabulary',
  target: 'L',
  ...over,
});
const L = (q: number, nT = 1): Observation => ({ q, r: 0, nT });
const G = (q: number, nT = 1): Observation => ({ q, r: -1, nT });
const R = (q: number): Observation => ({ q, r: -2, nT: 1 });
const L4 = (q4: number): Observation => ({ q4, r: 0, nT: 1 });

const base = (over: Partial<UnitState> = {}): UnitState => ({
  S: 10,
  D: 5,
  n: 3,
  lapses: 0,
  exposures: 3,
  tLast: 0,
  lastSeen: 0,
  due: 10 * TAU,
  rung: 'L',
  relearning: false,
  lastA: null,
  lastZMinus: null,
  ...over,
});

const close = (a: number | null, b: number, digits = 2) => {
  expect(a).not.toBeNull();
  expect(Math.abs(a! - b)).toBeLessThanOrEqual(0.5 * 10 ** -digits + 1e-9);
};

/** T1/T2: lección en 0 (R ✓ L ✓) y repaso cada vez al vencer: t = máx(t + 1, ⌈due⌉). */
function trajectory(outcomes: number[], imax = 180) {
  let s = updateUnit(null, [R(1), L(1)], ctx(0, { imax })).state;
  const rows = [{ S: s.S!, D: s.D!, I: s.due }];
  let t = 0;
  for (const o of outcomes) {
    t = Math.max(t + 1, Math.ceil(s.due - 1e-9));
    s = updateUnit(s, [L(o)], ctx(t, { imax })).state;
    rows.push({ S: s.S!, D: s.D!, I: s.due - t });
  }
  return rows;
}

describe('núcleo y capa: vectores de 5.11', () => {
  test('τ y S_max', () => {
    close(TAU, 1.6374, 4);
    close(45 / TAU, 27.48, 2);
  });

  test('T1: siempre acierta y repasa al vencer', () => {
    const rows = trajectory([1, 1, 1, 1, 1]);
    [0.6, 3.96, 22.0, 97.97, 109.93, 109.93].forEach((S, i) => close(rows[i]!.S, S));
    close(rows[0]!.I, 0.98);
    [6.5, 36.0, 160.4, 180, 180].forEach((I, i) => close(rows[i + 1]!.I, I, 1));
  });

  test('T2: error en el quinto repaso, nada se resetea', () => {
    const rows = trajectory([1, 1, 1, 1, 0, 1, 1, 1]);
    close(rows[5]!.S, 8.48);
    close(rows[5]!.D, 6.9);
    close(rows[5]!.I, 1, 1);
    close(rows[6]!.S, 10.4);
    close(rows[6]!.I, 17.0, 1);
    close(rows[7]!.S, 39.07);
    close(rows[8]!.S, 109.93);
  });

  test('T3 y T3b: aciertos anticipados no cambian S ni D; un error anticipado sí (E1, E2, E4)', () => {
    let s = updateUnit(null, [R(1), L(1)], ctx(0)).state;
    let t = 0;
    for (let i = 0; i < 4; i++) {
      t = Math.max(t + 1, Math.ceil(s.due - 1e-9));
      s = updateUnit(s, [L(1)], ctx(t)).state;
    }
    const after4 = s;
    close(after4.due, 386, 1);
    for (let k = 1; k <= 5; k++) {
      const prev = s;
      s = updateUnit(s, [L(1)], ctx(t + k)).state;
      expect(s.S).toBeCloseTo(prev.S!, 10);
      expect(s.D!).toBeLessThanOrEqual(prev.D! + 1e-12);
      expect(s.due).toBeGreaterThanOrEqual(prev.due);
      close(s.due, 386 + k, 1);
    }
    const err = updateUnit(after4, [L(0)], ctx(t + 1)).state;
    close(err.S, 6.69);
    close(err.D, 6.9);
    close(err.due - (t + 1), 1);
  });

  test('T4: cinco sesiones el mismo día casi no crecen (E3)', () => {
    let s = updateUnit(null, [R(1), L(1)], ctx(0)).state;
    const got = [s.S!];
    for (let k = 1; k <= 5; k++) {
      s = updateUnit(s, [L(1)], ctx(k * 0.02)).state;
      got.push(s.S!);
    }
    [0.6, 0.68, 0.76, 0.83, 0.91, 0.99].forEach((S, i) => close(got[i]!, S));
  });

  test('T6: una observación (S 10, D 5, a los 2 días)', () => {
    const cases: [Observation[], number, number, number, number][] = [
      [[L(1)], 15.46, 5.0, 2.0, 27.31],
      [[L(0.9)], 14.37, 5.0, 1.6, 23.69],
      [[G(1)], 12.73, 5.0, 2.0, 22.84],
      [[R(1)], 11.36, 5.0, 2.0, 20.61],
      [[L(0.6)], 11.09, 5.0, 0.4, 17.13],
      [[L(0.54)], 10.44, 5.0, 0.16, 16.59],
      [[L(0.5)], 10.0, 5.0, 0.0, 16.37],
      [[L(0.25)], 4.76, 5.87, 1.0, 3.0],
      [[L(0)], 2.26, 6.74, 2.0, 3.0],
    ];
    for (const [obs, S, D, tl, due] of cases) {
      const s = updateUnit(base(), obs, ctx(2)).state;
      close(s.S, S);
      close(s.D, D);
      close(s.tLast, tl);
      close(s.due, due);
    }
  });

  test('T6b y T6c: dificultad alta y unidad vencida', () => {
    close(updateUnit(base({ D: 8 }), [L(1)], ctx(2)).state.D, 7.9801, 4);
    close(updateUnit(base({ D: 8 }), [L(0.54)], ctx(2)).state.D, 7.9984, 4);
    close(updateUnit(base({ D: 8 }), [L(0.5)], ctx(2)).state.D, 8.0, 4);
    const cases: [Observation[], number, number, number, number][] = [
      [[L(1)], 32.84, 7.912, 20.0, 73.78],
      [[L(0.54)], 11.83, 7.993, 1.6, 18.21],
      [[L(0.5)], 10.0, 8.0, 0.0, 16.37],
      [[G(0, 20)], 9.38, 8.0826, 1.0, 16.37],
      [[G(0, 5)], 7.74, 8.3303, 4.0, 16.37],
      [[L(0)], 2.78, 9.6514, 20.0, 21.0],
    ];
    for (const [obs, S, D, tl, due] of cases) {
      const s = updateUnit(base({ D: 8 }), obs, ctx(20)).state;
      close(s.S, S);
      close(s.D, D, 4);
      close(s.tLast, tl);
      close(s.due, due);
    }
  });

  test('T7: error y acierto según el momento', () => {
    for (const [d, Rv, Se, Sa] of [
      [0.01, 1.0, 2.19, 10.03],
      [1, 0.988, 2.22, 12.76],
      [3, 0.967, 2.3, 18.1],
      [10, 0.9, 2.56, 35.08],
      [30, 0.766, 3.17, 73.05],
      [90, 0.567, 4.34, 109.93],
    ] as const) {
      close(retrievability(d, 10), Rv, 3);
      close(updateUnit(base(), [L(0)], ctx(d)).state.S, Se);
      close(updateUnit(base(), [L(1)], ctx(d)).state.S, Sa);
    }
  });

  test('T8: sesiones mixtas', () => {
    const rows: [Observation[], number, number, number, number, number, number, boolean, number][] =
      [
        // obs, A, F_err, z⁻, S, D, λ, reaprende, vence
        [[L(1), L(1), L(1)], 1, 0, 0, 15.46, 5.0, 0, false, 27.31],
        [[L(1), L(1), L(1), L(0)], 1, 1, 0.5, 4.76, 5.87, 1, true, 3.0],
        [[R(1), R(1), L(0)], 0.25, 1, 1, 2.26, 6.74, 1, true, 3.0],
        [[L(1), R(0)], 1, 1, 0.5, 4.76, 5.87, 1, true, 3.0],
        [[G(0, 5)], 0, 0.2, 0.2, 7.43, 5.35, 0, false, 15.93],
        [[G(0, 5), L(1)], 1, 0.2, 0.1, 11.44, 5.17, 0, false, 16.37],
        [[G(0, 2), L(1)], 1, 0.5, 0.25, 6.9, 5.44, 0, false, 14.83],
        [[L(0.6), R(1)], 0.25, 0, 0, 11.36, 5.0, 0, false, 20.61],
        [[L(0.67), R(1)], 0.34, 0, 0, 11.86, 5.0, 0, false, 21.41],
        [[L(0.33)], 0, 0.34, 0.34, 6.04, 5.59, 0, false, 14.85],
        [[L(0), L(0.5)], 0, 1, 1, 2.26, 6.74, 1, true, 3.0],
        [[L(0), L(0.6)], 0.2, 1, 0.9, 2.63, 6.57, 1, true, 3.0],
        [[L(0), L(0.54)], 0.08, 1, 0.96, 2.4, 6.67, 1, true, 3.0],
        [[L(0.5), L(0.5)], 0, 0, 0, 10.0, 5.0, 0, false, 16.37],
        [[L(0.5), L(1)], 1, 0, 0, 15.46, 5.0, 0, false, 27.31],
        [[L(0.5), G(0, 5)], 0, 0.2, 0.2, 7.43, 5.35, 0, false, 15.93],
      ];
    for (const [obs, A, Fe, zm, S, D, lapses, relearn, due] of rows) {
      const { state, agg } = updateUnit(base(), obs, ctx(2));
      close(agg.A, A);
      close(agg.Ferr, Fe, 3);
      close(agg.zMinus, zm, 3);
      close(state.S, S);
      close(state.D, D);
      expect(state.lapses).toBe(lapses);
      expect(state.relearning).toBe(relearn);
      close(state.due, due);
    }
  });

  test('estado inicial (lección a las 0,75 d) y unidad sólo expuesta', () => {
    const c = ctx(0.75);
    const cases: [Observation[], number | null, number | null, number, number][] = [
      [[R(1), L(1)], 0.6, 5.16, 1.73, 1],
      [[L(0)], 0.2, 7.62, 1.08, 1],
      [[R(1), L(0)], 0.2, 7.62, 1.08, 1],
      [[L(0.54)], 0.22, 5.16, 1.11, 1],
      [[L(0.6)], 0.25, 5.16, 1.16, 1],
      [[G(0, 5)], 0.2, 5.65, 1.08, 1],
      [[L(0.5)], null, null, 1.0, 0],
      [[R(0.5), L(0.5)], null, null, 1.0, 0],
    ];
    for (const [obs, S, D, due, n] of cases) {
      const s = updateUnit(null, obs, c).state;
      if (S === null) {
        expect(s.S).toBeNull();
        expect(s.D).toBeNull();
      } else {
        close(s.S, S);
        close(s.D, D!);
      }
      close(s.due, due);
      expect(s.n).toBe(n);
      expect(s.exposures).toBe(1);
    }
    // Expuesta → otro neutro sigue igual → acierto pleno la inicializa como su lección.
    let s = updateUnit(null, [L(0.5)], c).state;
    s = updateUnit(s, [L(0.5)], ctx(1.75)).state;
    expect(s.S).toBeNull();
    expect(s.exposures).toBe(2);
    close(s.due, 1.0);
    s = updateUnit(s, [L(1)], ctx(2.75)).state;
    close(s.S, 0.6);
    close(s.D, 5.16);
  });

  test('T9 y Q12: discretización y continuidad en q = 0,5', () => {
    const mk = () => {
      let s = updateUnit(null, [R(1), L(1)], ctx(0)).state;
      let t = 0;
      for (let i = 0; i < 2; i++) {
        t = Math.max(t + 1, Math.ceil(s.due - 1e-9));
        s = updateUnit(s, [L(1)], ctx(t)).state;
      }
      return s;
    };
    const s0 = mk();
    close(s0.due, 44.0149, 4);
    // Vía de producción: 0,4999999 y 0,5000001 se discretizan a 5 000 → neutro (T9).
    for (const q of [0.5, 0.4999999, 0.5000001]) {
      const q4 = quantizeP(Math.round(q * 1e8));
      expect(q4).toBe(5000);
      const s = updateUnit(s0, [L4(q4)], ctx(s0.due + 3)).state;
      close(s.S, 21.9951, 4);
      close(s.D, 5.1618, 4);
      close(s.tLast, 8.0, 4);
      close(s.due, 44.0149, 4);
    }
    // Continuidad de las fórmulas con q real (Q12): a menos de 1e−4 del neutro.
    for (const q of [0.5 - 1e-7, 0.5 + 1e-7]) {
      const s = updateUnit(s0, [L(q)], ctx(s0.due + 3)).state;
      expect(Math.abs(s.S! - s0.S!)).toBeLessThan(1e-4);
      expect(Math.abs(s.D! - s0.D!)).toBeLessThan(1e-4);
      expect(Math.abs(s.tLast! - s0.tLast!)).toBeLessThan(1e-4);
      expect(Math.abs(s.due - s0.due)).toBeLessThan(1e-4);
    }
  });
});

describe('equivalencia con el simulador de la revisión 4.2 (vectores dorados)', () => {
  type GObs = { q: number; rel: number; chi: number };
  type GSnap = {
    S: number | null;
    D: number | null;
    tLast: number | null;
    due: number;
    n: number;
    lapses: number;
    relearning: boolean;
    exposures: number;
  };
  const toObs = (o: GObs): Observation => ({
    q: o.q,
    r: o.rel as RelRung,
    nT: Math.round(1 / o.chi),
  });
  const cmp = (s: UnitState, g: GSnap) => {
    if (g.S === null) expect(s.S).toBeNull();
    else expect(Math.abs(s.S! - g.S) / Math.max(1, g.S)).toBeLessThan(1e-9);
    if (g.D === null) expect(s.D).toBeNull();
    else expect(Math.abs(s.D! - g.D)).toBeLessThan(1e-9);
    if (g.tLast !== null) expect(Math.abs(s.tLast! - g.tLast)).toBeLessThan(1e-9);
    expect(Math.abs(s.due - g.due)).toBeLessThan(1e-8);
    expect(s.n).toBe(g.n);
    expect(s.lapses).toBe(g.lapses);
    expect(s.relearning).toBe(g.relearning);
    expect(s.exposures).toBe(g.exposures);
  };
  test('200 historiales: S, D, t_last, vencimiento y contadores idénticos', () => {
    for (const h of golden as unknown as {
      Imax: number;
      t0: number;
      init: GObs[];
      first: GSnap;
      steps: { t: number; obs: GObs[]; after: GSnap }[];
    }[]) {
      let s = updateUnit(null, h.init.map(toObs), ctx(h.t0, { imax: h.Imax })).state;
      cmp(s, h.first);
      for (const st of h.steps) {
        s = updateUnit(s, st.obs.map(toObs), ctx(st.t, { imax: h.Imax })).state;
        cmp(s, st.after);
      }
    }
  });
});

describe('cuantización de q (13.2)', () => {
  test('Q1–Q11', () => {
    const cases: [number, number, number, string][] = [
      [10000, 5000, 5000, 'neutral'],
      [9999, 5000, 5000, 'neutral'],
      [7300, 6850, 5001, 'success'],
      [8334, 7500, 6251, 'success'],
      [6667, 7500, 5000, 'neutral'],
      [5001, 10000, 5001, 'success'],
      [4999, 10000, 4999, 'error'],
    ];
    for (const [s4, a4, q4, cls] of cases) {
      expect(quantizeQ(s4, a4)).toBe(q4);
      expect(classifyQ4(q4)).toBe(cls);
    }
    expect(quantizeP(49_994_999)).toBe(4999);
    expect(quantizeP(50_004_999)).toBe(5000);
    // Q10: pinyin sobre un tipeo.
    expect(quantizeQ(s4FromVerdict('typo'), assistFactor4({ reading_visible: true }))).toBe(5400);
    // Q11: tres audios extra (4 reproducciones, 1 gratis): 8 500 → 7 225 → 6 141.
    expect(assistFactor4({ audio_replays: 4 })).toBe(6141);
    expect(quantizeQ(10000, 6141)).toBe(6141);
    // Con double, toFixed(4) daría neutro en Q3.
    expect((0.73 * 0.685).toFixed(4)).toBe('0.5000');
  });

  test('P ≤ 10⁸ y entradas fuera de rango', () => {
    expect(quantizeQ(10000, 10000)).toBe(10000);
    expect(() => quantizeQ(10001, 10000)).toThrow();
    expect(() => quantizeQ(0.5, 10000)).toThrow();
    expect(() => quantizeP(100_000_001)).toThrow();
  });

  test('ayudas: orden fijo, redondeo paso a paso y piso 0,25', () => {
    expect(assistFactor4({})).toBe(10000);
    expect(assistFactor4({ audio_replays: 1 })).toBe(10000);
    expect(assistFactor4({ slow_audio_plays: 2, prompt_audio_plays: 1 })).toBe(5600);
    expect(assistFactor4({ hints_revealed: 3, reading_visible: true })).toBe(2500);
    expect(assistFactor4({ reading_toggles: 5 })).toBe(10000);
  });

  test('10⁵ pares: el método entero coincide con la aritmética exacta (BigInt)', () => {
    let x = 7;
    for (let i = 0; i < 100_000; i++) {
      x = (x * 48271) % 2147483647;
      const s4 = x % 10001;
      x = (x * 48271) % 2147483647;
      const a4 = 2500 + (x % 7501);
      const exact = Number((BigInt(s4) * BigInt(a4) + 5000n) / 10000n);
      expect(quantizeQ(s4, a4)).toBe(exact);
    }
  });
});

describe('propiedades de 5.10 (P1–P4, E1, E2, E5, M1, M2, límites)', () => {
  let seed = 99;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const Q4S = [0, 2500, 4000, 5000, 5400, 6000, 9000, 10000];
  const randObs = (): Observation => ({
    q4: Q4S[Math.floor(rnd() * Q4S.length)]!,
    r: ([-2, -1, 0, 1] as RelRung[])[Math.floor(rnd() * 4)]!,
    nT: [1, 2, 5][Math.floor(rnd() * 3)]!,
  });
  const randState = (): UnitState => {
    const S = 0.01 + rnd() * 27;
    const tLast = rnd() * 50;
    return base({
      S,
      D: 1 + rnd() * 9,
      tLast,
      due: rnd() < 0.5 ? tLast + S * TAU : tLast + rnd() * 100,
    });
  };
  const N = 20_000;

  test('neutros: una sesión sólo neutra no cambia el modelo; agregar un neutro no cambia nada', () => {
    for (let i = 0; i < N; i++) {
      const s = randState();
      const t = s.tLast! + rnd() * 400;
      const neu = updateUnit(s, [L4(5000), { q4: 5000, r: -2, nT: 1 }], ctx(t, { imax: 45 })).state;
      expect([neu.S, neu.D, neu.tLast, neu.due, neu.n, neu.lapses, neu.rung]).toEqual([
        s.S,
        s.D,
        s.tLast,
        s.due,
        s.n,
        s.lapses,
        s.rung,
      ]);
      const obs = [randObs(), randObs()];
      const a = updateUnit(s, obs, ctx(t, { imax: 45 }));
      const b = updateUnit(s, [...obs, { q4: 5000, r: 0, nT: 1 }], ctx(t, { imax: 45 }));
      expect(b.state).toEqual(a.state);
      expect(b.agg.c).toBe(a.agg.c);
    }
  });

  test('E1/E2 sin errores; E5 con error; error pleno no sube S; límites', () => {
    for (let i = 0; i < N; i++) {
      const s = randState();
      const t = s.tLast! + rnd() * 400;
      const obs = [randObs(), randObs(), randObs()];
      const { state: n, agg } = updateUnit(s, obs, ctx(t, { imax: 45 }));
      const Smax = 45 / TAU;
      expect(n.S!).toBeGreaterThanOrEqual(0.01);
      expect(n.S!).toBeLessThanOrEqual(Smax + 1e-9);
      expect(n.D!).toBeGreaterThanOrEqual(1);
      expect(n.D!).toBeLessThanOrEqual(10);
      expect(Number.isFinite(n.due)).toBe(true);
      if (agg.Ferr === 0) {
        expect(n.S!).toBeGreaterThanOrEqual(Math.min(s.S!, Smax) - 1e-9);
        expect(n.D!).toBeLessThanOrEqual(s.D! + 1e-9);
        expect(n.due).toBeGreaterThanOrEqual(s.due - 1e-9);
      } else if (s.due > t) {
        expect(n.due).toBeLessThanOrEqual(s.due + 1e-9);
      }
      if (agg.zMinus >= 0.5) expect(n.S!).toBeLessThanOrEqual(s.S! + 1e-9);
    }
  });

  test('M1/M2: agregar un error nunca sube S ni baja D; agregar un acierto, al revés', () => {
    for (let i = 0; i < N; i++) {
      const s = randState();
      const t = s.tLast! + rnd() * 400;
      const obs = [randObs(), randObs()];
      const a = updateUnit(s, obs, ctx(t, { imax: 45 })).state;
      const withErr = updateUnit(
        s,
        [...obs, { q4: [0, 2500, 4000][Math.floor(rnd() * 3)]!, r: obs[0]!.r, nT: 1 }],
        ctx(t, { imax: 45 }),
      ).state;
      const withOk = updateUnit(
        s,
        [...obs, { q4: [6000, 9000, 10000][Math.floor(rnd() * 3)]!, r: obs[0]!.r, nT: 1 }],
        ctx(t, { imax: 45 }),
      ).state;
      expect(withErr.S!).toBeLessThanOrEqual(a.S! + 1e-9);
      expect(withErr.D!).toBeGreaterThanOrEqual(a.D! - 1e-9);
      expect(withOk.S!).toBeGreaterThanOrEqual(a.S! - 1e-9);
      expect(withOk.D!).toBeLessThanOrEqual(a.D! + 1e-9);
      // M1-fecha / M2-fecha por día de elegibilidad (día = unidad entera).
      const E = (due: number) => Math.max(Math.floor(due), Math.floor(t) + 1);
      expect(E(withErr.due)).toBeLessThanOrEqual(E(a.due));
      expect(E(withOk.due)).toBeGreaterThanOrEqual(E(a.due));
    }
  });

  test('P4: unidad nueva sólo con neutros: S y D nulos, vence al día siguiente', () => {
    const s = updateUnit(null, [L4(5000)], ctx(3.2)).state;
    expect(s.S).toBeNull();
    expect(s.n).toBe(0);
    expect(s.due).toBe(4);
  });

  test('escalera (5.9): sube con aciertos sin error hasta T; baja con error pleno; empieza en G', () => {
    let s = updateUnit(null, [L(1)], ctx(0)).state;
    expect(s.rung).toBe('G');
    s = updateUnit(s, [L(1)], ctx(2)).state;
    expect(s.rung).toBe('L');
    s = updateUnit(s, [L(1)], ctx(9)).state;
    expect(s.rung).toBe('L');
    s = updateUnit(s, [L(0)], ctx(30)).state;
    expect(s.rung).toBe('G');
    s = updateUnit(s, [G(0, 5)], ctx(31)).state; // error débil: no cambia
    expect(s.rung).toBe('G');
    expect(updateUnit(null, [L(0)], ctx(0)).state.rung).toBe('R');
  });
});

describe('dispersión determinista y día local', () => {
  test('unitHash es estable y en [0, 1); f en [0,95; 1,05]', () => {
    const h = unitHash('7f0c7d52-3a3a-4f63-9f41-0a7e3c1f3b10', 'en-hello', 'vocabulary');
    expect(h).toBe(unitHash('7f0c7d52-3a3a-4f63-9f41-0a7e3c1f3b10', 'en-hello', 'vocabulary'));
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(1);
    expect(dispersionFactor(0)).toBe(0.95);
    expect(dispersionFactor(0.5)).toBe(1);
  });

  test('inicio del día local siguiente, con y sin horario de verano', () => {
    const ba = 'America/Argentina/Buenos_Aires';
    expect(
      new Date(startOfNextLocalDay(Date.parse('2026-11-08T13:00:00Z'), ba)).toISOString(),
    ).toBe('2026-11-09T03:00:00.000Z');
    expect(
      new Date(startOfNextLocalDay(Date.parse('2026-11-09T02:59:00Z'), ba)).toISOString(),
    ).toBe('2026-11-09T03:00:00.000Z');
    // Madrid pasa a horario de verano el 2026-03-29.
    expect(
      new Date(
        startOfNextLocalDay(Date.parse('2026-03-28T12:00:00Z'), 'Europe/Madrid'),
      ).toISOString(),
    ).toBe('2026-03-28T23:00:00.000Z');
    expect(
      new Date(
        startOfNextLocalDay(Date.parse('2026-03-29T12:00:00Z'), 'Europe/Madrid'),
      ).toISOString(),
    ).toBe('2026-03-29T22:00:00.000Z');
    expect(localDate(Date.parse('2026-11-09T02:59:00Z'), ba)).toBe('2026-11-08');
  });
});

describe('7.2 límite del motor: vectores V1–V10', () => {
  const tz = 'America/Argentina/Buenos_Aires';
  // d0 00:00 local = 2026-01-01T03:00Z.
  const at = (day: number, hh: number, mm = 0) =>
    Date.parse('2026-01-01T03:00:00Z') + day * 86_400_000 + (hh * 60 + mm) * 60_000;
  const H = 3_600_000;
  const me = (
    dueMEms: number,
    over: Partial<MasteryHintInput> = {},
    lastExp = at(0, 10),
  ): MasteryHintInput => ({
    versionEnabled: true,
    retentionSufficient: true,
    halfLifeDays: (dueMEms - lastExp) / 86_400_000 / Math.log2(1 / 0.85),
    lastExposureMs: lastExp,
    dirtySinceMs: null,
    computedAtMs: at(0, 10),
    ...over,
  });
  const st = (tLast: number, lastSeen: number, due: number) => ({
    tLastMs: tLast,
    lastSeenMs: lastSeen,
    dueMs: due,
    S: 10,
  });

  test('V1–V7 y V10', () => {
    const now = at(0, 11);
    const v1 = masteryHint(me(at(6, 10)), st(at(0, 10), at(0, 10), at(20, 10)), now, tz);
    expect(v1.hasHint).toBe(true);
    expect(v1.dueEffectiveMs).toBe(at(10, 10));
    expect(v1.expiresAtMs).toBe(now + 72 * H);
    const v2 = masteryHint(me(at(14, 10)), st(at(0, 10), at(0, 10), at(20, 10)), now, tz);
    expect(v2.dueEffectiveMs).toBeCloseTo(at(14, 10), -1);
    const v3 = masteryHint(me(at(25, 10)), st(at(0, 10), at(0, 10), at(20, 10)), now, tz);
    expect(v3.hasHint).toBe(false);
    expect(v3.dueEffectiveMs).toBe(at(20, 10));
    // V4: vence el mismo día local; no hay sugerencia y sólo I3b impide presentarla d0.
    const v4s = st(at(0, 0, 10), at(0, 0, 10), at(0, 23, 44));
    const v4 = masteryHint(me(at(0, 5), {}, at(0, 0, 10)), v4s, at(0, 1), tz);
    expect(v4.hasHint).toBe(false);
    expect(isEligible(v4.dueEffectiveMs, v4s.lastSeenMs, localDate(at(0, 23), tz), tz)).toBe(false);
    expect(isEligible(v4.dueEffectiveMs, v4s.lastSeenMs, localDate(at(1, 1), tz), tz)).toBe(true);
    // V5: vencida antes de D1 y expuesta el d5.
    const v5s = st(at(0, 10), at(5, 15), at(3, 10));
    const v5 = masteryHint(me(at(2, 10)), v5s, at(5, 16), tz);
    expect(v5.hasHint).toBe(false);
    expect(isEligible(v5.dueEffectiveMs, v5s.lastSeenMs, localDate(at(5, 20), tz), tz)).toBe(false);
    expect(isEligible(v5.dueEffectiveMs, v5s.lastSeenMs, localDate(at(6, 0, 1), tz), tz)).toBe(
      true,
    );
    // V6: due = D1 exacto → no hay sugerencia.
    expect(
      masteryHint(
        me(at(0, 21), {}, at(0, 20)),
        st(at(0, 20), at(0, 20), at(1, 0)),
        at(0, 20, 30),
        tz,
      ).hasHint,
    ).toBe(false);
    // V7: D1 es el piso que manda (adelanto 3 h 51).
    const v7 = masteryHint(
      me(at(0, 21), {}, at(0, 20)),
      st(at(0, 20), at(0, 20), at(1, 3, 51)),
      at(0, 20, 30),
      tz,
    );
    expect(v7.hasHint).toBe(true);
    expect(v7.dueEffectiveMs).toBe(at(1, 0));
    // V10: motor atrasado 8 días → E falso.
    const v10 = masteryHint(
      me(at(6, 10), { computedAtMs: at(0, 10) - 8 * 86_400_000 }),
      st(at(0, 10), at(0, 10), at(20, 10)),
      now,
      tz,
    );
    expect(v10.eligible).toBe(false);
    expect(v10.dueEffectiveMs).toBe(at(20, 10));
  });

  test('V8: una exposición vigente anula la sugerencia; al recalcular, cand = D1', () => {
    const r = masteryHint(
      me(at(6, 10), { computedAtMs: at(10, 8, 30) }),
      st(at(0, 10), at(10, 8), at(20, 10)),
      at(10, 9),
      tz,
    );
    expect(r.dueEffectiveMs).toBe(at(11, 0));
  });

  test('V9: cambio de zona horaria: I3a con la zona del cálculo, I3b con la vigente', () => {
    const utc = (s: string) => Date.parse(s);
    const r = masteryHint(
      {
        versionEnabled: true,
        retentionSufficient: true,
        halfLifeDays: 0.5 / 24 / Math.log2(1 / 0.85),
        lastExposureMs: utc('2026-01-01T23:00:00Z'),
        dirtySinceMs: null,
        computedAtMs: utc('2026-01-01T23:00:00Z'),
      },
      {
        tLastMs: utc('2026-01-01T23:00:00Z'),
        lastSeenMs: utc('2026-01-01T23:00:00Z'),
        dueMs: utc('2026-01-02T07:00:00Z'),
        S: 1,
      },
      utc('2026-01-01T23:30:00Z'),
      'America/Argentina/Buenos_Aires',
    );
    expect(r.hasHint).toBe(true);
    expect(new Date(r.dueEffectiveMs).toISOString()).toBe('2026-01-02T03:00:00.000Z');
    // En UTC+1 (Europe/Paris en enero): last_seen 2026-01-02 00:00 local; la sugerencia cae ese mismo día → no elegible hasta el 03.
    expect(
      isEligible(r.dueEffectiveMs, utc('2026-01-01T23:00:00Z'), '2026-01-02', 'Europe/Paris'),
    ).toBe(false);
    expect(
      isEligible(r.dueEffectiveMs, utc('2026-01-01T23:00:00Z'), '2026-01-03', 'Europe/Paris'),
    ).toBe(true);
  });

  test('I1, I2 e I3a en 10⁵ estados aleatorios; datos nulos, no finitos o de otra versión → sin adelanto', () => {
    let x = 3;
    const rnd = () => (x = (x * 48271) % 2147483647) / 2147483647;
    const tz2 = 'Europe/Madrid';
    for (let i = 0; i < 100_000; i++) {
      const tLast = at(0, 0) + rnd() * 30 * 86_400_000;
      const I = rnd() * 40 * 86_400_000 + 60_000;
      const due = tLast + I;
      const lastSeen = tLast + rnd() * I;
      const now = lastSeen + rnd() * 86_400_000;
      const r = masteryHint(
        {
          versionEnabled: true,
          retentionSufficient: true,
          halfLifeDays: rnd() * 60 + 0.01,
          lastExposureMs: lastSeen,
          dirtySinceMs: null,
          computedAtMs: now,
        },
        { tLastMs: tLast, lastSeenMs: lastSeen, dueMs: due, S: 5 },
        now,
        tz2,
      );
      expect(r.dueEffectiveMs).toBeLessThanOrEqual(due);
      expect(due - r.dueEffectiveMs).toBeLessThanOrEqual(0.5 * I + 1);
      if (r.hasHint)
        expect(r.dueEffectiveMs).toBeGreaterThanOrEqual(startOfNextLocalDay(lastSeen, tz2));
    }
    const s = st(at(0, 10), at(0, 10), at(20, 10));
    for (const bad of [
      null,
      me(at(6, 10), { versionEnabled: false }),
      me(at(6, 10), { retentionSufficient: false }),
      me(at(6, 10), { halfLifeDays: NaN }),
      me(at(6, 10), { halfLifeDays: -1 }),
      me(at(6, 10), { lastExposureMs: null }),
      me(at(6, 10), { dirtySinceMs: at(0, 11) - 73 * H }),
    ]) {
      expect(masteryHint(bad, s, at(0, 11), tz).hasHint).toBe(false);
    }
    expect(masteryHint(me(at(6, 10)), { ...s, S: null }, at(0, 11), tz).hasHint).toBe(false);
  });

  test('I5: la sugerencia vencida no se usa', () => {
    expect(effectiveDueMs(100, 50, 200, 150)).toBe(50);
    expect(effectiveDueMs(100, 50, 200, 250)).toBe(100);
    expect(effectiveDueMs(100, 50, null, 10)).toBe(100);
  });
});

describe('presupuesto (8.1–8.2) e ipu (9.7)', () => {
  test('B = ⌊meta × ritmo⌋ y reserva ⌊(B + 2)/5⌋', () => {
    expect(dailyBudget(5)).toBe(37);
    expect(dailyBudget(15)).toBe(112);
    expect(dailyBudget(10)).toBe(75);
    expect(dailyBudget(20)).toBe(150);
    expect([37, 38, 75, 112].map(lessonReserve)).toEqual([7, 8, 15, 22]);
  });

  test('ritmo por usuario con contracción', () => {
    expect(userRhythm100([])).toBe(750);
    expect(userRhythm100([12])).toBe(Math.round(((12 + 5 * 7.5) / 6) * 100));
    expect(userRhythm100([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 99])).toBe(
      Math.round(((10 * 14.5 + 37.5) / 15) * 100),
    );
  });

  test('ipu: un ejercicio compartido cuenta una vez; contracción; límites', () => {
    expect(ipuFor([])).toBeCloseTo(1.65, 12);
    expect(ipuFor([{ items: 1, units: 2 }])).toBeCloseTo((0.5 + 5 * 1.65) / 6, 12);
    expect(ipuFor(Array.from({ length: 10 }, () => ({ items: 30, units: 1 })))).toBe(3);
    expect(ipuFor(Array.from({ length: 10 }, () => ({ items: 1, units: 30 })))).toBeCloseTo(
      (10 / 30 + 5 * 1.65) / 15,
      12,
    );
  });
});

describe('AL19 (9.7)', () => {
  const day = (i: number) => new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
  const m = (i: number, pend: number, over: Partial<DebtMeasures> = {}): DebtMeasures => ({
    studyDate: day(i),
    B: 75,
    ipu: 1.65,
    pendUnits: pend,
    debtPrevUnits: pend,
    load45: null,
    ...over,
  });

  test('arranque: entra exactamente el 15.º día medido con deuda > B todos los días', () => {
    const init = initialDebtState(day(0));
    const series = Array.from({ length: 20 }, (_, i) => m(i + 1, 200));
    let s = init;
    const rows: { debtItems: number }[] = [];
    let enteredAt = -1;
    series.forEach((x, i) => {
      const r = al19Eval(s, rows, x);
      s = r.state;
      rows.push(r.row);
      if (s.active && enteredAt < 0) enteredAt = i + 1;
    });
    expect(enteredAt).toBe(15);
    expect(s.entries).toBe(1);
    expect(s.imaxEffective).toBe(90);
    expect(rows[13]!).toMatchObject({ trendRatio: null, al19Active: false });
  });

  test('no evalúa el día del corte ni días ya evaluados', () => {
    expect(() => al19Eval(initialDebtState(day(0)), [], m(0, 10))).toThrow();
  });

  test('la tendencia que baja un 25 % o más impide entrar; la racha se reinicia sin deuda', () => {
    let s = initialDebtState(day(0));
    const rows: { debtItems: number }[] = [];
    for (let i = 1; i <= 30; i++) {
      const pend = Math.round(400 * Math.pow(0.97, i)); // baja ~35 % en 14 días
      const r = al19Eval(s, rows, m(i, pend));
      s = r.state;
      rows.push(r.row);
    }
    expect(s.active).toBe(false);
    const r = al19Eval({ ...s, enterStreak: 13 }, rows, m(31, 10));
    expect(r.state.enterStreak).toBe(0);
  });

  test('salida: 7 días de estudio con deuda 0 y carga ≤ 0,8·B; los días sin estudio no cuentan', () => {
    let s: DebtState = {
      ...initialDebtState(day(0)),
      active: true,
      imaxEffective: 90,
      entries: 1,
      measuredDays: 20,
      enteredOn: day(0),
    };
    const rows: { debtItems: number }[] = [];
    let i = 1;
    for (let k = 0; k < 6; k++, i += 2) {
      const r = al19Eval(s, rows, m(i, 0, { load45: 50, debtPrevUnits: 0 }));
      s = r.state;
      rows.push(r.row);
    }
    expect(s.active).toBe(true);
    expect(s.exitStreak).toBe(6);
    // Carga alta: la racha vuelve a 0.
    const high = al19Eval(s, rows, m(i, 0, { load45: 61, debtPrevUnits: 0 }));
    expect(high.state.exitStreak).toBe(0);
    const out = al19Eval(s, rows, m(i, 0, { load45: 60, debtPrevUnits: 0 }));
    expect(out.state.active).toBe(false);
    expect(out.state.imaxEffective).toBe(45);
    expect(out.state.enterStreak).toBe(0);
  });

  test('reconstrucción desde el estado inicial y las filas da lo mismo', () => {
    const series = Array.from({ length: 60 }, (_, i) =>
      m(i + 1, i < 30 ? 200 : 0, { load45: 40, debtPrevUnits: i < 30 ? 200 : 0 }),
    );
    const a = al19Rebuild(initialDebtState(day(0)), series);
    const b = al19Rebuild(initialDebtState(day(0)), series);
    expect(b).toEqual(a);
    expect(a.state.entries).toBe(1);
    expect(a.state.active).toBe(false); // entró el 15.º y salió tras 7 días en 0
    expect(AL19.enterDays).toBe(14);
  });
});
