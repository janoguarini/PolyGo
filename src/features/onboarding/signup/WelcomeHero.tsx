import { useEffect } from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Mascot, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import { signupStrings } from './strings';

/** Banderas que flotan alrededor del zorro (posición en % del recuadro). */
const ORBIT = [
  { flag: '🇺🇸', top: '4%', left: '6%', size: 38 },
  { flag: '🇮🇹', top: '0%', left: '74%', size: 34 },
  { flag: '🇧🇷', top: '40%', left: '84%', size: 40 },
  { flag: '🇨🇳', top: '70%', left: '2%', size: 34 },
  { flag: '🇫🇷', top: '36%', left: '-2%', size: 30 },
  { flag: '🇪🇸', top: '76%', left: '80%', size: 32 },
] as const;

/** Emoji de cada característica; el texto sale de signupStrings.features (mismo orden). */
const FEATURE_EMOJIS = ['⚡', '🔥', '⚔️'] as const;

function FloatingFlag({ flag, index, size }: { flag: string; index: number; size: number }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(
      index * 180,
      withRepeat(
        withSequence(
          withTiming(-7, { duration: 1300 + index * 90, easing: Easing.inOut(Easing.quad) }),
          withTiming(7, { duration: 1300 + index * 90, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
  }, [y, index]);
  const float = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View style={float}>
      <RNText style={{ fontSize: size, lineHeight: size * 1.2 }}>{flag}</RNText>
    </Animated.View>
  );
}

/** Primer paso del registro: el zorro saluda rodeado de banderas; tres chips dicen de qué se trata. */
export function WelcomeHero() {
  const styles = useStyles();
  const t = useStrings(signupStrings);
  const bob = useSharedValue(0);
  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, [bob]);
  const bobbing = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }));

  return (
    <View style={styles.wrap}>
      <View style={styles.stage}>
        <View style={styles.halo} />
        <Animated.View entering={ZoomIn.springify().damping(10)} style={bobbing}>
          <Mascot pose="wave" height={250} />
        </Animated.View>
        {ORBIT.map((o, i) => (
          <Animated.View
            key={o.flag}
            entering={ZoomIn.delay(350 + i * 110)
              .springify()
              .damping(9)}
            style={[styles.flag, { top: o.top, left: o.left }]}
            pointerEvents="none"
            accessible={false}
          >
            <FloatingFlag flag={o.flag} index={i} size={o.size} />
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInUp.delay(250).springify()} style={styles.texts}>
        <Text variant="display" align="center" color="textStrong">
          {t.hello}
        </Text>
        <Text variant="bodyStrong" align="center" color="text">
          {t.tagline}
        </Text>
      </Animated.View>

      <View style={styles.chips}>
        {t.features.map((label, i) => (
          <Animated.View
            key={label}
            entering={FadeInDown.delay(600 + i * 120).springify()}
            style={styles.chip}
          >
            <RNText style={styles.chipEmoji}>{FEATURE_EMOJIS[i]}</RNText>
            <Text variant="caption" color="textStrong" style={styles.chipLabel}>
              {label}
            </Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    wrap: { alignItems: 'center', gap: spacing.lg, paddingTop: spacing.lg },
    stage: {
      width: 320,
      maxWidth: '100%',
      height: 290,
      alignItems: 'center',
      justifyContent: 'center',
    },
    halo: {
      position: 'absolute',
      width: 230,
      height: 230,
      borderRadius: 115,
      backgroundColor: colors.primary,
      opacity: 0.22,
      shadowColor: '#8B5CF6',
      shadowOpacity: 0.9,
      shadowRadius: 50,
      shadowOffset: { width: 0, height: 0 },
    },
    flag: { position: 'absolute' },
    texts: { gap: spacing.xs, alignItems: 'center' },
    chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
    chip: {
      flexBasis: '30%',
      flexGrow: 1,
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: radii.lg,
      borderWidth: 1.5,
      borderColor: colors.brandBorder,
      backgroundColor: colors.surfaceRaised,
    },
    chipEmoji: { fontSize: 28, lineHeight: 34 },
    chipLabel: { textAlign: 'center' },
  }),
);
