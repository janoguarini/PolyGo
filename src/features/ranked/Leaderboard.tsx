import { router } from 'expo-router';
import { Crown, Star } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { flagEmoji } from '@shared/profile';

import {
  Avatar,
  RankEmblemForRating,
  Text,
  colors,
  palette,
  radii,
  spacing,
} from '@/design-system';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

import type { LeaderboardEntry } from './api';

/** Oro, plata y bronce del podio. */
const MEDALS = ['#F5C542', '#C9D1DE', '#D9905F'] as const;

function openPlayer(entry: LeaderboardEntry, isMe: boolean) {
  if (isMe) router.navigate('/profile');
  else router.push({ pathname: '/player/[id]', params: { id: entry.userId } });
}

/** «Top 4 %» a partir del puesto; mínimo 1 %. */
export function topPercent(position: number, total: number): number {
  if (total <= 0) return 100;
  return Math.max(1, Math.ceil((position / total) * 100));
}

/** Los tres primeros, en escalones (2.º, 1.º, 3.º). */
export function Podium({ entries, meId }: { entries: LeaderboardEntry[]; meId?: string }) {
  const order = [entries[1], entries[0], entries[2]];
  return (
    <View style={styles.podium}>
      {order.map((entry, i) => {
        if (!entry) return <View key={i} style={styles.podiumSlot} />;
        const place = entry.position;
        const medal = MEDALS[place - 1] ?? MEDALS[2];
        const first = place === 1;
        const isMe = entry.userId === meId;
        return (
          <Pressable
            key={entry.userId}
            style={({ pressed }) => [styles.podiumSlot, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`Puesto ${place}, ${entry.username}, ${entry.rating} ELO`}
            accessibilityHint="Abre el perfil del jugador"
            onPress={() => openPlayer(entry, isMe)}
          >
            {first ? <Crown color={medal} fill={medal} size={26} /> : null}
            <View style={[styles.podiumRing, { borderColor: medal }]}>
              <Avatar
                avatarId={entry.avatarId}
                photoUrl={avatarPhotoUrl(entry.avatarPath)}
                size={first ? 72 : 56}
              />
            </View>
            <Text variant="bodyStrong" numberOfLines={1} align="center">
              {isMe ? 'Vos' : entry.username}
            </Text>
            <View style={styles.podiumElo}>
              <RankEmblemForRating rating={entry.rating} size={20} />
              <Text variant="caption" color="text">
                {entry.rating}
              </Text>
            </View>
            <View
              style={[
                styles.step,
                { height: first ? 64 : place === 2 ? 46 : 34, borderTopColor: medal },
              ]}
            >
              <Text variant="title" style={{ color: medal }}>
                {place}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Una fila de la clasificación. `highlight` = la fila propia (en la lista o fija abajo). */
export function LeaderboardRow({
  entry,
  isMe,
  stars,
  highlight = isMe,
}: {
  entry: LeaderboardEntry;
  isMe: boolean;
  stars?: number;
  highlight?: boolean;
}) {
  const flag = flagEmoji(entry.region);
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        entry.position % 2 === 0 && styles.rowAlt,
        highlight && styles.rowMe,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Puesto ${entry.position}, ${entry.username}, ${entry.rating} ELO${stars !== undefined ? `, ${stars} estrellas` : ''}`}
      accessibilityHint="Abre el perfil del jugador"
      onPress={() => openPlayer(entry, isMe)}
    >
      <View style={[styles.badge, highlight && styles.badgeMe]}>
        <Text
          variant="bodyStrong"
          color={highlight ? 'onPrimary' : 'text'}
          style={styles.badgeText}
        >
          {entry.position}
        </Text>
      </View>
      <Avatar avatarId={entry.avatarId} photoUrl={avatarPhotoUrl(entry.avatarPath)} size={38} />
      <View style={styles.name}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {entry.username}
          {flag ? ` ${flag}` : ''}
        </Text>
        {isMe || stars !== undefined ? (
          <View style={styles.sub}>
            {isMe ? (
              <Text variant="caption" color="primarySoft">
                Vos
              </Text>
            ) : null}
            {stars !== undefined ? (
              <>
                <Star color={colors.gold} fill={colors.gold} size={12} />
                <Text variant="caption" color="gold">
                  {stars}
                </Text>
              </>
            ) : null}
          </View>
        ) : null}
      </View>
      <View style={styles.elo}>
        <RankEmblemForRating rating={entry.rating} size={28} />
        <Text variant="bodyStrong" color="textStrong" style={styles.eloText}>
          {entry.rating}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.75 },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  podiumSlot: { flex: 1, alignItems: 'center', gap: spacing.xxs },
  podiumRing: { padding: 2, borderWidth: 3, borderRadius: radii.pill },
  podiumElo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  step: {
    alignSelf: 'stretch',
    marginTop: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 3,
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
    backgroundColor: colors.surfaceHighlight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  rowAlt: { backgroundColor: colors.surfaceRaised },
  rowMe: {
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1.5,
    borderColor: colors.primaryBright,
  },
  badge: {
    minWidth: 34,
    height: 28,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ink600,
  },
  badgeMe: { backgroundColor: colors.primary },
  badgeText: { fontVariant: ['tabular-nums'] },
  name: { flex: 1, gap: 2 },
  sub: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  elo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  eloText: { minWidth: 40, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
