import { Volume2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import type { QuestionView } from '@shared/protocol';
import { streakBonus, streakLevel } from '@shared/wordRush';

import { Button, Card, MIN_TOUCH, Text, TextField, colors, radii, spacing } from '@/design-system';
import { speakEnglish, stopSpeaking } from '@/features/learning/speech';

import type { AnswerFeedback } from '../state';

interface Props {
  question: QuestionView;
  feedback: AnswerFeedback | null;
  /** Correctas seguidas hasta ahora. */
  streak: number;
  disabled: boolean;
  /** Opción elegida o, en las preguntas para escribir, el texto. */
  onAnswer: (choice: number | string) => void;
}

const INSTRUCTIONS = {
  audio: 'ESCUCHÁ Y ELEGÍ QUÉ SIGNIFICA',
  image: '¿CÓMO SE DICE EN INGLÉS?',
  write: 'ESCRIBÍ LA PALABRA EN INGLÉS',
  en_es: 'ELEGÍ LA TRADUCCIÓN AL ESPAÑOL',
  es_en: 'ELEGÍ LA PALABRA EN INGLÉS',
} as const;

/** Colores de la racha por escalón (3, 5 y 8 seguidas). */
const STREAK_COLORS = [colors.streak, colors.streak, colors.danger, colors.gold] as const;

/**
 * Enunciado (texto, audio o imagen) y 4 opciones; en las preguntas para escribir (desde Oro), un
 * campo de texto. La correcta sólo se conoce al responder.
 */
export function QuestionCard({ question, feedback, streak, disabled, onAnswer }: Props) {
  const shown = feedback?.questionIndex === question.index ? feedback : null;
  const kind = question.kind ?? 'text';
  const level = streakLevel(streak);
  const bonus = shown?.correct ? streakBonus(shown.streak) : 0;

  // Las de audio se escuchan solas al aparecer (se pueden repetir con el parlante).
  useEffect(() => {
    if (kind === 'audio') speakEnglish(question.prompt);
  }, [kind, question.index, question.prompt]);
  useEffect(() => () => stopSpeaking(), []);

  return (
    <View style={styles.wrap}>
      <Card style={[styles.prompt, level > 0 && { borderColor: STREAK_COLORS[level] }]}>
        {level > 0 ? (
          <Animated.View
            key={streak}
            entering={ZoomIn.springify().damping(12)}
            style={[styles.streak, { backgroundColor: STREAK_COLORS[level] }]}
            accessible
            accessibilityLabel={`Racha de ${streak} correctas: la próxima suma ${streakBonus(streak + 1)} extra`}
          >
            <Text variant="bodyStrong" color="textStrong">
              {`🔥 Racha x${streak} · +${streakBonus(streak + 1)}`}
            </Text>
          </Animated.View>
        ) : null}

        <Text variant="overline">
          {kind === 'text' ? INSTRUCTIONS[question.direction] : INSTRUCTIONS[kind]}
        </Text>

        {kind === 'audio' ? (
          <View style={styles.audio}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Escuchar otra vez"
              onPress={() => speakEnglish(question.prompt)}
              style={({ pressed }) => [styles.speaker, pressed && styles.pressed]}
            >
              <Volume2 color={colors.onPrimary} size={40} />
            </Pressable>
            {/* La palabra se muestra recién al responder, para aprender cómo se escribe. */}
            <Text variant="heading" align="center" style={!shown && styles.hidden}>
              {question.prompt}
            </Text>
          </View>
        ) : kind === 'image' && question.emoji ? (
          <Text style={styles.emoji} accessibilityLabel={`Imagen: ${question.prompt}`}>
            {question.emoji}
          </Text>
        ) : (
          <Text variant="display" align="center" accessibilityRole="header">
            {question.prompt}
          </Text>
        )}

        {shown ? (
          <Text
            variant="bodyStrong"
            color={shown.correct ? 'success' : 'danger'}
            align="center"
            accessibilityLiveRegion="assertive"
          >
            {shown.correct
              ? bonus > 0
                ? `¡En racha! +${shown.points}`
                : `¡Bien! +${shown.points}`
              : shown.correctText
                ? `Se escribe «${shown.correctText}» · ${shown.points}`
                : `${shown.points}`}
          </Text>
        ) : (
          <Text variant="bodyStrong" align="center" style={styles.hidden}>
            {' '}
          </Text>
        )}
      </Card>

      {kind === 'write' ? (
        <WriteAnswer
          key={question.index}
          disabled={disabled || Boolean(shown)}
          onSubmit={(text) => onAnswer(text)}
        />
      ) : (
        <View style={styles.options}>
          {question.options.map((option, i) => {
            const isCorrect = shown && i === shown.correctOption;
            const isWrongChoice = shown && i === shown.chosen && !shown.correct;
            return (
              <Pressable
                key={`${question.index}-${i}`}
                accessibilityRole="button"
                accessibilityLabel={option}
                accessibilityState={{ disabled: disabled || Boolean(shown) }}
                disabled={disabled || Boolean(shown)}
                onPress={() => onAnswer(i)}
                style={({ pressed }) => [
                  styles.option,
                  isCorrect && styles.correct,
                  isWrongChoice && styles.wrong,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  variant="heading"
                  align="center"
                  color={isCorrect || isWrongChoice ? 'textStrong' : 'text'}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

/** Campo para escribir la respuesta: se envía con el botón o con «enviar» del teclado. */
function WriteAnswer({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const submit = () => {
    if (text.trim() && !disabled) onSubmit(text);
  };
  return (
    <View style={styles.options}>
      <TextField
        label="Tu respuesta"
        value={text}
        onChangeText={setText}
        onSubmitEditing={submit}
        editable={!disabled}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        returnKeyType="send"
        submitBehavior="submit"
        style={styles.writeInput}
      />
      <Button label="Responder" onPress={submit} disabled={disabled || !text.trim()} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  prompt: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl, borderWidth: 1.5 },
  hidden: { opacity: 0 },
  streak: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
  },
  audio: { alignItems: 'center', gap: spacing.sm },
  speaker: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  emoji: { fontSize: 84, lineHeight: 100, textAlign: 'center' },
  options: { gap: spacing.md },
  writeInput: { fontSize: 22, textAlign: 'center' },
  option: {
    minHeight: MIN_TOUCH + 12,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  correct: { borderColor: colors.success, backgroundColor: colors.successDeep },
  wrong: { borderColor: colors.danger, backgroundColor: colors.dangerDeep },
  pressed: { transform: [{ scale: 0.98 }], backgroundColor: colors.surfaceRaised },
});
