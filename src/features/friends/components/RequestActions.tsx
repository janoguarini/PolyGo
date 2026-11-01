import { Check, Clock, UserPlus, X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/design-system';
import { toUserMessage } from '@/lib/errors';

import {
  useRemoveFriend,
  useRespondFriendRequest,
  useSendFriendRequest,
  type FriendshipState,
} from '../api';
import { IconAction, StatusTag } from './PlayerRow';

export interface Feedback {
  tone: 'success' | 'error';
  message: string;
}

type OnFeedback = (feedback: Feedback) => void;

/** Aceptar / rechazar una solicitud recibida. */
export function IncomingActions({
  userId,
  username,
  onFeedback,
}: {
  userId: string;
  username: string;
  onFeedback?: OnFeedback;
}) {
  const respond = useRespondFriendRequest();
  const run = (accept: boolean) =>
    respond.mutate(
      { userId, accept },
      {
        onSuccess: () =>
          onFeedback?.({
            tone: 'success',
            message: accept
              ? `¡Ahora vos y @${username} son amigos!`
              : `Rechazaste la solicitud de @${username}.`,
          }),
        onError: (e) => onFeedback?.({ tone: 'error', message: toUserMessage(e) }),
      },
    );
  return (
    <View style={styles.actions}>
      <IconAction
        label={`Rechazar la solicitud de ${username}`}
        disabled={respond.isPending}
        onPress={() => run(false)}
      >
        <X color={colors.textMuted} size={20} />
      </IconAction>
      <IconAction
        label={`Aceptar la solicitud de ${username}`}
        primary
        disabled={respond.isPending}
        onPress={() => run(true)}
      >
        <Check color={colors.onPrimary} size={20} />
      </IconAction>
    </View>
  );
}

/** Cancelar una solicitud que mandé. */
export function CancelRequest({
  userId,
  username,
  onFeedback,
}: {
  userId: string;
  username: string;
  onFeedback?: OnFeedback;
}) {
  const remove = useRemoveFriend();
  return (
    <IconAction
      label={`Cancelar la solicitud a ${username}`}
      disabled={remove.isPending}
      onPress={() =>
        remove.mutate(userId, {
          onSuccess: () =>
            onFeedback?.({ tone: 'success', message: `Cancelaste la solicitud a @${username}.` }),
          onError: (e) => onFeedback?.({ tone: 'error', message: toUserMessage(e) }),
        })
      }
    >
      <X color={colors.textMuted} size={20} />
    </IconAction>
  );
}

/** Acción en un resultado de búsqueda según el estado de amistad. */
export function SearchAction({
  userId,
  username,
  state,
  onFeedback,
}: {
  userId: string;
  username: string;
  state: FriendshipState;
  onFeedback?: OnFeedback;
}) {
  const send = useSendFriendRequest();
  if (state === 'friends')
    return (
      <StatusTag icon={<Check color={colors.success} size={14} />} label="Amigos" color="success" />
    );
  if (state === 'outgoing')
    return <StatusTag icon={<Clock color={colors.textMuted} size={14} />} label="Pendiente" />;
  if (state === 'incoming')
    return <IncomingActions userId={userId} username={username} onFeedback={onFeedback} />;
  return (
    <IconAction
      label={`Agregar a ${username}`}
      primary
      disabled={send.isPending}
      onPress={() =>
        send.mutate(userId, {
          onSuccess: () =>
            onFeedback?.({ tone: 'success', message: `Le mandaste una solicitud a @${username}.` }),
          onError: (e) => onFeedback?.({ tone: 'error', message: toUserMessage(e) }),
        })
      }
    >
      <UserPlus color={colors.onPrimary} size={20} />
    </IconAction>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: spacing.sm },
});
