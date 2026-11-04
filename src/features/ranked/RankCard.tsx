import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';

import { getRank, isPlaced } from '@shared/ranking';

import {
  ProgressBar,
  RankEmblem,
  TIER_COLORS,
  Text,
  colors,
  elevation,
  radii,
  spacing,
} from '@/design-system';
import { mascotRanked } from '@/design-system/imageData.generated';
import type { PlayerRatingRow } from '@/lib/database.types';

/** Ancho / alto de assets/mascot/ranked.webp. */
const FOX_ASPECT = 480 / 560;
const FOX_HEIGHT = 136;
/** Cuánto sobresale el zorro por encima de la tarjeta. */
const FOX_OVERFLOW = 26;

export function RankCard({ rating }: { rating: PlayerRatingRow }) {
  const rank = getRank(rating.rating);
  const placement = !isPlaced(rating);
  const tierColors = TIER_COLORS[rank.tier.id];
  const remaining = rank.nextStepMin === null ? null : rank.nextStepMin - rating.rating;

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#4B2A9E', '#2A1766', '#140E33']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Brillo del color del tier detrás del emblema. */}
        <LinearGradient
          colors={[`${tierColors.light}33`, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 0.6 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {/* Halo detrás del zorro: lo funde con la tarjeta. */}
        <View style={styles.foxHalo} pointerEvents="none" />
        <View style={styles.row}>
          <View style={[styles.emblemHalo, !placement && { shadowColor: tierColors.light }]}>
            <RankEmblem tier={rank.tier.id} division={rank.division} size={72} dimmed={placement} />
          </View>
          <View style={styles.info}>
            <Text variant="overline" color="primarySoft">
              {placement ? 'RANKED' : 'RANGO ACTUAL'}
            </Text>
            <Text
              variant="title"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={[styles.label, !placement && { color: tierColors.light }]}
            >
              {placement ? 'Sin posicionar' : rank.label}
            </Text>
            {placement ? null : (
              <View style={styles.eloPill}>
                <Text
                  variant="bodyStrong"
                  color="textStrong"
                  accessibilityLabel={`${rating.rating} puntos de ELO`}
                >
                  {rating.rating} ELO
                </Text>
              </View>
            )}
          </View>
        </View>
        {placement ? (
          <Text variant="caption" color="text">
            Ganá tu primera partida para entrar al ranking en Bronce.
          </Text>
        ) : (
          <View style={styles.progress}>
            <View style={[styles.barGlow, { shadowColor: tierColors.light }]}>
              <ProgressBar
                value={rank.progress}
                height={12}
                colors={[tierColors.accent, tierColors.light, tierColors.dark]}
                accessibilityLabel="Progreso al siguiente rango"
              />
            </View>
            <Text variant="caption" color="text" align="center">
              {remaining === null
                ? 'Rango máximo alcanzado'
                : `${remaining} ELO para el siguiente rango`}
            </Text>
          </View>
        )}
      </LinearGradient>
      <Image
        source={mascotRanked}
        style={styles.fox}
        resizeMode="contain"
        fadeDuration={0}
        accessible={false}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: FOX_OVERFLOW - spacing.sm },
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.45)',
    overflow: 'hidden',
    ...elevation.glow,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  emblemHalo: {
    shadowColor: colors.primaryBright,
    shadowOpacity: 0.7,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  // Deja lugar a la derecha para el puño del zorro.
  info: { flex: 1, gap: spacing.xs, paddingRight: FOX_HEIGHT * FOX_ASPECT - spacing.xl },
  label: { fontSize: 28, lineHeight: 34, fontStyle: 'italic', fontWeight: '900' },
  eloPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(7, 6, 15, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.5)',
  },
  progress: { gap: spacing.sm },
  barGlow: {
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  foxHalo: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(139, 92, 246, 0.28)',
    shadowColor: colors.primaryBright,
    shadowOpacity: 0.9,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  fox: {
    position: 'absolute',
    top: -FOX_OVERFLOW,
    right: spacing.xxs,
    height: FOX_HEIGHT,
    width: FOX_HEIGHT * FOX_ASPECT,
  },
});
