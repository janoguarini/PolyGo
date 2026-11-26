import type { CosmeticRarity } from '@shared/cosmetics';
import type { AvatarId } from '@shared/profile';

import { defineStrings } from '..';

/**
 * Países y avatares: shared/profile.ts guarda los nombres en español (la base replica los ids). Para
 * la interfaz en inglés se traducen por código de país / id de avatar.
 */
const COUNTRIES_EN: Record<string, string> = {
  AR: 'Argentina',
  BO: 'Bolivia',
  CL: 'Chile',
  CO: 'Colombia',
  CR: 'Costa Rica',
  CU: 'Cuba',
  EC: 'Ecuador',
  SV: 'El Salvador',
  ES: 'Spain',
  GT: 'Guatemala',
  HN: 'Honduras',
  MX: 'Mexico',
  NI: 'Nicaragua',
  PA: 'Panama',
  PY: 'Paraguay',
  PE: 'Peru',
  PR: 'Puerto Rico',
  DO: 'Dominican Republic',
  UY: 'Uruguay',
  VE: 'Venezuela',
  BR: 'Brazil',
  US: 'United States',
  GB: 'United Kingdom',
  IT: 'Italy',
  FR: 'France',
  DE: 'Germany',
};

const ANIMALS_EN: Record<string, string> = {
  fox: 'Fox',
  panda: 'Panda',
  dog: 'Dog',
  cat: 'Cat',
  lion: 'Lion',
};
const COLORS_EN: Record<string, string> = { violet: 'Violet', yellow: 'Yellow', red: 'Red' };
/** Los zorros conservan ids heredados (shared/profile.ts). */
const LEGACY_FOXES: Record<string, string> = { bolt: 'violet', crown: 'yellow', flame: 'red' };

function avatarNameEn(id: AvatarId, fallback: string): string {
  const legacy = LEGACY_FOXES[id];
  const [animal, color] = legacy ? ['fox', legacy] : id.split('-');
  const a = animal ? ANIMALS_EN[animal] : undefined;
  const c = color ? COLORS_EN[color] : undefined;
  return a && c ? `${c} ${a.toLowerCase()}` : fallback;
}

type RarityFilter = CosmeticRarity | 'all';

/** Personalización (src/app/edit-profile.tsx). */
export const editProfileStrings = defineStrings({
  es: {
    tabs: { avatar: 'Avatares', frame: 'Marcos', background: 'Fondos' },
    nameEmpty: 'El nombre no puede quedar vacío.',
    tryingOn: (names: string[]) =>
      `Estás probando ${names.join(' y ')}: ${
        names.length > 1 ? 'compralos para que se guarden.' : 'compralo para que se guarde.'
      }`,
    blockedByAvatar:
      'Ese marco o fondo combina con la skin que estás probando: se guarda cuando la tengas.',
    previewSave:
      'PREVIEW: guardar está deshabilitado (esta build usa la base real). Podés probar todo en la vista previa.',
    save: 'Guardar cambios',
    buyAndSave: (price: number) => `Comprar y guardar · ${price}`,
    buyingOnSave: (names: string[]) =>
      `Al guardar se compra${names.length > 1 ? 'n' : ''} ${names.join(' y ')} y queda${names.length > 1 ? 'n' : ''} puesto${names.length > 1 ? 's' : ''}.`,
    notEnough: (missing: number) => `Te faltan ${missing} Polys para comprarlo.`,
    droppedOnSave: (names: string[], avatar: string) =>
      `${names.join(' y ')} no combina${names.length > 1 ? 'n' : ''} con ${avatar || 'este avatar'}: al guardar vuelve${names.length > 1 ? 'n' : ''} al básico.`,
    title: 'Personalización',
    balanceA11y: (balance: number) => `Tenés ${balance} Polys`,
    previewA11y: 'Vista previa de tu perfil',
    collection: 'Colección',
    basicAvatars: 'AVATARES BÁSICOS',
    avatarName: (_id: AvatarId, fallback: string) => fallback,
    photoA11y: (hasPhoto: boolean): string =>
      hasPhoto ? 'Tu foto. Tocá para elegir otra' : 'Elegir una foto de la galería',
    gallery: 'Galería',
    removePhoto: 'Quitar foto',
    skinPhotoHint: 'Con una skin puesta, tu foto queda guardada: volvé a ella cuando quieras.',
    avatarHint: 'Elegí una skin, un avatar o subí una foto tuya.',
    displayName: 'Nombre visible',
    displayNameHint: 'Tu nombre de usuario y tu código no cambian.',
    titleCaps: 'TÍTULO',
    titleHint:
      'Aparece debajo de tu nombre. Se desbloquean subiendo de nivel; en Automático se muestra el más alto que tengas.',
    titleA11y: 'Título',
    auto: 'Automático',
    autoA11y: (title: string) => `Automático: ${title}`,
    lockedTitleA11y: (title: string, level: number) =>
      `${title}, se desbloquea en el nivel ${level}`,
    levelShort: (level: number) => ` · Nv. ${level}`,
    countryCaps: 'PAÍS',
    countryHint:
      'Aparece junto a tu nombre. En tu perfil público sólo se ve si lo activás en Ajustes.',
    countryA11y: 'País',
    noCountry: 'Sin país',
    countryName: (_code: string, fallback: string) => fallback,
    dailyGoal: 'OBJETIVO DIARIO',
    minutesPerDay: (minutes: number) => `${minutes} minutos al día`,
    groups: { cosmetic: 'COSMÉTICOS', exclusive: 'EXCLUSIVOS', competitive: 'COMPETITIVO' },
    compatPrefix: (kind: 'frame' | 'background') =>
      `${kind === 'frame' ? 'Marcos' : 'Fondos'} que combinan con `,
    yourAvatar: 'tu avatar',
    compatHidden: (hidden: number) =>
      hidden > 0
        ? `${hidden} ${hidden === 1 ? 'otro combina' : 'más combinan'} con otros avatares; lo que ya tenés sigue en tu inventario.`
        : 'Con otro avatar vas a ver otros.',
    noRarity: 'No hay ítems de esta rareza.',
    loadout: { avatar: 'Avatar', frame: 'Marco', background: 'Fondo' },
    basic: 'Básico',
    solid: 'Sólido',
    rarityFilters: {
      all: 'Todos',
      free: 'Gratis',
      common: 'Comunes',
      rare: 'Raros',
      epic: 'Épicos',
      legendary: 'Legendarios',
      mythic: 'Míticos',
      exclusive: 'Exclusivos',
      limited: 'Limitados',
    } satisfies Record<RarityFilter, string>,
  },
  en: {
    tabs: { avatar: 'Avatars', frame: 'Frames', background: 'Backgrounds' },
    nameEmpty: 'Your name can’t be empty.',
    tryingOn: (names: string[]) =>
      `You’re trying on ${names.join(' and ')}: ${
        names.length > 1 ? 'buy them to save them.' : 'buy it to save it.'
      }`,
    blockedByAvatar:
      'That frame or background goes with the skin you’re trying on: it saves once you own it.',
    previewSave:
      'PREVIEW: saving is disabled (this build uses the real database). You can try everything in the preview.',
    save: 'Save changes',
    buyAndSave: (price: number) => `Buy and save · ${price}`,
    buyingOnSave: (names: string[]) =>
      `Saving buys ${names.join(' and ')} and puts ${names.length > 1 ? 'them' : 'it'} on.`,
    notEnough: (missing: number) => `You need ${missing} more Polys to buy it.`,
    droppedOnSave: (names: string[], avatar: string) =>
      `${names.join(' and ')} ${names.length > 1 ? "don't" : "doesn't"} go with ${avatar || 'this avatar'}: saving switches ${names.length > 1 ? 'them' : 'it'} back to basic.`,
    title: 'Customize',
    balanceA11y: (balance: number) => `You have ${balance} Polys`,
    previewA11y: 'Preview of your profile',
    collection: 'Collection',
    basicAvatars: 'BASIC AVATARS',
    avatarName: (id: AvatarId, fallback: string) => avatarNameEn(id, fallback),
    photoA11y: (hasPhoto: boolean) =>
      hasPhoto ? 'Your photo. Tap to choose another' : 'Choose a photo from your gallery',
    gallery: 'Gallery',
    removePhoto: 'Remove photo',
    skinPhotoHint: 'While a skin is on, your photo stays saved: switch back whenever you want.',
    avatarHint: 'Pick a skin, an avatar or upload a photo of yourself.',
    displayName: 'Display name',
    displayNameHint: 'Your username and code don’t change.',
    titleCaps: 'TITLE',
    titleHint:
      'It shows under your name. You unlock them by leveling up; Automatic shows the highest one you have.',
    titleA11y: 'Title',
    auto: 'Automatic',
    autoA11y: (title: string) => `Automatic: ${title}`,
    lockedTitleA11y: (title: string, level: number) => `${title}, unlocks at level ${level}`,
    levelShort: (level: number) => ` · Lv. ${level}`,
    countryCaps: 'COUNTRY',
    countryHint:
      'It shows next to your name. On your public profile it only appears if you turn it on in Settings.',
    countryA11y: 'Country',
    noCountry: 'No country',
    countryName: (code: string, fallback: string) => COUNTRIES_EN[code] ?? fallback,
    dailyGoal: 'DAILY GOAL',
    minutesPerDay: (minutes: number) => `${minutes} minutes a day`,
    groups: { cosmetic: 'COSMETIC', exclusive: 'EXCLUSIVE', competitive: 'COMPETITIVE' },
    compatPrefix: (kind: 'frame' | 'background') =>
      `${kind === 'frame' ? 'Frames' : 'Backgrounds'} that go with `,
    yourAvatar: 'your avatar',
    compatHidden: (hidden: number) =>
      hidden > 0
        ? `${hidden} more ${hidden === 1 ? 'goes' : 'go'} with other avatars; what you already own stays in your inventory.`
        : 'With another avatar you’ll see others.',
    noRarity: 'No items of this rarity.',
    loadout: { avatar: 'Avatar', frame: 'Frame', background: 'Background' },
    basic: 'Basic',
    solid: 'Solid',
    rarityFilters: {
      all: 'All',
      free: 'Free',
      common: 'Common',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary',
      mythic: 'Mythic',
      exclusive: 'Exclusive',
      limited: 'Limited',
    },
  },
});
