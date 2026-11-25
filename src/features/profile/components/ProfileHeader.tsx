import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Gem, Info, Pencil } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { flagEmoji } from '@shared/profile';
import { getRank, isPlaced } from '@shared/ranking';
import { BADGES } from '@shared/referrals';

import {
  BrandCard,
  ProgressBar,
  RankEmblem,
  TIER_COLORS,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { useProfileFlair } from '@/features/cosmetics/api';
import { FramedAvatar, frameArt } from '@/features/cosmetics/FramedAvatar';
import { ProfileBackdrop } from '@/features/cosmetics/ProfileBackdrop';
import { useRankLabels } from '@/features/ranked/rankNames';
import { useStrings } from '@/i18n';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';
import type { ProfileRow } from '@/lib/database.types';

import { headerStrings } from '../strings';

/** Lo que el encabezado necesita: sirve el perfil propio y el público de otro jugador. */
export type HeaderProfile = Pick<ProfileRow, 'username' | 'display_name' | 'avatar_id'> & {
  /** Para las insignias (Plus, invitaciones). */
  id?: string;
  avatar_path?: string | null;
  frame_id?: string | null;
  background_id?: string | null;
  region?: string | null;
};

/** Rating y victorias (posicionado = ganó alguna ranked). */
export interface HeaderRating {
  rating: number;
  wins: number;
}

/**
 * Encabezado de perfil: avatar con su marco, nombre con bandera y tarjeta de rango, sobre el fondo
 * elegido. Es el mismo para el perfil propio y el de otro jugador (`readonly`: sin editar).
 * Con `preview` es la vista previa de Editar perfil: sin toques y con la foto que se está eligiendo
 * (`photoUrl`).
 * `footer` va dentro de la tarjeta, debajo de la identidad (el perfil propio pone ahí el nivel y la
 * barra de XP). Los fondos son siempre oscuros: el texto de la tarjeta usa colores claros fijos, así
 * se lee igual en tema claro y oscuro.
 */
export function ProfileHeader({
  profile,
  rating,
  preview,
  photoUrl,
  readonly,
  showRank = true,
  footer,
  subtitle,
}: {
  profile: HeaderProfile;
  rating: HeaderRating | null;
  preview?: boolean;
  photoUrl?: string | null;
  /** Perfil de otro jugador: el avatar no lleva a Editar perfil. */
  readonly?: boolean;
  /** Tarjeta de rango debajo (la vista previa de Personalizar la omite). */
  showRank?: boolean;
  /** Contenido extra dentro de la tarjeta, debajo de la identidad. */
  footer?: ReactNode;
  /**
   * Línea debajo del nombre en lugar de «@usuario» (el perfil propio pone el título por nivel). Sin
   * definir, se muestra el @usuario como siempre; `null` no muestra nada. El username sigue siendo el
   * mismo dato: sólo deja de repetirse en la tarjeta.
   */
  subtitle?: ReactNode;
}) {
  const styles = useStyles();
  const t = useStrings(headerStrings);
  const flag = flagEmoji(profile.region);
  const flair = useProfileFlair(profile.id);
  const badges = flair.data?.badges ?? [];
  // Aura dorada: recompensa máxima de invitaciones (10 amigos válidos).
  const aura = badges.includes('elite_inviter');
  const editable = !preview && !readonly;
  const rankRating = rating?.wins ? rating.rating : null;
  // Un marco en imagen ocupa más que el aro liso: el avatar se achica un poco para que entre al lado
  // del nombre también en teléfonos angostos.
  const imageFrame = frameArt(profile.frame_id, rankRating) !== null;
  const narrow = useWindowDimensions().width < 360;
  const avatarSize = (imageFrame ? 92 : 100) - (narrow ? 16 : 0);
  const avatar = (
    <View>
      {aura ? <View style={styles.aura} pointerEvents="none" /> : null}
      <FramedAvatar
        avatarId={profile.avatar_id}
        photoUrl={photoUrl !== undefined ? photoUrl : avatarPhotoUrl(profile.avatar_path)}
        size={avatarSize}
        frameId={profile.frame_id}
        rating={rankRating}
        fallbackRing={colors.primary}
        instant={preview}
        animated
      />
    </View>
  );
  const plus = flair.data?.plus === true;
  return (
    <View style={styles.stack}>
      <ProfileBackdrop backgroundId={profile.background_id} style={styles.identityCard}>
        <View style={styles.identityRow}>
          {editable ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.customizeA11y}
              onPress={() => router.push('/edit-profile')}
            >
              {avatar}
            </Pressable>
          ) : (
            avatar
          )}
          <View style={styles.identity}>
            <View style={styles.nameRow}>
              <Text variant="title" numberOfLines={1} style={[styles.name, styles.onDark]}>
                {profile.display_name ?? profile.username}
              </Text>
              {flag ? (
                <Text style={styles.flag} accessibilityLabel={t.countryA11y(profile.region ?? '')}>
                  {flag}
                </Text>
              ) : null}
              {editable ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t.editProfile}
                  hitSlop={8}
                  onPress={() => router.push('/edit-profile')}
                  style={({ pressed }) => [styles.pencil, pressed && styles.pressed]}
                >
                  <Pencil color={colors.textStrong} size={16} strokeWidth={2.5} />
                </Pressable>
              ) : null}
            </View>
            {subtitle !== undefined ? subtitle : null}
            {subtitle === undefined ? (
              <Text style={styles.onDarkMuted} numberOfLines={1}>
                @{profile.username}
              </Text>
            ) : null}
            {plus || badges.length > 0 ? (
              <View style={styles.badges}>
                {plus ? <PlusBadge /> : null}
                {badges.map((b) => (
                  <View
                    key={b}
                    style={[styles.badge, b === 'elite_inviter' && styles.badgeElite]}
                    accessibilityLabel={t.badgeA11y(t.badgeName(b, BADGES[b].name))}
                  >
                    <Text
                      variant="caption"
                      style={b === 'elite_inviter' ? styles.onDarkGold : styles.onDark}
                      numberOfLines={1}
                    >
                      {t.badgeName(b, BADGES[b].name)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ProfileBackdrop>
      {rating && showRank ? <RankSummaryCard rating={rating} interactive={!preview} /> : null}
    </View>
  );
}

/**
 * Insignia de PolyGo Plus: diamante sobre el violeta-celeste del marco Plus. Identidad, no ventaja:
 * se muestra sólo si el servidor confirma Plus activo.
 */
function PlusBadge() {
  const styles = useStyles();
  const t = useStrings(headerStrings);
  return (
    <LinearGradient
      colors={['#8B5CF6', '#6366F1', '#38BDF8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.plusBadge}
      accessible
      accessibilityLabel={t.plusSubscriber}
    >
      <Gem color="#FFFFFF" size={12} />
      <Text variant="caption" color="onPrimary" style={styles.plusText}>
        PLUS
      </Text>
    </LinearGradient>
  );
}

/**
 * Rango competitivo actual: emblema del tier, liga y ELO real, con el progreso al siguiente escalón.
 * Toca para abrir la clasificación.
 */
export function RankSummaryCard({
  rating,
  interactive,
}: {
  rating: HeaderRating;
  interactive: boolean;
}) {
  const styles = useStyles();
  const t = useStrings(headerStrings);
  const ranks = useRankLabels();
  const placement = !isPlaced(rating);
  const rank = getRank(rating.rating);
  const tier = TIER_COLORS[rank.tier.id];
  // Próximo escalón (división o tier) y cuánto ELO falta: el objetivo competitivo inmediato.
  const next = rank.nextStepMin !== null ? getRank(rank.nextStepMin) : null;
  const toNext = rank.nextStepMin !== null ? Math.max(0, rank.nextStepMin - rating.rating) : 0;
  const narrow = useWindowDimensions().width < 360;
  return (
    <BrandCard
      onPress={interactive ? () => router.push('/leaderboard') : undefined}
      accessibilityLabel={
        placement
          ? t.unplacedA11y
          : t.rankA11y(ranks.label(rank), rating.rating, next ? ranks.label(next) : null, toNext)
      }
      contentStyle={styles.rankCard}
    >
      <RankEmblem
        tier={rank.tier.id}
        division={rank.division}
        size={narrow ? 52 : 60}
        dimmed={placement}
      />
      <View style={styles.rankInfo}>
        <View style={styles.rankTop}>
          <Text
            variant="heading"
            numberOfLines={1}
            style={[styles.rankName, { color: placement ? colors.text : tier.light }]}
          >
            {placement ? t.unplaced : ranks.label(rank)}
          </Text>
          <View style={styles.eloRow}>
            <Text variant="title" color="textStrong" style={styles.tabular}>
              {placement ? '–' : rating.rating}
            </Text>
            <Text variant="caption" color="primarySoft" style={styles.eloUnit}>
              ELO
            </Text>
          </View>
        </View>
        <Text variant="caption" color="text" numberOfLines={2} style={styles.rankHint}>
          {placement ? t.winARanked : next ? t.toNext(toNext, ranks.label(next)) : t.maxRank}
        </Text>
        <ProgressBar
          value={placement ? 0 : rank.progress}
          colors={placement ? undefined : [tier.light, tier.dark]}
          accessibilityLabel={t.rankProgress}
        />
      </View>
      {interactive ? <Info color={colors.textMuted} size={16} style={styles.info} /> : null}
    </BrandCard>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    stack: { gap: spacing.md },
    identityCard: { gap: spacing.sm },
    identityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    footer: {
      padding: spacing.sm,
      borderRadius: radii.lg,
      backgroundColor: 'rgba(12, 8, 32, 0.55)',
      borderWidth: 1,
      borderColor: 'rgba(196, 181, 253, 0.28)',
    },
    // Texto sobre el fondo del perfil (siempre oscuro), igual en ambos temas.
    onDark: { color: '#FFFFFF' },
    onDarkMuted: { color: '#C4B5FD' },
    onDarkGold: { color: '#FACC15' },
    identity: { flex: 1, gap: spacing.xs, justifyContent: 'center' },
    pressed: { opacity: 0.75 },
    pencil: {
      width: 32,
      height: 32,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.inset,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    tabular: { fontVariant: ['tabular-nums'] },
    rankCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    rankInfo: { flex: 1, minWidth: 0, gap: spacing.xxs },
    rankTop: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: spacing.sm,
      paddingRight: spacing.lg,
    },
    rankName: { flex: 1, fontSize: 19, lineHeight: 25 },
    rankHint: { lineHeight: 17 },
    eloUnit: { fontWeight: '800' },
    info: { position: 'absolute', top: spacing.sm, right: spacing.sm },
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xxs },
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: 'rgba(139,92,246,0.28)',
      borderWidth: 1,
      borderColor: 'rgba(196,181,253,0.5)',
    },
    badgeElite: { backgroundColor: 'rgba(250,204,21,0.16)', borderColor: 'rgba(250,204,21,0.7)' },
    plusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: 999,
    },
    plusText: { fontWeight: '800', letterSpacing: 1 },
    aura: {
      position: 'absolute',
      left: '10%',
      right: '10%',
      top: '6%',
      bottom: '14%',
      borderRadius: 999,
      backgroundColor: 'rgba(250,204,21,0.22)',
      shadowColor: '#FACC15',
      shadowOpacity: 0.95,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 0 },
      elevation: 12,
    },
    name: { flexShrink: 1 },
    flag: { fontSize: 22, lineHeight: 28 },
    eloRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  }),
);
