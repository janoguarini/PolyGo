import type { ArcadeSentence } from '../../shared/arcade';
import { A2_EXPANSION_PATH } from '../a2-expansion';
import { joinHan, tokensOf } from '../builders';
import { ES_PATH } from '../es-course';
import { FR_PATH } from '../fr-course';
import { CURRICULUM_PATH, idPrefix, type PathUnit } from '../index';
import { IT_PATH } from '../it-course';
import { lessonExerciseIndex, pathExerciseId } from '../path';
import { PT_PATH } from '../pt-course';
import { ZH_PATH } from '../zh-course';
import { EN_WORD_RUSH } from './en';
import { ES_WORD_RUSH } from './es';
import { FR_WORD_RUSH } from './fr';
import { IT_WORD_RUSH } from './it';
import { PT_WORD_RUSH } from './pt';
import type { WordRushBank, WordRushLevel, WordRushSentenceDef } from './types';
import { ZH_WORD_RUSH } from './zh';

export type { WordRushBank, WordRushSentenceDef, WordRushVariantDef } from './types';

export const WORD_RUSH_LANGUAGES = ['en', 'es', 'it', 'pt', 'fr', 'zh'] as const;
export type WordRushLanguage = (typeof WORD_RUSH_LANGUAGES)[number];

export const WORD_RUSH_BANKS: Record<WordRushLanguage, WordRushBank> = {
  en: EN_WORD_RUSH,
  es: ES_WORD_RUSH,
  it: IT_WORD_RUSH,
  pt: PT_WORD_RUSH,
  fr: FR_WORD_RUSH,
  zh: ZH_WORD_RUSH,
};

/**
 * Unidades publicadas de cada curso, según el contenido local y la última integración registrada
 * (2026-11-23): inglés A1 U1–U12 y A2 U1–U17 (U13–U14 de A1 y el cierre están cargados sin publicar);
 * italiano, portugués y chino A1 U1–U16 y A2; francés y español A1 y A2. Es lo que lee
 * loadSentences (order_words de lecciones publicadas). No se verificó contra la base de producción.
 */
export const PUBLISHED_PATHS: Record<WordRushLanguage, readonly PathUnit[]> = {
  en: [
    ...CURRICULUM_PATH.filter((u) => u.language === 'en'),
    ...A2_EXPANSION_PATH.filter((u) => u.language === 'en'),
  ],
  it: [...CURRICULUM_PATH.filter((u) => u.language === 'it'), ...IT_PATH],
  pt: [...CURRICULUM_PATH.filter((u) => u.language === 'pt'), ...PT_PATH],
  zh: [...CURRICULUM_PATH.filter((u) => u.language === 'zh'), ...ZH_PATH],
  fr: FR_PATH,
  es: ES_PATH,
};

const HAN = /\p{Script=Han}/u;

export const unitIdOf = (language: string, level: WordRushLevel | string, position: number) =>
  `${idPrefix(language)}${level.toLowerCase()}-u${String(position).padStart(2, '0')}`;

/** Una frase de lección como la arma loadSentences (con las variantes de Word Rush, si tiene). */
export interface LessonSentence extends ArcadeSentence {
  lessonId: string;
}

/** order_words de las lecciones publicadas, con el mismo id que en la base. Sin variantes. */
export function lessonSentences(language: WordRushLanguage): LessonSentence[] {
  const out: LessonSentence[] = [];
  for (const u of PUBLISHED_PATHS[language]) {
    const unitId = unitIdOf(language, u.level, u.unit.position);
    for (const lesson of u.lessons) {
      lesson.exercises.forEach((e, i) => {
        if (e.type !== 'order_words') return;
        const p = e.payload as { tokens?: unknown; translation?: unknown };
        if (!Array.isArray(p.tokens) || !p.tokens.every((t) => typeof t === 'string')) return;
        if (typeof p.translation !== 'string') return;
        out.push({
          id: pathExerciseId(lesson.id, lessonExerciseIndex(lesson, i)),
          lessonId: lesson.id,
          tokens: p.tokens as string[],
          answer: e.answer,
          acceptedAnswers: e.acceptedAnswers ?? [],
          translation: p.translation,
          unitId,
        });
      });
    }
  }
  return out;
}

/** Una frase nueva del banco como la leería el servidor. */
export function bankSentence(language: string, def: WordRushSentenceDef): ArcadeSentence {
  const han = HAN.test(def.sentence);
  return {
    id: def.id,
    tokens: tokensOf(def.sentence),
    answer: han ? joinHan(def.sentence) : def.sentence,
    acceptedAnswers: (def.accepted ?? []).map((a) => (han ? joinHan(a) : a)),
    translation: def.translation,
    unitId: unitIdOf(language, def.level, def.unit),
  };
}

/**
 * Todo lo que Word Rush podría usar en un curso: las frases de las lecciones publicadas (con los
 * órdenes válidos que les agrega el banco) y las frases nuevas del banco. Después pasa por los filtros
 * de siempre (sentencePool: nivel, largo, contenido roto, conectores, duplicados).
 */
export function wordRushSentences(language: WordRushLanguage): ArcadeSentence[] {
  const bank = WORD_RUSH_BANKS[language];
  const extra = new Map<string, string[]>();
  for (const v of bank.variants)
    extra.set(v.exercise, [...(extra.get(v.exercise) ?? []), ...v.accepted]);
  const lessons = lessonSentences(language).map(({ lessonId: _lesson, ...s }): ArcadeSentence => {
    const more = extra.get(s.id) ?? [];
    const han = HAN.test(s.answer);
    const accepted = [...s.acceptedAnswers, ...more.map((a) => (han ? joinHan(a) : a))];
    return { ...s, acceptedAnswers: [...new Set(accepted)] };
  });
  return [...lessons, ...bank.sentences.map((d) => bankSentence(language, d))];
}

/** Sólo las frases de las lecciones publicadas, sin nada del banco (el estado anterior). */
export function lessonOnlySentences(language: WordRushLanguage): ArcadeSentence[] {
  return lessonSentences(language).map(({ lessonId: _lesson, ...s }) => s);
}
