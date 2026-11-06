import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { BattleMode } from '@shared/protocol';

import { playSound } from '@/lib/sounds';

import { answerSound } from './answerSound';

import { connectBattleSocket, connectErrorCode, type BattleSocket } from './client';
import { isInBattle } from './state';
import { useBattleStore } from './store';

/** Cuánto se muestra el acierto/error antes de pasar a la siguiente pregunta. */
export const FEEDBACK_MS = 350;
/** Igual que localMatch.ts: tiempo para leer cómo se escribía la palabra al fallar. */
const WRITE_FEEDBACK_MS = 1_500;
const ACK_TIMEOUT_MS = 5_000;

/**
 * Conecta la pantalla de batalla con el servidor. Un socket por pantalla: al salir se cierra
 * (en plena partida eso cuenta como desconexión y corre la gracia de 15 s).
 */
export function useBattleSession() {
  const socketRef = useRef<BattleSocket | null>(null);
  const dispatch = useBattleStore((s) => s.dispatch);
  const queryClient = useQueryClient();

  const join = useCallback(
    (socket: BattleSocket, mode: BattleMode) => {
      socket
        .timeout(ACK_TIMEOUT_MS)
        .emitWithAck('queue:join', { mode })
        .then((res) =>
          res.ok
            ? dispatch({ type: 'joined', mode })
            : dispatch({ type: 'connection_error', code: res.code }),
        )
        .catch(() => dispatch({ type: 'connection_error', code: 'connection' }));
    },
    [dispatch],
  );

  const ensureSocket = useCallback((): BattleSocket => {
    if (socketRef.current) return socketRef.current;
    const socket = connectBattleSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      const state = useBattleStore.getState();
      // El servidor saca de la cola a quien se desconecta: al volver, se reingresa.
      if (state.phase === 'searching') join(socket, 'ranked');
      // Si la partida terminó mientras no estábamos, el servidor ya no la tiene.
      if (isInBattle(state)) {
        socket
          .timeout(ACK_TIMEOUT_MS)
          .emitWithAck('battle:sync')
          .then((res) => {
            if (res.ok && res.data) {
              dispatch({ type: 'snapshot', snapshot: res.data, receivedAt: Date.now() });
            } else if (res.ok && isInBattle(useBattleStore.getState())) {
              dispatch({ type: 'lost' });
            }
          })
          .catch(() => {});
      }
    });
    socket.on('connect_error', (error) =>
      dispatch({ type: 'connection_error', code: connectErrorCode(error) }),
    );
    socket.on('queue:status', (p) => dispatch({ type: 'queue_status', ...p }));
    socket.on('match:found', (snapshot) => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch({ type: 'snapshot', snapshot, receivedAt: Date.now() });
    });
    socket.on('battle:start', (snapshot) =>
      dispatch({ type: 'snapshot', snapshot, receivedAt: Date.now() }),
    );
    socket.on('battle:state', (snapshot) =>
      dispatch({ type: 'snapshot', snapshot, receivedAt: Date.now() }),
    );
    socket.on('battle:question', (question) => dispatch({ type: 'question', question }));
    socket.on('battle:score', ({ scores }) => dispatch({ type: 'scores', scores }));
    socket.on('battle:opponent_status', (p) => dispatch({ type: 'opponent_status', ...p }));
    socket.on('battle:finish', (result) => {
      dispatch({ type: 'finished', result });
      // Práctica (sola o contra un bot fuera del cupo): no cambió nada en la base.
      if (result.mode === 'ranked' && result.rating !== 'unrated') {
        // Rating, historial, logros y clasificación cambiaron en el servidor.
        void queryClient.invalidateQueries({ queryKey: ['profile'] });
        void queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        void queryClient.invalidateQueries({ queryKey: ['learning', 'missions'] });
        // Las victorias de hoy y los rangos nuevos pagan Polys.
        void queryClient.invalidateQueries({ queryKey: ['learning', 'polys'] });
      }
    });
    socket.on('battle:cancel', ({ reason }) => dispatch({ type: 'cancelled', reason }));
    socket.on('server:error', ({ code }) => dispatch({ type: 'connection_error', code }));
    return socket;
  }, [dispatch, join, queryClient]);

  const start = useCallback(
    (mode: BattleMode) => {
      dispatch({ type: 'connecting', mode });
      const socket = ensureSocket();
      if (socket.connected) join(socket, mode);
      else {
        socket.once('connect', () => join(socket, mode));
        // Tras un rechazo del handshake Socket.IO no reintenta solo.
        if (!socket.active) socket.connect();
      }
    },
    [dispatch, ensureSocket, join],
  );

  const ready = useCallback(() => {
    const { battleId } = useBattleStore.getState();
    if (!battleId || !socketRef.current) return;
    dispatch({ type: 'ready_sent' });
    void socketRef.current
      .timeout(ACK_TIMEOUT_MS)
      .emitWithAck('match:ready', { battleId })
      .catch(() => {});
  }, [dispatch]);

  /** Opción elegida o, en las preguntas para escribir, el texto: el servidor corrige y puntúa. */
  const answer = useCallback(
    (choice: number | string) => {
      const state = useBattleStore.getState();
      const socket = socketRef.current;
      if (!socket || !state.battleId || !state.question || state.answering || state.feedback)
        return;
      const writing = state.question.kind === 'write';
      if (writing !== (typeof choice === 'string')) return;
      const questionIndex = state.question.index;
      dispatch({ type: 'answer_sent' });
      socket
        .timeout(ACK_TIMEOUT_MS)
        .emitWithAck('battle:answer', {
          battleId: state.battleId,
          questionIndex,
          ...(typeof choice === 'string' ? { text: choice } : { option: choice }),
        })
        .then((res) => {
          if (!res.ok) return dispatch({ type: 'answer_rejected' });
          // En las de escribir no hay opción elegida: se marca la correcta si acertó.
          const chosen =
            typeof choice === 'number' ? choice : res.data.correct ? res.data.correctOption : -1;
          dispatch({ type: 'answer_result', result: res.data, chosen });
          const sound = answerSound(res.data.correct, res.data.streak ?? 0, state.streak);
          if (sound) playSound(sound);
          void Haptics.notificationAsync(
            res.data.correct
              ? Haptics.NotificationFeedbackType.Success
              : Haptics.NotificationFeedbackType.Error,
          );
          // Al fallar una de escribir se muestra un rato cómo se escribía.
          const feedbackMs = writing && !res.data.correct ? WRITE_FEEDBACK_MS : FEEDBACK_MS;
          setTimeout(() => dispatch({ type: 'feedback_done' }), feedbackMs);
        })
        .catch(() => dispatch({ type: 'answer_rejected' }));
    },
    [dispatch],
  );

  /** Salir de la cola o abandonar la partida (antes de empezar cancela; en juego es derrota). */
  const leave = useCallback(() => {
    const socket = socketRef.current;
    const state = useBattleStore.getState();
    if (!socket) return;
    if (state.phase === 'searching') void socket.emitWithAck('queue:leave').catch(() => {});
    else if (isInBattle(state)) void socket.emitWithAck('battle:leave').catch(() => {});
  }, []);

  useEffect(
    () => () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      dispatch({ type: 'reset' });
    },
    [dispatch],
  );

  return { start, ready, answer, leave };
}

/** Reloj local que se actualiza cada `intervalMs` (para cuentas regresivas). */
export function useNow(intervalMs = 250): number {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
