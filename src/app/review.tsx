import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Sparkles } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import type { Exercise } from '@shared/exercises';

import { Button, EmptyState, ErrorState, LoadingState, Screen, colors } from '@/design-system';
import type { AttemptInput, WordRow } from '@/features/learning/api';
import { SessionPlayer } from '@/features/learning/components/SessionPlayer';
import { SessionResults } from '@/features/learning/components/SessionResults';
import {
  useMyWords,
  useStudyLanguage,
  useSubmitSession,
  useWordPool,
} from '@/features/learning/hooks';
import { sessionStats, type PlayerState } from '@/features/learning/player';
import { shuffle, uuid } from '@/features/learning/random';
import { buildReviewExercises } from '@/features/learning/review';
import { SessionLanguageProvider } from '@/features/learning/SessionLanguageProvider';
import { useCelebrationGate } from '@/features/learning/useCelebrationGate';
import { useEnergy } from '@/features/plus/api';
import { pickSmartReview } from '@/features/plus/smartReview';
import { pickTopicReview } from '@/features/plus/topicReview';

const REVIEW_SIZE = 10;

/**
 * review: palabras que vencieron (se guarda y actualiza la repetición espaciada).
 * practice / mistakes: práctica libre con palabras ya estudiadas; no se envía al servidor
 * para no adelantar los repasos.
 * smart (PolyGo Plus): vencidas + errores frecuentes + difíciles + por olvidar (ver
 * pickSmartReview). Se guarda como repaso: un acierto antes de tiempo no adelanta la palabra y un
 * error la trae de vuelta, igual que en el repaso espaciado.
 * topic (PolyGo Plus): las palabras estudiadas de una unidad (param `unit`, ver pickTopicReview).
 * También se guarda como repaso.
 * Todo lo que no es smart ni topic es gratis. Ningún repaso usa energía.
 */
type ReviewMode = 'review' | 'practice' | 'mistakes' | 'smart' | 'topic';

const TITLES: Record<ReviewMode, string> = {
  review: 'Repaso de vocabulario',
  practice: 'Práctica libre',
  mistakes: 'Tus puntos débiles',
  smart: 'Repaso inteligente',
  topic: 'Repaso por tema',
};

interface ReviewSession {
  exercises: Exercise[];
  words: Record<string, WordRow>;
}

export default function ReviewScreenWithLanguage() {
  return (
    <SessionLanguageProvider>
      <ReviewScreen />
    </SessionLanguageProvider>
  );
}

function ReviewScreen() {
  const params = useLocalSearchParams<{ mode?: string; unit?: string }>();
  const mode: ReviewMode =
    params.mode === 'practice' ||
    params.mode === 'mistakes' ||
    params.mode === 'smart' ||
    (params.mode === 'topic' && params.unit)
      ? (params.mode as ReviewMode)
      : 'review';
  const plusMode = mode === 'smart' || mode === 'topic';
  const saves = mode === 'review' || plusMode;
  const energy = useEnergy();
  const plus = energy.view?.plus;
  // Inteligente y por tema son de Plus; el servidor dice si lo tenés. Mientras no se sabe, no arranca.
  const plusLocked = plusMode && plus !== true;
  const myWords = useMyWords();
  const pool = useWordPool();
  const language = useStudyLanguage();
  const submit = useSubmitSession();
  const celebration = useCelebrationGate(submit, saves);
  const [sessionId] = useState(uuid);
  const [startedAt] = useState(() => new Date());
  // La sesión se fija al empezar: refrescar los datos al guardar no debe cambiar los ejercicios.
  const [review, setReview] = useState<ReviewSession | null>(null);
  const [finished, setFinished] = useState<{
    state: PlayerState;
    attempts: AttemptInput[];
    endedAt: Date;
  } | null>(null);

  if (!review && !plusLocked && myWords.data && pool.data) {
    const now = startedAt.getTime();
    const due = (
      mode === 'smart'
        ? pickSmartReview(myWords.data, now).map((p) => p.entry)
        : mode === 'topic'
          ? pickTopicReview(myWords.data, params.unit ?? '', now)
          : mode === 'practice'
            ? shuffle(myWords.data, sessionId)
            : mode === 'mistakes'
              ? myWords.data.filter((w) => w.incorrectCount > 0)
              : myWords.data.filter(
                  (w) => w.nextReviewAt && new Date(w.nextReviewAt).getTime() <= now,
                )
    )
      .sort((a, b) => (mode === 'practice' || plusMode ? 0 : b.incorrectCount - a.incorrectCount))
      .slice(0, plusMode ? undefined : REVIEW_SIZE)
      .map((w) => w.word);
    setReview({
      exercises: buildReviewExercises(due, pool.data, sessionId, language.code),
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
      if (saves) save(attempts);
    },
    [save, saves],
  );

  if (plusMode && plus === false) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <EmptyState
          icon={<Sparkles color={colors.primarySoft} size={44} />}
          title={`${TITLES[mode]} es de PolyGo Plus`}
          message={
            mode === 'topic'
              ? 'Repasá sólo las palabras de la unidad que elijas. El repaso espaciado, la práctica libre y tus puntos débiles siguen siendo gratis.'
              : 'Arma cada sesión con tus errores frecuentes, las palabras que te cuestan y las que estás por olvidar. El repaso espaciado, la práctica libre y tus puntos débiles siguen siendo gratis.'
          }
        />
        <Button label="Conocé PolyGo Plus" onPress={() => router.replace('/plus')} />
        <Button label="Volver" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }
  if (plusMode && energy.isError) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <ErrorState message="No pudimos verificar tu suscripción." onRetry={energy.refetch} />
      </Screen>
    );
  }
  if (
    plusLocked ||
    myWords.isPending ||
    pool.isPending ||
    (!review && !myWords.isError && !pool.isError)
  ) {
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
          title={mode === 'review' || mode === 'smart' ? 'Estás al día' : 'Nada para practicar'}
          message={
            mode === 'smart'
              ? 'No hay palabras vencidas, con errores frecuentes ni por olvidar. Completá lecciones y volvé más tarde.'
              : mode === 'review'
                ? 'No tenés palabras para repasar ahora. Las palabras que estudies volverán cuando toque repasarlas.'
                : 'Completá lecciones para sumar palabras a tu práctica.'
          }
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
          Alert.alert(
            '¿Salir del repaso?',
            saves
              ? 'Las respuestas de este repaso no se van a guardar.'
              : 'Podés volver cuando quieras.',
            [
              { text: 'Seguir', style: 'cancel' },
              { text: 'Salir', style: 'destructive', onPress: () => router.back() },
            ],
          )
        }
        onFinished={handleFinished}
      />
    );
  }

  if (celebration.screen) return celebration.screen;

  return (
    <SessionResults
      title={TITLES[mode]}
      stats={sessionStats(finished.state)}
      durationSeconds={Math.round((finished.endedAt.getTime() - startedAt.getTime()) / 1000)}
      words={review.words}
      saving={saves && submit.isPending}
      saveError={saves ? submit.error : null}
      saved={!saves || submit.isSuccess}
      achievements={saves ? (submit.data?.achievements_unlocked ?? []) : []}
      mistakesHint={
        saves
          ? undefined
          : 'Esta práctica no cambia tus repasos: seguí con el repaso espaciado para fijarlas.'
      }
      onRetrySave={() => save(finished.attempts)}
      primaryLabel="Listo"
      onPrimary={celebration.guard(() => router.back())}
      onExit={celebration.guard(() => router.back())}
    />
  );
}
