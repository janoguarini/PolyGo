import {
  Brain,
  Crown,
  Flame,
  Ghost,
  Rocket,
  Star,
  Swords,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AVATARS, DEFAULT_AVATAR, type AvatarId } from '@shared/profile';

import { colors } from '../tokens';

const ICONS: Record<(typeof AVATARS)[number]['icon'], LucideIcon> = {
  zap: Zap,
  flame: Flame,
  crown: Crown,
  rocket: Rocket,
  brain: Brain,
  ghost: Ghost,
  swords: Swords,
  star: Star,
};

export function Avatar({
  avatarId,
  size = 48,
}: {
  avatarId: string | null | undefined;
  size?: number;
}) {
  const avatar =
    AVATARS.find((a) => a.id === avatarId) ?? AVATARS.find((a) => a.id === DEFAULT_AVATAR)!;
  const Icon = ICONS[avatar.icon];
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: avatar.color,
          backgroundColor: `${avatar.color}26`,
        },
      ]}
    >
      <Icon color={avatar.color} size={size * 0.5} strokeWidth={2.2} />
    </View>
  );
}

export function isAvatarId(id: string): id is AvatarId {
  return AVATARS.some((a) => a.id === id);
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: colors.surfaceRaised,
  },
});
