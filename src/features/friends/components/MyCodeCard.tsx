import { LinearGradient } from 'expo-linear-gradient';
import { Share2 } from 'lucide-react-native';
import { Image, Share, StyleSheet, View } from 'react-native';

import { Button, Text, colors, elevation, radii, spacing } from '@/design-system';
import { mascotWave } from '@/design-system/imageData.generated';
import { useMyProfile } from '@/features/profile/hooks';

/** Ancho / alto de assets/mascot/wave.webp. */
const FOX_ASPECT = 480 / 556;
const FOX_HEIGHT = 140;
const FOX_WIDTH = FOX_HEIGHT * FOX_ASPECT;
/** Alto del Button md: el zorro se apoya encima. */
const BUTTON_HEIGHT = 50;
/** Cuánto lo tapa el botón. */
const FOX_TUCK = 8;

/** Tu código PG- para que otros te encuentren, con el zorro saludando y botón para compartirlo. */
export function MyCodeCard() {
  const profile = useMyProfile();
  const code = profile.data?.profile.public_code;
  const username = profile.data?.profile.username;
  if (!code) return null;

  const share = () =>
    void Share.share({
      message: `¡Agregame en Polygo! Buscame como @${username} o con mi código ${code}.`,
    }).catch(() => {});

  return (
    <View style={styles.glow}>
      <LinearGradient
        colors={['#3F2391', '#24145C', '#160F3A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Image
          source={mascotWave}
          style={styles.fox}
          resizeMode="contain"
          fadeDuration={0}
          accessible={false}
          pointerEvents="none"
        />
        <View style={styles.info}>
          <Text variant="overline" color="primarySoft">
            TU CÓDIGO DE AMIGO
          </Text>
          <View style={styles.ticket}>
            <Text
              variant="stat"
              color="textStrong"
              selectable
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={styles.code}
              accessibilityLabel={`Tu código: ${code.split('').join(' ')}`}
            >
              {code}
            </Text>
          </View>
          <Text variant="caption" color="text">
            Te pueden agregar con este código{username ? ` o buscando @${username}` : ''}.
          </Text>
        </View>
        <Button
          label="Compartir mi código"
          icon={<Share2 color={colors.onPrimary} size={18} />}
          onPress={share}
          style={styles.button}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // La sombra va afuera: la tarjeta recorta al zorro con sus bordes redondeados.
  glow: { borderRadius: radii.xl, backgroundColor: '#24145C', ...elevation.glow },
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.5)',
    overflow: 'hidden',
  },
  // Deja lugar a la derecha para el zorro.
  // minHeight: el zorro entra entero, sin pasarse del borde de arriba.
  info: {
    gap: spacing.sm,
    minHeight: FOX_HEIGHT - spacing.xl,
    justifyContent: 'center',
    paddingRight: FOX_WIDTH - spacing.xl,
  },
  ticket: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(167, 139, 250, 0.6)',
    backgroundColor: 'rgba(7, 6, 15, 0.35)',
  },
  code: { fontSize: 24, lineHeight: 30, letterSpacing: 1.5 },
  button: {
    shadowColor: colors.primaryBright,
    shadowOpacity: 0.7,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  // Apoyado sobre el botón, que lo tapa apenas.
  fox: {
    position: 'absolute',
    right: -spacing.xs,
    bottom: BUTTON_HEIGHT + spacing.lg - FOX_TUCK,
    width: FOX_WIDTH,
    height: FOX_HEIGHT,
  },
});
