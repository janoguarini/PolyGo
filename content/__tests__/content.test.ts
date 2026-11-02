import { checkAnswer } from '@shared/answers';
import type { Exercise, UserAnswer } from '@shared/exercises';

import { HAN, LANGUAGES, languageConfig } from '@shared/languages';
import { readingDictionary, unreadHan } from '@shared/readings';

import { ALL_WORDS, COURSES, CURRICULUM_PATH, idPrefix, unitId } from '..';
import { joinHan, tokensOf } from '../builders';
import { pathExerciseId } from '../path';
import type { ExerciseDef, UnitDef } from '../types';

const allWords = ALL_WORDS;
// Camino completo: incluye las lecciones de consolidación generadas (también se validan).
const lessons = CURRICULUM_PATH.flatMap(({ language, level, unit, lessons: path }) =>
  path.map((lesson) => ({ language, level, unit, lesson, id: lesson.id })),
);
const exercises = lessons.flatMap(({ language, level, unit, lesson, id }) =>
  lesson.exercises.map((def, ei) => ({
    language,
    level,
    unit,
    def,
    lessonId: id,
    id: pathExerciseId(id, ei),
  })),
);
const courseOf = (language: string) => COURSES.find((c) => c.language === language)!;
const levelIndex = (language: string, level: string) =>
  courseOf(language).levels.findIndex((l) => l.level === level);
const wordsOfLanguage = (language: string) =>
  courseOf(language).levels.flatMap((l) => l.units.flatMap((u) => u.words));

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

function canonicalAnswer(def: ExerciseDef, text: string): UserAnswer {
  switch (def.payload.type) {
    case 'order_words':
      // En chino la respuesta va sin espacios: las fichas son las del payload.
      return {
        kind: 'tokens',
        value: HAN.test(text) ? def.payload.tokens : tokensOf(text),
      };
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

describe('estructura del currículo', () => {
  it('sólo hay cursos de idiomas conocidos y ninguno de los «Próximamente»', () => {
    for (const { language } of COURSES) {
      expect(LANGUAGES.map((l) => l.code)).toContain(language);
      expect(languageConfig(language).status).not.toBe('soon');
    }
  });

  it('cada nivel tiene unidades con posiciones consecutivas y 5–8 lecciones escritas', () => {
    for (const { units } of COURSES.flatMap((c) => c.levels)) {
      expect(units.length).toBeGreaterThan(0);
      units.forEach((unit, i) => {
        expect(unit.position).toBe(i + 1);
        expect(unit.lessons.length).toBeGreaterThanOrEqual(5);
        expect(unit.lessons.length).toBeLessThanOrEqual(8);
      });
    }
  });

  it('el camino intercala consolidación, conserva los ids escritos y cierra con el repaso final', () => {
    for (const { language, level, unit, lessons: path } of CURRICULUM_PATH) {
      const id = unitId(language, level, unit);
      // El inglés conserva los ids históricos (a1-u01); los demás idiomas llevan su prefijo.
      expect(id.startsWith(idPrefix(language))).toBe(true);
      expect(path.map((l) => l.position)).toEqual(path.map((_, i) => i + 1));
      expect(path.filter((l) => l.kind === 'lesson').map((l) => l.id)).toEqual(
        unit.lessons.map((_, i) => `${id}-l${String(i + 1).padStart(2, '0')}`),
      );
      expect(path.at(-1)?.kind).toBe('final');
      expect(path.length).toBeGreaterThanOrEqual(unit.lessons.length * 2);
      path.forEach((l) => expect(l.id).toMatch(/^[a-z0-9-]+$/));
    }
    const ids = lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada lección tiene entre 6 y 10 ejercicios (hasta 12 las escritas que se completaron)', () => {
    // Las lecciones de inglés ya cargadas suman al final escucha y producción (consolidate: false)
    // para cumplir el estándar sin cambiar lo existente: pueden llegar a 12.
    for (const { lesson, id } of lessons) {
      const max = lesson.kind === 'lesson' ? 12 : 10;
      const n = lesson.exercises.length;
      expect([id, n >= 6 && n <= max]).toEqual([id, true]);
    }
  });

  it('los ids de palabras son únicos y llevan el prefijo de su idioma', () => {
    const ids = allWords.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const { language } of COURSES) {
      for (const w of wordsOfLanguage(language)) {
        expect(w.id).toMatch(new RegExp(`^${language}-[a-z0-9-]+$`));
      }
    }
  });

  it('cada palabra tiene traducción y ejemplos; IPA en inglés y pinyin con tonos en chino', () => {
    const toneMark = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
    for (const { language } of COURSES) {
      const han = languageConfig(language).script === 'han';
      for (const w of wordsOfLanguage(language)) {
        if (language === 'en') expect(w.ipa).toMatch(/^\/.+\/$/);
        // Las partículas de tono neutro (吗 ma, 的 de) no llevan marca: van con la etiqueta 'particle'.
        if (han) {
          const ok = w.tags.includes('particle')
            ? /^[a-zü]+$/.test(w.romanization ?? '')
            : toneMark.test(w.romanization ?? '');
          expect([w.id, ok]).toEqual([w.id, true]);
        }
        expect(w.translation.trim()).not.toBe('');
        expect(w.exampleEn.trim()).not.toBe('');
        expect(w.exampleEs.trim()).not.toBe('');
      }
    }
  });

  it('los ejercicios sólo usan palabras de su unidad o de unidades (y niveles) anteriores', () => {
    for (const { language, level, unit, def, id } of exercises) {
      const current = levelIndex(language, level);
      const available = new Set(
        courseOf(language)
          .levels.flatMap((l, li) =>
            l.units.filter((u) => li < current || (li === current && u.position <= unit.position)),
          )
          .flatMap((u) => u.words.map((w) => w.id)),
      );
      expect(def.words.length).toBeGreaterThan(0);
      for (const w of def.words) expect([id, w, available.has(w)]).toEqual([id, w, true]);
    }
  });

  it('ninguna palabra coincide con la traducción de otra palabra de su idioma', () => {
    // Si no, en Word Rush y en el widget "café" (coffee) podría tener como opción "café" (el lugar).
    const plain = (s: string) =>
      s
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/\(.*?\)/g, '')
        .trim()
        .toLowerCase();
    const clashes = COURSES.flatMap(({ language }) => {
      const words = wordsOfLanguage(language);
      return words.flatMap((a) =>
        words
          .filter((b) => b.id !== a.id && plain(a.text) === plain(b.translation))
          .map((b) => `${a.id} ↔ ${b.id}`),
      );
    });
    expect(clashes).toEqual([]);
  });

  it('cada palabra se practica en al menos un ejercicio', () => {
    const used = new Set(exercises.flatMap((e) => e.def.words));
    const unused = allWords.filter((w) => !used.has(w.id)).map((w) => w.id);
    expect(unused).toEqual([]);
  });
});

describe('estándar de unidad y lección (docs/CONTENT_STANDARD.md)', () => {
  // Siguen el estándar todas las unidades de los idiomas nuevos y, en inglés, las que ya se
  // actualizaron (las que tienen objetivo; por ahora la piloto). El resto se completa por bloques.
  const standard = CURRICULUM_PATH.filter(
    ({ language, unit }) => language !== 'en' || unit.objective !== undefined,
  );
  const PRODUCTION = new Set(['translate_write', 'short_answer']);
  const each = (fn: (unit: UnitDef, language: string) => void) =>
    standard.forEach(({ unit, language }) => fn(unit, language));

  it('incluye la unidad piloto en los cuatro idiomas', () => {
    const pilots = standard.filter((p) => p.unit.position === 1).map((p) => p.language);
    expect(pilots.sort()).toEqual(['en', 'it', 'pt', 'zh']);
  });

  it('cada unidad tiene objetivo y estado de revisión', () => {
    each((unit) => {
      expect(unit.objective?.trim()).toBeTruthy();
      expect(unit.review?.status).toBeDefined();
    });
  });

  it('el contenido de los idiomas nuevos queda en borrador hasta la revisión nativa', () => {
    each((unit, language) => {
      if (language === 'en') return;
      expect([language, unit.position, unit.review?.status]).toEqual([
        language,
        unit.position,
        'draft',
      ]);
    });
  });

  it('cada lección escrita tiene introducción, cierre y escucha, y termina con recuperación activa', () => {
    each((unit, language) =>
      unit.lessons.forEach((l) => {
        const where = `${language} u${unit.position} «${l.title}»`;
        const lastTwo = l.exercises.slice(-2).map((e) => e.type);
        expect({
          where,
          intro: Boolean(l.intro?.explanation.trim()),
          examples: (l.intro?.examples.length ?? 0) >= 2,
          takeaways: (l.takeaways?.length ?? 0) >= 2,
          listening: l.exercises.some((e) => e.skill === 'listening'),
          activeRecall: lastTwo.every((t) => PRODUCTION.has(t)),
        }).toEqual({
          where,
          intro: true,
          examples: true,
          takeaways: true,
          listening: true,
          activeRecall: true,
        });
      }),
    );
  });

  it('todo el texto en chino tiene pinyin para mostrar encima', () => {
    for (const { language } of COURSES) {
      if (languageConfig(language).script !== 'han') continue;
      const dict = readingDictionary(wordsOfLanguage(language));
      const texts = CURRICULUM_PATH.filter((p) => p.language === language).flatMap(
        ({ unit, lessons: path }) => [
          ...unit.words.flatMap((w) => [w.text, w.exampleEn]),
          ...path.flatMap((l) => [
            ...(l.intro?.examples.map((e) => e.target) ?? []),
            ...(l.exercises.flatMap((e) => [e.answer, JSON.stringify(e.payload)]) ?? []),
          ]),
        ],
      );
      expect([...new Set(texts.flatMap((t) => unreadHan(t, dict)))]).toEqual([]);
    }
  });
});

describe('integridad de cada ejercicio', () => {
  it.each(exercises.map((e) => [e.id, e] as const))('%s', (_id, { def, id }) => {
    expect(def.payload.type).toBe(def.type);
    const p = def.payload;

    switch (p.type) {
      case 'image_choice':
      case 'translation_choice':
      case 'fill_blank':
      case 'listen_choice':
        expect(p.options).toContain(def.answer);
        expect(new Set(p.options).size).toBe(p.options.length);
        expect(p.options.length).toBeGreaterThanOrEqual(3);
        if (p.type === 'image_choice') expect(p.emoji.length).toBeGreaterThan(0);
        if (p.type === 'fill_blank') expect(p.sentence.split('___').length).toBe(2);
        break;
      case 'order_words':
        // En chino la respuesta es la oración sin espacios entre las fichas.
        if (HAN.test(def.answer)) {
          expect(joinHan(p.tokens.join(' '))).toBe(tokensOf(def.answer).join(''));
        } else {
          expect(p.tokens).toEqual(tokensOf(def.answer));
        }
        expect(p.tokens.length).toBeGreaterThanOrEqual(3);
        break;
      case 'complete_word': {
        expect(p.masked.length).toBe(def.answer.length);
        expect(p.masked).toContain('_');
        [...p.masked].forEach((ch, i) => {
          if (ch !== '_') expect(ch).toBe(def.answer[i]);
        });
        break;
      }
      case 'match_pairs':
        expect(p.pairs.length).toBeGreaterThanOrEqual(3);
        expect(new Set(p.pairs.map((x) => x.left)).size).toBe(p.pairs.length);
        expect(new Set(p.pairs.map((x) => x.right)).size).toBe(p.pairs.length);
        break;
      default:
        expect(def.answer.trim()).not.toBe('');
    }

    // La respuesta canónica y cada variante aceptada deben pasar el validador real.
    const exercise = toExercise(def, id);
    const verdict = checkAnswer(exercise, canonicalAnswer(def, def.answer));
    expect(verdict).toMatchObject({ correct: true, typo: false });
    for (const accepted of def.acceptedAnswers ?? []) {
      if (def.payload.type === 'order_words') continue; // variantes de orden no aplican a tokens fijos
      expect([accepted, checkAnswer(exercise, canonicalAnswer(def, accepted)).correct]).toEqual([
        accepted,
        true,
      ]);
    }
  });
});

describe('lecciones de consolidación generadas', () => {
  const plainText = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\(.*?\)/g, '')
      .trim()
      .toLowerCase();
  const byId = new Map(allWords.map((w) => [w.id, w]));
  const isCognate = (id: string) => {
    const w = byId.get(id)!;
    return [w.translation, ...(w.acceptedTranslations ?? [])]
      .map(plainText)
      .includes(plainText(w.text));
  };
  const generated = exercises.filter(({ lessonId }) => !/-l\d+$/.test(lessonId));

  it('no traduce cognados (hotel → hotel no enseña nada)', () => {
    const trivial = generated.filter(
      ({ def }) =>
        ['translation_choice', 'translate_write', 'complete_word', 'match_pairs'].includes(
          def.type,
        ) && def.words.some(isCognate),
    );
    expect(trivial.map((e) => e.id)).toEqual([]);
  });

  it('la consigna de «Traducí al inglés» no lleva aclaraciones entre paréntesis', () => {
    for (const { def, id } of generated) {
      if (def.payload.type !== 'translate_write') continue;
      expect([id, def.payload.source]).toEqual([id, expect.not.stringMatching(/[()]/)]);
    }
  });

  it('acepta las otras formas válidas en inglés de la palabra', () => {
    const veryMuch = generated.find(
      ({ def }) => def.type === 'translate_write' && def.words[0] === 'en-very-much',
    );
    expect(veryMuch).toBeDefined();
    const exercise = toExercise(veryMuch!.def, veryMuch!.id);
    expect(checkAnswer(exercise, { kind: 'text', value: 'a lot' }).correct).toBe(true);
    expect(checkAnswer(exercise, { kind: 'text', value: 'very much' }).correct).toBe(true);
  });
});
