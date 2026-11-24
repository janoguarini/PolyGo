import type { ImageSourcePropType } from 'react-native';

/**
 * Arte de las skins (avatares de la colección, assets/profile/avatars). Las skins se guardan en
 * profiles.avatar_id ('skin-<nombre>'), así que el componente Avatar las resuelve igual que a los
 * zorros de siempre. Una skin sin arte todavía (o desconocida para esta versión de la app) se ve
 * como el avatar predeterminado.
 */
export const SKIN_IMAGES: Partial<Record<string, ImageSourcePropType>> = {
  'skin-classic': require('../../assets/profile/avatars/classic.webp'),
  'skin-ninja': require('../../assets/profile/avatars/ninja.webp'),
  'skin-explorer': require('../../assets/profile/avatars/explorer.webp'),
  'skin-academic': require('../../assets/profile/avatars/academic.webp'),
  'skin-cyber': require('../../assets/profile/avatars/cyber.webp'),
};
