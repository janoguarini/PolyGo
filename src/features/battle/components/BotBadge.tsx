import { Bot } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Text, colors, radii, spacing } from '@/design-system';

/** Distintivo que acompaña siempre el nombre de un rival bot: nunca se presenta como persona. */
export function BotBadge() {
  return (
    <View style={styles.badge} accessible accessibilityLabel="Bot">
      <Bot color={colors.info} size={12} strokeWidth={2.5} />
      <Text variant="overline" color="info">
        BOT
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.info,
    alignSelf: 'center',
  },
});
