import type { AudioPlayer } from 'expo-audio';
import type { Directory as DirectoryType, File as FileType } from 'expo-file-system';
import { Platform } from 'react-native';

import {
  TTS_BUCKET,
  TTS_MANIFEST_VERSION,
  spokenText,
  ttsClipPath,
  ttsKey,
  ttsManifestPath,
  type TtsManifest,
  type TtsSlot,
} from '@shared/tts';

import { env } from '@/lib/env';

/**
 * Voces neurales pregeneradas (shared/tts.ts). speech.ts pregunta acá antes de usar la voz del
 * teléfono: si el texto tiene su MP3, suena ese; si no (o falla), sigue la voz del sistema.
 *
 * - El índice de cada idioma (manifest.json) se baja una vez por arranque y queda guardado en el
 *   teléfono para usarlo sin conexión.
 * - Cada MP3 se guarda en la caché del teléfono la primera vez que suena.
 * - Un solo reproductor para todas las voces: una frase nueva corta la anterior.
 */

const base = env ? `${env.supabaseUrl}/storage/v1/object/public/${TTS_BUCKET}` : null;
const MANIFEST_TIMEOUT_MS = 4000;

interface Index {
  voices: Record<TtsSlot, string>;
  keys: Record<TtsSlot, ReadonlySet<string>>;
}
const indexes = new Map<string, Index | null>();
const loading = new Map<string, Promise<Index | null>>();

const supported = () => Platform.OS === 'ios' || Platform.OS === 'android';

// Se cargan recién al usarse: en web (y en los tests que no tocan audio) no hacen falta.
type FileSystem = typeof import('expo-file-system');
type Audio = typeof import('expo-audio');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fileSystem = (): FileSystem => require('expo-file-system') as FileSystem;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const audio = (): Audio => require('expo-audio') as Audio;

function cacheDir(...parts: string[]): DirectoryType {
  const { Directory, Paths } = fileSystem();
  return new Directory(Paths.cache, 'tts', ...parts);
}

function toIndex(manifest: unknown, language: string): Index | null {
  const m = manifest as Partial<TtsManifest> | null;
  if (!m || m.version !== TTS_MANIFEST_VERSION || m.language !== language) return null;
  if (!m.keys || !m.voices?.a || !m.voices.b) return null;
  return {
    voices: m.voices,
    keys: { a: new Set(m.keys.a ?? []), b: new Set(m.keys.b ?? []) },
  };
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MANIFEST_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal, cache: 'no-cache' });
  } finally {
    clearTimeout(timer);
  }
}

/** Baja (o lee de la caché) el índice de un idioma. Se llama al elegir el idioma de la voz. */
export function loadNeuralVoices(language: string): Promise<Index | null> {
  if (!supported() || !base) return Promise.resolve(null);
  const known = indexes.get(language);
  if (known !== undefined) return Promise.resolve(known);
  const pending = loading.get(language);
  if (pending) return pending;

  let saved: FileType | null = null;
  try {
    saved = new (fileSystem().File)(cacheDir(language), 'manifest.json');
  } catch {
    saved = null;
  }
  const task = (async () => {
    try {
      const res = await fetchWithTimeout(`${base}/${ttsManifestPath(language)}`);
      if (res.ok) {
        const text = await res.text();
        const index = toIndex(JSON.parse(text), language);
        if (index) {
          try {
            cacheDir(language).create({ intermediates: true, idempotent: true });
            saved?.write(text);
          } catch {
            // Sin caché igual funciona: se vuelve a bajar en el próximo arranque.
          }
          return index;
        }
      }
      // 404 (todavía no hay audios de este idioma) u otra respuesta: sin voces neurales.
      if (res.status === 404) return null;
    } catch {
      // Sin conexión: se usa el índice guardado, si hay.
    }
    try {
      return saved?.exists ? toIndex(JSON.parse(await saved.text()), language) : null;
    } catch {
      return null;
    }
  })().then((index) => {
    indexes.set(language, index);
    loading.delete(language);
    return index;
  });
  loading.set(language, task);
  return task;
}

/** ¿Hay audio neural para este texto? (sólo si el índice ya cargó). */
export function hasNeuralClip(language: string, slot: TtsSlot, text: string): boolean {
  const spoken = spokenText(text);
  return Boolean(spoken && indexes.get(language)?.keys[slot].has(ttsKey(spoken)));
}

let shared: AudioPlayer | null = null;
let token = 0;

function player(): AudioPlayer {
  // keepAudioSessionActive: igual que los efectos (lib/sounds.ts), para no cortar otra voz.
  shared ??= audio().createAudioPlayer(null, { keepAudioSessionActive: true });
  return shared;
}

/** Archivo local del audio; lo baja la primera vez. Si no se puede guardar, se reproduce online. */
async function localUri(language: string, voice: string, key: string): Promise<string> {
  const url = `${base}/${ttsClipPath(language, voice, key)}`;
  try {
    const { File } = fileSystem();
    const dir = cacheDir(language, voice);
    const file = new File(dir, `${key}.mp3`);
    if (file.exists && file.size > 0) return file.uri;
    dir.create({ intermediates: true, idempotent: true });
    const downloaded = await File.downloadFileAsync(url, file, { idempotent: true });
    return downloaded.uri;
  } catch {
    return url;
  }
}

export interface NeuralPlayback {
  /** 1 = velocidad normal; «lento» la baja sin cambiar el tono. */
  rate?: number;
  onStart?: () => void;
  onDone?: () => void;
  onError?: () => void;
}

/**
 * Reproduce el audio neural de un texto. Devuelve false (sin sonar nada) si ese texto no tiene audio:
 * quien llama usa la voz del teléfono. Una reproducción nueva o stopNeural() cancela la anterior.
 */
export function playNeural(
  language: string,
  slot: TtsSlot,
  text: string,
  options: NeuralPlayback = {},
): boolean {
  if (!base || !hasNeuralClip(language, slot, text)) return false;
  const mine = ++token;
  const key = ttsKey(text);
  const voice = indexes.get(language)!.voices[slot];
  void (async () => {
    try {
      const uri = await localUri(language, voice, key);
      if (mine !== token) return;
      const p = player();
      p.pause();
      p.replace({ uri });
      p.setPlaybackRate(options.rate ?? 1, 'high');
      let started = false;
      const sub = p.addListener('playbackStatusUpdate', (status) => {
        if (mine !== token) {
          sub.remove();
          return;
        }
        if (!started && status.playing) {
          started = true;
          options.onStart?.();
        }
        if (status.didJustFinish) {
          sub.remove();
          options.onDone?.();
        }
      });
      p.play();
    } catch {
      if (mine === token) options.onError?.();
    }
  })();
  return true;
}

/** Corta lo que esté sonando (y cancela lo que estaba por empezar). */
export function stopNeural(): void {
  token++;
  try {
    shared?.pause();
  } catch {
    // Nada sonando.
  }
}

/** Sólo para tests. */
export function __setNeuralIndex(
  language: string,
  keys: Partial<Record<TtsSlot, string[]>> | null,
): void {
  indexes.set(
    language,
    keys && {
      voices: { a: 'voice-a', b: 'voice-b' },
      keys: { a: new Set(keys.a ?? []), b: new Set(keys.b ?? []) },
    },
  );
}
