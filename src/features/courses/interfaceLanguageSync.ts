import type { QueryClient } from '@tanstack/react-query';

import type { MyProfile } from '@/features/profile/api';
import { profileKeys } from '@/features/profile/hooks';
import {
  getPendingInterfaceLanguage,
  isInterfaceLanguage,
  setInterfaceLanguage,
  setPendingInterfaceLanguage,
  type InterfaceLanguage,
  type PendingInterfaceLanguage,
} from '@/i18n';

import { saveInterfaceLanguage } from './api';

/**
 * Idioma de la interfaz entre el teléfono y el perfil (profiles.interface_language).
 *
 * Reglas:
 * - Una elección manual se aplica en el acto y queda marcada como pendiente ANTES de hablar con el
 *   servidor; mientras esté pendiente, el perfil no la pisa (ni con un refresco que ya estaba en
 *   curso: se cancela antes de escribir el caché).
 * - Si el guardado falla (sin conexión, error del servidor o la base todavía no acepta el idioma),
 *   la marca queda y se reintenta: al recargarse el perfil (como mucho cada RETRY_MS) y al volver la
 *   app a primer plano. Con el guardado confirmado, la marca se borra.
 * - Los guardados van en fila: si se eligen dos idiomas seguidos, el último es el que queda en la base.
 * - La marca es de una cuenta: si entra otra, se descarta y manda el perfil de la nueva.
 */

export type SyncResult = 'saved' | 'pending';

/** Mínimo entre reintentos automáticos (los de una elección nueva o de volver a la app no esperan). */
export const RETRY_MS = 30_000;

let queue: Promise<unknown> = Promise.resolve();
let lastAttemptAt = 0;
/** La base rechazó el idioma (migración sin aplicar): no tiene sentido reintentar en esta sesión. */
let unsupportedThisSession = false;

function serialize<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

const samePending = (p: PendingInterfaceLanguage | null, lang: InterfaceLanguage, owner: string) =>
  p !== null && p.lang === lang && p.owner === owner;

/** Pone el idioma en el perfil en caché, cancelando antes cualquier refresco en curso. */
async function writeCache(qc: QueryClient, userId: string, lang: InterfaceLanguage) {
  const key = profileKeys.me(userId);
  await qc.cancelQueries({ queryKey: key });
  const cached = qc.getQueryData<MyProfile>(key);
  // Sólo si el perfil ya tiene la columna (modelo de cursos aplicado).
  if (cached && 'interface_language' in cached.profile) {
    qc.setQueryData<MyProfile>(key, {
      ...cached,
      profile: { ...cached.profile, interface_language: lang } as MyProfile['profile'],
    });
  }
}

function pushToServer(
  lang: InterfaceLanguage,
  userId: string,
  qc: QueryClient,
): Promise<SyncResult> {
  return serialize(async () => {
    // Mientras esperaba su turno se eligió otro idioma o cambió la cuenta: ya no corresponde.
    if (!samePending(getPendingInterfaceLanguage(), lang, userId)) return 'pending';
    lastAttemptAt = Date.now();
    let ok: boolean;
    try {
      ok = await saveInterfaceLanguage(lang);
    } catch {
      // Sin conexión o error del servidor: la elección queda pendiente y se reintenta.
      return 'pending';
    }
    if (!ok) {
      unsupportedThisSession = true;
      return 'pending';
    }
    // Guardado. Si mientras tanto no se eligió otro, se confirma: caché al día y marca borrada (en
    // ese orden, para que un refresco viejo no alcance a pisarlo).
    if (samePending(getPendingInterfaceLanguage(), lang, userId)) {
      await writeCache(qc, userId, lang);
      await setPendingInterfaceLanguage(null);
      void qc.invalidateQueries({ queryKey: profileKeys.me(userId) });
    }
    return 'saved';
  });
}

/**
 * Elección manual (Ajustes o registro): interfaz al instante, marca pendiente y guardado en la base.
 * Nunca lanza: un fallo remoto deja la elección pendiente.
 */
export async function chooseInterfaceLanguage(
  lang: InterfaceLanguage,
  { userId, qc }: { userId: string | null | undefined; qc: QueryClient },
): Promise<SyncResult> {
  const mark = setPendingInterfaceLanguage({ lang, owner: userId ?? null });
  const apply = setInterfaceLanguage(lang);
  await Promise.all([mark, apply]);
  if (!userId) return 'pending';
  // Una elección nueva vuelve a intentar aunque la base haya rechazado otra antes.
  unsupportedThisSession = false;
  await writeCache(qc, userId, lang);
  return pushToServer(lang, userId, qc);
}

/**
 * Reintenta guardar la elección pendiente de `userId`. Descarta la de otra cuenta. `force` saltea la
 * espera entre reintentos (p. ej. al volver la app a primer plano).
 */
export async function syncPendingInterfaceLanguage({
  userId,
  qc,
  force = false,
}: {
  userId: string;
  qc: QueryClient;
  force?: boolean;
}): Promise<SyncResult | 'none'> {
  const p = getPendingInterfaceLanguage();
  if (!p) return 'none';
  if (p.owner && p.owner !== userId) {
    await setPendingInterfaceLanguage(null);
    return 'none';
  }
  if (!p.owner) await setPendingInterfaceLanguage({ lang: p.lang, owner: userId });
  if (!force && (unsupportedThisSession || Date.now() - lastAttemptAt < RETRY_MS)) return 'pending';
  if (force) unsupportedThisSession = false;
  return pushToServer(p.lang, userId, qc);
}

/**
 * Qué hacer con el idioma que trae el perfil: aplicarlo sólo si no hay una elección pendiente de esta
 * misma cuenta. Una pendiente de otra cuenta se descarta (y después manda este perfil).
 */
export function profileLanguageDecision({
  saved,
  userId,
  current,
  pending,
}: {
  saved: unknown;
  userId: string;
  current: InterfaceLanguage;
  pending: PendingInterfaceLanguage | null;
}):
  | { action: 'none' }
  | { action: 'apply'; lang: InterfaceLanguage }
  | { action: 'sync' }
  | {
      action: 'discard-pending';
    } {
  if (pending) {
    if (pending.owner && pending.owner !== userId) return { action: 'discard-pending' };
    return { action: 'sync' };
  }
  if (isInterfaceLanguage(saved) && saved !== current) return { action: 'apply', lang: saved };
  return { action: 'none' };
}

/** Sólo para pruebas. */
export function __resetInterfaceLanguageSyncForTests() {
  queue = Promise.resolve();
  lastAttemptAt = 0;
  unsupportedThisSession = false;
}
