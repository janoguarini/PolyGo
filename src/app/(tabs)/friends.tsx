import { router } from 'expo-router';
import { Check, Clock, Flame, Search, Share2, UserPlus, Users, X } from 'lucide-react-native';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Share,
  StyleSheet,
  View,
  type ScrollViewInstance,
} from 'react-native';

import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  MIN_TOUCH,
  RankEmblemForRating,
  Screen,
  Text,
  TextField,
  colors,
  radii,
  spacing,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import {
  useFriends,
  usePlayerSearch,
  useRemoveFriend,
  useRespondFriendRequest,
  useSendFriendRequest,
  type FriendEntry,
  type FriendshipState,
} from '@/features/friends/api';
import { useMyProfile } from '@/features/profile/hooks';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';
import { toUserMessage } from '@/lib/errors';
import { useTabPressScroll } from '@/lib/useTabPressScroll';

/** Espera a que se deje de escribir antes de buscar. */
const SEARCH_DELAY_MS = 350;

export default function FriendsScreen() {
  const friends = useFriends();
  const scrollRef = useRef<ScrollViewInstance>(null);
  useTabPressScroll(scrollRef);
  const [query, setQuery] = useState('');

  if (friends.isPending) return <LoadingState />;
  if (friends.isError || !friends.data)
    return <ErrorState onRetry={() => void friends.refetch()} />;

  const list = friends.data;
  const incoming = list.filter((f) => f.state === 'incoming');
  const outgoing = list.filter((f) => f.state === 'outgoing');
  // Como una clasificación entre amigos: los posicionados por ELO, después el resto.
  const accepted = list
    .filter((f) => f.state === 'friends')
    .sort(
      (a, b) =>
        Number(b.placed) - Number(a.placed) ||
        (b.rating ?? 0) - (a.rating ?? 0) ||
        a.username.localeCompare(b.username),
    );

  return (
    <Screen
      scrollRef={scrollRef}
      onRefresh={() => void friends.refetch()}
      refreshing={friends.isRefetching}
    >
      <View style={styles.header}>
        <Text variant="title">Amigos</Text>
        <Text color="textMuted">Seguí su racha, mirá su rango y desafialos a una partida.</Text>
      </View>

      <PlayerSearch query={query} onChange={setQuery} />

      {query.trim().length === 0 ? (
        <>
          {incoming.length > 0 ? (
            <>
              <Text variant="overline">SOLICITUDES · {incoming.length}</Text>
              <Card style={styles.list}>
                {incoming.map((f) => (
                  <PlayerRow
                    key={f.userId}
                    player={f}
                    trailing={<IncomingActions userId={f.userId} />}
                  />
                ))}
              </Card>
            </>
          ) : null}

          <Text variant="overline">TUS AMIGOS{accepted.length > 0 ? ` · ${accepted.length}` : ''}</Text>
          {accepted.length === 0 ? (
            <EmptyState
              icon={<Users color={colors.textMuted} size={36} />}
              title="Todavía no tenés amigos"
              message="Buscalos por su nombre de usuario o pasales tu código para que te agreguen."
            />
          ) : (
            <Card style={styles.list}>
              {accepted.map((f) => (
                <PlayerRow key={f.userId} player={f} trailing={<FriendStats friend={f} />} />
              ))}
            </Card>
          )}

          <Card style={styles.gap}>
            <Text variant="overline">JUGAR CON UN AMIGO</Text>
            <Text color="textMuted">
              Creá un código, mandáselo y juegan la misma partida en vivo. Amistoso: no mueve el
              ELO.
            </Text>
            <Button
              label="Desafiar a un amigo"
              variant="secondary"
              icon={<UserPlus color={colors.text} size={20} />}
              onPress={() => router.push({ pathname: '/battle', params: { challenge: 'host' } })}
            />
          </Card>

          <MyCodeCard />

          {outgoing.length > 0 ? (
            <>
              <Text variant="overline">SOLICITUDES ENVIADAS</Text>
              <Card style={styles.list}>
                {outgoing.map((f) => (
                  <PlayerRow
                    key={f.userId}
                    player={f}
                    trailing={<CancelRequest userId={f.userId} />}
                  />
                ))}
              </Card>
            </>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}

function PlayerSearch({ query, onChange }: { query: string; onChange: (q: string) => void }) {
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), SEARCH_DELAY_MS);
    return () => clearTimeout(t);
  }, [query]);
  const search = usePlayerSearch(debounced);
  const active = query.trim().length > 0;
  const tooShort = debounced.trim().replace(/^@/, '').length < 2;

  return (
    <View style={styles.gap}>
      <View>
        <TextField
          label="Buscar jugadores"
          value={query}
          onChangeText={onChange}
          placeholder="Nombre de usuario o código PG-…"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={styles.searchInput}
        />
        <View style={styles.searchIcon} pointerEvents="none">
          <Search color={colors.textSubtle} size={18} />
        </View>
        {active ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Borrar búsqueda"
            onPress={() => onChange('')}
            style={styles.clear}
            hitSlop={8}
          >
            <X color={colors.textMuted} size={18} />
          </Pressable>
        ) : null}
      </View>

      {!active ? null : tooShort ? (
        <Text variant="caption">Escribí al menos 2 letras.</Text>
      ) : search.isPending || debounced !== query ? (
        <ActivityIndicator color={colors.primaryBright} />
      ) : search.isError ? (
        <FormMessage tone="error" message={toUserMessage(search.error)} />
      ) : search.data && search.data.length > 0 ? (
        <Card style={styles.list}>
          {search.data.map((p) => (
            <PlayerRow
              key={p.userId}
              player={p}
              trailing={<SearchAction userId={p.userId} state={p.state} />}
            />
          ))}
        </Card>
      ) : (
        <Text variant="caption">No encontramos jugadores con ese nombre o código.</Text>
      )}
    </View>
  );
}

interface RowPlayer {
  userId: string;
  username: string;
  avatarId: string;
  avatarPath: string | null;
  frameId: string | null;
  rating: number | null;
  placed: boolean;
}

function PlayerRow({ player, trailing }: { player: RowPlayer; trailing: ReactNode }) {
  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [styles.identity, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${player.username}. Ver perfil`}
        onPress={() => router.push({ pathname: '/player/[id]', params: { id: player.userId } })}
      >
        <FramedAvatar
          avatarId={player.avatarId}
          photoUrl={avatarPhotoUrl(player.avatarPath)}
          size={player.frameId ? 34 : 40}
          frameId={player.frameId}
        />
        <View style={styles.flex}>
          <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
            {player.username}
          </Text>
          <View style={styles.sub}>
            {player.rating !== null ? (
              <RankEmblemForRating rating={player.rating} size={16} dimmed={!player.placed} />
            ) : null}
            <Text variant="caption">
              {player.rating === null
                ? 'Sin rango'
                : player.placed
                  ? `${player.rating} ELO`
                  : 'Sin posicionar'}
            </Text>
          </View>
        </View>
      </Pressable>
      {trailing}
    </View>
  );
}

function FriendStats({ friend }: { friend: FriendEntry }) {
  const active = friend.streak > 0;
  return (
    <View
      style={styles.streak}
      accessible
      accessibilityLabel={`Racha de ${friend.streak} ${friend.streak === 1 ? 'día' : 'días'}`}
    >
      <Flame color={active ? colors.streak : colors.textSubtle} size={18} />
      <Text variant="bodyStrong" color={active ? 'streak' : 'textSubtle'}>
        {friend.streak}
      </Text>
    </View>
  );
}

function IncomingActions({ userId }: { userId: string }) {
  const respond = useRespondFriendRequest();
  return (
    <View style={styles.actions}>
      <IconAction
        label="Rechazar solicitud"
        disabled={respond.isPending}
        onPress={() => respond.mutate({ userId, accept: false })}
      >
        <X color={colors.textMuted} size={20} />
      </IconAction>
      <IconAction
        label="Aceptar solicitud"
        primary
        disabled={respond.isPending}
        onPress={() => respond.mutate({ userId, accept: true })}
      >
        <Check color={colors.onPrimary} size={20} />
      </IconAction>
    </View>
  );
}

function CancelRequest({ userId }: { userId: string }) {
  const remove = useRemoveFriend();
  return (
    <IconAction
      label="Cancelar solicitud"
      disabled={remove.isPending}
      onPress={() => remove.mutate(userId)}
    >
      <X color={colors.textMuted} size={20} />
    </IconAction>
  );
}

function SearchAction({ userId, state }: { userId: string; state: FriendshipState }) {
  const send = useSendFriendRequest();
  const respond = useRespondFriendRequest();
  if (state === 'friends')
    return (
      <View style={styles.tag}>
        <Check color={colors.success} size={16} />
        <Text variant="caption" color="success">
          Amigos
        </Text>
      </View>
    );
  if (state === 'outgoing')
    return (
      <View style={styles.tag}>
        <Clock color={colors.textMuted} size={16} />
        <Text variant="caption">Enviada</Text>
      </View>
    );
  if (state === 'incoming') return <IncomingActions userId={userId} />;
  return (
    <IconAction
      label="Agregar amigo"
      primary
      disabled={send.isPending || respond.isPending}
      onPress={() => send.mutate(userId)}
    >
      <UserPlus color={colors.onPrimary} size={20} />
    </IconAction>
  );
}

function IconAction(props: {
  label: string;
  primary?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.label}
      accessibilityState={{ disabled: props.disabled }}
      disabled={props.disabled}
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.iconButton,
        props.primary && styles.iconButtonPrimary,
        (pressed || props.disabled) && styles.pressed,
      ]}
    >
      {props.children}
    </Pressable>
  );
}

/** Tu código PG- para que otros te encuentren. */
function MyCodeCard() {
  const profile = useMyProfile();
  const code = profile.data?.profile.public_code;
  const username = profile.data?.profile.username;
  if (!code) return null;
  return (
    <Card style={styles.codeCard}>
      <View style={styles.flex}>
        <Text variant="overline">TU CÓDIGO</Text>
        <Text variant="heading" color="textStrong">
          {code}
        </Text>
        <Text variant="caption">Con tu código o tu nombre @{username} te pueden agregar.</Text>
      </View>
      <IconAction
        label="Compartir tu código"
        onPress={() =>
          void Share.share({
            message: `¡Agregame en Polygo! Buscame como @${username} o con mi código ${code}.`,
          })
        }
      >
        <Share2 color={colors.text} size={20} />
      </IconAction>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xxs },
  gap: { gap: spacing.md },
  list: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  identity: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
  sub: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pressed: { opacity: 0.6 },
  streak: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  actions: { flexDirection: 'row', gap: spacing.sm },
  tag: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  iconButton: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHighlight,
  },
  iconButtonPrimary: { backgroundColor: colors.primary },
  searchInput: { paddingLeft: spacing.huge - spacing.md, paddingRight: spacing.huge - spacing.md },
  searchIcon: { position: 'absolute', left: spacing.lg, bottom: 16 },
  clear: { position: 'absolute', right: spacing.lg, bottom: 16 },
  codeCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
