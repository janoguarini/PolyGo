import type { ImageSourcePropType } from 'react-native';

import {
  languageEn,
  languageEs,
  languageFr,
  languageIt,
  languagePt,
  languageZh,
} from './imageData.generated';

/**
 * Fondo de Aprender para cada idioma (assets/languages): una escena nocturna de su país, vertical
 * (720×1279), con la parte de abajo lisa para fundirse con la barra de pestañas. Van incrustadas
 * en el bundle (scripts/build-image-data.ts), como los zorros y la mascota: cargadas desde Metro
 * por la red no aparecían en el teléfono durante el desarrollo.
 */
export const LANGUAGE_BACKGROUNDS = {
  en: languageEn,
  es: languageEs,
  it: languageIt,
  pt: languagePt,
  zh: languageZh,
  fr: languageFr,
} as const satisfies Record<string, ImageSourcePropType>;

/** Alto / ancho de las escenas (720×1279), para recortarlas sin deformarlas. */
export const LANGUAGE_BACKGROUND_RATIO = 1279 / 720;

/** Fondo del idioma; undefined si todavía no tiene (la pantalla usa entonces la cordillera). */
export function languageBackground(
  code: string | null | undefined,
): ImageSourcePropType | undefined {
  return code && code in LANGUAGE_BACKGROUNDS
    ? LANGUAGE_BACKGROUNDS[code as keyof typeof LANGUAGE_BACKGROUNDS]
    : undefined;
}
