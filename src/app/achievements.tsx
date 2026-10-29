import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

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
import type { Achievement } from '@/features/profile/api';
import { AchievementRow } from '@/features/profile/components/AchievementBadge';
import { useMyAchievements } from '@/features/profile/hooks';

// Mismo criterio que la pantalla Ranked: disponible si la app tiene servidor de partidas.
const RANKED_AVAILABLE = battleServerConfigured;

const CATEGORIES: { id: string; title: string }[] = [
  { id: 'learning', title: 'Lecciones' },
  { id: 'vocabulary', title: 'Vocabulario' },
  { id: 'streak', title: 'Constancia' },
  { id: 'competitive', title: 'Competitivo' },
];

export default function AchievementsScreen() {
  const achievements = useMyAchievements();

  if (achievements.isPending) return <LoadingState label="Cargando logros…" />;
  if (achievements.isError || !achievements.data)
    return <ErrorState onRetry={() => void achievements.refetch()} />;

  const all = achievements.data;
  const unlocked = all.filter((a) => a.unlockedAt).length;
  const byCategory = (id: string): Achievement[] => all.filter((a) => a.category === id);

  return (
    <Screen onRefresh={() => void achievements.refetch()} refreshing={achievements.isRefetching}>
      <ScreenHeader title="Logros" onBack={() => router.back()} />
      <View style={styles.summary}>
        <Text variant="bodyStrong">
          {unlocked} de {all.length} desbloqueados
        </Text>
        <ProgressBar
          value={all.length ? unlocked / all.length : 0}
          accessibilityLabel="Logros desbloqueados"
        />
      </View>
      {CATEGORIES.map((c) => {
        const items = byCategory(c.id);
        if (items.length === 0) return null;
        return (
          <Card key={c.id} style={styles.card}>
            <Text variant="overline">{c.title.toUpperCase()}</Text>
            {items.map((a) => (
              <AchievementRow key={a.id} achievement={a} rankedAvailable={RANKED_AVAILABLE} />
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
