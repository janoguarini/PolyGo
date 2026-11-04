import { router } from 'expo-router';
import { ChevronRight, Flame, Plus, Target, UserPlus, Users } from 'lucide-react-native';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type ScrollViewInstance,
} from 'react-native';

import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  MIN_TOUCH,
  RankEmblemForRating,
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
import { StatusAvatar, openPlayer } from '@/features/friends/components/PlayerRow';
import { PushPromptCard } from '@/features/friends/components/PushPromptCard';
import { DailyMissionsCard } from '@/features/friends/components/DailyMissionsCard';
import { presenceLabel, sortFriends } from '@/features/friends/format';
import { useTabPressScroll } from '@/lib/useTabPressScroll';

/** Cada cuánto se refrescan la lista (en línea, invitaciones) y los "hace X min". */
const REFRESH_MS = 30_000;
/** Amigos visibles antes de tocar "Ver todos". */
const FRIENDS_PREVIEW = 5;
/** Por debajo de este ancho el ELO pasa a la línea de estado (no entra al lado del botón). */
const NARROW_WIDTH = 380;

export default function FriendsScreen() {
  const friends = useFriends();
  const scrollRef = useRef<ScrollViewInstance>(null);
  useTabPressScroll(scrollRef);
  const [now, setNow] = useState(() => Date.now());
  const [showAll, setShowAll] = useState(false);

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
          <Text color="textMuted">Competí y aprendé con tus amigos.</Text>
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

      <SectionTitle icon={<Target color={colors.primarySoft} size={20} />}>
        <Text variant="overline" color="textStrong" style={styles.overline}>
          MISIONES DIARIAS
        </Text>
      </SectionTitle>
      <DailyMissionsCard now={now} />

      <View style={styles.friendsHeader}>
        <SectionTitle icon={<Users color={colors.primarySoft} size={22} />}>
          <Text variant="heading" color="textStrong">
            Mis amigos
            {accepted.length > 0 ? (
              <Text variant="heading" color="textMuted">
                {` (${accepted.length})`}
              </Text>
            ) : null}
          </Text>
        </SectionTitle>
        {accepted.length > FRIENDS_PREVIEW ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showAll ? 'Ver menos amigos' : 'Ver todos tus amigos'}
            onPress={() => setShowAll((v) => !v)}
            hitSlop={8}
            style={({ pressed }) => [styles.seeAll, pressed && styles.pressed]}
          >
            <Text variant="bodyStrong" color="primarySoft">
              {showAll ? 'Ver menos' : 'Ver todos'}
            </Text>
            <ChevronRight
              color={colors.primarySoft}
              size={18}
              style={showAll ? styles.chevronUp : undefined}
            />
          </Pressable>
        ) : null}
      </View>
      {accepted.length === 0 ? (
        <EmptyState
          icon={<Users color={colors.textMuted} size={36} />}
          title="Todavía no tenés amigos"
          message="Buscalos por su nombre de usuario o pasales tu código de amigo."
          actionLabel="Agregar amigos"
          onAction={() => router.push('/add-friends')}
        />
      ) : (
        <View style={styles.list}>
          {(showAll ? accepted : accepted.slice(0, FRIENDS_PREVIEW)).map((f) => (
            <FriendCard key={f.userId} friend={f} now={now} />
          ))}
        </View>
      )}

      {accepted.length > 0 ? (
        <>
          <Text variant="overline">ACTIVIDAD RECIENTE</Text>
          <FriendActivityFeed now={now} />
        </>
      ) : null}
    </Screen>
  );
}

function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <View style={styles.sectionTitle}>
      {icon}
      {children}
    </View>
  );
}

/** Tarjeta de "Mis amigos": estado, ELO y desafiar si está conectado (si no, su racha). */
function FriendCard({ friend, now }: { friend: FriendEntry; now: number }) {
  const narrow = useWindowDimensions().width < NARROW_WIDTH;
  const streak = friend.streak > 0;
  const rating = friend.placed ? friend.rating : null;
  const elo = rating !== null ? `${rating} ELO` : null;
  const presence = presenceLabel(friend, now);
  return (
    <Card style={styles.friendCard}>
      <Pressable
        style={({ pressed }) => [styles.identity, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${friend.username}, ${presence}${elo ? `, ${elo}` : ''}. Ver perfil`}
        onPress={() => openPlayer(friend.userId)}
      >
        <StatusAvatar player={friend} size={52} />
        <View style={styles.flex}>
          <Text variant="heading" color="textStrong" numberOfLines={1}>
            {friend.username}
          </Text>
          <View style={styles.presence}>
            {friend.online ? <View style={styles.onlineDot} /> : null}
            <Text
              variant="caption"
              color={friend.online ? 'text' : 'textMuted'}
              numberOfLines={1}
              style={styles.shrink}
            >
              {presence}
              {narrow && elo ? ` · ${elo}` : ''}
            </Text>
          </View>
        </View>
        {!narrow && rating !== null ? (
          <View style={styles.elo}>
            <RankEmblemForRating rating={rating} size={22} />
            <Text variant="body" color="text">
              {elo}
            </Text>
          </View>
        ) : null}
      </Pressable>
      {friend.online || friend.inviteCode ? (
        <ChallengeAction friend={friend} outline />
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
      )}
    </Card>
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
  overline: { fontSize: 13, letterSpacing: 2 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  friendsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  chevronUp: { transform: [{ rotate: '-90deg' }] },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  identity: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  presence: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  shrink: { flexShrink: 1 },
  elo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  streak: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
});
