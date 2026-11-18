import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { ErrorState, LoadingState, Screen } from '@/design-system';
import type { AttemptInput, GradedAttemptInput } from '@/features/learning/api';
import { SessionPlayer } from '@/features/learning/components/SessionPlayer';
import { SessionResults } from '@/features/learning/components/SessionResults';
import { WritingPracticeCard } from '@/features/learning/components/WritingPracticeCard';
import {
  useCurriculum,
  useLessonContent,
  useLessonPresentation,
  useSubmitSession,
} from '@/features/learning/hooks';
import { sessionStats, type PlayerState } from '@/features/learning/player';
import { matchPresentations, toGradedAttempts } from '@/features/learning/presentation';
import { SessionLanguageProvider } from '@/features/learning/SessionLanguageProvider';
import { uuid } from '@/features/learning/random';
import { useCelebrationGate } from '@/features/learning/useCelebrationGate';
import { useEnergy } from '@/features/plus/api';
import { NoEnergyState } from '@/features/plus/components/NoEnergyState';

export default function LessonScreenWithLanguage() {
  return (
    <SessionLanguageProvider>
      <LessonScreen />
    </SessionLanguageProvider>
  );
}

function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const content = useLessonContent(id);
  const curriculum = useCurriculum();
  const submit = useSubmitSession();
  const celebration = useCelebrationGate(submit);
  const energy = useEnergy();
  // Se decide al entrar (y se reevalúa mientras esperás): terminar la lección con tu última unidad
  // no te saca a la pantalla de «sin energía». Si no se pudo leer, se juega y el servidor decide.
  const [canPlay, setCanPlay] = useState<boolean | null>(null);
  if (canPlay !== true && (energy.view || energy.isError)) {
    const next = energy.view ? energy.view.canStartLesson : true;
    if (next !== canPlay) setCanPlay(next);
  }
  // Clave de idempotencia: reintentar el guardado nunca duplica la sesión.
  const [sessionId] = useState(uuid);
  const [startedAt] = useState(() => new Date());
  // Fase 2: el servidor registra qué se presenta y corrige. Si no responde, la ruta vieja.
  const presentation = useLessonPresentation(sessionId, id);
  const [finished, setFinished] = useState<{
    state: PlayerState;
    attempts: AttemptInput[];
    graded?: GradedAttemptInput[];
    endedAt: Date;
  } | null>(null);

  // Sólo se usa si cubre exactamente los ejercicios cargados y con la misma versión: si el contenido
  // cambió entre la lectura y el registro, se juega por la ruta vieja (nada se corrige con otra versión).
  const presented = useMemo(
    () => matchPresentations(presentation.data, content.data),
    [presentation.data, content.data],
  );

  const save = useCallback(
    (attempts: AttemptInput[], graded?: GradedAttemptInput[]) =>
      submit.mutate({ sessionId, kind: 'lesson', lessonId: id, startedAt, attempts, graded }),
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
      const graded = presented ? toGradedAttempts(state, presented.byExercise) : undefined;
      setFinished({ state, attempts, graded, endedAt: new Date() });
      save(attempts, graded);
    },
    [save, presented],
  );

  const confirmExit = () =>
    Alert.alert('¿Salir de la lección?', 'Vas a perder el progreso de esta lección.', [
      { text: 'Seguir', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => router.back() },
    ]);

  if (content.isPending || canPlay === null || presentation.isPending) {
    return <LoadingState label="Cargando lección…" />;
  }
  if (!canPlay && energy.view) return <NoEnergyState view={energy.view} />;
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
        shownOptions={presented?.shownOptions}
        onClose={confirmExit}
        onFinished={handleFinished}
      />
    );
  }

  if (celebration.screen) return celebration.screen;

  // La siguiente lección es la que toca en el mismo nivel que la que terminaste.
  const level = curriculum.data?.units.find((u) => u.lessons.some((l) => l.id === id))?.level;
  const next = level ? curriculum.data?.currentByLevel[level] : undefined;
  const hasNext = Boolean(next && next.id !== id);

  return (
    <SessionResults
      title={content.data.lesson.title}
      takeaways={content.data.lesson.takeaways}
      stats={sessionStats(finished.state)}
      durationSeconds={Math.round((finished.endedAt.getTime() - startedAt.getTime()) / 1000)}
      words={content.data.words}
      saving={submit.isPending}
      saveError={submit.error}
      saved={submit.isSuccess}
      achievements={submit.data?.achievements_unlocked ?? []}
      onRetrySave={() => save(finished.attempts, finished.graded)}
      extra={<WritingPracticeCard lessonId={id} />}
      primaryLabel={hasNext ? 'Siguiente lección' : 'Volver al camino'}
      onPrimary={celebration.guard(() =>
        hasNext && next
          ? router.replace({ pathname: '/lesson/[id]', params: { id: next.id } })
          : router.dismissTo('/'),
      )}
      onExit={celebration.guard(() => router.back())}
    />
  );
}
