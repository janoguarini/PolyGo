import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Exercise } from '@shared/exercises';

import { Text, colors, radii, spacing } from '@/design-system';

import { speakEnglish } from '../speech';
import { SpeakButton } from './SpeakButton';

/** Parte superior del ejercicio: enunciado y estímulo según el tipo. */
export function ExercisePrompt({ exercise }: { exercise: Exercise }) {
  const p = exercise.payload;

  useEffect(() => {
    if (p.type === 'listen_choice') speakEnglish(p.audioText);
  }, [exercise.id, p]);

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
          <Text variant="title">{p.word}</Text>
        </View>
      ) : null}

      {p.type === 'translate_write' ? <Bubble text={p.source} /> : null}

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
          <SpeakButton text={p.audioText} size="lg" />
          <Text variant="caption">Tocá para volver a escuchar</Text>
        </View>
      ) : null}

      {p.type === 'short_answer' ? (
        <View style={styles.gap}>
          <View style={styles.row}>
            <SpeakButton text={p.question} />
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
      <Text variant="bodyStrong" color="textStrong">
        {text}
      </Text>
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
  bubble: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
