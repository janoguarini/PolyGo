import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import { useEffect, useReducer, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { checkAnswer, serializeAnswer, type AnswerVerdict } from '@shared/answers';
import type { Exercise, UserAnswer } from '@shared/exercises';

import { Button, ProgressBar, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';
import { playSound } from '@/lib/sounds';

import type { WordRow } from '../api';
import {
  createPlayer,
  currentExercise,
  playerReducer,
  progress,
  type Attempt,
  type PlayerState,
} from '../player';
import { useSessionLanguage } from '../readings';
import { stopSpeaking } from '../speech';
import { playerStrings } from '../strings';
import { AnswerInput } from './AnswerInput';
import { AnswerRecap } from './AnswerRecap';
import { ExercisePrompt } from './ExercisePrompt';
import { FeedbackPanel } from './FeedbackPanel';

/** Reloj de pared para medir tiempos de respuesta (sólo en efectos y manejadores de eventos). */
const nowMs = () => Date.now();

/** Corrección del servidor de una respuesta (repasos del servidor, fase 4). */
export interface RemoteGrade {
  verdict: AnswerVerdict;
  /** La respuesta registrada (si el servidor ya tenía una, es esa y no la recién enviada). */
  response: UserAnswer;
  responseMs: number;
  explanation: string | null;
}

export type RemoteGrader = (
  exercise: Exercise,
  answer: UserAnswer,
  /** attemptNo: 1 = primer intento (la respuesta que vale); 2+ = repetición de un error (P4). */
  context: { responseMs: number; assists?: Record<string, number | boolean>; attemptNo: number },
) => Promise<RemoteGrade>;

/**
 * Corrección instantánea de los repasos (docs/LEARNING_INSTANT_REVIEW.md): el feedback sale en el momento
 * de la clave del ítem y la respuesta se registra en segundo plano; la corrección del servidor prevalece
 * (acción `reconcile`). Un ítem sin clave se corrige como antes, esperando al servidor (`grade`).
 */
export interface InstantGrader {
  /** Veredicto con la clave del ítem; null = sin clave (se espera al servidor). */
  grade: (
    exercise: Exercise,
    answer: UserAnswer,
  ) => { verdict: AnswerVerdict; explanation: string | null } | null;
  /** Registra el intento en segundo plano; resuelve con la corrección del servidor (la que vale). */
  record: (
    exercise: Exercise,
    answer: UserAnswer,
    context: {
      responseMs: number;
      assists?: Record<string, number | boolean>;
      attemptNo: number;
      verdict: AnswerVerdict;
    },
  ) => Promise<RemoteGrade>;
}

interface Props {
  exercises: Exercise[];
  words: Record<string, WordRow>;
  seed: string;
  /** Opciones registradas por el servidor, por ejercicio (ruta corregida en el servidor). */
  shownOptions?: Record<string, readonly string[] | null>;
  onClose: () => void;
  onFinished: (state: PlayerState) => void;
  /**
   * Si llega, el veredicto de cada respuesta lo da el servidor (no se corrige en el dispositivo) y el
   * feedback muestra su corrección. Sin conexión, la respuesta queda pendiente con «Reintentar».
   */
  grade?: RemoteGrader;
  /** Corrección instantánea con registro en segundo plano (repasos con clave de corrección). */
  instant?: InstantGrader;
  /** Repeticiones por ejercicio fallado (por defecto MAX_RETRIES; 0 = una respuesta por ítem). */
  maxRetries?: number;
  /** Respuestas ya corregidas (retomar una sesión). */
  answered?: Attempt[];
}

export function SessionPlayer({
  exercises,
  words,
  seed,
  shownOptions,
  onClose,
  onFinished,
  grade,
  instant,
  maxRetries,
  answered,
}: Props) {
  const styles = useStyles();
  const t = useStrings(playerStrings);
  const [state, dispatch] = useReducer(playerReducer, exercises, (list) =>
    createPlayer(list, { maxRetries, answered }),
  );
  // Corrección remota en curso o fallida (se reintenta con la misma respuesta).
  const [pending, setPending] = useState<{
    answer: UserAnswer;
    responseMs: number;
    failed: boolean;
  } | null>(null);
  // Respuesta correcta y explicación que dio el servidor, por ejercicio.
  const [revealed, setRevealed] = useState<Record<string, { explanation: string | null }>>({});
  const shownAt = useRef(0);
  const exercise = currentExercise(state);
  const finishedReported = useRef(false);
  // Corrección remota en curso (bloqueo síncrono contra el doble toque) y el intento en pantalla.
  const grading = useRef(false);
  const attemptKey = useRef<string | null>(null);
  // Intentos ya corregidos en el dispositivo (bloqueo síncrono contra el doble toque).
  const answeredLocally = useRef(new Set<string>());
  const { readings, showReadings, setShowReadings } = useSessionLanguage();

  useEffect(() => {
    if (state.phase === 'answering') shownAt.current = nowMs();
  }, [state.phase, state.queue]);

  // Intento que espera respuesta (ejercicio + número de intento); null en el feedback o al terminar.
  useEffect(() => {
    const id = state.phase === 'answering' ? state.queue[0] : undefined;
    attemptKey.current = id
      ? `${id}#${state.attempts.filter((a) => a.exerciseId === id).length + 1}`
      : null;
  }, [state.phase, state.queue, state.attempts]);

  useEffect(() => {
    if (state.phase === 'finished' && !finishedReported.current) {
      finishedReported.current = true;
      stopSpeaking();
      playSound('complete');
      onFinished(state);
    }
  }, [state, onFinished]);

  useEffect(() => stopSpeaking, []);

  if (!exercise || state.phase === 'finished') return null;

  const assistsNow = readings ? { reading_visible: showReadings } : undefined;

  const applyVerdict = (
    verdict: AnswerVerdict,
    answer: UserAnswer,
    responseMs: number,
    assists?: Record<string, number | boolean>,
  ) => {
    playSound(verdict.correct ? 'correct' : 'incorrect');
    if (Platform.OS !== 'web') {
      void Haptics.notificationAsync(
        verdict.correct
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    }
    dispatch({
      type: 'answer',
      verdict,
      answer: serializeAnswer(answer),
      responseMs,
      response: answer,
      // Chino: si el pinyin estaba visible al responder (ayuda reading_visible, arquitectura §7.1).
      ...(assists ? { assists } : {}),
    });
  };

  const gradeRemotely = async (answer: UserAnswer, responseMs: number) => {
    // Doble toque (Comprobar o Reintentar antes de que React deshabilite el botón): una sola corrección
    // en curso. El bloqueo es síncrono; el estado `pending` llega recién en el próximo render.
    if (!grade || grading.current) return;
    grading.current = true;
    const attemptNo = state.attempts.filter((a) => a.exerciseId === exercise.id).length + 1;
    const key = `${exercise.id}#${attemptNo}`;
    setPending({ answer, responseMs, failed: false });
    try {
      const result = await grade(exercise, answer, { responseMs, assists: assistsNow, attemptNo });
      grading.current = false;
      setPending(null);
      // Una corrección que ya no corresponde al ejercicio en pantalla no se aplica a otro.
      if (attemptKey.current !== key) return;
      setRevealed((r) => ({ ...r, [exercise.id]: { explanation: result.explanation } }));
      applyVerdict(result.verdict, result.response, result.responseMs, assistsNow);
    } catch {
      grading.current = false;
      setPending(attemptKey.current === key ? { answer, responseMs, failed: true } : null);
    }
  };

  const gradeInstantly = (answer: UserAnswer, responseMs: number): boolean => {
    const local = instant?.grade(exercise, answer);
    if (!instant || !local) return false;
    const attemptNo = state.attempts.filter((a) => a.exerciseId === exercise.id).length + 1;
    const key = `${exercise.id}#${attemptNo}`;
    if (answeredLocally.current.has(key)) return true;
    answeredLocally.current.add(key);
    const exerciseId = exercise.id;
    setRevealed((r) => ({ ...r, [exerciseId]: { explanation: local.explanation } }));
    applyVerdict(local.verdict, answer, responseMs, assistsNow);
    instant
      .record(exercise, answer, {
        responseMs,
        assists: assistsNow,
        attemptNo,
        verdict: local.verdict,
      })
      .then((result) => {
        dispatch({
          type: 'reconcile',
          exerciseId,
          attemptNo,
          verdict: result.verdict,
          response: result.response,
          answer: serializeAnswer(result.response),
        });
        if (result.explanation !== local.explanation) {
          setRevealed((r) => ({ ...r, [exerciseId]: { explanation: result.explanation } }));
        }
      })
      // Rechazo definitivo o sesión terminada: queda el veredicto de la app; el envío final corrige
      // la evidencia en el servidor (y una sesión terminada la vuelve a pedir la pantalla).
      .catch(() => {});
    return true;
  };

  const handleSubmit = (answer: UserAnswer) => {
    const responseMs = nowMs() - shownAt.current;
    if (gradeInstantly(answer, responseMs)) return;
    if (grade) {
      void gradeRemotely(answer, responseMs);
      return;
    }
    applyVerdict(checkAnswer(exercise, answer), answer, responseMs, assistsNow);
  };

  // En la corrección remota, la explicación llega con el veredicto.
  const shown: Exercise = revealed[exercise.id]
    ? { ...exercise, explanation: revealed[exercise.id]!.explanation }
    : exercise;

  const attemptNumber = state.attempts.filter((a) => a.exerciseId === exercise.id).length;
  const isRetry = attemptNumber > 0 && state.phase === 'answering';
  const word = exercise.wordIds.map((id) => words[id]).find(Boolean) ?? null;

  return (
    <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.top}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.exit}
            onPress={onClose}
            hitSlop={12}
            style={styles.close}
          >
            <X color={colors.textMuted} size={26} />
          </Pressable>
          <View style={styles.flex}>
            <ProgressBar value={progress(state)} height={10} accessibilityLabel={t.progress} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {isRetry || readings ? (
            <View style={styles.meta}>
              {isRetry ? (
                <Text variant="overline" color="streak">
                  {t.mistakeReview}
                </Text>
              ) : null}
              {readings ? (
                // Chino: mostrar u ocultar el pinyin encima de los caracteres.
                <Pressable
                  accessibilityRole="switch"
                  accessibilityLabel={t.showPinyin}
                  accessibilityState={{ checked: showReadings }}
                  onPress={() => setShowReadings(!showReadings)}
                  hitSlop={8}
                  style={[styles.pinyin, showReadings && styles.pinyinOn]}
                >
                  <Text variant="caption" color={showReadings ? 'textStrong' : 'textMuted'}>
                    {t.pinyin}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
          <ExercisePrompt exercise={shown} answered={state.phase === 'feedback'} />
          {state.phase === 'feedback' && state.lastVerdict ? (
            // Abajo, donde estaba "Comprobar": el pulgar no tiene que moverse.
            <View style={styles.feedback}>
              <View style={styles.recap}>
                <AnswerRecap
                  exercise={shown}
                  verdict={state.lastVerdict}
                  answer={state.lastAnswer}
                />
              </View>
              <FeedbackPanel
                exercise={shown}
                verdict={state.lastVerdict}
                word={word}
                onContinue={() => dispatch({ type: 'continue' })}
              />
            </View>
          ) : (
            <>
              {/* La key reinicia la selección en cada intento. */}
              <AnswerInput
                key={`${exercise.id}-${attemptNumber}`}
                exercise={exercise}
                seed={seed}
                shownOptions={shownOptions?.[exercise.id]}
                disabled={state.phase !== 'answering' || pending !== null}
                onSubmit={handleSubmit}
              />
              {pending ? (
                <View style={styles.pending} accessibilityLiveRegion="polite">
                  <Text color={pending.failed ? 'danger' : 'textMuted'} align="center">
                    {pending.failed ? t.checkFailed : t.checking}
                  </Text>
                  {pending.failed ? (
                    <Button
                      label={t.retry}
                      variant="secondary"
                      onPress={() => void gradeRemotely(pending.answer, pending.responseMs)}
                    />
                  ) : null}
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    fill: { flex: 1, backgroundColor: colors.background },
    top: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },
    close: { width: 32, height: 44, justifyContent: 'center' },
    meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    pinyin: {
      marginLeft: 'auto',
      paddingHorizontal: spacing.md,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pinyinOn: { borderColor: colors.primaryBright, backgroundColor: colors.surfaceHighlight },
    flex: { flex: 1 },
    content: { padding: spacing.xl, paddingTop: spacing.lg, gap: spacing.xl, flexGrow: 1 },
    feedback: { flex: 1, gap: spacing.xl },
    // Ocupa el hueco entre el enunciado y el panel, con el resumen centrado.
    recap: { flex: 1, justifyContent: 'center' },
    pending: { gap: spacing.sm },
  }),
);
