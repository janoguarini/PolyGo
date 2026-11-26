import { deviceStorage } from '@/lib/secureStorage';

/**
 * Cuándo practicás (lecciones, repasos y partidas terminadas), guardado sólo en el teléfono: de acá
 * sale tu horario de oro para el push inteligente (smart.ts). Se guardan las últimas MAX_ENTRIES.
 */
const KEY = 'polygo.practice-times';
const MAX_ENTRIES = 60;

export async function loadPracticeTimes(): Promise<number[]> {
  try {
    const raw = await deviceStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((t): t is number => typeof t === 'number') : [];
  } catch {
    return [];
  }
}

/** Anota una práctica (ahora). Nunca falla. */
export async function recordPractice(at = Date.now()): Promise<void> {
  try {
    const times = await loadPracticeTimes();
    times.push(at);
    await deviceStorage.setItem(KEY, JSON.stringify(times.slice(-MAX_ENTRIES)));
  } catch {
    // Sin almacenamiento el push usa el horario por defecto.
  }
}
