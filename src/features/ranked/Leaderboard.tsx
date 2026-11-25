import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Crown, Trophy } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { getRank } from '@shared/ranking';

import {
  RankEmblemForRating,
  TIER_COLORS,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { useInterfaceLanguage, useStrings } from '@/i18n';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

import type { LeaderboardEntry } from './api';
import { rankedStrings, rankLabelForRating } from './strings';

/** Oro, plata y bronce: medalla, borde y brillo de las tres primeras filas. */
const MEDALS = [
  { light: '#FFE58A', mid: '#F5C542', dark: '#A8740F', glow: 'rgba(245, 197, 66, 0.22)' },
  { light: '#F4F7FC', mid: '#C9D1DE', dark: '#6B7487', glow: 'rgba(201, 209, 222, 0.16)' },
  { light: '#F6C29A', mid: '#D9905F', dark: '#7A4122', glow: 'rgba(217, 144, 95, 0.18)' },
] as const;

/** Sólo las primeras filas entran animadas: el resto aparece directo (lista de hasta 100). */
const ANIMATED_ROWS = 14;

function openPlayer(entry: LeaderboardEntry, isMe: boolean) {
  if (isMe) router.navigate('/profile');
  else router.push({ pathname: '/player/[id]', params: { id: entry.userId } });
}

/** «Top 4 %» a partir del puesto; mínimo 1 %. */
export function topPercent(position: number, total: number): number {
  if (total <= 0) return 100;
  return Math.max(1, Math.ceil((position / total) * 100));
}

/** Idioma del rating de la fila (bandera + nombre). */
export interface RowLanguage {
  flag: string;
  name: string;
}

/**
 * Una fila de la clasificación: puesto, nombre, idioma de ese rating y rango en ese idioma (con su
 * ELO). Las tres primeras llevan medalla y brillo; la propia va resaltada en violeta.
 */
function LeaderboardRowBase({
  entry,
  isMe,
  language,
  index = 0,
  animate = false,
  pinned = false,
}: {
  entry: LeaderboardEntry;
  isMe: boolean;
  language?: RowLanguage;
  /** Orden en la lista (para escalonar la entrada). */
  index?: number;
  /** Entrada animada (sólo la primera carga de la lista). */
  animate?: boolean;
  /** Fila propia fija abajo (sin animación de entrada). */
  pinned?: boolean;
}) {
  const styles = useStyles();
  const t = useStrings(rankedStrings);
  const ui = useInterfaceLanguage();
  const rank = getRank(entry.rating);
  const rankName = rankLabelForRating(entry.rating, ui);
  const tierColor = TIER_COLORS[rank.tier.id];
  const medal = entry.position <= 3 ? MEDALS[entry.position - 1] : undefined;

  const row = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.rowA11y(
        entry.position,
        entry.username,
        language?.name,
        rankName,
        entry.rating,
      )}
      accessibilityHint={t.openProfileHint}
      onPress={() => openPlayer(entry, isMe)}
      style={({ pressed }) => [
        styles.row,
        medal && { borderColor: medal.mid },
        isMe && styles.rowMe,
        pinned && styles.rowPinned,
        pressed && styles.pressed,
      ]}
    >
      {medal ? (
        <LinearGradient
          colors={[medal.glow, 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0.75, y: 0.5 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}

      <Position position={entry.position} isMe={isMe} />

      <View style={styles.avatar}>
        <FramedAvatar
          avatarId={entry.avatarId}
          photoUrl={avatarPhotoUrl(entry.avatarPath)}
          size={entry.frameId ? 34 : 40}
          frameId={entry.frameId}
          rating={entry.rating}
        />
      </View>

      <View style={styles.player}>
        <View style={styles.nameLine}>
          <Text
            variant="bodyStrong"
            color="textStrong"
            numberOfLines={1}
            style={[styles.name, medal && styles.nameTop]}
          >
            {entry.username}
          </Text>
          {isMe ? (
            <View style={styles.youTag}>
              <Text style={styles.youText}>{t.you.toUpperCase()}</Text>
            </View>
          ) : null}
        </View>
        {language ? (
          <View style={styles.languageLine}>
            <Text style={styles.flag}>{language.flag}</Text>
            <Text variant="caption" color="textMuted" numberOfLines={1} style={styles.shrink}>
              {language.name}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.rank}>
        <View style={styles.rankText}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.rankName, { color: tierColor.light }]}
          >
            {rankName}
          </Text>
          <View style={styles.eloLine}>
            <Trophy color={colors.gold} size={12} strokeWidth={2.6} />
            <Text style={styles.elo}>{entry.rating}</Text>
          </View>
        </View>
        <RankEmblemForRating rating={entry.rating} size={40} />
      </View>
    </Pressable>
  );

  if (!animate || pinned || index >= ANIMATED_ROWS) return row;
  return (
    <Animated.View entering={FadeInDown.delay(index * 35).duration(320).springify().damping(18)}>
      {row}
    </Animated.View>
  );
}

/** Puesto: medalla para el podio (con corona el 1.º), número grande para el resto. */
function Position({ position, isMe }: { position: number; isMe: boolean }) {
  const styles = useStyles();
  const medal = position <= 3 ? MEDALS[position - 1] : undefined;
  if (medal) {
    return (
      <View style={styles.position}>
        {position === 1 ? (
          <View style={styles.crown} pointerEvents="none">
            <Crown color={medal.mid} fill={medal.mid} size={14} />
          </View>
        ) : null}
        <LinearGradient
          colors={[medal.light, medal.mid, medal.dark]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.medal}
        >
          <Text style={styles.medalText}>{position}</Text>
        </LinearGradient>
      </View>
    );
  }
  return (
    <View style={styles.position}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.positionText, isMe && styles.positionMe]}
      >
        {position}
      </Text>
    </View>
  );
}

export const LeaderboardRow = memo(LeaderboardRowBase);

const useStyles = themedStyles(() =>
  StyleSheet.create({
    pressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
    shrink: { flexShrink: 1 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: 64,
      paddingVertical: spacing.sm,
      paddingLeft: spacing.xs,
      paddingRight: spacing.sm,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    rowMe: {
      backgroundColor: colors.surfaceHighlight,
      borderWidth: 2,
      borderColor: colors.primaryBright,
    },
    // Fila propia fija abajo: sombra violeta para que se despegue de la lista.
    rowPinned: {
      shadowColor: colors.primaryBright,
      shadowOpacity: 0.45,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 0 },
      elevation: 8,
    },
    position: { width: 36, alignItems: 'center', justifyContent: 'center' },
    positionText: {
      fontSize: 18,
      lineHeight: 22,
      fontWeight: '900',
      color: colors.textMuted,
      fontVariant: ['tabular-nums'],
    },
    positionMe: { color: colors.primaryBright },
    medal: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.55)',
    },
    medalText: {
      fontSize: 17,
      lineHeight: 21,
      fontWeight: '900',
      color: '#2A1A00',
      fontVariant: ['tabular-nums'],
    },
    crown: { position: 'absolute', top: -9, zIndex: 1 },
    // Caja fija: con o sin marco, los nombres quedan alineados.
    avatar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    player: { flex: 1, gap: 2 },
    nameLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    name: { flexShrink: 1, fontSize: 16, lineHeight: 21 },
    nameTop: { fontWeight: '800' },
    youTag: {
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: radii.pill,
      backgroundColor: colors.primary,
    },
    youText: { fontSize: 10, lineHeight: 14, fontWeight: '900', color: colors.onPrimary },
    languageLine: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    flag: { fontSize: 13, lineHeight: 16 },
    rank: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, maxWidth: '40%' },
    rankText: { alignItems: 'flex-end', flexShrink: 1 },
    rankName: { fontSize: 14, lineHeight: 18, fontWeight: '900' },
    eloLine: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    elo: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '800',
      color: colors.gold,
      fontVariant: ['tabular-nums'],
    },
  }),
);
