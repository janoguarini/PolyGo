import { router } from 'expo-router';
import {
  BookOpen,
  Check,
  Dumbbell,
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
import Svg, { Path } from 'react-native-svg';

import {
  Button,
  Card,
  ProgressBar,
  Text,
  colors,
  elevation,
  pathAccents,
  pathGold,
  radii,
  spacing,
  type PathAccent,
} from '@/design-system';

import type { LessonStatus, UnitWithStatus } from '../curriculum';
import {
  PATH_NODE_SIZE,
  PATH_ROW_HEIGHT,
  lessonKind,
  lessonStars,
  pathOffset,
  pathPoints,
  segmentPath,
  type LessonKind,
} from '../path';

const LIP = 6;
const LOCKED_ACCENT = { fill: colors.surfaceHighlight, lip: colors.borderStrong } as const;
type Accent = PathAccent | typeof LOCKED_ACCENT;
/** Nodos de muestra del nivel siguiente: el camino sigue aunque todavía no haya contenido. */
const UPCOMING_NODES = 4;

const KIND_ICON: Record<LessonKind, LucideIcon> = {
  lesson: Play,
  review: Dumbbell,
  listening: Headphones,
  words: BookOpen,
  final: Trophy,
};

const KIND_LABEL: Record<Exclude<LessonKind, 'lesson'>, string> = {
  review: 'REPASO',
  listening: 'ESCUCHA',
  words: 'PALABRAS',
  final: 'REPASO FINAL',
};

interface PathNode {
  key: string;
  status: LessonStatus;
  kind: LessonKind;
  label: string;
  /** Encabezado del recuadro: «LECCIÓN 3», «REPASO»… */
  overline: string;
  title: string;
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
}

export function LessonPath({ units, onCurrentLayout }: Props) {
  // Offsets medidos con onLayout: raíz → sección → camino → nodo.
  const rootY = useRef<number | null>(null);
  const sectionY = useRef(new Map<string, number>());
  const pathY = useRef(new Map<string, number>());
  const reportedKey = useRef<string | null>(null);
  // Lección con el recuadro abierto (completadas y bloqueadas; la actual arranca directo).
  const [selected, setSelected] = useState<string | null>(null);

  const { sections, nextIndex, currentUnitId, currentNodeY } = buildSections(units);
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

  const upcoming: PathNode[] = Array.from({ length: UPCOMING_NODES }, (_, i) => ({
    key: `upcoming-${i}`,
    status: 'locked',
    kind: i === UPCOMING_NODES - 1 ? 'final' : 'lesson',
    label: 'Próximamente',
    overline: 'NIVEL A2',
    title: 'Próximamente',
    bestAccuracy: null,
    stars: 0,
    lockedMessage: 'Estamos preparando las unidades del nivel A2.',
  }));

  const select = (key: string) => setSelected((prev) => (prev === key ? null : key));
  const owns = (nodes: PathNode[]) => selected !== null && nodes.some((n) => n.key === selected);

  return (
    <View
      style={styles.root}
      onLayout={(e) => {
        rootY.current = e.nativeEvent.layout.y;
        tryReport();
      }}
    >
      {selected ? (
        <Pressable
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          onPress={() => setSelected(null)}
          accessibilityLabel="Cerrar detalle de la lección"
        />
      ) : null}

      {sections.map(({ unit, accent, first, nodes }) => (
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
            accent={accent}
            overline={`UNIDAD ${unit.position}`}
            title={`${unit.emoji} ${unit.title}`}
            description={unit.description}
            progress={unit.lessons.length ? unit.completedCount / unit.lessons.length : 0}
            progressLabel={`${unit.completedCount}/${unit.lessons.length}`}
          />
          <PathSection
            accent={accent}
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

      <View style={[styles.section, owns(upcoming) && styles.raised]}>
        <UnitBanner
          accent={LOCKED_ACCENT}
          overline="PRÓXIMO NIVEL · A2"
          title="🚀 Tu camino sigue"
          description="Estamos preparando las próximas unidades. Mientras tanto, repasá y jugá ranked para no perder la racha."
        />
        <PathSection
          accent={LOCKED_ACCENT}
          firstIndex={nextIndex}
          nodes={upcoming}
          selected={selected}
          onSelect={select}
        />
      </View>
    </View>
  );
}

/** Nodos de cada unidad, su color y el índice global donde arranca su tramo del camino. */
function buildSections(units: UnitWithStatus[]) {
  let nextIndex = 0;
  let currentUnitId: string | null = null;
  let currentNodeY = 0;
  const sections = units.map((unit, unitIndex) => {
    const first = nextIndex;
    nextIndex += unit.lessons.length;
    const currentIndex = unit.lessons.findIndex((l) => l.status === 'current');
    if (currentIndex >= 0 && currentUnitId === null) {
      currentUnitId = unit.id;
      currentNodeY = currentIndex * PATH_ROW_HEIGHT + PATH_ROW_HEIGHT / 2;
    }
    let lessonNumber = 0;
    const nodes = unit.lessons.map((lesson): PathNode => {
      const kind = lessonKind(lesson.id);
      if (kind === 'lesson') lessonNumber += 1;
      const overline = kind === 'lesson' ? `LECCIÓN ${lessonNumber}` : KIND_LABEL[kind];
      const stars = lessonStars(lesson.bestAccuracy);
      return {
        key: lesson.id,
        status: lesson.status,
        kind,
        overline,
        title: lesson.title,
        bestAccuracy: lesson.bestAccuracy,
        stars,
        label: `${overline}: ${lesson.title}. ${
          lesson.status === 'locked'
            ? 'Bloqueada'
            : lesson.status === 'current'
              ? 'Siguiente lección'
              : `Completada, ${stars} de 3 estrellas`
        }`,
        lockedMessage: 'Completá las lecciones anteriores para desbloquearla.',
        onStart: () => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } }),
      };
    });
    const accent: PathAccent = pathAccents[unitIndex % pathAccents.length] ?? pathAccents[0];
    return { unit, accent, first, nodes };
  });
  return { sections, nextIndex, currentUnitId: currentUnitId as string | null, currentNodeY };
}

function UnitBanner(props: {
  accent: Accent;
  overline: string;
  title: string;
  description: string;
  progress?: number;
  progressLabel?: string;
}) {
  return (
    <Card gradient={[props.accent.fill, props.accent.lip]} style={styles.banner}>
      <Text variant="overline" color="textStrong">
        {props.overline}
      </Text>
      <Text variant="heading" color="textStrong">
        {props.title}
      </Text>
      <Text variant="caption" color="text">
        {props.description}
      </Text>
      {props.progress !== undefined ? (
        <View style={styles.bannerProgress}>
          <View style={styles.flex}>
            <ProgressBar
              value={props.progress}
              height={6}
              colors={[colors.textStrong, colors.text]}
              accessibilityLabel={`Progreso de la unidad: ${props.progressLabel}`}
            />
          </View>
          <Text variant="caption" color="textStrong">
            {props.progressLabel}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

function PathSection({
  accent,
  firstIndex,
  nodes,
  selected,
  onSelect,
  onLayout,
}: {
  accent: Accent;
  firstIndex: number;
  nodes: PathNode[];
  selected: string | null;
  onSelect: (key: string) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
}) {
  const [width, setWidth] = useState(0);
  const height = nodes.length * PATH_ROW_HEIGHT;
  const points = width ? pathPoints(firstIndex, nodes.length, width) : [];
  const openIndex = nodes.findIndex((n) => n.key === selected);
  const open = nodes[openIndex];
  const openPoint = points[openIndex];

  return (
    <View
      style={[styles.path, { height }]}
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width);
        onLayout?.(e);
      }}
    >
      {width ? (
        <>
          <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
            {points.slice(1).map((to, i) => {
              const from = points[i];
              const node = nodes[i + 1];
              if (!from || !node) return null;
              const reached = node.status !== 'locked';
              return (
                <Path
                  key={node.key}
                  d={segmentPath(from, to)}
                  stroke={reached ? accent.fill : colors.borderStrong}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeDasharray={reached ? undefined : '2 14'}
                  fill="none"
                />
              );
            })}
          </Svg>
          {nodes.map((node, i) => (
            <LessonNode
              key={node.key}
              node={node}
              accent={
                node.status === 'locked' ? LOCKED_ACCENT : node.stars === 3 ? pathGold : accent
              }
              x={points[i]?.x ?? 0}
              y={points[i]?.y ?? 0}
              // El cartel de la lección actual va del lado con más espacio.
              bubbleSide={pathOffset(firstIndex + i, width) > 0 ? 'left' : 'right'}
              onPress={() => (node.status === 'current' ? node.onStart?.() : onSelect(node.key))}
            />
          ))}
          {open && openPoint ? (
            <LessonPopover
              node={open}
              x={openPoint.x}
              top={openPoint.y + (PATH_NODE_SIZE + LIP) / 2 + spacing.md}
              accent={open.stars === 3 ? pathGold : accent}
            />
          ) : null}
        </>
      ) : null}
    </View>
  );
}

function LessonNode({
  node,
  accent,
  x,
  y,
  bubbleSide,
  onPress,
}: {
  node: PathNode;
  accent: Accent;
  x: number;
  y: number;
  bubbleSide: 'left' | 'right';
  onPress: () => void;
}) {
  const locked = node.status === 'locked';
  const current = node.status === 'current';
  const golden = node.stars === 3;
  const iconColor = locked ? colors.textSubtle : golden ? colors.background : colors.onPrimary;
  const Icon =
    node.kind === 'final' ? Trophy : locked ? Lock : current ? KIND_ICON[node.kind] : Check;

  return (
    <View
      style={[
        styles.nodeSlot,
        { left: x - PATH_NODE_SIZE / 2, top: y - (PATH_NODE_SIZE + LIP) / 2 },
      ]}
    >
      {current ? <PulseRing color={accent.fill} /> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={node.label}
        onPress={onPress}
        hitSlop={8}
      >
        {({ pressed }) => (
          <View style={styles.nodeBody}>
            <View style={[styles.nodeLip, { backgroundColor: accent.lip }]} />
            <View
              style={[
                styles.nodeFace,
                { backgroundColor: accent.fill, transform: [{ translateY: pressed ? LIP : 0 }] },
              ]}
            >
              <Icon
                color={iconColor}
                size={30}
                strokeWidth={3}
                fill={current && node.kind === 'lesson' ? iconColor : 'transparent'}
              />
            </View>
          </View>
        )}
      </Pressable>

      {current ? (
        <View
          style={[styles.bubble, bubbleSide === 'left' ? styles.bubbleLeft : styles.bubbleRight]}
          pointerEvents="none"
          accessible={false}
        >
          <Text variant="overline" color="primarySoft">
            EMPEZAR
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/** Recuadro bajo una lección completada (estrellas + repetir) o bloqueada (qué falta). */
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
  const locked = node.status === 'locked';
  const perfect = node.stars === 3;
  const percent = Math.round((node.bestAccuracy ?? 0) * 100);

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      style={[styles.popover, { top }, !locked && { borderColor: accent.fill }]}
    >
      <View
        style={[styles.arrow, { left: x - ARROW / 2 - 1 }, !locked && { borderColor: accent.fill }]}
      />
      <Text variant="overline" color={locked ? 'textMuted' : perfect ? 'gold' : 'primarySoft'}>
        {node.overline}
      </Text>
      <Text variant="heading">{locked ? 'Bloqueada' : node.title}</Text>

      {locked ? (
        <Text color="textMuted">{node.lockedMessage}</Text>
      ) : (
        <>
          <View
            style={styles.popoverStars}
            accessible
            accessibilityLabel={`${node.stars} de 3 estrellas`}
          >
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
            {perfect
              ? '¡Perfecta, sin ningún error! Esta lección ya es dorada.'
              : `Mejor precisión: ${percent} %. Hacela sin errores para ganar las 3 estrellas y volverla dorada.`}
          </Text>
          <Button
            label="Repasar de nuevo"
            icon={<RotateCcw color={colors.onPrimary} size={18} />}
            onPress={node.onStart ?? (() => {})}
          />
        </>
      )}
    </Animated.View>
  );
}

function PulseRing({ color }: { color: string }) {
  const reduceMotion = useReducedMotion();
  const t = useSharedValue(0);

  useEffect(() => {
    if (!reduceMotion) t.value = withRepeat(withTiming(1, { duration: 1400 }), -1, false);
  }, [reduceMotion, t]);

  const style = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0.35 : 0.55 * (1 - t.value),
    transform: [{ scale: reduceMotion ? 1.15 : 1 + 0.4 * t.value }],
  }));

  return <Animated.View style={[styles.pulse, { borderColor: color }, style]} />;
}

const ARROW = 16;

const styles = StyleSheet.create({
  root: { gap: spacing.xxl },
  backdrop: { zIndex: 1 },
  section: { gap: spacing.lg },
  raised: { zIndex: 2 },
  flex: { flex: 1 },
  banner: { gap: spacing.xs },
  bannerProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  path: { width: '100%' },
  nodeSlot: { position: 'absolute', width: PATH_NODE_SIZE, alignItems: 'center' },
  nodeBody: { width: PATH_NODE_SIZE, height: PATH_NODE_SIZE + LIP },
  nodeLip: {
    position: 'absolute',
    bottom: 0,
    width: PATH_NODE_SIZE,
    height: PATH_NODE_SIZE,
    borderRadius: PATH_NODE_SIZE / 2,
  },
  nodeFace: {
    width: PATH_NODE_SIZE,
    height: PATH_NODE_SIZE,
    borderRadius: PATH_NODE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    top: -6,
    width: PATH_NODE_SIZE + 12,
    height: PATH_NODE_SIZE + 12,
    borderRadius: (PATH_NODE_SIZE + 12) / 2,
    borderWidth: 4,
  },
  bubble: {
    position: 'absolute',
    top: PATH_NODE_SIZE / 2 - 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.primaryBright,
  },
  bubbleLeft: { right: PATH_NODE_SIZE + spacing.md },
  bubbleRight: { left: PATH_NODE_SIZE + spacing.md },
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
});
