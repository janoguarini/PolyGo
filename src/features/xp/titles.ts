import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

/**
 * Títulos del jugador según el nivel global de XP. Sólo presentación: se derivan del nivel que ya
 * calcula el servidor (sync_xp) o el modo PREVIEW; no hay progresión propia, ni ELO, ni MCER.
 * Cada fila es el nivel mínimo desde el que rige el título (orden ascendente).
 */
export const LEVEL_TITLES: readonly { minLevel: number; title: string }[] = [
  { minLevel: 1, title: 'Novato' },
  { minLevel: 5, title: 'Principiante' },
  { minLevel: 10, title: 'Aprendiz' },
  { minLevel: 20, title: 'Explorador' },
  { minLevel: 30, title: 'Intermedio' },
  { minLevel: 40, title: 'Avanzado' },
  { minLevel: 50, title: 'Experto' },
  { minLevel: 60, title: 'Especialista' },
  { minLevel: 75, title: 'Maestro' },
  { minLevel: 90, title: 'Gran Maestro' },
  { minLevel: 100, title: 'Políglota Élite' },
];

/** Título desbloqueado más alto para un nivel global (niveles menores a 1 o no numéricos: el primero). */
export function levelTitle(level: number): string {
  let title = 'Novato';
  for (const t of LEVEL_TITLES) {
    if (level >= t.minLevel) title = t.title;
    else break;
  }
  return title;
}

/** Nivel desde el que se desbloquea un título (null si no existe). */
export function titleMinLevel(title: string): number | null {
  return LEVEL_TITLES.find((t) => t.title === title)?.minLevel ?? null;
}

/** El primer título está siempre disponible (también en el nivel 0); el resto, desde su nivel. */
export function isTitleUnlocked(title: string, level: number): boolean {
  if (title === LEVEL_TITLES[0]?.title) return true;
  const min = titleMinLevel(title);
  return min !== null && level >= min;
}

/**
 * Título que se muestra: el elegido en Editar perfil si sigue desbloqueado; si no (o «Automático»,
 * `null`), el más alto que permite el nivel.
 */
export function displayedTitle(level: number, choice: string | null | undefined): string {
  return choice && isTitleUnlocked(choice, level) ? choice : levelTitle(level);
}

// --- Título elegido: se guarda en este teléfono (como el tema), por usuario. No toca Supabase. ---

const storageKey = (userId: string) => `polygo.title.${userId}`;
const cache = new Map<string, string | null>();
const listeners = new Set<() => void>();

function readStored(userId: string): string | null {
  try {
    const raw =
      Platform.OS === 'web'
        ? (globalThis.localStorage?.getItem(storageKey(userId)) ?? null)
        : SecureStore.getItem(storageKey(userId));
    return raw && titleMinLevel(raw) !== null ? raw : null;
  } catch {
    return null;
  }
}

/** Título elegido por el usuario (null = automático, según el nivel). */
export function getTitleChoice(userId: string | undefined): string | null {
  if (!userId) return null;
  if (!cache.has(userId)) cache.set(userId, readStored(userId));
  return cache.get(userId) ?? null;
}

export function setTitleChoice(userId: string, title: string | null): void {
  cache.set(userId, title);
  try {
    const key = storageKey(userId);
    if (Platform.OS === 'web') {
      if (title) globalThis.localStorage?.setItem(key, title);
      else globalThis.localStorage?.removeItem(key);
    } else if (title) SecureStore.setItem(key, title);
    else void SecureStore.deleteItemAsync(key);
  } catch {
    // Sin almacenamiento la elección dura hasta cerrar la app.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTitleChoice(userId: string | undefined): string | null {
  return useSyncExternalStore(
    subscribe,
    () => getTitleChoice(userId),
    () => getTitleChoice(userId),
  );
}
