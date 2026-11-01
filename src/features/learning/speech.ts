import * as Speech from 'expo-speech';

import { configureAudio } from '@/lib/sounds';

const normalize = (language: string) => language.toLowerCase().replace('_', '-');

/**
 * Voces de iOS que no sirven para aprender: las de efectos (Bubbles, Zarvox, Bad News…) y las
 * Eloquence (Eddy, Flo, Grandma…), más robóticas que las comunes.
 */
const NOVELTY = /speech\.synthesis\.voice|eloquence/;

/** Puntaje de una voz: inglés de EE. UU. primero, después la mejor calidad instalada. */
export function voiceScore(voice: Pick<Speech.Voice, 'identifier' | 'language' | 'quality'>) {
  const language = normalize(voice.language);
  if (!language.startsWith('en')) return -Infinity;
  const id = voice.identifier.toLowerCase();
  let score = language === 'en-us' ? 100 : 50;
  if (NOVELTY.test(id)) score -= 80;
  // iOS: premium > enhanced > compact (se bajan desde Ajustes → Accesibilidad → Contenido leído).
  if (id.includes('premium')) score += 30;
  else if (id.includes('enhanced') || voice.quality === Speech.VoiceQuality.Enhanced) score += 20;
  // Android: a igual calidad, la local no depende de la conexión ni tarda en arrancar.
  if (id.endsWith('-local')) score += 1;
  return score;
}

let englishVoice: Promise<string | undefined> | null = null;

/**
 * Voz inglesa instalada en el dispositivo. En Android, si el motor no tiene exactamente
 * «en-US», pedirla sólo por idioma puede no sonar: se elige una voz concreta.
 */
function pickEnglishVoice(): Promise<string | undefined> {
  englishVoice ??= Speech.getAvailableVoicesAsync()
    .then((voices) => {
      const english = voices.filter((v) => voiceScore(v) > -Infinity);
      // El motor de Android a veces todavía no cargó las voces: se reintenta la próxima vez.
      if (english.length === 0) englishVoice = null;
      return english.reduce<Speech.Voice | undefined>(
        (best, v) => (!best || voiceScore(v) > voiceScore(best) ? v : best),
        undefined,
      )?.identifier;
    })
    .catch(() => {
      englishVoice = null;
      return undefined;
    });
  return englishVoice;
}

/** Velocidades: las palabras sueltas se dicen más despacio que las frases; «lento» para repetir. */
export const SPEECH_RATES = { word: 0.8, sentence: 0.9, slow: 0.5 } as const;

/**
 * Texto y velocidad para el motor. Sin puntuación final, las palabras sueltas suenan cortadas o
 * con tono de pregunta: el punto les da la entonación de una frase terminada.
 */
export function speechInput(text: string, slow = false) {
  const trimmed = text.trim();
  const isWord = !/\s/.test(trimmed);
  return {
    text: /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`,
    rate: slow ? SPEECH_RATES.slow : isWord ? SPEECH_RATES.word : SPEECH_RATES.sentence,
  };
}

/** Pronunciación con la voz sintetizada del sistema (no es una grabación de un hablante nativo). */
export function speakEnglish(text: string, options: { slow?: boolean } = {}) {
  void (async () => {
    await configureAudio();
    const voice = await pickEnglishVoice();
    // Cortar sólo si hay algo sonando: stop() seguido de speak() puede tragarse la palabra nueva.
    if (await Speech.isSpeakingAsync()) await Speech.stop();
    const input = speechInput(text, options.slow);
    Speech.speak(input.text, {
      language: 'en-US',
      voice,
      rate: input.rate,
      onError: (error) => {
        if (__DEV__) console.warn('expo-speech', error);
      },
    });
  })();
}

export function stopSpeaking() {
  void Speech.stop();
}
