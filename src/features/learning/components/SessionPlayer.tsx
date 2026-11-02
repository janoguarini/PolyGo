import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import { useEffect, useReducer, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { checkAnswer, serializeAnswer } from '@shared/answers';
import type { Exercise, UserAnswer } from '@shared/exercises';

import { ProgressBar, Text, colors, radii, spacing } from '@/design-system';
import { playSound } from '@/lib/sounds';

import type { WordRow } from '../api';
import {
  createPlayer,
  currentExercise,
  playerReducer,
  progress,
  type PlayerState,
} from '../player';
import { useSessionLanguage } from '../readings';
import { stopSpeaking } from '../speech';
import { AnswerInput } from './AnswerInput';
import { ExercisePrompt } from './ExercisePrompt';
import { FeedbackPanel } from './FeedbackPanel';

/** Reloj de pared para medir tiempos de respuesta (sólo en efectos y manejadores de eventos). */
const nowMs = () => Date.now();

interface Props {
  exercises: Exercise[];
  words: Record<string, WordRow>;
  seed: string;
  onClose: () => void;
  onFinished: (state: PlayerState) => void;
}

export function SessionPlayer({ exercises, words, seed, onClose, onFinished }: Props) {
  const [state, dispatch] = useReducer(playerReducer, exercises, createPlayer);
  const shownAt = useRef(0);
  const exercise = currentExercise(state);
  const finishedReported = useRef(false);
  const { readings, showReadings, setShowReadings } = useSessionLanguage();

  useEffect(() => {
    if (state.phase === 'answering') shownAt.current = nowMs();
  }, [state.phase, state.queue]);

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

  const handleSubmit = (answer: UserAnswer) => {
    const verdict = checkAnswer(exercise, answer);
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
      responseMs: nowMs() - shownAt.current,
    });
  };

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
            accessibilityLabel="Salir de la sesión"
            onPress={onClose}
            hitSlop={12}
            style={styles.close}
          >
            <X color={colors.textMuted} size={26} />
          </Pressable>
          <View style={styles.flex}>
            <ProgressBar
              value={progress(state)}
              height={10}
              accessibilityLabel="Progreso de la sesión"
            />
          </View>
          {readings ? (
            // Chino: mostrar u ocultar el pinyin encima de los caracteres.
            <Pressable
              accessibilityRole="switch"
              accessibilityLabel="Mostrar pinyin"
              accessibilityState={{ checked: showReadings }}
              onPress={() => setShowReadings(!showReadings)}
              hitSlop={8}
              style={[styles.pinyin, showReadings && styles.pinyinOn]}
            >
              <Text variant="caption" color={showReadings ? 'textStrong' : 'textMuted'}>
                pīn
              </Text>
            </Pressable>
          ) : null}
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {isRetry ? (
            <Text variant="overline" color="streak">
              REPASO DE ERRORES
            </Text>
          ) : null}
          <ExercisePrompt exercise={exercise} />
          {state.phase === 'feedback' && state.lastVerdict ? (
            // Abajo, donde estaba "Comprobar": el pulgar no tiene que moverse.
            <View style={styles.feedback}>
              <FeedbackPanel
                exercise={exercise}
                verdict={state.lastVerdict}
                word={word}
                onContinue={() => dispatch({ type: 'continue' })}
              />
            </View>
          ) : (
            // La key reinicia la selección en cada intento.
            <AnswerInput
              key={`${exercise.id}-${attemptNumber}`}
              exercise={exercise}
              seed={seed}
              disabled={state.phase !== 'answering'}
              onSubmit={handleSubmit}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  close: { width: 32, height: 44, justifyContent: 'center' },
  pinyin: {
    minWidth: 44,
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
  feedback: { flex: 1, justifyContent: 'flex-end' },
});
