import {
  COACH_EVIDENCE,
  coachSessionPlan,
  diagnose,
  parseCoachUnits,
  pickCoachReview,
} from '../coach';
import {
  buildFocusPlan,
  parseFocusRequest,
  type FocusCandidate,
  type TopicUnit,
} from '../focusReview';
import { COACH } from '../plus';

const unit = (id: string): TopicUnit => ({ id, level: 'A1', title: `Unidad ${id}`, emoji: '📘' });

let n = 0;
const word = (unitId: string, seen: number, wrong: number, stage = 2): FocusCandidate => ({
  word: { id: `w${++n}`, unit_id: unitId },
  stage,
  seenCount: seen,
  incorrectCount: wrong,
  nextReviewAt: null,
  items: [
    {
      item_id: `i${n}`,
      dimension: 'vocabulary',
      rung: 'recognition',
      option_count: 4,
      last_presented_at: null,
    },
  ],
});

describe('diagnóstico del Coach', () => {
  it('con poca evidencia no afirma nada (mensaje neutral)', () => {
    const d = diagnose([unit('u1')], [word('u1', 5, 4), word('u1', 5, 4)]);
    expect(d).toEqual({
      status: 'insufficient_data',
      studied: 2,
      needed: COACH_EVIDENCE.minStudiedWords,
    });
  });

  it('detecta las unidades débiles con números reales y propone una sesión de ~3 minutos', () => {
    const entries = [
      // u1: muchos errores.
      word('u1', 6, 3),
      word('u1', 5, 2),
      word('u1', 4, 2),
      // u2: perfecta.
      word('u2', 6, 0, 4),
      word('u2', 6, 0, 4),
      word('u2', 6, 0, 4),
      // u3: un error aislado (no alcanza para llamarla débil).
      word('u3', 6, 1),
      word('u3', 6, 0),
      word('u3', 6, 0),
    ];
    const d = diagnose([unit('u1'), unit('u2'), unit('u3')], entries);
    expect(d.status).toBe('ok');
    if (d.status !== 'ok') return;
    expect(d.weak.map((a) => a.unit.id)).toEqual(['u1']);
    expect(d.weak[0]).toMatchObject({ studied: 3, seen: 15, mistakes: 7, struggling: 3 });
    expect(d.strong.map((a) => a.unit.id)).toContain('u2');
    expect(d.exercises).toBe(3);
    expect(d.exercises).toBeLessThanOrEqual(COACH.sessionSize);
    expect(d.minutes.low).toBeGreaterThanOrEqual(1);
  });

  it('sin errores repetidos: «vas bien», sin inventar debilidades', () => {
    const entries = Array.from({ length: 9 }, (_, i) => word(`u${i % 3}`, 5, 0, 3));
    const d = diagnose([unit('u0'), unit('u1'), unit('u2')], entries);
    expect(d.status).toBe('all_good');
  });

  it('nunca más de 3 áreas', () => {
    const units = ['a', 'b', 'c', 'd', 'e'].map(unit);
    const entries = units.flatMap((u) => [word(u.id, 4, 3), word(u.id, 4, 3), word(u.id, 4, 3)]);
    const d = diagnose(units, entries);
    expect(d.status === 'ok' && d.weak.length).toBe(COACH.maxAreas);
  });
});

describe('selección de la sesión', () => {
  it('sólo palabras con dificultad de las unidades pedidas, repartidas por turnos', () => {
    const entries = [
      word('a', 4, 3),
      word('a', 4, 2),
      word('a', 4, 1),
      word('b', 4, 3),
      word('b', 4, 0, 4), // sin errores ni dificultad: no entra
      word('c', 4, 3), // otra unidad: no entra
    ];
    const picked = pickCoachReview(entries, ['a', 'b']);
    expect(picked.map((e) => e.word.unit_id)).toEqual(['a', 'b', 'a', 'a']);
    expect(picked.every((e) => e.incorrectCount > 0)).toBe(true);
    expect(pickCoachReview(entries, ['a', 'b'], 2)).toHaveLength(2);
  });

  it('el plan del servidor marca los ítems con el motivo coach y respeta el tope', () => {
    const entries = Array.from({ length: 12 }, () => word('a', 4, 2));
    const plan = buildFocusPlan(
      { now: new Date().toISOString(), words: entries, seed: 's' },
      { kind: 'coach', unit_ids: ['a'] },
    );
    expect(plan.capacity).toBe(COACH.sessionSize);
    expect(plan.items).toHaveLength(COACH.sessionSize);
    expect(plan.items.every((i) => i.reason === 'coach')).toBe(true);
  });
});

describe('pedido de Coach', () => {
  it('valida las unidades', () => {
    expect(parseCoachUnits(['a1-u01', 'a1-u02'])).toEqual(['a1-u01', 'a1-u02']);
    expect(parseCoachUnits([])).toBeNull();
    expect(parseCoachUnits(['a', 'b', 'c', 'd'])).toBeNull();
    expect(parseCoachUnits(['a', 'a'])).toBeNull();
    expect(parseCoachUnits(['a b'])).toBeNull();
    expect(parseCoachUnits('a')).toBeNull();
    expect(parseFocusRequest({ kind: 'coach', unit_ids: ['a1-u01'] })).toEqual({
      kind: 'coach',
      unit_ids: ['a1-u01'],
    });
    expect(parseFocusRequest({ kind: 'coach' })).toBeNull();
  });
});

describe('sesión propuesta', () => {
  it('con áreas débiles: foco en esas unidades', () => {
    const units = [unit('x'), unit('y')];
    const entries = [
      word('x', 4, 3),
      word('x', 4, 3),
      word('x', 4, 3),
      word('y', 4, 0, 4),
      word('y', 4, 0, 4),
      word('y', 4, 0, 4),
      word('y', 4, 0, 4),
      word('y', 4, 0, 4),
    ];
    const plan = coachSessionPlan(diagnose(units, entries), entries);
    expect(plan).toMatchObject({ kind: 'focus', unitIds: ['x'], exercises: 3 });
  });

  it('sin áreas débiles pero con errores sueltos: mantenimiento con esas unidades', () => {
    const units = [unit('p'), unit('q')];
    const entries = [
      word('p', 6, 1),
      ...Array.from({ length: 4 }, () => word('p', 6, 0, 4)),
      ...Array.from({ length: 4 }, () => word('q', 6, 0, 4)),
    ];
    const d = diagnose(units, entries);
    expect(d.status).toBe('all_good');
    expect(coachSessionPlan(d, entries)).toMatchObject({
      kind: 'maintenance',
      unitIds: ['p'],
      exercises: 1,
    });
  });

  it('sin errores: nada que entrenar', () => {
    const units = [unit('r')];
    const entries = Array.from({ length: 9 }, () => word('r', 5, 0, 4));
    expect(coachSessionPlan(diagnose(units, entries), entries)).toBeNull();
  });
});
