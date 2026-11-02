import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { mascotPointDown, mascotPointUp, mascotThinking, mascotWave } from '../imageData.generated';

/**
 * Poses del zorro de Polygo: WebP de 480 px con fondo transparente (~40 KB), incrustados en el
 * bundle (scripts/build-image-data.ts) para que aparezcan al instante, sin descarga aparte.
 */
const POSES = {
  wave: mascotWave,
  pointDown: mascotPointDown,
  pointUp: mascotPointUp,
  thinking: mascotThinking,
} satisfies Record<string, ImageSourcePropType>;

export type MascotPose = keyof typeof POSES;
const POSE_NAMES = Object.keys(POSES) as MascotPose[];

/** Ancho / alto de las imágenes. */
const ASPECT = 480 / 556;

/** La mascota en una pose. `height` en puntos; el ancho sale de la proporción de la imagen. */
export function Mascot({ pose, height = 200 }: { pose: MascotPose; height?: number }) {
  return (
    <Image
      source={POSES[pose]}
      style={{ height, width: height * ASPECT }}
      resizeMode="contain"
      fadeDuration={0}
      accessible={false}
    />
  );
}

/**
 * Monta todas las poses invisibles para que ya estén decodificadas cuando se muestran: cambiar de
 * pose (p. ej. al avanzar en el registro) es inmediato. Va una sola vez en la pantalla.
 */
export function MascotWarmup({ height = 280 }: { height?: number }) {
  return (
    <View
      style={styles.warmup}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {POSE_NAMES.map((pose) => (
        <Mascot key={pose} pose={pose} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  warmup: { position: 'absolute', top: 0, left: 0, opacity: 0 },
});
