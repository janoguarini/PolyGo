import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef } from 'react';

import { WORD_RUSH, type BattleMode } from '@shared/protocol';
import { generateQuestions } from '@shared/wordRush';

import { fetchWordPool } from '@/features/learning/api';
import { learningKeys } from '@/features/learning/hooks';
import { useMyProfile } from '@/features/profile/hooks';
import { playSound } from '@/lib/sounds';

import { botMatchApi, botMatchErrorCode } from './botMatchApi';
import { LocalMatch } from './localMatch';
import { isInBattle } from './state';
import { useBattleStore } from './store';
import { FEEDBACK_MS } from './useBattleSession';

/**
 * Misma interfaz que useBattleSession, pero sin servidor de partidas: la partida corre en el
 * teléfono contra un bot (ranked guardado en Supabase) o contra el reloj (práctica).
 */
export function useLocalBattleSession() {
  const dispatch = useBattleStore((s) => s.dispatch);
  const queryClient = useQueryClient();
  const profile = useMyProfile().data?.profile;
  const matchRef = useRef<LocalMatch | null>(null);

  const start = useCallback(
    (mode: BattleMode) => {
      matchRef.current?.dispose();
      matchRef.current = null;
      dispatch({ type: 'connecting', mode });
      void (async () => {
        try {
          if (!profile?.username) throw new Error('onboarding_required');
          const language = profile.target_language;
          const words = await queryClient.fetchQuery({
            queryKey: learningKeys.pool(language),
            queryFn: () => fetchWordPool(language),
            staleTime: 30 * 60_000,
          });
          const questions = generateQuestions(
            words.map((w) => ({ id: w.id, text: w.text, translationEs: w.translation_es })),
            WORD_RUSH.questionCount,
            Math.random,
          );
          const match = new LocalMatch({
            dispatch,
            api: botMatchApi,
            questions,
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
            onRankedFinished: () => {
              // Rating, historial, logros y estadísticas cambiaron en la base.
              void queryClient.invalidateQueries({ queryKey: ['profile'] });
              void queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
            },
          });
          matchRef.current = match;
          await match.begin(mode);
          if (mode === 'ranked') {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        } catch (error) {
          dispatch({ type: 'connection_error', code: botMatchErrorCode(error) });
        }
      })();
    },
    [dispatch, profile, queryClient],
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

  /** Antes de que aparezca el rival no pasa nada; después, en ranked cuenta como derrota. */
  const leave = useCallback(() => {
    matchRef.current?.leave();
  }, []);

  useEffect(
    () => () => {
      // Salir de la pantalla en plena partida ranked es abandonar.
      if (isInBattle(useBattleStore.getState())) matchRef.current?.leave();
      matchRef.current?.dispose();
      matchRef.current = null;
      dispatch({ type: 'reset' });
    },
    [dispatch],
  );

  return { start, ready, answer, leave };
}
