/// <reference types="node" />
// Lee content/ids.lock.json y las migraciones generadas: necesita los tipos de Node.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { contentDocument } from '../../scripts/content-document';
import { answerKindFor } from '../../shared/exercises';
import { CURRICULUM_PATH, type PathUnit } from '..';
import { buildCatalog, classifyExercise, generatedSetItemId, responsePrivacyOf } from '../catalog';
import { registryCatalog } from '../comprehension';
import {
  checkIdsLock,
  emptyIdsLock,
  lockEntriesOf,
  parseIdsLock,
  restoreId,
  serializeIdsLock,
  updateIdsLock,
  withdrawId,
  type IdsLock,
} from '../ids-lock';
import { pathExerciseId } from '../path';
import { CONTENT_PERSONAS, personaProblems, type PersonaDef } from '../personas';
import type { ExerciseDef, WordDef } from '../types';

/**
 * Identidad de los ítems (docs/LEARNING_CATALOG_PHASE1.md): match_pairs generados (§1), ids de
 * ejercicios escritos y content/ids.lock.json (§2) y privacidad de la respuesta (§4).
 */

// --- Unidad de prueba (inglés A2, posición 90): una lección escrita y un repaso. ---------------

const W: WordDef[] = ['zebra', 'violin', 'tulip', 'saddle', 'quartz', 'pebble'].map((t, i) => ({
  id: `en-zzfix-${t}`,
  text: `zz${t}`,
  translation: `zzes${i}`,
  exampleEn: '',
  exampleEs: '',
  tags: [],
}));
const wid = (i: number) => W[i]!.id;

const choice = (i: number, over: Partial<ExerciseDef> = {}): ExerciseDef => ({
  type: 'translation_choice',
  skill: 'vocabulary',
  prompt: `¿Qué significa «${W[i]!.text}»?`,
  payload: {
    type: 'translation_choice',
    word: W[i]!.text,
    options: [W[i]!.translation, 'x', 'y', 'z'],
  },
  answer: W[i]!.translation,
  words: [wid(i)],
  ...over,
});
const write = (over: Partial<ExerciseDef> = {}): ExerciseDef => ({
  type: 'translate_write',
  skill: 'translation',
  prompt: 'Escribí en inglés',
  payload: { type: 'translate_write', source: 'Veo zzes0 y zzes1.' },
  answer: 'I see a zzzebra and a zzviolin.',
  words: [wid(0), wid(1)],
  ...over,
});
const pairs = (idx: number[]): ExerciseDef => ({
  type: 'match_pairs',
  skill: 'vocabulary',
  prompt: 'Uní cada palabra con su significado',
  payload: {
    type: 'match_pairs',
    pairs: idx.map((i) => ({ left: W[i]!.text, right: W[i]!.translation })),
  },
  answer: '',
  words: idx.map(wid),
});

function fixture(lesson: ExerciseDef[], review: ExerciseDef[] = []): PathUnit {
  const base = { title: 'Prueba', objective: 'Probar' };
  return {
    language: 'en',
    level: 'A2',
    unit: {
      position: 90,
      title: '',
      titleEn: '',
      description: '',
      emoji: '',
      words: W,
      lessons: [],
    },
    lessons: [
      { ...base, id: 'a2-u90-l01', kind: 'lesson', position: 1, exercises: lesson },
      { ...base, id: 'a2-u90-rev1', kind: 'review', position: 2, exercises: review },
    ],
  };
}

const NEW_A = 'en.ex.a1b2c3d4e5f6g7';
const NEW_B = 'en.ex.zz00yy11xx22ww';
const baseLesson = () => [choice(0), write(), choice(1, { id: NEW_A })];
const cat = (lesson: ExerciseDef[], review: ExerciseDef[] = [], personas?: PersonaDef[]) =>
  buildCatalog([fixture(lesson, review)], personas);
const lockOf = (lesson: ExerciseDef[]) =>
  updateIdsLock(cat(lesson), emptyIdsLock(), { init: true }).lock;
const kinds = (c: ReturnType<typeof cat>, lock: IdsLock) =>
  checkIdsLock(c, lock).map((p) => `${p.kind} ${p.id}`);

// --- §1. match_pairs generados -------------------------------------------------------------------

describe('identidad de los match_pairs generados (§1)', () => {
  const full = buildCatalog(CURRICULUM_PATH);
  const items = new Map(full.items.map((i) => [i.id, i]));
  const exercises = new Map(
    CURRICULUM_PATH.flatMap(({ lessons }) =>
      lessons.flatMap((l) =>
        l.exercises.map((e, i) => [pathExerciseId(l.id, i), { e, kind: l.kind }] as const),
      ),
    ),
  );

  it('los 300 match_pairs generados quedan resueltos, un ítem por ejercicio', () => {
    const generated = full.placements.filter(
      (p) => p.kind === 'generated' && exercises.get(p.exercise_id)!.e.type === 'match_pairs',
    );
    expect(generated).toHaveLength(300);
    expect(new Set(generated.map((p) => p.item_id)).size).toBe(300);
    for (const p of generated) {
      const e = exercises.get(p.exercise_id)!.e;
      expect(p.item_id).toBe(
        generatedSetItemId(items.get(p.item_id)!.language_code, e.type, e.words),
      );
      expect(p.item_id).toMatch(/^[a-z]{2}\.gen\.match_pairs\.set\.[a-z0-9-]+(\+[a-z0-9-]+)+$/);
    }
  });

  it('el id es determinista y no depende de esta versión del generador (valores fijos)', () => {
    expect(generatedSetItemId('en', 'match_pairs', ['en-small', 'en-a', 'en-cup', 'en-big'])).toBe(
      'en.gen.match_pairs.set.en-a+en-big+en-cup+en-small',
    );
    expect(items.has('en.gen.match_pairs.set.en-a+en-big+en-cup+en-small')).toBe(true);
    expect(buildCatalog(CURRICULUM_PATH).placements).toEqual(full.placements);
  });

  it('reordenar las parejas no cambia el id; una ubicación apunta a un solo ítem', () => {
    const c = cat([choice(0)], [pairs([0, 1, 2, 3]), pairs([3, 1, 0, 2])]);
    const ids = c.placements.filter((p) => p.kind === 'generated').map((p) => p.item_id);
    expect(ids).toEqual([
      'en.gen.match_pairs.set.en-zzfix-saddle+en-zzfix-tulip+en-zzfix-violin+en-zzfix-zebra',
      'en.gen.match_pairs.set.en-zzfix-saddle+en-zzfix-tulip+en-zzfix-violin+en-zzfix-zebra',
    ]);
    expect(c.items.filter((i) => i.type === 'match_pairs')).toHaveLength(1);
  });

  it('cambiar una palabra cambia el id', () => {
    const a = generatedSetItemId('en', 'match_pairs', [wid(0), wid(1), wid(2), wid(3)]);
    const b = generatedSetItemId('en', 'match_pairs', [wid(0), wid(1), wid(2), wid(4)]);
    expect(a).not.toBe(b);
  });

  it('dos idiomas nunca comparten identidad', () => {
    expect(() => generatedSetItemId('it', 'match_pairs', [wid(0), wid(1)])).toThrow(/inválida/);
    expect(() => generatedSetItemId('en', 'match_pairs', [wid(0)])).toThrow(/2 o más/);
    expect(() => generatedSetItemId('en', 'match_pairs', ['en-a+b', 'en-c'])).toThrow(/inválida/);
    for (const item of full.items)
      expect(
        item.id.startsWith(`${item.language_code}.`) || /^([a-z]{2}-)?a[12]-u/.test(item.id),
      ).toBe(true);
    const sets = full.items.filter((i) => i.id.includes('.set.'));
    for (const i of sets) expect(i.id.slice(0, 3)).toBe(`${i.language_code}.`);
  });

  it('cada pareja da su concepto target con dimensión vocabulary (§4.4)', () => {
    const c = cat([choice(0)], [pairs([2, 0, 3, 1])]);
    const item = c.items.find((i) => i.type === 'match_pairs')!;
    expect(item).toMatchObject({
      origin: 'generated',
      level: 'A2',
      assessment_mode: 'recognition',
    });
    expect(c.item_concepts.filter((r) => r.item_id === item.id)).toEqual(
      [wid(1), wid(3), wid(2), wid(0)].sort().map((concept_id) => ({
        item_id: item.id,
        concept_id,
        dimension: 'vocabulary',
        role: 'target',
        language_code: 'en',
      })),
    );
  });

  it('las copias siguen apuntando al ítem escrito original, también con id propio', () => {
    const copied = choice(1, { id: NEW_A });
    const c = cat([choice(0), copied], [copied, choice(0)]);
    expect(c.placements).toEqual([
      { exercise_id: 'a2-u90-l01-e01', item_id: 'a2-u90-l01-e01', kind: 'authored' },
      { exercise_id: 'a2-u90-l01-e02', item_id: NEW_A, kind: 'authored' },
      { exercise_id: 'a2-u90-rev1-e01', item_id: NEW_A, kind: 'copy' },
      { exercise_id: 'a2-u90-rev1-e02', item_id: 'a2-u90-l01-e01', kind: 'copy' },
    ]);
    expect(full.placements.filter((p) => p.kind === 'copy')).toHaveLength(948);
  });
});

// --- §2. ExerciseDef.id y content/ids.lock.json --------------------------------------------------

describe('ids de ejercicios escritos (§2)', () => {
  it('los ids históricos (por posición) se conservan', () => {
    const c = cat(baseLesson());
    expect(c.placements.map((p) => p.item_id)).toEqual(['a2-u90-l01-e01', 'a2-u90-l01-e02', NEW_A]);
    const real = buildCatalog(CURRICULUM_PATH);
    for (const p of real.placements.filter((x) => x.kind === 'authored')) {
      expect(p.item_id).toBe(p.exercise_id);
    }
  });

  it('id nuevo válido; marcador, formato inválido u otro idioma fallan', () => {
    expect(cat([choice(0, { id: NEW_A })]).items[0]!.id).toBe(NEW_A);
    expect(() => cat([choice(0, { id: 'en.ex.new' })])).toThrow(/content:ids/);
    expect(() => cat([choice(0, { id: 'en.ex.ABC' })])).toThrow(/inválido/);
    expect(() => cat([choice(0, { id: 'it.ex.a1b2c3d4e5f6g7' })])).toThrow(/no es de en/);
    expect(() => cat([choice(0, { id: 'en.gen.translate_write.en-x' })])).toThrow(/inválido/);
  });

  it('detecta ids duplicados', () => {
    expect(() => cat([choice(0, { id: NEW_A }), choice(1, { id: NEW_A })])).toThrow(/duplicado/);
    // Un id por posición declarado en otro ejercicio choca con el de su ubicación.
    expect(() => cat([choice(0), choice(1, { id: 'a2-u90-l01-e01' })])).toThrow(/duplicado/);
  });

  it('un escrito nuevo sin id propio no se registra (salvo el primer registro)', () => {
    const lock = lockOf(baseLesson());
    const c = cat([...baseLesson(), choice(2)]);
    expect(kinds(c, lock)).toEqual(['legacy_new a2-u90-l01-e04']);
    expect(checkIdsLock(c, lock)[0]!.message).toMatch(/id: 'en\.ex\.new'/);
    expect(() => updateIdsLock(c, lock)).toThrow(/sin id propio/);
    expect(() => updateIdsLock(c, lock, { init: true })).toThrow(/vacío/);
  });

  it('registra un id nuevo válido y es idempotente', () => {
    const lock = lockOf(baseLesson());
    const c = cat([...baseLesson(), choice(2, { id: NEW_B })]);
    expect(kinds(c, lock)).toEqual([`unregistered ${NEW_B}`]);
    const once = updateIdsLock(c, lock);
    expect(once.added).toEqual([NEW_B]);
    const twice = updateIdsLock(c, once.lock);
    expect(twice.added).toEqual([]);
    expect(serializeIdsLock(twice.lock)).toBe(serializeIdsLock(once.lock));
    expect(serializeIdsLock(parseIdsLock(serializeIdsLock(once.lock)))).toBe(
      serializeIdsLock(once.lock),
    );
    expect(checkIdsLock(c, once.lock)).toEqual([]);
    // Sin --init, un registro vacío no acepta ids por posición.
    expect(() => updateIdsLock(cat(baseLesson()), emptyIdsLock())).toThrow(/sin id propio/);
  });

  it('detecta desapariciones; retirar es explícito y el id no se reutiliza', () => {
    const lock = lockOf(baseLesson());
    const without = cat([choice(0), write()]);
    expect(kinds(without, lock)).toEqual([`absent ${NEW_A}`]);
    expect(() => updateIdsLock(without, lock)).toThrow(/desapareció/);
    expect(() => withdrawId(cat(baseLesson()), lock, NEW_A, 'quitado')).toThrow(/sigue/);
    expect(() => withdrawId(without, lock, NEW_A, ' ')).toThrow(/reason/);
    const withdrawn = withdrawId(without, lock, NEW_A, 'quitado de la lección');
    expect(withdrawn.items[NEW_A]).toMatchObject({
      withdrawn: { reason: 'quitado de la lección' },
    });
    expect(checkIdsLock(without, withdrawn)).toEqual([]);
    // Volver a usar el id retirado falla; si la identidad es la misma, se puede reactivar.
    expect(kinds(cat(baseLesson()), withdrawn)).toEqual([`withdrawn_reused ${NEW_A}`]);
    expect(checkIdsLock(cat(baseLesson()), restoreId(cat(baseLesson()), withdrawn, NEW_A))).toEqual(
      [],
    );
    expect(() =>
      restoreId(cat([choice(0), write(), choice(2, { id: NEW_A })]), withdrawn, NEW_A),
    ).toThrow(/otra identidad/);
  });

  it('detecta cambios de tipo y de modo bajo el mismo id', () => {
    const lock = lockOf(baseLesson());
    const typed = cat([
      choice(0, {
        type: 'listen_choice',
        payload: { type: 'listen_choice', audioText: 'zzzebra', options: ['a', 'b', 'c', 'd'] },
      }),
      write(),
      choice(1, { id: NEW_A }),
    ]);
    const [type] = checkIdsLock(typed, lock);
    expect(type).toMatchObject({ kind: 'identity_change', id: 'a2-u90-l01-e01' });
    expect(type!.message).toMatch(/type: translation_choice → listen_choice/);
    expect(type!.message).toMatch(/id: 'en\.ex\.new'/);
    const mode = checkIdsLock(
      cat([choice(0), write({ mode: 'free_production' }), choice(1, { id: NEW_A })]),
      lock,
    );
    expect(mode.map((p) => p.kind)).toEqual(['identity_change']);
    expect(mode[0]!.message).toMatch(/mode: controlled_production → free_production/);
    // La respuesta pasa de frase a palabra del currículo: translate_write pasa a free_recall.
    const recall = checkIdsLock(
      cat([choice(0), write({ answer: 'zzzebra' }), choice(1, { id: NEW_A })]),
      lock,
    );
    expect(recall[0]!.message).toMatch(/mode: controlled_production → free_recall/);
    expect(() => updateIdsLock(typed, lock)).toThrow(/cambió de identidad/);
  });

  it('detecta cambios de conceptos target y de privacidad', () => {
    const lock = lockOf(baseLesson());
    const targets = checkIdsLock(
      cat([choice(0), write({ words: [wid(0), wid(2)] }), choice(1, { id: NEW_A })]),
      lock,
    );
    expect(targets.map((p) => `${p.kind} ${p.id}`)).toEqual(['identity_change a2-u90-l01-e02']);
    expect(targets[0]!.message).toMatch(
      /targets: \[en-zzfix-violin, en-zzfix-zebra\] → \[en-zzfix-tulip, en-zzfix-zebra\]/,
    );
    const personas = [PERSONA];
    const fictional = checkIdsLock(
      cat(
        [choice(0), write({ personalData: { persona: PERSONA.id } }), choice(1, { id: NEW_A })],
        [],
        personas,
      ),
      lock,
    );
    expect(fictional[0]!.message).toMatch(/privacy: open_text → fictional/);
  });

  it('un cambio de identidad con id nuevo deja el id viejo retirado, sin borrarlo', () => {
    const lock = lockOf(baseLesson());
    const c = cat([
      choice(0),
      write({ id: NEW_B, words: [wid(0), wid(2)] }),
      choice(1, { id: NEW_A }),
    ]);
    expect(kinds(c, lock)).toEqual(['replaced a2-u90-l01-e02', `unregistered ${NEW_B}`]);
    const { lock: next, added, replaced } = updateIdsLock(c, lock);
    expect([added, replaced]).toEqual([[NEW_B], ['a2-u90-l01-e02']]);
    expect(next.items['a2-u90-l01-e02']).toEqual({
      ...lock.items['a2-u90-l01-e02'],
      withdrawn: { reason: 'replaced', replacedBy: NEW_B },
    });
    expect(checkIdsLock(c, next)).toEqual([]);
  });

  it('redacción, opciones y respuesta sin cambio de modo no crean ítem (será una versión nueva)', () => {
    const lock = lockOf(baseLesson());
    const reworded = cat([
      choice(0, {
        prompt: 'Elegí la traducción',
        payload: { type: 'translation_choice', word: 'zzzebra', options: ['zzes0', 'q', 'r', 's'] },
        explanation: 'nueva',
      }),
      write({ answer: 'I can see a zzzebra and a zzviolin.', acceptedAnswers: ['x y z'] }),
      choice(1, { id: NEW_A, difficulty: 3 }),
    ]);
    expect(checkIdsLock(reworded, lock)).toEqual([]);
    expect(reworded.items.map((i) => i.id)).toEqual(cat(baseLesson()).items.map((i) => i.id));
  });

  // El registro cubre el currículo y las lecciones «En contexto» de la fase C (content/comprehension.ts).
  it('el registro guarda la ubicación actual de cada escrito (ninguno se movió todavía)', () => {
    const lock = parseIdsLock(readFileSync(join(__dirname, '..', 'ids.lock.json'), 'utf8'));
    const current = lockEntriesOf(registryCatalog());
    for (const [id, entry] of Object.entries(lock.items)) {
      if (entry.withdrawn) continue; // retirado: ya no está en el contenido (siguiente prueba)
      expect(entry.exercise).toBe(current.get(id)!.exercise);
    }
  });

  it('el currículo actual respeta content/ids.lock.json, que registra todos sus ítems', () => {
    const lock = parseIdsLock(readFileSync(join(__dirname, '..', 'ids.lock.json'), 'utf8'));
    const catalog = registryCatalog();
    expect(checkIdsLock(catalog, lock)).toEqual([]);
    const entries = Object.entries(lock.items);
    // Vigentes = contenido actual, exactamente.
    expect(
      entries
        .filter(([, e]) => !e.withdrawn)
        .map(([id]) => id)
        .sort(),
    ).toEqual([...lockEntriesOf(catalog).keys()].sort());
    // Retirados: los 10 reemplazos de la fase C.1 (docs/LEARNING_PHASE_C.md §C1.4), todos ítems
    // «En contexto» sin publicar, y los 6 de inglés A2 U13–U17 (docs/A2_EN_COMPLETION.md §3: dejaron
    // de enlazar palabras de A1 sin publicar), nunca aplicados. Todos con su reemplazo vigente y fuera
    // del contenido.
    const all = entries.filter(([, e]) => e.withdrawn);
    // Español: conversión del voseo al español neutro (docs/ES_NEUTRAL_GUIDE.md, 2026-11-21), nunca
    // cargado en producción. 145 escritos reemplazados (sus palabras cambiaron) y 93 generados
    // retirados porque la palabra dejó de existir (sin reemplazo).
    const es = all.filter(([, e]) => e.language === 'es');
    const esReplaced = es.filter(([, e]) => e.withdrawn!.reason === 'replaced');
    const esRemoved = es.filter(([, e]) => e.withdrawn!.reason !== 'replaced');
    expect([esReplaced.length, esRemoved.length]).toEqual([145, 93]);
    for (const [id, e] of esRemoved) {
      expect(e.origin).toBe('generated');
      expect(e.withdrawn!.reason).toMatch(/español neutro/);
      expect(lockEntriesOf(catalog).has(id)).toBe(false);
    }
    const withdrawn = [...all.filter(([, e]) => e.language !== 'es'), ...esReplaced];
    expect(all.length - es.length).toBe(16);
    const a2 = withdrawn.filter(([, e]) => /^a2-u1[3-7]-/.test(e.exercise ?? ''));
    expect(a2).toHaveLength(6);
    for (const [id, e] of withdrawn) {
      if (e.language === 'es') {
        const by = e.withdrawn!.replacedBy!;
        expect(lockEntriesOf(catalog).has(id)).toBe(false);
        expect(lockEntriesOf(catalog).has(by)).toBe(true);
        continue;
      }
      if (!a2.some(([x]) => x === id)) expect(e.type).toBe('context_choice');
      expect(lockEntriesOf(catalog).has(id)).toBe(false);
      const by = e.withdrawn!.replacedBy!;
      expect(lock.items[by]?.withdrawn).toBeUndefined();
      expect(lockEntriesOf(catalog).has(by)).toBe(true);
    }
  });
});

// --- §2. Escritos que se mueven: la ubicación del registro sigue al ejercicio ---------------------

describe('escritos que se mueven de lección o de posición (§2)', () => {
  /** Dos lecciones escritas de la unidad de prueba. */
  const two = (l1: ExerciseDef[], l2: ExerciseDef[]) => {
    const f = fixture(l1);
    const lesson = f.lessons[0]!;
    return buildCatalog([
      { ...f, lessons: [lesson, { ...lesson, id: 'a2-u90-l02', position: 2, exercises: l2 }] },
    ]);
  };
  const start = () => two([choice(0), write(), choice(1, { id: NEW_A })], [choice(2)]);
  const lock0 = () => updateIdsLock(start(), emptyIdsLock(), { init: true }).lock;
  /** NEW_A pasa de a2-u90-l01-e03 a a2-u90-l02-e02. */
  const movedA = () => two([choice(0), write()], [choice(2), choice(1, { id: NEW_A })]);

  /** Append-only: no desaparece ninguna entrada y las que no cambian quedan iguales. */
  const expectAppendOnly = (prev: IdsLock, next: IdsLock, changed: string[]) => {
    for (const [id, entry] of Object.entries(prev.items)) {
      expect(next.items[id]).toBeDefined();
      if (!changed.includes(id)) expect(next.items[id]).toEqual(entry);
    }
  };

  it('moverse conserva el id y la identidad; content:ids sólo actualiza la ubicación', () => {
    const before = lock0();
    expect(before.items[NEW_A]!.exercise).toBe('a2-u90-l01-e03');
    const c = movedA();
    expect(kinds(c, before)).toEqual([`moved ${NEW_A}`]);
    expect(checkIdsLock(c, before)[0]!.message).toMatch(
      /se movió de a2-u90-l01-e03 a a2-u90-l02-e02/,
    );
    const { lock: next, added, replaced, moved } = updateIdsLock(c, before);
    expect([added, replaced, moved]).toEqual([[], [], [NEW_A]]);
    expect(next.items[NEW_A]).toEqual({ ...before.items[NEW_A], exercise: 'a2-u90-l02-e02' });
    expectAppendOnly(before, next, [NEW_A]);
    expect(Object.values(next.items).filter((e) => e.withdrawn)).toEqual([]);
    expect(checkIdsLock(c, next)).toEqual([]);
    // Idempotente.
    const again = updateIdsLock(c, next);
    expect([again.added, again.replaced, again.moved]).toEqual([[], [], []]);
    expect(serializeIdsLock(again.lock)).toBe(serializeIdsLock(next));
  });

  it('un intercambio de posiciones con ids por posición actualiza las tres ubicaciones', () => {
    const before = lock0();
    const c = two(
      [write({ id: 'a2-u90-l01-e02' }), choice(1, { id: NEW_A })],
      [choice(2), choice(0, { id: 'a2-u90-l01-e01' })],
    );
    expect(kinds(c, before)).toEqual([
      'moved a2-u90-l01-e01',
      'moved a2-u90-l01-e02',
      `moved ${NEW_A}`,
    ]);
    const { lock: next, moved } = updateIdsLock(c, before);
    expect(moved).toEqual(['a2-u90-l01-e01', 'a2-u90-l01-e02', NEW_A]);
    expect(
      Object.fromEntries(Object.entries(next.items).map(([id, e]) => [id, e.exercise])),
    ).toEqual({
      'a2-u90-l01-e01': 'a2-u90-l02-e02',
      'a2-u90-l01-e02': 'a2-u90-l01-e01',
      'a2-u90-l02-e01': 'a2-u90-l02-e01',
      [NEW_A]: 'a2-u90-l01-e02',
    });
    expectAppendOnly(before, next, ['a2-u90-l01-e01', 'a2-u90-l01-e02', NEW_A]);
    expect(checkIdsLock(c, next)).toEqual([]);
  });

  it('un reemplazo después de moverse se detecta en la ubicación nueva', () => {
    const synced = updateIdsLock(movedA(), lock0()).lock;
    // En a2-u90-l02-e02 (donde quedó NEW_A) hay un ítem nuevo con otros conceptos target.
    const c = two([choice(0), write()], [choice(2), choice(3, { id: NEW_B })]);
    expect(kinds(c, synced)).toEqual([`replaced ${NEW_A}`, `unregistered ${NEW_B}`]);
    const { lock: next, added, replaced } = updateIdsLock(c, synced);
    expect([added, replaced]).toEqual([[NEW_B], [NEW_A]]);
    expect(next.items[NEW_A]).toEqual({
      ...synced.items[NEW_A],
      withdrawn: { reason: 'replaced', replacedBy: NEW_B },
    });
    expect(next.items[NEW_B]!.exercise).toBe('a2-u90-l02-e02');
    expectAppendOnly(synced, next, [NEW_A]);
    expect(checkIdsLock(c, next)).toEqual([]);
    // Con la ubicación vieja (sin sincronizar) el reemplazo no se reconocía: parecía una desaparición.
    expect(kinds(c, lock0())).toEqual([`absent ${NEW_A}`, `unregistered ${NEW_B}`]);
  });

  it('desaparecer después de moverse no se confunde con un ítem nuevo en la ubicación vieja', () => {
    const synced = updateIdsLock(movedA(), lock0()).lock;
    // NEW_A se quita; en su ubicación vieja (a2-u90-l01-e03) aparece un ítem nuevo sin relación.
    const c = two([choice(0), write(), choice(3, { id: NEW_B })], [choice(2)]);
    expect(kinds(c, synced)).toEqual([`absent ${NEW_A}`, `unregistered ${NEW_B}`]);
    expect(() => updateIdsLock(c, synced)).toThrow(/desapareció/);
    // Con la ubicación vieja, NEW_A se habría retirado como reemplazado por NEW_B sin serlo.
    expect(kinds(c, lock0())).toEqual([`replaced ${NEW_A}`, `unregistered ${NEW_B}`]);
    // Retirar sigue siendo explícito; después se registra NEW_B y NEW_A no tiene sucesor.
    const withdrawn = withdrawId(c, synced, NEW_A, 'quitado');
    const { lock: next, added, replaced } = updateIdsLock(c, withdrawn);
    expect([added, replaced]).toEqual([[NEW_B], []]);
    expect(next.items[NEW_A]).toEqual({ ...synced.items[NEW_A], withdrawn: { reason: 'quitado' } });
    expect(checkIdsLock(c, next)).toEqual([]);
  });

  it('un cambio de identidad no se informa como movimiento', () => {
    const before = lock0();
    const c = two([choice(0), write()], [choice(2), choice(1, { id: NEW_A, words: [wid(3)] })]);
    expect(kinds(c, before)).toEqual([`identity_change ${NEW_A}`]);
    expect(() => updateIdsLock(c, before)).toThrow(/cambió de identidad/);
  });
});

// --- §4. Privacidad -----------------------------------------------------------------------------

const PERSONA: PersonaDef = {
  id: 'en.persona.zz-test',
  language: 'en',
  displayName: 'Zz Test',
  age: 30,
  city: 'Testville',
  country: 'Testland',
  phone: '000-0000',
  email: 'zz@example.com',
};

describe('privacidad de la respuesta (§13.2)', () => {
  const short = (over: Partial<ExerciseDef> = {}): ExerciseDef => ({
    type: 'short_answer',
    skill: 'translation',
    prompt: 'Respondé',
    payload: { type: 'short_answer', question: 'What is her name?', translation: '' },
    answer: 'Her name is Zz.',
    words: [],
    ...over,
  });

  it('closed: opciones, fichas y parejas, aunque citen una persona', () => {
    expect(responsePrivacyOf(choice(0), 'en')).toBe('closed');
    expect(responsePrivacyOf(pairs([0, 1]), 'en')).toBe('closed');
    expect(responsePrivacyOf({ type: 'order_words' }, 'en')).toBe('closed');
    expect(
      responsePrivacyOf(choice(0, { personalData: { persona: PERSONA.id } }), 'en', [PERSONA]),
    ).toBe('closed');
  });

  it('open_text: texto libre con respuesta esperada, aunque mencione un nombre propio', () => {
    expect(responsePrivacyOf(write({ answer: 'My name is Ana.' }), 'en')).toBe('open_text');
    expect(responsePrivacyOf(short(), 'en')).toBe('open_text');
    expect(responsePrivacyOf({ type: 'complete_word' }, 'en')).toBe('open_text');
  });

  it('fictional: texto libre sobre una persona del catálogo del mismo idioma', () => {
    const e = short({ personalData: { persona: PERSONA.id } });
    expect(responsePrivacyOf(e, 'en', [PERSONA])).toBe('fictional');
    expect(classifyExercise(e, 'en', new Set(), [PERSONA]).response_privacy).toBe('fictional');
    expect(() => responsePrivacyOf(e, 'en')).toThrow(/inexistente/);
    expect(() => responsePrivacyOf(e, 'it', [PERSONA])).toThrow(/no de it/);
  });

  it('self_disclosure (datos del propio usuario) se rechaza mientras P4 siga pendiente', () => {
    expect(() => responsePrivacyOf(short({ personalData: 'learner' }), 'en')).toThrow(/P4/);
    expect(() => responsePrivacyOf(choice(0, { personalData: 'learner' }), 'en')).toThrow(/P4/);
    expect(() => cat([short({ personalData: 'learner' })])).toThrow(/self_disclosure/);
  });

  it('personas: datos ficticios con correo @example.com', () => {
    expect(personaProblems(PERSONA)).toEqual([]);
    expect(personaProblems({ ...PERSONA, email: 'a@gmail.com', id: 'it.persona.x' })).toHaveLength(
      2,
    );
    for (const p of CONTENT_PERSONAS) expect(personaProblems(p)).toEqual([]);
  });

  it('el contenido actual: closed si no hay texto libre, open_text si lo hay; ningún fictional', () => {
    // La única persona es la de U13 «En contexto» (fase C.2), citada sólo por preguntas de opción.
    expect(CONTENT_PERSONAS.map((p) => p.id)).toEqual(['en.persona.sofia-ruiz']);
    const all = CURRICULUM_PATH.flatMap((p) => p.lessons.flatMap((l) => l.exercises));
    expect(all.filter((e) => e.personalData !== undefined)).toEqual([]);
    const byType = new Map(buildCatalog(CURRICULUM_PATH).items.map((i) => [i.id, i]));
    for (const item of byType.values()) {
      expect(item.response_privacy).toBe(
        answerKindFor(item.type) === 'text' ? 'open_text' : 'closed',
      );
    }
  });

  it('el backfill, content:sql y content:diff usan la misma clasificación', () => {
    const catalog = buildCatalog(CURRICULUM_PATH);
    // content:sql y content:diff toman el catálogo de contentDocument.
    expect(contentDocument(CURRICULUM_PATH).catalog).toEqual(catalog);
    // Las migraciones de catálogo escritas tienen exactamente esas filas.
    const dir = join(__dirname, '..', '..', 'supabase', 'migrations');
    const files = readdirSync(dir).filter((f) => /_learning_items_[a-z_]+\.sql$/.test(f));
    expect(files).toHaveLength(5);
    const written = files.flatMap((f) => {
      const sql = readFileSync(join(dir, f), 'utf8');
      const json = /\$content\$([\s\S]*?)\$content\$/.exec(sql)![1]!;
      return (JSON.parse(json) as { catalog: { items: typeof catalog.items } }).catalog.items;
    });
    const byId = (rows: typeof catalog.items) => [...rows].sort((a, b) => (a.id < b.id ? -1 : 1));
    expect(byId(written)).toEqual(byId(catalog.items));
  });
});
