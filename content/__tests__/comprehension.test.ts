import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checkAnswer } from '@shared/answers';
import type { Exercise, ExercisePayload } from '@shared/exercises';
import { gradeWithSpec, gradingSpecFor } from '@shared/grading';

import { CURRICULUM_PATH, type PathUnit } from '..';
import { buildCatalog, classifyExercise, objectiveScopeOf } from '../catalog';
import {
  COMPREHENSION_OBJECTIVES,
  COMPREHENSION_PATH,
  CONTEXT_LESSONS,
  ITEM_REGISTRY_PATH,
  registryCatalog,
} from '../comprehension';
import { comprehensionProblems } from '../comprehension-checks';
import {
  COMPREHENSION_CODES,
  EN_A1_COMPREHENSION_MAP,
  comprehensionObjectiveId,
  curriculumCode,
  type ComprehensionCode,
} from '../comprehension-map';
import { checkIdsLock, lockEntriesOf, parseIdsLock } from '../ids-lock';
import { objectiveProblems } from '../objectives';
import { pathExerciseId } from '../path';
import { CONTENT_PERSONAS, personaPrivacyProblems } from '../personas';
import { PLANNED_PATH } from '../planned';
import { A2_EXPANSION_PATH } from '../a2-expansion';
import { B1_PATH } from '../b1';
import { B2_PATH } from '../b2';
import { IT_PATH } from '../it-course';
import { ES_PATH } from '../es-course';
import { FR_PATH } from '../fr-course';
import { ZH_PATH } from '../zh-course';
import { PT_PATH } from '../pt-course';
import { SUPPLEMENT_PATH } from '../supplement';
import type { ContextLessonDef, ExerciseDef } from '../types';
import { buildVersions } from '../versions';

const lock = () => parseIdsLock(readFileSync(join(__dirname, '..', 'ids.lock.json'), 'utf8'));
const exercises = COMPREHENSION_PATH.flatMap((p) =>
  p.lessons[0]!.exercises.map((e, i) => ({ e, id: pathExerciseId(p.lessons[0]!.id, i), unit: p })),
);
const payloadOf = (e: ExerciseDef) =>
  e.payload as Extract<ExercisePayload, { type: 'context_choice' }>;

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

describe('fase C: contenido', () => {
  it('cubre U1–U14 de inglés A1 con una lección «En contexto» cada una (U13 y U14 planificadas)', () => {
    expect(COMPREHENSION_PATH.map((p) => [p.language, p.level, p.unit.position])).toEqual(
      Array.from({ length: 14 }, (_, i) => ['en', 'A1', i + 1]),
    );
    expect(CONTEXT_LESSONS[0]!.plannedUnits.map((u) => u.position)).toEqual([13, 14]);
    expect(CONTEXT_LESSONS.flatMap((c) => c.lessons).every((l) => l.status === 'draft')).toBe(true);
  });

  it('pasa todas las reglas del validador (estímulos, preguntas, opciones, vocabulario, privacidad)', () => {
    expect(comprehensionProblems()).toEqual([]);
  });

  it('cada lección tiene las actividades de sus objetivos del mapa (U12 L7: sólo escucha)', () => {
    for (const p of COMPREHENSION_PATH) {
      const def = CONTEXT_LESSONS[0]!.lessons.find((l) => l.unit === p.unit.position)!;
      const kinds = p.lessons[0]!.exercises.map((e) => payloadOf(e).stimulus.kind);
      const expected = def.curriculum.primary.map((c) => EN_A1_COMPREHENSION_MAP[c].activity);
      expect(new Set(kinds)).toEqual(new Set(expected));
    }
  });

  it('los audios conservan su transcripción y no apuntan a archivos ni URLs', () => {
    for (const { e } of exercises) {
      const s = payloadOf(e).stimulus;
      const json = JSON.stringify(s);
      expect(json).not.toMatch(/https?:|\.mp3|\.m4a|\.wav|storage|audio_url|file/i);
      if (s.kind === 'listening') {
        expect(s.lines.length).toBeGreaterThan(0);
        expect(s.lines.every((l) => l.text.trim().length > 0)).toBe(true);
      }
    }
  });

  it('las preguntas piden significado: ninguna respuesta está escrita en inglés en el estímulo', () => {
    // Las opciones están en español: elegir no es reconocer una palabra inglesa del texto. Sólo
    // pueden coincidir nombres propios (quién escribe), y entonces hay otro nombre del texto entre
    // los distractores (lo exige el validador).
    for (const { e, unit } of exercises) {
      const def = CONTEXT_LESSONS[0]!.lessons.find((l) => l.unit === unit.unit.position)!;
      // También los datos de la persona ficticia (U13): son datos de la ficha, no vocabulario.
      const persona = CONTENT_PERSONAS.find((p) => p.id === def.persona);
      const names = new Set(
        [...def.names, ...(persona ? [persona.city] : [])].map((n) => n.toLowerCase()),
      );
      const s = payloadOf(e).stimulus;
      const text = (s.kind === 'reading' ? s.lines : s.lines.map((l) => l.text))
        .join(' ')
        .toLowerCase();
      for (const o of payloadOf(e).options) {
        if (names.has(o.toLowerCase())) continue;
        expect({ option: o, inStimulus: text.includes(o.toLowerCase()) }).toEqual({
          option: o,
          inStimulus: false,
        });
      }
    }
  });

  it('las respuestas esperadas pasan el validador real y cada distractor es incorrecto', () => {
    for (const { e, id } of exercises) {
      const ex = toExercise(e, id);
      expect(checkAnswer(ex, { kind: 'option', value: e.answer }).correct).toBe(true);
      const spec = gradingSpecFor(e.type, e.mode);
      expect(spec).toEqual({ mode: 'exact_option', mode_version: 1 });
      const content = { answer: e.answer, accepted_answers: [], payload: e.payload };
      expect(gradeWithSpec(spec, content, { kind: 'option', value: e.answer }).correct).toBe(true);
      for (const wrong of payloadOf(e).options.filter((o) => o !== e.answer)) {
        expect(gradeWithSpec(spec, content, { kind: 'option', value: wrong }).correct).toBe(false);
        expect(checkAnswer(ex, { kind: 'option', value: wrong }).correct).toBe(false);
      }
    }
  });
});

describe('fase C: clasificación y catálogo', () => {
  it('lectura → reading_comprehension/text; escucha → listening_comprehension/audio; cerrada', () => {
    for (const { e } of exercises) {
      const reading = payloadOf(e).stimulus.kind === 'reading';
      expect(classifyExercise(e, 'en')).toEqual({
        assessment_mode: reading ? 'reading_comprehension' : 'listening_comprehension',
        response_format: 'select',
        input_modality: reading ? 'text' : 'audio',
        response_privacy: 'closed',
      });
    }
  });

  it('un modo que no corresponde al estímulo se rechaza', () => {
    const { e } = exercises.find((x) => payloadOf(x.e).stimulus.kind === 'reading')!;
    expect(() => classifyExercise({ ...e, mode: 'listening_comprehension' }, 'en')).toThrow(
      /incompatible con el estímulo/,
    );
    expect(() => classifyExercise({ ...e, mode: 'recognition' }, 'en')).toThrow(/incompatible/);
  });

  it('dimensiones de §4.3: vocabulary + comprehension por concepto, nunca sólo vocabulary', () => {
    const catalog = buildCatalog(COMPREHENSION_PATH);
    for (const item of catalog.items) {
      const rows = catalog.item_concepts.filter((r) => r.item_id === item.id);
      const dims = new Set(rows.map((r) => r.dimension));
      expect(dims).toEqual(new Set(['vocabulary', 'comprehension']));
      expect(rows.filter((r) => r.dimension === 'comprehension').length).toBe(
        rows.filter((r) => r.dimension === 'vocabulary').length,
      );
    }
  });

  it('los conceptos target salen de `concepts` y `words` queda vacío (no alimenta el SRS v1)', () => {
    const catalog = buildCatalog(COMPREHENSION_PATH);
    for (const { e } of exercises) {
      expect(e.words).toEqual([]);
      const targets = catalog.item_concepts
        .filter((r) => r.item_id === e.id && r.dimension === 'comprehension')
        .map((r) => r.concept_id)
        .sort();
      expect(targets).toEqual([...e.concepts!].sort());
    }
  });

  it('el catálogo y las versiones son deterministas (dos corridas idénticas)', () => {
    const a = buildCatalog(COMPREHENSION_PATH);
    const b = buildCatalog(COMPREHENSION_PATH);
    expect(b).toEqual(a);
    const rows = exercises.map(({ e, id }) => ({
      id,
      type: e.type,
      prompt_es: e.prompt,
      payload: e.payload,
      answer: e.answer,
      accepted_answers: [],
      explanation_es: e.explanation ?? null,
      difficulty: e.difficulty ?? 1,
      recommended_seconds: e.recommendedSeconds ?? 20,
    }));
    const v1 = buildVersions(a, rows);
    const v2 = buildVersions(b, rows);
    expect(v2).toEqual(v1);
    expect(v1.versions).toHaveLength(exercises.length);
    // El estímulo es parte de la versión inmutable (y de su hash).
    expect(v1.versions.every((v) => (v.payload as { stimulus?: unknown }).stimulus)).toBe(true);
    expect(new Set(v1.versions.map((v) => v.content_hash)).size).toBe(exercises.length);
  });
});

describe('fase C: identidad', () => {
  it('ids nuevos registrados en content/ids.lock.json, únicos y sin reutilizar retirados', () => {
    const catalog = registryCatalog();
    expect(checkIdsLock(catalog, lock())).toEqual([]);
    const ids = exercises.map(({ e }) => e.id!);
    expect(ids.every((id) => /^en\.ex\.[0-9a-z]{14}$/.test(id))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    const entries = lock().items;
    for (const { e, id } of exercises) {
      expect(entries[e.id!]).toMatchObject({
        type: 'context_choice',
        exercise: id,
        privacy: 'closed',
      });
      expect(entries[e.id!]!.withdrawn).toBeUndefined();
    }
  });

  it('no cambia ningún ítem del currículo: las entradas previas siguen idénticas', () => {
    const current = lockEntriesOf(buildCatalog(CURRICULUM_PATH));
    const registered = lock().items;
    for (const [id, entry] of current) {
      const { withdrawn: _w, ...locked } = registered[id]!;
      expect(locked).toEqual(entry);
    }
  });

  it('el currículo activo no contiene lecciones ni ejercicios de comprensión', () => {
    expect(CURRICULUM_PATH.flatMap((p) => p.lessons).some((l) => l.kind === 'context')).toBe(false);
    expect(
      CURRICULUM_PATH.flatMap((p) => p.lessons.flatMap((l) => l.exercises)).some(
        (e) => e.type === 'context_choice',
      ),
    ).toBe(false);
    // El registro incluye además las lecciones escritas de U13 y U14 (fase C.3, content/planned.ts).
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
});

/**
 * Tabla del mapa curricular (docs/polygo-ingles-a1-mapa-curricular.md §3), copiada a mano para que
 * un cambio en context.ts que se aparte del mapa falle acá: unidad → lección del mapa y objetivos
 * principales de comprensión.
 */
const MAP_TABLE: Record<number, { lesson: number; title: string; primary: string[] }> = {
  1: { lesson: 6, title: 'En contexto: un primer encuentro', primary: ['cL05', 'cR02'] },
  2: { lesson: 6, title: 'En contexto: ¿quién es quién?', primary: ['cR03', 'cL02'] },
  3: { lesson: 6, title: 'En contexto: tarjetas de jugadores', primary: ['cR01', 'cL03'] },
  4: { lesson: 6, title: 'En contexto: la familia de Ana', primary: ['cR03', 'cL05'] },
  5: { lesson: 7, title: 'En contexto: ¿cuál es el tuyo?', primary: ['cR05', 'cL01'] },
  6: { lesson: 6, title: 'En contexto: un departamento en alquiler', primary: ['cR03', 'cL04'] },
  7: { lesson: 6, title: 'En contexto: en el café', primary: ['cR01', 'cL05'] },
  8: { lesson: 6, title: 'En contexto: la semana de Tom', primary: ['cR02', 'cL06'] },
  9: { lesson: 7, title: 'En contexto: el programa del museo', primary: ['cR01', 'cL03'] },
  10: { lesson: 6, title: 'En contexto: ¿cómo llego?', primary: ['cR06', 'cL04', 'cR01'] },
  11: { lesson: 6, title: 'En contexto: una publicación sobre hobbies', primary: ['cR02', 'cL05'] },
  12: { lesson: 7, title: 'En contexto: una conversación completa', primary: ['cL02', 'cL05'] },
  13: { lesson: 6, title: 'En contexto: registro en un hotel', primary: ['cL02', 'cR01'] },
  14: { lesson: 6, title: 'En contexto: cliente y vendedor', primary: ['cL05', 'cL03', 'cR01'] },
};

describe('fase C.1: alineación con el mapa curricular', () => {
  it('unidad, número de lección, título y objetivos principales coinciden con el mapa', () => {
    for (const p of COMPREHENSION_PATH) {
      const def = CONTEXT_LESSONS[0]!.lessons.find((l) => l.unit === p.unit.position)!;
      const row = MAP_TABLE[p.unit.position]!;
      expect({
        unit: p.unit.position,
        lesson: def.curriculumLesson,
        title: def.title,
        primary: def.curriculum.primary,
      }).toEqual({ unit: p.unit.position, ...row });
      // El id no depende de posiciones y la lección vive dentro de su unidad.
      expect(p.lessons[0]!.id).toBe(`a1-u${String(p.unit.position).padStart(2, '0')}-context`);
    }
  });

  it('el número del mapa (L6/L7) no es la posición en el camino ni pisa lecciones publicadas', () => {
    for (const p of COMPREHENSION_PATH) {
      const base = CURRICULUM_PATH.find(
        (c) =>
          c.language === p.language && c.level === p.level && c.unit.position === p.unit.position,
      );
      if (!base) continue; // U13 y U14: unidades planificadas (fase C.2, abajo).
      expect(p.lessons[0]!.position).toBe(base.lessons.length + 1);
      expect(base.lessons.map((l) => l.position)).not.toContain(p.lessons[0]!.position);
    }
  });

  it('código del mapa ↔ id de la base: biyectiva, con el formato del CHECK, sin cR04', () => {
    expect(COMPREHENSION_CODES).toHaveLength(11);
    expect(COMPREHENSION_CODES).not.toContain('cR04');
    const ids = COMPREHENSION_CODES.map((c) => comprehensionObjectiveId('en', 'A1', c));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^en\.a1\.obj\.[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toBe(true);
    expect(comprehensionObjectiveId('en', 'A1', 'cL01')).toBe('en.a1.obj.cl01');
    expect(curriculumCode('en', 'A1', 'cR06')).toBe('en-a1-cR06');
  });
});

describe('fase C: objetivos', () => {
  it('uno por objetivo del mapa (11), en draft, con su ancla y ejercicios de su actividad', () => {
    expect(COMPREHENSION_OBJECTIVES.map((o) => o.id)).toEqual(
      COMPREHENSION_CODES.map((c) => comprehensionObjectiveId('en', 'A1', c)),
    );
    expect(COMPREHENSION_OBJECTIVES.every((o) => o.status === 'draft' && !!o.cefrRef)).toBe(true);
    const scope = objectiveScopeOf(COMPREHENSION_PATH, buildCatalog(COMPREHENSION_PATH));
    const concepts = objectiveScopeOf(CURRICULUM_PATH).concepts;
    expect(objectiveProblems(COMPREHENSION_OBJECTIVES, { ...scope, concepts })).toEqual([]);
    for (const o of COMPREHENSION_OBJECTIVES) {
      const items = exercises.filter((x) => o.items.includes(x.e.id!));
      expect(items.length).toBeGreaterThanOrEqual(3);
      expect(items.every((x) => payloadOf(x.e).stimulus.kind === o.cefrActivity)).toBe(true);
    }
  });

  it('cada pregunta evalúa exactamente un objetivo, y no hay objetivos por lección duplicados', () => {
    const all = COMPREHENSION_OBJECTIVES.flatMap((o) => o.items);
    expect(all.sort()).toEqual(exercises.map(({ e }) => e.id!).sort());
    // Una capacidad, un objetivo: cL05 se comparte entre cinco lecciones.
    const cl05 = COMPREHENSION_OBJECTIVES.find((o) => o.id === 'en.a1.obj.cl05')!;
    expect(cl05.lessons.map((l) => l.lesson)).toEqual([
      'a1-u01-context',
      'a1-u04-context',
      'a1-u07-context',
      'a1-u11-context',
      'a1-u12-context',
      'a1-u14-context',
    ]);
  });
});

describe('fase C.1: el validador detecta desvíos del mapa', () => {
  const [{ language, level, lessons: defs, plannedUnits }] = CONTEXT_LESSONS as [
    (typeof CONTEXT_LESSONS)[number],
  ];
  const withDef = (unit: number, change: (d: ContextLessonDef) => ContextLessonDef) => [
    { language, level, plannedUnits, lessons: defs.map((d) => (d.unit === unit ? change(d) : d)) },
  ];
  const path = COMPREHENSION_PATH.filter((p) => p.unit.position === 1);
  const u1 = defs.find((d) => d.unit === 1)!;

  it.each([
    [
      'objetivo retirado',
      (d: ContextLessonDef) => ({
        ...d,
        curriculum: { ...d.curriculum, primary: ['cR04' as never] },
      }),
      /retirado/,
    ],
    [
      'estímulo de lectura con un objetivo de escucha',
      (d: ContextLessonDef) => ({
        ...d,
        curriculum: { ...d.curriculum, primary: ['cL05', 'cL01'] as ComprehensionCode[] },
        stimulusObjectives: {
          ...d.stimulusObjectives,
          'en.stim.a1-u01-welcome-message': 'cL01' as const,
        },
      }),
      /es de reading/,
    ],
    [
      'objetivo principal sin estímulo',
      (d: ContextLessonDef) => ({
        ...d,
        curriculum: {
          ...d.curriculum,
          primary: [...d.curriculum.primary, 'cR01'] as ComprehensionCode[],
        },
      }),
      /no tiene ningún estímulo/,
    ],
    [
      'número de lección que no es el del mapa',
      (d: ContextLessonDef) => ({ ...d, curriculumLesson: 7 as const }),
      /L7 en el mapa/,
    ],
    [
      'estímulo sin objetivo',
      (d: ContextLessonDef) => ({
        ...d,
        stimulusObjectives: { 'en.stim.a1-u01-first-meeting': 'cL05' as const },
      }),
      /no tiene objetivo del mapa/,
    ],
  ])('%s', (_label, change, problem) => {
    expect(u1).toBeDefined();
    expect(comprehensionProblems(path, withDef(1, change)).join('\n')).toMatch(problem);
  });
});

describe('fase C: el validador detecta contenido roto', () => {
  const base = COMPREHENSION_PATH[0]!;
  const lesson = base.lessons[0]!;
  const mutate = (i: number, change: (e: ExerciseDef) => ExerciseDef): PathUnit[] => [
    {
      ...base,
      lessons: [
        { ...lesson, exercises: lesson.exercises.map((e, k) => (k === i ? change(e) : e)) },
      ],
    },
  ];
  const listenAt = lesson.exercises.findIndex((e) => payloadOf(e).stimulus.kind === 'listening');
  const withPayload = (
    e: ExerciseDef,
    p: Partial<Extract<ExercisePayload, { type: 'context_choice' }>>,
  ) => ({
    ...e,
    payload: { ...payloadOf(e), ...p },
  });

  it.each([
    ['palabras en words', (e: ExerciseDef) => ({ ...e, words: ['en-hello'] }), /words/],
    ['concepto inexistente', (e: ExerciseDef) => ({ ...e, concepts: ['en-nope'] }), /inexistente/],
    [
      'concepto de una unidad posterior',
      (e: ExerciseDef) => ({ ...e, concepts: ['en-coffee'] }),
      /no está enseñado/,
    ],
    [
      'opciones repetidas',
      (e: ExerciseDef) => withPayload(e, { options: [e.answer, e.answer.toUpperCase(), 'otra'] }),
      /repetidas/,
    ],
    [
      'respuesta fuera de las opciones',
      (e: ExerciseDef) => ({ ...e, answer: 'inventada' }),
      /exactamente una vez/,
    ],
    ['sin explicación', (e: ExerciseDef) => ({ ...e, explanation: '' }), /explicación/],
    [
      'modo de escucha en un texto',
      (e: ExerciseDef) => ({ ...e, mode: 'listening_comprehension' as const }),
      /modo/,
    ],
  ])('%s', (_label, change, problem) => {
    expect(comprehensionProblems(mutate(0, change)).join('\n')).toMatch(problem);
  });

  it('audio acelerado, diálogo con una sola voz, transcripción vacía o datos de contacto', () => {
    const listen = (s: object) => (e: ExerciseDef) =>
      withPayload(e, { stimulus: { ...payloadOf(e).stimulus, ...s } as never });
    const fast = comprehensionProblems(mutate(listenAt, listen({ rate: 1.2 }))).join('\n');
    expect(fast).toMatch(/velocidad/);
    const s = payloadOf(lesson.exercises[listenAt]!).stimulus;
    if (s.kind !== 'listening') throw new Error('no es audio');
    const oneVoice = comprehensionProblems(
      mutate(listenAt, listen({ speakers: s.speakers.map((x) => ({ ...x, voice: 'a' })) })),
    ).join('\n');
    expect(oneVoice).toMatch(/dos voces/);
    const empty = comprehensionProblems(
      mutate(listenAt, listen({ lines: [{ speaker: s.speakers[0]!.name, text: ' ' }] })),
    ).join('\n');
    expect(empty).toMatch(/transcripción vacía/);
    const phone = comprehensionProblems(
      mutate(0, (e) =>
        withPayload(e, {
          stimulus: { ...payloadOf(e).stimulus, lines: ['Call me: 555 123 4567'] } as never,
        }),
      ),
    ).join('\n');
    expect(phone).toMatch(/datos de contacto/);
  });

  it('un estímulo que cambia entre preguntas con el mismo id', () => {
    const changed = comprehensionProblems(
      mutate(1, (e) =>
        withPayload(e, {
          stimulus: { ...payloadOf(e).stimulus, setting: 'Otra situación.' } as never,
        }),
      ),
    ).join('\n');
    expect(changed).toMatch(/cambia entre preguntas/);
  });
});

describe('fase C.2: U13 y U14 (unidades planificadas)', () => {
  const [entry] = CONTEXT_LESSONS as [(typeof CONTEXT_LESSONS)[number]];
  const at = (unit: number) => COMPREHENSION_PATH.find((p) => p.unit.position === unit)!;
  const defOf = (unit: number) => entry.lessons.find((l) => l.unit === unit)!;
  const u13 = at(13);
  const u14 = at(14);
  const withLesson = (unit: number, change: (d: ContextLessonDef) => ContextLessonDef) => [
    { ...entry, lessons: entry.lessons.map((d) => (d.unit === unit ? change(d) : d)) },
  ];
  const mutate = (p: PathUnit, i: number, change: (e: ExerciseDef) => ExerciseDef): PathUnit[] => [
    {
      ...p,
      lessons: [
        {
          ...p.lessons[0]!,
          exercises: p.lessons[0]!.exercises.map((e, k) => (k === i ? change(e) : e)),
        },
      ],
    },
  ];
  const problemsOf = (path: PathUnit[], lessons?: typeof CONTEXT_LESSONS) =>
    comprehensionProblems(path, lessons).join('\n');

  it('no son unidades escritas: fuera de COURSES y CURRICULUM_PATH, sin palabras ni lecciones', () => {
    for (const p of [u13, u14]) {
      expect(
        CURRICULUM_PATH.some((c) => c.language === 'en' && c.unit.position === p.unit.position),
      ).toBe(false);
      expect(p.unit.words).toEqual([]);
      expect(p.unit.lessons).toEqual([]);
    }
    expect(u13.lessons[0]!.id).toBe('a1-u13-context');
    expect(u14.lessons[0]!.id).toBe('a1-u14-context');
    expect(entry.plannedUnits.map((u) => [u.position, u.after, u.title])).toEqual([
      [13, 3, 'Letras y datos personales'],
      [14, 7, 'Precios y compras'],
    ]);
  });

  it('la «En contexto» va después de las posiciones reservadas: la misma (11) que en U1–U12', () => {
    const written = CURRICULUM_PATH.filter((p) => p.language === 'en' && p.level === 'A1');
    // Toda unidad escrita de inglés A1 ocupa 1–10 con sus 5 lecciones y su consolidación.
    expect(new Set(written.map((p) => p.lessons.length))).toEqual(new Set([10]));
    for (const u of entry.plannedUnits) expect(u.reservedPositions).toBe(10);
    expect(u13.lessons[0]!.position).toBe(11);
    expect(u14.lessons[0]!.position).toBe(11);
  });

  it('L6 del mapa: sigue a las 5 lecciones planificadas de su unidad', () => {
    entry.plannedUnits.forEach((planned) => {
      const def = defOf(planned.position);
      expect(def.curriculumLesson).toBe(6);
      expect(def.plannedBefore).toEqual(planned.plannedLessons);
      expect(planned.plannedLessons).toHaveLength(5);
    });
    expect(defOf(13).curriculum.secondary).toEqual(['p01']);
    expect(defOf(14).curriculum.secondary).toEqual(['p10']);
  });

  it('estímulos y preguntas: U13 ficha + recepcionista (7); U14 cartel, diálogo y anuncio (9)', () => {
    const shape = (p: PathUnit) =>
      [...new Set(p.lessons[0]!.exercises.map((e) => payloadOf(e).stimulus.id))].map((id) => {
        const qs = p.lessons[0]!.exercises.filter((e) => payloadOf(e).stimulus.id === id);
        const s = payloadOf(qs[0]!).stimulus;
        return [id, s.kind === 'reading' ? s.document : s.speakers.length, qs.length];
      });
    expect(shape(u13)).toEqual([
      ['en.stim.a1-u13-hotel-form', 'form', 3],
      ['en.stim.a1-u13-reception', 1, 4],
    ]);
    expect(shape(u14)).toEqual([
      ['en.stim.a1-u14-shop-prices', 'sign', 3],
      ['en.stim.a1-u14-at-the-shop', 2, 3],
      ['en.stim.a1-u14-supermarket-announcement', 1, 3],
    ]);
  });

  it('el vocabulario se mide hasta la unidad tras la que va (U13 → U3, U14 → U7)', () => {
    const concept = (p: PathUnit, c: string) =>
      problemsOf(mutate(p, 0, (e) => ({ ...e, concepts: [c] })));
    // en-family es de U4 y en-coffee de U7: valen en U14, no en U13. en-hotel (U10), en ninguna.
    expect(concept(u13, 'en-family')).toMatch(/no está enseñado hasta en A1 U3/);
    expect(concept(u14, 'en-family')).not.toMatch(/no está enseñado/);
    expect(concept(u13, 'en-coffee')).toMatch(/no está enseñado/);
    expect(concept(u14, 'en-coffee')).not.toMatch(/no está enseñado/);
    expect(concept(u14, 'en-hotel')).toMatch(/no está enseñado hasta en A1 U7/);
    // Lo no enseñado hasta ahí queda declarado (p. ej. «hotel» en U13, «dollars» en U14).
    expect(defOf(13).untaught).toEqual(expect.arrayContaining(['hotel', 'surname', 'spell']));
    expect(defOf(14).untaught).toEqual(expect.arrayContaining(['dollars', 'thirty', "i'd"]));
  });

  it('una unidad planificada mal declarada se rechaza', () => {
    const planned = (change: object) => [
      {
        ...entry,
        plannedUnits: entry.plannedUnits.map((u) => (u.position === 13 ? { ...u, ...change } : u)),
      },
    ];
    expect(problemsOf([u13], planned({ after: 13 }))).toMatch(/después de una unidad anterior/);
    expect(problemsOf([u13], planned({ plannedLessons: ['otra'] }))).toMatch(
      /plannedBefore no coincide/,
    );
    expect(
      problemsOf(
        [u13],
        withLesson(13, (d) => ({ ...d, curriculumLesson: 7 })),
      ),
    ).toMatch(/L7 en el mapa/);
  });

  it('U13 usa una persona ficticia del catálogo, citada por todas sus preguntas y cerrada', () => {
    const persona = CONTENT_PERSONAS.find((p) => p.id === defOf(13).persona)!;
    expect(persona).toMatchObject({ id: 'en.persona.sofia-ruiz', language: 'en' });
    expect(persona.email).toMatch(/@example\.com$/);
    expect(persona.phone).toMatch(/^555-01\d\d$/);
    expect(personaPrivacyProblems(CONTENT_PERSONAS)).toEqual([]);
    for (const e of u13.lessons[0]!.exercises) {
      expect(e.personalData).toEqual({ persona: persona.id });
      expect(classifyExercise(e, 'en').response_privacy).toBe('closed');
    }
    // La ficha muestra exactamente los datos de la persona.
    const form = payloadOf(u13.lessons[0]!.exercises[0]!).stimulus;
    if (form.kind !== 'reading') throw new Error('no es lectura');
    const [first, last] = persona.displayName.split(' ');
    expect(form.lines).toEqual(
      expect.arrayContaining([
        `First name: ${first}`,
        `Surname: ${last}`,
        `City: ${persona.city}`,
        `Country: ${persona.country}`,
        `Phone: ${persona.phone}`,
        `Email: ${persona.email}`,
      ]),
    );
    // U14 y las lecciones de C.1 no citan personas.
    for (const p of COMPREHENSION_PATH.filter((x) => x.unit.position !== 13))
      expect(p.lessons[0]!.exercises.every((e) => e.personalData === undefined)).toBe(true);
    // El catálogo carga la persona junto con los ítems (content_personas).
    expect(buildCatalog(COMPREHENSION_PATH).personas.map((p) => p.id)).toEqual([persona.id]);
  });

  it('datos de contacto: sólo los de la persona de la lección, y la cita es obligatoria', () => {
    const swapLine = (from: string, to: string) => (e: ExerciseDef) => {
      const s = payloadOf(e).stimulus;
      if (s.kind !== 'reading') return e;
      const lines = s.lines.map((l) => l.replace(from, to));
      return { ...e, payload: { ...payloadOf(e), stimulus: { ...s, lines } } };
    };
    expect(problemsOf(mutate(u13, 0, swapLine('555-0142', '555-0199')))).toMatch(
      /datos de contacto/,
    );
    expect(
      problemsOf(mutate(u13, 0, swapLine('sofia.ruiz@example.com', 'sofia@gmail.com'))),
    ).toMatch(/datos de contacto/);
    expect(problemsOf(mutate(u13, 0, (e) => ({ ...e, personalData: undefined })))).toMatch(
      /tiene que citar la persona/,
    );
    expect(problemsOf(mutate(u13, 0, (e) => ({ ...e, personalData: 'learner' as const })))).toMatch(
      /tiene que citar la persona/,
    );
    // Una lección sin persona no puede citar una; una persona inexistente se rechaza.
    expect(
      problemsOf(
        mutate(u14, 0, (e) => ({ ...e, personalData: { persona: 'en.persona.sofia-ruiz' } })),
      ),
    ).toMatch(/no pide datos personales/);
    expect(
      problemsOf(
        [u13],
        withLesson(13, (d) => ({ ...d, persona: 'en.persona.nadie' })),
      ),
    ).toMatch(/no está en content\/personas\.ts/);
  });

  it('U14: el diálogo cliente–vendedor es coherente con el cartel de la misma tienda', () => {
    const [sign, shop] = [0, 3].map((i) => payloadOf(u14.lessons[0]!.exercises[i]!).stimulus);
    if (sign?.kind !== 'reading' || shop?.kind !== 'listening') throw new Error('estímulos');
    expect(shop.speakers.map((s) => s.voice)).toEqual(['a', 'b']);
    const said = shop.lines.map((l) => l.text).join(' ');
    // Los precios dichos son los del cartel, y el total es la suma de lo que pide (30 + 6).
    expect(sign.lines).toEqual(
      expect.arrayContaining(['Big bags: $45', 'Small bags: $30', 'White cups: $6']),
    );
    expect(said).toMatch(
      /forty-five dollars[\s\S]*thirty dollars[\s\S]*small bag[\s\S]*white cup[\s\S]*thirty-six dollars/,
    );
  });
});
