import {
  COSMETICS,
  RARITY_LABEL,
  REFERRAL_ITEM_MILESTONE,
  cosmeticSourceLabel,
  unlockHint,
  type CosmeticId,
  type CosmeticItem,
  type CosmeticRarity,
  type CosmeticSource,
} from '@shared/cosmetics';

import { defineStrings } from '@/i18n';

import type { CosmeticStatus } from './state';

/**
 * Textos de los cosméticos. shared/cosmetics.ts es la fuente del catálogo (la base lo replica y un
 * test compara ambos lados): sus nombres quedan en español y acá se traducen por id estable.
 */
const NAMES_EN: Record<CosmeticId, string> = {
  'skin-classic': 'Classic',
  'skin-ninja': 'Ninja',
  'skin-explorer': 'Explorer',
  'skin-academic': 'Scholar',
  'skin-samurai': 'Samurai',
  'skin-cyber': 'Cyber',
  'skin-guardian': 'Guardian',
  'skin-omega': 'Omega',
  'skin-social-explorer': 'Social Explorer',
  'skin-team-legend': 'Team Legend',
  'skin-aztec': 'Aztec',
  'skin-dragon': 'Dragon',
  'skin-king': 'King',
  'skin-titan': 'Titan',
  'skin-diamond': 'Diamond',
  frame_basic: 'Basic',
  frame_leaf: 'Leaf',
  frame_stellar: 'Stellar',
  frame_crystal: 'Crystal',
  frame_elite: 'Elite',
  frame_diamond: 'Diamond',
  frame_master: 'Master',
  frame_plus: 'PolyGo Plus',
  frame_referral_legend: 'Legend',
  frame_event: 'Event',
  frame_rank: 'Rank frame',
  bg_solid: 'Solid',
  bg_mountain: 'Mountain',
  bg_forest: 'Forest',
  bg_aurora: 'Aurora',
  bg_neon: 'Neon City',
  bg_space: 'Space',
  bg_temple: 'Temple',
  bg_galaxy: 'Galaxy',
  bg_dimension: 'Dimension',
  frame_mint: 'Mint',
  frame_coral: 'Coral',
  frame_sky: 'Sky',
  frame_sun: 'Sun',
  frame_sunset: 'Sunset',
  frame_ocean: 'Ocean',
  frame_aurora: 'Classic Aurora',
  frame_galaxy: 'Classic Galaxy',
  frame_fire: 'Fire',
  frame_crown: 'Royalty',
  frame_legend: 'Season Legend',
  frame_founder: 'Founder',
  bg_ocean: 'Deep Sea',
  bg_wine: 'Wine',
  bg_sunset: 'Classic Sunset',
  bg_gold: 'Gold',
};

const RARITY_EN: Record<CosmeticRarity, string> = {
  free: 'Free',
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
  exclusive: 'Exclusive',
  limited: 'Limited',
};

const SOURCE_EN: Record<CosmeticSource, string> = {
  free: 'Free',
  polys: 'In the shop',
  season: 'Season reward',
  premium: 'Special edition',
  plus: 'PolyGo Plus exclusive',
  referral: 'Invite reward',
  event: 'Event reward',
  rank: 'Competitive progression',
};

function unlockHintEn(item: CosmeticItem): string {
  if (!item.available) return 'Art in progress: coming soon.';
  switch (item.source) {
    case 'free':
      return 'Available to everyone.';
    case 'polys':
      return `Unlock it for ${item.price} Polys.`;
    case 'plus':
      return 'Available to PolyGo Plus subscribers.';
    case 'referral': {
      const n = REFERRAL_ITEM_MILESTONE[item.id as CosmeticId] ?? 10;
      return `Bring ${n} valid friends to unlock it.`;
    }
    case 'rank':
      return 'Win a ranked match to debut your rank frame.';
    case 'event':
      return 'Earned in a limited-time event.';
    case 'season':
      return 'This was a season reward.';
    case 'premium':
      return 'Special edition.';
  }
}

const nameEn = (id: string, fallback: string) => NAMES_EN[id as CosmeticId] ?? fallback;

/** Nombre en inglés a partir del nombre en español (lo que devuelve skinsCompatibleWith). */
const nameEnFromEs = (name: string) => {
  const item = COSMETICS.find((c) => c.name === name);
  return item ? nameEn(item.id, name) : name;
};

const STATUS_ES = {
  equipped: 'Equipado',
  unlocked: 'Desbloqueado',
  plus: 'Exclusivo Plus',
  referral: 'Invitaciones',
  event: 'Evento',
  rank: 'Ranked',
  missing_art: 'Próximamente',
  season: 'Temporada',
} as const;

const STATUS_EN: Record<keyof typeof STATUS_ES, string> = {
  equipped: 'Equipped',
  unlocked: 'Unlocked',
  plus: 'Plus exclusive',
  referral: 'Invites',
  event: 'Event',
  rank: 'Ranked',
  missing_art: 'Coming soon',
  season: 'Season',
};

const statusText = (table: Record<keyof typeof STATUS_ES, string>) => (status: CosmeticStatus) => {
  switch (status.kind) {
    case 'equipped':
    case 'unlocked':
      return table[status.kind];
    case 'buy':
      return `${status.price}`;
    case 'locked':
      return table[status.reason];
  }
};

export const cosmeticStrings = defineStrings({
  es: {
    name: (item: Pick<CosmeticItem, 'id' | 'name'>) => item.name,
    nameFromEs: (name: string) => name,
    rarity: (r: CosmeticRarity) => RARITY_LABEL[r],
    source: (s: CosmeticSource) => cosmeticSourceLabel(s),
    unlockHint: (item: CosmeticItem) => unlockHint(item),
    status: statusText(STATUS_ES),
    tileA11y: (name: string, rarity: string, status: string) => `${name}, ${rarity}. ${status}`,
    pricePolys: (price: number) => `${price} Polys`,
    none: 'Ninguno',
    noneA11y: (equipped: boolean) => `Ninguno${equipped ? ', equipado' : ''}`,
    combos: (skins: string) => `Combina con Clásico, los avatares básicos y ${skins}.`,
    stored: (name: string) =>
      `¡${name} es tuyo! Quedó en tu inventario: se puede usar con un avatar que combine.`,
    unlockFor: (price: number) => `Desbloquear por ${price}`,
    buyHint: (price: number, balance: number) =>
      `Cuesta ${price} Polys. Tenés ${balance}. Queda equipado al comprarlo si combina con tu avatar.`,
    previewBuy: 'PREVIEW: comprar está deshabilitado.',
    short: (missing: number) =>
      `Te faltan ${missing} Polys. Ganalos con misiones, lecciones y rachas.`,
    plusExclusive: 'Exclusivo de PolyGo Plus',
    referralReward: 'Recompensa de invitación',
    plusBody: (name: string) =>
      `${name} es la identidad de quienes aprenden con Plus: no da ventajas en ranked y se activa mientras tu suscripción esté vigente.`,
    referralBody: (name: string) =>
      `${name} no se compra con Polys, ni con dinero, ni con Plus. Es para quienes suman amigos a PolyGo.`,
    learnPlus: 'Conocer PolyGo Plus',
    inviteFriends: 'Invitar amigos',
    competitiveFrames: 'Marcos competitivos',
    competitiveBody:
      'Se ganan sólo compitiendo. Con el Marco de rango equipado, tu marco cambia solo con tu ELO real.',
    ladderA11y: (tier: string, reached: boolean, current: boolean) =>
      `${tier}: ${reached ? (current ? 'tu rango actual' : 'alcanzado') : `bloqueado. Necesitás alcanzar el rango ${tier}`}`,
  },
  en: {
    name: (item: Pick<CosmeticItem, 'id' | 'name'>) => nameEn(item.id, item.name),
    nameFromEs: (name: string) => nameEnFromEs(name),
    rarity: (r: CosmeticRarity) => RARITY_EN[r],
    source: (s: CosmeticSource) => SOURCE_EN[s],
    unlockHint: (item: CosmeticItem) => unlockHintEn(item),
    status: statusText(STATUS_EN),
    tileA11y: (name: string, rarity: string, status: string) => `${name}, ${rarity}. ${status}`,
    pricePolys: (price: number) => `${price} Polys`,
    none: 'None',
    noneA11y: (equipped: boolean) => `None${equipped ? ', equipped' : ''}`,
    combos: (skins: string) => `Goes with Classic, the basic avatars and ${skins}.`,
    stored: (name: string) =>
      `${name} is yours! It’s in your inventory: you can use it with a matching avatar.`,
    unlockFor: (price: number) => `Unlock for ${price}`,
    buyHint: (price: number, balance: number) =>
      `Costs ${price} Polys. You have ${balance}. It gets equipped when you buy it if it matches your avatar.`,
    previewBuy: 'PREVIEW: buying is disabled.',
    short: (missing: number) =>
      `You need ${missing} more Polys. Earn them with missions, lessons and streaks.`,
    plusExclusive: 'PolyGo Plus exclusive',
    referralReward: 'Invite reward',
    plusBody: (name: string) =>
      `${name} is the look of people who learn with Plus: it gives no edge in ranked and stays active while your subscription is.`,
    referralBody: (name: string) =>
      `${name} can’t be bought with Polys, money or Plus. It’s for people who bring friends to PolyGo.`,
    learnPlus: 'Learn about PolyGo Plus',
    inviteFriends: 'Invite friends',
    competitiveFrames: 'Competitive frames',
    competitiveBody:
      'You can only earn these by competing. With the Rank frame equipped, your frame changes on its own with your real ELO.',
    ladderA11y: (tier: string, reached: boolean, current: boolean) =>
      `${tier}: ${reached ? (current ? 'your current rank' : 'reached') : `locked. Reach ${tier} to unlock it`}`,
  },
});
