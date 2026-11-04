/**
 * Misiones diarias de la sección Amigos (desde la medianoche del jugador). La base las replica en
 * `public.friend_daily_config()` y calcula el progreso con lo que ya guarda;
 * `supabase/tests/friends.test.mjs` compara ambos: cambiar un valor = cambiar los dos.
 */

export type FriendMissionId = 'play_3' | 'review_20' | 'friendly_1';

export interface FriendDailyMission {
  id: FriendMissionId;
  title: string;
  /** Qué cuenta para el progreso. */
  description: string;
  target: number;
  /** Polys al reclamarla (una vez por día). */
  reward: number;
}

export const FRIEND_DAILY_MISSIONS: readonly FriendDailyMission[] = [
  {
    id: 'play_3',
    title: 'Jugá 3 partidas',
    description: 'Ranked, contra bots o amistosos',
    target: 3,
    reward: 10,
  },
  {
    id: 'review_20',
    title: 'Repasá 20 palabras',
    description: 'Respuestas en sesiones de repaso',
    target: 20,
    reward: 10,
  },
  {
    id: 'friendly_1',
    title: 'Jugá un amistoso',
    description: 'Un desafío terminado contra alguien de tu lista',
    target: 1,
    reward: 15,
  },
];

export function friendChallengeById(id: string): FriendDailyMission | undefined {
  return FRIEND_DAILY_MISSIONS.find((c) => c.id === id);
}

/** Minutos sin latido para dejar de mostrar a alguien "en línea" (= SQL online_window). */
export const ONLINE_WINDOW_MINUTES = 2;
/** Cada cuánto la app avisa que sigue abierta y busca invitaciones a partidas. */
export const PRESENCE_PING_MS = 10_000;
