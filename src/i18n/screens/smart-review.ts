import type { MemoryLevel } from '@shared/smartOverview';
import type { SmartReason } from '@shared/focusReview';

import { defineStrings } from '..';

/** Repaso inteligente: presentación de la sesión (src/app/smart-review.tsx). */
export const smartReviewStrings = defineStrings({
  es: {
    title: 'Repaso inteligente',
    back: 'Volver',
    plus: 'Plus',
    heroTitle: '¡Vamos a fortalecer tu memoria!',
    heroBody: 'Una sesión preparada según tus errores y las palabras que toca repasar.',
    yourMemory: 'Tu memoria',
    memoryLevel: {
      strong: 'Excelente',
      good: 'Buen progreso',
      building: 'En camino',
      weak: 'Necesita repaso',
    } satisfies Record<MemoryLevel, string>,
    memoryA11y: (p: number, level: string) => `Tu memoria: ${p}%, ${level}`,
    toReinforce: (n: number): string =>
      n === 1 ? 'Palabra para reforzar' : 'Palabras para reforzar',
    topicsToImprove: (n: number): string => (n === 1 ? 'Tema a mejorar' : 'Temas a mejorar'),
    todaySession: 'Tu sesión de hoy',
    personalized: 'Personalizada',
    minutes: (low: number, high: number) =>
      low === high ? `${low} ${low === 1 ? 'minuto' : 'minutos'}` : `${low}–${high} minutos`,
    exercises: (n: number) => `${n} ${n === 1 ? 'ejercicio' : 'ejercicios'}`,
    whatWeWork: 'Qué vamos a trabajar',
    reason: {
      due: 'Palabras para repasar hoy',
      frequent_mistakes: 'Errores frecuentes',
      difficult: 'Palabras que te cuestan',
      due_soon: 'Por olvidarse',
    } satisfies Record<SmartReason, string>,
    tag: {
      due: 'Prioridad alta',
      frequent_mistakes: 'Prioridad alta',
      difficult: 'Reforzar',
      due_soon: 'Repaso',
    } satisfies Record<SmartReason, string>,
    reasonA11y: (label: string, n: number, tag: string) =>
      `${label}: ${n} ${n === 1 ? 'palabra' : 'palabras'}, ${tag}`,
    start: 'Comenzar entrenamiento',
    unlock: 'Desbloquear con Plus',
    footer: 'Tu sesión se adapta a medida que aprendés.',
    emptyTitle: 'Nada para reforzar por ahora',
    emptyBody: 'Cuando te equivoques o una palabra esté por olvidarse, la vas a ver acá.',
    loadError: 'No pudimos cargar tu repaso.',
  },
  en: {
    title: 'Smart review',
    back: 'Back',
    plus: 'Plus',
    heroTitle: 'Let’s strengthen your memory!',
    heroBody: 'A session built from your mistakes and the words that are due.',
    yourMemory: 'Your memory',
    memoryLevel: {
      strong: 'Excellent',
      good: 'Good progress',
      building: 'Getting there',
      weak: 'Needs review',
    } satisfies Record<MemoryLevel, string>,
    memoryA11y: (p: number, level: string) => `Your memory: ${p}%, ${level}`,
    toReinforce: (n: number): string => (n === 1 ? 'Word to reinforce' : 'Words to reinforce'),
    topicsToImprove: (n: number): string => (n === 1 ? 'Topic to improve' : 'Topics to improve'),
    todaySession: 'Today’s session',
    personalized: 'Personalized',
    minutes: (low: number, high: number) =>
      low === high ? `${low} ${low === 1 ? 'minute' : 'minutes'}` : `${low}–${high} minutes`,
    exercises: (n: number) => `${n} ${n === 1 ? 'exercise' : 'exercises'}`,
    whatWeWork: 'What we’ll work on',
    reason: {
      due: 'Words due today',
      frequent_mistakes: 'Frequent mistakes',
      difficult: 'Words you find hard',
      due_soon: 'About to be forgotten',
    } satisfies Record<SmartReason, string>,
    tag: {
      due: 'High priority',
      frequent_mistakes: 'High priority',
      difficult: 'Reinforce',
      due_soon: 'Review',
    } satisfies Record<SmartReason, string>,
    reasonA11y: (label: string, n: number, tag: string) =>
      `${label}: ${n} ${n === 1 ? 'word' : 'words'}, ${tag}`,
    start: 'Start training',
    unlock: 'Unlock with Plus',
    footer: 'Your session adapts as you learn.',
    emptyTitle: 'Nothing to reinforce right now',
    emptyBody: 'When you make a mistake or a word is about to slip, you’ll see it here.',
    loadError: 'We couldn’t load your review.',
  },
});
