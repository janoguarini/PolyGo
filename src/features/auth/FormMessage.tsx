import { StyleSheet, View } from 'react-native';

import { Text, colors, radii, spacing } from '@/design-system';

export function FormMessage({ tone, message }: { tone: 'error' | 'success'; message: string }) {
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.box, tone === 'error' ? styles.error : styles.success]}
    >
      <Text variant="caption" color={tone === 'error' ? 'danger' : 'success'}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: spacing.md, borderRadius: radii.md, borderWidth: 1 },
  error: { borderColor: colors.dangerStrong, backgroundColor: 'rgba(239,68,68,0.08)' },
  success: { borderColor: colors.successStrong, backgroundColor: 'rgba(16,185,129,0.08)' },
});
