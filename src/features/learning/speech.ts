import * as Speech from 'expo-speech';

/** Pronunciación con la voz sintetizada del sistema (no es una grabación de un hablante nativo). */
export function speakEnglish(text: string) {
  void Speech.stop();
  Speech.speak(text, { language: 'en-US', rate: 0.9 });
}

export function stopSpeaking() {
  void Speech.stop();
}
