import { defineStrings } from '..';

/**
 * «Tus cursos» (src/app/courses.tsx). Los nombres de idiomas llegan ya traducidos (languageName); en
 * español, dentro de una frase van en minúscula («desde español»).
 */
const lower = (s: string) => s.toLocaleLowerCase('es');
const lowerPt = (s: string) => s.toLocaleLowerCase('pt-BR');
const lowerIt = (s: string) => s.toLocaleLowerCase('it');
export const coursesStrings = defineStrings({
  es: {
    title: 'Tus cursos',
    loading: 'Cargando tus cursos…',
    loadError: 'No pudimos cargar tus cursos.',
    progressError: 'No pudimos cargar el progreso. Toca para reintentar.',
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
    startsAtA1: 'Empiezas desde A1',
    unavailable: 'No disponible por ahora',
    switching: 'Cambiando…',
    noMoreCourses: 'Ya estás en todos los cursos disponibles. ¡Pronto llegan más!',
    switchErrorTitle: 'No pudimos cambiar de curso',
    switchErrorMessage: 'Tu progreso está a salvo. Vuelve a intentarlo en un rato.',
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
      'Elige entre hacer el test de nivel o empezar desde A1. Tus otros cursos no cambian.',
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
  'pt-BR': {
    title: 'Seus cursos',
    loading: 'Carregando seus cursos…',
    loadError: 'Não conseguimos carregar seus cursos.',
    progressError: 'Não conseguimos carregar o progresso. Toque para tentar de novo.',
    studyingNow: 'VOCÊ ESTÁ APRENDENDO',
    fromLanguage: (source: string) => `a partir do ${lowerPt(source)}`,
    levelProgress: (level: string, done: number, total: number) =>
      `Nível ${level} · ${done} de ${total} lições`,
    levelOnly: (level: string) => `Nível ${level}`,
    keepLearning: 'Continuar aprendendo',
    xpNote: 'Seu XP e seu nível de jogador são os mesmos em todos os cursos.',
    myCourses: 'MEUS CURSOS',
    available: 'COMEÇAR UM CURSO NOVO',
    forSpeakers: (source: string) => `Para falantes de ${lowerPt(source)}`,
    startsAtA1: 'Começa do A1',
    unavailable: 'Indisponível no momento',
    switching: 'Trocando…',
    noMoreCourses: 'Você já está em todos os cursos disponíveis. Em breve chegam mais!',
    switchErrorTitle: 'Não conseguimos trocar de curso',
    switchErrorMessage: 'Seu progresso está seguro. Tente de novo daqui a pouco.',
    activeA11y: (target: string, source: string, level: string) =>
      `Curso atual: ${target} a partir do ${lowerPt(source)}, nível ${level}`,
    courseA11y: (target: string, source: string, level: string, percent: number | null) =>
      percent === null
        ? `${target} a partir do ${lowerPt(source)}, nível ${level}`
        : `${target} a partir do ${lowerPt(source)}, nível ${level}, ${percent} por cento`,
    switchHint: 'Passa a estudar este curso. O progresso de cada curso é mantido.',
    startHint: 'Começa este curso do A1. Seus outros cursos não mudam.',
    startsWithTest: 'Teste de nível ou do A1',
    startWithTestHint:
      'Escolha entre fazer o teste de nível ou começar do A1. Seus outros cursos não mudam.',
  },
  it: {
    title: 'I tuoi corsi',
    loading: 'Caricamento dei tuoi corsi…',
    loadError: 'Non siamo riusciti a caricare i tuoi corsi.',
    progressError: 'Non siamo riusciti a caricare i progressi. Tocca per riprovare.',
    studyingNow: 'STAI IMPARANDO',
    fromLanguage: (source: string) => `per chi parla ${lowerIt(source)}`,
    levelProgress: (level: string, done: number, total: number) =>
      `Livello ${level} · ${done} di ${total} lezioni`,
    levelOnly: (level: string) => `Livello ${level}`,
    keepLearning: 'Continua a imparare',
    xpNote: 'I tuoi XP e il tuo livello giocatore sono gli stessi in tutti i corsi.',
    myCourses: 'I MIEI CORSI',
    available: 'INIZIA UN NUOVO CORSO',
    forSpeakers: (source: string) => `Per chi parla ${lowerIt(source)}`,
    startsAtA1: 'Si parte da A1',
    unavailable: 'Non disponibile per ora',
    switching: 'Cambio in corso…',
    noMoreCourses: 'Sei già iscritto a tutti i corsi disponibili. Presto ne arriveranno altri!',
    switchErrorTitle: 'Non siamo riusciti a cambiare corso',
    switchErrorMessage: 'I tuoi progressi sono al sicuro. Riprova tra poco.',
    activeA11y: (target: string, source: string, level: string) =>
      `Corso attuale: ${target} per chi parla ${lowerIt(source)}, livello ${level}`,
    courseA11y: (target: string, source: string, level: string, percent: number | null) =>
      percent === null
        ? `${target} per chi parla ${lowerIt(source)}, livello ${level}`
        : `${target} per chi parla ${lowerIt(source)}, livello ${level}, ${percent} per cento`,
    switchHint: 'Passa a questo corso. Ogni corso mantiene i suoi progressi.',
    startHint: 'Inizia questo corso da A1. Gli altri tuoi corsi non cambiano.',
    startsWithTest: 'Test di livello o da A1',
    startWithTestHint:
      'Scegli se fare il test di livello o iniziare da A1. Gli altri tuoi corsi non cambiano.',
  },
});
