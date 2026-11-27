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

const COUNTRIES_PT: Record<string, string> = {
  AR: 'Argentina',
  BO: 'Bolívia',
  CL: 'Chile',
  CO: 'Colômbia',
  CR: 'Costa Rica',
  CU: 'Cuba',
  EC: 'Equador',
  SV: 'El Salvador',
  ES: 'Espanha',
  GT: 'Guatemala',
  HN: 'Honduras',
  MX: 'México',
  NI: 'Nicarágua',
  PA: 'Panamá',
  PY: 'Paraguai',
  PE: 'Peru',
  PR: 'Porto Rico',
  DO: 'República Dominicana',
  UY: 'Uruguai',
  VE: 'Venezuela',
  BR: 'Brasil',
  US: 'Estados Unidos',
  GB: 'Reino Unido',
  IT: 'Itália',
  FR: 'França',
  DE: 'Alemanha',
};

const COUNTRIES_IT: Record<string, string> = {
  AR: 'Argentina',
  BO: 'Bolivia',
  CL: 'Cile',
  CO: 'Colombia',
  CR: 'Costa Rica',
  CU: 'Cuba',
  EC: 'Ecuador',
  SV: 'El Salvador',
  ES: 'Spagna',
  GT: 'Guatemala',
  HN: 'Honduras',
  MX: 'Messico',
  NI: 'Nicaragua',
  PA: 'Panamá',
  PY: 'Paraguay',
  PE: 'Perù',
  PR: 'Porto Rico',
  DO: 'Repubblica Dominicana',
  UY: 'Uruguay',
  VE: 'Venezuela',
  BR: 'Brasile',
  US: 'Stati Uniti',
  GB: 'Regno Unito',
  IT: 'Italia',
  FR: 'Francia',
  DE: 'Germania',
};

/** Animal (con género gramatical) y color (masculino / femenino) para pt-BR e it. */
type Gendered = { name: string; feminine: boolean };
const ANIMALS_PT: Record<string, Gendered> = {
  fox: { name: 'Raposa', feminine: true },
  panda: { name: 'Panda', feminine: false },
  dog: { name: 'Cachorro', feminine: false },
  cat: { name: 'Gato', feminine: false },
  lion: { name: 'Leão', feminine: false },
};
const COLORS_PT: Record<string, [string, string]> = {
  violet: ['violeta', 'violeta'],
  yellow: ['amarelo', 'amarela'],
  red: ['vermelho', 'vermelha'],
};
const ANIMALS_IT: Record<string, Gendered> = {
  fox: { name: 'Volpe', feminine: true },
  panda: { name: 'Panda', feminine: false },
  dog: { name: 'Cane', feminine: false },
  cat: { name: 'Gatto', feminine: false },
  lion: { name: 'Leone', feminine: false },
};
const COLORS_IT: Record<string, [string, string]> = {
  violet: ['viola', 'viola'],
  yellow: ['giallo', 'gialla'],
  red: ['rosso', 'rossa'],
};

const avatarNameIn =
  (animals: Record<string, Gendered>, colors: Record<string, [string, string]>) =>
  (id: AvatarId, fallback: string): string => {
    const legacy = LEGACY_FOXES[id];
    const [animal, color] = legacy ? ['fox', legacy] : id.split('-');
    const a = animal ? animals[animal] : undefined;
    const c = color ? colors[color] : undefined;
    return a && c ? `${a.name} ${c[a.feminine ? 1 : 0]}` : fallback;
  };
const avatarNamePt = avatarNameIn(ANIMALS_PT, COLORS_PT);
const avatarNameIt = avatarNameIn(ANIMALS_IT, COLORS_IT);

type RarityFilter = CosmeticRarity | 'all';

/** Personalización (src/app/edit-profile.tsx). */
export const editProfileStrings = defineStrings({
  es: {
    tabs: { avatar: 'Avatares', frame: 'Marcos', background: 'Fondos' },
    nameEmpty: 'El nombre no puede quedar vacío.',
    tryingOn: (names: string[]) =>
      `Estás probando ${names.join(' y ')}: ${
        names.length > 1 ? 'cómpralos para que se guarden.' : 'cómpralo para que se guarde.'
      }`,
    blockedByAvatar:
      'Ese marco o fondo combina con la skin que estás probando: se guarda cuando la tengas.',
    previewSave:
      'PREVIEW: guardar está deshabilitado (esta build usa la base real). Puedes probar todo en la vista previa.',
    save: 'Guardar cambios',
    buyAndSave: (price: number) => `Comprar y guardar · ${price}`,
    buyingOnSave: (names: string[]) =>
      `Al guardar se compra${names.length > 1 ? 'n' : ''} ${names.join(' y ')} y queda${names.length > 1 ? 'n' : ''} puesto${names.length > 1 ? 's' : ''}.`,
    notEnough: (missing: number) => `Te faltan ${missing} Polys para comprarlo.`,
    droppedOnSave: (names: string[], avatar: string) =>
      `${names.join(' y ')} no combina${names.length > 1 ? 'n' : ''} con ${avatar || 'este avatar'}: al guardar vuelve${names.length > 1 ? 'n' : ''} al básico.`,
    title: 'Personalización',
    balanceA11y: (balance: number) => `Tienes ${balance} Polys`,
    previewA11y: 'Vista previa de tu perfil',
    collection: 'Colección',
    basicAvatars: 'AVATARES BÁSICOS',
    avatarName: (_id: AvatarId, fallback: string) => fallback,
    photoA11y: (hasPhoto: boolean): string =>
      hasPhoto ? 'Tu foto. Toca para elegir otra' : 'Elegir una foto de la galería',
    gallery: 'Galería',
    removePhoto: 'Quitar foto',
    skinPhotoHint: 'Con una skin puesta, tu foto queda guardada: vuelve a ella cuando quieras.',
    avatarHint: 'Elige una skin, un avatar o sube una foto tuya.',
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
      'Aparece junto a tu nombre. En tu perfil público sólo se ve si lo activas en Ajustes.',
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
        ? `${hidden} ${hidden === 1 ? 'otro combina' : 'más combinan'} con otros avatares; lo que ya tienes sigue en tu inventario.`
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
  'pt-BR': {
    tabs: { avatar: 'Avatares', frame: 'Molduras', background: 'Fundos' },
    nameEmpty: 'O nome não pode ficar vazio.',
    tryingOn: (names: string[]) =>
      `Você está provando ${names.join(' e ')}: ${
        names.length > 1 ? 'compre os itens para salvá-los.' : 'compre o item para salvá-lo.'
      }`,
    blockedByAvatar:
      'Essa moldura ou fundo combina com a skin que você está provando: ela é salva quando você tiver a skin.',
    previewSave:
      'PREVIEW: salvar está desativado (esta build usa a base real). Você pode testar tudo na pré-visualização.',
    save: 'Salvar alterações',
    buyAndSave: (price: number) => `Comprar e salvar · ${price}`,
    buyingOnSave: (names: string[]) =>
      `Ao salvar, você compra e equipa ${names.join(' e ')}${names.length > 1 ? ' de uma vez' : ''}.`,
    notEnough: (missing: number) => `Faltam ${missing} Polys para comprar.`,
    droppedOnSave: (names: string[], avatar: string) =>
      `${names.join(' e ')} não combina${names.length > 1 ? 'm' : ''} com ${avatar || 'este avatar'}: ao salvar, volta${names.length > 1 ? 'm' : ''} para o básico.`,
    title: 'Personalização',
    balanceA11y: (balance: number) => `Você tem ${balance} Polys`,
    previewA11y: 'Pré-visualização do seu perfil',
    collection: 'Coleção',
    basicAvatars: 'AVATARES BÁSICOS',
    avatarName: (id: AvatarId, fallback: string) => avatarNamePt(id, fallback),
    photoA11y: (hasPhoto: boolean) =>
      hasPhoto ? 'Sua foto. Toque para escolher outra' : 'Escolher uma foto da galeria',
    gallery: 'Galeria',
    removePhoto: 'Remover foto',
    skinPhotoHint: 'Com uma skin equipada, sua foto continua salva: volte para ela quando quiser.',
    avatarHint: 'Escolha uma skin, um avatar ou envie uma foto sua.',
    displayName: 'Nome de exibição',
    displayNameHint: 'Seu nome de usuário e seu código não mudam.',
    titleCaps: 'TÍTULO',
    titleHint:
      'Aparece embaixo do seu nome. Eles são desbloqueados ao subir de nível; no Automático aparece o mais alto que você tiver.',
    titleA11y: 'Título',
    auto: 'Automático',
    autoA11y: (title: string) => `Automático: ${title}`,
    lockedTitleA11y: (title: string, level: number) => `${title}, desbloqueia no nível ${level}`,
    levelShort: (level: number) => ` · Nv. ${level}`,
    countryCaps: 'PAÍS',
    countryHint:
      'Aparece ao lado do seu nome. No seu perfil público, só aparece se você ativar em Configurações.',
    countryA11y: 'País',
    noCountry: 'Sem país',
    countryName: (code: string, fallback: string) => COUNTRIES_PT[code] ?? fallback,
    dailyGoal: 'META DIÁRIA',
    minutesPerDay: (minutes: number) => `${minutes} minutos por dia`,
    groups: { cosmetic: 'COSMÉTICOS', exclusive: 'EXCLUSIVOS', competitive: 'COMPETITIVO' },
    compatPrefix: (kind: 'frame' | 'background') =>
      `${kind === 'frame' ? 'Molduras' : 'Fundos'} que combinam com `,
    yourAvatar: 'seu avatar',
    compatHidden: (hidden: number) =>
      hidden > 0
        ? `${hidden} ${hidden === 1 ? 'outro combina' : 'outros combinam'} com avatares diferentes; o que você já tem continua no seu inventário.`
        : 'Com outro avatar, você vai ver outras opções.',
    noRarity: 'Não há itens dessa raridade.',
    loadout: { avatar: 'Avatar', frame: 'Moldura', background: 'Fundo' },
    basic: 'Básico',
    solid: 'Sólido',
    rarityFilters: {
      all: 'Todos',
      free: 'Grátis',
      common: 'Comuns',
      rare: 'Raros',
      epic: 'Épicos',
      legendary: 'Lendários',
      mythic: 'Míticos',
      exclusive: 'Exclusivos',
      limited: 'Limitados',
    },
  },
  it: {
    tabs: { avatar: 'Avatar', frame: 'Cornici', background: 'Sfondi' },
    nameEmpty: 'Il nome non può restare vuoto.',
    tryingOn: (names: string[]) =>
      `Stai provando ${names.join(' e ')}: ${
        names.length > 1 ? 'comprali per salvarli.' : 'compralo per salvarlo.'
      }`,
    blockedByAvatar:
      'Quella cornice o quello sfondo si abbina alla skin che stai provando: viene salvato quando la avrai.',
    previewSave:
      'PREVIEW: il salvataggio è disattivato (questa build usa il database reale). Puoi provare tutto nell’anteprima.',
    save: 'Salva modifiche',
    buyAndSave: (price: number) => `Compra e salva · ${price}`,
    buyingOnSave: (names: string[]) =>
      `Salvando, compri ${names.join(' e ')} e ${names.length > 1 ? 'li equipaggi' : 'lo equipaggi'}.`,
    notEnough: (missing: number) => `Ti mancano ${missing} Polys per comprarlo.`,
    droppedOnSave: (names: string[], avatar: string) =>
      `${names.join(' e ')} non si abbina${names.length > 1 ? 'no' : ''} con ${avatar || 'questo avatar'}: salvando torna${names.length > 1 ? 'no' : ''} a quello base.`,
    title: 'Personalizzazione',
    balanceA11y: (balance: number) => `Hai ${balance} Polys`,
    previewA11y: 'Anteprima del tuo profilo',
    collection: 'Collezione',
    basicAvatars: 'AVATAR BASE',
    avatarName: (id: AvatarId, fallback: string) => avatarNameIt(id, fallback),
    photoA11y: (hasPhoto: boolean) =>
      hasPhoto ? 'La tua foto. Tocca per sceglierne un’altra' : 'Scegli una foto dalla galleria',
    gallery: 'Galleria',
    removePhoto: 'Rimuovi foto',
    skinPhotoHint: 'Con una skin attiva, la tua foto resta salvata: tornaci quando vuoi.',
    avatarHint: 'Scegli una skin, un avatar o carica una tua foto.',
    displayName: 'Nome visibile',
    displayNameHint: 'Il tuo nome utente e il tuo codice non cambiano.',
    titleCaps: 'TITOLO',
    titleHint:
      'Appare sotto il tuo nome. Si sbloccano salendo di livello; in Automatico viene mostrato il più alto che hai.',
    titleA11y: 'Titolo',
    auto: 'Automatico',
    autoA11y: (title: string) => `Automatico: ${title}`,
    lockedTitleA11y: (title: string, level: number) => `${title}, si sblocca al livello ${level}`,
    levelShort: (level: number) => ` · Liv. ${level}`,
    countryCaps: 'PAESE',
    countryHint:
      'Appare accanto al tuo nome. Nel profilo pubblico si vede solo se lo attivi nelle Impostazioni.',
    countryA11y: 'Paese',
    noCountry: 'Nessun paese',
    countryName: (code: string, fallback: string) => COUNTRIES_IT[code] ?? fallback,
    dailyGoal: 'OBIETTIVO GIORNALIERO',
    minutesPerDay: (minutes: number) => `${minutes} minuti al giorno`,
    groups: { cosmetic: 'COSMETICI', exclusive: 'ESCLUSIVI', competitive: 'COMPETITIVO' },
    compatPrefix: (kind: 'frame' | 'background') =>
      `${kind === 'frame' ? 'Cornici' : 'Sfondi'} che si abbinano a `,
    yourAvatar: 'il tuo avatar',
    compatHidden: (hidden: number) =>
      hidden > 0
        ? `${hidden} ${hidden === 1 ? 'altro si abbina' : 'altri si abbinano'} ad altri avatar; quello che hai già resta nel tuo inventario.`
        : 'Con un altro avatar ne vedrai altri.',
    noRarity: 'Non ci sono oggetti di questa rarità.',
    loadout: { avatar: 'Avatar', frame: 'Cornice', background: 'Sfondo' },
    basic: 'Base',
    solid: 'Tinta unita',
    rarityFilters: {
      all: 'Tutti',
      free: 'Gratis',
      common: 'Comuni',
      rare: 'Rari',
      epic: 'Epici',
      legendary: 'Leggendari',
      mythic: 'Mitici',
      exclusive: 'Esclusivi',
      limited: 'Limitati',
    },
  },
});
