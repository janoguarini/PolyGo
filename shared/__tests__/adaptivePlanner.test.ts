/**
 * Armador de repasos planner-2.1.0 (docs/ADAPTIVE_LEARNING_DESIGN.md 8.1–8.4, AL7, AL8, AL19, AL21, I3b, I7).
 */
import {
  buildReviewPlan,
  isPersistent,
  isWeak,
  persistentUnits,
  PLANNER_VERSION,
  PlannerInput,
  PlannerUnit,
} from '../adaptivePlanner';

const TZ = 'America/Argentina/Buenos_Aires';
const NOW = '2026-11-08T15:00:00.000Z'; // 12:00 local
const H = 3_600_000;
const at = (hoursFromNow: number) => new Date(Date.parse(NOW) + hoursFromNow * H).toISOString();

let k = 0;
function unit(over: Partial<PlannerUnit> = {}): PlannerUnit {
  const id = `en-w${String(++k).padStart(3, '0')}`;
  return {
    concept_id: id,
    dimension: 'vocabulary',
    level: 'A1',
    due_at: at(-2),
    due_effective_at: at(-2),
    me_hint_expires_at: null,
    last_seen_at: at(-30),
    t_last: at(-30),
    stability: 3,
    difficulty: 5,
    n: 3,
    rung: 'G',
    mastery: null,
    items: [
      {
        item_id: `${id}.R`,
        rung: 'R',
        item_type: 'translation_choice',
        input_modality: 'text',
        last_presented_at: null,
        option_count: 4,
      },
      {
        item_id: `${id}.G`,
        rung: 'G',
        item_type: 'cued',
        input_modality: 'text',
        last_presented_at: null,
        option_count: null,
      },
      {
        item_id: `${id}.L`,
        rung: 'L',
        item_type: 'translate_write',
        input_modality: 'text',
        last_presented_at: null,
        option_count: null,
      },
    ],
    ...over,
  };
}
const input = (units: PlannerUnit[], over: Partial<PlannerInput> = {}): PlannerInput => ({
  now: NOW,
  time_zone: TZ,
  seed: 'session-1',
  budget: { B: 75, reviews_today: 0, all_today: 0, advanced_today: 0, first_review_today: true },
  debt: { al19_active: false, debt_items: 0 },
  al8: { last_attended_date: '2026-11-07', last_kind: null },
  user_median_speed: null,
  units,
  ...over,
});
const enabled = (over: Partial<NonNullable<PlannerUnit['mastery']>> = {}) => ({
  enabled: true,
  status: 'in_progress' as const,
  mastery: 0.7,
  confidence: 0.6,
  weak: false,
  recall_speed: null,
  transfer_met: true,
  ...over,
});

describe('presupuesto (AL7, AL21) y vencidos', () => {
  test('S = 15 como máximo; nunca supera lo que queda de B ni de B − reserva', () => {
    const units = Array.from({ length: 40 }, (_, i) =>
      unit({ due_at: at(-40 + i), due_effective_at: at(-40 + i) }),
    );
    const p = buildReviewPlan(input(units));
    expect(p.capacity).toBe(15);
    expect(p.items).toHaveLength(15);
    expect(p.reserve).toBe(15);
    const tight = buildReviewPlan(
      input(units, {
        budget: {
          B: 75,
          reviews_today: 55,
          all_today: 55,
          advanced_today: 0,
          first_review_today: false,
        },
      }),
    );
    expect(tight.capacity).toBe(5);
    expect(tight.items).toHaveLength(5);
    const spent = buildReviewPlan(
      input(units, {
        budget: {
          B: 75,
          reviews_today: 70,
          all_today: 70,
          advanced_today: 0,
          first_review_today: false,
        },
      }),
    );
    expect(spent.status).toBe('budget_exhausted');
    expect(spent.items).toHaveLength(0);
  });

  test('con deuda > 1·B o AL19 activa la reserva es 0 y no se recomiendan lecciones (sin bloquear)', () => {
    const p = buildReviewPlan(input([unit()], { debt: { al19_active: false, debt_items: 80 } }));
    expect(p.reserve).toBe(0);
    expect(p.recommend_lesson).toBe(false);
    expect(
      buildReviewPlan(input([unit()], { debt: { al19_active: true, debt_items: 0 } })).reserve,
    ).toBe(0);
    expect(buildReviewPlan(input([unit()])).recommend_lesson).toBe(true);
  });

  test('vencidos por due_at ascendente; los vencidos van antes que cualquier lugar libre', () => {
    const late = unit({ due_at: at(-1), due_effective_at: at(-1) });
    const early = unit({ due_at: at(-50), due_effective_at: at(-50) });
    const recent = unit({ n: 1, due_at: at(30), due_effective_at: at(30) });
    const p = buildReviewPlan(
      input([recent, late, early], {
        budget: {
          B: 75,
          reviews_today: 58,
          all_today: 58,
          advanced_today: 0,
          first_review_today: false,
        },
      }),
    );
    expect(p.capacity).toBe(2);
    expect(p.items.map((i) => i.concept_id).sort()).toEqual(
      [early.concept_id, late.concept_id].sort(),
    );
    expect(p.items.every((i) => i.reason === 'due')).toBe(true);
  });

  test('I3b: una unidad vista hoy (local) nunca entra, aunque esté vencida', () => {
    const seenToday = unit({ last_seen_at: at(-1) });
    const p = buildReviewPlan(input([seenToday]));
    expect(p.items).toHaveLength(0);
    expect(p.status).toBe('up_to_date');
  });

  test('sin nada pendiente: «al día»', () => {
    expect(buildReviewPlan(input([])).status).toBe('up_to_date');
    expect(
      buildReviewPlan(input([unit({ due_at: at(200), due_effective_at: at(200), n: 5 })])).status,
    ).toBe('up_to_date');
  });
});

describe('escalón e ítem (8.4)', () => {
  test('el escalón es el k de la unidad; sin ítem en ese escalón la unidad no entra (no se sustituye)', () => {
    const noL = unit({
      rung: 'L',
      items: [
        {
          item_id: 'x.R',
          rung: 'R',
          item_type: 't',
          input_modality: 'text',
          last_presented_at: null,
        },
      ],
    });
    const ok = unit({ rung: 'R' });
    const p = buildReviewPlan(input([noL, ok]));
    expect(p.items.map((i) => i.concept_id)).toEqual([ok.concept_id]);
    expect(p.items[0]!.rung).toBe('R');
    expect(p.skipped).toEqual([
      { concept_id: noL.concept_id, dimension: 'vocabulary', reason: 'no_item_at_rung' },
    ]);
  });

  test('dominada → escalón objetivo; prefiere un ítem no visto en 7 días', () => {
    const u = unit({ rung: 'G', mastery: enabled({ status: 'mastered', mastery: 0.9 }) });
    expect(buildReviewPlan(input([u])).items[0]!.rung).toBe('L');
    const v = unit({ rung: 'R' });
    v.items = [
      {
        item_id: 'a',
        rung: 'R',
        item_type: 't',
        input_modality: 'text',
        last_presented_at: at(-24),
      },
      {
        item_id: 'b',
        rung: 'R',
        item_type: 't',
        input_modality: 'text',
        last_presented_at: at(-24 * 10),
      },
    ];
    expect(buildReviewPlan(input([v])).items[0]!.item_id).toBe('b');
  });

  test('determinista y puro: misma entrada, mismo plan; la entrada no cambia (no toca S ni D)', () => {
    const units = Array.from({ length: 20 }, () => unit());
    const inp = input(units);
    const snapshot = JSON.stringify(inp);
    expect(buildReviewPlan(inp)).toEqual(buildReviewPlan(JSON.parse(snapshot)));
    expect(JSON.stringify(inp)).toBe(snapshot);
  });

  test('intercalado: nunca 3 seguidos del mismo tipo cuando hay alternativa', () => {
    const units = Array.from({ length: 9 }, (_, i) => unit({ rung: i % 3 === 0 ? 'L' : 'R' }));
    const p = buildReviewPlan(input(units));
    const types = p.items.map((it) => it.item_id.split('.')[1]);
    for (let i = 2; i < types.length - 1; i++)
      expect(types[i] === types[i - 1] && types[i] === types[i - 2]).toBe(false);
  });
});

describe('Mastery Engine en el planificador (7.2–7.3)', () => {
  test('motor no habilitado: sin sondeos ni fluidez; débiles sólo por el respaldo del SRS (D ≥ 6,85)', () => {
    const probeIfEnabled = unit({
      due_at: at(100),
      due_effective_at: at(100),
      mastery: { ...enabled({ status: 'insufficient', mastery: null }), enabled: false },
    });
    const hard = unit({ due_at: at(100), due_effective_at: at(100), difficulty: 7 });
    const p = buildReviewPlan(input([probeIfEnabled, hard]));
    expect(p.items.map((i) => [i.concept_id, i.reason])).toEqual([[hard.concept_id, 'weak']]);
  });

  test('motor habilitado: débiles del motor, sondeos (insuficiente o confianza < 0,35 con n ≥ 3) y fluidez', () => {
    const weak = unit({
      due_at: at(100),
      due_effective_at: at(100),
      mastery: enabled({ weak: true, mastery: 0.4 }),
    });
    const probe = unit({
      due_at: at(100),
      due_effective_at: at(100),
      mastery: enabled({ confidence: 0.2 }),
    });
    const fluent = unit({
      due_at: at(100),
      due_effective_at: at(100),
      mastery: enabled({ recall_speed: 2, mastery: 0.8 }),
    });
    const p = buildReviewPlan(
      input([weak, probe, fluent], {
        user_median_speed: 1,
        al8: { last_attended_date: '2026-11-07', last_kind: null },
      }),
    );
    const reasons = Object.fromEntries(p.items.map((i) => [i.concept_id, i.reason]));
    expect(reasons).toEqual({
      [weak.concept_id]: 'weak',
      [probe.concept_id]: 'probe',
      [fluent.concept_id]: 'fluency',
    });
    expect(p.items.find((i) => i.reason === 'probe')!.rung).toBe('L'); // sondeo → escalón objetivo
  });

  test('I7: adelantos del motor sólo con sugerencia vigente, en lugares libres y ≤ ⌈0,2·S⌉', () => {
    const adv = Array.from({ length: 6 }, () =>
      unit({ due_at: at(24 * 5), due_effective_at: at(-1), me_hint_expires_at: at(10) }),
    );
    const expired = unit({
      due_at: at(24 * 5),
      due_effective_at: at(-1),
      me_hint_expires_at: at(-1),
    });
    const p = buildReviewPlan(input([...adv, expired]));
    expect(p.items.filter((i) => i.reason === 'me_advanced')).toHaveLength(3);
    expect(p.items.some((i) => i.concept_id === expired.concept_id)).toBe(false);
    const full = Array.from({ length: 15 }, () => unit());
    expect(
      buildReviewPlan(input([...full, ...adv])).items.some((i) => i.reason === 'me_advanced'),
    ).toBe(false);
  });
});

describe('AL8: plaza mínima semanal dentro de B', () => {
  const dueMany = () =>
    Array.from({ length: 20 }, (_, i) =>
      unit({ due_at: at(-100 + i), due_effective_at: at(-100 + i) }),
    );
  test('a 7 días naturales o más del último débil o sondeo, reemplaza al último vencido; antes, no', () => {
    const hard = unit({ due_at: at(300), due_effective_at: at(300), difficulty: 8 });
    const p = buildReviewPlan(
      input([...dueMany(), hard], { al8: { last_attended_date: '2026-11-01', last_kind: null } }),
    );
    expect(p.items).toHaveLength(15);
    expect(p.items.filter((i) => i.reason === 'weak').map((i) => i.concept_id)).toEqual([
      hard.concept_id,
    ]);
    expect(p.items.filter((i) => i.reason === 'due')).toHaveLength(14);
    const early = buildReviewPlan(
      input([...dueMany(), hard], { al8: { last_attended_date: '2026-11-02', last_kind: null } }),
    );
    expect(early.items.some((i) => i.reason === 'weak')).toBe(false);
    const notFirst = buildReviewPlan(
      input([...dueMany(), hard], {
        al8: { last_attended_date: '2026-11-01', last_kind: null },
        budget: {
          B: 75,
          reviews_today: 10,
          all_today: 10,
          advanced_today: 0,
          first_review_today: false,
        },
      }),
    );
    expect(notFirst.items.some((i) => i.reason === 'weak')).toBe(false);
  });
  test('alterna entre débil y sondeo', () => {
    const weak = unit({
      due_at: at(300),
      due_effective_at: at(300),
      mastery: enabled({ weak: true, mastery: 0.3 }),
    });
    const probe = unit({
      due_at: at(300),
      due_effective_at: at(300),
      mastery: enabled({ status: 'insufficient', mastery: null, confidence: null }),
    });
    const p = buildReviewPlan(
      input([...dueMany(), weak, probe], {
        al8: { last_attended_date: '2026-10-20', last_kind: 'weak' },
      }),
    );
    expect(p.items.filter((i) => i.reason === 'probe').map((i) => i.concept_id)).toEqual([
      probe.concept_id,
    ]);
    expect(p.items.some((i) => i.reason === 'weak')).toBe(false);
  });
});

describe('planner-2.1.0 (fase 4): R5 completa, tope por objetivo, un concepto por sesión, AL17', () => {
  const notDue = { due_at: at(200), due_effective_at: at(200), n: 5 };

  test('versión', () => {
    expect(buildReviewPlan(input([unit()])).planner_version).toBe(PLANNER_VERSION);
    expect(PLANNER_VERSION).toBe('planner-2.2.0');
  });

  test('R5 sin motor: D ≥ 6,85 o ≥ 2 errores plenos en 30 días; con motor manda el motor', () => {
    expect(isWeak(unit({ difficulty: 5, errors_30d: 1 }))).toBe(false);
    expect(isWeak(unit({ difficulty: 5, errors_30d: 2 }))).toBe(true);
    expect(isWeak(unit({ difficulty: 6.85 }))).toBe(true);
    expect(isWeak(unit({ difficulty: 5, errors_30d: 3, mastery: enabled({ weak: false }) }))).toBe(
      false,
    );
    const w = unit({ ...notDue, difficulty: 5, errors_30d: 2 });
    const p = buildReviewPlan(input([w, unit({ ...notDue, difficulty: 5 })]));
    expect(p.items.map((i) => [i.concept_id, i.reason])).toContainEqual([w.concept_id, 'weak']);
  });

  test('máximo 2 débiles por objetivo y sesión; sin objetivos no recorta', () => {
    const weak = (o: string[]) => unit({ ...notDue, difficulty: 8, objective_ids: o });
    const units = [weak(['obj.a']), weak(['obj.a']), weak(['obj.a']), weak(['obj.b']), weak([])];
    const p = buildReviewPlan(
      input(units, { al8: { last_attended_date: '2026-11-07', last_kind: null } }),
    );
    const chosen = p.items.filter((i) => i.reason === 'weak').map((i) => i.concept_id);
    const ofA = chosen.filter((c) => units.slice(0, 3).some((u) => u.concept_id === c));
    expect(ofA).toHaveLength(2);
    expect(chosen).toContain(units[3]!.concept_id);
    expect(chosen).toContain(units[4]!.concept_id);
  });

  test('un concepto entra una sola vez aunque tenga dos dimensiones vencidas', () => {
    const v = unit();
    const prod: PlannerUnit = {
      ...v,
      dimension: 'production',
      rung: 'P',
      items: [
        {
          item_id: `${v.concept_id}.P`,
          rung: 'P',
          item_type: 'translate_write',
          input_modality: 'text',
          last_presented_at: null,
          option_count: null,
        },
      ],
    };
    const p = buildReviewPlan(input([v, prod]));
    expect(p.items).toHaveLength(1);
  });

  test('R5 con motor: menor m primero; las del motor antes que las del respaldo', () => {
    const lowM = unit({ ...notDue, mastery: enabled({ weak: true, mastery: 0.2 }) });
    const midM = unit({ ...notDue, mastery: enabled({ weak: true, mastery: 0.4 }) });
    const fallback = unit({ ...notDue, difficulty: 9 });
    const p = buildReviewPlan(
      input([fallback, midM, lowM], {
        budget: {
          B: 75,
          reviews_today: 57,
          all_today: 57,
          advanced_today: 0,
          first_review_today: false,
        },
      }),
    );
    expect(p.capacity).toBe(3);
    expect(new Set(p.items.map((i) => i.concept_id))).toEqual(
      new Set([lowM.concept_id, midM.concept_id, fallback.concept_id]),
    );
    const two = buildReviewPlan(
      input([fallback, midM, lowM], {
        budget: {
          B: 75,
          reviews_today: 58,
          all_today: 58,
          advanced_today: 0,
          first_review_today: false,
        },
      }),
    );
    expect(two.items.map((i) => i.concept_id).sort()).toEqual(
      [lowM.concept_id, midM.concept_id].sort(),
    );
  });

  test('AL17: λ ≥ 4 en 30 días y D ≥ 8,2; no con la ventana incompleta; no cambia el plan', () => {
    const p1 = unit({ errors_30d: 4, difficulty: 8.2, intro_lesson_id: 'a1-u01-l01' });
    const lowD = unit({ errors_30d: 6, difficulty: 8.1 });
    const fewErrors = unit({ errors_30d: 3, difficulty: 9 });
    const converted = unit({ errors_30d: 5, difficulty: 9, errors_window_complete: false });
    expect([p1, lowD, fewErrors, converted].map(isPersistent)).toEqual([true, false, false, false]);
    const inp = input([p1, lowD, fewErrors, converted]);
    expect(persistentUnits(inp)).toEqual([
      {
        concept_id: p1.concept_id,
        dimension: 'vocabulary',
        errors_30d: 4,
        difficulty: 8.2,
        intro_lesson_id: 'a1-u01-l01',
      },
    ]);
    const without = buildReviewPlan(
      input([p1, lowD, fewErrors, converted].map((u) => ({ ...u, intro_lesson_id: null }))),
    );
    expect(buildReviewPlan(inp).items).toEqual(without.items);
  });
});

describe('planner-2.2.0 (fase 5): ítems de varios conceptos', () => {
  test('un concepto aparece en una sola entrada, también como secundario de otro ítem', () => {
    const a = unit();
    const b = unit();
    // El único ítem G de «a» cubre también a «b»; «b» tiene uno propio.
    a.items = [{ ...a.items[1]!, item_id: 'multi.ab', concepts: [a.concept_id, b.concept_id] }];
    b.items = [{ ...b.items[1]!, item_id: 'solo.b', concepts: [b.concept_id] }];
    const plan = buildReviewPlan(input([a, b]));
    const ids = plan.items.map((i) => i.item_id);
    // «a» vence primero y toma el ítem de varios conceptos: «b» ya está cubierto y no entra otra vez.
    expect(ids).toEqual(['multi.ab']);
    expect(PLANNER_VERSION).toBe('planner-2.2.0');
  });

  test('un ítem cuyo concepto secundario ya está tomado no se elige (se usa otro o la unidad se saltea)', () => {
    const b = unit({ due_at: at(-5), due_effective_at: at(-5) });
    const a = unit({ due_at: at(-1), due_effective_at: at(-1) });
    b.items = [{ ...b.items[1]!, item_id: 'solo.b', concepts: [b.concept_id] }];
    a.items = [
      { ...a.items[1]!, item_id: 'multi.ab', concepts: [a.concept_id, b.concept_id] },
      { ...a.items[1]!, item_id: 'solo.a', concepts: [a.concept_id] },
    ];
    expect(buildReviewPlan(input([a, b])).items.map((i) => i.item_id)).toEqual([
      'solo.b',
      'solo.a',
    ]);
    a.items = [a.items[0]!];
    const plan = buildReviewPlan(input([a, b]));
    expect(plan.items.map((i) => i.item_id)).toEqual(['solo.b']);
    expect(plan.skipped.map((s) => s.concept_id)).toContain(a.concept_id);
  });

  test('sin `concepts` (entrada vieja) se comporta como antes', () => {
    const units = [unit(), unit(), unit()];
    expect(buildReviewPlan(input(units)).items).toHaveLength(3);
  });
});
