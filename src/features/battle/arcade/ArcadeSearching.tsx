import { LinearGradient } from 'expo-linear-gradient';
import { Timer } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { getRank, isPlaced } from '@shared/ranking';

import { RankEmblem, TIER_COLORS } from '@/design-system';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { useMyProfile } from '@/features/profile/hooks';
import { useRankLabels } from '@/features/ranked/strings';
import { useInterfaceLanguage, useStrings } from '@/i18n';
import { languageName } from '@/i18n/languages';
import { battleScreenStrings } from '@/i18n/screens/battle';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

import { arcadeStrings } from './strings';
import { ARCADE_TOUCH, arcade, arcadeRadii, arcadeText } from './theme';

const AVATAR = 84;
const RADAR = 220;
const RINGS = [0, 1, 2] as const;
const PULSE_MS = 2_400;

/**
 * Buscando rival en Ranked: la misma identidad oscura que el lobby y la partida. Tu perfil en el
 * centro de un radar, tu rango con sus colores, el tiempo de espera y el modo (Word Rush, 60 s).
 */
export function ArcadeSearching({
  waitedMs,
  durationMs = 60_000,
  onCancel,
}: {
  waitedMs: number;
  durationMs?: number;
  onCancel: () => void;
}) {
  const t = useStrings(battleScreenStrings);
  const a = useStrings(arcadeStrings);
  const ui = useInterfaceLanguage();
  const data = useMyProfile().data;
  const profile = data?.profile;
  const rating = data?.rating;

  const mm = Math.floor(waitedMs / 60_000);
  const ss = String(Math.floor(waitedMs / 1000) % 60).padStart(2, '0');
  const seconds = Math.round(durationMs / 1000);
  const language = profile?.target_language ? languageName(profile.target_language, ui) : null;

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <View style={styles.radar} accessibilityElementsHidden importantForAccessibility="no">
          {RINGS.map((i) => (
            <Ring key={i} index={i} />
          ))}
          <View style={styles.core} />
          <FramedAvatar
            avatarId={profile?.avatar_id}
            photoUrl={avatarPhotoUrl(profile?.avatar_path)}
            size={profile?.frame_id ? AVATAR - 10 : AVATAR}
            frameId={profile?.frame_id}
            rating={rating?.rating}
          />
        </View>
        {rating ? <RankBadge rating={rating.rating} placed={isPlaced(rating)} /> : null}
      </View>

      <View style={styles.status} accessibilityLiveRegion="polite">
        <Text style={arcadeText.title}>{t.searching}</Text>
        <Text style={styles.timer} accessibilityLabel={t.waitingA11y(mm, ss)}>
          {mm}:{ss}
        </Text>
        <Text style={styles.sub}>{t.searchingSub(language)}</Text>
      </View>

      <View style={styles.modeRow}>
        <Text style={styles.mode}>{a.modeName}</Text>
        <View style={styles.duration}>
          <Timer color={arcade.gold} size={14} />
          <Text style={styles.durationText}>{a.durationChip(seconds)}</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onCancel}
        style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
      >
        <Text style={styles.cancelText}>{t.cancelSearch}</Text>
      </Pressable>
    </View>
  );
}

/**
 * Tu rango como en un juego competitivo: emblema, nombre del rango y ELO sobre los colores del tier
 * (bronce, plata, oro…), con brillo del mismo color. Sin posicionar, el emblema va apagado.
 */
function RankBadge({ rating, placed }: { rating: number; placed: boolean }) {
  const ranks = useRankLabels();
  const rank = getRank(rating);
  const tier = TIER_COLORS[rank.tier.id];
  const label = placed ? ranks.label(rank) : ranks.unplaced;
  return (
    <View
      style={[styles.badgeGlow, { shadowColor: tier.light }]}
      accessible
      accessibilityLabel={`${label}, ${rating} ELO`}
    >
      <LinearGradient
        colors={[`${tier.dark}F2`, '#140B26']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.badge, { borderColor: tier.light }]}
      >
        <RankEmblem tier={rank.tier.id} division={rank.division} size={40} dimmed={!placed} />
        <View style={styles.badgeText}>
          <Text style={[styles.rankName, { color: tier.accent }]} numberOfLines={1}>
            {label}
          </Text>
          <Text style={styles.elo}>
            {rating}
            <Text style={[styles.eloUnit, { color: tier.light }]}> ELO</Text>
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

/** Un aro del radar: crece y se desvanece; los tres van desfasados. Quieto con «reducir movimiento». */
function Ring({ index }: { index: number }) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? 0.35 + index * 0.3 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    progress.value = withDelay(
      (index * PULSE_MS) / RINGS.length,
      withRepeat(withTiming(1, { duration: PULSE_MS, easing: Easing.out(Easing.quad) }), -1),
    );
  }, [index, progress, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0.5 - index * 0.12 : 0.65 * (1 - progress.value),
    transform: [{ scale: 0.45 + 0.55 * progress.value }],
  }));

  return <Animated.View style={[styles.ring, style]} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', gap: 26, paddingBottom: 8 },
  hero: { alignItems: 'center', gap: 14 },
  radar: { width: RADAR, height: RADAR, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: RADAR,
    height: RADAR,
    borderRadius: RADAR / 2,
    borderWidth: 2,
    borderColor: arcade.violetGlow,
  },
  core: {
    position: 'absolute',
    width: AVATAR + 36,
    height: AVATAR + 36,
    borderRadius: (AVATAR + 36) / 2,
    backgroundColor: arcade.card,
    borderWidth: 1,
    borderColor: arcade.border,
  },
  badgeGlow: {
    borderRadius: arcadeRadii.pill,
    shadowOpacity: 0.55,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 8,
    paddingRight: 20,
    paddingVertical: 6,
    borderRadius: arcadeRadii.pill,
    borderWidth: 1.5,
  },
  badgeText: { gap: 0 },
  rankName: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  elo: {
    color: arcade.text,
    fontSize: 22,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  eloUnit: { fontSize: 14, fontWeight: '800' },
  status: { alignItems: 'center', gap: 4 },
  timer: {
    color: arcade.text,
    fontSize: 40,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  sub: { color: arcade.muted, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  modeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  mode: { color: arcade.text, fontSize: 22, fontWeight: '900' },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: arcadeRadii.pill,
    backgroundColor: arcade.cardRaised,
  },
  durationText: { color: arcade.gold, fontSize: 13, fontWeight: '800' },
  cancel: {
    minHeight: ARCADE_TOUCH,
    borderRadius: arcadeRadii.pill,
    borderWidth: 1.5,
    borderColor: arcade.danger,
    backgroundColor: 'rgba(255, 77, 109, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.75 },
  cancelText: { color: arcade.danger, fontSize: 16, fontWeight: '800' },
});
