import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Hourglass, Sparkles } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import type { Exercise } from '@shared/exercises';

import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  Text,
  colors,
  spacing,
  useTheme,
} from '@/design-system';
import {
  LearningSessionHttpError,
  localDateString,
  type PersistentUnit,
  type ReviewFocus,
  type WordRow,
} from '@/features/learning/api';
import {
  SessionPlayer,
  type InstantGrader,
  type RemoteGrader,
} from '@/features/learning/components/SessionPlayer';
import { SessionResults } from '@/features/learning/components/SessionResults';
import {
  useAnswerServerReview,
  useMyWords,
  useServerReview,
  useStudyLanguage,
  useSubmitServerReview,
  useWordPool,
} from '@/features/learning/hooks';
import {
  SERVER_REVIEW_RETRIES,
  answeredAttempts,
  clearOpenReview,
  clientVerdictOf,
  gradingKeys,
  loadOpenReview,
  localReviewGrade,
  presentationIdOf,
  reconcileWithServer,
  remoteGrade,
  reviewKind,
  reviewSession,
  reviewSubmission,
  saveOpenReview,
  type OpenReview,
} from '@/features/learning/serverReview';
import { sessionStats, type PlayerState } from '@/features/learning/player';
import { reviewAnswerQueue, SESSION_GONE } from '@/features/learning/reviewAnswerQueue';
import { shuffle, uuid } from '@/features/learning/random';
import { buildReviewExercises } from '@/features/learning/review';
import { SessionLanguageProvider } from '@/features/learning/SessionLanguageProvider';
import { useCelebrationGate } from '@/features/learning/useCelebrationGate';
import { useEnergy } from '@/features/plus/api';
import { useXp, type XpState } from '@/features/xp/api';
import { XpRewardCard } from '@/features/xp/XpRewardCard';
import { useStrings } from '@/i18n';
import { reviewStrings } from '@/i18n/screens/review';

/** Palabras por práctica (la misma cantidad que el repaso básico). */
const PRACTICE_SIZE = 10;

/**
 * review: el repaso lo arma, lo corrige y lo guarda el SERVIDOR (fase 4, docs/LEARNING_PHASE4.md §2:
 * start_review / answer_review / submit_review). Con el SRS v2 encendido lo arma el armador adaptativo;
 * con el v2 apagado, el servidor arma el repaso básico con las reglas del SRS v1 (cierre de la fase 5:
 * vencidas, más errores primero, 10). En los dos casos el servidor corrige y guarda
 * (record_learning_session). Si el servidor no responde, la pantalla muestra un estado recuperable y
 * nunca guarda por la ruta vieja.
 * smart / topic (PolyGo Plus): también por el SERVIDOR (cierre de la fase 4, P3): el servidor comprueba
 * Plus, elige las palabras con las reglas de siempre (shared/focusReview.ts: inteligente = vencidas +
 * errores frecuentes + difíciles + por olvidar; por tema = las estudiadas de la unidad `unit`), registra
 * lo presentado, corrige cada respuesta y guarda el envío como cualquier repaso.
 * En los repasos del servidor un error vuelve al final de la sesión hasta 2 veces (P4): lo corrige el
 * servidor, pero sólo el primer intento es evidencia.
 * practice / mistakes: práctica libre con palabras ya estudiadas; no se envía al servidor
 * para no adelantar los repasos.
 * Todo lo que no es smart ni topic es gratis. Ningún repaso usa energía.
 */
type ReviewMode = 'review' | 'practice' | 'mistakes' | 'smart' | 'topic';

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
  const focus = useMemo<ReviewFocus | undefined>(
    () =>
      mode === 'smart'
        ? { kind: 'smart' }
        : mode === 'topic' && params.unit
          ? { kind: 'topic', unit_id: params.unit }
          : undefined,
    [mode, params.unit],
  );
  if (mode === 'review') return <ServerReviewScreen mode="review" />;
  if ((mode === 'smart' || mode === 'topic') && focus) {
    return <PlusReviewScreen mode={mode} focus={focus} />;
  }
  return <LegacyReviewScreen mode={mode === 'mistakes' ? 'mistakes' : 'practice'} />;
}

const newOpenReview = (): OpenReview => ({
  sessionId: uuid(),
  startedAt: new Date().toISOString(),
  date: localDateString(),
});

/** Códigos con los que la sesión guardada ya no sirve: se empieza otra. */
const RESTART_CODES = new Set(['session_closed', 'session_conflict']);

function PlusUpsell({ mode }: { mode: 'smart' | 'topic' }) {
  useTheme();
  const t = useStrings(reviewStrings);
  return (
    <Screen edges={['top', 'bottom']} scroll={false}>
      <EmptyState
        icon={<Sparkles color={colors.primarySoft} size={44} />}
        title={t.plusTitle(t.titles[mode])}
        message={mode === 'topic' ? t.topicUpsell : t.smartUpsell}
      />
      <Button label={t.discoverPlus} onPress={() => router.replace('/plus')} />
      <Button label={t.back} variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

/**
 * Repasos de Plus: la app sólo evita pedirle al servidor un repaso que no corresponde; quien decide es el
 * servidor (has_plus), que también rechaza con plus_required.
 */
function PlusReviewScreen({ mode, focus }: { mode: 'smart' | 'topic'; focus: ReviewFocus }) {
  const t = useStrings(reviewStrings);
  const energy = useEnergy();
  const plus = energy.view?.plus;
  if (plus === false) return <PlusUpsell mode={mode} />;
  if (energy.isError) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <ErrorState message={t.verifyError} onRetry={energy.refetch} />
      </Screen>
    );
  }
  if (plus !== true) return <LoadingState label={t.preparing} />;
  return <ServerReviewScreen mode={mode} focus={focus} />;
}

/** Repaso armado y corregido por el servidor: adaptativo (fase 4) o foco de Plus (P3). */
function ServerReviewScreen({ mode, focus }: { mode: ReviewMode; focus?: ReviewFocus }) {
  useTheme();
  const t = useStrings(reviewStrings);
  const language = useStudyLanguage();
  const kind = reviewKind(focus);
  const [open, setOpen] = useState<OpenReview | null>(null);
  useEffect(() => {
    let alive = true;
    void loadOpenReview(language.code, kind).then((found) => {
      if (alive) setOpen(found ?? newOpenReview());
    });
    return () => {
      alive = false;
    };
  }, [language.code, kind]);

  const review = useServerReview(open?.sessionId ?? null, language.code, focus);
  const answer = useAnswerServerReview(open?.sessionId ?? null);
  const submit = useSubmitServerReview();
  // Envío de una sesión de otro día que quedó completa sin enviar (P7): no se pierde su evidencia.
  const finalize = useSubmitServerReview();
  const celebration = useCelebrationGate(submit);
  const [finished, setFinished] = useState<{ state: PlayerState; endedAt: Date } | null>(null);
  // XP de antes del repaso (para mostrar cuánto ganaste): se toma mientras se juega.
  const xp = useXp();
  const [xpBefore, setXpBefore] = useState<XpState | null | undefined>(undefined);
  if (xpBefore === undefined && xp.data !== undefined && !finished) setXpBefore(xp.data);

  const { reset: finalizeReset } = finalize;
  // Se olvida la sesión guardada y, recién después, se empieza otra.
  const restart = useCallback(
    () =>
      clearOpenReview(language.code, kind).then(() => {
        finalizeReset();
        setFinished(null);
        setOpen(newOpenReview());
      }),
    [language.code, kind, finalizeReset],
  );

  // Una sesión ya enviada (p. ej. desde otro dispositivo) o de otro tipo no se retoma: se empieza otra.
  const stale =
    review.error instanceof LearningSessionHttpError && RESTART_CODES.has(review.error.code);
  useEffect(() => {
    if (stale) void restart();
  }, [stale, restart]);

  const data = review.data;
  const expired = data?.status === 'session_expired';
  const { mutate: finalizeMutate, isIdle: finalizeIdle } = finalize;
  useEffect(() => {
    if (!expired || !open || !data) return;
    if (!data.complete) {
      // Vencida e incompleta: queda registrada en el servidor (no es evidencia) y se empieza otra.
      void restart();
      return;
    }
    if (!finalizeIdle) return;
    finalizeMutate(
      {
        sessionId: open.sessionId,
        startedAt: new Date(open.startedAt),
        attempts: reviewSubmission({ attempts: answeredAttempts(data.items) }),
      },
      {
        onSuccess: () => void restart(),
        // Un rechazo del servidor (ya enviada, no coincide) no se arregla reintentando: se sigue.
        onError: (err) => {
          if (err instanceof LearningSessionHttpError) void restart();
        },
      },
    );
  }, [expired, open, data, finalizeIdle, finalizeMutate, restart]);

  const session = useMemo(
    () => (data?.status === 'ok' && data.items.length > 0 ? reviewSession(data.items) : null),
    [data],
  );
  // Recién cuando el servidor registró el plan se guarda para poder retomarlo.
  useEffect(() => {
    if (open && session) void saveOpenReview(language.code, open, kind);
  }, [open, session, language.code, kind]);

  const { mutateAsync: answerAsync } = answer;
  const { refetch: refetchReview } = review;
  const grade: RemoteGrader = useCallback(
    async (exercise, response, ctx) => {
      try {
        return remoteGrade(
          await answerAsync({
            presentationId: presentationIdOf(exercise.id),
            answer: response,
            responseMs: ctx.responseMs,
            assists: ctx.assists,
            attemptNo: ctx.attemptNo,
          }),
        );
      } catch (err) {
        // Pasó la medianoche durante el repaso (session_expired) o la sesión ya se envió, p. ej. desde
        // otro dispositivo (session_closed): el servidor ya no admite respuestas nuevas y reintentar no
        // sirve. Se vuelve a preguntar por la sesión: vencida y completa se envía; vencida incompleta o
        // cerrada, se empieza otra (RESTART_CODES).
        if (err instanceof LearningSessionHttpError && SESSION_GONE.has(err.code)) {
          void refetchReview();
        }
        throw err;
      }
    },
    [answerAsync, refetchReview],
  );

  // Corrección instantánea (docs/LEARNING_INSTANT_REVIEW.md): con la clave de cada ítem el feedback sale
  // en el momento y la respuesta se registra en segundo plano, en orden y una vez por intento. Sin
  // claves (learning-session anterior) el reproductor espera al servidor como siempre («Comprobando…»).
  const queue = useMemo(() => (open ? reviewAnswerQueue(open.sessionId) : null), [open]);
  const keys = useMemo(() => (data?.status === 'ok' ? gradingKeys(data.items) : {}), [data]);
  const instant = useMemo<InstantGrader | undefined>(() => {
    if (!queue || Object.keys(keys).length === 0) return undefined;
    return {
      grade: (exercise, response) => localReviewGrade(keys[exercise.id], response),
      record: (exercise, response, ctx) =>
        queue
          .enqueue({
            presentationId: presentationIdOf(exercise.id),
            answer: response,
            responseMs: ctx.responseMs,
            assists: ctx.assists,
            attemptNo: ctx.attemptNo,
            clientVerdict: clientVerdictOf(ctx.verdict),
          })
          .then(remoteGrade, (err: unknown) => {
            // La sesión ya no admite respuestas (medianoche, enviada desde otro dispositivo): como en
            // la corrección del servidor, se vuelve a pedir la sesión.
            if (err instanceof LearningSessionHttpError && SESSION_GONE.has(err.code)) {
              void refetchReview();
            }
            throw err;
          }),
    };
  }, [queue, keys, refetchReview]);

  const { mutate: submitMutate } = submit;
  const save = useCallback(
    (state: PlayerState) => {
      if (!open || !queue) return;
      submitMutate(
        {
          sessionId: open.sessionId,
          startedAt: new Date(open.startedAt),
          // Primero terminan de registrarse las respuestas pendientes; después se envía con la
          // corrección del servidor (prevalece) y se muestran esos resultados.
          attempts: async () => {
            await queue.flush();
            const settled = reconcileWithServer(state, queue.results);
            if (settled !== state) {
              setFinished((f) => (f && f.state === state ? { ...f, state: settled } : f));
            }
            return reviewSubmission(settled);
          },
        },
        { onSuccess: () => void clearOpenReview(language.code, kind) },
      );
    },
    [submitMutate, open, queue, language.code, kind],
  );

  const handleFinished = useCallback(
    (state: PlayerState) => {
      setFinished({ state, endedAt: new Date() });
      save(state);
    },
    [save],
  );

  // Cierre de la fase 5: la app (contrato 2) nunca recibe srs_v2_disabled; si llegara, es un servidor
  // desactualizado. No se cae al repaso de la app ni a la ruta vieja: se muestra un error recuperable.
  const outdated = data?.status === 'srs_v2_disabled';
  if (
    review.error instanceof LearningSessionHttpError &&
    review.error.code === 'plus_required' &&
    (mode === 'smart' || mode === 'topic')
  ) {
    return <PlusUpsell mode={mode} />;
  }
  if (expired && finalize.isError) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <ErrorState message={t.previousSaveError} onRetry={() => finalize.reset()} />
        <Button label={t.back} variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }
  if (!open || review.isPending || stale || expired) {
    return <LoadingState label={t.preparing} />;
  }
  if (review.isError || !data || outdated) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <ErrorState message={t.prepareError} onRetry={() => void review.refetch()} />
        <Button label={t.back} variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (data.status === 'content_unavailable') {
    // Fase 5 (C): el idioma todavía no tiene ejercicios que el servidor pueda presentar y corregir.
    // No es «estás al día» ni un error: es contenido pendiente.
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <EmptyState
          icon={<Hourglass color={colors.primarySoft} size={44} />}
          title={t.unavailableTitle}
          message={t.unavailableMessage(language.code)}
        />
        <Button label={t.back} variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (!session) {
    const exhausted = data.status === 'budget_exhausted';
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <EmptyState
          icon={
            exhausted ? (
              <Hourglass color={colors.primarySoft} size={44} />
            ) : (
              <CheckCircle2 color={colors.success} size={44} />
            )
          }
          title={exhausted ? t.exhaustedTitle : mode === 'topic' ? t.nothingToReview : t.upToDate}
          message={
            exhausted
              ? t.exhaustedMessage
              : mode === 'smart'
                ? t.smartEmpty
                : mode === 'topic'
                  ? t.topicEmpty
                  : t.reviewEmpty
          }
        />
        <PersistentHelp units={data.persistent ?? []} words={{}} />
        <Button label={t.back} variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (!finished) {
    return (
      <SessionPlayer
        // Una sesión nueva (otro sessionId) reinicia el reproductor.
        key={open.sessionId}
        exercises={session.exercises}
        words={session.words}
        seed={open.sessionId}
        shownOptions={session.shownOptions}
        grade={grade}
        instant={instant}
        maxRetries={SERVER_REVIEW_RETRIES}
        answered={session.answered}
        onClose={() =>
          Alert.alert(t.exitReviewTitle, t.exitReviewMessage, [
            { text: t.stay, style: 'cancel' },
            { text: t.leave, style: 'destructive', onPress: () => router.back() },
          ])
        }
        onFinished={handleFinished}
      />
    );
  }

  if (celebration.screen) return celebration.screen;

  return (
    <SessionResults
      title={t.titles[mode]}
      stats={sessionStats(finished.state)}
      durationSeconds={Math.max(
        0,
        Math.round((finished.endedAt.getTime() - Date.parse(open.startedAt)) / 1000),
      )}
      words={session.words}
      saving={submit.isPending}
      saveError={submit.error}
      saved={submit.isSuccess}
      achievements={submit.data?.achievements_unlocked ?? []}
      onRetrySave={() => save(finished.state)}
      extra={<PersistentHelp units={data.persistent ?? []} words={session.words} />}
      reward={<XpRewardCard before={xpBefore} saved={submit.isSuccess} />}
      primaryLabel={t.done}
      onPrimary={celebration.guard(() => router.back())}
      onExit={celebration.guard(() => router.back())}
    />
  );
}

/** AL17: unidades que siguen costando → volver a la explicación de la lección. */
function PersistentHelp({
  units,
  words,
}: {
  units: PersistentUnit[];
  words: Record<string, WordRow>;
}) {
  const t = useStrings(reviewStrings);
  const withLesson = units.filter((u) => u.intro_lesson_id);
  if (withLesson.length === 0) return null;
  return (
    <Card style={styles.gap}>
      <Text variant="overline">{t.strugglingOverline}</Text>
      <Text color="textMuted">{t.strugglingBody}</Text>
      {withLesson.slice(0, 3).map((u) => (
        <Button
          key={u.concept_id + '|' + u.dimension}
          label={t.seeExplanation(words[u.concept_id]?.text ?? u.concept_id)}
          variant="secondary"
          onPress={() =>
            router.push({ pathname: '/lesson-intro/[id]', params: { id: u.intro_lesson_id! } })
          }
        />
      ))}
    </Card>
  );
}

/**
 * Práctica de la app: practice y mistakes. No se envía al servidor ni cambia los repasos. Desde el
 * cierre de la fase 5 el repaso básico ya no se juega acá: lo arma, corrige y guarda el servidor.
 */
function LegacyReviewScreen({ mode }: { mode: 'practice' | 'mistakes' }) {
  useTheme();
  const t = useStrings(reviewStrings);
  const myWords = useMyWords();
  const pool = useWordPool();
  const language = useStudyLanguage();
  const [sessionId] = useState(uuid);
  const [startedAt] = useState(() => new Date());
  // La sesión se fija al empezar: refrescar los datos no debe cambiar los ejercicios.
  const [review, setReview] = useState<ReviewSession | null>(null);
  const [finished, setFinished] = useState<{ state: PlayerState; endedAt: Date } | null>(null);

  if (!review && myWords.data && pool.data) {
    const due = (
      mode === 'practice'
        ? shuffle(myWords.data, sessionId)
        : myWords.data.filter((w) => w.incorrectCount > 0)
    )
      .sort((a, b) => (mode === 'practice' ? 0 : b.incorrectCount - a.incorrectCount))
      .slice(0, PRACTICE_SIZE)
      .map((w) => w.word);
    setReview({
      exercises: buildReviewExercises(due, pool.data, sessionId, language.code),
      words: Object.fromEntries(due.map((w) => [w.id, w])),
    });
  }

  const handleFinished = useCallback((state: PlayerState) => {
    setFinished({ state, endedAt: new Date() });
  }, []);

  if (myWords.isPending || pool.isPending || (!review && !myWords.isError && !pool.isError)) {
    return <LoadingState label={t.preparingPractice} />;
  }
  if (myWords.isError || pool.isError || !review) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <ErrorState
          message={t.practiceError}
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
          title={t.nothingToPractice}
          message={t.nothingToPracticeMessage}
        />
        <Button label={t.back} variant="secondary" onPress={() => router.back()} />
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
          Alert.alert(t.exitPracticeTitle, t.exitPracticeMessage, [
            { text: t.stay, style: 'cancel' },
            { text: t.leave, style: 'destructive', onPress: () => router.back() },
          ])
        }
        onFinished={handleFinished}
      />
    );
  }

  return (
    <SessionResults
      title={t.titles[mode]}
      stats={sessionStats(finished.state)}
      durationSeconds={Math.round((finished.endedAt.getTime() - startedAt.getTime()) / 1000)}
      words={review.words}
      saving={false}
      saveError={null}
      saved
      achievements={[]}
      mistakesHint={t.practiceMistakesHint}
      onRetrySave={() => {}}
      primaryLabel={t.done}
      onPrimary={() => router.back()}
      onExit={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
});
