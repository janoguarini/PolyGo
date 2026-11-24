import { defineStrings } from '..';

/** Recompensa de bienvenida (src/app/welcome-rewards.tsx). */
export const welcomeRewardsStrings = defineStrings({
  es: {
    title: 'Recompensa diaria',
    back: 'Volver',
    intro: (total: number) => `Entrá ${total} días a PolyGo\ny conseguí una recompensa especial`,
    day: (n: number) => `Día ${n}`,
    dayA11y: (n: number, label: string, state: 'claimed' | 'today' | 'locked') =>
      `Día ${n}: ${label}. ${
        state === 'claimed' ? 'Cobrado' : state === 'today' ? 'Disponible hoy' : 'Bloqueado'
      }`,
    polys: (n: number) => `${n} Polys`,
    claim: 'Reclamar recompensa',
    comeBack: 'Volvé mañana por la siguiente',
    completed: '¡Completaste la semana de bienvenida!',
    got: (label: string) => `¡Ganaste ${label}!`,
    gotRepeated: (polys: number) => `Ya lo tenías: te dimos ${polys} Polys`,
    alreadyClaimed: 'Ya cobraste la recompensa de hoy. ¡Volvé mañana!',
    loadError: 'No pudimos cargar tus recompensas.',
  },
  en: {
    title: 'Daily reward',
    back: 'Back',
    intro: (total: number) => `Open PolyGo ${total} days\nand get a special reward`,
    day: (n: number) => `Day ${n}`,
    dayA11y: (n: number, label: string, state: 'claimed' | 'today' | 'locked') =>
      `Day ${n}: ${label}. ${
        state === 'claimed' ? 'Claimed' : state === 'today' ? 'Available today' : 'Locked'
      }`,
    polys: (n: number) => `${n} Polys`,
    claim: 'Claim reward',
    comeBack: 'Come back tomorrow for the next one',
    completed: 'You completed the welcome week!',
    got: (label: string) => `You got ${label}!`,
    gotRepeated: (polys: number) => `You already had it, so here are ${polys} Polys`,
    alreadyClaimed: 'You already claimed today’s reward. Come back tomorrow!',
    loadError: 'We couldn’t load your rewards.',
  },
});
