import type { ImageSourcePropType } from 'react-native';

import type { TierId } from '@shared/ranking';

/**
 * Arte de la colección de perfil (assets/profile, WebP optimizados desde los PNG originales; ver
 * docs/PROFILE_CUSTOMIZATION.md, "Assets"). Van como assets de Metro (no incrustados en el bundle de
 * JS como los zorros de siempre): son ~1,8 MB y sólo se cargan cuando se muestran.
 *
 * Geometría de los marcos: medida sobre cada imagen (ajuste de círculo al borde interior del aro).
 * `cx`, `cy` = centro del hueco en fracción del ancho/alto; `r` = radio del hueco en fracción del
 * ancho; `aspect` = alto / ancho. El avatar se dibuja centrado en ese hueco y el marco encima; a los
 * marcos de rango se les recortó el disco oscuro del centro, así que todos son transparentes adentro.
 */

/** Las skins las resuelve el componente Avatar del design system. */
export { SKIN_IMAGES } from '@/design-system/skinImages';

export interface FrameArt {
  source: ImageSourcePropType;
  aspect: number;
  cx: number;
  cy: number;
  r: number;
}

const art = (source: ImageSourcePropType, cx: number, cy: number, r: number): FrameArt => ({
  source,
  aspect: 0.9139,
  cx,
  cy,
  r,
});

export const FRAME_ART: Record<string, FrameArt> = {
  frame_leaf: art(require('../../../assets/profile/frames/cosmetic/leaf.webp'), 0.4984, 0.4506, 0.3306),
  frame_stellar: art(
    require('../../../assets/profile/frames/cosmetic/stellar.webp'),
    0.4941,
    0.4868,
    0.3365,
  ),
  frame_crystal: art(
    require('../../../assets/profile/frames/cosmetic/crystal.webp'),
    0.5001,
    0.4679,
    0.3296,
  ),
  frame_elite: art(require('../../../assets/profile/frames/cosmetic/elite.webp'), 0.4996, 0.4565, 0.3273),
  frame_master: art(
    require('../../../assets/profile/frames/cosmetic/master.webp'),
    0.4995,
    0.4865,
    0.2969,
  ),
  frame_plus: art(require('../../../assets/profile/frames/exclusive/plus.webp'), 0.497, 0.5, 0.327),
};

export const RANK_FRAME_ART: Record<TierId, FrameArt> = {
  bronze: art(require('../../../assets/profile/frames/elo/bronze.webp'), 0.4898, 0.4433, 0.3098),
  silver: art(require('../../../assets/profile/frames/elo/silver.webp'), 0.491, 0.4393, 0.307),
  gold: art(require('../../../assets/profile/frames/elo/gold.webp'), 0.4902, 0.4371, 0.3058),
  platinum: art(require('../../../assets/profile/frames/elo/platinum.webp'), 0.4973, 0.4508, 0.3082),
  emerald: art(require('../../../assets/profile/frames/elo/emerald.webp'), 0.4993, 0.4454, 0.2998),
  diamond: art(require('../../../assets/profile/frames/elo/diamond.webp'), 0.5021, 0.4457, 0.2941),
  master: art(require('../../../assets/profile/frames/elo/master.webp'), 0.4997, 0.454, 0.3045),
  grandmaster: art(
    require('../../../assets/profile/frames/elo/grandmaster.webp'),
    0.5,
    0.4781,
    0.2828,
  ),
};

export const BACKGROUND_IMAGES: Record<string, ImageSourcePropType> = {
  bg_mountain: require('../../../assets/profile/backgrounds/mountain.webp'),
  bg_forest: require('../../../assets/profile/backgrounds/forest.webp'),
  bg_aurora: require('../../../assets/profile/backgrounds/aurora.webp'),
  bg_neon: require('../../../assets/profile/backgrounds/neon-city.webp'),
  bg_space: require('../../../assets/profile/backgrounds/space.webp'),
  bg_galaxy: require('../../../assets/profile/backgrounds/galaxy.webp'),
  bg_dimension: require('../../../assets/profile/backgrounds/dimension.webp'),
};
