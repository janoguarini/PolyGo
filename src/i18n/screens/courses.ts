import { defineStrings } from '..';

/**
 * «Tus cursos» (src/app/courses.tsx). Los nombres de idiomas llegan ya traducidos (languageName); en
 * español, dentro de una frase van en minúscula («desde español»).
 */
const lower = (s: string) => s.toLocaleLowerCase('es');
export const coursesStrings = defineStrings({
  es: {
    title: 'Tus cursos',
    loading: 'Cargando tus cursos…',
    loadError: 'No pudimos cargar tus cursos.',
    progressError: 'No pudimos cargar el progreso. Tocá para reintentar.',
    studyingNow: 'ESTÁS APRENDIENDO',
    fromLanguage: (source: string) => `desde ${lower(source)}`,
    levelProgress: (level: string, done: number, total: number) =>
      `Nivel ${level} · ${done} de ${total} lecciones`,
    levelOnly: (level: string) => `Nivel ${level}`,
    keepLearning: 'Seguir aprendiendo',
    xpNote: 'Tu XP y tu nivel de jugador son los mismos en todos los cursos.',
    myCourses: 'MIS CURSOS',
    available: 'EMPEZAR UN CURSO NUEVO',
    forSpeakers: (source: string) => `Para hablantes de ${lower(source)}`,
    startsAtA1: 'Empezás desde A1',
    unavailable: 'No disponible por ahora',
    switching: 'Cambiando…',
    noMoreCourses: 'Ya estás en todos los cursos disponibles. ¡Pronto llegan más!',
    switchErrorTitle: 'No pudimos cambiar de curso',
    switchErrorMessage: 'Tu progreso está a salvo. Probá de nuevo en un rato.',
    activeA11y: (target: string, source: string, level: string) =>
      `Curso actual: ${target} desde ${lower(source)}, nivel ${level}`,
    courseA11y: (target: string, source: string, level: string, percent: number | null) =>
      percent === null
        ? `${target} desde ${lower(source)}, nivel ${level}`
        : `${target} desde ${lower(source)}, nivel ${level}, ${percent} por ciento`,
    switchHint: 'Pasa a estudiar este curso. El progreso de cada curso se conserva.',
    startHint: 'Empieza este curso desde A1. Tus otros cursos no cambian.',
    startsWithTest: 'Test de nivel o desde A1',
    startWithTestHint:
      'Elegí entre hacer el test de nivel o empezar desde A1. Tus otros cursos no cambian.',
  },
  en: {
    title: 'Your courses',
    loading: 'Loading your courses…',
    loadError: 'We couldn’t load your courses.',
    progressError: 'We couldn’t load your progress. Tap to retry.',
    studyingNow: 'YOU’RE LEARNING',
    fromLanguage: (source: string) => `from ${source}`,
    levelProgress: (level: string, done: number, total: number) =>
      `Level ${level} · ${done} of ${total} lessons`,
    levelOnly: (level: string) => `Level ${level}`,
    keepLearning: 'Keep learning',
    xpNote: 'Your XP and player level are shared across all your courses.',
    myCourses: 'MY COURSES',
    available: 'START A NEW COURSE',
    forSpeakers: (source: string) => `For ${source} speakers`,
    startsAtA1: 'Starts at A1',
    unavailable: 'Not available right now',
    switching: 'Switching…',
    noMoreCourses: 'You’re already in every available course. More are coming soon!',
    switchErrorTitle: 'We couldn’t switch courses',
    switchErrorMessage: 'Your progress is safe. Try again in a bit.',
    activeA11y: (target: string, source: string, level: string) =>
      `Current course: ${target} from ${source}, level ${level}`,
    courseA11y: (target: string, source: string, level: string, percent: number | null) =>
      percent === null
        ? `${target} from ${source}, level ${level}`
        : `${target} from ${source}, level ${level}, ${percent} percent`,
    switchHint: 'Switches to this course. Each course keeps its own progress.',
    startHint: 'Starts this course at A1. Your other courses don’t change.',
    startsWithTest: 'Placement test or start at A1',
    startWithTestHint:
      'Choose between taking the placement test or starting at A1. Your other courses don’t change.',
  },
});
