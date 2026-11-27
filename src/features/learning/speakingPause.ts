import * as SecureStore from 'expo-secure-store';
import { useEffect, useSyncExternalStore } from 'react';

/**
 * «Ahora no puedo hablar»: durante PAUSE_MINUTES no se muestran ejercicios de hablar (se responden
 * escritos). Se guarda en el teléfono, así vale aunque se cierre la app o se empiece otra lección.
 */
export const PAUSE_MINUTES = 15;
const KEY = 'speaking_paused_until';

let until = 0;
let loaded: Promise<void> | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Lee la pausa guardada (una vez por arranque de la app). */
export function loadSpeakingPause(): Promise<void> {
  loaded ??= SecureStore.getItemAsync(KEY)
    .then((raw) => {
      const value = Number(raw);
      if (Number.isFinite(value) && value > until) {
        until = value;
        emit();
      }
    })
    .catch(() => {});
  return loaded;
}

export function speakingPaused(now = Date.now()): boolean {
  return until > now;
}

export function pauseSpeaking(now = Date.now()): void {
  until = now + PAUSE_MINUTES * 60_000;
  emit();
  void SecureStore.setItemAsync(KEY, String(until)).catch(() => {});
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** true mientras dure la pausa; vuelve a false sola cuando vence. */
export function useSpeakingPaused(): boolean {
  const paused = useSyncExternalStore(subscribe, () => speakingPaused());
  useEffect(() => {
    void loadSpeakingPause();
  }, []);
  useEffect(() => {
    if (!paused) return;
    const timer = setTimeout(emit, Math.max(0, until - Date.now()) + 50);
    return () => clearTimeout(timer);
  }, [paused]);
  return paused;
}

/** Sólo para tests. */
export function __resetSpeakingPause(): void {
  until = 0;
  loaded = null;
}
