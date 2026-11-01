import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Crown } from 'lucide-react-native';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { getRank, type RankInfo } from '@shared/ranking';

import { Card, RankEmblemForRating, Text, colors, gradients, spacing } from '@/design-system';

const FOX = {
  win: require('../../../../assets/images/fox-victory.jpg') as number,
  loss: require('../../../../assets/images/fox-defeat.jpg') as number,
};
const FOX_LABEL = {
  win: 'El zorro de Polygo festejando',
  loss: 'El zorro de Polygo, triste',
};
/** Color de la pantalla detrás del zorro: los bordes de la foto se funden hacia él. */
const FADE_TO = colors.background;
const FADE_FROM = 'rgba(11, 10, 26, 0)';

interface Props {
  outcome: 'win' | 'loss';
  /** null en partidas sin ELO (amistosos, abandono sin rating). */
  ratingBefore: number | null;
  ratingAfter: number | null;
  /** Si ya estaba posicionado: la primera victoria te posiciona en vez de «ascender». */
  placedBefore: boolean;
  subtitle: string | null;
}

/** Encabezado de victoria o derrota: título, el zorro (festejando o triste) y la división. */
export function ResultHero({ outcome, ratingBefore, ratingAfter, placedBefore, subtitle }: Props) {
  const win = outcome === 'win';
  const rated = ratingBefore !== null && ratingAfter !== null;
  const delta = rated ? ratingAfter - ratingBefore : 0;

  return (
    <View style={styles.wrap}>
      {win ? (
        <Animated.View entering={ZoomIn.springify().damping(9)} style={styles.crown}>
          <Crown color={colors.primaryBright} size={34} strokeWidth={2.2} />
        </Animated.View>
      ) : null}
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={[styles.titles, !win && styles.lossTitles]}
      >
        <Text variant="display" align="center" color="textStrong" style={styles.title}>
          {win ? '¡Victoria!' : 'Derrota'}
        </Text>
        {rated && delta !== 0 ? (
          <Text variant="title" align="center" color={delta > 0 ? 'primarySoft' : 'danger'}>
            {delta > 0 ? '+' : ''}
            {delta} ELO
          </Text>
        ) : null}
        {(subtitle ?? (win ? null : 'La próxima es tuya.')) ? (
          <Text color="textMuted" align="center">
            {subtitle ?? 'La próxima es tuya.'}
          </Text>
        ) : null}
      </Animated.View>

      <Animated.View entering={FadeIn.delay(150).duration(500)} style={styles.foxWrap}>
        <Image
          source={FOX[outcome]}
          style={styles.fox}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessibilityLabel={FOX_LABEL[outcome]}
        />
        {/* Bordes difuminados para que no se vea el cuadrado de la foto. */}
        <LinearGradient colors={[FADE_TO, FADE_FROM]} style={styles.fadeTop} pointerEvents="none" />
        <LinearGradient
          colors={[FADE_FROM, FADE_TO]}
          style={styles.fadeBottom}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[FADE_TO, FADE_FROM]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fadeLeft}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[FADE_FROM, FADE_TO]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fadeRight}
          pointerEvents="none"
        />
      </Animated.View>

      {rated && !placedBefore && !win ? (
        <Animated.View entering={FadeInUp.delay(250).duration(400)}>
          <Card style={styles.division} accessibilityLabel="Seguís sin posicionar">
            <RankEmblemForRating rating={ratingAfter} size={64} dimmed />
            <View style={styles.flex}>
              <Text variant="caption">Sin posicionar</Text>
              <Text variant="heading">Todavía sin rango</Text>
              <Text variant="caption">
                Ganá una partida para entrar al ranking en Bronce. Perder ahora no te resta.
              </Text>
            </View>
          </Card>
        </Animated.View>
      ) : rated ? (
        <>
          {placedBefore ? (
            <Animated.View entering={FadeInUp.delay(250).duration(400)}>
              <Card
                style={styles.elo}
                accessibilityLabel={`ELO anterior ${ratingBefore}, ELO actual ${ratingAfter}`}
              >
                <EloValue value={ratingBefore} label="ELO anterior" />
                <ArrowRight color={colors.textMuted} size={22} />
                <EloValue
                  value={ratingAfter}
                  label="ELO actual"
                  color={delta > 0 ? 'primarySoft' : delta < 0 ? 'danger' : 'textStrong'}
                />
              </Card>
            </Animated.View>
          ) : null}
          <Animated.View entering={FadeInUp.delay(350).duration(400)}>
            <DivisionProgress
              before={ratingBefore}
              after={ratingAfter}
              placedBefore={placedBefore}
            />
          </Animated.View>
        </>
      ) : null}
    </View>
  );
}

function EloValue({
  value,
  label,
  color = 'textStrong',
}: {
  value: number;
  label: string;
  color?: keyof typeof colors;
}) {
  return (
    <View style={styles.eloValue}>
      <Text variant="title" color={color} style={styles.tabular}>
        {value}
      </Text>
      <Text variant="caption">{label}</Text>
    </View>
  );
}

/**
 * Barra hacia la próxima división. Arranca donde estabas antes de la partida y va hasta donde
 * quedaste. Si cambiaste de división, primero llega al borde (lleno al subir, vacío al bajar)
 * y sigue desde el otro extremo en la división nueva.
 */
function DivisionProgress({
  before,
  after,
  placedBefore,
}: {
  before: number;
  after: number;
  placedBefore: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const rankBefore = getRank(before);
  const rankAfter = getRank(after);
  const promoted = placedBefore && rankAfter.stepMin > rankBefore.stepMin;
  const demoted = placedBefore && rankAfter.stepMin < rankBefore.stepMin;
  const start = placedBefore ? rankBefore.progress : 0;
  const fill = useSharedValue(reduceMotion ? rankAfter.progress : start);

  useEffect(() => {
    if (reduceMotion) return;
    const ease = { duration: 900, easing: Easing.out(Easing.cubic) };
    const edge = { duration: 600, easing: Easing.in(Easing.quad) };
    fill.value = withDelay(
      600,
      promoted || demoted
        ? withSequence(
            withTiming(promoted ? 1 : 0, edge),
            withTiming(promoted ? 0 : 1, { duration: 0 }),
            withTiming(rankAfter.progress, ease),
          )
        : withTiming(rankAfter.progress, ease),
    );
  }, [fill, promoted, demoted, rankAfter.progress, reduceMotion]);

  const barStyle = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  const heading = !placedBefore
    ? 'Te posicionaste en'
    : promoted
      ? 'Ascendiste a'
      : demoted
        ? 'Bajaste a'
        : 'Tu división';

  return (
    <Card
      style={[styles.division, promoted && styles.promoted, demoted && styles.demoted]}
      accessibilityLabel={`${heading} ${rankAfter.label}. ${nextLabel(rankAfter, after)}`}
    >
      <RankEmblemForRating rating={after} size={64} />
      <View style={styles.flex}>
        <Text variant="caption">{heading}</Text>
        <Text
          variant="title"
          color={promoted || !placedBefore ? 'primarySoft' : demoted ? 'danger' : 'textStrong'}
        >
          {rankAfter.label}
        </Text>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, barStyle]}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text variant="caption">{nextLabel(rankAfter, after)}</Text>
      </View>
    </Card>
  );
}

/** «Faltan 38 ELO para Bronce II», o el tope si no hay más divisiones. */
function nextLabel(rank: RankInfo, rating: number) {
  if (rank.nextStepMin === null) return 'Estás en la cima del ranking.';
  const next = getRank(rank.nextStepMin).label;
  return `Faltan ${Math.max(1, rank.nextStepMin - Math.floor(rating))} ELO para ${next}`;
}

const BAR = 10;

const styles = StyleSheet.create({
  wrap: { gap: spacing.md, alignItems: 'stretch' },
  crown: { alignSelf: 'center', marginTop: spacing.sm },
  titles: { alignItems: 'center', gap: spacing.xxs },
  lossTitles: { marginTop: spacing.lg },
  title: { fontSize: 40, lineHeight: 46 },
  foxWrap: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 340,
    aspectRatio: 1,
    marginVertical: -spacing.md,
  },
  fox: { width: '100%', height: '100%' },
  fadeTop: { position: 'absolute', left: 0, right: 0, top: 0, height: '15%' },
  fadeBottom: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '30%' },
  fadeLeft: { position: 'absolute', top: 0, bottom: 0, left: 0, width: '15%' },
  fadeRight: { position: 'absolute', top: 0, bottom: 0, right: 0, width: '15%' },
  elo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
  },
  eloValue: { alignItems: 'center', gap: spacing.xxs },
  tabular: { fontVariant: ['tabular-nums'] },
  division: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  promoted: { borderColor: colors.primaryBright },
  demoted: { borderColor: colors.dangerStrong },
  flex: { flex: 1, gap: spacing.xxs },
  track: {
    height: BAR,
    borderRadius: BAR / 2,
    backgroundColor: colors.surfaceHighlight,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  fill: { height: '100%', borderRadius: BAR / 2, overflow: 'hidden' },
});
