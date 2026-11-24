import type { Exercise } from '../exercises';
import {
  BAND_SIZE,
  PLACEMENT_VERSION,
  answerPlacement,
  createPlacement,
  currentItem,
  levelRank,
  limitBankToLevels,
  maxQuestions,
  placementProgress,
  placementResult,
  placementUseful,
  replayPlacement,
  type PlacementBank,
} from '../placement';

const exercise = (id: string): Exercise => ({
  id,
  lessonId: null,
  position: 1,
  type: 'fill_blank',
  skill: 'grammar',
  prompt: 'Completá la frase',
  payload: { type: 'fill_blank', sentence: '___', translation: '', options: ['a', 'b', 'c'] },
  answer: 'a',
  acceptedAnswers: [],
  explanation: null,
  difficulty: 1,
  recommendedSeconds: 15,
  wordIds: [],
});

/** Banco sintético: un nivel por cada código, dos bandas por nivel, tres preguntas por banda. */
function bankWith(levels: string[]): PlacementBank {
  return {
    courseCode: 'xx-from-es',
    version: PLACEMENT_VERSION,
    levels: levels.map((level) => ({ level, firstUnitTitle: `Unidad 1 de ${level}`, units: 10 })),
    bands: levels.flatMap((level) =>
      ([1, 2] as const).map((half) => ({
        level,
        half,
        items: [0, 1, 2].map((i) => ({
          sourceId: `${level}-${half}-${i}`,
          dimension: 'grammar' as const,
          unit: half === 1 ? 1 + i : 6 + i,
          exercise: exercise(`${level}-${half}-${i}`),
        })),
      })),
    ),
  };
}

const A1_A2 = bankWith(['A1', 'A2']);
const FIVE = bankWith(['A1', 'A2', 'B1', 'B2', 'C1']);
const run = (bank: PlacementBank, answers: boolean[]) => replayPlacement(bank, answers);
const result = (bank: PlacementBank, answers: boolean[]) => placementResult(run(bank, answers))!;
/** Respuestas que superan `n` bandas seguidas (2 aciertos cada una) y después pierden una. */
const passThenFail = (n: number) => [...Array(n * 2).fill(true), false, false];

describe('respuestas y progresión', () => {
  it('empieza por la banda más fácil, con la primera pregunta', () => {
    const state = createPlacement(A1_A2);
    expect(state.band).toBe(0);
    expect(currentItem(state)?.sourceId).toBe('A1-1-0');
    expect(placementProgress(state)).toBe(0);
  });

  it('dos aciertos superan la banda y suben a la siguiente', () => {
    const state = run(A1_A2, [true, true]);
    expect(state.passed).toBe(1);
    expect(state.band).toBe(1);
    expect(currentItem(state)?.sourceId).toBe('A1-2-0');
  });

  it('un acierto y un error piden la tercera pregunta de la banda', () => {
    const state = run(A1_A2, [true, false]);
    expect(state.finished).toBe(false);
    expect(state.band).toBe(0);
    expect(currentItem(state)?.sourceId).toBe('A1-1-2');
  });

  it('acierto, error, acierto también supera la banda', () => {
    expect(run(A1_A2, [true, false, true]).band).toBe(1);
    expect(run(A1_A2, [false, true, true]).band).toBe(1);
  });

  it('dos errores en una banda terminan el test: no se sigue con preguntas más difíciles', () => {
    const state = run(A1_A2, [true, true, false, false]);
    expect(state.finished).toBe(true);
    expect(currentItem(state)).toBeNull();
    expect(placementProgress(state)).toBe(1);
  });

  it('un test terminado no cambia con más respuestas', () => {
    const done = run(A1_A2, [false, false]);
    expect(answerPlacement(done, true)).toBe(done);
  });

  it('la barra avanza con cada respuesta y no pasa de 1', () => {
    const values = [[], [true], [true, true], [true, true, true]].map((a) =>
      placementProgress(run(A1_A2, a)),
    );
    expect(values).toEqual([0, 1 / 12, 1 / 4, 1 / 4 + 1 / 12]);
  });
});

describe('criterios de detención y duración', () => {
  it('termina con 2 preguntas como mínimo y 3 por banda como máximo', () => {
    expect(run(A1_A2, [false, false]).answers).toHaveLength(2);
    // Una de cada dos bien, siempre en la tercera: 3 preguntas por banda, todas superadas.
    const slow = Array(4).fill([true, false, true]).flat();
    const state = run(A1_A2, slow);
    expect(state.finished).toBe(true);
    expect(state.answers).toHaveLength(maxQuestions(A1_A2));
    expect(maxQuestions(A1_A2)).toBe(4 * BAND_SIZE);
  });

  it('superar todas las bandas termina el test', () => {
    const state = run(A1_A2, Array(8).fill(true));
    expect(state.finished).toBe(true);
    expect(state.answers).toHaveLength(8);
  });

  it('siempre termina, para cualquier secuencia de respuestas', () => {
    for (let mask = 0; mask < 1 << 12; mask += 1) {
      const answers = Array.from({ length: 12 }, (_, i) => Boolean(mask & (1 << i)));
      let state = createPlacement(A1_A2);
      let asked = 0;
      while (!state.finished) {
        state = answerPlacement(state, answers[asked]!);
        asked += 1;
      }
      expect(asked).toBeLessThanOrEqual(12);
      expect(asked).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('asignación de cada nivel', () => {
  it('A1 si no supera la primera mitad de A1', () => {
    const r = result(A1_A2, [false, false]);
    expect(r).toMatchObject({ level: 'A1', mastered: [], partial: false, topReached: false });
  });

  it('A1 (con la primera mitad superada) si pierde la segunda mitad de A1', () => {
    expect(result(A1_A2, passThenFail(1))).toMatchObject({ level: 'A1', partial: true });
  });

  it('A2 si domina A1 (sus dos mitades)', () => {
    expect(result(A1_A2, passThenFail(2))).toMatchObject({
      level: 'A2',
      mastered: ['A1'],
      partial: false,
    });
    expect(result(A1_A2, passThenFail(3))).toMatchObject({ level: 'A2', partial: true });
  });

  it.each([
    [0, 'A1'],
    [2, 'A2'],
    [4, 'B1'],
    [6, 'B2'],
    [8, 'C1'],
  ])('con cinco niveles: %i bandas superadas → %s', (bands, level) => {
    expect(result(FIVE, passThenFail(bands)).level).toBe(level);
  });

  it('cuenta aciertos y preguntas respondidas', () => {
    expect(result(A1_A2, [true, false, true, false, false])).toMatchObject({
      correct: 2,
      answered: 5,
      passedBands: 1,
      totalBands: 4,
      version: PLACEMENT_VERSION,
    });
  });
});

describe('límites de contenido disponible', () => {
  it('superar todo asigna el nivel más alto del banco, nunca uno superior', () => {
    const r = result(A1_A2, Array(8).fill(true));
    expect(r).toMatchObject({ level: 'A2', mastered: ['A1', 'A2'], topReached: true });
    expect(levelRank(r.level)).toBeLessThanOrEqual(levelRank('A2'));
  });

  it('con C1 como techo, todo bien da C1', () => {
    expect(result(FIVE, Array(20).fill(true)).level).toBe('C1');
  });

  it('limitBankToLevels deja sólo los niveles publicados, como prefijo continuo', () => {
    expect(limitBankToLevels(FIVE, ['A1', 'A2']).levels.map((l) => l.level)).toEqual(['A1', 'A2']);
    expect(limitBankToLevels(FIVE, ['A1', 'A2']).bands).toHaveLength(4);
    // Sin A1 publicado no hay a qué nivel ubicar.
    expect(limitBankToLevels(FIVE, ['A2', 'B1']).levels).toEqual([]);
    expect(limitBankToLevels(FIVE, ['A1', 'B1']).levels.map((l) => l.level)).toEqual(['A1']);
  });

  it('un banco con un solo nivel no sirve para ubicar', () => {
    expect(placementUseful(limitBankToLevels(A1_A2, ['A1']))).toBe(false);
    expect(placementUseful(A1_A2)).toBe(true);
    expect(placementUseful(null)).toBe(false);
  });

  it('con un solo nivel publicado, todo bien sigue siendo ese nivel', () => {
    expect(result(limitBankToLevels(A1_A2, ['A1']), [true, true, true, true]).level).toBe('A1');
  });
});

describe('casos extremos', () => {
  it('un banco vacío o con bandas incompletas no arranca', () => {
    expect(() => createPlacement({ ...A1_A2, bands: [] })).toThrow();
    expect(() =>
      createPlacement({
        ...A1_A2,
        bands: [{ ...A1_A2.bands[0]!, items: A1_A2.bands[0]!.items.slice(0, 2) }],
      }),
    ).toThrow();
  });

  it('el resultado no existe hasta que el test termina (abandonar no deja nivel)', () => {
    expect(placementResult(run(A1_A2, [true, true, true]))).toBeNull();
  });

  it('niveles MCER en orden', () => {
    expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(levelRank)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(levelRank('Z9')).toBe(-1);
  });
});

describe('reproducibilidad', () => {
  it('las mismas respuestas dan siempre el mismo recorrido y el mismo resultado', () => {
    const answers = [true, false, true, true, false, true, false, false];
    const a = run(A1_A2, answers);
    const b = run(A1_A2, answers);
    expect(a).toEqual(b);
    expect(placementResult(a)).toEqual(placementResult(b));
    expect(a.answers.map((x) => x.sourceId)).toEqual([
      'A1-1-0',
      'A1-1-1',
      'A1-1-2',
      'A1-2-0',
      'A1-2-1',
      'A1-2-2',
      'A2-1-0',
      'A2-1-1',
    ]);
  });

  it('no modifica el estado anterior (inmutable)', () => {
    const start = createPlacement(A1_A2);
    const copy = JSON.parse(JSON.stringify(start.answers));
    answerPlacement(start, true);
    expect(start.answers).toEqual(copy);
  });
});
