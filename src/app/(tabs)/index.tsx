import { router } from 'expo-router';
import { BookOpen, Flame, Layers, Swords } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import {
  Avatar,
  Button,
  Card,
  ErrorState,
  LoadingState,
  Screen,
  Text,
  colors,
  spacing,
} from '@/design-system';
import { useMyProfile } from '@/features/profile/hooks';
import { RankCard } from '@/features/ranked/RankCard';

function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 6) return 'Buenas noches';
  if (h < 13) return 'Buen día';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function HomeScreen() {
  const { data, isPending, isError, refetch, isRefetching } = useMyProfile();

  if (isPending) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;
  const { profile, rating } = data;

  return (
    <Screen onRefresh={() => void refetch()} refreshing={isRefetching}>
      <View style={styles.header}>
        <Avatar avatarId={profile.avatar_id} size={48} />
        <View style={styles.headerText}>
          <Text variant="caption">{greeting()},</Text>
          <Text variant="heading" numberOfLines={1}>
            {profile.display_name ?? profile.username}
          </Text>
        </View>
      </View>

      {rating ? <RankCard rating={rating} /> : null}

      <Button
        label="Jugar Ranked"
        size="lg"
        icon={<Swords color={colors.onPrimary} size={20} />}
        onPress={() => router.navigate('/ranked')}
      />

      <Card onPress={() => router.navigate('/learn')} accessibilityLabel="Lección diaria">
        <View style={styles.row}>
          <BookOpen color={colors.info} size={22} />
          <View style={styles.flex}>
            <Text variant="bodyStrong">Lección diaria</Text>
            <Text variant="caption">
              Las lecciones A1 se habilitan en la próxima actualización.
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.grid}>
        <Card style={styles.half}>
          <Flame color={colors.streak} size={22} />
          <Text variant="stat">0</Text>
          <Text variant="caption">Días de racha</Text>
        </Card>
        <Card
          style={styles.half}
          onPress={() => router.navigate('/vocabulary')}
          accessibilityLabel="Vocabulario"
        >
          <Layers color={colors.primarySoft} size={22} />
          <Text variant="stat">0</Text>
          <Text variant="caption">Palabras para repasar</Text>
        </Card>
      </View>
      <Text variant="caption" align="center">
        La racha y los repasos empiezan a contar cuando completes tu primera lección.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerText: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
  grid: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1, gap: spacing.xs },
});
