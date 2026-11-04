import { router } from 'expo-router';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { PolyCoin, Text, colors, radii, spacing } from '@/design-system';

import { usePolys } from './api';

/** Saldo de Polys; al tocarlo abre la tienda. */
export function PolysChip({ style }: { style?: StyleProp<ViewStyle> } = {}) {
  const polys = usePolys();
  const balance = polys.data?.balance;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={balance === undefined ? 'Polys' : `Tenés ${balance} Polys`}
      accessibilityHint="Abre la tienda"
      hitSlop={8}
      onPress={() => router.push('/shop')}
      style={({ pressed }) => [styles.chip, style, pressed && styles.pressed]}
    >
      <PolyCoin size={20} />
      <Text variant="bodyStrong" color="gold" style={styles.amount}>
        {balance ?? '–'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amount: { fontVariant: ['tabular-nums'] },
  pressed: { opacity: 0.75 },
});
