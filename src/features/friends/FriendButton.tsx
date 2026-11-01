import { Check, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text, colors, spacing } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { toUserMessage } from '@/lib/errors';

import {
  useRemoveFriend,
  useRespondFriendRequest,
  useSendFriendRequest,
  type FriendshipState,
} from './api';

/** Agregar / aceptar / sacar de amigos, en el perfil de otro jugador. */
export function FriendButton({
  userId,
  username,
  state,
}: {
  userId: string;
  username: string;
  state: FriendshipState;
}) {
  const send = useSendFriendRequest();
  const respond = useRespondFriendRequest();
  const remove = useRemoveFriend();
  const [confirmRemove, setConfirmRemove] = useState(false);
  const error = send.error ?? respond.error ?? remove.error;

  let content;
  if (state === 'friends') {
    content = confirmRemove ? (
      <>
        <Text variant="caption" align="center">
          ¿Sacar a @{username} de tus amigos? No le avisamos.
        </Text>
        <Button
          label="Sí, sacar"
          variant="danger"
          loading={remove.isPending}
          onPress={() => remove.mutate(userId, { onSuccess: () => setConfirmRemove(false) })}
        />
        <Button label="Cancelar" variant="ghost" onPress={() => setConfirmRemove(false)} />
      </>
    ) : (
      <Button
        label="Son amigos"
        variant="secondary"
        icon={<Check color={colors.success} size={20} />}
        accessibilityHint="Toca para sacarlo de tus amigos"
        onPress={() => setConfirmRemove(true)}
      />
    );
  } else if (state === 'outgoing') {
    content = (
      <Button
        label="Solicitud enviada · cancelar"
        variant="ghost"
        loading={remove.isPending}
        onPress={() => remove.mutate(userId)}
      />
    );
  } else if (state === 'incoming') {
    content = (
      <>
        <Text variant="caption" align="center">
          @{username} te mandó una solicitud de amistad.
        </Text>
        <View style={styles.row}>
          <Button
            label="Rechazar"
            variant="ghost"
            style={styles.flex}
            disabled={respond.isPending}
            onPress={() => respond.mutate({ userId, accept: false })}
          />
          <Button
            label="Aceptar"
            style={styles.flex}
            loading={respond.isPending}
            onPress={() => respond.mutate({ userId, accept: true })}
          />
        </View>
      </>
    );
  } else {
    content = (
      <Button
        label="Agregar amigo"
        icon={<UserPlus color={colors.onPrimary} size={20} />}
        loading={send.isPending}
        onPress={() => send.mutate(userId)}
      />
    );
  }

  return (
    <View style={styles.wrap}>
      {content}
      {error ? <FormMessage tone="error" message={toUserMessage(error)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
});
