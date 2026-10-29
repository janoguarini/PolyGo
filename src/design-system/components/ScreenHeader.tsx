import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, MIN_TOUCH, spacing } from '../tokens';
import { Text } from './Text';

/** Título de pantalla apilada con botón para volver. */
export function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Volver"
        onPress={onBack}
        hitSlop={12}
        style={styles.back}
      >
        <ChevronLeft color={colors.text} size={26} />
      </Pressable>
      <Text variant="title" numberOfLines={1} style={styles.title} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  back: { width: 32, height: MIN_TOUCH, justifyContent: 'center' },
  title: { flex: 1 },
});
