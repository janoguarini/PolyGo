import { Undo2 } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion, ZoomIn } from 'react-native-reanimated';

import type { ArcadeAnswer, ChallengeView } from '@shared/arcade';

import { TargetText } from '@/features/learning/readings';
import { useStrings } from '@/i18n';

import { arcadeStrings } from './strings';
import { ARCADE_TOUCH, arcade, arcadeRadii, arcadeText } from './theme';

type View_ = Extract<ChallengeView, { kind: 'sentence' }>;

/**
 * Sentence Rush: la consigna en el idioma de apoyo y los bloques mezclados. Se tocan en orden; los
 * elegidos suben a la frase. «Deshacer» saca el último. Al usar todos se envía solo (una vez).
 */
export function SentenceRush({
  view,
  onAnswer,
}: {
  view: View_;
  onAnswer: (answer: ArcadeAnswer) => void;
}) {
  const t = useStrings(arcadeStrings);
  const reduceMotion = useReducedMotion();
  const [order, setOrder] = useState<number[]>([]);
  const sent = useRef(false);

  const pick = (i: number) => {
    if (sent.current || order.includes(i)) return;
    const next = [...order, i];
    setOrder(next);
    if (next.length === view.tokens.length) {
      sent.current = true;
      onAnswer({ kind: 'sentence', order: next });
    }
  };
  const undo = () => {
    if (!sent.current) setOrder(order.slice(0, -1));
  };

  return (
    <View style={styles.wrap}>
      <Text style={arcadeText.label}>{t.sentenceHint}</Text>
      <Text style={styles.translation}>{view.translation}</Text>

      <View style={styles.built} accessibilityLiveRegion="polite">
        {order.map((i) => (
          <Animated.View
            key={i}
            entering={reduceMotion ? undefined : ZoomIn.duration(140)}
            style={[styles.block, styles.blockPlaced]}
          >
            <TargetText style={styles.blockText}>{view.tokens[i]!}</TargetText>
          </Animated.View>
        ))}
        {order.length === 0 ? <View style={styles.placeholder} /> : null}
      </View>

      <View style={styles.pool}>
        {view.tokens.map((token, i) =>
          order.includes(i) ? (
            <View key={i} style={[styles.block, styles.blockGhost]}>
              <TargetText style={[styles.blockText, styles.ghostText]}>{token}</TargetText>
            </View>
          ) : (
            <Animated.View key={i} entering={reduceMotion ? undefined : FadeIn.duration(120)}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={token}
                onPress={() => pick(i)}
                style={({ pressed }) => [styles.block, pressed && styles.pressed]}
              >
                <TargetText style={styles.blockText}>{token}</TargetText>
              </Pressable>
            </Animated.View>
          ),
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.undo}
        accessibilityState={{ disabled: order.length === 0 }}
        disabled={order.length === 0}
        onPress={undo}
        hitSlop={8}
        style={({ pressed }) => [
          styles.undo,
          order.length === 0 && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <Undo2 color={arcade.muted} size={18} />
        <Text style={styles.undoText}>{t.undo}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 16, justifyContent: 'center' },
  translation: { ...arcadeText.title, fontSize: 22 },
  built: {
    minHeight: 120,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: arcadeRadii.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: arcade.violet,
    backgroundColor: arcade.bgDeep,
  },
  placeholder: { height: ARCADE_TOUCH },
  pool: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  block: {
    minHeight: ARCADE_TOUCH,
    minWidth: ARCADE_TOUCH,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: arcadeRadii.block,
    backgroundColor: arcade.cardRaised,
    borderWidth: 2,
    borderColor: arcade.border,
    borderBottomWidth: 4,
  },
  blockPlaced: { borderColor: arcade.violetGlow, backgroundColor: arcade.violet },
  blockGhost: { backgroundColor: 'transparent', borderStyle: 'dashed' },
  blockText: { ...arcadeText.option },
  ghostText: { opacity: 0 },
  undo: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: arcadeRadii.pill,
    backgroundColor: arcade.card,
  },
  undoText: { color: arcade.muted, fontSize: 14, fontWeight: '700' },
  disabled: { opacity: 0.4 },
  pressed: { transform: [{ scale: 0.95 }] },
});
