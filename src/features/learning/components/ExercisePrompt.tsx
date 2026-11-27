import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Exercise } from '@shared/exercises';

import { Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import { TargetText, useSessionLanguage } from '../readings';
import { speak, spokenText } from '../speech';
import { promptStrings, speakAnswerStrings } from '../strings';
import { ContextStimulus } from './ContextStimulus';
import { SpeakButton } from './SpeakButton';

/**
 * Parte superior del ejercicio: enunciado y estímulo según el tipo. `answered`: ya se respondió
 * (feedback); en comprensión auditiva habilita la transcripción.
 */
export function ExercisePrompt({
  exercise,
  answered = false,
  spoken = false,
}: {
  exercise: Exercise;
  answered?: boolean;
  /** Se responde hablando: el título pasa a «Dilo en <idioma>». */
  spoken?: boolean;
}) {
  const styles = useStyles();
  const t = useStrings(promptStrings);
  const speakT = useStrings(speakAnswerStrings);
  // Idioma de apoyo del curso: el de la frase a traducir (español salvo en el curso de español).
  const { language } = useSessionLanguage();
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
      <Text variant="heading">{spoken ? speakT.sayIn(language.code) : exercise.prompt}</Text>

      {p.type === 'image_choice' ? (
        <View style={styles.center}>
          <Text style={styles.emoji} accessibilityLabel={t.image}>
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
            {t.inSupport(language.support?.code ?? 'es')}
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
            accessibilityLabel={t.maskedLabel(p.masked)}
          >
            {p.masked.split('').join(' ')}
          </Text>
          <Text color="textMuted">{t.hint(p.hint)}</Text>
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
          <Text variant="caption">{t.listenAgain}</Text>
        </View>
      ) : null}

      {p.type === 'context_choice' ? (
        // El audio de comprensión lo maneja ContextStimulus (diálogo con dos voces), no el autoplay.
        <ContextStimulus stimulus={p.stimulus} question={p.question} answered={answered} />
      ) : null}

      {p.type === 'short_answer' ? (
        <View style={styles.gap}>
          <View style={styles.row}>
            {/* Una escena sólo con emojis (PW) no tiene nada para escuchar. */}
            {spokenText(p.question) ? (
              <View style={styles.gap}>
                <SpeakButton text={p.question} />
                <SpeakButton text={p.question} slow />
              </View>
            ) : null}
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
  const styles = useStyles();
  return (
    <View style={styles.bubble}>
      <TargetText variant="bodyStrong" color="textStrong">
        {text}
      </TargetText>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
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
  }),
);
