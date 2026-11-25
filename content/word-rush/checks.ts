import { verdictForText } from '../../shared/answers';
import { ARCADE, sentencePool, type ArcadeSentence } from '../../shared/arcade';
import { TIERS } from '../../shared/ranking';
import { wordLevel } from '../../shared/wordRush';
import { isTaughtToken, taughtFormsBefore } from '../a2-expansion-checks';
import { tokensOf } from '../builders';
import { tokensOfText } from '../comprehension';
import { ES_COURSE } from '../es-course';
import { esLemmas, esTaughtFormsBefore, esTokens } from '../es-checks';
import { CURRICULUM_PATH, type PathUnit } from '../index';
import { englishTexts } from '../supplement-checks';
import type { WordDef } from '../types';
import {
  PUBLISHED_PATHS,
  WORD_RUSH_BANKS,
  WORD_RUSH_LANGUAGES,
  bankSentence,
  lessonSentences,
  wordRushSentences,
  type WordRushLanguage,
} from './index';
import type { WordRushSentenceDef } from './types';

const SILVER = TIERS.find((t) => t.id === 'silver')!.minRating;
/** Rating con el que se arma el pool de cada franja: Bronce (sólo A1) o Plata (A1 + A2). */
export const BAND_RATING = { A1: 0, 'A1+A2': SILVER } as const;
export type Band = keyof typeof BAND_RATING;

const ENDS = /[.!?。！？]$/;
const norm = (s: string) =>
  s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[¿?¡!.,。！？，]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const tokenKey = (tokens: readonly string[]) =>
  tokens
    .map((t) => t.toLowerCase())
    .sort()
    .join(' ');
const answerKey = (tokens: readonly string[]) => tokens.map((t) => t.toLowerCase()).join(' ');

/**
 * Adverbios de tiempo de una ficha que en una frase corta suelen poder ir al principio o al final
 * («Today I work» / «I work today»). Una frase que empieza o termina con uno necesita la otra forma
 * como variante aceptada (o es sospechosa de rechazar una respuesta correcta).
 */
export const MOVABLE: Record<WordRushLanguage, readonly string[]> = {
  en: ['today', 'tomorrow', 'yesterday', 'now', 'tonight', 'sometimes', 'usually'],
  es: ['hoy', 'ayer', 'ahora', 'luego', 'después'],
  it: ['oggi', 'domani', 'ieri', 'adesso', 'ora', 'stasera', 'stamattina'],
  pt: ['hoje', 'amanhã', 'ontem', 'agora'],
  fr: ["aujourd'hui", 'demain', 'hier', 'maintenant'],
  zh: ['今天', '明天', '昨天', '现在', '早上', '晚上', '中午', '下午', '上午'],
};

/** Conectores que permiten reordenar (mismo criterio que sentencePool en shared/arcade.ts). */
export const CONNECTORS: Record<WordRushLanguage, readonly string[]> = {
  en: ['and', 'or', 'but'],
  es: ['y', 'e', 'o', 'u', 'pero'],
  fr: ['et', 'ou', 'mais'],
  it: ['e', 'ed', 'o', 'ma'],
  pt: ['e', 'ou', 'mas'],
  zh: ['和', '跟', '或者', '还是', '但是', '可是'],
};

/** Formas del voseo que no van en el español neutro (con tú) del curso de español. */
const VOSEO = new Set([
  'vos',
  'sos',
  'tenés',
  'querés',
  'podés',
  'sabés',
  'hablás',
  'comés',
  'vivís',
  'venís',
  'hacés',
  'decís',
  'estudiás',
  'trabajás',
  'necesitás',
]);
/** Formas del tuteo: las traducciones del curso de inglés van con voseo, como toda la app. */
const TUTEO = new Set([
  'tú',
  'tienes',
  'eres',
  'quieres',
  'puedes',
  'sabes',
  'vives',
  'hablas',
  'necesitas',
  'estudias',
  'trabajas',
]);

// ---------------------------------------------------------------------------------------------
// Vocabulario enseñado (sólo en los idiomas con validador; el resto no puede tener frases nuevas)

const formsOf = (w: WordDef) => [w.text, ...(w.acceptedTexts ?? [])].flatMap(tokensOfText);

function addEnglishForms(out: Set<string>, p: PathUnit) {
  p.unit.words.flatMap(formsOf).forEach((t) => out.add(t));
  p.unit.words.flatMap((w) => tokensOfText(w.exampleEn)).forEach((t) => out.add(t));
  for (const l of p.lessons) {
    for (const x of l.intro?.examples ?? []) tokensOfText(x.target).forEach((t) => out.add(t));
    for (const e of l.exercises)
      englishTexts(e)
        .flatMap(tokensOfText)
        .forEach((t) => out.add(t));
  }
}

/** Inglés A1: lo enseñado en las unidades publicadas 1…`unit` (la ruta v1, en orden). */
function englishA1UpTo(unit: number): Set<string> {
  const out = new Set<string>();
  for (const p of CURRICULUM_PATH)
    if (p.language === 'en' && p.level === 'A1' && p.unit.position <= unit) addEnglishForms(out, p);
  return out;
}

const A1_ES_UNITS = ES_COURSE.find((l) => l.level === 'A1')!.units.length;

/** Fichas de la frase que no están enseñadas hasta su unidad (vacío = nivel correcto). */
export function untaughtTokens(language: WordRushLanguage, def: WordRushSentenceDef): string[] {
  const names = new Set(
    WORD_RUSH_BANKS[language].names.flatMap((n) =>
      language === 'es' ? esTokens(n) : tokensOfText(n),
    ),
  );
  if (language === 'en') {
    const taught =
      def.level === 'A1' ? englishA1UpTo(def.unit) : taughtFormsBefore('en', def.unit + 1);
    return tokensOfText(def.sentence).filter(
      (t) => !names.has(t) && !isTaughtToken(t, (lemma) => taught.has(lemma)),
    );
  }
  if (language === 'es') {
    const index = def.level === 'A1' ? def.unit - 1 : A1_ES_UNITS + def.unit - 1;
    const taught = esTaughtFormsBefore(index + 1);
    return esTokens(def.sentence).filter(
      (t) => !names.has(t) && !esLemmas(t).some((l) => taught.has(l)),
    );
  }
  return [];
}

const VALIDATED: readonly WordRushLanguage[] = ['en', 'es'];

// ---------------------------------------------------------------------------------------------
// Problemas (vacío = válido)

function sameTokens(a: readonly string[], b: readonly string[]): boolean {
  return tokenKey(a) === tokenKey(b);
}

const movableAtEdge = (language: WordRushLanguage, tokens: readonly string[]) => {
  const set = new Set(MOVABLE[language]);
  const lower = tokens.map((t) => t.toLowerCase());
  if (language === 'zh') return lower.slice(0, 2).some((t) => set.has(t));
  return set.has(lower[0]!) || set.has(lower[lower.length - 1]!);
};

export function bankProblems(language: WordRushLanguage): string[] {
  const bank = WORD_RUSH_BANKS[language];
  const problems: string[] = [];
  const at = (id: string) => `${language} ${id}`;
  if (bank.language !== language) problems.push(`${language}: el banco dice ${bank.language}`);

  if (!VALIDATED.includes(language) && bank.sentences.length > 0) {
    problems.push(
      `${language}: frases nuevas sin validador de vocabulario (agregar uno antes de sumar frases)`,
    );
  }

  const lessons = lessonSentences(language);
  const lessonIds = new Set(lessons.map((s) => s.id));
  const lessonAnswers = new Set(lessons.map((s) => answerKey(s.tokens)));
  const lessonTranslations = new Set(lessons.map((s) => norm(s.translation)));
  const units = new Set(PUBLISHED_PATHS[language].map((p) => `${p.level}:${p.unit.position}`));

  const ids = new Set<string>();
  const answers = new Set<string>();
  const translations = new Set<string>();
  for (const def of bank.sentences) {
    const where = at(def.id);
    if (!def.id.startsWith(`${language}.wr.`) || !/^[a-z]{2}\.wr\.[a-z0-9-]+$/.test(def.id))
      problems.push(`${where}: id con formato <idioma>.wr.<slug>`);
    if (ids.has(def.id) || lessonIds.has(def.id)) problems.push(`${where}: id repetido`);
    ids.add(def.id);
    if (!units.has(`${def.level}:${def.unit}`))
      problems.push(`${where}: la unidad ${def.level} U${def.unit} no está publicada`);

    const s = bankSentence(language, def);
    if (!ENDS.test(def.sentence)) problems.push(`${where}: la frase termina sin puntuación`);
    if (/[¿¡]/.test(def.sentence)) problems.push(`${where}: ¿ o ¡ en las fichas delatan el orden`);
    if (s.tokens.length < ARCADE.sentenceTokens.min || s.tokens.length > ARCADE.sentenceTokens.max)
      problems.push(`${where}: ${s.tokens.length} fichas (Word Rush usa 3–6)`);
    if (!def.translation.trim() || !ENDS.test(def.translation.trim()))
      problems.push(`${where}: traducción vacía o sin puntuación final`);
    if (norm(def.translation) === norm(def.sentence))
      problems.push(`${where}: la traducción repite la frase`);

    const key = answerKey(s.tokens);
    if (answers.has(key) || lessonAnswers.has(key))
      problems.push(`${where}: la frase ya está (en el banco o en una lección)`);
    answers.add(key);
    const tKey = norm(def.translation);
    if (translations.has(tKey) || lessonTranslations.has(tKey))
      problems.push(`${where}: la traducción ya está en otra frase («${def.translation}»)`);
    translations.add(tKey);

    const seen = new Set([norm(def.sentence)]);
    for (const a of def.accepted ?? []) {
      if (!ENDS.test(a)) problems.push(`${where}: variante «${a}» sin puntuación final`);
      if (!sameTokens(tokensOf(a), s.tokens))
        problems.push(`${where}: la variante «${a}» no usa exactamente las mismas fichas`);
      if (seen.has(norm(a))) problems.push(`${where}: variante repetida «${a}»`);
      seen.add(norm(a));
      if (!verdictForText(a, s.acceptedAnswers, false).correct)
        problems.push(`${where}: el corrector no acepta la variante «${a}»`);
    }

    const rating = def.level === 'A1' ? BAND_RATING.A1 : BAND_RATING['A1+A2'];
    if (sentencePool([s], language, rating).length !== 1)
      problems.push(`${where}: no pasa los filtros de Word Rush (largo, conector sin variante…)`);
    if (movableAtEdge(language, s.tokens) && s.acceptedAnswers.length === 0 && !def.onlyOrder)
      problems.push(
        `${where}: el adverbio de tiempo puede ir en otro lugar: falta la variante (u onlyOrder con motivo)`,
      );
    if (def.onlyOrder !== undefined && !def.onlyOrder.trim())
      problems.push(`${where}: onlyOrder necesita el motivo`);

    const untaught = untaughtTokens(language, def);
    if (untaught.length > 0)
      problems.push(
        `${where}: no enseñado hasta ${def.level} U${def.unit}: ${untaught.join(', ')}`,
      );

    if (language === 'es') {
      const voseo = esTokens(def.sentence).filter((t) => VOSEO.has(t));
      if (voseo.length > 0) problems.push(`${where}: voseo en el curso de español: ${voseo}`);
    }
    if (language === 'en') {
      const tuteo = esTokens(def.translation).filter((t) => TUTEO.has(t));
      if (tuteo.length > 0)
        problems.push(`${where}: la traducción usa tú (la app usa vos): ${tuteo.join(', ')}`);
    }
  }

  const byId = new Map(lessons.map((s) => [s.id, s]));
  const variantIds = new Set<string>();
  for (const v of bank.variants) {
    const where = at(`variante ${v.exercise}`);
    const original = byId.get(v.exercise);
    if (!original) {
      problems.push(`${where}: no existe ese order_words publicado`);
      continue;
    }
    if (variantIds.has(v.exercise)) problems.push(`${where}: el ejercicio tiene dos entradas`);
    variantIds.add(v.exercise);
    if (!v.reason.trim()) problems.push(`${where}: falta el motivo`);
    if (v.accepted.length === 0) problems.push(`${where}: sin variantes`);
    const seen = new Set([original.answer, ...original.acceptedAnswers].map(norm));
    for (const a of v.accepted) {
      if (!ENDS.test(a)) problems.push(`${where}: «${a}» sin puntuación final`);
      if (!sameTokens(tokensOf(a), original.tokens))
        problems.push(`${where}: «${a}» no usa exactamente las fichas de la frase`);
      if (seen.has(norm(a))) problems.push(`${where}: «${a}» ya estaba aceptada`);
      seen.add(norm(a));
    }
  }
  const reviewed = new Set<string>();
  for (const r of bank.onlyOrder ?? []) {
    const where = at(`orden revisado ${r.exercise}`);
    if (!byId.has(r.exercise)) problems.push(`${where}: no existe ese order_words publicado`);
    if (variantIds.has(r.exercise)) problems.push(`${where}: también tiene variantes`);
    if (reviewed.has(r.exercise)) problems.push(`${where}: repetido`);
    reviewed.add(r.exercise);
    if (!r.reason.trim()) problems.push(`${where}: falta el motivo`);
  }
  return problems;
}

export function wordRushProblems(): string[] {
  return WORD_RUSH_LANGUAGES.flatMap(bankProblems);
}

// ---------------------------------------------------------------------------------------------
// Informes (auditoría): no fallan, describen el estado

export type DiscardReason = 'level' | 'long' | 'short' | 'broken' | 'connector' | 'duplicate';

/** Por qué cada frase queda fuera de una franja (con el mismo orden de filtros que sentencePool). */
export function discardReasons(
  sentences: readonly ArcadeSentence[],
  language: WordRushLanguage,
  band: Band,
): Record<DiscardReason, number> {
  const out: Record<DiscardReason, number> = {
    level: 0,
    long: 0,
    short: 0,
    broken: 0,
    connector: 0,
    duplicate: 0,
  };
  const levels = band === 'A1' ? ['A1'] : ['A1', 'A2'];
  const connectors = new Set(CONNECTORS[language]);
  const seen = new Set<string>();
  for (const s of sentences) {
    const level = wordLevel(s.unitId);
    if (level === null || !levels.includes(level)) out.level++;
    else if (s.tokens.length > ARCADE.sentenceTokens.max) out.long++;
    else if (s.tokens.length < ARCADE.sentenceTokens.min) out.short++;
    else if (!verdictForText(s.tokens.join(' '), [s.answer], false).correct) out.broken++;
    else if (
      s.tokens.some((t) => connectors.has(t.toLowerCase())) &&
      s.acceptedAnswers.length === 0
    )
      out.connector++;
    else if (seen.has(s.tokens.join(' ').toLowerCase())) out.duplicate++;
    else seen.add(s.tokens.join(' ').toLowerCase());
  }
  return out;
}

/**
 * Frases del pool que empiezan o terminan con un adverbio de tiempo móvil, no aceptan otro orden y no
 * fueron revisadas a mano como de orden único.
 */
export function multiOrderSuspects(language: WordRushLanguage, band: Band): ArcadeSentence[] {
  const bank = WORD_RUSH_BANKS[language];
  const reviewed = new Set([
    ...(bank.onlyOrder ?? []).map((r) => r.exercise),
    ...bank.sentences.filter((s) => s.onlyOrder).map((s) => s.id),
  ]);
  return sentencePool(wordRushSentences(language), language, BAND_RATING[band]).filter(
    (s) =>
      movableAtEdge(language, s.tokens) && s.acceptedAnswers.length === 0 && !reviewed.has(s.id),
  );
}

/** Frases de lecciones (en la franja) que quedan fuera sólo por tener un conector sin variantes. */
export function connectorExcluded(language: WordRushLanguage, band: Band): ArcadeSentence[] {
  const levels = band === 'A1' ? ['A1'] : ['A1', 'A2'];
  const connectors = new Set(CONNECTORS[language]);
  return wordRushSentences(language).filter((s) => {
    const level = wordLevel(s.unitId);
    if (level === null || !levels.includes(level)) return false;
    if (s.tokens.length > ARCADE.sentenceTokens.max) return false;
    if (s.tokens.length < ARCADE.sentenceTokens.min) return false;
    return s.tokens.some((t) => connectors.has(t.toLowerCase())) && s.acceptedAnswers.length === 0;
  });
}
