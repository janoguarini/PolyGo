import type { ContextStimulus, ListeningStimulus, ReadingStimulus } from '../shared/exercises';
import { withVisual } from './stimulus-visuals';
import type { ExerciseDef } from './types';

/**
 * Atajos de autoría de la fase C (content/comprehension.ts, docs/LEARNING_PHASE_C.md): cada pregunta
 * sobre un estímulo es un ejercicio context_choice con su id propio.
 */

export interface ContextQuestion {
  /** `'en.ex.cvk18kndacj9wx'` al escribirla; npm run content:ids lo reemplaza por el id definitivo. */
  id: string;
  question: string;
  answer: string;
  /** Distractores plausibles e inequívocamente incorrectos según el estímulo. */
  wrong: string[];
  /** Conceptos target: palabras del currículo que hay que entender para responder. */
  concepts: string[];
  /** Por qué es la respuesta: cita el estímulo. Se muestra después de responder. */
  why: string;
}

/** Posición determinista de la respuesta entre las opciones (no depende del orden de escritura). */
function answerSlot(question: string, size: number) {
  let h = 0;
  for (const ch of question) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return h % size;
}

function optionsOf(q: ContextQuestion) {
  const options = [...q.wrong];
  options.splice(answerSlot(q.question, q.wrong.length + 1), 0, q.answer);
  return options;
}

function questionsOf(
  written: ContextStimulus,
  questions: ContextQuestion[],
  prompt: string,
): ExerciseDef[] {
  // La imagen de apoyo (fase C.9.1) entra sólo si su recurso definitivo existe: content/stimulus-visuals.ts.
  const stimulus = withVisual(written);
  const reading = stimulus.kind === 'reading';
  return questions.map((q) => ({
    id: q.id,
    type: 'context_choice',
    skill: reading ? 'reading' : 'listening',
    mode: reading ? 'reading_comprehension' : 'listening_comprehension',
    prompt,
    payload: { type: 'context_choice', stimulus, question: q.question, options: optionsOf(q) },
    answer: q.answer,
    explanation: q.why,
    words: [],
    concepts: q.concepts,
    difficulty: 2,
    // Leer o escuchar el estímulo lleva más que una opción suelta.
    recommendedSeconds: reading ? 60 : 75,
    consolidate: false,
  }));
}

/** Preguntas sobre un texto escrito. */
export const readingQuestions = (stimulus: ReadingStimulus, questions: ContextQuestion[]) =>
  questionsOf(stimulus, questions, 'Lee el texto y responde.');

/** Preguntas sobre un mensaje oral. */
export const listeningQuestions = (stimulus: ListeningStimulus, questions: ContextQuestion[]) =>
  questionsOf(stimulus, questions, 'Escucha y responde.');

/** Velocidad A1 del audio sintetizado: un poco más lenta que la normal, nunca acelerada. */
export const A1_LISTENING_RATE = 0.85;
