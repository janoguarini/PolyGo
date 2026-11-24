import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { useTheme } from '@/design-system';
import { languageBackground } from '@/design-system/languageImages';

/**
 * Ambientación fija detrás del mapa de Aprender: la escena del idioma que se estudia
 * (assets/languages, Torre Eiffel para francés, Coliseo para italiano…) o, para un idioma sin
 * escena, la cordillera en tres planos con luz violeta y azul, el sol poniéndose entre nubes,
 * niebla entre los planos, pinos en primer plano y la bandera en la cima (la meta del recorrido).
 * Va detrás del scroll (Screen → background): el camino pasa por encima y nunca tapa botones ni
 * textos.
 */
const SCENES = {
  dark: {
    glow: '#7C3AED',
    glowOpacity: 0.55,
    blueGlow: '#3B82F6',
    blueOpacity: 0.22,
    star: '#C4B5FD',
    far: ['#4B3C9C', '#211955'],
    mid: ['#33246F', '#150E39'],
    near: ['#1A1242', '#0A0720'],
    rim: '#93C5FD',
    rimOpacity: 0.45,
    sunlit: '#C084FC',
    snow: '#C4B5FD',
    mist: '#8B5CF6',
    mistOpacity: 0.28,
    tree: '#07051A',
    pole: '#DDD6FE',
    flag: '#F5F3FF',
    cloud: '#3B2F7A',
    cloudOpacity: 0.75,
    streak: '#F0ABFC',
    ground: '#07060F',
  },
  light: {
    glow: '#8B5CF6',
    glowOpacity: 0.22,
    blueGlow: '#60A5FA',
    blueOpacity: 0.15,
    star: '#A78BFA',
    far: ['#E4DAFF', '#CFC0FF'],
    mid: ['#D2C2FF', '#B9A3FD'],
    near: ['#B7A0FB', '#9C82F2'],
    rim: '#FFFFFF',
    rimOpacity: 0.8,
    sunlit: '#F5D0FE',
    snow: '#FFFFFF',
    mist: '#FFFFFF',
    mistOpacity: 0.55,
    tree: '#7E61E6',
    pole: '#6D28D9',
    flag: '#7C3AED',
    cloud: '#FFFFFF',
    cloudOpacity: 0.85,
    streak: '#FBCFE8',
    ground: '#ECEAF6',
  },
} as const;

// Crestas de cada plano (se reutilizan para el relleno y para la luz de borde).
const FAR_RIDGE =
  'M0 160 L22 150 L40 136 L58 146 L84 128 L104 112 L122 124 L142 118 L168 142 L196 126 L214 114 L236 130 L262 120 L286 98 L304 108 L326 96 L350 112 L372 104 L400 124';
const MID_RIDGE =
  'M0 198 L30 184 L52 172 L76 182 L104 162 L134 146 L156 158 L182 170 L210 164 L240 146 L268 124 L292 100 L318 74 L338 96 L356 112 L378 122 L400 120';
const NEAR_RIDGE =
  'M0 228 Q40 206 84 214 Q130 222 168 210 Q214 196 262 206 Q320 218 360 200 Q384 192 400 196';

/**
 * Velo sobre la foto del idioma para que el camino y los textos se lean: más denso arriba (bajo el
 * encabezado) y abajo (se funde con las pestañas). En claro, un velo claro para el texto oscuro.
 */
const VEILS = {
  dark: ['rgba(10,7,32,0.65)', 'rgba(10,7,32,0.45)', 'rgba(10,7,32,0.5)', 'rgba(7,6,15,0.88)'],
  light: [
    'rgba(246,245,251,0.82)',
    'rgba(246,245,251,0.6)',
    'rgba(246,245,251,0.65)',
    'rgba(236,234,246,0.92)',
  ],
} as const;

export function PathScenery({ language }: { language?: string }) {
  const { scheme } = useTheme();
  const p = SCENES[scheme];
  const photo = languageBackground(language);
  if (photo) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Image source={photo} resizeMode="cover" fadeDuration={0} style={styles.photo} />
        <ExpoLinearGradient
          colors={VEILS[scheme]}
          locations={[0, 0.3, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }
  return (
    <View style={StyleSheet.absoluteFill}>
      <SideCloud color={p.cloud} opacity={p.cloudOpacity} style={styles.cloudRight} width={170} />
      <SideCloud
        color={p.cloud}
        opacity={p.cloudOpacity * 0.7}
        style={styles.cloudLeft}
        width={120}
        flip
      />
      <View style={styles.scene}>
        <Svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice">
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="100%" rx="70%" ry="75%">
              <Stop offset="0" stopColor={p.glow} stopOpacity={p.glowOpacity} />
              <Stop offset="1" stopColor={p.glow} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="blue" cx="15%" cy="70%" rx="45%" ry="55%">
              <Stop offset="0" stopColor={p.blueGlow} stopOpacity={p.blueOpacity} />
              <Stop offset="1" stopColor={p.blueGlow} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="halo" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#FDBA74" stopOpacity={0.55} />
              <Stop offset="0.5" stopColor="#F472B6" stopOpacity={0.22} />
              <Stop offset="1" stopColor="#A855F7" stopOpacity={0} />
            </RadialGradient>
            <LinearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FEF3C7" />
              <Stop offset="0.45" stopColor="#FDBA74" />
              <Stop offset="1" stopColor="#EC4899" />
            </LinearGradient>
            <LinearGradient id="far" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.35" stopColor={p.far[0]} />
              <Stop offset="1" stopColor={p.far[1]} />
            </LinearGradient>
            <LinearGradient id="mid" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.3" stopColor={p.mid[0]} />
              <Stop offset="1" stopColor={p.mid[1]} />
            </LinearGradient>
            <LinearGradient id="near" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.75" stopColor={p.near[0]} />
              <Stop offset="1" stopColor={p.near[1]} />
            </LinearGradient>
            {/* Niebla: sube desde la base de cada plano y se disuelve hacia arriba. */}
            <LinearGradient id="mist" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0" stopColor={p.mist} stopOpacity={p.mistOpacity} />
              <Stop offset="1" stopColor={p.mist} stopOpacity={0} />
            </LinearGradient>
            {/* Funde la base con la barra de pestañas. */}
            <LinearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={p.ground} stopOpacity={0} />
              <Stop offset="1" stopColor={p.ground} stopOpacity={0.9} />
            </LinearGradient>
          </Defs>

          <Ellipse cx={200} cy={270} rx={320} ry={210} fill="url(#glow)" />
          <Rect x={0} y={60} width={400} height={200} fill="url(#blue)" />
          {STARS.map(([cx, cy, r]) => (
            <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={p.star} opacity={0.6} />
          ))}

          {/* Sol del atardecer, con nubes finas cruzándolo. */}
          <Circle cx={252} cy={128} r={92} fill="url(#halo)" />
          <Circle cx={252} cy={128} r={38} fill="url(#sun)" />
          <G opacity={0.55}>
            <Rect x={196} y={118} width={84} height={4} rx={2} fill={p.streak} />
            <Rect x={226} y={130} width={70} height={3} rx={1.5} fill={p.streak} />
            <Rect x={206} y={141} width={58} height={3} rx={1.5} fill={p.streak} />
          </G>

          {/* Plano lejano: más claro, iluminado por el cielo. */}
          <Path d={`${FAR_RIDGE} L400 260 L0 260 Z`} fill="url(#far)" />
          <Path
            d={FAR_RIDGE}
            stroke={p.rim}
            strokeOpacity={p.rimOpacity * 0.6}
            strokeWidth={1}
            fill="none"
          />
          <Rect x={0} y={130} width={400} height={60} fill="url(#mist)" />
          <Cloud cx={118} cy={128} scale={0.9} color={p.cloud} opacity={p.cloudOpacity * 0.8} />

          {/* Plano medio con la cima y la bandera. */}
          <Path d={`${MID_RIDGE} L400 260 L0 260 Z`} fill="url(#mid)" />
          {/* Laderas que miran al sol y luz azul en los bordes. */}
          <Path
            d="M318 74 L292 100 L268 124 L250 140 L282 118 L304 96 Z"
            fill={p.sunlit}
            opacity={0.35}
          />
          <Path d="M134 146 L104 162 L90 172 L120 160 Z" fill={p.sunlit} opacity={0.22} />
          <Path
            d={MID_RIDGE}
            stroke={p.rim}
            strokeOpacity={p.rimOpacity}
            strokeWidth={1.2}
            fill="none"
          />
          <Path d="M318 74 L306 90 L313 88 L318 95 L325 88 L331 93 Z" fill={p.snow} />
          <Path d="M318 75 L318 44" stroke={p.pole} strokeWidth={1.6} strokeLinecap="round" />
          <Path d="M318.5 45 L339 50.5 L318.5 56 Z" fill={p.flag} />
          <Rect x={0} y={170} width={400} height={50} fill="url(#mist)" />
          <Cloud cx={356} cy={150} scale={0.75} color={p.cloud} opacity={p.cloudOpacity * 0.7} />

          {/* Primer plano: colinas y pinos en silueta. */}
          <Path d={`${NEAR_RIDGE} L400 260 L0 260 Z`} fill="url(#near)" />
          <Path
            d={NEAR_RIDGE}
            stroke={p.rim}
            strokeOpacity={p.rimOpacity * 0.5}
            strokeWidth={1}
            fill="none"
          />
          {TREES.map(([x, y, s]) => (
            <Pine key={`${x}-${y}`} x={x} y={y} size={s} color={p.tree} />
          ))}
          {FIREFLIES.map(([cx, cy]) => (
            <Circle key={`f-${cx}`} cx={cx} cy={cy} r={1.1} fill="#FDE68A" opacity={0.7} />
          ))}
          <Rect x={0} y={210} width={400} height={50} fill="url(#ground)" />
        </Svg>
      </View>
    </View>
  );
}

/** Estrellitas del cielo: [x, y, radio] en el viewBox de la escena. */
const STARS: readonly (readonly [number, number, number])[] = [
  [24, 34, 1.2],
  [70, 70, 0.8],
  [118, 22, 1],
  [168, 58, 0.9],
  [204, 18, 0.7],
  [346, 30, 1.2],
  [386, 64, 0.9],
];

/** Pinos sobre las colinas cercanas: [x, base, alto]. */
const TREES: readonly (readonly [number, number, number])[] = [
  [8, 222, 20],
  [22, 216, 28],
  [38, 214, 18],
  [56, 212, 24],
  [300, 214, 18],
  [332, 206, 26],
  [350, 202, 32],
  [370, 198, 22],
  [388, 196, 28],
];

/** Luciérnagas sobre el primer plano: [x, y]. */
const FIREFLIES: readonly (readonly [number, number])[] = [
  [96, 226],
  [150, 236],
  [236, 226],
  [282, 238],
];

/** Pino en tres pisos. */
function Pine({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const w = size * 0.42;
  return (
    <Path
      d={`M${x} ${y - size} L${x + w * 0.6} ${y - size * 0.6} L${x + w * 0.35} ${y - size * 0.6} L${x + w * 0.85} ${y - size * 0.25} L${x + w * 0.5} ${y - size * 0.25} L${x + w} ${y} L${x - w} ${y} L${x - w * 0.5} ${y - size * 0.25} L${x - w * 0.85} ${y - size * 0.25} L${x - w * 0.35} ${y - size * 0.6} L${x - w * 0.6} ${y - size * 0.6} Z`}
      fill={color}
    />
  );
}

/** Nube suave hecha de lóbulos, dentro de la escena. */
function Cloud({
  cx,
  cy,
  scale,
  color,
  opacity,
}: {
  cx: number;
  cy: number;
  scale: number;
  color: string;
  opacity: number;
}) {
  const s = scale;
  return (
    <G opacity={opacity}>
      <Ellipse cx={cx} cy={cy} rx={34 * s} ry={7 * s} fill={color} />
      <Circle cx={cx - 12 * s} cy={cy - 5 * s} r={10 * s} fill={color} />
      <Circle cx={cx + 6 * s} cy={cy - 9 * s} r={13 * s} fill={color} />
      <Circle cx={cx + 20 * s} cy={cy - 3 * s} r={8 * s} fill={color} />
    </G>
  );
}

/** Nube del cielo que asoma desde un borde de la pantalla. */
function SideCloud({
  color,
  opacity,
  width,
  style,
  flip,
}: {
  color: string;
  opacity: number;
  width: number;
  style: object;
  flip?: boolean;
}) {
  return (
    <View style={[styles.cloud, style, flip && styles.flip]}>
      <Svg width={width} height={width * 0.42} viewBox="0 0 120 50">
        <G opacity={opacity}>
          <Ellipse cx={62} cy={40} rx={56} ry={9} fill={color} />
          <Circle cx={36} cy={32} r={14} fill={color} />
          <Circle cx={60} cy={24} r={20} fill={color} />
          <Circle cx={84} cy={30} r={15} fill={color} />
          <Circle cx={100} cy={36} r={9} fill={color} />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  photo: { width: '100%', height: '100%' },
  scene: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '46%' },
  cloud: { position: 'absolute' },
  flip: { transform: [{ scaleX: -1 }] },
  cloudRight: { top: '28%', right: -48 },
  cloudLeft: { top: '47%', left: -40 },
});
