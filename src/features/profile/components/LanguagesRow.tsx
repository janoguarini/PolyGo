import { ScrollView, StyleSheet, View } from 'react-native';

import { TARGET_LANGUAGES } from '@shared/profile';
import { RATING_CONFIG } from '@shared/ranking';

import { Text, colors, radii, spacing } from '@/design-system';

import { useMyRatings } from '../hooks';

/** Idiomas con su ELO. El que estudiás va resaltado; los que todavía no existen, apagados. */
export function LanguagesRow({ current }: { current: string }) {
  const ratings = useMyRatings();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {TARGET_LANGUAGES.map((l) => {
        const selected = l.code === current;
        const rating = ratings.data?.[l.code] ?? (l.available ? RATING_CONFIG.initialRating : null);
        return (
          <View
            key={l.code}
            style={[styles.card, selected && styles.selected, !l.available && styles.soon]}
            accessible
            accessibilityLabel={`${l.name}${selected ? ', idioma actual' : ''}: ${
              l.available ? `${rating} ELO` : 'próximamente'
            }`}
          >
            <View style={styles.flag}>
              <Text style={styles.flagText}>{l.flag}</Text>
            </View>
            <View>
              <Text variant="bodyStrong" color={selected ? 'textStrong' : 'text'}>
                {l.name}
              </Text>
              <Text variant="caption">{l.available ? `${rating} ELO` : 'Próximamente'}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    borderColor: colors.primaryBright,
    borderWidth: 2,
    backgroundColor: colors.surfaceHighlight,
  },
  soon: { opacity: 0.55 },
  flag: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  flagText: { fontSize: 24, lineHeight: 30 },
});
