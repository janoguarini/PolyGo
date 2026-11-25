import { defineStrings } from '..';

/** Recompensa de bienvenida (src/app/welcome-rewards.tsx). */
export const welcomeRewardsStrings = defineStrings({
  es: {
    title: 'Recompensa diaria',
    back: 'Volver',
    heroTitle: '¡Tu próxima recompensa te espera!',
    heroSubtitle: (total: number) => `Entrá ${total} días y desbloqueá premios especiales.`,
    chestA11y: 'Cofre legendario de recompensas',
    calendarTitle: 'Tu semana de premios',
    progress: (claimed: number, total: number) => `${claimed}/${total}`,
    day: (n: number) => `Día ${n}`,
    dayA11y: (n: number, label: string, state: 'claimed' | 'today' | 'locked') =>
      `Día ${n}: ${label}. ${
        state === 'claimed' ? 'Cobrado' : state === 'today' ? 'Disponible hoy' : 'Bloqueado'
      }`,
    todayTag: 'HOY',
    claimedTag: 'Cobrado',
    legendTag: 'RECOMPENSA LEGENDARIA',
    legendToday: '¡Disponible hoy!',
    legendLocked: (n: number) => `Cobrá los ${n} días anteriores`,
    polys: (n: number) => `${n} Polys`,
    claim: 'Reclamar recompensa',
    claimHint: 'Cobra la recompensa de hoy',
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
    heroTitle: 'Your next reward awaits!',
    heroSubtitle: (total: number) => `Open PolyGo ${total} days and unlock special prizes.`,
    chestA11y: 'Legendary reward chest',
    calendarTitle: 'Your week of prizes',
    progress: (claimed: number, total: number) => `${claimed}/${total}`,
    day: (n: number) => `Day ${n}`,
    dayA11y: (n: number, label: string, state: 'claimed' | 'today' | 'locked') =>
      `Day ${n}: ${label}. ${
        state === 'claimed' ? 'Claimed' : state === 'today' ? 'Available today' : 'Locked'
      }`,
    todayTag: 'TODAY',
    claimedTag: 'Claimed',
    legendTag: 'LEGENDARY REWARD',
    legendToday: 'Available today!',
    legendLocked: (n: number) => `Claim the previous ${n} days`,
    polys: (n: number) => `${n} Polys`,
    claim: 'Claim reward',
    claimHint: 'Claims today’s reward',
    comeBack: 'Come back tomorrow for the next one',
    completed: 'You completed the welcome week!',
    got: (label: string) => `You got ${label}!`,
    gotRepeated: (polys: number) => `You already had it, so here are ${polys} Polys`,
    alreadyClaimed: 'You already claimed today’s reward. Come back tomorrow!',
    loadError: 'We couldn’t load your rewards.',
  },
});
