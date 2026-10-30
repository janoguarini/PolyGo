import { Check, Flag } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Text, colors, spacing } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { toUserMessage } from '@/lib/errors';

import type { ReportReason } from '../api';
import { useReportAvatar } from '../hooks';

const REASONS: { id: ReportReason; label: string }[] = [
  { id: 'sexual', label: 'Contenido sexual' },
  { id: 'violent', label: 'Violencia' },
  { id: 'hateful', label: 'Ofensiva o discriminatoria' },
  { id: 'impersonation', label: 'Se hace pasar por otra persona' },
  { id: 'other', label: 'Otro motivo' },
];

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
        {report.data.hidden
          ? 'Gracias por avisar. La foto se ocultó.'
          : 'Gracias por avisar. Vamos a revisar la foto.'}
      </Text>
    );
  }

  if (!hasPhoto) return null;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Reportar la foto de perfil de ${username}`}
        onPress={() => setOpen(true)}
        style={styles.trigger}
        hitSlop={6}
      >
        <Flag color={colors.textMuted} size={14} />
        <Text variant="caption">Reportar foto</Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={close}>
        <View style={styles.backdrop}>
          <Card style={styles.sheet}>
            <Text variant="heading">Reportar foto de perfil</Text>
            <Text variant="caption">
              ¿Por qué no debería verse la foto de @{username}? Tu reporte es anónimo.
            </Text>
            <View accessibilityRole="radiogroup">
              {REASONS.map((r) => {
                const selected = reason === r.id;
                return (
                  <Pressable
                    key={r.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => setReason(r.id)}
                    style={styles.option}
                  >
                    <Text
                      variant="bodyStrong"
                      color={selected ? 'primarySoft' : 'text'}
                      style={styles.flex}
                    >
                      {r.label}
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
              label="Enviar reporte"
              variant="danger"
              disabled={!reason}
              loading={report.isPending}
              onPress={() => reason && report.mutate(reason, { onSuccess: () => setOpen(false) })}
            />
            <Button label="Cancelar" variant="ghost" onPress={close} />
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
});
