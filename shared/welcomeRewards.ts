/**
 * Recompensa de bienvenida: un calendario de 7 días que cada cuenta completa una sola vez. Se cobra
 * un día por día calendario (en la zona horaria del usuario); faltar no reinicia, sólo pausa.
 *
 * Fuente única de los valores: la base los replica en public.welcome_rewards_config() (migración
 * 20261225120000_welcome_rewards) y src/features/welcomeRewards/__tests__ compara ambos lados.
 * Todo se entrega en el servidor; la app sólo muestra.
 */

export type WelcomeReward =
  | { day: number; kind: 'polys'; polys: number }
  /** Cosmético de la tienda (con arte). Si ya lo tenías, recibís `polys` (su precio) en su lugar. */
  | { day: number; kind: 'item'; item: string; polys: number };

export const WELCOME_REWARDS = [
  { day: 1, kind: 'polys', polys: 20 },
  { day: 2, kind: 'polys', polys: 30 },
  { day: 3, kind: 'polys', polys: 50 },
  { day: 4, kind: 'polys', polys: 40 },
  { day: 5, kind: 'item', item: 'skin-ninja', polys: 250 },
  { day: 6, kind: 'polys', polys: 60 },
  { day: 7, kind: 'item', item: 'frame_elite', polys: 700 },
] as const satisfies readonly WelcomeReward[];

export const WELCOME_DAYS = WELCOME_REWARDS.length;
