import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ArcadeAnswer } from '@shared/arcade';
import type { BattleMode } from '@shared/protocol';

import { notifyBattleInvite } from '@/features/friends/push';
import { playSound } from '@/lib/sounds';

import { answerSound } from './answerSound';
import { currentChallenge, verdictSound } from './arcade/arcadeState';

import { connectBattleSocket, connectErrorCode, type BattleSocket } from './client';
import { humanMatchApi } from './humanMatchApi';
import type { ChallengeRole } from './useLocalBattleSession';
import { isInBattle } from './state';
import { useBattleStore } from './store';

/** Cuánto se muestra el acierto/error antes de pasar a la siguiente pregunta. */
export const FEEDBACK_MS = 350;
/** Igual que localMatch.ts: tiempo para leer cómo se escribía la palabra al fallar. */
const WRITE_FEEDBACK_MS = 1_500;
const ACK_TIMEOUT_MS = 5_000;
/** Mientras el anfitrión espera: cada cuánto se mira si el amigo rechazó el desafío. */
const DECLINE_POLL_MS = 3_000;

/**
 * Conecta la pantalla de batalla con el servidor. Un socket por pantalla: al salir se cierra
 * (en plena partida eso cuenta como desconexión y corre la gracia de 15 s).
 */
export function useBattleSession() {
  const socketRef = useRef<BattleSocket | null>(null);
  const dispatch = useBattleStore((s) => s.dispatch);
  const queryClient = useQueryClient();
  /** Desafío propio mientras se espera al amigo (para reanunciarlo al reconectar y anularlo al salir). */
  const hostingRef = useRef<string | null>(null);
  const declinePollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopDeclinePoll = useCallback(() => {
    if (declinePollRef.current) clearTimeout(declinePollRef.current);
    declinePollRef.current = null;
  }, []);

  /** El anfitrión se anuncia en el servidor con su código (también al reconectarse). */
  const host = useCallback(
    (socket: BattleSocket, code: string) => {
      socket
        .timeout(ACK_TIMEOUT_MS)
        .emitWithAck('challenge:host', { code })
        .then((res) => {
          if (!res.ok) {
            hostingRef.current = null;
            dispatch({ type: 'connection_error', code: res.code });
          }
        })
        .catch(() => dispatch({ type: 'connection_error', code: 'connection' }));
    },
    [dispatch],
  );

  /** El amigo entra con el código: el servidor arma la partida (match:found). */
  const joinChallenge = useCallback(
    (socket: BattleSocket, code: string) => {
      socket
        .timeout(ACK_TIMEOUT_MS)
        .emitWithAck('challenge:join', { code })
        .then((res) => {
          if (!res.ok) dispatch({ type: 'connection_error', code: res.code });
        })
        .catch(() => dispatch({ type: 'connection_error', code: 'connection' }));
    },
    [dispatch],
  );

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

    // Caída de red: Socket.IO reconecta solo; la pantalla avisa mientras tanto (la partida no se pausa).
    socket.on('disconnect', () => dispatch({ type: 'socket_status', online: false }));
    socket.on('connect', () => {
      dispatch({ type: 'socket_status', online: true });
      const state = useBattleStore.getState();
      // El servidor saca de la cola (o de la espera del desafío) a quien se desconecta: al volver, se
      // reingresa.
      if (state.phase === 'searching') {
        if (hostingRef.current) host(socket, hostingRef.current);
        else if (!state.challenge) join(socket, 'ranked');
      }
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
      // Llegó el amigo: ya no se espera ni se mira si rechazó.
      hostingRef.current = null;
      stopDeclinePoll();
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
    socket.on('arcade:challenge', (challenge) => dispatch({ type: 'arcade_challenge', challenge }));
    socket.on('battle:score', ({ scores }) => dispatch({ type: 'scores', scores }));
    socket.on('battle:opponent_status', (p) => dispatch({ type: 'opponent_status', ...p }));
    socket.on('battle:finish', (result) => {
      dispatch({ type: 'finished', result });
      // Amistoso: se guardó (historial con ese amigo y misiones de amigos), sin ELO.
      if (result.mode === 'friendly') {
        void queryClient.invalidateQueries({ queryKey: ['friends'] });
        void queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
      // Práctica (sola o contra un bot fuera del cupo): no cambió nada en la base.
      if (result.mode === 'ranked' && result.rating !== 'unrated') {
        // Rating, historial, logros y clasificación cambiaron en el servidor.
        void queryClient.invalidateQueries({ queryKey: ['profile'] });
        void queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        void queryClient.invalidateQueries({ queryKey: ['learning', 'missions'] });
        // Las victorias de hoy y los rangos nuevos pagan Polys.
        void queryClient.invalidateQueries({ queryKey: ['learning', 'polys'] });
        // Y XP (ganar o perder una ranked suma experiencia; lo decide la base).
        void queryClient.invalidateQueries({ queryKey: ['learning', 'xp'] });
      }
    });
    socket.on('battle:cancel', ({ reason }) => dispatch({ type: 'cancelled', reason }));
    socket.on('server:error', ({ code }) => {
      if (code === 'challenge_expired' || code === 'host_gone') {
        hostingRef.current = null;
        stopDeclinePoll();
      }
      dispatch({ type: 'connection_error', code });
    });
    return socket;
  }, [dispatch, join, host, queryClient, stopDeclinePoll]);

  /** Corre `action` con el socket conectado (conecta si hace falta). */
  const withSocket = useCallback(
    (action: (socket: BattleSocket) => void) => {
      const socket = ensureSocket();
      if (socket.connected) action(socket);
      else {
        socket.once('connect', () => action(socket));
        // Tras un rechazo del handshake Socket.IO no reintenta solo.
        if (!socket.active) socket.connect();
      }
    },
    [ensureSocket],
  );

  /**
   * Ranked o práctica: a la cola. Con un desafío a un amigo: la MISMA partida que Ranked, sin ELO. El
   * anfitrión crea el desafío en la base (y avisa al amigo), y espera en el servidor con su código; el
   * amigo entra con ese código.
   */
  const start = useCallback(
    (mode: BattleMode, challenge?: ChallengeRole) => {
      stopDeclinePoll();
      hostingRef.current = null;
      dispatch({
        type: 'connecting',
        mode: challenge ? 'friendly' : mode,
        friendly: Boolean(challenge),
      });
      if (!challenge) return withSocket((socket) => join(socket, mode));
      if (challenge.role === 'guest') {
        return withSocket((socket) => joinChallenge(socket, challenge.code));
      }
      void (async () => {
        try {
          const created = await humanMatchApi.createChallenge(challenge.inviteeId);
          // Desafío dirigido: push al amigo (si falla, igual lo ve en la app abierta).
          if (challenge.inviteeId) notifyBattleInvite(created.code);
          hostingRef.current = created.code;
          dispatch({
            type: 'challenge_waiting',
            code: created.code,
            expiresAt: created.expires_at,
          });
          withSocket((socket) => host(socket, created.code));
          // Si el amigo lo rechaza, se avisa enseguida (la base lo sabe; el servidor no).
          const poll = async () => {
            if (hostingRef.current !== created.code) return;
            try {
              const res = await humanMatchApi.challengeStatus(created.code);
              if (hostingRef.current !== created.code) return;
              if (res.status === 'declined' || res.status === 'expired') {
                hostingRef.current = null;
                void socketRef.current?.emitWithAck('queue:leave').catch(() => {});
                return dispatch({
                  type: 'connection_error',
                  code: res.status === 'declined' ? 'challenge_declined' : 'challenge_expired',
                });
              }
            } catch {
              // Sin red: se vuelve a mirar en la próxima vuelta.
            }
            declinePollRef.current = setTimeout(() => void poll(), DECLINE_POLL_MS);
          };
          declinePollRef.current = setTimeout(() => void poll(), DECLINE_POLL_MS);
        } catch (error) {
          const code = (error as { message?: string } | null)?.message;
          dispatch({
            type: 'connection_error',
            code:
              code === 'match_rate_limited' || code === 'language_unavailable'
                ? code
                : 'connection',
          });
        }
      })();
    },
    [dispatch, host, join, joinChallenge, stopDeclinePoll, withSocket],
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

  /** Pide la foto al servidor y la aplica (tras un rechazo: el servidor manda). */
  const resync = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket
      .timeout(ACK_TIMEOUT_MS)
      .emitWithAck('battle:sync')
      .then((res) => {
        if (res.ok && res.data) {
          dispatch({ type: 'snapshot', snapshot: res.data, receivedAt: Date.now() });
        }
      })
      .catch(() => {});
  }, [dispatch]);

  /**
   * Arcade: qué hizo el jugador en su desafío actual. La pantalla avanza enseguida (Swipe, Audio,
   * Sentence) o espera la pareja (Connect); el veredicto, el combo y los puntos los decide el servidor.
   */
  const arcadeAnswer = useCallback(
    (answer: ArcadeAnswer) => {
      const state = useBattleStore.getState();
      const socket = socketRef.current;
      const arcade = state.arcade;
      if (!socket || !state.battleId || !arcade || state.phase !== 'playing') return;
      const view = currentChallenge(arcade);
      if (!view || view.kind !== answer.kind) return;
      if (answer.kind === 'connect' && arcade.connectPending) return;
      const challengeIndex = view.index;
      dispatch({
        type: 'arcade_submit',
        challengeIndex,
        ...(answer.kind === 'connect'
          ? { pair: [answer.left, answer.right] as [number, number] }
          : {}),
      });
      socket
        .timeout(ACK_TIMEOUT_MS)
        .emitWithAck('arcade:answer', { battleId: state.battleId, challengeIndex, answer })
        .then((res) => {
          if (!res.ok) {
            dispatch({ type: 'arcade_rejected', challengeIndex, kind: answer.kind });
            // Desfasado (p. ej. tras una reconexión): la foto del servidor manda.
            if (res.code === 'stale_question' || res.code === 'invalid_payload') resync();
            return;
          }
          dispatch({ type: 'arcade_result', result: res.data });
          const verdict = useBattleStore.getState().arcade?.verdict;
          const sound = verdict ? verdictSound(verdict) : null;
          if (sound) playSound(sound);
          if (res.data.correct) {
            void Haptics.impactAsync(
              verdict?.tierUp
                ? Haptics.ImpactFeedbackStyle.Heavy
                : Haptics.ImpactFeedbackStyle.Light,
            );
          } else {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
        })
        .catch(() => {
          dispatch({ type: 'arcade_rejected', challengeIndex, kind: answer.kind });
          resync();
        });
    },
    [dispatch, resync],
  );

  /** Salir de la cola o abandonar la partida (antes de empezar cancela; en juego es derrota). */
  const leave = useCallback(() => {
    const socket = socketRef.current;
    const state = useBattleStore.getState();
    // Esperando al amigo: se anula el desafío (ya no puede entrar).
    const hosting = hostingRef.current;
    hostingRef.current = null;
    stopDeclinePoll();
    if (hosting) void humanMatchApi.cancelChallenge(hosting).catch(() => {});
    if (!socket) return;
    if (state.phase === 'searching') void socket.emitWithAck('queue:leave').catch(() => {});
    else if (isInBattle(state)) void socket.emitWithAck('battle:leave').catch(() => {});
  }, [stopDeclinePoll]);

  useEffect(
    () => () => {
      stopDeclinePoll();
      if (hostingRef.current)
        void humanMatchApi.cancelChallenge(hostingRef.current).catch(() => {});
      hostingRef.current = null;
      socketRef.current?.disconnect();
      socketRef.current = null;
      dispatch({ type: 'reset' });
    },
    [dispatch, stopDeclinePoll],
  );

  return { start, ready, answer, arcadeAnswer, leave };
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
