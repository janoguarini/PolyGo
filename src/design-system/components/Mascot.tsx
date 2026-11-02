import { Asset } from 'expo-asset';
import { Image, Platform, StyleSheet, View, type ImageSourcePropType } from 'react-native';

/**
 * Poses del zorro de Polygo (assets/mascot: WebP de 480 px con fondo transparente, ~55 KB cada una;
 * los originales de 1165 × 1350 pesaban casi 2 MB y tardaban en aparecer).
 */
const POSES = {
  wave: require('../../../assets/mascot/wave.webp'),
  pointDown: require('../../../assets/mascot/point-down.webp'),
  pointUp: require('../../../assets/mascot/point-up.webp'),
  thinking: require('../../../assets/mascot/thinking.webp'),
} satisfies Record<string, ImageSourcePropType>;

export type MascotPose = keyof typeof POSES;
const POSE_NAMES = Object.keys(POSES) as MascotPose[];

/** Ancho / alto de las imágenes. */
const ASPECT = 480 / 556;

/**
 * Deja las poses descargadas y en la caché de imágenes apenas abre la app, así el registro las
 * muestra al instante (en desarrollo vienen del servidor de Metro por la red).
 */
export function preloadMascot() {
  const modules = Object.values(POSES) as number[];
  void Asset.loadAsync(modules).catch(() => undefined);
  // En la web no existe resolveAssetSource (el navegador ya cachea las imágenes).
  if (Platform.OS === 'web') return;
  for (const mod of modules) {
    const uri = Image.resolveAssetSource(mod)?.uri;
    if (uri && /^(https?|file):/.test(uri)) void Image.prefetch(uri).catch(() => undefined);
  }
}

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
