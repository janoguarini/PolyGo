import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Text, colors, radii, spacing } from '@/design-system';

import type { MatchHistoryEntry } from '../api';
import { RESULT_LABELS, formatDelta } from '../stats';

const dateFormat = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const RESULT_COLOR = { win: 'success', loss: 'danger', draw: 'textMuted' } as const;

/** Una partida terminada. El resultado se nombra con texto, no sólo con color. */
export function MatchHistoryItem({ match }: { match: MatchHistoryEntry }) {
  const resultLabel = match.result ? RESULT_LABELS[match.result] : 'Sin resultado';
  const opponentName = match.opponent?.username ?? 'Jugador eliminado';
  const delta =
    match.isRanked && match.ratingDelta !== null ? formatDelta(match.ratingDelta) : null;
  const canOpen = Boolean(match.opponent?.username);

  const label = `${resultLabel}${match.forfeited ? ' por abandono' : ''} contra ${opponentName}, ${
    match.score
  } a ${match.opponentScore ?? 0}${delta ? `, ${delta} ELO` : ''}`;

  return (
    <Pressable
      disabled={!canOpen}
      onPress={() => router.push({ pathname: '/player/[id]', params: { id: match.opponent!.id } })}
      accessibilityRole={canOpen ? 'button' : undefined}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View
        style={[styles.marker, { backgroundColor: colors[RESULT_COLOR[match.result ?? 'draw']] }]}
      />
      <Avatar avatarId={match.opponent?.avatarId} size={36} />
      <View style={styles.body}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {opponentName}
        </Text>
        <Text variant="caption">
          {dateFormat.format(new Date(match.endedAt))}
          {match.isRanked ? '' : ' · práctica'}
        </Text>
      </View>
      <View style={styles.right}>
        <Text variant="bodyStrong" color={RESULT_COLOR[match.result ?? 'draw']}>
          {resultLabel}
        </Text>
        <Text variant="caption">
          {match.score}–{match.opponentScore ?? 0}
          {delta ? ` · ${delta}` : ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  pressed: { opacity: 0.8 },
  marker: { width: 4, alignSelf: 'stretch', borderRadius: radii.sm },
  body: { flex: 1, gap: spacing.xxs },
  right: { alignItems: 'flex-end', gap: spacing.xxs },
});
