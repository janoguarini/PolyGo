import { useMemo } from 'react';
import Svg, { Defs, LinearGradient, Path, Polygon, Stop } from 'react-native-svg';

import { TIERS, getRank, type Division, type TierId } from '@shared/ranking';

import { TIER_COLORS } from '../rankTheme';
import {
  CROWN,
  DIVISION_PIPS,
  EMBLEM_VIEWBOX,
  INNER,
  SHIELD,
  gemPoints,
  pipPath,
} from '../rankEmblemGeometry';

export interface RankEmblemProps {
  tier: TierId;
  division?: Division | null;
  size?: number;
  /** En colocación el emblema se muestra apagado. */
  dimmed?: boolean;
}

/** Emblema propio: la gema central gana lados con cada tier; los tiers altos usan estrella y corona. */
export function RankEmblem({ tier, division = null, size = 64, dimmed = false }: RankEmblemProps) {
  const tierIndex = TIERS.findIndex((t) => t.id === tier);
  const c = TIER_COLORS[tier];
  const gem = useMemo(() => gemPoints(tierIndex), [tierIndex]);
  const gradId = `rank-${tier}`;
  const pips = division ? DIVISION_PIPS[division] : 0;

  return (
    <Svg width={size} height={size} viewBox={EMBLEM_VIEWBOX} opacity={dimmed ? 0.4 : 1}>
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
          d={pipPath(i)}
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
