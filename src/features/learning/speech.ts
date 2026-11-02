import * as Speech from 'expo-speech';
import { useEffect } from 'react';

import { HAN, languageConfig } from '@shared/languages';

import { configureAudio } from '@/lib/sounds';

const normalize = (language: string) => language.toLowerCase().replace('_', '-');

/**
 * Voces de iOS que no sirven para aprender: las de efectos (Bubbles, Zarvox, Bad News…) y las
 * Eloquence (Eddy, Flo, Grandma…), más robóticas que las comunes.
 */
const NOVELTY = /speech\.synthesis\.voice|eloquence/;

/**
 * Puntaje de una voz para un idioma: primero el locale exacto (en-US, it-IT, pt-BR, zh-CN), después
 * otras variantes del idioma y, a igualdad, la mejor calidad instalada.
 */
export function voiceScore(
  voice: Pick<Speech.Voice, 'identifier' | 'language' | 'quality'>,
  locale = 'en-US',
) {
  const language = normalize(voice.language);
  const wanted = normalize(locale);
  if (!language.startsWith(wanted.split('-')[0]!)) return -Infinity;
  const id = voice.identifier.toLowerCase();
  let score = language === wanted ? 100 : 50;
  if (NOVELTY.test(id)) score -= 80;
  // iOS: premium > enhanced > compact (se bajan desde Ajustes → Accesibilidad → Contenido leído).
  if (id.includes('premium')) score += 30;
  else if (id.includes('enhanced') || voice.quality === Speech.VoiceQuality.Enhanced) score += 20;
  // Android: a igual calidad, la local no depende de la conexión ni tarda en arrancar.
  if (id.endsWith('-local')) score += 1;
  return score;
}

const voices = new Map<string, Promise<string | undefined>>();

/**
 * Voz instalada en el dispositivo para el locale. En Android, si el motor no tiene exactamente ese
 * locale, pedirla sólo por idioma puede no sonar: se elige una voz concreta.
 */
function pickVoice(locale: string): Promise<string | undefined> {
  const cached = voices.get(locale);
  if (cached) return cached;
  const picked = Speech.getAvailableVoicesAsync()
    .then((all) => {
      const usable = all.filter((v) => voiceScore(v, locale) > -Infinity);
      // El motor de Android a veces todavía no cargó las voces: se reintenta la próxima vez.
      if (usable.length === 0) voices.delete(locale);
      return usable.reduce<Speech.Voice | undefined>(
        (best, v) => (!best || voiceScore(v, locale) > voiceScore(best, locale) ? v : best),
        undefined,
      )?.identifier;
    })
    .catch(() => {
      voices.delete(locale);
      return undefined;
    });
  voices.set(locale, picked);
  return picked;
}

/** Locale del idioma que se estudia; lo fija useSpeechLanguage según el perfil. */
let currentLocale = languageConfig('en').speechLocale;

export function setSpeechLanguage(code: string | null | undefined) {
  currentLocale = languageConfig(code).speechLocale;
}

/** Mantiene la voz en el idioma del perfil (se monta en el layout raíz). */
export function useSpeechLanguage(code: string | null | undefined) {
  useEffect(() => setSpeechLanguage(code), [code]);
}

/** Velocidades: las palabras sueltas se dicen más despacio que las frases; «lento» para repetir. */
export const SPEECH_RATES = { word: 0.8, sentence: 0.9, slow: 0.5 } as const;

/**
 * Texto y velocidad para el motor. Sin puntuación final, las palabras sueltas suenan cortadas o
 * con tono de pregunta: el punto les da la entonación de una frase terminada.
 */
export function speechInput(text: string, slow = false) {
  const trimmed = text.trim();
  // En chino no hay espacios: es «palabra» si tiene hasta dos caracteres.
  const isWord = HAN.test(trimmed) ? trimmed.length <= 2 : !/\s/.test(trimmed);
  return {
    text: /[.!?。！？]$/.test(trimmed) ? trimmed : `${trimmed}.`,
    rate: slow ? SPEECH_RATES.slow : isWord ? SPEECH_RATES.word : SPEECH_RATES.sentence,
  };
}

/**
 * Pronunciación con la voz sintetizada del sistema en el idioma que se estudia (no es una grabación
 * de un hablante nativo).
 */
export function speak(text: string, options: { slow?: boolean } = {}) {
  const locale = currentLocale;
  void (async () => {
    await configureAudio();
    const voice = await pickVoice(locale);
    // Cortar sólo si hay algo sonando: stop() seguido de speak() puede tragarse la palabra nueva.
    if (await Speech.isSpeakingAsync()) await Speech.stop();
    const input = speechInput(text, options.slow);
    Speech.speak(input.text, {
      language: locale,
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
