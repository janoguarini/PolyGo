import { defineStrings } from '@/i18n';

/**
 * Textos de Word Rush (motor interno «Arcade»), en el idioma de la interfaz. Cortos: se leen jugando.
 * El nombre visible del modo es siempre Word Rush; Swipe, Connect, Sentence y Audio son sus formatos.
 */
export const arcadeStrings = defineStrings({
  es: {
    modeName: 'Word Rush',
    you: 'Tú',
    rules:
      '60 segundos y cuatro formatos que se van mezclando. Aciertos seguidos multiplican tus puntos y en los últimos 15 segundos todo vale el doble.',
    formatsA11y: (names: string) => `Formatos de la partida: ${names}`,
    durationChip: (s: number) => `${s} s`,
    getReady: 'Prepárate',
    countdownA11y: (s: number) => `Empieza en ${s}`,
    timeUp: '¡Tiempo!',
    timeUpSub: 'Calculando el resultado…',
    reconnecting: 'Reconectando… el reloj sigue corriendo',
    frenzy: '¡FRENESÍ!',
    frenzySub: '¡PUNTOS x2!',
    combo: (n: number) => `COMBO ${n}`,
    comboA11y: (n: number, m: number) => `Combo de ${n}, multiplicador por ${m}`,
    comboBroken: 'Combo perdido',
    secondsLeft: (s: number) => `Quedan ${s} segundos`,
    opponentOffline: 'Rival desconectado',
    tugA11y: (me: number, them: number) =>
      me === them
        ? `Empate, ${me} a ${them}`
        : me > them
          ? `Vas ganando ${me} a ${them}`
          : `Vas perdiendo ${me} a ${them}`,
    // Swipe Battle
    swipeTitle: 'Swipe Battle',
    swipeHint: '¿Es la traducción correcta?',
    swipeYes: 'Correcta',
    swipeNo: 'Incorrecta',
    swipeCardA11y: (word: string, candidate: string) =>
      `${word}. ¿Significa ${candidate}? Desliza a la derecha si es correcta, a la izquierda si no.`,
    // Connect
    connectTitle: 'Connect Battle',
    connectHint: 'Une cada palabra con su traducción',
    // Sentence Rush
    sentenceTitle: 'Sentence Rush',
    sentenceHint: 'Arma la frase',
    undo: 'Deshacer',
    // Audio Blitz
    audioTitle: 'Audio Blitz',
    audioHint: '¿Qué significa?',
    replay: (left: number) => `Repetir (${left})`,
    replayA11y: 'Escuchar otra vez',
    noAudio: 'Sin audio: lee la palabra',
    // Veredicto
    tooFast: '¡Muy rápido!',
    waiting: 'Cargando…',
    // Resultado
    bestCombo: 'Mejor combo',
    frenzyPoints: 'Puntos en Frenesí',
    hits: 'Aciertos',
    misses: 'Errores',
    answers: 'Respuestas',
    missedBy: (n: number) => `Te faltaron ${n} puntos`,
  },
  en: {
    modeName: 'Word Rush',
    you: 'You',
    rules:
      '60 seconds of four formats mixed together. Answer right in a row to multiply your points, and everything counts double in the last 15 seconds.',
    formatsA11y: (names: string) => `Match formats: ${names}`,
    durationChip: (s: number) => `${s} s`,
    getReady: 'Get ready',
    countdownA11y: (s: number) => `Starting in ${s}`,
    timeUp: 'Time’s up!',
    timeUpSub: 'Calculating the result…',
    reconnecting: 'Reconnecting… the clock keeps running',
    frenzy: 'FRENZY!',
    frenzySub: 'x2 POINTS!',
    combo: (n: number) => `COMBO ${n}`,
    comboA11y: (n: number, m: number) => `Combo of ${n}, times ${m} multiplier`,
    comboBroken: 'Combo lost',
    secondsLeft: (s: number) => `${s} seconds left`,
    opponentOffline: 'Opponent offline',
    tugA11y: (me: number, them: number) =>
      me === them
        ? `Tied, ${me} to ${them}`
        : me > them
          ? `You’re winning ${me} to ${them}`
          : `You’re losing ${me} to ${them}`,
    swipeTitle: 'Swipe Battle',
    swipeHint: 'Is this the right translation?',
    swipeYes: 'Right',
    swipeNo: 'Wrong',
    swipeCardA11y: (word: string, candidate: string) =>
      `${word}. Does it mean ${candidate}? Swipe right if it does, left if it doesn’t.`,
    connectTitle: 'Connect Battle',
    connectHint: 'Match each word with its translation',
    sentenceTitle: 'Sentence Rush',
    sentenceHint: 'Build the sentence',
    undo: 'Undo',
    audioTitle: 'Audio Blitz',
    audioHint: 'What does it mean?',
    replay: (left: number) => `Replay (${left})`,
    replayA11y: 'Listen again',
    noAudio: 'No audio: read the word',
    tooFast: 'Too fast!',
    waiting: 'Loading…',
    bestCombo: 'Best combo',
    frenzyPoints: 'Frenzy points',
    hits: 'Correct',
    misses: 'Mistakes',
    answers: 'Answers',
    missedBy: (n: number) => `You were ${n} points short`,
  },
  'pt-BR': {
    modeName: 'Word Rush',
    you: 'Você',
    rules:
      '60 segundos e quatro formatos que vão se misturando. Acertos seguidos multiplicam seus pontos e, nos últimos 15 segundos, tudo vale o dobro.',
    formatsA11y: (names: string) => `Formatos da partida: ${names}`,
    durationChip: (s: number) => `${s} s`,
    getReady: 'Prepare-se',
    countdownA11y: (s: number) => `Começa em ${s}`,
    timeUp: 'Tempo!',
    timeUpSub: 'Calculando o resultado…',
    reconnecting: 'Reconectando… o relógio continua correndo',
    frenzy: 'FRENESI!',
    frenzySub: 'PONTOS x2!',
    combo: (n: number) => `COMBO ${n}`,
    comboA11y: (n: number, m: number) => `Combo de ${n}, multiplicador ${m}x`,
    comboBroken: 'Combo perdido',
    secondsLeft: (s: number) => `Faltam ${s} segundos`,
    opponentOffline: 'Rival desconectado',
    tugA11y: (me: number, them: number) =>
      me === them
        ? `Empate, ${me} a ${them}`
        : me > them
          ? `Você está ganhando por ${me} a ${them}`
          : `Você está perdendo por ${me} a ${them}`,
    swipeTitle: 'Swipe Battle',
    swipeHint: 'É a tradução certa?',
    swipeYes: 'Certa',
    swipeNo: 'Errada',
    swipeCardA11y: (word: string, candidate: string) =>
      `${word}. Significa ${candidate}? Deslize para a direita se estiver certa, para a esquerda se não.`,
    connectTitle: 'Connect Battle',
    connectHint: 'Ligue cada palavra à sua tradução',
    sentenceTitle: 'Sentence Rush',
    sentenceHint: 'Monte a frase',
    undo: 'Desfazer',
    audioTitle: 'Audio Blitz',
    audioHint: 'O que significa?',
    replay: (left: number) => `Repetir (${left})`,
    replayA11y: 'Ouvir de novo',
    noAudio: 'Sem áudio: leia a palavra',
    tooFast: 'Rápido demais!',
    waiting: 'Carregando…',
    bestCombo: 'Melhor combo',
    frenzyPoints: 'Pontos no Frenesi',
    hits: 'Acertos',
    misses: 'Erros',
    answers: 'Respostas',
    missedBy: (n: number) => `Faltaram ${n} pontos`,
  },
  it: {
    modeName: 'Word Rush',
    you: 'Tu',
    rules:
      '60 secondi e quattro formati che si alternano. Le risposte giuste di fila moltiplicano i tuoi punti e negli ultimi 15 secondi tutto vale il doppio.',
    formatsA11y: (names: string) => `Formati della partita: ${names}`,
    durationChip: (s: number) => `${s} s`,
    getReady: 'Preparati',
    countdownA11y: (s: number) => `Si parte tra ${s}`,
    timeUp: 'Tempo scaduto!',
    timeUpSub: 'Calcolo del risultato…',
    reconnecting: 'Riconnessione… il tempo continua a scorrere',
    frenzy: 'FRENESIA!',
    frenzySub: 'PUNTI x2!',
    combo: (n: number) => `COMBO ${n}`,
    comboA11y: (n: number, m: number) => `Combo da ${n}, moltiplicatore per ${m}`,
    comboBroken: 'Combo persa',
    secondsLeft: (s: number) => `Mancano ${s} secondi`,
    opponentOffline: 'Avversario disconnesso',
    tugA11y: (me: number, them: number) =>
      me === them
        ? `Pareggio, ${me} a ${them}`
        : me > them
          ? `Stai vincendo ${me} a ${them}`
          : `Stai perdendo ${me} a ${them}`,
    swipeTitle: 'Swipe Battle',
    swipeHint: 'È la traduzione giusta?',
    swipeYes: 'Giusta',
    swipeNo: 'Sbagliata',
    swipeCardA11y: (word: string, candidate: string) =>
      `${word}. Significa ${candidate}? Scorri a destra se è giusta, a sinistra se non lo è.`,
    connectTitle: 'Connect Battle',
    connectHint: 'Abbina ogni parola alla sua traduzione',
    sentenceTitle: 'Sentence Rush',
    sentenceHint: 'Componi la frase',
    undo: 'Annulla',
    audioTitle: 'Audio Blitz',
    audioHint: 'Che cosa significa?',
    replay: (left: number) => `Riascolta (${left})`,
    replayA11y: 'Ascolta di nuovo',
    noAudio: 'Niente audio: leggi la parola',
    tooFast: 'Troppo veloce!',
    waiting: 'Caricamento…',
    bestCombo: 'Combo migliore',
    frenzyPoints: 'Punti in Frenesia',
    hits: 'Risposte giuste',
    misses: 'Errori',
    answers: 'Risposte',
    missedBy: (n: number) => `Ti sono mancati ${n} punti`,
  },
});
