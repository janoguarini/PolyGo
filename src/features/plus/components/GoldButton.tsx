import { LinearGradient } from 'expo-linear-gradient';
import { Crown } from 'lucide-react-native';
import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Text, radii, spacing } from '@/design-system';

/** Dorado de PolyGo Plus (botones de compra y acciones premium). */
export const PLUS_GOLD = ['#FFE27A', '#FFC94A', '#F59E0B'] as const;
/** Tinta oscura sobre dorado. */
export const PLUS_INK = '#1A1040';

/**
 * Botón dorado de PolyGo Plus: latido suave y un brillo que lo cruza cada pocos segundos. Sin
 * animación si el sistema pide menos movimiento. Lo usan /plus y /coach.
 */
export function GoldButton(props: {
  label: string;
  sublabel?: string;
  disabled?: boolean;
  icon?: ReactNode;
  onPress: () => void;
}) {
  const disabled = props.disabled ?? false;
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);
  const shine = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    shine.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(1800, withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) })),
      ),
      -1,
      false,
    );
  }, [reduceMotion, pulse, shine]);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.025 * pulse.value }],
  }));
  const shineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -140 + 560 * shine.value }, { rotate: '20deg' }],
  }));
  return (
    <Animated.View style={[styles.shell, !disabled && pulseStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={props.sublabel ? `${props.label}. ${props.sublabel}` : props.label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={props.onPress}
        style={({ pressed }) => [pressed && styles.pressed, disabled && styles.disabled]}
      >
        <LinearGradient
          colors={PLUS_GOLD}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cta}
        >
          {reduceMotion ? null : (
            <Animated.View style={[styles.shine, shineStyle]} pointerEvents="none">
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          )}
          <View style={styles.row}>
            {props.icon ?? <Crown color={PLUS_INK} fill={PLUS_INK} size={20} />}
            <Text
              style={styles.label}
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.25}
            >
              {props.label}
            </Text>
          </View>
          {props.sublabel ? (
            <Text style={styles.sub} numberOfLines={1} maxFontSizeMultiplier={1.25}>
              {props.sublabel}
            </Text>
          ) : null}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radii.pill,
    shadowColor: '#FBBF24',
    shadowOpacity: 0.65,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
  cta: {
    minHeight: 60,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  shine: { position: 'absolute', top: -40, bottom: -40, width: 70 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { color: PLUS_INK, fontSize: 19, fontWeight: '900', letterSpacing: 0.2, flexShrink: 1 },
  sub: { color: PLUS_INK, fontSize: 12, fontWeight: '700', opacity: 0.75 },
});
