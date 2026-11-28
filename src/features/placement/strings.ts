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
    meaning: 'Entiendes y usas frases muy básicas para presentarte y hablar de lo cotidiano.',
  },
  A2: {
    name: 'Básico',
    meaning: 'Te manejas en situaciones simples y frecuentes, y puedes contar lo que hiciste.',
  },
  B1: {
    name: 'Intermedio',
    meaning: 'Te defiendes en la mayoría de las situaciones y das tu opinión con frases simples.',
  },
  B2: {
    name: 'Intermedio alto',
    meaning: 'Hablas con fluidez sobre temas variados y entiendes textos más complejos.',
  },
  C1: {
    name: 'Avanzado',
    meaning: 'Usas el idioma con soltura y precisión en casi cualquier contexto.',
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

const PT_LEVELS: Record<string, { name: string; meaning: string }> = {
  A1: {
    name: 'Iniciante',
    meaning: 'Você entende e usa frases bem básicas para se apresentar e falar do dia a dia.',
  },
  A2: {
    name: 'Básico',
    meaning: 'Você se vira em situações simples e frequentes e consegue contar o que fez.',
  },
  B1: {
    name: 'Intermediário',
    meaning: 'Você se sai bem na maioria das situações e dá sua opinião com frases simples.',
  },
  B2: {
    name: 'Intermediário avançado',
    meaning: 'Você fala com fluência sobre vários temas e entende textos mais complexos.',
  },
  C1: {
    name: 'Avançado',
    meaning: 'Você usa o idioma com desenvoltura e precisão em quase qualquer contexto.',
  },
};

const IT_LEVELS: Record<string, { name: string; meaning: string }> = {
  A1: {
    name: 'Principiante',
    meaning:
      'Capisci e usi frasi molto semplici per presentarti e parlare della vita di tutti i giorni.',
  },
  A2: {
    name: 'Elementare',
    meaning: 'Te la cavi in situazioni semplici e frequenti e sai raccontare cosa hai fatto.',
  },
  B1: {
    name: 'Intermedio',
    meaning:
      'Te la cavi nella maggior parte delle situazioni e dai la tua opinione con frasi semplici.',
  },
  B2: {
    name: 'Intermedio superiore',
    meaning: 'Parli con scioltezza di argomenti diversi e capisci testi più complessi.',
  },
  C1: {
    name: 'Avanzato',
    meaning: 'Usi la lingua con disinvoltura e precisione in quasi ogni contesto.',
  },
};

const FR_LEVELS: Record<string, { name: string; meaning: string }> = {
  A1: {
    name: 'Débutant',
    meaning:
      'Tu comprends et utilises des phrases très simples pour te présenter et parler du quotidien.',
  },
  A2: {
    name: 'Élémentaire',
    meaning:
      'Tu te débrouilles dans des situations simples et courantes, et tu sais raconter ce que tu as fait.',
  },
  B1: {
    name: 'Intermédiaire',
    meaning:
      'Tu t’en sors dans la plupart des situations et tu donnes ton avis avec des phrases simples.',
  },
  B2: {
    name: 'Intermédiaire avancé',
    meaning: 'Tu parles avec aisance de sujets variés et tu comprends des textes plus complexes.',
  },
  C1: {
    name: 'Avancé',
    meaning: 'Tu utilises la langue avec aisance et précision dans presque tous les contextes.',
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

const PT_DIMENSIONS: Record<PlacementDimension, string> = {
  vocabulary: 'Vocabulário',
  grammar: 'Gramática',
  sentences: 'Compreensão de frases',
  structures: 'Estrutura das frases',
  context: 'Uso em contexto',
};

const IT_DIMENSIONS: Record<PlacementDimension, string> = {
  vocabulary: 'Vocabolario',
  grammar: 'Grammatica',
  sentences: 'Comprensione delle frasi',
  structures: 'Struttura delle frasi',
  context: 'Uso nel contesto',
};

const FR_DIMENSIONS: Record<PlacementDimension, string> = {
  vocabulary: 'Vocabulaire',
  grammar: 'Grammaire',
  sentences: 'Compréhension des phrases',
  structures: 'Structure des phrases',
  context: 'Usage en contexte',
};

const lowerPt = (s: string) => s.toLocaleLowerCase('pt-BR');
const lowerIt = (s: string) => s.toLocaleLowerCase('it');
/** «dall'inglese», «dallo spagnolo», «dal francese». */
const fromIt = (language: string) => {
  const l = lowerIt(language);
  if (/^[aeiouh]/.test(l)) return `dall’${l}`;
  if (/^(s[^aeiou]|z|gn|ps|x|y)/.test(l)) return `dallo ${l}`;
  return `dal ${l}`;
};
const lowerFr = (s: string) => s.toLocaleLowerCase('fr');
const frElides = (l: string) => /^[aeiouyhéèêàâîôû]/.test(l);
/** «d’anglais», «de français». */
const ofFr = (language: string) => {
  const l = lowerFr(language);
  return frElides(l) ? `d’${l}` : `de ${l}`;
};
/** «depuis l’anglais», «depuis le français». */
const fromFr = (language: string) => {
  const l = lowerFr(language);
  return frElides(l) ? `depuis l’${l}` : `depuis le ${l}`;
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
    heroOverline: 'EMPIEZAS UN CURSO NUEVO',
    fromLanguage: (source: string) => `desde ${lower(source)}`,
    levelsLabel: 'Niveles',
    rankedLabel: 'Ranked',
    rankedYes: 'Disponible',
    rankedNo: 'Sin ranked aún',
    question: '¿Por dónde quieres empezar?',
    testTitle: 'Hacer el test de nivel',
    testBody: (levels: string, max: number) =>
      `Un desafío corto para ubicarte entre ${levels}. Hasta ${max} preguntas, unos 3 minutos.`,
    testBadge: 'SI YA SABES ALGO',
    testHint: 'Abre el test de nivel. No se guarda nada hasta que confirmes el resultado.',
    testSoon: 'El test de nivel llega con la próxima actualización del servidor.',
    singleLevel: (level: string) =>
      `Este curso por ahora tiene sólo el nivel ${level}: empiezas desde el principio.`,
    fromStartTitle: (level: string) => `Prefiero empezar desde ${level}`,
    fromStartBody: (title: string) => `Desde la primera unidad: «${title}».`,
    fromStartBodyPlain: 'Desde la primera unidad del curso.',
    fromStartHint: 'Empieza este curso desde el principio. Tus otros cursos no cambian.',
    starting: 'Empezando…',
    keepNote: 'Tu XP, tu nivel de jugador y tus otros cursos no cambian.',
    alreadyTitle: 'Ya estás en este curso',
    alreadyMessage: (level: string) => `Conservas tu nivel (${level}) y tu progreso.`,
    goToCourse: 'Ir al curso',
    startErrorTitle: 'No pudimos empezar el curso',
    startErrorMessage: 'Revisa tu conexión y vuelve a intentarlo. No se cambió nada.',
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
  'pt-BR': {
    title: 'Novo curso',
    loading: 'Preparando o curso…',
    notFoundTitle: 'Curso indisponível',
    notFoundMessage: 'Este curso não está disponível no momento.',
    back: 'Voltar',
    heroOverline: 'VOCÊ ESTÁ COMEÇANDO UM CURSO NOVO',
    fromLanguage: (source: string) => `a partir do ${lowerPt(source)}`,
    levelsLabel: 'Níveis',
    rankedLabel: 'Ranked',
    rankedYes: 'Disponível',
    rankedNo: 'Sem ranked ainda',
    question: 'Por onde você quer começar?',
    testTitle: 'Fazer o teste de nível',
    testBody: (levels: string, max: number) =>
      `Um desafio rápido para descobrir seu nível entre ${levels}. Até ${max} perguntas, uns 3 minutos.`,
    testBadge: 'SE VOCÊ JÁ SABE ALGUMA COISA',
    testHint: 'Abre o teste de nível. Nada é salvo até você confirmar o resultado.',
    testSoon: 'O teste de nível chega com a próxima atualização do servidor.',
    singleLevel: (level: string) =>
      `Por enquanto este curso só tem o nível ${level}: você começa do início.`,
    fromStartTitle: (level: string) => `Prefiro começar do ${level}`,
    fromStartBody: (title: string) => `Desde a primeira unidade: “${title}”.`,
    fromStartBodyPlain: 'Desde a primeira unidade do curso.',
    fromStartHint: 'Começa este curso do início. Seus outros cursos não mudam.',
    starting: 'Começando…',
    keepNote: 'Seu XP, seu nível de jogador e seus outros cursos não mudam.',
    alreadyTitle: 'Você já está neste curso',
    alreadyMessage: (level: string) => `Você mantém seu nível (${level}) e seu progresso.`,
    goToCourse: 'Ir para o curso',
    startErrorTitle: 'Não conseguimos começar o curso',
    startErrorMessage: 'Confira sua conexão e tente de novo. Nada foi alterado.',
    retry: 'Tentar de novo',
    cancel: 'Cancelar',
  },
  it: {
    title: 'Nuovo corso',
    loading: 'Stiamo preparando il corso…',
    notFoundTitle: 'Corso non disponibile',
    notFoundMessage: 'Questo corso non è disponibile al momento.',
    back: 'Indietro',
    heroOverline: 'STAI INIZIANDO UN NUOVO CORSO',
    fromLanguage: (source: string) => fromIt(source),
    levelsLabel: 'Livelli',
    rankedLabel: 'Ranked',
    rankedYes: 'Disponibile',
    rankedNo: 'Ranked non ancora disponibile',
    question: 'Da dove vuoi iniziare?',
    testTitle: 'Fai il test di livello',
    testBody: (levels: string, max: number) =>
      `Una breve sfida per capire il tuo livello tra ${levels}. Fino a ${max} domande, circa 3 minuti.`,
    testBadge: 'SE SAI GIÀ QUALCOSA',
    testHint: 'Apre il test di livello. Non viene salvato nulla finché non confermi il risultato.',
    testSoon: 'Il test di livello arriverà con il prossimo aggiornamento del server.',
    singleLevel: (level: string) =>
      `Per ora questo corso ha solo il livello ${level}: inizi dal principio.`,
    fromStartTitle: (level: string) => `Preferisco iniziare da ${level}`,
    fromStartBody: (title: string) => `Dalla prima unità: «${title}».`,
    fromStartBodyPlain: 'Dalla prima unità del corso.',
    fromStartHint: 'Inizia questo corso dal principio. Gli altri tuoi corsi non cambiano.',
    starting: 'Inizio in corso…',
    keepNote: 'I tuoi XP, il tuo livello giocatore e gli altri tuoi corsi non cambiano.',
    alreadyTitle: 'Stai già seguendo questo corso',
    alreadyMessage: (level: string) => `Mantieni il tuo livello (${level}) e i tuoi progressi.`,
    goToCourse: 'Vai al corso',
    startErrorTitle: 'Non siamo riusciti ad avviare il corso',
    startErrorMessage: 'Controlla la connessione e riprova. Non è stato modificato nulla.',
    retry: 'Riprova',
    cancel: 'Annulla',
  },
  fr: {
    title: 'Nouveau cours',
    loading: 'Préparation du cours…',
    notFoundTitle: 'Cours indisponible',
    notFoundMessage: 'Ce cours n’est pas disponible pour le moment.',
    back: 'Retour',
    heroOverline: 'TU COMMENCES UN NOUVEAU COURS',
    fromLanguage: (source: string) => fromFr(source),
    levelsLabel: 'Niveaux',
    rankedLabel: 'Ranked',
    rankedYes: 'Disponible',
    rankedNo: 'Pas encore de Ranked',
    question: 'Par où veux-tu commencer ?',
    testTitle: 'Passer le test de niveau',
    testBody: (levels: string, max: number) =>
      `Un petit défi pour te situer entre ${levels}. Jusqu’à ${max} questions, environ 3 minutes.`,
    testBadge: 'SI TU T’Y CONNAIS DÉJÀ UN PEU',
    testHint: 'Ouvre le test de niveau. Rien n’est enregistré avant que tu confirmes le résultat.',
    testSoon: 'Le test de niveau arrive avec la prochaine mise à jour du serveur.',
    singleLevel: (level: string) =>
      `Pour l’instant, ce cours n’a que le niveau ${level} : tu commences depuis le début.`,
    fromStartTitle: (level: string) => `Je préfère commencer au niveau ${level}`,
    fromStartBody: (title: string) => `Dès la première unité : « ${title} ».`,
    fromStartBodyPlain: 'Dès la première unité du cours.',
    fromStartHint: 'Commence ce cours depuis le début. Tes autres cours ne changent pas.',
    starting: 'C’est parti…',
    keepNote: 'Ton XP, ton niveau de joueur et tes autres cours ne changent pas.',
    alreadyTitle: 'Tu suis déjà ce cours',
    alreadyMessage: (level: string) => `Tu gardes ton niveau (${level}) et ta progression.`,
    goToCourse: 'Aller au cours',
    startErrorTitle: 'Impossible de commencer le cours',
    startErrorMessage: 'Vérifie ta connexion et réessaie. Rien n’a été modifié.',
    retry: 'Réessayer',
    cancel: 'Annuler',
  },
});

export const placementStrings = defineStrings({
  es: {
    title: (language: string) => `Test de nivel de ${lower(language)}`,
    introOverline: 'DESAFÍO DE NIVEL',
    introTitle: '¿Cuánto sabes?',
    introBody: 'Responde unas preguntas cortas y te decimos por dónde te conviene empezar.',
    whatWeCheck: 'QUÉ VAMOS A VER',
    dimension: (d: PlacementDimension) => ES_DIMENSIONS[d],
    ruleHarder: 'Si aciertas, las preguntas se ponen más difíciles.',
    ruleStop: 'Si algo te cuesta, el test termina antes: no hace falta saberlo todo.',
    ruleSafe: 'No suma XP ni cambia tus otros cursos. Si sales, no se guarda nada.',
    duration: (max: number) => `Hasta ${max} preguntas · unos 3 minutos`,
    startChallenge: 'Empezar el desafío',
    exit: 'Salir del test',
    exitTitle: '¿Salir del test?',
    exitMessage: 'No se guarda nada. Puedes hacerlo de nuevo cuando quieras.',
    exitConfirm: 'Salir',
    exitCancel: 'Seguir',
    progress: (n: number, max: number) => `Pregunta ${n}, como máximo ${max}`,
    questionChip: (n: number) => `Pregunta ${n}`,
    bandChip: (level: string) => `Nivel ${level}`,
    correct: '¡Correcto!',
    typo: '¡Bien! Ojo con la ortografía',
    incorrect: 'No era esa',
    levelUp: (level: string) => `¡Subes al nivel ${level}!`,
    next: 'Siguiente',
    seeResult: 'Ver mi resultado',
    resultOverline: 'TU RESULTADO',
    estimated: 'Tu nivel estimado es',
    levelA11y: (level: string, name: string) => `Tu nivel estimado es ${level}, ${name}`,
    levelName: (level: string) => levelInfo(ES_LEVELS, level).name,
    levelMeaning: (level: string) => levelInfo(ES_LEVELS, level).meaning,
    explain: ({ level, mastered, partial, topReached }: Explain) =>
      topReached
        ? `Respondiste bien todo lo que el curso tiene por ahora. Empiezas por ${level}, el nivel más alto disponible, para afianzar lo que ya sabes.`
        : mastered.length > 0
          ? `Respondiste bien lo esencial de ${mastered.join(' y ')}${partial ? ` y parte de ${level}` : ''}. Puedes empezar directamente en ${level}.`
          : partial
            ? `Ya conoces parte de lo básico. Empezar por ${level} te ayuda a consolidarlo: vas a avanzar rápido.`
            : `Vas a construir las bases desde el principio, a tu ritmo.`,
    score: (correct: number, answered: number) => `${correct} de ${answered} respuestas correctas`,
    startPoint: 'POR DÓNDE EMPIEZAS',
    startUnit: (level: string, title: string) => `Nivel ${level} · Unidad 1: «${title}»`,
    disclaimer:
      'Es una estimación para elegir por dónde empezar, no un certificado oficial. Puedes cambiarlo empezando desde A1.',
    startCourse: 'Comenzar curso',
    startFromA1: 'Prefiero empezar desde A1',
    retake: 'Hacer el test de nuevo',
    saving: 'Guardando tu resultado…',
    saveError:
      'No pudimos guardar tu resultado. Revisa tu conexión y vuelve a intentarlo: tus respuestas siguen aquí.',
    saveUnsupported:
      'Para guardar el resultado del test hace falta una actualización del servidor. Mientras tanto puedes empezar desde A1.',
    retry: 'Reintentar',
    alreadyTitle: 'Ya tenías este curso',
    alreadyMessage: (level: string) =>
      `Conservamos tu nivel (${level}) y tu progreso. El resultado de este test no los cambia.`,
    ok: 'Entendido',
    noTestTitle: 'Este curso no tiene test de nivel',
    noTestMessage: 'Por ahora tiene un solo nivel: empiezas desde el principio.',
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
  'pt-BR': {
    title: (language: string) => `Teste de nível de ${lowerPt(language)}`,
    introOverline: 'DESAFIO DE NÍVEL',
    introTitle: 'Quanto você sabe?',
    introBody: 'Responda algumas perguntas rápidas e a gente te diz por onde vale a pena começar.',
    whatWeCheck: 'O QUE VAMOS AVALIAR',
    dimension: (d: PlacementDimension) => PT_DIMENSIONS[d],
    ruleHarder: 'Se você acertar, as perguntas ficam mais difíceis.',
    ruleStop: 'Se algo ficar difícil, o teste termina antes: você não precisa saber tudo.',
    ruleSafe: 'Não soma XP nem muda seus outros cursos. Se você sair, nada é salvo.',
    duration: (max: number) => `Até ${max} perguntas · uns 3 minutos`,
    startChallenge: 'Começar o desafio',
    exit: 'Sair do teste',
    exitTitle: 'Sair do teste?',
    exitMessage: 'Nada será salvo. Você pode fazer de novo quando quiser.',
    exitConfirm: 'Sair',
    exitCancel: 'Continuar',
    progress: (n: number, max: number) => `Pergunta ${n}, no máximo ${max}`,
    questionChip: (n: number) => `Pergunta ${n}`,
    bandChip: (level: string) => `Nível ${level}`,
    correct: 'Correto!',
    typo: 'Boa! Cuidado com a ortografia',
    incorrect: 'Não era essa',
    levelUp: (level: string) => `Você subiu para o nível ${level}!`,
    next: 'Próxima',
    seeResult: 'Ver meu resultado',
    resultOverline: 'SEU RESULTADO',
    estimated: 'Seu nível estimado é',
    levelA11y: (level: string, name: string) => `Seu nível estimado é ${level}, ${name}`,
    levelName: (level: string) => levelInfo(PT_LEVELS, level).name,
    levelMeaning: (level: string) => levelInfo(PT_LEVELS, level).meaning,
    explain: ({ level, mastered, partial, topReached }: Explain) =>
      topReached
        ? `Você acertou tudo o que o curso tem por enquanto. Vai começar pelo ${level}, o nível mais alto disponível, para consolidar o que já sabe.`
        : mastered.length > 0
          ? `Você acertou o essencial de ${mastered.join(' e ')}${partial ? ` e parte do ${level}` : ''}. Pode começar direto no ${level}.`
          : partial
            ? `Você já conhece parte do básico. Começar pelo ${level} ajuda a consolidar: você vai avançar rápido.`
            : `Você vai construir a base desde o início, no seu ritmo.`,
    score: (correct: number, answered: number) => `${correct} de ${answered} respostas corretas`,
    startPoint: 'POR ONDE VOCÊ COMEÇA',
    startUnit: (level: string, title: string) => `Nível ${level} · Unidade 1: “${title}”`,
    disclaimer:
      'É uma estimativa para escolher por onde começar, não um certificado oficial. Você pode mudar isso começando do A1.',
    startCourse: 'Começar curso',
    startFromA1: 'Prefiro começar do A1',
    retake: 'Fazer o teste de novo',
    saving: 'Salvando seu resultado…',
    saveError:
      'Não conseguimos salvar seu resultado. Confira sua conexão e tente de novo: suas respostas continuam aqui.',
    saveUnsupported:
      'Para salvar o resultado do teste é preciso uma atualização do servidor. Enquanto isso, você pode começar do A1.',
    retry: 'Tentar de novo',
    alreadyTitle: 'Você já tinha este curso',
    alreadyMessage: (level: string) =>
      `Mantivemos seu nível (${level}) e seu progresso. O resultado deste teste não muda isso.`,
    ok: 'Entendi',
    noTestTitle: 'Este curso não tem teste de nível',
    noTestMessage: 'Por enquanto ele tem um só nível: você começa do início.',
  },
  it: {
    title: (language: string) => `Test di livello di ${lowerIt(language)}`,
    introOverline: 'SFIDA DI LIVELLO',
    introTitle: 'Quanto ne sai?',
    introBody: 'Rispondi ad alcune domande brevi e ti diciamo da dove ti conviene iniziare.',
    whatWeCheck: 'COSA VALUTEREMO',
    dimension: (d: PlacementDimension) => IT_DIMENSIONS[d],
    ruleHarder: 'Se rispondi bene, le domande diventano più difficili.',
    ruleStop: 'Se qualcosa ti mette in difficoltà, il test finisce prima: non serve sapere tutto.',
    ruleSafe:
      'Non aggiunge XP e non cambia gli altri tuoi corsi. Se esci, non viene salvato nulla.',
    duration: (max: number) => `Fino a ${max} domande · circa 3 minuti`,
    startChallenge: 'Inizia la sfida',
    exit: 'Esci dal test',
    exitTitle: 'Uscire dal test?',
    exitMessage: 'Non verrà salvato nulla. Puoi rifarlo quando vuoi.',
    exitConfirm: 'Esci',
    exitCancel: 'Continua',
    progress: (n: number, max: number) => `Domanda ${n}, al massimo ${max}`,
    questionChip: (n: number) => `Domanda ${n}`,
    bandChip: (level: string) => `Livello ${level}`,
    correct: 'Esatto!',
    typo: 'Bene! Attenzione all’ortografia',
    incorrect: 'Non era questa',
    levelUp: (level: string) => `Sali al livello ${level}!`,
    next: 'Avanti',
    seeResult: 'Vedi il mio risultato',
    resultOverline: 'IL TUO RISULTATO',
    estimated: 'Il tuo livello stimato è',
    levelA11y: (level: string, name: string) => `Il tuo livello stimato è ${level}, ${name}`,
    levelName: (level: string) => levelInfo(IT_LEVELS, level).name,
    levelMeaning: (level: string) => levelInfo(IT_LEVELS, level).meaning,
    explain: ({ level, mastered, partial, topReached }: Explain) =>
      topReached
        ? `Hai risposto bene a tutto quello che il corso offre per ora. Inizi da ${level}, il livello più alto disponibile, per consolidare quello che sai già.`
        : mastered.length > 0
          ? `Hai risposto bene all’essenziale di ${mastered.join(' e ')}${partial ? ` e a parte di ${level}` : ''}. Puoi iniziare direttamente da ${level}.`
          : partial
            ? `Conosci già una parte delle basi. Iniziare da ${level} ti aiuta a consolidarle: andrai avanti in fretta.`
            : `Costruirai le basi dall’inizio, con i tuoi tempi.`,
    score: (correct: number, answered: number) => `${correct} risposte corrette su ${answered}`,
    startPoint: 'DA DOVE INIZI',
    startUnit: (level: string, title: string) => `Livello ${level} · Unità 1: «${title}»`,
    disclaimer:
      'È una stima per scegliere da dove iniziare, non un certificato ufficiale. Puoi cambiarla iniziando da A1.',
    startCourse: 'Inizia il corso',
    startFromA1: 'Preferisco iniziare da A1',
    retake: 'Rifai il test',
    saving: 'Salvataggio del risultato…',
    saveError:
      'Non siamo riusciti a salvare il tuo risultato. Controlla la connessione e riprova: le tue risposte sono ancora qui.',
    saveUnsupported:
      'Per salvare il risultato del test serve un aggiornamento del server. Nel frattempo puoi iniziare da A1.',
    retry: 'Riprova',
    alreadyTitle: 'Avevi già questo corso',
    alreadyMessage: (level: string) =>
      `Abbiamo mantenuto il tuo livello (${level}) e i tuoi progressi. Il risultato di questo test non li cambia.`,
    ok: 'Capito',
    noTestTitle: 'Questo corso non ha un test di livello',
    noTestMessage: 'Per ora ha un solo livello: inizi dal principio.',
  },
  fr: {
    title: (language: string) => `Test de niveau ${ofFr(language)}`,
    introOverline: 'DÉFI DE NIVEAU',
    introTitle: 'Quel est ton niveau ?',
    introBody: 'Réponds à quelques questions courtes et on te dit par où commencer.',
    whatWeCheck: 'CE QU’ON VA ÉVALUER',
    dimension: (d: PlacementDimension) => FR_DIMENSIONS[d],
    ruleHarder: 'Si tu réponds bien, les questions deviennent plus difficiles.',
    ruleStop:
      'Si quelque chose te pose problème, le test s’arrête plus tôt : pas besoin de tout savoir.',
    ruleSafe:
      'Ça ne rapporte pas d’XP et ne change pas tes autres cours. Si tu quittes, rien n’est enregistré.',
    duration: (max: number) => `Jusqu’à ${max} questions · environ 3 minutes`,
    startChallenge: 'Commencer le défi',
    exit: 'Quitter le test',
    exitTitle: 'Quitter le test ?',
    exitMessage: 'Rien ne sera enregistré. Tu peux le refaire quand tu veux.',
    exitConfirm: 'Quitter',
    exitCancel: 'Continuer',
    progress: (n: number, max: number) => `Question ${n}, ${max} au maximum`,
    questionChip: (n: number) => `Question ${n}`,
    bandChip: (level: string) => `Niveau ${level}`,
    correct: 'Correct !',
    typo: 'Bien ! Attention à l’orthographe',
    incorrect: 'Ce n’était pas ça',
    levelUp: (level: string) => `Tu passes au niveau ${level} !`,
    next: 'Suivant',
    seeResult: 'Voir mon résultat',
    resultOverline: 'TON RÉSULTAT',
    estimated: 'Ton niveau estimé est',
    levelA11y: (level: string, name: string) => `Ton niveau estimé est ${level}, ${name}`,
    levelName: (level: string) => levelInfo(FR_LEVELS, level).name,
    levelMeaning: (level: string) => levelInfo(FR_LEVELS, level).meaning,
    explain: ({ level, mastered, partial, topReached }: Explain) =>
      topReached
        ? `Tu as tout bien répondu sur ce que le cours propose pour l’instant. Tu commences au niveau ${level}, le plus haut disponible, pour consolider ce que tu sais déjà.`
        : mastered.length > 0
          ? `Tu as bien répondu à l’essentiel de ${mastered.join(' et ')}${partial ? ` et à une partie de ${level}` : ''}. Tu peux commencer directement au niveau ${level}.`
          : partial
            ? `Tu connais déjà une partie des bases. Commencer au niveau ${level} t’aide à les consolider : tu vas avancer vite.`
            : `Tu vas construire les bases depuis le début, à ton rythme.`,
    score: (correct: number, answered: number) =>
      `${correct} ${correct <= 1 ? 'bonne réponse' : 'bonnes réponses'} sur ${answered}`,
    startPoint: 'PAR OÙ TU COMMENCES',
    startUnit: (level: string, title: string) => `Niveau ${level} · Unité 1 : « ${title} »`,
    disclaimer:
      'C’est une estimation pour choisir par où commencer, pas un certificat officiel. Tu peux changer en commençant au niveau A1.',
    startCourse: 'Commencer le cours',
    startFromA1: 'Je préfère commencer au niveau A1',
    retake: 'Refaire le test',
    saving: 'Enregistrement de ton résultat…',
    saveError:
      'Impossible d’enregistrer ton résultat. Vérifie ta connexion et réessaie : tes réponses sont toujours là.',
    saveUnsupported:
      'Pour enregistrer le résultat du test, il faut une mise à jour du serveur. En attendant, tu peux commencer au niveau A1.',
    retry: 'Réessayer',
    alreadyTitle: 'Tu avais déjà ce cours',
    alreadyMessage: (level: string) =>
      `On a gardé ton niveau (${level}) et ta progression. Le résultat de ce test ne les change pas.`,
    ok: 'Compris',
    noTestTitle: 'Ce cours n’a pas de test de niveau',
    noTestMessage: 'Pour l’instant, il n’a qu’un seul niveau : tu commences depuis le début.',
  },
});
