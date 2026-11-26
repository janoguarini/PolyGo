import type { MemoryLevel } from '@shared/smartOverview';
import type { SmartReason } from '@shared/focusReview';

import { defineStrings } from '..';

/** Repaso inteligente: presentación de la sesión (src/app/smart-review.tsx). Poco texto, todo real. */
export const smartReviewStrings = defineStrings({
  es: {
    title: 'Repaso inteligente',
    back: 'Volver',
    plus: 'Plus',
    yourMemory: 'Tu memoria',
    groups: {
      mastered: 'Dominadas',
      due: 'Para repasar hoy',
      struggling: 'Te cuestan',
    },
    groupsHint: {
      mastered: 'Las sabés',
      due: 'Que no se olviden',
      struggling: 'Te equivocás seguido',
    },
    ofTotal: (total: number) => `/${total}`,
    masteredCaption: 'dominadas',
    groupsA11y: (m: number, d: number, s: number, total: number) =>
      `De ${total} palabras: ${m} dominadas, ${d} para repasar hoy y ${s} te cuestan`,
    memoryLevel: {
      strong: 'Excelente',
      good: 'Buen progreso',
      building: 'En camino',
      weak: 'Necesita repaso',
    } satisfies Record<MemoryLevel, string>,
    memoryA11y: (p: number, level: string) => `Tu memoria: ${p}%, ${level}`,
    toReinforce: (n: number): string =>
      n === 1 ? 'palabra para reforzar' : 'palabras para reforzar',
    topicsToImprove: (n: number): string => (n === 1 ? 'tema a mejorar' : 'temas a mejorar'),
    todaySession: 'Tu sesión de hoy',
    minutes: (low: number, high: number) => (low === high ? `~${low} min` : `${low}–${high} min`),
    exercises: (n: number) => `${n} ${n === 1 ? 'ejercicio' : 'ejercicios'}`,
    reason: {
      due: 'Vencidas',
      frequent_mistakes: 'Errores',
      difficult: 'Difíciles',
      due_soon: 'Por olvidar',
    } satisfies Record<SmartReason, string>,
    reasonA11y: (label: string, n: number) => `${label}: ${n} ${n === 1 ? 'palabra' : 'palabras'}`,
    wordsToday: 'Tus palabras de hoy',
    moreLocked: (n: number) => `+${n}`,
    lockedA11y: (n: number) => `${n} palabras más, con PolyGo Plus`,
    start: 'Empezar repaso',
    startSub: 'Hecho con tus errores reales',
    unlock: 'Desbloquear repaso inteligente',
    unlockSub: 'Con PolyGo Plus · cancelá cuando quieras',
    emptyTitle: 'Nada para reforzar por ahora',
    emptyBody: 'Cuando te equivoques o una palabra esté por olvidarse, aparece acá.',
    loadError: 'No pudimos cargar tu repaso.',
    alsoInPlus: 'También incluye PolyGo Plus',
    perkCoach: 'Coach ilimitado',
    perkEnergy: 'Energía ilimitada',
    perkAds: 'Sin anuncios',
    freeReview: (n: number) =>
      n === 1
        ? 'O hacé gratis tu repaso de hoy · 1 palabra'
        : `O hacé gratis tu repaso de hoy · ${n} palabras`,
    morePractice: 'Más formas de practicar',
    topicReview: 'Repaso por tema',
    coach: 'Coach',
  },
  en: {
    title: 'Smart review',
    back: 'Back',
    plus: 'Plus',
    yourMemory: 'Your memory',
    groups: {
      mastered: 'Mastered',
      due: 'Review today',
      struggling: 'Struggling',
    },
    groupsHint: {
      mastered: 'You know them',
      due: 'Keep them fresh',
      struggling: 'Frequent mistakes',
    },
    ofTotal: (total: number) => `/${total}`,
    masteredCaption: 'mastered',
    groupsA11y: (m: number, d: number, s: number, total: number) =>
      `Of ${total} words: ${m} mastered, ${d} to review today and ${s} you struggle with`,
    memoryLevel: {
      strong: 'Excellent',
      good: 'Good progress',
      building: 'Getting there',
      weak: 'Needs review',
    } satisfies Record<MemoryLevel, string>,
    memoryA11y: (p: number, level: string) => `Your memory: ${p}%, ${level}`,
    toReinforce: (n: number): string => (n === 1 ? 'word to reinforce' : 'words to reinforce'),
    topicsToImprove: (n: number): string => (n === 1 ? 'topic to improve' : 'topics to improve'),
    todaySession: 'Today’s session',
    minutes: (low: number, high: number) => (low === high ? `~${low} min` : `${low}–${high} min`),
    exercises: (n: number) => `${n} ${n === 1 ? 'exercise' : 'exercises'}`,
    reason: {
      due: 'Due',
      frequent_mistakes: 'Mistakes',
      difficult: 'Hard',
      due_soon: 'Fading',
    } satisfies Record<SmartReason, string>,
    reasonA11y: (label: string, n: number) => `${label}: ${n} ${n === 1 ? 'word' : 'words'}`,
    wordsToday: 'Your words today',
    moreLocked: (n: number) => `+${n}`,
    lockedA11y: (n: number) => `${n} more words with PolyGo Plus`,
    start: 'Start review',
    startSub: 'Built from your real mistakes',
    unlock: 'Unlock smart review',
    unlockSub: 'With PolyGo Plus · cancel anytime',
    emptyTitle: 'Nothing to reinforce right now',
    emptyBody: 'When you make a mistake or a word is about to slip, it shows up here.',
    loadError: 'We couldn’t load your review.',
    alsoInPlus: 'Also included in PolyGo Plus',
    perkCoach: 'Unlimited Coach',
    perkEnergy: 'Unlimited energy',
    perkAds: 'No ads',
    freeReview: (n: number) =>
      n === 1
        ? 'Or do today’s review for free · 1 word'
        : `Or do today’s review for free · ${n} words`,
    morePractice: 'More ways to practice',
    topicReview: 'Review by topic',
    coach: 'Coach',
  },
});
