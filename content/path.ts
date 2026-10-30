import { ex } from './builders';
import type { ExerciseDef, LessonDef, UnitDef, WordDef } from './types';

/**
 * Camino completo de una unidad: las lecciones escritas a mano más lecciones de consolidación
 * generadas a partir de ellas (sin palabras nuevas), intercaladas como en un sendero:
 *
 *   L1 · L2 · Repaso · L3 · L4 · Repaso · L5 · Escucha · Palabras · Repaso final
 *
 * La generación es determinística (misma entrada → mismo contenido) y conservadora: sólo arma
 * ejercicios de traducción cuando la respuesta no es ambigua con otra palabra del currículo.
 * Las lecciones escritas conservan su id (a1-uNN-lNN) para no perder el progreso de nadie.
 */

export type PathLessonKind = 'lesson' | 'review' | 'listening' | 'words' | 'final';

export interface PathLesson extends LessonDef {
  id: string;
  kind: PathLessonKind;
  /** 1-based dentro de la unidad; define el orden de desbloqueo. */
  position: number;
}

/** Ejercicios por lección generada (el contenido escrito usa 6–10). */
const GENERATED_SIZE = 10;
/** Cada cuántas lecciones escritas se intercala un repaso. */
const REVIEW_EVERY = 2;

const SENTENCE_TYPES = new Set(['order_words', 'fill_blank', 'short_answer', 'translate_write']);

const plain = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[¿?¡!.,]/g, '')
    .trim()
    .toLowerCase();

const meanings = (w: WordDef) =>
  new Set([w.translation, ...(w.acceptedTranslations ?? [])].map(plain).filter(Boolean));

const overlaps = (a: Set<string>, b: Set<string>) => [...a].some((x) => b.has(x));

/** Se escribe igual en los dos idiomas (hotel, banana, México): traducirla no enseña nada. */
const isCognate = (w: WordDef) => meanings(w).has(plain(w.text));

/** Consigna en español para escribir la palabra: sin las aclaraciones entre paréntesis. */
const writeSource = (w: WordDef) => w.translation.replace(/\s*\(.*?\)/g, '').trim();

/** PRNG determinístico (mulberry32) a partir de un texto. */
function random(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], seed: string): T[] {
  const next = random(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

/** «hello» → «h_l_o»: conserva la primera letra de cada palabra y oculta una de cada dos. */
function mask(text: string): string {
  return text
    .split(' ')
    .map((token) =>
      [...token].map((ch, i) => (i > 0 && i % 2 === 1 && /\p{L}/u.test(ch) ? '_' : ch)).join(''),
    )
    .join(' ');
}

class Generator {
  private readonly byId: Map<string, WordDef>;

  constructor(
    private readonly unit: UnitDef,
    /** Todas las palabras del currículo: para detectar traducciones ambiguas. */
    private readonly allWords: readonly WordDef[],
  ) {
    this.byId = new Map(allWords.map((w) => [w.id, w]));
  }

  word(id: string) {
    return this.byId.get(id);
  }

  /** Distractores del mismo tipo tomados de la unidad, sin chocar en significado con `w`. */
  private distractors(w: WordDef, pick: (d: WordDef) => string, seed: string): string[] | null {
    const target = plain(pick(w));
    const seen = new Set([target]);
    const out: string[] = [];
    for (const d of shuffled(this.unit.words, seed)) {
      const value = pick(d);
      if (d.id === w.id || seen.has(plain(value)) || overlaps(meanings(d), meanings(w))) continue;
      if (d.ipa === w.ipa) continue; // homófonos: imposibles de distinguir de oído
      seen.add(plain(value));
      out.push(value);
      if (out.length === 3) return out;
    }
    return null;
  }

  translationChoice(w: WordDef, seed: string): ExerciseDef | null {
    if (isCognate(w)) return null;
    const options = this.distractors(w, (d) => d.translation, seed);
    return options ? ex.translationChoice(w.text, w.translation, options, [w.id]) : null;
  }

  listenChoice(w: WordDef, seed: string): ExerciseDef | null {
    // Un artículo suelto («a») la voz sintetizada lo lee como letra: no sirve de oído.
    if (w.tags.includes('articles')) return null;
    const options = this.distractors(w, (d) => d.text, seed);
    return options ? ex.listenChoice(w.text, options, [w.id]) : null;
  }

  completeWord(w: WordDef): ExerciseDef | null {
    // En un cognado la pista (la traducción) ya es la respuesta.
    if (w.text.replace(/\s/g, '').length < 4 || isCognate(w)) return null;
    return ex.completeWord(mask(w.text), w.text, w.translation, [w.id]);
  }

  /**
   * Español → inglés sólo si ninguna otra palabra comparte significado (respuesta única).
   * Acepta las otras formas válidas en inglés de la palabra (`acceptedTexts`).
   */
  translateWrite(w: WordDef): ExerciseDef | null {
    const m = meanings(w);
    const ambiguous = this.allWords.some((d) => d.id !== w.id && overlaps(meanings(d), m));
    if (ambiguous || isCognate(w)) return null;
    return ex.translateWrite(
      writeSource(w),
      w.text,
      [w.id],
      w.acceptedTexts?.length ? { acceptedAnswers: w.acceptedTexts } : {},
    );
  }

  /** Une 4 palabras con su significado; todas distintas entre sí en texto y significado. */
  matchPairs(words: readonly WordDef[]): ExerciseDef | null {
    const chosen: WordDef[] = [];
    for (const w of words) {
      if (isCognate(w)) continue;
      const clash = chosen.some(
        (c) =>
          plain(c.text) === plain(w.text) ||
          plain(c.translation) === plain(w.translation) ||
          overlaps(meanings(c), meanings(w)),
      );
      if (!clash) chosen.push(w);
      if (chosen.length === 4) break;
    }
    if (chosen.length < 4) return null;
    return ex.matchPairs(
      chosen.map((w) => [w.text, w.translation]),
      chosen.map((w) => w.id),
    );
  }

  /**
   * Ejercicios de palabra rotando formatos; si un formato no aplica a una palabra
   * (p. ej. traducción ambigua) se prueba el siguiente.
   */
  wordExercises(
    words: readonly WordDef[],
    formats: readonly ('choice' | 'listen' | 'complete' | 'write')[],
    count: number,
    seed: string,
  ): ExerciseDef[] {
    const out: ExerciseDef[] = [];
    words.forEach((w, i) => {
      if (out.length >= count) return;
      for (let k = 0; k < formats.length; k++) {
        const format = formats[(i + k) % formats.length];
        const made =
          format === 'choice'
            ? this.translationChoice(w, `${seed}:${w.id}`)
            : format === 'listen'
              ? this.listenChoice(w, `${seed}:${w.id}`)
              : format === 'complete'
                ? this.completeWord(w)
                : this.translateWrite(w);
        if (made) {
          out.push(made);
          return;
        }
      }
    });
    return out;
  }
}

const unitKey = (unit: UnitDef) => `a1-u${String(unit.position).padStart(2, '0')}`;

/** Palabras practicadas en unas lecciones (sin repetir, en orden de aparición). */
function wordsOf(lessons: readonly LessonDef[], gen: Generator): WordDef[] {
  const ids = [...new Set(lessons.flatMap((l) => l.exercises.flatMap((e) => e.words)))];
  return ids.flatMap((id) => {
    const w = gen.word(id);
    return w ? [w] : [];
  });
}

/** Ejercicios de frase escritos a mano, priorizando los que todavía no se reutilizaron. */
function sentences(
  lessons: readonly LessonDef[],
  perLesson: number,
  used: Set<ExerciseDef>,
  seed: string,
): ExerciseDef[] {
  return lessons.flatMap((lesson, i) => {
    const pool = shuffled(
      lesson.exercises.filter((e) => SENTENCE_TYPES.has(e.type)),
      `${seed}:${i}`,
    ).sort((a, b) => Number(used.has(a)) - Number(used.has(b)));
    const picked = pool.slice(0, perLesson);
    picked.forEach((e) => used.add(e));
    return picked;
  });
}

export function unitPath(unit: UnitDef, allWords: readonly WordDef[]): PathLesson[] {
  const gen = new Generator(unit, allWords);
  const key = unitKey(unit);
  const used = new Set<ExerciseDef>();
  const path: Omit<PathLesson, 'position'>[] = [];
  let reviews = 0;

  unit.lessons.forEach((lesson, i) => {
    path.push({ ...lesson, id: `${key}-l${String(i + 1).padStart(2, '0')}`, kind: 'lesson' });
    const isLast = i === unit.lessons.length - 1;
    if ((i + 1) % REVIEW_EVERY !== 0 || isLast) return;

    reviews += 1;
    const covered = unit.lessons.slice(i + 1 - REVIEW_EVERY, i + 1);
    const seed = `${key}-rev${reviews}`;
    const sentenceExercises = sentences(covered, 2, used, seed);
    const words = shuffled(wordsOf(covered, gen), seed);
    const pairs = gen.matchPairs(words);
    const wordExercises = gen.wordExercises(
      words,
      ['choice', 'listen', 'complete', 'write'],
      GENERATED_SIZE - sentenceExercises.length - (pairs ? 1 : 0),
      seed,
    );
    path.push({
      id: seed,
      kind: 'review',
      title: `Repaso ${reviews}`,
      objective: `Consolidar ${covered.map((l) => `«${l.title}»`).join(' y ')}.`,
      exercises: shuffled(
        [...(pairs ? [pairs] : []), ...sentenceExercises, ...wordExercises],
        seed,
      ),
    });
  });

  const unitWords = unit.words;

  // Escucha: frases que ya escuchaste en la unidad + reconocer cada palabra de oído.
  {
    const seed = `${key}-listen`;
    const authored = shuffled(
      unit.lessons.flatMap((l) => l.exercises.filter((e) => e.type === 'listen_choice')),
      seed,
    ).slice(0, 3);
    const words = shuffled(unitWords, seed);
    path.push({
      id: seed,
      kind: 'listening',
      title: 'Práctica de escucha',
      objective: 'Reconocer de oído las palabras y frases de la unidad.',
      exercises: shuffled(
        [
          ...authored,
          ...gen.wordExercises(words, ['listen'], GENERATED_SIZE - authored.length, seed),
        ],
        seed,
      ),
    });
  }

  // Palabras: todo el vocabulario de la unidad en formatos de reconocimiento y escritura.
  {
    const seed = `${key}-words`;
    const words = shuffled(unitWords, seed);
    const pairs = [gen.matchPairs(words), gen.matchPairs([...words].reverse())].filter(
      (p): p is ExerciseDef => p !== null,
    );
    path.push({
      id: seed,
      kind: 'words',
      title: 'Palabras de la unidad',
      objective: 'Fijar el vocabulario de la unidad: reconocerlo y escribirlo.',
      exercises: shuffled(
        [
          ...pairs,
          ...gen.wordExercises(
            words.slice(4),
            ['write', 'complete', 'choice'],
            GENERATED_SIZE - pairs.length,
            seed,
          ),
        ],
        seed,
      ),
    });
  }

  // Repaso final: una frase de cada lección + vocabulario mezclado. Cierra la unidad.
  {
    const seed = `${key}-final`;
    const sentenceExercises = sentences(unit.lessons, 1, used, seed);
    const words = shuffled(unitWords, seed);
    const pairs = gen.matchPairs(words);
    path.push({
      id: seed,
      kind: 'final',
      title: 'Repaso final',
      objective: `Demostrar todo lo de «${unit.title}».`,
      exercises: shuffled(
        [
          ...(pairs ? [pairs] : []),
          ...sentenceExercises,
          ...gen.wordExercises(
            words.slice(4),
            ['write', 'listen', 'choice', 'complete'],
            GENERATED_SIZE - sentenceExercises.length - (pairs ? 1 : 0),
            seed,
          ),
        ],
        seed,
      ),
    });
  }

  return path.map((lesson, i) => ({ ...lesson, position: i + 1 }));
}

export const pathExerciseId = (lessonId: string, index: number) =>
  `${lessonId}-e${String(index + 1).padStart(2, '0')}`;
