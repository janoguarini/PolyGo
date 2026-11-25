import { ArrowLeftRight, Link2, TextQuote, Volume2, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { CHALLENGE_KINDS, type ChallengeKind } from '@shared/arcade';

import { useStrings } from '@/i18n';

import { arcadeStrings } from './strings';
import { arcade, arcadeRadii } from './theme';

const ICONS: Record<ChallengeKind, LucideIcon> = {
  swipe: ArrowLeftRight,
  connect: Link2,
  sentence: TextQuote,
  audio: Volume2,
};

const TITLES = {
  swipe: 'swipeTitle',
  connect: 'connectTitle',
  sentence: 'sentenceTitle',
  audio: 'audioTitle',
} as const satisfies Record<ChallengeKind, keyof (typeof arcadeStrings)['es']>;

/** Orden de presentación (no es el orden de juego: la rotación la decide el servidor). */
const SHOWN: readonly ChallengeKind[] = ['swipe', 'connect', 'sentence', 'audio'];

export interface FormatStripColors {
  chip: string;
  border: string;
  icon: string;
  text: string;
}

const DARK: FormatStripColors = {
  chip: arcade.card,
  border: arcade.border,
  icon: arcade.violetGlow,
  text: arcade.text,
};

/**
 * Los cuatro formatos de Word Rush, como partes de un mismo juego (no como modos para elegir). Sólo
 * informa: no se tocan. `colors` permite usarlo sobre el tema claro de la app.
 */
export function FormatStrip({ colors = DARK }: { colors?: FormatStripColors }) {
  const t = useStrings(arcadeStrings);
  // Si un formato nuevo se agrega a CHALLENGE_KINDS, TypeScript obliga a darle ícono y nombre.
  const kinds = SHOWN.filter((k) => CHALLENGE_KINDS.includes(k));
  const names = kinds.map((k) => t[TITLES[k]]);
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="text"
      accessibilityLabel={t.formatsA11y(names.join(', '))}
    >
      {kinds.map((kind, i) => {
        const Icon = ICONS[kind];
        return (
          <View
            key={kind}
            style={[styles.chip, { backgroundColor: colors.chip, borderColor: colors.border }]}
          >
            <Icon color={colors.icon} size={16} strokeWidth={2.25} />
            <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
              {names[i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: arcadeRadii.pill,
    borderWidth: 1,
  },
  label: { fontSize: 13, fontWeight: '800' },
});
