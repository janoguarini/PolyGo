import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Lock } from 'lucide-react-native';
import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import { signupStrings } from './strings';

/** Violeta de marca para el brillo de la opción elegida (el mismo en los dos temas). */
const BRAND = '#8B5CF6';

/**
 * Opción del registro: una tarjeta que rebota al tocarla, vibra suave, brilla cuando está elegida y
 * muestra un candado con «PRONTO» si todavía no se puede elegir.
 */
export function OptionTile({
  selected,
  disabled,
  onPress,
  children,
  accent = BRAND,
  lockLabel,
  accessibilityLabel,
  style,
  contentStyle,
}: {
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: ReactNode;
  /** Color del brillo y el borde al elegirla (hex). */
  accent?: string;
  lockLabel?: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const styles = useStyles();
  const soon = useStrings(signupStrings).soon;
  const lock = lockLabel ?? soon;
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    // Un «pop» al quedar elegida: la respuesta visual del toque.
    if (selected) {
      scale.set(
        withSequence(
          withSpring(1.06, { damping: 9, stiffness: 320 }),
          withSpring(1, { damping: 12, stiffness: 220 }),
        ),
      );
    }
  }, [selected, scale]);

  return (
    <Animated.View style={[animated, style]}>
      <Pressable
        accessibilityRole="radio"
        accessibilityLabel={disabled ? `${accessibilityLabel}, ${lock}` : accessibilityLabel}
        accessibilityState={{ selected, disabled }}
        disabled={disabled}
        onPressIn={() => {
          scale.set(withSpring(0.95, { damping: 15, stiffness: 400 }));
        }}
        onPressOut={() => {
          if (!selected) scale.set(withSpring(1, { damping: 12, stiffness: 300 }));
        }}
        onPress={() => {
          void Haptics.selectionAsync();
          onPress();
        }}
        style={[
          styles.tile,
          selected && [styles.selected, { borderColor: accent, shadowColor: accent }],
          disabled && styles.disabled,
          contentStyle,
        ]}
      >
        {selected ? (
          <LinearGradient
            colors={[`${accent}40`, `${accent}08`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, styles.fill]}
            pointerEvents="none"
          />
        ) : null}
        {children}
        {selected ? (
          <View style={[styles.check, { backgroundColor: accent }]}>
            <Check color="#FFFFFF" size={14} strokeWidth={3.5} />
          </View>
        ) : null}
        {disabled ? (
          <View style={styles.lock}>
            <Lock color={colors.textMuted} size={11} />
            <Text variant="overline" color="textMuted">
              {lock}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    tile: {
      borderRadius: radii.xl,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing.lg,
      overflow: 'visible',
    },
    selected: {
      backgroundColor: colors.surfaceRaised,
      shadowOpacity: 0.55,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 0 },
      elevation: 6,
    },
    fill: { borderRadius: radii.xl - 2 },
    disabled: { opacity: 0.45 },
    check: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    lock: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceHighlight,
    },
  }),
);
