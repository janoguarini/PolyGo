import { Ban } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Text, colors, spacing, themedStyles } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { useStrings } from '@/i18n';
import { toUserMessage } from '@/lib/errors';

import { useBlockUser } from './api';
import { blockStrings } from './strings';

/** "Bloquear" en el perfil de otro jugador, con confirmación que explica qué cambia. */
export function BlockUserButton({ userId, username }: { userId: string; username: string }) {
  const styles = useStyles();
  const t = useStrings(blockStrings);
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
        accessibilityLabel={t.blockA11y(username)}
        onPress={() => setOpen(true)}
        style={styles.trigger}
        hitSlop={6}
      >
        <Ban color={colors.textMuted} size={14} />
        <Text variant="caption">{t.block}</Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={close}>
        <View style={styles.backdrop}>
          <Card style={styles.sheet}>
            <Text variant="heading">{t.confirmTitle(username)}</Text>
            <View style={styles.list}>
              <Text variant="caption">{t.effectRanked}</Text>
              <Text variant="caption">{t.effectChallenges}</Text>
              <Text variant="caption">{t.effectVisibility}</Text>
            </View>
            <Text variant="caption">{t.noNotice}</Text>
            {block.isError ? (
              <FormMessage tone="error" message={toUserMessage(block.error)} />
            ) : null}
            <Button
              label={t.confirm}
              variant="danger"
              loading={block.isPending}
              onPress={() => block.mutate(userId, { onSuccess: () => setOpen(false) })}
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
  }),
);
