import type { ImageSourcePropType } from 'react-native';

import type { StimulusVisual } from '@shared/exercises';

/**
 * Imágenes de apoyo de los estímulos (fase C.9.1), empaquetadas en la app con `require`: viajan en la
 * build (y en las actualizaciones OTA) y se ven sin conexión. Nunca una URL ni almacenamiento remoto.
 *
 * Cada entrada repite el sha256 de su ficha (content/stimulus-visuals.ts); la prueba
 * content/__tests__/stimulus-visuals.test.ts verifica que el archivo, la ficha y este registro
 * coinciden. Vacío hasta que existan los recursos definitivos (fichas de producción en
 * docs/LEARNING_PHASE_C9_VISUALS.md): mientras tanto ningún estímulo lleva imagen.
 *
 * Para agregar una:
 *   'en.img.a1-u02-class-card': {
 *     source: require('../../../assets/stimuli/en/a1/u02-class-card.jpg'),
 *     sha256: '…',
 *   },
 */
export interface BundledStimulusImage {
  source: ImageSourcePropType;
  sha256: string;
}

export const STIMULUS_IMAGES: Readonly<Record<string, BundledStimulusImage>> = {};

/**
 * El recurso local de una imagen, sólo si la app tiene exactamente esa versión (mismo sha256). Si
 * falta o es otra (una build vieja frente a un estímulo corregido), `null`: el estímulo se muestra sin
 * imagen, nunca con una que no corresponde a la versión que se está respondiendo.
 */
export function stimulusImageSource(
  visual: Pick<StimulusVisual, 'id' | 'sha256'>,
  registry: Readonly<Record<string, BundledStimulusImage>> = STIMULUS_IMAGES,
): ImageSourcePropType | null {
  const entry = registry[visual.id];
  return entry && entry.sha256 === visual.sha256 ? entry.source : null;
}
