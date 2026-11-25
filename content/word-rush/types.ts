/**
 * Banco propio de Word Rush (Sentence Rush): frases que no están en las lecciones y variantes de orden
 * para frases que sí están. Nada de esto cambia lo que ve quien aprende: las lecciones quedan igual.
 * Ver docs/WORD_RUSH_CONTENT.md.
 */

export type WordRushLevel = 'A1' | 'A2';

/** Frase nueva para ordenar en Word Rush. */
export interface WordRushSentenceDef {
  /** Estable y único: `<idioma>.wr.<slug>`. */
  id: string;
  level: WordRushLevel;
  /**
   * Unidad (posición en su nivel) desde la que la frase se puede mostrar: sólo usa lo enseñado hasta
   * esa unidad. Con el filtro de unidades (rush_common_unit_ids), quien no la desbloqueó no la ve.
   */
  unit: number;
  /** En el idioma que se aprende, con su puntuación final (las fichas salen de acá, sin comas). */
  sentence: string;
  /** En el idioma de apoyo del curso (español; inglés en el curso de español): la consigna. */
  translation: string;
  /** Otros órdenes igual de naturales y correctos, con las mismas fichas. */
  accepted?: string[];
  /**
   * Revisada a mano: aunque tiene un adverbio de tiempo en un extremo, ningún otro orden es natural
   * (p. ej. «How about a movie tonight?»). Motivo breve.
   */
  onlyOrder?: string;
}

/** Frase de lección revisada a mano: ningún otro orden es natural (no necesita variantes). */
export interface WordRushOrderReviewDef {
  exercise: string;
  reason: string;
}

/** Órdenes válidos que le faltaban a una frase de una lección (no cambia la lección). */
export interface WordRushVariantDef {
  /** Id del ejercicio order_words en la base: pathExerciseId(lección, índice). */
  exercise: string;
  /** Otros órdenes igual de correctos, con las mismas fichas que la frase original. */
  accepted: string[];
  /** Por qué es válido (conector conmutativo, adverbio de tiempo móvil…). */
  reason: string;
}

export interface WordRushBank {
  language: string;
  sentences: readonly WordRushSentenceDef[];
  variants: readonly WordRushVariantDef[];
  /** Frases de lecciones con un único orden natural, aunque el control automático dude. */
  onlyOrder?: readonly WordRushOrderReviewDef[];
  /** Nombres propios que pueden aparecer sin estar enseñados (Ana, Roma…). */
  names: readonly string[];
}
