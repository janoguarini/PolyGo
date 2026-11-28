/**
 * Consignas y títulos de lo que se GENERA (ejercicios de repaso y lecciones de consolidación,
 * content/builders.ts y content/path.ts) en los cursos de inglés localizados (docs/EN_MULTI_SOURCE.md).
 * Lo escrito se localiza con el catálogo; esto cubre sólo lo que arma el código.
 *
 * Clave: el espacio de ids del curso (`ept`, `eit`, `efr`), que es el `language` de sus PathUnit.
 * Sin dependencias: lo importan builders.ts y path.ts.
 */

export const EN_SRC_NAMESPACES = { pt: 'ept', it: 'eit', fr: 'efr' } as const;
export type EnSrcNamespace = (typeof EN_SRC_NAMESPACES)[keyof typeof EN_SRC_NAMESPACES];

export interface PromptTexts {
  image: string;
  meaning: (word: string) => string;
  translate: string;
  complete: string;
  fill: string;
  order: string;
  listen: string;
  match: string;
  answer: string;
}

export interface PathTexts {
  review: (n: number) => string;
  reviewObjective: (titles: string[]) => string;
  listening: string;
  listeningObjective: string;
  words: string;
  wordsObjective: string;
  final: string;
  finalObjective: (title: string) => string;
}

const curly = (t: string) => `“${t}”`;
const guillemets = (t: string) => `« ${t} »`;

const PROMPTS: Record<EnSrcNamespace, PromptTexts> = {
  ept: {
    image: 'O que a imagem mostra?',
    meaning: (w) => `O que significa ${curly(w)}?`,
    translate: 'Traduza para o inglês',
    complete: 'Escreva a palavra completa',
    fill: 'Complete a frase',
    order: 'Ordene as palavras',
    listen: 'Ouça e escolha o que você ouve',
    match: 'Una cada palavra ao seu significado',
    answer: 'Responda em inglês',
  },
  eit: {
    image: 'Che cosa mostra l’immagine?',
    meaning: (w) => `Che cosa significa ${curly(w)}?`,
    translate: 'Traduci in inglese',
    complete: 'Scrivi la parola completa',
    fill: 'Completa la frase',
    order: 'Metti le parole in ordine',
    listen: 'Ascolta e scegli quello che senti',
    match: 'Abbina ogni parola al suo significato',
    answer: 'Rispondi in inglese',
  },
  efr: {
    image: 'Que montre l’image ?',
    meaning: (w) => `Que veut dire ${guillemets(w)} ?`,
    translate: 'Traduis en anglais',
    complete: 'Écris le mot en entier',
    fill: 'Complète la phrase',
    order: 'Remets les mots dans l’ordre',
    listen: 'Écoute et choisis ce que tu entends',
    match: 'Associe chaque mot à sa signification',
    answer: 'Réponds en anglais',
  },
};

const PATH: Record<EnSrcNamespace, PathTexts> = {
  ept: {
    review: (n) => `Revisão ${n}`,
    reviewObjective: (titles) => `Consolidar ${titles.map(curly).join(' e ')}.`,
    listening: 'Prática de escuta',
    listeningObjective: 'Reconhecer de ouvido as palavras e frases da unidade.',
    words: 'Palavras da unidade',
    wordsObjective: 'Fixar o vocabulário da unidade: reconhecer e escrever.',
    final: 'Revisão final',
    finalObjective: (title) => `Mostrar tudo o que você aprendeu em ${curly(title)}.`,
  },
  eit: {
    review: (n) => `Ripasso ${n}`,
    reviewObjective: (titles) => `Consolidare ${titles.map(curly).join(' e ')}.`,
    listening: 'Pratica di ascolto',
    listeningObjective: 'Riconoscere a orecchio le parole e le frasi dell’unità.',
    words: 'Parole dell’unità',
    wordsObjective: 'Fissare il vocabolario dell’unità: riconoscerlo e scriverlo.',
    final: 'Ripasso finale',
    finalObjective: (title) => `Dimostrare tutto quello che hai imparato in ${curly(title)}.`,
  },
  efr: {
    review: (n) => `Révision ${n}`,
    reviewObjective: (titles) => `Consolider ${titles.map(guillemets).join(' et ')}.`,
    listening: 'Entraînement à l’écoute',
    listeningObjective: 'Reconnaître à l’oral les mots et les phrases de l’unité.',
    words: 'Mots de l’unité',
    wordsObjective: 'Fixer le vocabulaire de l’unité : le reconnaître et l’écrire.',
    final: 'Révision finale',
    finalObjective: (title) => `Montrer tout ce que tu as appris dans ${guillemets(title)}.`,
  },
};

const isNamespace = (language: string): language is EnSrcNamespace => language in PROMPTS;

export const enSrcPrompts = (language: string): PromptTexts | undefined =>
  isNamespace(language) ? PROMPTS[language] : undefined;

export const enSrcPathTexts = (language: string): PathTexts | undefined =>
  isNamespace(language) ? PATH[language] : undefined;
