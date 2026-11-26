import { useEffect, useId, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { getRank } from '@shared/ranking';

import { Avatar } from '@/design-system';

import { FRAME_ART, RANK_FRAME_ART, type FrameArt as FrameImage } from './assets';
import { frameStyle, type FrameStyle } from './visuals';

/** Marcos que brillan (exclusivos): pulso suave detrás del arte, sólo con `animated`. */
const GLOW: Record<string, string> = {
  frame_plus: '#8B5CF6',
  frame_referral_legend: '#FACC15',
};

/** El arte de un marco: imagen (catálogo v2 o el de rango según el ELO) o null si es dibujado. */
export function frameArt(
  frameId: string | null | undefined,
  rating?: number | null,
): FrameImage | null {
  if (!frameId) return null;
  if (frameId === 'frame_rank') {
    return rating == null ? null : RANK_FRAME_ART[getRank(rating).tier.id];
  }
  return FRAME_ART[frameId] ?? null;
}

/**
 * Avatar con el marco que el jugador tiene puesto. Sin marco se ve el avatar solo, o con un aro
 * liso de `fallbackRing` si se pasa (el del perfil propio). El marco de rango necesita `rating` (el
 * ELO real que trae el perfil, la clasificación o la partida): sin él se ve el aro de respaldo.
 */
export function FramedAvatar({
  avatarId,
  photoUrl,
  size,
  frameId,
  rating,
  fallbackRing,
  instant,
  animated,
  stable,
}: {
  avatarId: string | null | undefined;
  photoUrl?: string | null;
  size: number;
  frameId?: string | null;
  rating?: number | null;
  fallbackRing?: string;
  instant?: boolean;
  /** Brillo animado de los exclusivos (sólo en el perfil: no en listas). */
  animated?: boolean;
  /**
   * El avatar SIEMPRE del mismo tamaño y en el mismo lugar, con cualquier marco (o sin marco): ocupa
   * una caja fija y es el marco el que se ajusta al avatar. Para la vista previa al personalizar,
   * donde cambiar de marco no puede mover nada.
   */
  stable?: boolean;
}) {
  const image = frameArt(frameId, rating);
  if (stable) {
    return (
      <StableFramedAvatar
        avatarId={avatarId}
        photoUrl={photoUrl}
        size={size}
        image={image}
        frame={
          frameStyle(frameId) ?? (fallbackRing ? { colors: [fallbackRing, fallbackRing] } : null)
        }
        instant={instant}
        glow={animated && frameId ? GLOW[frameId] : undefined}
      />
    );
  }
  if (image) {
    return (
      <ImageFramedAvatar
        art={image}
        avatarId={avatarId}
        photoUrl={photoUrl}
        size={size}
        instant={instant}
        glow={animated && frameId ? GLOW[frameId] : undefined}
      />
    );
  }

  const frame =
    frameStyle(frameId) ??
    (fallbackRing ? { colors: [fallbackRing, fallbackRing] as const } : null);
  if (!frame)
    return <Avatar avatarId={avatarId} photoUrl={photoUrl} size={size} instant={instant} />;

  const g = frameGeometry(size, Boolean(frame.ornament));
  return (
    <View style={{ width: g.total, height: g.total }}>
      <View style={styles.center}>
        <Avatar avatarId={avatarId} photoUrl={photoUrl} size={size} instant={instant} />
      </View>
      <FrameArt frame={frame} geometry={g} />
    </View>
  );
}

/**
 * Avatar dentro de un marco en imagen: el avatar ocupa el hueco medido del arte y el marco va
 * encima, sin deformarse (se escala con su proporción).
 */
function ImageFramedAvatar({
  art,
  avatarId,
  photoUrl,
  size,
  instant,
  glow,
}: {
  art: FrameImage;
  avatarId: string | null | undefined;
  photoUrl?: string | null;
  size: number;
  instant?: boolean;
  glow?: string;
}) {
  // Ocupa el mismo ancho que un marco dibujado con adornos: las filas (clasificación, amigos,
  // partida) no cambian de tamaño. El avatar llena el 97 % del hueco medido, así el borde interior
  // del aro lo pisa apenas y no queda luz entre los dos.
  const width = frameGeometry(size, true).total;
  const height = width * art.aspect;
  const inner = Math.round(2 * art.r * 0.97 * width);
  const left = art.cx * width - inner / 2;
  const top = art.cy * height - inner / 2;
  return (
    <View style={{ width, height }}>
      {glow ? (
        <Glow color={glow} size={inner * 1.25} x={art.cx * width} y={art.cy * height} />
      ) : null}
      <View style={{ position: 'absolute', left, top }}>
        <Avatar avatarId={avatarId} photoUrl={photoUrl} size={inner} instant={instant} />
      </View>
      <Image
        source={art.source}
        style={[StyleSheet.absoluteFill, { width, height }]}
        resizeMode="contain"
        fadeDuration={0}
        pointerEvents="none"
      />
    </View>
  );
}

/**
 * Caja fija (la de un marco con adornos) con el avatar de `size` siempre centrado. El marco en imagen
 * se escala para que su hueco medido calce justo alrededor del avatar (puede asomar apenas fuera de la
 * caja: no cambia el layout); el aro dibujado se centra igual. Cambiar de marco no mueve nada.
 */
function StableFramedAvatar({
  avatarId,
  photoUrl,
  size,
  image,
  frame,
  instant,
  glow,
}: {
  avatarId: string | null | undefined;
  photoUrl?: string | null;
  size: number;
  image: FrameImage | null;
  frame: FrameStyle | null;
  instant?: boolean;
  glow?: string;
}) {
  const box = frameGeometry(size, true).total;
  const c = box / 2;
  const avatar = (
    <View style={{ position: 'absolute', left: c - size / 2, top: c - size / 2 }}>
      <Avatar avatarId={avatarId} photoUrl={photoUrl} size={size} instant={instant} />
    </View>
  );
  if (image) {
    // El avatar llena el 97 % del hueco (como en el marco normal): el hueco mide size / 0,97.
    const width = size / (2 * image.r * 0.97);
    const height = width * image.aspect;
    return (
      <View style={{ width: box, height: box }}>
        {glow ? <Glow color={glow} size={size * 1.25} x={c} y={c} /> : null}
        {avatar}
        <Image
          source={image.source}
          style={{
            position: 'absolute',
            left: c - image.cx * width,
            top: c - image.cy * height,
            width,
            height,
          }}
          resizeMode="contain"
          fadeDuration={0}
          pointerEvents="none"
        />
      </View>
    );
  }
  if (!frame) {
    return <View style={{ width: box, height: box }}>{avatar}</View>;
  }
  const g = frameGeometry(size, Boolean(frame.ornament));
  return (
    <View style={{ width: box, height: box }}>
      {avatar}
      <View
        style={{ position: 'absolute', left: c - g.total / 2, top: c - g.total / 2 }}
        pointerEvents="none"
      >
        <View style={{ width: g.total, height: g.total }}>
          <FrameArt frame={frame} geometry={g} />
        </View>
      </View>
    </View>
  );
}

/** Halo que late despacio. Respeta "Reducir movimiento": ahí queda fijo. */
function Glow({ color, size, x, y }: { color: string; size: number; x: number; y: number }) {
  const [pulse] = useState(() => new Animated.Value(0.55));
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let alive = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (alive) setReduceMotion(v);
    });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.55,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: Animated.multiply(pulse, 0.35),
        shadowColor: color,
        shadowOpacity: 0.9,
        shadowRadius: size * 0.2,
        shadowOffset: { width: 0, height: 0 },
      }}
    />
  );
}

interface FrameGeometry {
  size: number;
  total: number;
  /** Distancia del borde de la caja al avatar. */
  inset: number;
  ring: number;
  radius: number;
  extra: number;
  c: number;
}

export function frameGeometry(size: number, ornate: boolean): FrameGeometry {
  const ring = Math.max(2.5, size * 0.075);
  const gap = Math.max(1, size * 0.02);
  const extra = ornate ? size * 0.14 : 0;
  const inset = ring + gap + extra;
  const total = size + inset * 2;
  return { size, total, inset, ring, extra, radius: size / 2 + gap + ring / 2, c: total / 2 };
}

/** El aro y sus adornos, dibujados encima del avatar. */
function FrameArt({ frame, geometry }: { frame: FrameStyle; geometry: FrameGeometry }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const { total, ring, radius: r, extra, c } = geometry;
  const accent = frame.accent ?? '#FFFFFF';
  const at = (deg: number, dist: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: c + Math.cos(a) * dist, y: c + Math.sin(a) * dist };
  };

  return (
    <Svg width={total} height={total} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={`ring${id}`} x1="0" y1="0" x2="1" y2="1">
          {frame.colors.map((color, i) => (
            <Stop key={i} offset={i / (frame.colors.length - 1)} stopColor={color} />
          ))}
        </LinearGradient>
      </Defs>

      {frame.ornament === 'flames' ? (
        <G>
          {Array.from({ length: 14 }, (_, i) => {
            const deg = (360 / 14) * i - 90;
            const left = at(deg - 11, r);
            const right = at(deg + 11, r);
            const reach = r + ring / 2 + extra * (i % 2 ? 0.7 : 0.98);
            const tip = at(deg + 5, reach);
            const c1 = at(deg - 8, (r + reach) / 2);
            const c2 = at(deg + 12, (r + reach) / 2);
            return (
              <Path
                key={i}
                d={`M${left.x} ${left.y} Q${c1.x} ${c1.y} ${tip.x} ${tip.y} Q${c2.x} ${c2.y} ${right.x} ${right.y} Z`}
                fill={i % 2 ? '#FDE047' : accent}
              />
            );
          })}
        </G>
      ) : null}

      {frame.ornament === 'laurel' ? (
        <G>
          {[-1, 1].flatMap((side) =>
            Array.from({ length: 6 }, (_, i) => {
              // Hojas desde abajo hacia los costados, en espejo.
              const deg = 90 + side * (22 + i * 22);
              const p = at(deg, r + ring / 2 + extra * 0.45);
              const tilt = deg + 90 + side * 35;
              return (
                <Ellipse
                  key={`${side}${i}`}
                  cx={p.x}
                  cy={p.y}
                  rx={extra * 0.55}
                  ry={extra * 0.26}
                  fill={accent}
                  rotation={tilt}
                  origin={`${p.x}, ${p.y}`}
                />
              );
            }),
          )}
        </G>
      ) : null}

      <Circle cx={c} cy={c} r={r} stroke={`url(#ring${id})`} strokeWidth={ring} fill="none" />

      {frame.ornament === 'dots'
        ? Array.from({ length: 12 }, (_, i) => {
            const p = at(30 * i, r);
            return (
              <Circle key={i} cx={p.x} cy={p.y} r={ring * 0.24} fill="#FFFFFF" opacity={0.85} />
            );
          })
        : null}

      {frame.ornament === 'stars'
        ? [
            { deg: -55, s: 1 },
            { deg: 25, s: 0.6 },
            { deg: 145, s: 0.8 },
            { deg: 210, s: 0.55 },
          ].map(({ deg, s }, i) => {
            const p = at(deg, r + ring * 0.2);
            return <Path key={i} d={sparkle(p.x, p.y, (extra + ring) * 0.75 * s)} fill={accent} />;
          })
        : null}

      {frame.ornament === 'crown' ? (
        <Path
          d={crown(c, c - r, geometry)}
          fill={accent}
          stroke="#854D0E"
          strokeWidth={Math.max(1, ring * 0.25)}
          strokeLinejoin="round"
        />
      ) : null}

      {frame.ornament === 'laurel' ? (
        <Path
          d={gem(c, c - r, (extra + ring) * 0.55)}
          fill="#F472B6"
          stroke="#FFF"
          strokeWidth={1}
        />
      ) : null}

      {frame.ornament === 'gems'
        ? [-90, 0, 90, 180].map((deg) => {
            const p = at(deg, r);
            return (
              <Path
                key={deg}
                d={gem(p.x, p.y, (extra + ring) * (deg === -90 ? 0.6 : 0.42))}
                fill={accent}
                stroke="#4C1D95"
                strokeWidth={1}
              />
            );
          })
        : null}
    </Svg>
  );
}

/** Destello de 4 puntas centrado en (x, y). */
function sparkle(x: number, y: number, s: number) {
  return `M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`;
}

/** Rombo centrado en (x, y). */
function gem(x: number, y: number, s: number) {
  return `M${x} ${y - s} L${x + s * 0.75} ${y} L${x} ${y + s} L${x - s * 0.75} ${y} Z`;
}

/** Corona apoyada en el aro, arriba al centro. */
function crown(cx: number, ringTop: number, g: FrameGeometry) {
  const w = g.size * 0.46;
  const bottom = ringTop + g.ring * 0.6;
  const top = ringTop - g.ring / 2 - g.extra * 0.92;
  const h = bottom - top;
  const l = cx - w / 2;
  const rr = cx + w / 2;
  return [
    `M${l} ${bottom}`,
    `L${l} ${top + h * 0.3}`,
    `L${cx - w / 4} ${top + h * 0.62}`,
    `L${cx} ${top}`,
    `L${cx + w / 4} ${top + h * 0.62}`,
    `L${rr} ${top + h * 0.3}`,
    `L${rr} ${bottom}`,
    'Z',
  ].join(' ');
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
