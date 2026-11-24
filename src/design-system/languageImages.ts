import type { ImageSourcePropType } from 'react-native';

/**
 * Fondo de Aprender para cada idioma (assets/languages): una escena nocturna de su país, vertical
 * (941×1672), con la parte de abajo lisa para fundirse con la barra de pestañas. Es la única
 * referencia a esos archivos.
 */
export const LANGUAGE_BACKGROUNDS = {
  en: require('../../assets/languages/en.webp'),
  es: require('../../assets/languages/es.webp'),
  it: require('../../assets/languages/it.webp'),
  pt: require('../../assets/languages/pt.webp'),
  zh: require('../../assets/languages/zh.webp'),
  fr: require('../../assets/languages/fr.webp'),
} as const satisfies Record<string, ImageSourcePropType>;

/** Alto / ancho de las escenas (941×1672), para recortarlas sin deformarlas. */
export const LANGUAGE_BACKGROUND_RATIO = 1672 / 941;

/** Fondo del idioma; undefined si todavía no tiene (la pantalla usa entonces la cordillera). */
export function languageBackground(
  code: string | null | undefined,
): ImageSourcePropType | undefined {
  return code && code in LANGUAGE_BACKGROUNDS
    ? LANGUAGE_BACKGROUNDS[code as keyof typeof LANGUAGE_BACKGROUNDS]
    : undefined;
}
