import { Swords, Timer } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn, useReducedMotion } from 'react-native-reanimated';

import type { PublicPlayer } from '@shared/protocol';

import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { ProfileBackdrop } from '@/features/cosmetics/ProfileBackdrop';
import { useRankLabels } from '@/features/ranked/strings';
import { useStrings } from '@/i18n';
import { battleScreenStrings } from '@/i18n/screens/battle';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

import { ratingNote } from '../labels';
import { playerLook } from '../rivalLook';
import { opponentPlayer, remainingMs, type BattleState } from '../state';
import { FormatStrip } from './FormatStrip';
import { arcadeStrings } from './strings';
import { ARCADE_TOUCH, arcade, arcadeRadii, arcadeText } from './theme';

/**
 * Antes de jugar Word Rush (rival encontrado y cuenta regresiva), con la misma identidad oscura que la
 * partida: no hay salto de tema al empezar. Presenta el modo como un único juego de 60 s con sus cuatro
 * formatos, quién juega y si mueve el ELO.
 */
export function ArcadeLobby({
  state,
  now,
  onReady,
}: {
  state: BattleState;
  now: number;
  onReady: () => void;
}) {
  const t = useStrings(battleScreenStrings);
  const a = useStrings(arcadeStrings);
  const reduceMotion = useReducedMotion();
  const me = state.players.find((p) => p.slot === state.yourSlot);
  const opponent = opponentPlayer(state);
  const seconds = Math.round((state.arcade?.durationMs ?? 60_000) / 1000);
  const note = ratingNote(state, t);

  if (state.phase === 'countdown') {
    const left = remainingMs(state.startsAt, state.clockOffset, now);
    const shown = left === null ? null : left > 0 ? Math.ceil(left / 1000) : null;
    return (
      <View style={styles.center}>
        <Text style={arcadeText.label}>{a.getReady}</Text>
        <Text style={styles.mode}>{a.modeName}</Text>
        <View style={styles.countWrap}>
          {shown === null ? (
            <Text style={styles.go}>{left === null ? '…' : t.go}</Text>
          ) : (
            <Animated.Text
              key={shown}
              entering={reduceMotion ? undefined : ZoomIn.duration(220)}
              style={styles.count}
              accessibilityLabel={a.countdownA11y(shown)}
              accessibilityLiveRegion="polite"
            >
              {shown}
            </Animated.Text>
          )}
        </View>
        <FormatStrip />
        {opponent ? <Versus me={me} opponent={opponent} youLabel={t.you} compact /> : null}
      </View>
    );
  }

  // Rival encontrado: confirmar antes de que venza el plazo.
  const left = remainingMs(state.readyDeadline, state.clockOffset, now);
  return (
    <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(200)} style={styles.center}>
      <Text style={arcadeText.label}>{t.opponentFound}</Text>
      <Versus me={me} opponent={opponent} youLabel={t.you} />
      <View style={styles.modeRow}>
        <Text style={styles.mode}>{a.modeName}</Text>
        <View style={styles.duration}>
          <Timer color={arcade.gold} size={14} />
          <Text style={styles.durationText}>{a.durationChip(seconds)}</Text>
        </View>
      </View>
      <FormatStrip />
      <Text style={styles.rules}>{a.rules}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: state.iAmReady }}
        disabled={state.iAmReady}
        onPress={onReady}
        style={({ pressed }) => [
          styles.ready,
          state.iAmReady && styles.readyDone,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.readyText, state.iAmReady && styles.readyTextDone]}>
          {state.iAmReady ? t.waitingOpponent : t.ready}
        </Text>
      </Pressable>
      {left !== null ? (
        <Text style={styles.caption}>{t.confirmIn(Math.ceil(left / 1000))}</Text>
      ) : null}
    </Animated.View>
  );
}

function Versus({
  me,
  opponent,
  youLabel,
  compact = false,
}: {
  me: PublicPlayer | undefined;
  opponent: PublicPlayer | undefined;
  youLabel: string;
  compact?: boolean;
}) {
  return (
    <View style={styles.versus}>
      <PlayerTag player={me} name={youLabel} compact={compact} />
      <Swords color={arcade.violetGlow} size={compact ? 22 : 30} />
      <PlayerTag player={opponent} name={opponent?.username ?? '…'} compact={compact} />
    </View>
  );
}

function PlayerTag({
  player,
  name,
  compact,
}: {
  player: PublicPlayer | undefined;
  name: string;
  compact: boolean;
}) {
  const t = useStrings(battleScreenStrings);
  const ranks = useRankLabels();
  // Un rival de práctica se presenta como cualquier jugador: con su identidad (avatar, marco y fondo),
  // su ELO estimado y sin distintivo.
  const look = playerLook(player);
  const placed = Boolean(player?.isBot) || (player?.gamesPlayed ?? 0) > 0;
  const rating = player?.rating;
  const content = (
    <>
      <FramedAvatar
        avatarId={look.avatarId}
        photoUrl={avatarPhotoUrl(player?.avatarPath)}
        size={compact ? 40 : look.frameId ? 56 : 64}
        frameId={look.frameId}
      />
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      {!compact && rating !== undefined ? (
        <Text style={styles.rating}>{placed ? `${rating} ELO` : ranks.unplaced}</Text>
      ) : null}
    </>
  );
  const a11y = t.playerA11y(name, placed ? String(rating ?? '') : null);
  if (look.backgroundId) {
    return (
      <ProfileBackdrop
        backgroundId={look.backgroundId}
        style={[styles.tag, styles.backdrop, compact && styles.backdropCompact]}
      >
        <View style={styles.backdropContent} accessible accessibilityLabel={a11y}>
          {content}
        </View>
      </ProfileBackdrop>
    );
  }
  return (
    <View style={styles.tag} accessible accessibilityLabel={a11y}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'stretch', gap: 18 },
  versus: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  tag: { flex: 1, alignItems: 'center', gap: 4 },
  // Tarjeta con el fondo del rival de práctica: misma columna que la del jugador, con aire alrededor.
  backdrop: { paddingVertical: 12, paddingHorizontal: 8 },
  backdropCompact: { paddingVertical: 6, paddingHorizontal: 6 },
  backdropContent: { alignItems: 'center', gap: 4 },
  name: { ...arcadeText.body, fontWeight: '800', maxWidth: '100%' },
  rating: { color: arcade.muted, fontSize: 13, fontWeight: '700' },
  modeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  mode: {
    color: arcade.text,
    fontSize: 34,
    fontWeight: '900',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: arcadeRadii.pill,
    borderWidth: 1,
    borderColor: arcade.goldDeep,
  },
  durationText: { color: arcade.gold, fontSize: 14, fontWeight: '900' },
  rules: { color: arcade.muted, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  note: { color: arcade.text, fontSize: 15, fontWeight: '800', textAlign: 'center' },
  ready: {
    minHeight: ARCADE_TOUCH + 4,
    borderRadius: arcadeRadii.card,
    backgroundColor: arcade.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  readyDone: { backgroundColor: arcade.cardRaised },
  pressed: { opacity: 0.85 },
  readyText: { color: arcade.bgDeep, fontSize: 18, fontWeight: '900' },
  readyTextDone: { color: arcade.muted },
  caption: { color: arcade.muted, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  countWrap: { alignItems: 'center', justifyContent: 'center', minHeight: 150 },
  count: { color: arcade.gold, fontSize: 120, lineHeight: 140, fontWeight: '900' },
  go: { color: arcade.success, fontSize: 64, fontWeight: '900' },
});
