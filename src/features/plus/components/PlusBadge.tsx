import { Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import { energyStrings } from '../strings';

/** Distintivo de lo que es de PolyGo Plus (para diferenciarlo de lo gratuito). */
export function PlusBadge({ label = 'PLUS' }: { label?: string }) {
  const styles = useStyles();
  const t = useStrings(energyStrings);
  return (
    <View style={styles.badge} accessible accessibilityLabel={t.badgeA11y}>
      <Sparkles color={colors.primarySoft} size={12} />
      <Text variant="overline" color="primarySoft">
        {label}
      </Text>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(139,92,246,0.16)',
      borderWidth: 1,
      borderColor: colors.primary,
    },
  }),
);
