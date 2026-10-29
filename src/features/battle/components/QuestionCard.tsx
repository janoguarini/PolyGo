import { Pressable, StyleSheet, View } from 'react-native';

import type { QuestionView } from '@shared/protocol';

import { Card, MIN_TOUCH, Text, colors, radii, spacing } from '@/design-system';

import type { AnswerFeedback } from '../state';

interface Props {
  question: QuestionView;
  feedback: AnswerFeedback | null;
  disabled: boolean;
  onAnswer: (option: number) => void;
}

/** Enunciado y 4 opciones. La correcta sólo se conoce cuando el servidor responde. */
export function QuestionCard({ question, feedback, disabled, onAnswer }: Props) {
  const shown = feedback?.questionIndex === question.index ? feedback : null;
  return (
    <View style={styles.wrap}>
      <Card style={styles.prompt}>
        <Text variant="overline">
          {question.direction === 'en_es'
            ? 'ELEGÍ LA TRADUCCIÓN AL ESPAÑOL'
            : 'ELEGÍ LA PALABRA EN INGLÉS'}
        </Text>
        <Text variant="display" align="center" accessibilityRole="header">
          {question.prompt}
        </Text>
        {shown ? (
          <Text
            variant="bodyStrong"
            color={shown.correct ? 'success' : 'danger'}
            align="center"
            accessibilityLiveRegion="assertive"
          >
            {shown.correct ? `¡Bien! +${shown.points}` : `${shown.points}`}
          </Text>
        ) : (
          <Text variant="bodyStrong" align="center" style={styles.placeholder}>
            {' '}
          </Text>
        )}
      </Card>

      <View style={styles.options}>
        {question.options.map((option, i) => {
          const isCorrect = shown && i === shown.correctOption;
          const isWrongChoice = shown && i === shown.chosen && !shown.correct;
          return (
            <Pressable
              key={`${question.index}-${i}`}
              accessibilityRole="button"
              accessibilityLabel={option}
              accessibilityState={{ disabled: disabled || Boolean(shown) }}
              disabled={disabled || Boolean(shown)}
              onPress={() => onAnswer(i)}
              style={({ pressed }) => [
                styles.option,
                isCorrect && styles.correct,
                isWrongChoice && styles.wrong,
                pressed && styles.pressed,
              ]}
            >
              <Text
                variant="heading"
                align="center"
                color={isCorrect || isWrongChoice ? 'textStrong' : 'text'}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  prompt: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl },
  placeholder: { opacity: 0 },
  options: { gap: spacing.md },
  option: {
    minHeight: MIN_TOUCH + 12,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  correct: { borderColor: colors.success, backgroundColor: colors.successStrong },
  wrong: { borderColor: colors.danger, backgroundColor: colors.dangerStrong },
  pressed: { transform: [{ scale: 0.98 }], backgroundColor: colors.surfaceRaised },
});
