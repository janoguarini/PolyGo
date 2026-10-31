import { Ban } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Text, colors, spacing } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { toUserMessage } from '@/lib/errors';

import { useBlockUser } from './api';

/** "Bloquear" en el perfil de otro jugador, con confirmación que explica qué cambia. */
export function BlockUserButton({ userId, username }: { userId: string; username: string }) {
  const block = useBlockUser();
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    block.reset();
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Bloquear a ${username}`}
        onPress={() => setOpen(true)}
        style={styles.trigger}
        hitSlop={6}
      >
        <Ban color={colors.textMuted} size={14} />
        <Text variant="caption">Bloquear</Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={close}>
        <View style={styles.backdrop}>
          <Card style={styles.sheet}>
            <Text variant="heading">¿Bloquear a @{username}?</Text>
            <View style={styles.list}>
              <Text variant="caption">• No van a volver a cruzarse en ranked.</Text>
              <Text variant="caption">• No va a poder entrar a tus desafíos.</Text>
              <Text variant="caption">• No lo vas a ver en la clasificación ni en su perfil.</Text>
            </View>
            <Text variant="caption">
              No le avisamos. Podés desbloquearlo cuando quieras desde Ajustes.
            </Text>
            {block.isError ? (
              <FormMessage tone="error" message={toUserMessage(block.error)} />
            ) : null}
            <Button
              label="Sí, bloquear"
              variant="danger"
              loading={block.isPending}
              onPress={() => block.mutate(userId, { onSuccess: () => setOpen(false) })}
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
    minHeight: 32,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: { gap: spacing.sm },
  list: { gap: spacing.xxs },
});
