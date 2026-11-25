import { CheckCircle2, XCircle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { canonicalForm, type AnswerVerdict } from '@shared/answers';
import type { Exercise } from '@shared/exercises';
import { hasHan } from '@shared/readings';

import { Button, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import type { WordRow } from '../api';
import { TargetText } from '../readings';
import { feedbackStrings } from '../strings';
import { answerMatch } from './AnswerRecap';
import { SpeakButton } from './SpeakButton';

interface Props {
  exercise: Exercise;
  verdict: AnswerVerdict;
  word: WordRow | null;
  /** Respuesta del usuario tal como se registró (serializeAnswer). */
  answer: string | null;
  onContinue: () => void;
}

/**
 * Feedback tras responder. Breve cuando acertaste; más contexto cuando hace falta:
 * - La palabra (con su parlante) sólo si no es ya la respuesta que AnswerRecap muestra en grande.
 * - El ejemplo, sólo al equivocarte y si no repite la respuesta correcta.
 * - La explicación, al equivocarte o con otra forma aceptada (ahí aclara la diferencia), y siempre
 *   en comprensión en contexto.
 */
export function FeedbackPanel({ exercise, verdict, word, answer, onContinue }: Props) {
  const styles = useStyles();
  const t = useStrings(feedbackStrings);
  const correct = verdict.correct;
  const match = answerMatch(verdict, answer);
  const same = (a: string, b: string) => canonicalForm(a) === canonicalForm(b);
  const showWord = word !== null && !same(word.text, verdict.expected);
  const example =
    match === 'wrong' && word?.example_en && !same(word.example_en, verdict.expected)
      ? word.example_en
      : null;
  // En comprensión en contexto la explicación es la evidencia del texto: va siempre.
  const showExplanation =
    Boolean(exercise.explanation) &&
    (exercise.type === 'context_choice' || match === 'wrong' || match === 'alternative');

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
          {correct ? (verdict.typo ? t.typo : t.correct) : t.incorrect}
        </Text>
      </View>

      {showWord && word ? (
        <View style={styles.word}>
          <SpeakButton text={word.text} />
          <View style={styles.flex}>
            <Text variant="bodyStrong" color="textStrong">
              {word.text} <Text color="textMuted">· {word.translation_es}</Text>
            </Text>
            {word.romanization || word.ipa ? (
              <Text variant="caption">{word.romanization ?? word.ipa}</Text>
            ) : null}
            {example && hasHan(example) ? (
              // En chino, el ejemplo con su pinyin encima y la traducción abajo.
              <View>
                <TargetText variant="caption" color="text">
                  {example}
                </TargetText>
                <Text variant="caption">{word.example_es}</Text>
              </View>
            ) : example ? (
              <Text variant="caption" color="text">
                “{example}” — {word.example_es}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {showExplanation ? <Text color="text">{exercise.explanation}</Text> : null}

      <Button label={t.continue} size="lg" onPress={onContinue} />
    </Animated.View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    panel: { gap: spacing.md, padding: spacing.lg, borderRadius: radii.xl, borderWidth: 1.5 },
    correct: { borderColor: colors.successStrong, backgroundColor: 'rgba(16,185,129,0.08)' },
    incorrect: { borderColor: colors.dangerStrong, backgroundColor: 'rgba(239,68,68,0.08)' },
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    word: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    flex: { flex: 1, gap: spacing.xxs },
  }),
);
