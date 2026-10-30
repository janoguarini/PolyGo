import * as Speech from 'expo-speech';

import { configureAudio } from '@/lib/sounds';

const normalize = (language: string) => language.toLowerCase().replace('_', '-');

let englishVoice: Promise<string | undefined> | null = null;

/**
 * Voz inglesa instalada en el dispositivo. En Android, si el motor no tiene exactamente
 * «en-US», pedirla sólo por idioma puede no sonar: se elige una voz concreta (en-US mejorada,
 * luego en-US, luego cualquier inglés).
 */
function pickEnglishVoice(): Promise<string | undefined> {
  englishVoice ??= Speech.getAvailableVoicesAsync()
    .then((voices) => {
      const english = voices.filter((v) => normalize(v.language).startsWith('en'));
      // El motor de Android a veces todavía no cargó las voces: se reintenta la próxima vez.
      if (english.length === 0) englishVoice = null;
      const us = english.filter((v) => normalize(v.language) === 'en-us');
      return (us.find((v) => v.quality === Speech.VoiceQuality.Enhanced) ?? us[0] ?? english[0])
        ?.identifier;
    })
    .catch(() => {
      englishVoice = null;
      return undefined;
    });
  return englishVoice;
}

/** Pronunciación con la voz sintetizada del sistema (no es una grabación de un hablante nativo). */
export function speakEnglish(text: string) {
  void (async () => {
    await configureAudio();
    const voice = await pickEnglishVoice();
    // Cortar sólo si hay algo sonando: stop() seguido de speak() puede tragarse la palabra nueva.
    if (await Speech.isSpeakingAsync()) await Speech.stop();
    Speech.speak(text, {
      language: 'en-US',
      voice,
      rate: 0.9,
      onError: (error) => {
        if (__DEV__) console.warn('expo-speech', error);
      },
    });
  })();
}

export function stopSpeaking() {
  void Speech.stop();
}
