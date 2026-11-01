/**
 * Retos semanales de la sección Amigos (lunes a domingo, UTC). La base los replica en
 * `public.friend_weekly_config()` y calcula el progreso con lo que ya guarda;
 * `supabase/tests/friends.test.mjs` compara ambos: cambiar un valor = cambiar los dos.
 */

export type FriendWeeklyChallengeId = 'play_3' | 'review_20' | 'friendly_1';

export interface FriendWeeklyChallenge {
  id: FriendWeeklyChallengeId;
  title: string;
  /** Qué cuenta para el progreso. */
  description: string;
  target: number;
  /** Polys al reclamarlo (una vez por semana). */
  reward: number;
}

export const FRIEND_WEEKLY_CHALLENGES: readonly FriendWeeklyChallenge[] = [
  {
    id: 'play_3',
    title: 'Jugá 3 partidas',
    description: 'Ranked, contra bots o amistosos',
    target: 3,
    reward: 20,
  },
  {
    id: 'review_20',
    title: 'Repasá 20 palabras',
    description: 'Respuestas en sesiones de repaso',
    target: 20,
    reward: 20,
  },
  {
    id: 'friendly_1',
    title: 'Jugá un amistoso con un amigo',
    description: 'Un desafío terminado contra alguien de tu lista',
    target: 1,
    reward: 30,
  },
];

export function friendChallengeById(id: string): FriendWeeklyChallenge | undefined {
  return FRIEND_WEEKLY_CHALLENGES.find((c) => c.id === id);
}

/** Minutos sin latido para dejar de mostrar a alguien "en línea" (= SQL online_window). */
export const ONLINE_WINDOW_MINUTES = 2;
/** Cada cuánto la app avisa que sigue abierta y busca invitaciones a partidas. */
export const PRESENCE_PING_MS = 10_000;
