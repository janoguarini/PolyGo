import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, SelectCard, Text, spacing } from '@/design-system';
import { usePlus } from '@/features/plus/api';
import { PlusBadge } from '@/features/plus/components/PlusBadge';
import { useStrings } from '@/i18n';

import { WIDGET_CONTENT_OPTIONS } from './content';
import { useSetWidgetContent, useWidgetContentPref } from './preferences';
import { widgetStrings } from './strings';

/**
 * Elegir qué muestra el widget «Palabra» (PolyGo Plus). Sin Plus se ven las opciones bloqueadas y
 * un link discreto; el widget gratuito sigue mostrando «Variado».
 */
export function WidgetContentPicker() {
  const t = useStrings(widgetStrings);
  const plus = usePlus();
  const pref = useWidgetContentPref().data ?? 'mixed';
  const setPref = useSetWidgetContent();
  const current = plus ? pref : 'mixed';

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text variant="bodyStrong" style={styles.flex}>
          {t.pickerTitle}
        </Text>
        <PlusBadge />
      </View>
      {WIDGET_CONTENT_OPTIONS.map((o) => (
        <SelectCard
          key={o.id}
          title={t.options[o.id].title}
          description={t.options[o.id].caption}
          selected={current === o.id}
          disabled={plus !== true && o.id !== 'mixed'}
          badge={plus !== true && o.id !== 'mixed' ? 'Plus' : undefined}
          onPress={() => setPref.mutate(o.id)}
        />
      ))}
      <Text variant="caption">{t.pickerNote}</Text>
      {plus === false ? (
        <Button label={t.customizeWithPlus} variant="ghost" onPress={() => router.push('/plus')} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flex: 1 },
});
