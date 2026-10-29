import { BookOpen } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { EmptyState, Screen, Text, colors, spacing } from '@/design-system';

export default function LearnScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="overline" color="primarySoft">
          INGLÉS · A1
        </Text>
        <Text variant="title">Aprender</Text>
      </View>
      <EmptyState
        icon={<BookOpen color={colors.info} size={40} />}
        title="El currículo A1 está en preparación"
        message="Las unidades, lecciones y el repaso espaciado llegan en la Fase 2. Tu progreso quedará guardado en tu cuenta."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xxs },
});
