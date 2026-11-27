import {
  ACHIEVEMENT_FAMILIES,
  type AchievementFamilyDef,
  type AchievementTier,
} from '@shared/achievements';
import type { TierId } from '@shared/ranking';
import type { BadgeId } from '@shared/referrals';

import { tierName } from '@/features/ranked/rankNames';
import { defineStrings, useInterfaceLanguage, type InterfaceLanguage } from '@/i18n';

import type { ReportReason } from './api';
import type { MatchResult } from './stats';

// --- Logros. shared/achievements.ts genera la migración del catálogo (en español): no se toca. Para
// la interfaz en inglés se mapea por métrica (familia) y umbral (nivel).

const EN_FAMILY_TITLES: Record<string, string> = {
  best_streak_days: 'On fire',
  goal_days: 'Goal getter',
  lessons_completed: 'Scholar',
  perfect_lessons: 'Perfectionist',
  stars_earned: 'Collector',
  fast_answers: 'Lightning',
  words_seen: 'Explorer',
  words_mastered: 'Elephant memory',
  reviews_completed: 'Reviewer',
  games_played: 'Gladiator',
  wins: 'Champion',
  best_win_streak: 'Unstoppable',
  peak_rating: 'Climber',
};

const s = (n: number, one: string, many: string) => (n === 1 ? one : many);

const EN_TIER_DESCRIPTIONS: Record<string, (n: number, tier: AchievementTier) => string> = {
  best_streak_days: (n) => `Study ${n} days in a row.`,
  goal_days: (n) => `Hit your daily goal on ${n} ${s(n, 'day', 'days')}.`,
  lessons_completed: (n) =>
    n === 1 ? 'Complete your first lesson.' : `Complete ${n} different lessons.`,
  perfect_lessons: (n) =>
    n === 1
      ? 'Finish a lesson with no mistakes (golden lesson).'
      : `Finish ${n} different lessons with no mistakes.`,
  stars_earned: (n) => `Collect ${n} stars on the lesson path.`,
  fast_answers: (n) => `Answer correctly ${n} times in under 2 seconds.`,
  words_seen: (n) => `Study ${n} words.`,
  words_mastered: (n) => `Master ${n} words with spaced reviews.`,
  reviews_completed: (n) => (n === 1 ? 'Complete your first review.' : `Complete ${n} reviews.`),
  games_played: (n) => `Play ${n} ranked matches.`,
  wins: (n) => (n === 1 ? 'Win a ranked match.' : `Win ${n} ranked matches.`),
  best_win_streak: (n) => `Win ${n} ranked matches in a row.`,
  peak_rating: (n, tier) => {
    const id = tier.id.replace(/^peak_/, '') as TierId;
    return `Reach ${tierName(id, 'en') ?? id} (${n} ELO).`;
  },
};

const PT_FAMILY_TITLES: Record<string, string> = {
  best_streak_days: 'Pegando fogo',
  goal_days: 'Focado na meta',
  lessons_completed: 'Erudito',
  perfect_lessons: 'Perfeccionista',
  stars_earned: 'Colecionador',
  fast_answers: 'Relâmpago',
  words_seen: 'Explorador',
  words_mastered: 'Memória de elefante',
  reviews_completed: 'Revisor',
  games_played: 'Gladiador',
  wins: 'Campeão',
  best_win_streak: 'Imparável',
  peak_rating: 'Alpinista',
};

const IT_FAMILY_TITLES: Record<string, string> = {
  best_streak_days: 'In fiamme',
  goal_days: 'Obiettivo centrato',
  lessons_completed: 'Erudito',
  perfect_lessons: 'Perfezionista',
  stars_earned: 'Collezionista',
  fast_answers: 'Fulmine',
  words_seen: 'Esploratore',
  words_mastered: 'Memoria di ferro',
  reviews_completed: 'Ripassatore',
  games_played: 'Gladiatore',
  wins: 'Campione',
  best_win_streak: 'Inarrestabile',
  peak_rating: 'Scalatore',
};

const FAMILY_TITLES: Partial<Record<InterfaceLanguage, Record<string, string>>> = {
  en: EN_FAMILY_TITLES,
  'pt-BR': PT_FAMILY_TITLES,
  it: IT_FAMILY_TITLES,
};

const LEVEL_WORD: Partial<Record<InterfaceLanguage, string>> = {
  en: 'Level',
  'pt-BR': 'Nível',
  it: 'Livello',
};

const PT_TIER_DESCRIPTIONS: Record<string, (n: number, tier: AchievementTier) => string> = {
  best_streak_days: (n) => `Estude ${n} dias seguidos.`,
  goal_days: (n) => `Cumpra sua meta diária em ${n} ${s(n, 'dia', 'dias')}.`,
  lessons_completed: (n) =>
    n === 1 ? 'Complete sua primeira lição.' : `Complete ${n} lições diferentes.`,
  perfect_lessons: (n) =>
    n === 1
      ? 'Termine uma lição sem erros (lição dourada).'
      : `Termine ${n} lições diferentes sem erros.`,
  stars_earned: (n) => `Junte ${n} estrelas na trilha de lições.`,
  fast_answers: (n) => `Responda certo ${n} vezes em menos de 2 segundos.`,
  words_seen: (n) => `Estude ${n} palavras.`,
  words_mastered: (n) => `Domine ${n} palavras com revisões espaçadas.`,
  reviews_completed: (n) =>
    n === 1 ? 'Complete sua primeira revisão.' : `Complete ${n} revisões.`,
  games_played: (n) => `Jogue ${n} partidas ranked.`,
  wins: (n) => (n === 1 ? 'Vença uma partida ranked.' : `Vença ${n} partidas ranked.`),
  best_win_streak: (n) => `Vença ${n} partidas ranked seguidas.`,
  peak_rating: (n, tier) => {
    const id = tier.id.replace(/^peak_/, '') as TierId;
    return `Chegue a ${tierName(id, 'pt-BR') ?? id} (${n} ELO).`;
  },
};

const IT_TIER_DESCRIPTIONS: Record<string, (n: number, tier: AchievementTier) => string> = {
  best_streak_days: (n) => `Studia per ${n} giorni di fila.`,
  goal_days: (n) => `Raggiungi il tuo obiettivo giornaliero per ${n} ${s(n, 'giorno', 'giorni')}.`,
  lessons_completed: (n) =>
    n === 1 ? 'Completa la tua prima lezione.' : `Completa ${n} lezioni diverse.`,
  perfect_lessons: (n) =>
    n === 1
      ? 'Finisci una lezione senza errori (lezione d’oro).'
      : `Finisci ${n} lezioni diverse senza errori.`,
  stars_earned: (n) => `Raccogli ${n} stelle nel percorso delle lezioni.`,
  fast_answers: (n) => `Rispondi correttamente ${n} volte in meno di 2 secondi.`,
  words_seen: (n) => `Studia ${n} parole.`,
  words_mastered: (n) => `Padroneggia ${n} parole con ripassi distanziati.`,
  reviews_completed: (n) => (n === 1 ? 'Completa il tuo primo ripasso.' : `Completa ${n} ripassi.`),
  games_played: (n) => `Gioca ${n} partite ranked.`,
  wins: (n) => (n === 1 ? 'Vinci una partita ranked.' : `Vinci ${n} partite ranked.`),
  best_win_streak: (n) => `Vinci ${n} partite ranked di fila.`,
  peak_rating: (n, tier) => {
    const id = tier.id.replace(/^peak_/, '') as TierId;
    return `Raggiungi ${tierName(id, 'it') ?? id} (${n} ELO).`;
  },
};

type Family = Pick<AchievementFamilyDef, 'metric' | 'title'>;

export const achievementStrings = defineStrings({
  es: {
    familyTitle: (family: Family) => family.title,
    tierDescription: (_family: Family, tier: AchievementTier) => tier.description,
    familyA11y: (title: string, level: number, max: number) => `${title}, nivel ${level} de ${max}`,
    nextA11y: (description: string, value: number, threshold: number) =>
      `Próximo: ${description} Progreso ${value} de ${threshold}.`,
    complete: 'Completo.',
    completeBang: '¡Completo!',
    levelOf: (level: number, max: number) => `Nivel ${level}/${max}`,
    pendingRanked: 'Disponible cuando abra Ranked',
    progressOf: (title: string) => `Progreso de ${title}`,
    ribbon: (level: number) => `NIV ${level}`,
    seeAllA11y: 'Ver todos los logros.',
    loadError: 'No pudimos cargar tus logros.',
    loading: 'Cargando logros…',
  },
  en: {
    familyTitle: (family: Family) => EN_FAMILY_TITLES[family.metric] ?? family.title,
    tierDescription: (family: Family, tier: AchievementTier) =>
      EN_TIER_DESCRIPTIONS[family.metric]?.(tier.threshold, tier) ?? tier.description,
    familyA11y: (title: string, level: number, max: number) => `${title}, level ${level} of ${max}`,
    nextA11y: (description: string, value: number, threshold: number) =>
      `Next: ${description} Progress ${value} of ${threshold}.`,
    complete: 'Complete.',
    completeBang: 'Complete!',
    levelOf: (level: number, max: number) => `Level ${level}/${max}`,
    pendingRanked: 'Available when Ranked opens',
    progressOf: (title: string) => `${title} progress`,
    ribbon: (level: number) => `LVL ${level}`,
    seeAllA11y: 'See all achievements.',
    loadError: 'We couldn’t load your achievements.',
    loading: 'Loading achievements…',
  },
  'pt-BR': {
    familyTitle: (family: Family) => PT_FAMILY_TITLES[family.metric] ?? family.title,
    tierDescription: (family: Family, tier: AchievementTier) =>
      PT_TIER_DESCRIPTIONS[family.metric]?.(tier.threshold, tier) ?? tier.description,
    familyA11y: (title: string, level: number, max: number) => `${title}, nível ${level} de ${max}`,
    nextA11y: (description: string, value: number, threshold: number) =>
      `Próximo: ${description} Progresso ${value} de ${threshold}.`,
    complete: 'Completo.',
    completeBang: 'Completo!',
    levelOf: (level: number, max: number) => `Nível ${level}/${max}`,
    pendingRanked: 'Disponível quando o Ranked abrir',
    progressOf: (title: string) => `Progresso de ${title}`,
    ribbon: (level: number) => `NV ${level}`,
    seeAllA11y: 'Ver todas as conquistas.',
    loadError: 'Não conseguimos carregar suas conquistas.',
    loading: 'Carregando conquistas…',
  },
  it: {
    familyTitle: (family: Family) => IT_FAMILY_TITLES[family.metric] ?? family.title,
    tierDescription: (family: Family, tier: AchievementTier) =>
      IT_TIER_DESCRIPTIONS[family.metric]?.(tier.threshold, tier) ?? tier.description,
    familyA11y: (title: string, level: number, max: number) =>
      `${title}, livello ${level} di ${max}`,
    nextA11y: (description: string, value: number, threshold: number) =>
      `Prossimo: ${description} Progresso ${value} di ${threshold}.`,
    complete: 'Completato.',
    completeBang: 'Completato!',
    levelOf: (level: number, max: number) => `Livello ${level}/${max}`,
    pendingRanked: 'Disponibile quando apre il Ranked',
    progressOf: (title: string) => `Progresso di ${title}`,
    ribbon: (level: number) => `LIV ${level}`,
    seeAllA11y: 'Vedi tutti i traguardi.',
    loadError: 'Non siamo riusciti a caricare i tuoi traguardi.',
    loading: 'Caricamento traguardi…',
  },
});

// --- Insignias de invitaciones (shared/referrals.ts, en español): por id.

const BADGE_NAMES_EN: Record<BadgeId, string> = {
  recruiter: 'Recruiter',
  ambassador: 'PolyGo Ambassador',
  elite_inviter: 'Elite Inviter',
};

const BADGE_NAMES_PT: Record<BadgeId, string> = {
  recruiter: 'Recrutador',
  ambassador: 'Embaixador PolyGo',
  elite_inviter: 'Convidador de elite',
};

const BADGE_NAMES_IT: Record<BadgeId, string> = {
  recruiter: 'Reclutatore',
  ambassador: 'Ambasciatore PolyGo',
  elite_inviter: 'Invitatore d’élite',
};

/** Tarjeta del jugador y tarjeta de rango (ProfileHeader). */
export const headerStrings = defineStrings({
  es: {
    customizeA11y: 'Personalizar avatar, marco y fondo',
    countryA11y: (region: string) => `País: ${region}`,
    editProfile: 'Editar perfil',
    badgeName: (_id: BadgeId, fallback: string) => fallback,
    badgeA11y: (name: string) => `Insignia: ${name}`,
    plusSubscriber: 'Suscriptor PolyGo Plus',
    unplacedA11y: 'Sin posicionar: gana una partida ranked para entrar al ranking',
    rankA11y: (rank: string, rating: number, next: string | null, toNext: number) =>
      `${rank}, liga actual, ${rating} ELO.${next ? ` Faltan ${toNext} ELO para ${next}.` : ''} Ver clasificación`,
    unplaced: 'Sin posicionar',
    winARanked: 'Gana una ranked',
    toNext: (toNext: number, next: string) => `Faltan ${toNext} ELO para ${next}`,
    maxRank: 'Rango máximo',
    rankProgress: 'Progreso al siguiente rango',
  },
  en: {
    customizeA11y: 'Customize avatar, frame and background',
    countryA11y: (region: string) => `Country: ${region}`,
    editProfile: 'Edit profile',
    badgeName: (id: BadgeId, fallback: string) => BADGE_NAMES_EN[id] ?? fallback,
    badgeA11y: (name: string) => `Badge: ${name}`,
    plusSubscriber: 'PolyGo Plus subscriber',
    unplacedA11y: 'Unranked: win a ranked match to join the rankings',
    rankA11y: (rank: string, rating: number, next: string | null, toNext: number) =>
      `${rank}, current league, ${rating} ELO.${next ? ` ${toNext} ELO to ${next}.` : ''} See leaderboard`,
    unplaced: 'Unranked',
    winARanked: 'Win a ranked match',
    toNext: (toNext: number, next: string) => `${toNext} ELO to ${next}`,
    maxRank: 'Top rank',
    rankProgress: 'Progress to next rank',
  },
  'pt-BR': {
    customizeA11y: 'Personalizar avatar, moldura e fundo',
    countryA11y: (region: string) => `País: ${region}`,
    editProfile: 'Editar perfil',
    badgeName: (id: BadgeId, fallback: string) => BADGE_NAMES_PT[id] ?? fallback,
    badgeA11y: (name: string) => `Insígnia: ${name}`,
    plusSubscriber: 'Assinante PolyGo Plus',
    unplacedA11y: 'Sem classificação: vença uma partida ranked para entrar no ranking',
    rankA11y: (rank: string, rating: number, next: string | null, toNext: number) =>
      `${rank}, rank atual, ${rating} ELO.${next ? ` ${toNext === 1 ? 'Falta' : 'Faltam'} ${toNext} ELO para ${next}.` : ''} Ver classificação`,
    unplaced: 'Sem classificação',
    winARanked: 'Vença uma ranked',
    toNext: (toNext: number, next: string) =>
      `${toNext === 1 ? 'Falta' : 'Faltam'} ${toNext} ELO para ${next}`,
    maxRank: 'Rank máximo',
    rankProgress: 'Progresso até o próximo rank',
  },
  it: {
    customizeA11y: 'Personalizza avatar, cornice e sfondo',
    countryA11y: (region: string) => `Paese: ${region}`,
    editProfile: 'Modifica profilo',
    badgeName: (id: BadgeId, fallback: string) => BADGE_NAMES_IT[id] ?? fallback,
    badgeA11y: (name: string) => `Distintivo: ${name}`,
    plusSubscriber: 'Abbonato PolyGo Plus',
    unplacedA11y: 'Non classificato: vinci una partita ranked per entrare in classifica',
    rankA11y: (rank: string, rating: number, next: string | null, toNext: number) =>
      `${rank}, rango attuale, ${rating} ELO.${next ? ` ${toNext === 1 ? 'Manca' : 'Mancano'} ${toNext} ELO per ${next}.` : ''} Vedi classifica`,
    unplaced: 'Non classificato',
    winARanked: 'Vinci una ranked',
    toNext: (toNext: number, next: string) =>
      `${toNext === 1 ? 'Manca' : 'Mancano'} ${toNext} ELO per ${next}`,
    maxRank: 'Rango massimo',
    rankProgress: 'Progresso verso il rango successivo',
  },
});

/** Secciones del perfil propio (ProfileSections). */
export const sectionsStrings = defineStrings({
  es: {
    streak: 'Racha',
    streakA11y: (days: number) => `Racha de ${days} días`,
    settings: 'Ajustes',
    wins: 'Victorias',
    games: 'Partidas',
    winRate: 'Win rate',
    myLanguages: 'Mis idiomas',
    done: 'Listo',
    manage: 'Gestionar',
    previewTitle: 'PREVIEW',
    previewLanguage: 'Cambiar de idioma está deshabilitado en la vista previa de QA.',
    switchErrorTitle: 'No pudimos cambiar el idioma',
    switchErrorMessage: 'Inténtalo de nuevo en un rato.',
    progressError: 'No pudimos cargar tu progreso. Toca para reintentar.',
    loadingLanguages: 'Cargando tus idiomas…',
    languageA11y: (name: string, level: string | null, percent: number, current: boolean) =>
      `${name}${level ? `, nivel ${level}, ${percent} por ciento` : ''}${
        current ? ', idioma actual' : '. Toca para estudiarlo'
      }`,
    studying: 'Estudiando',
    levelProgress: (level: string) => `Progreso de ${level}`,
    achievements: 'Logros',
    achievementsCount: (unlocked: number, total: number) => `Logros (${unlocked}/${total})`,
    seeAll: 'Ver todos',
    reachLevel: (level: number) => `Llegar al nivel ${level}`,
    xpLeft: (xp: number) => `Faltan ${xp} XP`,
    enterRanking: 'Entrar al ranking',
    winARanked: 'Gana una ranked',
    climbTo: (rank: string) => `Subir a ${rank}`,
    eloLeft: (elo: number) => `Faltan ${elo} ELO`,
    nextGoals: 'Próximos objetivos',
    goalA11y: (title: string, detail: string, percent: number) =>
      `${title}. ${detail}. ${percent} por ciento`,
    plusActiveA11y: 'Tu suscripción PolyGo Plus',
    plusLearnA11y: 'Conocer PolyGo Plus',
    plusUntil: (date: string) => `Activo hasta el ${date}.`,
    plusActive: 'Tu suscripción está activa.',
    plusPitch: 'Energía ilimitada, repaso inteligente, widgets personalizados y más.',
  },
  en: {
    streak: 'Streak',
    streakA11y: (days: number) => `${days}-day streak`,
    settings: 'Settings',
    wins: 'Wins',
    games: 'Matches',
    winRate: 'Win rate',
    myLanguages: 'My languages',
    done: 'Done',
    manage: 'Manage',
    previewTitle: 'PREVIEW',
    previewLanguage: 'Switching languages is disabled in the QA preview.',
    switchErrorTitle: 'We couldn’t switch the language',
    switchErrorMessage: 'Try again in a bit.',
    progressError: 'We couldn’t load your progress. Tap to retry.',
    loadingLanguages: 'Loading your languages…',
    languageA11y: (name: string, level: string | null, percent: number, current: boolean) =>
      `${name}${level ? `, level ${level}, ${percent} percent` : ''}${
        current ? ', current language' : '. Tap to study it'
      }`,
    studying: 'Studying',
    levelProgress: (level: string) => `${level} progress`,
    achievements: 'Achievements',
    achievementsCount: (unlocked: number, total: number) => `Achievements (${unlocked}/${total})`,
    seeAll: 'See all',
    reachLevel: (level: number) => `Reach level ${level}`,
    xpLeft: (xp: number) => `${xp} XP to go`,
    enterRanking: 'Join the rankings',
    winARanked: 'Win a ranked match',
    climbTo: (rank: string) => `Climb to ${rank}`,
    eloLeft: (elo: number) => `${elo} ELO to go`,
    nextGoals: 'Next goals',
    goalA11y: (title: string, detail: string, percent: number) =>
      `${title}. ${detail}. ${percent} percent`,
    plusActiveA11y: 'Your PolyGo Plus subscription',
    plusLearnA11y: 'Learn about PolyGo Plus',
    plusUntil: (date: string) => `Active until ${date}.`,
    plusActive: 'Your subscription is active.',
    plusPitch: 'Unlimited energy, smart review, custom widgets and more.',
  },
  'pt-BR': {
    streak: 'Sequência',
    streakA11y: (days: number) => `Sequência de ${days} ${days === 1 ? 'dia' : 'dias'}`,
    settings: 'Configurações',
    wins: 'Vitórias',
    games: 'Partidas',
    winRate: 'Taxa de vitória',
    myLanguages: 'Meus idiomas',
    done: 'Pronto',
    manage: 'Gerenciar',
    previewTitle: 'PREVIEW',
    previewLanguage: 'Trocar de idioma está desativado na prévia de QA.',
    switchErrorTitle: 'Não conseguimos trocar o idioma',
    switchErrorMessage: 'Tente de novo daqui a pouco.',
    progressError: 'Não conseguimos carregar seu progresso. Toque para tentar de novo.',
    loadingLanguages: 'Carregando seus idiomas…',
    languageA11y: (name: string, level: string | null, percent: number, current: boolean) =>
      `${name}${level ? `, nível ${level}, ${percent} por cento` : ''}${
        current ? ', idioma atual' : '. Toque para estudar'
      }`,
    studying: 'Estudando',
    levelProgress: (level: string) => `Progresso do ${level}`,
    achievements: 'Conquistas',
    achievementsCount: (unlocked: number, total: number) => `Conquistas (${unlocked}/${total})`,
    seeAll: 'Ver todas',
    reachLevel: (level: number) => `Chegar ao nível ${level}`,
    xpLeft: (xp: number) => `Faltam ${xp} XP`,
    enterRanking: 'Entrar no ranking',
    winARanked: 'Vença uma ranked',
    climbTo: (rank: string) => `Subir para ${rank}`,
    eloLeft: (elo: number) => `${elo === 1 ? 'Falta' : 'Faltam'} ${elo} ELO`,
    nextGoals: 'Próximos objetivos',
    goalA11y: (title: string, detail: string, percent: number) =>
      `${title}. ${detail}. ${percent} por cento`,
    plusActiveA11y: 'Sua assinatura PolyGo Plus',
    plusLearnA11y: 'Conhecer o PolyGo Plus',
    plusUntil: (date: string) => `Ativo até ${date}.`,
    plusActive: 'Sua assinatura está ativa.',
    plusPitch: 'Energia ilimitada, revisão inteligente, widgets personalizados e mais.',
  },
  it: {
    streak: 'Serie',
    streakA11y: (days: number) => `Serie di ${days} ${days === 1 ? 'giorno' : 'giorni'}`,
    settings: 'Impostazioni',
    wins: 'Vittorie',
    games: 'Partite',
    winRate: 'Win rate',
    myLanguages: 'Le mie lingue',
    done: 'Fatto',
    manage: 'Gestisci',
    previewTitle: 'PREVIEW',
    previewLanguage: 'Il cambio di lingua è disattivato nell’anteprima di QA.',
    switchErrorTitle: 'Non siamo riusciti a cambiare la lingua',
    switchErrorMessage: 'Riprova tra poco.',
    progressError: 'Non siamo riusciti a caricare i tuoi progressi. Tocca per riprovare.',
    loadingLanguages: 'Caricamento delle tue lingue…',
    languageA11y: (name: string, level: string | null, percent: number, current: boolean) =>
      `${name}${level ? `, livello ${level}, ${percent} per cento` : ''}${
        current ? ', lingua attuale' : '. Tocca per studiarla'
      }`,
    studying: 'Stai studiando',
    levelProgress: (level: string) => `Progresso di ${level}`,
    achievements: 'Traguardi',
    achievementsCount: (unlocked: number, total: number) => `Traguardi (${unlocked}/${total})`,
    seeAll: 'Vedi tutti',
    reachLevel: (level: number) => `Raggiungi il livello ${level}`,
    xpLeft: (xp: number) => `Mancano ${xp} XP`,
    enterRanking: 'Entra in classifica',
    winARanked: 'Vinci una ranked',
    climbTo: (rank: string) => `Sali a ${rank}`,
    eloLeft: (elo: number) => `${elo === 1 ? 'Manca' : 'Mancano'} ${elo} ELO`,
    nextGoals: 'Prossimi obiettivi',
    goalA11y: (title: string, detail: string, percent: number) =>
      `${title}. ${detail}. ${percent} per cento`,
    plusActiveA11y: 'Il tuo abbonamento PolyGo Plus',
    plusLearnA11y: 'Scopri PolyGo Plus',
    plusUntil: (date: string) => `Attivo. Scadenza: ${date}.`,
    plusActive: 'Il tuo abbonamento è attivo.',
    plusPitch: 'Energia illimitata, ripasso intelligente, widget personalizzati e altro.',
  },
});

/** Selector de idiomas (LanguagesRow). */
export const languagesRowStrings = defineStrings({
  es: {
    switchErrorTitle: 'No pudimos cambiar el idioma',
    switchErrorMessage: 'Inténtalo de nuevo en un rato.',
    soon: 'Próximamente',
    beta: 'Beta',
    noRanked: 'Sin ranked aún',
    currentSuffix: ', idioma actual',
    hint: 'Cambia el idioma que estudias',
  },
  en: {
    switchErrorTitle: 'We couldn’t switch the language',
    switchErrorMessage: 'Try again in a bit.',
    soon: 'Coming soon',
    beta: 'Beta',
    noRanked: 'No ranked yet',
    currentSuffix: ', current language',
    hint: 'Changes the language you study',
  },
  'pt-BR': {
    switchErrorTitle: 'Não conseguimos trocar o idioma',
    switchErrorMessage: 'Tente de novo daqui a pouco.',
    soon: 'Em breve',
    beta: 'Beta',
    noRanked: 'Sem ranked ainda',
    currentSuffix: ', idioma atual',
    hint: 'Troca o idioma que você estuda',
  },
  it: {
    switchErrorTitle: 'Non siamo riusciti a cambiare la lingua',
    switchErrorMessage: 'Riprova tra poco.',
    soon: 'Prossimamente',
    beta: 'Beta',
    noRanked: 'Ranked non ancora disponibile',
    currentSuffix: ', lingua attuale',
    hint: 'Cambia la lingua che studi',
  },
});

/** Estadísticas por período (ProfileStats). */
export const periodStatsStrings = defineStrings({
  es: {
    period: (days: number | null) => (days === null ? 'Desde siempre' : `Últimos ${days} días`),
    games: 'Partidas',
    wins: 'Victorias',
    elo: 'ELO',
    bestStreak: 'Racha máx.',
    stats: 'Estadísticas',
    periodA11y: (label: string) => `Período: ${label}. Cambiar`,
    loadError: 'No pudimos cargar tus estadísticas.',
    close: 'Cerrar',
    periodCaps: 'PERÍODO',
  },
  en: {
    period: (days: number | null) => (days === null ? 'All time' : `Last ${days} days`),
    games: 'Matches',
    wins: 'Wins',
    elo: 'ELO',
    bestStreak: 'Best streak',
    stats: 'Stats',
    periodA11y: (label: string) => `Period: ${label}. Change`,
    loadError: 'We couldn’t load your stats.',
    close: 'Close',
    periodCaps: 'PERIOD',
  },
  'pt-BR': {
    period: (days: number | null) => (days === null ? 'Desde sempre' : `Últimos ${days} dias`),
    games: 'Partidas',
    wins: 'Vitórias',
    elo: 'ELO',
    bestStreak: 'Melhor sequência',
    stats: 'Estatísticas',
    periodA11y: (label: string) => `Período: ${label}. Alterar`,
    loadError: 'Não conseguimos carregar suas estatísticas.',
    close: 'Fechar',
    periodCaps: 'PERÍODO',
  },
  it: {
    period: (days: number | null) => (days === null ? 'Da sempre' : `Ultimi ${days} giorni`),
    games: 'Partite',
    wins: 'Vittorie',
    elo: 'ELO',
    bestStreak: 'Serie max',
    stats: 'Statistiche',
    periodA11y: (label: string) => `Periodo: ${label}. Cambia`,
    loadError: 'Non siamo riusciti a caricare le tue statistiche.',
    close: 'Chiudi',
    periodCaps: 'PERIODO',
  },
});

const RESULTS_ES: Record<MatchResult, string> = {
  win: 'Victoria',
  loss: 'Derrota',
  draw: 'Empate',
};
const RESULTS_EN: Record<MatchResult, string> = { win: 'Win', loss: 'Loss', draw: 'Draw' };
const RESULTS_PT: Record<MatchResult, string> = { win: 'Vitória', loss: 'Derrota', draw: 'Empate' };
const RESULTS_IT: Record<MatchResult, string> = {
  win: 'Vittoria',
  loss: 'Sconfitta',
  draw: 'Pareggio',
};

/** Historial competitivo, partidas y gráfico de ELO. */
export const historyStrings = defineStrings({
  es: {
    result: (r: MatchResult | null) => (r ? RESULTS_ES[r] : 'Sin resultado'),
    deletedPlayer: 'Jugador eliminado',
    matchA11y: (
      result: string,
      forfeited: boolean,
      opponent: string,
      score: number,
      opponentScore: number,
      delta: string | null,
    ) =>
      `${result}${forfeited ? ' por abandono' : ''} contra ${opponent}, ${score} a ${opponentScore}${delta ? `, ${delta} ELO` : ''}`,
    /** Partida guardada sin ELO (contra un rival de práctica fuera del cupo de calibración). */
    noElo: ' · sin ELO',
    noEloA11y: ', sin ELO',
    eloEvolution: 'EVOLUCIÓN DE ELO',
    evolutionError: 'No pudimos cargar tu evolución.',
    loading: 'Cargando…',
    evolutionEmpty: 'Tu evolución aparece después de tu primera partida ranked.',
    recentMatches: 'ÚLTIMAS PARTIDAS',
    matchesError: 'No pudimos cargar tus partidas.',
    matchesEmpty: 'Todavía no jugaste partidas. Las verás aquí cuando abra Ranked.',
    fullHistory: 'Ver historial completo',
    start: (date: string) => `Inicio · ${date}`,
    chartA11y: (games: number, from: number, to: number, total: string) =>
      `Evolución del ELO en ${games} partidas: de ${from} a ${to}, ${total}.`,
    chartFooter: (games: number, total: string) =>
      `${games} ${games === 1 ? 'partida' : 'partidas'} · ${total} en total · toca el gráfico para ver cada una`,
  },
  en: {
    result: (r: MatchResult | null) => (r ? RESULTS_EN[r] : 'No result'),
    deletedPlayer: 'Deleted player',
    matchA11y: (
      result: string,
      forfeited: boolean,
      opponent: string,
      score: number,
      opponentScore: number,
      delta: string | null,
    ) =>
      `${result}${forfeited ? ' by forfeit' : ''} against ${opponent}, ${score} to ${opponentScore}${delta ? `, ${delta} ELO` : ''}`,
    noElo: ' · no ELO',
    noEloA11y: ', no ELO',
    eloEvolution: 'ELO HISTORY',
    evolutionError: 'We couldn’t load your ELO history.',
    loading: 'Loading…',
    evolutionEmpty: 'Your ELO history shows up after your first ranked match.',
    recentMatches: 'RECENT MATCHES',
    matchesError: 'We couldn’t load your matches.',
    matchesEmpty: 'You haven’t played any matches yet. You’ll see them here once Ranked opens.',
    fullHistory: 'See full history',
    start: (date: string) => `Start · ${date}`,
    chartA11y: (games: number, from: number, to: number, total: string) =>
      `ELO over ${games} matches: from ${from} to ${to}, ${total}.`,
    chartFooter: (games: number, total: string) =>
      `${games} ${games === 1 ? 'match' : 'matches'} · ${total} overall · tap the chart to see each one`,
  },
  'pt-BR': {
    result: (r: MatchResult | null) => (r ? RESULTS_PT[r] : 'Sem resultado'),
    deletedPlayer: 'Jogador excluído',
    matchA11y: (
      result: string,
      forfeited: boolean,
      opponent: string,
      score: number,
      opponentScore: number,
      delta: string | null,
    ) =>
      `${result}${forfeited ? ' por abandono' : ''} contra ${opponent}, ${score} a ${opponentScore}${delta ? `, ${delta} ELO` : ''}`,
    noElo: ' · sem ELO',
    noEloA11y: ', sem ELO',
    eloEvolution: 'EVOLUÇÃO DO ELO',
    evolutionError: 'Não conseguimos carregar sua evolução.',
    loading: 'Carregando…',
    evolutionEmpty: 'Sua evolução aparece depois da sua primeira partida ranked.',
    recentMatches: 'ÚLTIMAS PARTIDAS',
    matchesError: 'Não conseguimos carregar suas partidas.',
    matchesEmpty:
      'Você ainda não jogou nenhuma partida. Elas vão aparecer aqui quando o Ranked abrir.',
    fullHistory: 'Ver histórico completo',
    start: (date: string) => `Início · ${date}`,
    chartA11y: (games: number, from: number, to: number, total: string) =>
      `Evolução do ELO em ${games} ${games === 1 ? 'partida' : 'partidas'}: de ${from} a ${to}, ${total}.`,
    chartFooter: (games: number, total: string) =>
      `${games} ${games === 1 ? 'partida' : 'partidas'} · ${total} no total · toque no gráfico para ver cada uma`,
  },
  it: {
    result: (r: MatchResult | null) => (r ? RESULTS_IT[r] : 'Nessun risultato'),
    deletedPlayer: 'Giocatore eliminato',
    matchA11y: (
      result: string,
      forfeited: boolean,
      opponent: string,
      score: number,
      opponentScore: number,
      delta: string | null,
    ) =>
      `${result}${forfeited ? ' per abbandono' : ''} contro ${opponent}, ${score} a ${opponentScore}${delta ? `, ${delta} ELO` : ''}`,
    noElo: ' · senza ELO',
    noEloA11y: ', senza ELO',
    eloEvolution: 'ANDAMENTO ELO',
    evolutionError: 'Non siamo riusciti a caricare il tuo andamento.',
    loading: 'Caricamento…',
    evolutionEmpty: 'Il tuo andamento compare dopo la tua prima partita ranked.',
    recentMatches: 'ULTIME PARTITE',
    matchesError: 'Non siamo riusciti a caricare le tue partite.',
    matchesEmpty: 'Non hai ancora giocato partite. Le vedrai qui quando aprirà il Ranked.',
    fullHistory: 'Vedi lo storico completo',
    start: (date: string) => `Inizio · ${date}`,
    chartA11y: (games: number, from: number, to: number, total: string) =>
      `Andamento dell’ELO in ${games} ${games === 1 ? 'partita' : 'partite'}: da ${from} a ${to}, ${total}.`,
    chartFooter: (games: number, total: string) =>
      `${games} ${games === 1 ? 'partita' : 'partite'} · ${total} in totale · tocca il grafico per vederle una per una`,
  },
});

const REASONS_ES: Record<ReportReason, string> = {
  sexual: 'Contenido sexual',
  violent: 'Violencia',
  hateful: 'Ofensiva o discriminatoria',
  impersonation: 'Se hace pasar por otra persona',
  other: 'Otro motivo',
};
const REASONS_EN: Record<ReportReason, string> = {
  sexual: 'Sexual content',
  violent: 'Violence',
  hateful: 'Offensive or hateful',
  impersonation: 'Pretending to be someone else',
  other: 'Something else',
};
const REASONS_PT: Record<ReportReason, string> = {
  sexual: 'Conteúdo sexual',
  violent: 'Violência',
  hateful: 'Ofensiva ou discriminatória',
  impersonation: 'Está se passando por outra pessoa',
  other: 'Outro motivo',
};
const REASONS_IT: Record<ReportReason, string> = {
  sexual: 'Contenuti sessuali',
  violent: 'Violenza',
  hateful: 'Offensiva o discriminatoria',
  impersonation: 'Si spaccia per un’altra persona',
  other: 'Altro motivo',
};

/** Reportar la foto de otro jugador (ReportPhotoButton). */
export const reportStrings = defineStrings({
  es: {
    reason: (r: ReportReason) => REASONS_ES[r],
    hidden: 'Gracias por avisar. La foto se ocultó.',
    review: 'Gracias por avisar. Vamos a revisar la foto.',
    triggerA11y: (username: string) => `Reportar la foto de perfil de ${username}`,
    trigger: 'Reportar foto',
    title: 'Reportar foto de perfil',
    body: (username: string) =>
      `¿Por qué no debería verse la foto de @${username}? Tu reporte es anónimo.`,
    send: 'Enviar reporte',
    cancel: 'Cancelar',
  },
  en: {
    reason: (r: ReportReason) => REASONS_EN[r],
    hidden: 'Thanks for letting us know. The photo is now hidden.',
    review: 'Thanks for letting us know. We’ll review the photo.',
    triggerA11y: (username: string) => `Report ${username}’s profile photo`,
    trigger: 'Report photo',
    title: 'Report profile photo',
    body: (username: string) =>
      `Why shouldn’t @${username}’s photo be shown? Your report is anonymous.`,
    send: 'Send report',
    cancel: 'Cancel',
  },
  'pt-BR': {
    reason: (r: ReportReason) => REASONS_PT[r],
    hidden: 'Obrigado por avisar. A foto foi ocultada.',
    review: 'Obrigado por avisar. Vamos analisar a foto.',
    triggerA11y: (username: string) => `Denunciar a foto de perfil de ${username}`,
    trigger: 'Denunciar foto',
    title: 'Denunciar foto de perfil',
    body: (username: string) =>
      `Por que a foto de @${username} não deveria aparecer? Sua denúncia é anônima.`,
    send: 'Enviar denúncia',
    cancel: 'Cancelar',
  },
  it: {
    reason: (r: ReportReason) => REASONS_IT[r],
    hidden: 'Grazie per la segnalazione. La foto è stata nascosta.',
    review: 'Grazie per la segnalazione. Controlleremo la foto.',
    triggerA11y: (username: string) => `Segnala la foto profilo di ${username}`,
    trigger: 'Segnala foto',
    title: 'Segnala foto profilo',
    body: (username: string) =>
      `Perché la foto di @${username} non dovrebbe essere visibile? La tua segnalazione è anonima.`,
    send: 'Invia segnalazione',
    cancel: 'Annulla',
  },
});

/** Subida de la foto de perfil (avatarUpload). */
export const avatarUploadStrings = defineStrings({
  es: { processError: 'No se pudo procesar la imagen.' },
  en: { processError: 'We couldn’t process the image.' },
  'pt-BR': { processError: 'Não foi possível processar a imagem.' },
  it: { processError: 'Non è stato possibile elaborare l’immagine.' },
});

// --- Títulos de logro que llegan del servidor (title_es = «Erudito · Nivel 2»): por id de nivel.

/**
 * «Erudito · Nivel 2» / «Scholar · Level 2» / «Erudito · Nível 2» / «Erudito · Livello 2». Sin
 * coincidencia, el título que mandó el servidor.
 */
export function achievementTitleById(id: string, fallback: string, ui: InterfaceLanguage): string {
  const titles = FAMILY_TITLES[ui];
  const levelWord = LEVEL_WORD[ui];
  if (!titles || !levelWord) return fallback;
  for (const family of ACHIEVEMENT_FAMILIES) {
    const i = family.tiers.findIndex((t) => t.id === id);
    if (i >= 0) return `${titles[family.metric] ?? family.title} · ${levelWord} ${i + 1}`;
  }
  return fallback;
}

/**
 * Título de logro que llega sólo como texto en español («Erudito · Nivel 2», el title_es de
 * shared/achievements.ts `tierTitle`), sin id: p. ej. el feed de amigos. Se reconoce la familia y el
 * nivel y se traduce; si no coincide, queda el texto del servidor.
 */
export function achievementTitleFromEs(title: string, ui: InterfaceLanguage): string {
  if (ui === 'es') return title;
  const match = /^(.*) · Nivel (\d+)$/.exec(title);
  if (!match) return title;
  const family = ACHIEVEMENT_FAMILIES.find((f) => f.title === match[1]);
  const tier = family?.tiers[Number(match[2]) - 1];
  return tier ? achievementTitleById(tier.id, title, ui) : title;
}

export function useAchievementTitle() {
  const ui = useInterfaceLanguage();
  return (id: string, fallback: string) => achievementTitleById(id, fallback, ui);
}
