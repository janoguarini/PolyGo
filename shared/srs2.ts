/**
 * SRS v2 (`srs-2.0.0`, docs/ADAPTIVE_LEARNING_DESIGN.md rev. 4.2): réplica TS del modelo cuya
 * autoridad es SQL (supabase/migrations/20261109120000_srs_v2.sql, `srs_v2_update`).
 *
 * - Núcleo de memoria: ecuaciones publicadas de FSRS-4.5 (dificultad D, estabilidad S y
 *   recuperabilidad R con curva potencia), reescritas aquí; no se copió código de ninguna
 *   implementación (apéndice C). Pesos iniciales AL3: los por defecto de FSRS-4.5 con w0 0,2 y w2 0,6.
 * - Capa de sesión de PolyGo (5.3–5.9): agregación sin dilución de errores, neutros y exposiciones,
 *   contradicción continua, reloj y fechas proporcionales, E1–E5, escalera, dispersión determinista.
 * - Cuantización de q en enteros (13.2, Q1–Q12): nunca se clasifica a partir de un double.
 * - AL19 (9.7), presupuesto (8.1–8.2), `ipu` (9.7) y la regla de autoridad del motor (7.2).
 *
 * Unidades de tiempo: el núcleo trabaja en días (segundos / 86 400) sin zona horaria. Lo que
 * depende del día local (elegibilidad, «inicio del día siguiente», día de estudio) recibe la zona.
 */

export const SRS_ALGORITHM_VERSION = 'srs-2.0.0';
export const SRS_WEIGHTS_VERSION = 'srs-2.0.0-w-initial';
export const SRS_PLANNER_VERSION = 'planner-2.0.0';

/** FSRS-4.5 por defecto (w0…w16) con w0 = 0,2 y w2 = 0,6 (6.1, AL3). w1, w3, w15 y w16 no se usan. */
export const SRS_INITIAL_WEIGHTS: readonly number[] = [
  0.2, 1.4003, 0.6, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793,
  0.3246, 1.587, 0.2272, 2.8755,
];

export const SRS_PARAMS = {
  /** Retención objetivo r (AL2, provisional). */
  targetRetention: 0.85,
  /** I_max normal (AL9) y durante AL19. */
  imax: 45,
  imaxDebt: 90,
  /** Contradicción c0 (6.2). */
  c0: 0.5,
  /** Reaprendizaje: 1 día. */
  relearnDays: 1,
  /** Dispersión ±5 %. */
  dispersion: 0.05,
  /** Límite del motor β (AL4). */
  beta: 0.5,
  /** Umbral de error pleno z⁻ ≥ 0,5. */
  fullError: 0.5,
} as const;

export const F = 19 / 81;
export const DECAY = -0.5;
const DAY_MS = 86_400_000;

/** τ: intervalo por unidad de S para la retención r: R(τ·S) = r. */
export function tauFor(r: number): number {
  return (Math.pow(r, 1 / DECAY) - 1) / F;
}

export const TAU = tauFor(SRS_PARAMS.targetRetention);

export function stabilityMax(imax: number): number {
  return imax / TAU;
}

export function retrievability(deltaDays: number, S: number): number {
  return Math.pow(1 + (F * deltaDays) / S, DECAY);
}

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

function D0(w: readonly number[], G: number): number {
  return clamp(w[4]! - (G - 3) * w[5]!, 1, 10);
}

/** Actualización de dificultad de FSRS-4.5 con grado G (5.1). */
function dCore(w: readonly number[], D: number, G: number): number {
  return clamp(w[7]! * D0(w, 3) + (1 - w[7]!) * (D - w[6]! * (G - 3)), 1, 10);
}

// ---------------------------------------------------------------------------------------------
// 13.2 Cuantización de q: enteros en diezmilésimos, mitad hacia arriba.

/** Factores de ayuda de Mastery 5.5 en diezmilésimos. `reading_toggles` no tiene factor. */
export const ASSIST_FACTORS4 = {
  audio_replays: 8500,
  hints_revealed: 4000,
  prompt_audio_plays: 8000,
  reading_visible: 6000,
  slow_audio_plays: 7000,
} as const;

const idiv = (n: number, d: number) => (n - (n % d)) / d;

/** Un paso de a4: (a4·f4 + 5 000) div 10 000. */
function applyFactor4(a4: number, f4: number): number {
  return idiv(a4 * f4 + 5000, 10000);
}

/** Cuántas veces se aplica cada factor según el valor registrado de la ayuda. */
function assistTimes(id: string, value: unknown): number {
  const n = typeof value === 'boolean' ? (value ? 1 : 0) : typeof value === 'number' ? value : 0;
  if (!Number.isFinite(n) || n <= 0) return 0;
  switch (id) {
    case 'audio_replays':
      return Math.max(0, Math.floor(n) - 1); // 1 repetición gratis
    case 'hints_revealed':
      return Math.floor(n); // × 0,4 por pista
    default:
      return 1; // ≥ 1 → una vez
  }
}

/**
 * a4: se parte de 10 000 y se aplica cada factor en el orden de `ref_assists.id` (orden de texto),
 * redondeando en cada paso; piso 2 500.
 */
export function assistFactor4(assists: Record<string, unknown> | null | undefined): number {
  let a4 = 10000;
  const ids = Object.keys(ASSIST_FACTORS4).sort();
  for (const id of ids) {
    const times = assistTimes(id, assists?.[id]);
    for (let k = 0; k < times; k++) {
      a4 = applyFactor4(a4, ASSIST_FACTORS4[id as keyof typeof ASSIST_FACTORS4]);
    }
  }
  return Math.max(a4, 2500);
}

export type Verdict = 'correct' | 'typo' | 'incorrect';

/** s4 de Mastery 5.3: correct 10 000, correct_minor (typo) 9 000, partial round(score,4)·10⁴, resto 0. */
export function s4FromVerdict(verdict: Verdict | 'partial', score4?: number): number {
  switch (verdict) {
    case 'correct':
      return 10000;
    case 'typo':
      return 9000;
    case 'partial':
      if (!Number.isInteger(score4) || score4! < 0 || score4! > 10000) {
        throw new Error('s4FromVerdict: score4 entero en [0, 10000]');
      }
      return score4!;
    default:
      return 0;
  }
}

/** q4 = (s4·a4 + 5 000) div 10 000; P = s4·a4 ≤ 10⁸ (C41). */
export function quantizeQ(s4: number, a4: number): number {
  if (
    !Number.isInteger(s4) ||
    !Number.isInteger(a4) ||
    s4 < 0 ||
    a4 < 0 ||
    s4 > 10000 ||
    a4 > 10000
  ) {
    throw new Error(`quantizeQ: entradas fuera de rango (${s4}, ${a4})`);
  }
  return quantizeP(s4 * a4);
}

export function quantizeP(P: number): number {
  if (!Number.isInteger(P) || P < 0 || P > 100_000_000)
    throw new Error(`quantizeQ: P fuera de rango (${P})`);
  return idiv(P + 5000, 10000);
}

export type QClass = 'success' | 'neutral' | 'error';

export function classifyQ4(q4: number): QClass {
  return q4 > 5000 ? 'success' : q4 === 5000 ? 'neutral' : 'error';
}

// ---------------------------------------------------------------------------------------------
// 5.3 Observaciones y agregación por sesión.

/** Escalón del ítem respecto del objetivo T(u). */
export type RelRung = -2 | -1 | 0 | 1;

export interface Observation {
  /** q discretizado (vía de producción). */
  q4?: number;
  /** q real sin discretizar (sólo para probar la continuidad de las fórmulas, Q12). */
  q?: number;
  /** Escalón respecto de T (para aciertos y errores; en errores define ψ). */
  r: RelRung;
  /** Conceptos `target` del ítem en la dimensión (culpa χ = 1/nT); 1 si hay concept_outcomes. */
  nT: number;
}

export const KAPPA: Record<RelRung, number> = { [-2]: 0.25, [-1]: 0.5, [0]: 1, [1]: 1 } as Record<
  RelRung,
  number
>;

export interface Aggregate {
  A: number;
  rho: number;
  Phi: number;
  Ferr: number;
  C: number;
  c: number;
  zMinus: number;
  supp: number;
  informative: boolean;
}

const ramp = (z: number) => clamp((z - 0.6) / 0.4, 0, 1);

export function aggregate(observations: readonly Observation[]): Aggregate {
  const successes: { z: number; r: RelRung }[] = [];
  const errors: { phi: number; r: RelRung }[] = [];
  for (const o of observations) {
    let z: number | null = null;
    let e: number | null = null;
    if (o.q4 !== undefined) {
      const cls = classifyQ4(o.q4);
      if (cls === 'success') z = (o.q4 - 5000) / 5000;
      else if (cls === 'error') e = (5000 - o.q4) / 5000;
    } else if (o.q !== undefined) {
      if (o.q > 0.5) z = (o.q - 0.5) / 0.5;
      else if (o.q < 0.5) e = (0.5 - o.q) / 0.5;
    } else {
      throw new Error('aggregate: observación sin q');
    }
    if (z !== null) successes.push({ z, r: o.r });
    if (e !== null) {
      const psi = o.r === 1 ? 0.5 : 1;
      const chi = 1 / o.nT;
      errors.push({ phi: psi * chi * e, r: o.r });
    }
  }
  let A = 0;
  let rho = 0;
  let Phi = 0;
  for (const s of successes) {
    A = Math.max(A, KAPPA[s.r] * s.z);
    rho = Math.max(rho, s.z);
    if (s.r >= -1) Phi = Math.max(Phi, KAPPA[s.r] * ramp(s.z));
  }
  let prod = 1;
  for (const e of errors) prod *= 1 - e.phi;
  const Ferr = errors.length ? 1 - prod : 0;
  let C = 0;
  if (errors.length) {
    C = Infinity;
    for (const e of errors) {
      let best = 0;
      for (const s of successes) if (s.r >= e.r) best = Math.max(best, s.z);
      C = Math.min(C, best);
    }
  }
  const c = 1 - (1 - SRS_PARAMS.c0) * C;
  const zMinus = c * Ferr;
  const supp = Math.max(0, 1 - 2 * Ferr);
  return { A, rho, Phi, Ferr, C, c, zMinus, supp, informative: A > 0 || Ferr > 0 };
}

// ---------------------------------------------------------------------------------------------
// 5.2 Estado, escalera (5.9) y actualización (5.4–5.6).

export type Dimension = 'vocabulary' | 'grammar' | 'comprehension' | 'production';
export type Rung = 'R' | 'G' | 'L' | 'P' | 'F' | 'U';

const LOWER_LEVELS = new Set(['A1', 'A2']);

export function ladderFor(dim: Dimension): readonly Rung[] {
  if (dim === 'production') return ['P', 'F'];
  if (dim === 'comprehension') return ['U'];
  return ['R', 'G', 'L'];
}

/** Escalón objetivo T (Mastery 4.2) según la dimensión y concepts.level. */
export function targetRung(dim: Dimension, level: string): Rung {
  if (dim === 'production') return LOWER_LEVELS.has(level) ? 'P' : 'F';
  if (dim === 'comprehension') return 'U';
  return 'L';
}

/** Escalón de un modo de evaluación en la escalera de la dimensión (Mastery 4.2); null si no aplica. */
export function rungForMode(dim: Dimension, mode: string): Rung | null {
  if (dim === 'comprehension') {
    return mode === 'listening_comprehension' || mode === 'reading_comprehension' ? 'U' : null;
  }
  if (dim === 'production') {
    return mode === 'controlled_production' ? 'P' : mode === 'free_production' ? 'F' : null;
  }
  switch (mode) {
    case 'recognition':
      return 'R';
    case 'cued_recall':
    case 'guided_construction':
      return 'G';
    case 'free_recall':
    case 'controlled_production':
    case 'free_production':
      return 'L';
    default:
      return null;
  }
}

/** r_i: posición del escalón del ítem respecto de T, en [−2, +1]. */
export function relativeRung(dim: Dimension, itemRung: Rung, target: Rung): RelRung {
  const ladder = ladderFor(dim);
  const r = ladder.indexOf(itemRung) - ladder.indexOf(target);
  if (ladder.indexOf(itemRung) < 0 || r < -2 || r > 1) {
    throw new Error(`relativeRung: escalón ${itemRung} fuera de la escalera de ${dim}`);
  }
  return r as RelRung;
}

/** Escalón inicial: G en vocabulario y gramática («empieza en G después de la lección»). */
export function startRung(dim: Dimension): Rung {
  return ladderFor(dim)[dim === 'vocabulary' || dim === 'grammar' ? 1 : 0]!;
}

export interface UnitState {
  S: number | null;
  D: number | null;
  n: number;
  lapses: number;
  exposures: number;
  /** Días (época Unix / 86 400). */
  tLast: number | null;
  lastSeen: number;
  due: number;
  rung: Rung;
  relearning: boolean;
  lastA: number | null;
  lastZMinus: number | null;
}

export interface UpdateContext {
  /** t_srs en días. */
  t: number;
  /** Factor de dispersión f = 1 + 0,05·(2H − 1); 1 sin dispersión. */
  f: number;
  /** I_max vigente (45, o 90 con AL19). */
  imax: number;
  /** Inicio del día local siguiente a t (para unidades sólo expuestas), en días. */
  nextLocalDayStart: number;
  dim: Dimension;
  target: Rung;
  weights?: readonly number[];
  targetRetention?: number;
}

export interface UpdateResult {
  state: UnitState;
  agg: Aggregate;
  kind: 'exposure' | 'init' | 'update';
}

function intervalDays(S: number, ctx: UpdateContext, tau: number): number {
  return Math.min(ctx.imax, S * tau * ctx.f);
}

function nextDue(prevDue: number, t: number, I: number, agg: Aggregate): number {
  const base = prevDue + agg.rho * Math.max(0, t + I - prevDue);
  let due = base + agg.Ferr * Math.min(0, t + I - base);
  if (agg.zMinus >= SRS_PARAMS.fullError) due = t + Math.min(I, SRS_PARAMS.relearnDays);
  if (agg.Ferr > 0 && prevDue > t) due = Math.min(due, prevDue);
  return due;
}

function moveRung(state: UnitState, agg: Aggregate, ctx: UpdateContext): Rung {
  const ladder = ladderFor(ctx.dim);
  const i = ladder.indexOf(state.rung);
  const top = ladder.indexOf(ctx.target);
  if (agg.zMinus >= SRS_PARAMS.fullError) return ladder[Math.max(0, i - 1)]!;
  if (agg.Ferr === 0 && agg.A > 0) return ladder[Math.min(top, i + 1)]!;
  return state.rung;
}

/**
 * Aplica una sesión a una unidad: exposición, inicialización (5.5) o actualización (5.4–5.6).
 * `prev` nulo = la unidad no tiene fila.
 */
export function updateUnit(
  prev: UnitState | null,
  obs: readonly Observation[],
  ctx: UpdateContext,
): UpdateResult {
  const w = ctx.weights ?? SRS_INITIAL_WEIGHTS;
  const tau = tauFor(ctx.targetRetention ?? SRS_PARAMS.targetRetention);
  const Smax = ctx.imax / tau;
  const agg = aggregate(obs);
  const t = ctx.t;

  if (!agg.informative) {
    if (!prev) {
      return {
        agg,
        kind: 'exposure',
        state: {
          S: null,
          D: null,
          n: 0,
          lapses: 0,
          exposures: 1,
          tLast: null,
          lastSeen: t,
          due: ctx.nextLocalDayStart,
          rung: startRung(ctx.dim),
          relearning: false,
          lastA: null,
          lastZMinus: null,
        },
      };
    }
    return {
      agg,
      kind: 'exposure',
      state: { ...prev, exposures: prev.exposures + 1, lastSeen: t },
    };
  }

  const full = agg.zMinus >= SRS_PARAMS.fullError;
  if (!prev || prev.S === null || prev.D === null || prev.tLast === null) {
    const S = clamp(w[0]! * Math.pow(w[2]! / w[0]!, agg.A * (1 - agg.zMinus)), 0.01, Smax);
    const D = clamp(D0(w, 3) + 2 * w[5]! * agg.zMinus, 1, 10);
    const I = intervalDays(S, ctx, tau);
    // Primera sesión informativa: t + I, o el reaprendizaje si el error es pleno. Es lo que dan los
    // vectores publicados de 5.11 («Estado inicial») y el simulador; el texto de 5.5 dice «según 5.6
    // con due previo = t», que daría t + ρ·I (ver docs/ADAPTIVE_LEARNING_PHASE3.md, conflicto X1).
    const due = full ? t + Math.min(I, SRS_PARAMS.relearnDays) : t + I;
    const start = startRung(ctx.dim);
    const ladder = ladderFor(ctx.dim);
    return {
      agg,
      kind: 'init',
      state: {
        S,
        D,
        n: 1,
        lapses: (prev?.lapses ?? 0) + (full ? 1 : 0),
        exposures: (prev?.exposures ?? 0) + 1,
        tLast: t,
        lastSeen: t,
        due,
        rung: full ? ladder[Math.max(0, ladder.indexOf(start) - 1)]! : start,
        relearning: full,
        lastA: agg.A,
        lastZMinus: agg.zMinus,
      },
    };
  }

  const { S, D, tLast } = prev;
  const delta = t - tLast;
  const R = retrievability(delta, S);
  const info = Math.min(1, (1 - R) / 0.1);
  const SInc = Math.exp(w[8]!) * (11 - D) * Math.pow(S, -w[9]!) * (Math.exp(w[10]! * (1 - R)) - 1);
  const Ss = S * (1 + agg.supp * agg.A * SInc);
  const Sf = Math.min(
    S,
    w[11]! * Math.pow(D, -w[12]!) * (Math.pow(S + 1, w[13]!) - 1) * Math.exp(w[14]! * (1 - R)),
  );
  let S2 = Ss * Math.pow(Sf / S, agg.zMinus);
  S2 = Math.max(S2, agg.Phi * agg.supp * ((F * delta) / 3));
  S2 = clamp(S2, 0.01, Smax);
  const DE = dCore(w, D, 1);
  const DG = dCore(w, D, 3);
  const D2 = clamp(
    D + agg.zMinus * Math.max(0, DE - D) - info * agg.A * agg.supp * Math.max(0, D - DG),
    1,
    10,
  );
  const g = Math.max(agg.rho, agg.Ferr);
  const I = intervalDays(S2, ctx, tau);
  return {
    agg,
    kind: 'update',
    state: {
      S: S2,
      D: D2,
      n: prev.n + 1,
      lapses: prev.lapses + (full ? 1 : 0),
      exposures: prev.exposures + 1,
      tLast: tLast + g * (t - tLast),
      lastSeen: t,
      due: nextDue(prev.due, t, I, agg),
      rung: moveRung(prev, agg, ctx),
      relearning: full,
      lastA: agg.A,
      lastZMinus: agg.zMinus,
    },
  };
}

/** numeric(…, 4) de PostgreSQL: mitad lejos de cero. */
export function round4(x: number): number {
  const s = Math.sign(x);
  return (s * Math.round(Math.abs(x) * 10000 + 1e-9)) / 10000;
}

/** Lo que guarda la base: S, D, A y z⁻ con 4 decimales y las horas en microsegundos. */
export function storedState(s: UnitState): UnitState {
  const us = (d: number) => Math.round(d * 86_400_000_000) / 86_400_000_000;
  return {
    ...s,
    S: s.S === null ? null : round4(s.S),
    D: s.D === null ? null : round4(s.D),
    lastA: s.lastA === null ? null : round4(s.lastA),
    lastZMinus: s.lastZMinus === null ? null : round4(s.lastZMinus),
    tLast: s.tLast === null ? null : us(s.tLast),
    lastSeen: us(s.lastSeen),
    due: us(s.due),
  };
}

// ---------------------------------------------------------------------------------------------
// 13.2 Hash de la unidad: `polygo.unit_hash.v1` = FNV-1a de 32 bits sobre las unidades UTF-16 de
// `<user_id>|<concept_id>|<dimension>`, dividido por 2³². Igual en SQL (srs_v2_unit_hash).

export function unitHash(userId: string, conceptId: string, dimension: string): number {
  const input = `${userId}|${conceptId}|${dimension}`;
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h >>> 0) / 4294967296;
}

export function dispersionFactor(H: number): number {
  return 1 + SRS_PARAMS.dispersion * (2 * H - 1);
}

// ---------------------------------------------------------------------------------------------
// Día local (zona IANA).

export const msToDays = (ms: number) => ms / DAY_MS;
export const daysToMs = (d: number) => d * DAY_MS;

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function fmt(tz: string): Intl.DateTimeFormat {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    fmtCache.set(tz, f);
  }
  return f;
}

function parts(ms: number, tz: string) {
  const p: Record<string, number> = {};
  for (const x of fmt(tz).formatToParts(new Date(ms)))
    if (x.type !== 'literal') p[x.type] = Number(x.value);
  return p as {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
}

/** Fecha local `YYYY-MM-DD` de un instante. */
export function localDate(ms: number, tz: string): string {
  const p = parts(ms, tz);
  return `${String(p.year).padStart(4, '0')}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

function offsetMs(ms: number, tz: string): number {
  const p = parts(ms, tz);
  return (
    Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ms / 1000) * 1000
  );
}

/** Instante de las 00:00 locales de la fecha `YYYY-MM-DD` (como `date::timestamp at time zone tz`). */
export function localMidnight(date: string, tz: string): number {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const naive = Date.UTC(y, m - 1, d);
  let guess = naive - offsetMs(naive, tz);
  guess = naive - offsetMs(guess, tz);
  return guess;
}

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** D1 de 7.2 y vencimiento de una unidad sólo expuesta: inicio del día local siguiente. */
export function startOfNextLocalDay(ms: number, tz: string): number {
  return localMidnight(addDays(localDate(ms, tz), 1), tz);
}

// ---------------------------------------------------------------------------------------------
// 7.2 Sugerencia del motor (R1) y elegibilidad (5.6, I3b, I5).

export interface MasteryHintInput {
  /** Fila del motor existente, en una versión habilitada para Adaptive. */
  versionEnabled: boolean;
  /** Retención suficiente (≥ 2 sondeos con Δ ≥ 1 d). */
  retentionSufficient: boolean;
  /** Vida media del motor ĥ_ME en días. */
  halfLifeDays: number | null;
  /** Última exposición t_exp (ms). */
  lastExposureMs: number | null;
  dirtySinceMs: number | null;
  computedAtMs: number | null;
}

export interface HintState {
  tLastMs: number | null;
  dueMs: number;
  lastSeenMs: number;
  S: number | null;
}

export interface HintResult {
  eligible: boolean;
  hasHint: boolean;
  dueEffectiveMs: number;
  hintAtMs: number | null;
  expiresAtMs: number | null;
}

const H72 = 72 * 3_600_000;

export function masteryHint(
  me: MasteryHintInput | null,
  s: HintState,
  nowMs: number,
  tz: string,
  r: number = SRS_PARAMS.targetRetention,
): HintResult {
  const none: HintResult = {
    eligible: false,
    hasHint: false,
    dueEffectiveMs: s.dueMs,
    hintAtMs: null,
    expiresAtMs: null,
  };
  const ok = (x: number | null): x is number => x !== null && Number.isFinite(x);
  if (!me || !me.versionEnabled || !me.retentionSufficient) return none;
  if (!ok(me.halfLifeDays) || me.halfLifeDays <= 0) return none;
  if (!ok(me.lastExposureMs) || me.lastExposureMs > nowMs) return none;
  if (
    me.dirtySinceMs !== null &&
    (!Number.isFinite(me.dirtySinceMs) || nowMs - me.dirtySinceMs > H72)
  )
    return none;
  if (!ok(me.computedAtMs) || nowMs - me.computedAtMs > 7 * DAY_MS) return none;
  if (s.S === null || !ok(s.tLastMs)) return none;
  const Isrs = s.dueMs - s.tLastMs;
  if (!(Isrs > 0)) return none;
  const dueME = me.lastExposureMs + me.halfLifeDays * Math.log2(1 / r) * DAY_MS;
  const D1 = startOfNextLocalDay(s.lastSeenMs, tz);
  const floor = Math.max(s.tLastMs + SRS_PARAMS.beta * Isrs, D1);
  const cand = Math.max(dueME, floor);
  if (!(cand < s.dueMs)) return { ...none, eligible: true };
  return {
    eligible: true,
    hasHint: true,
    dueEffectiveMs: cand,
    hintAtMs: nowMs,
    expiresAtMs: Math.min(nowMs + H72, me.computedAtMs! + 7 * DAY_MS),
  };
}

/** I5: el planificador usa due_effective_at sólo si la sugerencia sigue vigente. */
export function effectiveDueMs(
  dueMs: number,
  dueEffectiveMs: number,
  expiresAtMs: number | null,
  nowMs: number,
): number {
  return expiresAtMs !== null && expiresAtMs > nowMs && dueEffectiveMs < dueMs
    ? dueEffectiveMs
    : dueMs;
}

/** 5.6 / I3b: elegible el día `today` si vence ese día o antes y no se vio ese mismo día local. */
export function isEligible(
  effDueMs: number,
  lastSeenMs: number,
  today: string,
  tz: string,
): boolean {
  return localDate(effDueMs, tz) <= today && localDate(lastSeenMs, tz) !== today;
}

// ---------------------------------------------------------------------------------------------
// 8.1–8.2 Presupuesto y reserva; 9.7 ipu.

export const PLANNER_PARAMS = {
  /** Ritmo provisional en centésimas de ejercicio por minuto (7,5). */
  rhythmPop100: 750,
  /** Contracción del ritmo y de ipu hacia la población: peso 5. */
  shrinkWeight: 5,
  /** Sesiones para estimar el ritmo y ipu. */
  windowSessions: 10,
  ipuPop: 1.65,
  ipuMin: 0.5,
  ipuMax: 3,
  /** Tamaño de sesión S (provisional). */
  sessionSize: 15,
} as const;

/** B = ⌊meta × ritmo⌋ con el ritmo en centésimas: ⌊meta · ritmo_100 / 100⌋. */
export function dailyBudget(
  goalMinutes: number,
  rhythm100: number = PLANNER_PARAMS.rhythmPop100,
): number {
  if (
    !Number.isInteger(goalMinutes) ||
    !Number.isInteger(rhythm100) ||
    goalMinutes < 0 ||
    rhythm100 < 0
  ) {
    throw new Error('dailyBudget: enteros no negativos');
  }
  return idiv(goalMinutes * rhythm100, 100);
}

/** Reserva para lecciones: ⌊(B + 2) / 5⌋ (20 % redondeado al entero más cercano). */
export function lessonReserve(B: number): number {
  return idiv(B + 2, 5);
}

/**
 * Ritmo por usuario (8.1): mediana de respuestas por minuto de sus últimas 10 sesiones, contraída
 * hacia la población: (n·r_u + 5·r_pob)/(n + 5), redondeado a 2 decimales (centésimas).
 */
export function userRhythm100(
  answersPerMinute: readonly number[],
  pop100: number = PLANNER_PARAMS.rhythmPop100,
): number {
  const xs = answersPerMinute
    .filter((x) => Number.isFinite(x) && x > 0)
    .slice(0, PLANNER_PARAMS.windowSessions);
  const n = xs.length;
  if (n === 0) return pop100;
  const sorted = [...xs].sort((a, b) => a - b);
  const med = n % 2 ? sorted[(n - 1) / 2]! : (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2;
  const k = PLANNER_PARAMS.shrinkWeight;
  return Math.round(((n * med + (k * pop100) / 100) / (n + k)) * 100);
}

/** ipu_d = clamp((n·ipu_u + 5·ipu_pob)/(n + 5), 0,5, 3); ipu_u = Σ ítems distintos / Σ unidades atendidas. */
export function ipuFor(
  sessions: readonly { items: number; units: number }[],
  pop: number = PLANNER_PARAMS.ipuPop,
): number {
  const xs = sessions.slice(0, PLANNER_PARAMS.windowSessions).filter((s) => s.units > 0);
  const n = xs.length;
  if (n === 0) return clamp(pop, PLANNER_PARAMS.ipuMin, PLANNER_PARAMS.ipuMax);
  const items = xs.reduce((a, s) => a + s.items, 0);
  const units = xs.reduce((a, s) => a + s.units, 0);
  const k = PLANNER_PARAMS.shrinkWeight;
  return clamp(
    (n * (items / units) + k * pop) / (n + k),
    PLANNER_PARAMS.ipuMin,
    PLANNER_PARAMS.ipuMax,
  );
}

// ---------------------------------------------------------------------------------------------
// 9.7 AL19: I_max dinámico durante la deuda. Función pura al19_eval(estado, filas anteriores, medidas).

export const AL19 = { enterDays: 14, enterRatio: 0.75, exitDays: 7, exitLoad: 0.8 } as const;

export interface DebtState {
  active: boolean;
  imaxEffective: 45 | 90;
  enterStreak: number;
  exitStreak: number;
  entries: number;
  measuredDays: number;
  enteredOn: string | null;
  evaluatedOn: string;
}

export interface DebtMeasures {
  studyDate: string;
  B: number;
  ipu: number;
  pendUnits: number;
  debtPrevUnits: number;
  /** Σ ipu / máx(1, mín(45, S·τ)); sólo se usa si AL19 está activa. */
  load45: number | null;
}

export interface DebtDayRow extends DebtMeasures {
  debtItems: number;
  trendRatio: number | null;
  al19Active: boolean;
  imaxEffective: 45 | 90;
}

/** Estado inicial en el corte (C39) o para un idioma sin estado. */
export function initialDebtState(evaluatedOn: string): DebtState {
  return {
    active: false,
    imaxEffective: 45,
    enterStreak: 0,
    exitStreak: 0,
    entries: 0,
    measuredDays: 0,
    enteredOn: null,
    evaluatedOn,
  };
}

/**
 * Evalúa AL19 para el día de estudio medido `m.studyDate` con el estado anterior y las filas de los
 * días medidos anteriores (en orden de fecha). Devuelve el estado nuevo y la fila del día.
 */
export function al19Eval(
  prev: DebtState,
  prevRows: readonly { debtItems: number }[],
  m: DebtMeasures,
): { state: DebtState; row: DebtDayRow } {
  if (m.studyDate <= prev.evaluatedOn) throw new Error('al19Eval: el día ya fue evaluado');
  const debtItems = m.pendUnits * m.ipu;
  const back =
    prevRows.length >= AL19.enterDays ? prevRows[prevRows.length - AL19.enterDays]! : null;
  const trendRatio = back && back.debtItems > 0 ? debtItems / back.debtItems : null;
  const s: DebtState = { ...prev, measuredDays: prev.measuredDays + 1, evaluatedOn: m.studyDate };
  if (!prev.active) {
    s.enterStreak = debtItems > m.B ? prev.enterStreak + 1 : 0;
    if (s.enterStreak >= AL19.enterDays && back && debtItems >= AL19.enterRatio * back.debtItems) {
      s.active = true;
      s.imaxEffective = 90;
      s.enteredOn = m.studyDate;
      s.exitStreak = 0;
      s.entries = prev.entries + 1;
    }
  } else {
    const ok = m.debtPrevUnits === 0 && m.load45 !== null && m.load45 <= AL19.exitLoad * m.B;
    s.exitStreak = ok ? prev.exitStreak + 1 : 0;
    if (s.exitStreak >= AL19.exitDays) {
      s.active = false;
      s.imaxEffective = 45;
      s.enterStreak = 0;
    }
  }
  return {
    state: s,
    row: {
      ...m,
      load45: prev.active ? m.load45 : null,
      debtItems,
      trendRatio,
      al19Active: s.active,
      imaxEffective: s.imaxEffective,
    },
  };
}

/** Reconstrucción (17): parte del estado inicial y recorre las filas en orden. */
export function al19Rebuild(
  initial: DebtState,
  measures: readonly DebtMeasures[],
): { state: DebtState; rows: DebtDayRow[] } {
  let state = initial;
  const rows: DebtDayRow[] = [];
  for (const m of measures) {
    const r = al19Eval(state, rows, m);
    state = r.state;
    rows.push(r.row);
  }
  return { state, rows };
}
