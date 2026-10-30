import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Button, Card, Text, colors, radii, spacing } from '@/design-system';
import { toUserMessage } from '@/lib/errors';

import { useReminderPrefs, useSetReminderPrefs } from './hooks';
import { remindersSupported } from './notifications';
import { DEFAULT_REMINDER, REMINDER_HOURS, formatReminderTime } from './schedule';

/** Interruptor y horario del recordatorio diario (notificación local, sin servidor). */
export function ReminderSettings() {
  const prefs = useReminderPrefs();
  const update = useSetReminderPrefs();

  if (!remindersSupported) return null;
  const current = prefs.data ?? DEFAULT_REMINDER;
  const blocked = update.data === 'blocked';
  const denied = update.data === 'denied';

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Recordatorio diario</Text>
          <Text variant="caption">
            {current.enabled
              ? `Te avisamos a las ${formatReminderTime(current)} si todavía no practicaste.`
              : 'Un aviso por día para no cortar tu racha.'}
          </Text>
        </View>
        <Switch
          accessibilityLabel="Recordatorio diario"
          value={current.enabled}
          disabled={!prefs.data || update.isPending}
          onValueChange={(enabled) => update.mutate({ ...current, enabled })}
          trackColor={{ false: colors.surfaceHighlight, true: colors.primary }}
          thumbColor={colors.textStrong}
        />
      </View>

      {current.enabled ? (
        <View style={styles.hours} accessibilityRole="radiogroup" accessibilityLabel="Horario">
          {REMINDER_HOURS.map((hour) => {
            const selected = current.hour === hour && current.minute === 0;
            return (
              <Pressable
                key={hour}
                accessibilityRole="radio"
                accessibilityState={{ selected, disabled: update.isPending }}
                disabled={update.isPending}
                onPress={() => update.mutate({ ...current, hour, minute: 0 })}
                style={[styles.hour, selected && styles.hourSelected]}
              >
                <Text variant="bodyStrong" color={selected ? 'onPrimary' : 'text'}>
                  {formatReminderTime({ hour, minute: 0 })}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {denied ? (
        <Text variant="caption" color="danger">
          Sin permiso para notificaciones no podemos recordarte.
        </Text>
      ) : null}
      {blocked ? (
        <>
          <Text variant="caption" color="danger">
            Las notificaciones de Polygo están desactivadas en los ajustes del teléfono.
          </Text>
          <Button
            label="Abrir ajustes"
            variant="secondary"
            onPress={() => void Linking.openSettings()}
          />
        </>
      ) : null}
      {update.isError ? (
        <Text variant="caption" color="danger">
          {toUserMessage(update.error)}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
  hours: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  hour: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
  },
  hourSelected: { backgroundColor: colors.primary, borderColor: colors.primaryBright },
});
