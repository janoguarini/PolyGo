import { themedStyles } from '../theme';
import { memo, useState } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { AVATARS, DEFAULT_AVATAR, type AvatarId } from '@shared/profile';

import {
  avatarCatRed,
  avatarCatViolet,
  avatarCatYellow,
  avatarDogRed,
  avatarDogViolet,
  avatarDogYellow,
  avatarLionRed,
  avatarLionViolet,
  avatarLionYellow,
  avatarPandaRed,
  avatarPandaViolet,
  avatarPandaYellow,
  avatarRed,
  avatarViolet,
  avatarYellow,
} from '../imageData.generated';
import { SKIN_IMAGES } from '../skinImages';
import { colors } from '../tokens';

/**
 * Los avatares van incrustados en el bundle (scripts/build-image-data.ts): no se descargan aparte,
 * así que aparecen al instante también en desarrollo.
 */
const IMAGES: Record<AvatarId, ImageSourcePropType> = {
  bolt: avatarViolet,
  crown: avatarYellow,
  flame: avatarRed,
  'panda-violet': avatarPandaViolet,
  'panda-yellow': avatarPandaYellow,
  'panda-red': avatarPandaRed,
  'dog-violet': avatarDogViolet,
  'dog-yellow': avatarDogYellow,
  'dog-red': avatarDogRed,
  'cat-violet': avatarCatViolet,
  'cat-yellow': avatarCatYellow,
  'cat-red': avatarCatRed,
  'lion-violet': avatarLionViolet,
  'lion-yellow': avatarLionYellow,
  'lion-red': avatarLionRed,
};

/**
 * Avatar circular: la foto propia si hay (con el avatar elegido como respaldo si no carga) o uno de
 * los avatares predeterminados. Con `instant` todos quedan montados uno encima del otro y sólo se
 * muestra el elegido: cambiar de avatar es inmediato (para el avatar que se está editando).
 */
function AvatarBase({
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
  const styles = useStyles();
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  // Una skin puesta manda sobre la foto (la foto no se borra: vuelve al elegir un avatar común).
  const skin = avatarId ? SKIN_IMAGES[avatarId] : undefined;
  if (skin) {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[
          styles.base,
          styles.skin,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Image source={skin} style={styles.image} resizeMode="cover" fadeDuration={0} />
      </View>
    );
  }
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

export const Avatar = memo(AvatarBase);

export function isAvatarId(id: string): id is AvatarId {
  return AVATARS.some((a) => a.id === id);
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    base: {
      overflow: 'hidden',
      borderWidth: 2,
      backgroundColor: colors.surfaceRaised,
    },
    // Las skins traen su propio aro neón: sin borde extra.
    skin: { borderWidth: 0, backgroundColor: 'transparent' },
    image: { width: '100%', height: '100%' },
    layer: { ...StyleSheet.absoluteFill },
  }),
);
