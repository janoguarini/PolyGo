import { Pause, Turtle, Volume2 } from 'lucide-react-native';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import type {
  ContextStimulus as Stimulus,
  ListeningStimulus,
  ReadingStimulus,
  StimulusVisual,
} from '@shared/exercises';

import { MIN_TOUCH, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import { TargetText, useSessionLanguage } from '../readings';
import { speakDialogue } from '../speech';
import { stimulusImageSource } from '../stimulusImages';
import { stimulusStrings } from '../strings';

/**
 * Último estímulo de audio que sonó solo. Las preguntas de un mismo audio comparten el estímulo: suena
 * solo al llegar a la primera; en las siguientes se repite con el botón.
 */
let lastAutoplayed: string | null = null;

/** Sólo para pruebas. */
export function resetStimulusAutoplay() {
  lastAutoplayed = null;
}

/**
 * Estímulo de comprensión en contexto (fase C): el texto para leer o el mensaje para escuchar, bien
 * separado de la pregunta. En escucha, la transcripción se muestra recién después de responder
 * (`answered`): antes invalidaría la evaluación.
 */
export function ContextStimulus({
  stimulus,
  question,
  answered,
}: {
  stimulus: Stimulus;
  question: string;
  answered: boolean;
}) {
  const styles = useStyles();
  const t = useStrings(stimulusStrings);
  return (
    <View style={styles.wrapper}>
      <Text variant="caption">{stimulus.setting}</Text>
      {stimulus.kind === 'reading' ? (
        <ReadingCard stimulus={stimulus} answered={answered} />
      ) : (
        <ListeningCard stimulus={stimulus} answered={answered} />
      )}
      <View style={styles.question} accessibilityRole="header">
        <Text variant="overline" color="primarySoft">
          {t.question}
        </Text>
        <Text variant="heading" color="textStrong">
          {question}
        </Text>
      </View>
    </View>
  );
}

function ReadingCard({ stimulus, answered }: { stimulus: ReadingStimulus; answered: boolean }) {
  const styles = useStyles();
  const t = useStrings(stimulusStrings);
  return (
    <View style={styles.card} accessibilityLabel={t.toRead(t.documents[stimulus.document])}>
      <Text variant="overline" color="info">
        {t.documents[stimulus.document]}
      </Text>
      {stimulus.from || stimulus.to ? (
        <Text variant="caption">
          {[stimulus.from && t.from(stimulus.from), stimulus.to && t.to(stimulus.to)]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      ) : null}
      {stimulus.title ? (
        <TargetText variant="heading" color="textStrong">
          {stimulus.title}
        </TargetText>
      ) : null}
      <StimulusVisualSlot visual={stimulus.visual} answered={answered} at="with_stimulus" />
      {stimulus.lines.map((line, i) => (
        <TargetText key={i} variant="body" color="textStrong">
          {line}
        </TargetText>
      ))}
      <StimulusVisualSlot visual={stimulus.visual} answered={answered} at="after_answer" />
    </View>
  );
}

type AudioState =
  | { status: 'idle'; heard: boolean }
  | { status: 'playing'; line: number; slow: boolean }
  | { status: 'error' };

function ListeningCard({ stimulus, answered }: { stimulus: ListeningStimulus; answered: boolean }) {
  const styles = useStyles();
  const t = useStrings(stimulusStrings);
  const { language } = useSessionLanguage();
  const [audio, setAudio] = useState<AudioState>({ status: 'idle', heard: false });
  /** Lo que de verdad tiene el dispositivo (se sabe al empezar a reproducir). */
  const [voices, setVoices] = useState<{ available: boolean; distinct: boolean } | null>(null);
  const cancel = useRef<(() => void) | null>(null);
  const voiceOf = new Map(stimulus.speakers.map((s) => [s.name, s.voice]));

  /** Arranca el motor; el estado cambia sólo desde sus callbacks. */
  const begin = (slow: boolean) => {
    cancel.current?.();
    cancel.current = speakDialogue(
      stimulus.lines.map((l) => ({ text: l.text, voice: voiceOf.get(l.speaker) ?? 'a' })),
      stimulus.rate,
      {
        slow,
        onLine: (line) => setAudio({ status: 'playing', line, slow }),
        onDone: () => setAudio({ status: 'idle', heard: true }),
        onError: () => setAudio({ status: 'error' }),
        onVoices: setVoices,
      },
    );
  };

  /** Desde un botón: muestra «reproduciendo» enseguida, aunque el motor tarde en cargar la voz. */
  const play = (slow: boolean) => {
    setAudio({ status: 'playing', line: 0, slow });
    begin(slow);
  };

  const stop = () => {
    cancel.current?.();
    cancel.current = null;
    setAudio({ status: 'idle', heard: true });
  };

  // Suena solo al aparecer el estímulo por primera vez; al irse la pantalla, se corta.
  useEffect(() => {
    if (lastAutoplayed !== stimulus.id) {
      lastAutoplayed = stimulus.id;
      begin(false);
    }
    return () => cancel.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stimulus.id]);

  const playing = audio.status === 'playing';
  const names = stimulus.speakers.map((s) => s.name);

  return (
    <View style={styles.card}>
      <Text variant="overline" color="info">
        {stimulus.speakers.length > 1 ? t.conversation : t.voiceMessage}
      </Text>
      <StimulusVisualSlot visual={stimulus.visual} answered={answered} at="with_stimulus" />
      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={playing ? t.stopAudio : t.playAudio}
          onPress={() => (playing ? stop() : play(false))}
          hitSlop={8}
          style={({ pressed }) => [styles.play, pressed && styles.pressed]}
        >
          {playing ? (
            <Pause color={colors.info} size={36} />
          ) : (
            <Volume2 color={colors.info} size={36} />
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.playSlow}
          onPress={() => play(true)}
          hitSlop={8}
          style={({ pressed }) => [styles.slow, pressed && styles.pressed]}
        >
          <Turtle color={colors.info} size={22} />
        </Pressable>
        <View style={styles.flex} accessibilityLiveRegion="polite">
          <Text variant="caption" color={audio.status === 'error' ? 'danger' : 'textMuted'}>
            {audio.status === 'error'
              ? t.audioError
              : playing
                ? t.playing(audio.slow, audio.line + 1, stimulus.lines.length)
                : audio.status === 'idle' && audio.heard
                  ? t.listenAgain
                  : t.tapToListen}
          </Text>
        </View>
      </View>
      <Text variant="caption">
        {t.speakers(names)} · {t.synthesizedVoice}
      </Text>
      {voices && !voices.available ? (
        <Text variant="caption" color="gold">
          {t.noVoice(language)}
        </Text>
      ) : voices && names.length > 1 && !voices.distinct ? (
        <Text variant="caption" color="gold">
          {t.oneVoice(language)}
        </Text>
      ) : null}
      {answered ? (
        <View style={styles.transcript} accessibilityLabel={t.transcriptLabel}>
          <Text variant="overline">{t.transcript}</Text>
          {stimulus.lines.map((l, i) => (
            <Text key={i} variant="body" color="textStrong">
              <Text variant="bodyStrong" color="primarySoft">
                {l.speaker}:{' '}
              </Text>
              {l.text}
            </Text>
          ))}
        </View>
      ) : null}
      <StimulusVisualSlot visual={stimulus.visual} answered={answered} at="after_answer" />
    </View>
  );
}

/**
 * Imagen de apoyo del estímulo (fase C.9.1) en su momento: `with_stimulus` junto al texto o el
 * audio; `after_answer` recién después de responder. Sin imagen, sin recurso local con ese hash o si
 * no carga, no ocupa lugar: el estímulo se ve como siempre.
 */
function StimulusVisualSlot({
  visual,
  answered,
  at,
}: {
  visual: StimulusVisual | undefined;
  answered: boolean;
  at: StimulusVisual['display'];
}) {
  if (!visual || visual.display !== at || (at === 'after_answer' && !answered)) return null;
  const image = <StimulusImage key={`${visual.id}:${visual.sha256}`} visual={visual} />;
  if (at === 'with_stimulus') return image;
  return <AfterAnswerVisual visual={visual}>{image}</AfterAnswerVisual>;
}

function AfterAnswerVisual({ visual, children }: { visual: StimulusVisual; children: ReactNode }) {
  const styles = useStyles();
  // Encabezado de una imagen que aparece después de responder (como la transcripción).
  const t = useStrings(stimulusStrings);
  // Sin recurso, tampoco el encabezado.
  if (!stimulusImageSource(visual)) return null;
  return (
    <View style={styles.transcript}>
      <Text variant="overline">{t.visuals[visual.kind]}</Text>
      {children}
    </View>
  );
}

function StimulusImage({ visual }: { visual: StimulusVisual }) {
  const styles = useStyles();
  const [failed, setFailed] = useState(false);
  const source = stimulusImageSource(visual);
  if (!source || failed) return null;
  return (
    <Image
      testID={`stimulus-image-${visual.id}`}
      source={source}
      accessible
      accessibilityRole="image"
      accessibilityLabel={visual.alt}
      resizeMode="contain"
      onError={() => setFailed(true)}
      style={[styles.image, { aspectRatio: visual.width / visual.height }]}
    />
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    wrapper: { gap: spacing.md },
    flex: { flex: 1 },
    card: {
      gap: spacing.sm,
      padding: spacing.lg,
      borderRadius: radii.lg,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
    },
    question: {
      gap: spacing.xs,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    play: {
      width: 72,
      height: 72,
      borderRadius: radii.xl,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    slow: {
      width: MIN_TOUCH,
      height: MIN_TOUCH,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    pressed: { opacity: 0.8, transform: [{ scale: 0.96 }] },
    image: {
      width: '100%',
      borderRadius: radii.md,
      backgroundColor: colors.surface,
    },
    transcript: {
      gap: spacing.xs,
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  }),
);
