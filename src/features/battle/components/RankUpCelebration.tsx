import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Share2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { getRank, type RankInfo } from '@shared/ranking';

import { RankEmblem, TIER_COLORS } from '@/design-system';
import { useRankLabels } from '@/features/ranked/strings';
import { ShareAchievementView, canShareImages } from '@/features/share/ShareAchievement';
import { shareStrings } from '@/features/share/strings';
import { useStrings } from '@/i18n';
import { playSound } from '@/lib/sounds';

import { battleStrings } from '../strings';
import { Confetti } from './Confetti';

/** Qué se celebra: entrar al ranking, subir de división o llegar a un rango nuevo. */
export type RankUpKind = 'placed' | 'division' | 'tier';

/**
 * Si el resultado merece la celebración de ascenso: entraste al ranking (tu primera victoria) o subiste
 * de escalón (división o rango). null si no subiste, bajaste o la partida no tuvo ELO.
 */
export function rankUpKind(
  ratingBefore: number | null | undefined,
  ratingAfter: number | null | undefined,
  placedBefore: boolean,
  won: boolean,
): RankUpKind | null {
  if (ratingBefore == null || ratingAfter == null) return null;
  const before = getRank(ratingBefore);
  const after = getRank(ratingAfter);
  // Sin posicionar, se entra al ranking sólo ganando (shared/ranking.ts: isPlaced).
  if (!placedBefore) return won ? 'placed' : null;
  if (after.stepMin <= before.stepMin) return null;
  return after.tier.id !== before.tier.id ? 'tier' : 'division';
}

const EMBLEM = 150;
const RAYS = 14;
const RAY_RADIUS = 320;
const SPARKS = 16;
/** Momento (ms) en que se revela el rango nuevo. */
const REVEAL_MS = 1_000;

/**
 * Celebración de ascenso a pantalla completa, en los colores del rango: el emblema anterior tiembla y
 * estalla en un destello, entra el nuevo con rebote sobre rayos de luz que giran, chispas, confeti del
 * rango, vibración y sonido. Se cierra con «¡Vamos!» (o tocando la pantalla cuando ya terminó).
 * Con «reducir movimiento», sólo aparece el emblema nuevo y los textos, sin giros ni partículas.
 */
export function RankUpCelebration({
  ratingBefore,
  ratingAfter,
  kind,
  onClose,
}: {
  ratingBefore: number;
  ratingAfter: number;
  kind: RankUpKind;
  onClose: () => void;
}) {
  const t = useStrings(battleStrings);
  const ranks = useRankLabels();
  const reduceMotion = useReducedMotion();
  const before = getRank(ratingBefore);
  const after = getRank(ratingAfter);
  const tier = TIER_COLORS[after.tier.id];
  const [revealed, setRevealed] = useState(reduceMotion);
  const [canClose, setCanClose] = useState(reduceMotion);
  // Rango nuevo (no división): se ofrece compartir la tarjeta, en este mismo Modal.
  const [sharing, setSharing] = useState(false);
  const ts = useStrings(shareStrings);
  const offerShare = kind === 'tier' && canShareImages;

  useEffect(() => {
    const timers = [
      setTimeout(
        () => {
          setRevealed(true);
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          playSound(kind === 'division' ? 'streak2' : 'streak3');
        },
        reduceMotion ? 0 : REVEAL_MS,
      ),
      setTimeout(() => setCanClose(true), reduceMotion ? 0 : REVEAL_MS + 900),
    ];
    if (!reduceMotion) {
      // El emblema anterior "tiembla" antes de estallar.
      timers.push(
        setTimeout(() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 450),
      );
      timers.push(
        setTimeout(() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 950),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [kind, reduceMotion]);

  const title =
    kind === 'placed' ? t.rankUpPlaced : kind === 'tier' ? t.rankUpTier : t.rankUpDivision;
  const afterLabel = ranks.label(after);

  if (sharing) {
    return (
      <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
        <ShareAchievementView
          achievement={{ kind: 'rank', tier: after.tier.id }}
          onClose={onClose}
        />
      </Modal>
    );
  }

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Pressable
        style={styles.root}
        onPress={canClose ? onClose : undefined}
        accessibilityViewIsModal
        accessibilityLabel={t.rankUpA11y(afterLabel)}
      >
        <Animated.View entering={FadeIn.duration(250)} style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={[`${tier.dark}F5`, '#0B0618F5', '#06030FFA']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <View style={styles.stage}>
          {revealed && !reduceMotion ? <Rays color={tier.light} /> : null}
          {revealed ? <Glow color={tier.light} reduceMotion={reduceMotion} /> : null}
          {!revealed ? <OldEmblem rank={before} placed={kind !== 'placed'} /> : null}
          {!reduceMotion ? <Flash /> : null}
          {revealed ? <NewEmblem rank={after} reduceMotion={reduceMotion} /> : null}
          {revealed && !reduceMotion
            ? Array.from({ length: SPARKS }, (_, i) => (
                <Spark key={i} index={i} color={i % 2 ? tier.accent : tier.light} />
              ))
            : null}
        </View>

        {revealed ? (
          <View style={styles.texts}>
            <Animated.Text
              entering={reduceMotion ? undefined : FadeInUp.delay(150).duration(350)}
              style={[styles.overline, { color: tier.accent }]}
            >
              {title}
            </Animated.Text>
            <Animated.Text
              entering={reduceMotion ? undefined : ZoomIn.delay(250).springify().damping(9)}
              style={[styles.rank, { textShadowColor: tier.light }]}
            >
              {afterLabel}
            </Animated.Text>
            {kind !== 'placed' ? (
              <Animated.Text
                entering={reduceMotion ? undefined : FadeIn.delay(650).duration(400)}
                style={styles.from}
              >
                {t.rankUpFrom(ranks.label(before))}
              </Animated.Text>
            ) : null}
          </View>
        ) : null}

        {canClose ? (
          <Animated.View
            entering={reduceMotion ? undefined : FadeInUp.duration(300)}
            style={styles.actions}
          >
            {offerShare ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => setSharing(true)}
                style={({ pressed }) => [
                  styles.button,
                  styles.shareButton,
                  { shadowColor: tier.light },
                  pressed && styles.pressed,
                ]}
              >
                <Share2 color="#1A1033" size={20} strokeWidth={2.6} />
                <Text style={styles.buttonText}>{ts.shareAchievement}</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [
                offerShare ? styles.secondary : styles.button,
                !offerShare && { shadowColor: tier.light },
                pressed && styles.pressed,
              ]}
            >
              <Text style={offerShare ? styles.secondaryText : styles.buttonText}>
                {t.rankUpContinue}
              </Text>
            </Pressable>
          </Animated.View>
        ) : null}

        {revealed && !reduceMotion ? (
          <Confetti
            pieces={kind === 'division' ? 40 : 70}
            palette={[tier.light, tier.accent, tier.dark, '#FFFFFF', '#FFC83D']}
          />
        ) : null}
      </Pressable>
    </Modal>
  );
}

/** El emblema del escalón que dejás: aparece, tiembla y crece antes de estallar. */
function OldEmblem({ rank, placed }: { rank: RankInfo; placed: boolean }) {
  const reduceMotion = useReducedMotion();
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSequence(
      withTiming(1, { duration: 250 }),
      withDelay(350, withTiming(1.18, { duration: 350, easing: Easing.in(Easing.quad) })),
    );
    rotate.value = withDelay(
      350,
      withSequence(...[-7, 7, -9, 9, -11, 11, 0].map((deg) => withTiming(deg, { duration: 55 }))),
    );
  }, [opacity, rotate, scale, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.emblem, style]}>
      <RankEmblem tier={rank.tier.id} division={rank.division} size={EMBLEM} dimmed={!placed} />
    </Animated.View>
  );
}

/** El rango nuevo: entra con rebote y queda "respirando". */
function NewEmblem({ rank, reduceMotion }: { rank: RankInfo; reduceMotion: boolean }) {
  const scale = useSharedValue(reduceMotion ? 1 : 0.2);
  const breathe = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    scale.value = withSpring(1, { damping: 7, stiffness: 140, mass: 0.9 });
    breathe.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(1.05, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
      ),
    );
  }, [breathe, scale, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * breathe.value }],
  }));

  return (
    <Animated.View style={[styles.emblem, style]}>
      <RankEmblem tier={rank.tier.id} division={rank.division} size={EMBLEM} />
    </Animated.View>
  );
}

/** Destello blanco justo cuando el emblema anterior estalla. */
function Flash() {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      REVEAL_MS - 80,
      withTiming(1, { duration: 520, easing: Easing.out(Easing.quad) }),
    );
  }, [t]);
  const style = useAnimatedStyle(() => ({
    opacity: t.value === 0 ? 0 : 0.9 * (1 - t.value),
    transform: [{ scale: 0.3 + 3.2 * t.value }],
  }));
  return <Animated.View pointerEvents="none" style={[styles.flash, style]} />;
}

/** Halo del color del rango detrás del emblema, latiendo. */
function Glow({ color, reduceMotion }: { color: string; reduceMotion: boolean }) {
  const pulse = useSharedValue(reduceMotion ? 1 : 0.6);
  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1_000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.95, { duration: 1_000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );
  }, [pulse, reduceMotion]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.glow, { backgroundColor: `${color}40`, shadowColor: color }, style]}
    />
  );
}

/** Rayos de luz que giran lento detrás del emblema. */
function Rays({ color }: { color: string }) {
  const turn = useSharedValue(0);
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    turn.value = withRepeat(withTiming(360, { duration: 16_000, easing: Easing.linear }), -1);
  }, [opacity, turn]);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: `${turn.value}deg` }],
  }));
  const size = RAY_RADIUS * 2;
  const c = RAY_RADIUS;
  const half = Math.PI / RAYS / 2;
  return (
    <Animated.View pointerEvents="none" style={[styles.rays, style]}>
      <Svg width={size} height={size}>
        {Array.from({ length: RAYS }, (_, i) => {
          const a = (i / RAYS) * 2 * Math.PI;
          const x1 = c + RAY_RADIUS * Math.cos(a - half);
          const y1 = c + RAY_RADIUS * Math.sin(a - half);
          const x2 = c + RAY_RADIUS * Math.cos(a + half);
          const y2 = c + RAY_RADIUS * Math.sin(a + half);
          return (
            <Path
              key={i}
              d={`M${c} ${c} L${x1} ${y1} L${x2} ${y2} Z`}
              fill={color}
              opacity={i % 2 ? 0.1 : 0.2}
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
}

/** Chispa que sale disparada del emblema cuando se revela el rango nuevo. */
function Spark({ index, color }: { index: number; color: string }) {
  const t = useSharedValue(0);
  const angle = (index / SPARKS) * 2 * Math.PI + (index % 3) * 0.2;
  const distance = 110 + (index % 4) * 22;
  useEffect(() => {
    t.value = withTiming(1, { duration: 800 + (index % 5) * 80, easing: Easing.out(Easing.cubic) });
  }, [t, index]);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - t.value,
    transform: [
      { translateX: Math.cos(angle) * distance * t.value },
      { translateY: Math.sin(angle) * distance * t.value },
      { scale: 1 - 0.6 * t.value },
    ],
  }));
  return (
    <Animated.View pointerEvents="none" style={[styles.spark, { backgroundColor: color }, style]} />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28, padding: 24 },
  stage: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center' },
  emblem: { position: 'absolute' },
  rays: {
    position: 'absolute',
    width: RAY_RADIUS * 2,
    height: RAY_RADIUS * 2,
  },
  glow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    shadowOpacity: 0.9,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  flash: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
  },
  spark: { position: 'absolute', width: 9, height: 9, borderRadius: 4.5 },
  texts: { alignItems: 'center', gap: 6 },
  overline: { fontSize: 15, fontWeight: '900', letterSpacing: 3, textAlign: 'center' },
  rank: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  from: { color: '#B9A9E0', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  button: {
    minWidth: 220,
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: '#FFC83D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  actions: { alignItems: 'center', gap: 6 },
  shareButton: { flexDirection: 'row', gap: 8 },
  secondary: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 24 },
  secondaryText: { color: '#E9E1FF', fontSize: 17, fontWeight: '800' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  buttonText: { color: '#1A1033', fontSize: 18, fontWeight: '900' },
});
