import type { PlacementDimension } from '@shared/placement';

import { defineStrings } from '@/i18n';

/**
 * Textos del test de nivel (docs/PLACEMENT_TEST.md). Son de la interfaz: las preguntas son contenido
 * del curso y llegan en su idioma de origen (no pasan por acá). Los nombres de idiomas llegan ya
 * traducidos (languageName); en español, dentro de una frase van en minúscula.
 */
const lower = (s: string) => s.toLocaleLowerCase('es');

const ES_LEVELS: Record<string, { name: string; meaning: string }> = {
  A1: {
    name: 'Principiante',
    meaning: 'Entendés y usás frases muy básicas para presentarte y hablar de lo cotidiano.',
  },
  A2: {
    name: 'Básico',
    meaning: 'Te manejás en situaciones simples y frecuentes, y podés contar lo que hiciste.',
  },
  B1: {
    name: 'Intermedio',
    meaning: 'Te defendés en la mayoría de las situaciones y das tu opinión con frases simples.',
  },
  B2: {
    name: 'Intermedio alto',
    meaning: 'Hablás con fluidez sobre temas variados y entendés textos más complejos.',
  },
  C1: {
    name: 'Avanzado',
    meaning: 'Usás el idioma con soltura y precisión en casi cualquier contexto.',
  },
};

const EN_LEVELS: Record<string, { name: string; meaning: string }> = {
  A1: {
    name: 'Beginner',
    meaning:
      'You understand and use very basic phrases to introduce yourself and talk about daily life.',
  },
  A2: {
    name: 'Elementary',
    meaning: 'You get by in simple, everyday situations and can talk about what you did.',
  },
  B1: {
    name: 'Intermediate',
    meaning: 'You handle most situations and can share your opinion in simple sentences.',
  },
  B2: {
    name: 'Upper intermediate',
    meaning: 'You speak fluently about many topics and understand more complex texts.',
  },
  C1: {
    name: 'Advanced',
    meaning: 'You use the language easily and precisely in almost any context.',
  },
};

const levelInfo = (table: typeof ES_LEVELS, level: string) =>
  table[level] ?? { name: level, meaning: '' };

const ES_DIMENSIONS: Record<PlacementDimension, string> = {
  vocabulary: 'Vocabulario',
  grammar: 'Gramática',
  sentences: 'Comprensión de frases',
  structures: 'Estructura de oraciones',
  context: 'Uso en contexto',
};

const EN_DIMENSIONS: Record<PlacementDimension, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  sentences: 'Understanding sentences',
  structures: 'Sentence structure',
  context: 'Using it in context',
};

/** Qué dice el resultado según lo que demostró (shared/placement.ts PlacementResult). */
interface Explain {
  level: string;
  mastered: string[];
  partial: boolean;
  topReached: boolean;
}

export const courseStartStrings = defineStrings({
  es: {
    title: 'Nuevo curso',
    loading: 'Preparando el curso…',
    notFoundTitle: 'Curso no disponible',
    notFoundMessage: 'Este curso no está disponible por ahora.',
    back: 'Volver',
    heroOverline: 'EMPEZÁS UN CURSO NUEVO',
    fromLanguage: (source: string) => `desde ${lower(source)}`,
    levelsLabel: 'Niveles',
    rankedLabel: 'Ranked',
    rankedYes: 'Disponible',
    rankedNo: 'Sin ranked aún',
    question: '¿Por dónde querés empezar?',
    testTitle: 'Hacer el test de nivel',
    testBody: (levels: string, max: number) =>
      `Un desafío corto para ubicarte entre ${levels}. Hasta ${max} preguntas, unos 3 minutos.`,
    testBadge: 'SI YA SABÉS ALGO',
    testHint: 'Abre el test de nivel. No se guarda nada hasta que confirmes el resultado.',
    testSoon: 'El test de nivel llega con la próxima actualización del servidor.',
    singleLevel: (level: string) =>
      `Este curso por ahora tiene sólo el nivel ${level}: empezás desde el principio.`,
    fromStartTitle: (level: string) => `Prefiero empezar desde ${level}`,
    fromStartBody: (title: string) => `Desde la primera unidad: «${title}».`,
    fromStartBodyPlain: 'Desde la primera unidad del curso.',
    fromStartHint: 'Empieza este curso desde el principio. Tus otros cursos no cambian.',
    starting: 'Empezando…',
    keepNote: 'Tu XP, tu nivel de jugador y tus otros cursos no cambian.',
    alreadyTitle: 'Ya estás en este curso',
    alreadyMessage: (level: string) => `Conservás tu nivel (${level}) y tu progreso.`,
    goToCourse: 'Ir al curso',
    startErrorTitle: 'No pudimos empezar el curso',
    startErrorMessage: 'Revisá tu conexión y probá de nuevo. No se cambió nada.',
    retry: 'Reintentar',
    cancel: 'Cancelar',
  },
  en: {
    title: 'New course',
    loading: 'Getting your course ready…',
    notFoundTitle: 'Course unavailable',
    notFoundMessage: 'This course isn’t available right now.',
    back: 'Go back',
    heroOverline: 'YOU’RE STARTING A NEW COURSE',
    fromLanguage: (source: string) => `from ${source}`,
    levelsLabel: 'Levels',
    rankedLabel: 'Ranked',
    rankedYes: 'Available',
    rankedNo: 'No ranked yet',
    question: 'Where do you want to start?',
    testTitle: 'Take the placement test',
    testBody: (levels: string, max: number) =>
      `A short challenge to place you between ${levels}. Up to ${max} questions, about 3 minutes.`,
    testBadge: 'IF YOU ALREADY KNOW SOME',
    testHint: 'Opens the placement test. Nothing is saved until you confirm your result.',
    testSoon: 'The placement test arrives with the next server update.',
    singleLevel: (level: string) =>
      `For now this course only has level ${level}, so you’ll start from the beginning.`,
    fromStartTitle: (level: string) => `I’d rather start from ${level}`,
    fromStartBody: (title: string) => `From the first unit: “${title}”.`,
    fromStartBodyPlain: 'From the first unit of the course.',
    fromStartHint: 'Starts this course from the beginning. Your other courses don’t change.',
    starting: 'Starting…',
    keepNote: 'Your XP, player level and other courses stay the same.',
    alreadyTitle: 'You’re already in this course',
    alreadyMessage: (level: string) => `You keep your level (${level}) and your progress.`,
    goToCourse: 'Go to course',
    startErrorTitle: 'We couldn’t start the course',
    startErrorMessage: 'Check your connection and try again. Nothing was changed.',
    retry: 'Retry',
    cancel: 'Cancel',
  },
});

export const placementStrings = defineStrings({
  es: {
    title: (language: string) => `Test de nivel de ${lower(language)}`,
    introOverline: 'DESAFÍO DE NIVEL',
    introTitle: '¿Cuánto sabés?',
    introBody: 'Respondé unas preguntas cortas y te decimos por dónde te conviene empezar.',
    whatWeCheck: 'QUÉ VAMOS A VER',
    dimension: (d: PlacementDimension) => ES_DIMENSIONS[d],
    ruleHarder: 'Si acertás, las preguntas se ponen más difíciles.',
    ruleStop: 'Si algo te cuesta, el test termina antes: no hace falta saberlo todo.',
    ruleSafe: 'No suma XP ni cambia tus otros cursos. Si salís, no se guarda nada.',
    duration: (max: number) => `Hasta ${max} preguntas · unos 3 minutos`,
    startChallenge: 'Empezar el desafío',
    exit: 'Salir del test',
    exitTitle: '¿Salir del test?',
    exitMessage: 'No se guarda nada. Podés hacerlo de nuevo cuando quieras.',
    exitConfirm: 'Salir',
    exitCancel: 'Seguir',
    progress: (n: number, max: number) => `Pregunta ${n}, como máximo ${max}`,
    questionChip: (n: number) => `Pregunta ${n}`,
    bandChip: (level: string) => `Nivel ${level}`,
    correct: '¡Correcto!',
    typo: '¡Bien! Ojo con la ortografía',
    incorrect: 'No era esa',
    levelUp: (level: string) => `¡Subís al nivel ${level}!`,
    next: 'Siguiente',
    seeResult: 'Ver mi resultado',
    resultOverline: 'TU RESULTADO',
    estimated: 'Tu nivel estimado es',
    levelA11y: (level: string, name: string) => `Tu nivel estimado es ${level}, ${name}`,
    levelName: (level: string) => levelInfo(ES_LEVELS, level).name,
    levelMeaning: (level: string) => levelInfo(ES_LEVELS, level).meaning,
    explain: ({ level, mastered, partial, topReached }: Explain) =>
      topReached
        ? `Respondiste bien todo lo que el curso tiene por ahora. Empezás por ${level}, el nivel más alto disponible, para afianzar lo que ya sabés.`
        : mastered.length > 0
          ? `Respondiste bien lo esencial de ${mastered.join(' y ')}${partial ? ` y parte de ${level}` : ''}. Podés empezar directamente en ${level}.`
          : partial
            ? `Ya conocés parte de lo básico. Empezar por ${level} te ayuda a consolidarlo: vas a avanzar rápido.`
            : `Vas a construir las bases desde el principio, a tu ritmo.`,
    score: (correct: number, answered: number) => `${correct} de ${answered} respuestas correctas`,
    startPoint: 'POR DÓNDE EMPEZÁS',
    startUnit: (level: string, title: string) => `Nivel ${level} · Unidad 1: «${title}»`,
    disclaimer:
      'Es una estimación para elegir por dónde empezar, no un certificado oficial. Podés cambiarlo empezando desde A1.',
    startCourse: 'Comenzar curso',
    startFromA1: 'Prefiero empezar desde A1',
    retake: 'Hacer el test de nuevo',
    saving: 'Guardando tu resultado…',
    saveError:
      'No pudimos guardar tu resultado. Revisá tu conexión y probá de nuevo: tus respuestas siguen acá.',
    saveUnsupported:
      'Para guardar el resultado del test hace falta una actualización del servidor. Mientras tanto podés empezar desde A1.',
    retry: 'Reintentar',
    alreadyTitle: 'Ya tenías este curso',
    alreadyMessage: (level: string) =>
      `Conservamos tu nivel (${level}) y tu progreso. El resultado de este test no los cambia.`,
    ok: 'Entendido',
    noTestTitle: 'Este curso no tiene test de nivel',
    noTestMessage: 'Por ahora tiene un solo nivel: empezás desde el principio.',
  },
  en: {
    title: (language: string) => `${language} placement test`,
    introOverline: 'LEVEL CHALLENGE',
    introTitle: 'How much do you know?',
    introBody: 'Answer a few short questions and we’ll tell you where to start.',
    whatWeCheck: 'WHAT WE’LL CHECK',
    dimension: (d: PlacementDimension) => EN_DIMENSIONS[d],
    ruleHarder: 'Get them right and the questions get harder.',
    ruleStop: 'If something is hard, the test ends early: you don’t need to know it all.',
    ruleSafe: 'It doesn’t add XP or change your other courses. If you leave, nothing is saved.',
    duration: (max: number) => `Up to ${max} questions · about 3 minutes`,
    startChallenge: 'Start the challenge',
    exit: 'Leave the test',
    exitTitle: 'Leave the test?',
    exitMessage: 'Nothing will be saved. You can take it again anytime.',
    exitConfirm: 'Leave',
    exitCancel: 'Keep going',
    progress: (n: number, max: number) => `Question ${n}, up to ${max}`,
    questionChip: (n: number) => `Question ${n}`,
    bandChip: (level: string) => `Level ${level}`,
    correct: 'Correct!',
    typo: 'Nice! Watch your spelling',
    incorrect: 'Not that one',
    levelUp: (level: string) => `You’re moving up to ${level}!`,
    next: 'Next',
    seeResult: 'See my result',
    resultOverline: 'YOUR RESULT',
    estimated: 'Your estimated level is',
    levelA11y: (level: string, name: string) => `Your estimated level is ${level}, ${name}`,
    levelName: (level: string) => levelInfo(EN_LEVELS, level).name,
    levelMeaning: (level: string) => levelInfo(EN_LEVELS, level).meaning,
    explain: ({ level, mastered, partial, topReached }: Explain) =>
      topReached
        ? `You got everything this course has so far right. You’ll start at ${level}, the highest level available, to strengthen what you know.`
        : mastered.length > 0
          ? `You got the essentials of ${mastered.join(' and ')} right${partial ? `, and part of ${level}` : ''}. You can start right at ${level}.`
          : partial
            ? `You already know some of the basics. Starting at ${level} helps you lock them in: you’ll move fast.`
            : `You’ll build the foundations from the start, at your own pace.`,
    score: (correct: number, answered: number) => `${correct} of ${answered} answers correct`,
    startPoint: 'WHERE YOU’LL START',
    startUnit: (level: string, title: string) => `Level ${level} · Unit 1: “${title}”`,
    disclaimer:
      'This is an estimate to choose where to start, not an official certificate. You can still start from A1.',
    startCourse: 'Start course',
    startFromA1: 'I’d rather start from A1',
    retake: 'Take the test again',
    saving: 'Saving your result…',
    saveError:
      'We couldn’t save your result. Check your connection and try again: your answers are still here.',
    saveUnsupported:
      'Saving a test result needs a server update. In the meantime, you can start from A1.',
    retry: 'Retry',
    alreadyTitle: 'You already had this course',
    alreadyMessage: (level: string) =>
      `We kept your level (${level}) and your progress. This test result doesn’t change them.`,
    ok: 'Got it',
    noTestTitle: 'This course has no placement test',
    noTestMessage: 'For now it has a single level, so you’ll start from the beginning.',
  },
});
