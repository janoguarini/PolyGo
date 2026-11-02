import * as Haptics from 'expo-haptics';
import { Ban, Lock } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { RARITY_LABEL, cosmeticSourceLabel, type CosmeticItem } from '@shared/cosmetics';

import { Button, PolyCoin, Text, colors, radii, spacing } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { toUserMessage } from '@/lib/errors';
import { playSound } from '@/lib/sounds';

import { FramedAvatar } from './FramedAvatar';
import { ProfileBackdrop } from './ProfileBackdrop';
import { useBuyCosmetic } from './api';
import { RARITY_COLORS } from './visuals';

/** Ficha de un marco o fondo en una grilla: muestra cómo queda, si es tuyo, si está puesto o cuánto sale. */
export function ItemTile({
  item,
  avatarId,
  photoUrl,
  selected,
  owned,
  equipped,
  onPress,
}: {
  item: CosmeticItem;
  avatarId: string;
  photoUrl: string | null;
  selected: boolean;
  owned: boolean;
  equipped: boolean;
  onPress: () => void;
}) {
  const rarity = RARITY_COLORS[item.rarity];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${item.name}, ${RARITY_LABEL[item.rarity]}. ${
        equipped
          ? 'En uso'
          : owned
            ? 'Ya es tuyo'
            : item.price === null
              ? cosmeticSourceLabel(item.source)
              : `${item.price} Polys`
      }`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { borderColor: selected ? rarity : colors.border },
        selected && styles.tileSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.rarityBar, { backgroundColor: rarity }]} />
      {item.kind === 'frame' ? (
        <FramedAvatar avatarId={avatarId} photoUrl={photoUrl} size={46} frameId={item.id} />
      ) : (
        <ProfileBackdrop backgroundId={item.id} style={styles.swatch}>
          <View />
        </ProfileBackdrop>
      )}
      <Text variant="caption" color="textStrong" numberOfLines={1}>
        {item.name}
      </Text>
      {equipped ? (
        <Text variant="caption" color="success">
          En uso
        </Text>
      ) : owned ? (
        <Text variant="caption" color="primarySoft">
          Tuyo
        </Text>
      ) : item.price === null ? (
        <Lock color={colors.textMuted} size={14} />
      ) : (
        <View style={styles.price}>
          <PolyCoin size={14} />
          <Text variant="caption" color="gold" style={styles.tabular}>
            {item.price}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

/** Ficha "Ninguno": sacarse el marco o el fondo. */
export function NoneTile({
  selected,
  equipped,
  onPress,
}: {
  selected: boolean;
  equipped: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Ninguno${equipped ? ', en uso' : ''}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { borderColor: selected ? colors.primaryBright : colors.border },
        selected && styles.tileSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.none}>
        <Ban color={colors.textMuted} size={24} />
      </View>
      <Text variant="caption" color="textStrong">
        Ninguno
      </Text>
      {equipped ? (
        <Text variant="caption" color="success">
          En uso
        </Text>
      ) : null}
    </Pressable>
  );
}

/** Botón de compra con Polys (el ítem queda puesto al comprarlo). Para legendarios, cómo se consiguen. */
export function BuyCosmeticButton({
  item,
  balance,
  onBought,
}: {
  item: CosmeticItem;
  balance: number;
  onBought?: () => void;
}) {
  const buy = useBuyCosmetic();
  if (item.price === null) {
    return (
      <View style={styles.locked}>
        <Lock color={colors.textMuted} size={18} />
        <Text variant="bodyStrong" color="textMuted">
          {cosmeticSourceLabel(item.source)}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.buy}>
      <Button
        label={`Comprar por ${item.price}`}
        icon={<PolyCoin size={20} />}
        disabled={balance < item.price}
        loading={buy.isPending}
        accessibilityHint={`Cuesta ${item.price} Polys. Tenés ${balance}. Queda puesto al comprarlo.`}
        onPress={() =>
          buy.mutate(item.id, {
            onSuccess: () => {
              playSound('complete');
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onBought?.();
            },
          })
        }
      />
      {balance < item.price ? (
        <Text variant="caption" align="center">
          Te faltan {item.price - balance} Polys.
        </Text>
      ) : null}
      {buy.error ? <FormMessage tone="error" message={toUserMessage(buy.error)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '31.5%',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.lg,
    borderWidth: 2,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    minHeight: 120,
  },
  tileSelected: { backgroundColor: colors.surfaceRaised },
  rarityBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  swatch: { width: 64, height: 64, padding: 0, borderRadius: radii.md },
  none: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  tabular: { fontVariant: ['tabular-nums'] },
  pressed: { opacity: 0.8 },
  buy: { gap: spacing.xs },
  locked: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 50,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
  },
});
