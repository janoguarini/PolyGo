import { useState } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { AVATARS, DEFAULT_AVATAR, type AvatarId } from '@shared/profile';

import { avatarRed, avatarViolet, avatarYellow } from '../imageData.generated';
import { colors } from '../tokens';

/**
 * Los zorros van incrustados en el bundle (scripts/build-image-data.ts): no se descargan aparte,
 * así que aparecen al instante también en desarrollo.
 */
const IMAGES: Record<AvatarId, ImageSourcePropType> = {
  bolt: avatarViolet,
  crown: avatarYellow,
  flame: avatarRed,
};

/**
 * Avatar circular: la foto propia si hay (con el zorro elegido como respaldo si no carga) o uno de
 * los tres zorros predeterminados. Con `instant` los tres zorros quedan montados uno encima del otro
 * y sólo se muestra el elegido: cambiar de zorro es inmediato (para el avatar que se está editando).
 */
export function Avatar({
  avatarId,
  photoUrl,
  size = 48,
  instant,
}: {
  avatarId: string | null | undefined;
  /** URL pública de la foto propia (ver avatarPhotoUrl). */
  photoUrl?: string | null;
  size?: number;
  instant?: boolean;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const avatar =
    AVATARS.find((a) => a.id === avatarId) ?? AVATARS.find((a) => a.id === DEFAULT_AVATAR)!;
  const usePhoto = Boolean(photoUrl) && failedUrl !== photoUrl;
  const photo = usePhoto ? (
    <Image
      source={{ uri: photoUrl! }}
      onError={() => setFailedUrl(photoUrl ?? null)}
      style={instant ? styles.layer : styles.image}
      resizeMode="cover"
      fadeDuration={0}
    />
  ) : null;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2, borderColor: avatar.color },
      ]}
    >
      {instant ? (
        <>
          {AVATARS.map((a) => (
            <Image
              key={a.id}
              source={IMAGES[a.id]}
              style={[styles.layer, { opacity: !usePhoto && a.id === avatar.id ? 1 : 0 }]}
              resizeMode="cover"
              fadeDuration={0}
            />
          ))}
          {photo}
        </>
      ) : (
        (photo ?? (
          <Image
            source={IMAGES[avatar.id]}
            style={styles.image}
            resizeMode="cover"
            fadeDuration={0}
          />
        ))
      )}
    </View>
  );
}

export function isAvatarId(id: string): id is AvatarId {
  return AVATARS.some((a) => a.id === id);
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderWidth: 2,
    backgroundColor: colors.surfaceRaised,
  },
  image: { width: '100%', height: '100%' },
  layer: { ...StyleSheet.absoluteFill },
});
