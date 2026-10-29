import { router, useLocalSearchParams } from 'expo-router';
import { Dumbbell, Search, Swords, X } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { Alert, BackHandler, StyleSheet, View } from 'react-native';

import { MATCHMAKING, WORD_RUSH, type BattleMode, type CancelReason } from '@shared/protocol';
import { isInPlacement } from '@shared/ranking';

import {
  Avatar,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  RankEmblemForRating,
  Screen,
  Text,
  colors,
  spacing,
} from '@/design-system';
import { ERROR_MESSAGES } from '@/features/battle/client';
import { BattleHud } from '@/features/battle/components/BattleHud';
import { BattleResult } from '@/features/battle/components/BattleResult';
import { QuestionCard } from '@/features/battle/components/QuestionCard';
import {
  myLine,
  opponentLine,
  opponentPlayer,
  remainingMs,
  type BattleState,
} from '@/features/battle/state';
import { useBattleStore } from '@/features/battle/store';
import { useBattleSession, useNow } from '@/features/battle/useBattleSession';

const CANCEL_MESSAGES: Record<CancelReason, string> = {
  ready_timeout: 'Alguno de los dos no confirmó a tiempo. No se movió el ELO.',
  opponent_left: 'Tu rival se fue antes de empezar. No se movió el ELO.',
  server_error: 'El servidor no pudo empezar la partida. No se movió el ELO.',
  settlement_failed: 'No pudimos guardar el resultado, así que la partida se anuló sin ELO.',
};

export default function BattleScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const initialMode: BattleMode = params.mode === 'practice' ? 'practice' : 'ranked';
  const session = useBattleSession();
  const state = useBattleStore();
  const now = useNow();

  useEffect(() => {
    session.start(initialMode);
    // Sólo al montar: después el usuario elige "jugar otra" o "practicar".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exit = useCallback(() => {
    const current = useBattleStore.getState();
    if (current.phase === 'playing' && current.mode === 'ranked') {
      Alert.alert('¿Abandonar la partida?', 'Abandonar cuenta como derrota y te baja el ELO.', [
        { text: 'Seguir jugando', style: 'cancel' },
        {
          text: 'Abandonar',
          style: 'destructive',
          onPress: () => {
            session.leave();
            router.back();
          },
        },
      ]);
      return;
    }
    session.leave();
    router.back();
  }, [session]);

  // Botón atrás de Android: mismo criterio que la X.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      exit();
      return true;
    });
    return () => sub.remove();
  }, [exit]);

  const switchToPractice = () => {
    session.leave();
    session.start('practice');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Text variant="overline">
          {state.mode === 'practice' ? 'PRÁCTICA · SIN ELO' : 'RANKED · WORD RUSH'}
        </Text>
        <Button
          label={state.phase === 'playing' ? 'Abandonar' : 'Salir'}
          variant="ghost"
          icon={<X color={colors.textMuted} size={18} />}
          onPress={exit}
          accessibilityHint={
            state.phase === 'playing' && state.mode === 'ranked'
              ? 'Abandonar cuenta como derrota'
              : 'Vuelve a la pantalla anterior'
          }
        />
      </View>
      <Body
        state={state}
        now={now}
        onReady={session.ready}
        onAnswer={session.answer}
        onRetry={() => session.start(state.mode)}
        onPractice={switchToPractice}
        onExit={exit}
      />
    </Screen>
  );
}

interface BodyProps {
  state: BattleState;
  now: number;
  onReady: () => void;
  onAnswer: (option: number) => void;
  onRetry: () => void;
  onPractice: () => void;
  onExit: () => void;
}

function Body({ state, now, onReady, onAnswer, onRetry, onPractice, onExit }: BodyProps) {
  const me = state.players.find((p) => p.slot === state.yourSlot);
  const opponent = opponentPlayer(state);

  switch (state.phase) {
    case 'idle':
    case 'connecting':
      return <LoadingState label="Conectando con el servidor de partidas…" />;

    case 'error':
      return (
        <ErrorState
          message={ERROR_MESSAGES[state.errorCode ?? 'connection']}
          onRetry={state.errorCode === 'protocol_mismatch' ? undefined : onRetry}
        />
      );

    case 'searching': {
      const waited = state.queue?.waitedMs ?? 0;
      const mm = Math.floor(waited / 60_000);
      const ss = String(Math.floor(waited / 1000) % 60).padStart(2, '0');
      return (
        <View style={styles.center}>
          <Card style={styles.searchCard}>
            <Search color={colors.primaryBright} size={40} />
            <Text variant="title" align="center">
              Buscando rival…
            </Text>
            <Text
              variant="stat"
              align="center"
              accessibilityLabel={`Esperando ${mm} minutos ${ss} segundos`}
            >
              {mm}:{ss}
            </Text>
            <Text color="textMuted" align="center">
              Rivales con ±{state.queue?.window ?? MATCHMAKING.initialWindow} de ELO. El rango se
              amplía mientras esperás.
            </Text>
          </Card>
          {waited >= MATCHMAKING.suggestPracticeAfterMs ? (
            <Card style={styles.gap}>
              <Text variant="bodyStrong">No hay rivales cerca de tu nivel ahora.</Text>
              <Text color="textMuted">
                Podés seguir esperando o practicar solo contra el reloj. No usamos rivales
                simulados.
              </Text>
              <Button
                label="Practicar sin ELO"
                variant="secondary"
                icon={<Dumbbell color={colors.text} size={18} />}
                onPress={onPractice}
              />
            </Card>
          ) : null}
          <Button label="Cancelar búsqueda" variant="ghost" onPress={onExit} />
        </View>
      );
    }

    case 'found': {
      const left = remainingMs(state.readyDeadline, state.clockOffset, now);
      return (
        <View style={styles.center}>
          <Text variant="title" align="center">
            ¡Rival encontrado!
          </Text>
          <View style={styles.versus}>
            <PlayerBadge
              username="Vos"
              avatarId={me?.avatarId}
              rating={me?.rating}
              games={me?.gamesPlayed}
            />
            <Swords color={colors.primaryBright} size={32} />
            <PlayerBadge
              username={opponent?.username ?? '…'}
              avatarId={opponent?.avatarId}
              rating={opponent?.rating}
              games={opponent?.gamesPlayed}
            />
          </View>
          <Text color="textMuted" align="center">
            75 segundos, las mismas preguntas para los dos. Correcta +100 (+50 por rapidez),
            incorrecta −50.
          </Text>
          <Button
            label={state.iAmReady ? 'Esperando a tu rival…' : '¡Listo!'}
            size="lg"
            disabled={state.iAmReady}
            onPress={onReady}
          />
          {left !== null ? (
            <Text variant="caption" align="center">
              Confirmá en {Math.ceil(left / 1000)} s o la partida se cancela.
            </Text>
          ) : null}
        </View>
      );
    }

    case 'countdown': {
      const left = remainingMs(state.startsAt, state.clockOffset, now);
      return (
        <View style={styles.center}>
          {left === null ? (
            <LoadingState label="Preparando la partida…" />
          ) : (
            <Text
              variant="display"
              align="center"
              style={styles.countdown}
              accessibilityLiveRegion="polite"
            >
              {left > 0 ? Math.ceil(left / 1000) : '¡Ya!'}
            </Text>
          )}
        </View>
      );
    }

    case 'playing': {
      const left = remainingMs(state.endsAt, state.clockOffset, now) ?? 0;
      const grace = state.opponent.connected
        ? null
        : remainingMs(state.opponent.graceEndsAt, state.clockOffset, now);
      return (
        <View style={styles.gap}>
          <BattleHud
            remainingMs={left}
            durationMs={WORD_RUSH.durationMs}
            me={me}
            myLine={myLine(state)}
            opponent={opponent}
            opponentLine={opponentLine(state)}
            opponentGraceMs={grace}
          />
          {left <= 0 ? (
            <LoadingState label="¡Tiempo! Calculando el resultado…" />
          ) : state.question ? (
            <QuestionCard
              question={state.question}
              feedback={state.feedback}
              disabled={state.answering}
              onAnswer={onAnswer}
            />
          ) : state.feedback || state.answering ? null : (
            <LoadingState label="Respondiste todas. Esperando el final…" />
          )}
        </View>
      );
    }

    case 'finished':
      return state.result ? (
        <BattleResult
          result={state.result}
          gamesPlayedBefore={me?.gamesPlayed ?? null}
          onPlayAgain={() => onRetry()}
          onExit={onExit}
        />
      ) : null;

    case 'cancelled':
      return (
        <EmptyState
          title={state.cancelReason ? 'Partida cancelada' : 'Te perdiste el final'}
          message={
            state.cancelReason
              ? CANCEL_MESSAGES[state.cancelReason]
              : 'La partida terminó mientras estabas desconectado. Mirá el resultado en tu historial.'
          }
          actionLabel={state.mode === 'practice' ? 'Practicar de nuevo' : 'Buscar otra partida'}
          onAction={onRetry}
        />
      );
  }
}

function PlayerBadge({
  username,
  avatarId,
  rating,
  games,
}: {
  username: string;
  avatarId: string | undefined;
  rating: number | undefined;
  games: number | undefined;
}) {
  const placement = games === undefined || isInPlacement(games);
  return (
    <View style={styles.badge} accessible accessibilityLabel={`${username}, ${rating ?? ''} ELO`}>
      <Avatar avatarId={avatarId} size={64} />
      <Text variant="bodyStrong" numberOfLines={1}>
        {username}
      </Text>
      {rating !== undefined ? (
        <View style={styles.badgeRating}>
          <RankEmblemForRating rating={rating} size={22} />
          <Text variant="caption">{placement ? 'En colocación' : rating}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  center: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg, paddingVertical: spacing.xl },
  gap: { gap: spacing.lg },
  searchCard: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  versus: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  badge: { alignItems: 'center', gap: spacing.xs, flex: 1 },
  badgeRating: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  countdown: { fontSize: 96, lineHeight: 110 },
});
