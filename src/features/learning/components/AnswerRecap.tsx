import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import type { AnswerVerdict } from '@shared/answers';
import type { Exercise } from '@shared/exercises';

import { Text, colors, radii, spacing } from '@/design-system';

import { TargetText } from '../readings';
import { SpeakButton } from './SpeakButton';

interface Props {
  exercise: Exercise;
  verdict: AnswerVerdict;
  /** Respuesta del usuario tal como se registró (serializeAnswer). */
  answer: string | null;
}

/**
 * Resumen de la respuesta, en el centro de la pantalla mientras se ve el feedback:
 * lo que respondió el usuario y, si no coincide, la forma correcta en grande.
 */
export function AnswerRecap({ exercise, verdict, answer }: Props) {
  const { payload } = exercise;

  if (payload.type === 'match_pairs') {
    return (
      <Animated.View entering={FadeIn.duration(260)} style={styles.card}>
        <Text variant="overline">PAREJAS</Text>
        {payload.pairs.map((p) => (
          <View key={p.left} style={styles.pair}>
            <TargetText variant="bodyStrong" color="textStrong" style={styles.flex}>
              {p.left}
            </TargetText>
            <Text color="textMuted">=</Text>
            <Text variant="bodyStrong" color="text" style={styles.flex} align="right">
              {p.right}
            </Text>
          </View>
        ))}
      </Animated.View>
    );
  }

  const exact = verdict.correct && !verdict.typo;
  const given = answer?.trim() ?? '';
  const showGiven = !exact && given.length > 0;

  return (
    <Animated.View entering={FadeIn.duration(260)} style={styles.card}>
      {showGiven ? (
        <View style={styles.block}>
          <Text variant="overline">TU RESPUESTA</Text>
          <Text
            variant="heading"
            color={verdict.correct ? 'text' : 'danger'}
            style={!verdict.correct && styles.struck}
          >
            {given}
          </Text>
        </View>
      ) : null}

      <View style={styles.block}>
        <Text variant="overline" color="success">
          {exact ? '✓ TU RESPUESTA' : 'RESPUESTA CORRECTA'}
        </Text>
        <View style={styles.answerRow}>
          <View style={styles.flex}>
            <TargetText variant="title" color="textStrong">
              {verdict.expected}
            </TargetText>
          </View>
          {/* En translation_choice la respuesta está en español: no tiene sentido pronunciarla. */}
          {exercise.type !== 'translation_choice' ? <SpeakButton text={verdict.expected} /> : null}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  block: { gap: spacing.xs },
  answerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pair: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  struck: { textDecorationLine: 'line-through' },
  flex: { flex: 1 },
});
