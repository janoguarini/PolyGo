import { router, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { Search, Share2, Swords, UserPlus, X } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { Alert, BackHandler, Share, StyleSheet, View } from 'react-native';

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
import { ERROR_MESSAGES, battleServerConfigured } from '@/features/battle/client';
import { BattleHud } from '@/features/battle/components/BattleHud';
import { BotBadge } from '@/features/battle/components/BotBadge';
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
import { useLocalBattleSession, type ChallengeRole } from '@/features/battle/useLocalBattleSession';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

/** Con servidor de partidas: ranked entre personas (y bots). Sin servidor: contra bots en el teléfono. */
const useSession = battleServerConfigured ? useBattleSession : useLocalBattleSession;

const CANCEL_MESSAGES: Record<CancelReason, string> = {
  ready_timeout: 'Alguno de los dos no confirmó a tiempo. No se movió el ELO.',
  opponent_left: 'Tu rival se fue antes de empezar. No se movió el ELO.',
  server_error: 'El servidor no pudo empezar la partida. No se movió el ELO.',
  settlement_failed: 'No pudimos guardar el resultado, así que la partida se anuló sin ELO.',
};

export default function BattleScreen() {
  const params = useLocalSearchParams<{ mode?: string; challenge?: string; code?: string }>();
  if (params.challenge === 'host') return <ChallengeBattle challenge={{ role: 'host' }} />;
  if (params.code) {
    return <ChallengeBattle key={params.code} challenge={{ role: 'guest', code: params.code }} />;
  }
  return <MatchBattle mode={params.mode === 'practice' ? 'practice' : 'ranked'} />;
}

interface Session {
  ready: () => void;
  answer: (option: number) => void;
  leave: () => void;
}

/** Ranked (cola o servidor de partidas) y práctica. */
function MatchBattle({ mode }: { mode: BattleMode }) {
  const session = useSession();
  return <BattleView session={session} onStart={(m) => session.start(m ?? mode)} />;
}

/**
 * Desafío a un amigo: siempre por Supabase (también cuando haya servidor de partidas), porque
 * no mueve el ELO. Jugar otra = crear un desafío nuevo.
 */
function ChallengeBattle({ challenge }: { challenge: ChallengeRole }) {
  const session = useLocalBattleSession();
  return (
    <BattleView
      session={session}
      onStart={(_, again) => session.start('ranked', again ? { role: 'host' } : challenge)}
    />
  );
}

function BattleView({
  session,
  onStart,
}: {
  session: Session;
  /** again: el usuario pidió otra partida (no es el arranque al montar). */
  onStart: (mode: BattleMode | undefined, again: boolean) => void;
}) {
  const state = useBattleStore();
  const now = useNow();

  useEffect(() => {
    onStart(undefined, false);
    // Sólo al montar: después el usuario elige "jugar otra" o "practicar".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exit = useCallback(() => {
    const current = useBattleStore.getState();
    if (current.phase === 'playing' && current.mode === 'ranked') {
      Alert.alert(
        '¿Abandonar la partida?',
        current.friendly
          ? 'Abandonar cuenta como derrota en el desafío (no mueve el ELO).'
          : 'Abandonar cuenta como derrota y te baja el ELO.',
        [
          { text: 'Seguir jugando', style: 'cancel' },
          {
            text: 'Abandonar',
            style: 'destructive',
            onPress: () => {
              session.leave();
              leaveScreen();
            },
          },
        ],
      );
      return;
    }
    session.leave();
    leaveScreen();
  }, [session]);

  // Botón atrás de Android: mismo criterio que la X.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      exit();
      return true;
    });
    return () => sub.remove();
  }, [exit]);

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Text variant="overline">
          {state.friendly
            ? 'DESAFÍO · SIN ELO'
            : state.mode === 'practice'
              ? 'PRÁCTICA · SIN ELO'
              : 'RANKED · WORD RUSH'}
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
        onRetry={() => onStart(state.mode, true)}
        onExit={exit}
      />
    </Screen>
  );
}

/** Si se entró por un link de desafío no hay pantalla anterior: vuelve a Ranked. */
function leaveScreen() {
  if (router.canGoBack()) router.back();
  else router.replace('/ranked');
}

interface BodyProps {
  state: BattleState;
  now: number;
  onReady: () => void;
  onAnswer: (option: number) => void;
  onRetry: () => void;
  onExit: () => void;
}

function Body({ state, now, onReady, onAnswer, onRetry, onExit }: BodyProps) {
  const me = state.players.find((p) => p.slot === state.yourSlot);
  const opponent = opponentPlayer(state);

  switch (state.phase) {
    case 'idle':
    case 'connecting':
      return <LoadingState label="Preparando la partida…" />;

    case 'error':
      if (state.friendly && state.errorCode?.startsWith('challenge_')) {
        return (
          <EmptyState
            title="No se pudo entrar al desafío"
            message={ERROR_MESSAGES[state.errorCode]}
            actionLabel="Crear mi propio desafío"
            onAction={onRetry}
          />
        );
      }
      return (
        <ErrorState
          message={ERROR_MESSAGES[state.errorCode ?? 'connection']}
          onRetry={state.errorCode === 'protocol_mismatch' ? undefined : onRetry}
        />
      );

    case 'searching': {
      if (state.challenge) return <ChallengeWaiting code={state.challenge.code} onExit={onExit} />;
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
            <Text variant="caption" align="center">
              Si en unos segundos no aparece nadie, jugás contra un bot de tu nivel (marcado BOT).
              Cuenta para el ELO igual que una partida contra una persona.
            </Text>
          </Card>
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
              avatarPath={me?.avatarPath}
              rating={me?.rating}
              games={me?.gamesPlayed}
            />
            <Swords color={colors.primaryBright} size={32} />
            <PlayerBadge
              username={opponent?.username ?? '…'}
              avatarId={opponent?.avatarId}
              avatarPath={opponent?.avatarPath}
              isBot={opponent?.isBot ?? false}
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
          actionLabel={
            state.friendly
              ? 'Nuevo desafío'
              : state.mode === 'practice'
                ? 'Practicar de nuevo'
                : 'Buscar otra partida'
          }
          onAction={onRetry}
        />
      );
  }
}

/** Quien desafía espera con el código a la vista y lo puede compartir. */
function ChallengeWaiting({ code, onExit }: { code: string; onExit: () => void }) {
  const share = useCallback(() => {
    const link = Linking.createURL(`challenge/${code}`);
    void Share.share({
      message: `¡Te desafío en Polygo! 75 segundos de vocabulario en inglés, vos contra mí. Entrá con el código ${code} (Ranked → Tengo un código) o tocá: ${link}`,
    }).catch(() => {});
  }, [code]);
  return (
    <View style={styles.center}>
      <Card style={styles.searchCard}>
        <UserPlus color={colors.primaryBright} size={40} />
        <Text variant="title" align="center">
          Desafío creado
        </Text>
        <Text color="textMuted" align="center">
          Pasale este código a tu amigo. Cuando entre, la partida empieza sola.
        </Text>
        <Text
          variant="display"
          align="center"
          style={styles.code}
          selectable
          accessibilityLabel={`Código ${code.split('').join(' ')}`}
        >
          {code}
        </Text>
        <Button
          label="Compartir desafío"
          size="lg"
          icon={<Share2 color={colors.onPrimary} size={20} />}
          onPress={share}
        />
        <Text variant="caption" align="center">
          Amistoso: no mueve el ELO. Dejá esta pantalla abierta mientras esperás; el código vence en
          15 minutos.
        </Text>
      </Card>
      <Button label="Cancelar desafío" variant="ghost" onPress={onExit} />
    </View>
  );
}

function PlayerBadge({
  username,
  avatarId,
  avatarPath,
  isBot = false,
  rating,
  games,
}: {
  username: string;
  avatarId: string | undefined;
  avatarPath: string | null | undefined;
  isBot?: boolean;
  rating: number | undefined;
  games: number | undefined;
}) {
  const placement = games === undefined || isInPlacement(games);
  return (
    <View
      style={styles.badge}
      accessible
      accessibilityLabel={`${username}${isBot ? ', bot' : ''}, ${rating ?? ''} ELO`}
    >
      <Avatar avatarId={avatarId} photoUrl={avatarPhotoUrl(avatarPath)} size={64} />
      <Text variant="bodyStrong" numberOfLines={1}>
        {username}
      </Text>
      {isBot ? <BotBadge /> : null}
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
  code: { letterSpacing: 6 },
});
