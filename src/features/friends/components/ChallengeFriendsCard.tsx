import { router } from 'expo-router';
import { KeyRound, Swords, UserPlus } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, MIN_TOUCH, Text, colors, gradients, radii, spacing } from '@/design-system';

import type { FriendEntry } from '../api';
import { PlayerRow, StatusTag } from './PlayerRow';

/** Amigos conectados a la vista en la tarjeta (el resto, en "Tus amigos"). */
const MAX_ONLINE = 5;

export function challengeFriend(friend: Pick<FriendEntry, 'userId' | 'username'>) {
  router.push({
    pathname: '/battle',
    params: { challenge: 'host', friend: friend.userId, friendName: friend.username },
  });
}

export function acceptInvite(code: string) {
  router.push({ pathname: '/battle', params: { code } });
}

/** Desafiar / Aceptar / Desafío enviado, según el estado del amigo. */
export function ChallengeAction({ friend }: { friend: FriendEntry }) {
  if (friend.inviteCode) {
    const code = friend.inviteCode;
    return (
      <Pill
        label="Aceptar"
        accessibilityLabel={`Aceptar el desafío de ${friend.username}`}
        onPress={() => acceptInvite(code)}
        highlight
      />
    );
  }
  if (friend.invitedByMe) return <StatusTag label="Desafío enviado" color="primarySoft" />;
  return (
    <Pill
      label="Desafiar"
      accessibilityLabel={`Desafiar a ${friend.username} a un amistoso`}
      onPress={() => challengeFriend(friend)}
    />
  );
}

function Pill({
  label,
  accessibilityLabel,
  onPress,
  highlight,
}: {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
  highlight?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        highlight && styles.pillHighlight,
        pressed && styles.pressed,
      ]}
    >
      <Swords color={colors.onPrimary} size={16} />
      <Text variant="bodyStrong" color="onPrimary">
        {label}
      </Text>
    </Pressable>
  );
}

/** Tarjeta principal: amigos en línea, cada uno con "Desafiar". */
export function ChallengeFriendsCard({ friends }: { friends: FriendEntry[] }) {
  const online = friends.filter((f) => f.online);
  return (
    <Card gradient={gradients.ranked} style={styles.card}>
      <View style={styles.titleRow}>
        <Swords color={colors.primarySoft} size={22} />
        <Text variant="heading" style={styles.flex}>
          Desafiar a un amigo
        </Text>
        {online.length > 0 ? (
          <View style={styles.onlineCount}>
            <View style={styles.dot} />
            <Text variant="caption" color="success">
              {online.length} en línea
            </Text>
          </View>
        ) : null}
      </View>
      <Text color="textMuted">
        75 segundos de vocabulario, cara a cara. Amistoso: no mueve el ELO.
      </Text>

      {friends.length === 0 ? (
        <View style={styles.empty}>
          <Text color="text">Agregá a tus amigos para desafiarlos cuando estén conectados.</Text>
          <Button
            label="Agregar amigos"
            icon={<UserPlus color={colors.onPrimary} size={20} />}
            onPress={() => router.push('/add-friends')}
          />
        </View>
      ) : online.length === 0 ? (
        <View style={styles.empty}>
          <Text color="text">
            Ninguno de tus amigos está conectado ahora. Podés crear un código y mandárselo.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {online.slice(0, MAX_ONLINE).map((f) => (
            <PlayerRow key={f.userId} player={f} online trailing={<ChallengeAction friend={f} />} />
          ))}
          {online.length > MAX_ONLINE ? (
            <Text variant="caption">
              Y {online.length - MAX_ONLINE} más en línea: están en «Tus amigos».
            </Text>
          ) : null}
        </View>
      )}

      {friends.length > 0 ? (
        <Button
          label="Desafiar con un código"
          variant="ghost"
          icon={<KeyRound color={colors.textMuted} size={18} />}
          accessibilityHint="Crea un código para compartir con quien quieras"
          onPress={() => router.push({ pathname: '/battle', params: { challenge: 'host' } })}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flex: 1 },
  onlineCount: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  empty: { gap: spacing.md },
  list: { gap: spacing.md },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: MIN_TOUCH,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  pillHighlight: { backgroundColor: colors.successDeep },
  pressed: { opacity: 0.75 },
});
