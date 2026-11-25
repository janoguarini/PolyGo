import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Crown } from 'lucide-react-native';
import { useContext, useEffect } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
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
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { getRank, type RankInfo } from '@shared/ranking';

import {
  Card,
  RankEmblemForRating,
  Text,
  colors,
  gradients,
  spacing,
  themedStyles,
} from '@/design-system';
import { foxDefeat, foxVictory } from '@/design-system/imageData.generated';
import { useRankLabels } from '@/features/ranked/strings';
import { useStrings } from '@/i18n';

import { battleStrings } from '../strings';

// Incrustadas en el bundle (scripts/build-image-data.ts): aparecen al instante.
const FOX = { win: foxVictory, loss: foxDefeat };
const FOX_LABEL = { win: 'foxWin', loss: 'foxLoss' } as const;
/** Color de la pantalla detrás del zorro: los bordes de la foto se funden hacia él. */
/** Desvanecido hacia el fondo del tema (y el mismo color transparente, sin halo gris). */
const fadeTo = () => colors.background;
const fadeFrom = () => {
  const hex = colors.background.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, 0)`;
};

/**
 * Alto que necesita el resto del resultado para que la tarjeta de rango SIEMPRE se vea completa sin
 * scrollear: barra superior, corona, título, ELO, subtítulo, la tarjeta «ELO anterior → actual», la de
 * la división y los espacios entre medio (medido en el iPhone, con margen).
 */
const RESERVED_RATED = 530;
/** Sin ELO no hay tarjetas de rango: el zorro puede ser más grande. */
const RESERVED_UNRATED = 330;
const FOX_MAX = 320;
/** Más chico que esto no se luce: mejor no mostrarlo y dejar el rango a la vista. */
const FOX_MIN = 110;

/**
 * Tamaño del zorro según el alto disponible (pantalla menos zonas seguras): lo que sobra después de
 * reservar el título y el rango, hasta FOX_MAX. 0 = no entra (pantalla chica): no se muestra.
 */
export function resultFoxSize(availableHeight: number, rated: boolean): number {
  const size = Math.min(FOX_MAX, availableHeight - (rated ? RESERVED_RATED : RESERVED_UNRATED));
  return size >= FOX_MIN ? Math.round(size) : 0;
}

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
  const styles = useStyles();
  const t = useStrings(battleStrings);
  const ranks = useRankLabels();
  const win = outcome === 'win';
  const rated = ratingBefore !== null && ratingAfter !== null;
  const delta = rated ? ratingAfter - ratingBefore : 0;
  const { height } = useWindowDimensions();
  // Sin proveedor (p. ej. en tests) las zonas seguras valen 0.
  const insets = useContext(SafeAreaInsetsContext) ?? { top: 0, bottom: 0 };
  const foxSize = resultFoxSize(height - insets.top - insets.bottom, rated);

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
          {win ? t.victory : t.defeat}
        </Text>
        {rated && delta !== 0 ? (
          <Text variant="title" align="center" color={delta > 0 ? 'primarySoft' : 'danger'}>
            {delta > 0 ? '+' : ''}
            {delta} ELO
          </Text>
        ) : null}
        {(subtitle ?? (win ? null : t.nextOneIsYours)) ? (
          <Text color="textMuted" align="center">
            {subtitle ?? t.nextOneIsYours}
          </Text>
        ) : null}
      </Animated.View>

      {foxSize > 0 ? (
        <Animated.View
          entering={FadeIn.delay(150).duration(500)}
          style={[styles.foxWrap, { width: foxSize, height: foxSize }]}
        >
          <Image
            source={FOX[outcome]}
            style={styles.fox}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            accessibilityLabel={t[FOX_LABEL[outcome]]}
          />
          {/* Bordes difuminados para que no se vea el cuadrado de la foto. */}
          <LinearGradient
            colors={[fadeTo(), fadeFrom()]}
            style={styles.fadeTop}
            pointerEvents="none"
          />
          <LinearGradient
            colors={[fadeFrom(), fadeTo()]}
            style={styles.fadeBottom}
            pointerEvents="none"
          />
          <LinearGradient
            colors={[fadeTo(), fadeFrom()]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fadeLeft}
            pointerEvents="none"
          />
          <LinearGradient
            colors={[fadeFrom(), fadeTo()]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fadeRight}
            pointerEvents="none"
          />
        </Animated.View>
      ) : null}

      {rated && !placedBefore && !win ? (
        <Animated.View entering={FadeInUp.delay(250).duration(400)}>
          <Card style={styles.division} accessibilityLabel={t.stillUnplaced}>
            <RankEmblemForRating rating={ratingAfter} size={64} dimmed />
            <View style={styles.flex}>
              <Text variant="caption">{ranks.unplaced}</Text>
              <Text variant="heading">{t.noRankYet}</Text>
              <Text variant="caption">{t.unplacedHint}</Text>
            </View>
          </Card>
        </Animated.View>
      ) : rated ? (
        <>
          {placedBefore ? (
            <Animated.View entering={FadeInUp.delay(250).duration(400)}>
              <Card
                style={styles.elo}
                accessibilityLabel={t.eloBeforeAfterA11y(ratingBefore, ratingAfter)}
              >
                <EloValue value={ratingBefore} label={t.previousElo} />
                <ArrowRight color={colors.textMuted} size={22} />
                <EloValue
                  value={ratingAfter}
                  label={t.currentElo}
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
  const styles = useStyles();
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
  const styles = useStyles();
  const t = useStrings(battleStrings);
  const ranks = useRankLabels();
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
    ? t.placedIn
    : promoted
      ? t.promotedTo
      : demoted
        ? t.demotedTo
        : t.yourDivision;
  const afterLabel = ranks.label(rankAfter);
  const next = nextLabel(rankAfter, after, t, ranks.label);

  return (
    <Card
      style={[styles.division, promoted && styles.promoted, demoted && styles.demoted]}
      accessibilityLabel={`${heading} ${afterLabel}. ${next}`}
    >
      <RankEmblemForRating rating={after} size={64} />
      <View style={styles.flex}>
        <Text variant="caption">{heading}</Text>
        <Text
          variant="title"
          color={promoted || !placedBefore ? 'primarySoft' : demoted ? 'danger' : 'textStrong'}
        >
          {afterLabel}
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
        <Text variant="caption">{next}</Text>
      </View>
    </Card>
  );
}

/** «Faltan 38 ELO para Bronce II», o el tope si no hay más divisiones. */
function nextLabel(
  rank: RankInfo,
  rating: number,
  t: (typeof battleStrings)['es'],
  label: (rank: RankInfo) => string,
) {
  if (rank.nextStepMin === null) return t.topOfLadder;
  const next = label(getRank(rank.nextStepMin));
  return t.eloToNext(Math.max(1, rank.nextStepMin - Math.floor(rating)), next);
}

const BAR = 10;

const useStyles = themedStyles(() =>
  StyleSheet.create({
    wrap: { gap: spacing.md, alignItems: 'stretch' },
    crown: { alignSelf: 'center', marginTop: spacing.sm },
    titles: { alignItems: 'center', gap: spacing.xxs },
    lossTitles: { marginTop: spacing.lg },
    title: { fontSize: 40, lineHeight: 46 },
    // El tamaño lo da resultFoxSize (cuadrado, según el alto de la pantalla).
    foxWrap: {
      alignSelf: 'center',
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
  }),
);
