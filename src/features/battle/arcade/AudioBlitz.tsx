import { Volume2 } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { ARCADE, type ArcadeAnswer, type ChallengeView } from '@shared/arcade';

import { TargetText } from '@/features/learning/readings';
import { speak, stopSpeaking } from '@/features/learning/speech';
import { useStrings } from '@/i18n';

import { arcadeStrings } from './strings';
import { ARCADE_TOUCH, arcade, arcadeRadii, arcadeText } from './theme';

type View_ = Extract<ChallengeView, { kind: 'audio' }>;

/** Si la voz no empezó en este tiempo, se muestra la palabra: el audio nunca frena la partida. */
export const AUDIO_FALLBACK_MS = 1_500;

/**
 * Audio Blitz: se escucha la palabra (voz del dispositivo en el idioma del curso) y se elige qué
 * significa. Se puede repetir dos veces. Sin audio (motor ausente, error o demora), se lee.
 */
export function AudioBlitz({
  view,
  onAnswer,
}: {
  view: View_;
  onAnswer: (answer: ArcadeAnswer) => void;
}) {
  const t = useStrings(arcadeStrings);
  const reduceMotion = useReducedMotion();
  const [replays, setReplays] = useState<number>(ARCADE.audioReplays);
  const [fallback, setFallback] = useState(false);
  const started = useRef(false);
  const answered = useRef(false);

  useEffect(() => {
    started.current = false;
    let alive = true;
    const showText = () => {
      if (alive) setFallback(true);
    };
    speak(view.prompt, {
      onStart: () => {
        started.current = true;
      },
      onError: showText,
    });
    const timer = setTimeout(() => {
      if (!started.current) showText();
    }, AUDIO_FALLBACK_MS);
    return () => {
      alive = false;
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [view.index, view.prompt]);

  const replay = () => {
    if (replays <= 0) return;
    setReplays(replays - 1);
    speak(view.prompt, { onError: () => setFallback(true) });
  };

  const choose = (option: number) => {
    if (answered.current) return;
    answered.current = true;
    onAnswer({ kind: 'audio', option });
  };

  return (
    <View style={styles.wrap}>
      <Text style={arcadeText.label}>{t.audioHint}</Text>
      <View style={styles.speakerArea}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.replayA11y}
          accessibilityState={{ disabled: replays <= 0 }}
          onPress={replay}
          disabled={replays <= 0}
          style={({ pressed }) => [
            styles.speaker,
            replays <= 0 && styles.spent,
            pressed && styles.pressed,
          ]}
        >
          <Volume2 color={arcade.text} size={48} />
        </Pressable>
        <Text style={styles.replays}>{t.replay(replays)}</Text>
        {fallback ? (
          <Animated.View
            entering={reduceMotion ? undefined : FadeIn.duration(150)}
            style={styles.fallback}
          >
            <Text style={styles.fallbackLabel}>{t.noAudio}</Text>
            <TargetText style={arcadeText.word}>{view.prompt}</TargetText>
          </Animated.View>
        ) : null}
      </View>
      <View style={styles.grid}>
        {view.options.map((option, i) => (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={option}
            onPress={() => choose(i)}
            style={({ pressed }) => [styles.option, pressed && styles.pressed]}
          >
            <Text style={arcadeText.option} numberOfLines={2}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 16, justifyContent: 'center' },
  speakerArea: { alignItems: 'center', gap: 8, minHeight: 190, justifyContent: 'center' },
  speaker: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: arcade.violet,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: arcade.violetGlow,
    shadowOpacity: 0.7,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  spent: { backgroundColor: arcade.cardRaised, shadowOpacity: 0 },
  replays: { color: arcade.muted, fontSize: 13, fontWeight: '700' },
  fallback: { alignItems: 'center', gap: 4 },
  fallbackLabel: { color: arcade.muted, fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  option: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: ARCADE_TOUCH + 16,
    borderRadius: arcadeRadii.block,
    backgroundColor: arcade.card,
    borderWidth: 2,
    borderColor: arcade.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  pressed: { transform: [{ scale: 0.96 }], borderColor: arcade.violetGlow },
});
