import { Check, Lock } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, MIN_TOUCH, radii, spacing } from '../tokens';
import { Text } from './Text';

export interface SelectCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  /** Etiqueta para opciones no disponibles, p. ej. "Próximamente". */
  badge?: string;
  leading?: ReactNode;
}

export function SelectCard({
  title,
  description,
  selected,
  onPress,
  disabled,
  badge,
  leading,
}: SelectCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={badge ? `${title}, ${badge}` : title}
      accessibilityHint={description}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {leading}
      <View style={styles.texts}>
        <Text variant="bodyStrong" color={disabled ? 'textMuted' : 'textStrong'}>
          {title}
        </Text>
        {description ? <Text variant="caption">{description}</Text> : null}
      </View>
      {disabled ? (
        <View style={styles.badge}>
          <Lock color={colors.textMuted} size={12} />
          <Text variant="overline">{badge ?? 'Bloqueado'}</Text>
        </View>
      ) : selected ? (
        <View style={styles.check}>
          <Check color={colors.onPrimary} size={16} strokeWidth={3} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: MIN_TOUCH + 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: { borderColor: colors.primaryBright, backgroundColor: colors.surfaceRaised },
  disabled: { opacity: 0.6 },
  pressed: { transform: [{ scale: 0.99 }] },
  texts: { flex: 1, gap: spacing.xxs },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
