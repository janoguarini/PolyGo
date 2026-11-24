import { router } from 'expo-router';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { PolyCoin, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import { usePolys } from './api';
import { polysStrings } from './strings';

/** Saldo de Polys; al tocarlo abre la tienda. */
export function PolysChip({ style }: { style?: StyleProp<ViewStyle> } = {}) {
  const styles = useStyles();
  const t = useStrings(polysStrings);
  const polys = usePolys();
  const balance = polys.data?.balance;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={balance === undefined ? 'Polys' : t.balanceA11y(balance)}
      accessibilityHint={t.openShopHint}
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

const useStyles = themedStyles(() =>
  StyleSheet.create({
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
  }),
);
