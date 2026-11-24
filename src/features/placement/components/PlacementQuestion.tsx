import * as Haptics from 'expo-haptics';
import { CheckCircle2, TrendingUp, XCircle } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { checkAnswer, serializeAnswer } from '@shared/answers';
import type { UserAnswer } from '@shared/exercises';
import { currentItem } from '@shared/placement';

import { Button, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { AnswerInput } from '@/features/learning/components/AnswerInput';
import { AnswerRecap } from '@/features/learning/components/AnswerRecap';
import { ExercisePrompt } from '@/features/learning/components/ExercisePrompt';
import { levelColor } from '@/features/profile/levelColor';
import { useStrings } from '@/i18n';
import { playSound } from '@/lib/sounds';

import { questionNumber, type PlacementSession, type PlacementSessionAction } from '../session';
import { placementStrings } from '../strings';

/**
 * Una pregunta del test: el enunciado y la respuesta con los componentes de las lecciones (mismo
 * aspecto y la misma corrección, shared/answers.ts), y después un feedback corto (sin explicación:
 * el test mide, no enseña). Sin reintentos: cuenta la primera respuesta.
 */
export function PlacementQuestion({
  session,
  dispatch,
  seed,
}: {
  session: PlacementSession;
  dispatch: (action: PlacementSessionAction) => void;
  seed: string;
}) {
  const styles = useStyles();
  const t = useStrings(placementStrings);
  // Mientras se ve el feedback, la pregunta respondida es la última registrada.
  const answeredId =
    session.phase === 'feedback'
      ? session.test.answers[session.test.answers.length - 1]?.sourceId
      : undefined;
  const band = session.test.bank.bands.find((b) => b.items.some((i) => i.sourceId === answeredId));
  const item = answeredId
    ? band?.items.find((i) => i.sourceId === answeredId)
    : currentItem(session.test);
  const level = band?.level ?? session.test.bank.bands[session.test.band]!.level;
  const submitted = useRef(false);

  useEffect(() => {
    submitted.current = false;
  }, [item?.sourceId]);

  if (!item) return null;
  const exercise = item.exercise;

  const submit = (answer: UserAnswer) => {
    // Doble toque en «Comprobar»: una sola respuesta por pregunta.
    if (submitted.current || session.phase !== 'question') return;
    submitted.current = true;
    const verdict = checkAnswer(exercise, answer);
    playSound(verdict.correct ? 'correct' : 'incorrect');
    if (Platform.OS !== 'web') {
      void Haptics.notificationAsync(
        verdict.correct
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    }
    dispatch({ type: 'answer', verdict, answer: serializeAnswer(answer) });
  };

  const last = session.phase === 'feedback' ? session.last : null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.chips}>
        <View style={styles.chip}>
          <Text variant="caption" color="textStrong">
            {t.questionChip(questionNumber(session))}
          </Text>
        </View>
        <View style={[styles.chip, { backgroundColor: levelColor(level) }]}>
          <Text variant="caption" color="onPrimary" style={styles.bold}>
            {t.bandChip(level)}
          </Text>
        </View>
      </View>

      <ExercisePrompt exercise={exercise} answered={last !== null} />

      {last ? (
        <View style={styles.feedback}>
          <View style={styles.recap}>
            <AnswerRecap exercise={exercise} verdict={last.verdict} answer={last.answer} />
          </View>
          <Animated.View
            entering={FadeInDown.duration(220)}
            style={[styles.panel, last.verdict.correct ? styles.correct : styles.incorrect]}
            accessibilityLiveRegion="assertive"
          >
            <View style={styles.header}>
              {last.verdict.correct ? (
                <CheckCircle2 color={colors.success} size={26} />
              ) : (
                <XCircle color={colors.danger} size={26} />
              )}
              <Text variant="heading" color={last.verdict.correct ? 'success' : 'danger'}>
                {last.verdict.correct ? (last.verdict.typo ? t.typo : t.correct) : t.incorrect}
              </Text>
            </View>
            {session.levelUp ? (
              <Animated.View entering={FadeInUp.duration(260)} style={styles.levelUp}>
                <TrendingUp color={colors.gold} size={18} />
                <Text variant="bodyStrong" color="gold">
                  {t.levelUp(session.levelUp)}
                </Text>
              </Animated.View>
            ) : null}
            <Button
              label={session.test.finished ? t.seeResult : t.next}
              size="lg"
              onPress={() => dispatch({ type: 'continue' })}
            />
          </Animated.View>
        </View>
      ) : (
        <AnswerInput
          key={exercise.id}
          exercise={exercise}
          seed={seed}
          disabled={session.phase !== 'question'}
          onSubmit={submit}
        />
      )}
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    wrapper: { flex: 1, gap: spacing.xl },
    chips: { flexDirection: 'row', gap: spacing.sm },
    chip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceHighlight,
    },
    bold: { fontWeight: '800' },
    feedback: { flex: 1, gap: spacing.xl },
    recap: { flex: 1, justifyContent: 'center' },
    panel: { gap: spacing.md, padding: spacing.lg, borderRadius: radii.xl, borderWidth: 1.5 },
    correct: { borderColor: colors.successStrong, backgroundColor: 'rgba(16,185,129,0.08)' },
    incorrect: { borderColor: colors.dangerStrong, backgroundColor: 'rgba(239,68,68,0.08)' },
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    levelUp: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radii.pill,
      backgroundColor: colors.inset,
    },
  }),
);
