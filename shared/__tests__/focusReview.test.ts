import {
  FOCUS_PLANNER_VERSION,
  buildBasicPlan,
  buildFocusPlan,
  parseFocusRequest,
  pickFocusItem,
  type FocusCandidate,
  type FocusItem,
} from '../focusReview';

const NOW = '2026-11-08T12:00:00.000Z';
const H = 3600 * 1000;

const it_ = (id: string, last: string | null = null, options: number | null = 4): FocusItem => ({
  item_id: id,
  dimension: 'vocabulary',
  rung: 'G',
  option_count: options,
  last_presented_at: last,
});

const word = (id: string, over: Partial<FocusCandidate> = {}): FocusCandidate => ({
  word: { id, unit_id: 'a1-u01' },
  stage: 1,
  seenCount: 4,
  incorrectCount: 0,
  nextReviewAt: new Date(Date.parse(NOW) - H).toISOString(),
  items: [it_(`${id}.i1`)],
  ...over,
});

describe('repasos Plus armados en el servidor (cierre de la fase 4, P3)', () => {
  test('mismas reglas que la app vieja; una entrada por palabra, posiciones 1..n', () => {
    const plan = buildFocusPlan(
      {
        now: NOW,
        seed: 's',
        words: [
          word('en-fine', { nextReviewAt: new Date(Date.parse(NOW) + 10 * 24 * H).toISOString() }),
          word('en-due', { incorrectCount: 1 }),
          word('en-often', {
            seenCount: 10,
            incorrectCount: 3,
            nextReviewAt: new Date(Date.parse(NOW) + 5 * 24 * H).toISOString(),
          }),
        ],
      },
      { kind: 'smart' },
    );
    expect(plan.planner_version).toBe(FOCUS_PLANNER_VERSION);
    expect(plan.status).toBe('ok');
    expect(plan.items.map((i) => [i.position, i.concept_id, i.reason])).toEqual([
      [1, 'en-due', 'due'],
      [2, 'en-often', 'frequent_mistakes'],
    ]);
    expect(plan.items[0]).toMatchObject({
      item_id: 'en-due.i1',
      dimension: 'vocabulary',
      option_count: 4,
    });
  });

  test('una palabra sin ítem presentable no entra (no se corrige en el dispositivo) ni ocupa lugar', () => {
    const words = [
      word('en-a', { items: [] }),
      ...Array.from({ length: 20 }, (_, i) => word(`en-w${i}`)),
    ];
    const plan = buildFocusPlan({ now: NOW, seed: 's', words }, { kind: 'smart' });
    expect(plan.items).toHaveLength(15);
    expect(plan.items.some((i) => i.concept_id === 'en-a')).toBe(false);
  });

  test('por tema: sólo palabras de la unidad; sin nada → up_to_date', () => {
    const words = [word('en-a'), word('en-b', { word: { id: 'en-b', unit_id: 'a1-u02' } })];
    const plan = buildFocusPlan(
      { now: NOW, seed: 's', words },
      { kind: 'topic', unit_id: 'a1-u02' },
    );
    expect(plan.items.map((i) => [i.concept_id, i.reason])).toEqual([['en-b', 'topic']]);
    expect(
      buildFocusPlan({ now: NOW, seed: 's', words }, { kind: 'topic', unit_id: 'x' }).status,
    ).toBe('up_to_date');
  });

  test('ítem: el presentado hace más tiempo (o nunca); desempate determinista por sesión', () => {
    const items = [
      it_('a', '2026-11-07T00:00:00Z'),
      it_('b', null),
      it_('c', '2026-11-01T00:00:00Z'),
    ];
    expect(pickFocusItem(items, 's')!.item_id).toBe('b');
    expect(pickFocusItem(items.slice(0, 1).concat(items[2]!), 's')!.item_id).toBe('c');
    const ties = [it_('x'), it_('y'), it_('z')];
    expect(pickFocusItem(ties, 'seed-1')).toEqual(pickFocusItem([...ties].reverse(), 'seed-1'));
    expect(pickFocusItem([], 's')).toBeNull();
  });

  test('pedido de foco: sólo formas válidas', () => {
    expect(parseFocusRequest({ kind: 'smart' })).toEqual({ kind: 'smart' });
    expect(parseFocusRequest({ kind: 'topic', unit_id: 'a1-u03' })).toEqual({
      kind: 'topic',
      unit_id: 'a1-u03',
    });
    expect(parseFocusRequest({ kind: 'topic' })).toBeNull();
    expect(parseFocusRequest({ kind: 'topic', unit_id: "'; drop" })).toBeNull();
    expect(parseFocusRequest({ kind: 'weak' })).toBeNull();
    expect(parseFocusRequest(null)).toBeNull();
  });
});

describe('focus-1.1.0 (fase 5): ítems de varios conceptos', () => {
  test('una palabra no se repite como secundaria de otro ítem', () => {
    const a = word('en-a', {
      incorrectCount: 3,
      items: [{ ...it_('multi.ab'), concepts: ['en-a', 'en-b'] }],
    });
    const b = word('en-b', {
      incorrectCount: 2,
      items: [{ ...it_('solo.b'), concepts: ['en-b'] }],
    });
    const c = word('en-c', {
      incorrectCount: 1,
      items: [
        { ...it_('multi.bc'), concepts: ['en-b', 'en-c'] },
        { ...it_('solo.c'), concepts: ['en-c'] },
      ],
    });
    const plan = buildFocusPlan({ now: NOW, seed: 's', words: [a, b, c] }, { kind: 'smart' });
    expect(plan.planner_version).toBe('focus-1.1.0');
    expect(plan.items.map((i) => i.item_id)).toEqual(['multi.ab', 'solo.c']);
    const covered = plan.items.flatMap(
      (i) => [a, b, c].flatMap((w) => w.items).find((x) => x.item_id === i.item_id)!.concepts!,
    );
    expect(new Set(covered).size).toBe(covered.length);
  });

  test('pickFocusItem descarta los ítems con conceptos bloqueados', () => {
    const items = [
      { ...it_('x'), concepts: ['en-a', 'en-z'] },
      { ...it_('y', '2026-11-01T00:00:00Z'), concepts: ['en-a'] },
    ];
    expect(pickFocusItem(items, 's')!.item_id).toBe('x');
    expect(pickFocusItem(items, 's', new Set(['en-z']))!.item_id).toBe('y');
    expect(pickFocusItem(items, 's', new Set(['en-a']))).toBeNull();
  });
});

describe('repaso básico basic-1.0.0 (cierre de la fase 5): reglas del SRS v1', () => {
  const due = (h: number) => new Date(Date.parse(NOW) - h * H).toISOString();
  test('vencidas, más errores primero, empate por vencimiento; hasta 10; sin Plus ni foco del cliente', () => {
    const words = [
      word('en-a', { incorrectCount: 0, nextReviewAt: due(5) }),
      word('en-b', { incorrectCount: 2, nextReviewAt: due(1) }),
      word('en-c', { incorrectCount: 0, nextReviewAt: due(9) }),
      word('en-later', {
        incorrectCount: 9,
        nextReviewAt: new Date(Date.parse(NOW) + H).toISOString(),
      }),
      word('en-never', { seenCount: 0, incorrectCount: 9 }),
      word('en-noitem', { incorrectCount: 5, items: [] }),
    ];
    const plan = buildBasicPlan({ now: NOW, seed: 's', words });
    expect(plan.planner_version).toBe('basic-1.0.0');
    expect(plan.focus).toEqual({ kind: 'basic' });
    expect(plan.items.map((i) => i.concept_id)).toEqual(['en-b', 'en-c', 'en-a']);
    expect(plan.items.every((i) => i.reason === 'due')).toBe(true);
    expect(plan.items.map((i) => i.position)).toEqual([1, 2, 3]);
    const many = Array.from({ length: 14 }, (_, k) => word(`en-w${k}`));
    expect(buildBasicPlan({ now: NOW, seed: 's', words: many }).items).toHaveLength(10);
    expect(buildBasicPlan({ now: NOW, seed: 's', words: [] }).status).toBe('up_to_date');
    expect(parseFocusRequest({ kind: 'basic' })).toBeNull();
  });

  test('una palabra cubierta por un ítem de varios conceptos no vuelve a entrar; se completa con la siguiente', () => {
    const words = [
      word('en-a', {
        incorrectCount: 3,
        items: [{ ...it_('multi.ab'), concepts: ['en-a', 'en-b'] }],
      }),
      word('en-b', { incorrectCount: 2, items: [{ ...it_('solo.b'), concepts: ['en-b'] }] }),
      word('en-c', { incorrectCount: 1 }),
    ];
    expect(buildBasicPlan({ now: NOW, seed: 's', words }).items.map((i) => i.item_id)).toEqual([
      'multi.ab',
      'en-c.i1',
    ]);
  });
});
