import { Smartphone, Volume2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Card, Screen, Text, colors, gradients, radii, spacing } from '@/design-system';

export default function VocabularyScreen() {
  return (
    <Screen>
      <Text variant="title">Vocabulario y widget</Text>

      <Text variant="overline">VISTA PREVIA · CONTENIDO DE EJEMPLO</Text>
      <Card gradient={gradients.hero} style={styles.widget}>
        <View style={styles.widgetTop}>
          <Text variant="overline" color="primarySoft">
            PALABRA DEL DÍA
          </Text>
          <Volume2 color={colors.textMuted} size={18} />
        </View>
        <Text variant="display">chair</Text>
        <Text color="textMuted">/tʃeər/ · silla</Text>
        <Text variant="caption">“The chair is big.”</Text>
      </Card>

      <Card style={styles.status}>
        <View style={styles.row}>
          <Smartphone color={colors.info} size={22} />
          <Text variant="bodyStrong">Widget de pantalla de inicio</Text>
        </View>
        <Text color="textMuted">
          El widget nativo para iOS y Android todavía no está instalado en esta versión (Fase 5).
          Esta tarjeta es sólo una vista previa del diseño.
        </Text>
        <View style={styles.pill}>
          <Text variant="overline" color="streak">
            ESTADO: PENDIENTE
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  widget: { gap: spacing.xs, aspectRatio: 2.1, justifyContent: 'center' },
  widgetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  status: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(251,146,60,0.12)',
  },
});
