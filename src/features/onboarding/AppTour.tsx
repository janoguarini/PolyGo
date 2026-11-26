import * as Haptics from 'expo-haptics';
import { router, type Href } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import {
  Button,
  Mascot,
  Text,
  colors,
  radii,
  spacing,
  type MascotPose,
  themedStyles,
} from '@/design-system';
import { useStrings } from '@/i18n';

import { tourStrings } from './strings';
import {
  measureInWindow,
  measureTourTarget,
  type TourRect,
  type TourTargetId,
} from './tourTargets';

type StepKey = 'intro' | 'lesson' | 'stats' | 'review' | 'ranked' | 'done';

interface TourStep {
  key: StepKey;
  route: Href;
  /** Elemento que se ilumina y al que apunta el zorro. Sin él, el paso va centrado. */
  target?: TourTargetId;
  /** Recorte circular (nodos redondos) en vez de rectángulo redondeado. */
  round?: boolean;
  /** Pose de los pasos centrados (los que tienen destino eligen la que apunta). */
  pose?: MascotPose;
}

const STEPS: TourStep[] = [
  { key: 'intro', route: '/', pose: 'wave' },
  { key: 'lesson', route: '/', target: 'learn-lesson', round: true },
  { key: 'stats', route: '/', target: 'learn-stats' },
  { key: 'review', route: '/practice', target: 'practice-today' },
  { key: 'ranked', route: '/ranked', target: 'ranked-play' },
  { key: 'done', route: '/', pose: 'wave' },
];

/** Alto aproximado de la barra de pestañas (sin la safe area). */
const TAB_BAR = 56;
const MARGIN = spacing.md;
/** Alto del zorro (el ancho sale de la proporción de las imágenes, 480 × 556: foxWidth). */
export const FOX_H = 150;
/**
 * Dónde está la punta del dedo en cada pose que apunta, como fracción de la imagen: así el dedo cae
 * sobre el elemento y no «más o menos cerca».
 */
export const FINGER = {
  pointUp: { x: 0.8, y: 0.17 },
  pointDown: { x: 0.61, y: 0.66 },
} as const;
/** Aire entre el recorte y el elemento, y entre el recorte y el zorro. */
const HOLE_PAD = 8;
const GAP = 6;
/** Ancho mínimo de la caja de texto al costado del zorro; si no entra, va arriba o abajo de él. */
const BUBBLE_MIN = 196;
const BUBBLE_DEFAULT_H = 200;
/** Aire entre el zorro y la caja apilada: la caja nunca le tapa la cabeza. */
const STACK_GAP = 4;
const DIM = 'rgba(7, 6, 15, 0.74)';
/** Único efecto: un fundido corto al cambiar de paso (liviano incluso en teléfonos viejos). */
const FADE_MS = 160;
/** Intentos de medir el destino (cada ~120 ms) antes de mostrar el paso centrado. */
const MAX_TRIES = 20;

export type TourLayout =
  | { kind: 'center' }
  | {
      kind: 'anchored';
      place: 'above' | 'below';
      pose: 'pointUp' | 'pointDown';
      /** Alto del zorro: FOX_H, o menos si no hay lugar (nunca menos que FOX_MIN). */
      fox: { left: number; top: number; height: number };
      bubble: { left: number; width: number; top?: number; bottom?: number };
      /** De qué lado del zorro está la caja (beside) o si va apilada (stacked). */
      bubbleSide: 'left' | 'right' | 'stacked';
    };

/** El zorro se achica hasta acá cuando falta lugar; más chico ya no se luce. */
export const FOX_MIN = 100;
export const foxWidth = (h: number) => Math.round((h * 480) / 556);

/**
 * Ubica al zorro y la caja respecto del elemento iluminado (coordenadas de la pantalla). Debajo si
 * entra, si no arriba: abajo el zorro apunta hacia arriba y arriba apunta hacia abajo, con la punta
 * del dedo alineada con el centro del elemento (hasta donde lo permiten los bordes). La caja va al
 * costado del zorro si hay lugar; si no, apilada del lado contrario al elemento. Si ni así entra, el
 * zorro se achica lo justo para que nada se salga de la pantalla.
 */
export function tourLayout({
  rect,
  width,
  height,
  insetTop,
  insetBottom,
  bubbleHeight,
}: {
  rect: TourRect | null;
  width: number;
  height: number;
  insetTop: number;
  insetBottom: number;
  bubbleHeight: number;
}): TourLayout {
  if (!rect) return { kind: 'center' };
  const holeTop = rect.y - HOLE_PAD;
  const holeBottom = rect.y + rect.height + HOLE_PAD;
  const spaceBelow = height - insetBottom - TAB_BAR - holeBottom - GAP;
  const spaceAbove = holeTop - insetTop - GAP;
  const centerX = rect.x + rect.width / 2;

  const plan = (place: 'above' | 'below', foxH: number) => {
    const pose = place === 'below' ? 'pointUp' : 'pointDown';
    const foxW = foxWidth(foxH);
    const finger = FINGER[pose];
    const foxLeft = Math.min(width - MARGIN - foxW, Math.max(MARGIN, centerX - finger.x * foxW));
    const leftSpace = foxLeft - MARGIN;
    const rightSpace = width - MARGIN - (foxLeft + foxW);
    const beside = Math.max(leftSpace, rightSpace) >= BUBBLE_MIN;
    const needed = beside ? Math.max(foxH, bubbleHeight) : foxH + bubbleHeight + STACK_GAP;
    return { place, pose, foxH, foxW, foxLeft, leftSpace, rightSpace, beside, needed } as const;
  };

  const below = plan('below', FOX_H);
  const above = plan('above', FOX_H);
  let chosen =
    below.needed <= spaceBelow
      ? below
      : above.needed <= spaceAbove
        ? above
        : spaceBelow >= spaceAbove
          ? below
          : above;
  const space = chosen.place === 'below' ? spaceBelow : spaceAbove;
  if (chosen.needed > space && !chosen.beside) {
    // Apilada y sin lugar: el zorro cede lo que falta.
    const foxH = Math.max(FOX_MIN, Math.floor(space - bubbleHeight - STACK_GAP));
    chosen = plan(chosen.place, Math.min(FOX_H, foxH));
  }
  const { foxH, foxW } = chosen;

  const foxTop = chosen.place === 'below' ? holeBottom + GAP : holeTop - GAP - foxH;
  const fox = { left: chosen.foxLeft, top: foxTop, height: foxH };

  if (chosen.beside) {
    const right = chosen.rightSpace >= chosen.leftSpace;
    const bubbleWidth = (right ? chosen.rightSpace : chosen.leftSpace) + spacing.sm;
    const left = right ? chosen.foxLeft + foxW - spacing.sm : MARGIN;
    // Pegada al zorro y del lado del elemento: abajo, alineada arriba; arriba, alineada abajo.
    return {
      kind: 'anchored',
      place: chosen.place,
      pose: chosen.pose,
      fox,
      bubble:
        chosen.place === 'below'
          ? { left, width: bubbleWidth, top: foxTop + spacing.lg }
          : { left, width: bubbleWidth, bottom: height - (foxTop + foxH - spacing.lg) },
      bubbleSide: right ? 'right' : 'left',
    };
  }
  // Apilada: la caja del lado contrario al elemento, sin tapar al zorro.
  return {
    kind: 'anchored',
    place: chosen.place,
    pose: chosen.pose,
    fox,
    bubble:
      chosen.place === 'below'
        ? { left: MARGIN, width: width - 2 * MARGIN, top: foxTop + foxH + STACK_GAP }
        : { left: MARGIN, width: width - 2 * MARGIN, bottom: height - (foxTop - STACK_GAP) },
    bubbleSide: 'stacked',
  };
}

/**
 * Tutorial sobre las pantallas reales. Oscurece la app y recorta un foco sobre el elemento de cada
 * paso; el zorro se para al lado y lo señala con el dedo. Sin animaciones continuas (sólo un fundido
 * corto al cambiar de paso): fluido también en teléfonos viejos. Tocar el
 * elemento iluminado también avanza. Bloquea el resto de los toques mientras está abierto.
 */
export function AppTour({
  onFinish,
  navigate = (route) => router.navigate(route),
}: {
  /** finished: llegó al último paso; false: lo saltó (para la analítica: el regalo es el mismo). */
  onFinish: (finished: boolean) => void;
  /** Para mostrar el tutorial sin navegar (vista previa). */
  navigate?: (route: Href) => void;
}) {
  const styles = useStyles();
  const t = useStrings(tourStrings);
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  // Tamaño real del overlay (por defecto, el de la ventana): el recorte y las posiciones usan éste.
  const [box, setBox] = useState({ width: window.width, height: window.height });
  const { width, height } = box;
  const reduceMotion = useReducedMotion();
  const overlayRef = useRef<ComponentRef<typeof View>>(null);
  const [index, setIndex] = useState(0);
  // Destino medido para un paso (rect null: no apareció y el paso va centrado).
  const [measured, setMeasured] = useState<{ index: number; rect: TourRect | null } | null>(null);
  const [bubbleHeight, setBubbleHeight] = useState(BUBBLE_DEFAULT_H);
  const step = STEPS[index]!;
  const isLast = index === STEPS.length - 1;
  // Los pasos sin destino se muestran enseguida; los demás, cuando el destino quedó quieto.
  const ready = !step.target || measured?.index === index;
  const rect = step.target && measured?.index === index ? measured.rect : null;

  // Navega y busca el destino hasta que esté quieto (la pestaña se monta y el camino se desliza).
  useEffect(() => {
    navigate(step.route);
    const target = step.target;
    if (!target) return;
    const stepIndex = index;
    const measureOverlay = () => measureInWindow(overlayRef.current);
    let cancelled = false;
    let last: TourRect | null = null;
    let tries = 0;
    const tick = async () => {
      if (cancelled) return;
      tries += 1;
      const [found, origin] = await Promise.all([measureTourTarget(target), measureOverlay()]);
      if (cancelled) return;
      const local = found
        ? { ...found, x: found.x - (origin?.x ?? 0), y: found.y - (origin?.y ?? 0) }
        : null;
      const stable =
        local &&
        last &&
        Math.abs(local.x - last.x) < 1 &&
        Math.abs(local.y - last.y) < 1 &&
        Math.abs(local.height - last.height) < 1;
      if (stable || tries >= MAX_TRIES) {
        // Si no apareció (pantalla sin ese elemento), el paso se muestra centrado.
        setMeasured({ index: stepIndex, rect: local });
        return;
      }
      last = local;
      setTimeout(() => void tick(), 120);
    };
    const first = setTimeout(() => void tick(), 180);
    return () => {
      cancelled = true;
      clearTimeout(first);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Recorte del paso (en coordenadas del overlay); sin destino, todo oscuro.
  const hole = rect
    ? (() => {
        const w = rect.width + HOLE_PAD * 2;
        const h = rect.height + HOLE_PAD * 2;
        const r = step.round ? Math.min(w, h) / 2 : Math.min(radii.xl + HOLE_PAD, w / 2, h / 2);
        return { x: rect.x - HOLE_PAD, y: rect.y - HOLE_PAD, w, h, r };
      })()
    : null;
  const dimPath = hole
    ? `M0 0H${width}V${height}H0Z ` +
      `M${hole.x + hole.r} ${hole.y}H${hole.x + hole.w - hole.r}` +
      `A${hole.r} ${hole.r} 0 0 1 ${hole.x + hole.w} ${hole.y + hole.r}V${hole.y + hole.h - hole.r}` +
      `A${hole.r} ${hole.r} 0 0 1 ${hole.x + hole.w - hole.r} ${hole.y + hole.h}H${hole.x + hole.r}` +
      `A${hole.r} ${hole.r} 0 0 1 ${hole.x} ${hole.y + hole.h - hole.r}V${hole.y + hole.r}` +
      `A${hole.r} ${hole.r} 0 0 1 ${hole.x + hole.r} ${hole.y}Z`
    : `M0 0H${width}V${height}H0Z`;
  const fade = reduceMotion ? undefined : FadeIn.duration(FADE_MS);

  const layout = tourLayout({
    rect: ready ? rect : null,
    width,
    height,
    insetTop: insets.top,
    insetBottom: insets.bottom,
    bubbleHeight,
  });

  const next = () => {
    void Haptics.selectionAsync();
    if (isLast) onFinish(true);
    else setIndex((i) => i + 1);
  };
  const copy = t[step.key];
  const onBubbleLayout = (e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (Math.abs(h - bubbleHeight) > 2) setBubbleHeight(h);
  };

  const bubble = (
    <View style={styles.bubbleInner}>
      <View style={styles.progressRow} accessibilityLabel={t.stepA11y(index + 1, STEPS.length)}>
        <Text variant="overline" color="primarySoft">
          {t.step(index + 1, STEPS.length)}
        </Text>
        <View style={styles.dots}>
          {STEPS.map((s, i) => (
            <View
              key={s.key}
              style={[styles.dot, i === index && styles.dotActive, i < index && styles.dotDone]}
            />
          ))}
        </View>
      </View>
      <Text variant="heading" color="textStrong">
        {copy.title}
      </Text>
      <Text color="text">{copy.body}</Text>
      <View style={styles.actions}>
        {isLast ? null : (
          <Pressable
            accessibilityRole="button"
            onPress={() => onFinish(false)}
            hitSlop={12}
            style={styles.skip}
          >
            <Text variant="caption" color="textMuted">
              {t.skip}
            </Text>
          </Pressable>
        )}
        <View style={styles.flex}>
          <Button label={isLast ? t.finish : index === 0 ? t.start : t.next} onPress={next} />
        </View>
      </View>
    </View>
  );

  return (
    <View
      ref={overlayRef}
      style={styles.overlay}
      accessibilityViewIsModal
      collapsable={false}
      onLayout={(e) => {
        const { width: w, height: h } = e.nativeEvent.layout;
        if (Math.abs(w - width) > 1 || Math.abs(h - height) > 1) setBox({ width: w, height: h });
      }}
    >
      <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path d={dimPath} fill={DIM} fillRule="evenodd" />
      </Svg>

      {/* Borde del elemento iluminado; tocarlo avanza. */}
      {hole && layout.kind === 'anchored' ? (
        <Pressable
          style={[
            styles.ring,
            { left: hole.x, top: hole.y, width: hole.w, height: hole.h, borderRadius: hole.r },
          ]}
          onPress={next}
          accessibilityRole="button"
          accessibilityLabel={copy.title}
        />
      ) : null}

      {!ready ? null : layout.kind === 'center' ? (
        <View style={styles.center} pointerEvents="box-none">
          <Animated.View key={`fox-${index}`} entering={fade}>
            <Mascot pose={step.pose ?? 'wave'} height={FOX_H + 30} />
          </Animated.View>
          <Animated.View
            key={`bubble-${index}`}
            entering={fade}
            style={[styles.bubble, styles.centerBubble]}
            accessibilityLiveRegion="polite"
          >
            {bubble}
          </Animated.View>
        </View>
      ) : (
        <>
          <Animated.View
            key={`fox-${index}`}
            entering={fade}
            style={[
              styles.fox,
              {
                left: layout.fox.left,
                top: layout.fox.top,
                height: layout.fox.height,
                width: foxWidth(layout.fox.height),
              },
            ]}
            pointerEvents="none"
          >
            <Mascot pose={layout.pose} height={layout.fox.height} />
          </Animated.View>
          <Animated.View
            key={`bubble-${index}`}
            entering={fade}
            onLayout={onBubbleLayout}
            style={[
              styles.bubble,
              styles.anchoredBubble,
              {
                left: layout.bubble.left,
                width: layout.bubble.width,
                top: layout.bubble.top,
                bottom: layout.bubble.bottom,
              },
            ]}
            accessibilityLiveRegion="polite"
          >
            {layout.bubbleSide === 'right' ? <View style={[styles.tail, styles.tailLeft]} /> : null}
            {layout.bubbleSide === 'left' ? <View style={[styles.tail, styles.tailRight]} /> : null}
            {bubble}
          </Animated.View>
        </>
      )}
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    overlay: { ...StyleSheet.absoluteFill, zIndex: 100 },
    ring: {
      position: 'absolute',
      borderWidth: 2,
      borderColor: colors.primaryBright,
    },
    fox: { position: 'absolute' },
    center: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: MARGIN,
    },
    bubble: {
      padding: spacing.md,
      borderRadius: radii.xl,
      borderWidth: 2,
      borderColor: colors.primaryBright,
      backgroundColor: colors.surfaceRaised,
    },
    centerBubble: { alignSelf: 'stretch', maxWidth: 480, marginTop: -spacing.md },
    anchoredBubble: { position: 'absolute' },
    bubbleInner: { gap: spacing.xs },
    progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    dots: { flexDirection: 'row', gap: 5 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.surfaceHighlight },
    dotDone: { backgroundColor: colors.primarySoft },
    dotActive: { width: 16, backgroundColor: colors.primaryBright },
    // Piquito de la caja hacia el zorro.
    tail: {
      position: 'absolute',
      top: 30,
      width: 16,
      height: 16,
      backgroundColor: colors.surfaceRaised,
      borderColor: colors.primaryBright,
      transform: [{ rotate: '45deg' }],
    },
    tailLeft: { left: -9, borderLeftWidth: 2, borderBottomWidth: 2 },
    tailRight: { right: -9, borderRightWidth: 2, borderTopWidth: 2 },
    actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
    skip: { paddingHorizontal: spacing.xs },
    flex: { flex: 1 },
  }),
);
