import { router } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { flagEmoji } from '@shared/profile';
import { getRank, isPlaced } from '@shared/ranking';

import {
  Card,
  ProgressBar,
  RankEmblem,
  TIER_COLORS,
  Text,
  colors,
  gradients,
  spacing,
} from '@/design-system';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { ProfileBackdrop } from '@/features/cosmetics/ProfileBackdrop';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';
import type { PlayerRatingRow, ProfileRow } from '@/lib/database.types';

/** Encabezado del perfil propio: avatar editable con su marco, nombre con bandera y tarjeta de rango, sobre el fondo elegido. */
export function ProfileHeader({
  profile,
  rating,
}: {
  profile: ProfileRow;
  rating: PlayerRatingRow | null;
}) {
  const flag = flagEmoji(profile.region);
  return (
    <ProfileBackdrop backgroundId={profile.background_id} style={styles.row}>
      <View style={styles.identity}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar perfil"
          onPress={() => router.push('/edit-profile')}
          style={styles.avatarWrap}
        >
          <FramedAvatar
            avatarId={profile.avatar_id}
            photoUrl={avatarPhotoUrl(profile.avatar_path)}
            size={92}
            frameId={profile.frame_id}
            fallbackRing={colors.primary}
          />
          <View style={styles.pencil}>
            <Pencil color={colors.textStrong} size={14} strokeWidth={2.5} />
          </View>
        </Pressable>
        <View style={styles.nameRow}>
          <Text variant="title" numberOfLines={1} style={styles.name}>
            {profile.display_name ?? profile.username}
          </Text>
          {flag ? (
            <Text style={styles.flag} accessibilityLabel={`País: ${profile.region}`}>
              {flag}
            </Text>
          ) : null}
        </View>
        <Text color="textMuted">@{profile.username}</Text>
      </View>
      {rating ? <RankMini rating={rating} /> : null}
    </ProfileBackdrop>
  );
}

function RankMini({ rating }: { rating: PlayerRatingRow }) {
  const placement = !isPlaced(rating);
  const rank = getRank(rating.rating);
  const tier = TIER_COLORS[rank.tier.id];
  return (
    <Card
      gradient={gradients.ranked}
      style={styles.rank}
      onPress={() => router.push('/leaderboard')}
      accessibilityLabel={
        placement
          ? 'Sin posicionar: ganá una partida ranked para entrar al ranking'
          : `${rank.label}, ${rating.rating} ELO`
      }
    >
      <RankEmblem tier={rank.tier.id} division={rank.division} size={68} dimmed={placement} />
      <Text
        variant="bodyStrong"
        align="center"
        style={{ color: placement ? colors.text : tier.light }}
      >
        {placement ? 'Sin posicionar' : rank.label}
      </Text>
      <Text variant="caption" color="text">
        {placement ? 'Ganá una ranked' : `${rating.rating} ELO`}
      </Text>
      <View style={styles.rankBar}>
        <ProgressBar
          value={placement ? 0 : rank.progress}
          colors={placement ? undefined : [tier.light, tier.dark]}
          accessibilityLabel="Progreso al siguiente rango"
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch', gap: spacing.md },
  identity: { flex: 1.1, gap: spacing.xxs, justifyContent: 'center' },
  avatarWrap: { alignSelf: 'flex-start', marginBottom: spacing.sm },
  pencil: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 2,
    borderColor: colors.background,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { flexShrink: 1 },
  flag: { fontSize: 22, lineHeight: 28 },
  rank: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xxs },
  rankBar: { alignSelf: 'stretch', marginTop: spacing.xs },
});
