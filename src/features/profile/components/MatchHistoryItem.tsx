import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Text, colors, radii, spacing } from '@/design-system';

import { BotBadge } from '@/features/battle/components/BotBadge';

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
  const isBot = match.opponent?.isBot ?? false;
  const opponentId = match.opponent?.id ?? null;
  const canOpen = Boolean(opponentId && match.opponent?.username);

  const label = `${resultLabel}${match.forfeited ? ' por abandono' : ''} contra ${opponentName}${isBot ? ' (bot)' : ''}, ${
    match.score
  } a ${match.opponentScore ?? 0}${delta ? `, ${delta} ELO` : ''}`;

  return (
    <Pressable
      disabled={!canOpen}
      onPress={() =>
        opponentId && router.push({ pathname: '/player/[id]', params: { id: opponentId } })
      }
      accessibilityRole={canOpen ? 'button' : undefined}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View
        style={[styles.marker, { backgroundColor: colors[RESULT_COLOR[match.result ?? 'draw']] }]}
      />
      <Avatar avatarId={match.opponent?.avatarId} size={36} />
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text variant="bodyStrong" numberOfLines={1} style={styles.shrink}>
            {opponentName}
          </Text>
          {isBot ? <BotBadge /> : null}
        </View>
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
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  shrink: { flexShrink: 1 },
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
