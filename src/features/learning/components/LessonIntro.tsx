import { BookOpen } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Button, Card, Screen, Text, colors, radii, spacing } from '@/design-system';

import type { LessonIntro as Intro } from '../api';
import { TargetText, useSessionLanguage } from '../readings';
import { SpeakButton } from './SpeakButton';

interface Props {
  title: string;
  objective: string;
  intro: Intro;
  onStart: () => void;
  onClose: () => void;
}

/** Antes del primer ejercicio: qué vas a aprender, una explicación breve y ejemplos con audio. */
export function LessonIntro({ title, objective, intro, onStart, onClose }: Props) {
  const { language, readings, showReadings, setShowReadings } = useSessionLanguage();
  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <>
          <Button label="Empezar" size="lg" onPress={onStart} />
          <Button label="Volver" variant="ghost" onPress={onClose} />
        </>
      }
    >
      <Animated.View entering={FadeInUp.duration(300)} style={styles.hero}>
        <View style={styles.icon}>
          <BookOpen color={colors.primaryBright} size={28} />
        </View>
        <Text variant="overline" color="primarySoft">
          {language.name.toUpperCase()}
        </Text>
        <Text variant="title" align="center">
          {title}
        </Text>
        <Text color="textMuted" align="center">
          {objective}
        </Text>
      </Animated.View>

      <Card style={styles.gap}>
        <Text variant="overline">EN POCAS PALABRAS</Text>
        <Text color="text">{intro.explanation}</Text>
      </Card>

      <Card style={styles.gap}>
        <Text variant="overline">EJEMPLOS</Text>
        {intro.examples.map((e) => (
          <View key={e.target} style={styles.example}>
            <SpeakButton text={e.target} />
            <View style={styles.flex}>
              <TargetText variant="bodyStrong" color="textStrong">
                {e.target}
              </TargetText>
              <Text variant="caption">
                {e.base}
                {e.note ? ` · ${e.note}` : ''}
              </Text>
            </View>
          </View>
        ))}
      </Card>

      {readings ? (
        <Button
          label={showReadings ? 'Ocultar pinyin' : 'Mostrar pinyin'}
          variant="ghost"
          onPress={() => setShowReadings(!showReadings)}
        />
      ) : null}

      {language.status === 'beta' ? (
        <Text variant="caption" align="center">
          Curso en preparación: el contenido todavía no está revisado por hablantes nativos.
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xl },
  icon: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHighlight,
  },
  gap: { gap: spacing.md },
  example: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
});
