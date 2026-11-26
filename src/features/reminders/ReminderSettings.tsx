import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Button, Card, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';
import { toUserMessage } from '@/lib/errors';

import { useNotificationsGranted, useReminderPrefs, useSetReminderPrefs } from './hooks';
import { remindersSupported } from './notifications';
import { DEFAULT_REMINDER, REMINDER_HOURS, formatReminderTime } from './schedule';
import { smartStrings } from './smartStrings';
import { reminderStrings } from './strings';

/** Interruptor y horario del recordatorio diario (notificación local, sin servidor). */
export function ReminderSettings() {
  const styles = useStyles();
  const t = useStrings(reminderStrings);
  const s = useStrings(smartStrings);
  const prefs = useReminderPrefs();
  const update = useSetReminderPrefs();
  const granted = useNotificationsGranted().data === true;

  if (!remindersSupported) return null;
  const saved = prefs.data ?? DEFAULT_REMINDER;
  // Sin permiso del teléfono no llega nada: los interruptores se ven apagados (al prenderlos se pide).
  const current = {
    ...saved,
    enabled: saved.enabled && granted,
    smart: saved.smart !== false && granted,
  };
  const blocked = update.data === 'blocked';
  const denied = update.data === 'denied';

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">{t.dailyReminder}</Text>
          <Text variant="caption">
            {current.enabled ? t.enabledHint(formatReminderTime(current)) : t.disabledHint}
          </Text>
        </View>
        <Switch
          accessibilityLabel={t.dailyReminder}
          value={current.enabled}
          disabled={!prefs.data || update.isPending}
          onValueChange={(enabled) => update.mutate({ ...saved, enabled })}
          trackColor={{ false: colors.surfaceHighlight, true: colors.primary }}
          thumbColor={colors.textStrong}
        />
      </View>

      {current.enabled ? (
        <View style={styles.hours} accessibilityRole="radiogroup" accessibilityLabel={t.schedule}>
          {REMINDER_HOURS.map((hour) => {
            const selected = current.hour === hour && current.minute === 0;
            return (
              <Pressable
                key={hour}
                accessibilityRole="radio"
                accessibilityState={{ selected, disabled: update.isPending }}
                disabled={update.isPending}
                onPress={() => update.mutate({ ...saved, enabled: true, hour, minute: 0 })}
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

      <View style={styles.row}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">{s.smartToggle}</Text>
          <Text variant="caption">{s.smartHint}</Text>
        </View>
        <Switch
          accessibilityLabel={s.smartToggle}
          value={current.smart}
          disabled={!prefs.data || update.isPending}
          onValueChange={(smart) => update.mutate({ ...saved, smart })}
          trackColor={{ false: colors.surfaceHighlight, true: colors.primary }}
          thumbColor={colors.textStrong}
        />
      </View>

      {denied ? (
        <Text variant="caption" color="danger">
          {t.denied}
        </Text>
      ) : null}
      {blocked ? (
        <>
          <Text variant="caption" color="danger">
            {t.blocked}
          </Text>
          <Button
            label={t.openSettings}
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

const useStyles = themedStyles(() =>
  StyleSheet.create({
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
  }),
);
