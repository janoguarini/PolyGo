import { CheckCircle2, XCircle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { AnswerVerdict } from '@shared/answers';
import type { Exercise } from '@shared/exercises';

import { Button, Text, colors, radii, spacing } from '@/design-system';

import type { WordRow } from '../api';
import { SpeakButton } from './SpeakButton';

interface Props {
  exercise: Exercise;
  verdict: AnswerVerdict;
  word: WordRow | null;
  onContinue: () => void;
}

/** Feedback tras responder: resultado, respuesta correcta, traducción, pronunciación y ejemplo. */
export function FeedbackPanel({ exercise, verdict, word, onContinue }: Props) {
  const correct = verdict.correct;
  const expected =
    exercise.payload.type === 'match_pairs'
      ? exercise.payload.pairs.map((p) => `${p.left} = ${p.right}`).join(' · ')
      : verdict.expected;

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      style={[styles.panel, correct ? styles.correct : styles.incorrect]}
      accessibilityLiveRegion="assertive"
    >
      <View style={styles.header}>
        {correct ? (
          <CheckCircle2 color={colors.success} size={26} />
        ) : (
          <XCircle color={colors.danger} size={26} />
        )}
        <Text variant="heading" color={correct ? 'success' : 'danger'}>
          {correct
            ? verdict.typo
              ? '¡Bien! Ojo con la ortografía'
              : '¡Correcto!'
            : 'Respuesta incorrecta'}
        </Text>
      </View>

      {!correct || (verdict.correct && verdict.typo) ? (
        <View>
          <Text variant="caption">Respuesta correcta</Text>
          <Text variant="bodyStrong" color="textStrong">
            {expected}
          </Text>
        </View>
      ) : null}

      {word ? (
        <View style={styles.word}>
          <SpeakButton text={word.text} />
          <View style={styles.flex}>
            <Text variant="bodyStrong" color="textStrong">
              {word.text} <Text color="textMuted">· {word.translation_es}</Text>
            </Text>
            {word.ipa ? <Text variant="caption">{word.ipa} · voz sintetizada</Text> : null}
            {word.example_en ? (
              <Text variant="caption" color="text">
                “{word.example_en}” — {word.example_es}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {exercise.explanation ? <Text color="text">{exercise.explanation}</Text> : null}

      <Button label="Continuar" size="lg" onPress={onContinue} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: spacing.md, padding: spacing.lg, borderRadius: radii.xl, borderWidth: 1.5 },
  correct: { borderColor: colors.successStrong, backgroundColor: 'rgba(16,185,129,0.08)' },
  incorrect: { borderColor: colors.dangerStrong, backgroundColor: 'rgba(239,68,68,0.08)' },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  word: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
});
