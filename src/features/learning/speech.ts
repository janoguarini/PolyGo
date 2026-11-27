import * as Speech from 'expo-speech';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { HAN, languageConfig } from '@shared/languages';
import { spokenText } from '@shared/tts';

import { configureAudio } from '@/lib/sounds';

import { hasNeuralClip, loadNeuralVoices, playNeural, stopNeural } from './neuralVoice';

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

/** Idioma que se estudia (y su locale); lo fija useSpeechLanguage según el perfil. */
let currentLanguage = languageConfig('en').code;
let currentLocale = languageConfig('en').speechLocale;

export function setSpeechLanguage(code: string | null | undefined) {
  const config = languageConfig(code);
  currentLanguage = config.code;
  currentLocale = config.speechLocale;
  // Voces neurales del idioma (si ya se generaron): el índice se baja en segundo plano.
  void loadNeuralVoices(config.code);
}

/** Velocidad de «lento» con voz neural (el tono no cambia). */
export const NEURAL_SLOW_RATE = 0.7;

/** Mantiene la voz en el idioma del perfil (se monta en el layout raíz). */
export function useSpeechLanguage(code: string | null | undefined) {
  useEffect(() => setSpeechLanguage(code), [code]);
}

/**
 * Velocidades: las palabras sueltas se dicen más despacio que las frases; «lento» para repetir.
 * En iOS expo-speech multiplica por AVSpeechUtteranceDefaultSpeechRate (0,5) y la escala de Apple
 * no es lineal: entre 0,25 y 0,45 casi no se nota la diferencia. Para que «lento» suene lento de
 * verdad hay que bajar mucho más (0,2 → 0,1 de AVSpeech ≈ 60 % de la velocidad normal). En Android
 * setSpeechRate sí es lineal: 0,5 = mitad de velocidad.
 */
export const SPEECH_RATES = {
  word: 0.8,
  sentence: 0.9,
  slow: Platform.OS === 'ios' ? 0.2 : 0.5,
} as const;

/**
 * Texto y velocidad para el motor. Sin puntuación final, las palabras sueltas suenan cortadas o
 * con tono de pregunta: el punto les da la entonación de una frase terminada.
 */
/**
 * Lo que se pronuncia de un texto: sin emojis (cierre de inglés A1, PW). Es el de shared/tts.ts, la
 * misma normalización con la que se generan las claves de los audios neurales.
 */
export { spokenText };

export function speechInput(text: string, slow = false) {
  const trimmed = spokenText(text);
  // En chino no hay espacios: es «palabra» si tiene hasta dos caracteres.
  const isWord = HAN.test(trimmed) ? trimmed.length <= 2 : !/\s/.test(trimmed);
  return {
    text: /[.!?。！？]$/.test(trimmed) ? trimmed : `${trimmed}.`,
    rate: slow ? SPEECH_RATES.slow : isWord ? SPEECH_RATES.word : SPEECH_RATES.sentence,
  };
}

/**
 * Pronunciación en el idioma que se estudia: con la voz neural pregenerada si ese texto la tiene
 * (neuralVoice.ts) y, si no o si falla, con la voz sintetizada del teléfono.
 */
export interface SpeakOptions {
  slow?: boolean;
  /** Empezó a sonar (Ranked Arcade lo usa para saber que el audio llegó). */
  onStart?: () => void;
  /** El motor falló: quien escucha muestra el texto en su lugar. */
  onError?: () => void;
}

export function speak(text: string, options: SpeakOptions = {}) {
  if (!spokenText(text)) return;
  dialogueToken++;
  void configureAudio();
  const neural = playNeural(currentLanguage, 'a', text, {
    rate: options.slow ? NEURAL_SLOW_RATE : 1,
    ...(options.onStart ? { onStart: options.onStart } : {}),
    // Si el audio no se pudo bajar ni reproducir, la voz del teléfono.
    onError: () => speakWithDevice(text, options),
  });
  if (neural) {
    void Speech.stop();
    return;
  }
  speakWithDevice(text, options);
}

/** Voz sintetizada del sistema (no es una grabación de un hablante nativo). */
function speakWithDevice(text: string, options: SpeakOptions = {}) {
  stopNeural();
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
      ...(options.onStart ? { onStart: options.onStart } : {}),
      onError: (error) => {
        if (__DEV__) console.warn('expo-speech', error);
        options.onError?.();
      },
    });
  })().catch(() => options.onError?.());
}

/**
 * Frase de la interfaz en español (p. ej. lo que dicen los personajes del camino), con la mejor voz
 * en español del dispositivo: no usa el idioma que se estudia. Un poco más aguda y rápida, como un
 * personaje. Sin emojis (no se leen).
 */
export function speakSpanish(text: string) {
  const spoken = spokenText(text);
  if (!spoken) return;
  const locale = 'es-AR';
  void (async () => {
    await configureAudio();
    const voice = await pickVoice(locale);
    if (await Speech.isSpeakingAsync()) await Speech.stop();
    Speech.speak(spoken, {
      language: locale,
      voice,
      rate: 1,
      pitch: 1.15,
      onError: (error) => {
        if (__DEV__) console.warn('expo-speech', error);
      },
    });
  })();
}

export function stopSpeaking() {
  dialogueToken++;
  stopNeural();
  void Speech.stop();
}

/** Voz de cada hablante de un diálogo y el tono con que se dice. */
export interface DialogueVoice {
  voice: string | undefined;
  pitch: number;
}

/**
 * Voces de un diálogo y qué tan reales son, para no prometer en la interfaz lo que el dispositivo no
 * tiene:
 * - `available`: hay al menos una voz instalada del idioma. Si no, el motor usa la del sistema (puede
 *   sonar en otro idioma o no sonar).
 * - `distinct`: `a` y `b` son dos voces (hablantes) distintas. Si es `false`, `b` es la MISMA voz con
 *   otro tono: ayuda a separar las líneas, pero no es una segunda voz y no se presenta como tal.
 */
export interface DialogueVoices {
  a: DialogueVoice;
  b: DialogueVoice;
  available: boolean;
  distinct: boolean;
}

/**
 * Hablante de una voz, para saber si dos voces son de verdad distintas. iOS: el nombre sin la calidad
 * («Samantha (Enhanced)» = «Samantha»); Android: el nombre sin la variante de red o local
 * (`en-us-x-iol-local` = `en-us-x-iol-network`).
 */
export function voiceSpeaker(v: Pick<Speech.Voice, 'identifier'> & { name?: string }) {
  return (v.name || v.identifier)
    .toLowerCase()
    .replace(/\s*\(.*\)\s*$/, '')
    .replace(/-(local|network)$/, '');
}

/**
 * Voces para un diálogo (fase C): `a` es la mejor voz instalada para el locale y `b` la mejor de
 * OTRO hablante. En diálogos se prefieren las voces locales: en Android, una voz `-network` falla sin
 * conexión. Si no hay un segundo hablante, `b` usa la misma voz con otro tono y `distinct` es
 * `false`. La velocidad nunca se acelera: la fija el estímulo.
 */
export function dialogueVoices(
  all: readonly (Pick<Speech.Voice, 'identifier' | 'language' | 'quality'> & { name?: string })[],
  locale: string,
): DialogueVoices {
  const score = (v: (typeof all)[number]) =>
    voiceScore(v, locale) - (v.identifier.toLowerCase().endsWith('-network') ? 5 : 0);
  const ranked = all
    .filter((v) => voiceScore(v, locale) > -Infinity)
    .sort((x, y) => score(y) - score(x));
  const first = ranked[0];
  const second = first && ranked.find((v) => voiceSpeaker(v) !== voiceSpeaker(first));
  return {
    a: { voice: first?.identifier, pitch: 1 },
    b: second ? { voice: second.identifier, pitch: 1 } : { voice: first?.identifier, pitch: 1.25 },
    available: !!first,
    distinct: !!second,
  };
}

const dialogueVoiceCache = new Map<string, Promise<DialogueVoices>>();

function pickDialogueVoices(locale: string) {
  const cached = dialogueVoiceCache.get(locale);
  if (cached) return cached;
  const picked = Speech.getAvailableVoicesAsync()
    .then((all) => {
      if (all.length === 0) dialogueVoiceCache.delete(locale);
      return dialogueVoices(all, locale);
    })
    .catch(() => {
      dialogueVoiceCache.delete(locale);
      return dialogueVoices([], locale);
    });
  dialogueVoiceCache.set(locale, picked);
  return picked;
}

/** Cada reproducción nueva (o stopSpeaking) invalida la anterior. */
let dialogueToken = 0;

export interface DialogueLine {
  text: string;
  voice: 'a' | 'b';
}

/**
 * Dice un mensaje oral línea por línea, cada hablante con su voz (estímulos de comprensión auditiva).
 * `rate` viene del estímulo; `slow` lo baja para repetir despacio. Devuelve una función que corta la
 * reproducción. Los errores del motor llegan a `onError` (la app ofrece reintentar).
 */
export function speakDialogue(
  lines: readonly DialogueLine[],
  rate: number,
  handlers: {
    slow?: boolean;
    onLine?: (index: number) => void;
    onDone?: () => void;
    onError?: (error: unknown) => void;
    /** Qué voces se van a usar (si hay voz del idioma y si son dos hablantes distintos). */
    onVoices?: (info: { available: boolean; distinct: boolean }) => void;
  } = {},
): () => void {
  const token = ++dialogueToken;
  const locale = currentLocale;
  const language = currentLanguage;
  const speed = handlers.slow ? Math.min(rate, SPEECH_RATES.slow) : rate;
  const alive = () => token === dialogueToken;
  if (lines.length > 0 && lines.every((l) => hasNeuralClip(language, l.voice, l.text))) {
    void configureAudio();
    void Speech.stop();
    handlers.onVoices?.({ available: true, distinct: true });
    const playLine = (i: number) => {
      if (!alive()) return;
      if (i >= lines.length) {
        handlers.onDone?.();
        return;
      }
      const line = lines[i]!;
      handlers.onLine?.(i);
      playNeural(language, line.voice, line.text, {
        rate: handlers.slow ? NEURAL_SLOW_RATE : 1,
        onDone: () => playLine(i + 1),
        onError: () => {
          if (alive()) handlers.onError?.(new Error('neural_voice_failed'));
        },
      });
    };
    playLine(0);
    return () => {
      if (alive()) stopSpeaking();
    };
  }
  void (async () => {
    try {
      await configureAudio();
      const voices = await pickDialogueVoices(locale);
      if (alive()) handlers.onVoices?.({ available: voices.available, distinct: voices.distinct });
      if (await Speech.isSpeakingAsync()) await Speech.stop();
      const sayLine = (i: number) => {
        if (!alive()) return;
        if (i >= lines.length) {
          handlers.onDone?.();
          return;
        }
        const line = lines[i]!;
        const v = line.voice === 'a' ? voices.a : voices.b;
        handlers.onLine?.(i);
        Speech.speak(speechInput(line.text).text, {
          language: locale,
          voice: v.voice,
          pitch: v.pitch,
          rate: speed,
          onDone: () => sayLine(i + 1),
          onError: (error) => {
            if (alive()) handlers.onError?.(error);
          },
        });
      };
      sayLine(0);
    } catch (error) {
      if (alive()) handlers.onError?.(error);
    }
  })();
  return () => {
    if (alive()) stopSpeaking();
  };
}
