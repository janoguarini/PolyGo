import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

/**
 * Colores del arte del cofre (como PolyCoin: el dibujo es igual en ambos temas). Violeta intenso
 * con herrajes dorados.
 */
export const LEGEND = {
  violet: '#7B2EFF',
  violetBright: '#B84DFF',
  violetDeep: '#3A1296',
  night: '#0D0A1C',
  gold: '#FFD54A',
  goldDeep: '#C8891A',
  goldLight: '#FFF1B8',
} as const;

/**
 * El cofre legendario de la recompensa diaria, dibujado en SVG. Flota, brilla y tiene partículas
 * (sin animación si el sistema pide reducir movimiento). `open` lo muestra abierto con un haz de
 * luz; `celebrate` reproduce la apertura (sólo tras un cobro real). Decorativo: el texto accesible
 * lo pone la pantalla.
 */
export function LegendaryChest({
  size,
  open,
  celebrate,
}: {
  size: number;
  open: boolean;
  celebrate: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const float = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    const ease = Easing.inOut(Easing.sin);
    float.value = withRepeat(withTiming(1, { duration: 2400, easing: ease }), -1, true);
    pulse.value = withRepeat(withTiming(1, { duration: 2000, easing: ease }), -1, true);
  }, [reduceMotion, float, pulse]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -size * 0.035 * float.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.7 + 0.3 * pulse.value,
    transform: [{ scale: 0.94 + 0.08 * pulse.value }],
  }));
  const shadowStyle = useAnimatedStyle(() => ({
    opacity: 0.55 - 0.2 * float.value,
    transform: [{ scaleX: 1 - 0.1 * float.value }],
  }));

  const box = { width: size * 1.5, height: size * 1.12 };
  const chestW = size;
  const chestH = size * (220 / 240);

  return (
    <View
      style={[styles.root, box]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      {/* Resplandor violeta y dorado detrás del cofre. */}
      <Animated.View style={[StyleSheet.absoluteFill, glowStyle]} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 300 224">
          <Defs>
            <RadialGradient id="lc-halo" cx="50%" cy="52%" r="50%">
              <Stop offset="0" stopColor={LEGEND.violetBright} stopOpacity={0.75} />
              <Stop offset="0.45" stopColor={LEGEND.violet} stopOpacity={0.35} />
              <Stop offset="1" stopColor={LEGEND.violet} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="lc-core" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={LEGEND.gold} stopOpacity={open ? 0.55 : 0.3} />
              <Stop offset="1" stopColor={LEGEND.gold} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx="150" cy="116" rx="150" ry="108" fill="url(#lc-halo)" />
          <Ellipse cx="150" cy="112" rx="78" ry="62" fill="url(#lc-core)" />
        </Svg>
      </Animated.View>

      <Sparkles size={size} animate={!reduceMotion} />

      {/* Sombra en el piso (se achica cuando el cofre sube). */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shadow,
          {
            width: chestW * 0.95,
            height: chestW * 0.14,
            // Centrada en la base del cofre (y = 200 de 220 en el dibujo).
            bottom: (box.height - chestH) / 2 + chestH * (20 / 220) - chestW * 0.07,
          },
          shadowStyle,
        ]}
      >
        {/* Elipse difusa (un View redondeado se veía como un rectángulo oscuro). */}
        <Svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
          <Defs>
            <RadialGradient id="lc-floor" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#000000" stopOpacity={0.7} />
              <Stop offset="1" stopColor="#000000" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx="50" cy="10" rx="50" ry="10" fill="url(#lc-floor)" />
        </Svg>
      </Animated.View>

      <Animated.View style={floatStyle}>
        <Animated.View
          key={open ? 'open' : 'closed'}
          entering={celebrate && !reduceMotion ? ZoomIn.springify().damping(9) : undefined}
        >
          {open ? (
            <OpenChestArt width={chestW} height={chestH} />
          ) : (
            <ChestArt width={chestW} height={chestH} />
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

/** Definiciones compartidas por el cofre cerrado y el abierto. */
function ChestDefs() {
  return (
    <>
      <LinearGradient id="lc-body" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#8E3CFF" />
        <Stop offset="0.55" stopColor="#5E1BD6" />
        <Stop offset="1" stopColor="#35107E" />
      </LinearGradient>
      <LinearGradient id="lc-lid" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={LEGEND.violetBright} />
        <Stop offset="0.6" stopColor={LEGEND.violet} />
        <Stop offset="1" stopColor="#5A1CC9" />
      </LinearGradient>
      <LinearGradient id="lc-gold" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={LEGEND.goldLight} />
        <Stop offset="0.45" stopColor={LEGEND.gold} />
        <Stop offset="1" stopColor={LEGEND.goldDeep} />
      </LinearGradient>
      <LinearGradient id="lc-gold-side" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor={LEGEND.goldDeep} />
        <Stop offset="0.35" stopColor={LEGEND.gold} />
        <Stop offset="0.6" stopColor={LEGEND.goldLight} />
        <Stop offset="1" stopColor={LEGEND.goldDeep} />
      </LinearGradient>
      {/* Sombra lateral: luz desde la izquierda, volumen hacia la derecha. */}
      <LinearGradient id="lc-shade" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.12} />
        <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity={0} />
        <Stop offset="1" stopColor="#000000" stopOpacity={0.32} />
      </LinearGradient>
    </>
  );
}

/** Cuerpo del cofre (base, bandas, esquinas y tachas). Igual abierto o cerrado. */
function ChestBody() {
  return (
    <G>
      <Rect x="30" y="104" width="180" height="94" rx="14" fill="url(#lc-body)" />
      {/* Tablas: líneas oscuras y un borde superior claro. */}
      <Rect x="30" y="140" width="180" height="2.5" fill="#24096B" opacity={0.55} />
      <Rect x="30" y="170" width="180" height="2.5" fill="#24096B" opacity={0.55} />
      <Rect x="36" y="112" width="168" height="3" rx="1.5" fill="#FFFFFF" opacity={0.18} />
      {/* Bandas doradas verticales. */}
      <Rect x="52" y="104" width="18" height="94" fill="url(#lc-gold-side)" />
      <Rect x="170" y="104" width="18" height="94" fill="url(#lc-gold-side)" />
      <Rect x="30" y="104" width="180" height="94" rx="14" fill="url(#lc-shade)" />
      {/* Base dorada. */}
      <Rect x="26" y="186" width="188" height="14" rx="6" fill="url(#lc-gold)" />
      <Rect x="26" y="196" width="188" height="4" rx="2" fill={LEGEND.goldDeep} opacity={0.7} />
      {/* Esquineros. */}
      <Path d="M30 150 V118 Q30 104 44 104 H52 V114 H40 V150 Z" fill="url(#lc-gold)" />
      <Path d="M210 150 V118 Q210 104 196 104 H188 V114 H200 V150 Z" fill="url(#lc-gold)" />
      {/* Tachas. */}
      {[124, 156].map((y) => (
        <G key={y}>
          <Circle cx="61" cy={y} r="3.2" fill={LEGEND.goldLight} />
          <Circle cx="179" cy={y} r="3.2" fill={LEGEND.goldLight} />
        </G>
      ))}
    </G>
  );
}

/** Cerradura dorada con ojo de llave y una gema arriba. */
function Lock({ y }: { y: number }) {
  return (
    <G transform={`translate(0 ${y})`}>
      <Path
        d="M98 0 H142 Q148 0 148 6 V30 Q148 44 120 56 Q92 44 92 30 V6 Q92 0 98 0 Z"
        fill="url(#lc-gold)"
        stroke="#8A5A0C"
        strokeWidth="1.5"
      />
      <Path
        d="M101 5 H139 Q143 5 143 9 V29 Q143 40 120 50 Q97 40 97 29 V9 Q97 5 101 5 Z"
        fill="none"
        stroke={LEGEND.goldLight}
        strokeWidth="1.2"
        opacity={0.8}
      />
      <Circle cx="120" cy="22" r="6.5" fill="#2A0A63" />
      <Path d="M116.5 24 L123.5 24 L125 38 L115 38 Z" fill="#2A0A63" />
      <Path d="M102 9 H120 L104 26 Z" fill="#FFFFFF" opacity={0.22} />
    </G>
  );
}

function ChestArt({ width, height }: { width: number; height: number }) {
  const lid = 'M30 108 V80 Q30 34 120 34 Q210 34 210 80 V108 Z';
  return (
    <Svg width={width} height={height} viewBox="0 0 240 220">
      <Defs>
        <ChestDefs />
        <ClipPath id="lc-lid-clip">
          <Path d={lid} />
        </ClipPath>
      </Defs>
      <ChestBody />
      {/* Tapa abovedada. */}
      <Path d={lid} fill="url(#lc-lid)" />
      <G clipPath="url(#lc-lid-clip)">
        <Rect x="52" y="20" width="18" height="90" fill="url(#lc-gold-side)" />
        <Rect x="170" y="20" width="18" height="90" fill="url(#lc-gold-side)" />
        <Path d={lid} fill="url(#lc-shade)" />
        {/* Brillo de la tapa. */}
        <Path d="M44 78 Q48 46 104 40 Q70 52 60 82 Z" fill="#FFFFFF" opacity={0.28} />
        <Rect x="30" y="64" width="180" height="2.5" fill="#3B0C99" opacity={0.4} />
      </G>
      <Path d={lid} fill="none" stroke={LEGEND.gold} strokeWidth="4" />
      {/* Borde inferior de la tapa. */}
      <Rect x="24" y="98" width="192" height="14" rx="6" fill="url(#lc-gold)" />
      <Rect x="24" y="108" width="192" height="4" rx="2" fill={LEGEND.goldDeep} opacity={0.7} />
      {/* Gema de la tapa. */}
      <Path
        d="M120 36 L135 52 L120 70 L105 52 Z"
        fill="#5B0FC4"
        stroke={LEGEND.gold}
        strokeWidth="3"
      />
      <Path d="M120 36 L135 52 L120 52 Z" fill="#F3D9FF" />
      <Path d="M120 36 L105 52 L120 52 Z" fill="#D29BFF" />
      <Path d="M105 52 L120 52 L120 70 Z" fill="#9B3BFF" />
      <Path d="M120 52 L135 52 L120 70 Z" fill="#7420E6" />
      <Circle cx="115" cy="45" r="1.8" fill="#FFFFFF" />
      <Lock y={92} />
    </Svg>
  );
}

function OpenChestArt({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 240 220">
      <Defs>
        <ChestDefs />
        <LinearGradient id="lc-inside" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#2A0A63" />
          <Stop offset="1" stopColor="#4B16AE" />
        </LinearGradient>
        <LinearGradient id="lc-beam" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor={LEGEND.goldLight} stopOpacity={0.95} />
          <Stop offset="0.5" stopColor={LEGEND.gold} stopOpacity={0.45} />
          <Stop offset="1" stopColor={LEGEND.gold} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {/* Tapa abierta (vista desde adentro), inclinada hacia atrás. */}
      <Path d="M38 102 L50 22 Q120 4 190 22 L202 102 Z" fill="url(#lc-inside)" />
      <Path
        d="M38 102 L50 22 Q120 4 190 22 L202 102"
        fill="none"
        stroke="url(#lc-gold)"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <Rect x="66" y="14" width="14" height="88" fill="url(#lc-gold-side)" opacity={0.85} />
      <Rect x="160" y="14" width="14" height="88" fill="url(#lc-gold-side)" opacity={0.85} />
      {/* Haz de luz que sale del cofre. */}
      <Path d="M44 108 L4 0 H236 L196 108 Z" fill="url(#lc-beam)" />
      <Ellipse cx="120" cy="106" rx="84" ry="12" fill={LEGEND.goldLight} opacity={0.95} />
      <ChestBody />
      <Rect x="24" y="98" width="192" height="12" rx="6" fill="url(#lc-gold)" />
      <Lock y={110} />
    </Svg>
  );
}

/** Partículas doradas y violetas (posiciones fijas, parpadeo escalonado). */
const SPARKS = [
  { x: 0.1, y: 0.22, s: 0.09, c: LEGEND.gold, d: 0 },
  { x: 0.84, y: 0.14, s: 0.075, c: LEGEND.goldLight, d: 500 },
  { x: 0.9, y: 0.58, s: 0.06, c: LEGEND.violetBright, d: 900 },
  { x: 0.05, y: 0.66, s: 0.055, c: LEGEND.violetBright, d: 1300 },
  { x: 0.26, y: 0.03, s: 0.05, c: LEGEND.goldLight, d: 300 },
  { x: 0.7, y: 0.0, s: 0.045, c: LEGEND.gold, d: 1100 },
  { x: 0.18, y: 0.86, s: 0.04, c: LEGEND.gold, d: 700 },
  { x: 0.78, y: 0.86, s: 0.05, c: LEGEND.goldLight, d: 1500 },
] as const;

function Sparkles({ size, animate }: { size: number; animate: boolean }) {
  const w = size * 1.5;
  const h = size * 1.12;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {SPARKS.map((p, i) => (
        <Spark
          key={i}
          left={p.x * w}
          top={p.y * h}
          size={Math.max(8, p.s * size * 1.4)}
          color={p.c}
          delay={p.d}
          animate={animate}
        />
      ))}
    </View>
  );
}

function Spark({
  left,
  top,
  size,
  color,
  delay,
  animate,
}: {
  left: number;
  top: number;
  size: number;
  color: string;
  delay: number;
  animate: boolean;
}) {
  const t = useSharedValue(animate ? 0 : 1);
  useEffect(() => {
    if (!animate) return;
    t.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: 900 }), withTiming(0.15, { duration: 1100 })),
        -1,
        false,
      ),
    );
  }, [animate, delay, t]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.25 + 0.75 * t.value,
    transform: [{ scale: 0.6 + 0.4 * t.value }, { rotate: `${t.value * 45}deg` }],
  }));
  return (
    <Animated.View style={[{ position: 'absolute', left, top, width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 20 20">
        <Path
          d="M10 0 Q11.4 8.6 20 10 Q11.4 11.4 10 20 Q8.6 11.4 0 10 Q8.6 8.6 10 0 Z"
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center' },
  shadow: { position: 'absolute', alignSelf: 'center' },
});
