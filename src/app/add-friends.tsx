import { router } from 'expo-router';
import { Inbox, Info, Send } from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

import {
  Card,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  Text,
  colors,
  radii,
  spacing,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { useFriends, type FriendEntry } from '@/features/friends/api';
import { IconTile } from '@/features/friends/components/IconTile';
import { MyCodeCard } from '@/features/friends/components/MyCodeCard';
import { PlayerRow } from '@/features/friends/components/PlayerRow';
import { PlayerSearchResults, SearchBar } from '@/features/friends/components/PlayerSearch';
import {
  CancelRequest,
  IncomingActions,
  type Feedback,
} from '@/features/friends/components/RequestActions';

/** Cuánto queda a la vista el aviso de la última acción. */
const FEEDBACK_MS = 4000;

/**
 * Agregar amigos: buscador arriba. Sin búsqueda se ven tu código y las solicitudes; mientras
 * buscás, sólo los resultados.
 */
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
  const searching = query.trim().length > 0;
  const pending = incoming.length > 0;

  const received = (
    <RequestSection
      icon={<Inbox color={colors.primarySoft} size={18} />}
      title="Solicitudes recibidas"
      requests={incoming}
      highlight
      empty="No tenés solicitudes nuevas."
      renderAction={(f) => (
        <IncomingActions userId={f.userId} username={f.username} onFeedback={setFeedback} />
      )}
    />
  );

  return (
    <Screen onRefresh={() => void friends.refetch()} refreshing={friends.isRefetching}>
      <ScreenHeader title="Agregar amigos" onBack={back} />

      <SearchBar query={query} onChange={setQuery} />

      {feedback ? (
        <Animated.View entering={FadeInDown.duration(200)} exiting={FadeOut.duration(200)}>
          <FormMessage tone={feedback.tone} message={feedback.message} />
        </Animated.View>
      ) : null}

      {searching ? (
        <PlayerSearchResults query={query} onFeedback={setFeedback} />
      ) : (
        <Animated.View entering={FadeIn.duration(250)} style={styles.sections}>
          {/* Si hay solicitudes para responder, van primero. */}
          {pending ? received : null}
          <MyCodeCard />
          {pending ? null : received}

          <RequestSection
            icon={<Send color={colors.primarySoft} size={18} />}
            title="Solicitudes enviadas"
            requests={outgoing}
            subtitle="Pendiente"
            empty="No tenés solicitudes pendientes."
            renderAction={(f) => (
              <CancelRequest userId={f.userId} username={f.username} onFeedback={setFeedback} />
            )}
          />

          <View style={styles.note}>
            <Info color={colors.textSubtle} size={16} style={styles.noteIcon} />
            <Text variant="caption" style={styles.flex}>
              Si alguien rechaza tu solicitud no te avisamos: la seguís viendo pendiente durante 7
              días y después desaparece. Ahí se la podés volver a mandar.
            </Text>
          </View>
        </Animated.View>
      )}
    </Screen>
  );
}

function RequestSection({
  icon,
  title,
  requests,
  empty,
  subtitle,
  highlight,
  renderAction,
}: {
  icon: ReactNode;
  title: string;
  requests: FriendEntry[];
  empty: string;
  subtitle?: string;
  /** El contador resalta (solicitudes que esperan tu respuesta). */
  highlight?: boolean;
  renderAction: (f: FriendEntry) => ReactNode;
}) {
  const count = requests.length;
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <IconTile size={32}>{icon}</IconTile>
        <Text variant="heading" color="textStrong" style={styles.flex}>
          {title}
        </Text>
        {count > 0 ? (
          <View style={[styles.count, highlight && styles.countHighlight]}>
            <Text variant="caption" color={highlight ? 'onPrimary' : 'text'} style={styles.bold}>
              {count}
            </Text>
          </View>
        ) : null}
      </View>
      {count === 0 ? (
        <View style={styles.empty}>
          <Text variant="caption">{empty}</Text>
        </View>
      ) : (
        requests.map((f, i) => (
          <Animated.View key={f.userId} entering={FadeInDown.delay(60 * i).duration(250)}>
            <Card style={[styles.request, highlight && styles.requestHighlight]}>
              <PlayerRow player={f} subtitle={subtitle} trailing={renderAction(f)} />
            </Card>
          </Animated.View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sections: { gap: spacing.xxl },
  section: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  count: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: spacing.xs,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHighlight,
  },
  countHighlight: { backgroundColor: colors.primary },
  bold: { fontWeight: '700' },
  empty: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    alignItems: 'center',
  },
  request: { paddingVertical: spacing.md, borderColor: 'rgba(167, 139, 250, 0.2)' },
  requestHighlight: { borderColor: 'rgba(167, 139, 250, 0.5)' },
  note: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xs },
  noteIcon: { marginTop: 1 },
});
