/**
 * Mastery Engine me-1.0.0 (docs/MASTERY_ENGINE_DESIGN.md rev. 2): vectores de 5.8.4, E0 completo,
 * E2, E7, límites de velocidad (E4) y propiedades de 6 (monotonía, el tiempo solo no cambia m, la
 * velocidad no cambia el dominio, un solo ítem nunca da estimación, ayuda constante, reconocer sin
 * aciertos directos no aporta).
 */
import {
  aggregateDimension,
  assistFactor,
  betaInc,
  betaP5,
  EvidenceRow,
  lnGamma,
  MeSnapshot,
  meRound4,
  meSelectPrior,
  modelEval,
} from '../mastery';
import { readFileSync } from 'fs';
import { join } from 'path';
import published from './fixtures/mastery-published-L.json';
import histories from './fixtures/mastery-e6-e8-e9-histories.json';
import baseline from './fixtures/mastery-k6-baseline.json';

const DAY = 86_400_000;
const r4 = (x: number | null) => (x === null ? null : Math.round(x * 10000) / 10000);

let ev = 0;
/** Fila escrita (typed, g = 0) en el día t. */
function row(t: number, item: string, over: Partial<EvidenceRow> = {}): EvidenceRow {
  return {
    eventId: ++ev,
    recordedAtMs: t * DAY,
    itemId: item,
    itemType: 'translate_write',
    inputModality: 'text',
    assessmentMode: 'free_recall',
    responseFormat: 'typed',
    verdict: 'correct',
    score: null,
    isFirstTry: true,
    responseMs: 4000,
    sinceLastSeenS: null,
    choices: null,
    assists: {},
    recommendedSeconds: 20,
    prevItemFirstTryMs: null,
    ...over,
  };
}

/** Completa σ (exposición anterior = fila anterior) y ρ (intento anterior del mismo ítem). */
function history(rows: EvidenceRow[]): EvidenceRow[] {
  const out: EvidenceRow[] = [];
  const lastItem = new Map<string, number>();
  let prev: number | null = null;
  for (const r of rows) {
    out.push({
      ...r,
      sinceLastSeenS: prev === null ? null : (r.recordedAtMs - prev) / 1000,
      prevItemFirstTryMs: lastItem.get(r.itemId) ?? null,
    });
    prev = r.recordedAtMs;
    lastItem.set(r.itemId, r.recordedAtMs);
  }
  return out;
}

const evalV = (rows: EvidenceRow[], asOfDay: number, lastExposureDay: number | null = null) =>
  modelEval({
    dimension: 'vocabulary',
    level: 'A1',
    rows,
    asOfMs: asOfDay * DAY,
    lastExposureMs:
      lastExposureDay === null ? rows[rows.length - 1]!.recordedAtMs : lastExposureDay * DAY,
  });

describe('5.8.4: P5 numérico de la Beta', () => {
  const cases: [number, number, number, number][] = [
    [1, 1, 0.05, 0.05],
    [2, 2, 0.135350362172, 0.1354],
    [10, 10, 0.320086529589, 0.3201],
    [100, 100, 0.441969842058, 0.442],
    [0.5, 0.5, 0.00615582970243, 0.0062],
    [0.01, 0.01, 0, 0],
    [20, 1, 0.860891659332, 0.8609],
    [13, 4, 0.583427719294, 0.5834],
    [2, 8, 0.041023167507, 0.041],
    [100, 25, 0.738740832823, 0.7387],
    [3.15848, 0.97716, 0.391654669156, 0.3917],
    [1.5, 0.5, 0.228519813806, 0.2285],
    [0.5, 1.5, 0.00154291930267, 0.0015],
    [1, 0.05, 0.641514077591, 0.6415],
    [0.05, 1, 0, 0],
    [0.2, 0.01, 0.603706725956, 0.6037],
    [0.1, 0.005, 0.64642695334, 0.6464],
  ];
  test.each(cases)('Q(0,05; %p, %p)', (a, b, ref, pub) => {
    const q = betaP5(a, b);
    // La fila de E0 publica α y β redondeados a 5 decimales; su referencia es la de los valores exactos
    // (la prueba de E0 la comprueba a 4 decimales con α y β sin redondear).
    if (ref > 1e-6 && a !== 3.15848) expect(Math.abs(q - ref)).toBeLessThanOrEqual(1e-10);
    expect(r4(q)).toBe(pub);
  });

  test('formas cerradas y ln Γ', () => {
    for (const a of [0.3, 1, 2.5, 7, 40]) {
      expect(Math.abs(betaP5(a, 1) - Math.pow(0.05, 1 / a))).toBeLessThan(1e-11);
      expect(Math.abs(betaP5(1, a) - (1 - Math.pow(0.95, 1 / a)))).toBeLessThan(1e-11);
    }
    let f = 0;
    for (let n = 1; n < 170; n++) {
      if (n > 1) f += Math.log(n - 1);
      expect(Math.abs(lnGamma(n) - f)).toBeLessThan(1e-12 * Math.max(1, Math.abs(f)));
    }
    expect(Math.abs(betaInc(0.3917, 3.1585, 0.9772) - 0.05)).toBeLessThan(1e-3);
  });
});

describe('E0: tres días de práctica, paso a paso', () => {
  const rows = () =>
    history([
      row(0, 'w1'),
      row(0.002, 'w2'),
      row(0.004, 'w3', {
        assessmentMode: 'recognition',
        responseFormat: 'select',
        choices: 4,
        itemType: 'translation_choice',
      }),
      row(1, 'w1'),
      row(3, 'w4'),
    ]);

  test('α, β, m, L, c, suficiencia, estado y transferencia', () => {
    const r = evalV(rows(), 3);
    expect(r4(r.detail.alpha)).toBe(3.1585);
    expect(r4(r.detail.beta)).toBe(0.9772);
    expect(r4(r.mastery)).toBe(0.7637);
    expect(r4(r.lower)).toBe(0.3917);
    expect(r4(r.confidence)).toBe(0.3507);
    expect(r4(r.detail.nEff)).toBe(2.0897);
    expect(r.detail.directItems).toBe(3);
    expect(r.status).toBe('in_progress');
    expect(r4(r.detail.transfer.sNov)).toBe(1.4886);
    expect(r4(r.detail.transfer.index)).toBe(0.7134);
    expect(r.detail.transfer.met).toBe(true);
    // Explicación: qué filas sostienen la estimación y cuánto pesó cada una.
    expect(r.detail.evidence.map((e) => r4(e.w))).toEqual([0.4886, 0.4886, 0.4886, 0.1125, 1]);
  });

  test('E7: cortado antes, insuficiente; con los días 0 y 1, n_eff 1,1066', () => {
    const all = rows();
    const d0 = evalV(all.slice(0, 3), 0.004);
    expect(d0.status).toBe('insufficient');
    expect(d0.mastery).toBeNull();
    expect(r4(d0.detail.nEff)).toBe(1);
    const d1 = evalV(all.slice(0, 4), 1);
    expect(d1.status).toBe('insufficient');
    expect(r4(d1.detail.nEff)).toBe(1.1066);
  });
});

describe('E2: repetir el mismo ejercicio no infla', () => {
  test('A: siempre el mismo ítem → insuficiente aunque m sea alto', () => {
    const r = evalV(history(Array.from({ length: 30 }, (_, d) => row(d, 'only'))), 29);
    expect(r.status).toBe('insufficient');
    expect(r.detail.directItems).toBe(1);
    expect(r4(r.detail.nEff)).toBe(4.127);
  });
  test('B: 10 ítems distintos, cada uno cada 10 días → dominado', () => {
    const r = evalV(history(Array.from({ length: 30 }, (_, d) => row(d, `i${d % 10}`))), 29);
    expect(r.detail.directItems).toBe(10);
    expect(r4(r.detail.nEff)).toBe(26.4898);
    expect(r4(r.mastery)).toBe(0.9715);
    expect(r4(r.lower)).toBe(0.909);
    expect(r.status).toBe('mastered');
  });
});

describe('5.8.4 criterio 1: los 35 valores de L publicados (rev. 2.2)', () => {
  type Pub = {
    id: string;
    alpha: number | null;
    beta: number | null;
    L: number;
    status: string;
    alpha_source: string;
  };
  type HRow = {
    t: number;
    item: string;
    tier: 'L' | 'G';
    s: 0 | 1;
    delta: number | null;
    first?: false;
  };
  type HCase = {
    id: string;
    dimension: 'vocabulary' | 'grammar';
    base: string | null;
    extra: HRow[];
    asOf: number;
    lastExposure: number;
    prior: unknown;
    alpha: number;
    beta: number;
    m: number;
    L: number;
    c: number | null;
    status: string;
    transfer?: [number, number];
  };
  const pub = published.values as Pub[];
  const H = histories as unknown as { bases: Record<string, HRow[]>; cases: HCase[] };
  const doc = readFileSync(join(__dirname, '..', '..', 'docs', 'MASTERY_ENGINE_DESIGN.md'), 'utf8');
  const appendix = doc.slice(doc.indexOf('## 17. Apéndice'));
  /** 10 decimales con coma, como en el apéndice 17. */
  const d10 = (x: number) => x.toFixed(10).replace('.', ',');

  test('35 valores: 33 validados (fórmula también en la SQL) y 2 (E9 con prior) sólo en TypeScript con K6', () => {
    expect(pub).toHaveLength(35);
    expect(new Set(pub.map((v) => v.id)).size).toBe(35);
    for (const v of pub) expect(['validated', 'validated_ts_k6_sql_pending']).toContain(v.status);
    expect(pub.filter((v) => v.status === 'validated')).toHaveLength(33);
    const k6 = pub.filter((v) => v.status === 'validated_ts_k6_sql_pending');
    expect(k6.map((v) => v.id)).toEqual(['E9-con', 'E9-2e1a']);
    for (const v of k6) expect(v.alpha_source).toBe('history_design_calculator');
    // Un caso que depende del prior K6 nunca puede figurar como «validated» (la SQL canónica no tiene
    // K6), y el estado K6 sólo puede tenerlo un caso con prior (rev. 2.2).
    const priorIds = H.cases.filter((c) => c.prior !== null).map((c) => c.id);
    expect(priorIds).toEqual(['E9-con', 'E9-2e1a']);
    for (const id of priorIds) {
      expect(pub.find((v) => v.id === id)!.status).toBe('validated_ts_k6_sql_pending');
    }
    expect(k6.map((v) => v.id)).toEqual(priorIds);
  });

  test('ningún α ni β sin respaldo documental', () => {
    const sources = [
      'published',
      'published_formula',
      'history_engine',
      'history_design_calculator',
    ];
    for (const v of pub) {
      expect(sources).toContain(v.alpha_source);
      expect(v.alpha).not.toBeNull();
      expect(v.beta).not.toBeNull();
    }
    // Los pares que salen de historiales están transcritos en el apéndice 17 del documento aprobado
    // (E2 B, con su historial en la sección 8, se recalcula con el motor más abajo y en E2).
    for (const v of pub.filter((x) => x.alpha_source.startsWith('history') && x.id !== 'E2-B')) {
      expect(appendix).toContain(d10(v.alpha!));
      expect(appendix).toContain(d10(v.beta!));
      expect(H.cases.find((c) => c.id === v.id)).toBeDefined();
    }
    // Y cada historial del fixture corresponde a un valor publicado con el mismo par.
    for (const c of H.cases) {
      const v = pub.find((x) => x.id === c.id)!;
      expect([v.alpha, v.beta, v.L]).toEqual([c.alpha, c.beta, c.L]);
    }
  });

  test('errata de E9: «2 errores y 1 acierto» publica 0,1832', () => {
    expect(doc).toContain('| 2 errores y 1 acierto                | 0,4922 · **0,1832**');
    expect(doc).not.toContain('0,4922 · 0,1831');
    expect(pub.find((v) => v.id === 'E9-2e1a')!.L).toBe(0.1832);
  });

  test.each(pub.map((v) => [v.id, v.alpha!, v.beta!, v.L] as const))(
    '%s: Q(0,05; %p, %p) = %p a 4 decimales',
    (_id, a, b, L) => {
      expect(r4(betaP5(a, b))).toBe(L);
    },
  );

  /** Filas de evidencia de un historial del apéndice 17, sin cambiar días, ítems ni separaciones. */
  function evidence(h: HRow[]): EvidenceRow[] {
    const prevFirst = new Map<string, number>();
    return h.map((x, i) => {
      const r = row(x.t, x.item, {
        eventId: 100_000 + i,
        itemType: x.tier === 'G' ? 'order_words' : 'translate_write',
        assessmentMode: x.tier === 'G' ? 'guided_construction' : 'free_recall',
        responseFormat: x.tier === 'G' ? 'tiles' : 'typed',
        verdict: x.s ? 'correct' : 'incorrect',
        isFirstTry: x.first !== false,
        sinceLastSeenS: x.delta === null ? null : x.delta * 86400,
        prevItemFirstTryMs: prevFirst.get(x.item) ?? null,
      });
      if (x.first !== false) prevFirst.set(x.item, x.t * DAY);
      return r;
    });
  }
  test.each(H.cases.filter((c) => c.prior === null).map((c) => [c.id, c] as const))(
    '%s: la implementación TypeScript de referencia reproduce α, β, m, L, c, estado y transferencia del historial',
    (_id, c) => {
      const rows = evidence([...(c.base ? H.bases[c.base]! : []), ...c.extra]);
      const r = modelEval({
        dimension: c.dimension,
        level: 'A1',
        rows,
        asOfMs: c.asOf * DAY,
        lastExposureMs: c.lastExposure * DAY,
      });
      expect(Math.abs(r.detail.alpha - c.alpha)).toBeLessThan(1e-9);
      expect(Math.abs(r.detail.beta - c.beta)).toBeLessThan(1e-9);
      expect(r4(r.mastery)).toBe(c.m);
      expect(r4(r.lower)).toBe(c.L);
      if (c.c !== null) expect(r4(r.confidence)).toBe(c.c);
      expect(r.status).toBe(c.status);
      if (c.transfer)
        expect([r4(r.detail.transfer.sNov), r4(r.detail.transfer.index)]).toEqual(c.transfer);
    },
  );

  test('E2 B: α y β del fixture = los del motor sobre el historial publicado', () => {
    const r = evalV(history(Array.from({ length: 30 }, (_, d) => row(d, `i${d % 10}`))), 29);
    const e2 = pub.find((v) => v.id === 'E2-B')!;
    expect(Math.abs(r.detail.alpha - e2.alpha!)).toBeLessThan(1e-9);
    expect(Math.abs(r.detail.beta - e2.beta!)).toBeLessThan(1e-9);
  });

  describe('K6 (5.7, rev. 2.2): punto de partida en la implementación TypeScript de referencia', () => {
    type Prior = { m: number; conf: number; frozenAt: number };
    const SNAPSHOT_ID = 1;
    const run = (c: HCase, extra: HRow[], asOf: number, prior: Prior | null) =>
      modelEval({
        dimension: c.dimension,
        level: 'A1',
        rows: evidence(extra),
        asOfMs: asOf * DAY,
        lastExposureMs: asOf * DAY,
        ...(prior && {
          prior: {
            mastery: prior.m,
            confidence: prior.conf,
            frozenAtMs: prior.frozenAt * DAY,
            snapshotId: SNAPSHOT_ID,
          },
        }),
      });
    /** Todo lo que el prior no puede tocar (5.7: sólo entra en α y β). */
    const untouched = (r: ReturnType<typeof modelEval>) => ({
      sufficient: r.sufficient,
      nEff: r.detail.nEff,
      directItems: r.detail.directItems,
      directDays: r.detail.directDays,
      tLastMs: r.detail.tLastMs,
      transfer: r.detail.transfer,
      rungs: r.detail.rungs,
      evidence: r.detail.evidence,
      retention: r.retention,
      halfLifeDays: r.halfLifeDays,
      retentionSufficient: r.retentionSufficient,
      retentionDemonstrated: r.retentionDemonstrated,
      retentionGrid: r.detail.retentionGrid,
      probes: r.detail.probes,
      recallSpeed: r.recallSpeed,
    });
    const priorCases = H.cases.filter((c) => c.prior !== null);
    /** E9 publica «débil» sólo en «2 errores y 1 acierto». */
    const weak: Record<string, boolean> = { 'E9-con': false, 'E9-2e1a': true };
    /** c de E9 con prior: DERIVADA del motor (sd₀ = 0,2887, rev. 2.3 19.3), no publicada por el calculador. */
    const derivedC: Record<string, number> = { 'E9-con': 0.4961, 'E9-2e1a': 0.3456 };

    test.each(priorCases.map((c) => [c.id, c] as const))(
      '%s: con K6 reproduce α, β, P5, m, L, estado y «débil» publicados',
      (id, c) => {
        const r = run(c, c.extra, c.asOf, c.prior as Prior);
        expect(Math.abs(r.detail.alpha - c.alpha)).toBeLessThan(1e-9);
        expect(Math.abs(r.detail.beta - c.beta)).toBeLessThan(1e-9);
        expect(Math.abs(r.lower! - betaP5(c.alpha, c.beta))).toBeLessThan(1e-9);
        expect(r4(r.lower)).toBe(c.L);
        expect(r4(r.mastery)).toBe(c.m);
        expect(r.status).toBe(c.status);
        expect(r.weak).toBe(weak[id]);
        expect(r4(r.confidence)).toBe(derivedC[id]);
        // 5.7 literal: n_p = N_p · conf, φ_p = 2^(−(t_last − frozen_at)/H), α_p, β_p (frozen_at ≤ t_last:
        // k = 1, rev. 2.3).
        const nP = 4 * 0.7;
        const phiP = Math.pow(2, -(123 - 0) / 90);
        expect(r.detail.prior).toEqual({
          snapshotId: SNAPSHOT_ID,
          nP,
          phiP,
          k: 1,
          alphaP: 0.9 * nP * phiP,
          betaP: (1 - 0.9) * nP * phiP,
        });
        expect(Math.abs(r.detail.prior!.alphaP + r.detail.prior!.betaP - nP * phiP)).toBeLessThan(
          1e-15,
        );
        expect(r.detail.prior!.alphaP + r.detail.prior!.betaP).toBeLessThanOrEqual(4);
      },
    );

    test.each(priorCases.map((c) => [c.id, c] as const))(
      '%s: el prior no toca suficiencia, n_eff, ítems, días, transferencia, retención, velocidad ni escalones',
      (_id, c) => {
        const withP = run(c, c.extra, c.asOf, c.prior as Prior);
        const without = run(c, c.extra, c.asOf, null);
        expect(untouched(withP)).toStrictEqual(untouched(without));
        expect(without.detail.prior).toBeUndefined();
        // Sólo α y β cambian, exactamente en α_p y β_p.
        expect(
          Math.abs(withP.detail.alpha - without.detail.alpha - withP.detail.prior!.alphaP),
        ).toBeLessThan(1e-12);
        expect(
          Math.abs(withP.detail.beta - without.detail.beta - withP.detail.prior!.betaP),
        ).toBeLessThan(1e-12);
      },
    );

    test('1 acierto el día 120: m interno 0,7297, α_p 1,0001, β_p 0,1111 e insuficiente', () => {
      const c = H.cases.find((x) => x.id === 'E9-con')!;
      const r = run(c, c.extra.slice(0, 1), 120, c.prior as Prior);
      const without = run(c, c.extra.slice(0, 1), 120, null);
      expect(r.status).toBe('insufficient');
      expect(r.sufficient).toBe(false);
      expect(r.mastery).toBeNull();
      expect(r.lower).toBeNull();
      expect(r.confidence).toBeNull();
      expect(r4(r.detail.alpha / (r.detail.alpha + r.detail.beta))).toBe(0.7297);
      expect(r4(r.detail.prior!.phiP)).toBe(0.3969);
      expect(r4(r.detail.prior!.alphaP)).toBe(1.0001);
      expect(r4(r.detail.prior!.betaP)).toBe(0.1111);
      expect(r.detail.nEff).toBe(1);
      expect(untouched(r)).toStrictEqual(untouched(without));
    });

    test('sin evidencia nueva, el prior no aporta nada: insuficiente e idéntico a no tenerlo', () => {
      const c = H.cases.find((x) => x.id === 'E9-con')!;
      const r = run(c, [], 120, c.prior as Prior);
      expect(r.status).toBe('insufficient');
      expect(r).toStrictEqual(run(c, [], 120, null));
    });

    test('línea base: los 33 validados sin prior dan exactamente lo mismo que antes de K6', () => {
      const ids = [...baseline.engine.map((e) => e.id), ...baseline.published.map((p) => p.id)];
      const priorIds = new Set(H.cases.filter((c) => c.prior !== null).map((c) => c.id));
      expect(ids.slice().sort()).toEqual(
        pub
          .filter((v) => v.status === 'validated' && !priorIds.has(v.id))
          .map((v) => v.id)
          .sort(),
      );
      expect(ids).toHaveLength(33);
      // 9 con historial: entrada y salida completas de modelEval grabadas con el motor sin K6.
      for (const e of baseline.engine) {
        const input = e.input as unknown as Parameters<typeof modelEval>[0];
        expect(modelEval(input)).toStrictEqual(e.output);
        expect(modelEval({ ...input, prior: undefined })).toStrictEqual(e.output);
      }
      // 24 con el par publicado: el P5 no cambia ni en un bit.
      for (const p of baseline.published) {
        expect(Object.is(betaP5(p.alpha, p.beta), p.p5)).toBe(true);
        expect(r4(p.p5)).toBe(p.L);
        expect(pub.find((v) => v.id === p.id)).toMatchObject({
          alpha: p.alpha,
          beta: p.beta,
          L: p.L,
        });
      }
    });
  });

  describe('rev. 2.3 (me-1.0.1): envejecimiento, selección del snapshot y redondeo (19)', () => {
    let seed = 7;
    const rnd = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
    const randHistory = (n: number) => {
      const rows: EvidenceRow[] = [];
      let t = 0;
      for (let i = 0; i < n; i++) {
        t += rnd() < 0.3 ? rnd() * 0.01 : rnd() * 5;
        const mode = ['recognition', 'cued_recall', 'free_recall'][Math.floor(rnd() * 3)]!;
        rows.push(
          row(t, `i${Math.floor(rnd() * 6)}`, {
            assessmentMode: mode,
            responseFormat: mode === 'recognition' ? 'select' : 'typed',
            choices: mode === 'recognition' ? 4 : null,
            verdict: rnd() < 0.7 ? 'correct' : 'incorrect',
            assists: rnd() < 0.2 ? { reading_visible: true } : {},
          }),
        );
      }
      return history(rows);
    };
    /** Prior a 4 decimales, como se guarda (numeric(6,4)). */
    const randPrior = (frozenAtMs: number) => ({
      mastery: Math.round(rnd() * 10000) / 10000,
      confidence: Math.round(rnd() * 10000) / 10000,
      frozenAtMs,
      snapshotId: 1,
    });
    type P = { mastery: number; confidence: number; frozenAtMs: number; snapshotId: number };
    const evalP = (rows: EvidenceRow[], asOfMs: number, prior?: P) =>
      modelEval({
        dimension: 'vocabulary',
        level: 'A1',
        rows,
        asOfMs,
        lastExposureMs: rows.length ? rows[rows.length - 1]!.recordedAtMs : null,
        ...(prior && { prior }),
      });
    const mOf = (r: ReturnType<typeof modelEval>) =>
      r.detail.alpha / (r.detail.alpha + r.detail.beta);
    /** Lo que el prior no puede tocar. */
    const fixed = (r: ReturnType<typeof modelEval>) => ({
      sufficient: r.sufficient,
      nEff: r.detail.nEff,
      directItems: r.detail.directItems,
      directDays: r.detail.directDays,
      tLastMs: r.detail.tLastMs,
      transfer: r.detail.transfer,
      rungs: r.detail.rungs,
      evidence: r.detail.evidence,
      retention: r.retention,
      retentionGrid: r.detail.retentionGrid,
      recallSpeed: r.recallSpeed,
    });

    test('frozen_at = t_last, t_last − 1 ms y t_last + 1 ms: sin saltos; k = 1 salvo después de t_last', () => {
      const h = history([row(0, 'a'), row(1, 'b', { verdict: 'incorrect' }), row(3, 'c')]);
      const tLast = 3 * DAY;
      const at = (frozen: number) =>
        evalP(h, tLast + DAY, { mastery: 0.8, confidence: 0.6, frozenAtMs: frozen, snapshotId: 1 });
      const [eq, before, after] = [at(tLast), at(tLast - 1), at(tLast + 1)];
      expect(eq.detail.prior!.k).toBe(1);
      expect(eq.detail.prior!.phiP).toBe(1);
      expect(before.detail.prior!.k).toBe(1);
      expect(before.detail.prior!.phiP).toBe(Math.pow(2, -(1 / DAY) / 90));
      expect(after.detail.prior!.k).toBe(Math.pow(2, -(1 / DAY) / 90));
      expect(after.detail.prior!.k).toBeLessThan(1);
      expect(after.detail.prior!.phiP).toBe(1);
      for (const r of [before, after]) {
        expect(Math.abs(r.detail.alpha - eq.detail.alpha)).toBeLessThan(1e-9);
        expect(Math.abs(r.detail.beta - eq.detail.beta)).toBeLessThan(1e-9);
        expect(r.detail.prior!.alphaP + r.detail.prior!.betaP).toBeLessThanOrEqual(4);
      }
    });

    test('evidencia anterior al congelamiento: α_p + β_p = n_p ≤ 4 y m igual al de la fórmula literal', () => {
      const h = history([
        row(0, 'a'),
        row(2, 'b'),
        row(5, 'c', { verdict: 'incorrect' }),
        row(9, 'd'),
      ]);
      const tLast = 9 * DAY;
      const frozen = 40 * DAY;
      const r = evalP(h, 50 * DAY, {
        mastery: 0.3,
        confidence: 1,
        frozenAtMs: frozen,
        snapshotId: 1,
      });
      const none = evalP(h, 50 * DAY);
      const k = Math.pow(2, -((frozen - tLast) / DAY) / 90);
      expect(r.detail.prior!.k).toBe(k);
      expect(r.detail.prior!.phiP).toBe(1);
      expect(r.detail.prior!.alphaP + r.detail.prior!.betaP).toBe(4);
      // La literal de 5.7 daría φ_p = 1/k > 1 y un prior de 4/k > 4; la regla de 19.2 da el mismo m.
      const litA = none.detail.alpha + (0.3 * 4) / k;
      const litB = none.detail.beta + (0.7 * 4) / k;
      expect(4 / k).toBeGreaterThan(4);
      expect(Math.abs(mOf(r) - litA / (litA + litB))).toBeLessThan(1e-12);
      expect(Math.abs(r.detail.alpha - k * litA)).toBeLessThan(1e-12);
      expect(fixed(r)).toStrictEqual(fixed(none));
    });

    test('historiales aleatorios con prior: α_p + β_p ≤ 4, nada fuera de α y β cambia y 6.1 se cumple', () => {
      for (let i = 0; i < 2000; i++) {
        const h = randHistory(2 + Math.floor(rnd() * 10));
        const last = h[h.length - 1]!.recordedAtMs;
        const t = last / DAY + rnd() * 30;
        // frozen_at en cualquier lugar ≤ as_of: antes de toda la evidencia, en medio o después de t_last.
        const asOf = (t + 1) * DAY;
        const prior = randPrior(Math.floor(rnd() * asOf));
        const base = evalP(h, asOf, prior);
        expect(base.detail.prior!.alphaP + base.detail.prior!.betaP).toBeLessThanOrEqual(4 + 1e-12);
        expect(base.detail.prior!.k).toBeLessThanOrEqual(1);
        expect(fixed(base)).toStrictEqual(fixed(evalP(h, asOf)));
        const ok = evalP(history([...h, row(t, `i${Math.floor(rnd() * 8)}`)]), asOf, prior);
        const bad = evalP(
          history([...h, row(t, `i${Math.floor(rnd() * 8)}`, { verdict: 'incorrect' })]),
          asOf,
          prior,
        );
        expect(mOf(ok)).toBeGreaterThanOrEqual(mOf(base) - 1e-12);
        expect(mOf(bad)).toBeLessThanOrEqual(mOf(base) + 1e-12);
      }
    });

    test('un prior con frozen_at posterior a as_of se rechaza; frozen_at = as_of se acepta', () => {
      const h = history([row(0, 'a'), row(1, 'b')]);
      const p = (frozen: number) => ({
        mastery: 0.5,
        confidence: 0.5,
        frozenAtMs: frozen,
        snapshotId: 1,
      });
      expect(() => evalP(h, 2 * DAY, p(2 * DAY + 1))).toThrow('posterior a as_of');
      expect(() => evalP([], 2 * DAY, p(2 * DAY + 1))).toThrow('posterior a as_of');
      expect(evalP(h, 2 * DAY, p(2 * DAY)).detail.prior).toBeDefined();
    });

    describe('selección del snapshot (decisión 1, 19.1)', () => {
      const V = 100 * DAY;
      const rowOf = (mastery: number | null, confidence: number | null, conceptId = 'c1') => ({
        conceptId,
        dimension: 'vocabulary' as const,
        mastery,
        confidence,
        evidenceSufficiency:
          mastery === null || confidence === null
            ? ('insufficient' as const)
            : ('sufficient' as const),
      });
      const snap = (over: Partial<MeSnapshot>): MeSnapshot => ({
        id: 1,
        status: 'verified',
        frozenAtMs: V - DAY,
        verifiedAtMs: V,
        modelVersion: 'me-1.0.1',
        rows: [rowOf(0.9, 0.7)],
        ...over,
      });

      test('as_of = verified_at sí; un instante antes no; un instante después sí', () => {
        const s = [snap({})];
        expect(meSelectPrior(s, 'c1', 'vocabulary', V).reason).toBe('used');
        expect(meSelectPrior(s, 'c1', 'vocabulary', V - 1)).toEqual({
          prior: null,
          reason: 'none',
          snapshotId: null,
        });
        expect(meSelectPrior(s, 'c1', 'vocabulary', V + 1)).toEqual({
          prior: { mastery: 0.9, confidence: 0.7, frozenAtMs: V - DAY, snapshotId: 1 },
          reason: 'used',
          snapshotId: 1,
        });
      });

      test('building, built y failed nunca cuentan; compacted sí', () => {
        for (const status of ['building', 'built', 'failed'] as const) {
          expect(
            meSelectPrior([snap({ status, verifiedAtMs: null })], 'c1', 'vocabulary', 2 * V).reason,
          ).toBe('none');
          // Ni aunque tuvieran verified_at (no puede pasar: la máquina de estados no vuelve atrás).
          expect(meSelectPrior([snap({ status })], 'c1', 'vocabulary', 2 * V).reason).toBe('none');
        }
        expect(meSelectPrior([snap({ status: 'compacted' })], 'c1', 'vocabulary', V).reason).toBe(
          'used',
        );
      });

      test('concepto ausente en el más reciente: se conserva el anterior que lo incluye', () => {
        const older = snap({
          id: 1,
          verifiedAtMs: V,
          frozenAtMs: V - DAY,
          rows: [rowOf(0.6, 0.5)],
        });
        const newer = snap({
          id: 2,
          verifiedAtMs: 2 * V,
          frozenAtMs: 2 * V - DAY,
          rows: [rowOf(0.9, 0.9, 'otro')],
        });
        expect(meSelectPrior([newer, older], 'c1', 'vocabulary', 3 * V)).toEqual({
          prior: { mastery: 0.6, confidence: 0.5, frozenAtMs: V - DAY, snapshotId: 1 },
          reason: 'used',
          snapshotId: 1,
        });
      });

      test('fila explícitamente insuficiente en el más reciente: sin prior, sin recuperar el anterior', () => {
        const older = snap({ id: 1, verifiedAtMs: V, rows: [rowOf(0.6, 0.5)] });
        const newer = snap({
          id: 2,
          verifiedAtMs: 2 * V,
          frozenAtMs: 2 * V - DAY,
          rows: [rowOf(null, null)],
        });
        expect(meSelectPrior([older, newer], 'c1', 'vocabulary', 3 * V)).toEqual({
          prior: null,
          reason: 'insufficient',
          snapshotId: 2,
        });
        // Antes de que el nuevo esté verificado, el anterior sí cuenta.
        expect(meSelectPrior([older, newer], 'c1', 'vocabulary', 2 * V - 1).reason).toBe('used');
      });

      test('la misma consulta antes y después de verificar da lo mismo (verified_at posterior a as_of)', () => {
        const asOf = V - 10;
        const built = snap({ status: 'built', verifiedAtMs: null });
        const verified = snap({ status: 'verified', verifiedAtMs: V });
        expect(meSelectPrior([built], 'c1', 'vocabulary', asOf)).toEqual(
          meSelectPrior([verified], 'c1', 'vocabulary', asOf),
        );
        // Determinista: el orden de entrada no importa.
        const a = snap({ id: 1, verifiedAtMs: V, rows: [rowOf(0.1, 0.2)] });
        const b = snap({
          id: 2,
          verifiedAtMs: V,
          frozenAtMs: V - 2 * DAY,
          rows: [rowOf(0.3, 0.4)],
        });
        expect(meSelectPrior([a, b], 'c1', 'vocabulary', V)).toEqual(
          meSelectPrior([b, a], 'c1', 'vocabulary', V),
        );
        expect(meSelectPrior([a, b], 'c1', 'vocabulary', V).snapshotId).toBe(1);
      });
    });

    test('redondeo del motor cerca de la mitad: el +1e-9 sube lo que está a menos de 1e-13 debajo', () => {
      expect(meRound4(0.12345)).toBe(0.1235);
      expect(meRound4(0.12345 - 5e-14)).toBe(0.1235);
      expect(meRound4(0.12345 - 5e-12)).toBe(0.1234);
      expect(meRound4(0.12355)).toBe(0.1236);
      expect(meRound4(1.99995)).toBe(2);
    });
  });
});

describe('E4: velocidad sólo en el escalón objetivo', () => {
  test('exactamente 3 aciertos L en 60, 64 y 68 s (ref. 20 s): v = 3,1958', () => {
    const r = evalV(
      history([
        row(0, 'a', { responseMs: 60000 }),
        row(2, 'b', { responseMs: 64000 }),
        row(4, 'c', { responseMs: 68000 }),
      ]),
      4,
    );
    expect(r4(r.recallSpeed)).toBe(3.1958);
  });
  test('2 aciertos L + 50 R: v nula y v_R en el detalle; agregar R nunca cambia v (6.11)', () => {
    const L2 = [row(0, 'a'), row(1, 'b')];
    const R = Array.from({ length: 50 }, (_, i) =>
      row(2 + i * 0.01, `r${i}`, {
        assessmentMode: 'recognition',
        responseFormat: 'select',
        choices: 4,
        responseMs: 3000,
        recommendedSeconds: 12,
      }),
    );
    const r = evalV(history([...L2, ...R]), 3);
    expect(r.recallSpeed).toBeNull();
    expect(r4(r.detail.rungs.R!.speed)).toBe(0.25);
    const base = history([
      row(0, 'a', { responseMs: 60000 }),
      row(2, 'b', { responseMs: 64000 }),
      row(4, 'c', { responseMs: 68000 }),
    ]);
    const withR = history([
      ...base,
      ...R.map((x, i) => ({ ...x, recordedAtMs: (5 + i * 0.01) * DAY })),
    ]);
    expect(r4(evalV(withR, 6).recallSpeed)).toBe(3.1958);
  });
  test('clamp, nulos y ayudas', () => {
    const r = evalV(
      history([
        row(0, 'a', { responseMs: 100 }),
        row(1, 'b', { responseMs: 200000 }),
        row(2, 'c', { responseMs: null }),
        row(3, 'd', { responseMs: 20000, assists: { reading_visible: true } }),
        row(4, 'e', { responseMs: 20000, verdict: 'typo' }),
      ]),
      4,
    );
    expect(r.detail.rungs.L!.speedRows).toBe(3);
    expect(r4(r.recallSpeed)).toBe(r4(Math.exp((Math.log(0.015) + Math.log(6) + Math.log(1)) / 3)));
  });
});

describe('propiedades (6)', () => {
  let x = 1;
  const rnd = () => (x = (x * 48271) % 2147483647) / 2147483647;
  const randHistory = (n: number) => {
    const rows: EvidenceRow[] = [];
    let t = 0;
    for (let i = 0; i < n; i++) {
      t += rnd() < 0.3 ? rnd() * 0.01 : rnd() * 5;
      const mode = ['recognition', 'cued_recall', 'free_recall'][Math.floor(rnd() * 3)]!;
      rows.push(
        row(t, `i${Math.floor(rnd() * 6)}`, {
          assessmentMode: mode,
          responseFormat: mode === 'recognition' ? 'select' : 'typed',
          choices: mode === 'recognition' ? 4 : null,
          verdict: rnd() < 0.7 ? 'correct' : 'incorrect',
          assists: rnd() < 0.2 ? { reading_visible: true } : {},
        }),
      );
    }
    return history(rows);
  };

  test('6.1 monotonía: agregar un acierto sin ayuda en t ≥ t_last nunca baja m; un error nunca lo sube', () => {
    for (let k = 0; k < 2000; k++) {
      const h = randHistory(2 + Math.floor(rnd() * 10));
      const last = h[h.length - 1]!.recordedAtMs / DAY;
      const t = last + rnd() * 30;
      const base = evalV(h, t + 1);
      const ok = evalV(history([...h, row(t, `i${Math.floor(rnd() * 8)}`)]), t + 1);
      const bad = evalV(
        history([...h, row(t, `i${Math.floor(rnd() * 8)}`, { verdict: 'incorrect' })]),
        t + 1,
      );
      const m0 = base.detail.alpha / (base.detail.alpha + base.detail.beta);
      expect(ok.detail.alpha / (ok.detail.alpha + ok.detail.beta)).toBeGreaterThanOrEqual(
        m0 - 1e-12,
      );
      expect(bad.detail.alpha / (bad.detail.alpha + bad.detail.beta)).toBeLessThanOrEqual(
        m0 + 1e-12,
      );
    }
  });

  test('6.2 el tiempo solo no cambia m ni L (baja c y R); 6.3 la velocidad no cambia el dominio', () => {
    const h = history([row(0, 'a'), row(1, 'b'), row(3, 'c'), row(9, 'd'), row(20, 'a')]);
    const now = evalV(h, 20);
    const later = evalV(h, 200, 20);
    expect(later.mastery).toBe(now.mastery);
    expect(later.lower).toBe(now.lower);
    expect(later.confidence!).toBeLessThan(now.confidence!);
    const slow = evalV(
      h.map((r) => ({ ...r, responseMs: 90000 })),
      20,
    );
    expect(slow.mastery).toBe(now.mastery);
    expect(slow.confidence).toBe(now.confidence);
  });

  test('6.5 con ayuda constante, m tiende a a; 6.6 sin aciertos directos, reconocer no aporta', () => {
    const hint = history(
      Array.from({ length: 60 }, (_, d) =>
        row(d, `i${d % 12}`, { assists: { hints_revealed: 1 } }),
      ),
    );
    expect(Math.abs(evalV(hint, 59).mastery! - 0.4)).toBeLessThan(0.02);
    expect(assistFactor({ hints_revealed: 3 })).toBe(0.25);
    const recog = history([
      ...Array.from({ length: 6 }, (_, d) =>
        row(d, `r${d}`, { assessmentMode: 'recognition', responseFormat: 'select', choices: 4 }),
      ),
      row(7, 'w1', { verdict: 'incorrect' }),
      row(8, 'w2', { verdict: 'incorrect' }),
      row(9, 'w3', { verdict: 'incorrect' }),
    ]);
    const r = evalV(recog, 9);
    expect(r.detail.rungs.R!.S).toBeGreaterThan(0);
    expect(r.detail.alpha).toBeCloseTo(Math.pow(2, -9 / 90), 12); // sólo la previa: S_ind = mín(…, S_dir = 0)
    expect(r.weak).toBe(true);
  });

  test('distingue «sin evidencia» de «conocimiento insuficiente»', () => {
    const none = modelEval({
      dimension: 'grammar',
      level: 'A1',
      rows: [],
      asOfMs: 0,
      lastExposureMs: null,
    });
    expect(none.status).toBe('insufficient');
    expect(none.detail.nEff).toBe(0);
    const low = evalV(
      history([
        row(0, 'a', { verdict: 'incorrect' }),
        row(2, 'b', { verdict: 'incorrect' }),
        row(4, 'c', { verdict: 'incorrect' }),
      ]),
      4,
    );
    expect(low.status).toBe('in_progress');
    expect(low.weak).toBe(true);
    expect(low.mastery!).toBeLessThan(0.3);
  });

  test('retención: suficiente con ≥ 2 sondeos a ≥ 1 día; demostrada con un acierto a ≥ 7 días', () => {
    const h = history([
      row(0, 'a'),
      row(1, 'b'),
      row(3, 'c'),
      row(10, 'd'),
      row(20, 'e'),
      row(40, 'a'),
    ]);
    const r = evalV(h, 40);
    expect(r.retentionSufficient).toBe(true);
    expect(r.retentionDemonstrated).toBe(true);
    expect(r.halfLifeDays).not.toBeNull();
    const later = evalV(h, 100, 40);
    expect(later.retention!).toBeLessThan(r.retention!);
    const short = evalV(history([row(0, 'a'), row(0.5, 'b')]), 1);
    expect(short.retentionSufficient).toBe(false);
    expect(short.retention).toBeNull();
  });
});

describe('5.13 agregación: lo no evaluado cuenta 0', () => {
  test('3 de 30 conceptos evaluados y bien → dominio demostrado bajo, cobertura insuficiente', () => {
    const cs = Array.from({ length: 30 }, (_, i) => ({
      conceptId: `c${i}`,
      core: false,
      status: (i < 3 ? 'mastered' : 'insufficient') as 'mastered' | 'insufficient',
      mastery: i < 3 ? 0.9 : null,
      confidence: i < 3 ? 0.6 : null,
    }));
    const a = aggregateDimension(cs);
    expect(a.status).toBe('insufficient_evidence');
    expect(a.mastery).toBeCloseTo(0.09, 12);
    expect(a.masteryOfEvaluated).toBeCloseTo(0.9, 12);
    expect(aggregateDimension([]).status).toBe('no_content');
  });
});
