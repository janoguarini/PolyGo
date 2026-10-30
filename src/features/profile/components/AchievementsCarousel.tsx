import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ErrorState, ProgressBar, Text, colors, radii, spacing } from '@/design-system';

import { featuredFamilies, familyProgress } from '../families';
import { useMyAchievements } from '../hooks';
import { FamilyBadge } from './AchievementBadge';

const SHOWN = 8;

/** Logros destacados del perfil: una tarjeta por familia con su nivel. Abre la lista completa. */
export function AchievementsCarousel() {
  const achievements = useMyAchievements();

  if (achievements.isError)
    return (
      <ErrorState
        message="No pudimos cargar tus logros."
        onRetry={() => void achievements.refetch()}
      />
    );
  if (!achievements.data) return <Text variant="caption">Cargando logros…</Text>;

  const families = featuredFamilies(familyProgress(achievements.data), SHOWN);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {families.map(({ family, level, maxLevel, current, next, ratio }) => (
        <Pressable
          key={family.metric}
          accessibilityRole="button"
          accessibilityLabel={`${family.title}, nivel ${level} de ${maxLevel}. ${
            next ? next.description : 'Completo.'
          } Ver todos los logros.`}
          onPress={() => router.push('/achievements')}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <FamilyBadge family={family} level={level} size={58} />
          <Text variant="bodyStrong" align="center" numberOfLines={1} color="textStrong">
            {family.title}
          </Text>
          <Text variant="caption" align="center" numberOfLines={2} style={styles.caption}>
            {current ? current.description : (next?.description ?? '')}
          </Text>
          {next ? (
            <View style={styles.bar}>
              <ProgressBar value={ratio} height={5} colors={family.colors} />
            </View>
          ) : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm },
  card: {
    width: 116,
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  caption: { minHeight: 36, fontSize: 11, lineHeight: 15 },
  bar: { alignSelf: 'stretch' },
});
