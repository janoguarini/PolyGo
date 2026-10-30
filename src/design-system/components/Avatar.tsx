import { useState } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { AVATARS, DEFAULT_AVATAR, type AvatarId } from '@shared/profile';

import { colors } from '../tokens';

const IMAGES: Record<AvatarId, ImageSourcePropType> = {
  bolt: require('../../../assets/avatars/fox-violet.jpg'),
  crown: require('../../../assets/avatars/fox-yellow.jpg'),
  flame: require('../../../assets/avatars/fox-red.jpg'),
};

/**
 * Avatar circular: la foto propia si hay (con el zorro elegido como respaldo si no carga) o uno de
 * los tres zorros predeterminados.
 */
export function Avatar({
  avatarId,
  photoUrl,
  size = 48,
}: {
  avatarId: string | null | undefined;
  /** URL pública de la foto propia (ver avatarPhotoUrl). */
  photoUrl?: string | null;
  size?: number;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const avatar =
    AVATARS.find((a) => a.id === avatarId) ?? AVATARS.find((a) => a.id === DEFAULT_AVATAR)!;
  const usePhoto = Boolean(photoUrl) && failedUrl !== photoUrl;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2, borderColor: avatar.color },
      ]}
    >
      <Image
        source={usePhoto ? { uri: photoUrl! } : IMAGES[avatar.id]}
        onError={() => setFailedUrl(photoUrl ?? null)}
        style={styles.image}
        resizeMode="cover"
      />
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
});
