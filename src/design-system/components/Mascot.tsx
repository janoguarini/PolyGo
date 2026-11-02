import { Asset } from 'expo-asset';
import { Image, type ImageSourcePropType } from 'react-native';

/** Poses del zorro de Polygo (assets/mascot, 600 px de ancho con fondo transparente). */
const POSES = {
  wave: require('../../../assets/mascot/wave.png'),
  pointDown: require('../../../assets/mascot/point-down.png'),
  pointUp: require('../../../assets/mascot/point-up.png'),
  thinking: require('../../../assets/mascot/thinking.png'),
} satisfies Record<string, ImageSourcePropType>;

export type MascotPose = keyof typeof POSES;

/** Ancho / alto de las imágenes originales (1165 × 1350). */
const ASPECT = 1165 / 1350;

/** Baja las poses al disco antes de mostrarlas (p. ej. al entrar al registro). */
export function preloadMascot() {
  void Asset.loadAsync(Object.values(POSES) as number[]).catch(() => undefined);
}

/** La mascota en una pose. `height` en puntos; el ancho sale de la proporción de la imagen. */
export function Mascot({ pose, height = 200 }: { pose: MascotPose; height?: number }) {
  return (
    <Image
      source={POSES[pose]}
      style={{ height, width: height * ASPECT }}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
      accessible={false}
    />
  );
}
