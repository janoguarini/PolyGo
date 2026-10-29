import { useMemo } from 'react';
import Svg, { Defs, LinearGradient, Path, Polygon, Stop } from 'react-native-svg';

import { TIERS, getRank, type Division, type TierId } from '@shared/ranking';

import { TIER_COLORS } from '../rankTheme';

export interface RankEmblemProps {
  tier: TierId;
  division?: Division | null;
  size?: number;
  /** En colocación el emblema se muestra apagado. */
  dimmed?: boolean;
}

const SHIELD = 'M50 4 L90 20 L86 62 Q80 84 50 96 Q20 84 14 62 L10 20 Z';
const INNER = 'M50 15 L79 27 L76 60 Q71 77 50 86 Q29 77 24 60 L21 27 Z';
const CROWN = 'M30 14 L36 2 L43 10 L50 0 L57 10 L64 2 L70 14 Z';
const DIVISION_PIPS: Record<Division, number> = { III: 1, II: 2, I: 3 };

function regularPolygon(sides: number, radius: number, cx = 50, cy = 50): string {
  return Array.from({ length: sides }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');
}

function star(points: number, outer: number, inner: number, cx = 50, cy = 50): string {
  return Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / points;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');
}

/** Emblema propio: la gema central gana lados con cada tier; los tiers altos usan estrella y corona. */
export function RankEmblem({ tier, division = null, size = 64, dimmed = false }: RankEmblemProps) {
  const tierIndex = TIERS.findIndex((t) => t.id === tier);
  const c = TIER_COLORS[tier];
  const gem = useMemo(
    () => (tierIndex >= 6 ? star(5 + (tierIndex - 6), 17, 8) : regularPolygon(3 + tierIndex, 15)),
    [tierIndex],
  );
  const gradId = `rank-${tier}`;
  const pips = division ? DIVISION_PIPS[division] : 0;

  return (
    <Svg width={size} height={size} viewBox="0 -4 100 104" opacity={dimmed ? 0.4 : 1}>
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.light} />
          <Stop offset="1" stopColor={c.dark} />
        </LinearGradient>
        <LinearGradient id={`${gradId}-in`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#1A1636" />
          <Stop offset="1" stopColor="#0B0A1A" />
        </LinearGradient>
      </Defs>
      <Path d={SHIELD} fill={`url(#${gradId})`} />
      <Path d={INNER} fill={`url(#${gradId}-in)`} stroke={c.light} strokeWidth={1.5} />
      <Polygon points={gem} fill={`url(#${gradId})`} stroke={c.accent} strokeWidth={1.5} />
      {tier === 'grandmaster' ? (
        <Path d={CROWN} fill={c.accent} transform="translate(0 -3)" />
      ) : null}
      {Array.from({ length: pips }, (_, i) => (
        <Path
          key={i}
          d={`M38 ${70 + i * 5} L50 ${75 + i * 5} L62 ${70 + i * 5}`}
          stroke={c.accent}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </Svg>
  );
}

export function RankEmblemForRating({
  rating,
  size,
  dimmed,
}: {
  rating: number;
  size?: number;
  dimmed?: boolean;
}) {
  const rank = getRank(rating);
  return <RankEmblem tier={rank.tier.id} division={rank.division} size={size} dimmed={dimmed} />;
}
