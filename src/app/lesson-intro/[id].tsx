import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, ErrorState, LoadingState, Screen, Text, spacing } from '@/design-system';
import { useLessonContent } from '@/features/learning/hooks';
import { TargetText } from '@/features/learning/readings';
import { SessionLanguageProvider } from '@/features/learning/SessionLanguageProvider';
import { useStrings } from '@/i18n';
import { lessonIntroStrings } from '@/i18n/screens/lesson';

/**
 * Explicación de una lección, sólo lectura (AL17: «ofrecer volver a la explicación de la lección» a
 * las unidades persistentes). No inicia la lección ni gasta energía: muestra lessons.intro y el cierre.
 */
export default function LessonIntroScreenWithLanguage() {
  return (
    <SessionLanguageProvider>
      <LessonIntroScreen />
    </SessionLanguageProvider>
  );
}

function LessonIntroScreen() {
  const t = useStrings(lessonIntroStrings);
  const { id } = useLocalSearchParams<{ id: string }>();
  const content = useLessonContent(id);

  if (content.isPending) return <LoadingState label={t.loading} />;
  if (content.isError || !content.data) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <ErrorState message={t.loadError} onRetry={() => void content.refetch()} />
      </Screen>
    );
  }
  const { lesson } = content.data;

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={<Button label={t.back} variant="secondary" onPress={() => router.back()} />}
    >
      <View style={styles.gap}>
        <Text variant="overline">{t.overline}</Text>
        <Text variant="title">{lesson.title}</Text>
        <Text color="textMuted">{lesson.objective}</Text>
      </View>
      {lesson.intro ? (
        <Card style={styles.gap}>
          <Text color="text">{lesson.intro.explanation}</Text>
          {lesson.intro.examples.map((e) => (
            <View key={`${e.target}|${e.base}`} style={styles.example}>
              <TargetText variant="bodyStrong" color="textStrong">
                {e.target}
              </TargetText>
              <Text color="textMuted">{e.base}</Text>
              {e.note ? <Text variant="caption">{e.note}</Text> : null}
            </View>
          ))}
        </Card>
      ) : (
        <Card>
          <Text color="textMuted">{t.noIntro}</Text>
        </Card>
      )}
      {lesson.takeaways.length > 0 ? (
        <Card style={styles.gap}>
          <Text variant="overline">{t.learned}</Text>
          {lesson.takeaways.map((takeaway) => (
            <Text key={takeaway}>• {takeaway}</Text>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
  example: { gap: spacing.xxs },
});
