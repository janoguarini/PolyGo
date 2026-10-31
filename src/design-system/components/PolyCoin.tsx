import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

/**
 * La moneda Polys: disco dorado con canto y una gema violeta de 6 lados (el "poly" de Polygo).
 * Decorativa: quien la usa pone el texto accesible.
 */
export function PolyCoin({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" accessible={false}>
      <Defs>
        <LinearGradient id="poly-rim" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFE38A" />
          <Stop offset="1" stopColor="#C8891A" />
        </LinearGradient>
        <LinearGradient id="poly-face" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F9D45C" />
          <Stop offset="1" stopColor="#E0A82E" />
        </LinearGradient>
        <LinearGradient id="poly-gem" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#B58CFF" />
          <Stop offset="1" stopColor="#6D28D9" />
        </LinearGradient>
      </Defs>
      <Circle cx="16" cy="16" r="15" fill="url(#poly-rim)" />
      <Circle cx="16" cy="16" r="12" fill="url(#poly-face)" />
      {/* Hexágono con una faceta clara arriba. */}
      <Path d="M16 7.5 L23.4 11.75 V20.25 L16 24.5 L8.6 20.25 V11.75 Z" fill="url(#poly-gem)" />
      <Path d="M16 7.5 L23.4 11.75 L16 16 L8.6 11.75 Z" fill="#FFFFFF" opacity={0.28} />
    </Svg>
  );
}
