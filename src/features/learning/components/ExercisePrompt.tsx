import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Exercise } from '@shared/exercises';

import { Text, colors, radii, spacing } from '@/design-system';

import { TargetText } from '../readings';
import { speak } from '../speech';
import { SpeakButton } from './SpeakButton';

/** Parte superior del ejercicio: enunciado y estímulo según el tipo. */
export function ExercisePrompt({ exercise }: { exercise: Exercise }) {
  const p = exercise.payload;

  // Si el ejercicio tiene algo para escuchar, suena una vez al aparecer (después, con el botón).
  const autoplay =
    p.type === 'listen_choice'
      ? p.audioText
      : p.type === 'translation_choice'
        ? p.word
        : p.type === 'short_answer'
          ? p.question
          : null;
  useEffect(() => {
    if (autoplay) speak(autoplay);
  }, [exercise.id, autoplay]);

  return (
    <View style={styles.wrapper}>
      <Text variant="heading">{exercise.prompt}</Text>

      {p.type === 'image_choice' ? (
        <View style={styles.center}>
          <Text style={styles.emoji} accessibilityLabel="Imagen del ejercicio">
            {p.emoji}
          </Text>
        </View>
      ) : null}

      {p.type === 'translation_choice' ? (
        <View style={styles.row}>
          <SpeakButton text={p.word} />
          <TargetText variant="title">{p.word}</TargetText>
        </View>
      ) : null}

      {p.type === 'translate_write' ? (
        <View style={styles.sourceCard}>
          <Text variant="overline" color="primarySoft">
            EN ESPAÑOL
          </Text>
          <Text variant="title" color="textStrong">
            {p.source}
          </Text>
        </View>
      ) : null}

      {p.type === 'complete_word' ? (
        <View style={styles.center}>
          <Text
            variant="display"
            style={styles.masked}
            accessibilityLabel={`Palabra incompleta: ${p.masked.replace(/_/g, ' guion bajo ')}`}
          >
            {p.masked.split('').join(' ')}
          </Text>
          <Text color="textMuted">Pista: {p.hint}</Text>
        </View>
      ) : null}

      {p.type === 'fill_blank' ? (
        <View style={styles.gap}>
          <Bubble text={p.sentence} />
          <Text variant="caption">{p.translation}</Text>
        </View>
      ) : null}

      {p.type === 'order_words' ? <Bubble text={p.translation} /> : null}

      {p.type === 'listen_choice' ? (
        <View style={styles.center}>
          <View style={styles.row}>
            <SpeakButton text={p.audioText} size="lg" />
            <SpeakButton text={p.audioText} slow />
          </View>
          <Text variant="caption">Tocá para volver a escuchar · 🐢 más despacio</Text>
        </View>
      ) : null}

      {p.type === 'short_answer' ? (
        <View style={styles.gap}>
          <View style={styles.row}>
            <View style={styles.gap}>
              <SpeakButton text={p.question} />
              <SpeakButton text={p.question} slow />
            </View>
            <View style={styles.flex}>
              <Bubble text={p.question} />
            </View>
          </View>
          <Text variant="caption">{p.translation}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Bubble({ text }: { text: string }) {
  return (
    <View style={styles.bubble}>
      <TargetText variant="bodyStrong" color="textStrong">
        {text}
      </TargetText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.lg },
  center: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  gap: { gap: spacing.sm },
  emoji: { fontSize: 96, lineHeight: 116 },
  masked: { letterSpacing: 4 },
  sourceCard: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubble: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
