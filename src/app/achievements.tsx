import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { AchievementCategory } from '@shared/achievements';

import {
  Card,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
  ScreenHeader,
  Text,
  spacing,
} from '@/design-system';
import { FamilyRow } from '@/features/profile/components/AchievementBadge';
import { familyProgress } from '@/features/profile/families';
import { useMyAchievements } from '@/features/profile/hooks';
import { useStrings } from '@/i18n';
import { achievementsScreenStrings } from '@/i18n/screens/achievements';

// Ranked siempre está disponible (contra bots aunque no haya servidor de partidas).
const RANKED_AVAILABLE = true;

const CATEGORIES: readonly AchievementCategory[] = [
  'streak',
  'learning',
  'vocabulary',
  'competitive',
];

/** Todas las familias de logros con su nivel y el próximo objetivo. */
export default function AchievementsScreen() {
  const t = useStrings(achievementsScreenStrings);
  const achievements = useMyAchievements();

  if (achievements.isPending) return <LoadingState label={t.loading} />;
  if (achievements.isError || !achievements.data)
    return <ErrorState onRetry={() => void achievements.refetch()} />;

  const families = familyProgress(achievements.data);
  const levels = families.reduce((n, f) => n + f.level, 0);
  const maxLevels = families.reduce((n, f) => n + f.maxLevel, 0);

  return (
    <Screen
      edges={['top', 'bottom']}
      onRefresh={() => void achievements.refetch()}
      refreshing={achievements.isRefetching}
    >
      <ScreenHeader title={t.title} onBack={() => router.back()} />
      <View style={styles.summary}>
        <Text variant="bodyStrong">{t.levels(levels, maxLevels)}</Text>
        <ProgressBar value={maxLevels ? levels / maxLevels : 0} accessibilityLabel={t.levelsA11y} />
        <Text variant="caption">{t.hint}</Text>
      </View>
      {CATEGORIES.map((c) => {
        const items = families.filter((f) => f.family.category === c);
        if (items.length === 0) return null;
        return (
          <Card key={c} style={styles.card}>
            <Text variant="overline">{t.categories[c].toUpperCase()}</Text>
            {items.map((f) => (
              <FamilyRow key={f.family.metric} progress={f} rankedAvailable={RANKED_AVAILABLE} />
            ))}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { gap: spacing.sm },
  card: { gap: spacing.xs },
});
