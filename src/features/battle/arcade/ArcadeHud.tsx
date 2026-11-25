import { WifiOff, Zap } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import { tugPosition } from '@shared/arcade';
import type { PublicPlayer } from '@shared/protocol';

import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { useStrings } from '@/i18n';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

import { playerLook } from '../rivalLook';
import { arcadeStrings } from './strings';
import { arcade, arcadeRadii, arcadeText } from './theme';

interface Props {
  remainingMs: number;
  durationMs: number;
  frenzy: boolean;
  me: PublicPlayer | undefined;
  opponent: PublicPlayer | undefined;
  myScore: number;
  opponentScore: number;
  opponentConnected: boolean;
  combo: number;
  multiplier: number;
  /** Cambia con cada veredicto: dispara el temblor del combo al cortarse. */
  verdictId: number;
  comboBroken: boolean;
}

/**
 * Lo primero que se mira jugando, en este orden: tiempo, quién domina (Tug of War) y el combo.
 * Ocupa poco alto para dejarle la pantalla al microjuego.
 */
export function ArcadeHud(props: Props) {
  const t = useStrings(arcadeStrings);
  const seconds = Math.ceil(props.remainingMs / 1000);
  const low = seconds <= 10;
  return (
    <View style={styles.wrap}>
      <View style={styles.timerRow}>
        <Text
          style={[styles.timer, props.frenzy && styles.timerFrenzy, low && styles.timerLow]}
          accessibilityLabel={t.secondsLeft(seconds)}
          accessibilityLiveRegion={low ? 'polite' : 'none'}
        >
          {seconds}
        </Text>
        <TimeBar
          value={props.remainingMs / props.durationMs}
          color={props.frenzy ? arcade.gold : low ? arcade.danger : arcade.violet}
        />
        <ComboMeter
          combo={props.combo}
          multiplier={props.multiplier}
          verdictId={props.verdictId}
          broken={props.comboBroken}
        />
      </View>
      <TugOfWar
        me={props.me}
        opponent={props.opponent}
        myScore={props.myScore}
        opponentScore={props.opponentScore}
        opponentConnected={props.opponentConnected}
      />
    </View>
  );
}

function TimeBar({ value, color }: { value: number; color: string }) {
  const width = useSharedValue(value);
  useEffect(() => {
    // Lineal entre actualizaciones del reloj (cada 250 ms): se ve continua sin re-dibujar a 60 fps.
    width.value = withTiming(Math.max(0, Math.min(1, value)), { duration: 250 });
  }, [value, width]);
  const style = useAnimatedStyle(() => ({ flex: width.value }));
  const rest = useAnimatedStyle(() => ({ flex: 1 - width.value }));
  return (
    <View style={styles.timeBar}>
      <Animated.View style={[styles.timeFill, { backgroundColor: color }, style]} />
      <Animated.View style={rest} />
    </View>
  );
}

/** Multiplicador y combo. Salta al subir de escalón y tiembla al cortarse; nunca tapa el juego. */
function ComboMeter({
  combo,
  multiplier,
  verdictId,
  broken,
}: {
  combo: number;
  multiplier: number;
  verdictId: number;
  broken: boolean;
}) {
  const t = useStrings(arcadeStrings);
  const reduceMotion = useReducedMotion();
  const shake = useSharedValue(0);
  useEffect(() => {
    if (!broken || reduceMotion) return;
    shake.value = withSequence(
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 60 }),
      withTiming(-4, { duration: 50 }),
      withTiming(0, { duration: 40 }),
    );
  }, [verdictId, broken, reduceMotion, shake]);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));
  const hot = multiplier >= 3;
  return (
    <Animated.View
      style={[styles.combo, multiplier > 1 && styles.comboOn, hot && styles.comboHot, shakeStyle]}
      accessible
      accessibilityLabel={t.comboA11y(combo, multiplier)}
    >
      <Animated.View
        key={multiplier}
        entering={reduceMotion ? undefined : ZoomIn.springify().damping(9)}
        style={styles.comboInner}
      >
        <Zap
          color={hot ? arcade.bgDeep : arcade.gold}
          size={14}
          fill={hot ? arcade.bgDeep : 'none'}
        />
        <Text style={[styles.multiplier, hot && styles.multiplierHot]}>x{multiplier}</Text>
      </Animated.View>
      <Text style={[styles.comboCount, hot && styles.multiplierHot]}>{combo}</Text>
    </Animated.View>
  );
}

/**
 * Barra de tira y afloja: el indicador se mueve según la diferencia REAL de puntos (tugPosition, con
 * escala que crece con la partida y tope antes del extremo). Animada con resorte suave: sin saltos.
 */
function TugOfWar({
  me,
  opponent,
  myScore,
  opponentScore,
  opponentConnected,
}: {
  me: PublicPlayer | undefined;
  opponent: PublicPlayer | undefined;
  myScore: number;
  opponentScore: number;
  opponentConnected: boolean;
}) {
  const t = useStrings(arcadeStrings);
  const reduceMotion = useReducedMotion();
  const target = tugPosition(myScore, opponentScore);
  const pos = useSharedValue(target);
  useEffect(() => {
    pos.value = reduceMotion
      ? withTiming(target, { duration: 0 })
      : withSpring(target, { damping: 18, stiffness: 120 });
  }, [target, pos, reduceMotion]);
  const mine = useAnimatedStyle(() => ({ flex: 1 + pos.value }));
  const theirs = useAnimatedStyle(() => ({ flex: 1 - pos.value }));
  return (
    <View
      style={styles.tug}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={t.tugA11y(myScore, opponentScore)}
    >
      <Side player={me} score={myScore} align="left" label={t.you} />
      <View style={styles.tugBar}>
        <Animated.View style={[styles.tugMine, mine]} />
        <View style={styles.knob} />
        <Animated.View style={[styles.tugTheirs, theirs]} />
      </View>
      <Side
        player={opponent}
        score={opponentScore}
        align="right"
        label={opponent?.username ?? '…'}
        offline={!opponentConnected}
      />
    </View>
  );
}

function Side({
  player,
  score,
  align,
  label,
  offline = false,
}: {
  player: PublicPlayer | undefined;
  score: number;
  align: 'left' | 'right';
  label: string;
  offline?: boolean;
}) {
  const t = useStrings(arcadeStrings);
  const avatar = (
    <View style={offline && styles.offline}>
      <FramedAvatar
        avatarId={playerLook(player).avatarId}
        photoUrl={avatarPhotoUrl(player?.avatarPath)}
        size={34}
        frameId={null}
      />
      {offline ? (
        <View style={styles.offlineBadge} accessibilityLabel={t.opponentOffline}>
          <WifiOff color={arcade.text} size={10} />
        </View>
      ) : null}
    </View>
  );
  const text = (
    <View style={align === 'left' ? styles.sideTextLeft : styles.sideTextRight}>
      <Text style={styles.sideName} numberOfLines={1}>
        {label}
      </Text>
      <Animated.Text
        key={score}
        entering={ZoomIn.duration(160)}
        style={[styles.sideScore, align === 'right' && styles.rivalScore]}
      >
        {score}
      </Animated.Text>
    </View>
  );
  return (
    <View style={styles.side}>
      {align === 'left' ? avatar : text}
      {align === 'left' ? text : avatar}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timer: {
    ...arcadeText.title,
    fontSize: 26,
    minWidth: 40,
    fontVariant: ['tabular-nums'],
  },
  timerFrenzy: { color: arcade.gold },
  timerLow: { color: arcade.danger },
  timeBar: {
    flex: 1,
    height: 8,
    borderRadius: arcadeRadii.pill,
    backgroundColor: arcade.card,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  timeFill: { borderRadius: arcadeRadii.pill },
  combo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    height: 32,
    borderRadius: arcadeRadii.pill,
    backgroundColor: arcade.card,
    borderWidth: 1,
    borderColor: arcade.border,
  },
  comboOn: { borderColor: arcade.gold },
  comboHot: { backgroundColor: arcade.gold, borderColor: arcade.gold },
  comboInner: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  multiplier: { color: arcade.gold, fontSize: 16, fontWeight: '900' },
  multiplierHot: { color: arcade.bgDeep },
  comboCount: {
    color: arcade.muted,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  tug: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tugBar: {
    flex: 1,
    height: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: arcadeRadii.pill,
    backgroundColor: arcade.card,
  },
  tugMine: {
    height: 14,
    backgroundColor: arcade.violet,
    borderTopLeftRadius: arcadeRadii.pill,
    borderBottomLeftRadius: arcadeRadii.pill,
  },
  tugTheirs: {
    height: 14,
    backgroundColor: arcade.rival,
    borderTopRightRadius: arcadeRadii.pill,
    borderBottomRightRadius: arcadeRadii.pill,
  },
  knob: {
    width: 22,
    height: 22,
    marginHorizontal: -11,
    zIndex: 1,
    borderRadius: 11,
    backgroundColor: arcade.text,
    borderWidth: 3,
    borderColor: arcade.gold,
  },
  side: { flexDirection: 'row', alignItems: 'center', gap: 6, maxWidth: '32%' },
  sideTextLeft: { alignItems: 'flex-start', flexShrink: 1 },
  sideTextRight: { alignItems: 'flex-end', flexShrink: 1 },
  sideName: { color: arcade.muted, fontSize: 11, fontWeight: '700' },
  sideScore: { color: arcade.text, fontSize: 18, fontWeight: '900', fontVariant: ['tabular-nums'] },
  rivalScore: { color: arcade.rival },
  offline: { opacity: 0.5 },
  offlineBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: arcade.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
