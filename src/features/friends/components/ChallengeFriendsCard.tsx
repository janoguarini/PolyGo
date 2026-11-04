import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { KeyRound, Swords, UserPlus } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Button, MIN_TOUCH, Text, colors, elevation, radii, spacing } from '@/design-system';
import { mascotChallenge } from '@/design-system/imageData.generated';

import type { FriendEntry } from '../api';
import { IconTile } from './IconTile';
import { PlayerRow, StatusTag } from './PlayerRow';

/** Amigos conectados a la vista en la tarjeta (el resto, en "Mis amigos"). */
const MAX_ONLINE = 5;

/** Ancho / alto de assets/mascot/challenge.webp. */
const FOX_ASPECT = 520 / 486;
const FOX_HEIGHT = 136;
const FOX_WIDTH = FOX_HEIGHT * FOX_ASPECT;
/** Cuánto lo tapa el botón de abajo. */
const FOX_TUCK = 6;
/** Alto de la parte de arriba: el zorro entra entero, sin pasarse del borde. */
const HERO_HEIGHT = FOX_HEIGHT - spacing.lg - FOX_TUCK - spacing.xs;

/** Abre la pantalla de desafío (elegir modo) con el amigo ya elegido. */
export function challengeFriend(friend: Pick<FriendEntry, 'userId' | 'username'>) {
  router.push({
    pathname: '/challenge-friend',
    params: { friend: friend.userId, friendName: friend.username },
  });
}

export function acceptInvite(code: string) {
  router.push({ pathname: '/battle', params: { code } });
}

/** Desafiar / Aceptar / Desafío enviado, según el estado del amigo. */
export function ChallengeAction({ friend, outline }: { friend: FriendEntry; outline?: boolean }) {
  if (friend.inviteCode) {
    const code = friend.inviteCode;
    return (
      <Pill
        label="Aceptar"
        accessibilityLabel={`Aceptar el desafío de ${friend.username}`}
        onPress={() => acceptInvite(code)}
        highlight
        compact={outline}
      />
    );
  }
  if (friend.invitedByMe) return <StatusTag label="Desafío enviado" color="primarySoft" />;
  return (
    <Pill
      label="Desafiar"
      accessibilityLabel={`Desafiar a ${friend.username} a un amistoso`}
      onPress={() => challengeFriend(friend)}
      outline={outline}
      compact={outline}
    />
  );
}

function Pill({
  label,
  accessibilityLabel,
  onPress,
  highlight,
  outline,
  compact,
}: {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
  highlight?: boolean;
  outline?: boolean;
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        compact && styles.pillCompact,
        outline && styles.pillOutline,
        highlight && styles.pillHighlight,
        pressed && styles.pressed,
      ]}
    >
      <Swords color={outline ? colors.primarySoft : colors.onPrimary} size={16} />
      <Text variant="bodyStrong" color={outline ? 'textStrong' : 'onPrimary'}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Tarjeta principal: el zorro, amigos en línea (cada uno con "Desafiar") o cómo empezar. */
export function ChallengeFriendsCard({ friends }: { friends: FriendEntry[] }) {
  const online = friends.filter((f) => f.online);
  const codeIsMain = friends.length > 0 && online.length === 0;
  return (
    <View style={styles.glow}>
      <LinearGradient
        colors={['#3F2391', '#24145C', '#160F3A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.hero}>
          <Image
            source={mascotChallenge}
            style={styles.fox}
            resizeMode="contain"
            fadeDuration={0}
            accessible={false}
            pointerEvents="none"
          />
          <View style={styles.intro}>
            <IconTile>
              <Swords color={colors.primarySoft} size={24} />
            </IconTile>
            <Text variant="heading" color="textStrong" style={styles.title}>
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
        </View>

        {friends.length === 0 ? (
          <Button
            label="Agregar amigos"
            icon={<UserPlus color={colors.onPrimary} size={20} />}
            onPress={() => router.push('/add-friends')}
            style={styles.glowButton}
          />
        ) : online.length === 0 ? (
          <Text color="textMuted">
            Ninguno de tus amigos está conectado ahora. Podés crear un código y mandárselo.
          </Text>
        ) : (
          <View style={styles.list}>
            {online.slice(0, MAX_ONLINE).map((f) => (
              <PlayerRow
                key={f.userId}
                player={f}
                online
                trailing={<ChallengeAction friend={f} />}
              />
            ))}
            {online.length > MAX_ONLINE ? (
              <Text variant="caption">
                Y {online.length - MAX_ONLINE} más en línea: están en «Mis amigos».
              </Text>
            ) : null}
          </View>
        )}

        {friends.length > 0 ? (
          <Button
            label="Desafiar con un código"
            variant={codeIsMain ? 'primary' : 'ghost'}
            icon={<KeyRound color={codeIsMain ? colors.onPrimary : colors.textMuted} size={18} />}
            accessibilityHint="Elegí el modo y creá un código para compartir"
            onPress={() => router.push('/challenge-friend')}
            style={codeIsMain ? styles.glowButton : undefined}
          />
        ) : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // La sombra va afuera: la tarjeta recorta al zorro con sus bordes redondeados.
  glow: { borderRadius: radii.xl, backgroundColor: '#24145C', ...elevation.glow },
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.5)',
    overflow: 'hidden',
  },
  hero: { minHeight: HERO_HEIGHT, justifyContent: 'center' },
  // Deja lugar a la derecha para el zorro.
  intro: { gap: spacing.sm, paddingRight: FOX_WIDTH - spacing.lg },
  title: { fontSize: 22, lineHeight: 27, fontWeight: '800' },
  onlineCount: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  list: { gap: spacing.md },
  glowButton: {
    shadowColor: colors.primaryBright,
    shadowOpacity: 0.7,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  // Apoyado sobre lo que sigue (el botón lo tapa apenas), como si asomara detrás.
  fox: {
    position: 'absolute',
    right: -spacing.sm,
    bottom: -(spacing.lg + FOX_TUCK),
    width: FOX_WIDTH,
    height: FOX_HEIGHT,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: MIN_TOUCH,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  pillCompact: { paddingHorizontal: spacing.md },
  pillOutline: {
    backgroundColor: 'rgba(124, 58, 237, 0.14)',
    borderWidth: 1.5,
    borderColor: colors.primaryBright,
  },
  pillHighlight: { backgroundColor: colors.successDeep },
  pressed: { opacity: 0.75 },
});
