import { defineStrings } from '@/i18n';

/**
 * Textos de Word Rush (motor interno «Arcade»), en el idioma de la interfaz. Cortos: se leen jugando.
 * El nombre visible del modo es siempre Word Rush; Swipe, Connect, Sentence y Audio son sus formatos.
 */
export const arcadeStrings = defineStrings({
  es: {
    modeName: 'Word Rush',
    you: 'Vos',
    rules:
      '60 segundos y cuatro formatos que se van mezclando. Aciertos seguidos multiplican tus puntos y en los últimos 15 segundos todo vale el doble.',
    formatsA11y: (names: string) => `Formatos de la partida: ${names}`,
    durationChip: (s: number) => `${s} s`,
    getReady: 'Preparate',
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
      `${word}. ¿Significa ${candidate}? Deslizá a la derecha si es correcta, a la izquierda si no.`,
    // Connect
    connectTitle: 'Connect Battle',
    connectHint: 'Uní cada palabra con su traducción',
    // Sentence Rush
    sentenceTitle: 'Sentence Rush',
    sentenceHint: 'Armá la frase',
    undo: 'Deshacer',
    // Audio Blitz
    audioTitle: 'Audio Blitz',
    audioHint: '¿Qué significa?',
    replay: (left: number) => `Repetir (${left})`,
    replayA11y: 'Escuchar otra vez',
    noAudio: 'Sin audio: leé la palabra',
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
});
