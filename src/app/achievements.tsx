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
import { battleServerConfigured } from '@/features/battle/client';
import { FamilyRow } from '@/features/profile/components/AchievementBadge';
import { familyProgress } from '@/features/profile/families';
import { useMyAchievements } from '@/features/profile/hooks';

// Mismo criterio que la pantalla Ranked: disponible si la app tiene servidor de partidas.
const RANKED_AVAILABLE = battleServerConfigured;

const CATEGORIES: { id: AchievementCategory; title: string }[] = [
  { id: 'streak', title: 'Constancia' },
  { id: 'learning', title: 'Lecciones' },
  { id: 'vocabulary', title: 'Vocabulario' },
  { id: 'competitive', title: 'Competitivo' },
];

/** Todas las familias de logros con su nivel y el próximo objetivo. */
export default function AchievementsScreen() {
  const achievements = useMyAchievements();

  if (achievements.isPending) return <LoadingState label="Cargando logros…" />;
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
      <ScreenHeader title="Logros" onBack={() => router.back()} />
      <View style={styles.summary}>
        <Text variant="bodyStrong">
          {levels} de {maxLevels} niveles
        </Text>
        <ProgressBar
          value={maxLevels ? levels / maxLevels : 0}
          accessibilityLabel="Niveles de logros alcanzados"
        />
        <Text variant="caption">
          Cada logro sube de nivel a medida que avanzás. ¡Seguí sumando!
        </Text>
      </View>
      {CATEGORIES.map((c) => {
        const items = families.filter((f) => f.family.category === c.id);
        if (items.length === 0) return null;
        return (
          <Card key={c.id} style={styles.card}>
            <Text variant="overline">{c.title.toUpperCase()}</Text>
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
