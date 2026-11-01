import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Card,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  Text,
  spacing,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { useFriends } from '@/features/friends/api';
import { MyCodeCard } from '@/features/friends/components/MyCodeCard';
import { PlayerRow } from '@/features/friends/components/PlayerRow';
import { PlayerSearch } from '@/features/friends/components/PlayerSearch';
import {
  CancelRequest,
  IncomingActions,
  type Feedback,
} from '@/features/friends/components/RequestActions';

/** Cuánto queda a la vista el aviso de la última acción. */
const FEEDBACK_MS = 4000;

/** Agregar amigos: buscar por nombre o código, solicitudes recibidas y enviadas, tu código. */
export default function AddFriendsScreen() {
  const friends = useFriends();
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), FEEDBACK_MS);
    return () => clearTimeout(t);
  }, [feedback]);

  const back = () => (router.canGoBack() ? router.back() : router.replace('/friends'));

  if (friends.isPending) return <LoadingState />;
  if (friends.isError || !friends.data)
    return <ErrorState onRetry={() => void friends.refetch()} />;

  const incoming = friends.data.filter((f) => f.state === 'incoming');
  const outgoing = friends.data.filter((f) => f.state === 'outgoing');

  return (
    <Screen onRefresh={() => void friends.refetch()} refreshing={friends.isRefetching}>
      <ScreenHeader title="Agregar amigos" onBack={back} />

      {feedback ? <FormMessage tone={feedback.tone} message={feedback.message} /> : null}

      <PlayerSearch query={query} onChange={setQuery} onFeedback={setFeedback} autoFocus />

      <Text variant="overline">
        SOLICITUDES RECIBIDAS{incoming.length ? ` · ${incoming.length}` : ''}
      </Text>
      {incoming.length === 0 ? (
        <Text variant="caption">No tenés solicitudes nuevas.</Text>
      ) : (
        <Card style={styles.list}>
          {incoming.map((f) => (
            <PlayerRow
              key={f.userId}
              player={f}
              trailing={
                <IncomingActions userId={f.userId} username={f.username} onFeedback={setFeedback} />
              }
            />
          ))}
        </Card>
      )}

      <Text variant="overline">
        SOLICITUDES ENVIADAS{outgoing.length ? ` · ${outgoing.length}` : ''}
      </Text>
      {outgoing.length === 0 ? (
        <Text variant="caption">No tenés solicitudes pendientes.</Text>
      ) : (
        <Card style={styles.list}>
          {outgoing.map((f) => (
            <PlayerRow
              key={f.userId}
              player={f}
              subtitle="Pendiente"
              trailing={
                <CancelRequest userId={f.userId} username={f.username} onFeedback={setFeedback} />
              }
            />
          ))}
        </Card>
      )}

      <MyCodeCard />
      <View style={styles.note}>
        <Text variant="caption">
          Si alguien rechaza tu solicitud no te avisamos: la seguís viendo pendiente durante 7 días
          y después desaparece. Ahí se la podés volver a mandar.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  note: { paddingHorizontal: spacing.xs },
});
