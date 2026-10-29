import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Card, ErrorState, ProgressBar, Text, colors, spacing } from '@/design-system';

import { useMyAchievements } from '../hooks';
import { achievementRatio } from '../stats';
import { AchievementIcon } from './AchievementBadge';

const SHOWN = 5;

/** Tarjeta de logros del perfil: cuántos van y los próximos/obtenidos. Abre la lista completa. */
export function AchievementsSummary() {
  const achievements = useMyAchievements();

  if (achievements.isError)
    return (
      <ErrorState
        message="No pudimos cargar tus logros."
        onRetry={() => void achievements.refetch()}
      />
    );
  if (!achievements.data) return <Text variant="caption">Cargando logros…</Text>;

  const all = achievements.data;
  const unlocked = all.filter((a) => a.unlockedAt);
  // Primero los obtenidos (más recientes), después los más cercanos a desbloquearse.
  const featured = [
    ...unlocked.sort((a, b) => b.unlockedAt!.localeCompare(a.unlockedAt!)),
    ...all.filter((a) => !a.unlockedAt).sort((a, b) => achievementRatio(b) - achievementRatio(a)),
  ].slice(0, SHOWN);

  return (
    <Card
      style={styles.card}
      onPress={() => router.push('/achievements')}
      accessibilityLabel={`Logros: ${unlocked.length} de ${all.length} desbloqueados. Ver todos.`}
    >
      <View style={styles.header}>
        <Text variant="bodyStrong">
          {unlocked.length} de {all.length} desbloqueados
        </Text>
        <ChevronRight color={colors.textMuted} size={20} />
      </View>
      <ProgressBar value={all.length ? unlocked.length / all.length : 0} />
      <View style={styles.icons}>
        {featured.map((a) => (
          <AchievementIcon key={a.id} icon={a.icon} unlocked={Boolean(a.unlockedAt)} />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  icons: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
});
