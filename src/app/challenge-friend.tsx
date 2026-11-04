import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, KeyRound, Send, Sparkles, Timer, Zap } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  RankEmblemForRating,
  Screen,
  ScreenHeader,
  Text,
  colors,
  elevation,
  radii,
  spacing,
} from '@/design-system';
import {
  DEFAULT_GAME_MODE,
  GAME_MODES,
  type GameMode,
  type GameModeId,
} from '@/features/battle/gameModes';
import { useFriends } from '@/features/friends/api';
import { IconTile } from '@/features/friends/components/IconTile';
import { StatusAvatar } from '@/features/friends/components/PlayerRow';
import { presenceLabel } from '@/features/friends/format';

/**
 * Antes de desafiar: a quién (un amigo o un código para compartir) y en qué modo de juego.
 * Params: friend (id) y friendName; sin friend, el desafío es con código.
 */
export default function ChallengeFriendScreen() {
  const params = useLocalSearchParams<{ friend?: string; friendName?: string }>();
  const friends = useFriends();
  const [mode, setMode] = useState<GameModeId>(DEFAULT_GAME_MODE);
  const [now] = useState(() => Date.now());

  const friend = params.friend
    ? friends.data?.find((f) => f.userId === params.friend && f.state === 'friends')
    : undefined;
  const name = friend?.username ?? params.friendName;

  const back = () => (router.canGoBack() ? router.back() : router.replace('/friends'));

  const start = () => {
    router.replace({
      pathname: '/battle',
      params: params.friend
        ? { challenge: 'host', friend: params.friend, friendName: name ?? '', game: mode }
        : { challenge: 'host', game: mode },
    });
  };

  return (
    <Screen
      footer={
        <Button
          label={params.friend ? 'Enviar desafío' : 'Crear código'}
          size="lg"
          icon={
            params.friend ? (
              <Send color={colors.onPrimary} size={20} />
            ) : (
              <KeyRound color={colors.onPrimary} size={20} />
            )
          }
          accessibilityHint={
            params.friend
              ? `Le avisa a ${name ?? 'tu amigo'} y espera a que acepte`
              : 'Crea un código para compartir con quien quieras'
          }
          onPress={start}
        />
      }
    >
      <ScreenHeader title="Desafiar" onBack={back} />

      {params.friend ? (
        <Card style={styles.rival}>
          {friend ? <StatusAvatar player={friend} size={56} online={friend.online} /> : null}
          <View style={styles.flex}>
            <Text variant="overline" color="primarySoft">
              TU RIVAL
            </Text>
            <Text variant="heading" color="textStrong" numberOfLines={1}>
              {name ?? 'Tu amigo'}
            </Text>
            {friend ? (
              <Text variant="caption" color={friend.online ? 'success' : 'textMuted'}>
                {presenceLabel(friend, now)}
              </Text>
            ) : null}
          </View>
          {friend?.placed && friend.rating !== null ? (
            <View style={styles.elo}>
              <RankEmblemForRating rating={friend.rating} size={24} />
              <Text variant="caption" color="text">
                {friend.rating} ELO
              </Text>
            </View>
          ) : null}
        </Card>
      ) : (
        <Card style={styles.rival}>
          <IconTile size={56}>
            <KeyRound color={colors.primarySoft} size={26} />
          </IconTile>
          <View style={styles.flex}>
            <Text variant="heading" color="textStrong">
              Desafío con código
            </Text>
            <Text variant="caption">Creá un código y compartilo con quien quieras.</Text>
          </View>
        </Card>
      )}

      <Text variant="overline" color="textStrong" style={styles.overline}>
        ELEGÍ EL MODO
      </Text>
      <View style={styles.modes} accessibilityRole="radiogroup">
        {GAME_MODES.map((m) => (
          <ModeCard key={m.id} mode={m} selected={m.id === mode} onPress={() => setMode(m.id)} />
        ))}
        <View style={styles.soon}>
          <Sparkles color={colors.textSubtle} size={18} />
          <Text variant="caption" color="textMuted">
            Más modos, muy pronto.
          </Text>
        </View>
      </View>

      <Text variant="caption" align="center">
        Amistoso: no mueve el ELO.
      </Text>
    </Screen>
  );
}

function ModeCard({
  mode,
  selected,
  onPress,
}: {
  mode: GameMode;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${mode.name}, ${mode.duration}`}
      accessibilityHint={mode.description}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <LinearGradient
        colors={selected ? ['#3F2391', '#24145C'] : [colors.surface, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.mode, selected && styles.modeSelected]}
      >
        <View style={styles.modeIcon}>
          <Zap color={colors.gold} fill={colors.gold} size={24} />
        </View>
        <View style={styles.flex}>
          <Text variant="heading" color="textStrong">
            {mode.name}
          </Text>
          <Text variant="caption" color="text">
            {mode.description}
          </Text>
          <View style={styles.duration}>
            <Timer color={colors.primarySoft} size={14} />
            <Text variant="caption" color="primarySoft">
              {mode.duration}
            </Text>
          </View>
        </View>
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected ? <Check color={colors.onPrimary} size={16} strokeWidth={3} /> : null}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: spacing.xxs },
  rival: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  elo: { alignItems: 'center', gap: spacing.xxs },
  overline: { letterSpacing: 2 },
  modes: { gap: spacing.md },
  mode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  modeSelected: { borderColor: colors.primaryBright, ...elevation.glow },
  modeIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 197, 66, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.35)',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginTop: spacing.xxs,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  soon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
  },
  pressed: { opacity: 0.85 },
});
