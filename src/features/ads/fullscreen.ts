import { errorCode } from './state';
import type { AdReward, FullscreenAdHandle } from './types';

export type ShowResult =
  /** Se mostró y el usuario lo cerró. */
  | { outcome: 'closed'; earned: AdReward | null }
  /** No había anuncio cargado: no se bloquea la navegación esperando uno. */
  | { outcome: 'not_ready' }
  /** No se puede mostrar a este usuario ahora (excluido, sin consentimiento o SDK sin listo). */
  | { outcome: 'blocked' }
  | { outcome: 'error'; error: string };

export interface FullscreenSlotDeps {
  /** null si la plataforma no tiene unidad (web). */
  adUnitId: string | null;
  create: (adUnitId: string) => FullscreenAdHandle;
  /** Consulta la disponibilidad global (consentimiento + SDK + elegibilidad). */
  canServe: () => boolean;
}

/**
 * Un «lugar» de anuncio a pantalla completa: mantiene a lo sumo un anuncio precargado, lo muestra
 * cuando se pide y precarga el siguiente al cerrarse. No reintenta solo después de un error de
 * carga (evita bucles): la próxima llamada a preload() lo vuelve a intentar.
 */
export function createFullscreenSlot({ adUnitId, create, canServe }: FullscreenSlotDeps) {
  let handle: FullscreenAdHandle | null = null;
  let unsubscribe: (() => void)[] = [];
  let loading = false;
  let showing = false;
  let lastError: string | null = null;
  // Excluido mientras se mostraba: descartar al cerrarse.
  let discardPending = false;
  // Para el anuncio que se está mostrando.
  let earned: AdReward | null = null;
  let onClose: (() => void) | null = null;

  function ensureHandle(): FullscreenAdHandle | null {
    if (handle || !adUnitId) return handle;
    try {
      handle = create(adUnitId);
    } catch (error) {
      lastError = errorCode(error);
      return null;
    }
    const h = handle;
    unsubscribe = [
      h.onLoaded(() => {
        loading = false;
        lastError = null;
      }),
      h.onError((error) => {
        loading = false;
        lastError = errorCode(error);
        // Un error mientras se muestra también termina la presentación.
        if (showing) onClose?.();
      }),
      h.onEarned((reward) => {
        if (showing) earned = reward;
      }),
      h.onClosed(() => onClose?.()),
    ];
    return h;
  }

  function preload(): void {
    if (!canServe() || showing) return;
    const h = ensureHandle();
    if (!h || h.loaded || loading) return;
    loading = true;
    try {
      h.load();
    } catch (error) {
      loading = false;
      lastError = errorCode(error);
    }
  }

  async function show(): Promise<ShowResult> {
    if (!canServe()) return { outcome: 'blocked' };
    if (showing) return { outcome: 'not_ready' };
    const h = handle;
    if (!h || !h.loaded) {
      preload();
      return { outcome: 'not_ready' };
    }
    showing = true;
    earned = null;
    const closed = new Promise<void>((resolve) => {
      onClose = resolve;
    });
    try {
      await h.show();
      await closed;
      return { outcome: 'closed', earned };
    } catch (error) {
      lastError = errorCode(error);
      return { outcome: 'error', error: lastError };
    } finally {
      showing = false;
      onClose = null;
      earned = null;
      if (discardPending) {
        discardPending = false;
        destroyHandle();
      } else {
        // El anuncio mostrado no se puede reutilizar: se precarga otro.
        preload();
      }
    }
  }

  function destroyHandle(): void {
    for (const off of unsubscribe) off();
    unsubscribe = [];
    if (handle) {
      try {
        handle.destroy();
      } catch {
        // Nada que hacer: el anuncio igual deja de usarse.
      }
    }
    handle = null;
    loading = false;
  }

  /**
   * Usuario excluido (Plus / Ad-Free / sin consentimiento): se tira lo precargado. Si justo se está
   * mostrando uno, se termina de mostrar y se descarta al cerrarse.
   */
  function discard(): void {
    if (showing) {
      discardPending = true;
      return;
    }
    destroyHandle();
  }

  return {
    preload,
    show,
    discard,
    get isReady() {
      return Boolean(handle?.loaded) && canServe();
    },
    get lastError() {
      return lastError;
    },
  };
}

export type FullscreenSlot = ReturnType<typeof createFullscreenSlot>;
