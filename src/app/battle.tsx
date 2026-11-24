import { router, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { Search, Share2, Swords, UserPlus, X } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, Alert, BackHandler, Share, StyleSheet, View } from 'react-native';

import { languageConfig } from '@shared/languages';
import { BOT_CALIBRATION } from '@shared/bots';
import { WORD_RUSH, type BattleMode } from '@shared/protocol';
import { isPlaced } from '@shared/ranking';

import {
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
  useTheme,
} from '@/design-system';
import { rankedDisabled } from '@/features/battle/availability';
import { battleErrorMessage, battleServerConfigured } from '@/features/battle/client';
import { BattleHud } from '@/features/battle/components/BattleHud';
import { BotBadge } from '@/features/battle/components/BotBadge';
import { BattleResult } from '@/features/battle/components/BattleResult';
import { QuestionCard } from '@/features/battle/components/QuestionCard';
import {
  isRated,
  myLine,
  opponentLine,
  opponentPlayer,
  remainingMs,
  type BattleState,
} from '@/features/battle/state';
import { useBattleStore } from '@/features/battle/store';
import { useBattleSession, useNow } from '@/features/battle/useBattleSession';
import { battleStrings, cancelStrings } from '@/features/battle/strings';
import { useLocalBattleSession, type ChallengeRole } from '@/features/battle/useLocalBattleSession';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { SessionLanguageProvider } from '@/features/learning/SessionLanguageProvider';
import { useMyProfile } from '@/features/profile/hooks';
import { useRankLabels } from '@/features/ranked/strings';
import { getStrings, useStrings } from '@/i18n';
import { battleScreenStrings } from '@/i18n/screens/battle';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

function RankedUnavailable({ language }: { language: string }) {
  const t = useStrings(battleScreenStrings);
  return (
    <Screen edges={['top', 'bottom']} scroll={false}>
      <EmptyState
        title={t.noMatchesIn(language)}
        message={t.noMatchesBody}
        actionLabel={t.back}
        onAction={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
    </Screen>
  );
}

/**
 * Esta build no tiene un servidor de partidas válido (EXPO_PUBLIC_BATTLE_SERVER_URL falta o es
 * inválida). En preview/production no se reemplaza por el Ranked legacy: se avisa. Los desafíos con
 * amigos siguen disponibles porque no pasan por el servidor de partidas.
 */
function RankedServerUnavailable() {
  const t = useStrings(battleScreenStrings);
  const title = useStrings(battleStrings).rankedUnavailableTitle;
  return (
    <Screen edges={['top', 'bottom']} scroll={false}>
      <EmptyState
        title={title}
        message={__DEV__ ? t.serverMissingDev : t.serverMissing}
        actionLabel={t.back}
        onAction={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
    </Screen>
  );
}

/**
 * Con servidor de partidas: ranked entre personas (y bots). Sin servidor, sólo en desarrollo: contra
 * bots en el teléfono (Ranked legacy). Si Ranked está deshabilitado, MatchBattle no se monta.
 */
const useSession = battleServerConfigured ? useBattleSession : useLocalBattleSession;

export default function BattleScreen() {
  const params = useLocalSearchParams<{
    mode?: string;
    challenge?: string;
    code?: string;
    /** Desafío dirigido: id y nombre del amigo invitado. */
    friend?: string;
    friendName?: string;
    /** Modo elegido en /challenge-friend (hoy siempre word_rush). */
    game?: string;
  }>();
  const targetLanguage = useMyProfile().data?.profile.target_language;
  // Idiomas sin banco de palabras suficiente: no hay partidas (tampoco desde un link o invitación).
  if (targetLanguage && !languageConfig(targetLanguage).ranked) {
    return <RankedUnavailable language={targetLanguage} />;
  }
  if (params.challenge === 'host') {
    return (
      <ChallengeBattle
        challenge={{ role: 'host', inviteeId: params.friend }}
        inviteeName={params.friend ? params.friendName : undefined}
      />
    );
  }
  if (params.code) {
    return <ChallengeBattle key={params.code} challenge={{ role: 'guest', code: params.code }} />;
  }
  // Ranked y Práctica sin servidor de partidas válido: aviso, nunca el sistema legacy en silencio.
  if (rankedDisabled) return <RankedServerUnavailable />;
  return <MatchBattle mode={params.mode === 'practice' ? 'practice' : 'ranked'} />;
}

interface Session {
  ready: () => void;
  /** Opción elegida o texto escrito (preguntas para escribir). */
  answer: (choice: number | string) => void;
  leave: () => void;
}

/** Ranked (cola o servidor de partidas) y práctica. */
function MatchBattle({ mode }: { mode: BattleMode }) {
  const session = useSession();
  return (
    <BattleView
      session={session}
      onStart={(m) => session.start(m ?? mode)}
      // Práctica contra bots: sólo la ofrece el servidor de partidas (sin cupo de calibración).
      allowBotPractice={battleServerConfigured}
    />
  );
}

/**
 * Desafío a un amigo: siempre por Supabase (también cuando haya servidor de partidas), porque
 * no mueve el ELO. Jugar otra = crear un desafío nuevo.
 */
function ChallengeBattle({
  challenge,
  inviteeName,
}: {
  challenge: ChallengeRole;
  inviteeName?: string;
}) {
  const session = useLocalBattleSession();
  // Otra partida: a quien invitaste lo volvés a invitar; con código, un código nuevo.
  const again: ChallengeRole = challenge.role === 'host' ? challenge : { role: 'host' };
  return (
    <BattleView
      session={session}
      inviteeName={inviteeName}
      onStart={(_, isAgain) => session.start('ranked', isAgain ? again : challenge)}
    />
  );
}

function BattleView({
  session,
  inviteeName,
  onStart,
  allowBotPractice = false,
}: {
  session: Session;
  inviteeName?: string;
  /** again: el usuario pidió otra partida (no es el arranque al montar). */
  onStart: (mode: BattleMode | undefined, again: boolean) => void;
  allowBotPractice?: boolean;
}) {
  useTheme();
  const t = useStrings(battleScreenStrings);
  const state = useBattleStore();
  const now = useNow();

  useEffect(() => {
    onStart(undefined, false);
    // Sólo al montar: después el usuario elige "jugar otra" o "practicar".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exit = useCallback(() => {
    const current = useBattleStore.getState();
    if (current.phase === 'playing' && current.mode === 'ranked' && current.rating !== 'unrated') {
      const s = getStrings(battleScreenStrings);
      Alert.alert(s.leaveTitle, current.friendly ? s.leaveFriendly : s.leaveRanked, [
        { text: s.keepPlaying, style: 'cancel' },
        {
          text: s.forfeit,
          style: 'destructive',
          onPress: () => {
            session.leave();
            leaveScreen();
          },
        },
      ]);
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
        <Text variant="overline">{matchLabel(state, t)}</Text>
        <Button
          label={state.phase === 'playing' ? t.forfeit : t.exit}
          variant="ghost"
          icon={<X color={colors.textMuted} size={18} />}
          onPress={exit}
          accessibilityHint={
            state.phase === 'playing' && isRated(state) ? t.forfeitHint : t.exitHint
          }
        />
      </View>
      <Body
        state={state}
        now={now}
        onReady={session.ready}
        onAnswer={session.answer}
        onRetry={() => onStart(state.mode, true)}
        onBotPractice={allowBotPractice ? () => onStart('bot_practice', true) : undefined}
        onExit={exit}
        inviteeName={inviteeName}
      />
    </Screen>
  );
}

/** Qué tipo de partida es: se ve arriba durante toda la partida. */
function matchLabel(state: BattleState, t: ScreenStrings): string {
  if (state.friendly) return t.labelFriendly;
  if (state.mode === 'practice') return t.labelPractice;
  if (state.mode === 'bot_practice' || state.rating === 'unrated') {
    return t.labelBotPractice;
  }
  if (state.rating === 'calibration' && state.calibration) {
    return t.labelCalibration(state.calibration.used, state.calibration.limit);
  }
  return t.labelRanked;
}

/** Lo que se le explica antes de empezar según si mueve el ELO. */
function ratingNote(state: BattleState, t: ScreenStrings): string | null {
  if (state.friendly || state.mode === 'practice') return null;
  if (state.mode === 'bot_practice' || state.rating === 'unrated') {
    return t.noteBotPractice;
  }
  if (state.rating === 'calibration' && state.calibration) {
    return t.noteCalibration(state.calibration.used, state.calibration.limit);
  }
  if (state.rating === 'competitive') return t.noteCompetitive;
  return null;
}

type ScreenStrings = (typeof battleScreenStrings)['es'];

/** Si se entró por un link de desafío no hay pantalla anterior: vuelve a Ranked. */
function leaveScreen() {
  if (router.canGoBack()) router.back();
  else router.replace('/ranked');
}

interface BodyProps {
  state: BattleState;
  now: number;
  onReady: () => void;
  onAnswer: (choice: number | string) => void;
  onRetry: () => void;
  /** Práctica contra un bot sin ELO (con el servidor de partidas). */
  onBotPractice?: () => void;
  onExit: () => void;
  inviteeName?: string;
}

function Body({
  state,
  now,
  onReady,
  onAnswer,
  onRetry,
  onBotPractice,
  onExit,
  inviteeName,
}: BodyProps) {
  useTheme();
  const t = useStrings(battleScreenStrings);
  const cancelMessages = useStrings(cancelStrings);
  const me = state.players.find((p) => p.slot === state.yourSlot);
  const opponent = opponentPlayer(state);
  const myRating = useMyProfile().data?.rating;

  switch (state.phase) {
    case 'idle':
    case 'connecting':
      return <LoadingState label={t.preparing} />;

    case 'error':
      if (state.friendly && state.errorCode === 'challenge_declined') {
        return (
          <EmptyState
            title={t.declinedTitle(inviteeName)}
            message={battleErrorMessage('challenge_declined')}
            actionLabel={t.back}
            onAction={onExit}
          />
        );
      }
      if (state.friendly && state.errorCode?.startsWith('challenge_')) {
        return (
          <EmptyState
            title={t.challengeFailedTitle}
            message={battleErrorMessage(state.errorCode)}
            actionLabel={t.createOwnChallenge}
            onAction={onRetry}
          />
        );
      }
      return (
        <ErrorState
          message={battleErrorMessage(state.errorCode ?? 'connection')}
          onRetry={state.errorCode === 'protocol_mismatch' ? undefined : onRetry}
        />
      );

    case 'searching': {
      if (state.challenge)
        return (
          <ChallengeWaiting code={state.challenge.code} inviteeName={inviteeName} onExit={onExit} />
        );
      const waited = state.queue?.waitedMs ?? 0;
      const mm = Math.floor(waited / 60_000);
      const ss = String(Math.floor(waited / 1000) % 60).padStart(2, '0');
      // Sin partidas de calibración: el ELO se juega sólo contra personas. Tras un rato sin
      // rival, se ofrece practicar contra un bot (sin ELO), nunca automáticamente.
      const onlyHumans = state.queue?.botCalibrationLeft === 0;
      const offerPractice =
        onBotPractice && onlyHumans && waited >= BOT_CALIBRATION.practiceOfferAfterMs;
      return (
        <View style={styles.center}>
          <Card style={styles.searchCard}>
            <Search color={colors.primaryBright} size={40} />
            <Text variant="title" align="center">
              {t.searching}
            </Text>
            <Text variant="stat" align="center" accessibilityLabel={t.waitingA11y(mm, ss)}>
              {mm}:{ss}
            </Text>
            {onlyHumans ? (
              <Text color="textMuted" align="center">
                {t.onlyHumans}
              </Text>
            ) : null}
          </Card>
          {offerPractice ? (
            <Button label={t.practiceVsBot} variant="secondary" onPress={onBotPractice} />
          ) : null}
          <Button label={t.cancelSearch} variant="ghost" onPress={onExit} />
        </View>
      );
    }

    case 'found': {
      const left = remainingMs(state.readyDeadline, state.clockOffset, now);
      return (
        <View style={styles.center}>
          <Text variant="title" align="center">
            {t.opponentFound}
          </Text>
          <View style={styles.versus}>
            <PlayerBadge
              username={t.you}
              avatarId={me?.avatarId}
              avatarPath={me?.avatarPath}
              frameId={me?.frameId}
              rating={me?.rating}
              placed={myRating ? isPlaced(myRating) : true}
            />
            <Swords color={colors.primaryBright} size={32} />
            <PlayerBadge
              username={opponent?.username ?? '…'}
              avatarId={opponent?.avatarId}
              avatarPath={opponent?.avatarPath}
              frameId={opponent?.frameId}
              isBot={opponent?.isBot ?? false}
              rating={opponent?.rating}
              placed={opponent?.isBot || (opponent?.gamesPlayed ?? 0) > 0}
            />
          </View>
          <Text color="textMuted" align="center">
            {t.rules}
          </Text>
          {ratingNote(state, t) ? (
            <Text variant="bodyStrong" align="center">
              {ratingNote(state, t)}
            </Text>
          ) : null}
          <Button
            label={state.iAmReady ? t.waitingOpponent : t.ready}
            size="lg"
            disabled={state.iAmReady}
            onPress={onReady}
          />
          {left !== null ? (
            <Text variant="caption" align="center">
              {t.confirmIn(Math.ceil(left / 1000))}
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
            <LoadingState label={t.preparing} />
          ) : (
            <Text
              variant="display"
              align="center"
              style={styles.countdown}
              accessibilityLiveRegion="polite"
            >
              {left > 0 ? Math.ceil(left / 1000) : t.go}
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
            <LoadingState label={t.timeUp} />
          ) : state.question ? (
            <SessionLanguageProvider>
              <QuestionCard
                question={state.question}
                feedback={state.feedback}
                streak={state.streak}
                disabled={state.answering}
                onAnswer={onAnswer}
              />
            </SessionLanguageProvider>
          ) : state.feedback || state.answering ? null : (
            <LoadingState label={t.allAnswered} />
          )}
        </View>
      );
    }

    case 'finished':
      return state.result ? (
        <BattleResult result={state.result} onPlayAgain={() => onRetry()} onExit={onExit} />
      ) : null;

    case 'cancelled':
      return (
        <EmptyState
          title={state.cancelReason ? t.cancelledTitle : t.missedEndTitle}
          message={state.cancelReason ? cancelMessages[state.cancelReason] : t.missedEndBody}
          actionLabel={
            state.friendly
              ? t.newChallenge
              : state.mode === 'practice' || state.mode === 'bot_practice'
                ? t.practiceAgain
                : t.findAnother
          }
          onAction={onRetry}
        />
      );
  }
}

/** Quien desafía espera con el código a la vista y lo puede compartir. */
function ChallengeWaiting({
  code,
  inviteeName,
  onExit,
}: {
  code: string;
  inviteeName?: string;
  onExit: () => void;
}) {
  useTheme();
  const t = useStrings(battleScreenStrings);
  const language = languageConfig(useMyProfile().data?.profile.target_language).code;
  const share = useCallback(() => {
    const link = Linking.createURL(`challenge/${code}`);
    void Share.share({
      message: t.shareMessage(code, language, link),
    }).catch(() => {});
  }, [code, language, t]);
  if (inviteeName) {
    return (
      <View style={styles.center}>
        <Card style={styles.searchCard}>
          <ActivityIndicator color={colors.primaryBright} size="large" />
          <Text variant="title" align="center">
            {t.waitingFor(inviteeName)}
          </Text>
          <Text color="textMuted" align="center">
            {t.inviteSent}
          </Text>
          <Text variant="caption" align="center">
            {t.inviteNote}
          </Text>
        </Card>
        <Button label={t.cancelInvite} variant="ghost" onPress={onExit} />
      </View>
    );
  }
  return (
    <View style={styles.center}>
      <Card style={styles.searchCard}>
        <UserPlus color={colors.primaryBright} size={40} />
        <Text variant="title" align="center">
          {t.challengeCreated}
        </Text>
        <Text color="textMuted" align="center">
          {t.passCode}
        </Text>
        <Text
          variant="display"
          align="center"
          style={styles.code}
          selectable
          accessibilityLabel={t.codeA11y(code.split('').join(' '))}
        >
          {code}
        </Text>
        <Button
          label={t.shareChallenge}
          size="lg"
          icon={<Share2 color={colors.onPrimary} size={20} />}
          onPress={share}
        />
        <Text variant="caption" align="center">
          {t.codeNote}
        </Text>
      </Card>
      <Button label={t.cancelChallenge} variant="ghost" onPress={onExit} />
    </View>
  );
}

function PlayerBadge({
  username,
  avatarId,
  avatarPath,
  frameId,
  isBot = false,
  rating,
  placed,
}: {
  username: string;
  avatarId: string | undefined;
  avatarPath: string | null | undefined;
  frameId?: string | null;
  isBot?: boolean;
  rating: number | undefined;
  placed: boolean;
}) {
  const t = useStrings(battleScreenStrings);
  const ranks = useRankLabels();
  return (
    <View
      style={styles.badge}
      accessible
      accessibilityLabel={t.playerA11y(username, isBot, placed ? String(rating ?? '') : null)}
    >
      <FramedAvatar
        avatarId={avatarId}
        photoUrl={avatarPhotoUrl(avatarPath)}
        size={frameId ? 56 : 64}
        frameId={frameId}
      />
      <Text variant="bodyStrong" numberOfLines={1}>
        {username}
      </Text>
      {isBot ? <BotBadge /> : null}
      {rating !== undefined ? (
        <View style={styles.badgeRating}>
          <RankEmblemForRating rating={rating} size={22} dimmed={!placed} />
          <Text variant="caption">{placed ? rating : ranks.unplaced}</Text>
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
