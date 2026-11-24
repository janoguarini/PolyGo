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
});

// --- Insignias de invitaciones (shared/referrals.ts, en español): por id.

const BADGE_NAMES_EN: Record<BadgeId, string> = {
  recruiter: 'Recruiter',
  ambassador: 'PolyGo Ambassador',
  elite_inviter: 'Elite Inviter',
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
    unplacedA11y: 'Sin posicionar: ganá una partida ranked para entrar al ranking',
    rankA11y: (rank: string, rating: number, next: string | null, toNext: number) =>
      `${rank}, liga actual, ${rating} ELO.${next ? ` Faltan ${toNext} ELO para ${next}.` : ''} Ver clasificación`,
    unplaced: 'Sin posicionar',
    winARanked: 'Ganá una ranked',
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
    switchErrorMessage: 'Probá de nuevo en un rato.',
    progressError: 'No pudimos cargar tu progreso. Tocá para reintentar.',
    loadingLanguages: 'Cargando tus idiomas…',
    languageA11y: (name: string, level: string | null, percent: number, current: boolean) =>
      `${name}${level ? `, nivel ${level}, ${percent} por ciento` : ''}${
        current ? ', idioma actual' : '. Tocá para estudiarlo'
      }`,
    studying: 'Estudiando',
    levelProgress: (level: string) => `Progreso de ${level}`,
    achievements: 'Logros',
    achievementsCount: (unlocked: number, total: number) => `Logros (${unlocked}/${total})`,
    seeAll: 'Ver todos',
    reachLevel: (level: number) => `Llegar al nivel ${level}`,
    xpLeft: (xp: number) => `Faltan ${xp} XP`,
    enterRanking: 'Entrar al ranking',
    winARanked: 'Ganá una ranked',
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
});

/** Selector de idiomas (LanguagesRow). */
export const languagesRowStrings = defineStrings({
  es: {
    switchErrorTitle: 'No pudimos cambiar el idioma',
    switchErrorMessage: 'Probá de nuevo en un rato.',
    soon: 'Próximamente',
    beta: 'Beta',
    noRanked: 'Sin ranked aún',
    currentSuffix: ', idioma actual',
    hint: 'Cambia el idioma que estudiás',
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
});

const RESULTS_ES: Record<MatchResult, string> = {
  win: 'Victoria',
  loss: 'Derrota',
  draw: 'Empate',
};
const RESULTS_EN: Record<MatchResult, string> = { win: 'Win', loss: 'Loss', draw: 'Draw' };

/** Historial competitivo, partidas y gráfico de ELO. */
export const historyStrings = defineStrings({
  es: {
    result: (r: MatchResult | null) => (r ? RESULTS_ES[r] : 'Sin resultado'),
    deletedPlayer: 'Jugador eliminado',
    matchA11y: (
      result: string,
      forfeited: boolean,
      opponent: string,
      bot: boolean,
      score: number,
      opponentScore: number,
      delta: string | null,
    ) =>
      `${result}${forfeited ? ' por abandono' : ''} contra ${opponent}${bot ? ' (bot)' : ''}, ${score} a ${opponentScore}${delta ? `, ${delta} ELO` : ''}`,
    practice: ' · práctica',
    eloEvolution: 'EVOLUCIÓN DE ELO',
    evolutionError: 'No pudimos cargar tu evolución.',
    loading: 'Cargando…',
    evolutionEmpty: 'Tu evolución aparece después de tu primera partida ranked.',
    recentMatches: 'ÚLTIMAS PARTIDAS',
    matchesError: 'No pudimos cargar tus partidas.',
    matchesEmpty: 'Todavía no jugaste partidas. Las vas a ver acá cuando abra Ranked.',
    fullHistory: 'Ver historial completo',
    start: (date: string) => `Inicio · ${date}`,
    chartA11y: (games: number, from: number, to: number, total: string) =>
      `Evolución del ELO en ${games} partidas: de ${from} a ${to}, ${total}.`,
    chartFooter: (games: number, total: string) =>
      `${games} ${games === 1 ? 'partida' : 'partidas'} · ${total} en total · tocá el gráfico para ver cada una`,
  },
  en: {
    result: (r: MatchResult | null) => (r ? RESULTS_EN[r] : 'No result'),
    deletedPlayer: 'Deleted player',
    matchA11y: (
      result: string,
      forfeited: boolean,
      opponent: string,
      bot: boolean,
      score: number,
      opponentScore: number,
      delta: string | null,
    ) =>
      `${result}${forfeited ? ' by forfeit' : ''} against ${opponent}${bot ? ' (bot)' : ''}, ${score} to ${opponentScore}${delta ? `, ${delta} ELO` : ''}`,
    practice: ' · practice',
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
});

/** Subida de la foto de perfil (avatarUpload). */
export const avatarUploadStrings = defineStrings({
  es: { processError: 'No se pudo procesar la imagen.' },
  en: { processError: 'We couldn’t process the image.' },
});

// --- Títulos de logro que llegan del servidor (title_es = «Erudito · Nivel 2»): por id de nivel.

/** «Erudito · Nivel 2» / «Scholar · Level 2». Sin coincidencia, el título que mandó el servidor. */
export function achievementTitleById(id: string, fallback: string, ui: InterfaceLanguage): string {
  if (ui === 'es') return fallback;
  for (const family of ACHIEVEMENT_FAMILIES) {
    const i = family.tiers.findIndex((t) => t.id === id);
    if (i >= 0) return `${EN_FAMILY_TITLES[family.metric] ?? family.title} · Level ${i + 1}`;
  }
  return fallback;
}

export function useAchievementTitle() {
  const ui = useInterfaceLanguage();
  return (id: string, fallback: string) => achievementTitleById(id, fallback, ui);
}
