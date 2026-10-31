import type { WordDef } from '../types';

/** Atajo para declarar palabras del A2 (mismo orden que en las unidades del A1, más `acceptedTexts`). */
export const w = (
  id: string,
  text: string,
  translation: string,
  ipa: string,
  emoji: string | undefined,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  acceptedTranslations?: string[],
  acceptedTexts?: string[],
): WordDef => ({
  id,
  text,
  translation,
  ipa,
  emoji,
  exampleEn,
  exampleEs,
  tags,
  acceptedTranslations,
  acceptedTexts,
});
