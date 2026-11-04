import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/** Violeta apagado: un detalle que acompaña al emblema sin competir con él. */
const LEAF_COLOR = 'rgba(139, 112, 230, 0.5)';
/** Pares de hojas por rama (más la hoja de la punta). */
const PAIRS = 5;

type Pt = { x: number; y: number };

const f = (n: number) => n.toFixed(2);

/** Hoja en forma de almendra: nace en `base`, apunta hacia `angle` (grados) y mide `len` × `wid`. */
function leaf(base: Pt, angle: number, len: number, wid: number) {
  const rad = (angle * Math.PI) / 180;
  const ux = Math.cos(rad);
  const uy = Math.sin(rad);
  const tip = { x: base.x + ux * len, y: base.y + uy * len };
  const mid = { x: base.x + ux * len * 0.5, y: base.y + uy * len * 0.5 };
  const a = { x: mid.x - uy * wid, y: mid.y + ux * wid };
  const b = { x: mid.x + uy * wid, y: mid.y - ux * wid };
  return `M${f(base.x)} ${f(base.y)} Q${f(a.x)} ${f(a.y)} ${f(tip.x)} ${f(tip.y)} Q${f(b.x)} ${f(b.y)} ${f(base.x)} ${f(base.y)} Z`;
}

/** Una rama: tallo (curva cuadrática) y hojas. `side` 1 = derecha, -1 = izquierda (espejo). */
function branch(size: number, w: number, side: 1 | -1) {
  const cx = w / 2;
  const cy = size / 2;
  const at = (dx: number, dy: number): Pt => ({ x: cx + side * dx * size, y: cy + dy * size });
  const p0 = at(0.24, 0.42);
  const p1 = at(0.64, 0.36);
  const p2 = at(0.58, -0.14);
  const point = (t: number): Pt => ({
    x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
    y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
  });
  const tangent = (t: number) => {
    const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
    const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const leaves: string[] = [];
  for (let i = 0; i < PAIRS; i++) {
    const t = 0.16 + (i / PAIRS) * 0.78;
    const base = point(t);
    const dir = tangent(t);
    const len = size * (0.2 - i * 0.012);
    const wid = len * 0.32;
    leaves.push(leaf(base, dir + side * 36, len, wid)); // hacia afuera
    leaves.push(leaf(base, dir - side * 32, len * 0.9, wid * 0.9)); // hacia el emblema
  }
  leaves.push(leaf(p2, tangent(1), size * 0.17, size * 0.05));

  return {
    stem: `M${f(p0.x)} ${f(p0.y)} Q${f(p1.x)} ${f(p1.y)} ${f(p2.x)} ${f(p2.y)}`,
    leaves: leaves.join(' '),
  };
}

/**
 * Envuelve un emblema de `size` px con dos ramas de laurel en espejo: nacen junto a la base del
 * emblema y se abren hacia afuera y arriba hasta la mitad de su altura.
 */
export function Laurels({ size, children }: { size: number; children: ReactNode }) {
  const w = size * 1.62;
  const branches = [branch(size, w, 1), branch(size, w, -1)];
  return (
    <View style={{ width: w, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={w} height={size} style={StyleSheet.absoluteFill} pointerEvents="none">
        {branches.map((b, i) => (
          <Path key={`s${i}`} d={b.stem} stroke={LEAF_COLOR} strokeWidth={1.4} fill="none" />
        ))}
        {branches.map((b, i) => (
          <Path key={`l${i}`} d={b.leaves} fill={LEAF_COLOR} />
        ))}
      </Svg>
      {children}
    </View>
  );
}
