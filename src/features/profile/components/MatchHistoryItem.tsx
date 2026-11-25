import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Text, colors, radii, spacing, useTheme } from '@/design-system';
import { useLocale, useStrings } from '@/i18n';

import { playerLook } from '@/features/battle/rivalLook';

import type { MatchHistoryEntry } from '../api';
import { formatDelta } from '../stats';
import { historyStrings } from '../strings';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
};

const RESULT_COLOR = { win: 'success', loss: 'danger', draw: 'textMuted' } as const;

/** Una partida terminada. El resultado se nombra con texto, no sólo con color. */
export function MatchHistoryItem({ match }: { match: MatchHistoryEntry }) {
  useTheme();
  const t = useStrings(historyStrings);
  const dateFormat = new Intl.DateTimeFormat(useLocale(), DATE_OPTIONS);
  const resultLabel = t.result(match.result);
  const opponentName = match.opponent?.username ?? t.deletedPlayer;
  const delta =
    match.isRanked && match.ratingDelta !== null ? formatDelta(match.ratingDelta) : null;
  // Un rival de práctica se ve con el avatar de su identidad (el mismo que en la partida).
  const opponentAvatarId = playerLook(match.opponent).avatarId;
  const opponentId = match.opponent?.id ?? null;
  const canOpen = Boolean(opponentId && match.opponent?.username);

  // Sin ELO (p. ej. contra un rival de práctica fuera del cupo de calibración): también en voz alta.
  const label =
    t.matchA11y(
      resultLabel,
      Boolean(match.forfeited),
      opponentName,
      match.score,
      match.opponentScore ?? 0,
      delta,
    ) + (match.isRanked ? '' : t.noEloA11y);

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
      <Avatar avatarId={opponentAvatarId} size={36} />
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text variant="bodyStrong" numberOfLines={1} style={styles.shrink}>
            {opponentName}
          </Text>
        </View>
        <Text variant="caption">
          {dateFormat.format(new Date(match.endedAt))}
          {match.isRanked ? '' : t.noElo}
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
