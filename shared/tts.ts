/**
 * Voces neurales pregeneradas (Google Cloud Text-to-Speech, Chirp 3: HD).
 *
 * scripts/build-tts.ts genera un MP3 por texto distinto del contenido y lo sube al bucket público
 * `tts` de Supabase Storage; la app (src/features/learning/neuralVoice.ts) lo reproduce y, si un
 * texto no tiene audio, usa la voz del teléfono como antes. Este archivo es el contrato entre los dos:
 * misma normalización, misma clave y mismas rutas.
 *
 * Rutas en el bucket:
 *   <idioma>/manifest.json         índice de lo generado (TtsManifest)
 *   <idioma>/<nombre de la voz>/<clave>.mp3   un audio
 * Hablantes: `a` es la voz de siempre; `b`, el segundo hablante de los diálogos. El nombre de la
 * voz va en la ruta: si se cambia de voz, los audios nuevos no chocan con los guardados en caché.
 */

export const TTS_BUCKET = 'tts';
export const TTS_MANIFEST_VERSION = 1;

export type TtsSlot = 'a' | 'b';

export interface TtsVoiceConfig {
  /** languageCode de Google («cmn-CN» para chino mandarín). */
  googleLocale: string;
  /** Nombre completo de la voz en Google, por hablante. */
  voices: Record<TtsSlot, string>;
}

/**
 * Voces por idioma del curso: `a` femenina y `b` masculina, para que los dos hablantes de un diálogo
 * se distingan. Inglés y español las eligió el equipo de oído (2026-11-27); el resto, Kore y Puck. El script verifica con voices.list que existan antes de generar nada.
 */
export const TTS_VOICES: Record<string, TtsVoiceConfig> = {
  en: { googleLocale: 'en-US', voices: { a: 'en-US-Chirp3-HD-Leda', b: 'en-US-Chirp3-HD-Orus' } },
  it: { googleLocale: 'it-IT', voices: { a: 'it-IT-Chirp3-HD-Kore', b: 'it-IT-Chirp3-HD-Puck' } },
  pt: { googleLocale: 'pt-BR', voices: { a: 'pt-BR-Chirp3-HD-Kore', b: 'pt-BR-Chirp3-HD-Puck' } },
  zh: {
    googleLocale: 'cmn-CN',
    voices: { a: 'cmn-CN-Chirp3-HD-Kore', b: 'cmn-CN-Chirp3-HD-Puck' },
  },
  fr: { googleLocale: 'fr-FR', voices: { a: 'fr-FR-Chirp3-HD-Kore', b: 'fr-FR-Chirp3-HD-Puck' } },
  es: { googleLocale: 'es-US', voices: { a: 'es-US-Chirp3-HD-Zephyr', b: 'es-US-Chirp3-HD-Orus' } },
};

/** Índice de un idioma: qué claves hay generadas por hablante. */
export interface TtsManifest {
  version: typeof TTS_MANIFEST_VERSION;
  language: string;
  voices: Record<TtsSlot, string>;
  keys: Record<TtsSlot, string[]>;
}

const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{20E3}]/gu;

/**
 * Lo que se pronuncia de un texto: sin emojis (una escena dibujada con emojis es la imagen del
 * ejercicio y leerla daría la respuesta) y con los espacios colapsados. Vacío = nada que decir.
 */
export function spokenText(text: string): string {
  return text.normalize('NFC').replace(EMOJI, '').replace(/\s+/g, ' ').trim();
}

/** Texto que se manda al sintetizador: con punto final, para que suene como frase terminada. */
export function ttsInput(text: string): string {
  const spoken = spokenText(text);
  return /[.!?。！？…]$/.test(spoken) ? spoken : `${spoken}.`;
}

/**
 * cyrb53: hash rápido de 53 bits, igual en Node y en el teléfono (sin dependencias). Con miles de
 * textos por idioma, una colisión es astronómicamente improbable.
 */
function cyrb53(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, '0');
}

/** Clave de un texto (la misma para cualquier hablante: la voz va en la ruta). */
export function ttsKey(text: string): string {
  return cyrb53(spokenText(text));
}

export const ttsManifestPath = (language: string) => `${language}/manifest.json`;

export const ttsClipPath = (language: string, voice: string, key: string) =>
  `${language}/${voice}/${key}.mp3`;
