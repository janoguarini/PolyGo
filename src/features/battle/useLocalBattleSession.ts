import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef } from 'react';

import { BOT_CONFIG } from '@shared/bots';
import { WORD_RUSH, type BattleMode } from '@shared/protocol';
import { generateQuestions } from '@shared/wordRush';

import { useAuth } from '@/features/auth/AuthProvider';
import { fetchWordPool } from '@/features/learning/api';
import { learningKeys } from '@/features/learning/hooks';
import { useMyProfile } from '@/features/profile/hooks';
import { playSound } from '@/lib/sounds';

import { botMatchApi, botMatchErrorCode } from './botMatchApi';
import { humanMatchApi, openLiveChannel } from './humanMatchApi';
import { LocalMatch } from './localMatch';
import { isInBattle } from './state';
import { useBattleStore } from './store';
import { FEEDBACK_MS } from './useBattleSession';

/** Cada cuánto se consulta la cola mientras se busca rival. */
const QUEUE_POLL_MS = 1_500;

/**
 * Misma interfaz que useBattleSession, pero sin servidor de partidas (MVP con Supabase):
 * ranked busca una persona en la cola de la base y, si en 10 s no aparece, juega contra un bot;
 * la práctica es contra el reloj. La partida corre en el teléfono y la base decide el resultado.
 */
export function useLocalBattleSession() {
  const dispatch = useBattleStore((s) => s.dispatch);
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const profile = useMyProfile().data?.profile;
  const matchRef = useRef<LocalMatch | null>(null);
  const channelRef = useRef<ReturnType<typeof openLiveChannel> | null>(null);
  const searchRef = useRef<{ cancelled: boolean; timer: ReturnType<typeof setTimeout> | null }>(
    null,
  );

  const stopSearch = useCallback(() => {
    if (searchRef.current) {
      searchRef.current.cancelled = true;
      if (searchRef.current.timer) clearTimeout(searchRef.current.timer);
    }
    searchRef.current = null;
  }, []);

  const closeChannel = useCallback(() => {
    channelRef.current?.close();
    channelRef.current = null;
  }, []);

  const start = useCallback(
    (mode: BattleMode) => {
      stopSearch();
      closeChannel();
      matchRef.current?.dispose();
      matchRef.current = null;
      dispatch({ type: 'connecting', mode });

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
          const match = new LocalMatch({
            dispatch,
            api: botMatchApi,
            human: humanMatchApi,
            userId: session?.user.id,
            questions: generateQuestions(
              words.map((w) => ({ id: w.id, text: w.text, translationEs: w.translation_es })),
              WORD_RUSH.questionCount,
              Math.random,
            ),
            me: {
              username: profile.username,
              avatarId: profile.avatar_id,
              avatarPath: profile.avatar_path,
            },
            feedbackMs: FEEDBACK_MS,
            onAnswer: (correct) => {
              playSound(correct ? 'correct' : 'incorrect');
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

          // Cola de personas: si en 10 s no aparece nadie, un bot de tu nivel.
          dispatch({ type: 'joined', mode: 'ranked' });
          const search = { cancelled: false, timer: null as ReturnType<typeof setTimeout> | null };
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
    [closeChannel, dispatch, profile, queryClient, session, stopSearch],
  );

  const ready = useCallback(() => {
    dispatch({ type: 'ready_sent' });
    matchRef.current?.ready();
  }, [dispatch]);

  const answer = useCallback((option: number) => {
    const state = useBattleStore.getState();
    if (!state.question || state.answering || state.feedback) return;
    matchRef.current?.answer(option);
  }, []);

  /** Buscando: sale de la cola. Con el rival ya anunciado, en ranked cuenta como derrota. */
  const leave = useCallback(() => {
    if (searchRef.current) {
      stopSearch();
      void humanMatchApi.leave().catch(() => {});
      return;
    }
    matchRef.current?.leave();
    closeChannel();
  }, [closeChannel, stopSearch]);

  useEffect(
    () => () => {
      if (searchRef.current) {
        stopSearch();
        void humanMatchApi.leave().catch(() => {});
      }
      // Salir de la pantalla en plena partida ranked es abandonar.
      if (isInBattle(useBattleStore.getState())) matchRef.current?.leave();
      matchRef.current?.dispose();
      matchRef.current = null;
      closeChannel();
      dispatch({ type: 'reset' });
    },
    [closeChannel, dispatch, stopSearch],
  );

  return { start, ready, answer, leave };
}
