import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { ErrorState, LoadingState, Screen } from '@/design-system';
import type { AttemptInput } from '@/features/learning/api';
import { SessionPlayer } from '@/features/learning/components/SessionPlayer';
import { SessionResults } from '@/features/learning/components/SessionResults';
import { useCurriculum, useLessonContent, useSubmitSession } from '@/features/learning/hooks';
import { sessionStats, type PlayerState } from '@/features/learning/player';
import { uuid } from '@/features/learning/random';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const content = useLessonContent(id);
  const curriculum = useCurriculum();
  const submit = useSubmitSession();
  // Clave de idempotencia: reintentar el guardado nunca duplica la sesión.
  const [sessionId] = useState(uuid);
  const [startedAt] = useState(() => new Date());
  const [finished, setFinished] = useState<{
    state: PlayerState;
    attempts: AttemptInput[];
    endedAt: Date;
  } | null>(null);

  const save = useCallback(
    (attempts: AttemptInput[]) =>
      submit.mutate({ sessionId, kind: 'lesson', lessonId: id, startedAt, attempts }),
    [submit, sessionId, id, startedAt],
  );

  const handleFinished = useCallback(
    (state: PlayerState) => {
      const attempts = state.attempts.map((a) => ({
        exerciseId: a.exerciseId,
        answer: a.answer,
        correct: a.correct,
        firstTry: a.firstTry,
        responseMs: a.responseMs,
      }));
      setFinished({ state, attempts, endedAt: new Date() });
      save(attempts);
    },
    [save],
  );

  const confirmExit = () =>
    Alert.alert('¿Salir de la lección?', 'Vas a perder el progreso de esta lección.', [
      { text: 'Seguir', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => router.back() },
    ]);

  if (content.isPending) return <LoadingState label="Cargando lección…" />;
  if (content.isError || !content.data) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <ErrorState
          message="No pudimos cargar la lección."
          onRetry={() => void content.refetch()}
        />
      </Screen>
    );
  }

  if (!finished) {
    return (
      <SessionPlayer
        exercises={content.data.exercises}
        words={content.data.words}
        seed={sessionId}
        onClose={confirmExit}
        onFinished={handleFinished}
      />
    );
  }

  const next = curriculum.data?.current;
  const hasNext = Boolean(next && next.id !== id);

  return (
    <SessionResults
      title={content.data.lesson.title}
      stats={sessionStats(finished.state)}
      durationSeconds={Math.round((finished.endedAt.getTime() - startedAt.getTime()) / 1000)}
      words={content.data.words}
      saving={submit.isPending}
      saveError={submit.error}
      saved={submit.isSuccess}
      achievements={submit.data?.achievements_unlocked ?? []}
      onRetrySave={() => save(finished.attempts)}
      primaryLabel={hasNext ? 'Siguiente lección' : 'Ver mapa de lecciones'}
      onPrimary={() =>
        hasNext && next
          ? router.replace({ pathname: '/lesson/[id]', params: { id: next.id } })
          : router.replace('/learn')
      }
      onExit={() => router.back()}
    />
  );
}
