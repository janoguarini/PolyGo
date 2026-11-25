import * as Haptics from 'expo-haptics';
import { WifiOff } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOutUp,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import type { ArcadeAnswer, ChallengeKind } from '@shared/arcade';

import { SessionLanguageProvider } from '@/features/learning/SessionLanguageProvider';
import { useStrings } from '@/i18n';
import { playSound } from '@/lib/sounds';

import { ArcadeHud } from './ArcadeHud';
import { currentChallenge, frenzyActive, type ArcadeVerdict } from './arcadeState';
import { AudioBlitz } from './AudioBlitz';
import { ConnectBattle } from './ConnectBattle';
import { SentenceRush } from './SentenceRush';
import { arcadeStrings } from './strings';
import { SwipeBattle } from './SwipeBattle';
import { arcade, arcadeRadii, arcadeText } from './theme';
import { myLine, opponentLine, opponentPlayer, remainingMs, type BattleState } from '../state';

const TITLES: Record<
  ChallengeKind,
  'swipeTitle' | 'connectTitle' | 'sentenceTitle' | 'audioTitle'
> = {
  swipe: 'swipeTitle',
  connect: 'connectTitle',
  sentence: 'sentenceTitle',
  audio: 'audioTitle',
};

/**
 * Partida de Word Rush en curso (motor interno «Arcade»). Jerarquía: tiempo → Tug of War → combo →
 * formato actual → veredicto. Entre formatos no hay transición: el siguiente ya está en memoria y entra
 * con un fundido corto. A los 60 s muestra «¡Tiempo!» hasta que llega el resultado.
 */
export function ArcadeStage({
  state,
  now,
  onAnswer,
}: {
  state: BattleState;
  now: number;
  onAnswer: (answer: ArcadeAnswer) => void;
}) {
  const t = useStrings(arcadeStrings);
  const a = state.arcade!;
  const left = remainingMs(state.endsAt, state.clockOffset, now) ?? 0;
  const frenzy = frenzyActive(a, state.endsAt, state.clockOffset, now);
  const view = currentChallenge(a);
  const me = state.players.find((p) => p.slot === state.yourSlot);
  const opponent = opponentPlayer(state);

  return (
    <SessionLanguageProvider>
      <View style={styles.stage}>
        <FrenzyLayer active={frenzy} />
        <ArcadeHud
          remainingMs={left}
          durationMs={a.durationMs}
          frenzy={frenzy}
          me={me}
          opponent={opponent}
          myScore={myLine(state)?.score ?? 0}
          opponentScore={opponentLine(state)?.score ?? 0}
          opponentConnected={state.mode === 'practice' || state.opponent.connected}
          combo={a.combo}
          multiplier={a.multiplier}
          verdictId={a.verdict?.id ?? 0}
          comboBroken={a.verdict?.comboBroken ?? false}
        />
        {state.online ? null : (
          <View style={styles.offline} accessibilityLiveRegion="polite">
            <WifiOff color={arcade.gold} size={16} />
            <Text style={styles.offlineText}>{t.reconnecting}</Text>
          </View>
        )}
        {/* Franja propia para «+114 x2» / «✕ respuesta»: nunca tapa la palabra ni los botones. */}
        <View style={styles.flashSlot}>
          <VerdictFlash verdict={a.verdict} />
        </View>
        <View style={styles.game}>
          {left <= 0 ? (
            // El servidor cierra a los 60 s; hasta que llega el resultado no se puede responder.
            <Animated.View
              entering={FadeIn.duration(150)}
              style={[styles.fill, styles.center]}
              accessibilityLiveRegion="assertive"
            >
              <Text style={styles.timeUp}>{t.timeUp}</Text>
              <ActivityIndicator color={arcade.violetGlow} />
              <Text style={arcadeText.label}>{t.timeUpSub}</Text>
            </Animated.View>
          ) : view ? (
            <Animated.View key={view.index} entering={FadeIn.duration(110)} style={styles.fill}>
              <Text style={styles.kind}>{t[TITLES[view.kind]]}</Text>
              {view.kind === 'swipe' ? (
                <SwipeBattle view={view} onAnswer={onAnswer} />
              ) : view.kind === 'connect' ? (
                <ConnectBattle
                  view={view}
                  solved={a.solved}
                  pending={a.connectPending}
                  wrong={a.connectWrong}
                  onAnswer={onAnswer}
                />
              ) : view.kind === 'sentence' ? (
                <SentenceRush view={view} onAnswer={onAnswer} />
              ) : (
                <AudioBlitz view={view} onAnswer={onAnswer} />
              )}
            </Animated.View>
          ) : (
            <View style={[styles.fill, styles.center]}>
              <ActivityIndicator color={arcade.violetGlow} />
              <Text style={arcadeText.label}>{t.waiting}</Text>
            </View>
          )}
        </View>
      </View>
    </SessionLanguageProvider>
  );
}

/**
 * «+114 x2» en su franja, arriba del desafío, y se va. En los fallos muestra la respuesta un instante,
 * en la misma línea.
 */
function VerdictFlash({ verdict }: { verdict: ArcadeVerdict | null }) {
  const t = useStrings(arcadeStrings);
  const reduceMotion = useReducedMotion();
  // El veredicto se ve hasta que vence su tiempo (se guarda cuál ya se escondió).
  const [hiddenId, setHiddenId] = useState(0);
  useEffect(() => {
    if (!verdict) return;
    const id = verdict.id;
    const timer = setTimeout(() => setHiddenId(id), verdict.correct ? 650 : 1_300);
    return () => clearTimeout(timer);
  }, [verdict]);
  const shown = verdict && verdict.id !== hiddenId ? verdict : null;
  if (!shown) return null;
  return (
    <Animated.View
      key={shown.id}
      entering={reduceMotion ? undefined : ZoomIn.duration(140)}
      exiting={reduceMotion ? undefined : FadeOutUp.duration(200)}
      style={[styles.flash, shown.correct ? styles.flashOk : styles.flashBad]}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
    >
      {shown.correct ? (
        <Text style={[styles.flashPoints, shown.frenzy && styles.flashFrenzy]}>
          +{shown.points}
          {shown.multiplier > 1 ? (
            <Text style={styles.flashMult}>{`  x${shown.multiplier}`}</Text>
          ) : null}
        </Text>
      ) : (
        <>
          <Text style={styles.flashWrong}>
            {shown.tooFast ? t.tooFast : shown.comboBroken ? t.comboBroken : '✕'}
          </Text>
          {shown.solution && shown.kind !== 'connect' ? (
            <Text style={styles.flashSolution} numberOfLines={1}>
              {shown.solution}
            </Text>
          ) : null}
        </>
      )}
    </Animated.View>
  );
}

/**
 * Frenesí: borde dorado que late y un cartel de 1,6 s que no pausa nada (no recibe toques). Vibración
 * y sonido una sola vez al activarse.
 */
function FrenzyLayer({ active }: { active: boolean }) {
  const t = useStrings(arcadeStrings);
  const reduceMotion = useReducedMotion();
  const glow = useSharedValue(0);
  const [banner, setBanner] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (!active) {
      glow.value = withTiming(0, { duration: 150 });
      return;
    }
    glow.value = reduceMotion
      ? withTiming(1, { duration: 0 })
      : withRepeat(
          withSequence(withTiming(1, { duration: 420 }), withTiming(0.45, { duration: 420 })),
          -1,
          true,
        );
    if (fired.current) return;
    fired.current = true;
    setBanner(true);
    playSound('streak3');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const timer = setTimeout(() => setBanner(false), 1_600);
    return () => clearTimeout(timer);
  }, [active, reduceMotion, glow]);

  const border = useAnimatedStyle(() => ({ opacity: glow.value }));
  return (
    <>
      <Animated.View pointerEvents="none" style={[styles.frenzyBorder, border]} />
      {banner ? (
        <Animated.View
          pointerEvents="none"
          entering={reduceMotion ? undefined : ZoomIn.springify().damping(10)}
          exiting={reduceMotion ? undefined : FadeOutUp.duration(250)}
          style={styles.banner}
          accessibilityLiveRegion="assertive"
        >
          <Text style={styles.bannerTitle}>{t.frenzy}</Text>
          <Text style={styles.bannerSub}>{t.frenzySub}</Text>
        </Animated.View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, gap: 14 },
  game: { flex: 1 },
  fill: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  kind: { ...arcadeText.label, color: arcade.violetGlow, marginBottom: 4 },
  timeUp: { color: arcade.gold, fontSize: 44, fontWeight: '900', textAlign: 'center' },
  offline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: arcadeRadii.pill,
    backgroundColor: arcade.cardRaised,
    borderWidth: 1,
    borderColor: arcade.goldDeep,
  },
  offlineText: { color: arcade.text, fontSize: 13, fontWeight: '800' },
  // Altura fija: el cartel aparece y se va sin mover el desafío de lugar.
  flashSlot: { height: 40, alignItems: 'center', justifyContent: 'center' },
  flash: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: arcadeRadii.pill,
    maxWidth: '100%',
  },
  flashOk: { backgroundColor: 'rgba(46,229,157,0.16)' },
  flashBad: { backgroundColor: 'rgba(255,77,109,0.18)' },
  flashPoints: { color: arcade.success, fontSize: 24, fontWeight: '900' },
  flashFrenzy: { color: arcade.gold },
  flashMult: { color: arcade.gold, fontSize: 17, fontWeight: '900' },
  flashWrong: { color: arcade.danger, fontSize: 18, fontWeight: '900' },
  flashSolution: { color: arcade.text, fontSize: 16, fontWeight: '700', flexShrink: 1 },
  frenzyBorder: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: -12,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: arcade.gold,
    shadowColor: arcade.gold,
    shadowOpacity: 0.9,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  banner: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
    zIndex: 10,
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: arcadeRadii.card,
    backgroundColor: arcade.gold,
    alignItems: 'center',
  },
  bannerTitle: { color: arcade.bgDeep, fontSize: 32, fontWeight: '900', letterSpacing: 1 },
  bannerSub: { color: arcade.bgDeep, fontSize: 16, fontWeight: '900' },
});
