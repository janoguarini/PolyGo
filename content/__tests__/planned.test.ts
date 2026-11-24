import { checkAnswer } from '@shared/answers';
import type { Exercise, UserAnswer } from '@shared/exercises';

import { ALL_WORDS, COURSES, CURRICULUM_PATH } from '..';
import { tokensOf } from '../builders';
import { buildCatalog, objectiveScopeOf } from '../catalog';
import {
  COMPREHENSION_OBJECTIVES,
  COMPREHENSION_PATH,
  ITEM_REGISTRY_PATH,
  lemmaCandidates,
  registryCatalog,
  stimulusText,
  taughtTokens,
  tokensOfText,
} from '../comprehension';
import { EN_A1_PLANNED_CONTEXT_LESSONS, EN_A1_PLANNED_UNITS } from '../en/a1/context-planned';
import { EN_A1_U13 } from '../en/a1/unit13-letters-personal-details';
import { EN_A1_U14 } from '../en/a1/unit14-prices-shopping';
import { AUTHORED_ID, checkIdsLock, parseIdsLock } from '../ids-lock';
import { objectiveProblems } from '../objectives';
import { pathExerciseId } from '../path';
import { PLANNED_PATH, PLANNED_WRITTEN } from '../planned';
import { A2_EXPANSION_PATH } from '../a2-expansion';
import { B1_PATH } from '../b1';
import { B2_PATH } from '../b2';
import { IT_PATH } from '../it-course';
import { ES_PATH } from '../es-course';
import { FR_PATH } from '../fr-course';
import { ZH_PATH } from '../zh-course';
import { PT_PATH } from '../pt-course';
import { SUPPLEMENT_PATH } from '../supplement';
import { plannedProblems, plannedUnitProblems } from '../planned-checks';
import { PLANNED_OBJECTIVE_LINKS, PLANNED_OBJECTIVES } from '../planned-objectives';
import type { ExerciseDef, PlannedWrittenUnitDef } from '../types';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Fase C.3 (docs/LEARNING_PHASE_C.md §C3): lecciones escritas L1–L5 de U13 y U14 de inglés A1. */

const META = (position: number) => EN_A1_PLANNED_UNITS.find((u) => u.position === position)!;
const exercises = PLANNED_PATH.flatMap(({ lessons }) =>
  lessons.flatMap((l) =>
    l.exercises.map((def, i) => ({ def, id: pathExerciseId(l.id, i), lesson: l })),
  ),
);

function toExercise(def: ExerciseDef, id: string): Exercise {
  return {
    id,
    lessonId: null,
    position: 1,
    type: def.type,
    skill: def.skill,
    prompt: def.prompt,
    payload: def.payload,
    answer: def.answer,
    acceptedAnswers: def.acceptedAnswers ?? [],
    explanation: def.explanation ?? null,
    difficulty: def.difficulty ?? 1,
    recommendedSeconds: def.recommendedSeconds ?? 20,
    wordIds: def.words,
  };
}

function canonical(def: ExerciseDef, text: string): UserAnswer {
  switch (def.payload.type) {
    case 'order_words':
      return { kind: 'tokens', value: tokensOf(text) };
    case 'match_pairs':
      return { kind: 'pairs', value: def.payload.pairs };
    case 'translate_write':
    case 'complete_word':
    case 'short_answer':
      return { kind: 'text', value: text };
    default:
      return { kind: 'option', value: text };
  }
}

/** Copia de una unidad con un cambio en un ejercicio, para los casos negativos del validador. */
function withExercise(
  def: PlannedWrittenUnitDef,
  lesson: number,
  index: number,
  change: (e: ExerciseDef) => ExerciseDef,
): PlannedWrittenUnitDef {
  return {
    ...def,
    unit: {
      ...def.unit,
      lessons: def.unit.lessons.map((l, li) =>
        li !== lesson
          ? l
          : { ...l, exercises: l.exercises.map((e, ei) => (ei === index ? change(e) : e)) },
      ),
    },
  };
}

describe('fase C.3: estructura', () => {
  it('el contenido cumple todas las reglas de las unidades planificadas', () => {
    expect(plannedProblems()).toEqual([]);
  });

  it('U13 y U14: 5 lecciones escritas con los títulos del mapa y el camino de 10 posiciones', () => {
    expect(PLANNED_PATH.map((p) => p.unit.position)).toEqual([13, 14]);
    for (const p of PLANNED_PATH) {
      const key = `a1-u${p.unit.position}`;
      expect(p.lessons.map((l) => [l.position, l.id, l.kind])).toEqual([
        [1, `${key}-l01`, 'lesson'],
        [2, `${key}-l02`, 'lesson'],
        [3, `${key}-rev1`, 'review'],
        [4, `${key}-l03`, 'lesson'],
        [5, `${key}-l04`, 'lesson'],
        [6, `${key}-rev2`, 'review'],
        [7, `${key}-l05`, 'lesson'],
        [8, `${key}-listen`, 'listening'],
        [9, `${key}-words`, 'words'],
        [10, `${key}-final`, 'final'],
      ]);
      expect(p.lessons.length).toBe(META(p.unit.position).reservedPositions);
      expect(p.unit.lessons.map((l) => `${l.title}`)).toEqual(
        META(p.unit.position).plannedLessons.map((x) => /^U\d+ L\d (.+) \(/.exec(x)![1]),
      );
    }
    expect(EN_A1_U13.unit.lessons.map((l) => l.title)).toEqual([
      'El alfabeto',
      'Deletrear',
      'Nacionalidades',
      'Teléfono, email y dirección',
      'Completar un formulario',
    ]);
    expect(EN_A1_U14.unit.lessons.map((l) => l.title)).toEqual([
      'Del 21 al 100',
      'Precios y dinero',
      'How much, how many',
      'Una taza de, una botella de',
      'En la tienda',
    ]);
  });

  it('la «En contexto» va después del camino escrito (posición 11) y no cambió', () => {
    for (const unit of [13, 14]) {
      const context = COMPREHENSION_PATH.find((p) => p.unit.position === unit)!.lessons[0]!;
      expect(context.position).toBe(11);
      expect(context.exercises).toBe(
        EN_A1_PLANNED_CONTEXT_LESSONS.find((l) => l.unit === unit)!.exercises,
      );
    }
  });

  it('fuera de COURSES y de CURRICULUM_PATH: las unidades cargadas no cambian', () => {
    expect(COURSES[0]!.levels[0]!.units.map((u) => u.position)).toEqual(
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
    expect(
      CURRICULUM_PATH.some((p) => p.language === 'en' && p.unit.position > 12 && p.level === 'A1'),
    ).toBe(false);
    const ids = new Set(ALL_WORDS.map((w) => w.id));
    for (const p of PLANNED_PATH)
      for (const w of p.unit.words) expect([w.id, ids.has(w.id)]).toEqual([w.id, false]);
    expect(ITEM_REGISTRY_PATH).toHaveLength(
      CURRICULUM_PATH.length +
        COMPREHENSION_PATH.length +
        PLANNED_PATH.length +
        // Cierre de inglés A1 (docs/A1_EN_CLOSURE.md): agregados a unidades cargadas.
        SUPPLEMENT_PATH.length +
        // Inglés A2 completo (docs/A2_EN_COMPLETION.md): unidades nuevas U13–U17.
        A2_EXPANSION_PATH.length +
        // Inglés B1 (docs/B1_EN.md): 12 unidades nuevas.
        B1_PATH.length +
        // Inglés B2 (docs/B2_EN.md): 12 unidades nuevas.
        B2_PATH.length +
        // Portugués de Brasil A1 U13–U16 y A2 U1–U12 (docs/PT_A1_A2.md).
        PT_PATH.length +
        // Italiano A1 U13–U16 y A2 U1–U12 (docs/IT_A1_A2.md).
        IT_PATH.length +
        // Chino A1 U13–U16 y A2 U1–U12 (docs/ZH_A1_A2.md).
        ZH_PATH.length +
        // Francés A1 y A2 (docs/FR_A1_A2.md).
        FR_PATH.length +
        // Español A1 y A2 (docs/ES_A1_A2.md).
        ES_PATH.length,
    );
  });

  it('cada unidad tiene 15–22 palabras nuevas y reutiliza las que el mapa adelanta, sin duplicarlas', () => {
    expect(EN_A1_U13.unit.words).toHaveLength(16);
    expect(EN_A1_U14.unit.words).toHaveLength(18);
    expect(EN_A1_U13.borrowed).toEqual([
      'en-what',
      'en-spanish',
      'en-english',
      'en-email',
      'en-city',
    ]);
    expect(EN_A1_U14.borrowed).toEqual([
      'en-price',
      'en-money',
      'en-cheap',
      'en-expensive',
      'en-how-much',
      'en-how-many',
    ]);
    // Ninguna palabra (nueva o del currículo) coincide con la traducción de otra.
    const plain = (s: string) =>
      s
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/\(.*?\)/g, '')
        .trim()
        .toLowerCase();
    const all = [
      ...ALL_WORDS.filter((w) => w.id.startsWith('en-')),
      ...PLANNED_PATH.flatMap((p) => p.unit.words),
    ];
    const clashes = all.flatMap((a) =>
      all
        .filter((b) => b.id !== a.id && plain(a.text) === plain(b.translation))
        .map((b) => `${a.id} ↔ ${b.id}`),
    );
    expect(clashes).toEqual([]);
  });

  it('los objetivos del mapa de cada lección quedan documentados', () => {
    expect(EN_A1_U13.curriculum.map((c) => c.primary)).toEqual([
      ['v02'],
      ['v02'],
      ['v02'],
      ['v02', 'v03'],
      ['p01'],
    ]);
    expect(EN_A1_U14.curriculum.map((c) => c.primary)).toEqual([
      ['v03'],
      ['v03'],
      ['g16', 'v03'],
      ['g23', 'v07'],
      ['p10'],
    ]);
  });
});

describe('fase C.3: secuencia y límite de vocabulario', () => {
  it('U13 se mide hasta U3 y U14 hasta U7', () => {
    expect(META(13).after).toBe(3);
    expect(META(14).after).toBe(7);
  });

  it('rechaza vocabulario que la unidad todavía no enseñó (U13 no puede usar «room» de U6)', () => {
    const bad = withExercise(EN_A1_U13, 0, 0, (e) => ({
      ...e,
      payload: {
        type: 'translation_choice',
        word: 'room',
        options: ['habitación', 'casa', 'puerta'],
      },
    }));
    expect(plannedUnitProblems('en', 'A1', META(13), bad)).toEqual([
      expect.stringMatching(/U13 L1 .* e1: vocabulario no enseñado todavía: room/),
    ]);
  });

  it('rechaza usar en una lección una palabra que la unidad introduce en una lección posterior', () => {
    // «surname» se introduce en L5: L1 no puede mostrarla.
    const bad = withExercise(EN_A1_U13, 0, 0, (e) => ({
      ...e,
      payload: {
        type: 'translation_choice',
        word: 'surname',
        options: ['apellido', 'edad', 'ciudad'],
      },
    }));
    expect(plannedUnitProblems('en', 'A1', META(13), bad)).toEqual([
      expect.stringMatching(/U13 L1 .* e1: vocabulario no enseñado todavía: surname/),
    ]);
    // «dollars» es de L2: L1 no puede hacerlo escuchar.
    const late = withExercise(EN_A1_U14, 0, 1, (e) => ({
      ...e,
      answer: 'forty dollars',
      payload: {
        type: 'listen_choice',
        audioText: 'forty dollars',
        options: ['forty dollars', 'four dollars', 'fifty dollars'],
      },
    }));
    expect(plannedUnitProblems('en', 'A1', META(14), late)).toEqual([
      expect.stringMatching(/U14 L1 .* e2: vocabulario no enseñado todavía: dollars/),
    ]);
  });

  it('una palabra de una unidad posterior sólo vale si se declara reutilizada', () => {
    const bad = { ...EN_A1_U14, borrowed: EN_A1_U14.borrowed.filter((b) => b !== 'en-how-many') };
    expect(plannedUnitProblems('en', 'A1', META(14), bad)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/evalúa en-how-many, que no se enseñó hasta U7/),
      ]),
    );
    const taught = { ...EN_A1_U13, borrowed: [...EN_A1_U13.borrowed, 'en-mexico'] };
    expect(plannedUnitProblems('en', 'A1', META(13), taught)).toEqual(
      expect.arrayContaining([expect.stringMatching(/en-mexico ya está enseñada hasta U3/)]),
    );
  });

  it('una palabra que ya existe no se duplica', () => {
    const dup = {
      ...EN_A1_U14,
      unit: {
        ...EN_A1_U14.unit,
        words: [
          ...EN_A1_U14.unit.words,
          { ...EN_A1_U14.unit.words[0]!, id: 'en-prices', text: 'price' },
        ],
      },
    };
    expect(plannedUnitProblems('en', 'A1', META(14), dup)).toEqual(
      expect.arrayContaining([expect.stringMatching(/«price» ya es la palabra en-price/)]),
    );
  });

  it('privacidad: un dato de contacto ajeno a la persona o sin citarla se rechaza', () => {
    const uncited = withExercise(EN_A1_U13, 3, 3, (e) => ({ ...e, personalData: undefined }));
    expect(plannedUnitProblems('en', 'A1', META(13), uncited)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/dato de contacto 555-0142 que no es de la persona citada/),
      ]),
    );
    const other = withExercise(EN_A1_U13, 3, 3, (e) => ({ ...e, answer: '555-0199' }));
    expect(plannedUnitProblems('en', 'A1', META(13), other)).toEqual(
      expect.arrayContaining([expect.stringMatching(/dato de contacto 555-0199/)]),
    );
    const learner = withExercise(EN_A1_U13, 4, 7, (e) => ({ ...e, personalData: 'learner' }));
    expect(plannedUnitProblems('en', 'A1', META(13), learner)).toEqual(
      expect.arrayContaining([expect.stringMatching(/pide datos del alumno \(P4\)/)]),
    );
  });

  it('lo que la «En contexto» marcaba como no enseñado queda casi todo enseñado por L1–L5', () => {
    const remaining = (unit: number) => {
      const def = EN_A1_PLANNED_CONTEXT_LESSONS.find((l) => l.unit === unit)!;
      const written = PLANNED_WRITTEN[0]!.units.find((u) => u.unit.position === unit)!;
      const forms = new Set([
        ...taughtTokens('en', 'A1', META(unit).after),
        ...[
          ...written.unit.words,
          ...ALL_WORDS.filter((w) => written.borrowed.includes(w.id)),
        ].flatMap((w) => [w.text, ...(w.acceptedTexts ?? [])].flatMap(tokensOfText)),
      ]);
      const seen = new Set(
        def.exercises.flatMap((e) =>
          e.payload.type === 'context_choice' ? tokensOfText(stimulusText(e.payload.stimulus)) : [],
        ),
      );
      return def.untaught.filter(
        (t) => seen.has(t) && !lemmaCandidates(t).some((c) => forms.has(c)),
      );
    };
    // Lo que queda es vocabulario del hotel y de la tienda que el mapa no pone en L1–L5.
    expect(remaining(13)).toEqual(['here', 'hotel', 'key', 'ok', 'registration', 'room', 'write']);
    expect(remaining(14)).toEqual(['can', 'help', 'ok', 'supermarket', 'today']);
  });
});

describe('fase C.3: estándar e integridad de cada ejercicio', () => {
  it('cada lección escrita: introducción, cierre, escucha y recuperación activa al final', () => {
    for (const { unit } of PLANNED_WRITTEN[0]!.units)
      for (const l of unit.lessons) {
        expect(l.intro!.examples.length).toBeGreaterThanOrEqual(2);
        expect(l.takeaways!.length).toBeGreaterThanOrEqual(2);
        expect(l.exercises.some((e) => e.skill === 'listening')).toBe(true);
        expect(
          l.exercises.slice(-2).map((e) => ['translate_write', 'short_answer'].includes(e.type)),
        ).toEqual([true, true]);
        expect(l.exercises.length).toBe(10);
        for (const e of l.exercises) expect(e.id).toMatch(AUTHORED_ID);
      }
  });

  it.each(exercises.map((e) => [e.id, e] as const))('%s', (_id, { def, id }) => {
    expect(def.payload.type).toBe(def.type);
    expect(def.words.length).toBeGreaterThan(0);
    const p = def.payload;
    switch (p.type) {
      case 'image_choice':
      case 'translation_choice':
      case 'fill_blank':
      case 'listen_choice':
        expect(p.options).toContain(def.answer);
        expect(new Set(p.options).size).toBe(p.options.length);
        expect(p.options.length).toBeGreaterThanOrEqual(3);
        if (p.type === 'fill_blank') expect(p.sentence.split('___').length).toBe(2);
        break;
      case 'order_words':
        expect(p.tokens).toEqual(tokensOf(def.answer));
        expect(p.tokens.length).toBeGreaterThanOrEqual(3);
        break;
      case 'complete_word':
        expect(p.masked.length).toBe(def.answer.length);
        expect(p.masked).toContain('_');
        [...p.masked].forEach((ch, i) => {
          if (ch !== '_') expect(ch).toBe(def.answer[i]);
        });
        break;
      case 'match_pairs':
        expect(p.pairs.length).toBeGreaterThanOrEqual(3);
        expect(new Set(p.pairs.map((x) => x.left)).size).toBe(p.pairs.length);
        expect(new Set(p.pairs.map((x) => x.right)).size).toBe(p.pairs.length);
        break;
      default:
        expect(def.answer.trim()).not.toBe('');
    }
    const exercise = toExercise(def, id);
    expect(checkAnswer(exercise, canonical(def, def.answer))).toMatchObject({
      correct: true,
      typo: false,
    });
    for (const accepted of def.acceptedAnswers ?? []) {
      if (p.type === 'order_words') continue;
      expect([accepted, checkAnswer(exercise, canonical(def, accepted)).correct]).toEqual([
        accepted,
        true,
      ]);
    }
  });
});

describe('fase C.3: ids, catálogo, versiones y objetivos', () => {
  const catalog = buildCatalog(PLANNED_PATH);

  it('los ids nuevos están en el registro (sólo agregado) y no repiten ningún ítem existente', () => {
    const lock = parseIdsLock(readFileSync(join(__dirname, '..', 'ids.lock.json'), 'utf8'));
    expect(checkIdsLock(registryCatalog(), lock)).toEqual([]);
    const before = new Set(
      [...buildCatalog(CURRICULUM_PATH).items, ...buildCatalog(COMPREHENSION_PATH).items].map(
        (i) => i.id,
      ),
    );
    expect(catalog.items.filter((i) => before.has(i.id)).map((i) => i.id)).toEqual([]);
    for (const i of catalog.items) expect(lock.items[i.id]).toBeDefined();
    expect(catalog.items.filter((i) => i.origin === 'authored')).toHaveLength(100);
  });

  it('los ítems generados sólo son de palabras propias de la unidad', () => {
    const own = new Set(PLANNED_PATH.flatMap((p) => p.unit.words.map((w) => w.id)));
    const targets = new Map<string, string[]>();
    for (const r of catalog.item_concepts)
      targets.set(r.item_id, [...(targets.get(r.item_id) ?? []), r.concept_id]);
    for (const i of catalog.items.filter((x) => x.origin === 'generated'))
      for (const c of targets.get(i.id)!) expect([i.id, own.has(c)]).toEqual([i.id, true]);
  });

  it('privacidad: las respuestas libres sobre Sofia son fictional; el resto, closed u open_text', () => {
    const byId = new Map(catalog.items.map((i) => [i.id, i]));
    for (const { def, lesson } of exercises.filter((e) => e.lesson.kind === 'lesson')) {
      const item = byId.get(def.id!)!;
      const free = ['translate_write', 'short_answer', 'complete_word'].includes(def.type);
      const expected = !free ? 'closed' : def.personalData ? 'fictional' : 'open_text';
      expect([lesson.id, def.id, item.response_privacy]).toEqual([lesson.id, def.id, expected]);
    }
  });

  it('objetivos: sólo se reutilizan los de comprensión que el mapa asigna, con relaciones válidas', () => {
    expect(PLANNED_OBJECTIVE_LINKS.map((l) => [l.lesson, l.code, l.items.length])).toEqual([
      ['a1-u13-l01', 'cL01', 3],
      ['a1-u13-l02', 'cL02', 0],
      ['a1-u13-l05', 'cR01', 2],
      ['a1-u14-l02', 'cL03', 0],
    ]);
    expect(PLANNED_OBJECTIVES.map((o) => o.id)).toEqual([
      'en.a1.obj.cl01',
      'en.a1.obj.cl02',
      'en.a1.obj.cl03',
      'en.a1.obj.cr01',
    ]);
    for (const o of PLANNED_OBJECTIVES) {
      const original = COMPREHENSION_OBJECTIVES.find((x) => x.id === o.id)!;
      const { concepts, lessons, items, ...rest } = o;
      const { concepts: c0, lessons: l0, items: i0, ...rest0 } = original;
      expect(rest).toEqual(rest0);
      expect(concepts).toEqual(expect.arrayContaining(c0));
      expect(lessons.slice(0, l0.length)).toEqual(l0);
      expect(items.slice(0, i0.length)).toEqual(i0);
    }
    const tranches = [...COMPREHENSION_PATH, ...PLANNED_PATH];
    const scope = objectiveScopeOf(tranches, buildCatalog(tranches));
    expect(
      objectiveProblems(PLANNED_OBJECTIVES, {
        ...scope,
        concepts: objectiveScopeOf([...CURRICULUM_PATH, ...PLANNED_PATH]).concepts,
      }),
    ).toEqual([]);
  });
});
