import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Text, colors, radii, spacing, themedStyles } from '@/design-system';
import {
  avatarCatRed,
  avatarCatViolet,
  avatarDogViolet,
  avatarDogYellow,
  avatarLionRed,
  avatarLionViolet,
  avatarPandaViolet,
  avatarPandaYellow,
  mascotPointUp,
  mascotThinking,
  mascotWave,
} from '@/design-system/imageData.generated';

import type { LessonStatus } from '../curriculum';
import type { LessonKind } from '../path';
import { speakSpanish } from '../speech';

/**
 * Personajes que acompañan el camino de lecciones en el lado libre de cada curva: el zorro en sus
 * poses y los animales de los avatares. Son decoración (los lectores de pantalla no los leen) pero
 * reaccionan al tocarlos: saltan y cambian de frase. Las frases dependen del estado y del tipo de
 * lección, de la hora y van rotando solas.
 */
type Companion = { source: ImageSourcePropType; kind: 'mascot' | 'badge' };

const CAST: readonly Companion[] = [
  { source: mascotWave, kind: 'mascot' },
  { source: avatarPandaViolet, kind: 'badge' },
  { source: mascotThinking, kind: 'mascot' },
  { source: avatarDogYellow, kind: 'badge' },
  { source: mascotPointUp, kind: 'mascot' },
  { source: avatarCatRed, kind: 'badge' },
  { source: avatarLionViolet, kind: 'badge' },
  { source: avatarPandaYellow, kind: 'badge' },
  { source: avatarCatViolet, kind: 'badge' },
  { source: avatarDogViolet, kind: 'badge' },
  { source: avatarLionRed, kind: 'badge' },
];

const DONE = [
  '¡Bien ahí!',
  '¡Qué nivel!',
  '¡Seguí así!',
  '¡Imparable! 🔥',
  '¡Crack!',
  '¡Así se hace!',
  '¡Me encanta! 😄',
  '¡Sos un genio!',
  '¡Uno menos! ✅',
  '¡Vas volando! 🚀',
  '¡Tremendo!',
  '¡Eso es! 👏',
];
const GOLDEN = ['¡Dorada! ✨', '¡Perfecta! 🌟', '¡Cero errores!', '¡Brillás! ✨', '¡Impecable!'];
const CURRENT = [
  '¡Vos podés!',
  '¡Una más! 💪',
  '¡Vamos!',
  '¡Dale que va!',
  '¡A jugar! 🎮',
  '¡Te toca! 👇',
  '¡Arranquemos!',
  '¡Confío en vos!',
];
const LOCKED = [
  'Te espero 👀',
  '¡Ya casi llegás!',
  'Acá te espero 🙌',
  'Zzz… 😴',
  '¿Venís? 👋',
  '¡Pronto! ⏳',
];
const BY_KIND: Partial<Record<LessonKind, readonly string[]>> = {
  final: ['¡El jefe final! 🏆', '¡A por el trofeo!', '¡Último desafío!'],
  listening: ['¡Afiná el oído! 🎧', '¡Escuchá bien!', '¡Oídos atentos! 👂'],
  review: ['¡A entrenar! 💪', 'Repasar es ganar', '¡No te olvides!'],
  words: ['¡Palabras nuevas! 📚', '¡Más vocabulario!', '¡A aprender! 📖'],
};

/** Saludo según la hora del teléfono (de vez en cuando, mezclado con las demás frases). */
function timeCheer(hour: number): string {
  if (hour < 6) return '¿A esta hora? 🦉';
  if (hour < 12) return '¡Buen día! ☀️';
  if (hour < 19) return '¡Buenas tardes! 🌤️';
  return '¡Buenas noches! 🌙';
}

/** Frases posibles para este personaje (sin hora: la hora se agrega al elegir). */
export function cheerPool(
  status: LessonStatus,
  kind: LessonKind,
  stars: number,
): readonly string[] {
  if (status === 'locked') return LOCKED;
  const byKind = BY_KIND[kind] ?? [];
  if (status === 'current') return [...CURRENT, ...byKind];
  return stars === 3 ? [...GOLDEN, ...DONE] : [...DONE, ...byKind];
}

const MASCOT_HEIGHT = 92;
const MASCOT_ASPECT = 480 / 556;
const BADGE_SIZE = 72;
/** Ancho de la caja (entra la frase más larga en una línea) y alto aproximado de la frase. */
const SLOT_WIDTH = 132;
const CHEER_HEIGHT = 26;
/** Cada cuánto cambia la frase sola. */
const ROTATE_MS = 7000;

/** Índices globales donde el camino está en un extremo de la onda (ver pathOffset). */
export function companionSide(globalIndex: number): 'left' | 'right' | null {
  const phase = ((globalIndex % 8) + 8) % 8;
  if (phase === 2) return 'left'; // el nodo está a la derecha: el personaje va a la izquierda
  if (phase === 6) return 'right';
  return null;
}

export function PathCompanion({
  globalIndex,
  nodeX,
  centerY,
  width,
  status,
  kind,
  stars,
}: {
  globalIndex: number;
  /** Centro horizontal del nodo junto al que va el personaje. */
  nodeX: number;
  /** Centro vertical donde va el personaje (el del nodo, o una fila corrida). */
  centerY: number;
  width: number;
  status: LessonStatus;
  kind: LessonKind;
  stars: number;
}) {
  const styles = useStyles();
  const side = companionSide(globalIndex);
  const reduceMotion = useReducedMotion();
  const bob = useSharedValue(0);
  const hop = useSharedValue(0);
  const tilt = useSharedValue(0);
  // Cada personaje arranca en una frase distinta; la hora aparece en el primer turno de algunos.
  const [turn, setTurn] = useState(globalIndex);

  useEffect(() => {
    if (reduceMotion) return;
    bob.value = withDelay(
      (globalIndex * 370) % 1400,
      withRepeat(
        withSequence(withTiming(-5, { duration: 1300 }), withTiming(0, { duration: 1300 })),
        -1,
        false,
      ),
    );
  }, [bob, globalIndex, reduceMotion]);

  useEffect(() => {
    // Desfasados para que no cambien todos a la vez.
    const id = setInterval(() => setTurn((t) => t + 1), ROTATE_MS + (globalIndex % 5) * 900);
    return () => clearInterval(id);
  }, [globalIndex]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bob.value + hop.value },
      { rotate: `${tilt.value}deg` },
      // Mira hacia el camino.
      { scaleX: side === 'right' ? -1 : 1 },
    ],
  }));

  if (!side) return null;
  const who = CAST[Math.floor(globalIndex / 4) % CAST.length]!;
  const locked = status === 'locked';
  const pool = cheerPool(status, kind, stars);
  const cheerAt = (t: number) =>
    !locked && t % 6 === globalIndex % 6 && t !== globalIndex
      ? timeCheer(new Date().getHours())
      : pool[t % pool.length]!;
  const cheer = cheerAt(turn);

  const onTap = () => {
    // Dice en voz alta la frase nueva (la misma que aparece en la burbuja).
    const next = turn + 1;
    setTurn(next);
    speakSpanish(cheerAt(next));
    void Haptics.selectionAsync();
    if (reduceMotion) return;
    hop.value = withSequence(withSpring(-18, { damping: 6, stiffness: 260 }), withSpring(0));
    tilt.value = withSequence(
      withTiming(-8, { duration: 90 }),
      withTiming(8, { duration: 120 }),
      withTiming(0, { duration: 90 }),
    );
  };

  const figureWidth = who.kind === 'mascot' ? MASCOT_HEIGHT * MASCOT_ASPECT : BADGE_SIZE;
  const figureHeight = who.kind === 'mascot' ? MASCOT_HEIGHT : BADGE_SIZE;
  // La caja abarca la frase (más ancha que el personaje) para no salirse de la pantalla.
  const boxWidth = Math.max(figureWidth, SLOT_WIDTH);
  // Centro del espacio libre: entre el borde y el nodo, del lado contrario.
  const freeCenter = side === 'left' ? (nodeX - 44) / 2 : nodeX + 44 + (width - nodeX - 44) / 2;
  const left = Math.max(0, Math.min(width - boxWidth, freeCenter - boxWidth / 2));
  const top = centerY - (CHEER_HEIGHT + figureHeight) / 2;

  return (
    <View
      pointerEvents="box-none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.slot, { left, top, width: boxWidth }, locked && styles.dim]}
    >
      <Animated.View
        key={cheer}
        entering={reduceMotion ? undefined : FadeIn.duration(250)}
        exiting={reduceMotion ? undefined : FadeOut.duration(150)}
        style={styles.cheer}
        pointerEvents="none"
      >
        <Text variant="caption" color="textStrong" numberOfLines={1}>
          {cheer}
        </Text>
      </Animated.View>
      <Pressable onPress={onTap} accessible={false} hitSlop={6}>
        <Animated.View style={floatStyle}>
          {who.kind === 'mascot' ? (
            <Image
              source={who.source}
              style={{ height: MASCOT_HEIGHT, width: figureWidth }}
              resizeMode="contain"
              fadeDuration={0}
            />
          ) : (
            <Image source={who.source} style={styles.badge} resizeMode="cover" fadeDuration={0} />
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    slot: { position: 'absolute', alignItems: 'center' },
    dim: { opacity: 0.45 },
    cheer: {
      alignItems: 'center',
      marginBottom: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    badge: { width: BADGE_SIZE, height: BADGE_SIZE, borderRadius: BADGE_SIZE / 2 },
  }),
);
