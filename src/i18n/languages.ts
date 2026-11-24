import { languageConfig } from '@shared/languages';

import { getInterfaceLanguage, useInterfaceLanguage, type InterfaceLanguage } from '.';

/**
 * Nombres de los idiomas según el idioma de la interfaz. `shared/languages.ts` guarda los nombres en
 * español (los usan el contenido y la base); acá están sus equivalentes en inglés.
 */
const EN: Record<string, { name: string; short: string }> = {
  en: { name: 'English', short: 'English' },
  it: { name: 'Italian', short: 'Italian' },
  pt: { name: 'Portuguese', short: 'Portuguese' },
  zh: { name: 'Mandarin Chinese', short: 'Chinese' },
  fr: { name: 'French', short: 'French' },
  es: { name: 'Spanish', short: 'Spanish' },
};

/** «Inglés» / «English». */
export function languageName(code: string | null | undefined, ui: InterfaceLanguage): string {
  const config = languageConfig(code);
  return ui === 'en' ? (EN[config.code]?.name ?? config.name) : config.name;
}

/** Versión corta para chips y listas: «Chino» / «Chinese». */
export function languageShortName(code: string | null | undefined, ui: InterfaceLanguage): string {
  const config = languageConfig(code);
  if (ui === 'en') return EN[config.code]?.short ?? config.name;
  return config.code === 'zh' ? 'Chino' : config.name;
}

export const getLanguageName = (code: string | null | undefined) =>
  languageName(code, getInterfaceLanguage());

export function useLanguageName() {
  const ui = useInterfaceLanguage();
  return (code: string | null | undefined) => languageName(code, ui);
}
