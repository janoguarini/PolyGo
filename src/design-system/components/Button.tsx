import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { colors, gradients, MIN_TOUCH, radii, spacing } from '../tokens';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
  accessibilityHint?: string;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const inactive = disabled || loading;
  const height = size === 'lg' ? 58 : 50;

  const handlePress = () => {
    if (inactive || !onPress) return;
    if (Platform.OS !== 'web') void Haptics.selectionAsync();
    onPress();
  };

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.onPrimary : colors.primaryBright}
        />
      ) : (
        <>
          {icon}
          <Text
            variant="bodyStrong"
            color={variant === 'primary' ? 'onPrimary' : variant === 'danger' ? 'danger' : 'text'}
            style={size === 'lg' ? styles.labelLg : undefined}
          >
            {label}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      onPress={handlePress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        { minHeight: Math.max(height, MIN_TOUCH), opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        pressed && !inactive ? styles.pressed : null,
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fill, { minHeight: height }]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.fill, { minHeight: height }, variantStyles[variant]]}>{content}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radii.lg, overflow: 'hidden' },
  pressed: { transform: [{ scale: 0.98 }] },
  fill: {
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  labelLg: { fontSize: 17, letterSpacing: 0.3 },
});

const variantStyles = StyleSheet.create({
  secondary: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.dangerStrong },
});
