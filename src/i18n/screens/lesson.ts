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
  'pt-BR': {
    exitTitle: 'Sair da lição?',
    exitMessage: 'Você vai perder o progresso desta lição.',
    stay: 'Continuar',
    leave: 'Sair',
    loading: 'Carregando lição…',
    loadError: 'Não conseguimos carregar a lição.',
    nextLesson: 'Próxima lição',
    backToPath: 'Voltar à trilha',
  },
  it: {
    exitTitle: 'Vuoi uscire dalla lezione?',
    exitMessage: 'Perderai i progressi di questa lezione.',
    stay: 'Continua',
    leave: 'Esci',
    loading: 'Caricamento della lezione…',
    loadError: 'Non siamo riusciti a caricare la lezione.',
    nextLesson: 'Prossima lezione',
    backToPath: 'Torna al percorso',
  },
  fr: {
    exitTitle: 'Quitter la leçon ?',
    exitMessage: 'Tu vas perdre ta progression dans cette leçon.',
    stay: 'Continuer',
    leave: 'Quitter',
    loading: 'Chargement de la leçon…',
    loadError: 'Impossible de charger la leçon.',
    nextLesson: 'Leçon suivante',
    backToPath: 'Retour au parcours',
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
  'pt-BR': {
    loading: 'Carregando explicação…',
    loadError: 'Não conseguimos carregar a explicação.',
    back: 'Voltar',
    overline: 'EXPLICAÇÃO DA LIÇÃO',
    noIntro: 'Esta lição ainda não tem uma explicação escrita.',
    learned: 'O QUE VOCÊ APRENDEU',
  },
  it: {
    loading: 'Caricamento della spiegazione…',
    loadError: 'Non siamo riusciti a caricare la spiegazione.',
    back: 'Indietro',
    overline: 'SPIEGAZIONE DELLA LEZIONE',
    noIntro: 'Questa lezione non ha ancora una spiegazione scritta.',
    learned: 'COSA HAI IMPARATO',
  },
  fr: {
    loading: 'Chargement de l’explication…',
    loadError: 'Impossible de charger l’explication.',
    back: 'Retour',
    overline: 'EXPLICATION DE LA LEÇON',
    noIntro: 'Cette leçon n’a pas encore d’explication écrite.',
    learned: 'CE QUE TU AS APPRIS',
  },
});

/** Tarea de escritura (src/app/writing/[id].tsx). */
export const writingTaskScreenStrings = defineStrings({
  es: {
    back: 'Volver',
    notFoundTitle: 'No encontramos esta tarea',
    notFoundMessage: 'Vuelve e inténtalo de nuevo.',
  },
  en: {
    back: 'Back',
    notFoundTitle: 'We couldn’t find this task',
    notFoundMessage: 'Go back and try again.',
  },
  'pt-BR': {
    back: 'Voltar',
    notFoundTitle: 'Não encontramos esta tarefa',
    notFoundMessage: 'Volte e tente de novo.',
  },
  it: {
    back: 'Indietro',
    notFoundTitle: 'Non abbiamo trovato questa attività',
    notFoundMessage: 'Torna indietro e riprova.',
  },
  fr: {
    back: 'Retour',
    notFoundTitle: 'On n’a pas trouvé cet exercice',
    notFoundMessage: 'Reviens en arrière et réessaie.',
  },
});
