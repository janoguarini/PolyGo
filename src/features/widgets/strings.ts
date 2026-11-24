import { defineStrings } from '@/i18n';

import type { WidgetContent, WordCardKind } from './content';

/**
 * Textos de los widgets. El widget corre aislado (sin imports ni estado de la app): todo lo que
 * muestra viaja en sus props, así que los textos se eligen con getStrings al sincronizar.
 */
export const widgetStrings = defineStrings({
  es: {
    labels: {
      daily: 'PALABRA DEL DÍA',
      review: 'PARA REPASAR',
      mistake: 'TE COSTÓ',
      new: 'PALABRA NUEVA',
    } satisfies Record<WordCardKind, string>,
    emptyText: 'Abrí Polygo',
    emptyTranslation: 'para cargar tus palabras',
    /** Textos fijos del widget «Pregunta rápida» (QuizProps.ui). */
    quiz: {
      empty: 'Abrí Polygo para cargar preguntas',
      done: 'RONDA TERMINADA',
      again: 'Otra ronda',
      question: 'PREGUNTA',
      correct: '¡Correcto!',
      was: 'Era:',
      result: 'Ver resultado',
      next: 'Siguiente',
    },
    // WidgetContentPicker
    options: {
      mixed: { title: 'Variado', caption: 'Palabra del día, tus repasos y palabras nuevas' },
      review: { title: 'Para repasar', caption: 'Tus palabras, las vencidas primero' },
      mistakes: { title: 'Tus errores', caption: 'Las palabras en las que más te equivocaste' },
      new: { title: 'Palabras nuevas', caption: 'Vocabulario publicado que todavía no viste' },
    } satisfies Record<WidgetContent, { title: string; caption: string }>,
    pickerTitle: 'Qué muestra «Palabra»',
    pickerNote:
      'Vale para todos tus widgets «Palabra» de este teléfono, en inglés (el idioma que estudiás). Si un grupo está vacío, el widget muestra «Variado».',
    customizeWithPlus: 'Personalizar con PolyGo Plus',
  },
  en: {
    labels: {
      daily: 'WORD OF THE DAY',
      review: 'TO REVIEW',
      mistake: 'TRICKY ONE',
      new: 'NEW WORD',
    },
    emptyText: 'Open Polygo',
    emptyTranslation: 'to load your words',
    quiz: {
      empty: 'Open Polygo to load questions',
      done: 'ROUND COMPLETE',
      again: 'Play again',
      question: 'QUESTION',
      correct: 'Correct!',
      was: 'Answer:',
      result: 'See results',
      next: 'Next',
    },
    options: {
      mixed: { title: 'Mixed', caption: 'Word of the day, your reviews and new words' },
      review: { title: 'To review', caption: 'Your words, overdue ones first' },
      mistakes: { title: 'Your mistakes', caption: 'The words you got wrong most often' },
      new: { title: 'New words', caption: 'Published vocabulary you haven’t seen yet' },
    },
    pickerTitle: 'What “Word” shows',
    pickerNote:
      'Applies to all your “Word” widgets on this phone, in English (the language you’re learning). If a group is empty, the widget shows “Mixed”.',
    customizeWithPlus: 'Customize with PolyGo Plus',
  },
});
