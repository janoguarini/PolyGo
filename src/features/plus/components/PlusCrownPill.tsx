import { Crown } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Text, colors, radii, spacing, themedStyles } from '@/design-system';

/** Píldora dorada «👑 Plus»: marca una función de PolyGo Plus (Repaso inteligente). */
export function PlusCrownPill({ label, a11y }: { label: string; a11y: string }) {
  const styles = useStyles();
  return (
    <View style={styles.pill} accessible accessibilityLabel={a11y}>
      <Crown color={colors.brandSolid} fill={colors.brandSolid} size={13} />
      <Text variant="caption" style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radii.pill,
      backgroundColor: colors.gold,
    },
    text: { color: colors.brandSolid, fontWeight: '800' },
  }),
);
