import { router } from 'expo-router';
import { Swords } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  colors,
  spacing,
} from '@/design-system';
import { MatchHistoryItem } from '@/features/profile/components/MatchHistoryItem';
import { useMatchHistory } from '@/features/profile/hooks';

export default function MatchesScreen() {
  const matches = useMatchHistory();
  const all = matches.data?.pages.flat() ?? [];

  return (
    <Screen onRefresh={() => void matches.refetch()} refreshing={matches.isRefetching}>
      <ScreenHeader title="Historial de partidas" onBack={() => router.back()} />
      {matches.isPending ? (
        <LoadingState label="Cargando partidas…" />
      ) : matches.isError ? (
        <ErrorState onRetry={() => void matches.refetch()} />
      ) : all.length === 0 ? (
        <EmptyState
          icon={<Swords color={colors.textMuted} size={36} />}
          title="Sin partidas todavía"
          message="Cuando juegues Word Rush vas a ver acá cada resultado y cuánto ELO ganaste o perdiste."
        />
      ) : (
        <Card style={styles.list}>
          {all.map((m) => (
            <MatchHistoryItem key={m.battleId} match={m} />
          ))}
          {matches.hasNextPage ? (
            <Button
              label="Cargar más"
              variant="ghost"
              loading={matches.isFetchingNextPage}
              onPress={() => void matches.fetchNextPage()}
            />
          ) : null}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.xs, paddingVertical: spacing.sm },
});
