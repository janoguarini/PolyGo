import { Check, X } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { ArcadeAnswer, ChallengeView } from '@shared/arcade';

import { TargetText } from '@/features/learning/readings';
import { useStrings } from '@/i18n';

import { arcadeStrings } from './strings';
import { ARCADE_TOUCH, arcade, arcadeRadii, arcadeText } from './theme';

/** Distancia o velocidad para decidir: corta, así se responde en medio segundo. */
const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 0.55;
/** Lo que tarda la tarjeta en salir antes de dar paso a la siguiente. */
const FLY_MS = 140;

type View_ = Extract<ChallengeView, { kind: 'swipe' }>;

/**
 * Swipe Battle: palabra y traducción propuesta. Derecha = correcta, izquierda = incorrecta (también
 * con botones). Una tarjeta acepta una sola respuesta.
 */
export function SwipeBattle({
  view,
  onAnswer,
}: {
  view: View_;
  onAnswer: (answer: ArcadeAnswer) => void;
}) {
  const t = useStrings(arcadeStrings);
  const reduceMotion = useReducedMotion();
  const x = useSharedValue(0);
  // Una sola respuesta por tarjeta (valor compartido: se lee en los callbacks del gesto).
  const answered = useSharedValue(false);

  // onAnswer es estable (useCallback de la sesión): el responder no se rearma en pleno arrastre.
  const decide = useCallback(
    (accept: boolean) => {
      if (answered.get()) return;
      answered.set(true);
      if (reduceMotion) {
        onAnswer({ kind: 'swipe', accept });
        return;
      }
      x.set(withTiming(accept ? 420 : -420, { duration: FLY_MS }));
      setTimeout(() => onAnswer({ kind: 'swipe', accept }), FLY_MS);
    },
    [answered, onAnswer, reduceMotion, x],
  );

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_e, g) =>
          Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_e, g) => {
          if (!answered.get()) x.set(g.dx);
        },
        onPanResponderRelease: (_e, g) => {
          if (g.dx > SWIPE_DISTANCE || g.vx > SWIPE_VELOCITY) decide(true);
          else if (g.dx < -SWIPE_DISTANCE || g.vx < -SWIPE_VELOCITY) decide(false);
          else x.set(withSpring(0, { damping: 16 }));
        },
        onPanResponderTerminate: () => {
          x.set(withSpring(0, { damping: 16 }));
        },
      }),
    [answered, decide, x],
  );

  const card = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { rotate: `${x.value / 22}deg` }],
  }));
  const yes = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [0, SWIPE_DISTANCE], [0, 1], 'clamp'),
  }));
  const no = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [-SWIPE_DISTANCE, 0], [1, 0], 'clamp'),
  }));

  return (
    <View style={styles.wrap}>
      <Text style={arcadeText.label}>{t.swipeHint}</Text>
      <Animated.View
        entering={reduceMotion ? undefined : FadeIn.duration(120)}
        style={[styles.card, card]}
        accessible
        accessibilityLabel={t.swipeCardA11y(view.prompt, view.candidate)}
        accessibilityActions={[
          { name: 'activate', label: t.swipeYes },
          { name: 'magicTap', label: t.swipeYes },
          { name: 'escape', label: t.swipeNo },
        ]}
        onAccessibilityAction={(e) => decide(e.nativeEvent.actionName !== 'escape')}
        {...responder.panHandlers}
      >
        <Animated.View style={[styles.stamp, styles.stampYes, yes]} pointerEvents="none">
          <Check color={arcade.success} size={28} strokeWidth={3} />
        </Animated.View>
        <Animated.View style={[styles.stamp, styles.stampNo, no]} pointerEvents="none">
          <X color={arcade.danger} size={28} strokeWidth={3} />
        </Animated.View>
        <TargetText
          style={arcadeText.word}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {view.prompt}
        </TargetText>
        <View style={styles.divider} />
        <Text
          style={styles.candidate}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {view.candidate}
        </Text>
      </Animated.View>
      <View style={styles.buttons}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.swipeNo}
          onPress={() => decide(false)}
          style={({ pressed }) => [styles.button, styles.buttonNo, pressed && styles.pressed]}
        >
          <X color={arcade.danger} size={30} strokeWidth={3} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.swipeYes}
          onPress={() => decide(true)}
          style={({ pressed }) => [styles.button, styles.buttonYes, pressed && styles.pressed]}
        >
          <Check color={arcade.success} size={30} strokeWidth={3} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 16, justifyContent: 'center' },
  card: {
    minHeight: 220,
    borderRadius: arcadeRadii.card,
    backgroundColor: arcade.card,
    borderWidth: 2,
    borderColor: arcade.violet,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 14,
    shadowColor: arcade.violet,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  divider: { width: 48, height: 3, borderRadius: 2, backgroundColor: arcade.border },
  candidate: {
    color: arcade.gold,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  stamp: {
    position: 'absolute',
    top: 14,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampYes: { left: 14, borderColor: arcade.success },
  stampNo: { right: 14, borderColor: arcade.danger },
  buttons: { flexDirection: 'row', justifyContent: 'center', gap: 40 },
  button: {
    width: ARCADE_TOUCH + 20,
    height: ARCADE_TOUCH + 20,
    borderRadius: (ARCADE_TOUCH + 20) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: arcade.card,
    borderWidth: 2,
  },
  buttonNo: { borderColor: arcade.danger },
  buttonYes: { borderColor: arcade.success },
  pressed: { transform: [{ scale: 0.92 }] },
});
