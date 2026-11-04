import { ChevronRight } from 'lucide-react-native';
import { Fragment, useRef } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import { TIERS, type TierId } from '@shared/ranking';

import { RankEmblem, TIER_COLORS, Text, colors, radii, spacing } from '@/design-system';

/**
 * Todos los tiers en fila, con el actual resaltado: muestra a dónde se puede llegar.
 * Los ya superados se ven encendidos; los siguientes, apagados.
 */
export function TierLadder({ current }: { current: TierId | null }) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const currentIndex = current ? TIERS.findIndex((t) => t.id === current) : -1;

  return (
    <View style={styles.box}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        accessibilityLabel={`Rangos: ${TIERS.map((t) => t.name).join(', ')}`}
      >
        {TIERS.map((tier, i) => {
          const active = i === currentIndex;
          const reached = i <= currentIndex;
          const c = TIER_COLORS[tier.id];
          return (
            <Fragment key={tier.id}>
              {i > 0 ? (
                <ChevronRight
                  size={14}
                  color={reached ? colors.text : colors.textSubtle}
                  style={styles.chevron}
                />
              ) : null}
              <View
                style={styles.item}
                onLayout={
                  active
                    ? (e) => {
                        const x = e.nativeEvent.layout.x;
                        scrollRef.current?.scrollTo({ x: Math.max(0, x - 60), animated: false });
                      }
                    : undefined
                }
              >
                <View style={!reached && styles.locked}>
                  <RankEmblem tier={tier.id} size={active ? 44 : 36} />
                </View>
                <Text
                  variant="caption"
                  numberOfLines={1}
                  style={[
                    styles.name,
                    active
                      ? { color: c.light, fontWeight: '800' }
                      : { color: reached ? colors.text : colors.textMuted },
                  ]}
                >
                  {tier.name}
                </Text>
                <View style={[styles.underline, active && { backgroundColor: c.light }]} />
              </View>
            </Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radii.xl,
    backgroundColor: 'rgba(23, 20, 47, 0.75)',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
  },
  row: { alignItems: 'flex-end', paddingHorizontal: spacing.md, gap: spacing.xs },
  chevron: { marginBottom: 34 },
  item: { alignItems: 'center', gap: spacing.xs, minWidth: 58 },
  locked: { opacity: 0.4 },
  name: { fontSize: 12 },
  underline: { height: 3, width: 28, borderRadius: 2, backgroundColor: 'transparent' },
});
