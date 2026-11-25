import { Swords, Timer } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn, useReducedMotion } from 'react-native-reanimated';

import type { PublicPlayer } from '@shared/protocol';
import { getRank } from '@shared/ranking';

import { TIER_COLORS } from '@/design-system';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { ProfileBackdrop } from '@/features/cosmetics/ProfileBackdrop';
import { useRankLabels } from '@/features/ranked/strings';
import { useStrings } from '@/i18n';
import { battleScreenStrings } from '@/i18n/screens/battle';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

import { ratingNote } from '../labels';
import { playerLook } from '../rivalLook';
import { opponentPlayer, remainingMs, type BattleState } from '../state';
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
  myLook,
}: {
  state: BattleState;
  now: number;
  onReady: () => void;
  /** Avatar, marco y fondo de tu perfil, para que tu tarjeta tenga el mismo formato que la del rival. */
  myLook?: MyLook;
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
        {opponent ? (
          <Versus me={me} opponent={opponent} youLabel={t.you} myLook={myLook} compact />
        ) : null}
      </View>
    );
  }

  // Rival encontrado: confirmar antes de que venza el plazo.
  const left = remainingMs(state.readyDeadline, state.clockOffset, now);
  return (
    <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(200)} style={styles.center}>
      <Text style={arcadeText.label}>{t.opponentFound}</Text>
      <Versus me={me} opponent={opponent} youLabel={t.you} myLook={myLook} />
      <View style={styles.modeRow}>
        <Text style={styles.mode}>{a.modeName}</Text>
        <View style={styles.duration}>
          <Timer color={arcade.gold} size={14} />
          <Text style={styles.durationText}>{a.durationChip(seconds)}</Text>
        </View>
      </View>
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
  myLook,
  compact = false,
}: {
  me: PublicPlayer | undefined;
  opponent: PublicPlayer | undefined;
  youLabel: string;
  myLook?: MyLook;
  compact?: boolean;
}) {
  if (compact) {
    // Cuenta regresiva: las dos tarjetas chicas, lado a lado.
    return (
      <View style={styles.versus}>
        <PlayerTag player={me} name={youLabel} override={myLook} compact />
        <View style={styles.swords}>
          <Swords color={arcade.violetGlow} size={22} />
        </View>
        <PlayerTag player={opponent} name={opponent?.username ?? '…'} compact />
      </View>
    );
  }
  // Rival encontrado: uno arriba del otro, cada uno a todo el ancho para que se vea su fondo entero.
  return (
    <View style={styles.versusStack}>
      <PlayerBanner player={me} name={youLabel} override={myLook} />
      <View style={styles.vsRow} accessibilityElementsHidden importantForAccessibility="no">
        <View style={styles.vsLine} />
        <View style={styles.vsBadge}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={styles.vsLine} />
      </View>
      <PlayerBanner player={opponent} name={opponent?.username ?? '…'} />
    </View>
  );
}

/**
 * Tarjeta de jugador a todo el ancho: su fondo de perfil completo, avatar con marco, nombre, ELO y
 * rango con su color. Mismo formato para vos y para el rival.
 */
function PlayerBanner({
  player,
  name,
  override,
}: {
  player: PublicPlayer | undefined;
  name: string;
  override?: MyLook;
}) {
  const t = useStrings(battleScreenStrings);
  const ranks = useRankLabels();
  const look = resolveLook(player, override);
  const placed = Boolean(player?.isBot) || (player?.gamesPlayed ?? 0) > 0;
  const rating = player?.rating;
  const rank = rating !== undefined ? getRank(rating) : null;
  const a11y = t.playerA11y(name, placed ? String(rating ?? '') : null);
  return (
    <ProfileBackdrop backgroundId={look.backgroundId} style={styles.banner}>
      <View style={styles.bannerContent} accessible accessibilityLabel={a11y}>
        <FramedAvatar
          avatarId={look.avatarId}
          photoUrl={avatarPhotoUrl(player?.avatarPath)}
          size={look.frameId ? 66 : 72}
          frameId={look.frameId}
          rating={rating}
        />
        <View style={styles.bannerText}>
          <Text style={styles.bannerName} numberOfLines={1}>
            {name}
          </Text>
          {rating !== undefined ? (
            <Text style={styles.bannerRating} numberOfLines={1}>
              {placed ? `${rating} ELO` : ranks.unplaced}
              {placed && rank ? (
                <Text style={{ color: TIER_COLORS[rank.tier.id].light }}>
                  {`  ·  ${ranks.label(rank)}`}
                </Text>
              ) : null}
            </Text>
          ) : null}
        </View>
      </View>
    </ProfileBackdrop>
  );
}

/** Avatar, marco y fondo con que se dibuja: el del perfil propio (`override`) o el del jugador. */
function resolveLook(player: PublicPlayer | undefined, override?: MyLook) {
  const base = playerLook(player);
  return {
    avatarId: override?.avatarId ?? base.avatarId,
    frameId: override?.frameId ?? base.frameId,
    backgroundId: override?.backgroundId ?? base.backgroundId,
  };
}

/**
 * Una tarjeta de jugador: fondo de perfil, avatar con marco, nombre y ELO. Las dos del enfrentamiento
 * tienen el mismo formato. Un rival de práctica se presenta con su identidad (avatar, marco y fondo) y
 * su ELO estimado, sin distintivo; el jugador, con lo que tiene puesto en su perfil (`override`).
 */
function PlayerTag({
  player,
  name,
  override,
  compact,
}: {
  player: PublicPlayer | undefined;
  name: string;
  override?: MyLook;
  compact: boolean;
}) {
  const t = useStrings(battleScreenStrings);
  const ranks = useRankLabels();
  const look = resolveLook(player, override);
  const placed = Boolean(player?.isBot) || (player?.gamesPlayed ?? 0) > 0;
  const rating = player?.rating;
  const a11y = t.playerA11y(name, placed ? String(rating ?? '') : null);
  return (
    <ProfileBackdrop
      backgroundId={look.backgroundId}
      style={[styles.tag, compact ? styles.tagCompact : styles.tagFull]}
    >
      <View style={styles.tagContent} accessible accessibilityLabel={a11y}>
        <FramedAvatar
          avatarId={look.avatarId}
          photoUrl={avatarPhotoUrl(player?.avatarPath)}
          size={compact ? 40 : look.frameId ? 60 : 68}
          frameId={look.frameId}
          rating={rating}
        />
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {!compact && rating !== undefined ? (
          <Text style={styles.rating}>{placed ? `${rating} ELO` : ranks.unplaced}</Text>
        ) : null}
      </View>
    </ProfileBackdrop>
  );
}

/** Lo que el jugador tiene puesto en su perfil (la foto del servidor no trae el fondo). */
export interface MyLook {
  avatarId?: string | null;
  frameId?: string | null;
  backgroundId?: string | null;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'stretch', gap: 18 },
  // Dos tarjetas iguales (mismo ancho y alto) a cada lado de las espadas, centradas.
  versus: { flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', gap: 6 },
  swords: { width: 34, alignItems: 'center', justifyContent: 'center' },
  tag: { flex: 1, justifyContent: 'center' },
  tagFull: { paddingVertical: 14, paddingHorizontal: 8 },
  tagCompact: { paddingVertical: 8, paddingHorizontal: 6 },
  tagContent: { alignItems: 'center', gap: 4 },
  name: { ...arcadeText.body, fontWeight: '800', maxWidth: '100%', textAlign: 'center' },
  rating: { color: arcade.muted, fontSize: 13, fontWeight: '700' },
  // Rival encontrado: tarjetas a todo el ancho, una arriba de la otra, con un VS en el medio.
  versusStack: { alignSelf: 'stretch', gap: 10 },
  banner: { alignSelf: 'stretch', minHeight: 104, justifyContent: 'center', paddingVertical: 16 },
  bannerContent: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 4 },
  bannerText: { flex: 1, gap: 2 },
  bannerName: { color: arcade.text, fontSize: 22, fontWeight: '900' },
  bannerRating: { color: arcade.muted, fontSize: 15, fontWeight: '800' },
  vsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  vsLine: { flex: 1, height: 1, backgroundColor: arcade.border },
  vsBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: arcade.cardRaised,
    borderWidth: 1.5,
    borderColor: arcade.violetGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: { color: arcade.gold, fontSize: 17, fontWeight: '900', fontStyle: 'italic' },
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
