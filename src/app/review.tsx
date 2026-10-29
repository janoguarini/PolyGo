import { router } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import type { Exercise } from '@shared/exercises';

import { Button, EmptyState, ErrorState, LoadingState, Screen, colors } from '@/design-system';
import type { AttemptInput, WordRow } from '@/features/learning/api';
import { SessionPlayer } from '@/features/learning/components/SessionPlayer';
import { SessionResults } from '@/features/learning/components/SessionResults';
import { useMyWords, useSubmitSession, useWordPool } from '@/features/learning/hooks';
import { sessionStats, type PlayerState } from '@/features/learning/player';
import { uuid } from '@/features/learning/random';
import { buildReviewExercises } from '@/features/learning/review';

const REVIEW_SIZE = 10;

interface ReviewSession {
  exercises: Exercise[];
  words: Record<string, WordRow>;
}

export default function ReviewScreen() {
  const myWords = useMyWords();
  const pool = useWordPool();
  const submit = useSubmitSession();
  const [sessionId] = useState(uuid);
  const [startedAt] = useState(() => new Date());
  // La sesión se fija al empezar: refrescar los datos al guardar no debe cambiar los ejercicios.
  const [review, setReview] = useState<ReviewSession | null>(null);
  const [finished, setFinished] = useState<{
    state: PlayerState;
    attempts: AttemptInput[];
    endedAt: Date;
  } | null>(null);

  if (!review && myWords.data && pool.data) {
    const now = startedAt.getTime();
    const due = myWords.data
      .filter((w) => w.nextReviewAt && new Date(w.nextReviewAt).getTime() <= now)
      .sort((a, b) => b.incorrectCount - a.incorrectCount)
      .slice(0, REVIEW_SIZE)
      .map((w) => w.word);
    setReview({
      exercises: buildReviewExercises(due, pool.data, sessionId),
      words: Object.fromEntries(due.map((w) => [w.id, w])),
    });
  }

  const save = useCallback(
    (attempts: AttemptInput[]) =>
      submit.mutate({ sessionId, kind: 'review', lessonId: null, startedAt, attempts }),
    [submit, sessionId, startedAt],
  );

  const handleFinished = useCallback(
    (state: PlayerState) => {
      // En repasos sólo cuenta el primer intento de cada palabra.
      const attempts = state.attempts
        .filter((a) => a.firstTry)
        .map((a) => ({
          wordId: a.exerciseId.replace(/^review-/, ''),
          answer: a.answer,
          correct: a.correct,
          firstTry: true,
          responseMs: a.responseMs,
        }));
      setFinished({ state, attempts, endedAt: new Date() });
      save(attempts);
    },
    [save],
  );

  if (myWords.isPending || pool.isPending || (!review && !myWords.isError && !pool.isError)) {
    return <LoadingState label="Preparando repaso…" />;
  }
  if (myWords.isError || pool.isError || !review) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <ErrorState
          message="No pudimos preparar el repaso."
          onRetry={() => {
            void myWords.refetch();
            void pool.refetch();
          }}
        />
      </Screen>
    );
  }

  if (review.exercises.length === 0) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <EmptyState
          icon={<CheckCircle2 color={colors.success} size={44} />}
          title="Estás al día"
          message="No tenés palabras para repasar ahora. Las palabras que estudies volverán cuando toque repasarlas."
        />
        <Button label="Volver" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (!finished) {
    return (
      <SessionPlayer
        exercises={review.exercises}
        words={review.words}
        seed={sessionId}
        onClose={() =>
          Alert.alert('¿Salir del repaso?', 'Las respuestas de este repaso no se van a guardar.', [
            { text: 'Seguir', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: () => router.back() },
          ])
        }
        onFinished={handleFinished}
      />
    );
  }

  return (
    <SessionResults
      title="Repaso de vocabulario"
      stats={sessionStats(finished.state)}
      durationSeconds={Math.round((finished.endedAt.getTime() - startedAt.getTime()) / 1000)}
      words={review.words}
      saving={submit.isPending}
      saveError={submit.error}
      saved={submit.isSuccess}
      onRetrySave={() => save(finished.attempts)}
      primaryLabel="Listo"
      onPrimary={() => router.back()}
      onExit={() => router.back()}
    />
  );
}
