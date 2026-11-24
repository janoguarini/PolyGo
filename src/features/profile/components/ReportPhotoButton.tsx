import { Check, Flag } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Text, colors, spacing, themedStyles } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { useStrings } from '@/i18n';
import { toUserMessage } from '@/lib/errors';

import type { ReportReason } from '../api';
import { useReportAvatar } from '../hooks';
import { reportStrings } from '../strings';

const REASONS: readonly ReportReason[] = ['sexual', 'violent', 'hateful', 'impersonation', 'other'];

/** "Reportar foto" en el perfil de otro jugador: elegir motivo, confirmar y avisar el resultado. */
export function ReportPhotoButton({
  userId,
  username,
  hasPhoto,
}: {
  userId: string;
  username: string;
  /** Sin foto no hay nada que reportar (el aviso de un reporte enviado se sigue mostrando). */
  hasPhoto: boolean;
}) {
  const styles = useStyles();
  const t = useStrings(reportStrings);
  const report = useReportAvatar(userId);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | null>(null);

  const close = () => {
    setOpen(false);
    setReason(null);
    report.reset();
  };

  if (report.isSuccess && !open) {
    return (
      <Text variant="caption" align="center" color="success">
        {report.data.hidden ? t.hidden : t.review}
      </Text>
    );
  }

  if (!hasPhoto) return null;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.triggerA11y(username)}
        onPress={() => setOpen(true)}
        style={styles.trigger}
        hitSlop={6}
      >
        <Flag color={colors.textMuted} size={14} />
        <Text variant="caption">{t.trigger}</Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={close}>
        <View style={styles.backdrop}>
          <Card style={styles.sheet}>
            <Text variant="heading">{t.title}</Text>
            <Text variant="caption">{t.body(username)}</Text>
            <View accessibilityRole="radiogroup">
              {REASONS.map((r) => {
                const selected = reason === r;
                return (
                  <Pressable
                    key={r}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => setReason(r)}
                    style={styles.option}
                  >
                    <Text
                      variant="bodyStrong"
                      color={selected ? 'primarySoft' : 'text'}
                      style={styles.flex}
                    >
                      {t.reason(r)}
                    </Text>
                    {selected ? <Check color={colors.primarySoft} size={18} /> : null}
                  </Pressable>
                );
              })}
            </View>
            {report.isError ? (
              <FormMessage tone="error" message={toUserMessage(report.error)} />
            ) : null}
            <Button
              label={t.send}
              variant="danger"
              disabled={!reason}
              loading={report.isPending}
              onPress={() => reason && report.mutate(reason, { onSuccess: () => setOpen(false) })}
            />
            <Button label={t.cancel} variant="ghost" onPress={close} />
          </Card>
        </View>
      </Modal>
    </>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'center',
      minHeight: 32,
    },
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      padding: spacing.xl,
    },
    sheet: { gap: spacing.sm },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44,
      paddingVertical: spacing.xs,
    },
    flex: { flex: 1 },
  }),
);
