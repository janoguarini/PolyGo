import { defineStrings } from '..';
import { languageName } from '../languages';

type ReviewMode = 'review' | 'practice' | 'mistakes' | 'smart' | 'topic' | 'coach';

/** Repasos y práctica (src/app/review.tsx). */
export const reviewStrings = defineStrings({
  es: {
    titles: {
      review: 'Repaso de vocabulario',
      practice: 'Práctica libre',
      mistakes: 'Tus puntos débiles',
      smart: 'Repaso inteligente',
      topic: 'Repaso por tema',
      coach: 'Sesión del Coach',
    } as Record<ReviewMode, string>,
    plusTitle: (title: string) => `${title} es de PolyGo Plus`,
    topicUpsell:
      'Repasa sólo las palabras de la unidad que elijas. El repaso espaciado, la práctica libre y tus puntos débiles siguen siendo gratis.',
    smartUpsell:
      'Arma cada sesión con tus errores frecuentes, las palabras que te cuestan y las que estás por olvidar. El repaso espaciado, la práctica libre y tus puntos débiles siguen siendo gratis.',
    coachUpsell:
      'Ya usaste tus sesiones de prueba del Coach. Con Plus entrenas tus puntos débiles sin límite. Tu diagnóstico, el repaso espaciado y tus puntos débiles siguen siendo gratis.',
    coachEmpty: 'Esos temas ya no tienen palabras para reforzar. ¡Bien!',
    discoverPlus: 'Descubre PolyGo Plus',
    back: 'Volver',
    verifyError: 'No pudimos verificar tu suscripción.',
    preparing: 'Preparando repaso…',
    previousSaveError:
      'No pudimos guardar tu repaso anterior. Sus respuestas no se pierden: puedes reintentar.',
    prepareError:
      'No pudimos preparar el repaso. Lo que ya respondiste no se pierde: puedes reintentar.',
    unavailableTitle: 'Repasos en preparación',
    unavailableMessage: (code: string) =>
      `Todavía no hay ejercicios de repaso para ${languageName(code, 'es')}. Tu progreso en este idioma se guarda igual; los repasos llegan cuando su contenido esté publicado.`,
    exhaustedTitle: 'Ya repasaste lo de hoy',
    nothingToReview: 'Nada para repasar',
    upToDate: 'Estás al día',
    exhaustedMessage: 'Cubriste tu meta diaria de repasos. Lo que falta vuelve mañana, en orden.',
    smartEmpty:
      'No hay palabras vencidas, con errores frecuentes ni por olvidar. Completa lecciones y vuelve más tarde.',
    topicEmpty: 'Todavía no hay palabras de esta unidad para repasar.',
    reviewEmpty:
      'No tienes nada para repasar ahora. Lo que estudies volverá cuando toque repasarlo.',
    exitReviewTitle: '¿Salir del repaso?',
    exitReviewMessage:
      'Las respuestas que ya comprobaste quedan guardadas: puedes retomar este repaso hoy.',
    stay: 'Seguir',
    leave: 'Salir',
    done: 'Listo',
    strugglingOverline: 'TE ESTÁ COSTANDO',
    strugglingBody:
      'Estas palabras se te resisten. Volver a la explicación de la lección suele ayudar.',
    seeExplanation: (word: string) => 'Ver la explicación · ' + word,
    preparingPractice: 'Preparando práctica…',
    practiceError: 'No pudimos preparar la práctica.',
    nothingToPractice: 'Nada para practicar',
    nothingToPracticeMessage: 'Completa lecciones para sumar palabras a tu práctica.',
    exitPracticeTitle: '¿Salir de la práctica?',
    exitPracticeMessage: 'Puedes volver cuando quieras.',
    practiceMistakesHint:
      'Esta práctica no cambia tus repasos: sigue con el repaso espaciado para fijarlas.',
  },
  en: {
    titles: {
      review: 'Vocabulary review',
      practice: 'Free practice',
      mistakes: 'Your weak spots',
      smart: 'Smart review',
      topic: 'Review by topic',
      coach: 'Coach session',
    } as Record<ReviewMode, string>,
    plusTitle: (title: string) => `${title} is part of PolyGo Plus`,
    topicUpsell:
      'Review only the words from the unit you choose. Spaced review, free practice and your weak spots stay free.',
    smartUpsell:
      'Build each session from your frequent mistakes, the words you find hard and the ones you’re about to forget. Spaced review, free practice and your weak spots stay free.',
    coachUpsell:
      'You’ve used your free Coach sessions. With Plus you can train your weak spots without limits. Your diagnosis, spaced review and weak spots stay free.',
    coachEmpty: 'Those topics have nothing left to reinforce. Nice!',
    discoverPlus: 'Discover PolyGo Plus',
    back: 'Back',
    verifyError: 'We couldn’t verify your subscription.',
    preparing: 'Getting your review ready…',
    previousSaveError:
      'We couldn’t save your previous review. Its answers aren’t lost. You can try again.',
    prepareError:
      'We couldn’t prepare the review. What you’ve already answered isn’t lost. You can try again.',
    unavailableTitle: 'Reviews coming soon',
    unavailableMessage: (code: string) =>
      `There are no review exercises for ${languageName(code, 'en')} yet. Your progress in this language is still saved, and reviews will arrive once their content is published.`,
    exhaustedTitle: 'You’ve done today’s reviews',
    nothingToReview: 'Nothing to review',
    upToDate: 'You’re all caught up',
    exhaustedMessage: 'You hit your daily review goal. The rest comes back tomorrow, in order.',
    smartEmpty:
      'No words are due, frequently missed or about to be forgotten. Complete lessons and come back later.',
    topicEmpty: 'There are no words from this unit to review yet.',
    reviewEmpty:
      'You have nothing to review right now. What you study will come back when it’s time to review it.',
    exitReviewTitle: 'Leave the review?',
    exitReviewMessage:
      'Answers you’ve already checked are saved. You can pick this review back up today.',
    stay: 'Keep going',
    leave: 'Leave',
    done: 'Done',
    strugglingOverline: 'GIVING YOU TROUBLE',
    strugglingBody:
      'These words are giving you trouble. Going back to the lesson explanation usually helps.',
    seeExplanation: (word: string) => 'See the explanation · ' + word,
    preparingPractice: 'Getting your practice ready…',
    practiceError: 'We couldn’t prepare the practice.',
    nothingToPractice: 'Nothing to practice',
    nothingToPracticeMessage: 'Complete lessons to add words to your practice.',
    exitPracticeTitle: 'Leave practice?',
    exitPracticeMessage: 'You can come back anytime.',
    practiceMistakesHint:
      'This practice doesn’t change your reviews. Keep up your spaced review to make them stick.',
  },
  'pt-BR': {
    titles: {
      review: 'Revisão de vocabulário',
      practice: 'Prática livre',
      mistakes: 'Seus pontos fracos',
      smart: 'Revisão inteligente',
      topic: 'Revisão por tema',
      coach: 'Sessão do Coach',
    } as Record<ReviewMode, string>,
    plusTitle: (title: string) => `${title} faz parte do PolyGo Plus`,
    topicUpsell:
      'Revise só as palavras da unidade que você escolher. A revisão espaçada, a prática livre e seus pontos fracos continuam grátis.',
    smartUpsell:
      'Monta cada sessão com seus erros frequentes, as palavras que você acha difíceis e as que está quase esquecendo. A revisão espaçada, a prática livre e seus pontos fracos continuam grátis.',
    coachUpsell:
      'Você já usou suas sessões de teste do Coach. Com o Plus, você treina seus pontos fracos sem limite. Seu diagnóstico, a revisão espaçada e seus pontos fracos continuam grátis.',
    coachEmpty: 'Esses temas não têm mais palavras para reforçar. Mandou bem!',
    discoverPlus: 'Conheça o PolyGo Plus',
    back: 'Voltar',
    verifyError: 'Não conseguimos verificar sua assinatura.',
    preparing: 'Preparando a revisão…',
    previousSaveError:
      'Não conseguimos salvar sua revisão anterior. As respostas não se perdem: você pode tentar de novo.',
    prepareError:
      'Não conseguimos preparar a revisão. O que você já respondeu não se perde: você pode tentar de novo.',
    unavailableTitle: 'Revisões em preparação',
    unavailableMessage: (code: string) =>
      `Ainda não há exercícios de revisão de ${languageName(code, 'pt-BR')}. Seu progresso neste idioma fica salvo do mesmo jeito; as revisões chegam quando o conteúdo for publicado.`,
    exhaustedTitle: 'Você já revisou tudo de hoje',
    nothingToReview: 'Nada para revisar',
    upToDate: 'Você está em dia',
    exhaustedMessage: 'Você bateu sua meta diária de revisões. O que falta volta amanhã, na ordem.',
    smartEmpty:
      'Não há palavras vencidas, com erros frequentes ou quase esquecidas. Complete lições e volte mais tarde.',
    topicEmpty: 'Ainda não há palavras desta unidade para revisar.',
    reviewEmpty:
      'Você não tem nada para revisar agora. O que você estudar volta quando for hora de revisar.',
    exitReviewTitle: 'Sair da revisão?',
    exitReviewMessage:
      'As respostas que você já conferiu ficam salvas: você pode retomar esta revisão hoje.',
    stay: 'Continuar',
    leave: 'Sair',
    done: 'Pronto',
    strugglingOverline: 'ESTÁ DIFÍCIL',
    strugglingBody: 'Essas palavras estão resistindo. Voltar à explicação da lição costuma ajudar.',
    seeExplanation: (word: string) => 'Ver a explicação · ' + word,
    preparingPractice: 'Preparando a prática…',
    practiceError: 'Não conseguimos preparar a prática.',
    nothingToPractice: 'Nada para praticar',
    nothingToPracticeMessage: 'Complete lições para adicionar palavras à sua prática.',
    exitPracticeTitle: 'Sair da prática?',
    exitPracticeMessage: 'Você pode voltar quando quiser.',
    practiceMistakesHint:
      'Esta prática não muda suas revisões: continue com a revisão espaçada para fixá-las.',
  },
  it: {
    titles: {
      review: 'Ripasso del vocabolario',
      practice: 'Pratica libera',
      mistakes: 'I tuoi punti deboli',
      smart: 'Ripasso intelligente',
      topic: 'Ripasso per argomento',
      coach: 'Sessione con il Coach',
    } as Record<ReviewMode, string>,
    plusTitle: (title: string) => `${title} fa parte di PolyGo Plus`,
    topicUpsell:
      'Ripassa solo le parole dell’unità che scegli. Il ripasso a intervalli, la pratica libera e i tuoi punti deboli restano gratis.',
    smartUpsell:
      'Crea ogni sessione con i tuoi errori frequenti, le parole che trovi difficili e quelle che stai per dimenticare. Il ripasso a intervalli, la pratica libera e i tuoi punti deboli restano gratis.',
    coachUpsell:
      'Hai già usato le sessioni di prova del Coach. Con Plus alleni i tuoi punti deboli senza limiti. La tua diagnosi, il ripasso a intervalli e i tuoi punti deboli restano gratis.',
    coachEmpty: 'Questi argomenti non hanno più parole da rinforzare. Ottimo!',
    discoverPlus: 'Scopri PolyGo Plus',
    back: 'Indietro',
    verifyError: 'Non siamo riusciti a verificare il tuo abbonamento.',
    preparing: 'Sto preparando il ripasso…',
    previousSaveError:
      'Non siamo riusciti a salvare il ripasso precedente. Le risposte non vanno perse: puoi riprovare.',
    prepareError:
      'Non siamo riusciti a preparare il ripasso. Quello che hai già risposto non va perso: puoi riprovare.',
    unavailableTitle: 'Ripassi in arrivo',
    unavailableMessage: (code: string) =>
      `Non ci sono ancora esercizi di ripasso per ${languageName(code, 'it')}. I tuoi progressi in questa lingua vengono salvati comunque; i ripassi arriveranno quando i contenuti saranno pubblicati.`,
    exhaustedTitle: 'Hai già ripassato tutto per oggi',
    nothingToReview: 'Niente da ripassare',
    upToDate: 'Sei in pari',
    exhaustedMessage:
      'Hai raggiunto il tuo obiettivo giornaliero di ripasso. Il resto torna domani, in ordine.',
    smartEmpty:
      'Non ci sono parole scadute, con errori frequenti o che stai per dimenticare. Completa le lezioni e torna più tardi.',
    topicEmpty: 'Non ci sono ancora parole di questa unità da ripassare.',
    reviewEmpty:
      'Non hai niente da ripassare adesso. Quello che studi tornerà quando sarà il momento di ripassarlo.',
    exitReviewTitle: 'Uscire dal ripasso?',
    exitReviewMessage:
      'Le risposte che hai già verificato restano salvate: puoi riprendere questo ripasso oggi.',
    stay: 'Continua',
    leave: 'Esci',
    done: 'Fatto',
    strugglingOverline: 'TI METTONO IN DIFFICOLTÀ',
    strugglingBody:
      'Queste parole ti resistono. Tornare alla spiegazione della lezione di solito aiuta.',
    seeExplanation: (word: string) => 'Vedi la spiegazione · ' + word,
    preparingPractice: 'Sto preparando la pratica…',
    practiceError: 'Non siamo riusciti a preparare la pratica.',
    nothingToPractice: 'Niente da praticare',
    nothingToPracticeMessage: 'Completa le lezioni per aggiungere parole alla tua pratica.',
    exitPracticeTitle: 'Uscire dalla pratica?',
    exitPracticeMessage: 'Puoi tornare quando vuoi.',
    practiceMistakesHint:
      'Questa pratica non cambia i tuoi ripassi: continua con il ripasso a intervalli per fissarle.',
  },
  fr: {
    titles: {
      review: 'Révision du vocabulaire',
      practice: 'Entraînement libre',
      mistakes: 'Tes points faibles',
      smart: 'Révision intelligente',
      topic: 'Révision par thème',
      coach: 'Session avec le Coach',
    } as Record<ReviewMode, string>,
    plusTitle: (title: string) => `${title} fait partie de PolyGo Plus`,
    topicUpsell:
      'Révise seulement les mots de l’unité que tu choisis. La révision espacée, l’entraînement libre et tes points faibles restent gratuits.',
    smartUpsell:
      'Chaque session se construit avec tes erreurs fréquentes, les mots qui te posent problème et ceux que tu es sur le point d’oublier. La révision espacée, l’entraînement libre et tes points faibles restent gratuits.',
    coachUpsell:
      'Tu as déjà utilisé tes sessions d’essai du Coach. Avec Plus, tu travailles tes points faibles sans limite. Ton diagnostic, la révision espacée et tes points faibles restent gratuits.',
    coachEmpty: 'Ces thèmes n’ont plus de mots à renforcer. Bravo !',
    discoverPlus: 'Découvre PolyGo Plus',
    back: 'Retour',
    verifyError: 'Impossible de vérifier ton abonnement.',
    preparing: 'Préparation de la révision…',
    previousSaveError:
      'Impossible d’enregistrer ta révision précédente. Tes réponses ne sont pas perdues : tu peux réessayer.',
    prepareError:
      'Impossible de préparer la révision. Ce que tu as déjà répondu n’est pas perdu : tu peux réessayer.',
    unavailableTitle: 'Révisions en préparation',
    unavailableMessage: (code: string) =>
      `Il n’y a pas encore d’exercices de révision en ${languageName(code, 'fr').toLocaleLowerCase('fr')}. Ta progression dans cette langue est quand même enregistrée ; les révisions arriveront quand leur contenu sera publié.`,
    exhaustedTitle: 'Tu as fini tes révisions du jour',
    nothingToReview: 'Rien à réviser',
    upToDate: 'Tu es à jour',
    exhaustedMessage:
      'Tu as atteint ton objectif quotidien de révisions. Le reste revient demain, dans l’ordre.',
    smartEmpty:
      'Aucun mot à réviser, souvent raté ou sur le point d’être oublié. Termine des leçons et reviens plus tard.',
    topicEmpty: 'Il n’y a pas encore de mots de cette unité à réviser.',
    reviewEmpty:
      'Tu n’as rien à réviser pour l’instant. Ce que tu étudies reviendra quand ce sera le moment de le réviser.',
    exitReviewTitle: 'Quitter la révision ?',
    exitReviewMessage:
      'Les réponses déjà vérifiées sont enregistrées : tu peux reprendre cette révision aujourd’hui.',
    stay: 'Continuer',
    leave: 'Quitter',
    done: 'Terminé',
    strugglingOverline: 'ÇA COINCE',
    strugglingBody: 'Ces mots te résistent. Revoir l’explication de la leçon aide souvent.',
    seeExplanation: (word: string) => 'Voir l’explication · ' + word,
    preparingPractice: 'Préparation de l’entraînement…',
    practiceError: 'Impossible de préparer l’entraînement.',
    nothingToPractice: 'Rien à pratiquer',
    nothingToPracticeMessage: 'Termine des leçons pour ajouter des mots à ton entraînement.',
    exitPracticeTitle: 'Quitter l’entraînement ?',
    exitPracticeMessage: 'Tu peux revenir quand tu veux.',
    practiceMistakesHint:
      'Cet entraînement ne change pas tes révisions : continue la révision espacée pour bien les retenir.',
  },
});

/** Repaso por tema (src/app/review-topics.tsx). Lo ven todos; repasar es de Plus. */
export const reviewTopicsStrings = defineStrings({
  es: {
    title: 'Repaso por tema',
    plus: 'Plus',
    loadError: 'No pudimos cargar tus temas.',
    emptyTitle: 'Todavía no hay temas',
    emptyMessage:
      'Completa lecciones: cada unidad en la que estudies palabras aparece aquí para repasarla.',
    goToPath: 'Ir a mi camino',
    heroTitle: 'Elige un tema y entrénalo',
    heroStats: (topics: number, started: number, weak: number) =>
      [
        `${topics} ${topics === 1 ? 'tema' : 'temas'}`,
        `${started} ${started === 1 ? 'empezado' : 'empezados'}`,
        weak > 0 ? `${weak} para reforzar` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    wordsOf: (n: number, total: number) => `${n} de ${total} palabras`,
    lessons: (n: number) => `${n} ${n === 1 ? 'lección' : 'lecciones'}`,
    notStarted: 'Por empezar',
    recommended: 'Recomendado para ti',
    level: (level: string) => `NIVEL ${level}`,
    words: (n: number) => `${n} ${n === 1 ? 'palabra' : 'palabras'}`,
    struggling: (n: number) => (n === 1 ? '1 te cuesta' : `${n} te cuestan`),
    dueToday: (n: number) => `${n} para hoy`,
    allGood: 'Al día',
    cardA11y: (title: string, detail: string, locked: boolean) =>
      `${title}. ${detail}.${locked ? ' Con PolyGo Plus.' : ''}`,
    unlock: 'Desbloquear repaso por tema',
    unlockSub: 'Con PolyGo Plus · cancela cuando quieras',
    legend: { mastered: 'Dominadas', due: 'Para hoy', struggling: 'Te cuestan' },
    note: 'Hasta 15 palabras del tema: primero las que te tocan y las que más te cuestan. No usa energía.',
  },
  en: {
    title: 'Review by topic',
    plus: 'Plus',
    loadError: 'We couldn’t load your topics.',
    emptyTitle: 'No topics yet',
    emptyMessage: 'Complete lessons: every unit where you study words shows up here for review.',
    goToPath: 'Go to my path',
    heroTitle: 'Pick a topic and train it',
    heroStats: (topics: number, started: number, weak: number) =>
      [
        `${topics} ${topics === 1 ? 'topic' : 'topics'}`,
        `${started} started`,
        weak > 0 ? `${weak} to reinforce` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    wordsOf: (n: number, total: number) => `${n} of ${total} words`,
    lessons: (n: number) => `${n} ${n === 1 ? 'lesson' : 'lessons'}`,
    notStarted: 'Not started',
    recommended: 'Recommended for you',
    level: (level: string) => `LEVEL ${level}`,
    words: (n: number) => `${n} ${n === 1 ? 'word' : 'words'}`,
    struggling: (n: number) => (n === 1 ? '1 is hard' : `${n} are hard`),
    dueToday: (n: number) => `${n} due today`,
    allGood: 'Up to date',
    cardA11y: (title: string, detail: string, locked: boolean) =>
      `${title}. ${detail}.${locked ? ' With PolyGo Plus.' : ''}`,
    unlock: 'Unlock review by topic',
    unlockSub: 'With PolyGo Plus · cancel anytime',
    legend: { mastered: 'Mastered', due: 'Due today', struggling: 'Hard' },
    note: 'Up to 15 words from the topic: due ones first, then the hardest. Doesn’t use energy.',
  },
  'pt-BR': {
    title: 'Revisão por tema',
    plus: 'Plus',
    loadError: 'Não conseguimos carregar seus temas.',
    emptyTitle: 'Ainda não há temas',
    emptyMessage:
      'Complete lições: cada unidade em que você estudar palavras aparece aqui para revisar.',
    goToPath: 'Ir para minha trilha',
    heroTitle: 'Escolha um tema e treine',
    heroStats: (topics: number, started: number, weak: number) =>
      [
        `${topics} ${topics === 1 ? 'tema' : 'temas'}`,
        `${started} ${started === 1 ? 'iniciado' : 'iniciados'}`,
        weak > 0 ? `${weak} para reforçar` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    wordsOf: (n: number, total: number) => `${n} de ${total} palavras`,
    lessons: (n: number) => `${n} ${n === 1 ? 'lição' : 'lições'}`,
    notStarted: 'Não iniciado',
    recommended: 'Recomendado para você',
    level: (level: string) => `NÍVEL ${level}`,
    words: (n: number) => `${n} ${n === 1 ? 'palavra' : 'palavras'}`,
    struggling: (n: number) => (n === 1 ? '1 está difícil' : `${n} estão difíceis`),
    dueToday: (n: number) => `${n} para hoje`,
    allGood: 'Em dia',
    cardA11y: (title: string, detail: string, locked: boolean) =>
      `${title}. ${detail}.${locked ? ' Com PolyGo Plus.' : ''}`,
    unlock: 'Desbloquear revisão por tema',
    unlockSub: 'Com PolyGo Plus · cancele quando quiser',
    legend: { mastered: 'Dominadas', due: 'Para hoje', struggling: 'Difíceis' },
    note: 'Até 15 palavras do tema: primeiro as que estão na hora de revisar e as mais difíceis. Não gasta energia.',
  },
  it: {
    title: 'Ripasso per argomento',
    plus: 'Plus',
    loadError: 'Non siamo riusciti a caricare i tuoi argomenti.',
    emptyTitle: 'Ancora nessun argomento',
    emptyMessage:
      'Completa le lezioni: ogni unità in cui studi delle parole compare qui da ripassare.',
    goToPath: 'Vai al mio percorso',
    heroTitle: 'Scegli un argomento e allenalo',
    heroStats: (topics: number, started: number, weak: number) =>
      [
        `${topics} ${topics === 1 ? 'argomento' : 'argomenti'}`,
        `${started} ${started === 1 ? 'iniziato' : 'iniziati'}`,
        weak > 0 ? `${weak} da rinforzare` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    wordsOf: (n: number, total: number) => `${n} su ${total} parole`,
    lessons: (n: number) => `${n} ${n === 1 ? 'lezione' : 'lezioni'}`,
    notStarted: 'Da iniziare',
    recommended: 'Consigliato per te',
    level: (level: string) => `LIVELLO ${level}`,
    words: (n: number) => `${n} ${n === 1 ? 'parola' : 'parole'}`,
    struggling: (n: number) => (n === 1 ? '1 difficile' : `${n} difficili`),
    dueToday: (n: number) => `${n} per oggi`,
    allGood: 'In pari',
    cardA11y: (title: string, detail: string, locked: boolean) =>
      `${title}. ${detail}.${locked ? ' Con PolyGo Plus.' : ''}`,
    unlock: 'Sblocca il ripasso per argomento',
    unlockSub: 'Con PolyGo Plus · disdici quando vuoi',
    legend: { mastered: 'Padroneggiate', due: 'Per oggi', struggling: 'Difficili' },
    note: 'Fino a 15 parole dell’argomento: prima quelle da ripassare e le più difficili. Non consuma energia.',
  },
  fr: {
    title: 'Révision par thème',
    plus: 'Plus',
    loadError: 'Impossible de charger tes thèmes.',
    emptyTitle: 'Pas encore de thèmes',
    emptyMessage:
      'Termine des leçons : chaque unité où tu étudies des mots apparaît ici pour la réviser.',
    goToPath: 'Aller à mon parcours',
    heroTitle: 'Choisis un thème et entraîne-toi',
    heroStats: (topics: number, started: number, weak: number) =>
      [
        `${topics} ${topics <= 1 ? 'thème' : 'thèmes'}`,
        `${started} ${started <= 1 ? 'commencé' : 'commencés'}`,
        weak > 0 ? `${weak} à renforcer` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    wordsOf: (n: number, total: number) => `${n} ${n <= 1 ? 'mot' : 'mots'} sur ${total}`,
    lessons: (n: number) => `${n} ${n <= 1 ? 'leçon' : 'leçons'}`,
    notStarted: 'À commencer',
    recommended: 'Recommandé pour toi',
    level: (level: string) => `NIVEAU ${level}`,
    words: (n: number) => `${n} ${n <= 1 ? 'mot' : 'mots'}`,
    struggling: (n: number) => (n <= 1 ? `${n} difficile` : `${n} difficiles`),
    dueToday: (n: number) => `${n} pour aujourd’hui`,
    allGood: 'À jour',
    cardA11y: (title: string, detail: string, locked: boolean) =>
      `${title}. ${detail}.${locked ? ' Avec PolyGo Plus.' : ''}`,
    unlock: 'Débloquer la révision par thème',
    unlockSub: 'Avec PolyGo Plus · résiliable à tout moment',
    legend: { mastered: 'Maîtrisés', due: 'Pour aujourd’hui', struggling: 'Difficiles' },
    note: 'Jusqu’à 15 mots du thème : d’abord ceux à réviser et les plus difficiles. Ça n’utilise pas d’énergie.',
  },
});
