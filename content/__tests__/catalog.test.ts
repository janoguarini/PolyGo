import { CURRICULUM_PATH } from '..';
import {
  buildCatalog,
  classifyExercise,
  generatedItemId,
  generatedSetItemId,
  MODE_FORMATS,
  targetDimensions,
} from '../catalog';
import { pathExerciseId } from '../path';
import type { ExerciseDef } from '../types';

/**
 * Catálogo de aprendizaje derivado de content/ (arquitectura de datos rev. 8, §4.3–§4.5 y §5).
 * La base lo vuelve a validar en supabase/tests/items.test.mjs.
 */
const catalog = buildCatalog(CURRICULUM_PATH);
const items = new Map(catalog.items.map((i) => [i.id, i]));
const exerciseById = new Map(
  CURRICULUM_PATH.flatMap(({ lessons }) =>
    lessons.flatMap((l) => l.exercises.map((e, i) => [pathExerciseId(l.id, i), e] as const)),
  ),
);
const targetsOf = (itemId: string) =>
  [
    ...new Set(catalog.item_concepts.filter((r) => r.item_id === itemId).map((r) => r.concept_id)),
  ].sort();

describe('catálogo de ítems', () => {
  it('es determinista', () => {
    expect(buildCatalog(CURRICULUM_PATH)).toEqual(catalog);
  });

  it('cubre todos los ejercicios: cada uno tiene exactamente un ítem', () => {
    expect(catalog.placements).toHaveLength(exerciseById.size);
    expect(new Set(catalog.placements.map((p) => p.exercise_id)).size).toBe(exerciseById.size);
    for (const p of catalog.placements) expect(items.has(p.item_id)).toBe(true);
    expect(catalog.items).toHaveLength(4198);
  });

  it('los ejercicios escritos conservan su id como id del ítem', () => {
    for (const p of catalog.placements) {
      if (/-l\d\d-e\d\d$/.test(p.exercise_id)) expect(p.item_id).toBe(p.exercise_id);
    }
  });

  it('las copias de la consolidación son ubicaciones del ítem original (948, §1)', () => {
    const copies = catalog.placements.filter(
      (p) => p.item_id !== p.exercise_id && items.get(p.item_id)!.origin === 'authored',
    );
    expect(copies).toHaveLength(948);
    for (const p of copies) {
      const copy = exerciseById.get(p.exercise_id)!;
      const original = exerciseById.get(p.item_id)!;
      expect([copy.type, copy.payload, copy.answer]).toEqual([
        original.type,
        original.payload,
        original.answer,
      ]);
    }
  });

  it('cada ítem tiene modo, y el par modo–formato es válido (§4.2, §4.4)', () => {
    for (const item of catalog.items) {
      expect(MODE_FORMATS[item.assessment_mode]).toContain(item.response_format);
    }
  });

  it('los conceptos target de cada ubicación son las palabras del ejercicio (exercise_words)', () => {
    for (const p of catalog.placements) {
      expect(targetsOf(p.item_id)).toEqual(
        [...new Set(exerciseById.get(p.exercise_id)!.words)].sort(),
      );
    }
  });

  it('cada concepto target da las filas de §4.3 según el modo', () => {
    const rows = new Map<string, string[]>();
    for (const r of catalog.item_concepts) {
      expect(r.role).toBe('target');
      expect(r.language_code).toBe(items.get(r.item_id)!.language_code);
      const key = `${r.item_id}|${r.concept_id}`;
      rows.set(key, [...(rows.get(key) ?? []), r.dimension]);
    }
    for (const [key, dims] of rows) {
      const item = items.get(key.split('|')[0]!)!;
      expect(dims.sort()).toEqual(targetDimensions(item.assessment_mode).sort());
    }
  });

  it('los ítems generados son tipo × palabra (nivel de la palabra) o match_pairs × conjunto (el más alto)', () => {
    const conceptLevel = new Map(catalog.concepts.map((c) => [c.id, c.level]));
    let sets = 0;
    for (const item of catalog.items.filter((i) => i.origin === 'generated')) {
      const words = targetsOf(item.id);
      if (item.type === 'match_pairs') {
        sets += 1;
        expect(words.length).toBeGreaterThan(1);
        expect(item.id).toBe(generatedSetItemId(item.language_code, item.type, words));
        const levels = words.map((w) => conceptLevel.get(w)!);
        expect(item.level).toBe(levels.includes('A2') ? 'A2' : 'A1');
        continue;
      }
      expect(words).toHaveLength(1);
      expect(item.id).toBe(generatedItemId(item.language_code, item.type, words[0]!));
      expect(item.level).toBe(conceptLevel.get(words[0]!));
    }
    expect(sets).toBe(300);
  });

  it('el estado, la actividad del MCER y los roles no se deducen (§4.3, §5)', () => {
    for (const item of catalog.items) {
      expect(Object.keys(item).sort()).toEqual(
        [
          'assessment_mode',
          'id',
          'input_modality',
          'language_code',
          'level',
          'origin',
          'response_format',
          'response_privacy',
          'type',
        ].sort(),
      );
    }
    expect(new Set(catalog.item_concepts.map((r) => r.role))).toEqual(new Set(['target']));
  });

  it('un concepto léxico por palabra, con el nivel de su unidad', () => {
    const words = CURRICULUM_PATH.flatMap(({ level, unit }) =>
      unit.words.map((w) => ({ id: w.id, level })),
    );
    expect(catalog.concepts.map(({ id, level }) => ({ id, level }))).toEqual(words);
  });
});

describe('clasificación de los tipos actuales (§4.4)', () => {
  const def = (over: Partial<ExerciseDef>): ExerciseDef => ({
    type: 'translate_write',
    skill: 'translation',
    prompt: '',
    payload: { type: 'translate_write', source: '' },
    answer: '',
    words: [],
    ...over,
  });

  it('translate_write: free_recall si la respuesta es una palabra del currículo; si no, producción', () => {
    expect(classifyExercise(def({ answer: 'hello' }), 'en').assessment_mode).toBe('free_recall');
    expect(classifyExercise(def({ answer: 'I am from Argentina.' }), 'en').assessment_mode).toBe(
      'controlled_production',
    );
  });

  it('privacidad: texto escrito → open_text; opciones, fichas y parejas → closed (§13.2)', () => {
    expect(classifyExercise(def({ answer: 'hello' }), 'en').response_privacy).toBe('open_text');
    expect(
      classifyExercise(
        def({ type: 'order_words', payload: { type: 'order_words', tokens: [], translation: '' } }),
        'en',
      ),
    ).toEqual({
      assessment_mode: 'guided_construction',
      response_format: 'tiles',
      input_modality: 'text',
      response_privacy: 'closed',
    });
  });

  it('un modo explícito incompatible con el formato del tipo falla', () => {
    expect(() =>
      classifyExercise(
        def({
          type: 'listen_choice',
          payload: { type: 'listen_choice', audioText: '', options: [] },
          mode: 'controlled_production',
        }),
        'en',
      ),
    ).toThrow(/incompatible/);
    expect(
      classifyExercise(
        def({
          type: 'listen_choice',
          payload: { type: 'listen_choice', audioText: '', options: [] },
          mode: 'listening_comprehension',
        }),
        'en',
      ).assessment_mode,
    ).toBe('listening_comprehension');
  });
});
