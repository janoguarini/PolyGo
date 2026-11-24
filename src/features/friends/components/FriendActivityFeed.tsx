import { Award, Flame, Handshake, Layers, Swords, TrendingUp, BookOpen } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Text, colors, spacing, useTheme } from '@/design-system';
import { useStrings } from '@/i18n';

import { activityText, timeAgo } from '../format';
import { useFriendActivity, type FriendActivityKind } from '../social';
import { friendsStrings } from '../strings';
import { StatusAvatar, openPlayer } from './PlayerRow';

const PREVIEW = 6;

/** Ícono de cada evento (se crea al dibujar: el color depende del tema). */
const kindIcon = (kind: FriendActivityKind): ReactNode =>
  ({
    rank_up: <TrendingUp color={colors.gold} size={14} />,
    wins_week: <Swords color={colors.primarySoft} size={14} />,
    reviews_week: <Layers color={colors.info} size={14} />,
    lessons_week: <BookOpen color={colors.info} size={14} />,
    achievement: <Award color={colors.gold} size={14} />,
    streak: <Flame color={colors.streak} size={14} />,
    new_friend: <Handshake color={colors.success} size={14} />,
  })[kind];

/** Actividad de los amigos de los últimos 7 días (sólo eventos reales de la base). */
export function FriendActivityFeed({ now }: { now: number }) {
  useTheme();
  const t = useStrings(friendsStrings);
  const activity = useFriendActivity();
  const [showAll, setShowAll] = useState(false);

  if (activity.isPending)
    return (
      <Card style={styles.center}>
        <ActivityIndicator color={colors.primaryBright} accessibilityLabel={t.loadingActivity} />
      </Card>
    );
  if (activity.isError)
    return (
      <Card style={styles.gap}>
        <Text color="textMuted">{t.activityError}</Text>
        <Button label={t.retry} variant="secondary" onPress={() => void activity.refetch()} />
      </Card>
    );

  const events = (activity.data ?? []).flatMap((e) => {
    const text = activityText(e);
    return text ? [{ ...e, text }] : [];
  });
  if (events.length === 0)
    return (
      <Card>
        <Text color="textMuted">{t.activityEmpty}</Text>
      </Card>
    );

  const visible = showAll ? events : events.slice(0, PREVIEW);
  return (
    <Card style={styles.list}>
      {visible.map((e) => (
        <Pressable
          key={`${e.userId}-${e.kind}-${e.happenedAt}-${e.label ?? ''}`}
          accessibilityRole="button"
          accessibilityLabel={t.activityA11y(e.username, e.text, timeAgo(e.happenedAt, now))}
          onPress={() => openPlayer(e.userId)}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <StatusAvatar player={e} size={36} />
          <View style={styles.flex}>
            <Text>
              <Text variant="bodyStrong" color="textStrong">
                {e.username}
              </Text>{' '}
              {e.text}
            </Text>
            <View style={styles.meta}>
              {kindIcon(e.kind)}
              <Text variant="caption">{timeAgo(e.happenedAt, now)}</Text>
            </View>
          </View>
        </Pressable>
      ))}
      {events.length > PREVIEW ? (
        <Button
          label={showAll ? t.showLess : t.showAllActivity(events.length)}
          variant="ghost"
          onPress={() => setShowAll((v) => !v)}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  gap: { gap: spacing.md },
  list: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 44 },
  flex: { flex: 1, gap: spacing.xxs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pressed: { opacity: 0.6 },
});
