import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Check, Paintbrush, ScanFace } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { COSMETICS, RARITY_LABEL, type CosmeticItem, type CosmeticKind } from '@shared/cosmetics';

import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  PolyCoin,
  Screen,
  ScreenHeader,
  Text,
  colors,
  radii,
  spacing,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { ProfileBackdrop } from '@/features/cosmetics/ProfileBackdrop';
import { BuyCosmeticButton, ItemTile } from '@/features/cosmetics/CosmeticTiles';
import { useEquipCosmetic, useOwnedCosmetics } from '@/features/cosmetics/api';
import { RARITY_COLORS } from '@/features/cosmetics/visuals';
import { useDailyMissions } from '@/features/missions/api';
import { useMyProfile } from '@/features/profile/hooks';
import { usePolys, useStreakRepair } from '@/features/polys/api';
import { FreezeCard, StreakRepairCard } from '@/features/polys/StreakCards';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';
import { toUserMessage } from '@/lib/errors';
import { playSound } from '@/lib/sounds';

const TABS: { kind: CosmeticKind; label: string; Icon: typeof ScanFace }[] = [
  { kind: 'frame', label: 'Marcos', Icon: ScanFace },
  { kind: 'background', label: 'Fondos', Icon: Paintbrush },
];

/**
 * Tienda de Polys: cuidar la racha (recuperarla o comprar protectores) y cosméticos. Tocar un ítem
 * lo prueba arriba sobre tu propio avatar; recién el botón lo compra o lo pone.
 */
export default function ShopScreen() {
  const profile = useMyProfile();
  const owned = useOwnedCosmetics();
  const polys = usePolys();
  const missions = useDailyMissions();
  const repair = useStreakRepair();
  const [kind, setKind] = useState<CosmeticKind>('frame');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (profile.isPending || owned.isPending) return <LoadingState label="Abriendo la tienda…" />;
  if (profile.isError || owned.isError || !profile.data) {
    return (
      <ErrorState
        onRetry={() => {
          void profile.refetch();
          void owned.refetch();
        }}
      />
    );
  }

  const me = profile.data.profile;
  const ownedSet = new Set(owned.data);
  const equippedId = kind === 'frame' ? me.frame_id : me.background_id;
  const items = COSMETICS.filter((c) => c.kind === kind);
  const selected =
    items.find((c) => c.id === selectedId) ?? items.find((c) => c.id === equippedId) ?? items[0]!;

  return (
    <Screen
      edges={['top', 'bottom']}
      onRefresh={() => {
        void owned.refetch();
        void repair.refetch();
        void polys.refetch();
      }}
      refreshing={owned.isRefetching}
    >
      <View style={styles.header}>
        <View style={styles.flex}>
          <ScreenHeader title="Tienda" onBack={() => router.back()} />
        </View>
        <View style={styles.balance} accessibilityLabel={`Tenés ${polys.data?.balance ?? 0} Polys`}>
          <PolyCoin size={22} />
          <Text variant="heading" color="gold" style={styles.tabular}>
            {polys.data?.balance ?? '–'}
          </Text>
        </View>
      </View>

      {repair.data ? <StreakRepairCard offer={repair.data} /> : null}
      {missions.data ? (
        <FreezeCard freezes={missions.data.freezes} max={missions.data.max_freezes} />
      ) : null}

      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map(({ kind: k, label, Icon }) => {
          const active = k === kind;
          return (
            <Pressable
              key={k}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => {
                setKind(k);
                setSelectedId(null);
              }}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Icon color={active ? colors.onPrimary : colors.textMuted} size={16} />
              <Text variant="bodyStrong" color={active ? 'onPrimary' : 'textMuted'}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FittingRoom
        key={selected.id}
        item={selected}
        avatarId={me.avatar_id}
        photoUrl={avatarPhotoUrl(me.avatar_path)}
        name={me.display_name ?? me.username ?? ''}
        frameId={kind === 'frame' ? selected.id : me.frame_id}
        backgroundId={kind === 'background' ? selected.id : me.background_id}
        owned={ownedSet.has(selected.id)}
        equipped={equippedId === selected.id}
        balance={polys.data?.balance ?? 0}
      />

      <View style={styles.grid}>
        {items.map((item) => (
          <ItemTile
            key={item.id}
            item={item}
            avatarId={me.avatar_id}
            photoUrl={avatarPhotoUrl(me.avatar_path)}
            selected={item.id === selected.id}
            owned={ownedSet.has(item.id)}
            equipped={item.id === equippedId}
            onPress={() => {
              void Haptics.selectionAsync();
              setSelectedId(item.id);
            }}
          />
        ))}
      </View>

      <Text variant="caption" align="center">
        Los legendarios no se compran: se ganan en la temporada o son exclusivos.
      </Text>
    </Screen>
  );
}

/** Vista previa grande del ítem elegido sobre tu perfil, con la acción que corresponda. */
function FittingRoom({
  item,
  avatarId,
  photoUrl,
  name,
  frameId,
  backgroundId,
  owned,
  equipped,
  balance,
}: {
  item: CosmeticItem;
  avatarId: string;
  photoUrl: string | null;
  name: string;
  frameId: string | null;
  backgroundId: string | null;
  owned: boolean;
  equipped: boolean;
  balance: number;
}) {
  const equip = useEquipCosmetic();
  const rarity = RARITY_COLORS[item.rarity];
  const done = () => {
    playSound('complete');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  let action;
  if (equipped) {
    action = (
      <Button
        label="Sacármelo"
        variant="ghost"
        loading={equip.isPending}
        onPress={() => equip.mutate({ kind: item.kind, itemId: null })}
      />
    );
  } else if (owned) {
    action = (
      <Button
        label="Usar"
        icon={<Check color={colors.onPrimary} size={20} />}
        loading={equip.isPending}
        onPress={() => equip.mutate({ kind: item.kind, itemId: item.id }, { onSuccess: done })}
      />
    );
  } else {
    action = <BuyCosmeticButton item={item} balance={balance} />;
  }

  return (
    <Card style={[styles.room, { borderColor: rarity }]}>
      <Animated.View key={item.id} entering={FadeIn.duration(200)}>
        <ProfileBackdrop backgroundId={backgroundId} style={styles.preview}>
          <FramedAvatar
            avatarId={avatarId}
            photoUrl={photoUrl}
            size={96}
            frameId={frameId}
            fallbackRing={colors.primary}
          />
          <Text variant="heading" color="textStrong" numberOfLines={1}>
            {name}
          </Text>
        </ProfileBackdrop>
      </Animated.View>
      <View style={styles.roomInfo}>
        <View style={styles.flex}>
          <Text variant="heading" color="textStrong">
            {item.name}
          </Text>
          <Text variant="caption" style={{ color: rarity }}>
            {RARITY_LABEL[item.rarity]}
            {equipped ? ' · En uso' : owned ? ' · Tuyo' : ''}
          </Text>
        </View>
      </View>
      {action}
      {equip.error ? <FormMessage tone="error" message={toUserMessage(equip.error)} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  balance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabular: { fontVariant: ['tabular-nums'] },
  tabs: {
    flexDirection: 'row',
    padding: spacing.xs,
    gap: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 40,
    borderRadius: radii.pill,
  },
  tabActive: { backgroundColor: colors.primary },
  room: { gap: spacing.md, borderWidth: 2 },
  preview: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
    minHeight: 170,
    justifyContent: 'center',
  },
  roomInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
