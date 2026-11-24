import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Check, Paintbrush, ScanFace, Smile } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { visibleCosmetics, type CosmeticItem, type CosmeticKind } from '@shared/cosmetics';

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
  themedStyles,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { ProfileBackdrop } from '@/features/cosmetics/ProfileBackdrop';
import {
  CosmeticAction,
  ItemTile,
  RankLadder,
  useCosmeticContext,
} from '@/features/cosmetics/CosmeticTiles';
import { useEquipCosmetic, useOwnedCosmetics } from '@/features/cosmetics/api';
import { cosmeticStatus, type CosmeticStatus } from '@/features/cosmetics/state';
import { RARITY_COLORS } from '@/features/cosmetics/visuals';
import { useDailyMissions } from '@/features/missions/api';
import { useMyProfile } from '@/features/profile/hooks';
import { usePolys, useStreakRepair } from '@/features/polys/api';
import { FreezeCard, StreakRepairCard } from '@/features/polys/StreakCards';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';
import { useStrings } from '@/i18n';
import { shopStrings } from '@/i18n/screens/shop';
import { toUserMessage } from '@/lib/errors';
import { playSound } from '@/lib/sounds';

type TabLabel = 'tabSkins' | 'tabFrames' | 'tabBackgrounds';

const TABS: { kind: CosmeticKind; label: TabLabel; Icon: typeof ScanFace }[] = [
  { kind: 'skin', label: 'tabSkins', Icon: Smile },
  { kind: 'frame', label: 'tabFrames', Icon: ScanFace },
  { kind: 'background', label: 'tabBackgrounds', Icon: Paintbrush },
];

/**
 * Tienda de Polys: cuidar la racha (recuperarla o comprar protectores) y cosméticos. Tocar un ítem
 * lo prueba arriba sobre tu propio avatar; recién el botón lo compra o lo pone.
 */
export default function ShopScreen() {
  const styles = useStyles();
  const t = useStrings(shopStrings);
  const profile = useMyProfile();
  const owned = useOwnedCosmetics();
  const polys = usePolys();
  const missions = useDailyMissions();
  const repair = useStreakRepair();
  const [kind, setKind] = useState<CosmeticKind>('skin');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ownedSet = new Set(owned.data ?? []);
  const ctx = useCosmeticContext(ownedSet);

  if (profile.isPending || owned.isPending) return <LoadingState label={t.loading} />;
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
  const equippedId =
    kind === 'skin' ? me.avatar_id : kind === 'frame' ? me.frame_id : me.background_id;
  const items = visibleCosmetics(kind, ownedSet);
  const selected =
    items.find((c) => c.id === selectedId) ?? items.find((c) => c.id === equippedId) ?? items[0]!;
  const statusOf = (item: CosmeticItem) => cosmeticStatus(item, ctx, equippedId);

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
          <ScreenHeader title={t.title} onBack={() => router.back()} />
        </View>
        <View style={styles.balance} accessibilityLabel={t.balanceA11y(polys.data?.balance ?? 0)}>
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
                {t[label]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FittingRoom
        key={selected.id}
        item={selected}
        status={statusOf(selected)}
        avatarId={kind === 'skin' && selected.available ? selected.id : me.avatar_id}
        photoUrl={avatarPhotoUrl(me.avatar_path)}
        name={me.display_name ?? me.username ?? ''}
        frameId={kind === 'frame' ? selected.id : me.frame_id}
        backgroundId={kind === 'background' ? selected.id : me.background_id}
        rating={ctx.rating}
        balance={polys.data?.balance ?? 0}
      />

      <View style={styles.grid}>
        {items.map((item) => (
          <ItemTile
            key={item.id}
            item={item}
            status={statusOf(item)}
            avatarId={me.avatar_id}
            photoUrl={avatarPhotoUrl(me.avatar_path)}
            rating={ctx.rating}
            selected={item.id === selected.id}
            onPress={() => {
              void Haptics.selectionAsync();
              setSelectedId(item.id);
            }}
          />
        ))}
      </View>

      {kind === 'frame' ? <RankLadder rating={ctx.rating} /> : null}

      <Text variant="caption" align="center">
        {t.footer}
      </Text>
    </Screen>
  );
}

/** Vista previa grande del ítem elegido sobre tu perfil, con la acción que corresponda. */
function FittingRoom({
  item,
  status,
  avatarId,
  photoUrl,
  name,
  frameId,
  backgroundId,
  rating,
  balance,
}: {
  item: CosmeticItem;
  status: CosmeticStatus;
  avatarId: string;
  photoUrl: string | null;
  name: string;
  frameId: string | null;
  backgroundId: string | null;
  rating: number | null;
  balance: number;
}) {
  const styles = useStyles();
  const t = useStrings(shopStrings);
  const equip = useEquipCosmetic();
  const rarity = RARITY_COLORS[item.rarity];
  const done = () => {
    playSound('complete');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  let action;
  if (status.kind === 'equipped') {
    // Una skin no se "saca": se elige otro avatar.
    action =
      item.kind === 'skin' ? null : (
        <Button
          label={t.unequip}
          variant="ghost"
          loading={equip.isPending}
          onPress={() => equip.mutate({ kind: item.kind, itemId: null })}
        />
      );
  } else if (status.kind === 'unlocked') {
    action = (
      <Button
        label={t.equip}
        icon={<Check color={colors.onPrimary} size={20} />}
        loading={equip.isPending}
        onPress={() => equip.mutate({ kind: item.kind, itemId: item.id }, { onSuccess: done })}
      />
    );
  } else {
    action = <CosmeticAction item={item} status={status} balance={balance} />;
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
            rating={frameId === 'frame_rank' ? (rating ?? 200) : rating}
            fallbackRing={colors.primary}
            animated
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
            {t.rarity[item.rarity]} · {t.source[item.source]}
            {status.kind === 'equipped' ? t.equipped : status.kind === 'unlocked' ? t.unlocked : ''}
          </Text>
        </View>
      </View>
      {action}
      {equip.error ? <FormMessage tone="error" message={toUserMessage(equip.error)} /> : null}
    </Card>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
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
  }),
);
