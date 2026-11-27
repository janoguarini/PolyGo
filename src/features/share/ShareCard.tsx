import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { languageConfig } from '@shared/languages';
import type { ShareAchievement } from '@shared/share';

import { RankEmblem, TIER_COLORS } from '@/design-system';
import { mascotCelebrate } from '@/design-system/imageData.generated';
import { SKIN_IMAGES } from '@/design-system/skinImages';
import { useRankLabels } from '@/features/ranked/strings';
import { LOCALES, useInterfaceLanguage, useStrings } from '@/i18n';
import { useLanguageName } from '@/i18n/languages';

import { shareStrings } from './strings';

/** Tamaño de diseño de la tarjeta (proporción de historia, un poco más baja para que entre). */
export const CARD_WIDTH = 300;
export const CARD_HEIGHT = 480;

/** Fondo de cada tipo de logro: [arriba, abajo]. El rango usa los colores de su tier. */
const STREAK_BG = ['#FF8A1F', '#C2410C'] as const;
const LEVEL_BG = ['#7C3AED', '#2E1065'] as const;

/** Arte del zorro: la skin que tenés puesta (insignia redonda) o el zorro festejando. */
const MASCOT_ASPECT = 480 / 556;

export function useShareTexts(a: ShareAchievement) {
  const t = useStrings(shareStrings);
  const ranks = useRankLabels();
  const languageName = useLanguageName();
  const ui = useInterfaceLanguage();
  const lang = (code: string) => {
    const name = languageName(code);
    // En español, portugués e italiano el nombre del idioma va en minúscula dentro de la frase.
    return ui === 'en' ? name : name.toLocaleLowerCase(LOCALES[ui]);
  };
  switch (a.kind) {
    case 'rank':
      return {
        overline: t.rankOverline,
        headline: t.rankHeadline(ranks.tier(a.tier)),
        sub: t.rankSub,
      };
    case 'streak':
      return {
        overline: t.streakOverline,
        headline: t.streakHeadline(a.days),
        sub: t.streakSub(lang(a.language)),
      };
    case 'level':
      return {
        overline: t.levelOverline,
        headline: t.levelHeadline(a.level),
        sub: t.levelSub(lang(a.language)),
      };
  }
}

function background(a: ShareAchievement): readonly [string, string] {
  if (a.kind === 'rank') {
    const c = TIER_COLORS[a.tier];
    return [c.dark, '#0B0618'];
  }
  return a.kind === 'streak' ? STREAK_BG : LEVEL_BG;
}

/**
 * La tarjeta que se comparte como imagen. Todo lo que se ve acá sale en la foto, así que los colores
 * son fijos (no dependen del tema claro/oscuro). Con `animate` el zorro entra rebotando, el número
 * de la racha cuenta hacia arriba y las estrellas titilan; `onSettled` avisa cuando quedó quieta
 * (recién ahí conviene sacar la foto).
 */
export function ShareCard({
  achievement,
  username,
  code,
  avatarId,
  animate = true,
  onSettled,
}: {
  achievement: ShareAchievement;
  username: string | null;
  code: string | null;
  avatarId: string | null | undefined;
  animate?: boolean;
  onSettled?: () => void;
}) {
  const t = useStrings(shareStrings);
  const texts = useShareTexts(achievement);
  const reduceMotion = useReducedMotion();
  const moving = animate && !reduceMotion;
  const [bg0, bg1] = background(achievement);
  const accent =
    achievement.kind === 'rank'
      ? TIER_COLORS[achievement.tier].accent
      : achievement.kind === 'streak'
        ? '#FFE08A'
        : '#FFC83D';

  useEffect(() => {
    if (!onSettled) return;
    const timer = setTimeout(onSettled, moving ? HERO_SETTLE_MS : 0);
    return () => clearTimeout(timer);
  }, [moving, onSettled]);

  return (
    <View style={styles.card} accessible accessibilityLabel={t.cardA11y(texts.headline, texts.sub)}>
      <LinearGradient
        colors={[bg0, bg1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Rays color={accent} />

      <View style={styles.top}>
        <Text style={styles.brand}>PolyGo</Text>
        <Text style={[styles.overline, { color: accent }]}>{texts.overline}</Text>
      </View>

      <View style={styles.hero}>
        <Hero achievement={achievement} moving={moving} />
      </View>

      <Text style={styles.headline} numberOfLines={2} adjustsFontSizeToFit>
        {texts.headline}
      </Text>
      <Text style={[styles.sub, { color: accent }]} numberOfLines={1}>
        {texts.sub}
      </Text>

      <View style={styles.foxStage}>
        <Twinkles moving={moving} />
        <Fox avatarId={avatarId} moving={moving} />
      </View>

      <View style={styles.footer}>
        {username ? <Text style={styles.username}>@{username}</Text> : null}
        {code ? <Text style={styles.code}>{t.joinWithCode(code)}</Text> : null}
        <Text style={styles.site}>polygoidiomas.com</Text>
      </View>
    </View>
  );
}

/** Cuánto tarda el centro de la tarjeta en terminar de animarse. */
const HERO_SETTLE_MS = 1_700;

function Hero({ achievement, moving }: { achievement: ShareAchievement; moving: boolean }) {
  const scale = useSharedValue(moving ? 0.3 : 1);
  useEffect(() => {
    if (!moving) return;
    scale.value = withDelay(250, withSpring(1, { damping: 8, stiffness: 150 }));
  }, [moving, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (achievement.kind === 'rank') {
    return (
      <Animated.View style={style}>
        <RankEmblem tier={achievement.tier} division={null} size={108} />
      </Animated.View>
    );
  }
  if (achievement.kind === 'streak') {
    return (
      <Animated.View style={[styles.heroRow, style]}>
        <Flame color="#FFE08A" fill="#FFB020" size={74} />
        <CountUp to={achievement.days} moving={moving} />
      </Animated.View>
    );
  }
  return (
    <Animated.View style={[styles.heroRow, style]}>
      <View style={styles.flagBox}>
        <Text style={styles.flag}>{languageConfig(achievement.language).flag}</Text>
      </View>
      <Text style={styles.bigNumber}>{achievement.level}</Text>
    </Animated.View>
  );
}

/** El número de la racha sube de 0 al total con un "tic" por paso (como un contador). */
function CountUp({ to, moving }: { to: number; moving: boolean }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!moving) return;
    const steps = Math.min(to, 24);
    let step = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        step += 1;
        // Desacelera al final: los últimos números pasan más lento.
        const eased = 1 - (1 - step / steps) ** 2;
        setValue(Math.round(eased * to));
        if (Platform.OS !== 'web') void Haptics.selectionAsync();
        if (step >= steps && interval) clearInterval(interval);
      }, 900 / steps);
    }, 450);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [to, moving]);
  return <Text style={styles.bigNumber}>{moving ? value : to}</Text>;
}

/**
 * El zorro: sube desde abajo, "aterriza" aplastándose y estirándose (squash & stretch) y después
 * queda respirando con un leve balanceo.
 */
function Fox({ avatarId, moving }: { avatarId: string | null | undefined; moving: boolean }) {
  const skin = avatarId ? SKIN_IMAGES[avatarId] : undefined;
  const y = useSharedValue(moving ? 160 : 0);
  const sx = useSharedValue(1);
  const sy = useSharedValue(1);
  const tilt = useSharedValue(0);

  useEffect(() => {
    if (!moving) return;
    y.value = withDelay(
      500,
      withSequence(
        withTiming(-18, { duration: 320, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 180, easing: Easing.in(Easing.quad) }),
        withDelay(
          700,
          withRepeat(
            withSequence(
              withTiming(-6, { duration: 700, easing: Easing.inOut(Easing.quad) }),
              withTiming(0, { duration: 700, easing: Easing.inOut(Easing.quad) }),
            ),
            -1,
          ),
        ),
      ),
    );
    // Aterrizaje: se aplasta, se estira y vuelve.
    const land = (wide: number, tall: number) =>
      withDelay(
        1_000,
        withSequence(
          withTiming(wide, { duration: 90 }),
          withTiming(tall, { duration: 120 }),
          withSpring(1, { damping: 6, stiffness: 180 }),
        ),
      );
    sx.value = land(1.18, 0.92);
    sy.value = land(0.82, 1.1);
    tilt.value = withDelay(
      1_400,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(4, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
  }, [moving, sx, sy, tilt, y]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: y.value },
      { rotate: `${tilt.value}deg` },
      { scaleX: sx.value },
      { scaleY: sy.value },
    ],
  }));

  return (
    <Animated.View style={[styles.fox, style]}>
      {skin ? (
        <Image source={skin} style={styles.skin} fadeDuration={0} accessible={false} />
      ) : (
        <Image
          source={mascotCelebrate}
          style={{ height: 132, width: 132 * MASCOT_ASPECT }}
          resizeMode="contain"
          fadeDuration={0}
          accessible={false}
        />
      )}
    </Animated.View>
  );
}

/** Estrellitas de cuatro puntas alrededor del zorro. */
const TWINKLES = [
  { left: 34, top: 22, size: 22, delay: 0 },
  { left: 228, top: 10, size: 16, delay: 350 },
  { left: 246, top: 92, size: 24, delay: 700 },
  { left: 52, top: 104, size: 14, delay: 1_050 },
] as const;

function Twinkles({ moving }: { moving: boolean }) {
  return (
    <>
      {TWINKLES.map((s, i) => (
        <Twinkle key={i} {...s} moving={moving} />
      ))}
    </>
  );
}

function Twinkle({
  left,
  top,
  size,
  delay,
  moving,
}: {
  left: number;
  top: number;
  size: number;
  delay: number;
  moving: boolean;
}) {
  const s = useSharedValue(moving ? 0 : 1);
  useEffect(() => {
    if (!moving) return;
    s.value = withDelay(
      900 + delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) }),
          withTiming(0.55, { duration: 620, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
  }, [delay, moving, s]);
  const style = useAnimatedStyle(() => ({
    opacity: s.value,
    transform: [{ scale: s.value }, { rotate: `${s.value * 45}deg` }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', left, top }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
          fill="#FFFFFF"
        />
      </Svg>
    </Animated.View>
  );
}

/** Rayos suaves detrás del logro (estáticos: salen igual en la foto). */
function Rays({ color }: { color: string }) {
  const c = 150;
  const r = 340;
  const n = 12;
  const half = Math.PI / n / 2;
  return (
    <View pointerEvents="none" style={styles.rays}>
      <Svg width={c * 2} height={c * 2 + 40}>
        {Array.from({ length: n }, (_, i) => {
          const a = (i / n) * 2 * Math.PI;
          const cy = c + 20;
          return (
            <Path
              key={i}
              d={`M${c} ${cy} L${c + r * Math.cos(a - half)} ${cy + r * Math.sin(a - half)} L${c + r * Math.cos(a + half)} ${cy + r * Math.sin(a + half)} Z`}
              fill={color}
              opacity={0.08}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
  },
  rays: { position: 'absolute', top: 40, left: 0 },
  top: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: { color: '#FFFFFFD9', fontSize: 20, fontWeight: '900', letterSpacing: 0.3 },
  overline: { fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  hero: { height: 128, marginTop: 22, alignItems: 'center', justifyContent: 'center' },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bigNumber: {
    color: '#FFFFFF',
    fontSize: 72,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    textShadowColor: '#0000004D',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 0,
  },
  flagBox: {
    width: 84,
    height: 62,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFFCC',
  },
  flag: { fontSize: 46, lineHeight: Platform.OS === 'android' ? 54 : undefined },
  headline: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
  },
  sub: { fontSize: 18, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  foxStage: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  fox: { alignItems: 'center', justifyContent: 'flex-end' },
  skin: { width: 124, height: 124, borderRadius: 62 },
  footer: { alignItems: 'center', gap: 2, marginTop: 10 },
  username: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  code: { color: '#FFFFFFE6', fontSize: 13, fontWeight: '700' },
  site: { color: '#FFFFFFB3', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
});
