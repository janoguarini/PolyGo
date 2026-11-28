import type { ContextStimulus, ExercisePayload } from '../../shared/exercises';
import type { ExampleDef, ExerciseDef, LessonDef, UnitDef, WordDef } from '../types';

/**
 * La capa de apoyo de una unidad de inglés: todo texto que está en el idioma del alumno (español en el
 * curso de origen) y no en inglés. Una sola definición sirve para extraer los textos a localizar
 * (content/en-src/strings.ts) y para armar el curso localizado (content/en-src/course.ts): si un campo
 * no está acá, queda en inglés tal cual.
 *
 * `kind` le dice al traductor qué es cada texto; `context`, el inglés al que acompaña (la palabra, la
 * oración, la respuesta).
 */

export type SupportKind =
  | 'unit.title'
  | 'unit.description'
  | 'unit.objective'
  | 'grammar.title'
  | 'grammar.explanation'
  | 'example'
  | 'example.note'
  | 'word.translation'
  | 'word.accepted'
  | 'word.example'
  | 'lesson.title'
  | 'lesson.objective'
  | 'lesson.intro'
  | 'lesson.takeaway'
  | 'exercise.prompt'
  | 'exercise.explanation'
  | 'exercise.option'
  | 'exercise.source'
  | 'exercise.translation'
  | 'exercise.hint'
  | 'exercise.pair'
  /** Pista entre paréntesis dentro de una oración en inglés: «Do you have a brother? (Sí, tengo uno.)». */
  | 'exercise.cue'
  | 'context.speaker'
  | 'context.setting'
  | 'context.question'
  | 'writing.title'
  | 'writing.instructions'
  | 'writing.glossary'
  | 'writing.requirement'
  | 'writing.checklist';

export type SupportFn = (text: string, kind: SupportKind, context?: string) => string;

const examples = (list: ExampleDef[], f: SupportFn): ExampleDef[] =>
  list.map(({ target, base, note }) => ({
    target,
    base: f(base, 'example', target),
    ...(note !== undefined ? { note: f(note, 'example.note', target) } : {}),
  }));

function word(wd: WordDef, f: SupportFn): WordDef {
  return {
    ...wd,
    translation: f(wd.translation, 'word.translation', wd.text),
    ...(wd.acceptedTranslations
      ? {
          acceptedTranslations: wd.acceptedTranslations.map((t) => f(t, 'word.accepted', wd.text)),
        }
      : {}),
    exampleEs: f(wd.exampleEs, 'word.example', wd.exampleEn),
  };
}

function stimulus(s: ContextStimulus, f: SupportFn): ContextStimulus {
  const setting = f(s.setting, 'context.setting', s.id);
  if (s.kind !== 'listening') return { ...s, setting };
  // Quien habla: casi siempre un nombre (queda igual); a veces una etiqueta («Anuncio»).
  const speaker = (name: string) => f(name, 'context.speaker', s.id);
  return {
    ...s,
    setting,
    speakers: s.speakers.map((x) => ({ ...x, name: speaker(x.name) })),
    lines: s.lines.map((l) => ({ ...l, speaker: speaker(l.speaker) })),
  };
}

/** Las pistas entre paréntesis de una oración en inglés pasan por `f`; el resto queda igual. */
const cues = (text: string, f: SupportFn) =>
  text.replace(/\(([^()]+)\)/g, (_, inner: string) => `(${f(inner, 'exercise.cue', text)})`);

function payload(p: ExercisePayload, f: SupportFn, answer: string): ExercisePayload {
  switch (p.type) {
    case 'translation_choice':
      return {
        ...p,
        options: p.options.map((o, i) => f(o, 'exercise.option', i === 0 ? p.word : undefined)),
      };
    case 'translate_write':
      return { ...p, source: f(p.source, 'exercise.source', answer) };
    case 'complete_word':
      return { ...p, hint: f(p.hint, 'exercise.hint', answer) };
    case 'fill_blank':
      return {
        ...p,
        sentence: cues(p.sentence, f),
        translation: f(p.translation, 'exercise.translation', p.sentence.replace(/_{2,}/, answer)),
      };
    case 'order_words':
      return { ...p, translation: f(p.translation, 'exercise.translation', answer) };
    case 'short_answer':
      return {
        ...p,
        question: cues(p.question, f),
        translation: f(p.translation, 'exercise.translation', p.question),
      };
    case 'match_pairs':
      return {
        ...p,
        pairs: p.pairs.map(({ left, right }) => ({ left, right: f(right, 'exercise.pair', left) })),
      };
    case 'context_choice':
      return {
        ...p,
        stimulus: stimulus(p.stimulus, f),
        question: f(p.question, 'context.question', p.stimulus.id),
        options: p.options.map((o, i) => f(o, 'exercise.option', i === 0 ? p.stimulus.id : undefined)),
      };
    case 'image_choice':
    case 'listen_choice':
      return p;
  }
}

/** En estos tipos la respuesta es una de las opciones en el idioma de apoyo. */
const SUPPORT_ANSWER = new Set(['translation_choice', 'context_choice']);

function exercise(e: ExerciseDef, f: SupportFn): ExerciseDef {
  const supportAnswer = SUPPORT_ANSWER.has(e.type);
  const contextOf =
    e.payload.type === 'translation_choice'
      ? e.payload.word
      : e.payload.type === 'context_choice'
        ? e.payload.stimulus.id
        : e.answer;
  return {
    ...e,
    prompt: f(e.prompt, 'exercise.prompt'),
    payload: payload(e.payload, f, e.answer),
    answer: supportAnswer ? f(e.answer, 'exercise.option', contextOf) : e.answer,
    ...(e.acceptedAnswers && supportAnswer
      ? { acceptedAnswers: e.acceptedAnswers.map((a) => f(a, 'exercise.option', contextOf)) }
      : {}),
    ...(e.explanation !== undefined
      ? { explanation: f(e.explanation, 'exercise.explanation', contextOf) }
      : {}),
  };
}

function lesson(l: LessonDef, f: SupportFn): LessonDef {
  return {
    ...l,
    title: f(l.title, 'lesson.title'),
    objective: f(l.objective, 'lesson.objective'),
    ...(l.intro
      ? {
          intro: {
            explanation: f(l.intro.explanation, 'lesson.intro'),
            examples: examples(l.intro.examples, f),
          },
        }
      : {}),
    ...(l.takeaways ? { takeaways: l.takeaways.map((t) => f(t, 'lesson.takeaway')) } : {}),
    exercises: l.exercises.map((e) => exercise(e, f)),
  };
}

/** La unidad con cada texto de apoyo pasado por `f` (en orden de lectura). */
export function mapSupport(u: UnitDef, f: SupportFn): UnitDef {
  return {
    ...u,
    title: f(u.title, 'unit.title', u.titleEn),
    description: f(u.description, 'unit.description'),
    ...(u.objective !== undefined ? { objective: f(u.objective, 'unit.objective') } : {}),
    ...(u.grammar
      ? {
          grammar: {
            title: f(u.grammar.title, 'grammar.title'),
            explanation: f(u.grammar.explanation, 'grammar.explanation'),
            examples: examples(u.grammar.examples, f),
          },
        }
      : {}),
    words: u.words.map((w) => word(w, f)),
    lessons: u.lessons.map((l) => lesson(l, f)),
  };
}
