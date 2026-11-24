import { router } from 'expo-router';
import { PenLine } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { Button, Card, Text, colors, spacing, useTheme } from '@/design-system';
import { useStrings } from '@/i18n';

import { writingTasksForLesson } from '../../../../content/writing';
import { writingStrings } from '../strings';

/**
 * Práctica de escritura opcional al terminar una lección (docs/A1_EN_CLOSURE.md §6, y A2 en
 * docs/A2_EN_COMPLETION.md §5). Sólo aparece en
 * las lecciones que tienen una tarea; no bloquea nada ni cuenta para el progreso.
 */
export function WritingPracticeCard({ lessonId }: { lessonId: string }) {
  useTheme();
  const t = useStrings(writingStrings);
  const tasks = writingTasksForLesson(lessonId);
  if (!tasks.length) return null;
  return (
    <Card style={styles.gap} accessibilityLabel={t.practiceLabel}>
      <Text variant="overline" color="primarySoft">
        {t.practiceOverline}
      </Text>
      {tasks.map((task) => (
        <Button
          key={task.id}
          label={task.title}
          variant="secondary"
          icon={<PenLine color={colors.text} size={18} />}
          onPress={() => router.push({ pathname: '/writing/[id]', params: { id: task.id } })}
        />
      ))}
      <Text variant="caption">{t.practiceOptional}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({ gap: { gap: spacing.sm } });
