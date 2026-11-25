import {
  CHALLENGE_KINDS,
  availableKinds,
  contentIds,
  createChallengeStream,
  gradeArcade,
  sentencePool,
  type ArcadeChallenge,
  type ArcadeSentence,
} from '../../shared/arcade';
import { rushPool, wordLevel, type RushWord } from '../../shared/wordRush';
import { tokensOf } from '../builders';
import {
  PUBLISHED_PATHS,
  WORD_RUSH_BANKS,
  WORD_RUSH_LANGUAGES,
  lessonOnlySentences,
  unitIdOf,
  wordRushSentences,
  type WordRushLanguage,
} from '../word-rush';
import {
  BAND_RATING,
  CONNECTORS,
  bankProblems,
  connectorExcluded,
  multiOrderSuspects,
  untaughtTokens,
  type Band,
} from '../word-rush/checks';

/**
 * Banco de frases de Word Rush (content/word-rush, docs/WORD_RUSH_CONTENT.md): frases de las lecciones
 * publicadas con los órdenes que les faltaban, más frases nuevas de inglés y español A1. Todo con las
 * mismas funciones que el servidor (sentencePool, gradeArcade, createChallengeStream).
 */

const BANDS: Band[] = ['A1', 'A1+A2'];

/** Frases utilizables mínimas por idioma y franja (el banco no puede achicarse sin que se note). */
const MINIMUM: Record<WordRushLanguage, Record<Band, number>> = {
  en: { A1: 165, 'A1+A2': 185 },
  es: { A1: 167, 'A1+A2': 194 },
  it: { A1: 49, 'A1+A2': 66 },
  pt: { A1: 47, 'A1+A2': 79 },
  fr: { A1: 51, 'A1+A2': 80 },
  zh: { A1: 59, 'A1+A2': 71 },
};

const pool = (language: WordRushLanguage, band: Band) =>
  sentencePool(wordRushSentences(language), language, BAND_RATING[band]);

/** Desafío de Sentence Rush con las fichas en el orden canónico (como lo arma el servidor, sin mezclar). */
const challengeOf = (s: ArcadeSentence): Extract<ArcadeChallenge, { kind: 'sentence' }> => ({
  index: 0,
  kind: 'sentence',
  sentenceId: s.id,
  tokens: s.tokens,
  translation: s.translation,
  answers: [s.answer, ...s.acceptedAnswers],
});

/** Orden de fichas (índices) que arma `spaced` (con fichas repetidas, la primera libre). */
function orderFor(tokens: readonly string[], spaced: string): number[] | null {
  const used = new Set<number>();
  const order: number[] = [];
  for (const t of tokensOf(spaced)) {
    const i = tokens.findIndex((x, k) => !used.has(k) && x.toLowerCase() === t.toLowerCase());
    if (i < 0) return null;
    used.add(i);
    order.push(i);
  }
  return order.length === tokens.length ? order : null;
}

it('cubre los seis cursos', () => {
  expect([...WORD_RUSH_LANGUAGES].sort()).toEqual(['en', 'es', 'fr', 'it', 'pt', 'zh']);
});

describe.each(WORD_RUSH_LANGUAGES.map((l) => [l]))('%s', (language) => {
  const bank = WORD_RUSH_BANKS[language];

  it('el banco pasa todos los controles (nivel, fichas, variantes, duplicados, registro)', () => {
    expect(bankProblems(language)).toEqual([]);
  });

  it.each(BANDS.map((b) => [b]))(
    '%s: frases utilizables (nunca menos que sólo las lecciones, y al menos el mínimo)',
    (band) => {
      const before = sentencePool(lessonOnlySentences(language), language, BAND_RATING[band]);
      const now = pool(language, band);
      expect(now.length).toBeGreaterThanOrEqual(before.length);
      expect(now.length).toBeGreaterThanOrEqual(MINIMUM[language][band]);
    },
  );

  it.each(BANDS.map((b) => [b]))(
    '%s: Sentence Rush acepta el orden original de cada frase',
    (band) => {
      for (const s of pool(language, band)) {
        const order = s.tokens.map((_, i) => i);
        expect({
          id: s.id,
          ...gradeArcade(challengeOf(s), { kind: 'sentence', order }),
        }).toMatchObject({
          id: s.id,
          valid: true,
          correct: true,
        });
      }
    },
  );

  it('ninguna respuesta correcta declarada se rechaza: cada variante se acepta en Sentence Rush', () => {
    const byId = new Map(wordRushSentences(language).map((s) => [s.id, s]));
    const declared: [string, string][] = [
      ...bank.variants.flatMap((v) => v.accepted.map((a): [string, string] => [v.exercise, a])),
      ...bank.sentences.flatMap((d) => (d.accepted ?? []).map((a): [string, string] => [d.id, a])),
    ];
    for (const [id, variant] of declared) {
      const s = byId.get(id)!;
      const order = orderFor(s.tokens, variant);
      expect({ id, variant, order: order !== null }).toEqual({ id, variant, order: true });
      const graded = gradeArcade(challengeOf(s), { kind: 'sentence', order: order! });
      expect({ id, variant, ...graded }).toMatchObject({ valid: true, correct: true });
    }
  });

  it('cada frase con conector del pool acepta otro orden con exactamente las mismas fichas', () => {
    // Las respuestas aceptadas de las lecciones también incluyen contracciones (I'm = I am): acá se
    // pide que al menos una sea un reordenamiento real, que es lo que justifica el conector.
    // Los conectores de cada idioma (en francés «ma» es «mi», no el «ma» = «pero» del italiano).
    const connectors = new Set(CONNECTORS[language]);
    const letters = (x: string) =>
      [...x.toLowerCase().replace(/[\s.,!?¿¡。！？，]/g, '')].sort().join('');
    for (const band of BANDS) {
      for (const s of pool(language, band)) {
        if (!s.tokens.some((t) => connectors.has(t.toLowerCase()))) continue;
        const own = letters(s.tokens.join(''));
        const reordered = s.acceptedAnswers.filter(
          (a) => letters(a) === own && letters(a) !== '' && a.trim() !== s.answer.trim(),
        );
        expect({ id: s.id, reordered: reordered.length > 0 }).toEqual({
          id: s.id,
          reordered: true,
        });
      }
    }
  });

  it('ninguna frase con un adverbio de tiempo en un extremo queda sin su otro orden (ni revisar)', () => {
    for (const band of BANDS)
      expect(multiOrderSuspects(language, band).map((s) => s.id)).toEqual([]);
  });

  it('las frases nuevas usan sólo vocabulario enseñado hasta su unidad', () => {
    for (const def of bank.sentences)
      expect({ id: def.id, untaught: untaughtTokens(language, def) }).toEqual({
        id: def.id,
        untaught: [],
      });
  });

  it('sin duplicados: ni dos frases iguales en el pool ni traducciones repetidas en el banco', () => {
    for (const band of BANDS) {
      const keys = pool(language, band).map((s) => s.tokens.join(' ').toLowerCase());
      expect(new Set(keys).size).toBe(keys.length);
    }
    const translations = bank.sentences.map((d) => d.translation.trim().toLowerCase());
    expect(new Set(translations).size).toBe(translations.length);
  });

  describe.each(BANDS.map((b) => [b]))('%s', (band) => {
    const words: RushWord[] = PUBLISHED_PATHS[language].flatMap((u) =>
      u.unit.words.map((w) => ({
        id: w.id,
        text: w.text,
        translationEs: w.translation,
        level: wordLevel(unitIdOf(language, u.level, u.unit.position)),
        unitId: unitIdOf(language, u.level, u.unit.position),
      })),
    );

    it('los cuatro formatos tienen contenido y una partida de 60 desafíos no repite frases', () => {
      const words$ = rushPool(words, BAND_RATING[band]);
      const sentences = pool(language, band);
      expect([...availableKinds(words$, sentences)].sort()).toEqual([...CHALLENGE_KINDS].sort());
      let seed = 7;
      const random = () => {
        seed = (seed * 16_807) % 2_147_483_647;
        return seed / 2_147_483_647;
      };
      const stream = createChallengeStream(words$, sentences, random);
      const ids = contentIds(stream.challenges.slice(0, 60));
      expect(new Set(ids.sentences).size).toBe(ids.sentences.length);
      expect(new Set(ids.words).size).toBe(ids.words.length);
    });
  });
});

/**
 * Frases de lecciones con conector que quedan fuera: su orden es único (una hora, una secuencia, una
 * fórmula), así que no se les inventa una variante. Lista fija: cualquier cambio se revisa a mano.
 */
const CONNECTOR_ONLY_ORDER: Record<WordRushLanguage, string[]> = {
  // «We packed our suitcases and left.»: dos acciones en secuencia.
  en: ['a2-u04-l05-e07'],
  // «Son las ocho y cuarto.»: la hora.
  es: ['es-a1-u09-l01-e08', 'es-a1-u09-rev1-e02'],
  it: ['it-a1-u09-l02-e06'],
  pt: [
    'pt-a1-u01-l05-e05',
    'pt-a1-u01-final-e05',
    'pt-a1-u09-l02-e06',
    'pt-a1-u09-rev1-e04',
    'pt-a1-u10-l04-e06',
    'pt-a1-u10-rev2-e01',
    'pt-a2-u12-l04-e08',
  ],
  fr: [],
  zh: [],
};

describe('lo que queda fuera por el conector es sólo lo revisado (orden único)', () => {
  it.each(WORD_RUSH_LANGUAGES.map((l) => [l]))('%s', (language) => {
    const ids = connectorExcluded(language, 'A1+A2').map((s) => s.id);
    expect(ids.sort()).toEqual([...CONNECTOR_ONLY_ORDER[language]].sort());
  });
});
