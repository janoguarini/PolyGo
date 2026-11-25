import { router } from 'expo-router';
import {
  BookOpen,
  Check,
  Dumbbell,
  FileText,
  Headphones,
  Lock,
  Play,
  RotateCcw,
  Star,
  Trophy,
  type LucideIcon,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import {
  Button,
  Card,
  ProgressBar,
  Text,
  colors,
  elevation,
  gradients,
  pathGold,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { useTourTarget } from '@/features/onboarding/tourTargets';

import { energyStatusText } from '@/features/plus/components/Energy';
import { useEnergy } from '@/features/plus/api';
import { useStrings } from '@/i18n';

import type { LessonStatus, UnitWithStatus } from '../curriculum';
import {
  MAP_CURRENT_SIZE,
  MAP_NODE_SIZE,
  MAP_ROW_HEIGHT,
  lessonKind,
  lessonStars,
  mapLabelBox,
  mapLayout,
  mapRowHeight,
  segmentPath,
  type LessonKind,
  type PathPoint,
} from '../path';
import { pathStrings } from '../strings';

type Strings = (typeof pathStrings)['es'];

const LIP = 6;
/** Violeta del recorrido: nodos completados. */
const PATH_VIOLET = { fill: '#7C3AED', lip: '#4C1D95' } as const;
/** Degradado de la tarjeta de cada unidad. */
const UNIT_GRADIENT = ['#8B5CF6', '#6D28D9', '#4C1D95'] as const;
/** Color de lo bloqueado (se lee al dibujar: depende del tema). */
const lockedAccent = () => ({ fill: colors.surfaceHighlight, lip: colors.borderStrong });
type Accent = { fill: string; lip: string };
/** Nodos de muestra del nivel siguiente: el camino sigue aunque todavía no haya contenido. */
const UPCOMING_NODES = 4;

/** Ícono dentro del nodo de la lección actual. */
const KIND_ICON: Record<LessonKind, LucideIcon> = {
  lesson: Play,
  review: Dumbbell,
  listening: Headphones,
  words: BookOpen,
  final: Trophy,
};

/** Ícono junto al título de cada lección. */
const LABEL_ICON: Record<LessonKind, LucideIcon> = {
  lesson: FileText,
  review: Dumbbell,
  listening: Headphones,
  words: BookOpen,
  final: Trophy,
};

interface PathNode {
  key: string;
  status: LessonStatus;
  kind: LessonKind;
  label: string;
  /** Encabezado del recuadro: «LECCIÓN 3», «REPASO»… */
  overline: string;
  /** Número de la lección dentro de su unidad (1…n); null en los nodos de muestra. */
  number: number | null;
  title: string;
  /** Objetivo de la lección (se muestra en la tarjeta de la lección actual). */
  objective: string;
  bestAccuracy: number | null;
  stars: 0 | 1 | 2 | 3;
  /** Texto del recuadro cuando está bloqueada. */
  lockedMessage: string;
  onStart?: () => void;
}

interface Props {
  units: UnitWithStatus[];
  /**
   * Posición Y (dentro del contenido del scroll) del nodo actual. Se informa al medir el camino
   * y otra vez cada vez que cambia la lección actual (p. ej. al volver de completar una).
   */
  onCurrentLayout?: (y: number) => void;
  /**
   * Lección con el recuadro abierto; la controla la pantalla, que lo cierra con cualquier toque
   * (el recuadro frena la propagación de los suyos).
   */
  selected: string | null;
  onSelectedChange: (key: string | null) => void;
  /** Nivel que sigue a este camino; `ready` = ya tiene unidades cargadas. */
  nextLevel?: { id: string; ready: boolean } | null;
  /**
   * Unidades previstas de este nivel que todavía no existen (idiomas en preparación): el camino
   * termina en «Más unidades en camino» en vez de dar el nivel por completo.
   */
  pendingUnits?: number;
}

/**
 * Mapa de aprendizaje: por cada unidad, su tarjeta y el recorrido de sus lecciones (en el orden real
 * del currículo) con nodos que ondulan a la izquierda y el título de cada lección al costado.
 */
export function LessonPath({
  units,
  onCurrentLayout,
  selected,
  onSelectedChange,
  nextLevel,
  pendingUnits = 0,
}: Props) {
  const styles = useStyles();
  const t = useStrings(pathStrings);
  // Offsets medidos con onLayout: raíz → sección → camino → nodo.
  const rootY = useRef<number | null>(null);
  const sectionY = useRef(new Map<string, number>());
  const pathY = useRef(new Map<string, number>());
  const reportedKey = useRef<string | null>(null);

  const { sections, nextIndex, currentUnitId, currentNodeY } = buildSections(units, t);
  const currentKey = currentUnitId ? `${currentUnitId}:${currentNodeY}` : null;

  const tryReport = () => {
    if (!onCurrentLayout || !currentUnitId || reportedKey.current === currentKey) return;
    const s = sectionY.current.get(currentUnitId);
    const p = pathY.current.get(currentUnitId);
    if (rootY.current === null || s === undefined || p === undefined) return;
    reportedKey.current = currentKey;
    onCurrentLayout(rootY.current + s + p + currentNodeY);
  };

  // Si las medidas no cambian, onLayout no vuelve a dispararse: se reintenta al cambiar la actual.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(tryReport, [currentKey]);

  const thisLevel = units[0]?.level ?? '';
  const nextId = nextLevel?.id ?? '';
  const pending = pendingUnits > 0;
  const firstPending = units.length + 1;
  const lockedMessage = pending
    ? t.preparingRange(firstPending, units.length + pendingUnits, thisLevel)
    : nextLevel?.ready
      ? t.finishLevel(thisLevel, nextId)
      : t.preparingLevel(nextId);
  const upcoming: PathNode[] = Array.from({ length: UPCOMING_NODES }, (_, i) => ({
    key: `upcoming-${i}`,
    status: 'locked',
    kind: i === UPCOMING_NODES - 1 ? 'final' : 'lesson',
    label: t.soonLocked,
    overline: t.levelN(pending ? thisLevel : nextId),
    number: null,
    title: t.soon,
    objective: '',
    bestAccuracy: null,
    stars: 0,
    lockedMessage,
  }));

  const select = (key: string) => onSelectedChange(selected === key ? null : key);
  const owns = (nodes: PathNode[]) => selected !== null && nodes.some((n) => n.key === selected);

  return (
    <View
      style={styles.root}
      onLayout={(e) => {
        rootY.current = e.nativeEvent.layout.y;
        tryReport();
      }}
    >
      {sections.map(({ unit, first, nodes }) => (
        <View
          key={unit.id}
          // La sección con el recuadro abierto va por encima de las siguientes.
          style={[styles.section, owns(nodes) && styles.raised]}
          onLayout={(e) => {
            sectionY.current.set(unit.id, e.nativeEvent.layout.y);
            tryReport();
          }}
        >
          <UnitBanner
            overline={t.unitN(unit.position)}
            level={unit.level}
            lessons={unit.lessons.length}
            emoji={unit.emoji}
            title={`${unit.emoji} ${unit.title}`}
            description={unit.description}
            progress={unit.lessons.length ? unit.completedCount / unit.lessons.length : 0}
            progressLabel={`${unit.completedCount}/${unit.lessons.length}`}
          />
          <PathSection
            firstIndex={first}
            nodes={nodes}
            selected={selected}
            onSelect={select}
            onLayout={(e) => {
              pathY.current.set(unit.id, e.nativeEvent.layout.y);
              tryReport();
            }}
          />
        </View>
      ))}

      {pending || nextLevel ? (
        <View style={[styles.section, owns(upcoming) && styles.raised]}>
          <UnitBanner
            locked
            overline={
              pending
                ? t.levelUnits(thisLevel, units.length, units.length + pendingUnits)
                : t.nextLevel(nextId)
            }
            title={pending ? t.moreUnits : t.pathContinues}
            description={
              pending
                ? t.pendingDescription(thisLevel, firstPending, units.length + pendingUnits)
                : nextLevel?.ready
                  ? t.nextReadyDescription(thisLevel, nextId)
                  : t.nextPendingDescription
            }
          />
          <PathSection
            firstIndex={nextIndex}
            nodes={upcoming}
            selected={selected}
            onSelect={select}
          />
        </View>
      ) : null}
    </View>
  );
}

/** Nodos de cada unidad y el índice global donde arranca su tramo del camino. */
function buildSections(units: UnitWithStatus[], t: Strings) {
  let nextIndex = 0;
  let currentUnitId: string | null = null;
  let currentNodeY = 0;
  const sections = units.map((unit) => {
    const first = nextIndex;
    nextIndex += unit.lessons.length;
    const currentIndex = unit.lessons.findIndex((l) => l.status === 'current');
    if (currentIndex >= 0 && currentUnitId === null) {
      currentUnitId = unit.id;
      // El alto de las filas no depende del ancho: se puede calcular antes de medir.
      currentNodeY =
        unit.lessons.slice(0, currentIndex).reduce((y, l) => y + mapRowHeight(l.status), 0) +
        mapRowHeight('current') / 2;
    }
    let lessonNumber = 0;
    const nodes = unit.lessons.map((lesson, index): PathNode => {
      const kind = lessonKind(lesson.id);
      if (kind === 'lesson') lessonNumber += 1;
      const overline = kind === 'lesson' ? t.lessonN(lessonNumber) : t.kinds[kind];
      const stars = lessonStars(lesson.bestAccuracy);
      return {
        key: lesson.id,
        status: lesson.status,
        kind,
        overline,
        number: index + 1,
        title: lesson.title,
        objective: lesson.objective,
        bestAccuracy: lesson.bestAccuracy,
        stars,
        label: `${overline}: ${lesson.title}. ${
          lesson.status === 'locked'
            ? t.locked
            : lesson.status === 'current'
              ? t.nextLesson
              : t.completedStars(stars)
        }`,
        lockedMessage: t.lockedPrevious,
        onStart: () => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } }),
      };
    });
    return { unit, first, nodes };
  });
  return { sections, nextIndex, currentUnitId: currentUnitId as string | null, currentNodeY };
}

/** Tarjeta de la unidad: degradado violeta, nivel, cantidad de lecciones y progreso real. */
function UnitBanner(props: {
  /** Banner gris de lo que todavía no existe: texto del tema (en claro el fondo es claro). */
  locked?: boolean;
  overline: string;
  level?: string;
  lessons?: number;
  emoji?: string;
  title: string;
  description: string;
  progress?: number;
  progressLabel?: string;
}) {
  const styles = useStyles();
  const t = useStrings(pathStrings);
  // Sobre el violeta de la unidad el texto va blanco en los dos temas.
  const strong = props.locked ? 'textStrong' : 'onPrimary';
  const body = props.locked ? 'text' : 'onPrimary';
  return (
    <Card
      gradient={props.locked ? gradients.locked : UNIT_GRADIENT}
      style={[styles.banner, !props.locked && styles.bannerBrand]}
    >
      <View style={styles.bannerTop}>
        <Text variant="overline" color={strong} style={styles.flex} numberOfLines={1}>
          {props.overline}
        </Text>
        {props.level ? (
          <View style={styles.pill}>
            <Text variant="caption" color="onPrimary" style={styles.pillText}>
              {props.level}
            </Text>
          </View>
        ) : null}
        {props.lessons ? (
          <View style={styles.pill}>
            <BookOpen color={colors.onPrimary} size={13} />
            <Text variant="caption" color="onPrimary" style={styles.pillText}>
              {t.lessonsCount(props.lessons)}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.bannerMain}>
        <View style={styles.bannerText}>
          <Text variant="heading" color={strong} numberOfLines={1} style={styles.bannerTitle}>
            {props.title}
          </Text>
          <Text
            variant="caption"
            color={body}
            numberOfLines={props.locked ? 2 : 1}
            style={[styles.bannerDescription, !props.locked && styles.bannerBody]}
          >
            {props.description}
          </Text>
        </View>
        {props.emoji && !props.locked ? <UnitIllustration emoji={props.emoji} /> : null}
      </View>
      {props.progress !== undefined ? (
        <View style={styles.bannerProgress}>
          <View style={styles.flex}>
            <ProgressBar
              value={props.progress}
              height={6}
              colors={[colors.onPrimary, '#DDD6FE']}
              accessibilityLabel={t.unitProgress(props.progressLabel ?? '')}
            />
          </View>
          <Text variant="caption" color={strong} style={[styles.tabular, styles.bannerCount]}>
            {props.progressLabel}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

/** Globitos de diálogo con el emoji de la unidad (decoración). */
function UnitIllustration({ emoji }: { emoji: string }) {
  const styles = useStyles();
  return (
    <View
      style={styles.illustrationSlot}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.illustration}>
        <View style={[styles.bubble, styles.bubbleMain]}>
          <View style={[styles.bubbleTail, styles.bubbleTailMain]} />
          <Text style={styles.bubbleEmoji}>{emoji}</Text>
        </View>
        <View style={[styles.bubble, styles.bubbleSmall]}>
          <View style={[styles.bubbleTail, styles.bubbleTailSmall]} />
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
        <Svg width={22} height={22} viewBox="0 0 22 22" style={styles.illustrationSparks}>
          <Path d="M4 14 L2 8" stroke={colors.gold} strokeWidth={3} strokeLinecap="round" />
          <Path d="M10 10 L11 2" stroke={colors.gold} strokeWidth={3} strokeLinecap="round" />
          <Path d="M15 14 L20 9" stroke={colors.gold} strokeWidth={3} strokeLinecap="round" />
        </Svg>
      </View>
    </View>
  );
}

/** Tramos entre nodos: los andados (hasta la lección actual) como camino luminoso; el resto, puntos. */
function PathTrail({
  points,
  nodes,
  width,
  height,
}: {
  points: PathPoint[];
  nodes: PathNode[];
  width: number;
  height: number;
}) {
  const segments = points.slice(1).flatMap((to, i) => {
    const from = points[i];
    const node = nodes[i + 1];
    return from && node
      ? [{ key: node.key, d: segmentPath(from, to), lit: node.status !== 'locked' }]
      : [];
  });
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      {segments
        .filter((s) => !s.lit)
        .map((s) => (
          <Path
            key={s.key}
            d={s.d}
            stroke={colors.borderStrong}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray="0.1 15"
            fill="none"
          />
        ))}
      {/* Brillo ancho y translúcido debajo, trazo claro encima: el camino «iluminado». */}
      {segments
        .filter((s) => s.lit)
        .map((s) => (
          <Path
            key={`glow-${s.key}`}
            d={s.d}
            stroke={colors.primaryBright}
            strokeOpacity={0.3}
            strokeWidth={16}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      {segments
        .filter((s) => s.lit)
        .map((s) => (
          <Path
            key={`core-${s.key}`}
            d={s.d}
            stroke={colors.primarySoft}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
          />
        ))}
    </Svg>
  );
}

function PathSection({
  firstIndex,
  nodes,
  selected,
  onSelect,
  onLayout,
}: {
  firstIndex: number;
  nodes: PathNode[];
  selected: string | null;
  onSelect: (key: string) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
}) {
  const styles = useStyles();
  const [width, setWidth] = useState(0);
  const { points, height } = mapLayout(
    firstIndex,
    nodes.map((n) => n.status),
    width || 1,
  );
  const openIndex = nodes.findIndex((n) => n.key === selected);
  const open = nodes[openIndex];
  const openPoint = points[openIndex];

  return (
    <View
      testID="lesson-map-path"
      style={[styles.path, { height }]}
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width);
        onLayout?.(e);
      }}
    >
      {width ? (
        <>
          <PathTrail points={points} nodes={nodes} width={width} height={height} />

          {nodes.map((node, i) => (
            <LessonNode
              key={node.key}
              node={node}
              accent={
                node.status === 'locked'
                  ? lockedAccent()
                  : node.stars === 3
                    ? pathGold
                    : PATH_VIOLET
              }
              x={points[i]?.x ?? 0}
              y={points[i]?.y ?? 0}
              onPress={() => onSelect(node.key)}
            />
          ))}

          {nodes.map((node, i) => {
            const point = points[i];
            if (!point) return null;
            return (
              <NodeLabel
                key={`label-${node.key}`}
                node={node}
                box={mapLabelBox(
                  point,
                  width,
                  node.status === 'current' ? MAP_CURRENT_SIZE : MAP_NODE_SIZE,
                )}
                // Del lado izquierdo el texto se alinea hacia su nodo.
                alignEnd={point.side === 'right'}
                centerY={point.y}
                onPress={() => onSelect(node.key)}
              />
            );
          })}

          {open && openPoint ? (
            <LessonPopover
              node={open}
              x={openPoint.x}
              top={
                openPoint.y +
                (open.status === 'current' ? MAP_CURRENT_SIZE / 2 : (MAP_NODE_SIZE + LIP) / 2) +
                spacing.md
              }
              accent={open.stars === 3 ? pathGold : PATH_VIOLET}
            />
          ) : null}
        </>
      ) : null}
    </View>
  );
}

/**
 * Título de la lección al costado del nodo, con su estado («Completado» / «Sin completar» /
 * «Bloqueado»). Tocarlo abre la misma ficha que el nodo.
 */
function NodeLabel({
  node,
  box,
  alignEnd,
  centerY,
  onPress,
}: {
  node: PathNode;
  box: { left: number; right: number };
  alignEnd: boolean;
  centerY: number;
  onPress: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(pathStrings);
  const locked = node.status === 'locked';
  const Icon = LABEL_ICON[node.kind];
  return (
    <Pressable
      // El nodo ya es el elemento accesible; el texto sólo agranda la zona de toque.
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onPress={onPress}
      onTouchStart={(e) => e.stopPropagation()}
      style={({ pressed }) => [
        styles.label,
        box,
        { top: centerY - LABEL_HEIGHT / 2 },
        alignEnd && styles.labelEnd,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.labelTitle, alignEnd && styles.labelTitleEnd]}>
        <Icon color={locked ? colors.textMuted : colors.text} size={18} />
        <Text
          variant="bodyStrong"
          // Bloqueadas en tono claro (no gris): se leen sobre el paisaje; el candado ya marca el estado.
          color={locked ? 'text' : 'textStrong'}
          numberOfLines={2}
          align={alignEnd ? 'right' : undefined}
          style={[styles.labelText, styles.readable]}
        >
          {node.number ? `${node.number}. ` : ''}
          {node.title}
        </Text>
      </View>
      {locked ? (
        <View style={[styles.status, alignEnd && styles.statusEnd, styles.statusLocked]}>
          <Lock color={colors.text} size={12} strokeWidth={2.5} />
          <Text variant="caption" color="text" style={styles.statusText}>
            {t.statusLocked}
          </Text>
        </View>
      ) : node.status === 'current' ? (
        <View style={[styles.status, alignEnd && styles.statusEnd, styles.statusPending]}>
          <Text variant="caption" color="textStrong" style={styles.statusText}>
            {t.statusPending}
          </Text>
          <View style={styles.statusStars}>
            {[1, 2, 3].map((n) => (
              <Star key={n} size={11} color={colors.textSubtle} fill="transparent" />
            ))}
          </View>
        </View>
      ) : (
        <View style={[styles.status, alignEnd && styles.statusEnd, styles.statusDone]}>
          <Check color={colors.success} size={13} strokeWidth={3} />
          <Text variant="caption" color="success" style={styles.statusText}>
            {t.statusDone}
          </Text>
          {node.stars ? (
            <View style={styles.statusStars}>
              {[1, 2, 3].map((n) => (
                <Star
                  key={n}
                  size={11}
                  color={n <= node.stars ? colors.gold : colors.textSubtle}
                  fill={n <= node.stars ? colors.gold : 'transparent'}
                />
              ))}
            </View>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

function LessonNode({
  node,
  accent,
  x,
  y,
  onPress,
}: {
  node: PathNode;
  accent: Accent;
  x: number;
  y: number;
  onPress: () => void;
}) {
  const styles = useStyles();
  const locked = node.status === 'locked';
  const current = node.status === 'current';
  const golden = node.stars === 3;
  // El tutorial ilumina la lección actual (sólo la vista del nodo actual usa esta ref).
  const tourRef = useTourTarget('learn-lesson');
  const iconColor = locked ? colors.textMuted : golden ? colors.background : colors.onPrimary;

  if (current) {
    const Icon = KIND_ICON[node.kind];
    const glow = MAP_CURRENT_SIZE * 1.8;
    const gradientId = `glow-${node.key}`;
    return (
      <View
        ref={tourRef}
        collapsable={false}
        style={[
          styles.currentSlot,
          { left: x - MAP_CURRENT_SIZE / 2, top: y - MAP_CURRENT_SIZE / 2 },
        ]}
      >
        <Svg
          width={glow}
          height={glow}
          style={[
            styles.currentGlow,
            { left: -(glow - MAP_CURRENT_SIZE) / 2, top: -(glow - MAP_CURRENT_SIZE) / 2 },
          ]}
          pointerEvents="none"
        >
          <Defs>
            <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
              <Stop offset="0.35" stopColor={colors.primaryBright} stopOpacity={0.55} />
              <Stop offset="1" stopColor={colors.primaryBright} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={glow / 2} cy={glow / 2} r={glow / 2} fill={`url(#${gradientId})`} />
        </Svg>
        <PulseRing color={colors.primaryBright} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={node.label}
          onPress={onPress}
          onTouchStart={(e) => e.stopPropagation()}
          hitSlop={8}
          style={styles.currentRing}
        >
          {({ pressed }) => (
            <View style={[styles.currentFace, pressed && styles.currentFacePressed]}>
              <Icon
                color={colors.onPrimary}
                size={32}
                strokeWidth={2.75}
                fill={node.kind === 'lesson' ? colors.onPrimary : 'transparent'}
              />
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  const Icon = node.kind === 'final' && !locked ? Trophy : locked ? Lock : Check;
  return (
    <View
      style={[styles.nodeSlot, { left: x - MAP_NODE_SIZE / 2, top: y - (MAP_NODE_SIZE + LIP) / 2 }]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={node.label}
        onPress={onPress}
        // El nodo decide solo (abre el suyo o cierra si ya estaba abierto): que la pantalla no
        // cierre el recuadro antes y lo vuelva a abrir.
        onTouchStart={(e) => e.stopPropagation()}
        hitSlop={8}
      >
        {({ pressed }) => (
          <View style={styles.nodeBody}>
            <View style={[styles.nodeLip, { backgroundColor: accent.lip }]} />
            <View
              style={[
                styles.nodeFace,
                locked && styles.nodeFaceLocked,
                { backgroundColor: accent.fill, transform: [{ translateY: pressed ? LIP : 0 }] },
              ]}
            >
              <Icon color={iconColor} size={locked ? 26 : 30} strokeWidth={locked ? 2.5 : 3.5} />
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
}

/** Recuadro bajo una lección: estrellas y empezar/repetir, o qué falta si está bloqueada. */
function LessonPopover({
  node,
  x,
  top,
  accent,
}: {
  node: PathNode;
  x: number;
  top: number;
  accent: Accent;
}) {
  const styles = useStyles();
  const locked = node.status === 'locked';
  const current = node.status === 'current';
  const perfect = node.stars === 3;
  const percent = Math.round((node.bestAccuracy ?? 0) * 100);
  const energy = useEnergy().view;
  const t = useStrings(pathStrings);

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      // Los toques dentro del recuadro no llegan a la pantalla, que lo cerraría.
      onTouchStart={(e) => e.stopPropagation()}
      style={[styles.popover, { top }, !locked && { borderColor: accent.fill }]}
    >
      <View
        style={[styles.arrow, { left: x - ARROW / 2 - 1 }, !locked && { borderColor: accent.fill }]}
      />
      <Text variant="overline" color={locked ? 'textMuted' : perfect ? 'gold' : 'primarySoft'}>
        {node.overline}
      </Text>
      <Text variant="heading">{locked ? t.locked : node.title}</Text>

      {locked ? (
        <Text color="textMuted">{node.lockedMessage}</Text>
      ) : (
        <>
          <View style={styles.popoverStars} accessible accessibilityLabel={t.starsOf(node.stars)}>
            {[1, 2, 3].map((n) => (
              <Star
                key={n}
                size={28}
                color={n <= node.stars ? colors.gold : colors.textSubtle}
                fill={n <= node.stars ? colors.gold : 'transparent'}
              />
            ))}
          </View>
          <Text color="textMuted">
            {current ? t.currentHint : perfect ? t.perfectHint : t.bestHint(percent)}
          </Text>
          <Button
            label={current ? t.start : t.redo}
            icon={
              current ? (
                <Play color={colors.onPrimary} fill={colors.onPrimary} size={18} />
              ) : (
                <RotateCcw color={colors.onPrimary} size={18} />
              )
            }
            onPress={node.onStart ?? (() => {})}
          />
          {energy && !energy.plus ? (
            <Text variant="caption" align="center">
              {t.energyCost(energy.energy, energy.max)}
              {energy.energy === 0 ? ` · ${energyStatusText(energy)}` : ''}
            </Text>
          ) : null}
        </>
      )}
    </Animated.View>
  );
}

function PulseRing({ color }: { color: string }) {
  const styles = useStyles();
  const reduceMotion = useReducedMotion();
  const t = useSharedValue(0);

  useEffect(() => {
    if (!reduceMotion) t.value = withRepeat(withTiming(1, { duration: 1600 }), -1, false);
  }, [reduceMotion, t]);

  const style = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0.3 : 0.5 * (1 - t.value),
    transform: [{ scale: reduceMotion ? 1.1 : 1 + 0.3 * t.value }],
  }));

  return <Animated.View style={[styles.pulse, { borderColor: color }, style]} />;
}

const ARROW = 16;
/** Alto de la zona tocable del título de cada lección. */
const LABEL_HEIGHT = MAP_ROW_HEIGHT - spacing.md;

const useStyles = themedStyles(() =>
  StyleSheet.create({
    root: { gap: spacing.xxl },
    section: { gap: spacing.sm },
    raised: { zIndex: 2 },
    flex: { flex: 1 },
    tabular: { fontVariant: ['tabular-nums'] },
    pressed: { opacity: 0.7 },

    // Tarjeta compacta: deja ver más lecciones del recorrido en la primera pantalla.
    banner: { gap: spacing.xs, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
    bannerBrand: { borderColor: 'rgba(196, 181, 253, 0.55)', ...elevation.glow },
    bannerTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    bannerMain: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    bannerText: { flex: 1, gap: 2 },
    bannerTitle: { fontSize: 17, lineHeight: 22 },
    bannerDescription: { fontSize: 12, lineHeight: 16 },
    bannerBody: { opacity: 0.92 },
    bannerCount: { fontWeight: '700' },
    bannerProgress: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginTop: 2,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 1,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(255, 255, 255, 0.18)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    pillText: { fontSize: 11, lineHeight: 15, fontWeight: '700' },

    // Los globitos se dibujan a 86×74 y se muestran al 60 % dentro de un hueco de 52×44.
    illustrationSlot: { width: 52, height: 44 },
    illustration: {
      position: 'absolute',
      left: (52 - 86) / 2,
      top: (44 - 74) / 2,
      width: 86,
      height: 74,
      transform: [{ scale: 0.6 }],
    },
    bubble: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.md,
    },
    bubbleMain: {
      left: 0,
      top: 6,
      width: 56,
      height: 44,
      backgroundColor: '#FFFFFF',
      transform: [{ rotate: '-8deg' }],
    },
    bubbleSmall: {
      right: 0,
      bottom: 2,
      width: 46,
      height: 28,
      flexDirection: 'row',
      gap: 4,
      backgroundColor: '#EDE9FE',
      transform: [{ rotate: '7deg' }],
    },
    bubbleEmoji: { fontSize: 24, lineHeight: 30 },
    bubbleTail: { position: 'absolute', width: 10, height: 10, transform: [{ rotate: '45deg' }] },
    bubbleTailMain: { bottom: -4, left: 12, backgroundColor: '#FFFFFF' },
    bubbleTailSmall: { bottom: -4, right: 10, backgroundColor: '#EDE9FE' },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7C3AED' },
    illustrationSparks: { position: 'absolute', right: 2, top: -6 },

    path: { width: '100%' },
    nodeSlot: { position: 'absolute', width: MAP_NODE_SIZE, alignItems: 'center' },
    nodeBody: { width: MAP_NODE_SIZE, height: MAP_NODE_SIZE + LIP },
    nodeLip: {
      position: 'absolute',
      bottom: 0,
      width: MAP_NODE_SIZE,
      height: MAP_NODE_SIZE,
      borderRadius: MAP_NODE_SIZE / 2,
    },
    nodeFace: {
      width: MAP_NODE_SIZE,
      height: MAP_NODE_SIZE,
      borderRadius: MAP_NODE_SIZE / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nodeFaceLocked: { borderWidth: 1.5, borderColor: colors.borderStrong },

    currentSlot: {
      position: 'absolute',
      width: MAP_CURRENT_SIZE,
      height: MAP_CURRENT_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    currentGlow: { position: 'absolute' },
    currentRing: {
      width: MAP_CURRENT_SIZE,
      height: MAP_CURRENT_SIZE,
      borderRadius: MAP_CURRENT_SIZE / 2,
      borderWidth: 3,
      borderColor: colors.primaryBright,
      backgroundColor: colors.backgroundDeep,
      alignItems: 'center',
      justifyContent: 'center',
    },
    currentFace: {
      width: MAP_CURRENT_SIZE - 18,
      height: MAP_CURRENT_SIZE - 18,
      borderRadius: (MAP_CURRENT_SIZE - 18) / 2,
      borderWidth: 3,
      borderColor: '#EDE9FE',
      backgroundColor: PATH_VIOLET.fill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    currentFacePressed: { transform: [{ scale: 0.94 }] },
    pulse: {
      position: 'absolute',
      width: MAP_CURRENT_SIZE,
      height: MAP_CURRENT_SIZE,
      borderRadius: MAP_CURRENT_SIZE / 2,
      borderWidth: 4,
    },

    label: {
      position: 'absolute',
      height: LABEL_HEIGHT,
      justifyContent: 'center',
      gap: spacing.xs,
    },
    // Pastilla gris translúcida detrás del título: ayuda a leerlo sin tapar el fondo del idioma.
    labelTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radii.md,
      backgroundColor: `${colors.surfaceRaised}8C`,
    },
    labelTitleEnd: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
    labelText: { flexShrink: 1 },
    labelEnd: { alignItems: 'flex-end' },
    status: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 4,
      marginLeft: 26 + spacing.sm,
      marginRight: 0,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radii.pill,
    },
    statusEnd: { alignSelf: 'flex-end', marginLeft: 0, marginRight: spacing.sm },
    statusDone: {
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: 'rgba(52, 211, 153, 0.45)',
    },
    statusLocked: {
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    statusPending: {
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    // Sombra suave del color del fondo: separa el texto de las montañas y nubes de atrás.
    readable: {
      textShadowColor: colors.backgroundDeep,
      textShadowRadius: 6,
      textShadowOffset: { width: 0, height: 1 },
    },
    statusText: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
    statusStars: { flexDirection: 'row', gap: 1, marginLeft: 2 },

    popover: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 10,
      gap: spacing.sm,
      padding: spacing.lg,
      borderRadius: radii.xl,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      ...elevation.card,
      elevation: 12,
    },
    arrow: {
      position: 'absolute',
      top: -ARROW / 2 - 1,
      width: ARROW,
      height: ARROW,
      backgroundColor: colors.surfaceRaised,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      borderColor: colors.borderStrong,
      transform: [{ rotate: '45deg' }],
    },
    popoverStars: { flexDirection: 'row', gap: spacing.xs },
  }),
);
