import { defineStrings } from '..';

/** Recompensa de bienvenida (src/app/welcome-rewards.tsx). */
export const welcomeRewardsStrings = defineStrings({
  es: {
    title: 'Recompensa diaria',
    back: 'Volver',
    heroTitle: '¡Tu próxima recompensa te espera!',
    heroSubtitle: (total: number) => `Entra ${total} días y desbloquea premios especiales.`,
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
    legendLocked: (n: number) => `Reclama los ${n} días anteriores`,
    polys: (n: number) => `${n} Polys`,
    claim: 'Reclamar recompensa',
    claimHint: 'Cobra la recompensa de hoy',
    comeBack: 'Vuelve mañana por la siguiente',
    completed: '¡Completaste la semana de bienvenida!',
    got: (label: string) => `¡Ganaste ${label}!`,
    gotRepeated: (polys: number) => `Ya lo tenías: te dimos ${polys} Polys`,
    alreadyClaimed: 'Ya cobraste la recompensa de hoy. ¡Vuelve mañana!',
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
  'pt-BR': {
    title: 'Recompensa diária',
    back: 'Voltar',
    heroTitle: 'Sua próxima recompensa está te esperando!',
    heroSubtitle: (total: number) => `Entre ${total} dias e desbloqueie prêmios especiais.`,
    chestA11y: 'Baú lendário de recompensas',
    calendarTitle: 'Sua semana de prêmios',
    progress: (claimed: number, total: number) => `${claimed}/${total}`,
    day: (n: number) => `Dia ${n}`,
    dayA11y: (n: number, label: string, state: 'claimed' | 'today' | 'locked') =>
      `Dia ${n}: ${label}. ${
        state === 'claimed' ? 'Resgatado' : state === 'today' ? 'Disponível hoje' : 'Bloqueado'
      }`,
    todayTag: 'HOJE',
    claimedTag: 'Resgatado',
    legendTag: 'RECOMPENSA LENDÁRIA',
    legendToday: 'Disponível hoje!',
    legendLocked: (n: number) => `Resgate os ${n} dias anteriores`,
    polys: (n: number) => `${n} Polys`,
    claim: 'Resgatar recompensa',
    claimHint: 'Resgata a recompensa de hoje',
    comeBack: 'Volte amanhã para pegar a próxima',
    completed: 'Você completou a semana de boas-vindas!',
    got: (label: string) => `Você ganhou ${label}!`,
    gotRepeated: (polys: number) => `Você já tinha: te demos ${polys} Polys`,
    alreadyClaimed: 'Você já resgatou a recompensa de hoje. Volte amanhã!',
    loadError: 'Não conseguimos carregar suas recompensas.',
  },
  it: {
    title: 'Ricompensa giornaliera',
    back: 'Indietro',
    heroTitle: 'La tua prossima ricompensa ti aspetta!',
    heroSubtitle: (total: number) => `Entra per ${total} giorni e sblocca premi speciali.`,
    chestA11y: 'Forziere leggendario delle ricompense',
    calendarTitle: 'La tua settimana di premi',
    progress: (claimed: number, total: number) => `${claimed}/${total}`,
    day: (n: number) => `Giorno ${n}`,
    dayA11y: (n: number, label: string, state: 'claimed' | 'today' | 'locked') =>
      `Giorno ${n}: ${label}. ${
        state === 'claimed' ? 'Riscattato' : state === 'today' ? 'Disponibile oggi' : 'Bloccato'
      }`,
    todayTag: 'OGGI',
    claimedTag: 'Riscattato',
    legendTag: 'RICOMPENSA LEGGENDARIA',
    legendToday: 'Disponibile oggi!',
    legendLocked: (n: number) => `Riscatta i ${n} giorni precedenti`,
    polys: (n: number) => `${n} Polys`,
    claim: 'Riscatta ricompensa',
    claimHint: 'Riscatta la ricompensa di oggi',
    comeBack: 'Torna domani per la prossima',
    completed: 'Hai completato la settimana di benvenuto!',
    got: (label: string) => `Hai ottenuto ${label}!`,
    gotRepeated: (polys: number) => `Ce l’avevi già: ti abbiamo dato ${polys} Polys`,
    alreadyClaimed: 'Hai già riscattato la ricompensa di oggi. Torna domani!',
    loadError: 'Non siamo riusciti a caricare le tue ricompense.',
  },
  fr: {
    title: 'Récompense du jour',
    back: 'Retour',
    heroTitle: 'Ta prochaine récompense t’attend !',
    heroSubtitle: (total: number) => `Connecte-toi ${total} jours et débloque des prix spéciaux.`,
    chestA11y: 'Coffre légendaire de récompenses',
    calendarTitle: 'Ta semaine de cadeaux',
    progress: (claimed: number, total: number) => `${claimed}/${total}`,
    day: (n: number) => `Jour ${n}`,
    dayA11y: (n: number, label: string, state: 'claimed' | 'today' | 'locked') =>
      `Jour ${n} : ${label}. ${
        state === 'claimed'
          ? 'Récupérée'
          : state === 'today'
            ? 'Disponible aujourd’hui'
            : 'Verrouillée'
      }`,
    todayTag: 'AUJOURD’HUI',
    claimedTag: 'Récupérée',
    legendTag: 'RÉCOMPENSE LÉGENDAIRE',
    legendToday: 'Disponible aujourd’hui !',
    legendLocked: (n: number) => `Récupère les ${n} jours précédents`,
    polys: (n: number) => `${n} Polys`,
    claim: 'Récupérer la récompense',
    claimHint: 'Récupère la récompense du jour',
    comeBack: 'Reviens demain pour la suivante',
    completed: 'Tu as terminé la semaine de bienvenue !',
    got: (label: string) => `Tu as gagné ${label} !`,
    gotRepeated: (polys: number) => `Tu l’avais déjà : voici ${polys} Polys`,
    alreadyClaimed: 'Tu as déjà récupéré la récompense du jour. Reviens demain !',
    loadError: 'Impossible de charger tes récompenses.',
  },
});
