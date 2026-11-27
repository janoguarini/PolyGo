import { languageConfig } from '@shared/languages';

import { getInterfaceLanguage, useInterfaceLanguage, type InterfaceLanguage } from '.';

/**
 * Nombres de los idiomas según el idioma de la interfaz. `shared/languages.ts` guarda los nombres en
 * español (los usan el contenido y la base); acá están sus equivalentes en los otros idiomas de la
 * interfaz. Van con mayúscula inicial, como en español; quien los pone dentro de una frase los pasa
 * a minúscula si el idioma lo pide.
 */
type Names = Record<string, { name: string; short: string }>;

const NAMES: Record<Exclude<InterfaceLanguage, 'es'>, Names> = {
  en: {
    en: { name: 'English', short: 'English' },
    it: { name: 'Italian', short: 'Italian' },
    pt: { name: 'Portuguese', short: 'Portuguese' },
    zh: { name: 'Mandarin Chinese', short: 'Chinese' },
    fr: { name: 'French', short: 'French' },
    es: { name: 'Spanish', short: 'Spanish' },
  },
  'pt-BR': {
    en: { name: 'Inglês', short: 'Inglês' },
    it: { name: 'Italiano', short: 'Italiano' },
    pt: { name: 'Português', short: 'Português' },
    zh: { name: 'Chinês mandarim', short: 'Chinês' },
    fr: { name: 'Francês', short: 'Francês' },
    es: { name: 'Espanhol', short: 'Espanhol' },
  },
  it: {
    en: { name: 'Inglese', short: 'Inglese' },
    it: { name: 'Italiano', short: 'Italiano' },
    pt: { name: 'Portoghese', short: 'Portoghese' },
    zh: { name: 'Cinese mandarino', short: 'Cinese' },
    fr: { name: 'Francese', short: 'Francese' },
    es: { name: 'Spagnolo', short: 'Spagnolo' },
  },
};

/** «Inglés» / «English» / «Inglês» / «Inglese». */
export function languageName(code: string | null | undefined, ui: InterfaceLanguage): string {
  const config = languageConfig(code);
  if (ui === 'es') return config.name;
  return NAMES[ui][config.code]?.name ?? config.name;
}

/** Versión corta para chips y listas: «Chino» / «Chinese» / «Chinês» / «Cinese». */
export function languageShortName(code: string | null | undefined, ui: InterfaceLanguage): string {
  const config = languageConfig(code);
  if (ui === 'es') return config.code === 'zh' ? 'Chino' : config.name;
  return NAMES[ui][config.code]?.short ?? config.name;
}

export const getLanguageName = (code: string | null | undefined) =>
  languageName(code, getInterfaceLanguage());

export function useLanguageName() {
  const ui = useInterfaceLanguage();
  return (code: string | null | undefined) => languageName(code, ui);
}
