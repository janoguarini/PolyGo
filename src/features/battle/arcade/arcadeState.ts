import {
  comboMultiplier,
  type ArcadeAnswerResult,
  type ArcadeSnapshot,
  type ChallengeKind,
  type ChallengeView,
} from '@shared/arcade';
import type { SoundEffect } from '@/lib/sounds';

/**
 * Estado arcade de la pantalla (protocolo 3). Es un reflejo del servidor con UNA licencia: al
 * responder Swipe, Audio o Sentence la app pasa al desafío siguiente sin esperar la confirmación (ya
 * lo tiene por adelantado), así no hay espera entre tarjetas. El veredicto, el combo y los puntos
 * llegan con la confirmación del servidor, que es el único que los decide. Connect sí espera cada
 * pareja: la app no sabe cuál es la correcta.
 */
export interface ArcadeVerdict {
  /** Crece con cada veredicto: dispara las animaciones aunque se repita el resultado. */
  id: number;
  challengeIndex: number;
  kind: ChallengeKind;
  correct: boolean;
  points: number;
  multiplier: number;
  frenzy: boolean;
  /** Se cortó un combo de al menos 3. */
  comboBroken: boolean;
  /** Subió de multiplicador con este acierto. */
  tierUp: boolean;
  /** Lo que había que responder (traducción, palabra escuchada, frase). */
  solution?: string;
  tooFast?: boolean;
}

export interface ArcadeClientState {
  /** Desafíos recibidos por índice (el actual y el siguiente; los viejos se descartan). */
  challenges: Record<number, ChallengeView>;
  /** Desafío que ve el jugador. */
  current: number;
  /** Respuestas enviadas sin confirmar (Swipe/Audio/Sentence avanzan antes). */
  pending: number;
  combo: number;
  multiplier: number;
  bestCombo: number;
  /** Instante del servidor en que empieza el Frenesí. */
  frenzyAt: number | null;
  durationMs: number;
  /** Connect: parejas confirmadas del tablero actual [izquierda, derecha]. */
  solved: [number, number][];
  /** Connect: pareja enviada esperando veredicto. */
  connectPending: [number, number] | null;
  /** Connect: última pareja equivocada (para sacudirla). */
  connectWrong: { pair: [number, number]; id: number } | null;
  verdict: ArcadeVerdict | null;
}

export type ArcadeAction =
  | { type: 'arcade_challenge'; challenge: ChallengeView }
  | { type: 'arcade_submit'; challengeIndex: number; pair?: [number, number] }
  | { type: 'arcade_result'; result: ArcadeAnswerResult }
  | { type: 'arcade_rejected'; challengeIndex: number; kind: ChallengeKind };

export function arcadeFromSnapshot(
  previous: ArcadeClientState | null,
  s: ArcadeSnapshot,
): ArcadeClientState {
  const challenges: Record<number, ChallengeView> = {};
  for (const c of s.challenges) challenges[c.index] = c;
  const currentView = challenges[s.current];
  return {
    challenges,
    current: s.current,
    pending: 0,
    combo: s.combo,
    multiplier: comboMultiplier(s.combo),
    bestCombo: s.bestCombo,
    frenzyAt: s.frenzyAt,
    durationMs: s.durationMs,
    solved: currentView?.kind === 'connect' ? currentView.solved.map(([l, r]) => [l, r]) : [],
    connectPending: null,
    connectWrong: null,
    verdict: previous?.verdict ?? null,
  };
}

/** Saca los desafíos que ya pasaron (la ventana es chica: no crece en toda la partida). */
function prune(challenges: Record<number, ChallengeView>, current: number) {
  const kept: Record<number, ChallengeView> = {};
  for (const [key, value] of Object.entries(challenges)) {
    if (Number(key) >= current) kept[Number(key)] = value;
  }
  return kept;
}

export function arcadeReducer(state: ArcadeClientState, action: ArcadeAction): ArcadeClientState {
  switch (action.type) {
    case 'arcade_challenge': {
      if (action.challenge.index < state.current) return state;
      const challenges = { ...state.challenges, [action.challenge.index]: action.challenge };
      const solved =
        action.challenge.index === state.current && action.challenge.kind === 'connect'
          ? action.challenge.solved.map(([l, r]): [number, number] => [l, r])
          : state.solved;
      return { ...state, challenges, solved };
    }

    case 'arcade_submit': {
      if (action.challengeIndex !== state.current) return state;
      const view = state.challenges[state.current];
      if (view?.kind === 'connect') {
        return { ...state, connectPending: action.pair ?? null };
      }
      const current = state.current + 1;
      return {
        ...state,
        current,
        pending: state.pending + 1,
        solved: [],
        challenges: prune(state.challenges, current),
      };
    }

    case 'arcade_result': {
      const r = action.result;
      const previousCombo = state.combo;
      const verdict: ArcadeVerdict = {
        id: (state.verdict?.id ?? 0) + 1,
        challengeIndex: r.challengeIndex,
        kind: r.kind,
        correct: r.correct,
        points: r.points,
        multiplier: r.multiplier,
        frenzy: r.frenzy,
        comboBroken: !r.correct && previousCombo >= 3,
        tierUp: r.correct && comboMultiplier(r.combo) > comboMultiplier(previousCombo),
        ...(r.solution !== undefined ? { solution: r.solution } : {}),
        ...(r.tooFast ? { tooFast: true } : {}),
      };
      const base = {
        ...state,
        combo: r.combo,
        multiplier: comboMultiplier(r.combo),
        bestCombo: Math.max(state.bestCombo, r.combo),
        verdict,
      };
      if (r.kind !== 'connect') {
        return { ...base, pending: Math.max(0, state.pending - 1) };
      }
      // Connect: la app avanza recién con la confirmación.
      if (r.challengeIndex !== state.current) return { ...base, connectPending: null };
      if (r.done) {
        const current = state.current + 1;
        return {
          ...base,
          current,
          solved: [],
          connectPending: null,
          connectWrong: null,
          challenges: prune(state.challenges, current),
        };
      }
      return {
        ...base,
        connectPending: null,
        solved: r.correct && r.pair ? [...state.solved, r.pair] : state.solved,
        connectWrong:
          !r.correct && r.pair
            ? { pair: r.pair, id: (state.connectWrong?.id ?? 0) + 1 }
            : state.connectWrong,
      };
    }

    case 'arcade_rejected':
      if (action.kind === 'connect') return { ...state, connectPending: null };
      return { ...state, pending: Math.max(0, state.pending - 1) };
  }
}

/** Desafío en pantalla, o null si todavía no llegó (sólo con mala conexión). */
export function currentChallenge(state: ArcadeClientState): ChallengeView | null {
  return state.challenges[state.current] ?? null;
}

/** Si el Frenesí está activo según el reloj local corregido con el del servidor. */
export function frenzyActive(
  state: Pick<ArcadeClientState, 'frenzyAt' | 'durationMs'>,
  endsAt: number | null,
  clockOffset: number,
  localNow: number,
): boolean {
  if (state.frenzyAt === null || endsAt === null) return false;
  const serverNow = localNow + clockOffset;
  return serverNow >= state.frenzyAt && serverNow < endsAt;
}

/**
 * Sonido de un veredicto: subir de multiplicador (tono creciente), cortar un combo, fallar o acertar.
 * null = sin sonido.
 */
export function verdictSound(
  v: Pick<ArcadeVerdict, 'correct' | 'comboBroken' | 'tierUp' | 'multiplier'>,
): SoundEffect | null {
  if (v.correct) {
    if (v.tierUp) return v.multiplier >= 4 ? 'streak3' : v.multiplier === 3 ? 'streak2' : 'streak1';
    return 'correct';
  }
  return v.comboBroken ? 'streakLost' : 'incorrect';
}
