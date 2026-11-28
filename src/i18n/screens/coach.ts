import { defineStrings } from '..';

const list = (items: string[], and: string) =>
  items.length <= 1
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;

/** Coach de PolyGo (src/app/coach.tsx). Sólo afirma lo que muestran los datos. */
export const coachStrings = defineStrings({
  es: {
    title: 'Coach',
    back: 'Volver',
    loadError: 'No pudimos cargar tu diagnóstico.',
    overline: 'TU COACH POLYGO',
    groups: { mastered: 'Dominadas', due: 'Para repasar hoy', struggling: 'Te cuestan' },
    groupsHint: {
      mastered: 'Las sabes',
      due: 'Que no se olviden',
      struggling: 'Te equivocas a menudo',
    },
    bubbleFocus: (topics: string[]) =>
      topics.length === 1
        ? `Te está costando ${topics[0]}. Armé una sesión para reforzarlo.`
        : `Te están costando ${topics.slice(0, -1).join(', ')} y ${topics[topics.length - 1]}. Armé una sesión para reforzarlos.`,
    bubbleMaintenance: (n: number) =>
      n === 1
        ? 'No tienes temas flojos. Hay 1 palabra que se te resiste: la entrenamos.'
        : `No tienes temas flojos. Hay ${n} palabras que se te resisten: las entrenamos.`,
    bubbleClean:
      'Sin errores para entrenar. Sigue con tus lecciones y repasos: te aviso si algo te cuesta.',
    bubbleNew: (studied: number, needed: number) =>
      `Te estoy conociendo: llevas ${studied} de ${needed} palabras. Con un poco más de práctica te armo tu plan.`,
    sessionFocus: 'Tu sesión personalizada',
    sessionMaintenance: 'Sesión de mantenimiento',
    alsoInPlus: 'También incluye PolyGo Plus',
    perkSmart: 'Repaso inteligente',
    perkEnergy: 'Energía ilimitada',
    perkAds: 'Sin anuncios',
    // Estado
    unlimited: 'Ilimitado',
    freeLeft: (n: number) => `${n} gratis`,
    unlimitedA11y: 'Sesiones ilimitadas con PolyGo Plus',
    freeLeftA11y: (n: number, limit: number) => `Te quedan ${n} de ${limit} sesiones gratis`,
    // Encabezado según el diagnóstico
    headlineOk: (n: number) =>
      n === 1 ? 'Encontré 1 tema para mejorar' : `Encontré ${n} temas para mejorar`,
    headlineGood: '¡Vas impecable!',
    headlineNew: 'Te estoy conociendo',
    found: (topics: string[]) =>
      `Te están costando ${list(topics, 'y')}. Armé una sesión corta para reforzar${topics.length === 1 ? 'lo' : 'los'}.`,
    allGoodBody:
      'No encontré temas con errores repetidos. Sigue practicando: si algo empieza a costarte, te aviso.',
    newBody: (studied: number, needed: number) =>
      `Necesito un poco más de práctica tuya para recomendarte algo preciso: llevas ${studied} de ${needed} palabras.`,
    goLearn: 'Seguir aprendiendo',
    // Números
    mastered: 'dominadas',
    ofTotal: (total: number) => `/${total}`,
    groupsA11y: (m: number, d: number, s: number, total: number) =>
      `De ${total} palabras: ${m} dominadas, ${d} para repasar hoy y ${s} te cuestan`,
    struggle: (n: number): string => (n === 1 ? 'palabra te cuesta' : 'palabras te cuestan'),
    studied: (n: number): string => (n === 1 ? 'palabra estudiada' : 'palabras estudiadas'),
    toImprove: (n: number): string => (n === 1 ? 'tema a mejorar' : 'temas a mejorar'),
    // Plan
    plan: 'Tu plan de mejora',
    priority: (i: number): string =>
      i === 0 ? 'Prioridad alta' : i === 1 ? 'Prioridad media' : 'Reforzar',
    accuracy: (p: number) => `${p} % de aciertos`,
    struggling: (n: number) => (n === 1 ? '1 palabra te cuesta' : `${n} palabras te cuestan`),
    areaA11y: (i: number, title: string, accuracy: string, struggling: string, priority: string) =>
      `${i}. ${title}. ${accuracy}. ${struggling}. ${priority}.`,
    words: 'Palabras que vamos a entrenar',
    strengths: 'Tus fortalezas',
    // Sesión
    session: 'Tu sesión personalizada',
    minutes: (low: number, high: number) => (low === high ? `~${low} min` : `${low}–${high} min`),
    exercises: (n: number) => `${n} ${n === 1 ? 'ejercicio' : 'ejercicios'}`,
    focusOn: 'Enfocada en tus errores reales',
    start: 'Empezar mi sesión',
    startSubPlus: 'Sesiones ilimitadas con Plus',
    startSubTrial: (n: number, limit: number) =>
      n === 1 ? `Tu última sesión gratis de ${limit}` : `Gratis · te quedan ${n} de ${limit}`,
    trialNote: 'La sesión gratis se descuenta recién cuando empieza.',
    lockedTitle: 'Tu plan ya está listo',
    lockedBody: (limit: number) =>
      `Usaste tus ${limit} sesiones gratis. Con Plus entrenas tus puntos débiles todos los días, sin límite.`,
    unlock: 'Desbloquear Coach ilimitado',
    unlockSub: 'Además: energía ilimitada y sin anuncios',
    // Progreso
    progress: 'Tu progreso con el Coach',
    lastSession: 'Última sesión',
    delta: (d: number) =>
      d >= 0 ? `+${d} pts desde tu primera sesión` : `${d} pts desde tu primera sesión`,
    sessionsDone: (n: number) => (n === 1 ? '1 sesión completada' : `${n} sesiones completadas`),
    notFinished: 'Sin terminar',
    trialTag: 'Gratis',
    // Tarjeta al terminar una sesión
    resultGreat: '¡Sesión brillante!',
    resultGood: '¡Buen avance!',
    resultTough: 'Cada error cuenta',
    resultBody: (p: number): string =>
      p >= 85
        ? `Acertaste el ${p} % al primer intento. Tu Coach ya actualizó tu plan con este resultado.`
        : p >= 60
          ? `Acertaste el ${p} %. Tu Coach ya sabe qué reforzar en la próxima sesión.`
          : `Acertaste el ${p} %. Esas palabras vuelven en tu próxima sesión hasta que te salgan.`,
    resultLeft: (n: number): string =>
      n === 1 ? 'Te queda 1 sesión gratis' : `Te quedan ${n} sesiones gratis`,
    resultLast: 'Usaste tus sesiones gratis',
    resultLastBody:
      'Tu plan sigue guardado. Con Plus sigues entrenando tus puntos débiles cuando quieras.',
    resultPlus: 'Sesiones ilimitadas con Plus',
    seePlan: 'Ver mi plan',
    fairPlay:
      'El Coach usa tus lecciones y repasos. Ranked no cambia: pagar nunca da ventajas en las partidas.',
  },
  en: {
    title: 'Coach',
    back: 'Back',
    loadError: 'We couldn’t load your diagnosis.',
    overline: 'YOUR POLYGO COACH',
    groups: { mastered: 'Mastered', due: 'Review today', struggling: 'Struggling' },
    groupsHint: {
      mastered: 'You know them',
      due: 'Keep them fresh',
      struggling: 'Frequent mistakes',
    },
    bubbleFocus: (topics: string[]) =>
      topics.length === 1
        ? `You’re struggling with ${topics[0]}. I built a session to reinforce it.`
        : `You’re struggling with ${topics.slice(0, -1).join(', ')} and ${topics[topics.length - 1]}. I built a session to reinforce them.`,
    bubbleMaintenance: (n: number) =>
      n === 1
        ? 'No weak topics. There’s 1 word that keeps slipping: let’s train it.'
        : `No weak topics. There are ${n} words that keep slipping: let’s train them.`,
    bubbleClean:
      'No mistakes to train. Keep up your lessons and reviews: I’ll let you know if something gets hard.',
    bubbleNew: (studied: number, needed: number) =>
      `Getting to know you: ${studied} of ${needed} words so far. A bit more practice and I’ll build your plan.`,
    sessionFocus: 'Your personalized session',
    sessionMaintenance: 'Maintenance session',
    alsoInPlus: 'Also included in PolyGo Plus',
    perkSmart: 'Smart review',
    perkEnergy: 'Unlimited energy',
    perkAds: 'No ads',
    unlimited: 'Unlimited',
    freeLeft: (n: number) => `${n} free`,
    unlimitedA11y: 'Unlimited sessions with PolyGo Plus',
    freeLeftA11y: (n: number, limit: number) => `${n} of ${limit} free sessions left`,
    headlineOk: (n: number) =>
      n === 1 ? 'I found 1 topic to improve' : `I found ${n} topics to improve`,
    headlineGood: 'You’re doing great!',
    headlineNew: 'Getting to know you',
    found: (topics: string[]) =>
      `You’re struggling with ${list(topics, 'and')}. I put together a short session to reinforce ${topics.length === 1 ? 'it' : 'them'}.`,
    allGoodBody:
      'I didn’t find topics with repeated mistakes. Keep practicing: if something gets harder, I’ll let you know.',
    newBody: (studied: number, needed: number) =>
      `I need a bit more practice from you to recommend something precise: you’ve studied ${studied} of ${needed} words.`,
    goLearn: 'Keep learning',
    mastered: 'mastered',
    ofTotal: (total: number) => `/${total}`,
    groupsA11y: (m: number, d: number, s: number, total: number) =>
      `Of ${total} words: ${m} mastered, ${d} to review today and ${s} you struggle with`,
    struggle: (n: number): string =>
      n === 1 ? 'word you struggle with' : 'words you struggle with',
    studied: (n: number): string => (n === 1 ? 'word studied' : 'words studied'),
    toImprove: (n: number): string => (n === 1 ? 'topic to improve' : 'topics to improve'),
    plan: 'Your improvement plan',
    priority: (i: number): string =>
      i === 0 ? 'High priority' : i === 1 ? 'Medium priority' : 'Reinforce',
    accuracy: (p: number) => `${p}% correct`,
    struggling: (n: number) => (n === 1 ? '1 word is hard' : `${n} words are hard`),
    areaA11y: (i: number, title: string, accuracy: string, struggling: string, priority: string) =>
      `${i}. ${title}. ${accuracy}. ${struggling}. ${priority}.`,
    words: 'Words we’ll train',
    strengths: 'Your strengths',
    session: 'Your personalized session',
    minutes: (low: number, high: number) => (low === high ? `~${low} min` : `${low}–${high} min`),
    exercises: (n: number) => `${n} ${n === 1 ? 'exercise' : 'exercises'}`,
    focusOn: 'Focused on your real mistakes',
    start: 'Start my session',
    startSubPlus: 'Unlimited sessions with Plus',
    startSubTrial: (n: number, limit: number) =>
      n === 1 ? `Your last free session of ${limit}` : `Free · ${n} of ${limit} left`,
    trialNote: 'A free session is only used once it actually starts.',
    lockedTitle: 'Your plan is ready',
    lockedBody: (limit: number) =>
      `You’ve used your ${limit} free sessions. With Plus you train your weak spots every day, without limits.`,
    unlock: 'Unlock unlimited Coach',
    unlockSub: 'Plus: unlimited energy and no ads',
    progress: 'Your progress with the Coach',
    lastSession: 'Last session',
    delta: (d: number) =>
      d >= 0 ? `+${d} pts since your first session` : `${d} pts since your first session`,
    sessionsDone: (n: number) => (n === 1 ? '1 session completed' : `${n} sessions completed`),
    notFinished: 'Not finished',
    trialTag: 'Free',
    resultGreat: 'Brilliant session!',
    resultGood: 'Nice progress!',
    resultTough: 'Every mistake counts',
    resultBody: (p: number): string =>
      p >= 85
        ? `You got ${p}% right on the first try. Your Coach already updated your plan.`
        : p >= 60
          ? `You got ${p}% right. Your Coach knows what to reinforce next time.`
          : `You got ${p}% right. Those words come back in your next session until you nail them.`,
    resultLeft: (n: number): string =>
      n === 1 ? '1 free session left' : `${n} free sessions left`,
    resultLast: 'You’ve used your free sessions',
    resultLastBody:
      'Your plan stays saved. With Plus you keep training your weak spots whenever you want.',
    resultPlus: 'Unlimited sessions with Plus',
    seePlan: 'See my plan',
    fairPlay:
      'The Coach uses your lessons and reviews. Ranked doesn’t change: paying never gives an edge in matches.',
  },
  'pt-BR': {
    title: 'Coach',
    back: 'Voltar',
    loadError: 'Não conseguimos carregar seu diagnóstico.',
    overline: 'SEU COACH POLYGO',
    groups: { mastered: 'Dominadas', due: 'Para revisar hoje', struggling: 'Difíceis' },
    groupsHint: {
      mastered: 'Você já sabe',
      due: 'Para não esquecer',
      struggling: 'Você erra com frequência',
    },
    bubbleFocus: (topics: string[]) =>
      topics.length === 1
        ? `${topics[0]} está sendo difícil para você. Montei uma sessão para reforçar.`
        : `${topics.slice(0, -1).join(', ')} e ${topics[topics.length - 1]} estão sendo difíceis para você. Montei uma sessão para reforçar.`,
    bubbleMaintenance: (n: number) =>
      n === 1
        ? 'Nenhum tema fraco. Tem 1 palavra que está resistindo: vamos treiná-la.'
        : `Nenhum tema fraco. Tem ${n} palavras que estão resistindo: vamos treiná-las.`,
    bubbleClean:
      'Sem erros para treinar. Continue com suas lições e revisões: eu aviso se algo ficar difícil.',
    bubbleNew: (studied: number, needed: number) =>
      `Estou te conhecendo: você já tem ${studied} de ${needed} palavras. Com um pouco mais de prática, eu monto seu plano.`,
    sessionFocus: 'Sua sessão personalizada',
    sessionMaintenance: 'Sessão de manutenção',
    alsoInPlus: 'Também incluído no PolyGo Plus',
    perkSmart: 'Revisão inteligente',
    perkEnergy: 'Energia ilimitada',
    perkAds: 'Sem anúncios',
    unlimited: 'Ilimitado',
    freeLeft: (n: number) => `${n} grátis`,
    unlimitedA11y: 'Sessões ilimitadas com o PolyGo Plus',
    freeLeftA11y: (n: number, limit: number) => `Restam ${n} de ${limit} sessões grátis`,
    headlineOk: (n: number) =>
      n === 1 ? 'Encontrei 1 tema para melhorar' : `Encontrei ${n} temas para melhorar`,
    headlineGood: 'Você está mandando muito bem!',
    headlineNew: 'Estou te conhecendo',
    found: (topics: string[]) =>
      `${list(topics, 'e')} ${topics.length === 1 ? 'está sendo difícil' : 'estão sendo difíceis'} para você. Montei uma sessão curta para reforçar.`,
    allGoodBody:
      'Não encontrei temas com erros repetidos. Continue praticando: se algo começar a ficar difícil, eu aviso.',
    newBody: (studied: number, needed: number) =>
      `Preciso de um pouco mais de prática sua para recomendar algo certeiro: você já estudou ${studied} de ${needed} palavras.`,
    goLearn: 'Continuar aprendendo',
    mastered: 'dominadas',
    ofTotal: (total: number) => `/${total}`,
    groupsA11y: (m: number, d: number, s: number, total: number) =>
      `De ${total} palavras: ${m} dominadas, ${d} para revisar hoje e ${s} difíceis para você`,
    struggle: (n: number): string => (n === 1 ? 'palavra difícil' : 'palavras difíceis'),
    studied: (n: number): string => (n === 1 ? 'palavra estudada' : 'palavras estudadas'),
    toImprove: (n: number): string => (n === 1 ? 'tema para melhorar' : 'temas para melhorar'),
    plan: 'Seu plano de melhoria',
    priority: (i: number): string =>
      i === 0 ? 'Prioridade alta' : i === 1 ? 'Prioridade média' : 'Reforçar',
    accuracy: (p: number) => `${p}% de acertos`,
    struggling: (n: number) => (n === 1 ? '1 palavra difícil' : `${n} palavras difíceis`),
    areaA11y: (i: number, title: string, accuracy: string, struggling: string, priority: string) =>
      `${i}. ${title}. ${accuracy}. ${struggling}. ${priority}.`,
    words: 'Palavras que vamos treinar',
    strengths: 'Seus pontos fortes',
    session: 'Sua sessão personalizada',
    minutes: (low: number, high: number) => (low === high ? `~${low} min` : `${low}–${high} min`),
    exercises: (n: number) => `${n} ${n === 1 ? 'exercício' : 'exercícios'}`,
    focusOn: 'Focada nos seus erros reais',
    start: 'Começar minha sessão',
    startSubPlus: 'Sessões ilimitadas com o Plus',
    startSubTrial: (n: number, limit: number) =>
      n === 1 ? `Sua última sessão grátis de ${limit}` : `Grátis · restam ${n} de ${limit}`,
    trialNote: 'A sessão grátis só é descontada quando ela começa.',
    lockedTitle: 'Seu plano já está pronto',
    lockedBody: (limit: number) =>
      `Você usou suas ${limit} sessões grátis. Com o Plus, você treina seus pontos fracos todos os dias, sem limite.`,
    unlock: 'Desbloquear Coach ilimitado',
    unlockSub: 'E mais: energia ilimitada e sem anúncios',
    progress: 'Seu progresso com o Coach',
    lastSession: 'Última sessão',
    delta: (d: number) =>
      d >= 0 ? `+${d} pts desde sua primeira sessão` : `${d} pts desde sua primeira sessão`,
    sessionsDone: (n: number) => (n === 1 ? '1 sessão concluída' : `${n} sessões concluídas`),
    notFinished: 'Não concluída',
    trialTag: 'Grátis',
    resultGreat: 'Sessão brilhante!',
    resultGood: 'Bom progresso!',
    resultTough: 'Cada erro conta',
    resultBody: (p: number): string =>
      p >= 85
        ? `Você acertou ${p}% na primeira tentativa. Seu Coach já atualizou seu plano com esse resultado.`
        : p >= 60
          ? `Você acertou ${p}%. Seu Coach já sabe o que reforçar na próxima sessão.`
          : `Você acertou ${p}%. Essas palavras voltam na sua próxima sessão até você pegar o jeito.`,
    resultLeft: (n: number): string =>
      n === 1 ? 'Resta 1 sessão grátis' : `Restam ${n} sessões grátis`,
    resultLast: 'Você usou suas sessões grátis',
    resultLastBody:
      'Seu plano continua salvo. Com o Plus, você continua treinando seus pontos fracos quando quiser.',
    resultPlus: 'Sessões ilimitadas com o Plus',
    seePlan: 'Ver meu plano',
    fairPlay:
      'O Coach usa suas lições e revisões. O Ranked não muda: pagar nunca dá vantagem nas partidas.',
  },
  it: {
    title: 'Coach',
    back: 'Indietro',
    loadError: 'Non siamo riusciti a caricare la tua diagnosi.',
    overline: 'IL TUO COACH POLYGO',
    groups: { mastered: 'Padroneggiate', due: 'Da ripassare oggi', struggling: 'Difficili' },
    groupsHint: {
      mastered: 'Le sai',
      due: 'Per non dimenticarle',
      struggling: 'Sbagli spesso',
    },
    bubbleFocus: (topics: string[]) =>
      topics.length === 1
        ? `${topics[0]} ti sta dando filo da torcere. Ho preparato una sessione per rinforzarlo.`
        : `${topics.slice(0, -1).join(', ')} e ${topics[topics.length - 1]} ti stanno dando filo da torcere. Ho preparato una sessione per rinforzarli.`,
    bubbleMaintenance: (n: number) =>
      n === 1
        ? 'Nessun argomento debole. C’è 1 parola che ti sfugge: alleniamola.'
        : `Nessun argomento debole. Ci sono ${n} parole che ti sfuggono: alleniamole.`,
    bubbleClean:
      'Nessun errore da allenare. Continua con lezioni e ripassi: ti avviso se qualcosa diventa difficile.',
    bubbleNew: (studied: number, needed: number) =>
      `Ti sto conoscendo: sei a ${studied} parole su ${needed}. Con un po’ più di pratica preparo il tuo piano.`,
    sessionFocus: 'La tua sessione personalizzata',
    sessionMaintenance: 'Sessione di mantenimento',
    alsoInPlus: 'Incluso anche in PolyGo Plus',
    perkSmart: 'Ripasso intelligente',
    perkEnergy: 'Energia illimitata',
    perkAds: 'Senza pubblicità',
    unlimited: 'Illimitato',
    freeLeft: (n: number) => `${n} gratis`,
    unlimitedA11y: 'Sessioni illimitate con PolyGo Plus',
    freeLeftA11y: (n: number, limit: number) => `Ti restano ${n} sessioni gratis su ${limit}`,
    headlineOk: (n: number) =>
      n === 1 ? 'Ho trovato 1 argomento da migliorare' : `Ho trovato ${n} argomenti da migliorare`,
    headlineGood: 'Stai andando alla grande!',
    headlineNew: 'Ti sto conoscendo',
    found: (topics: string[]) =>
      `${list(topics, 'e')} ${topics.length === 1 ? 'ti sta' : 'ti stanno'} dando filo da torcere. Ho preparato una sessione breve per rinforzar${topics.length === 1 ? 'lo' : 'li'}.`,
    allGoodBody:
      'Non ho trovato argomenti con errori ripetuti. Continua a esercitarti: se qualcosa inizia a diventare difficile, ti avviso.',
    newBody: (studied: number, needed: number) =>
      `Mi serve un po’ più di pratica da parte tua per consigliarti qualcosa di preciso: sei a ${studied} parole su ${needed}.`,
    goLearn: 'Continua a imparare',
    mastered: 'padroneggiate',
    ofTotal: (total: number) => `/${total}`,
    groupsA11y: (m: number, d: number, s: number, total: number) =>
      `Su ${total} parole: ${m} padroneggiate, ${d} da ripassare oggi e ${s} difficili per te`,
    struggle: (n: number): string => (n === 1 ? 'parola difficile' : 'parole difficili'),
    studied: (n: number): string => (n === 1 ? 'parola studiata' : 'parole studiate'),
    toImprove: (n: number): string =>
      n === 1 ? 'argomento da migliorare' : 'argomenti da migliorare',
    plan: 'Il tuo piano di miglioramento',
    priority: (i: number): string =>
      i === 0 ? 'Priorità alta' : i === 1 ? 'Priorità media' : 'Da rinforzare',
    accuracy: (p: number) => `${p}% di risposte giuste`,
    struggling: (n: number) => (n === 1 ? '1 parola difficile' : `${n} parole difficili`),
    areaA11y: (i: number, title: string, accuracy: string, struggling: string, priority: string) =>
      `${i}. ${title}. ${accuracy}. ${struggling}. ${priority}.`,
    words: 'Parole che alleneremo',
    strengths: 'I tuoi punti di forza',
    session: 'La tua sessione personalizzata',
    minutes: (low: number, high: number) => (low === high ? `~${low} min` : `${low}–${high} min`),
    exercises: (n: number) => `${n} ${n === 1 ? 'esercizio' : 'esercizi'}`,
    focusOn: 'Concentrata sui tuoi errori reali',
    start: 'Inizia la mia sessione',
    startSubPlus: 'Sessioni illimitate con Plus',
    startSubTrial: (n: number, limit: number) =>
      n === 1
        ? `La tua ultima sessione gratis su ${limit}`
        : `Gratis · te ne restano ${n} su ${limit}`,
    trialNote: 'La sessione gratis viene scalata solo quando inizia.',
    lockedTitle: 'Il tuo piano è pronto',
    lockedBody: (limit: number) =>
      `Hai usato le tue ${limit} sessioni gratis. Con Plus alleni i tuoi punti deboli ogni giorno, senza limiti.`,
    unlock: 'Sblocca il Coach illimitato',
    unlockSub: 'In più: energia illimitata e senza pubblicità',
    progress: 'I tuoi progressi con il Coach',
    lastSession: 'Ultima sessione',
    delta: (d: number) =>
      d >= 0 ? `+${d} pt dalla tua prima sessione` : `${d} pt dalla tua prima sessione`,
    sessionsDone: (n: number) => (n === 1 ? '1 sessione completata' : `${n} sessioni completate`),
    notFinished: 'Non completata',
    trialTag: 'Gratis',
    resultGreat: 'Sessione brillante!',
    resultGood: 'Bei progressi!',
    resultTough: 'Ogni errore conta',
    resultBody: (p: number): string =>
      p >= 85
        ? `Risposte giuste al primo tentativo: ${p}%. Il tuo Coach ha già aggiornato il piano con questo risultato.`
        : p >= 60
          ? `Risposte giuste: ${p}%. Il tuo Coach sa già cosa rinforzare nella prossima sessione.`
          : `Risposte giuste: ${p}%. Quelle parole tornano nella prossima sessione finché non ti vengono.`,
    resultLeft: (n: number): string =>
      n === 1 ? 'Ti resta 1 sessione gratis' : `Ti restano ${n} sessioni gratis`,
    resultLast: 'Hai usato le tue sessioni gratis',
    resultLastBody:
      'Il tuo piano resta salvato. Con Plus continui ad allenare i tuoi punti deboli quando vuoi.',
    resultPlus: 'Sessioni illimitate con Plus',
    seePlan: 'Vedi il mio piano',
    fairPlay:
      'Il Coach usa le tue lezioni e i tuoi ripassi. Il Ranked non cambia: pagare non dà mai vantaggi nelle partite.',
  },
  fr: {
    title: 'Coach',
    back: 'Retour',
    loadError: 'Impossible de charger ton diagnostic.',
    overline: 'TON COACH POLYGO',
    groups: { mastered: 'Maîtrisés', due: 'À réviser aujourd’hui', struggling: 'Difficiles' },
    groupsHint: {
      mastered: 'Tu les connais',
      due: 'Pour ne pas les oublier',
      struggling: 'Tu te trompes souvent',
    },
    bubbleFocus: (topics: string[]) =>
      topics.length === 1
        ? `Tu as du mal avec ${topics[0]}. J’ai préparé une session pour le renforcer.`
        : `Tu as du mal avec ${topics.slice(0, -1).join(', ')} et ${topics[topics.length - 1]}. J’ai préparé une session pour les renforcer.`,
    bubbleMaintenance: (n: number) =>
      n === 1
        ? 'Aucun thème faible. Il y a 1 mot qui te résiste : on l’entraîne.'
        : `Aucun thème faible. Il y a ${n} mots qui te résistent : on les entraîne.`,
    bubbleClean:
      'Aucune erreur à entraîner. Continue tes leçons et tes révisions : je te préviens si quelque chose coince.',
    bubbleNew: (studied: number, needed: number) =>
      `J’apprends à te connaître : tu en es à ${studied} mots sur ${needed}. Encore un peu de pratique et je te prépare ton plan.`,
    sessionFocus: 'Ta session personnalisée',
    sessionMaintenance: 'Session d’entretien',
    alsoInPlus: 'Aussi inclus dans PolyGo Plus',
    perkSmart: 'Révision intelligente',
    perkEnergy: 'Énergie illimitée',
    perkAds: 'Sans pubs',
    unlimited: 'Illimité',
    freeLeft: (n: number) => `${n} gratuites`,
    unlimitedA11y: 'Sessions illimitées avec PolyGo Plus',
    freeLeftA11y: (n: number, limit: number) =>
      `Il te reste ${n} sessions gratuites sur ${limit}`,
    headlineOk: (n: number) =>
      n === 1 ? 'J’ai trouvé 1 thème à améliorer' : `J’ai trouvé ${n} thèmes à améliorer`,
    headlineGood: 'Un sans-faute !',
    headlineNew: 'J’apprends à te connaître',
    found: (topics: string[]) =>
      `Tu as du mal avec ${list(topics, 'et')}. J’ai préparé une petite session pour ${topics.length === 1 ? 'le' : 'les'} renforcer.`,
    allGoodBody:
      'Je n’ai pas trouvé de thèmes avec des erreurs répétées. Continue de pratiquer : si quelque chose devient difficile, je te préviens.',
    newBody: (studied: number, needed: number) =>
      `J’ai besoin d’un peu plus de pratique de ta part pour te conseiller quelque chose de précis : tu en es à ${studied} mots sur ${needed}.`,
    goLearn: 'Continuer à apprendre',
    mastered: 'maîtrisés',
    ofTotal: (total: number) => `/${total}`,
    groupsA11y: (m: number, d: number, s: number, total: number) =>
      `Sur ${total} mots : ${m} maîtrisés, ${d} à réviser aujourd’hui et ${s} difficiles pour toi`,
    struggle: (n: number): string => (n === 1 ? 'mot difficile' : 'mots difficiles'),
    studied: (n: number): string => (n === 1 ? 'mot étudié' : 'mots étudiés'),
    toImprove: (n: number): string => (n === 1 ? 'thème à améliorer' : 'thèmes à améliorer'),
    plan: 'Ton plan de progression',
    priority: (i: number): string =>
      i === 0 ? 'Priorité haute' : i === 1 ? 'Priorité moyenne' : 'À renforcer',
    accuracy: (p: number) => `${p} % de bonnes réponses`,
    struggling: (n: number) => (n === 1 ? '1 mot difficile' : `${n} mots difficiles`),
    areaA11y: (i: number, title: string, accuracy: string, struggling: string, priority: string) =>
      `${i}. ${title}. ${accuracy}. ${struggling}. ${priority}.`,
    words: 'Les mots qu’on va entraîner',
    strengths: 'Tes points forts',
    session: 'Ta session personnalisée',
    minutes: (low: number, high: number) => (low === high ? `~${low} min` : `${low}–${high} min`),
    exercises: (n: number) => `${n} ${n === 1 ? 'exercice' : 'exercices'}`,
    focusOn: 'Centrée sur tes vraies erreurs',
    start: 'Commencer ma session',
    startSubPlus: 'Sessions illimitées avec Plus',
    startSubTrial: (n: number, limit: number) =>
      n === 1
        ? `Ta dernière session gratuite sur ${limit}`
        : `Gratuit · il t’en reste ${n} sur ${limit}`,
    trialNote: 'La session gratuite n’est décomptée qu’au moment où elle commence.',
    lockedTitle: 'Ton plan est prêt',
    lockedBody: (limit: number) =>
      `Tu as utilisé tes ${limit} sessions gratuites. Avec Plus, tu entraînes tes points faibles tous les jours, sans limite.`,
    unlock: 'Débloquer le Coach illimité',
    unlockSub: 'En plus : énergie illimitée et sans pubs',
    progress: 'Tes progrès avec le Coach',
    lastSession: 'Dernière session',
    delta: (d: number) =>
      d >= 0 ? `+${d} pts depuis ta première session` : `${d} pts depuis ta première session`,
    sessionsDone: (n: number) => (n === 1 ? '1 session terminée' : `${n} sessions terminées`),
    notFinished: 'Pas terminée',
    trialTag: 'Gratuit',
    resultGreat: 'Session brillante !',
    resultGood: 'Beaux progrès !',
    resultTough: 'Chaque erreur compte',
    resultBody: (p: number): string =>
      p >= 85
        ? `${p} % de bonnes réponses du premier coup. Ton Coach a déjà mis à jour ton plan avec ce résultat.`
        : p >= 60
          ? `${p} % de bonnes réponses. Ton Coach sait déjà quoi renforcer à la prochaine session.`
          : `${p} % de bonnes réponses. Ces mots reviendront à ta prochaine session jusqu’à ce que tu les maîtrises.`,
    resultLeft: (n: number): string =>
      n === 1 ? 'Il te reste 1 session gratuite' : `Il te reste ${n} sessions gratuites`,
    resultLast: 'Tu as utilisé tes sessions gratuites',
    resultLastBody:
      'Ton plan reste enregistré. Avec Plus, tu continues d’entraîner tes points faibles quand tu veux.',
    resultPlus: 'Sessions illimitées avec Plus',
    seePlan: 'Voir mon plan',
    fairPlay:
      'Le Coach utilise tes leçons et tes révisions. Ranked ne change pas : payer ne donne jamais d’avantage en partie.',
  },
});
