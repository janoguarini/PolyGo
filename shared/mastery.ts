/**
 * Mastery Engine `me-1.0.1` (docs/MASTERY_ENGINE_DESIGN.md rev. 2.3): `me-1.0.0` (rev. 2) más el
 * punto de partida K6 de 5.7 con la regla de envejecimiento de 18/19 (rev. 2.3). Sin prior el
 * resultado es idéntico al de `me-1.0.0`, bit a bit. `model_eval` puro para un par
 * (concepto, dimensión). Segunda implementación (en double) de la canónica SQL en numeric
 * (supabase/migrations/20261109130000_mastery_engine.sql, M11); las pruebas exigen igualdad a 4
 * decimales en los vectores.
 *
 * Dominio m = P(acierto sin ayuda en el primer intento del escalón objetivo T), con una Beta cuyos
 * aciertos y errores son la evidencia ponderada (ρ·σ·φ, azar, ayudas, escalera). Confianza =
 * precisión × actualidad. Cota L = P5 numérico de la Beta. Retención: grilla de vidas medias.
 * Velocidad: sólo el escalón T. Nada del SRS ni de Adaptive entra aquí (3.2, AL-P5).
 */

/** me-1.0.1 = me-1.0.0 + K6 (rev. 2.3). Sin prior, ambos dan exactamente lo mismo. */
export const MASTERY_MODEL_VERSION = 'me-1.0.1';

export const ME_PARAMS = {
  H: 90,
  Hconf: 90,
  G: 7,
  sd0: 0.2887,
  tauR: 0.25,
  tauG: 0.5,
  aboveError: 0.5,
  minNeff: 2,
  minItems: 2,
  masteredM: 0.8,
  masteredL: 0.6,
  masteredDays: 2,
  transferS: 0.5,
  transferIndex: 0.6,
  weakM: 0.5,
  epsilon: 0.05,
  grid: [0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
  speedWindow: 20,
  speedMin: 3,
  speedClamp: [300, 120_000] as const,
  assistFloor: 0.25,
  /** `N_p` (5.7, tabla 5.14): fuerza máxima del punto de partida K6, en respuestas equivalentes. */
  Np: 4,
} as const;

export type MeDimension = 'vocabulary' | 'grammar' | 'comprehension' | 'production';
export type MeRung = 'R' | 'G' | 'L' | 'P' | 'F' | 'U';

/** Una fila de evidencia activa (3.2): primer intento o reintento de una corrección válida. */
export interface EvidenceRow {
  eventId: number;
  /** ms (recorded_at). */
  recordedAtMs: number;
  itemId: string;
  itemType: string;
  inputModality: string;
  assessmentMode: string;
  responseFormat: string;
  verdict: 'correct' | 'typo' | 'incorrect';
  /** Score de concept_outcomes si existe (nulo hoy). */
  score: number | null;
  isFirstTry: boolean;
  responseMs: number | null;
  /** Segundos desde la exposición anterior del concepto; nulo si es la primera. */
  sinceLastSeenS: number | null;
  /** Opciones presentadas (select) o parejas (pairs); nulo en tiles/typed. */
  choices: number | null;
  assists: Record<string, unknown>;
  recommendedSeconds: number;
  /** Primer intento anterior del mismo ítem por el usuario (ms), cualquier concepto; nulo si es nuevo. */
  prevItemFirstTryMs: number | null;
}

export interface MeInput {
  dimension: MeDimension;
  level: string;
  rows: readonly EvidenceRow[];
  /** Última exposición del concepto (ms), de los eventos, para la retención en as_of. */
  lastExposureMs: number | null;
  asOfMs: number;
  /**
   * Punto de partida K6 (5.7): la fila del concepto en el último snapshot verificado del nivel
   * anterior (`level_snapshot_rows` + `level_snapshots.frozen_at`), nunca `prior_*` de
   * `user_concept_state` (sección 3). Sólo en esta implementación TypeScript de referencia: la
   * canónica SQL todavía no tiene K6 (rev. 2.4; ensayo en tools/k6-sql-experiment). La selección es
   * `meSelectPrior` (19.1): sólo snapshots verificados con `verified_at <= as_of`, así que
   * `frozen_at <= as_of`; un prior con `frozen_at > as_of` es una entrada inválida y se rechaza.
   * Si `frozen_at > t_last`, α y β se envejecen hasta `frozen_at` (19.2). `mastery` y `confidence`
   * se usan tal como están guardados (`numeric(6,4)`, 19.3).
   */
  prior?: {
    /** `prior_mastery` del snapshot, en [0, 1]. */
    mastery: number;
    /** `prior_confidence` del snapshot, en [0, 1] (ya incluye la actualidad hasta `frozen_at`). */
    confidence: number;
    /** `frozen_at` del snapshot (ms). */
    frozenAtMs: number;
    /** `prior_snapshot_id`: se devuelve en el detalle para saber qué punto de partida se usó. */
    snapshotId: number;
  };
}

export type MeStatus = 'insufficient' | 'in_progress' | 'mastered';

export interface MeResult {
  status: MeStatus;
  mastery: number | null;
  confidence: number | null;
  lower: number | null;
  weak: boolean;
  retention: number | null;
  halfLifeDays: number | null;
  retentionSufficient: boolean;
  retentionDemonstrated: boolean;
  recallSpeed: number | null;
  sufficient: boolean;
  detail: {
    alpha: number;
    beta: number;
    sd: number;
    nEff: number;
    directItems: number;
    directDays: number;
    tLastMs: number | null;
    transfer: { sNov: number; index: number; met: boolean; far: { sNov: number; index: number } };
    rungs: Record<
      string,
      {
        N: number;
        S: number;
        F: number;
        speed: number | null;
        speedRows: number;
        impulsiveErrors: number;
      }
    >;
    retentionGrid: number[] | null;
    probes: number;
    evidence: { eventId: number; rung: MeRung; w: number; hits: number; misses: number }[];
    /** Sólo si se usó un punto de partida K6 (5.7); ausente sin él. */
    prior?: {
      snapshotId: number;
      nP: number;
      /** φ_p = 2^(−(máx(t_last, frozen_at) − frozen_at)/H). */
      phiP: number;
      /** k = 2^(−máx(0, frozen_at − t_last)/H): factor común de φ₀, S y F dentro de α y β (19.2). */
      k: number;
      alphaP: number;
      betaP: number;
    };
  };
}

const DAY = 86_400_000;
const r4 = (x: number) => (Math.sign(x) * Math.round(Math.abs(x) * 10000 + 1e-9)) / 10000;
/** El redondeo a 4 decimales del motor (umbrales y salidas); regla de 19.6 para una futura SQL de me-1.0.1. */
export const meRound4 = r4;

export function meLadder(dim: MeDimension): readonly MeRung[] {
  if (dim === 'production') return ['P', 'F'];
  if (dim === 'comprehension') return ['U'];
  return ['R', 'G', 'L'];
}

export function meTarget(dim: MeDimension, level: string): MeRung {
  if (dim === 'production') return level === 'A1' || level === 'A2' ? 'P' : 'F';
  if (dim === 'comprehension') return 'U';
  return 'L';
}

/** Escalón de un modo en la dimensión (4.2); nulo si el modo no está en su escalera. */
export function meRung(dim: MeDimension, mode: string): MeRung | null {
  if (dim === 'comprehension')
    return mode === 'listening_comprehension' || mode === 'reading_comprehension' ? 'U' : null;
  if (dim === 'production')
    return mode === 'controlled_production' ? 'P' : mode === 'free_production' ? 'F' : null;
  if (mode === 'recognition') return 'R';
  if (mode === 'cued_recall' || mode === 'guided_construction') return 'G';
  if (mode === 'free_recall' || mode === 'controlled_production' || mode === 'free_production')
    return 'L';
  return null;
}

/** s de 5.3. */
export function observedS(row: Pick<EvidenceRow, 'verdict' | 'score'>): number {
  if (row.score !== null) return row.score;
  return row.verdict === 'correct' ? 1 : row.verdict === 'typo' ? 0.9 : 0;
}

/** Factor de ayudas de 5.5 (producto real con piso 0,25). */
export function assistFactor(assists: Record<string, unknown>): number {
  const num = (v: unknown) =>
    typeof v === 'boolean' ? (v ? 1 : 0) : typeof v === 'number' && Number.isFinite(v) ? v : 0;
  let a = 1;
  const replays = Math.floor(num(assists.audio_replays));
  if (replays > 1) a *= Math.pow(0.85, replays - 1);
  if (num(assists.slow_audio_plays) >= 1) a *= 0.7;
  if (num(assists.prompt_audio_plays) >= 1) a *= 0.8;
  if (num(assists.reading_visible) >= 1) a *= 0.6;
  const hints = Math.floor(num(assists.hints_revealed));
  if (hints > 0) a *= Math.pow(0.4, hints);
  return Math.max(a, ME_PARAMS.assistFloor);
}

/** Azar g de 5.5: select / pairs con n → 1/n; tiles y typed → 0. */
export function chance(row: Pick<EvidenceRow, 'responseFormat' | 'choices'>): number {
  if (
    (row.responseFormat === 'select' || row.responseFormat === 'pairs') &&
    row.choices &&
    row.choices > 0
  )
    return 1 / row.choices;
  return 0;
}

export function sigma(sinceLastSeenS: number | null): number {
  if (sinceLastSeenS === null || sinceLastSeenS < 600) return 0.5;
  if (sinceLastSeenS < 86_400) return 0.8;
  return 1;
}

// ---------------------------------------------------------------------------------------------
// 5.8.3 P5 numérico: ln Γ (recurrencia + Stirling de 8 términos), I_x (Lentz, ≤ 300 iteraciones,
// corte 10⁻¹⁵, error si no converge) y bisección de 40 pasos.

const STIRLING = [
  1 / 12,
  -1 / 360,
  1 / 1260,
  -1 / 1680,
  1 / 1188,
  -691 / 360360,
  1 / 156,
  -3617 / 122400,
];

export function lnGamma(z: number): number {
  if (!(z > 0)) throw new Error('lnGamma: z > 0');
  let shift = 0;
  while (z < 10) {
    shift -= Math.log(z);
    z += 1;
  }
  const z2 = 1 / (z * z);
  let series = 0;
  let pow = 1 / z;
  for (const c of STIRLING) {
    series += c * pow;
    pow *= z2;
  }
  return shift + (z - 0.5) * Math.log(z) - z + 0.5 * Math.log(2 * Math.PI) + series;
}

function betaCf(x: number, a: number, b: number): number {
  const TINY = 1e-300;
  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < TINY) d = TINY;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-15) return h;
  }
  throw new Error('betaInc: la fracción continua no convergió en 300 iteraciones');
}

/** I_x(a, b), función de distribución de la Beta. */
export function betaInc(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const lbt = lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x);
  if (x < (a + 1) / (a + b + 2)) return (Math.exp(lbt) * betaCf(x, a, b)) / a;
  return 1 - (Math.exp(lbt) * betaCf(1 - x, b, a)) / b;
}

/** Q(0,05; a, b): bisección de 40 pasos sobre [0, 1], punto medio. */
export function betaP5(a: number, b: number, p = 0.05): number {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (betaInc(mid, a, b) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------------------------
// model_eval

export function modelEval(input: MeInput): MeResult {
  const P = ME_PARAMS;
  // 19.1: un snapshot sólo es elegible con verified_at ≤ as_of, y frozen_at ≤ verified_at. Un prior
  // posterior a as_of sería información del futuro: entrada inválida, nunca se usa en silencio.
  if (input.prior && !(input.prior.frozenAtMs <= input.asOfMs))
    throw new Error('mastery: prior con frozen_at posterior a as_of');
  const ladder = meLadder(input.dimension);
  const T = meTarget(input.dimension, input.level);
  const tIdx = ladder.indexOf(T);
  const rows = input.rows
    .filter(
      (r) =>
        r.isFirstTry &&
        r.recordedAtMs <= input.asOfMs &&
        meRung(input.dimension, r.assessmentMode) !== null,
    )
    .slice()
    .sort((x, y) => x.recordedAtMs - y.recordedAtMs || x.eventId - y.eventId);

  const rungs: MeResult['detail']['rungs'] = {};
  for (const k of ladder)
    rungs[k] = { N: 0, S: 0, F: 0, speed: null, speedRows: 0, impulsiveErrors: 0 };
  const empty: MeResult = {
    status: 'insufficient',
    mastery: null,
    confidence: null,
    lower: null,
    weak: false,
    retention: null,
    halfLifeDays: null,
    retentionSufficient: false,
    retentionDemonstrated: false,
    recallSpeed: null,
    sufficient: false,
    detail: {
      alpha: 1,
      beta: 1,
      sd: 0,
      nEff: 0,
      directItems: 0,
      directDays: 0,
      tLastMs: null,
      transfer: { sNov: 0, index: 0.5, met: false, far: { sNov: 0, index: 0.5 } },
      rungs,
      retentionGrid: null,
      probes: 0,
      evidence: [],
    },
  };
  if (rows.length === 0) return empty;

  const tLast = rows[rows.length - 1]!.recordedAtMs;
  const tFirst = rows[0]!.recordedAtMs;
  const phiOf = (ms: number) => Math.pow(2, -((tLast - ms) / DAY) / P.H);

  const directItems = new Set<string>();
  const directDays = new Set<string>();
  const seenItems = new Set<string>();
  const seenPairs = new Set<string>();
  let sNov = 0;
  let fNov = 0;
  let sFar = 0;
  let fFar = 0;
  const evidence: MeResult['detail']['evidence'] = [];

  for (const e of rows) {
    const k = meRung(input.dimension, e.assessmentMode)!;
    const rho =
      e.prevItemFirstTryMs === null
        ? 1
        : Math.min(1, (e.recordedAtMs - e.prevItemFirstTryMs) / DAY / P.G);
    const sig = sigma(e.sinceLastSeenS);
    const phi = phiOf(e.recordedAtMs);
    const w = rho * sig * phi;
    const s = observedS(e);
    const g = chance(e);
    const a = assistFactor(e.assists);
    const hits = w * (1 - g) * s * a;
    const misses = w * (1 - s * a);
    rungs[k]!.N += w;
    rungs[k]!.S += hits;
    rungs[k]!.F += misses;
    evidence.push({ eventId: e.eventId, rung: k, w, hits, misses });
    if (ladder.indexOf(k) >= tIdx) {
      directItems.add(e.itemId);
      directDays.add(new Date(e.recordedAtMs).toISOString().slice(0, 10));
    }
    // 5.10: filas nuevas (primer encuentro con el ítem, con evidencia previa del concepto con otro
    // ítem, escalón ≥ G; en comprensión y producción, cualquiera).
    const atLeastG =
      input.dimension === 'comprehension' ||
      input.dimension === 'production' ||
      ladder.indexOf(k) >= 1;
    const isNew = e.prevItemFirstTryMs === null && !seenItems.has(e.itemId);
    const hadOther = [...seenItems].some((it) => it !== e.itemId);
    if (isNew && hadOther && atLeastG) {
      sNov += sig * phi * (1 - g) * s * a;
      fNov += sig * phi * (1 - s * a);
      const pair = `${e.itemType}|${e.inputModality}`;
      if (!seenPairs.has(pair)) {
        sFar += sig * phi * (1 - g) * s * a;
        fFar += sig * phi * (1 - s * a);
      }
    }
    seenItems.add(e.itemId);
    seenPairs.add(`${e.itemType}|${e.inputModality}`);
  }

  let Sdir = 0;
  let Fdir = 0;
  let Wdir = 0;
  let Sind = 0;
  let Find = 0;
  ladder.forEach((k, i) => {
    const x = rungs[k]!;
    if (i >= tIdx) {
      Sdir += x.S;
      Fdir += i === tIdx ? x.F : P.aboveError * x.F;
      Wdir += x.N;
    } else {
      Sind += (k === 'R' ? P.tauR : P.tauG) * x.S;
      Find += x.F;
    }
  });
  Sind = Math.min(Sind, Sdir);
  const phi0 = Math.pow(2, -((tLast - tFirst) / DAY) / P.H);
  // 5.7 K6: evidencia ficticia del nivel anterior ubicada en frozen_at. Todo se envejece hasta
  // t_ref = máx(t_last, frozen_at) (19.2): el prior con φ_p, y φ₀, S y F con el factor común k, sólo
  // dentro de α y β. Si frozen_at ≤ t_last, k = 1 y es la fórmula literal de 5.7. No entra en n_eff,
  // ítems, días, transferencia, retención, velocidad ni en el detalle por escalón.
  let alphaP = 0;
  let betaP = 0;
  let k = 1;
  let priorDetail: MeResult['detail']['prior'];
  if (input.prior) {
    const tRef = Math.max(tLast, input.prior.frozenAtMs);
    if (input.prior.frozenAtMs > tLast)
      k = Math.pow(2, -((input.prior.frozenAtMs - tLast) / DAY) / P.H);
    const nP = P.Np * input.prior.confidence;
    const phiP = Math.pow(2, -((tRef - input.prior.frozenAtMs) / DAY) / P.H);
    alphaP = input.prior.mastery * nP * phiP;
    betaP = (1 - input.prior.mastery) * nP * phiP;
    priorDetail = { snapshotId: input.prior.snapshotId, nP, phiP, k, alphaP, betaP };
  }
  // Orden de 5.8. Sin prior (o con frozen_at ≤ t_last), k = 1 y φ₀ + 0 = φ₀ exactamente: el
  // resultado no cambia ni en un bit.
  const alpha = k * phi0 + alphaP + k * Sdir + k * Sind;
  const beta = k * phi0 + betaP + k * Fdir + k * Find;
  const m = alpha / (alpha + beta);
  const sd = Math.sqrt((m * (1 - m)) / (alpha + beta + 1));
  const nEff = Wdir + Find;
  const sufficient = r4(nEff) >= P.minNeff && directItems.size >= P.minItems;
  const index = (1 + sNov) / (2 + sNov + fNov);
  const transferMet = r4(sNov) >= P.transferS && r4(index) >= P.transferIndex;

  // Velocidad (5.12): primeros intentos sin ayuda, aciertos (s ≥ 0,9), response_ms no nulo, por escalón.
  for (const k of ladder) {
    const V = rows
      .filter(
        (e) =>
          meRung(input.dimension, e.assessmentMode) === k &&
          assistFactor(e.assists) === 1 &&
          observedS(e) >= 0.9 &&
          e.responseMs !== null,
      )
      .slice(-P.speedWindow);
    rungs[k]!.speedRows = V.length;
    if (V.length >= P.speedMin) {
      const mean =
        V.reduce(
          (acc, e) =>
            acc +
            Math.log(
              Math.min(P.speedClamp[1], Math.max(P.speedClamp[0], e.responseMs!)) /
                (1000 * e.recommendedSeconds),
            ),
          0,
        ) / V.length;
      rungs[k]!.speed = Math.exp(mean);
    }
    rungs[k]!.impulsiveErrors = rows.filter(
      (e) =>
        meRung(input.dimension, e.assessmentMode) === k &&
        observedS(e) * assistFactor(e.assists) < 1 &&
        observedS(e) === 0 &&
        e.responseMs !== null &&
        e.responseMs < 0.25 * 1000 * e.recommendedSeconds,
    ).length;
  }

  // Retención (5.11).
  const probes = rows.filter(
    (e) =>
      assistFactor(e.assists) === 1 &&
      e.sinceLastSeenS !== null &&
      (input.dimension === 'comprehension' ||
        input.dimension === 'production' ||
        ladder.indexOf(meRung(input.dimension, e.assessmentMode)!) >= 1),
  );
  const spaced = probes.filter((e) => e.sinceLastSeenS! >= 86_400).length;
  const retentionSufficient = spaced >= 2;
  let retention: number | null = null;
  let halfLife: number | null = null;
  let grid: number[] | null = null;
  if (retentionSufficient && input.lastExposureMs !== null) {
    const logL = P.grid.map((hl) =>
      probes.reduce((acc, e) => {
        const rho =
          e.prevItemFirstTryMs === null
            ? 1
            : Math.min(1, (e.recordedAtMs - e.prevItemFirstTryMs) / DAY / P.G);
        const g = chance(e);
        const s = observedS(e);
        const x = -(e.sinceLastSeenS! / 86_400) / hl;
        const p = g + (1 - g) * (1 - P.epsilon) * Math.pow(2, x);
        // Con g = 0, ln p en dominio logarítmico: un intervalo largo nunca da ln 0.
        const lnp = g === 0 ? Math.log(1 - P.epsilon) + x * Math.LN2 : Math.log(p);
        return acc + rho * (s * lnp + (1 - s) * Math.log(1 - p));
      }, 0),
    );
    const mx = Math.max(...logL);
    const ex = logL.map((l) => Math.exp(l - mx));
    const z = ex.reduce((x, y) => x + y, 0);
    grid = ex.map((x) => x / z);
    const dNow = (input.asOfMs - input.lastExposureMs) / DAY;
    retention = grid.reduce(
      (acc, p, i) => acc + p * (1 - P.epsilon) * Math.pow(2, -dNow / P.grid[i]!),
      0,
    );
    let cum = 0;
    for (let i = 0; i < grid.length; i++) {
      cum += grid[i]!;
      if (cum >= 0.5) {
        halfLife = P.grid[i]!;
        break;
      }
    }
  }
  const retentionDemonstrated = probes.some(
    (e) => observedS(e) >= 0.9 && e.sinceLastSeenS! >= 7 * 86_400,
  );

  const detail: MeResult['detail'] = {
    alpha,
    beta,
    sd,
    nEff,
    directItems: directItems.size,
    directDays: directDays.size,
    tLastMs: tLast,
    transfer: {
      sNov,
      index,
      met: transferMet,
      far: { sNov: sFar, index: (1 + sFar) / (2 + sFar + fFar) },
    },
    rungs,
    retentionGrid: grid,
    probes: probes.length,
    evidence: evidence.slice(-50),
    ...(priorDetail ? { prior: priorDetail } : {}),
  };
  const base = {
    ...empty,
    detail,
    retention,
    halfLifeDays: halfLife,
    retentionSufficient,
    retentionDemonstrated,
    recallSpeed: rungs[T]!.speed,
  };
  if (!sufficient) return base;

  const L = betaP5(alpha, beta);
  const pi = Math.max(0, 1 - sd / P.sd0);
  const f = Math.pow(2, -((input.asOfMs - tLast) / DAY) / P.Hconf);
  const mR = r4(m);
  const LR = r4(L);
  const mastered =
    mR >= P.masteredM && LR >= P.masteredL && directDays.size >= P.masteredDays && transferMet;
  return {
    ...base,
    sufficient: true,
    status: mastered ? 'mastered' : 'in_progress',
    mastery: m,
    confidence: pi * f,
    lower: L,
    weak: mR < P.weakM,
  };
}

// ---------------------------------------------------------------------------------------------
// 19.1 Selección del punto de partida K6 (referencia de la futura mastery_prior_for de la fase 6).

/** Una fila `concept` de `level_snapshot_rows` (arquitectura 13.5), con lo que necesita K6. */
export interface MeSnapshotConceptRow {
  conceptId: string;
  dimension: MeDimension;
  /** Nulos si la fila es `insufficient` (P9). */
  mastery: number | null;
  confidence: number | null;
  evidenceSufficiency: 'sufficient' | 'insufficient';
}

/** Cabecera de `level_snapshots` (13.5) con sus filas `concept`. */
export interface MeSnapshot {
  id: number;
  status: 'building' | 'built' | 'verified' | 'compacting' | 'compacted' | 'failed';
  frozenAtMs: number;
  verifiedAtMs: number | null;
  modelVersion: string;
  rows: readonly MeSnapshotConceptRow[];
}

export type MePriorSelection =
  | { prior: NonNullable<MeInput['prior']>; reason: 'used'; snapshotId: number }
  | { prior: null; reason: 'insufficient'; snapshotId: number }
  | { prior: null; reason: 'none'; snapshotId: null };

/**
 * Regla aprobada (decisión 1, rev. 2.3, 19.1): elegibles los snapshots `verified` o `compacted` con
 * `verified_at <= as_of`, del más reciente al más antiguo (`verified_at`, luego `frozen_at`, luego
 * `id`, descendentes). El primero que tenga fila del (concepto, dimensión) decide: si la fila es
 * suficiente, es el prior; si es insuficiente (`mastery` o `confidence` nulos), **no hay prior** y no
 * se recupera uno anterior. Si ninguno tiene fila, no hay prior. Un snapshot sin fila del concepto
 * (ausente) deja pasar al anterior. Nunca lee `user_concept_state`.
 */
export function meSelectPrior(
  snapshots: readonly MeSnapshot[],
  conceptId: string,
  dimension: MeDimension,
  asOfMs: number,
): MePriorSelection {
  const eligible = snapshots
    .filter(
      (x) =>
        (x.status === 'verified' || x.status === 'compacted') &&
        x.verifiedAtMs !== null &&
        x.verifiedAtMs <= asOfMs,
    )
    .slice()
    .sort(
      (a, b) => b.verifiedAtMs! - a.verifiedAtMs! || b.frozenAtMs - a.frozenAtMs || b.id - a.id,
    );
  for (const snap of eligible) {
    const row = snap.rows.find((r) => r.conceptId === conceptId && r.dimension === dimension);
    if (!row) continue;
    if (
      row.evidenceSufficiency === 'insufficient' ||
      row.mastery === null ||
      row.confidence === null
    )
      return { prior: null, reason: 'insufficient', snapshotId: snap.id };
    return {
      prior: {
        mastery: row.mastery,
        confidence: row.confidence,
        frozenAtMs: snap.frozenAtMs,
        snapshotId: snap.id,
      },
      reason: 'used',
      snapshotId: snap.id,
    };
  }
  return { prior: null, reason: 'none', snapshotId: null };
}

// ---------------------------------------------------------------------------------------------
// 5.13 Agregación a una dimensión de un nivel (u objetivo): lo no evaluado cuenta 0.

export interface ConceptForAggregate {
  conceptId: string;
  core: boolean;
  status: MeStatus;
  mastery: number | null;
  confidence: number | null;
}

export function aggregateDimension(concepts: readonly ConceptForAggregate[]) {
  if (concepts.length === 0) return { status: 'no_content' as const };
  let W = 0;
  let mSum = 0;
  let cov = 0;
  let mast = 0;
  let conf = 0;
  let evalW = 0;
  let evalM = 0;
  const weak: string[] = [];
  for (const c of concepts) {
    const w = c.core ? 2 : 1;
    const suff = c.status !== 'insufficient';
    W += w;
    if (suff) {
      mSum += w * (c.mastery ?? 0);
      cov += w;
      conf += w * (c.confidence ?? 0);
      evalW += w;
      evalM += w * (c.mastery ?? 0);
      if ((c.mastery ?? 0) < ME_PARAMS.weakM) weak.push(c.conceptId);
    } else if (c.core) {
      weak.push(c.conceptId);
    }
    if (c.status === 'mastered') mast += w;
  }
  const coverage = cov / W;
  return {
    status: coverage < 0.25 ? ('insufficient_evidence' as const) : ('published' as const),
    mastery: mSum / W,
    coverage,
    masteredShare: mast / W,
    confidence: conf / W,
    masteryOfEvaluated: evalW > 0 ? evalM / evalW : null,
    weak,
  };
}
