import type { CosmeticRarity, CosmeticSource } from '@shared/cosmetics';

import { defineStrings } from '..';

/**
 * Tienda (src/app/shop.tsx). Las etiquetas de rareza y de origen viven en español en
 * `shared/cosmetics.ts`; acá están por id para mostrarlas en el idioma de la interfaz.
 */
export const shopStrings = defineStrings({
  es: {
    loading: 'Abriendo la tienda…',
    title: 'Tienda',
    balanceA11y: (balance: number) => `Tenés ${balance} Polys`,
    tabSkins: 'Avatares',
    tabFrames: 'Marcos',
    tabBackgrounds: 'Fondos',
    footer: 'Lo exclusivo (Plus e invitaciones) y los marcos de rango no se compran: se ganan.',
    unequip: 'Sacármelo',
    equip: 'Equipar',
    equipped: ' · Equipado',
    unlocked: ' · Desbloqueado',
    rarity: {
      free: 'Gratis',
      common: 'Común',
      rare: 'Rara',
      epic: 'Épica',
      legendary: 'Legendaria',
      mythic: 'Mítica',
      exclusive: 'Exclusiva',
      limited: 'Limitada',
    } satisfies Record<CosmeticRarity, string>,
    source: {
      free: 'Gratis',
      polys: 'En la tienda',
      season: 'Premio de temporada',
      premium: 'Edición especial',
      plus: 'Exclusivo PolyGo Plus',
      referral: 'Recompensa de invitación',
      event: 'Recompensa de evento',
      rank: 'Progresión competitiva',
    } satisfies Record<CosmeticSource, string>,
  },
  en: {
    loading: 'Opening the shop…',
    title: 'Shop',
    balanceA11y: (balance: number) => `You have ${balance} Polys`,
    tabSkins: 'Avatars',
    tabFrames: 'Frames',
    tabBackgrounds: 'Backgrounds',
    footer: 'Exclusive items (Plus and invites) and rank frames can’t be bought: they’re earned.',
    unequip: 'Take it off',
    equip: 'Equip',
    equipped: ' · Equipped',
    unlocked: ' · Unlocked',
    rarity: {
      free: 'Free',
      common: 'Common',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary',
      mythic: 'Mythic',
      exclusive: 'Exclusive',
      limited: 'Limited',
    },
    source: {
      free: 'Free',
      polys: 'In the shop',
      season: 'Season reward',
      premium: 'Special edition',
      plus: 'PolyGo Plus exclusive',
      referral: 'Invite reward',
      event: 'Event reward',
      rank: 'Competitive progression',
    },
  },
});
