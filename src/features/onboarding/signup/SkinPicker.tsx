import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Lock } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { COSMETICS, RARITY_LABEL, type CosmeticItem } from '@shared/cosmetics';

import { Avatar, PolyCoin, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { SKIN_IMAGES } from '@/design-system/skinImages';
import { RARITY_COLORS } from '@/features/cosmetics/visuals';

/** La skin gratis con la que arranca toda cuenta nueva (la base sólo deja poner skins tuyas). */
export const STARTER_SKIN = 'skin-classic';

/** Las skins de la colección actual con arte en la app, sin la inicial: lo que se desbloquea después. */
const COLLECTION: CosmeticItem[] = COSMETICS.filter(
  (c) =>
    c.kind === 'skin' && c.available && !c.retired && c.id !== STARTER_SKIN && SKIN_IMAGES[c.id],
);

function unlockLine(item: CosmeticItem): string {
  if (item.source === 'plus') return `${item.name}: exclusiva de PolyGo Plus 👑`;
  if (item.price) return `${item.name}: desbloqueala con ${item.price} Polys en la Tienda 🛍️`;
  return `${item.name}: se gana jugando 🏆`;
}

/**
 * Paso del avatar: tu primer look (la skin Clásica, gratis) bien grande y con brillo, y abajo la
 * colección que podés desbloquear jugando. Tocar una bloqueada dice cómo se consigue.
 */
export function SkinPicker({ selected }: { selected: string }) {
  const styles = useStyles();
  const [hint, setHint] = useState<string | null>(null);
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, [pulse]);
  const ring = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <Animated.View style={[styles.ring, ring]} />
        <Animated.View entering={ZoomIn.springify().damping(9)}>
          <Avatar avatarId={selected} size={150} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.freeTag}>
          <Text variant="overline" color="textStrong">
            ✨ CLÁSICO · ¡GRATIS!
          </Text>
        </Animated.View>
      </View>

      <View style={styles.sectionTitle}>
        <Text variant="heading" color="textStrong">
          🔓 Desbloqueá más looks
        </Text>
        <Text variant="caption" color="textMuted">
          Ganá Polys jugando y armá tu colección.
        </Text>
      </View>

      {hint ? (
        <Animated.View key={hint} entering={FadeIn.duration(180)} style={styles.hint}>
          <Text variant="caption" color="textStrong" align="center">
            {hint}
          </Text>
        </Animated.View>
      ) : null}

      <View style={styles.grid}>
        {COLLECTION.map((item, i) => (
          <LockedSkin
            key={item.id}
            item={item}
            index={i}
            onPress={() => {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              setHint(unlockLine(item));
            }}
          />
        ))}
      </View>
    </View>
  );
}

function LockedSkin({
  item,
  index,
  onPress,
}: {
  item: CosmeticItem;
  index: number;
  onPress: () => void;
}) {
  const styles = useStyles();
  const color = RARITY_COLORS[item.rarity];
  const shake = useSharedValue(0);
  const shaking = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));
  return (
    <Animated.View
      entering={FadeInDown.delay(250 + index * 60).springify()}
      style={[styles.cellWrap, shaking]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${RARITY_LABEL[item.rarity]}, bloqueada`}
        onPress={() => {
          shake.set(
            withSequence(
              withTiming(-6, { duration: 50 }),
              withTiming(6, { duration: 50 }),
              withTiming(-4, { duration: 50 }),
              withTiming(0, { duration: 50 }),
            ),
          );
          onPress();
        }}
        style={({ pressed }) => [
          styles.cell,
          { borderColor: `${color}66` },
          pressed && styles.pressed,
        ]}
      >
        <LinearGradient
          colors={[`${color}33`, `${color}05`]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.cellFill]}
          pointerEvents="none"
        />
        <View>
          <View style={styles.dim}>
            <Avatar avatarId={item.id} size={64} />
          </View>
          <View style={styles.lockBadge}>
            <Lock color="#FFFFFF" size={11} strokeWidth={3} />
          </View>
        </View>
        <Text variant="caption" color="textStrong" numberOfLines={1}>
          {item.name}
        </Text>
        <Text variant="overline" style={{ color }} numberOfLines={1}>
          {RARITY_LABEL[item.rarity].toUpperCase()}
        </Text>
        <View style={styles.price}>
          {item.source === 'plus' ? (
            <>
              <Crown color={colors.gold} size={12} />
              <Text variant="overline" color="gold">
                PLUS
              </Text>
            </>
          ) : item.price ? (
            <>
              <PolyCoin size={13} />
              <Text variant="overline" color="textStrong">
                {item.price}
              </Text>
            </>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    wrap: { gap: spacing.md },
    hero: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md },
    ring: {
      position: 'absolute',
      top: spacing.md - 12,
      width: 174,
      height: 174,
      borderRadius: 87,
      borderWidth: 3,
      borderColor: '#A78BFA',
      backgroundColor: 'rgba(139,92,246,0.18)',
      shadowColor: '#8B5CF6',
      shadowOpacity: 0.9,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 0 },
    },
    freeTag: {
      marginTop: spacing.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radii.pill,
      backgroundColor: colors.primary,
    },
    sectionTitle: { gap: spacing.xxs, marginTop: spacing.sm },
    hint: {
      padding: spacing.sm,
      borderRadius: radii.md,
      backgroundColor: colors.surfaceHighlight,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    cellWrap: { width: '31.5%' },
    cell: {
      alignItems: 'center',
      gap: 2,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xs,
      borderRadius: radii.lg,
      borderWidth: 1.5,
      backgroundColor: colors.surface,
    },
    cellFill: { borderRadius: radii.lg - 1.5 },
    pressed: { opacity: 0.8 },
    dim: { opacity: 0.55, marginBottom: spacing.xs },
    lockBadge: {
      position: 'absolute',
      right: -2,
      bottom: 2,
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(7,6,15,0.85)',
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.35)',
    },
    price: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  }),
);
