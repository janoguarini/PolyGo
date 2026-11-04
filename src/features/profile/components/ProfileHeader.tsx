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
  spacing,
} from '@/design-system';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { ProfileBackdrop } from '@/features/cosmetics/ProfileBackdrop';
import { Laurels } from '@/features/profile/components/Laurels';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';
import type { PlayerRatingRow, ProfileRow } from '@/lib/database.types';

/**
 * Encabezado del perfil propio: avatar editable con su marco, nombre con bandera y tarjeta de rango,
 * sobre el fondo elegido. Con `preview` es la vista previa de Editar perfil: sin toques y con la
 * foto que se está eligiendo (`photoUrl`).
 */
export function ProfileHeader({
  profile,
  rating,
  preview,
  photoUrl,
}: {
  profile: ProfileRow;
  rating: PlayerRatingRow | null;
  preview?: boolean;
  photoUrl?: string | null;
}) {
  const flag = flagEmoji(profile.region);
  const avatar = (
    <FramedAvatar
      avatarId={profile.avatar_id}
      photoUrl={photoUrl !== undefined ? photoUrl : avatarPhotoUrl(profile.avatar_path)}
      size={92}
      frameId={profile.frame_id}
      fallbackRing={colors.primary}
      instant={preview}
    />
  );
  return (
    <ProfileBackdrop backgroundId={profile.background_id} style={styles.row}>
      <View style={styles.identity}>
        {preview ? (
          <View style={styles.avatarWrap}>{avatar}</View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar perfil"
            onPress={() => router.push('/edit-profile')}
            style={styles.avatarWrap}
          >
            {avatar}
            <View style={styles.pencil}>
              <Pencil color={colors.textStrong} size={14} strokeWidth={2.5} />
            </View>
          </Pressable>
        )}
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
      {rating ? (
        <RankMini rating={rating} interactive={!preview} />
      ) : null}
    </ProfileBackdrop>
  );
}

/** Rango sobre el fondo del perfil (sin caja propia), con el emblema entre dos ramas de laurel. */
function RankMini({ rating, interactive }: { rating: PlayerRatingRow; interactive: boolean }) {
  const placement = !isPlaced(rating);
  const rank = getRank(rating.rating);
  const tier = TIER_COLORS[rank.tier.id];
  const card = (
    <Card
      style={styles.rank}
      onPress={interactive ? () => router.push('/leaderboard') : undefined}
      accessibilityLabel={
        placement
          ? 'Sin posicionar: ganá una partida ranked para entrar al ranking'
          : `${rank.label}, ${rating.rating} ELO`
      }
    >
      <Laurels size={76}>
        <RankEmblem tier={rank.tier.id} division={rank.division} size={76} dimmed={placement} />
      </Laurels>
      <Text
        variant="heading"
        align="center"
        numberOfLines={1}
        style={{ color: placement ? colors.text : tier.light }}
      >
        {placement ? 'Sin posicionar' : rank.label}
      </Text>
      {placement ? (
        <Text variant="caption" color="text">
          Ganá una ranked
        </Text>
      ) : (
        <View style={styles.eloRow}>
          <Text variant="heading" color="textStrong">
            {rating.rating}
          </Text>
          <Text variant="bodyStrong" color="text">
            ELO
          </Text>
        </View>
      )}
      <View style={styles.rankBar}>
        <ProgressBar
          value={placement ? 0 : rank.progress}
          colors={placement ? undefined : [tier.light, tier.dark]}
          accessibilityLabel="Progreso al siguiente rango"
        />
      </View>
    </Card>
  );
  // Tocable, Card la envuelve en un Pressable; la vista previa usa un View igual para medir lo mismo.
  return interactive ? card : <View>{card}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch', gap: spacing.md },
  identity: { flex: 1, gap: spacing.xxs, justifyContent: 'center' },
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
  rank: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xs,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  eloRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  rankBar: { alignSelf: 'stretch', marginTop: spacing.xs },
});
