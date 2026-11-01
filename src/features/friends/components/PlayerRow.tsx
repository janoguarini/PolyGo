import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MIN_TOUCH, RankEmblemForRating, Text, colors, radii, spacing } from '@/design-system';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

import { leagueLabel } from '../format';

export interface RowPlayer {
  userId: string;
  username: string;
  avatarId: string;
  avatarPath: string | null;
  frameId: string | null;
  rating: number | null;
  placed: boolean;
}

export function openPlayer(userId: string) {
  router.push({ pathname: '/player/[id]', params: { id: userId } });
}

/** Avatar con un punto verde si está en línea. */
export function StatusAvatar({
  player,
  size,
  online,
}: {
  player: Pick<RowPlayer, 'avatarId' | 'avatarPath' | 'frameId'>;
  size: number;
  online?: boolean;
}) {
  const dot = Math.max(10, Math.round(size * 0.28));
  return (
    <View>
      <FramedAvatar
        avatarId={player.avatarId}
        photoUrl={avatarPhotoUrl(player.avatarPath)}
        size={player.frameId ? size - 6 : size}
        frameId={player.frameId}
      />
      {online ? (
        <View
          style={[styles.dot, { width: dot, height: dot, borderRadius: dot / 2 }]}
          accessible={false}
        />
      ) : null}
    </View>
  );
}

/** Liga con su emblema: "Oro II · 812". */
export function LeagueLine({ player, extra }: { player: RowPlayer; extra?: string }) {
  return (
    <View style={styles.sub}>
      {player.rating !== null ? (
        <RankEmblemForRating rating={player.rating} size={16} dimmed={!player.placed} />
      ) : null}
      <Text variant="caption" numberOfLines={1} style={styles.shrink}>
        {leagueLabel(player.rating, player.placed)}
        {player.placed && player.rating !== null ? ` · ${player.rating}` : ''}
        {extra ? ` · ${extra}` : ''}
      </Text>
    </View>
  );
}

/** Fila de jugador: avatar + nombre + liga (toca → perfil) y una acción a la derecha. */
export function PlayerRow({
  player,
  trailing,
  online,
  subtitle,
}: {
  player: RowPlayer;
  trailing?: ReactNode;
  online?: boolean;
  /** Reemplaza el texto que va después de la liga. */
  subtitle?: string;
}) {
  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [styles.identity, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${player.username}, ${leagueLabel(player.rating, player.placed)}${subtitle ? `, ${subtitle}` : ''}. Ver perfil`}
        onPress={() => openPlayer(player.userId)}
      >
        <StatusAvatar player={player} size={42} online={online} />
        <View style={styles.flex}>
          <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
            {player.username}
          </Text>
          <LeagueLine player={player} extra={subtitle} />
        </View>
      </Pressable>
      {trailing}
    </View>
  );
}

/** Botón redondo con ícono (44 px, el mínimo táctil). */
export function IconAction(props: {
  label: string;
  primary?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.label}
      accessibilityState={{ disabled: props.disabled }}
      disabled={props.disabled}
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.iconButton,
        props.primary && styles.iconButtonPrimary,
        (pressed || props.disabled) && styles.pressed,
      ]}
    >
      {props.children}
    </Pressable>
  );
}

/** Pastilla de estado: "Enviada", "Amigos", "Desafío enviado". */
export function StatusTag({
  icon,
  label,
  color = 'textMuted',
}: {
  icon?: ReactNode;
  label: string;
  color?: keyof typeof colors;
}) {
  return (
    <View style={styles.tag}>
      {icon}
      <Text variant="caption" color={color}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  identity: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
  shrink: { flexShrink: 1 },
  sub: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pressed: { opacity: 0.6 },
  dot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  iconButton: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHighlight,
  },
  iconButtonPrimary: { backgroundColor: colors.primary },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceHighlight,
  },
});
