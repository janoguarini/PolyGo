import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, elevation, radii, spacing } from '../tokens';

export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Fondo en degradado (p. ej. tarjetas destacadas). */
  gradient?: readonly [string, string, ...string[]];
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function Card({ children, style, gradient, onPress, accessibilityLabel }: CardProps) {
  const body = gradient ? (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      {children}
    </LinearGradient>
  ) : (
    <View style={[styles.card, styles.solid, style]}>{children}</View>
  );

  if (!onPress) return body;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.99 : 1 }],
      })}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.card,
  },
  solid: { backgroundColor: colors.surface },
});
