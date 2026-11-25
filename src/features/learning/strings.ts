import {
  SKILL_LABELS,
  type ReadingDocument,
  type Skill,
  type StimulusVisualKind,
} from '@shared/exercises';
import type { LanguageConfig } from '@shared/languages';

import { defineStrings } from '@/i18n';
import { languageName } from '@/i18n/languages';

import type { MasteryCounts } from './api';
import type { LessonKind } from './path';

/**
 * Textos del flujo de aprendizaje (docs/I18N_GUIDE.md). Las consignas que dependen del idioma que se
 * aprende reciben su configuración: en español usan `inName` («en italiano»); en inglés, el nombre
 * del idioma en inglés («in Italian»).
 */

const enName = (lang: LanguageConfig) => languageName(lang.code, 'en');

/** Zona de respuesta (AnswerInput). */
export const answerInputStrings = defineStrings({
  es: {
    check: 'Comprobar',
    completeWord: 'Palabra completa',
    yourAnswer: (lang: LanguageConfig) =>
      `Tu respuesta ${lang.script === 'han' ? 'en pinyin' : lang.inName}`,
    pinyinPlaceholder: 'Ej.: ni3 hao3',
    placeholder: 'Escribí acá…',
    yourSentence: 'Tu oración',
    tapInOrder: 'Tocá las palabras en orden',
    matchHint: (lang: LanguageConfig) =>
      `Tocá una palabra ${lang.inName} y después su significado.`,
    matchedWith: (left: string, right: string) => `${left}, unido con ${right}`,
  },
  en: {
    check: 'Check',
    completeWord: 'Complete word',
    yourAnswer: (lang: LanguageConfig) =>
      `Your answer ${lang.script === 'han' ? 'in pinyin' : `in ${enName(lang)}`}`,
    pinyinPlaceholder: 'E.g. ni3 hao3',
    placeholder: 'Type here…',
    yourSentence: 'Your sentence',
    tapInOrder: 'Tap the words in order',
    matchHint: (lang: LanguageConfig) => `Tap a word in ${enName(lang)}, then its meaning.`,
    matchedWith: (left: string, right: string) => `${left}, matched with ${right}`,
  },
});

/** Resumen de la respuesta (AnswerRecap). */
export const answerRecapStrings = defineStrings({
  es: {
    pairs: 'PAREJAS',
    yourAnswer: 'TU RESPUESTA',
    yourAnswerCorrect: '✓ TU RESPUESTA',
    correctAnswer: 'RESPUESTA CORRECTA',
  },
  en: {
    pairs: 'PAIRS',
    yourAnswer: 'YOUR ANSWER',
    yourAnswerCorrect: '✓ YOUR ANSWER',
    correctAnswer: 'CORRECT ANSWER',
  },
});

/** Feedback tras responder (FeedbackPanel). */
export const feedbackStrings = defineStrings({
  es: {
    typo: '¡Bien! Ojo con la ortografía',
    correct: '¡Correcto!',
    incorrect: 'Respuesta incorrecta',
    synthesizedVoice: 'voz sintetizada',
    continue: 'Continuar',
  },
  en: {
    typo: 'Nice! Watch your spelling',
    correct: 'Correct!',
    incorrect: 'Incorrect answer',
    synthesizedVoice: 'synthesized voice',
    continue: 'Continue',
  },
});

/** Parlante de pronunciación (SpeakButton). */
export const speakStrings = defineStrings({
  es: {
    slow: 'Escuchar despacio (voz sintetizada)',
    normal: 'Escuchar pronunciación (voz sintetizada)',
  },
  en: {
    slow: 'Listen slowly (synthesized voice)',
    normal: 'Listen to the pronunciation (synthesized voice)',
  },
});

/** Práctica de escritura (WritingPracticeCard y WritingTask). */
export const writingStrings = defineStrings({
  es: {
    practiceLabel: 'Practicá escribiendo',
    practiceOverline: 'PRACTICÁ ESCRIBIENDO',
    practiceOptional: 'Opcional: escribís a tu ritmo y no se guarda.',
    guided: 'ESCRITURA GUIADA',
    free: 'ESCRITURA LIBRE',
    privacy: 'Podés inventar los datos. Tu texto no se envía ni se guarda: queda en tu teléfono.',
    yourText: (lang: LanguageConfig) => `Tu texto ${lang.inName}`,
    placeholder: 'Escribí acá…',
    checkGuided: 'Revisar mi texto',
    checkFree: 'Terminé: comparar',
    requirementsGuided: 'LO QUE PEDÍA LA CONSIGNA',
    requirementsFree: 'PISTAS',
    complete: 'Tu texto tiene todo lo que pedía la consigna.',
    incomplete: 'Te falta algo de la consigna: revisá los puntos sin marcar.',
    disclaimer:
      'Esta revisión sólo busca lo que pide la consigna; no corrige la gramática ni dice si el texto está bien escrito.',
    modelOverline: 'UN EJEMPLO PARA COMPARAR',
    modelNote: 'Es un ejemplo, no la única respuesta posible.',
    selfCheck: 'REVISÁ VOS',
  },
  en: {
    practiceLabel: 'Practice writing',
    practiceOverline: 'PRACTICE WRITING',
    practiceOptional: 'Optional: write at your own pace. Nothing is saved.',
    guided: 'GUIDED WRITING',
    free: 'FREE WRITING',
    privacy:
      'Feel free to make up the details. Your text isn’t sent or saved: it stays on your phone.',
    yourText: (lang: LanguageConfig) => `Your text in ${enName(lang)}`,
    placeholder: 'Type here…',
    checkGuided: 'Check my text',
    checkFree: 'Done: compare',
    requirementsGuided: 'WHAT THE TASK ASKED FOR',
    requirementsFree: 'HINTS',
    complete: 'Your text has everything the task asked for.',
    incomplete: 'Something from the task is missing: check the unmarked points.',
    disclaimer:
      'This check only looks for what the task asks for. It doesn’t correct grammar or tell you whether the text is well written.',
    modelOverline: 'AN EXAMPLE TO COMPARE',
    modelNote: 'It’s one example, not the only possible answer.',
    selfCheck: 'CHECK IT YOURSELF',
  },
});

/** Estímulos de comprensión en contexto (ContextStimulus). */
export const stimulusStrings = defineStrings({
  es: {
    documents: {
      message: 'MENSAJE',
      email: 'CORREO',
      post: 'PUBLICACIÓN',
      notice: 'FICHA',
      sign: 'CARTEL',
      menu: 'MENÚ',
      schedule: 'HORARIO',
      description: 'DESCRIPCIÓN',
      directions: 'INDICACIONES',
      postcard: 'POSTAL',
      ad: 'AVISO',
      form: 'FORMULARIO',
    } as Record<ReadingDocument, string>,
    visuals: {
      photo: 'FOTO',
      illustration: 'ILUSTRACIÓN',
      floor_plan: 'PLANO',
      map: 'MAPA',
    } as Record<StimulusVisualKind, string>,
    toRead: (document: string) => `${document.toLowerCase()} para leer`,
    from: (name: string) => `De: ${name}`,
    to: (name: string) => `Para: ${name}`,
    question: 'PREGUNTA',
    conversation: 'CONVERSACIÓN',
    voiceMessage: 'MENSAJE ORAL',
    stopAudio: 'Detener el audio',
    playAudio: 'Escuchar el audio (voz sintetizada)',
    playSlow: 'Escuchar más despacio (voz sintetizada)',
    audioError: 'No se pudo reproducir el audio. Tocá el parlante para intentar de nuevo.',
    playing: (slow: boolean, line: number, total: number) =>
      `Reproduciendo${slow ? ' despacio' : ''}… ${line} de ${total}`,
    listenAgain: 'Podés volver a escucharlo las veces que quieras.',
    tapToListen: 'Tocá el parlante para escuchar.',
    speakers: (names: string[]) =>
      names.length > 1 ? `Hablan: ${names.join(' y ')}` : `Habla: ${names[0]}`,
    synthesizedVoice: 'voz sintetizada',
    noVoice: (lang: LanguageConfig) =>
      `Tu dispositivo no tiene una voz ${lang.inName} instalada: puede sonar con otra voz del sistema.`,
    oneVoice: (lang: LanguageConfig) =>
      `Tu dispositivo tiene una sola voz ${lang.inName}: los dos hablantes usan la misma voz, sólo con otro tono.`,
    transcriptLabel: 'Transcripción del audio',
    transcript: 'TRANSCRIPCIÓN',
  },
  en: {
    documents: {
      message: 'MESSAGE',
      email: 'EMAIL',
      post: 'POST',
      notice: 'NOTICE',
      sign: 'SIGN',
      menu: 'MENU',
      schedule: 'SCHEDULE',
      description: 'DESCRIPTION',
      directions: 'DIRECTIONS',
      postcard: 'POSTCARD',
      ad: 'AD',
      form: 'FORM',
    } as Record<ReadingDocument, string>,
    visuals: {
      photo: 'PHOTO',
      illustration: 'ILLUSTRATION',
      floor_plan: 'FLOOR PLAN',
      map: 'MAP',
    } as Record<StimulusVisualKind, string>,
    toRead: (document: string) => `${document.toLowerCase()} to read`,
    from: (name: string) => `From: ${name}`,
    to: (name: string) => `To: ${name}`,
    question: 'QUESTION',
    conversation: 'CONVERSATION',
    voiceMessage: 'VOICE MESSAGE',
    stopAudio: 'Stop the audio',
    playAudio: 'Play the audio (synthesized voice)',
    playSlow: 'Play more slowly (synthesized voice)',
    audioError: 'The audio couldn’t play. Tap the speaker to try again.',
    playing: (slow: boolean, line: number, total: number) =>
      `Playing${slow ? ' slowly' : ''}… ${line} of ${total}`,
    listenAgain: 'You can listen again as many times as you like.',
    tapToListen: 'Tap the speaker to listen.',
    speakers: (names: string[]) =>
      names.length > 1 ? `Speakers: ${names.join(' and ')}` : `Speaker: ${names[0]}`,
    synthesizedVoice: 'synthesized voice',
    noVoice: (lang: LanguageConfig) =>
      `Your device doesn’t have a voice in ${enName(lang)} installed, so another system voice may be used.`,
    oneVoice: (lang: LanguageConfig) =>
      `Your device has only one voice in ${enName(lang)}: both speakers use the same voice, just with a different pitch.`,
    transcriptLabel: 'Audio transcript',
    transcript: 'TRANSCRIPT',
  },
});

/** Racha (streak.ts y DailyCelebration). */
export const streakStrings = defineStrings({
  es: {
    dayLabels: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
    days: (n: number) => `${n} ${n === 1 ? 'día' : 'días'}`,
    goalMet: '¡Objetivo cumplido!',
    streakStarted: '¡Arrancaste tu racha!',
    inARow: (days: string) => `¡${days} seguidos!`,
    goalToday: (minutes: number) => `Hoy ya practicaste tus ${minutes} minutos.`,
    comeBackSecond: 'Volvé mañana para sumar el segundo día.',
    comeBack: 'Volvé mañana para no cortarla.',
    continue: 'Continuar',
    streakLabel: (days: string) => `Racha de ${days}`,
    yourWeek: 'Tu semana',
    alsoGoal: (minutes: number) => `Y cumpliste tu objetivo de ${minutes} minutos.`,
    remindTitle: '¿Te recordamos mañana?',
    remindBody: (time: string) =>
      `Un aviso a las ${time} sólo si todavía no practicaste. Podés cambiar el horario en Perfil.`,
    enableReminder: 'Activar recordatorio',
    noPermission: 'Sin permiso para notificaciones no podemos recordarte.',
    reminderSet: (time: string) => `Listo: te avisamos a las ${time}.`,
    calendarTitle: 'Tu racha',
    streakCount: (n: number): string => (n === 1 ? 'día seguido' : 'días seguidos'),
    weekLabels: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
    close: 'Cerrar',
    prevMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    legendStudied: 'Estudiaste',
    legendFrozen: 'Protector',
    legendToday: 'Hoy',
    loadError: 'No pudimos cargar tu actividad.',
    retry: 'Reintentar',
    openCalendarHint: 'Abre el calendario de tu racha',
    dayA11y: (date: string, state: 'studied' | 'frozen' | 'none') =>
      `${date}: ${state === 'studied' ? 'estudiaste' : state === 'frozen' ? 'protector de racha' : 'sin actividad'}`,
  },
  en: {
    dayLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    days: (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`,
    goalMet: 'Goal reached!',
    streakStarted: 'You started a streak!',
    inARow: (days: string) => `${days} in a row!`,
    goalToday: (minutes: number) => `You’ve practiced your ${minutes} minutes today.`,
    comeBackSecond: 'Come back tomorrow for day two.',
    comeBack: 'Come back tomorrow to keep it going.',
    continue: 'Continue',
    streakLabel: (days: string) => `Streak of ${days}`,
    yourWeek: 'Your week',
    alsoGoal: (minutes: number) => `And you reached your ${minutes}-minute goal.`,
    remindTitle: 'Want a reminder tomorrow?',
    remindBody: (time: string) =>
      `A notification at ${time}, only if you haven’t practiced yet. You can change the time in Profile.`,
    enableReminder: 'Turn on reminder',
    noPermission: 'Without notification permission, we can’t remind you.',
    reminderSet: (time: string) => `Done: we’ll remind you at ${time}.`,
    calendarTitle: 'Your streak',
    streakCount: (n: number) => (n === 1 ? 'day in a row' : 'days in a row'),
    weekLabels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    close: 'Close',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    legendStudied: 'Studied',
    legendFrozen: 'Freeze',
    legendToday: 'Today',
    loadError: 'We couldn’t load your activity.',
    retry: 'Retry',
    openCalendarHint: 'Opens your streak calendar',
    dayA11y: (date: string, state: 'studied' | 'frozen' | 'none') =>
      `${date}: ${state === 'studied' ? 'studied' : state === 'frozen' ? 'streak freeze' : 'no activity'}`,
  },
});

/** Enunciado del ejercicio (ExercisePrompt). */
export const promptStrings = defineStrings({
  es: {
    image: 'Imagen del ejercicio',
    /** Idioma de apoyo del curso (el de la frase a traducir). */
    inSupport: (code: string) => `EN ${languageName(code, 'es').toUpperCase()}`,
    maskedLabel: (masked: string) => `Palabra incompleta: ${masked.replace(/_/g, ' guion bajo ')}`,
    hint: (hint: string) => `Pista: ${hint}`,
    listenAgain: 'Tocá para volver a escuchar · 🐢 más despacio',
  },
  en: {
    image: 'Exercise image',
    inSupport: (code: string) => `IN ${languageName(code, 'en').toUpperCase()}`,
    maskedLabel: (masked: string) => `Incomplete word: ${masked.replace(/_/g, ' blank ')}`,
    hint: (hint: string) => `Hint: ${hint}`,
    listenAgain: 'Tap to listen again · 🐢 slower',
  },
});

/** Reproductor de la sesión (SessionPlayer). */
export const playerStrings = defineStrings({
  es: {
    exit: 'Salir de la sesión',
    progress: 'Progreso de la sesión',
    mistakeReview: 'REPASO DE ERRORES',
    showPinyin: 'Mostrar pinyin',
    pinyin: 'Pinyin',
    checkFailed: 'No pudimos comprobar tu respuesta. Revisá tu conexión.',
    checking: 'Comprobando…',
    retry: 'Reintentar',
  },
  en: {
    exit: 'Exit session',
    progress: 'Session progress',
    mistakeReview: 'MISTAKE REVIEW',
    showPinyin: 'Show pinyin',
    pinyin: 'Pinyin',
    checkFailed: 'We couldn’t check your answer. Check your connection.',
    checking: 'Checking…',
    retry: 'Try again',
  },
});

/** Resultados de una sesión (SessionResults). */
export const resultsStrings = defineStrings({
  es: {
    perfect: '¡Perfecto!',
    great: '¡Muy bien!',
    good: 'Buen trabajo',
    keepGoing: 'Seguí practicando',
    back: 'Volver',
    accuracy: 'Precisión',
    firstTry: 'en el primer intento',
    correct: 'Correctas',
    time: 'Tiempo',
    learnedLabel: 'Qué aprendiste',
    learned: 'QUÉ APRENDISTE',
    saving: 'Guardando tu progreso…',
    saveFailed: 'No se pudo guardar',
    notLost: 'Tu sesión no se perdió: podés reintentar.',
    retry: 'Reintentar',
    newAchievements: 'Logros nuevos',
    unlocked: (n: number): string => (n === 1 ? 'LOGRO DESBLOQUEADO' : 'LOGROS DESBLOQUEADOS'),
    wordsToReview: 'PALABRAS PARA REPASAR',
    mistakesHint: 'Van a aparecer en tus repasos para que las fijes.',
    starsA11y: (n: number) => (n === 1 ? '1 estrella de 3' : `${n} estrellas de 3`),
  },
  en: {
    perfect: 'Perfect!',
    great: 'Great job!',
    good: 'Good work',
    keepGoing: 'Keep practicing',
    back: 'Back',
    accuracy: 'Accuracy',
    firstTry: 'on the first try',
    correct: 'Correct',
    time: 'Time',
    learnedLabel: 'What you learned',
    learned: 'WHAT YOU LEARNED',
    saving: 'Saving your progress…',
    saveFailed: 'Couldn’t save',
    notLost: 'Your session isn’t lost. You can try again.',
    retry: 'Try again',
    newAchievements: 'New achievements',
    unlocked: (n: number): string => (n === 1 ? 'ACHIEVEMENT UNLOCKED' : 'ACHIEVEMENTS UNLOCKED'),
    wordsToReview: 'WORDS TO REVIEW',
    mistakesHint: 'They’ll show up in your reviews so they stick.',
    starsA11y: (n: number) => (n === 1 ? '1 star out of 3' : `${n} stars out of 3`),
  },
});

/** Mapa de aprendizaje (LessonPath). */
export const pathStrings = defineStrings({
  es: {
    kinds: {
      review: 'REPASO',
      listening: 'ESCUCHA',
      words: 'PALABRAS',
      final: 'REPASO FINAL',
    } as Record<Exclude<LessonKind, 'lesson'>, string>,
    lessonN: (n: number) => `LECCIÓN ${n}`,
    unitN: (n: number) => `UNIDAD ${n}`,
    locked: 'Bloqueada',
    nextLesson: 'Siguiente lección',
    completedStars: (stars: number) => `Completada, ${stars} de 3 estrellas`,
    lockedPrevious: 'Completá las lecciones anteriores para desbloquearla.',
    preparingRange: (from: number, to: number, level: string) =>
      `Estamos preparando las unidades ${from}–${to} de ${level}.`,
    finishLevel: (level: string, next: string) => `Terminá el nivel ${level} para pasar a ${next}.`,
    preparingLevel: (next: string) => `Estamos preparando las unidades del nivel ${next}.`,
    soonLocked: 'Próximamente. Bloqueada',
    soon: 'Próximamente',
    levelN: (level: string) => `NIVEL ${level}`,
    levelUnits: (level: string, n: number, total: number) =>
      `NIVEL ${level} · ${n} DE ${total} UNIDADES`,
    nextLevel: (next: string) => `PRÓXIMO NIVEL · ${next}`,
    moreUnits: '🚧 Más unidades en camino',
    pathContinues: '🚀 Tu camino sigue',
    pendingDescription: (level: string, from: number, to: number) =>
      `El nivel ${level} todavía no está completo: estamos preparando las unidades ${from} a ${to}. Mientras tanto, repasá para no perder la racha.`,
    nextReadyDescription: (level: string, next: string) =>
      `Cuando termines ${level}, seguís directo con las unidades de ${next}.`,
    nextPendingDescription:
      'Estamos preparando las próximas unidades. Mientras tanto, repasá y jugá ranked para no perder la racha.',
    lessonsCount: (n: number) => `${n} lecciones`,
    unitProgress: (label: string) => `Progreso de la unidad: ${label}`,
    statusLocked: 'Bloqueado',
    statusPending: 'Sin completar',
    statusDone: 'Completado',
    starsOf: (n: number) => `${n} de 3 estrellas`,
    currentHint: 'Hacela sin errores para ganar las 3 estrellas y volverla dorada.',
    perfectHint: '¡Perfecta, sin ningún error! Esta lección ya es dorada.',
    bestHint: (percent: number) =>
      `Mejor precisión: ${percent} %. Hacela sin errores para ganar las 3 estrellas y volverla dorada.`,
    start: 'Empezar lección',
    redo: 'Repasar de nuevo',
    energyCost: (energy: number, max: number) => `Completarla usa 1 de energía (${energy}/${max})`,
  },
  en: {
    kinds: {
      review: 'REVIEW',
      listening: 'LISTENING',
      words: 'WORDS',
      final: 'FINAL REVIEW',
    } as Record<Exclude<LessonKind, 'lesson'>, string>,
    lessonN: (n: number) => `LESSON ${n}`,
    unitN: (n: number) => `UNIT ${n}`,
    locked: 'Locked',
    nextLesson: 'Next lesson',
    completedStars: (stars: number) => `Completed, ${stars} of 3 stars`,
    lockedPrevious: 'Complete the previous lessons to unlock it.',
    preparingRange: (from: number, to: number, level: string) =>
      `We’re preparing units ${from}–${to} of ${level}.`,
    finishLevel: (level: string, next: string) => `Finish level ${level} to move on to ${next}.`,
    preparingLevel: (next: string) => `We’re preparing the units for level ${next}.`,
    soonLocked: 'Coming soon. Locked',
    soon: 'Coming soon',
    levelN: (level: string) => `LEVEL ${level}`,
    levelUnits: (level: string, n: number, total: number) =>
      `LEVEL ${level} · ${n} OF ${total} UNITS`,
    nextLevel: (next: string) => `NEXT LEVEL · ${next}`,
    moreUnits: '🚧 More units on the way',
    pathContinues: '🚀 Your path continues',
    pendingDescription: (level: string, from: number, to: number) =>
      `Level ${level} isn’t complete yet: we’re preparing units ${from} to ${to}. In the meantime, review to keep your streak.`,
    nextReadyDescription: (level: string, next: string) =>
      `When you finish ${level}, you go straight on to the ${next} units.`,
    nextPendingDescription:
      'We’re preparing the next units. In the meantime, review and play Ranked to keep your streak.',
    lessonsCount: (n: number) => `${n} lessons`,
    unitProgress: (label: string) => `Unit progress: ${label}`,
    statusLocked: 'Locked',
    statusPending: 'Not completed',
    statusDone: 'Completed',
    starsOf: (n: number) => `${n} of 3 stars`,
    currentHint: 'Finish it with no mistakes to earn all 3 stars and turn it gold.',
    perfectHint: 'Perfect, not a single mistake! This lesson is already gold.',
    bestHint: (percent: number) =>
      `Best accuracy: ${percent}%. Finish it with no mistakes to earn all 3 stars and turn it gold.`,
    start: 'Start lesson',
    redo: 'Practice again',
    energyCost: (energy: number, max: number) => `Completing it uses 1 energy (${energy}/${max})`,
  },
});

/** Cabecera del mapa (LearnHero). */
export const heroStrings = defineStrings({
  es: {
    levelNames: {
      A1: 'Principiante',
      A2: 'Elemental',
      B1: 'Intermedio',
      B2: 'Intermedio alto',
      C1: 'Avanzado',
      C2: 'Maestría',
    } as Record<string, string>,
    a11y: 'Tu camino de aprendizaje. Completá unidades y ganá XP.',
    titleTop: 'Tu camino de',
    titleAccent: 'aprendizaje',
    subtitle: 'Completá unidades y ganá XP',
    levelA11y: (level: string, name: string, completed: number, total: number, percent: number) =>
      `Nivel ${level}${name ? `, ${name}` : ''}: ${completed} de ${total} lecciones, ${percent} %`,
  },
  en: {
    levelNames: {
      A1: 'Beginner',
      A2: 'Elementary',
      B1: 'Intermediate',
      B2: 'Upper intermediate',
      C1: 'Advanced',
      C2: 'Proficient',
    } as Record<string, string>,
    a11y: 'Your learning path. Complete units and earn XP.',
    titleTop: 'Your learning',
    titleAccent: 'path',
    subtitle: 'Complete units and earn XP',
    levelA11y: (level: string, name: string, completed: number, total: number, percent: number) =>
      `Level ${level}${name ? `, ${name}` : ''}: ${completed} of ${total} lessons, ${percent}%`,
  },
});

/** Estadísticas de aprendizaje (LearningStats). */
export const statsStrings = defineStrings({
  es: {
    /** Mapa en el cliente de SKILL_LABELS (shared/exercises.ts lo usa también el servidor). */
    skills: { ...SKILL_LABELS } as Record<Skill, string>,
    loadError: 'No pudimos cargar tu progreso.',
    loading: 'Cargando progreso…',
    levelInProgress: (level: string) => `Nivel ${level} · en curso`,
    starsA11y: (earned: number, max: number, golden: number) =>
      `${earned} de ${max} estrellas, ${golden} lecciones doradas`,
    starsCaption: (golden: number) =>
      `estrellas · ${golden} ${golden === 1 ? 'lección dorada' : 'lecciones doradas'}`,
    starsProgress: 'Estrellas conseguidas',
    starsExplain:
      'Cada lección da hasta 3 estrellas: la tercera, sólo si la hacés sin ningún error.',
    lessons: 'Lecciones',
    streak: 'Racha',
    streakValue: (days: number) => `${days} d`,
    studied: 'Estudiadas',
    wordsSeen: 'palabras vistas',
    mastered: 'Dominadas',
    byEvidence: 'según tu evidencia',
    toReview: 'Para repasar',
    time: 'Tiempo',
    accuracyBySkill: 'PRECISIÓN POR HABILIDAD',
    noSkills: 'Completá una lección para ver tu precisión por habilidad.',
    skillAnswers: (percent: number, answers: number) => `${percent}% · ${answers} resp.`,
    accuracyIn: (skill: string) => `Precisión en ${skill}`,
    firstAttempt: 'Calculada sobre el primer intento de cada ejercicio.',
    frequentMistakes: 'ERRORES FRECUENTES',
    mistakesCount: (n: number) => `(${n} errores)`,
  },
  en: {
    skills: {
      vocabulary: 'Vocabulary',
      translation: 'Translation',
      listening: 'Listening',
      grammar: 'Grammar',
      sentence_building: 'Sentence building',
      reading: 'Reading',
    } as Record<Skill, string>,
    loadError: 'We couldn’t load your progress.',
    loading: 'Loading progress…',
    levelInProgress: (level: string) => `Level ${level} · in progress`,
    starsA11y: (earned: number, max: number, golden: number) =>
      `${earned} of ${max} stars, ${golden} golden lessons`,
    starsCaption: (golden: number) =>
      `stars · ${golden} ${golden === 1 ? 'golden lesson' : 'golden lessons'}`,
    starsProgress: 'Stars earned',
    starsExplain: 'Each lesson gives up to 3 stars. You get the third only with zero mistakes.',
    lessons: 'Lessons',
    streak: 'Streak',
    streakValue: (days: number) => `${days} d`,
    studied: 'Studied',
    wordsSeen: 'words seen',
    mastered: 'Mastered',
    byEvidence: 'based on your answers',
    toReview: 'To review',
    time: 'Time',
    accuracyBySkill: 'ACCURACY BY SKILL',
    noSkills: 'Complete a lesson to see your accuracy by skill.',
    skillAnswers: (percent: number, answers: number) => `${percent}% · ${answers} answers`,
    accuracyIn: (skill: string) => `Accuracy in ${skill}`,
    firstAttempt: 'Based on your first try at each exercise.',
    frequentMistakes: 'COMMON MISTAKES',
    mistakesCount: (n: number) => `(${n} mistakes)`,
  },
});

/** Dominio estimado (MasteryCard). */
export const masteryStrings = defineStrings({
  es: {
    states: {
      mastered: { label: 'Dominadas', hint: 'demostradas sin ayuda en el nivel objetivo' },
      in_progress: { label: 'En progreso', hint: 'con evidencia suficiente' },
      weak: { label: 'Puntos débiles', hint: 'rendimiento bajo' },
      insufficient: { label: 'Evidencia insuficiente', hint: 'todavía no alcanza para estimar' },
      no_evidence: { label: 'Sin evidencia', hint: 'vistas, sin respuestas que cuenten' },
    } as Record<keyof MasteryCounts, { label: string; hint: string }>,
    dimensions: {
      vocabulary: 'Vocabulario',
      production: 'Producción',
      grammar: 'Gramática',
      comprehension: 'Comprensión',
    } as Record<string, string>,
    a11y: 'Dominio estimado',
    overline: 'DOMINIO',
    none: 'Todavía no hay evidencia para estimar tu dominio. Completá lecciones y repasos.',
    retention: (percent: string, units: number) =>
      `Retención estimada: ${percent} (sobre ${units} con repasos espaciados suficientes).`,
    speed: (percent: string, units: number) =>
      `Velocidad de recuperación: respondés en ${percent} del tiempo recomendado (mediana de ${units}).`,
    updating: 'Algunas estimaciones se están actualizando.',
    byUnit: 'PROGRESO POR UNIDAD',
    unitMastered: (mastered: number, total: number) => `${mastered} / ${total} dominadas`,
    unitWeak: (n: number) => ` · ${n} débiles`,
    masteredIn: (title: string) => `Dominadas en ${title}`,
    toReinforce: 'PARA REFORZAR',
  },
  en: {
    states: {
      mastered: { label: 'Mastered', hint: 'shown without help at the target level' },
      in_progress: { label: 'In progress', hint: 'with enough evidence' },
      weak: { label: 'Weak spots', hint: 'low performance' },
      insufficient: { label: 'Not enough evidence', hint: 'not enough yet to estimate' },
      no_evidence: { label: 'No evidence', hint: 'seen, with no answers that count' },
    } as Record<keyof MasteryCounts, { label: string; hint: string }>,
    dimensions: {
      vocabulary: 'Vocabulary',
      production: 'Production',
      grammar: 'Grammar',
      comprehension: 'Comprehension',
    } as Record<string, string>,
    a11y: 'Estimated mastery',
    overline: 'MASTERY',
    none: 'There isn’t enough evidence yet to estimate your mastery. Complete lessons and reviews.',
    retention: (percent: string, units: number) =>
      `Estimated retention: ${percent} (across ${units} with enough spaced reviews).`,
    speed: (percent: string, units: number) =>
      `Recall speed: you answer in ${percent} of the recommended time (median of ${units}).`,
    updating: 'Some estimates are being updated.',
    byUnit: 'PROGRESS BY UNIT',
    unitMastered: (mastered: number, total: number) => `${mastered} / ${total} mastered`,
    unitWeak: (n: number) => ` · ${n} weak`,
    masteredIn: (title: string) => `Mastered in ${title}`,
    toReinforce: 'TO REINFORCE',
  },
});

/** Ejercicios de práctica que arma la app (review.ts). */
export const reviewBuilderStrings = defineStrings({
  es: {
    meaning: (word: string) => `¿Qué significa «${word}»?`,
    listen: 'Escuchá y elegí lo que oís',
    writePinyin: 'Escribí en pinyin',
    writeIn: (lang: LanguageConfig) => `Escribí ${lang.inName}`,
  },
  en: {
    meaning: (word: string) => `What does “${word}” mean?`,
    listen: 'Listen and choose what you hear',
    writePinyin: 'Write it in pinyin',
    writeIn: (lang: LanguageConfig) => `Write it in ${enName(lang)}`,
  },
});
