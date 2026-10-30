import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/** Efectos generados con scripts/generate-sounds.ts. */
const SOURCES = {
  correct: require('../../assets/sounds/correct.wav') as number,
  incorrect: require('../../assets/sounds/incorrect.wav') as number,
  complete: require('../../assets/sounds/complete.wav') as number,
};

export type SoundEffect = keyof typeof SOURCES;

const players = new Map<SoundEffect, AudioPlayer>();
let audioMode: Promise<void> | null = null;

/**
 * Sesión de audio de la app. En iOS, sin esto la voz sintetizada (expo-speech usa la sesión
 * de la app) no suena con el interruptor de silencio activado. Mezcla con la música del usuario.
 */
export function configureAudio(): Promise<void> {
  audioMode ??= setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: 'mixWithOthers',
    shouldPlayInBackground: false,
  }).catch(() => {
    audioMode = null;
  });
  return audioMode;
}

function player(name: SoundEffect): AudioPlayer {
  let p = players.get(name);
  if (!p) {
    // Viven toda la sesión de la app (se reutilizan), por eso no se liberan.
    p = createAudioPlayer(SOURCES[name]);
    players.set(name, p);
  }
  return p;
}

/** Carga los efectos de antemano para que suenen sin demora la primera vez. */
export function preloadSounds() {
  for (const name of Object.keys(SOURCES) as SoundEffect[]) player(name);
}

export function playSound(name: SoundEffect) {
  try {
    const p = player(name);
    // Si ya sonó, queda al final: se rebobina antes de reproducir.
    void p
      .seekTo(0)
      .catch(() => {})
      .finally(() => p.play());
  } catch {
    // Un efecto que no suena nunca debe romper la sesión.
  }
}
