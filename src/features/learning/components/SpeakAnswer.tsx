import * as Haptics from 'expo-haptics';
import { Keyboard as KeyboardIcon, Mic, MicOff, Square } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { checkAnswer } from '@shared/answers';
import type { Exercise, UserAnswer } from '@shared/exercises';

import { Button, Text, colors, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';

import { TargetText } from '../readings';
import { stopSpeaking } from '../speech';
import { bestTranscript, speechModule } from '../speechRecognition';
import { PAUSE_MINUTES } from '../speakingPause';
import { speakAnswerStrings } from '../strings';

type Phase =
  | { kind: 'idle' }
  | { kind: 'listening'; interim: string }
  | { kind: 'heard'; transcript: string }
  | { kind: 'notHeard' }
  | { kind: 'blocked'; reason: 'permission' | 'unavailable' };

interface Props {
  exercise: Exercise;
  /** Locale del reconocedor (speechLocale del curso: en-US, it-IT…). */
  locale: string;
  disabled?: boolean;
  /** La transcripción elegida, como respuesta escrita (la corrige la regla de translate_write). */
  onSubmit: (answer: UserAnswer, assists: Record<string, number | boolean>) => void;
  /** «Usar el teclado»: este ejercicio se responde escrito. */
  onUseKeyboard: () => void;
  /** «Ahora no puedo hablar»: pausa los ejercicios de hablar PAUSE_MINUTES minutos. */
  onCantSpeak: () => void;
}

/**
 * Respuesta hablada de un ejercicio de traducir: la persona toca el micrófono y dice la frase. El
 * reconocedor del teléfono transcribe; si alguna transcripción es correcta se comprueba sola, si no se
 * muestra lo que se escuchó para grabar de nuevo o comprobar igual.
 */
export function SpeakAnswer({
  exercise,
  locale,
  disabled,
  onSubmit,
  onUseKeyboard,
  onCantSpeak,
}: Props) {
  const styles = useStyles();
  const t = useStrings(speakAnswerStrings);
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const recordings = useRef(0);
  const submitted = useRef(false);
  const level = useSharedValue(0);
  const accepted = [exercise.answer, ...exercise.acceptedAnswers];
  // Siempre el manejador del último render (los eventos se suscriben una sola vez).
  const onSubmitRef = useRef(onSubmit);
  useEffect(() => {
    onSubmitRef.current = onSubmit;
  });

  const submit = (transcript: string) => {
    if (submitted.current) return;
    submitted.current = true;
    onSubmitRef.current(
      { kind: 'text', value: transcript },
      { spoken: true, speech_attempts: recordings.current },
    );
  };

  // Eventos del reconocedor (mientras el ejercicio está en pantalla).
  useEffect(() => {
    const m = speechModule();
    if (!m) return;
    const subs = [
      m.addListener('result', (e) => {
        const alternatives = e.results.map((r) => r.transcript).filter(Boolean);
        if (!e.isFinal) {
          setPhase({ kind: 'listening', interim: alternatives[0] ?? '' });
          return;
        }
        const transcript = bestTranscript(alternatives, accepted);
        if (!transcript) {
          setPhase({ kind: 'notHeard' });
          return;
        }
        const correct = checkAnswer(exercise, { kind: 'text', value: transcript }).correct;
        if (correct) submit(transcript);
        else setPhase({ kind: 'heard', transcript });
      }),
      m.addListener('nomatch', () => setPhase({ kind: 'notHeard' })),
      m.addListener('error', (e) => {
        if (e.error === 'aborted') return;
        if (e.error === 'not-allowed') setPhase({ kind: 'blocked', reason: 'permission' });
        else if (
          e.error === 'service-not-allowed' ||
          e.error === 'language-not-supported' ||
          e.error === 'network' ||
          e.error === 'audio-capture'
        ) {
          setPhase({ kind: 'blocked', reason: 'unavailable' });
        } else setPhase({ kind: 'notHeard' });
      }),
      m.addListener('end', () => {
        level.value = withSpring(0);
        setPhase((p) => (p.kind === 'listening' ? { kind: 'notHeard' } : p));
      }),
      m.addListener('volumechange', (e) => {
        // -2…10; por debajo de 0 es silencio.
        level.value = withSpring(Math.max(0, Math.min(1, e.value / 10)), { damping: 12 });
      }),
    ];
    return () => {
      subs.forEach((s) => s.remove());
      try {
        m.abort();
      } catch {
        // Ya estaba detenido.
      }
    };
    // El ejercicio no cambia mientras el componente vive (SessionPlayer le pone key por intento).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    const m = speechModule();
    if (!m || disabled) return;
    stopSpeaking();
    try {
      const permission = await m.requestPermissionsAsync();
      if (!permission.granted) {
        setPhase({ kind: 'blocked', reason: 'permission' });
        return;
      }
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      recordings.current += 1;
      setPhase({ kind: 'listening', interim: '' });
      m.start({
        lang: locale,
        interimResults: true,
        maxAlternatives: 5,
        continuous: false,
        // Ayuda al reconocedor con las palabras esperadas (no cambia la corrección).
        contextualStrings: accepted.slice(0, 5),
        iosTaskHint: 'confirmation',
        volumeChangeEventOptions: { enabled: !reduceMotion, intervalMillis: 120 },
      });
    } catch {
      setPhase({ kind: 'blocked', reason: 'unavailable' });
    }
  };

  const stop = () => {
    try {
      speechModule()?.stop();
    } catch {
      setPhase({ kind: 'notHeard' });
    }
  };

  const listening = phase.kind === 'listening';
  const ring = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + level.value * 0.45 }],
    opacity: 0.25 + level.value * 0.5,
  }));

  if (phase.kind === 'blocked') {
    return (
      <View style={styles.wrapper}>
        <View style={styles.blocked}>
          <MicOff color={colors.textMuted} size={28} />
          <Text align="center">
            {phase.reason === 'permission' ? t.noPermission : t.unavailable}
          </Text>
        </View>
        <Button
          label={t.useKeyboard}
          icon={<KeyboardIcon color={colors.textStrong} size={18} />}
          onPress={onUseKeyboard}
        />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.micArea}>
        <Animated.View style={[styles.ring, ring]} pointerEvents="none" />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={listening ? t.stopA11y : t.micA11y}
          disabled={disabled}
          onPress={listening ? stop : () => void start()}
          style={({ pressed }) => [
            styles.mic,
            listening && styles.micOn,
            pressed && styles.pressed,
          ]}
        >
          {listening ? (
            <Square color="#FFFFFF" fill="#FFFFFF" size={30} />
          ) : (
            <Mic color="#FFFFFF" size={40} />
          )}
        </Pressable>
      </View>

      <View style={styles.status} accessibilityLiveRegion="polite">
        {phase.kind === 'listening' ? (
          phase.interim ? (
            <TargetText variant="title" align="center" color="textStrong">
              {phase.interim}
            </TargetText>
          ) : (
            <Text variant="bodyStrong" color="primarySoft" align="center">
              {t.listening}
            </Text>
          )
        ) : phase.kind === 'heard' ? (
          <>
            <Text variant="overline" align="center">
              {t.heard}
            </Text>
            <TargetText variant="title" align="center" color="textStrong">
              {phase.transcript}
            </TargetText>
          </>
        ) : (
          <Text color={phase.kind === 'notHeard' ? 'streak' : 'textMuted'} align="center">
            {phase.kind === 'notHeard' ? t.notHeard : t.tapToSpeak}
          </Text>
        )}
      </View>

      {phase.kind === 'heard' ? (
        <View style={styles.actions}>
          <Button label={t.check} onPress={() => submit(phase.transcript)} disabled={disabled} />
          <Button label={t.tryAgain} variant="secondary" onPress={() => void start()} />
        </View>
      ) : null}

      <View style={styles.links}>
        <Pressable accessibilityRole="button" onPress={onUseKeyboard} hitSlop={8}>
          <Text variant="bodyStrong" color="primarySoft">
            {t.useKeyboard}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityHint={t.cantSpeakHint(PAUSE_MINUTES)}
          onPress={() => {
            stop();
            onCantSpeak();
          }}
          hitSlop={8}
        >
          <Text variant="bodyStrong" color="textMuted">
            {t.cantSpeak}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const MIC = 96;

const useStyles = themedStyles(() =>
  StyleSheet.create({
    wrapper: { gap: spacing.lg, flexGrow: 1, justifyContent: 'flex-end' },
    micArea: { alignItems: 'center', justifyContent: 'center', height: MIC * 1.6 },
    ring: {
      position: 'absolute',
      width: MIC * 1.3,
      height: MIC * 1.3,
      borderRadius: (MIC * 1.3) / 2,
      backgroundColor: colors.primaryBright,
    },
    mic: {
      width: MIC,
      height: MIC,
      borderRadius: MIC / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    micOn: { backgroundColor: colors.dangerStrong },
    pressed: { opacity: 0.85, transform: [{ scale: 0.96 }] },
    status: { minHeight: 64, justifyContent: 'center', gap: spacing.xs },
    actions: { gap: spacing.sm },
    links: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: spacing.md,
      paddingTop: spacing.sm,
    },
    blocked: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  }),
);
