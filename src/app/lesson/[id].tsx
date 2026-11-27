import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { ErrorState, LoadingState, Screen } from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import type { AttemptInput, GradedAttemptInput, LearningSummary } from '@/features/learning/api';
import { SessionPlayer } from '@/features/learning/components/SessionPlayer';
import { SessionResults } from '@/features/learning/components/SessionResults';
import { WritingPracticeCard } from '@/features/learning/components/WritingPracticeCard';
import {
  learningKeys,
  useCurriculum,
  useLessonContent,
  useLessonPresentation,
  useSubmitSession,
} from '@/features/learning/hooks';
import { sessionStats, type PlayerState } from '@/features/learning/player';
import { recordPractice } from '@/features/reminders/practiceLog';
import { track } from '@/lib/analytics';
import { metaFirstLesson } from '@/lib/metaEvents';
import { matchPresentations, toGradedAttempts } from '@/features/learning/presentation';
import { SessionLanguageProvider } from '@/features/learning/SessionLanguageProvider';
import { uuid } from '@/features/learning/random';
import { takeWarmSession, WarmLesson } from '@/features/learning/lessonWarmup';
import { useCelebrationGate } from '@/features/learning/useCelebrationGate';
import { useEnergy } from '@/features/plus/api';
import { useXp, type XpState } from '@/features/xp/api';
import { XpRewardCard } from '@/features/xp/XpRewardCard';
import { NoEnergyState } from '@/features/plus/components/NoEnergyState';
import { useStrings } from '@/i18n';
import { lessonStrings } from '@/i18n/screens/lesson';

export default function LessonScreenWithLanguage() {
  return (
    <SessionLanguageProvider>
      <LessonScreen />
    </SessionLanguageProvider>
  );
}

function LessonScreen() {
  const t = useStrings(lessonStrings);
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
  // Clave de idempotencia: reintentar el guardado nunca duplica la sesión. Si el camino ya precargó
  // esta lección (lessonWarmup.ts), se usa esa sesión: contenido y presentación ya están en caché y la
  // lección abre al instante.
  const qc = useQueryClient();
  const userId = useAuth().session?.user.id;
  const [sessionId] = useState(() => takeWarmSession(qc, id) ?? uuid());
  const [startedAt] = useState(() => new Date());
  // Fase 2: el servidor registra qué se presenta y corrige. Si no responde, la ruta vieja.
  const presentation = useLessonPresentation(sessionId, id);
  const [finished, setFinished] = useState<{
    state: PlayerState;
    attempts: AttemptInput[];
    graded?: GradedAttemptInput[];
    endedAt: Date;
  } | null>(null);
  // XP de antes de la lección (para mostrar cuánto ganaste y llenar la barra desde ahí). Se toma
  // mientras se juega, antes de enviar: después el servidor ya la acreditó.
  const xp = useXp();
  const [xpBefore, setXpBefore] = useState<XpState | null | undefined>(undefined);
  if (xpBefore === undefined && xp.data !== undefined && !finished) setXpBefore(xp.data);

  // Sólo se usa si cubre exactamente los ejercicios cargados y con la misma versión: si el contenido
  // cambió entre la lectura y el registro, se juega por la ruta vieja (nada se corrige con otra versión).
  const presented = useMemo(
    () => matchPresentations(presentation.data, content.data),
    [presentation.data, content.data],
  );

  // Analítica: lección abierta y terminada.
  useEffect(() => {
    track('lesson_started', { lesson_id: id });
  }, [id]);

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
      const stats = sessionStats(state);
      void recordPractice();
      track('lesson_completed', {
        lesson_id: id,
        accuracy: stats.accuracy,
        duration_s: Math.round((Date.now() - startedAt.getTime()) / 1000),
      });
      // Meta Ads: primera lección de la cuenta (el resumen, todavía sin esta, dice 0 terminadas).
      const before = userId
        ? qc.getQueryData<LearningSummary>(learningKeys.summary(userId))
        : undefined;
      if (userId && before && before.lessons_completed === 0) void metaFirstLesson(userId, id);
      setFinished({ state, attempts, graded, endedAt: new Date() });
      save(attempts, graded);
    },
    [save, presented, id, startedAt, userId, qc],
  );

  const confirmExit = () =>
    Alert.alert(t.exitTitle, t.exitMessage, [
      { text: t.stay, style: 'cancel' },
      { text: t.leave, style: 'destructive', onPress: () => router.back() },
    ]);

  if (content.isPending || canPlay === null || presentation.isPending) {
    return <LoadingState label={t.loading} />;
  }
  if (!canPlay && energy.view) return <NoEnergyState view={energy.view} />;
  if (content.isError || !content.data) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <ErrorState message={t.loadError} onRetry={() => void content.refetch()} />
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

  // La siguiente lección es la que toca en el mismo nivel que la que terminaste. Se sabe sin esperar
  // al guardado: si la que toca es otra (repetiste una vieja), esa; si era ésta, la que sigue en el
  // camino (al guardarse pasa a ser la que toca).
  const level = curriculum.data?.units.find((u) => u.lessons.some((l) => l.id === id))?.level;
  const current = level ? curriculum.data?.currentByLevel[level] : undefined;
  const ordered = (curriculum.data?.units ?? [])
    .filter((u) => u.level === level)
    .flatMap((u) => u.lessons);
  const following = ordered[ordered.findIndex((l) => l.id === id) + 1];
  const next = current && current.id !== id ? current : following;
  const hasNext = Boolean(next && next.id !== id);

  return (
    <>
      {/* «Siguiente lección» también abre al instante. */}
      {hasNext && next ? <WarmLesson lessonId={next.id} /> : null}
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
        reward={<XpRewardCard before={xpBefore} saved={submit.isSuccess} />}
        primaryLabel={hasNext ? t.nextLesson : t.backToPath}
        onPrimary={celebration.guard(() =>
          hasNext && next
            ? router.replace({ pathname: '/lesson/[id]', params: { id: next.id } })
            : router.dismissTo('/'),
        )}
        onExit={celebration.guard(() => router.back())}
      />
    </>
  );
}
