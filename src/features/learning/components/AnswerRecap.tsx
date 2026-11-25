import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { canonicalForm, type AnswerVerdict } from '@shared/answers';
import type { Exercise } from '@shared/exercises';

import { Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import { TargetText } from '../readings';
import { answerRecapStrings } from '../strings';
import { SpeakButton } from './SpeakButton';

interface Props {
  exercise: Exercise;
  verdict: AnswerVerdict;
  /** Respuesta del usuario tal como se registró (serializeAnswer). */
  answer: string | null;
}

/** Cómo coincidió la respuesta: exacta, otra forma aceptada, con error de tipeo o incorrecta. */
export type AnswerMatch = 'exact' | 'alternative' | 'typo' | 'wrong';

export function answerMatch(verdict: AnswerVerdict, answer: string | null): AnswerMatch {
  if (!verdict.correct) return 'wrong';
  if (verdict.typo) return 'typo';
  const given = answer?.trim() ?? '';
  // Una respuesta aceptada distinta de la principal («ciao» por «arrivederci») no es «exacta».
  return given.length > 0 && canonicalForm(given) !== canonicalForm(verdict.expected)
    ? 'alternative'
    : 'exact';
}

/**
 * Resumen de la respuesta, en el centro de la pantalla mientras se ve el feedback:
 * lo que respondió el usuario y, si no coincide, la forma correcta en grande.
 */
export function AnswerRecap({ exercise, verdict, answer }: Props) {
  const styles = useStyles();
  const t = useStrings(answerRecapStrings);
  const { payload } = exercise;

  if (payload.type === 'match_pairs') {
    return (
      <Animated.View entering={FadeIn.duration(260)} style={styles.card}>
        <Text variant="overline">{t.pairs}</Text>
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

  const given = answer?.trim() ?? '';
  // Otra forma aceptada: se muestra lo que escribiste (bien) y también la que enseña la lección.
  const match = answerMatch(verdict, answer);
  const alternative = match === 'alternative';
  const exact = match === 'exact';
  const showGiven = !exact && given.length > 0;

  return (
    <Animated.View entering={FadeIn.duration(260)} style={styles.card}>
      {showGiven ? (
        <View style={styles.block}>
          <Text variant="overline" color={alternative ? 'success' : undefined}>
            {alternative ? t.yourAnswerCorrect : t.yourAnswer}
          </Text>
          <Text
            variant="heading"
            color={alternative ? 'textStrong' : verdict.correct ? 'text' : 'danger'}
            style={!verdict.correct && styles.struck}
          >
            {given}
          </Text>
        </View>
      ) : null}

      <View style={styles.block}>
        <Text variant="overline" color="success">
          {exact ? t.yourAnswerCorrect : alternative ? t.alsoSaid : t.correctAnswer}
        </Text>
        <View style={styles.answerRow}>
          <View style={styles.flex}>
            <TargetText variant="title" color="textStrong">
              {verdict.expected}
            </TargetText>
          </View>
          {/* En translation_choice y context_choice la respuesta está en español: no se pronuncia. */}
          {exercise.type !== 'translation_choice' && exercise.type !== 'context_choice' ? (
            <SpeakButton text={verdict.expected} />
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
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
  }),
);
