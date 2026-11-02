import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { Avatar } from '@/design-system';

import { frameStyle, type FrameStyle } from './visuals';

/**
 * Avatar con el marco que el jugador tiene puesto. Sin marco se ve el avatar solo, o con un aro
 * liso de `fallbackRing` si se pasa (el del perfil propio).
 */
export function FramedAvatar({
  avatarId,
  photoUrl,
  size,
  frameId,
  fallbackRing,
  instant,
}: {
  avatarId: string | null | undefined;
  photoUrl?: string | null;
  size: number;
  frameId?: string | null;
  fallbackRing?: string;
  instant?: boolean;
}) {
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
