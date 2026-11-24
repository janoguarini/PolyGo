import type { CosmeticItem } from '@shared/cosmetics';

import { getStrings } from '@/i18n';

import { cosmeticStrings } from './strings';

/**
 * Estado de un cosmético para el jugador, tal como lo decide el servidor (cosmetic_unlocked en
 * 20261222120000_profile_customization). La app lo replica sólo para mostrar: equipar o comprar
 * siempre lo valida la base.
 */
export type CosmeticStatus =
  | { kind: 'equipped' }
  | { kind: 'unlocked' }
  | { kind: 'buy'; price: number }
  | { kind: 'locked'; reason: LockReason; hint: string };

export type LockReason = 'plus' | 'referral' | 'event' | 'rank' | 'season' | 'missing_art';

export interface CosmeticContext {
  owned: ReadonlySet<string>;
  /** undefined mientras no se sabe: se trata como sin Plus (nunca se muestra desbloqueado de más). */
  plus: boolean | undefined;
  /** Ganó al menos una ranked en su idioma. */
  placed: boolean;
}

export function isUnlocked(item: CosmeticItem, ctx: CosmeticContext): boolean {
  if (!item.available) return false;
  switch (item.source) {
    case 'free':
      return true;
    case 'rank':
      return ctx.placed;
    case 'plus':
      return ctx.plus === true;
    default:
      return ctx.owned.has(item.id);
  }
}

export function cosmeticStatus(
  item: CosmeticItem,
  ctx: CosmeticContext,
  equippedId: string | null,
): CosmeticStatus {
  if (item.id === equippedId && isUnlocked(item, ctx)) return { kind: 'equipped' };
  if (isUnlocked(item, ctx)) return { kind: 'unlocked' };
  const hint = getStrings(cosmeticStrings).unlockHint(item);
  if (!item.available) return { kind: 'locked', reason: 'missing_art', hint };
  if (item.price !== null && !item.retired) return { kind: 'buy', price: item.price };
  switch (item.source) {
    case 'plus':
      return { kind: 'locked', reason: 'plus', hint };
    case 'referral':
      return { kind: 'locked', reason: 'referral', hint };
    case 'event':
      return { kind: 'locked', reason: 'event', hint };
    case 'rank':
      return { kind: 'locked', reason: 'rank', hint };
    default:
      return { kind: 'locked', reason: 'season', hint };
  }
}

/** Etiqueta corta del estado para la ficha. */
export function statusLabel(status: CosmeticStatus): string {
  return getStrings(cosmeticStrings).status(status);
}
