/**
 * Idiomas que enseña Polygo (desde español). Una sola fuente para la app, el contenido (content/) y
 * los tests. La base replica `status` y `ranked` en public.languages (content_status,
 * ranked_available) y es la autoridad para elegir idioma (set_target_language).
 *
 * - available: visible para todos.
 * - beta: contenido en preparación; sólo lo ven los testers de contenido (public.content_testers).
 * - soon: se muestra como «Próximamente» y no se puede elegir.
 * - hidden: contenido cargado sin publicar; la app no lo muestra (igual que en public.languages).
 *   Existe para que el contenido use su configuración (voz fr-FR, «Traducí al francés»).
 */

export type LanguageStatus = 'available' | 'beta' | 'soon' | 'hidden';

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
  /**
   * Idioma de apoyo del contenido: el de las traducciones, consignas, explicaciones y preguntas de
   * comprensión. Sin el campo, español (todos los cursos salvo el de español, que se enseña desde el
   * inglés). `targetName`: el idioma que se aprende, dicho en el idioma de apoyo («Spanish»).
   */
  support?: { code: 'en'; targetName: string };
}

export const LANGUAGES: readonly LanguageConfig[] = [
  {
    code: 'en',
    name: 'Inglés',
    inName: 'en inglés',
    alName: 'al inglés',
    flag: '🇺🇸',
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
    // Francés A1 y A2 (docs/FR_A1_A2.md): cargado sin publicar y oculto, como en public.languages.
    // Publicarlo es cambiar este estado junto con la migración de supabase/pending/.
    code: 'fr',
    name: 'Francés',
    inName: 'en francés',
    alName: 'al francés',
    flag: '🇫🇷',
    status: 'hidden',
    ranked: false,
    speechLocale: 'fr-FR',
    script: 'latin',
    variant: 'Francés estándar de Francia',
    levels: [],
  },
  {
    // El contenido se enseña desde el inglés (support); la interfaz de la app sigue en español, así
    // que el idioma queda «Próximamente» hasta traducirla (docs/ES_A1_A2.md).
    code: 'es',
    name: 'Español',
    inName: 'en español',
    alName: 'al español',
    flag: '🇪🇸',
    status: 'soon',
    ranked: false,
    speechLocale: 'es-AR',
    script: 'latin',
    variant: 'Español rioplatense (Argentina), con voseo',
    levels: [],
    support: { code: 'en', targetName: 'Spanish' },
  },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0]!;

/** Los que la app muestra (disponibles, beta y «Próximamente»): los ocultos no aparecen. */
export const VISIBLE_LANGUAGES = LANGUAGES.filter((l) => l.status !== 'hidden');

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
