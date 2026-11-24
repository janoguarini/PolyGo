import { Platform, StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { useStrings } from '@/i18n';

import { welcomeStrings } from '../strings';
import { welcome } from './welcomeTheme';

/** Logo oficial de Google ("G" multicolor) sobre un círculo blanco. */
export function GoogleIcon({ size = 30 }: { size?: number }) {
  const g = size * 0.6;
  return (
    <View style={[styles.googleCircle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={g} height={g} viewBox="0 0 48 48">
        <Path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <Path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <Path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <Path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
      </Svg>
    </View>
  );
}

/** Fuente de sistema en negrita cursiva para el texto SVG (react-native-svg no usa la de RN). */
const SVG_FONT = Platform.select({
  ios: 'Helvetica Neue',
  android: 'sans-serif',
  default: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
});

/**
 * Titular en dos líneas: la primera blanca con rayitas de "energía" a los costados y la segunda
 * con degradado violeta. Va todo en un mismo SVG para que ambas líneas usen la misma fuente; React
 * Native no rellena texto con degradados sin una dependencia nativa extra.
 */
export function Headline({
  width,
  fontSize,
  lineHeight,
}: {
  width: number;
  fontSize: number;
  lineHeight: number;
}) {
  const t = useStrings(welcomeStrings);
  const cx = width / 2;
  const base = lineHeight * 0.8;
  // "Aprendé jugando." mide ~9 × fontSize: las rayitas van justo afuera de ese ancho.
  const ray = fontSize * 0.62;
  const reach = Math.min(fontSize * 4.6 + 6, cx - ray);
  const rays = (dir: 1 | -1) => {
    const x0 = cx + dir * reach;
    const y0 = lineHeight * 0.5;
    const p = (dx: number, dy: number) => `${x0 + dir * dx * ray},${y0 + dy * ray}`;
    return (
      <Path
        d={`M${p(0.15, -0.55)} L${p(0.6, -0.95)} M${p(0.2, -0.05)} L${p(0.95, -0.1)} M${p(0.15, 0.45)} L${p(0.6, 0.8)}`}
        stroke={welcome.text}
        strokeWidth={Math.max(2, fontSize * 0.075)}
        strokeLinecap="round"
      />
    );
  };
  const common = {
    x: cx,
    textAnchor: 'middle' as const,
    fontSize,
    fontWeight: '900' as const,
    fontStyle: 'italic' as const,
    fontFamily: SVG_FONT,
    letterSpacing: -0.4,
  };
  return (
    <Svg width={width} height={lineHeight * 2}>
      <Defs>
        <LinearGradient id="headline" x1="0" y1="0" x2="1" y2="0.4">
          <Stop offset="0" stopColor={welcome.headline[0]} />
          <Stop offset="0.45" stopColor={welcome.headline[1]} />
          <Stop offset="1" stopColor={welcome.headline[2]} />
        </LinearGradient>
      </Defs>
      {rays(-1)}
      {rays(1)}
      <SvgText {...common} y={base} fill={welcome.text}>
        {t.headlineLine1}
      </SvgText>
      <SvgText {...common} y={base + lineHeight} fill="url(#headline)">
        {t.headlineLine2}
      </SvgText>
    </Svg>
  );
}

/**
 * Fondo: brillo radial violeta/magenta detrás de la ilustración y arcos luminosos abajo, como en
 * la referencia. No recibe toques.
 */
export function WelcomeBackdrop({
  width,
  height,
  glowY,
}: {
  width: number;
  height: number;
  /** Centro vertical del brillo (centro de la ilustración). */
  glowY: number;
}) {
  const arcY = height - 48;
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <RadialGradient
          id="halo"
          cx={width / 2}
          cy={glowY}
          r={width * 0.75}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor={welcome.glow} stopOpacity={0.5} />
          <Stop offset="0.45" stopColor={welcome.glowPink} stopOpacity={0.12} />
          <Stop offset="1" stopColor={welcome.glow} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient
          id="floor"
          cx={width / 2}
          cy={height + 40}
          r={width * 0.9}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor={welcome.glow} stopOpacity={0.35} />
          <Stop offset="1" stopColor={welcome.glow} stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="arcL" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={welcome.glowPink} stopOpacity={0.9} />
          <Stop offset="1" stopColor={welcome.glow} stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id="arcR" x1="1" y1="0" x2="0" y2="0">
          <Stop offset="0" stopColor={welcome.glowPink} stopOpacity={0.9} />
          <Stop offset="1" stopColor={welcome.glow} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#halo)" />
      <Rect x={0} y={height * 0.55} width={width} height={height * 0.45} fill="url(#floor)" />
      <Path
        d={`M -10 ${arcY + 20} Q ${width * 0.18} ${arcY + 62} ${width * 0.5} ${arcY + 74}`}
        stroke="url(#arcL)"
        strokeWidth={2.5}
        fill="none"
      />
      <Path
        d={`M ${width + 10} ${arcY + 20} Q ${width * 0.82} ${arcY + 62} ${width * 0.5} ${arcY + 74}`}
        stroke="url(#arcR)"
        strokeWidth={2.5}
        fill="none"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  googleCircle: { backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
});
