import { StyleSheet, View } from 'react-native';

import { RATING_CONFIG, getRank, isInPlacement } from '@shared/ranking';

import {
  Card,
  ProgressBar,
  RankEmblem,
  TIER_COLORS,
  Text,
  gradients,
  spacing,
} from '@/design-system';
import type { PlayerRatingRow } from '@/lib/database.types';

export function RankCard({ rating }: { rating: PlayerRatingRow }) {
  const rank = getRank(rating.rating);
  const placement = isInPlacement(rating.games_played);
  const tierColors = TIER_COLORS[rank.tier.id];
  const remaining = rank.nextStepMin === null ? null : rank.nextStepMin - rating.rating;

  return (
    <Card gradient={gradients.ranked} style={styles.card}>
      <View style={styles.row}>
        <RankEmblem tier={rank.tier.id} division={rank.division} size={84} dimmed={placement} />
        <View style={styles.info}>
          <Text variant="overline" color="primarySoft">
            {placement ? 'EN COLOCACIÓN' : 'RANGO ACTUAL'}
          </Text>
          <Text variant="title" style={{ color: placement ? undefined : tierColors.light }}>
            {placement ? 'Sin rango' : rank.label}
          </Text>
          <Text
            variant="bodyStrong"
            color="text"
            accessibilityLabel={`${rating.rating} puntos de ELO`}
          >
            {rating.rating} ELO
          </Text>
        </View>
      </View>
      {placement ? (
        <View style={styles.progress}>
          <ProgressBar
            value={rating.games_played / RATING_CONFIG.placementMatches}
            accessibilityLabel="Partidas de colocación"
          />
          <Text variant="caption">
            {rating.games_played}/{RATING_CONFIG.placementMatches} partidas de colocación
          </Text>
        </View>
      ) : (
        <View style={styles.progress}>
          <ProgressBar
            value={rank.progress}
            colors={[tierColors.light, tierColors.dark]}
            accessibilityLabel="Progreso al siguiente rango"
          />
          <Text variant="caption">
            {remaining === null
              ? 'Rango máximo alcanzado'
              : `${remaining} ELO para el siguiente rango`}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  info: { flex: 1, gap: spacing.xxs },
  progress: { gap: spacing.xs },
});
