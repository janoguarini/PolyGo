import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, ErrorState, Text, spacing } from '@/design-system';

import { useMatchHistory, useRatingHistory } from '../hooks';
import { MatchHistoryItem } from './MatchHistoryItem';
import { RatingChart } from './RatingChart';

const PREVIEW = 3;

/** Evolución del ELO y últimas partidas del perfil propio. Sin partidas, lo dice: no se inventan datos. */
export function CompetitiveHistory() {
  const history = useRatingHistory();
  const matches = useMatchHistory(PREVIEW);
  const recent = matches.data?.pages[0] ?? [];

  return (
    <>
      <Card style={styles.gap}>
        <Text variant="overline">EVOLUCIÓN DE ELO</Text>
        {history.isError ? (
          <ErrorState
            message="No pudimos cargar tu evolución."
            onRetry={() => void history.refetch()}
          />
        ) : !history.data ? (
          <Text variant="caption">Cargando…</Text>
        ) : history.data.length < 2 ? (
          <Text color="textMuted">Tu evolución aparece después de tu primera partida ranked.</Text>
        ) : (
          <RatingChart series={history.data} />
        )}
      </Card>

      <Card style={styles.gap}>
        <Text variant="overline">ÚLTIMAS PARTIDAS</Text>
        {matches.isError ? (
          <ErrorState
            message="No pudimos cargar tus partidas."
            onRetry={() => void matches.refetch()}
          />
        ) : matches.isPending ? (
          <Text variant="caption">Cargando…</Text>
        ) : recent.length === 0 ? (
          <Text color="textMuted">
            Todavía no jugaste partidas. Las vas a ver acá cuando abra Ranked.
          </Text>
        ) : (
          <View>
            {recent.map((m) => (
              <MatchHistoryItem key={m.battleId} match={m} />
            ))}
            <Button
              label="Ver historial completo"
              variant="ghost"
              onPress={() => router.push('/matches')}
            />
          </View>
        )}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
});
