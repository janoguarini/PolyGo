import { router } from 'expo-router';
import { ChevronRight, Flame, Plus, UserPlus, Users } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  MIN_TOUCH,
  Screen,
  Text,
  colors,
  radii,
  spacing,
} from '@/design-system';
import { useFriends, type FriendEntry } from '@/features/friends/api';
import {
  ChallengeAction,
  ChallengeFriendsCard,
} from '@/features/friends/components/ChallengeFriendsCard';
import { FriendActivityFeed } from '@/features/friends/components/FriendActivityFeed';
import { PlayerRow } from '@/features/friends/components/PlayerRow';
import { PushPromptCard } from '@/features/friends/components/PushPromptCard';
import { WeeklyChallengesCard } from '@/features/friends/components/WeeklyChallengesCard';
import { presenceLabel, sortFriends } from '@/features/friends/format';
import { useTabPressScroll } from '@/lib/useTabPressScroll';

/** Cada cuánto se refrescan la lista (en línea, invitaciones) y los "hace X min". */
const REFRESH_MS = 30_000;

export default function FriendsScreen() {
  const friends = useFriends();
  const scrollRef = useRef<ScrollViewInstance>(null);
  useTabPressScroll(scrollRef);
  const [now, setNow] = useState(() => Date.now());

  const { refetch } = friends;
  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
      void refetch();
    }, REFRESH_MS);
    return () => clearInterval(t);
  }, [refetch]);

  if (friends.isPending) return <LoadingState />;
  if (friends.isError || !friends.data)
    return <ErrorState onRetry={() => void friends.refetch()} />;

  const incoming = friends.data.filter((f) => f.state === 'incoming');
  const accepted = sortFriends(friends.data.filter((f) => f.state === 'friends'));

  return (
    <Screen
      scrollRef={scrollRef}
      onRefresh={() => {
        setNow(Date.now());
        void friends.refetch();
      }}
      refreshing={friends.isRefetching}
    >
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text variant="title">Amigos</Text>
          <Text color="textMuted">Competí y aprendé con tus amigos</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            incoming.length > 0
              ? `Agregar amigos. ${incoming.length} solicitudes nuevas`
              : 'Agregar amigos'
          }
          onPress={() => router.push('/add-friends')}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Plus color={colors.onPrimary} size={18} />
          <Text variant="bodyStrong" color="onPrimary">
            Agregar
          </Text>
          {incoming.length > 0 ? (
            <View style={styles.badge}>
              <Text variant="caption" color="onPrimary" style={styles.badgeText}>
                {incoming.length}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {incoming.length > 0 ? (
        <Card
          onPress={() => router.push('/add-friends')}
          accessibilityLabel={`${incoming.length} solicitudes de amistad. Ver`}
          style={styles.requests}
        >
          <UserPlus color={colors.primarySoft} size={22} />
          <Text variant="bodyStrong" color="textStrong" style={styles.flex}>
            {incoming.length === 1
              ? `@${incoming[0]!.username} quiere ser tu amigo`
              : `${incoming.length} solicitudes de amistad`}
          </Text>
          <ChevronRight color={colors.textMuted} size={20} />
        </Card>
      ) : null}

      <ChallengeFriendsCard friends={accepted} />

      {accepted.length > 0 ? <PushPromptCard /> : null}

      {accepted.length > 0 ? (
        <>
          <Text variant="overline">ACTIVIDAD RECIENTE</Text>
          <FriendActivityFeed now={now} />
        </>
      ) : null}

      <Text variant="overline">RETOS DE LA SEMANA</Text>
      <WeeklyChallengesCard now={now} />

      <Text variant="overline">TUS AMIGOS{accepted.length > 0 ? ` · ${accepted.length}` : ''}</Text>
      {accepted.length === 0 ? (
        <EmptyState
          icon={<Users color={colors.textMuted} size={36} />}
          title="Todavía no tenés amigos"
          message="Buscalos por su nombre de usuario o pasales tu código de amigo."
          actionLabel="Agregar amigos"
          onAction={() => router.push('/add-friends')}
        />
      ) : (
        <Card style={styles.list}>
          {accepted.map((f) => (
            <FriendRow key={f.userId} friend={f} now={now} />
          ))}
        </Card>
      )}
    </Screen>
  );
}

/** Fila de "Tus amigos": estado, racha y desafiar si está conectado. */
function FriendRow({ friend, now }: { friend: FriendEntry; now: number }) {
  const streak = friend.streak > 0;
  return (
    <PlayerRow
      player={friend}
      online={friend.online}
      subtitle={presenceLabel(friend, now)}
      trailing={
        friend.online || friend.inviteCode ? (
          <ChallengeAction friend={friend} />
        ) : (
          <View
            style={styles.streak}
            accessible
            accessibilityLabel={`Racha de ${friend.streak} ${friend.streak === 1 ? 'día' : 'días'}`}
          >
            <Flame color={streak ? colors.streak : colors.textSubtle} size={18} />
            <Text variant="bodyStrong" color={streak ? 'streak' : 'textSubtle'}>
              {friend.streak}
            </Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: MIN_TOUCH,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: spacing.xs,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerDeep,
  },
  badgeText: { fontWeight: '700' },
  pressed: { opacity: 0.75 },
  requests: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  list: { gap: spacing.md },
  streak: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
});
