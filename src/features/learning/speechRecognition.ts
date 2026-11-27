import { requireOptionalNativeModule } from 'expo';
import type { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';
import { Platform } from 'react-native';

import { normalizeAnswer, editDistance } from '@shared/answers';

/**
 * Reconocimiento de voz del teléfono (expo-speech-recognition) para los ejercicios de hablar.
 *
 * El módulo nativo se pide como opcional: en un build sin él (Expo Go, web o una app vieja que recibe
 * esta versión por actualización OTA) devuelve null y el ejercicio se muestra escrito, como siempre.
 */
type ExpoSpeechRecognitionModuleType = typeof ExpoSpeechRecognitionModule;

let cached: ExpoSpeechRecognitionModuleType | null | undefined;

export function speechModule(): ExpoSpeechRecognitionModuleType | null {
  if (cached !== undefined) return cached;
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    cached = null;
    return cached;
  }
  try {
    cached = requireOptionalNativeModule<ExpoSpeechRecognitionModuleType>('ExpoSpeechRecognition');
  } catch {
    cached = null;
  }
  return cached;
}

/** ¿Se puede hablar en este teléfono? (módulo presente y servicio de reconocimiento disponible). */
export function speechRecognitionAvailable(): boolean {
  const m = speechModule();
  if (!m) return false;
  try {
    return m.isRecognitionAvailable();
  } catch {
    return false;
  }
}

/**
 * De las transcripciones que propone el reconocedor, la más parecida a alguna respuesta válida (así un
 * «I want a coffee» que llegó segundo gana a «I want a copy»). Empate: la primera, la más probable.
 */
export function bestTranscript(
  alternatives: readonly string[],
  accepted: readonly string[],
): string {
  const targets = accepted.map(normalizeAnswer).filter(Boolean);
  let best = alternatives[0] ?? '';
  let bestScore = Infinity;
  for (const alt of alternatives) {
    const norm = normalizeAnswer(alt);
    if (!norm) continue;
    const score = Math.min(...targets.map((t) => editDistance(norm, t)), Infinity);
    if (score < bestScore) {
      best = alt;
      bestScore = score;
    }
  }
  return best.trim();
}

/** Palabras de la frase esperada que aparecen en lo que dijo la persona (para pintarlas en verde). */
export function heardWords(
  expected: string,
  transcript: string,
): { word: string; heard: boolean }[] {
  const said = new Set(normalizeAnswer(transcript).split(' ').filter(Boolean));
  return expected
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({ word, heard: said.has(normalizeAnswer(word)) }));
}
