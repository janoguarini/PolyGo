import { router, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { Search, Share2, Swords, UserPlus, X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Pressable,
  Share,
  StyleSheet,
  Text as RNText,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ArcadeAnswer } from '@shared/arcade';

import { languageConfig } from '@shared/languages';
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
import { ArcadeLobby } from '@/features/battle/arcade/ArcadeLobby';
import { ArcadeSearching } from '@/features/battle/arcade/ArcadeSearching';
import { ArcadeStage } from '@/features/battle/arcade/ArcadeStage';
import { arcade, arcadeText } from '@/features/battle/arcade/theme';
import { battleGivesXp, isRankedSearch, matchLabel, ratingNote } from '@/features/battle/labels';
import { rankedDisabled } from '@/features/battle/availability';
import { battleErrorMessage, battleServerConfigured } from '@/features/battle/client';
import { playerLook } from '@/features/battle/rivalLook';
import { BattleHud } from '@/features/battle/components/BattleHud';
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
import { useXp, type XpState } from '@/features/xp/api';
import { XpRewardCard } from '@/features/xp/XpRewardCard';
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
  /** Opción elegida o texto escrito (formato clásico de 75 s: desafíos con amigos). */
  answer: (choice: number | string) => void;
  /** Word Rush (motor interno Arcade, sólo con el servidor de partidas). */
  arcadeAnswer?: (answer: ArcadeAnswer) => void;
  leave: () => void;
}

/**
 * Ranked y práctica: Word Rush con el servidor de partidas. Si no aparece una persona, el servidor pone
 * un bot de tu nivel a los pocos segundos (con o sin ELO según el cupo de calibración).
 */
function MatchBattle({ mode }: { mode: BattleMode }) {
  const session = useSession();
  return (
    <BattleView
      session={session}
      rankedRoute={mode === 'ranked'}
      onStart={(m) => session.start(m ?? mode)}
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
  rankedRoute = false,
  onStart,
}: {
  session: Session;
  inviteeName?: string;
  /** Se entró a buscar partida Ranked: desde el primer instante se ve «Buscando rival». */
  rankedRoute?: boolean;
  /** again: el usuario pidió otra partida (no es el arranque al montar). */
  onStart: (mode: BattleMode | undefined, again: boolean) => void;
}) {
  useTheme();
  const t = useStrings(battleScreenStrings);
  const state = useBattleStore();
  const now = useNow();
  const myProfile = useMyProfile().data?.profile;
  // XP de antes de cada partida (para mostrar cuánto se ganó en el resultado). Se toma mientras se
  // juega; el servidor la acredita al liquidar.
  const xp = useXp();
  const [xpBefore, setXpBefore] = useState<{ battleId: string; xp: XpState | null } | null>(null);
  if (
    state.battleId &&
    state.phase !== 'finished' &&
    xp.data !== undefined &&
    xpBefore?.battleId !== state.battleId
  ) {
    setXpBefore({ battleId: state.battleId, xp: xp.data });
  }

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

  // Word Rush: desde el rival encontrado hasta el «¡Tiempo!», pantalla completa oscura (la misma
  // identidad que el juego, sin saltos de tema). La práctica sola entra directo a la cuenta regresiva.
  const inGame =
    state.phase === 'found' || state.phase === 'countdown' || state.phase === 'playing';
  // La búsqueda de Ranked también va con la identidad oscura (ArcadeSearching), y desde el primer
  // instante: mientras conecta y entra a la cola ya se ve «Buscando rival» (sin «Preparando…»).
  const rankedSearch = isRankedSearch(state, rankedRoute);
  const wordRushShell =
    session.arcadeAnswer !== undefined &&
    !state.friendly &&
    ((inGame && (state.arcade !== null || state.phase === 'countdown')) || rankedSearch);
  if (wordRushShell && session.arcadeAnswer) {
    return (
      <View style={styles.arcadeRoot}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.arcadeSafe}>
          <View style={styles.topBar}>
            <RNText style={arcadeText.label}>{matchLabel(state, t)}</RNText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={state.phase === 'playing' ? t.forfeit : t.exit}
              accessibilityHint={
                state.phase === 'playing' && isRated(state) ? t.forfeitHint : t.exitHint
              }
              onPress={exit}
              hitSlop={12}
              style={styles.arcadeExit}
            >
              <X color={arcade.muted} size={20} />
            </Pressable>
          </View>
          {rankedSearch ? (
            <ArcadeSearching waitedMs={state.queue?.waitedMs ?? 0} onCancel={exit} />
          ) : state.phase === 'playing' && state.arcade ? (
            <ArcadeStage state={state} now={now} onAnswer={session.arcadeAnswer} />
          ) : state.arcade ? (
            <ArcadeLobby
              state={state}
              now={now}
              onReady={session.ready}
              myLook={{
                avatarId: myProfile?.avatar_id,
                frameId: myProfile?.frame_id,
                backgroundId: myProfile?.background_id,
              }}
            />
          ) : (
            <View style={styles.arcadeLoading}>
              <ActivityIndicator color={arcade.violetGlow} />
              <RNText style={arcadeText.label}>{t.preparing}</RNText>
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }

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
        onExit={exit}
        inviteeName={inviteeName}
        xpBefore={xpBefore}
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
  onAnswer: (choice: number | string) => void;
  onRetry: () => void;
  onExit: () => void;
  inviteeName?: string;
  /** XP de antes de la partida (de qué partida es: battleId). */
  xpBefore?: { battleId: string; xp: XpState | null } | null;
}

function Body({
  state,
  now,
  onReady,
  onAnswer,
  onRetry,
  onExit,
  inviteeName,
  xpBefore,
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
      // Primero una persona de tu nivel; si no aparece, el servidor pone un bot a los pocos segundos
      // (sin ELO si ya usaste las partidas de calibración). No hay que elegir nada.
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
            <Text color="textMuted" align="center">
              {t.searchingSub(null)}
            </Text>
          </Card>
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
              avatarId={playerLook(opponent).avatarId ?? undefined}
              avatarPath={opponent?.avatarPath}
              frameId={playerLook(opponent).frameId}
              rating={opponent?.rating}
              placed={opponent?.isBot || (opponent?.gamesPlayed ?? 0) > 0}
            />
          </View>
          {/* Formato clásico de 75 s (desafíos con amigos): Word Rush se presenta en ArcadeLobby. */}
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
        <BattleResult
          result={state.result}
          onPlayAgain={() => onRetry()}
          onExit={onExit}
          reward={
            // Sólo las ranked con ELO dan XP (ganar o perder); el resultado ya llega liquidado.
            battleGivesXp(state.result) ? (
              <XpRewardCard
                before={xpBefore?.battleId === state.result.battleId ? xpBefore.xp : undefined}
                saved
              />
            ) : null
          }
        />
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
  rating,
  placed,
}: {
  username: string;
  avatarId: string | undefined;
  avatarPath: string | null | undefined;
  frameId?: string | null;
  rating: number | undefined;
  placed: boolean;
}) {
  const t = useStrings(battleScreenStrings);
  const ranks = useRankLabels();
  return (
    <View
      style={styles.badge}
      accessible
      accessibilityLabel={t.playerA11y(username, placed ? String(rating ?? '') : null)}
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
  arcadeRoot: { flex: 1, backgroundColor: arcade.bg },
  arcadeSafe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  arcadeLoading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  arcadeExit: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: arcade.card,
  },
});
