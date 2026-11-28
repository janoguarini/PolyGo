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

const NAMES_PT: Record<CosmeticId, string> = {
  'skin-classic': 'Clássico',
  'skin-ninja': 'Ninja',
  'skin-explorer': 'Explorador',
  'skin-academic': 'Acadêmico',
  'skin-samurai': 'Samurai',
  'skin-cyber': 'Cyber',
  'skin-guardian': 'Guardião',
  'skin-omega': 'Ômega',
  'skin-social-explorer': 'Explorador Social',
  'skin-team-legend': 'Lenda da Equipe',
  'skin-aztec': 'Asteca',
  'skin-dragon': 'Dragão',
  'skin-king': 'Rei',
  'skin-titan': 'Titã',
  'skin-diamond': 'Diamante',
  frame_basic: 'Básico',
  frame_leaf: 'Folha',
  frame_stellar: 'Estelar',
  frame_crystal: 'Cristal',
  frame_elite: 'Elite',
  frame_diamond: 'Diamante',
  frame_master: 'Mestre',
  frame_plus: 'PolyGo Plus',
  frame_referral_legend: 'Lenda',
  frame_event: 'Evento',
  frame_rank: 'Moldura de ranking',
  bg_solid: 'Sólido',
  bg_mountain: 'Montanha',
  bg_forest: 'Floresta',
  bg_aurora: 'Aurora',
  bg_neon: 'Cidade Neon',
  bg_space: 'Espaço',
  bg_temple: 'Templo',
  bg_galaxy: 'Galáxia',
  bg_dimension: 'Dimensão',
  frame_mint: 'Menta',
  frame_coral: 'Coral',
  frame_sky: 'Céu',
  frame_sun: 'Sol',
  frame_sunset: 'Pôr do sol',
  frame_ocean: 'Oceano',
  frame_aurora: 'Aurora Clássica',
  frame_galaxy: 'Galáxia Clássica',
  frame_fire: 'Fogo',
  frame_crown: 'Realeza',
  frame_legend: 'Lenda da Temporada',
  frame_founder: 'Fundador',
  bg_ocean: 'Mar Profundo',
  bg_wine: 'Vinho',
  bg_sunset: 'Pôr do Sol Clássico',
  bg_gold: 'Ouro',
};

const NAMES_IT: Record<CosmeticId, string> = {
  'skin-classic': 'Classico',
  'skin-ninja': 'Ninja',
  'skin-explorer': 'Esploratore',
  'skin-academic': 'Accademico',
  'skin-samurai': 'Samurai',
  'skin-cyber': 'Cyber',
  'skin-guardian': 'Guardiano',
  'skin-omega': 'Omega',
  'skin-social-explorer': 'Esploratore Social',
  'skin-team-legend': 'Leggenda della Squadra',
  'skin-aztec': 'Azteco',
  'skin-dragon': 'Drago',
  'skin-king': 'Re',
  'skin-titan': 'Titano',
  'skin-diamond': 'Diamante',
  frame_basic: 'Base',
  frame_leaf: 'Foglia',
  frame_stellar: 'Stellare',
  frame_crystal: 'Cristallo',
  frame_elite: 'Élite',
  frame_diamond: 'Diamante',
  frame_master: 'Maestro',
  frame_plus: 'PolyGo Plus',
  frame_referral_legend: 'Leggenda',
  frame_event: 'Evento',
  frame_rank: 'Cornice di rango',
  bg_solid: 'Tinta unita',
  bg_mountain: 'Montagna',
  bg_forest: 'Foresta',
  bg_aurora: 'Aurora',
  bg_neon: 'Città Neon',
  bg_space: 'Spazio',
  bg_temple: 'Tempio',
  bg_galaxy: 'Galassia',
  bg_dimension: 'Dimensione',
  frame_mint: 'Menta',
  frame_coral: 'Corallo',
  frame_sky: 'Cielo',
  frame_sun: 'Sole',
  frame_sunset: 'Tramonto',
  frame_ocean: 'Oceano',
  frame_aurora: 'Aurora Classica',
  frame_galaxy: 'Galassia Classica',
  frame_fire: 'Fuoco',
  frame_crown: 'Regalità',
  frame_legend: 'Leggenda della Stagione',
  frame_founder: 'Fondatore',
  bg_ocean: 'Mare Profondo',
  bg_wine: 'Vino',
  bg_sunset: 'Tramonto Classico',
  bg_gold: 'Oro',
};

const RARITY_PT: Record<CosmeticRarity, string> = {
  free: 'Grátis',
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
  mythic: 'Mítico',
  exclusive: 'Exclusivo',
  limited: 'Limitado',
};

const RARITY_IT: Record<CosmeticRarity, string> = {
  free: 'Gratis',
  common: 'Comune',
  rare: 'Raro',
  epic: 'Epico',
  legendary: 'Leggendario',
  mythic: 'Mitico',
  exclusive: 'Esclusivo',
  limited: 'Limitato',
};

const SOURCE_PT: Record<CosmeticSource, string> = {
  free: 'Grátis',
  polys: 'Na loja',
  season: 'Recompensa de temporada',
  premium: 'Edição especial',
  plus: 'Exclusivo do PolyGo Plus',
  referral: 'Recompensa por convite',
  event: 'Recompensa de evento',
  rank: 'Progressão competitiva',
};

const SOURCE_IT: Record<CosmeticSource, string> = {
  free: 'Gratis',
  polys: 'Nel negozio',
  season: 'Ricompensa stagionale',
  premium: 'Edizione speciale',
  plus: 'Esclusiva PolyGo Plus',
  referral: 'Ricompensa per inviti',
  event: 'Ricompensa evento',
  rank: 'Progressione competitiva',
};

function unlockHintPt(item: CosmeticItem): string {
  if (!item.available) return 'Arte em produção: em breve.';
  switch (item.source) {
    case 'free':
      return 'Disponível para todos.';
    case 'polys':
      return `Desbloqueie por ${item.price} Polys.`;
    case 'plus':
      return 'Disponível para assinantes do PolyGo Plus.';
    case 'referral': {
      const n = REFERRAL_ITEM_MILESTONE[item.id as CosmeticId] ?? 10;
      return `Traga ${n} amigos válidos para desbloquear.`;
    }
    case 'rank':
      return 'Vença uma partida ranqueada para estrear sua moldura de ranking.';
    case 'event':
      return 'Conquistado em um evento por tempo limitado.';
    case 'season':
      return 'Esta foi uma recompensa de temporada.';
    case 'premium':
      return 'Edição especial.';
  }
}

function unlockHintIt(item: CosmeticItem): string {
  if (!item.available) return 'Grafica in lavorazione: in arrivo.';
  switch (item.source) {
    case 'free':
      return 'Disponibile per tutti.';
    case 'polys':
      return `Sbloccalo per ${item.price} Polys.`;
    case 'plus':
      return 'Disponibile per gli abbonati a PolyGo Plus.';
    case 'referral': {
      const n = REFERRAL_ITEM_MILESTONE[item.id as CosmeticId] ?? 10;
      return `Porta ${n} amici validi per sbloccarlo.`;
    }
    case 'rank':
      return 'Vinci una partita classificata per sfoggiare la tua cornice di rango.';
    case 'event':
      return 'Si ottiene in un evento a tempo limitato.';
    case 'season':
      return 'Era una ricompensa stagionale.';
    case 'premium':
      return 'Edizione speciale.';
  }
}

const nameIn = (table: Record<CosmeticId, string>) => (id: string, fallback: string) =>
  table[id as CosmeticId] ?? fallback;
const namePt = nameIn(NAMES_PT);
const nameIt = nameIn(NAMES_IT);

/** Nombre traducido a partir del nombre en español (lo que devuelve skinsCompatibleWith). */
const nameFromEsIn = (lookup: (id: string, fallback: string) => string) => (name: string) => {
  const item = COSMETICS.find((c) => c.name === name);
  return item ? lookup(item.id, name) : name;
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

const STATUS_PT: Record<keyof typeof STATUS_ES, string> = {
  equipped: 'Equipado',
  unlocked: 'Desbloqueado',
  plus: 'Exclusivo Plus',
  referral: 'Convites',
  event: 'Evento',
  rank: 'Ranked',
  missing_art: 'Em breve',
  season: 'Temporada',
};

const STATUS_IT: Record<keyof typeof STATUS_ES, string> = {
  equipped: 'Equipaggiato',
  unlocked: 'Sbloccato',
  plus: 'Esclusiva Plus',
  referral: 'Inviti',
  event: 'Evento',
  rank: 'Ranked',
  missing_art: 'In arrivo',
  season: 'Stagione',
};

const NAMES_FR: Record<CosmeticId, string> = {
  'skin-classic': 'Classique',
  'skin-ninja': 'Ninja',
  'skin-explorer': 'Explorateur',
  'skin-academic': 'Érudit',
  'skin-samurai': 'Samouraï',
  'skin-cyber': 'Cyber',
  'skin-guardian': 'Gardien',
  'skin-omega': 'Oméga',
  'skin-social-explorer': 'Explorateur social',
  'skin-team-legend': 'Légende de l’équipe',
  'skin-aztec': 'Aztèque',
  'skin-dragon': 'Dragon',
  'skin-king': 'Roi',
  'skin-titan': 'Titan',
  'skin-diamond': 'Diamant',
  frame_basic: 'Basique',
  frame_leaf: 'Feuille',
  frame_stellar: 'Stellaire',
  frame_crystal: 'Cristal',
  frame_elite: 'Élite',
  frame_diamond: 'Diamant',
  frame_master: 'Maître',
  frame_plus: 'PolyGo Plus',
  frame_referral_legend: 'Légende',
  frame_event: 'Événement',
  frame_rank: 'Cadre de rang',
  bg_solid: 'Uni',
  bg_mountain: 'Montagne',
  bg_forest: 'Forêt',
  bg_aurora: 'Aurore',
  bg_neon: 'Ville néon',
  bg_space: 'Espace',
  bg_temple: 'Temple',
  bg_galaxy: 'Galaxie',
  bg_dimension: 'Dimension',
  frame_mint: 'Menthe',
  frame_coral: 'Corail',
  frame_sky: 'Ciel',
  frame_sun: 'Soleil',
  frame_sunset: 'Coucher de soleil',
  frame_ocean: 'Océan',
  frame_aurora: 'Aurore classique',
  frame_galaxy: 'Galaxie classique',
  frame_fire: 'Feu',
  frame_crown: 'Royauté',
  frame_legend: 'Légende de la saison',
  frame_founder: 'Fondateur',
  bg_ocean: 'Grands fonds',
  bg_wine: 'Bordeaux',
  bg_sunset: 'Coucher de soleil classique',
  bg_gold: 'Or',
};

const RARITY_FR: Record<CosmeticRarity, string> = {
  free: 'Gratuit',
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
  mythic: 'Mythique',
  exclusive: 'Exclusif',
  limited: 'Limité',
};

const SOURCE_FR: Record<CosmeticSource, string> = {
  free: 'Gratuit',
  polys: 'En boutique',
  season: 'Récompense de saison',
  premium: 'Édition spéciale',
  plus: 'Exclusivité PolyGo Plus',
  referral: 'Récompense de parrainage',
  event: 'Récompense d’événement',
  rank: 'Progression compétitive',
};

function unlockHintFr(item: CosmeticItem): string {
  if (!item.available) return 'Visuel en préparation : bientôt disponible.';
  switch (item.source) {
    case 'free':
      return 'Disponible pour tout le monde.';
    case 'polys':
      return `Débloque-le pour ${item.price} Polys.`;
    case 'plus':
      return 'Disponible pour les abonnés PolyGo Plus.';
    case 'referral': {
      const n = REFERRAL_ITEM_MILESTONE[item.id as CosmeticId] ?? 10;
      return `Invite ${n} amis valides pour le débloquer.`;
    }
    case 'rank':
      return 'Gagne une partie classée pour étrenner ton cadre de rang.';
    case 'event':
      return 'Obtenu lors d’un événement à durée limitée.';
    case 'season':
      return 'C’était une récompense de saison.';
    case 'premium':
      return 'Édition spéciale.';
  }
}

const nameFr = nameIn(NAMES_FR);

const STATUS_FR: Record<keyof typeof STATUS_ES, string> = {
  equipped: 'Équipé',
  unlocked: 'Débloqué',
  plus: 'Exclusivité Plus',
  referral: 'Parrainages',
  event: 'Événement',
  rank: 'Ranked',
  missing_art: 'Bientôt',
  season: 'Saison',
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
      `Cuesta ${price} Polys. Tienes ${balance}. Queda equipado al comprarlo si combina con tu avatar.`,
    previewBuy: 'PREVIEW: comprar está deshabilitado.',
    short: (missing: number) =>
      `Te faltan ${missing} Polys. Gánalos con misiones, lecciones y rachas.`,
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
      `${tier}: ${reached ? (current ? 'tu rango actual' : 'alcanzado') : `bloqueado. Necesitas alcanzar el rango ${tier}`}`,
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
  'pt-BR': {
    name: (item: Pick<CosmeticItem, 'id' | 'name'>) => namePt(item.id, item.name),
    nameFromEs: (name: string) => nameFromEsIn(namePt)(name),
    rarity: (r: CosmeticRarity) => RARITY_PT[r],
    source: (s: CosmeticSource) => SOURCE_PT[s],
    unlockHint: (item: CosmeticItem) => unlockHintPt(item),
    status: statusText(STATUS_PT),
    tileA11y: (name: string, rarity: string, status: string) => `${name}, ${rarity}. ${status}`,
    pricePolys: (price: number) => `${price} Polys`,
    none: 'Nenhum',
    noneA11y: (equipped: boolean) => `Nenhum${equipped ? ', equipado' : ''}`,
    combos: (skins: string) => `Combina com Clássico, os avatares básicos e ${skins}.`,
    stored: (name: string) =>
      `${name} é seu! Ficou no seu inventário: dá para usar com um avatar que combine.`,
    unlockFor: (price: number) => `Desbloquear por ${price}`,
    buyHint: (price: number, balance: number) =>
      `Custa ${price} Polys. Você tem ${balance}. Ele é equipado ao comprar, se combinar com seu avatar.`,
    previewBuy: 'PREVIEW: comprar está desativado.',
    short: (missing: number) => `Faltam ${missing} Polys. Ganhe com missões, lições e sequências.`,
    plusExclusive: 'Exclusivo do PolyGo Plus',
    referralReward: 'Recompensa por convite',
    plusBody: (name: string) =>
      `${name} é a identidade de quem aprende com o Plus: não dá vantagem no ranked e fica ativo enquanto sua assinatura estiver em dia.`,
    referralBody: (name: string) =>
      `${name} não se compra com Polys, nem com dinheiro, nem com o Plus. É para quem traz amigos para o PolyGo.`,
    learnPlus: 'Conhecer o PolyGo Plus',
    inviteFriends: 'Convidar amigos',
    competitiveFrames: 'Molduras competitivas',
    competitiveBody:
      'Só se ganham competindo. Com a Moldura de ranking equipada, sua moldura muda sozinha conforme seu ELO real.',
    ladderA11y: (tier: string, reached: boolean, current: boolean) =>
      `${tier}: ${reached ? (current ? 'seu rank atual' : 'alcançado') : `bloqueado. Você precisa alcançar o rank ${tier}`}`,
  },
  it: {
    name: (item: Pick<CosmeticItem, 'id' | 'name'>) => nameIt(item.id, item.name),
    nameFromEs: (name: string) => nameFromEsIn(nameIt)(name),
    rarity: (r: CosmeticRarity) => RARITY_IT[r],
    source: (s: CosmeticSource) => SOURCE_IT[s],
    unlockHint: (item: CosmeticItem) => unlockHintIt(item),
    status: statusText(STATUS_IT),
    tileA11y: (name: string, rarity: string, status: string) => `${name}, ${rarity}. ${status}`,
    pricePolys: (price: number) => `${price} Polys`,
    none: 'Nessuno',
    noneA11y: (equipped: boolean) => `Nessuno${equipped ? ', equipaggiato' : ''}`,
    combos: (skins: string) => `Si abbina a Classico, agli avatar base e a ${skins}.`,
    stored: (name: string) =>
      `${name} è tuo! È nel tuo inventario: puoi usarlo con un avatar abbinato.`,
    unlockFor: (price: number) => `Sblocca per ${price}`,
    buyHint: (price: number, balance: number) =>
      `Costa ${price} Polys. Ne hai ${balance}. Se si abbina al tuo avatar, viene equipaggiato appena lo compri.`,
    previewBuy: 'PREVIEW: gli acquisti sono disattivati.',
    short: (missing: number) =>
      `Ti mancano ${missing} Polys. Guadagnali con missioni, lezioni e serie.`,
    plusExclusive: 'Esclusiva PolyGo Plus',
    referralReward: 'Ricompensa per inviti',
    plusBody: (name: string) =>
      `${name} è il look di chi impara con Plus: non dà vantaggi nel ranked e resta attivo finché il tuo abbonamento è valido.`,
    referralBody: (name: string) =>
      `${name} non si compra con i Polys, né con soldi, né con Plus. È per chi porta amici su PolyGo.`,
    learnPlus: 'Scopri PolyGo Plus',
    inviteFriends: 'Invita amici',
    competitiveFrames: 'Cornici competitive',
    competitiveBody:
      'Si ottengono solo competendo. Con la Cornice di rango equipaggiata, la tua cornice cambia da sola in base al tuo ELO reale.',
    ladderA11y: (tier: string, reached: boolean, current: boolean) =>
      `${tier}: ${reached ? (current ? 'il tuo rango attuale' : 'raggiunto') : `bloccato. Raggiungi il rango ${tier} per sbloccarlo`}`,
  },
  fr: {
    name: (item: Pick<CosmeticItem, 'id' | 'name'>) => nameFr(item.id, item.name),
    nameFromEs: (name: string) => nameFromEsIn(nameFr)(name),
    rarity: (r: CosmeticRarity) => RARITY_FR[r],
    source: (s: CosmeticSource) => SOURCE_FR[s],
    unlockHint: (item: CosmeticItem) => unlockHintFr(item),
    status: statusText(STATUS_FR),
    tileA11y: (name: string, rarity: string, status: string) => `${name}, ${rarity}. ${status}`,
    pricePolys: (price: number) => `${price} Polys`,
    none: 'Aucun',
    noneA11y: (equipped: boolean) => `Aucun${equipped ? ', équipé' : ''}`,
    combos: (skins: string) => `Va avec Classique, les avatars de base et ${skins}.`,
    stored: (name: string) =>
      `${name} est à toi ! Il est dans ton inventaire : tu peux l’utiliser avec un avatar assorti.`,
    unlockFor: (price: number) => `Débloquer pour ${price}`,
    buyHint: (price: number, balance: number) =>
      `Coûte ${price} Polys. Tu en as ${balance}. S’il va avec ton avatar, il est équipé dès l’achat.`,
    previewBuy: 'PREVIEW : les achats sont désactivés.',
    short: (missing: number) =>
      `Il te manque ${missing} Polys. Gagne-les avec les missions, les leçons et les séries.`,
    plusExclusive: 'Exclusivité PolyGo Plus',
    referralReward: 'Récompense de parrainage',
    plusBody: (name: string) =>
      `${name} est le look de celles et ceux qui apprennent avec Plus : aucun avantage en ranked, et il reste actif tant que ton abonnement l’est.`,
    referralBody: (name: string) =>
      `${name} ne s’achète ni avec des Polys, ni avec de l’argent, ni avec Plus. Il est réservé à celles et ceux qui font venir des amis sur PolyGo.`,
    learnPlus: 'Découvrir PolyGo Plus',
    inviteFriends: 'Inviter des amis',
    competitiveFrames: 'Cadres compétitifs',
    competitiveBody:
      'Ils se gagnent uniquement en compétition. Avec le Cadre de rang équipé, ton cadre change tout seul selon ton vrai ELO.',
    ladderA11y: (tier: string, reached: boolean, current: boolean) =>
      `${tier} : ${reached ? (current ? 'ton rang actuel' : 'atteint') : `verrouillé. Atteins le rang ${tier} pour le débloquer`}`,
  },
});
