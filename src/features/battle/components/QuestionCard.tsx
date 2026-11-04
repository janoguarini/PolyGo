import { Turtle, Volume2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import type { QuestionView } from '@shared/protocol';
import { streakBonus, streakLevel } from '@shared/wordRush';

import { Button, Card, MIN_TOUCH, Text, TextField, colors, radii, spacing } from '@/design-system';
import { TargetText, useSessionLanguage } from '@/features/learning/readings';
import { speak, stopSpeaking } from '@/features/learning/speech';

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

/** Consignas en mayúsculas según el idioma de la partida («en italiano»). */
function instructions(inName: string) {
  const lang = inName.toUpperCase();
  return {
    audio: 'ESCUCHÁ Y ELEGÍ QUÉ SIGNIFICA',
    image: `¿CÓMO SE DICE ${lang}?`,
    write: `ESCRIBÍ LA PALABRA ${lang}`,
    en_es: 'ELEGÍ LA TRADUCCIÓN AL ESPAÑOL',
    es_en: `ELEGÍ LA PALABRA ${lang}`,
  } as const;
}

/** Colores de la racha por escalón (3, 5 y 8 seguidas). */
const STREAK_COLORS = [colors.streak, colors.streak, colors.danger, colors.gold] as const;

/**
 * Enunciado (texto, audio o imagen) y 4 opciones; en las preguntas para escribir (desde Oro), un
 * campo de texto. La correcta sólo se conoce al responder.
 */
export function QuestionCard({ question, feedback, streak, disabled, onAnswer }: Props) {
  const { language } = useSessionLanguage();
  const INSTRUCTIONS = instructions(language.inName);
  const shown = feedback?.questionIndex === question.index ? feedback : null;
  const kind = question.kind ?? 'text';
  const level = streakLevel(streak);
  // El cartel sólo salta al subir de escalón y cada 5 seguidas; en el medio cambia el número.
  const pulse = `${level}-${Math.floor(streak / 5)}`;
  const bonus = shown?.correct ? streakBonus(shown.streak) : 0;

  // Las de audio se escuchan solas al aparecer (se pueden repetir con el parlante).
  useEffect(() => {
    if (kind === 'audio') speak(question.prompt);
  }, [kind, question.index, question.prompt]);
  useEffect(() => () => stopSpeaking(), []);

  return (
    <View style={styles.wrap}>
      <Card style={[styles.prompt, level > 0 && { borderColor: STREAK_COLORS[level] }]}>
        {level > 0 ? (
          <Animated.View
            key={pulse}
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
            <View style={styles.speakers}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Escuchar otra vez"
                onPress={() => speak(question.prompt)}
                style={({ pressed }) => [styles.speaker, pressed && styles.pressed]}
              >
                <Volume2 color={colors.onPrimary} size={40} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Escuchar despacio"
                onPress={() => speak(question.prompt, { slow: true })}
                hitSlop={8}
                style={({ pressed }) => [styles.slow, pressed && styles.pressed]}
              >
                <Turtle color={colors.info} size={22} />
              </Pressable>
            </View>
            {/* La palabra se muestra recién al responder, para aprender cómo se escribe. */}
            <View style={!shown && styles.hidden}>
              <TargetText variant="heading" align="center">
                {question.prompt}
              </TargetText>
            </View>
          </View>
        ) : kind === 'image' && question.emoji ? (
          <Text style={styles.emoji} accessibilityLabel={`Imagen: ${question.prompt}`}>
            {question.emoji}
          </Text>
        ) : (
          <TargetText variant="display" align="center" accessibilityRole="header">
            {question.prompt}
          </TargetText>
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
                <TargetText
                  variant="heading"
                  align="center"
                  color={isCorrect || isWrongChoice ? 'textStrong' : 'text'}
                >
                  {option}
                </TargetText>
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
  speakers: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  slow: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: MIN_TOUCH / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
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
