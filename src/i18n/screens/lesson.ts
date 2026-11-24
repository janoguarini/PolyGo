import { defineStrings } from '..';

/** Lección (src/app/lesson/[id].tsx). */
export const lessonStrings = defineStrings({
  es: {
    exitTitle: '¿Salir de la lección?',
    exitMessage: 'Vas a perder el progreso de esta lección.',
    stay: 'Seguir',
    leave: 'Salir',
    loading: 'Cargando lección…',
    loadError: 'No pudimos cargar la lección.',
    nextLesson: 'Siguiente lección',
    backToPath: 'Volver al camino',
  },
  en: {
    exitTitle: 'Leave the lesson?',
    exitMessage: 'You’ll lose your progress in this lesson.',
    stay: 'Keep going',
    leave: 'Leave',
    loading: 'Loading lesson…',
    loadError: 'We couldn’t load the lesson.',
    nextLesson: 'Next lesson',
    backToPath: 'Back to my path',
  },
});

/** Explicación de una lección (src/app/lesson-intro/[id].tsx). */
export const lessonIntroStrings = defineStrings({
  es: {
    loading: 'Cargando explicación…',
    loadError: 'No pudimos cargar la explicación.',
    back: 'Volver',
    overline: 'EXPLICACIÓN DE LA LECCIÓN',
    noIntro: 'Esta lección no tiene una explicación escrita todavía.',
    learned: 'QUÉ APRENDISTE',
  },
  en: {
    loading: 'Loading explanation…',
    loadError: 'We couldn’t load the explanation.',
    back: 'Back',
    overline: 'LESSON EXPLANATION',
    noIntro: 'This lesson doesn’t have a written explanation yet.',
    learned: 'WHAT YOU LEARNED',
  },
});

/** Tarea de escritura (src/app/writing/[id].tsx). */
export const writingTaskScreenStrings = defineStrings({
  es: {
    back: 'Volver',
    notFoundTitle: 'No encontramos esta tarea',
    notFoundMessage: 'Volvé e intentá de nuevo.',
  },
  en: {
    back: 'Back',
    notFoundTitle: 'We couldn’t find this task',
    notFoundMessage: 'Go back and try again.',
  },
});
