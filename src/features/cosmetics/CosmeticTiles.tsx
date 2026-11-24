import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ban, Check, Crown, Gem, Gift, Hourglass, Lock, Swords, Trophy } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { useState } from 'react';

import { skinsCompatibleWith } from '@shared/cosmeticCompatibility';
import type { CosmeticItem } from '@shared/cosmetics';
import { TIERS, getRank } from '@shared/ranking';

import {
  Avatar,
  Button,
  PolyCoin,
  Text,
  colors,
  elevation,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { usePlus } from '@/features/plus/api';
import { useMyProfile } from '@/features/profile/hooks';
import { qaReadOnly } from '@/features/xp/previewGate';
import { useRankLabels } from '@/features/ranked/rankNames';
import { useStrings } from '@/i18n';
import { toUserMessage } from '@/lib/errors';
import { playSound } from '@/lib/sounds';

import { RANK_FRAME_ART } from './assets';
import { FramedAvatar } from './FramedAvatar';
import { ProfileBackdrop } from './ProfileBackdrop';
import { useBuyCosmetic } from './api';
import { type CosmeticContext, type CosmeticStatus } from './state';
import { cosmeticStrings } from './strings';
import { RARITY_COLORS, RARITY_GLOW } from './visuals';

/** Contexto para calcular estados: lo propio, Plus (servidor) y si está posicionado en ranked. */
export function useCosmeticContext(owned: ReadonlySet<string>): CosmeticContext & {
  rating: number | null;
} {
  const plus = usePlus();
  const me = useMyProfile();
  const r = me.data?.rating ?? null;
  const placed = Boolean(r && r.wins > 0);
  return { owned, plus, placed, rating: placed && r ? r.rating : null };
}

/** Ficha de un ítem en la grilla: cómo queda, rareza, estado y precio o requisito. */
export function ItemTile({
  item,
  status,
  avatarId,
  photoUrl,
  rating,
  selected,
  onPress,
}: {
  item: CosmeticItem;
  status: CosmeticStatus;
  avatarId: string;
  photoUrl: string | null;
  rating: number | null;
  selected: boolean;
  onPress: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(cosmeticStrings);
  const name = t.name(item);
  const rarity = RARITY_COLORS[item.rarity];
  const locked = status.kind === 'locked';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={t.tileA11y(
        name,
        t.rarity(item.rarity),
        status.kind === 'buy' ? t.pricePolys(status.price) : t.status(status),
      )}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { borderColor: selected ? rarity : colors.border },
        selected && styles.tileSelected,
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={RARITY_GLOW[item.rarity]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.rarityBar, { backgroundColor: rarity }]} />
      <View style={[styles.art, locked && styles.dim]}>
        <ItemPreview
          item={item}
          avatarId={avatarId}
          photoUrl={photoUrl}
          rating={rating}
          size={46}
        />
      </View>
      <Text variant="caption" color="textStrong" numberOfLines={1}>
        {name}
      </Text>
      <Text variant="caption" style={[styles.rarityLabel, { color: rarity }]} numberOfLines={1}>
        {t.rarity(item.rarity)}
      </Text>
      <StatusChip status={status} />
      {status.kind === 'equipped' ? <EquippedBadge /> : null}
      {locked ? (
        <View style={styles.lockBadge} accessible={false}>
          <Lock color={colors.textStrong} size={12} />
        </View>
      ) : null}
    </Pressable>
  );
}

/** Tilde verde en la esquina de lo que tenés puesto. */
export function EquippedBadge() {
  const styles = useStyles();
  return (
    <View style={styles.equipped} accessible={false}>
      <Check color={colors.onPrimary} size={14} strokeWidth={3.5} />
    </View>
  );
}

/** Lo que se dibuja en la ficha: la skin, tu avatar con el marco, o el fondo. */
export function ItemPreview({
  item,
  avatarId,
  photoUrl,
  rating,
  size,
}: {
  item: CosmeticItem;
  avatarId: string;
  photoUrl: string | null;
  rating: number | null;
  size: number;
}) {
  const styles = useStyles();
  if (item.kind === 'skin') {
    return item.available ? (
      <Avatar avatarId={item.id} size={size + 8} />
    ) : (
      <View style={[styles.missing, { width: size + 8, height: size + 8 }]}>
        <Hourglass color={colors.textMuted} size={20} />
      </View>
    );
  }
  if (item.kind === 'frame') {
    if (!item.available) {
      return (
        <View style={[styles.missing, { width: size + 8, height: size + 8 }]}>
          <Hourglass color={colors.textMuted} size={20} />
        </View>
      );
    }
    // El marco de rango sin rango todavía: el de Bronce como muestra.
    return (
      <FramedAvatar
        avatarId={avatarId}
        photoUrl={photoUrl}
        size={size}
        frameId={item.id}
        rating={item.id === 'frame_rank' ? (rating ?? TIERS[0]!.minRating + 100) : null}
      />
    );
  }
  return item.available ? (
    <ProfileBackdrop backgroundId={item.id} style={styles.swatch}>
      <View />
    </ProfileBackdrop>
  ) : (
    <View style={[styles.missing, styles.swatch]}>
      <Hourglass color={colors.textMuted} size={20} />
    </View>
  );
}

function StatusChip({ status }: { status: CosmeticStatus }) {
  const styles = useStyles();
  const t = useStrings(cosmeticStrings);
  switch (status.kind) {
    case 'equipped':
      return (
        <View style={styles.chipRow}>
          <Check color={colors.success} size={13} />
          <Text variant="caption" color="success">
            {t.status(status)}
          </Text>
        </View>
      );
    case 'unlocked':
      return (
        <Text variant="caption" color="primarySoft">
          {t.status(status)}
        </Text>
      );
    case 'buy':
      return (
        <View style={styles.chipRow}>
          <PolyCoin size={14} />
          <Text variant="caption" color="gold" style={styles.tabular}>
            {status.price}
          </Text>
        </View>
      );
    case 'locked': {
      const Icon =
        status.reason === 'plus'
          ? Gem
          : status.reason === 'referral'
            ? Gift
            : status.reason === 'rank'
              ? Swords
              : status.reason === 'missing_art'
                ? Hourglass
                : Lock;
      return (
        <View style={styles.chipRow}>
          <Icon color={colors.textMuted} size={13} />
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {t.status(status)}
          </Text>
        </View>
      );
    }
  }
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
  const styles = useStyles();
  const t = useStrings(cosmeticStrings);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={t.noneA11y(equipped)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { borderColor: selected ? colors.primaryBright : colors.border },
        selected && styles.tileSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.art}>
        <View style={styles.none}>
          <Ban color={colors.textMuted} size={24} />
        </View>
      </View>
      <Text variant="caption" color="textStrong">
        {t.none}
      </Text>
      {equipped ? (
        <Text variant="caption" color="success">
          {t.status({ kind: 'equipped' })}
        </Text>
      ) : null}
      {equipped ? <EquippedBadge /> : null}
    </Pressable>
  );
}

/**
 * Qué se puede hacer con el ítem elegido: comprarlo (queda puesto si combina con tu avatar), o cómo
 * conseguirlo si no se vende. Nunca muestra precio para lo que no se compra. Los marcos y fondos
 * temáticos dicen con qué skins combinan.
 */
export function CosmeticAction({
  item,
  status,
  balance,
  onBought,
}: {
  item: CosmeticItem;
  status: CosmeticStatus;
  balance: number;
  onBought?: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(cosmeticStrings);
  const buy = useBuyCosmetic();
  const [stored, setStored] = useState(false);
  const skins = skinsCompatibleWith(item.id);
  const combos =
    skins.length > 0 ? (
      <Text variant="caption" align="center">
        {t.combos(skins.map(t.nameFromEs).join(', '))}
      </Text>
    ) : null;
  if (stored) {
    return (
      <View style={styles.buy}>
        <FormMessage tone="success" message={t.stored(t.name(item))} />
        {combos}
      </View>
    );
  }
  if (status.kind === 'buy') {
    const short = balance < status.price;
    return (
      <View style={styles.buy}>
        <Button
          label={t.unlockFor(status.price)}
          icon={<PolyCoin size={20} />}
          disabled={short || qaReadOnly}
          loading={buy.isPending}
          accessibilityHint={t.buyHint(status.price, balance)}
          onPress={() =>
            buy.mutate(item.id, {
              onSuccess: (result) => {
                playSound('complete');
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                if (result.equipped === false) setStored(true);
                onBought?.();
              },
            })
          }
        />
        {qaReadOnly ? (
          <Text variant="caption" align="center">
            {t.previewBuy}
          </Text>
        ) : null}
        {short ? (
          <Text variant="caption" align="center">
            {t.short(status.price - balance)}
          </Text>
        ) : null}
        {buy.error ? <FormMessage tone="error" message={toUserMessage(buy.error)} /> : null}
        {combos}
      </View>
    );
  }
  if (status.kind !== 'locked') return null;
  if (status.reason === 'plus' || status.reason === 'referral') {
    return <ExclusiveSpotlight item={item} reason={status.reason} hint={status.hint} />;
  }
  return (
    <View style={styles.locked}>
      <Lock color={colors.textMuted} size={18} />
      <Text variant="bodyStrong" color="textMuted" style={styles.flex}>
        {status.hint}
      </Text>
    </View>
  );
}

/** Tarjeta destacada de un exclusivo: beneficio y requisito, con acceso a cómo conseguirlo. */
function ExclusiveSpotlight({
  item,
  reason,
  hint,
}: {
  item: CosmeticItem;
  reason: 'plus' | 'referral';
  hint: string;
}) {
  const styles = useStyles();
  const t = useStrings(cosmeticStrings);
  const name = t.name(item);
  const plus = reason === 'plus';
  return (
    <LinearGradient
      colors={
        plus
          ? ['rgba(139,92,246,0.45)', 'rgba(56,189,248,0.22)']
          : ['rgba(250,204,21,0.32)', 'rgba(139,92,246,0.22)']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.spotlight, plus ? styles.spotlightPlus : styles.spotlightGold]}
    >
      <View style={styles.spotlightHead}>
        {plus ? <Gem color="#C4B5FD" size={22} /> : <Crown color="#FACC15" size={22} />}
        <Text variant="heading" color="textStrong" style={styles.flex}>
          {plus ? t.plusExclusive : t.referralReward}
        </Text>
      </View>
      <Text color="text">{plus ? t.plusBody(name) : t.referralBody(name)}</Text>
      <Text variant="bodyStrong" color={plus ? 'primarySoft' : 'gold'}>
        {hint}
      </Text>
      <Button
        label={plus ? t.learnPlus : t.inviteFriends}
        variant="secondary"
        onPress={() => router.push(plus ? '/plus' : '/invite-friends')}
      />
    </LinearGradient>
  );
}

/**
 * Colección competitiva: los 8 marcos de rango. No se eligen: el "Marco de rango" muestra siempre
 * el de tu ELO actual. Los rangos alcanzados se ven encendidos; el resto, bloqueado.
 */
export function RankLadder({ rating }: { rating: number | null }) {
  const styles = useStyles();
  const t = useStrings(cosmeticStrings);
  const ranks = useRankLabels();
  const current = rating === null ? -1 : TIERS.findIndex((t) => t.id === getRank(rating).tier.id);
  return (
    <View style={styles.ladder}>
      <View style={styles.spotlightHead}>
        <Trophy color={colors.gold} size={20} />
        <Text variant="bodyStrong" color="textStrong" style={styles.flex}>
          {t.competitiveFrames}
        </Text>
      </View>
      <Text variant="caption">{t.competitiveBody}</Text>
      <View style={styles.ladderRow}>
        {TIERS.map((tier, i) => {
          const reached = i <= current;
          return (
            <View
              key={tier.id}
              style={styles.ladderCell}
              accessible
              accessibilityLabel={t.ladderA11y(ranks.tier(tier.id), reached, i === current)}
            >
              <Image
                source={RANK_FRAME_ART[tier.id].source}
                style={[styles.ladderArt, !reached && styles.ladderLocked]}
                resizeMode="contain"
                fadeDuration={0}
              />
              <Text
                variant="caption"
                color={i === current ? 'gold' : reached ? 'textStrong' : 'textMuted'}
                numberOfLines={1}
                style={styles.ladderName}
              >
                {ranks.tier(tier.id)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    tile: {
      width: '31.5%',
      alignItems: 'center',
      gap: 2,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      paddingHorizontal: spacing.xs,
      borderRadius: radii.lg,
      borderWidth: 2,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      minHeight: 150,
    },
    tileSelected: { backgroundColor: colors.surfaceRaised, ...elevation.glow },
    equipped: {
      position: 'absolute',
      top: spacing.xs,
      right: spacing.xs,
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.successStrong,
      borderWidth: 2,
      borderColor: colors.background,
    },
    lockBadge: {
      position: 'absolute',
      top: spacing.xs,
      right: spacing.xs,
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.overlay,
    },
    rarityBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
    art: { height: 72, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xxs },
    dim: { opacity: 0.55 },
    rarityLabel: { fontSize: 11, lineHeight: 14, fontWeight: '700' },
    swatch: { width: 72, height: 48, padding: 0, borderRadius: radii.md },
    missing: {
      borderRadius: radii.md,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
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
    chipRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
    tabular: { fontVariant: ['tabular-nums'] },
    pressed: { opacity: 0.8 },
    buy: { gap: spacing.xs },
    locked: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: 50,
      paddingHorizontal: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surfaceRaised,
    },
    spotlight: {
      gap: spacing.sm,
      padding: spacing.lg,
      borderRadius: radii.xl,
      borderWidth: 1.5,
      overflow: 'hidden',
    },
    spotlightPlus: { borderColor: 'rgba(167,139,250,0.7)' },
    spotlightGold: { borderColor: 'rgba(250,204,21,0.7)' },
    spotlightHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    ladder: {
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radii.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    ladderRow: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.sm },
    ladderCell: { width: '25%', alignItems: 'center', gap: 2 },
    ladderArt: { width: 60, height: 55 },
    ladderLocked: { opacity: 0.28 },
    ladderName: { fontSize: 11, lineHeight: 14 },
  }),
);
