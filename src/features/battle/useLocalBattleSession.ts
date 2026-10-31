import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef } from 'react';

import { BOT_CONFIG } from '@shared/bots';
import { WORD_RUSH, type BattleMode } from '@shared/protocol';
import {
  generateQuestions,
  pictureEmojis,
  rushPool,
  wordLevel,
  writingEnabled,
  type RushWord,
} from '@shared/wordRush';

import { useAuth } from '@/features/auth/AuthProvider';
import { fetchWordPool } from '@/features/learning/api';
import { learningKeys } from '@/features/learning/hooks';
import { useMyProfile } from '@/features/profile/hooks';
import { playSound } from '@/lib/sounds';

import { answerSound } from './answerSound';
import { botMatchApi, botMatchErrorCode } from './botMatchApi';
import { humanMatchApi, openLiveChannel } from './humanMatchApi';
import { LocalMatch } from './localMatch';
import { isInBattle } from './state';
import { useBattleStore } from './store';
import { FEEDBACK_MS } from './useBattleSession';

/** Cada cuánto se consulta la cola (o el desafío) mientras se busca rival. */
const QUEUE_POLL_MS = 1_500;

/** Desafío a un amigo: quien lo crea espera con un código; el amigo entra con ese código. */
export type ChallengeRole = { role: 'host' } | { role: 'guest'; code: string };

/**
 * Misma interfaz que useBattleSession, pero sin servidor de partidas (MVP con Supabase):
 * ranked busca una persona en la cola de la base y, si en 5 s no aparece, juega contra un bot;
 * la práctica es contra el reloj. La partida corre en el teléfono y la base decide el resultado.
 * Con un desafío, la misma partida entre personas pero con un amigo y sin ELO.
 */
export function useLocalBattleSession() {
  const dispatch = useBattleStore((s) => s.dispatch);
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const me = useMyProfile().data;
  const profile = me?.profile;
  // Las palabras de la partida dependen del rango (rushPool): más difíciles al subir.
  const rating = me?.rating?.rating ?? 0;
  const matchRef = useRef<LocalMatch | null>(null);
  const channelRef = useRef<ReturnType<typeof openLiveChannel> | null>(null);
  const searchRef = useRef<{ cancelled: boolean; timer: ReturnType<typeof setTimeout> | null }>(
    null,
  );
  /** Código del desafío propio mientras se espera al amigo. */
  const challengeRef = useRef<string | null>(null);

  const stopSearch = useCallback(() => {
    if (searchRef.current) {
      searchRef.current.cancelled = true;
      if (searchRef.current.timer) clearTimeout(searchRef.current.timer);
    }
    searchRef.current = null;
  }, []);

  /** Deja de buscar y avisa a la base: sale de la cola o anula el desafío. */
  const abandonSearch = useCallback(() => {
    stopSearch();
    const code = challengeRef.current;
    challengeRef.current = null;
    if (code) void humanMatchApi.cancelChallenge(code).catch(() => {});
    else void humanMatchApi.leave().catch(() => {});
  }, [stopSearch]);

  const closeChannel = useCallback(() => {
    channelRef.current?.close();
    channelRef.current = null;
  }, []);

  const start = useCallback(
    (mode: BattleMode, challenge?: ChallengeRole) => {
      stopSearch();
      challengeRef.current = null;
      closeChannel();
      matchRef.current?.dispose();
      matchRef.current = null;
      dispatch({ type: 'connecting', mode, friendly: Boolean(challenge) });

      const fail = (error: unknown) =>
        dispatch({ type: 'connection_error', code: botMatchErrorCode(error) });

      void (async () => {
        try {
          if (!profile?.username) throw new Error('onboarding_required');
          const language = profile.target_language;
          const words = await queryClient.fetchQuery({
            queryKey: learningKeys.pool(language),
            queryFn: () => fetchWordPool(language),
            staleTime: 30 * 60_000,
          });
          const rushWords: RushWord[] = words.map((w) => ({
            id: w.id,
            text: w.text,
            translationEs: w.translation_es,
            emoji: w.emoji,
            level: wordLevel(w.unit_id),
          }));
          let previousStreak = 0;
          const match = new LocalMatch({
            practiceWriting: writingEnabled(rating),
            dispatch,
            api: botMatchApi,
            human: humanMatchApi,
            userId: session?.user.id,
            questions: generateQuestions(
              rushPool(rushWords, rating),
              WORD_RUSH.questionCount,
              Math.random,
            ),
            pictures: pictureEmojis(rushWords),
            me: {
              username: profile.username,
              avatarId: profile.avatar_id,
              avatarPath: profile.avatar_path,
            },
            feedbackMs: FEEDBACK_MS,
            onAnswer: (correct, streak) => {
              playSound(answerSound(correct, streak, previousStreak));
              previousStreak = streak;
              void Haptics.notificationAsync(
                correct
                  ? Haptics.NotificationFeedbackType.Success
                  : Haptics.NotificationFeedbackType.Error,
              );
            },
            onLineChange: (line) => channelRef.current?.send(line),
            onRankedFinished: () => {
              closeChannel();
              // Rating, historial, logros y estadísticas cambiaron en la base.
              void queryClient.invalidateQueries({ queryKey: ['profile'] });
              void queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
              void queryClient.invalidateQueries({ queryKey: ['learning', 'missions'] });
              // Las victorias de hoy y los rangos nuevos pagan Polys.
              void queryClient.invalidateQueries({ queryKey: ['learning', 'polys'] });
            },
          });
          matchRef.current = match;

          if (mode === 'practice') {
            await match.begin('practice');
            return;
          }

          const found = () =>
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const playHuman = async (battleId: string) => {
            const setup = await humanMatchApi.get(battleId);
            if (matchRef.current !== match) return;
            channelRef.current = openLiveChannel(battleId, setup.your_slot, (line) =>
              match.opponentUpdate(line),
            );
            found();
            match.beginHuman(setup);
          };
          const playBot = async () => {
            await match.begin('ranked');
            found();
          };

          const search = { cancelled: false, timer: null as ReturnType<typeof setTimeout> | null };

          if (challenge?.role === 'guest') {
            const accepted = await humanMatchApi.acceptChallenge(challenge.code);
            return await playHuman(accepted.battle_id);
          }
          if (challenge?.role === 'host') {
            const created = await humanMatchApi.createChallenge();
            if (matchRef.current !== match) {
              void humanMatchApi.cancelChallenge(created.code).catch(() => {});
              return;
            }
            challengeRef.current = created.code;
            searchRef.current = search;
            dispatch({
              type: 'challenge_waiting',
              code: created.code,
              expiresAt: created.expires_at,
            });
            const pollChallenge = async () => {
              if (search.cancelled) return;
              try {
                const res = await humanMatchApi.challengeStatus(created.code);
                if (search.cancelled) return;
                if (res.status === 'matched') {
                  stopSearch();
                  challengeRef.current = null;
                  return await playHuman(res.battle_id);
                }
                if (res.status === 'expired') {
                  stopSearch();
                  challengeRef.current = null;
                  return dispatch({ type: 'connection_error', code: 'challenge_expired' });
                }
              } catch (error) {
                // Un corte de red no anula el desafío: se reintenta en la próxima consulta.
                if (botMatchErrorCode(error) !== 'connection') {
                  stopSearch();
                  challengeRef.current = null;
                  return fail(error);
                }
              }
              search.timer = setTimeout(() => void pollChallenge(), QUEUE_POLL_MS);
            };
            await pollChallenge();
            return;
          }

          // Cola de personas: si en 5 s no aparece nadie, un bot de tu nivel.
          dispatch({ type: 'joined', mode: 'ranked' });
          searchRef.current = search;
          const searchStartedAt = Date.now();
          const poll = async () => {
            if (search.cancelled) return;
            try {
              const res = await humanMatchApi.join();
              if (search.cancelled) return;
              if (res.status === 'matched') {
                stopSearch();
                return await playHuman(res.battle_id);
              }
              dispatch({ type: 'queue_status', window: res.window, waitedMs: res.waited_ms });
              if (Date.now() - searchStartedAt >= BOT_CONFIG.afterMs) {
                stopSearch();
                // Justo pudo haberlo emparejado otra persona: esa partida tiene prioridad.
                const left = await humanMatchApi.leave();
                return left.battle_id ? await playHuman(left.battle_id) : await playBot();
              }
            } catch (error) {
              stopSearch();
              return fail(error);
            }
            search.timer = setTimeout(() => void poll(), QUEUE_POLL_MS);
          };
          await poll();
        } catch (error) {
          fail(error);
        }
      })();
    },
    [closeChannel, dispatch, profile, queryClient, rating, session, stopSearch],
  );

  const ready = useCallback(() => {
    dispatch({ type: 'ready_sent' });
    matchRef.current?.ready();
  }, [dispatch]);

  const answer = useCallback((choice: number | string) => {
    const state = useBattleStore.getState();
    if (!state.question || state.answering || state.feedback) return;
    matchRef.current?.answer(choice);
  }, []);

  /** Buscando: sale de la cola. Con el rival ya anunciado, en ranked cuenta como derrota. */
  const leave = useCallback(() => {
    if (searchRef.current) {
      abandonSearch();
      return;
    }
    matchRef.current?.leave();
    closeChannel();
  }, [abandonSearch, closeChannel]);

  useEffect(
    () => () => {
      if (searchRef.current) abandonSearch();
      // Salir de la pantalla en plena partida ranked es abandonar.
      if (isInBattle(useBattleStore.getState())) matchRef.current?.leave();
      matchRef.current?.dispose();
      matchRef.current = null;
      closeChannel();
      dispatch({ type: 'reset' });
    },
    [abandonSearch, closeChannel, dispatch],
  );

  return { start, ready, answer, leave };
}
