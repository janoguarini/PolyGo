/**
 * Idiomas que enseña Polygo (desde español). Una sola fuente para la app, el contenido (content/) y
 * los tests. La base replica `status` y `ranked` en public.languages (content_status,
 * ranked_available) y es la autoridad para elegir idioma (set_target_language).
 *
 * - available: visible para todos.
 * - beta: contenido en preparación; sólo lo ven los testers de contenido (public.content_testers).
 * - soon: se muestra como «Próximamente» y no se puede elegir.
 */

export type LanguageStatus = 'available' | 'beta' | 'soon';

export interface LanguageConfig {
  code: string;
  name: string;
  /** Para consignas: «Traducí al italiano», «Respondé en italiano». */
  inName: string;
  alName: string;
  flag: string;
  status: LanguageStatus;
  /** Si se puede jugar Ranked / Word Rush (hace falta un banco de palabras grande). */
  ranked: boolean;
  /** Locale de la voz sintetizada (expo-speech). */
  speechLocale: string;
  /** 'han': caracteres chinos con pinyin encima; el resto, alfabeto latino. */
  script: 'latin' | 'han';
  /** Variante enseñada, para la UI y la documentación. */
  variant: string;
  /** Niveles con contenido (content/index.ts COURSES): los que se pueden elegir al registrarse. */
  levels: readonly string[];
}

export const LANGUAGES: readonly LanguageConfig[] = [
  {
    code: 'en',
    name: 'Inglés',
    inName: 'en inglés',
    alName: 'al inglés',
    flag: '🇬🇧',
    status: 'available',
    ranked: true,
    speechLocale: 'en-US',
    script: 'latin',
    variant: 'Inglés general americano',
    levels: ['A1', 'A2'],
  },
  {
    code: 'it',
    name: 'Italiano',
    inName: 'en italiano',
    alName: 'al italiano',
    flag: '🇮🇹',
    status: 'available',
    ranked: true,
    speechLocale: 'it-IT',
    script: 'latin',
    variant: 'Italiano estándar',
    levels: ['A1'],
  },
  {
    code: 'pt',
    name: 'Portugués',
    inName: 'en portugués',
    alName: 'al portugués',
    flag: '🇧🇷',
    status: 'available',
    ranked: true,
    speechLocale: 'pt-BR',
    script: 'latin',
    variant: 'Portugués de Brasil',
    levels: ['A1'],
  },
  {
    code: 'zh',
    name: 'Chino mandarín',
    inName: 'en chino',
    alName: 'al chino',
    flag: '🇨🇳',
    status: 'available',
    ranked: true,
    speechLocale: 'zh-CN',
    script: 'han',
    variant: 'Chino mandarín, caracteres simplificados y pinyin',
    levels: ['A1'],
  },
  {
    // Necesita la interfaz traducida al inglés (la app supone que el alumno habla español).
    code: 'es',
    name: 'Español',
    inName: 'en español',
    alName: 'al español',
    flag: '🇪🇸',
    status: 'soon',
    ranked: false,
    speechLocale: 'es-MX',
    script: 'latin',
    variant: 'Español neutro con tú',
    levels: [],
  },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0]!;

/** Configuración de un idioma; los códigos desconocidos caen en inglés (el único histórico). */
export function languageConfig(code: string | null | undefined): LanguageConfig {
  return LANGUAGES.find((l) => l.code === code) ?? DEFAULT_LANGUAGE;
}

/** Si el usuario puede elegirlo: los beta, sólo los testers de contenido. El resto se ve «Próximamente». */
export function isSelectable(language: LanguageConfig, isTester: boolean): boolean {
  return language.status === 'available' || (language.status === 'beta' && isTester);
}

/** Unidades previstas por nivel: sirve para mostrar «3 de 12 unidades» sin dar el nivel por completo. */
export const PLANNED_UNITS_PER_LEVEL = 12;

/** Caracteres chinos (bloques CJK unificados y extensión A). */
export const HAN = /[㐀-䶿一-鿿]/;
