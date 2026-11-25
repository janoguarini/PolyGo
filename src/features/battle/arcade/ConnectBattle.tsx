import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { ArcadeAnswer, ChallengeView } from '@shared/arcade';

import { TargetText } from '@/features/learning/readings';
import { useStrings } from '@/i18n';

import { arcadeStrings } from './strings';
import { ARCADE_TOUCH, arcade, arcadeRadii, arcadeText } from './theme';

type View_ = Extract<ChallengeView, { kind: 'connect' }>;
type Side = 'left' | 'right';

/**
 * Connect Battle: cuatro palabras y cuatro traducciones. Se toca una de cada lado (en cualquier
 * orden); tocar otra del mismo lado cambia la selección. Cada pareja la confirma el servidor: las
 * correctas se apagan, las equivocadas tiemblan en rojo. Al limpiar el tablero pasa solo.
 */
export function ConnectBattle({
  view,
  solved,
  pending,
  wrong,
  onAnswer,
}: {
  view: View_;
  solved: readonly [number, number][];
  pending: [number, number] | null;
  wrong: { pair: [number, number]; id: number } | null;
  onAnswer: (answer: ArcadeAnswer) => void;
}) {
  const t = useStrings(arcadeStrings);
  const [selected, setSelected] = useState<{ side: Side; index: number } | null>(null);
  const doneLeft = new Set(solved.map(([l]) => l));
  const doneRight = new Set(solved.map(([, r]) => r));

  const tap = (side: Side, index: number) => {
    if (pending) return;
    if (!selected || selected.side === side) {
      setSelected(selected?.side === side && selected.index === index ? null : { side, index });
      return;
    }
    const left = side === 'left' ? index : selected.index;
    const right = side === 'right' ? index : selected.index;
    setSelected(null);
    onAnswer({ kind: 'connect', left, right });
  };

  const cell = (side: Side, index: number, label: string) => {
    const done = side === 'left' ? doneLeft.has(index) : doneRight.has(index);
    const isSelected = selected?.side === side && selected.index === index;
    const isPending = pending !== null && pending[side === 'left' ? 0 : 1] === index;
    const isWrong = wrong !== null && wrong.pair[side === 'left' ? 0 : 1] === index;
    return (
      <Cell
        key={`${side}-${index}`}
        label={label}
        target={side === 'left'}
        done={done}
        active={isSelected || isPending}
        wrongId={isWrong ? wrong!.id : null}
        onPress={() => tap(side, index)}
      />
    );
  };

  return (
    <View style={styles.wrap}>
      <Text style={arcadeText.label}>{t.connectHint}</Text>
      <View style={styles.board}>
        <View style={styles.column}>{view.left.map((w, i) => cell('left', i, w))}</View>
        <View style={styles.column}>{view.right.map((w, i) => cell('right', i, w))}</View>
      </View>
    </View>
  );
}

function Cell({
  label,
  target,
  done,
  active,
  wrongId,
  onPress,
}: {
  label: string;
  /** Palabra en el idioma que se aprende (pinyin en chino). */
  target: boolean;
  done: boolean;
  active: boolean;
  wrongId: number | null;
  onPress: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const shake = useSharedValue(0);
  // Rojo hasta que vence (se guarda qué error ya se apagó).
  const [clearedId, setClearedId] = useState<number | null>(null);
  const flash = wrongId !== null && wrongId !== clearedId;
  useEffect(() => {
    if (wrongId === null) return;
    const timer = setTimeout(() => setClearedId(wrongId), 380);
    if (!reduceMotion) {
      shake.value = withSequence(
        withTiming(-8, { duration: 40 }),
        withTiming(8, { duration: 70 }),
        withTiming(-5, { duration: 60 }),
        withTiming(0, { duration: 40 }),
      );
    }
    return () => clearTimeout(timer);
  }, [wrongId, reduceMotion, shake]);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));
  return (
    <Animated.View style={[shakeStyle, done && styles.doneWrap]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: done, selected: active }}
        disabled={done}
        onPress={onPress}
        style={({ pressed }) => [
          styles.cell,
          active && styles.active,
          flash && styles.wrong,
          done && styles.done,
          pressed && styles.pressed,
        ]}
      >
        {target ? (
          <TargetText style={styles.cellText} numberOfLines={2}>
            {label}
          </TargetText>
        ) : (
          <Text style={styles.cellText} numberOfLines={2}>
            {label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 16, justifyContent: 'center' },
  board: { flexDirection: 'row', gap: 12 },
  column: { flex: 1, gap: 10 },
  cell: {
    minHeight: ARCADE_TOUCH + 12,
    borderRadius: arcadeRadii.block,
    backgroundColor: arcade.card,
    borderWidth: 2,
    borderColor: arcade.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  cellText: { ...arcadeText.option, fontSize: 17 },
  active: { borderColor: arcade.violetGlow, backgroundColor: arcade.cardRaised },
  wrong: { borderColor: arcade.danger, backgroundColor: '#3A1020' },
  done: { borderColor: arcade.success, backgroundColor: '#0E2A22' },
  doneWrap: { opacity: 0.35 },
  pressed: { transform: [{ scale: 0.96 }] },
});
